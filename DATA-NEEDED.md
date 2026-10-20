# Data still needed

**Nothing is missing now.** Everything is filled in. On 20/10/2026 Malaka approved the demo values in `DATA-ANSWERS.md`,
and they are in `js/data.js`. Put **the same values in phpMyAdmin**, so the screens match the database.

## Done (20/10/2026)

| Table | What | Value now in `js/data.js` |
|---|---|---|
| utente | Names of the 3 demo users | Marco Delladio (owner), Giulia Zeni (sawmill), Luca Bianchi (buyer). Logins unchanged, password `demo2026` |
| azienda | P.IVA, address, town, region of the 5 companies | e.g. Consorzio Val di Fiemme · 02487310225 · Via Roma 12 · Cavalese (TN) · Trentino-Alto Adige |
| certificazione | Certificate numbers | PEFC/18-22-117 (Consorzio), FSC-C148205 (Segheria), both to 31/12/2028 |
| particella | Town + hectares; 2nd parcel | Bosco Val Fiemme, Cavalese, 38,5 ha · Bosco Latemar, Tesero, 22 ha, 46,2870 N 11,5120 E |
| lotto, lavorazione, prodotto, offerta | 4 extra batches, their sawing, products, offers | Kept as they were (approved) |
| ordine | Past orders, order number, delivery date | 5 orders Jan–Apr 2026; shown as ORD-2026-0001 …; delivery = buyer's choice, default order date + 7 days |
| — | Support email | supporto@forvalue.demo (Aiuto page) |
| — | Photos and map (`img/`) | tavole.jpg, cippato.jpg, segatura.jpg, tronchi.jpg (cards, offer page, Lotto salvato), mappa-fiemme.jpg (QR page, batch detail, Nuovo lotto) with "© OpenStreetMap contributors" under the map |
