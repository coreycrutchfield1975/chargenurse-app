(function () {
  'use strict';
  var USER_KEY = 'lp_active';
  var LAST_KEY = 'clc_last_activity';
  var TIMEOUT_MS = 30 * 60 * 1000;

  function currentUser() {
    try { return sessionStorage.getItem(USER_KEY) || ''; } catch (_) { return ''; }
  }

  function isAuthenticated() {
    var user = currentUser();
    if (!user) return false;
    var last = Number(sessionStorage.getItem(LAST_KEY) || 0);
    if (last && Date.now() - last > TIMEOUT_MS) {
      logout(false);
      return false;
    }
    return true;
  }

  function touch() {
    if (currentUser()) sessionStorage.setItem(LAST_KEY, String(Date.now()));
  }

  function requireAuth() {
    if (!isAuthenticated()) {
      var target = location.pathname.split('/').pop() || 'command-center.html';
      location.replace('index.html?return=' + encodeURIComponent(target));
      return false;
    }
    touch();
    return true;
  }

  function login(name) {
    sessionStorage.setItem(USER_KEY, name);
    touch();
  }

  function logout(redirect) {
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(LAST_KEY);
    sessionStorage.removeItem('chargenurse_auth');
    sessionStorage.removeItem('mr_auth');
    sessionStorage.removeItem('ts_auth');
    if (redirect !== false) location.href = 'index.html';
  }

  ['click', 'keydown', 'mousemove', 'touchstart'].forEach(function (eventName) {
    document.addEventListener(eventName, touch, { passive: true });
  });
  setInterval(function () {
    if (currentUser() && !isAuthenticated()) location.href = 'index.html?expired=1';
  }, 60000);

  window.CLCAuth = {
    currentUser: currentUser,
    isAuthenticated: isAuthenticated,
    requireAuth: requireAuth,
    login: login,
    logout: logout,
    touch: touch
  };
})();
