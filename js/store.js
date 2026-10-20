/* ForValue – store.js: every localStorage read and write happens here.
   The data has the same tables as the database (see data.js).
   Batch status and the EUDR badge are not columns: they are worked out
   from other tables, exactly like the demo queries do. */

(function () {
  var KEY = 'fv_db_v1';

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function load() {
    var raw = null;
    try { raw = localStorage.getItem(KEY); } catch (e) {}
    if (raw) { try { return JSON.parse(raw); } catch (e) {} }
    var db = clone(window.FV_SEED);
    save(db);
    return db;
  }
  function save(db) {
    try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) {}
  }

  var db = load();

  function all(table) { return db[table] || []; }
  function byId(table, id) { id = Number(id); return all(table).find(function (r) { return r.id === id; }) || null; }
  function where(table, field, value) { return all(table).filter(function (r) { return r[field] === value; }); }
  function nextId(table) { return all(table).reduce(function (m, r) { return Math.max(m, r.id); }, 0) + 1; }
  function insert(table, row) { row.id = nextId(table); db[table].push(row); save(db); return row; }

  /* ---------- batches (lotto) ---------- */

  function lottoByCode(code) { return all('lotto').find(function (l) { return l.codice_qr === code; }) || null; }

  // Next code: FV-2027-00088, FV-2027-00089, …
  function nextLottoCode() {
    var max = 0;
    all('lotto').forEach(function (l) {
      var m = /^FV-(\d{4})-(\d+)$/.exec(l.codice_qr);
      if (m) max = Math.max(max, Number(m[2]));
    });
    return 'FV-2027-' + String(max + 1).padStart(5, '0');
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

  // Status: Venduto if an order is inviato or consegnato, Riservato if accettato, else Disponibile
  function statoLotto(idLotto) {
    var ords = ordiniOfLotto(idLotto).filter(function (o) { return o.stato !== 'annullato'; });
    if (ords.some(function (o) { return o.stato === 'inviato' || o.stato === 'consegnato'; })) return 'Venduto';
    if (ords.some(function (o) { return o.stato === 'accettato'; })) return 'Riservato';
    return 'Disponibile';
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

  // History (like demo query 1): cut, transfers, sawing, sales – oldest first
  function storico(idLotto) {
    var l = byId('lotto', idLotto);
    if (!l) return [];
    var owner = byId('azienda', l.id_azienda);
    var part = byId('particella', l.id_particella);
    var ev = [{ data: l.data_taglio, tipo: 'taglio', titolo: 'Taglio', sotto: owner.ragione_sociale + ' · ' + part.nome, icon: 'forest', ph: !!part._ph && part._ph.indexOf('nome') >= 0 }];
    where('passaggio', 'id_lotto', idLotto).forEach(function (p) {
      var da = byId('azienda', p.id_azienda_da), a = byId('azienda', p.id_azienda_a);
      if (p.id_ordine) {
        var o = byId('ordine', p.id_ordine), off = o && byId('offerta', o.id_offerta);
        var u = off ? unitOf(off) : 'm³';
        ev.push({ data: p.data_ora.slice(0, 10), tipo: 'vendita', titolo: 'Venduto a' + (/^[AEIOU]/i.test(a.ragione_sociale) ? 'd ' : ' ') + a.ragione_sociale,
          sotto: da.ragione_sociale + ' · ' + comuneOf(da), dett: o ? fmtNum(o.quantita) + ' ' + u + ' di ' + (off ? shortName(off.titolo) : '') : '', icon: 'sell', phPlace: true });
      } else {
        ev.push({ data: p.data_ora.slice(0, 10), tipo: 'passaggio', titolo: 'Trasferito a ' + a.ragione_sociale, sotto: 'Da ' + da.ragione_sociale + ' · ' + comuneOf(a), icon: 'local_shipping', phPlace: true });
      }
    });
    where('lavorazione', 'id_lotto', idLotto).forEach(function (lav) {
      var az = byId('azienda', lav.id_azienda);
      var prods = all('prodotto').filter(function (p) { return p.id_lavorazione === lav.id; });
      var parts = prods.map(function (p) { return fmtNum(p.quantita) + ' ' + unitLabel(p.unita) + ' ' + shortName(p.descrizione); });
      ev.push({ data: lav.data, tipo: 'lavorazione', titolo: 'Segato: ' + parts.join(' + '), sotto: az.ragione_sociale + ' · ' + comuneOf(az), icon: 'carpenter', phPlace: true });
    });
    ev.sort(function (a, b) { return a.data < b.data ? -1 : a.data > b.data ? 1 : 0; });
    return ev;
  }

  function comuneOf(az) { return az.comune; }
  function shortName(t) { return t.split(' ')[0].toLowerCase(); }   // "Tavole di abete rosso" → "tavole"
  function unitLabel(u) { return u === 'm3' ? 'm³' : u; }
  function unitOf(offerta) { var p = byId('prodotto', offerta.id_prodotto); return unitLabel(p ? p.unita : 'm3'); }
  function fmtNum(n) { return new Intl.NumberFormat('it-IT', { maximumFractionDigits: 2 }).format(n); }

  /* ---------- writes ---------- */

  // P2: new batch + its "Taglio" (the cut is the lotto row itself)
  function addLotto(f) {
    var l = insert('lotto', {
      codice_qr: nextLottoCode(), id_particella: f.id_particella, id_specie: f.id_specie, id_azienda: f.id_azienda,
      volume_m3: f.volume_m3, data_taglio: f.data_taglio, certificato: f.certificato || null, foto_url: f.foto_url || null
    });
    if (f.lat != null && f.id_particella) {
      var p = byId('particella', f.id_particella);
      // keep the parcel GPS from the seed unless the phone gave a real position for a parcel with none
      if (p && p.lat == null) { p.lat = f.lat; p.lon = f.lon; save(db); }
    }
    return l;
  }

  // D2: create or update the offer for a product
  function publishOfferta(idProdotto, idAzienda, quantita, prezzo) {
    var p = byId('prodotto', idProdotto);
    var o = all('offerta').find(function (x) { return x.id_prodotto === idProdotto && x.id_azienda === idAzienda; });
    if (o) { o.quantita_disponibile = quantita; o.prezzo_unitario = prezzo; o.attiva = 1; save(db); return o; }
    return insert('offerta', { id_prodotto: idProdotto, id_azienda: idAzienda, titolo: p.descrizione, prezzo_unitario: prezzo, quantita_disponibile: quantita, attiva: 1 });
  }

  // D4/D5: place an order → lowers the offer, adds the sale step, batch becomes Venduto
  function placeOrdine(idOfferta, idAzienda, quantita, dataConsegna) {
    var off = byId('offerta', idOfferta);
    if (!off || quantita <= 0 || quantita > off.quantita_disponibile) return null;
    var today = todayISO();
    var o = insert('ordine', { id_offerta: off.id, id_azienda: idAzienda, data: today, quantita: quantita,
      prezzo_totale: Math.round(quantita * off.prezzo_unitario * 100) / 100, stato: 'inviato', data_consegna: dataConsegna || null });
    off.quantita_disponibile = Math.round((off.quantita_disponibile - quantita) * 1000) / 1000;
    if (off.quantita_disponibile <= 0) { off.quantita_disponibile = 0; off.attiva = 0; }
    var lotto = lottoOfOfferta(off);
    if (lotto) insert('passaggio', { id_lotto: lotto.id, id_azienda_da: off.id_azienda, id_azienda_a: idAzienda, id_ordine: o.id, data_ora: today + ' ' + nowTime(), stato: 'inviato' });
    save(db);
    return o;
  }

  function todayISO() { var d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function nowTime() { var d = new Date(); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); }

  /* ---------- cart (D5) ---------- */
  var CART = 'fv_cart_v1';
  function getCart() { try { return JSON.parse(localStorage.getItem(CART)) || []; } catch (e) { return []; } }
  function setCart(c) { try { localStorage.setItem(CART, JSON.stringify(c)); } catch (e) {} }

  // "Ripristina dati demo": back to the seed
  function reset() {
    try { localStorage.removeItem(KEY); localStorage.removeItem(CART); } catch (e) {}
    db = clone(window.FV_SEED); save(db);
  }

  window.FV = window.FV || {};
  window.FV.store = {
    all: all, byId: byId, where: where, save: function () { save(db); }, reset: reset,
    lottoByCode: lottoByCode, nextLottoCode: nextLottoCode, prodottiOfLotto: prodottiOfLotto, offerteOfLotto: offerteOfLotto,
    ordiniOfLotto: ordiniOfLotto, lottoOfOfferta: lottoOfOfferta, statoLotto: statoLotto, eudrOk: eudrOk, holderOf: holderOf,
    lottiOfOwner: lottiOfOwner, lottiOfSawmill: lottiOfSawmill, transferDate: transferDate, storico: storico, unitOf: unitOf, unitLabel: unitLabel,
    addLotto: addLotto, publishOfferta: publishOfferta, placeOrdine: placeOrdine, todayISO: todayISO,
    getCart: getCart, setCart: setCart
  };
})();
