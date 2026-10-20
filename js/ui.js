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
  function num1(n) { return nf1.format(n); }
  function euro(n) { return eur.format(n) + ' €'; }                // 3.100,00 €
  function date(iso) { if (!iso) return ''; var p = iso.slice(0, 10).split('-'); return p[2] + '/' + p[1] + '/' + p[0]; }  // 12/03/2027
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
    return certPill(lotto.certificato) + eudrPill(S().eudrOk(lotto), short) + statoPill(S().statoLotto(lotto.id));
  }
  var ORD = { inviato: ['Inviato', 'send', 'p-eudr'], accettato: ['Accettato', 'thumb_up', 'p-cert'], consegnato: ['Consegnato', 'check', 'p-st'], annullato: ['Annullato', 'close', 'p-st'] };
  function ordinePill(stato) { var o = ORD[stato]; return '<span class="pill ' + o[2] + '"><span class="ms" aria-hidden="true">' + o[1] + '</span>' + o[0] + '</span>'; }
  function scartiPill() { return '<span class="pill p-scarti"><span class="ms" aria-hidden="true">recycling</span>Scarti</span>'; }

  function specieName(lotto) { return S().byId('specie', lotto.id_specie).nome_comune; }

  /* ---------- phone parts ---------- */
  var LANG = '<div class="lang" aria-label="Lingua (solo italiano in questa demo)"><span class="on">IT</span><span>EN</span></div>';
  function logoHTML() { return '<span class="logo"><span class="mk"><span class="ms" aria-hidden="true">forest</span></span>ForValue</span>'; }

  // Top bar with logo. hotspot = role to switch to when the logo is tapped (hidden demo shortcut)
  function phoneBar(opts) {
    opts = opts || {};
    var left = opts.hotspot
      ? '<button class="logo-btn" type="button" data-switch="' + opts.hotspot + '" aria-label="ForValue">' + logoHTML() + '</button>'
      : '<a class="logo-btn" href="' + (opts.logoHref || '#') + '" aria-label="ForValue">' + logoHTML() + '</a>';
    return '<header class="bar">' + left + (opts.right || LANG) + '</header>';
  }
  // Top bar with ← and a title
  function backBar(title, href) {
    return '<header class="bar"><div class="title"><a class="back" href="' + href + '" aria-label="Indietro"><span class="ms" aria-hidden="true">arrow_back</span></a><h1 class="h2">' + esc(title) + '</h1></div></header>';
  }
  function tabbar(active) {
    var tabs = [['home', 'home.html', 'home', 'Home'], ['lotti', 'lotti.html', 'inventory_2', 'Lotti'], ['nuovo', 'nuovo-lotto.html', 'add', 'Nuovo lotto'], ['profilo', 'profilo.html', 'person', 'Profilo'], ['altro', 'altro.html', 'menu', 'Altro']];
    return '<nav class="tabbar" aria-label="Menu">' + tabs.map(function (x) {
      var cur = x[0] === active ? ' aria-current="page"' : '';
      if (x[0] === 'nuovo') return '<a class="plus" href="' + x[1] + '"' + cur + '><i><span class="ms" aria-hidden="true">' + x[2] + '</span></i>' + x[3] + '</a>';
      return '<a href="' + x[1] + '"' + cur + '><span class="ms" aria-hidden="true">' + x[2] + '</span>' + x[3] + '</a>';
    }).join('') + '</nav>';
  }

  /* ---------- desktop sidebar ---------- */
  function sidebar(active, session) {
    var r = session.ruolo, items;
    if (r === 'segheria') {
      items = [['dashboard', 'dashboard.html', 'space_dashboard', 'Dashboard'], ['lotti', 'segheria-lotti.html', 'inventory_2', 'Lotti'],
        ['marketplace', 'marketplace.html', 'storefront', 'Marketplace'], ['circolarita', 'marketplace.html?tab=scarti', 'recycling', 'Circolarità'], ['ordini', 'ordini.html', 'receipt_long', 'Ordini']];
    } else {
      var n = S().getCart().length;
      items = [['marketplace', 'marketplace.html', 'storefront', 'Marketplace'], ['circolarita', 'marketplace.html?tab=scarti', 'recycling', 'Circolarità'],
        ['ordini', 'ordini.html', 'receipt_long', 'Ordini'], ['carrello', 'carrello.html', 'shopping_cart', 'Carrello' + (n ? '<span class="count">' + n + '</span>' : '')]];
    }
    var hot = r === 'segheria' ? 'acquirente' : 'segheria';
    return '<aside class="sb"><button type="button" class="logo" data-switch="' + hot + '" aria-label="ForValue">' + logoHTML().replace(/^<span class="logo">|<\/span>$/g, '') + '</button>' +
      '<nav aria-label="Menu">' + items.map(function (x) {
        return '<a href="' + x[1] + '"' + (x[0] === active ? ' aria-current="page"' : '') + '><span class="ms" aria-hidden="true">' + x[2] + '</span>' + x[3] + '</a>';
      }).join('') + '</nav>' +
      '<div class="foot"><div class="who"><span class="ms" aria-hidden="true">account_circle</span>' + esc(session.azienda.ragione_sociale) + '</div>' +
      '<button type="button" class="lnk" data-reset><span class="ms" aria-hidden="true">restart_alt</span>Ripristina dati demo</button>' +
      '<button type="button" class="lnk" data-logout><span class="ms" aria-hidden="true">logout</span>Esci</button>' + LANG + '</div></aside>';
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
  // Short keys keep the QR small: c code, s species, v volume, t cut date, p parcel,
  // g [lat,lon], ce cert, cx cert expiry year, o owner, f CO₂ factor, h history [[date,title,sub]]
  function qrPayload(lotto) {
    var st = S(), part = st.byId('particella', lotto.id_particella), sp = st.byId('specie', lotto.id_specie), own = st.byId('azienda', lotto.id_azienda);
    var cert = lotto.certificato ? st.all('certificazione').find(function (c) { return c.id_azienda === own.id && c.schema === lotto.certificato; }) : null;
    return {
      c: lotto.codice_qr, s: sp.nome_comune, v: lotto.volume_m3, t: lotto.data_taglio, p: part.nome,
      g: part.lat != null ? [part.lat, part.lon] : null, ce: lotto.certificato, cx: cert ? cert.data_scadenza.slice(0, 4) : null,
      o: own.ragione_sociale, f: sp.fattore_co2,
      h: st.storico(lotto.id).map(function (e) { return [e.data, e.titolo, e.sotto]; })
    };
  }
  function qrUrl(lotto) { return new URL('qr.html?d=' + b64url(JSON.stringify(qrPayload(lotto))), location.href).href; }
  function qrSvg(text) {
    var q = qrcode(0, 'M'); q.addData(unescape(encodeURIComponent(text))); q.make();
    return q.createSvgTag({ cellSize: 4, margin: 2, scalable: true, alt: 'Codice QR del lotto' });
  }

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
    var sw = e.target.closest('[data-switch]'); if (sw) { FV.auth.switchTo(sw.getAttribute('data-switch')); return; }
    if (e.target.closest('[data-logout]')) { FV.auth.logout(); return; }
    if (e.target.closest('[data-reset]')) {
      if (confirm('Ripristinare i dati demo? Lotti, offerte e ordini creati verranno cancellati.')) {
        FV.store.reset(); var s = FV.auth.current(); location.href = s ? FV.auth.home(s.ruolo) : 'index.html';
      }
    }
  });
  document.addEventListener('DOMContentLoaded', showFlash);

  window.FV = window.FV || {};
  window.FV.ui = {
    num: num, num1: num1, euro: euro, date: date, gps: gps, MESI: MESI, esc: esc, t: t, v: v, isPh: isPh,
    certPill: certPill, eudrPill: eudrPill, statoPill: statoPill, badges: badges, ordinePill: ordinePill, scartiPill: scartiPill, specieName: specieName,
    phoneBar: phoneBar, backBar: backBar, tabbar: tabbar, sidebar: sidebar, logoHTML: logoHTML, LANG: LANG,
    qrPayload: qrPayload, qrUrl: qrUrl, qrSvg: qrSvg, unb64url: unb64url, flash: flash, toast: toast, param: param
  };
})();
