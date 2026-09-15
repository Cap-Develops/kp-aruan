(function () {
  var SUPA_URL = 'https://uclzyzztoripulpcpshp.supabase.co';
  var ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjbHp5enp0b3JpcHVscGNwc2hwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3ODIyNzMsImV4cCI6MjA5MjM1ODI3M30.rX-WT1WdZiwRakVcUEkcg-_dnWzfU49LvgTNHYgBYQ0';

  var _sb = null;
  var _manager = null;
  var _presenceChannel = null;

  // Инжектируем оверлей загрузки
  var _overlay = document.createElement('div');
  _overlay.id = 'auth-overlay';
  _overlay.style.cssText = 'position:fixed;inset:0;background:#F0F4F8;z-index:999999;display:flex;align-items:center;justify-content:center;';
  _overlay.innerHTML = '<div style="text-align:center"><div style="width:40px;height:40px;border:3px solid #E3E8F0;border-top-color:#1565C0;border-radius:50%;animation:auth-spin 0.8s linear infinite;margin:0 auto 16px"></div><div style="color:#666;font-size:14px">Проверка авторизации...</div></div><style>@keyframes auth-spin{to{transform:rotate(360deg)}}</style>';
  document.head.parentNode.insertBefore(_overlay, document.head.nextSibling);

  function _init() {
    _sb = supabase.createClient(SUPA_URL, ANON);

    _sb.auth.getSession().then(function (result) {
      var session = result.data && result.data.session;
      if (!session) {
        sessionStorage.setItem('auth_redirect', window.location.pathname + window.location.search);
        window.location.replace('/login.html');
        return;
      }
      return _sb.from('managers').select('*').eq('user_id', session.user.id).single();
    }).then(function (result) {
      if (!result) return;
      if (result.error || !result.data) {
        window.location.replace('/login.html');
        return;
      }
      _manager = result.data;
      localStorage.setItem('my_manager_id', String(_manager.id));
      localStorage.setItem('my_manager_name', _manager.name);
      _trackPresence();
      _overlay.style.display = 'none';
      document.dispatchEvent(new Event('auth-ready'));
    }).catch(function () {
      sessionStorage.setItem('auth_redirect', window.location.pathname + window.location.search);
      window.location.replace('/login.html');
    });
  }

  function _trackPresence() {
    if (!_manager || !_sb) return;
    _presenceChannel = _sb.channel('manager-presence', {
      config: { presence: { key: String(_manager.id) } }
    });
    // Регистрируем обработчик ДО subscribe — это обязательное требование Supabase JS v2
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
  }

  function signOut() {
    if (_presenceChannel) {
      _presenceChannel.untrack().then(function () {
        _sb.removeChannel(_presenceChannel);
      });
    }
    _sb.auth.signOut().then(function () {
      localStorage.removeItem('my_manager_id');
      localStorage.removeItem('my_manager_name');
      window.location.replace('/login.html');
    });
  }

  window.Auth = {
    signOut: signOut,
    getManager: function () { return _manager; },
    getSupabase: function () { return _sb; },
    getPresenceChannel: function () { return _presenceChannel; }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _init);
  } else {
    _init();
  }
})();
