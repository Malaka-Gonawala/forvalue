/* ForValue – auth.js: login, logout and role checks.
   School demo only: the passwords live in the browser, this is NOT real security. */

(function () {
  // Login tokens: one flag per role, at most one true (the user who is logged in).
  // { proprietario: false, segheria: false, acquirente: false }
  var KEY = 'fv_tokens_v1';
  var OLD = 'fv_session_v1';   // older versions kept the user id here
  var ROLES = ['proprietario', 'segheria', 'acquirente'];
  var HOME = { proprietario: 'home.html', segheria: 'dashboard.html', acquirente: 'marketplace.html' };

  function noTokens() { var t = {}; ROLES.forEach(function (r) { t[r] = false; }); return t; }
  function saveTokens(t) { try { localStorage.setItem(KEY, JSON.stringify(t)); } catch (e) {} }
  function tokens() {
    var t = null;
    try {
      var old = localStorage.getItem(OLD);
      if (old) {   // move an old session to the tokens once
        var u = FV.store.byId('utente', Number(old)); t = noTokens(); if (u) t[u.ruolo] = true;
        saveTokens(t); localStorage.removeItem(OLD); return t;
      }
      t = JSON.parse(localStorage.getItem(KEY));
    } catch (e) {}
    if (!t || typeof t !== 'object') { t = noTokens(); saveTokens(t); }
    return t;
  }
  // Logged-in role (the one token that is true), or null
  function activeRole() { var t = tokens(); return ROLES.find(function (r) { return t[r] === true; }) || null; }

  function current() {
    var r = activeRole();
    var u = r ? FV.store.all('utente').find(function (x) { return x.ruolo === r; }) : null;
    if (!u || u.eliminato) return null;
    return { utente: u, azienda: FV.store.byId('azienda', u.id_azienda), ruolo: u.ruolo };
  }

  // Returns the user, or null when the email/password are wrong. Only this user's token becomes true.
  function login(email, password) {
    email = String(email || '').trim().toLowerCase();
    var u = FV.store.all('utente').find(function (x) { return x.email.toLowerCase() === email && x.password === password; });
    if (!u || u.eliminato) return null;   // deleted in the demo: index.html says so
    var t = noTokens(); t[u.ruolo] = true; saveTokens(t);
    return u;
  }
  function logout() { saveTokens(noTokens()); location.href = 'index.html'; }
  function clear() { saveTokens(noTokens()); }

  // Stops the page script while the browser moves to another page (no red error in the console)
  window.addEventListener('error', function (e) { if (String(e.message).indexOf('fv-stop') >= 0) e.preventDefault(); });
  function stop() { throw new Error('fv-stop'); }

  // Call at the top of every protected page: FV.auth.require(['segheria'])
  function require(roles) {
    var s = current();
    if (!s) { location.replace('index.html'); stop(); }
    // Another role's page: back to your own home
    if (roles.indexOf(s.ruolo) < 0) { location.replace(HOME[s.ruolo]); stop(); }
    return s;
  }

  window.FV = window.FV || {};
  window.FV.auth = { current: current, login: login, logout: logout, clear: clear, tokens: tokens, require: require, stop: stop, home: function (r) { return HOME[r]; } };
})();
