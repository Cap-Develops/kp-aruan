/* Конвейер чтения анализа воды: файл -> текст -> показатели.
 *
 * Маршрут зависит от того, что пришло (замеры сентября 2026, см. plans/2026-09-21):
 *   Word                      - текст напрямую;
 *   PDF с текстовым слоем     - слой по координатам слов + проход Tesseract;
 *   PDF-скан, крупная картинка- Tesseract 300/psm4 + Tesseract 400/psm11;
 *   мелкая картинка, скриншот - Tesseract на исходном размере + на удвоенном.
 *
 * Слой по координатам важен: «как есть» строки рассыпаются, значение отрывается
 * от названия (у ВНИРО так терялось 9 показателей из 13).
 * Источники не заменяют друг друга, а складываются: где движки расходятся,
 * решает модель, сверяя значение с нормативом из того же протокола.
 */
(function (global) {
  'use strict';

  var PDFJS_URL = './vendor/pdf.min.mjs';   // динамический import требует явный относительный путь
  var WIDE_ENOUGH = 1500;        // ширина, ниже которой картинка считается скриншотом
  var FN_URL = 'https://uclzyzztoripulpcpshp.supabase.co/functions/v1/parse-water';

  var _pdfjs = null;
  async function pdfjs() {
    if (!_pdfjs) {
      _pdfjs = await import(PDFJS_URL);
      _pdfjs.GlobalWorkerOptions.workerSrc = 'vendor/pdf.worker.min.mjs';
    }
    return _pdfjs;
  }

  var _worker = null;
  async function tesseract(onProgress) {
    if (_worker) return _worker;
    onProgress && onProgress('Загружаю словарь распознавания (один раз, 8 МБ)');
    _worker = await Tesseract.createWorker('rus', 1, {
      workerPath: 'vendor/worker.min.js',
      corePath: 'vendor/tesseract-core-simd.wasm.js',
      langPath: 'vendor',          // rus.traineddata.gz лежит рядом
      gzip: true,
      logger: function () {},
    });
    return _worker;
  }

  /* ── чтение исходника ────────────────────────────────────────────────── */

  /** Строка текстового слоя собирается по координатам: иначе колонки разъезжаются. */
  function linesByCoords(items, rowTol, colGap) {
    var words = items.map(function (it) {
      var t = it.transform;
      return { x: t[4], y: t[5], w: it.width || 0, s: (it.str || '').trim() };
    }).filter(function (w) { return w.s; });

    words.sort(function (a, b) {
      var dy = Math.round(b.y / rowTol) - Math.round(a.y / rowTol);   // y снизу вверх
      return dy !== 0 ? dy : a.x - b.x;
    });

    var lines = [], cur = [], curY = null, prevEnd = null;
    words.forEach(function (w) {
      if (curY === null || Math.abs(w.y - curY) <= rowTol) {
        if (prevEnd !== null && w.x - prevEnd > colGap) cur.push('|');
        cur.push(w.s);
        if (curY === null) curY = w.y;
      } else {
        lines.push(cur.join(' '));
        cur = [w.s];
        curY = w.y;
      }
      prevEnd = w.x + w.w;
    });
    if (cur.length) lines.push(cur.join(' '));
    return lines.join('\n');
  }

  async function renderPdfPage(page, dpi) {
    var viewport = page.getViewport({ scale: dpi / 72 });
    var canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
    return canvas;
  }

  function upscale(canvas, k) {
    if (k === 1) return canvas;
    var out = document.createElement('canvas');
    out.width = canvas.width * k;
    out.height = canvas.height * k;
    var ctx = out.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(canvas, 0, 0, out.width, out.height);
    return out;
  }

  async function ocr(canvas, psm, onProgress, note) {
    var w = await tesseract(onProgress);
    onProgress && onProgress(note);
    await w.setParameters({ tessedit_pageseg_mode: String(psm) });
    var res = await w.recognize(canvas);
    return res.data.text || '';
  }

  /* ── маршруты ────────────────────────────────────────────────────────── */

  /** Титульный лист и перечень приборов только мешают: там названия показателей
   *  перечислены в списке ГОСТов, и модель тянет значения оттуда. Поэтому сначала
   *  дешёвый проход по всем страницам, а полноценно читаем только таблицу результатов. */
  var RESULT_MARKS = /(мг\/дм|мг\/л|мг-экв|°Ж|ЕМФ|ед\.?\s*рН|ед\.?\s*pH|±|не более)/gi;

  function resultScore(text) {
    var marks = (String(text).match(RESULT_MARKS) || []).length;
    var numbers = (String(text).match(/\b\d+[,.]\d+\b/g) || []).length;
    var methods = (String(text).match(/ГОСТ|ПНД\s*Ф|МУК|РД\s*\d/gi) || []).length;
    return marks + numbers - methods;   // много ссылок на методики - это титульный лист
  }

  async function fromPdf(file, onProgress) {
    var lib = await pdfjs();
    var buf = await file.arrayBuffer();
    var doc = await lib.getDocument({ data: buf }).promise;
    var total = Math.min(doc.numPages, 12);
    var previews = [], layers = [], scores = [];

    for (var i = 1; i <= total; i++) {
      onProgress('Читаю страницу ' + i + ' из ' + total);
      var page = await doc.getPage(i);
      var content = await page.getTextContent();
      var layerText = linesByCoords(content.items, 4, 12);
      layers.push(layerText);
      previews.push((await renderPdfPage(page, 110)).toDataURL('image/png'));
      scores.push(resultScore(layerText));
    }

    var hasText = layers.join('').replace(/\s/g, '').length > 200;

    // если текста нет, оцениваем страницы дешёвым распознаванием на низком разрешении
    if (!hasText && total > 1) {
      for (var q = 1; q <= total; q++) {
        onProgress('Ищу таблицу результатов: страница ' + q + ' из ' + total);
        var quick = await renderPdfPage(await doc.getPage(q), 150);
        scores[q - 1] = resultScore(await ocr(quick, 4, onProgress,
          'Ищу таблицу результатов: страница ' + q + ' из ' + total));
      }
    }

    var best = Math.max.apply(null, scores);
    var picked = [];
    for (var k = 0; k < total; k++) {
      if (total === 1 || scores[k] >= Math.max(8, best * 0.4)) picked.push(k + 1);
    }
    if (!picked.length) picked = [1];

    var passes = [];
    if (hasText) {
      passes.push(picked.map(function (n) { return layers[n - 1]; }).join('\n'));
    }

    var modes = hasText ? [[300, 4]] : [[300, 4], [400, 11]];
    for (var m = 0; m < modes.length; m++) {
      var chunk = [];
      for (var idx = 0; idx < picked.length; idx++) {
        var pg = await doc.getPage(picked[idx]);
        var canvas = await renderPdfPage(pg, modes[m][0]);
        chunk.push(await ocr(canvas, modes[m][1], onProgress,
          'Распознаю страницу ' + picked[idx] + ' (проход ' + (m + 1) + ' из ' + modes.length + ')'));
      }
      passes.push(chunk.join('\n'));
    }

    return {
      passes: passes,
      previews: previews,
      kind: (hasText ? 'PDF с текстом' : 'PDF-скан') +
            (total > 1 ? ', таблица на стр. ' + picked.join(', ') + ' из ' + total : ''),
      pages: picked,
    };
  }

  async function fromImage(file, onProgress) {
    var url = URL.createObjectURL(file);
    var img = await new Promise(function (res, rej) {
      var el = new Image();
      el.onload = function () { res(el); };
      el.onerror = rej;
      el.src = url;
    });

    var canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    canvas.getContext('2d').drawImage(img, 0, 0);
    URL.revokeObjectURL(url);

    var small = canvas.width < WIDE_ENOUGH;
    // на мелкой картинке второй проход идёт по увеличенной копии:
    // в замерах это подняло результат с 5 показателей до 15
    var passes = [
      await ocr(canvas, 4, onProgress, 'Распознаю изображение (проход 1 из 2)'),
      await ocr(small ? upscale(canvas, 2) : canvas, 11, onProgress,
        'Распознаю изображение (проход 2 из 2)'),
    ];
    return {
      passes: passes,
      previews: [canvas.toDataURL('image/png')],
      kind: small ? 'скриншот или мелкое фото' : 'изображение',
      small: small,
      width: canvas.width,
    };
  }

  async function fromDocx(file, onProgress) {
    onProgress('Читаю документ Word');
    var mammoth = global.mammoth;
    if (!mammoth) throw new Error('Не подключена библиотека чтения Word');
    var buf = await file.arrayBuffer();
    var res = await mammoth.extractRawText({ arrayBuffer: buf });
    return { passes: [res.value || ''], previews: [], kind: 'документ Word' };
  }

  /** Выбирает маршрут по типу файла. */
  async function readFile(file, onProgress) {
    var name = (file.name || '').toLowerCase();
    if (file.type === 'application/pdf' || name.endsWith('.pdf')) return fromPdf(file, onProgress);
    if (name.endsWith('.docx')) return fromDocx(file, onProgress);
    if ((file.type || '').indexOf('image/') === 0) return fromImage(file, onProgress);
    throw new Error('Не понимаю формат файла. Нужен PDF, изображение или Word (.docx)');
  }

  /* ── разбор показателей на сервере ───────────────────────────────────── */

  async function parse(passes, onProgress) {
    onProgress('Разбираю показатели');
    var sb = global.Auth && global.Auth.getSupabase ? global.Auth.getSupabase() : null;
    var session = sb ? (await sb.auth.getSession()).data.session : null;
    if (!session) throw new Error('Сессия не найдена, войдите в конструктор заново');

    var r = await fetch(FN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + session.access_token,
      },
      body: JSON.stringify({ passes: passes }),
    });
    var data = await r.json();
    if (!r.ok) throw new Error(data.error || ('Сервер ответил ' + r.status));
    return data;
  }

  /** Последние распознанные тексты держим под рукой: без них нельзя понять,
   *  почему разбор ошибся - текст модели или сам разбор. */
  async function readFileDebug(file, onProgress) {
    var res = await readFile(file, onProgress);
    global.__lastRead = res;
    return res;
  }

  global.WaterPipeline = { readFile: readFileDebug, parse: parse, WIDE_ENOUGH: WIDE_ENOUGH };
})(window);
