/* Конструктор КП — защита страниц.
   Механизм выбора канала связи перенесён из aruan/tenders/auth.js (проверен в бою 17.09.2026). */
(function () {
  /* ═══ Выбор пути к базе: прокси или прямой адрес ═══
     Разным машинам нужны РАЗНЫЕ пути: у одних провайдер душит netlify.app
     (прокси), у других режет QUIC к Cloudflare (прямой supabase.co).
     Порядок: прокси Netlify (дефолт) → прямой адрес (аварийный).
     Проверка канала СТРОГО ПОСЛЕДОВАТЕЛЬНАЯ и идёт по РЕАЛЬНОМУ пути данных
     (GET /rest/v1/managers с anon-JWT), а не по лёгкому health-эндпоинту:
     лёгкий запрос проходит и там, где настоящий режется, и тогда «Проверка
     авторизации» висит навечно. Размер запроса тоже реалистичный: заголовок
     X-Probe-Pad (~1200 символов) имитирует JWT сессии, потому что на голом
     провайдерском канале маленький запрос проходит, а большой режет DPI.
     Выбранный путь запоминается в localStorage kp_base: на старте берётся
     мгновенно, а в фоне проверяется — мёртвый кеш при живом втором пути
     перезаписывается и страница один раз перезагружается.
     Ручной выход без консоли: ?base=proxy / ?base=direct.
     Ключ сессии ФИКСИРОВАН: по умолчанию supabase-js зовёт его
     sb-<хост базы>-auth-token, и при смене пути сессия бы «терялась».
     Значение равно прежнему дефолту прокси, чтобы текущие входы выжили.
     Компактная копия этой логики есть в login.html — менять синхронно. */
  var SUPA_BASES = [
    'https://newproject-sb.netlify.app',        // прокси Netlify (дефолт)
    'https://uclzyzztoripulpcpshp.supabase.co'  // прямой адрес
  ];
  var BASE_KEY = 'kp_base';
  var RELOAD_FLAG = 'kp_base_reloaded';         // перезагрузка на живой путь — максимум одна за сессию
  var STORAGE_KEY = 'sb-newproject-sb-auth-token';
  var PROBE_TIMEOUT_MS = 2500;
  var PROBE_PAD = new Array(1201).join('x');
  var CHECK_TIMEOUT_MS = 12000;                 // потолок на всю проверку доступа
  var ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjbHp5enp0b3JpcHVscGNwc2hwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3ODIyNzMsImV4cCI6MjA5MjM1ODI3M30.rX-WT1WdZiwRakVcUEkcg-_dnWzfU49LvgTNHYgBYQ0';

  var _sb = null;
  var _manager = null;
  var _presenceChannel = null;
  var _base = null;
  var _done = false;

  function _store(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function _read(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }

  /* ═══ Оверлей ═══ */
  var SPINNER = '<div style="text-align:center"><div style="width:40px;height:40px;border:3px solid #E3E8F0;border-top-color:#1565C0;border-radius:50%;animation:auth-spin .8s linear infinite;margin:0 auto 16px"></div><div style="color:#666;font-size:14px">Проверка авторизации...</div></div><style>@keyframes auth-spin{to{transform:rotate(360deg)}}</style>';
  var _overlay = document.createElement('div');
  _overlay.id = 'auth-overlay';
  _overlay.style.cssText = 'position:fixed;inset:0;background:#F0F4F8;z-index:999999;display:flex;align-items:center;justify-content:center;padding:20px';
  _overlay.innerHTML = SPINNER;
  document.head.parentNode.insertBefore(_overlay, document.head.nextSibling);

  function _showFailure() {
    if (_done) return;
    _done = true;
    var other = (_base === SUPA_BASES[0]) ? 'direct' : 'proxy';
    _overlay.innerHTML =
      '<div style="text-align:center;max-width:380px;font-family:system-ui,sans-serif">' +
      '<div style="font-size:15px;color:#333;font-weight:600;margin-bottom:8px">Сервер не отвечает</div>' +
      '<div style="font-size:13px;color:#666;line-height:1.5;margin-bottom:18px">Не удалось проверить доступ. Обычно помогает кнопка «Повторить». Если не помогает — нажмите «Сменить канал связи»: у части провайдеров работает другой путь к серверу.</div>' +
      '<button id="auth-retry" style="background:#1565C0;color:#fff;border:none;border-radius:8px;padding:10px 24px;font-size:14px;font-weight:600;cursor:pointer;margin:0 6px 8px">Повторить</button>' +
      '<button id="auth-switch" style="background:#fff;color:#1565C0;border:1px solid #1565C0;border-radius:8px;padding:10px 24px;font-size:14px;font-weight:600;cursor:pointer;margin:0 6px 8px">Сменить канал связи</button>' +
      '</div>';
    document.getElementById('auth-retry').onclick = function () { window.location.reload(); };
    document.getElementById('auth-switch').onclick = function () {
      _store(BASE_KEY, other);
      try { sessionStorage.removeItem(RELOAD_FLAG); } catch (e) {}
      window.location.reload();
    };
  }

  function _toLogin() {
    if (_done) return;
    _done = true;
    try { sessionStorage.setItem('auth_redirect', window.location.pathname + window.location.search); } catch (e) {}
    window.location.replace('/login.html');
  }

  /* Проба канала по реальному пути данных, с реалистичным размером запроса. */
  function _probe(base) {
    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, PROBE_TIMEOUT_MS);
    return fetch(base + '/rest/v1/managers?select=id&limit=1', {
      method: 'GET',
      headers: { apikey: ANON, Authorization: 'Bearer ' + ANON, 'X-Probe-Pad': PROBE_PAD },
      signal: ctrl.signal
    }).then(function (r) {
      clearTimeout(timer);
      return r.status < 500;   // любой ответ сервера означает, что канал живой
    }).catch(function () {
      clearTimeout(timer);
      return false;
    });
  }

  function _resolveBase() {
    var forced = /[?&]base=(proxy|direct)/.exec(window.location.search);
    if (forced) {
      var b = forced[1] === 'direct' ? SUPA_BASES[1] : SUPA_BASES[0];
      _store(BASE_KEY, forced[1]);
      return Promise.resolve(b);
    }
    var saved = _read(BASE_KEY);
    if (saved === 'proxy' || saved === 'direct') {
      var cached = saved === 'direct' ? SUPA_BASES[1] : SUPA_BASES[0];
      // берём мгновенно, но в фоне проверяем: мёртвый кеш при живом втором пути перезаписываем
      _probe(cached).then(function (alive) {
        if (alive) return;
        var alt = cached === SUPA_BASES[0] ? SUPA_BASES[1] : SUPA_BASES[0];
        return _probe(alt).then(function (altAlive) {
          if (!altAlive) return;
          _store(BASE_KEY, alt === SUPA_BASES[1] ? 'direct' : 'proxy');
          var once = false;
          try { once = sessionStorage.getItem(RELOAD_FLAG) === '1'; } catch (e) {}
          if (!once && !_done) {
            try { sessionStorage.setItem(RELOAD_FLAG, '1'); } catch (e) {}
            window.location.reload();
          }
        });
      });
      return Promise.resolve(cached);
    }
    // первый запуск: пробуем по порядку
    return _probe(SUPA_BASES[0]).then(function (ok) {
      if (ok) { _store(BASE_KEY, 'proxy'); return SUPA_BASES[0]; }
      return _probe(SUPA_BASES[1]).then(function (ok2) {
        if (ok2) { _store(BASE_KEY, 'direct'); return SUPA_BASES[1]; }
        return SUPA_BASES[0];   // оба молчат: дальше сработает экран «Сервер не отвечает»
      });
    });
  }

  function _init() {
    setTimeout(_showFailure, CHECK_TIMEOUT_MS);

    _resolveBase().then(function (base) {
      _base = base;
      _sb = supabase.createClient(base, ANON, { auth: { storageKey: STORAGE_KEY } });

      return _sb.auth.getSession().then(function (result) {
        var session = result.data && result.data.session;
        if (!session) { _toLogin(); return null; }
        return _sb.from('managers').select('*').eq('user_id', session.user.id).single();
      });
    }).then(function (result) {
      if (!result || _done) return;
      if (result.error || !result.data) { _toLogin(); return; }
      _done = true;
      _manager = result.data;
      _store('my_manager_id', String(_manager.id));
      _store('my_manager_name', _manager.name);
      _trackPresence();
      _overlay.style.display = 'none';
      document.dispatchEvent(new Event('auth-ready'));
    }).catch(function () {
      // сетевой сбой показываем экраном, а не выкидыванием на форму входа:
      // иначе человек вводит верный пароль по кругу и не понимает, что не так
      _showFailure();
    });
  }

  function _trackPresence() {
    if (!_manager || !_sb) return;
    try {
      _presenceChannel = _sb.channel('manager-presence', {
        config: { presence: { key: String(_manager.id) } }
      });
      // Регистрируем обработчик ДО subscribe — обязательное требование Supabase JS v2
      _presenceChannel
        .on('presence', { event: 'sync' }, function () {
          document.dispatchEvent(new CustomEvent('presence-sync', {
            detail: _presenceChannel.presenceState()
          }));
        })
        .subscribe(function (status) {
          if (status === 'SUBSCRIBED') {
            _presenceChannel.track({
              manager_id: _manager.id,
              name: _manager.name,
              photo: _manager.photo
            });
          }
        });
    } catch (e) {
      // присутствие не критично: страница должна работать даже без Realtime
    }
  }

  function signOut() {
    try {
      if (_presenceChannel) {
        _presenceChannel.untrack().then(function () { _sb.removeChannel(_presenceChannel); });
      }
    } catch (e) {}
    var finish = function () {
      try {
        localStorage.removeItem('my_manager_id');
        localStorage.removeItem('my_manager_name');
      } catch (e) {}
      window.location.replace('/login.html');
    };
    if (_sb) { _sb.auth.signOut().then(finish, finish); } else { finish(); }
  }

  window.Auth = {
    signOut: signOut,
    getManager: function () { return _manager; },
    getSupabase: function () { return _sb; },
    getPresenceChannel: function () { return _presenceChannel; },
    getBase: function () { return _base; }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _init);
  } else {
    _init();
  }
})();
