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
  var state = { rows: [], meta: null, kind: '' };

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
      read.previews.forEach(function (src) {
        var img = new Image();
        img.src = src;
        el('previews').appendChild(img);
      });

      el('workTitle').textContent = 'Разбираю показатели';
      var data = await window.WaterPipeline.parse(read, function (note) {
        el('workTitle').textContent = note;
      });

      state.rows = (data.rows || []).slice();
      window.__lastRows = state.rows;      // для проверок: сверка с эталоном снаружи
      state.meta = data;

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
        sample: state.meta && state.meta.sample,
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
