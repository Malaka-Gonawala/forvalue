# Data still needed from the database

The website works now, but some values are not in the database sample yet.
They are shown on screen in **gold, in [brackets]** (or with a gold background).
To fix one: open `js/data.js`, find the row, put the real value, remove its `_ph` mark,
then press **Ripristina dati demo** in the site.

| Table | What is missing | Why it is needed | Placeholder used now | Where it shows |
|---|---|---|---|---|
| utente | Email + password of the 3 demo users (owner, sawmill, buyer) | To log in as each of the 3 roles | proprietario@forvalue.demo, segheria@forvalue.demo, acquirente@forvalue.demo · password `demo2027` | P0 Login, P6 Profilo |
| utente | First name + surname of the 3 users | Profile page "Referente" | [nome] [cognome] | P6 Profilo |
| azienda | P.IVA, address, town (comune) of all 5 companies | Profile, history steps ("Segheria Alpina · [comune]") | [P.IVA], [indirizzo], [comune] | Q1, D2, P6 |
| azienda | Region of each company | Marketplace "Regione" filter | Trentino-Alto Adige (owner + sawmill), [regione] (buyers) | D3 filter |
| certificazione | Certificate numbers + exact expiry date | Certificati page | [n. certificato], 31/12/2028 | P7, Q1 |
| particella | Town + hectares of Bosco Val Fiemme; a 2nd parcel (name, GPS) | Profile, history, extra batches | [comune], [Particella 2] at 46,30 N 11,47 E | P6, Q1 of extra batches |
| lotto | 4 more batches (code, species, m³, cut date, cert) | Owner list (P1/P5), sawmill table "Ultimi 5 lotti" (D1/D7), % certified KPI | FV-2027-00079 Larice 30 m³ · 00081 Abete rosso 50 m³ · 00083 Faggio 25 m³ (no cert) · 00085 Pino silvestre 20 m³ | P1, P5, D1, D7 |
| lavorazione + prodotto | Sawing of the extra batches and what it produced | So the extra offers have an origin batch | tavole/cippato/segatura rows marked `_ph` | D2, D3 |
| offerta | 3–4 more offers, at least 1 certified planks offer under 300 €/m³ (demo query 2) | Marketplace has more than 2 cards; query 2 returns a row | Tavole di larice 285,00 €/m³ · Cippato di larice 90,00 €/t · Tavole di abete rosso 305,00 €/m³ · Tavole di faggio 340,00 €/m³ · Segatura di faggio 60,00 €/t | D3, D4 |
| ordine | Past orders spread over Jan–Apr 2027 (the guide's 12 t chips order is more than the 6 t produced) | Dashboard KPIs + monthly chart | 5 orders, Jan–Apr 2027, on the extra offers only (FV-2027-00087 has no order until the live demo) | D1, D8 |
| ordine | Order number format | Confirmation page + orders list | the row id (e.g. "Ordine n. 6") | D6, D8 |
| ordine | Delivery date | Offer page asks for it | the buyer picks it (optional) | D4, D8 |
| — | Offer photos, map image | Cards and maps look real | green tile with a tree icon, "Mappa segnaposto" | D3, D4, D2, Q1 |
| — | Support email | Help page | [email supporto] | P9 |
