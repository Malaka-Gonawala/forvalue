/* ForValue – ui.js: Italian number/date formats and the shared parts
   (badges, phone bars, tab bar, desktop sidebar, QR code, QR link). */

(function () {
  var S = function () { return FV.store; };

  /* ---------- formats (Italian) ---------- */
  var nf = new Intl.NumberFormat(FV.i18n.loc, { maximumFractionDigits: 2 });
  var nf1 = new Intl.NumberFormat(FV.i18n.loc, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  var nf4 = new Intl.NumberFormat(FV.i18n.loc, { minimumFractionDigits: 4, maximumFractionDigits: 4 });
  var eur = new Intl.NumberFormat(FV.i18n.loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  function num(n) { return nf.format(n); }
  // Reads "45", "45,5" or "1.250,50" → number, or null when it is not a positive number
  function parseNum(str) { var r = String(str == null ? '' : str).trim(); if (!r) return null; if (FV.i18n.lang === 'en') r = r.replace(/,/g, ''); var n = Number(r.indexOf(',') >= 0 ? r.replace(/\./g, '').replace(',', '.') : r); return isFinite(n) && n > 0 ? n : null; }
  function num1(n) { return nf1.format(n); }
  function euro(n) { return eur.format(n) + ' €'; }                // 3.100,00 €
  function date(iso) { if (!iso) return ''; var p = iso.slice(0, 10).split('-'); return p[2] + '/' + p[1] + '/' + p[0]; }  // 12/03/2026
  function gps(lat, lon) { return nf4.format(lat) + ' N · ' + nf4.format(lon) + ' E'; }   // 46,2906 N · 11,4594 E
  var MESI = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];

  /* ---------- safe text ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  // Escapes text and shows any "[missing value]" as a gold placeholder
  function t(s) { return esc(s).replace(/\[[^\]]+\]/g, function (m) { return '<span class="ph">' + m + '</span>'; }); }
  // Gold placeholder when the row (or this field) is marked _ph in data.js
  function isPh(row, field) { return !!row && (row._ph === true || (Array.isArray(row._ph) && row._ph.indexOf(field) >= 0)); }
  function v(row, field, text) { var s = text == null ? row[field] : text; return isPh(row, field) ? '<span class="ph">' + esc(s) + '</span>' : t(s); }

  /* ---------- badges ---------- */
  function certPill(cert) { return cert ? '<span class="pill p-cert"><span class="ms" aria-hidden="true">verified</span>' + esc(cert) + '</span>' : ''; }
  function eudrPill(ok, short) {
    return ok ? '<span class="pill p-eudr"><span class="ms" aria-hidden="true">check_circle</span>' + (short ? 'EUDR' : 'EUDR verificato') + '</span>'
              : '<span class="pill p-st"><span class="ms" aria-hidden="true">schedule</span>EUDR in attesa</span>';
  }
  var ST_ICON = { Disponibile: 'inventory_2', 'In vendita': 'storefront', Riservato: 'lock_clock', Venduto: 'sell' };
  function statoPill(stato) { return '<span class="pill ' + (stato === 'In vendita' ? 'p-sale' : 'p-st') + '"><span class="ms" aria-hidden="true">' + ST_ICON[stato] + '</span>' + stato + '</span>'; }
  function badges(lotto, short) {
    return certPill(lotto.certificato) + eudrPill(S().eudrOk(lotto), short) + statoPill(S().statoLotto(lotto.id)) + travelPill(lotto);
  }

  /* ---------- demo transport (DEMO_TRASPORTO_MIN_S / MAX_S in data.js) ---------- */
  function sawmillName() { var a = (window.FV_SEED.azienda || []).find(function (x) { return x.id === S().sawmillId(); }); return a ? a.ragione_sociale : 'Segheria'; }
  function mmss(ms) { var s = Math.max(0, Math.ceil(ms / 1000)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }
  function hhmm(ms) { var d = new Date(ms); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); }
  function townOf(c) { return String(c || '').replace(/\s*\([A-Z]{2}\)$/, ''); }
  // Routes on img/mappa-fiemme.jpg (1504×1046 px). The SVG shows the image and the route in the same coordinates,
  // so they always line up; trkLayout() zooms the view onto the route for the size of the card.
  var ROUTES = {
    bosco: 'M765 512 C 820 518, 880 514, 935 500 S 975 472, 1010 470 S 1150 466, 1190 476 S 1215 500, 1250 512 S 1340 534, 1392 540',   // Cavalese → SS48 → Tesero
    ovest: 'M1392 540 C 1400 565, 1395 598, 1360 606 S 1260 608, 1215 610 S 1000 632, 900 645 S 760 690, 700 712 S 600 728, 540 735',   // SP232 down the valley, towards Trento / A22
    est: 'M1392 540 C 1420 543, 1445 546, 1470 552 S 1495 560, 1500 562'   // towards Predazzo / Belluno
  };
  function routeOf(t) { return t.tipo !== 'V' ? 'bosco' : /\((BL|BZ)\)$/.test(t.a.comune || '') ? 'est' : 'ovest'; }
  function trkFrac(t) { return t.arrivato || !t.ts || Date.now() >= t.arrivo ? 1 : Math.min(1, Math.max(0, (Date.now() - t.ts) / (t.arrivo - t.ts))); }
  // The trip a page shows: the one on its way, else the last one
  function tripNow(list) { list = list || []; return list.filter(function (t) { return !t.arrivato; })[0] || list[list.length - 1] || null; }
  function pillHtml(t, href) {
    if (!t || t.arrivato || !t.ts) return '';
    var p = trkFrac(t) * 100, tag = href ? 'a' : 'span';
    return '<' + tag + ' class="trkp"' + (href ? ' href="' + esc(href) + '"' : '') + ' data-trk-arr="' + t.arrivo + '" data-trk-dur="' + (t.arrivo - t.ts) + '">' +
      '<span class="pill p-trk"><span class="ms" aria-hidden="true">local_shipping</span><span>In viaggio</span> <span data-trk-left>' + mmss(t.arrivo - Date.now()) + '</span></span>' +
      '<span class="trkp-bar" aria-hidden="true"><i data-trk-fill style="width:' + p.toFixed(1) + '%"></i></span></' + tag + '>';
  }
  // Compact variant for list rows: "In viaggio 0:38" + thin bar. href → links to the QR page (Q1)
  function travelPill(lotto, href) { return pillHtml(S().trasporto(lotto), href); }
  function orderTravelPill(ordine, href) { return pillHtml(S().viaggioOrdine(ordine), href); }
  // Map card. t = a trip from store.viaggi(): { tipo P|V, ts, arrivo, arrivato, data, da: {nome, comune}, a: {nome, comune}, km }
  function tracker(t) {
    if (!t) return '';
    var live = !!t.ts, done = t.arrivato || !live || Date.now() >= t.arrivo, ord = t.tipo === 'V';
    var f = trkFrac(t), K = t.km || 18, d = ROUTES[routeOf(t)];
    var ad = function (n) { return (/^[aeiou]/i.test(n) ? 'ad ' : 'a ') + n; };
    var path = function (attrs) { return '<path d="' + d + '" pathLength="100" fill="none" stroke-linecap="round" ' + attrs + '/>'; };
    var dot = function (cls) { return '<circle class="' + cls + '" r="9" fill="#2E6B3F" stroke="#fff" stroke-width="4.5"/>'; };
    var chip = function (cls, at, icon, label) { return '<span class="trkm-chip ' + cls + '" data-at="' + at + '"><span class="ms" aria-hidden="true">' + icon + '</span><span>' + esc(label) + '</span></span>'; };
    var title = done ? (ord ? 'Consegnato ' + ad(t.a.nome) : 'Arrivato in ' + t.a.nome) : 'In viaggio';
    return '<section class="trkm card' + (done ? ' done' : '') + '" role="group" aria-label="' + (ord ? 'Viaggio verso l\'acquirente' : 'Viaggio del lotto verso la segheria') + '"' +
        (done ? '' : ' data-trk-arr="' + t.arrivo + '" data-trk-dur="' + (t.arrivo - t.ts) + '" data-trk-km-tot="' + K + '"') + '>' +
      '<div class="trkm-map">' +
        '<svg viewBox="0 0 1504 1046" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
          '<image href="img/mappa-fiemme.jpg" x="0" y="0" width="1504" height="1046"/>' + path('stroke="#fff" stroke-width="10.5" opacity=".9"') +
          path('stroke="#1F4D2C" stroke-width="4.5" stroke-dasharray="0.4 1.4"') +
          path('class="trkm-done" stroke="#DBB743" stroke-width="7.5" stroke-dasharray="' + (f * 100).toFixed(2) + ' 100"') + dot('trkm-d0') + dot('trkm-d1') + '</svg>' +
        (ord ? chip('trkm-from', 0, 'carpenter', t.da.nome) + chip('trkm-to', 1, 'storefront', t.a.nome)
             : chip('trkm-from', 0, 'forest', 'Bosco Val Fiemme') + chip('trkm-to', 1, 'carpenter', t.a.nome || sawmillName())) +
        '<span class="trkm-truck" data-f="' + f.toFixed(4) + '"><span class="ms" aria-hidden="true">' + (done ? 'check' : 'local_shipping') + '</span></span>' +
        '<div class="trkm-info"><div><b>' + esc(title) + '</b><span>' + esc(townOf(t.da.comune)) + ' → ' + esc(townOf(t.a.comune)) + '</span></div>' +
          (done ? '<div class="trkm-cd"><span class="ms" aria-hidden="true">check_circle</span></div>'
                : '<div class="trkm-cd tnum"><b data-trk-left>' + mmss(t.arrivo - Date.now()) + '</b><span>all\'arrivo</span></div>') + '</div></div>' +
      '<div class="trkm-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + Math.round(f * 100) + '" aria-label="Viaggio"><i data-trk-fill style="width:' + (f * 100).toFixed(1) + '%"></i></div>' +
      '<div class="trkm-legend tnum"><span><b data-trk-km>' + Math.round(K * f) + '</b> di ' + K + ' km</span>' + (ord ? '' : '<span>Taglio <b>fatto</b></span>') +
        (live ? '<span>Partito <b>' + hhmm(t.ts) + '</b></span>' : '') +
        (done ? '<span>' + (ord ? 'Consegnato' : 'Arrivato') + ' <b>' + (live ? hhmm(t.arrivo) : date(t.data)) + '</b></span>' : '') + '<span>© OpenStreetMap contributors</span></div></section>';
  }
  // Zooms each map onto its route (with room for the labels and the bottom text), then puts the end dots, labels
  // and truck on the route: SVG user units → px inside the card.
  function trkLayout() {
    document.querySelectorAll('.trkm-map').forEach(function (m) {
      var W = m.clientWidth, H = m.clientHeight, path = m.querySelector('.trkm-done'), svg = m.querySelector('svg');
      if (!W || !path) return;
      var bb = path.getBBox(), T = 64, B = 96, X = 40;
      var k = Math.min((W - 2 * X) / Math.max(bb.width, 1), (H - T - B) / Math.max(bb.height, 1));
      k = Math.min(2.2, Math.max(k, W / 1504, H / 1046));
      var vw = W / k, vh = H / k, clamp = function (v, lo, hi) { return Math.min(Math.max(v, lo), Math.max(lo, hi)); };
      var vx = clamp(bb.x + bb.width / 2 - vw / 2, 0, 1504 - vw), vy = clamp(bb.y + bb.height / 2 + (B - T) / 2 / k - vh / 2, 0, 1046 - vh);
      svg.setAttribute('viewBox', [vx, vy, vw, vh].map(function (n) { return n.toFixed(1); }).join(' '));
      var L = path.getTotalLength(), pt = function (f) { return path.getPointAtLength(L * Math.min(1, Math.max(0, f))); };
      [0, 1].forEach(function (i) { var c = m.querySelector('.trkm-d' + i), p = pt(i); if (c) { c.setAttribute('cx', p.x.toFixed(1)); c.setAttribute('cy', p.y.toFixed(1)); } });
      m.querySelectorAll('[data-at],[data-f]').forEach(function (el) {
        var p = pt(Number(el.getAttribute(el.hasAttribute('data-at') ? 'data-at' : 'data-f'))), x = (p.x - vx) * k, y = (p.y - vy) * k;
        el.style.left = x.toFixed(1) + 'px'; el.style.top = y.toFixed(1) + 'px';
        if (el.hasAttribute('data-at')) {   // keep the label inside the map on narrow screens
          var r = el.getBoundingClientRect(), mr = m.getBoundingClientRect(), dx = 0, dy = 0;
          if (r.right > mr.right - 8) dx = mr.right - 8 - r.right; else if (r.left < mr.left + 8) dx = mr.left + 8 - r.left;
          if (r.top < mr.top + 8) dy = mr.top + 8 - r.top;
          if (dx) el.style.left = (x + dx).toFixed(1) + 'px';
          if (dy) el.style.top = (y + dy).toFixed(1) + 'px';
        }
      });
      m.classList.add('ready');
    });
  }
  document.addEventListener('DOMContentLoaded', trkLayout);
  addEventListener('load', trkLayout);
  addEventListener('resize', trkLayout);
  // Live: countdowns, bars, km and truck every second; every 5 s (and when a countdown ends) check for arrivals.
  // On arrival the page redraws itself (kept simple: a quick reload, unless you are typing).
  (function live() {
    var ended = false;
    function typing() { var a = document.activeElement; return a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName); }
    function arrived() { if (!typing()) location.reload(); }
    setInterval(function () {
      var now = Date.now(), hit = false;
      document.querySelectorAll('[data-trk-arr]').forEach(function (el) {
        var arr = Number(el.getAttribute('data-trk-arr')), left = arr - now, dur = Number(el.getAttribute('data-trk-dur'));
        var f = dur ? Math.min(1, Math.max(0, 1 - left / dur)) : 1;
        el.querySelectorAll('[data-trk-left]').forEach(function (x) { x.textContent = mmss(left); });
        el.querySelectorAll('[data-trk-fill]').forEach(function (x) { x.style.width = (f * 100).toFixed(1) + '%'; });
        var bar = el.querySelector('[role=progressbar]'); if (bar) bar.setAttribute('aria-valuenow', Math.round(f * 100));
        var km = el.querySelector('[data-trk-km]'); if (km) km.textContent = Math.round(Number(el.getAttribute('data-trk-km-tot') || 18) * f);
        var done = el.querySelector('.trkm-done'); if (done) done.setAttribute('stroke-dasharray', (f * 100).toFixed(2) + ' 100');
        var tr = el.querySelector('.trkm-truck'); if (tr) tr.setAttribute('data-f', f.toFixed(4));
        if (left <= 0) hit = true;
      });
      trkLayout();
      if (hit && !ended) { ended = true; S().tick(); arrived(); }
    }, 1000);
    setInterval(function () { if (S().tick()) arrived(); }, 5000);
  })();
  var ORD = { inviato: ['Inviato', 'send', 'p-eudr'], accettato: ['Accettato', 'thumb_up', 'p-cert'], consegnato: ['Consegnato', 'check', 'p-st'], rifiutato: ['Rifiutato', 'block', 'p-st'], annullato: ['Annullato', 'close', 'p-st'] };
  function ordinePill(stato) { var o = ORD[stato]; return '<span class="pill ' + o[2] + '"><span class="ms" aria-hidden="true">' + o[1] + '</span>' + o[0] + '</span>'; }
  function scartiPill() { return '<span class="pill p-scarti"><span class="ms" aria-hidden="true">recycling</span>Scarti</span>'; }

  function specieName(lotto) { return S().byId('specie', lotto.id_specie).nome_comune; }

  /* ---------- phone parts ---------- */
  // IT · EN switch (js/i18n.js does the rest)
  var LANG = '<div class="lang" role="group" aria-label="Lingua">' + ['it', 'en'].map(function (l) {
    var on = FV.i18n.lang === l;
    return '<button type="button" data-lang="' + l + '"' + (on ? ' class="on"' : '') + ' aria-pressed="' + on + '" lang="' + l + '"><span>' + l.toUpperCase() + '</span></button>';
  }).join('') + '</div>';
  function logoHTML() { return '<span class="logo"><span class="mk"><span class="ms" aria-hidden="true">forest</span></span>ForValue</span>'; }

  // Logo link: your own home when logged in, else the login page
  function homeHref() { var s = FV.auth.current(); return s ? FV.auth.home(s.ruolo) : 'index.html'; }
  // Top bar with logo
  function phoneBar(opts) {
    opts = opts || {};
    var left = '<a class="logo-btn" href="' + homeHref() + '" aria-label="ForValue, home">' + logoHTML() + '</a>';
    return '<header class="bar">' + left + (opts.right || LANG) + '</header>';
  }
  // Top bar with ← and a title
  function backBar(title, href) {
    return '<header class="bar"><div class="title"><a class="back" href="' + href + '" aria-label="Indietro"><span class="ms" aria-hidden="true">arrow_back</span></a><h1 class="h2">' + esc(title) + '</h1></div></header>';
  }
  /* ---------- menus: each role sees only its own functions ---------- */
  // [key, href, icon, label]. Phone tab 3 (index 2) is the gold centre button.
  var NAV = {
    proprietario: {
      tabs: [['home', 'home.html', 'home', 'Home'], ['lotti', 'lotti.html', 'inventory_2', 'Lotti'], ['nuovo', 'nuovo-lotto.html', 'add', 'Nuovo lotto'], ['profilo', 'profilo.html', 'person', 'Profilo'], ['altro', 'altro.html', 'menu', 'Altro']],
      side: [['home', 'home.html', 'home', 'Home'], ['lotti', 'lotti.html', 'inventory_2', 'I miei lotti'], ['nuovo', 'nuovo-lotto.html', 'add_box', 'Nuovo lotto'],
        ['certificati', 'certificati.html', 'workspace_premium', 'Certificati'], ['notifiche', 'notifiche.html', 'notifications', 'Notifiche']]   // profile = user block at the bottom
    },
    segheria: {
      tabs: [['dashboard', 'dashboard.html', 'space_dashboard', 'Home'], ['lotti', 'segheria-lotti.html', 'inventory_2', 'Lotti'], ['vendi', '#vendi', 'sell', 'Vendi'], ['ordini', 'ordini-ricevuti.html', 'receipt_long', 'Ordini'], ['altro', 'altro.html', 'menu', 'Altro']],
      side: [['dashboard', 'dashboard.html', 'space_dashboard', 'Dashboard'], ['lotti', 'segheria-lotti.html', 'inventory_2', 'Lotti ricevuti'], ['offerte', 'offerte.html', 'sell', 'Le mie offerte'],
        ['circolarita', 'offerte.html?cat=scarti', 'recycling', 'Circolarità'], ['ordini', 'ordini-ricevuti.html', 'move_to_inbox', 'Ordini ricevuti']]
    },
    acquirente: {
      tabs: [['marketplace', 'marketplace.html', 'storefront', 'Mercato'], ['circolarita', 'marketplace.html?tab=scarti', 'recycling', 'Scarti'], ['carrello', 'carrello.html', 'shopping_cart', 'Carrello'], ['ordini', 'ordini.html', 'receipt_long', 'Ordini'], ['altro', 'altro.html', 'menu', 'Altro']],
      side: [['marketplace', 'marketplace.html', 'storefront', 'Marketplace'], ['circolarita', 'marketplace.html?tab=scarti', 'recycling', 'Circolarità'], ['carrello', 'carrello.html', 'shopping_cart', 'Carrello'], ['ordini', 'ordini.html', 'receipt_long', 'I miei ordini']]
    }
  };

  // Sawmill can sell a batch it holds unless it is sold or still on its way (unsawn batches get a sawing step first)
  function canSell(l) {
    var st = S(), t = st.trasporto(l);
    return st.statoLotto(l.id) !== 'Venduto' && !(t && !t.arrivato);
  }
  // Sawmill "Vendi": the first received batch it can sell (no offer yet first), else Le mie offerte
  function vendiHref() {
    var s = FV.auth.current(), st = S();
    var ok = st.lottiOfSawmill(s.azienda.id).filter(canSell);
    ok.sort(function (a, b) { return st.offerteOfLotto(a.id).length - st.offerteOfLotto(b.id).length || (a.codice_qr < b.codice_qr ? 1 : -1); });
    return ok.length ? 'lotto.html?c=' + encodeURIComponent(ok[0].codice_qr) + '&vendi=1' : 'offerte.html';
  }
  function navHref(x) { return x[1] === '#vendi' ? vendiHref() : x[1]; }
  function cartCount() { var n = S().getCart().length; return n ? '<span class="count">' + n + '</span>' : ''; }
  // Sawmill: new orders still to accept or refuse
  function newOrders() {
    var s = FV.auth.current(), st = S();
    var n = st.all('ordine').filter(function (o) { var off = st.byId('offerta', o.id_offerta); return o.stato === 'inviato' && off && off.id_azienda === s.azienda.id; }).length;
    return n ? '<span class="count">' + n + '</span>' : '';
  }
  // Owner: notifications not opened yet (on Notifiche, and on Altro in the phone tab bar)
  function newsCount() {
    var s = FV.auth.current(); if (!s || !s.azienda) return '';
    var n = newsUnreadCount(s.azienda.id);
    return n ? '<span class="count" aria-label="' + n + ' nuove">' + n + '</span>' : '';
  }
  function badge(role, key) { return key === 'carrello' ? cartCount() : role === 'segheria' && key === 'ordini' ? newOrders() : role === 'proprietario' && (key === 'notifiche' || key === 'altro') ? newsCount() : ''; }

  function tabbar(role, active) {
    return '<nav class="tabbar" aria-label="Menu">' + NAV[role].tabs.map(function (x, i) {
      var cur = x[0] === active ? ' aria-current="page"' : '';
      var b = badge(role, x[0]);
      if (i === 2) return '<a class="plus" href="' + navHref(x) + '"' + cur + '><i><span class="ms" aria-hidden="true">' + x[2] + '</span>' + b + '</i>' + x[3] + '</a>';
      return '<a href="' + navHref(x) + '"' + cur + '><i class="ic"><span class="ms" aria-hidden="true">' + x[2] + '</span>' + b + '</i>' + x[3] + '</a>';
    }).join('') + '</nav>';
  }

  /* ---------- desktop sidebar ---------- */
  function sidebar(role, active) {
    var session = FV.auth.current();
    return '<aside class="sb"><div class="sb-in"><a class="logo" href="' + FV.auth.home(role) + '" aria-label="ForValue, home">' + logoHTML().replace(/^<span class="logo">|<\/span>$/g, '') + '</a>' +
      '<nav aria-label="Menu">' + NAV[role].side.map(function (x) {
        return '<a href="' + navHref(x) + '"' + (x[0] === active ? ' aria-current="page"' : '') + '><span class="ms" aria-hidden="true">' + x[2] + '</span>' + x[3] + badge(role, x[0]) + '</a>';
      }).join('') + '</nav>' +
      '<div class="foot"><a class="who" href="profilo.html"' + (/profilo\.html$/.test(location.pathname) ? ' aria-current="page"' : '') + ' aria-label="Profilo: ' + esc(session.azienda.ragione_sociale) + '"><span class="ms" aria-hidden="true">account_circle</span>' + esc(session.azienda.ragione_sociale) + '</a>' +
      '<button type="button" class="lnk" data-reset><span class="ms" aria-hidden="true">restart_alt</span>Ripristina dati demo</button>' +
      '<button type="button" class="lnk" data-logout><span class="ms" aria-hidden="true">logout</span>Esci</button>' + LANG + '</div></div></aside>';
  }

  /* Page shell for every logged-in page: desktop sidebar (≥ 900 px) + phone tab bar (< 900 px).
     Desktop pages also get the phone top bar; phone pages get a desktop title (crumb + h1).
     opts: { title, crumb, action } – the desktop title for phone pages; noTabs – no phone tab bar */
  function shell(active, opts) {
    opts = opts || {};
    var s = FV.auth.current(), role = s.ruolo, b = document.body;
    b.classList.add('app');
    var slot = document.getElementById('sb');
    if (!slot) { slot = document.createElement('div'); slot.id = 'sb'; b.insertBefore(slot, b.firstChild); }
    slot.innerHTML = sidebar(role, active);
    if (!opts.noTabs) {   // sub-pages with a ← bar (and Nuovo lotto, with its Salva bar) have no tab bar on the phone
      var tabs = document.getElementById('tbar');
      if (!tabs) { tabs = document.createElement('div'); tabs.id = 'tbar'; b.appendChild(tabs); }
      tabs.innerHTML = tabbar(role, active);
      b.classList.add('has-tabs');
    }
    if (b.classList.contains('desk') && !document.getElementById('pbar')) {
      var pb = document.createElement('div'); pb.id = 'pbar'; pb.innerHTML = phoneBar();
      slot.insertAdjacentElement('afterend', pb);
    }
    if (opts.title && !document.getElementById('dhead')) {
      var dh = document.createElement('div'); dh.id = 'dhead'; dh.className = 'dhead';
      dh.innerHTML = '<div class="grow"><div class="crumb">' + esc(s.azienda.ragione_sociale) + (opts.crumb ? ' <span class="ms" aria-hidden="true">chevron_right</span> ' + opts.crumb : '') + '</div><h1 class="h1">' + esc(opts.title) + '</h1></div>' + (opts.action || '');
      var bar = document.getElementById('bar');
      (bar || slot).insertAdjacentElement('afterend', dh);
    }
    return role;
  }
  // Owner news (P8 Notifiche, owner desktop Home): every step after the cut, newest first
  function ownerNews(idAzienda) {
    var st = S(), ev = [], rank = { P: 1, L: 2, V: 3 };
    var ad = function (n) { return (/^[aeiou]/i.test(n) ? 'ad ' : 'a ') + n; };
    rank.C = 4;
    st.lottiOfOwner(idAzienda).forEach(function (l) {
      st.storico(l.id).forEach(function (e) { if (e.tipo !== 'T') ev.push({ e: e, l: l }); });
      st.viaggi(l).forEach(function (t) { if (t.tipo === 'V' && t.arrivato) ev.push({ e: { tipo: 'C', data: t.data, icon: 'local_shipping', titolo: 'Consegnato ' + ad(t.a.nome) }, l: l }); });
    });
    ev.sort(function (a, b) { return (b.e.data > a.e.data ? 1 : b.e.data < a.e.data ? -1 : 0) || rank[b.e.tipo] - rank[a.e.tipo]; });
    return ev.map(function (x) {
      var e = x.e;
      return { l: x.l, icon: e.icon, data: e.data, title: e.tipo === 'L' ? (/^Tronchi/.test(e.titolo) ? 'Tronchi pronti per la vendita' : 'Segato in tavole e scarti') : e.titolo,
        detail: e.tipo === 'L' ? e.titolo.replace(/^(Segato|Tronchi selezionati): /, '') : e.tipo === 'V' ? (e.raw.dett || '') : '' };
    });
  }

  // Notification dots: which news this company has opened (fv_read_v1 = { idAzienda: [keys] }). The first time,
  // everything already there counts as read, so only news that happens during the demo gets a dot.
  var READ = 'fv_read_v1';
  function newsKey(x) { return x.l.id + '|' + x.title + '|' + x.data; }
  function readAll() { try { return JSON.parse(localStorage.getItem(READ)) || {}; } catch (e) { return {}; } }
  function newsUnread(idAzienda, list) {
    var all = readAll(), seen = all[idAzienda];
    if (!seen) { seen = all[idAzienda] = list.map(newsKey); try { localStorage.setItem(READ, JSON.stringify(all)); } catch (e) {} }
    return function (x) { return seen.indexOf(newsKey(x)) < 0; };
  }
  function newsRead(idAzienda, key) {
    var all = readAll(); all[idAzienda] = all[idAzienda] || [];
    if (all[idAzienda].indexOf(key) < 0) all[idAzienda].push(key);
    try { localStorage.setItem(READ, JSON.stringify(all)); } catch (e) {}
  }
  // A news row: the gold dot goes away once it is opened
  function newsRow(idAzienda, x, unread, compact) {
    return '<a class="row" data-nk="' + esc(newsKey(x)) + '" href="' + esc(qrUrl(x.l)) + '"' + (compact ? ' style="min-height:0;padding:10px 16px"' : '') + '>' +
      '<span class="tile"' + (compact ? ' style="width:32px;height:32px;border-radius:8px"' : '') + '><span class="ms"' + (compact ? ' style="font-size:20px"' : '') + ' aria-hidden="true">' + x.icon + '</span></span>' +
      '<span class="grow"><b style="font-weight:600' + (compact ? ';font-size:14px' : '') + '">' + t(x.title) + '</b><div class="' + (compact ? 'xs' : 'small') + ' muted">' + v(x.l, 'codice_qr') + ' · ' + (x.detail && !compact ? esc(x.detail) + ' · ' : '') + date(x.data) + '</div></span>' +
      (unread ? '<span class="ndot" role="img" aria-label="Nuova"></span>' : '') + '</a>';
  }
  function newsUnreadCount(idAzienda) { var list = ownerNews(idAzienda), isNew = newsUnread(idAzienda, list); return list.filter(isNew).length; }
  function newsReadAll(idAzienda) { var all = readAll(); all[idAzienda] = ownerNews(idAzienda).map(newsKey); try { localStorage.setItem(READ, JSON.stringify(all)); } catch (e) {} }
  function newsList(idAzienda, n, compact) {
    var list = ownerNews(idAzienda), isNew = newsUnread(idAzienda, list);
    return list.slice(0, n).map(function (x) { return newsRow(idAzienda, x, isNew(x), compact); }).join('');
  }
  document.addEventListener('click', function (ev) {
    var a = ev.target.closest && ev.target.closest('[data-nk]'), u = FV.auth && FV.auth.current && FV.auth.current();
    if (!a || !u || !u.azienda) return;
    newsRead(u.azienda.id, a.getAttribute('data-nk'));
    var d = a.querySelector('.ndot'); if (d) d.remove();
    document.querySelectorAll('.count').forEach(function (c) { if (c.parentNode.closest('[href="notifiche.html"],[href="altro.html"]')) { var n = Number(c.textContent) - 1; if (n > 0) c.textContent = n; else c.remove(); } });
  });

  /* ---------- QR ---------- */
  function b64url(str) {
    var bytes = new TextEncoder().encode(str), bin = '';
    bytes.forEach(function (b) { bin += String.fromCharCode(b); });
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function unb64url(s) {
    s = s.replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '=';
    var bin = atob(s), bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }
  // The QR link carries the batch inside the URL (qr.html?d=…), so it opens on any phone.
  // Short keys keep the QR small: c code, s species, v m³, t cut date, p parcel, g [lat,lon],
  // ce cert, cx cert expiry year, o owner (index in n), n company names, m their towns,
  // f CO₂ factor (only if not 0,7), h steps [type, yymmdd, ...names as indexes, detail]
  function lottoView(lotto) {
    var st = S(), part = st.byId('particella', lotto.id_particella), sp = st.byId('specie', lotto.id_specie), own = st.byId('azienda', lotto.id_azienda);
    var cert = lotto.certificato ? st.all('certificazione').find(function (c) { return c.id_azienda === own.id && c.schema === lotto.certificato; }) : null;
    return { code: lotto.codice_qr, species: sp.nome_comune, vol: lotto.volume_m3, cut: lotto.data_taglio, parcel: part.nome,
      lat: part.lat, lon: part.lon, cert: lotto.certificato, certYear: cert ? cert.data_scadenza.slice(0, 4) : null,
      owner: own.ragione_sociale, factor: sp.fattore_co2, eudr: st.eudrOk(lotto), stato: st.statoLotto(lotto.id),
      steps: st.storico(lotto.id), trasporto: st.trasporto(lotto), viaggi: st.viaggi(lotto) };
  }
  function qrPayload(lotto) {
    var st = S(), raw = st.storicoRaw(lotto.id), view = lottoView(lotto), names = [view.owner];
    var ix = function (n) { var i = names.indexOf(n); if (i < 0) { names.push(n); i = names.length - 1; } return i; };
    var d6 = function (iso) { return iso.slice(2, 4) + iso.slice(5, 7) + iso.slice(8, 10); };
    var h = raw.filter(function (e) { return e.tipo !== 'T'; }).map(function (e) {
      if (e.tipo === 'P') return ['P', d6(e.data), ix(e.da), ix(e.a)];
      if (e.tipo === 'L') return ['L', d6(e.data), ix(e.chi), e.dett];
      return ['V', d6(e.data), ix(e.da), ix(e.a), e.dett || ''];
    });
    // Deliveries to buyers: [from, to, left ms, trip s] while live, or [from, to, delivered date] (sample data)
    var j = st.viaggi(lotto).filter(function (t) { return t.tipo === 'V'; }).map(function (t) {
      var ord = st.ordiniOfLotto(lotto.id).find(function (o) { return o.spedito_ts === t.ts && t.ts; });
      return t.ts ? [ix(t.da.nome), ix(t.a.nome), t.ts, ord ? ord.trasporto_s || 60 : Math.round((t.arrivo - t.ts) / 1000)] : [ix(t.da.nome), ix(t.a.nome), d6(t.data)];
    });
    var o = { c: view.code, s: view.species, v: view.vol, t: d6(view.cut), p: view.parcel, n: names, m: names.map(st.comuneByName), h: h };
    if (j.length) o.j = j;
    if (view.lat != null) o.g = [view.lat, view.lon];
    if (view.cert) { o.ce = view.cert; o.cx = view.certYear; }
    if (view.factor !== 0.7) o.f = view.factor;
    if (lotto.creato_ts) o.k = [lotto.creato_ts, lotto.trasporto_s || 60];   // demo transport [created ms, trip s]: same trip on any phone
    return o;
  }
  // Rebuilds the same view from the link, with no storage at all
  function viewFromPayload(o) {
    var iso = function (d) { return '20' + d.slice(0, 2) + '-' + d.slice(2, 4) + '-' + d.slice(4, 6); };
    var comune = function (n) { var i = o.n.indexOf(n); return (o.m && o.m[i]) || '[comune]'; };
    var raw = [{ tipo: 'T', data: iso(o.t), chi: o.n[0], dove: o.p }].concat((o.h || []).map(function (x) {
      if (x[0] === 'P') return { tipo: 'P', data: iso(x[1]), da: o.n[x[2]], a: o.n[x[3]] };
      if (x[0] === 'L') return { tipo: 'L', data: iso(x[1]), chi: o.n[x[2]], dett: x[3] };
      return { tipo: 'V', data: iso(x[1]), da: o.n[x[2]], a: o.n[x[3]], dett: x[4] };
    }));
    // Demo transport (k = created ms): before arrival show the tracker, after it add the "Trasferito" step
    var trasporto = null;
    if (o.k) {
      var k = Array.isArray(o.k) ? o.k : [o.k, 60], arr = k[0] + k[1] * 1000, there = raw.some(function (e) { return e.tipo === 'P'; });
      if (!there && Date.now() >= arr) {
        var a = new Date(arr), sm = sawmillName();
        raw.push({ tipo: 'P', data: a.getFullYear() + '-' + String(a.getMonth() + 1).padStart(2, '0') + '-' + String(a.getDate()).padStart(2, '0'), da: o.n[0], a: sm });
        var az = (window.FV_SEED.azienda || []).find(function (x) { return x.ragione_sociale === sm; });
        if (o.n.indexOf(sm) < 0) { o.n.push(sm); o.m = (o.m || []).concat(az ? az.comune : ''); }
        there = true;
      }
      var smAz = (window.FV_SEED.azienda || []).find(function (x) { return x.id === S().sawmillId(); });
      trasporto = { ts: k[0], arrivo: arr, arrivato: there, da: (o.m && o.m[0]) || '', a: smAz ? smAz.comune : '' };
    }
    // Trips for the map card (same shape as store.viaggi)
    var seedAz = function (n) { return (window.FV_SEED.azienda || []).find(function (x) { return x.ragione_sociale === n; }) || {}; };
    var pl = function (n) { return { nome: n, comune: comune(n) !== '[comune]' ? comune(n) : (seedAz(n).comune || ''), km: seedAz(n).km_segheria || 0 }; };
    var viaggi = [];
    raw.forEach(function (e) {
      if (e.tipo === 'P' && !trasporto) viaggi.push({ tipo: 'P', ts: null, arrivo: null, arrivato: true, data: e.data, da: pl(e.da), a: pl(e.a), km: 18 });
    });
    (o.j || []).forEach(function (x) {
      var to = pl(o.n[x[1]]), from = pl(o.n[x[0]]);
      if (x.length > 3) {
        var end = x[2] + x[3] * 1000, d = new Date(end);
        viaggi.push({ tipo: 'V', ts: x[2], arrivo: end, arrivato: Date.now() >= end, data: d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'), da: from, a: to, km: to.km });
      } else viaggi.push({ tipo: 'V', ts: null, arrivo: null, arrivato: true, data: iso(x[2]), da: from, a: to, km: to.km });
    });
    viaggi.sort(function (a, b) { return a.data < b.data ? -1 : a.data > b.data ? 1 : 0; });
    if (trasporto) viaggi.unshift({ tipo: 'P', ts: trasporto.ts, arrivo: trasporto.arrivo, arrivato: trasporto.arrivato, data: iso(o.t), da: pl(o.n[0]), a: pl(sawmillName()), km: 18 });
    var sold = raw.some(function (e) { return e.tipo === 'V'; });
    return { code: o.c, species: o.s, vol: o.v, cut: iso(o.t), parcel: o.p, lat: o.g ? o.g[0] : null, lon: o.g ? o.g[1] : null,
      cert: o.ce || null, certYear: o.cx || null, owner: o.n[0], factor: o.f || 0.7, eudr: !!(o.g && o.t), stato: sold ? 'Venduto' : 'Disponibile',
      steps: raw.map(function (e) { var t = S().stepText(e, comune); t.data = e.data; t.tipo = e.tipo; return t; }), trasporto: trasporto, viaggi: viaggi };
  }
  function qrUrl(lotto) { return new URL('qr.html?d=' + b64url(JSON.stringify(qrPayload(lotto))), location.href).href; }
  function qrSvg(text) {
    var q = qrcode(0, 'L'); q.addData(unescape(encodeURIComponent(text))); q.make();
    return q.createSvgTag({ cellSize: 4, margin: 2, scalable: true, alt: 'Codice QR del lotto' });
  }

  /* ---------- order number and photos ---------- */
  // ORD-2026-0001: year of the order + id with 4 digits
  function ordCode(o) { return 'ORD-' + String(o.data).slice(0, 4) + '-' + String(o.id).padStart(4, '0'); }

  // Real photos go in img/ (jpg, under 200 KB). Until a file exists the green tile under it shows:
  // the <img> removes itself when the file is missing.
  var PHOTO = { tavole: 'tavole.jpg', cippato: 'cippato.jpg', segatura: 'segatura.jpg', tronchi: 'tronchi.jpg', mappa: 'mappa-fiemme.jpg' };
  var OSM = '<div class="osm">© OpenStreetMap contributors</div>';
  function photoKey(prodotto) { var w = prodotto ? prodotto.descrizione.split(' ')[0].toLowerCase() : ''; return PHOTO[w] ? w : 'tronchi'; }
  function photo(key, alt) { return '<img class="photo-x" src="img/' + PHOTO[key] + '"' + (key === 'mappa' ? ' style="object-position:51% 49%"' : '') + ' alt="' + esc(alt || '') + '" onerror="this.remove()">'; }

  /* ---------- small helpers ---------- */
  function flash(msg) { try { sessionStorage.setItem('fv_flash', msg); } catch (e) {} }
  function toast(msg) {
    var el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status');
    el.innerHTML = '<span class="ms" aria-hidden="true">check_circle</span>' + esc(msg);
    document.body.appendChild(el); setTimeout(function () { el.remove(); }, 3200);
  }
  function showFlash() { var m = null; try { m = sessionStorage.getItem('fv_flash'); sessionStorage.removeItem('fv_flash'); } catch (e) {} if (m) toast(m); }
  function param(name) { return new URLSearchParams(location.search).get(name); }

  // Global clicks: logo shortcut, logout, reset
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-logout]')) { FV.auth.logout(); return; }
    if (e.target.closest('[data-reset]')) {
      if (confirm('Ripristinare i dati demo? Lotti, offerte e ordini creati verranno cancellati e dovrai accedere di nuovo.')) {
        FV.store.reset(); FV.auth.clear(); location.href = 'index.html';   // reset also logs everyone out
      }
    }
  });
  document.addEventListener('DOMContentLoaded', showFlash);

  window.FV = window.FV || {};
  window.FV.ui = {
    num: num, num1: num1, parseNum: parseNum, euro: euro, date: date, gps: gps, MESI: MESI, esc: esc, t: t, v: v, isPh: isPh,
    certPill: certPill, eudrPill: eudrPill, statoPill: statoPill, tracker: tracker, travelPill: travelPill, badges: badges, ordinePill: ordinePill, scartiPill: scartiPill, specieName: specieName,
    phoneBar: phoneBar, backBar: backBar, tabbar: tabbar, sidebar: sidebar, shell: shell, homeHref: homeHref, ordCode: ordCode, photo: photo, OSM: OSM, photoKey: photoKey, PHOTO: PHOTO, ownerNews: ownerNews, NAV: NAV, vendiHref: vendiHref, canSell: canSell, logoHTML: logoHTML, LANG: LANG,
    qrPayload: qrPayload, qrUrl: qrUrl, lottoView: lottoView, newsList: newsList, newsUnreadCount: newsUnreadCount, newsReadAll: newsReadAll, trkLayout: trkLayout, tripNow: tripNow, orderTravelPill: orderTravelPill, viewFromPayload: viewFromPayload, b64url: b64url, qrSvg: qrSvg, unb64url: unb64url, flash: flash, toast: toast, param: param
  };
})();
