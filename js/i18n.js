/* ForValue – i18n.js: the IT · EN switch.
   Pages are written in Italian. With English on, every Italian text on screen (text, aria-label,
   placeholder, title, alt, page title, confirm dialogs) is swapped for its English version from
   the list below, also for text drawn later by the page scripts. Codes, company names, places
   and people's names stay as they are. Numbers follow the language: 3.100,00 € / 3,100.00 €.
   The choice is saved in this browser (fv_lang_v1); Italian is the default. */

(function () {
  var KEY = 'fv_lang_v1';
  var lang = 'it';
  try { lang = localStorage.getItem(KEY) === 'en' ? 'en' : 'it'; } catch (e) {}
  document.documentElement.lang = lang;

  // Exact texts (Italian → English)
  var EN = {
    // menus, titles, buttons
    'Home': 'Home', 'I miei lotti': 'My batches', 'Nuovo lotto': 'New batch', 'Profilo': 'Profile', 'Altro': 'More', 'Lotti': 'Batches',
    'Certificati': 'Certificates', 'Notifiche': 'Notifications', 'Aiuto': 'Help', 'Esci': 'Log out', 'Menu': 'Menu',
    'Dashboard': 'Dashboard', 'Lotti ricevuti': 'Received batches', 'Le mie offerte': 'My offers', 'Circolarità': 'Circularity',
    'Ordini ricevuti': 'Received orders', 'Vendi': 'Sell', 'Marketplace': 'Marketplace', 'Carrello': 'Cart', 'I miei ordini': 'My orders',
    'Mercato': 'Market', 'Ordini': 'Orders', 'Ripristina dati demo': 'Reset demo data', 'Riporta lotti, offerte e ordini ai dati iniziali': 'Put batches, offers and orders back to the starting data',
    'Lingua': 'Language', 'Lingua (solo italiano in questa demo)': 'Language', 'ForValue, home': 'ForValue, home', 'Indietro': 'Back', 'Chiudi': 'Close',
    'Accedi': 'Log in', 'Email': 'Email', 'Password': 'Password', 'Mostra password': 'Show password', 'Nascondi password': 'Hide password',
    'Email o password non corretti. Controlla e riprova.': 'Wrong email or password. Check and try again.',
    'Ogni lotto,': 'Every batch,', 'dal bosco al cliente.': 'from forest to customer.', 'Ogni lotto, dal bosco al cliente.': 'Every batch, from forest to customer.',
    'Una piattaforma per tre ruoli della filiera del legno.': 'One platform for three roles in the wood supply chain.',
    'Proprietario forestale': 'Forest owner', 'Registra i lotti e crea il QR': 'Registers batches and creates the QR',
    'Segheria': 'Sawmill', 'Lavora i lotti e vende legname e scarti': 'Processes batches and sells timber and offcuts',
    'Acquirente': 'Buyer', 'Compra con origine certificata': 'Buys with certified origin',
    'Hai un QR su un lotto?': 'Got a QR on a batch?', 'Inquadralo con la fotocamera per vederne la storia.': 'Scan it with the camera to see its story.',
    "Hai un codice lotto o d'ordine?": 'Got a batch or order code?', 'Scrivilo qui per vedere la storia del lotto.': "Type it here to see the batch's story.",
    'La mia home': 'My home', 'Vai a ForValue': 'Go to ForValue', 'Modifica': 'Edit', 'Mostra': 'Show', 'Nascondi': 'Hide',
    'Annulla': 'Cancel', 'Apri': 'Open', 'Salva lotto': 'Save batch', 'Salva modifiche': 'Save changes', 'oppure': 'or',
    // scanner
    'Scansiona QR': 'Scan QR', 'Fotocamera': 'Camera', 'Usa una foto del QR': 'Use a photo of the QR', 'Inserisci codice lotto': 'Enter batch code',
    'Codice lotto': 'Batch code', 'Apri la storia di un lotto': "Open a batch's story", "Scrivi il codice del lotto o il numero d'ordine.": 'Type the batch code or the order number.',
    'Inquadra il QR stampato sul lotto: la storia del lotto si apre da sola.': "Point at the QR printed on the batch: the batch's story opens by itself.",
    "Il codice è scritto sotto il QR, ad esempio FV-2026-00087. Va bene anche un numero d'ordine (ORD-2026-0001).": 'The code is written under the QR, for example FV-2026-00087. An order number (ORD-2026-0001) works too.',
    'Avvio della fotocamera…': 'Starting the camera…', 'Fotocamera attiva: inquadra il QR.': 'Camera on: point at the QR.',
    'Fotocamera non trovata. Usa una foto del QR o scrivi il codice del lotto.': 'No camera found. Use a photo of the QR or type the batch code.',
    'La fotocamera non è disponibile qui. Usa una foto del QR o scrivi il codice del lotto.': 'The camera is not available here. Use a photo of the QR or type the batch code.',
    'Non hai dato il permesso alla fotocamera. Usa una foto del QR o scrivi il codice del lotto.': 'Camera permission was not given. Use a photo of the QR or type the batch code.',
    'Leggo la foto…': 'Reading the photo…', 'QR letto. Apro la storia del lotto…': "QR read. Opening the batch's story…",
    'Questo QR non è di un lotto ForValue. Prova con il QR stampato sul lotto.': 'This QR is not a ForValue batch. Try the QR printed on the batch.',
    'Non trovo un QR in questa foto. Prova con una foto più vicina e nitida.': "I can't find a QR in this photo. Try a closer, sharper photo.",
    'Non riesco ad aprire questa immagine.': "I can't open this image.",
    'Codice non valido. Scrivilo così: FV-2026-00087 (lotto) o ORD-2026-0001 (ordine).': 'Invalid code. Write it like this: FV-2026-00087 (batch) or ORD-2026-0001 (order).',
    'Ordine non trovato. Controlla il numero e riprova.': 'Order not found. Check the number and try again.',
    // batches, QR page
    'Lotto': 'Batch', 'Lotto salvato': 'Batch saved', 'Lotto non trovato': 'Batch not found', 'Questo QR non contiene un lotto valido.': 'This QR does not contain a valid batch.',
    'Prova a inquadrarlo di nuovo, oppure chiedi il codice del lotto al venditore.': 'Try scanning it again, or ask the seller for the batch code.',
    'Specie': 'Species', 'Volume': 'Volume', 'Particella': 'Parcel', 'Particella:': 'Parcel:', 'Data di taglio': 'Felling date', 'Taglio': 'Felling',
    'Certificato': 'Certificate', 'Certificazione': 'Certification', 'Proprietario': 'Owner', 'GPS': 'GPS', 'Nessuno': 'None', 'Nessuna': 'None',
    'Badge': 'Badges', 'Stato': 'Status', 'Storico': 'History', 'Storico del lotto': 'Batch history', 'Vedi storico del lotto': 'See batch history',
    'Apri mappa': 'Open map', 'Apri la mappa della particella': 'Open the map of the parcel', 'Mappa della particella': 'Map of the parcel', 'Apri pagina QR': 'Open QR page',
    'Codice QR del lotto': 'QR code of the batch', 'Tronchi del lotto': 'Logs of the batch',
    'CO₂ stoccata': 'CO₂ stored', 'CO₂ stoccata in questo lotto': 'CO₂ stored in this batch', 'EUDR verificato': 'EUDR verified', 'EUDR in attesa': 'EUDR pending',
    'Disponibile': 'Available', 'Disponibili': 'Available', 'Venduto': 'Sold', 'Venduti': 'Sold', 'Riservato': 'Reserved', 'Tutti': 'All', 'Tutte': 'All',
    'Stampa questo QR sul lotto: chiunque lo inquadra vede la storia.': 'Print this QR on the batch: anyone who scans it sees the story.',
    'Torna alla home': 'Back to home', 'Filtra i lotti': 'Filter batches', 'Cerca codice o specie': 'Search code or species',
    'Nessun lotto qui.': 'No batches here.', 'Non hai ancora lotti.': 'You have no batches yet.', 'Registra il primo lotto': 'Register the first batch',
    'Nessun lotto con questi filtri.': 'No batches with these filters.', 'Nessun lotto ricevuto.': 'No batches received.',
    'Foto': 'Photo', '(facoltativa)': '(optional)', 'Carica una foto': 'Upload a photo', 'Scatta una foto': 'Take a photo',
    'Rileva posizione': 'Get position', 'Rileva di nuovo': 'Get again', 'Posizione rilevata': 'Position found', 'Posizione rilevata dal telefono': 'Position from the phone',
    'Inserisci il volume in m³ per salvare il lotto.': 'Enter the volume in m³ to save the batch.', 'es. 45': 'e.g. 45',
    'In viaggio': 'On the way', "all'arrivo": 'to arrival', 'fatto': 'done', 'Partito': 'Left', 'Arrivato': 'Arrived', 'Bosco Val Fiemme': 'Val Fiemme forest', 'Arrivo in segheria tra': 'Arrives at the sawmill in', 'Viaggio': 'Journey', 'Viaggio del lotto verso la segheria': "The batch's journey to the sawmill",
    'Trasferito': 'Transferred', 'Segato in tavole e scarti': 'Sawn into boards and offcuts', 'Segato:': 'Sawn:',
    // owner home, profile, certificates, notifications
    'Lotti registrati': 'Registered batches', 'Volume registrato': 'Registered volume', '% certificato PEFC / FSC': '% PEFC / FSC certified',
    'I tuoi lotti': 'Your batches', 'Tutti i lotti': 'All batches', 'Ultime notifiche': 'Latest notifications', 'Nessuna notifica.': 'No notifications.',
    'lotti': 'batches', 'Bosco': 'Forest', 'Referente': 'Contact person', 'Regione': 'Region', 'Numero certificato': 'Certificate number',
    'Valido fino al': 'Valid until', 'Attivo': 'Active', 'Scaduto': 'Expired', 'Nessun certificato': 'No certificate', 'Nessun certificato.': 'No certificates.',
    'Aggiungi un certificato per mostrare il badge sui lotti.': 'Add a certificate to show the badge on batches.',
    'Gestione forestale sostenibile': 'Sustainable forest management', 'Forest Stewardship Council': 'Forest Stewardship Council',
    'I lotti di questo bosco ricevono il badge PEFC in automatico.': 'Batches from this forest get the PEFC badge automatically.',
    // help
    'Domande frequenti': 'Frequently asked questions', 'Serve altro aiuto?': 'Need more help?', 'A cosa serve il QR?': 'What is the QR for?',
    'Chi lo inquadra con il telefono vede la storia del lotto: taglio, trasporto, lavorazione e vendita. Non serve accedere.': "Whoever scans it with a phone sees the batch's story: felling, transport, processing and sale. No login needed.",
    'Come cambio lingua?': 'How do I change language?', 'Come registro un lotto?': 'How do I register a batch?',
    "Il selettore IT · EN è in alto. In questa versione dimostrativa c'è solo l'italiano.": 'The IT · EN switch is at the top. Tap EN for English, IT for Italian.',
    "Il selettore IT · EN è in alto: tocca EN per l'inglese, IT per l'italiano.": 'The IT · EN switch is at the top. Tap EN for English, IT for Italian.',
    'Tocca + Nuovo lotto, compila i campi e salva. Il QR si crea da solo.': 'Tap + New batch, fill in the fields and save. The QR is created by itself.',
    'Cosa vuol dire EUDR verificato?': 'What does EUDR verified mean?',
    'Il lotto ha la posizione GPS della particella e la data di taglio: sono i dati che il regolamento europeo EUDR chiede per provare che il legno non viene da zone disboscate.': "The batch has the parcel's GPS position and the felling date: the data the European EUDR regulation asks for to prove the wood does not come from deforested areas.",
    'Tracciabilità': 'Traceability', 'Vedi tracciabilità': 'See traceability',
    // sawmill
    'Volume scambiato': 'Volume traded', 'Prezzo medio': 'Average price', '% legno certificato': '% certified wood', 'Periodo del grafico': 'Chart period',
    'Mese': 'Month', 'Trimestre': 'Quarter', 'Anno': 'Year', 'Ultimi 5 lotti': 'Last 5 batches', 'Metti in vendita': 'Put on sale', 'Metti in vendita un lotto': 'Put a batch on sale',
    'Nuova offerta': 'New offer', 'Modifica offerta': 'Edit offer', 'Pubblica offerta': 'Publish offer', 'Pubblica scarti': 'Publish offcuts', 'Pubblicata': 'Published',
    'Offerta pubblicata': 'Offer published', 'Offerta aggiornata': 'Offer updated', 'Scarti pubblicati': 'Offcuts published', 'Esaurita': 'Sold out', 'Nuova': 'New',
    'Prezzo (€/m³)': 'Price (€/m³)', 'Prezzo (€/t)': 'Price (€/t)', 'Prezzo': 'Price', 'Quantità': 'Quantity', 'Prodotto': 'Product', 'Categoria': 'Category',
    'Inserisci una quantità maggiore di zero.': 'Enter a quantity greater than zero.', 'Inserisci un prezzo maggiore di zero.': 'Enter a price greater than zero.',
    'Questo lotto non è ancora stato segato: niente da mettere in vendita.': 'This batch has not been sawn yet: nothing to put on sale.',
    'Nessuna offerta pubblicata.': 'No offers published.', 'Offerte di scarti': 'Offcut offers', 'Scarti rimessi in circolo': 'Offcuts put back in use', 'Scarti venduti': 'Offcuts sold',
    'Gli scarti di segheria (cippato, segatura) rimessi in circolo invece di essere buttati.': 'Sawmill offcuts (wood chips, sawdust) put back in use instead of being thrown away.',
    'Ancora disponibili': 'Still available', 'Lotto di origine': 'Source batch', 'Cerca acquirente o prodotto': 'Search buyer or product', 'Cerca ordine o prodotto': 'Search order or product',
    'Da gestire': 'To handle', 'Inviati': 'Sent', 'Accettati': 'Accepted', 'Consegnati': 'Delivered', 'Rifiutati': 'Refused',
    'Inviato': 'Sent', 'Accettato': 'Accepted', 'Consegnato': 'Delivered', 'Rifiutato': 'Refused', 'Annullato': 'Cancelled',
    'Accetta': 'Accept', 'Rifiuta': 'Refuse', 'Ordine accettato': 'Order accepted', 'Ordine rifiutato': 'Order refused', 'Nessun ordine.': 'No orders.', 'Nessun ordine ancora.': 'No orders yet.',
    'Data': 'Date', 'Ordine': 'Order', 'Totale': 'Total', 'Origine': 'Origin', 'Riepilogo': 'Summary',
    // buyer
    'Legname': 'Timber', 'Scarti': 'Offcuts', 'Scarti di segheria in vendita': 'Sawmill offcuts for sale', 'Filtri': 'Filters', 'Rimuovi filtri': 'Clear filters',
    'Elimina account (demo)': 'Delete account (demo)', 'Account eliminato (demo)': 'Account deleted (demo)',
    'Account eliminato. Usa Ripristina dati demo per ripristinarlo.': 'Account deleted. Use Reset demo data to restore it.',
    "Eliminare l'account? Solo demo: puoi ripristinarlo con Ripristina dati demo.": 'Delete the account? Demo only: you can restore it with Reset demo data.',
    'La tua attività': 'Your activity', 'Ragione sociale': 'Company name', 'P.IVA': 'VAT number', 'Indirizzo': 'Address',
    'Offerte attive': 'Active offers', 'm³ venduti': 'm³ sold', 'Totale speso': 'Total spent', 'm³ acquistati': 'm³ bought', 'Fornitori': 'Suppliers',
    'Tronchi pronti per la vendita': 'Logs ready for sale', 'Lavorazione': 'Sawing', 'Tavole': 'Boards', 'Cippato': 'Wood chips', 'Data di lavorazione': 'Sawing date', 'Prezzo tavole': 'Board price', 'Prezzo cippato': 'Wood chip price', 'Pubblica offerte': 'Publish offers',
    'Prima segna cosa hai ricavato dal lotto. Valori proposti in proporzione a FV-2026-00087.': 'First record what you got from the batch. Suggested values are in proportion to FV-2026-00087.',
    'Questo lotto non è ancora stato segato: con Metti in vendita registri prima la lavorazione.': 'This batch has not been sawn yet: Put on sale lets you record the sawing first.',
    'Cerca specie, prodotto o venditore': 'Search species, product or seller', 'Prezzo minimo': 'Minimum price', 'Prezzo massimo': 'Maximum price', 'Min': 'Min', 'Max': 'Max',
    'Nessuna offerta con questi filtri.': 'No offers with these filters.', 'Nessuno scarto in vendita.': 'No offcuts for sale.', 'Venditore': 'Seller',
    'Aggiungi al carrello': 'Add to cart', 'Ordina ora': 'Order now', 'Data di consegna': 'Delivery date', 'Conferma ordine': 'Confirm order',
    'Continua gli acquisti': 'Continue shopping', 'Il carrello è vuoto.': 'Your cart is empty.', 'Vai al Marketplace': 'Go to the Marketplace', 'Torna al Marketplace': 'Back to the Marketplace',
    'Ordine inviato': 'Order sent', 'Questa offerta non è più disponibile.': 'This offer is no longer available.', 'Quantità non più disponibile. Controlla il carrello.': 'Quantity no longer available. Check your cart.',
    // dialogs
    "Rifiutare l'ordine? La quantità torna disponibile nell'offerta.": 'Refuse the order? The quantity goes back to the offer.',
    'Ripristinare i dati demo? Lotti, offerte e ordini creati verranno cancellati e dovrai accedere di nuovo.': 'Reset the demo data? Batches, offers and orders you created will be deleted and you will need to log in again.',
    // data values: species, products, regions
    'Abete rosso': 'Norway spruce', 'Larice': 'Larch', 'Faggio': 'Beech', 'Pino silvestre': 'Scots pine', 'Abete': 'Spruce'
  };
  var SP = { 'abete rosso': 'Norway spruce', 'larice': 'larch', 'faggio': 'beech', 'pino silvestre': 'Scots pine', 'abete': 'spruce' };
  var PROD = { tavole: 'boards', cippato: 'wood chips', segatura: 'sawdust', tronchi: 'logs' };
  var MON = { Gen: 'Jan', Feb: 'Feb', Mar: 'Mar', Apr: 'Apr', Mag: 'May', Giu: 'Jun', Lug: 'Jul', Ago: 'Aug', Set: 'Sep', Ott: 'Oct', Nov: 'Nov', Dic: 'Dec' };
  function words(s) { return s.replace(/\b(tavole|cippato|segatura|tronchi)\b/g, function (w) { return PROD[w]; }).replace(/ di (boards|wood chips|sawdust|logs)/g, ' of $1'); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  // Texts with a number, code or name inside
  var RX = [
    [/^Taglio (\d\d\/\d\d\/\d{4})$/, 'Felled $1'],
    [/^(Tavole|Cippato|Segatura|Tronchi) di (.+)$/, function (m, p, s) { var e = SP[s.toLowerCase()] || s; return (p === 'Tavole' ? cap(e) + ' boards' : cap(e) + ' ' + PROD[p.toLowerCase()]); }],
    [/^Segato: (.+)$/, function (m, d) { return 'Sawn: ' + words(d); }],
    [/^Tronchi selezionati: (.+)$/, function (m, d) { return 'Logs selected: ' + words(d); }],
    [/^[\d.,]+ (m³|t) .*(tavole|cippato|segatura)/, function (m) { return words(m); }],
    [/^Trasferito ad? (.+)$/, 'Transferred to $1'],
    [/^Venduto ad? (.+)$/, 'Sold to $1'],
    [/^Arrivato in (.+?)(\.?)$/, 'Arrived at $1$2'],
    [/^di (\d+) km$/, 'of $1 km'],
    [/^Da (.+)$/, 'From $1'],
    [/^Dal lotto (.+)$/, 'From batch $1'],
    [/^Lotto di origine: (.+)$/, 'Source batch: $1'],
    [/^Ordine (ORD-.+)$/, 'Order $1'],
    [/^QR di (.+)$/, 'QR of $1'],
    [/^Profilo: (.+)$/, 'Profile: $1'],
    [/^Quantità (.+)$/, function (m, x) { return 'Quantity ' + tr(x); }],
    [/^Rimuovi (.+)$/, function (m, x) { return 'Remove ' + tr(x); }],
    [/^Consegna richiesta: (.+)$/, 'Requested delivery: $1'],
    [/^(\d+) offert[ae]$/, function (m, n) { return n + (n === '1' ? ' offer' : ' offers'); }],
    [/^(\d+) prodott[oi]$/, function (m, n) { return n + (n === '1' ? ' product' : ' products'); }],
    [/^Massimo (.+) \(prodotto meno già ordinato\)$/, 'Maximum $1 (product minus what is already ordered)'],
    [/^Massimo (.+)$/, 'Maximum $1'],
    [/^Puoi ordinare al massimo (.+)$/, 'You can order at most $1'],
    [/^GPS non consentito: uso la particella (.+)$/, 'GPS not allowed: using parcel $1'],
    [/^GPS non disponibile: uso la particella (.+)$/, 'GPS not available: using parcel $1'],
    [/^Volume scambiato per (mese|trimestre|anno) \(m³\)$/, function (m, p) { return 'Volume traded per ' + { mese: 'month', trimestre: 'quarter', anno: 'year' }[p] + ' (m³)'; }],
    [/^Volume scambiato \(m³\)$/, 'Volume traded (m³)'],
    [/^Da gestire \((\d+)\)$/, 'To handle ($1)'],
    [/^(Gen|Feb|Mar|Apr|Mag|Giu|Lug|Ago|Set|Ott|Nov|Dic)( \d{4})?$/, function (m, a, y) { return MON[a] + (y || ''); }],
    [/^(.+) disponibili$/, '$1 available'],
    [/^max (.+)$/, 'max $1'],
    [/^valido fino al (\d{4})$/, 'valid until $1'],
    [/^Stampa (.+)$/, function (m) { return m; }]
  ];

  function one(s) {
    if (Object.prototype.hasOwnProperty.call(EN, s)) return EN[s];
    for (var i = 0; i < RX.length; i++) {
      if (RX[i][0].test(s)) return s.replace(RX[i][0], RX[i][1]);
    }
    return null;
  }
  // Whole text first, then each " · " part (e.g. "Abete rosso · 45 m³ · Taglio 12/03/2026")
  function tr(s) {
    var r = one(s);
    if (r != null) return r;
    if (s.indexOf('·') >= 0) {
      var parts = s.split(/(\s*·\s*)/), changed = false;
      for (var i = 0; i < parts.length; i += 2) {
        var p = parts[i].trim(); if (!p) continue;
        var x = one(p); if (x != null) { parts[i] = parts[i].replace(p, x); changed = true; }
      }
      if (changed) return parts.join('');
    }
    return s;
  }
  function trKeepSpace(raw) {
    var core = raw.replace(/\s+/g, ' ').trim();
    if (!core || !/[A-Za-zÀ-ù]/.test(core)) return raw;
    var out = tr(core);
    if (out === core) return raw;
    var lead = /^\s/.test(raw) ? ' ' : '', trail = /\s$/.test(raw) ? ' ' : '';
    return lead + out + trail;
  }

  var ATTRS = ['aria-label', 'placeholder', 'title', 'alt'];
  function skip(el) { return !el || el.closest('script,style,svg,.ms,[data-no-i18n]'); }
  function walk(root) {
    if (root.nodeType === 3) { if (!skip(root.parentElement)) { var v = trKeepSpace(root.nodeValue); if (v !== root.nodeValue) root.nodeValue = v; } return; }
    if (root.nodeType !== 1 || skip(root)) return;
    ATTRS.forEach(function (a) { var v = root.getAttribute(a); if (v) { var t = trKeepSpace(v); if (t !== v) root.setAttribute(a, t); } });
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT), n;
    while ((n = w.nextNode())) {
      if (n.nodeType === 3) { if (!skip(n.parentElement)) { var x = trKeepSpace(n.nodeValue); if (x !== n.nodeValue) n.nodeValue = x; } }
      else if (!skip(n)) ATTRS.forEach(function (a) { var v = n.getAttribute(a); if (v) { var t = trKeepSpace(v); if (t !== v) n.setAttribute(a, t); } });
    }
  }
  function title() { var t = tr(document.title); if (t !== document.title) document.title = t; }

  if (lang === 'en') {
    new MutationObserver(function (list) {
      list.forEach(function (m) {
        if (m.type === 'characterData') walk(m.target);
        else if (m.type === 'attributes') walk(m.target);
        else m.addedNodes.forEach(walk);
      });
      title();
    }).observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
    document.addEventListener('DOMContentLoaded', function () { walk(document.body); title(); });
    var c = window.confirm, a = window.alert;
    window.confirm = function (s) { return c.call(window, tr(String(s))); };
    window.alert = function (s) { return a.call(window, tr(String(s))); };
  }

  // The IT · EN switch (ui.LANG) on every page
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-lang]');
    if (!b) return;
    var l = b.getAttribute('data-lang');
    if (l === lang) return;
    try { localStorage.setItem(KEY, l); } catch (err) {}
    location.reload();
  });

  window.FV = window.FV || {};
  window.FV.i18n = { lang: lang, loc: lang === 'en' ? 'en-GB' : 'it-IT', t: function (s) { return lang === 'en' ? tr(s) : s; } };
})();
