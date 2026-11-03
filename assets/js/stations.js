/* =========================================================
   METROWAVE — Dati del progetto
   Unica fonte dati: card, palette, mappa, pannello, quiz e
   timetable vengono generati da qui.

   Campi stazione
   - color      colore secondario del genere (HEX)
   - pairing    abbinamento con la palette primaria: "nero" | "bianco" | "verde"
   - confirmed  { color, pairing }: false = proposta provvisoria da validare
   - symbol     null = spazio predisposto. Per inserire il simbolo:
                symbol: "assets/symbols/01-piscinola.svg"
   - map        coordinate sul diagramma (viewBox 1000×610) e lato etichetta
   ========================================================= */

window.METROWAVE_PRIMARY = [
  { id: "verde", name: "Verde Spotify", hex: "#1ED760", rgb: "30, 215, 96" },
  { id: "bianco", name: "Bianco Puro", hex: "#FFFFFF", rgb: "255, 255, 255" },
  { id: "nero", name: "Nero Puro", hex: "#000000", rgb: "0, 0, 0" }
];

/* Colori usati negli abbinamenti (il nero è il fondo del sistema) */
window.METROWAVE_PAIRINGS = {
  nero: { label: "Nero", hex: "#0A0A0A" },
  bianco: { label: "Bianco", hex: "#FFFFFF" },
  verde: { label: "Verde Spotify", hex: "#1ED760" }
};

window.METROWAVE_STATIONS = [
  { id: "piscinola", num: "01", name: "Piscinola", genre: "Hip Hop / Rap",
    color: "#C62828", pairing: "nero", confirmed: { color: true, pairing: true },
    symbol: "assets/symbols/01-piscinola.svg", map: { x: 90, y: 70, label: "top" } },
  { id: "chiaiano", num: "02", name: "Chiaiano", genre: "Reggae",
    color: "#238B45", pairing: "bianco", confirmed: { color: true, pairing: true },
    symbol: "assets/symbols/02-chiaiano.svg", map: { x: 200, y: 70, label: "bottom" } },
  { id: "frullone", num: "03", name: "Frullone", genre: "Drum and Bass",
    color: "#00C2D9", pairing: "nero", confirmed: { color: true, pairing: false },
    symbol: "assets/symbols/03-frullone.svg", map: { x: 310, y: 70, label: "top" } },
  { id: "colli-aminei", num: "04", name: "Colli Aminei", genre: "Indie Pop",
    color: "#FF9EC4", pairing: "nero", confirmed: { color: false, pairing: false },
    symbol: "assets/symbols/04-colli-aminei.svg", map: { x: 420, y: 70, label: "bottom" } },
  { id: "policlinico", num: "05", name: "Policlinico", genre: "House",
    color: "#FF8A00", pairing: "nero", confirmed: { color: false, pairing: false },
    symbol: "assets/symbols/05-policlinico.svg", map: { x: 530, y: 70, label: "top" } },
  { id: "rione-alto", num: "06", name: "Rione Alto", genre: "R&B",
    color: "#7B2D5B", pairing: "bianco", confirmed: { color: false, pairing: false },
    symbol: "assets/symbols/06-rione-alto.svg", map: { x: 640, y: 70, label: "right" } },
  { id: "montedonzelli", num: "07", name: "Montedonzelli", genre: "Funk",
    color: "#D4A017", pairing: "nero", confirmed: { color: false, pairing: false },
    symbol: "assets/symbols/07-montedonzelli.svg", map: { x: 720, y: 150, label: "bottom" } },
  { id: "medaglie-d-oro", num: "08", name: "Medaglie d'Oro", genre: "Pop",
    color: "#FF2E93", pairing: "bianco", confirmed: { color: false, pairing: false },
    symbol: "assets/symbols/08-medaglie-d-oro.svg", map: { x: 830, y: 150, label: "top" } },
  { id: "vanvitelli", num: "09", name: "Vanvitelli", genre: "Jazz",
    color: "#4F46FF", pairing: "bianco", confirmed: { color: true, pairing: false },
    symbol: "assets/symbols/09-vanvitelli.svg", map: { x: 910, y: 230, label: "left" } },
  { id: "quattro-giornate", num: "10", name: "Quattro Giornate", genre: "Rock",
    color: "#FFE600", pairing: "nero", confirmed: { color: false, pairing: false },
    symbol: "assets/symbols/10-quattro-giornate.svg", map: { x: 910, y: 310, label: "left" } },
  { id: "salvator-rosa", num: "11", name: "Salvator Rosa", genre: "Alternative / Experimental",
    color: "#343A40", pairing: "verde", confirmed: { color: false, pairing: true },
    symbol: "assets/symbols/11-salvator-rosa.svg", map: { x: 830, y: 390, label: "bottom" } },
  { id: "materdei", num: "12", name: "Materdei", genre: "Folk",
    color: "#8D6E4A", pairing: "bianco", confirmed: { color: false, pairing: false },
    symbol: "assets/symbols/12-materdei.svg", map: { x: 720, y: 390, label: "top" } },
  { id: "museo", num: "13", name: "Museo", genre: "Musica Classica",
    color: "#E8DCC0", pairing: "nero", confirmed: { color: false, pairing: false },
    symbol: "assets/symbols/13-museo.svg", map: { x: 610, y: 390, label: "bottom" } },
  { id: "dante", num: "14", name: "Dante", genre: "Cantautorato",
    color: "#3F6E9E", pairing: "bianco", confirmed: { color: false, pairing: false },
    symbol: "assets/symbols/14-dante.svg", map: { x: 500, y: 390, label: "top" } },
  { id: "toledo", num: "15", name: "Toledo", genre: "Musica Napoletana / Neomelodico",
    color: "#0096D6", pairing: "bianco", confirmed: { color: false, pairing: false },
    symbol: "assets/symbols/15-toledo.svg", map: { x: 390, y: 390, label: "top" } },
  { id: "municipio", num: "16", name: "Municipio", genre: "Latin",
    color: "#FF6F59", pairing: "nero", confirmed: { color: false, pairing: false },
    symbol: "assets/symbols/16-municipio.svg", map: { x: 310, y: 470, label: "left" } },
  { id: "universita", num: "17", name: "Università", genre: "Hyperpop / Future Pop",
    color: "#B5179E", pairing: "verde", confirmed: { color: false, pairing: true },
    symbol: "assets/symbols/17-universita.svg", map: { x: 310, y: 550, label: "left" } },
  { id: "duomo", num: "18", name: "Duomo", genre: "Corale / Gospel",
    color: "#F2C14E", pairing: "nero", confirmed: { color: false, pairing: false },
    symbol: "assets/symbols/18-duomo.svg", map: { x: 430, y: 550, label: "top" } },
  { id: "garibaldi", num: "19", name: "Garibaldi", genre: "World Music",
    color: "#00897B", pairing: "bianco", confirmed: { color: false, pairing: false },
    symbol: "assets/symbols/19-garibaldi.svg", map: { x: 550, y: 550, label: "top" } },
  { id: "centro-direzionale", num: "20", name: "Centro Direzionale", genre: "Techno / Electronic",
    color: "#8A2BE2", pairing: "verde", confirmed: { color: true, pairing: false },
    symbol: "assets/symbols/20-centro-direzionale.svg", map: { x: 670, y: 550, label: "right" } }
];

/* User flow — la notte di un passeggero */
window.METROWAVE_FLOW = [
  { num: "01", title: "Attivazione biglietto",
    text: "Il biglietto acquistato online si attiva tramite app. Si può acquistare su Eventbrite, Spotify o al botteghino.",
    tags: ["App", "Eventbrite", "Spotify", "Botteghino"] },
  { num: "02", title: "Compilazione quiz",
    text: "Un test digitale individua la stazione più vicina, affina i gusti musicali e consegna la sfida fuori dalla comfort zone.",
    tags: ["Stazione più vicina", "Gusti musicali", "Sfida"], demo: "quiz" },
  { num: "03", title: "Mappa interattiva",
    text: "Si sblocca la sezione dell'app dedicata alla Linea 1, che fa da guida per tutta la durata dell'evento.",
    tags: ["Linea 1", "Guida live"] },
  { num: "04", title: "Scanner QR code",
    text: "In ogni stazione la scansione del QR code illumina la tappa corrispondente sull'app.",
    tags: ["QR in stazione", "Tappa illuminata"] },
  { num: "05", title: "Performance a bordo",
    text: "I vagoni si trasformano in palchi per i live set di artisti emergenti durante il tragitto.",
    tags: ["Live set", "Artisti emergenti"] },
  { num: "06", title: "Arrivo alle stazioni",
    text: "Si esplorano tutte le fermate, comprese le tappe inaspettate e meno affini ai propri gusti.",
    tags: ["20 fermate", "Tappe inaspettate"] },
  { num: "07", title: "Punti & gadget",
    text: "Più stazioni si visitano e più si esce dalla comfort zone, più punti si accumulano per bonus e gadget finali.",
    tags: ["Poster", "Sticker", "Vinili", "CD"] }
];

/* Fasce orarie della notte (minuti dalle 00:00) */
window.METROWAVE_SLOTS = [
  { id: "warmup", label: "Warm-up", from: 0, to: 90 },
  { id: "peak", label: "Peak time", from: 90, to: 210 },
  { id: "closing", label: "Closing", from: 210, to: 300 }
];

/* Frequenza dei treni concordata con ANM (minuti dalle 00:00) */
window.METROWAVE_HEADWAY = [
  { from: 0, to: 120, every: 6, note: "Afflusso massimo: treni ravvicinati" },
  { from: 120, to: 240, every: 8, note: "Regime di crociera" },
  { from: 240, to: 300, every: 10, note: "Deflusso graduale verso i capolinea" }
];

/* Ambient activation — galleria della "bolla di silenzio" (foto in assets/activation/) */
window.METROWAVE_ACTIVATION = [
  { title: "Piscinola", place: "01 · Hip Hop / Rap",
    caption: "All'uscita del capolinea, il box rosso ospita un live hip hop: chi passa vede il rapper, ma lo sente solo collegando le cuffie alla postazione.",
    src: "assets/activation/01-piscinola.jpg" },
  { title: "Vanvitelli", place: "09 · Jazz",
    caption: "In piazza Vanvitelli un trio jazz suona dentro la vetrina fonoassorbente. Fuori, il pubblico si ferma e ascolta in cuffia.",
    src: "assets/activation/02-vanvitelli.jpg" },
  { title: "Toledo", place: "15 · Musica Napoletana / Neomelodico",
    caption: "Davanti alla stazione Toledo, chitarra e voce napoletana nel box blu: la musica arriva solo a chi si collega.",
    src: "assets/activation/03-toledo.jpg" }
];
