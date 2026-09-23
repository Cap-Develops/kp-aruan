/* Конвейер чтения анализа воды: файл -> показатели.
 *
 * С 22.09.2026 браузер ничего не распознаёт. Он только готовит картинку страницы
 * и отправляет её на сервер, где разбирает Claude. Прежний путь (tesseract.js +
 * PaddleOCR, 26 МБ моделей, полторы-две минуты на протокол) снят: замеры показали,
 * что модель по картинке читает лучше - включая рукописные бланки, кривые фото и
 * протоколы, где норматив стоит левее результата. Подробности в плане.
 *
 * Текстовый слой PDF и текст Word всё равно достаём: они уходят вместе с картинкой
 * и служат запасным вариантом, если доступ к Claude пропадёт.
 */
(function (global) {
  'use strict';

  var PDFJS_URL = './vendor/pdf.min.mjs';   // динамический import требует явный относительный путь
  var FN_URL = 'https://uclzyzztoripulpcpshp.supabase.co/functions/v1/parse-water';

  var PAGE_DPI = 150;        // на этом разрешении модель читает мелкий шрифт таблиц
  var THUMB_DPI = 60;        // эскизы для выбора нужной страницы - платим за них копейки
  var PREVIEW_DPI = 110;     // то, что видит человек слева на экране проверки
  var MAX_PAGES = 12;
  var MAX_SEND = 3;          // больше трёх страниц за раз не отправляем: дорого и незачем

  var _pdfjs = null;
  async function pdfjs() {
    if (!_pdfjs) {
      _pdfjs = await import(PDFJS_URL);
      _pdfjs.GlobalWorkerOptions.workerSrc = 'vendor/pdf.worker.min.mjs';
    }
    return _pdfjs;
  }

  /* ── подготовка изображений ──────────────────────────────────────────── */

  async function renderPdfPage(page, dpi) {
    var viewport = page.getViewport({ scale: dpi / 72 });
    var canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
    return canvas;
  }

  /** JPEG, а не PNG: страница весит втрое меньше, а текст читается так же. */
  function toJpeg(canvas, quality) {
    return canvas.toDataURL('image/jpeg', quality || 0.85);
  }

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

  /* ── маршруты по типу файла ──────────────────────────────────────────── */

  /** У кого есть текстовый слой - по нему видно, где таблица результатов:
   *  там единицы измерения и числа с запятой, а не перечень ГОСТов. */
  var RESULT_MARKS = /(мг\/дм|мг\/л|мг-экв|°Ж|ЕМФ|ед\.?\s*рН|ед\.?\s*pH|±|не более)/gi;

  function resultScore(text) {
    var marks = (String(text).match(RESULT_MARKS) || []).length;
    var numbers = (String(text).match(/\b\d+[,.]\d+\b/g) || []).length;
    var methods = (String(text).match(/ГОСТ|ПНД\s*Ф|МУК|РД\s*\d/gi) || []).length;
    return marks + numbers - methods;
  }

  async function fromPdf(file, onProgress) {
    var lib = await pdfjs();
    var doc = await lib.getDocument({ data: await file.arrayBuffer() }).promise;
    var total = Math.min(doc.numPages, MAX_PAGES);

    var previews = [], layers = [], scores = [], pages = [];
    for (var i = 1; i <= total; i++) {
      onProgress('Читаю страницу ' + i + ' из ' + total);
      var page = await doc.getPage(i);
      pages.push(page);
      var layerText = linesByCoords((await page.getTextContent()).items, 4, 12);
      layers.push(layerText);
      scores.push(resultScore(layerText));
      previews.push(toJpeg(await renderPdfPage(page, PREVIEW_DPI), 0.8));
    }

    var hasText = layers.join('').replace(/\s/g, '').length > 200;
    var picked = [], titles = [];

    if (total === 1) {
      picked = [1];
    } else if (hasText) {
      var best = Math.max.apply(null, scores);
      for (var k = 0; k < total; k++) {
        if (scores[k] >= Math.max(8, best * 0.4)) picked.push(k + 1);
      }
    } else {
      // сканы: страницу с таблицей выбирает младшая модель по эскизам -
      // это дешевле, чем отдавать на разбор все страницы разом
      onProgress('Ищу таблицу результатов');
      var thumbs = [];
      for (var t = 0; t < total; t++) thumbs.push(toJpeg(await renderPdfPage(pages[t], THUMB_DPI), 0.7));
      var chosen = await pickPages(thumbs);
      picked = chosen.pages;
      titles = chosen.titles;
    }
    if (!picked.length) picked = [1];
    if (picked.length > MAX_SEND) picked = picked.slice(0, MAX_SEND);

    onProgress(picked.length > 1
      ? 'Готовлю страницы ' + picked.join(', ')
      : 'Готовлю страницу ' + picked[0]);

    var images = [];
    for (var p = 0; p < picked.length; p++) {
      images.push(toJpeg(await renderPdfPage(pages[picked[p] - 1], PAGE_DPI)));
    }

    return {
      images: images,
      titles: titles,
      passes: hasText ? [picked.map(function (n) { return layers[n - 1]; }).join('\n')] : [],
      previews: previews,
      kind: (hasText ? 'PDF с текстом' : 'PDF-скан') +
            (total > 1 ? ', таблица на стр. ' + picked.join(', ') + ' из ' + total : ''),
      pages: picked,
    };
  }

  async function fromImage(file, onProgress) {
    onProgress('Готовлю изображение');
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

    return {
      images: [toJpeg(canvas)],
      passes: [],
      previews: [toJpeg(canvas, 0.8)],
      kind: canvas.width < 1000 ? 'мелкий снимок' : 'изображение',
      width: canvas.width,
    };
  }

  async function fromDocx(file, onProgress) {
    onProgress('Читаю документ Word');
    var mammoth = global.mammoth;
    if (!mammoth) throw new Error('Не подключена библиотека чтения Word');
    var res = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
    return { images: [], passes: [res.value || ''], previews: [], kind: 'документ Word' };
  }

  /* ── история разборов ─────────────────────────────────────────────────
   * Разбор стоит денег, поэтому результат сохраняется сразу и навсегда, а не
   * до закрытия вкладки. Файл узнаём по отпечатку: тот же протокол второй раз
   * не оплачивается, открывается сохранённый разбор. */

  /** Отпечаток содержимого: размер плюс SHA-256. Имя файла не в счёт - один
   *  и тот же протокол приходит под разными именами. */
  async function fileHash(file) {
    var buf = await file.arrayBuffer();
    var digest = await crypto.subtle.digest('SHA-256', buf);
    var hex = Array.prototype.map.call(new Uint8Array(digest), function (b) {
      return ('0' + b.toString(16)).slice(-2);
    }).join('');
    return file.size + '-' + hex;
  }

  async function findSaved(hash) {
    var sb = global.Auth && global.Auth.getSupabase ? global.Auth.getSupabase() : null;
    if (!sb) return null;
    var res = await sb.from('water_analyses')
      .select('id,created_at,manager_name,file_name,kind,lab,sample_name,sample_date,samples_total,rows_json,samples_json,object_json,preview')
      .eq('file_hash', hash).order('created_at', { ascending: false }).limit(1);
    return (res.data && res.data[0]) || null;
  }

  async function saveAnalysis(entry) {
    var sb = global.Auth && global.Auth.getSupabase ? global.Auth.getSupabase() : null;
    if (!sb) return null;
    var res = await sb.from('water_analyses').insert(entry).select('id').single();
    return res.data || null;
  }

  /** Одна запись истории по номеру - чтобы вернуться к разбору и поправить его. */
  async function getAnalysis(id) {
    var sb = global.Auth && global.Auth.getSupabase ? global.Auth.getSupabase() : null;
    if (!sb) return null;
    var res = await sb.from('water_analyses')
      .select('id,created_at,manager_name,file_name,kind,lab,sample_name,sample_date,samples_total,rows_json,samples_json,object_json,preview')
      .eq('id', id).maybeSingle();
    return res.data || null;
  }

  async function listAnalyses(limit) {
    var sb = global.Auth && global.Auth.getSupabase ? global.Auth.getSupabase() : null;
    if (!sb) return [];
    var res = await sb.from('water_analyses')
      .select('id,created_at,manager_name,file_name,kind,lab,sample_name,sample_date,samples_total,rows_json,samples_json,object_json,preview')
      .order('created_at', { ascending: false }).limit(limit || 20);
    return res.data || [];
  }

  async function readFile(file, onProgress) {
    var name = (file.name || '').toLowerCase();
    if (file.type === 'application/pdf' || name.endsWith('.pdf')) return fromPdf(file, onProgress);
    if (name.endsWith('.docx')) return fromDocx(file, onProgress);
    if ((file.type || '').indexOf('image/') === 0) return fromImage(file, onProgress);
    throw new Error('Не понимаю формат файла. Нужен PDF, изображение или Word (.docx)');
  }

  /* ── обращение к серверу ─────────────────────────────────────────────── */

  async function call(payload) {
    var sb = global.Auth && global.Auth.getSupabase ? global.Auth.getSupabase() : null;
    var session = sb ? (await sb.auth.getSession()).data.session : null;
    if (!session) throw new Error('Сессия не найдена, войдите в конструктор заново');

    var r = await fetch(FN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + session.access_token,
      },
      body: JSON.stringify(payload),
    });
    var data = await r.json();
    if (!r.ok) throw new Error(data.error || ('Сервер ответил ' + r.status));
    return data;
  }

  /** Выбор страниц с таблицей - отдельный дешёвый вызов по эскизам.
   *  Оттуда же приходят названия проб: место отбора печатают на титульном листе,
   *  а на разбор уходят только страницы с таблицами, где его уже нет. */
  async function pickPages(thumbs) {
    try {
      var res = await call({ pick: true, images: thumbs });
      return { pages: res.pages || [1], titles: res.titles || [] };
    } catch (e) {
      return { pages: [1], titles: [] };
    }
  }

  /** model - для стенда: там сравнивают Sonnet и Haiku. В работе не передаётся. */
  async function parse(read, onProgress, model) {
    onProgress('Разбираю показатели');
    var payload = { images: read.images || [], passes: read.passes || [],
                    titles: read.titles || [] };
    if (model) payload.model = model;
    return await call(payload);
  }

  /** Последний разбор держим под рукой: без него не понять, почему ошиблись. */
  async function readFileDebug(file, onProgress) {
    var res = await readFile(file, onProgress);
    global.__lastRead = res;
    return res;
  }

  global.WaterPipeline = { readFile: readFileDebug, parse: parse,
                           fileHash: fileHash, findSaved: findSaved,
                             saveAnalysis: saveAnalysis, listAnalyses: listAnalyses,
                           getAnalysis: getAnalysis };
})(window);
