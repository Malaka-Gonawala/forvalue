/* ForValue – seed data (the demo starts from here).
   Every table and field name is the same as in the MariaDB database
   (see the Step-by-Step Guide, Step 2). Change a value here, then press
   "Ripristina dati demo" in the site to load it again.

   PLACEHOLDERS: a row or a field marked with `_ph` is NOT in the database
   sample yet. It is shown in gold on screen. Replace it with the real value
   from phpMyAdmin and remove the `_ph` mark. Full list: DATA-NEEDED.md.
   The values below were approved by Malaka on 20/10/2026 (DATA-ANSWERS.md).

   seed_version: raise it by 1 after changing this file, so every browser
   replaces its saved copy with the new data (it also logs everyone out). */

window.FV_SEED = {

  seed_version: 4,

  /* Not a table: shown on the Aiuto page */
  contatti: { supporto: 'supporto@forvalue.demo' },

  /* 1. azienda – tipo: proprietario | segheria | acquirente */
  azienda: [
    { id: 1, ragione_sociale: 'Consorzio Val di Fiemme', partita_iva: '02487310225', tipo: 'proprietario', indirizzo: 'Via Roma 12', comune: 'Cavalese (TN)', regione: 'Trentino-Alto Adige', approvata: 1 },
    { id: 2, ragione_sociale: 'Segheria Alpina', partita_iva: '01935620227', tipo: 'segheria', indirizzo: 'Via dei Boscaioli 5', comune: 'Ziano di Fiemme (TN)', regione: 'Trentino-Alto Adige', approvata: 1 },
    { id: 3, ragione_sociale: 'Arredi Bianchi Srl', partita_iva: '04712580267', tipo: 'acquirente', indirizzo: 'Via Brianza 40', comune: 'Cantù (CO)', regione: 'Lombardia', approvata: 1 },
    { id: 4, ragione_sociale: 'BioEnergia Srl', partita_iva: '03629140140', tipo: 'acquirente', indirizzo: 'Via Feltre 18', comune: 'Belluno (BL)', regione: 'Veneto', approvata: 1 },
    { id: 5, ragione_sociale: 'Legnami Rossi', partita_iva: '02874050301', tipo: 'acquirente', indirizzo: 'Via Emilia 77', comune: 'Modena (MO)', regione: 'Emilia-Romagna', approvata: 1 }
  ],

  /* 2. specie – fattore_co2 in t of CO₂ per m³ */
  specie: [
    { id: 1, nome_comune: 'Abete rosso', nome_scientifico: 'Picea abies', fattore_co2: 0.7 },
    { id: 2, nome_comune: 'Larice', nome_scientifico: 'Larix decidua', fattore_co2: 0.7 },
    { id: 3, nome_comune: 'Faggio', nome_scientifico: 'Fagus sylvatica', fattore_co2: 0.7 },
    { id: 4, nome_comune: 'Pino silvestre', nome_scientifico: 'Pinus sylvestris', fattore_co2: 0.7 }
  ],

  /* 3. utente – ruolo: proprietario | segheria | acquirente.
     Demo logins only: passwords in the browser are NOT real security. */
  utente: [
    { id: 1, id_azienda: 1, nome: 'Marco', cognome: 'Delladio', email: 'proprietario@forvalue.demo', password: 'demo2026', ruolo: 'proprietario' },
    { id: 2, id_azienda: 2, nome: 'Giulia', cognome: 'Zeni', email: 'segheria@forvalue.demo', password: 'demo2026', ruolo: 'segheria' },
    { id: 3, id_azienda: 3, nome: 'Luca', cognome: 'Bianchi', email: 'acquirente@forvalue.demo', password: 'demo2026', ruolo: 'acquirente' }
  ],

  /* 4. certificazione – schema: FSC | PEFC */
  certificazione: [
    { id: 1, id_azienda: 1, schema: 'PEFC', codice: 'PEFC/18-22-117', data_scadenza: '2028-12-31' },
    { id: 2, id_azienda: 2, schema: 'FSC', codice: 'FSC-C148205', data_scadenza: '2028-12-31' }
  ],

  /* 5. particella – lat/lon in decimal degrees */
  particella: [
    { id: 1, id_azienda: 1, nome: 'Bosco Val Fiemme', comune: 'Cavalese', superficie_ha: 38.5, lat: 46.2906, lon: 11.4594 },
    { id: 2, id_azienda: 1, nome: 'Bosco Latemar', comune: 'Tesero', superficie_ha: 22.0, lat: 46.2870, lon: 11.5120 }
  ],

  /* 6. lotto – certificato: 'PEFC' | 'FSC' | null. foto_url is optional (not in the DB). */
  lotto: [
    { id: 1, codice_qr: 'FV-2026-00087', id_particella: 1, id_specie: 1, id_azienda: 1, volume_m3: 45, data_taglio: '2026-03-12', certificato: 'PEFC', foto_url: null },
    { id: 2, codice_qr: 'FV-2026-00079', id_particella: 2, id_specie: 2, id_azienda: 1, volume_m3: 30, data_taglio: '2025-11-20', certificato: 'PEFC', foto_url: null },
    { id: 3, codice_qr: 'FV-2026-00081', id_particella: 2, id_specie: 1, id_azienda: 1, volume_m3: 50, data_taglio: '2026-01-20', certificato: 'PEFC', foto_url: null },
    { id: 4, codice_qr: 'FV-2026-00083', id_particella: 2, id_specie: 3, id_azienda: 1, volume_m3: 25, data_taglio: '2026-02-15', certificato: null, foto_url: null },
    { id: 5, codice_qr: 'FV-2026-00085', id_particella: 1, id_specie: 4, id_azienda: 1, volume_m3: 20, data_taglio: '2026-03-01', certificato: 'PEFC', foto_url: null }
  ],

  /* 7. lavorazione – tipo: segagione | selezione (logs sorted and sold as they are, no sawing) */
  lavorazione: [
    { id: 1, id_lotto: 1, id_azienda: 2, data: '2026-04-02', tipo: 'segagione' },
    { id: 2, id_lotto: 2, id_azienda: 2, data: '2025-12-05', tipo: 'segagione' },
    { id: 3, id_lotto: 3, id_azienda: 2, data: '2026-02-03', tipo: 'segagione' },
    { id: 4, id_lotto: 4, id_azienda: 2, data: '2026-03-01', tipo: 'segagione' },
    { id: 5, id_lotto: 5, id_azienda: 2, data: '2026-03-12', tipo: 'selezione' }
  ],

  /* 8. prodotto – categoria: legname | sottoprodotto; unita: m3 | t */
  prodotto: [
    { id: 1, id_lavorazione: 1, descrizione: 'Tavole di abete rosso', categoria: 'legname', quantita: 28, unita: 'm3' },
    { id: 2, id_lavorazione: 1, descrizione: 'Cippato di abete', categoria: 'sottoprodotto', quantita: 6, unita: 't' },
    { id: 3, id_lavorazione: 2, descrizione: 'Tavole di larice', categoria: 'legname', quantita: 20, unita: 'm3' },
    { id: 4, id_lavorazione: 2, descrizione: 'Cippato di larice', categoria: 'sottoprodotto', quantita: 4, unita: 't' },
    { id: 5, id_lavorazione: 3, descrizione: 'Tavole di abete rosso', categoria: 'legname', quantita: 32, unita: 'm3' },
    { id: 6, id_lavorazione: 4, descrizione: 'Tavole di faggio', categoria: 'legname', quantita: 15, unita: 'm3' },
    { id: 7, id_lavorazione: 4, descrizione: 'Segatura di faggio', categoria: 'sottoprodotto', quantita: 3, unita: 't' },
    { id: 8, id_lavorazione: 5, descrizione: 'Tronchi di pino silvestre', categoria: 'legname', quantita: 12, unita: 'm3' }
  ],

  /* 9. offerta – the offers for FV-2026-00087 (tavole 310,00 €/m³ and
     cippato 95,00 €/t) are created live in the demo by the sawmill (D2). */
  offerta: [
    { id: 1, id_prodotto: 3, id_azienda: 2, titolo: 'Tavole di larice', prezzo_unitario: 285, quantita_disponibile: 8, attiva: 1 },
    { id: 2, id_prodotto: 4, id_azienda: 2, titolo: 'Cippato di larice', prezzo_unitario: 90, quantita_disponibile: 1, attiva: 1 },
    { id: 3, id_prodotto: 5, id_azienda: 2, titolo: 'Tavole di abete rosso', prezzo_unitario: 305, quantita_disponibile: 2, attiva: 1 },
    { id: 4, id_prodotto: 6, id_azienda: 2, titolo: 'Tavole di faggio', prezzo_unitario: 340, quantita_disponibile: 9, attiva: 1 },
    { id: 5, id_prodotto: 7, id_azienda: 2, titolo: 'Segatura di faggio', prezzo_unitario: 60, quantita_disponibile: 3, attiva: 1 },
    { id: 6, id_prodotto: 8, id_azienda: 2, titolo: 'Tronchi di pino silvestre', prezzo_unitario: 180, quantita_disponibile: 12, attiva: 1 }
  ],

  /* Prices the sawmill publishes live in the demo for FV-2026-00087 (D2 panel is pre-filled
     with these): tavole 310,00 €/m³ and cippato 95,00 €/t, from the database sample. */
  demo_offerta: [
    { id_prodotto: 1, prezzo_unitario: 310 },
    { id_prodotto: 2, prezzo_unitario: 95 }
  ],

  /* DEMO_TRASPORTO_S: a batch registered live in the demo travels to the sawmill (demo_segheria,
     Segheria Alpina) by itself after this many seconds: "In viaggio" → "Trasferito a Segheria Alpina". */
  DEMO_TRASPORTO_S: 60,
  demo_segheria: 2,

  /* Date given to orders placed live in the demo (the sale date in the database sample). */
  demo_data_ordine: '2026-04-15',

  /* 10. ordine – stato: inviato | accettato | consegnato | rifiutato | annullato.
     Shown as ORD-2026-0001 (year of the order + id with 4 digits). data_consegna: the buyer picks it,
     default = order date + 7 days.
     Spread over 4 months so the dashboard chart has bars. */
  ordine: [
    { id: 1, id_offerta: 1, id_azienda: 5, data: '2026-01-18', quantita: 8, prezzo_totale: 2280, stato: 'consegnato', data_consegna: '2026-01-25' },
    { id: 2, id_offerta: 2, id_azienda: 4, data: '2026-02-12', quantita: 3, prezzo_totale: 270, stato: 'consegnato', data_consegna: '2026-02-16' },
    { id: 3, id_offerta: 1, id_azienda: 5, data: '2026-02-22', quantita: 4, prezzo_totale: 1140, stato: 'consegnato', data_consegna: '2026-03-01' },
    { id: 4, id_offerta: 3, id_azienda: 3, data: '2026-03-10', quantita: 30, prezzo_totale: 9150, stato: 'accettato', data_consegna: '2026-03-24' },
    { id: 5, id_offerta: 4, id_azienda: 5, data: '2026-04-08', quantita: 6, prezzo_totale: 2040, stato: 'inviato', data_consegna: '2026-04-15' }
  ],

  /* 11. passaggio – a batch moving from one company to another */
  passaggio: [
    { id: 1, id_lotto: 1, id_azienda_da: 1, id_azienda_a: 2, id_ordine: null, data_ora: '2026-03-20 08:00', stato: 'consegnato' },
    { id: 2, id_lotto: 2, id_azienda_da: 1, id_azienda_a: 2, id_ordine: null, data_ora: '2025-11-28 08:00', stato: 'consegnato' },
    { id: 3, id_lotto: 3, id_azienda_da: 1, id_azienda_a: 2, id_ordine: null, data_ora: '2026-01-27 08:00', stato: 'consegnato' },
    { id: 4, id_lotto: 4, id_azienda_da: 1, id_azienda_a: 2, id_ordine: null, data_ora: '2026-02-20 08:00', stato: 'consegnato' },
    { id: 5, id_lotto: 5, id_azienda_da: 1, id_azienda_a: 2, id_ordine: null, data_ora: '2026-03-08 08:00', stato: 'consegnato' },
    { id: 6, id_lotto: 2, id_azienda_da: 2, id_azienda_a: 5, id_ordine: 1, data_ora: '2026-01-18 10:00', stato: 'consegnato' },
    { id: 7, id_lotto: 3, id_azienda_da: 2, id_azienda_a: 3, id_ordine: 4, data_ora: '2026-03-10 10:00', stato: 'accettato' }
  ]
};
