/* Экран проверки разобранного анализа.
 *
 * Правило, ради которого всё затевалось: ни одно значение не уходит в подбор,
 * пока человек не подтвердил. Поэтому статусы считаются здесь, в коде, а не
 * моделью - они должны быть предсказуемыми:
 *   выше нормы  - значение больше норматива из самого протокола;
 *   выберите    - распознавания разошлись, нужен выбор человека (блокирует подбор);
 *   ниже предела- лаборатория не обнаружила показатель («менее 0,01»);
 *   без норматива - в протоколе прочерк, сравнивать не с чем.
 */
(function () {
  'use strict';

  var el = function (id) { return document.getElementById(id); };
  var state = { rows: [], samples: [], pages: [], current: 0, meta: null, kind: '' };

  /* ── статусы ─────────────────────────────────────────── */

  /** Норматив в протоколах пишут по-разному: «7,0», «не более 1,5», «от 6 до 9». */
  function limitRange(limit) {
    if (limit === null || limit === undefined) return null;
    var s = String(limit).replace(',', '.');
    var pair = s.match(/(\d+(?:\.\d+)?)\s*(?:-|–|до)\s*(\d+(?:\.\d+)?)/);
    if (pair) return { min: parseFloat(pair[1]), max: parseFloat(pair[2]) };
    var one = s.match(/(\d+(?:\.\d+)?)/);
    return one ? { min: null, max: parseFloat(one[1]) } : null;
  }

  function statusOf(row) {
    if (row.variants && row.variants.length > 1) return 'pick';
    if (row.value === null || row.value === undefined) {
      return (row.below !== null && row.below !== undefined) ? 'below' : 'none';
    }
    var lim = limitRange(row.limit);
    if (!lim) return 'nolimit';
    if (lim.min !== null && row.value < lim.min) return 'over';
    if (lim.max !== null && row.value > lim.max) return 'over';
    return 'ok';
  }

  var TAGS = {
    ok: ['t-ok', 'в норме'],
    over: ['t-over', 'выше нормы'],
    pick: ['t-bad', 'выберите'],
    below: ['t-none', 'ниже предела'],
    none: ['t-none', 'нет данных'],
    nolimit: ['t-none', 'без норматива'],
  };

  /* ── отрисовка ───────────────────────────────────────── */

  /** В протоколах десятичная запятая, а модель отдаёт точку - возвращаем как в документе. */
  function showLimit(limit) {
    if (limit === null || limit === undefined || limit === '') return '—';
    return String(limit).replace(/(\d),(?=\d)/g, '$1,').replace(/(\d)\.(?=\d)/g, '$1,');
  }

  function showValue(row) {
    if (row.value !== null && row.value !== undefined) return String(row.value).replace('.', ',');
    // в below приходит и число («0,01»), и словами («не обнаружено», «менее 6»):
    // «менее» приписываем только к голому числу, иначе выходит «менее не обнаружено»
    if (row.below !== null && row.below !== undefined) {
      var b = String(row.below).replace('.', ',').trim();
      return /^\d+(?:,\d+)?$/.test(b) ? 'менее ' + b : b;
    }
    return '';
  }

  function render() {
    var box = el('rows');
    box.innerHTML = '';
    var group = null;

    state.rows.forEach(function (row, idx) {
      if (row.group && row.group !== group) {
        group = row.group;
        var g = document.createElement('tr');
        g.className = 'grp';
        g.innerHTML = '<td colspan="5"></td>';
        g.firstChild.textContent = group;
        box.appendChild(g);
      }

      var st = statusOf(row);
      var tr = document.createElement('tr');
      if (st === 'over') tr.className = 'over';
      if (st === 'pick') tr.className = 'pick';

      var tdNum = document.createElement('td');
      tdNum.className = 'num';
      tdNum.textContent = row.n != null ? row.n : (idx + 1);

      var tdName = document.createElement('td');
      tdName.textContent = row.name || '';

      if (st === 'pick') {
        var flag = document.createElement('span');
        flag.className = 'flag';
        flag.textContent = 'Распознавания разошлись. Выберите верное значение или впишите своё, ' +
                           'сверившись с документом слева.';
        tdName.appendChild(flag);

        var pills = document.createElement('span');
        pills.className = 'pills';
        row.variants.forEach(function (v) {
          var b = document.createElement('button');
          b.className = 'pill';
          b.textContent = String(v).replace('.', ',');
          b.onclick = function () {
            row.value = v;
            row.variants = null;
            render();
          };
          pills.appendChild(b);
        });
        tdName.appendChild(pills);
      }

      var tdVal = document.createElement('td');
      var input = document.createElement('input');
      input.className = 'val';
      input.value = showValue(row);
      input.oninput = function () {
        var raw = input.value.trim().replace(',', '.');
        var m = raw.match(/^менее\s*(\d+(?:\.\d+)?)$/i);
        if (m) { row.value = null; row.below = parseFloat(m[1]); }
        else if (raw === '') { row.value = null; row.below = null; }
        else if (!isNaN(parseFloat(raw))) { row.value = parseFloat(raw); row.below = null; }
        row.variants = null;
        updateSummary();
      };
      tdVal.appendChild(input);
      if (row.unit) {
        var u = document.createElement('span');
        u.className = 'unit';
        u.textContent = ' ' + row.unit;
        tdVal.appendChild(u);
      }

      var tdLim = document.createElement('td');
      tdLim.className = 'norm';
      tdLim.textContent = showLimit(row.limit);

      var tdTag = document.createElement('td');
      var tag = document.createElement('span');
      tag.className = 'tag ' + TAGS[st][0];
      tag.textContent = TAGS[st][1];
      tdTag.appendChild(tag);

      tr.appendChild(tdNum); tr.appendChild(tdName); tr.appendChild(tdVal);
      tr.appendChild(tdLim); tr.appendChild(tdTag);
      box.appendChild(tr);
    });

    updateSummary();
  }

  function updateSummary() {
    var over = state.rows.filter(function (r) { return statusOf(r) === 'over'; });
    var picks = state.rows.filter(function (r) { return statusOf(r) === 'pick'; });

    var html = '';
    if (over.length) {
      html += '<b>Превышения по нормативам протокола:</b><ul>';
      over.forEach(function (r) {
        html += '<li>' + escapeHtml(r.name) + ' — ' + showValue(r) +
                (r.unit ? ' ' + escapeHtml(r.unit) : '') +
                ' при норме ' + escapeHtml(showLimit(r.limit)) + '</li>';
      });
      html += '</ul>';
    } else {
      html += '<b>Превышений по нормативам протокола нет.</b>';
    }
    if (picks.length) {
      html += '<div style="margin-top:10px;color:var(--bad-t)">Требуют вашего решения: ' +
              picks.map(function (r) { return escapeHtml(r.name); }).join(', ') + '.</div>';
    }
    el('summary').innerHTML = html;

    el('confirm').disabled = picks.length > 0;
    el('blockNote').textContent = picks.length
      ? 'Пока есть спорные строки, подбор не запускается'
      : '';
  }

  function escapeHtml(s) {
    return String(s === null || s === undefined ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* ── пробы ───────────────────────────────────────────────
   * В одном протоколе бывает несколько проб: скважина и водопровод, точки отбора,
   * колонки «проба 1» и «проба 2». Смешивать их нельзя - оборудование подбирают
   * под конкретную воду. Поэтому пробы переключаются, а правки хранятся у каждой
   * свои: вернулись к первой - ваши исправления на месте. */

  function renderSamples() {
    var box = el('samples');
    box.innerHTML = '';
    if (!state.samples || state.samples.length < 2) {
      box.classList.add('hide');
      return;
    }
    box.classList.remove('hide');

    var lbl = document.createElement('span');
    lbl.className = 'lbl';
    lbl.textContent = 'В протоколе ' + state.samples.length + ' пробы:';
    box.appendChild(lbl);

    // две пробы из одного места называются одинаково - различаем страницей
    var seen = {};
    state.samples.forEach(function (s) { seen[s.name] = (seen[s.name] || 0) + 1; });

    state.samples.forEach(function (s, i) {
      var b = document.createElement('button');
      var page = (state.pages || [])[i];
      b.textContent = s.name +
        (seen[s.name] > 1 && page ? ' · стр. ' + page : '') +
        (s.date ? ' · ' + s.date : '');
      if (i === state.current) b.className = 'on';
      b.onclick = function () {
        state.current = i;
        state.rows = state.samples[i].rows;
        window.__lastRows = state.rows;
        renderSamples();
        render();
      };
      box.appendChild(b);
    });
  }

  /* ── масштаб документа в колонке ─────────────────────────
   * Главный сценарий работы: менеджер держит строку протокола слева и таблицу
   * справа и сверяет их глазами. Поэтому увеличение происходит на месте, а не
   * в отдельном окне: колесо мыши меняет масштаб, колонка прокручивается,
   * перетаскивание сдвигает. Полноэкранный просмотр остался кнопкой ⛶ и
   * двойным щелчком - для случаев, когда нужен совсем крупный план. */

  var docZoom = (function () {
    var scale = 1, dragging = false, sx = 0, sy = 0, sl = 0, st = 0;

    function inner() { return el('previews').querySelector('.inner'); }

    function apply() {
      var box = inner();
      if (box) box.style.width = Math.round(scale * 100) + '%';
      el('docLevel').textContent = Math.round(scale * 100) + '%';
    }

    function set(next, anchorY) {
      var pane = el('previews');
      var before = pane.scrollTop + (anchorY || 0);
      var ratio = Math.min(4, Math.max(1, next)) / scale;
      scale = Math.min(4, Math.max(1, next));
      apply();
      // точка под курсором остаётся на месте, иначе при увеличении уезжает не туда
      pane.scrollTop = before * ratio - (anchorY || 0);
    }

    return {
      reset: function () { scale = 1; apply(); el('previews').scrollTop = 0; },
      zoom: function (k, anchorY) { set(scale * k, anchorY); },
      fit: function () { this.reset(); },
      bind: function () {
        var pane = el('previews');

        // колесо оставлено прокрутке - иначе не пролистать длинный протокол.
        // Масштаб на Ctrl + колесо, как в браузере и картах, плюс кнопки в шапке
        pane.addEventListener('wheel', function (e) {
          if (!inner() || !(e.ctrlKey || e.metaKey)) return;
          e.preventDefault();
          docZoom.zoom(e.deltaY < 0 ? 1.15 : 1 / 1.15, e.clientY - pane.getBoundingClientRect().top);
        }, { passive: false });

        pane.addEventListener('mousedown', function (e) {
          if (scale <= 1) return;         // пока не увеличено, тащить нечего
          dragging = true;
          sx = e.clientX; sy = e.clientY;
          sl = pane.scrollLeft; st = pane.scrollTop;
          pane.classList.add('drag');
          e.preventDefault();
        });
        window.addEventListener('mousemove', function (e) {
          if (!dragging) return;
          pane.scrollLeft = sl - (e.clientX - sx);
          pane.scrollTop = st - (e.clientY - sy);
        });
        window.addEventListener('mouseup', function () {
          dragging = false;
          pane.classList.remove('drag');
        });

        el('docIn').onclick = function () { docZoom.zoom(1.3, pane.clientHeight / 2); };
        el('docOut').onclick = function () { docZoom.zoom(1 / 1.3, pane.clientHeight / 2); };
        el('docFit').onclick = function () { docZoom.fit(); };
        el('docFull').onclick = function () {
          var img = pane.querySelector('img');
          if (img) openViewer(img.dataset.full || img.src, img.dataset.title || 'Исходный документ');
        };
      },
    };
  })();

  /* ── просмотр страницы ───────────────────────────────────
   * Шрифт в протоколах мелкий, в колонке слева его не разобрать. Поэтому
   * страница открывается во весь экран: колесо - масштаб к точке под курсором,
   * перетаскивание - сдвиг. Показываем то изображение, что уходило на разбор,
   * оно крупнее превью. */

  var view = { scale: 1, x: 0, y: 0, dragging: false, sx: 0, sy: 0 };

  function applyView() {
    var img = el('viewerImg');
    img.style.transform = 'translate(' + view.x + 'px,' + view.y + 'px) scale(' + view.scale + ')';
    el('zoomLevel').textContent = Math.round(view.scale * 100) + '%';
  }

  /** Вписать страницу по ширине окна - так её открывают в первый раз. */
  function fitView() {
    var img = el('viewerImg');
    if (!img.naturalWidth) return;
    var pad = 48;
    view.scale = Math.min((window.innerWidth - pad) / img.naturalWidth,
                          (window.innerHeight - pad * 2) / img.naturalHeight);
    view.x = (window.innerWidth - img.naturalWidth * view.scale) / 2;
    view.y = (window.innerHeight - img.naturalHeight * view.scale) / 2;
    applyView();
  }

  function zoomAt(factor, cx, cy) {
    var next = Math.min(8, Math.max(0.2, view.scale * factor));
    // точка под курсором остаётся на месте - иначе при увеличении уезжает не туда
    view.x = cx - (cx - view.x) * (next / view.scale);
    view.y = cy - (cy - view.y) * (next / view.scale);
    view.scale = next;
    applyView();
  }

  function openViewer(src, title) {
    var img = el('viewerImg');
    el('viewerTitle').textContent = title || 'Исходный документ';
    img.onload = fitView;
    img.src = src;
    el('viewer').classList.remove('hide');
    if (img.complete) fitView();
  }

  function closeViewer() {
    el('viewer').classList.add('hide');
    el('viewerImg').src = '';
  }

  function bindViewer() {
    var box = el('viewer');

    box.addEventListener('wheel', function (e) {
      e.preventDefault();
      zoomAt(e.deltaY < 0 ? 1.15 : 1 / 1.15, e.clientX, e.clientY);
    }, { passive: false });

    box.addEventListener('mousedown', function (e) {
      if (e.target.tagName === 'BUTTON') return;
      view.dragging = true;
      view.sx = e.clientX - view.x;
      view.sy = e.clientY - view.y;
      box.classList.add('drag');
    });
    window.addEventListener('mousemove', function (e) {
      if (!view.dragging) return;
      view.x = e.clientX - view.sx;
      view.y = e.clientY - view.sy;
      applyView();
    });
    window.addEventListener('mouseup', function () {
      view.dragging = false;
      box.classList.remove('drag');
    });

    // двойной щелчок - быстрое приближение и обратно
    box.addEventListener('dblclick', function (e) {
      if (e.target.tagName === 'BUTTON') return;
      if (view.scale > 1.2) fitView();
      else zoomAt(2.2, e.clientX, e.clientY);
    });

    el('zoomIn').onclick = function () { zoomAt(1.3, window.innerWidth / 2, window.innerHeight / 2); };
    el('zoomOut').onclick = function () { zoomAt(1 / 1.3, window.innerWidth / 2, window.innerHeight / 2); };
    el('zoomFit').onclick = fitView;
    el('viewerClose').onclick = closeViewer;

    document.addEventListener('keydown', function (e) {
      if (el('viewer').classList.contains('hide')) return;
      if (e.key === 'Escape') closeViewer();
      if (e.key === '+' || e.key === '=') zoomAt(1.3, window.innerWidth / 2, window.innerHeight / 2);
      if (e.key === '-') zoomAt(1 / 1.3, window.innerWidth / 2, window.innerHeight / 2);
    });
  }

  /* ── шаги ────────────────────────────────────────────── */

  function step(name) {
    ['stepLoad', 'stepWork', 'stepCheck'].forEach(function (id) {
      el(id).classList.toggle('hide', id !== name);
    });
  }

  function warn(text) {
    var w = el('warn');
    w.textContent = text || '';
    w.classList.toggle('hide', !text);
  }

  async function handle(file) {
    warn('');
    el('fileName').textContent = file.name || 'вставленное изображение';
    step('stepWork');
    el('workTitle').textContent = 'Читаю файл';

    try {
      var read = await window.WaterPipeline.readFile(file, function (note) {
        el('workTitle').textContent = note;
      });
      state.kind = read.kind;

      el('previews').innerHTML = '';
      var inner = document.createElement('div');
      inner.className = 'inner';
      docZoom.reset();
      // страницы, ушедшие на разбор, отрисованы крупнее - их и показываем в увеличении
      var big = {};
      (read.pages || []).forEach(function (n, i) {
        if (read.images && read.images[i]) big[n] = read.images[i];
      });
      read.previews.forEach(function (src, idx) {
        var img = new Image();
        img.src = src;
        img.dataset.full = big[idx + 1] || src;
        img.dataset.title = read.previews.length > 1 ? 'Страница ' + (idx + 1) : 'Исходный документ';
        img.title = 'Ctrl + колесо — масштаб, двойной щелчок — во весь экран';
        img.ondblclick = function () { openViewer(img.dataset.full, img.dataset.title); };
        inner.appendChild(img);
      });
      el('previews').appendChild(inner);

      el('workTitle').textContent = 'Разбираю показатели';
      var data = await window.WaterPipeline.parse(read, function (note) {
        el('workTitle').textContent = note;
      });

      // протокол может содержать несколько проб - держим их раздельно и даём выбрать
      state.samples = (data.samples && data.samples.length)
        ? data.samples.map(function (s, i) {
            return {
              name: s.sample || ('Проба ' + (i + 1)),
              date: s.date || null,
              rows: (s.rows || []).slice(),
            };
          })
        : [{ name: data.sample || 'Проба', date: data.date || null, rows: (data.rows || []).slice() }];
      state.current = 0;
      state.pages = read.pages || [];
      state.rows = state.samples[0].rows;
      window.__lastRows = state.rows;      // для проверок: сверка с эталоном снаружи
      window.__lastSamples = state.samples;
      state.meta = data;
      renderSamples();

      if (!state.rows.length) {
        step('stepLoad');
        warn('В файле не нашлось ни одного показателя. Попробуйте другой файл или проверьте, ' +
             'что это протокол анализа воды.');
        return;
      }

      // мало показателей со скриншота - честно предупреждаем, а не делаем вид, что всё хорошо
      if (read.width && read.width < 1000 && state.rows.length < 6) {
        warn('Со скриншота удалось прочитать всего ' + state.rows.length +
             ' показателей — снимок мелкий (' + read.width + ' точек по ширине). ' +
             'Лучше вставить файл целиком или переснять при увеличенном масштабе страницы.');
      }

      var title = 'Что система прочитала — сверьте построчно';
      if (data.lab) title += ' · ' + data.lab;
      el('checkTitle').textContent = title;

      render();
      step('stepCheck');
    } catch (e) {
      step('stepLoad');
      warn('Не получилось: ' + (e && e.message ? e.message : e));
    }
  }

  /* ── события ─────────────────────────────────────────── */

  document.addEventListener('DOMContentLoaded', function () {
    bindViewer();
    docZoom.bind();
    el('pick').onclick = function () { el('file').click(); };
    el('file').onchange = function () { if (this.files[0]) handle(this.files[0]); };
    el('again').onclick = function () { step('stepLoad'); warn(''); el('fileName').textContent = ''; };

    var drop = el('stepLoad');
    ['dragenter', 'dragover'].forEach(function (t) {
      drop.addEventListener(t, function (e) { e.preventDefault(); drop.classList.add('over'); });
    });
    ['dragleave', 'drop'].forEach(function (t) {
      drop.addEventListener(t, function (e) { e.preventDefault(); drop.classList.remove('over'); });
    });
    drop.addEventListener('drop', function (e) {
      var f = e.dataTransfer.files && e.dataTransfer.files[0];
      if (f) handle(f);
    });

    // вставка из буфера: и скриншот с экрана, и картинка, скопированная из письма
    document.addEventListener('paste', function (e) {
      var items = (e.clipboardData || {}).items || [];
      for (var i = 0; i < items.length; i++) {
        if (items[i].kind === 'file') {
          var f = items[i].getAsFile();
          if (f) { handle(f); return; }
        }
      }
    });

    el('confirm').onclick = function () {
      var payload = {
        savedAt: new Date().toISOString(),
        lab: state.meta && state.meta.lab,
        date: state.meta && state.meta.date,
        // какая именно проба подтверждена - по ней дальше пойдёт подбор
        sample: (state.samples[state.current] || {}).name ||
                (state.meta && state.meta.sample) || null,
        samplesTotal: state.samples.length,
        kind: state.kind,
        rows: state.rows,
      };
      try { localStorage.setItem('water_analysis', JSON.stringify(payload)); } catch (e) {}
      el('confirm').textContent = 'Показатели сохранены';
      el('confirm').disabled = true;
      el('blockNote').textContent = 'Дальше их подхватит подбор — он делается следующим этапом';
    };
  });
})();
