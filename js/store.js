/* ForValue – store.js: every localStorage read and write happens here.
   The data has the same tables as the database (see data.js).
   Batch status and the EUDR badge are not columns: they are worked out
   from other tables, exactly like the demo queries do. */

(function () {
  var KEY = 'fv_db_v1';
  var CART = 'fv_cart_v1';

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function load() {
    var raw = null;
    try { raw = localStorage.getItem(KEY); } catch (e) {}
    if (raw) {
      try {
        var old = JSON.parse(raw);
        // Same seed version as data.js: keep the saved data (batches, offers, orders made in the demo)
        if (old && old.seed_version === window.FV_SEED.seed_version) return old;
      } catch (e) {}
      // data.js changed (new seed_version): start again from the new data, logged out, empty cart
      try { localStorage.removeItem(CART); localStorage.removeItem('fv_tokens_v1'); localStorage.removeItem('fv_session_v1'); } catch (e) {}
    }
    var db = clone(window.FV_SEED);
    save(db);
    return db;
  }
  function save(db) {
    try { var raw = JSON.stringify(db); localStorage.setItem(KEY, raw); lastRaw = raw; } catch (e) {}
  }

  var db = load();
  var lastRaw = null;
  try { lastRaw = localStorage.getItem(KEY); } catch (e) {}

  // Another tab (or another page) may have written: pick up its data before checking the transport
  function reloadDb() {
    var raw = null;
    try { raw = localStorage.getItem(KEY); } catch (e) {}
    if (!raw || raw === lastRaw) return;
    try { var d = JSON.parse(raw); if (d && d.seed_version === window.FV_SEED.seed_version) db = d; } catch (e) {}
    lastRaw = raw;
  }

  function all(table) { return db[table] || []; }
  function byId(table, id) { id = Number(id); return all(table).find(function (r) { return r.id === id; }) || null; }
  function where(table, field, value) { return all(table).filter(function (r) { return r[field] === value; }); }
  function nextId(table) { return all(table).reduce(function (m, r) { return Math.max(m, r.id); }, 0) + 1; }
  function insert(table, row) { row.id = nextId(table); db[table].push(row); save(db); return row; }

  /* ---------- batches (lotto) ---------- */

  function lottoByCode(code) { return all('lotto').find(function (l) { return l.codice_qr === code; }) || null; }

  // Next code after the highest one in storage: FV-2026-00087 → FV-2026-00088, …
  function nextLottoCode() {
    var max = 0, year = String(new Date().getFullYear());
    all('lotto').forEach(function (l) {
      var m = /^FV-(\d{4})-(\d+)$/.exec(l.codice_qr);
      if (m && Number(m[2]) >= max) { max = Number(m[2]); year = m[1]; }
    });
    return 'FV-' + year + '-' + String(max + 1).padStart(5, '0');
  }

  // Products made from a batch (via lavorazione)
  function prodottiOfLotto(idLotto) {
    var lavs = where('lavorazione', 'id_lotto', idLotto).map(function (l) { return l.id; });
    return all('prodotto').filter(function (p) { return lavs.indexOf(p.id_lavorazione) >= 0; });
  }
  function offerteOfLotto(idLotto) {
    var prods = prodottiOfLotto(idLotto).map(function (p) { return p.id; });
    return all('offerta').filter(function (o) { return prods.indexOf(o.id_prodotto) >= 0; });
  }
  function ordiniOfLotto(idLotto) {
    var offs = offerteOfLotto(idLotto).map(function (o) { return o.id; });
    return all('ordine').filter(function (o) { return offs.indexOf(o.id_offerta) >= 0; });
  }
  function lottoOfOfferta(offerta) {
    var p = byId('prodotto', offerta.id_prodotto);
    var lav = p && byId('lavorazione', p.id_lavorazione);
    return lav ? byId('lotto', lav.id_lotto) : null;
  }

  // An order still counts unless the sawmill refused it (rifiutato) or it was cancelled (annullato)
  function ordineValido(o) { return o.stato !== 'annullato' && o.stato !== 'rifiutato'; }

  // Status: Venduto if an order is inviato, accettato or consegnato, else Disponibile
  // (accepting the order in "Ordini ricevuti" keeps the batch Venduto; refusing it frees the batch again)
  function statoLotto(idLotto) {
    return ordiniOfLotto(idLotto).some(ordineValido) ? 'Venduto' : 'Disponibile';
  }

  // EUDR verificato: the parcel has GPS (lat/lon) and the batch has a cut date
  function eudrOk(lotto) {
    var p = byId('particella', lotto.id_particella);
    return !!(p && p.lat != null && p.lon != null && lotto.data_taglio);
  }

  // Which company holds the batch now (last passaggio, else the owner)
  function holderOf(idLotto) {
    var ps = where('passaggio', 'id_lotto', idLotto).filter(function (p) { return !p.id_ordine; });
    ps.sort(function (a, b) { return a.data_ora < b.data_ora ? -1 : 1; });
    return ps.length ? ps[ps.length - 1].id_azienda_a : byId('lotto', idLotto).id_azienda;
  }
  function lottiOfOwner(idAzienda) { return where('lotto', 'id_azienda', idAzienda); }
  // Batches that reached a sawmill through a "Trasferito" step
  function lottiOfSawmill(idAzienda) {
    var ids = all('passaggio').filter(function (p) { return p.id_azienda_a === idAzienda && !p.id_ordine; }).map(function (p) { return p.id_lotto; });
    return all('lotto').filter(function (l) { return ids.indexOf(l.id) >= 0; });
  }
  function transferDate(idLotto) {
    var p = where('passaggio', 'id_lotto', idLotto).find(function (x) { return !x.id_ordine; });
    return p ? p.data_ora.slice(0, 10) : null;
  }

  // History (like demo query 1): cut, transfers, sawing, sales – oldest first.
  // Raw steps use company names, so the same steps can travel inside the QR link.
  function storicoRaw(idLotto) {
    var l = byId('lotto', idLotto);
    if (!l) return [];
    var name = function (id) { return byId('azienda', id).ragione_sociale; };
    var ev = [{ tipo: 'T', data: l.data_taglio, chi: name(l.id_azienda), dove: byId('particella', l.id_particella).nome }];
    where('passaggio', 'id_lotto', idLotto).forEach(function (p) {
      if (p.id_ordine) { var ord = byId('ordine', p.id_ordine); if (ord && !ordineValido(ord)) return; }
      var e = { tipo: p.id_ordine ? 'V' : 'P', data: p.data_ora.slice(0, 10), da: name(p.id_azienda_da), a: name(p.id_azienda_a) };
      if (p.id_ordine) {
        var o = byId('ordine', p.id_ordine), off = o && byId('offerta', o.id_offerta);
        if (o && off) e.dett = fmtNum(o.quantita) + ' ' + unitOf(off) + ' di ' + shortName(off.titolo);
      }
      ev.push(e);
    });
    where('lavorazione', 'id_lotto', idLotto).forEach(function (lav) {
      var prods = all('prodotto').filter(function (p) { return p.id_lavorazione === lav.id; });
      ev.push({ tipo: 'L', data: lav.data, chi: name(lav.id_azienda), dett: prods.map(function (p) { return fmtNum(p.quantita) + ' ' + unitLabel(p.unita) + ' ' + shortName(p.descrizione); }).join(' + ') });
    });
    // By date; on the same day: cut → transfer → sawing → sale
    var rank = { T: 0, P: 1, L: 2, V: 3 };
    ev.sort(function (a, b) { return (a.data < b.data ? -1 : a.data > b.data ? 1 : 0) || rank[a.tipo] - rank[b.tipo]; });
    return ev;
  }
  // Turns a raw step into the text shown on screen. comune(name) gives a company's town.
  function stepText(e, comune) {
    var ad = function (n) { return (/^[aeiou]/i.test(n) ? 'ad ' : 'a ') + n; };
    if (e.tipo === 'T') return { titolo: 'Taglio', sotto: e.chi + ' · ' + e.dove, icon: 'forest' };
    if (e.tipo === 'P') return { titolo: 'Trasferito ' + ad(e.a), sotto: 'Da ' + e.da + ' · ' + comune(e.a), icon: 'local_shipping' };
    if (e.tipo === 'L') return { titolo: 'Segato: ' + e.dett, sotto: e.chi + ' · ' + comune(e.chi), icon: 'carpenter' };
    return { titolo: 'Venduto ' + ad(e.a), sotto: (e.dett ? e.dett + ' · ' : '') + e.da + ' · ' + comune(e.da), icon: 'sell' };
  }
  function comuneByName(n) { var a = all('azienda').find(function (x) { return x.ragione_sociale === n; }); return a ? a.comune : '[comune]'; }
  function storico(idLotto) {
    return storicoRaw(idLotto).map(function (e) { var t = stepText(e, comuneByName); t.data = e.data; t.tipo = e.tipo; t.raw = e; return t; });
  }

  function comuneOf(az) { return az.comune; }
  function shortName(t) { return t.split(' ')[0].toLowerCase(); }   // "Tavole di abete rosso" → "tavole"
  function unitLabel(u) { return u === 'm3' ? 'm³' : u; }
  function unitOf(offerta) { var p = byId('prodotto', offerta.id_prodotto); return unitLabel(p ? p.unita : 'm3'); }
  function fmtNum(n) { return new Intl.NumberFormat(FV.i18n.loc, { maximumFractionDigits: 2 }).format(n); }

  /* ---------- demo transport: a new batch reaches the sawmill by itself ---------- */
  // Seed batches have no creato_ts, so they are never moved.
  function trasportoMs() { return ((window.FV_SEED && FV_SEED.DEMO_TRASPORTO_S) || 60) * 1000; }
  function sawmillId() { return (window.FV_SEED && FV_SEED.demo_segheria) || 2; }
  function arrivo(idLotto) { return where('passaggio', 'id_lotto', idLotto).find(function (p) { return !p.id_ordine; }) || null; }
  // { ts: created, arrivo: arrival time (ms), arrivato } or null for seed batches
  function trasporto(lotto) {
    if (!lotto || !lotto.creato_ts) return null;
    return { ts: lotto.creato_ts, arrivo: lotto.creato_ts + trasportoMs(), arrivato: !!arrivo(lotto.id) };
  }
  function nTransfers() { return all('passaggio').filter(function (p) { return !p.id_ordine; }).length; }
  var lastTransfers = null;
  // Runs on every page load and every few seconds (ui.js). Adds the "Trasferito" step for batches
  // whose time is up. True when a batch arrived since the last call (here or in another tab).
  function tick() {
    reloadDb();
    var now = Date.now(), n = 0;
    all('lotto').forEach(function (l) {
      if (!l.creato_ts || now - l.creato_ts < trasportoMs() || arrivo(l.id)) return;
      var d = new Date(l.creato_ts + trasportoMs());
      db.passaggio.push({ id: nextId('passaggio'), id_lotto: l.id, id_azienda_da: l.id_azienda, id_azienda_a: sawmillId(), id_ordine: null,
        data_ora: isoOf(d) + ' ' + hm(d), stato: 'consegnato' });
      n++;
    });
    if (n) save(db);
    var c = nTransfers(), changed = lastTransfers !== null && c !== lastTransfers;
    lastTransfers = c;
    return changed;
  }

  /* ---------- writes ---------- */

  // P2: new batch + its "Taglio" (the cut is the lotto row itself)
  function addLotto(f) {
    var l = insert('lotto', {
      codice_qr: nextLottoCode(), id_particella: f.id_particella, id_specie: f.id_specie, id_azienda: f.id_azienda,
      volume_m3: f.volume_m3, data_taglio: f.data_taglio, certificato: f.certificato || null, foto_url: f.foto_url || null,
      creato_ts: Date.now()
    });
    if (f.lat != null && f.id_particella) {
      var p = byId('particella', f.id_particella);
      // keep the parcel GPS from the seed unless the phone gave a real position for a parcel with none
      if (p && p.lat == null) { p.lat = f.lat; p.lon = f.lon; save(db); }
    }
    return l;
  }

  // D2: a received batch not sawn yet – the sawmill records the sawing and its products first
  function addLavorazione(idLotto, idAzienda, data, prodotti) {
    var lav = insert('lavorazione', { id_lotto: idLotto, id_azienda: idAzienda, data: data, tipo: 'segagione' });
    return prodotti.map(function (p) {
      return insert('prodotto', { id_lavorazione: lav.id, descrizione: p.descrizione, categoria: p.categoria, quantita: p.quantita, unita: p.unita });
    });
  }

  // D2: create or update the offer for a product
  function publishOfferta(idProdotto, idAzienda, quantita, prezzo) {
    var p = byId('prodotto', idProdotto);
    var o = all('offerta').find(function (x) { return x.id_prodotto === idProdotto && x.id_azienda === idAzienda; });
    if (o) { o.quantita_disponibile = quantita; o.prezzo_unitario = prezzo; o.attiva = 1; save(db); return o; }
    return insert('offerta', { id_prodotto: idProdotto, id_azienda: idAzienda, titolo: p.descrizione, prezzo_unitario: prezzo, quantita_disponibile: quantita, attiva: 1 });
  }

  // Orders placed live in the demo get the sale date of the database sample (15/04/2026),
  // so the story stays in 2026 like the mock-up. Change it in data.js (demo_data_ordine).
  function demoDate() { return (window.FV_SEED && FV_SEED.demo_data_ordine) || todayISO(); }

  // D4/D5: place an order → lowers the offer, adds the sale step, batch becomes Venduto
  function placeOrdine(idOfferta, idAzienda, quantita, dataConsegna) {
    var off = byId('offerta', idOfferta);
    if (!off || quantita <= 0 || quantita > off.quantita_disponibile) return null;
    var today = demoDate();
    var o = insert('ordine', { id_offerta: off.id, id_azienda: idAzienda, data: today, quantita: quantita,
      prezzo_totale: Math.round(quantita * off.prezzo_unitario * 100) / 100, stato: 'inviato', data_consegna: dataConsegna || addDays(today, 7) });
    off.quantita_disponibile = Math.round((off.quantita_disponibile - quantita) * 1000) / 1000;
    if (off.quantita_disponibile <= 0) { off.quantita_disponibile = 0; off.attiva = 0; }
    var lotto = lottoOfOfferta(off);
    if (lotto) insert('passaggio', { id_lotto: lotto.id, id_azienda_da: off.id_azienda, id_azienda_a: idAzienda, id_ordine: o.id, data_ora: today + ' ' + nowTime(), stato: 'inviato' });
    save(db);
    return o;
  }

  // Ordini ricevuti: the sawmill accepts or refuses an order. Refusing gives the quantity back to the offer.
  function setStatoOrdine(idOrdine, stato) {
    var o = byId('ordine', idOrdine);
    if (!o || o.stato !== 'inviato' || (stato !== 'accettato' && stato !== 'rifiutato')) return null;
    o.stato = stato;
    if (stato === 'rifiutato') {
      var off = byId('offerta', o.id_offerta);
      if (off) { off.quantita_disponibile = Math.round((off.quantita_disponibile + o.quantita) * 1000) / 1000; off.attiva = 1; }
    }
    where('passaggio', 'id_ordine', o.id).forEach(function (p) { p.stato = stato; });
    save(db);
    return o;
  }

  // Delivery date when the buyer does not pick one: order date + 7 days
  function addDays(iso, n) { var d = new Date(iso + 'T12:00:00'); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); }

  function isoOf(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function hm(d) { return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); }
  function todayISO() { return isoOf(new Date()); }
  function nowTime() { return hm(new Date()); }

  /* ---------- cart (D5) ---------- */
  function getCart() { try { return JSON.parse(localStorage.getItem(CART)) || []; } catch (e) { return []; } }
  function setCart(c) { try { localStorage.setItem(CART, JSON.stringify(c)); } catch (e) {} }

  // "Ripristina dati demo": back to the seed
  function reset() {
    try { localStorage.removeItem(KEY); localStorage.removeItem(CART); } catch (e) {}
    db = clone(window.FV_SEED); save(db); lastTransfers = null;
  }

  window.FV = window.FV || {};
  window.FV.store = {
    all: all, byId: byId, where: where, save: function () { save(db); }, reset: reset,
    lottoByCode: lottoByCode, nextLottoCode: nextLottoCode, prodottiOfLotto: prodottiOfLotto, offerteOfLotto: offerteOfLotto,
    ordiniOfLotto: ordiniOfLotto, storicoRaw: storicoRaw, stepText: stepText, comuneByName: comuneByName, lottoOfOfferta: lottoOfOfferta, statoLotto: statoLotto, eudrOk: eudrOk, holderOf: holderOf,
    lottiOfOwner: lottiOfOwner, lottiOfSawmill: lottiOfSawmill, transferDate: transferDate, storico: storico, unitOf: unitOf, unitLabel: unitLabel,
    addLotto: addLotto, addLavorazione: addLavorazione, demoDate: demoDate, addDays: addDays, setStatoOrdine: setStatoOrdine, ordineValido: ordineValido, publishOfferta: publishOfferta, placeOrdine: placeOrdine, todayISO: todayISO,
    getCart: getCart, setCart: setCart, trasporto: trasporto, tick: tick, trasportoMs: trasportoMs, sawmillId: sawmillId
  };
  window.FV.store.tick();
})();
