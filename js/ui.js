/* ForValue – ui.js: Italian number/date formats and the shared parts
   (badges, phone bars, tab bar, desktop sidebar, QR code, QR link). */

(function () {
  var S = function () { return FV.store; };

  /* ---------- formats (Italian) ---------- */
  var nf = new Intl.NumberFormat('it-IT', { maximumFractionDigits: 2 });
  var nf1 = new Intl.NumberFormat('it-IT', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  var nf4 = new Intl.NumberFormat('it-IT', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
  var eur = new Intl.NumberFormat('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  function num(n) { return nf.format(n); }
  // Reads "45", "45,5" or "1.250,50" → number, or null when it is not a positive number
  function parseNum(str) { var r = String(str == null ? '' : str).trim(); if (!r) return null; var n = Number(r.indexOf(',') >= 0 ? r.replace(/\./g, '').replace(',', '.') : r); return isFinite(n) && n > 0 ? n : null; }
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
  var ST_ICON = { Disponibile: 'storefront', Riservato: 'lock_clock', Venduto: 'sell' };
  function statoPill(stato) { return '<span class="pill p-st"><span class="ms" aria-hidden="true">' + ST_ICON[stato] + '</span>' + stato + '</span>'; }
  function badges(lotto, short) {
    return certPill(lotto.certificato) + eudrPill(S().eudrOk(lotto), short) + statoPill(S().statoLotto(lotto.id)) + travelPill(lotto);
  }

  /* ---------- demo transport (DEMO_TRASPORTO_S in data.js) ---------- */
  function sawmillName() { var a = (window.FV_SEED.azienda || []).find(function (x) { return x.id === S().sawmillId(); }); return a ? a.ragione_sociale : 'Segheria'; }
  function mmss(ms) { var s = Math.max(0, Math.ceil(ms / 1000)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }
  // Small chip for list rows while the batch is on its way
  function travelPill(lotto) {
    var t = S().trasporto(lotto);
    if (!t || t.arrivato) return '';
    return '<span class="pill p-trk" data-trk-arr="' + t.arrivo + '"><span class="ms" aria-hidden="true">local_shipping</span>In viaggio · <span data-trk-left>' + mmss(t.arrivo - Date.now()) + '</span></span>';
  }
  // 3-step tracker: Taglio ✓ → In viaggio → Arrivato in segheria. t = { ts, arrivo, arrivato }
  function tracker(t) {
    if (!t) return '';
    var dur = t.arrivo - t.ts, done = t.arrivato || Date.now() >= t.arrivo, name = sawmillName();
    var pct = done ? 100 : Math.min(100, Math.max(0, (Date.now() - t.ts) / dur * 100));
    return '<div class="trk box' + (done ? ' done' : '') + '" role="group" aria-label="Viaggio del lotto verso la segheria"' + (done ? '' : ' data-trk-arr="' + t.arrivo + '" data-trk-dur="' + dur + '"') + '>' +
      '<ol class="trk-steps">' +
        '<li class="ok"><span class="ms" aria-hidden="true">check_circle</span>Taglio</li>' +
        '<li class="' + (done ? 'ok' : 'cur') + '"><span class="ms" aria-hidden="true">' + (done ? 'check_circle' : 'local_shipping') + '</span>In viaggio</li>' +
        '<li class="' + (done ? 'ok' : '') + '"><span class="ms" aria-hidden="true">' + (done ? 'check_circle' : 'warehouse') + '</span>Arrivato in ' + esc(name) + '</li></ol>' +
      '<div class="trk-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + Math.round(pct) + '" aria-label="Viaggio"><i style="width:' + pct.toFixed(1) + '%"></i></div>' +
      '<div class="trk-txt small">' + (done ? 'Arrivato in ' + esc(name) + '.' : 'Arrivo in segheria tra <b data-trk-left>' + mmss(t.arrivo - Date.now()) + '</b>') + '</div></div>';
  }
  // Live: countdowns every second; every 5 s (and when a countdown ends) check for arrivals.
  // On arrival the page redraws itself (kept simple: a quick reload, unless you are typing).
  (function live() {
    var ended = false;
    function typing() { var a = document.activeElement; return a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName); }
    function arrived() { if (!typing()) location.reload(); }
    setInterval(function () {
      var now = Date.now(), hit = false;
      document.querySelectorAll('[data-trk-arr]').forEach(function (el) {
        var arr = Number(el.getAttribute('data-trk-arr')), left = arr - now;
        el.querySelectorAll('[data-trk-left]').forEach(function (x) { x.textContent = mmss(left); });
        var dur = Number(el.getAttribute('data-trk-dur')), bar = el.querySelector('.trk-bar');
        if (dur && bar) { var p = Math.min(100, Math.max(0, 100 - left / dur * 100)); bar.firstChild.style.width = p.toFixed(1) + '%'; bar.setAttribute('aria-valuenow', Math.round(p)); }
        if (left <= 0) hit = true;
      });
      if (hit && !ended) { ended = true; S().tick(); arrived(); }
    }, 1000);
    setInterval(function () { if (S().tick()) arrived(); }, 5000);
  })();
  var ORD = { inviato: ['Inviato', 'send', 'p-eudr'], accettato: ['Accettato', 'thumb_up', 'p-cert'], consegnato: ['Consegnato', 'check', 'p-st'], rifiutato: ['Rifiutato', 'block', 'p-st'], annullato: ['Annullato', 'close', 'p-st'] };
  function ordinePill(stato) { var o = ORD[stato]; return '<span class="pill ' + o[2] + '"><span class="ms" aria-hidden="true">' + o[1] + '</span>' + o[0] + '</span>'; }
  function scartiPill() { return '<span class="pill p-scarti"><span class="ms" aria-hidden="true">recycling</span>Scarti</span>'; }

  function specieName(lotto) { return S().byId('specie', lotto.id_specie).nome_comune; }

  /* ---------- phone parts ---------- */
  var LANG = '<div class="lang" aria-label="Lingua (solo italiano in questa demo)"><span class="on">IT</span><span>EN</span></div>';
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
        ['certificati', 'certificati.html', 'workspace_premium', 'Certificati'], ['notifiche', 'notifiche.html', 'notifications', 'Notifiche'], ['profilo', 'profilo.html', 'person', 'Profilo']]
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

  // Sawmill "Vendi": the first received batch that is sawn and not sold (no offer yet first), else Le mie offerte
  function vendiHref() {
    var s = FV.auth.current(), st = S();
    var ok = st.lottiOfSawmill(s.azienda.id).filter(function (l) { return st.prodottiOfLotto(l.id).length && st.statoLotto(l.id) !== 'Venduto'; });
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
  function badge(role, key) { return key === 'carrello' ? cartCount() : role === 'segheria' && key === 'ordini' ? newOrders() : ''; }

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
      '<div class="foot"><div class="who"><span class="ms" aria-hidden="true">account_circle</span>' + esc(session.azienda.ragione_sociale) + '</div>' +
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
    st.lottiOfOwner(idAzienda).forEach(function (l) { st.storico(l.id).forEach(function (e) { if (e.tipo !== 'T') ev.push({ e: e, l: l }); }); });
    ev.sort(function (a, b) { return (b.e.data > a.e.data ? 1 : b.e.data < a.e.data ? -1 : 0) || rank[b.e.tipo] - rank[a.e.tipo]; });
    return ev.map(function (x) {
      var e = x.e;
      return { l: x.l, icon: e.icon, data: e.data, title: e.tipo === 'L' ? 'Segato in tavole e scarti' : e.titolo,
        detail: e.tipo === 'L' ? e.titolo.replace('Segato: ', '') : e.tipo === 'V' ? (e.raw.dett || '') : '' };
    });
  }

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
      steps: st.storico(lotto.id), trasporto: st.trasporto(lotto) };
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
    var o = { c: view.code, s: view.species, v: view.vol, t: d6(view.cut), p: view.parcel, n: names, m: names.map(st.comuneByName), h: h };
    if (view.lat != null) o.g = [view.lat, view.lon];
    if (view.cert) { o.ce = view.cert; o.cx = view.certYear; }
    if (view.factor !== 0.7) o.f = view.factor;
    if (lotto.creato_ts) o.k = lotto.creato_ts;   // demo transport: the QR page works it out on any phone
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
      var arr = o.k + S().trasportoMs(), there = raw.some(function (e) { return e.tipo === 'P'; });
      if (!there && Date.now() >= arr) {
        var a = new Date(arr), sm = sawmillName();
        raw.push({ tipo: 'P', data: a.getFullYear() + '-' + String(a.getMonth() + 1).padStart(2, '0') + '-' + String(a.getDate()).padStart(2, '0'), da: o.n[0], a: sm });
        var az = (window.FV_SEED.azienda || []).find(function (x) { return x.ragione_sociale === sm; });
        if (o.n.indexOf(sm) < 0) { o.n.push(sm); o.m = (o.m || []).concat(az ? az.comune : ''); }
        there = true;
      }
      trasporto = { ts: o.k, arrivo: arr, arrivato: there };
    }
    var sold = raw.some(function (e) { return e.tipo === 'V'; });
    return { code: o.c, species: o.s, vol: o.v, cut: iso(o.t), parcel: o.p, lat: o.g ? o.g[0] : null, lon: o.g ? o.g[1] : null,
      cert: o.ce || null, certYear: o.cx || null, owner: o.n[0], factor: o.f || 0.7, eudr: !!(o.g && o.t), stato: sold ? 'Venduto' : 'Disponibile',
      steps: raw.map(function (e) { var t = S().stepText(e, comune); t.data = e.data; t.tipo = e.tipo; return t; }), trasporto: trasporto };
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
  function photo(key, alt) { return '<img class="photo-x" src="img/' + PHOTO[key] + '" alt="' + esc(alt || '') + '" onerror="this.remove()">'; }

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
    phoneBar: phoneBar, backBar: backBar, tabbar: tabbar, sidebar: sidebar, shell: shell, homeHref: homeHref, ordCode: ordCode, photo: photo, OSM: OSM, photoKey: photoKey, PHOTO: PHOTO, ownerNews: ownerNews, NAV: NAV, vendiHref: vendiHref, logoHTML: logoHTML, LANG: LANG,
    qrPayload: qrPayload, qrUrl: qrUrl, lottoView: lottoView, viewFromPayload: viewFromPayload, b64url: b64url, qrSvg: qrSvg, unb64url: unb64url, flash: flash, toast: toast, param: param
  };
})();
