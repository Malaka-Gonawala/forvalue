# Data still needed

Almost everything is filled in now. On 20/10/2026 Malaka approved the demo values in `DATA-ANSWERS.md`,
and they are in `js/data.js`. Put **the same values in phpMyAdmin**, so the screens match the database.

## Still missing: photos (you add the files)

Put these files in the `img/` folder (JPG, under 200 KB each, exactly these names).
Until a file is there, the site shows the green tile with "Foto da inserire" / "Mappa segnaposto".
As soon as the file exists, the photo appears by itself. Nothing else to change.

| File | What it shows | Where it shows |
|---|---|---|
| `img/tavole.jpg` | Sawn planks (tavole) | Marketplace cards and offer page for every "Tavole di …" offer |
| `img/cippato.jpg` | Wood chips (cippato) | Cards and offer page for "Cippato di …" |
| `img/segatura.jpg` | Sawdust (segatura) | Cards and offer page for "Segatura di …" |
| `img/tronchi.jpg` | Logs (tronchi) | Any other product |
| `img/mappa.jpg` | Map screenshot of Val di Fiemme | QR page, batch detail (D2), Nuovo lotto on the laptop |

## Done (20/10/2026)

| Table | What | Value now in `js/data.js` |
|---|---|---|
| utente | Names of the 3 demo users | Marco Delladio (owner), Giulia Zeni (sawmill), Luca Bianchi (buyer). Logins unchanged, password `demo2027` |
| azienda | P.IVA, address, town, region of the 5 companies | e.g. Consorzio Val di Fiemme · 02487310225 · Via Roma 12 · Cavalese (TN) · Trentino-Alto Adige |
| certificazione | Certificate numbers | PEFC/18-22-117 (Consorzio), FSC-C148205 (Segheria), both to 31/12/2028 |
| particella | Town + hectares; 2nd parcel | Bosco Val Fiemme, Cavalese, 38,5 ha · Bosco Latemar, Tesero, 22 ha, 46,2870 N 11,5120 E |
| lotto, lavorazione, prodotto, offerta | 4 extra batches, their sawing, products, offers | Kept as they were (approved) |
| ordine | Past orders, order number, delivery date | 5 orders Jan–Apr 2027; shown as ORD-2027-0001 …; delivery = buyer's choice, default order date + 7 days |
| — | Support email | supporto@forvalue.demo (Aiuto page) |
