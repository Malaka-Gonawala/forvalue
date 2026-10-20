# ForValue – Smart Forestry & Value Chain Network

School project (GPOI) by Malaka and Alessandro. A working website with **no back end**:
logins, wood batches, offers and orders are saved in the browser (localStorage).
It copies the Figma file "ForValue Mock-up".

> **Demo only.** The passwords are stored in the browser. This is not real security.

## Demo accounts

| Role | Email | Password | Opens on |
|---|---|---|---|
| Forest owner (Consorzio Val di Fiemme) | proprietario@forvalue.demo | demo2027 | Home (phone) |
| Sawmill (Segheria Alpina) | segheria@forvalue.demo | demo2027 | Dashboard (desktop) |
| Buyer (Arredi Bianchi Srl) | acquirente@forvalue.demo | demo2027 | Marketplace (desktop) |

The demo values (names, P.IVA, towns, certificates) were approved on 20/10/2026 (`DATA-ANSWERS.md`). Use the same values in phpMyAdmin.

**Changing user:** press **Esci** (phone: Altro; laptop: bottom of the sidebar), then log in with another account.
The ForValue logo always takes you to your own home (or to the login page when nobody is logged in).

**Who is logged in** is saved in the browser as login tokens, key `fv_tokens_v1`:
`{"proprietario": false, "segheria": true, "acquirente": false}`. Logging in sets that user's token to true and the others to false,
so only one user is active at a time. **Esci** and **Ripristina dati demo** set all of them to false.
Every protected page reads these tokens: no token → login page; another role's page → back to your own home.

## The demo in 6 steps

1. On the phone, log in as the owner → **+ Nuovo lotto** → fill the volume → **Salva lotto**. The QR appears.
2. **Vedi storico del lotto** opens the public QR page (no login needed). When you are logged in, its top bar shows **La mia home** instead of **Accedi**.
3. **Esci**, log in as the sawmill → Dashboard → **Vendi** on FV-2027-00087 → **Pubblica offerta** (28 m³ at 310,00 €/m³), then **Pubblica scarti** (6 t at 95,00 €/t). They appear in **Le mie offerte**.
4. **Esci**, log in as the buyer → Marketplace → tick **PEFC** → *Tavole di abete rosso* (310,00 €) → quantity 10 → **Ordina ora**.
5. The confirmation shows 10 m³ · 3.100,00 €. **Vedi tracciabilità** shows the new step "Venduto ad Arredi Bianchi Srl".
6. FV-2027-00087 is now **Venduto** everywhere (owner's list, sawmill's lists, QR page). Optional: as the sawmill, open **Ordini ricevuti** and press **Accetta** (or **Rifiuta**, which gives the quantity back).

Before presenting, press **Ripristina dati demo** (phone: Altro; desktop: bottom of the sidebar) to start clean. It also logs you out.

## Open it on your computer

Double-clicking `index.html` works for most pages, but browsers limit some features on `file://`.
It's better to run a tiny local server from this folder:

```
python -m http.server 8000
```

then open http://localhost:8000 in the browser. (On Windows you can also use the "Live Server" extension in VS Code.)

## Change a value

All the starting data is in **`js/data.js`**. Each table has the same name and the same fields as the MariaDB
database (`azienda`, `specie`, `utente`, `certificazione`, `particella`, `lotto`, `lavorazione`, `prodotto`,
`offerta`, `ordine`, `passaggio`).

1. Open `js/data.js` in any text editor.
2. Change the value, for example the owner's email in the `utente` table.
3. If the row has a `_ph` mark (placeholder), remove the field name from `_ph` (or the whole `_ph`), so it stops showing in gold.
4. Raise `seed_version` at the top of the file by 1 and save. Every browser then replaces its saved copy with the new data by itself (and logs you out).
   Without changing `seed_version`, press **Ripristina dati demo** to load the new values.

Order numbers are shown as **ORD-2027-0001** (year of the order + id with 4 digits). If the buyer does not pick a delivery date, it is the order date + 7 days.

Orders placed live in the demo get the date **15/04/2027** (the sale date of the database sample), so the story stays in 2027.
You can change it in `js/data.js` (`demo_data_ordine`).

Things that are **not** columns in the database are worked out the same way the demo queries do:
- **Batch status**: Venduto if an order on it is *inviato*, *accettato* or *consegnato*, otherwise Disponibile. A *rifiutato* (refused) or *annullato* order does not count.
- **EUDR verificato**: the parcel has GPS (lat/lon) and the batch has a cut date.
- **CO₂**: volume × `fattore_co2` of the species (45 m³ × 0,7 = 31,5 t).

## Files

| File | What it is |
|---|---|
| `index.html` | P0 Login |
| `home.html`, `nuovo-lotto.html`, `lotto-salvato.html` | P1 Home, P2 New batch, P3 Batch saved + QR |
| `altro.html`, `lotti.html`, `profilo.html`, `certificati.html`, `notifiche.html`, `aiuto.html` | P4–P9 phone menu pages |
| `qr.html` | Q1 public QR page |
| `dashboard.html`, `lotto.html`, `segheria-lotti.html` | D1 Dashboard, D2 Batch detail + sell panel, D7 Lotti ricevuti |
| `offerte.html`, `ordini-ricevuti.html` | Sawmill: Le mie offerte (`?cat=scarti` = Circolarità), Ordini ricevuti (Accetta / Rifiuta) |
| `marketplace.html`, `offerta.html`, `carrello.html`, `ordine-inviato.html`, `ordini.html` | Buyer: D3 Marketplace, D4 Offer, D5 Cart, D6 Order sent, D8 I miei ordini |
| `css/` | `base.css` (colours, badges, bars), `phone.css`, `desk.css`, `shell.css` (sidebar, tab bar, phone/laptop switch), fonts |
| `js/data.js` | Seed data (same tables as the database) |
| `js/store.js` | Every read and write to localStorage |
| `js/auth.js` | Login tokens (`fv_tokens_v1`), login, logout, role checks |
| `js/ui.js` | Italian number/date format, badges, menus per role, QR link |
| `js/lib/qrcode.js` | QR generator (qrcode-generator, MIT), works offline |
| `DATA-NEEDED.md` | Values still missing from the database |

Each page starts with a comment saying which Figma screen it is.

### Menus and screen sizes

Each user sees only their own functions (the menus are in `js/ui.js`, `NAV`). Opening another user's page sends you back to your own home.

| User | Phone tab bar (centre = gold) | Laptop sidebar |
|---|---|---|
| Owner | Home, Lotti, + Nuovo lotto, Profilo, Altro | Home, I miei lotti, Nuovo lotto, Certificati, Notifiche, Profilo |
| Sawmill | Home, Lotti, + Vendi, Ordini, Altro | Dashboard, Lotti ricevuti, Le mie offerte, Circolarità, Ordini ricevuti |
| Buyer | Mercato, Scarti, Carrello, Ordini, Altro | Marketplace, Circolarità, Carrello, I miei ordini |

Every page works on a phone and on a laptop: under 900 px wide you get the phone look (green bar and tab bar), from 900 px the laptop look (green sidebar). The public QR page has no sidebar: on a laptop it uses the full width with the data card next to the batch code.

## How the QR works

The QR link carries the batch data inside the address (`qr.html?d=…`, short JSON in base64url).
So a teacher's phone that has never opened the site still shows the full history.
If `d` is missing, `qr.html?c=FV-2027-00087` reads the batch from this browser's storage;
if that fails too, the page says "Lotto non trovato".

**Important:** the QR contains the address of the page that made it. Make the QR you print from the
**published GitHub Pages site**, not from a local file or localhost, or phones won't open it.

## Publish on GitHub Pages

1. Go to https://github.com and sign in. Click **New repository**, name it `forvalue`, make it **Public**, click **Create repository**.
2. Click **uploading an existing file**, drag **everything inside this folder** (so `index.html` is at the top level, next to `css/` and `js/`), then **Commit changes**.
3. Open **Settings → Pages**. Under *Build and deployment* choose **Deploy from a branch**, branch **main**, folder **/ (root)**, then **Save**.
4. Wait 1–2 minutes. The address appears at the top of the Pages settings, like `https://<your-username>.github.io/forvalue/`.
5. Open that address, log in as the owner, open the QR of FV-2027-00087 (Lotti → the batch, or create a new batch) and print that QR.
6. Test it with 2 phones **on mobile data** (not the school Wi-Fi).

The empty `.nojekyll` file tells GitHub to publish the files exactly as they are.

## Known limits (it's a prototype)

- The IT · EN switch is shown but only Italian exists.
- Data lives in one browser: the phone and the laptop each have their own copy. The QR page is the exception, because its data is in the link.
- Photos of new batches are made small and saved in the browser. Product photos and the map come from files in `img/` (names in `DATA-NEEDED.md`); until a file is there the green tile shows.
