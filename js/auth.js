/* ForValue – auth.js: login, logout and role checks.
   School demo only: the passwords live in the browser, this is NOT real security. */

(function () {
  var KEY = 'fv_session_v1';
  var HOME = { proprietario: 'home.html', segheria: 'dashboard.html', acquirente: 'marketplace.html' };

  function current() {
    var id = null;
    try { id = Number(localStorage.getItem(KEY)); } catch (e) {}
    var u = id ? FV.store.byId('utente', id) : null;
    if (!u) return null;
    return { utente: u, azienda: FV.store.byId('azienda', u.id_azienda), ruolo: u.ruolo };
  }

  // Returns the user, or null when the email/password are wrong
  function login(email, password) {
    email = String(email || '').trim().toLowerCase();
    var u = FV.store.all('utente').find(function (x) { return x.email.toLowerCase() === email && x.password === password; });
    if (!u) return null;
    setUser(u.id);
    return u;
  }
  function setUser(id) { try { localStorage.setItem(KEY, String(id)); } catch (e) {} }
  function logout() { try { localStorage.removeItem(KEY); } catch (e) {} location.href = 'index.html'; }

  // Hidden demo shortcut (logo hotspot): become the first user with this role
  function switchTo(ruolo) {
    var u = FV.store.all('utente').find(function (x) { return x.ruolo === ruolo; });
    if (u) { setUser(u.id); location.href = HOME[ruolo]; }
  }

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
  window.FV.auth = { current: current, login: login, logout: logout, switchTo: switchTo, require: require, stop: stop, home: function (r) { return HOME[r]; } };
})();
