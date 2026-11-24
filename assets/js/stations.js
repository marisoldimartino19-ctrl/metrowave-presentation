/* =========================================================
   METROWAVE — Dati del progetto
   Unica fonte dati: card, palette, pannello, quiz e timetable
   vengono generati da qui.

   Campi stazione
   - color      colore secondario del genere (HEX)
   - pairing    abbinamento con la palette primaria: "nero" | "bianco" | "verde"
   - confirmed  { color, pairing }: false = proposta provvisoria da validare
   - symbol     null = spazio predisposto. Per inserire il simbolo:
                symbol: "assets/symbols/01-piscinola.svg"
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
    symbol: "assets/symbols/01-piscinola.svg" },
  { id: "chiaiano", num: "02", name: "Chiaiano", genre: "Reggae",
    color: "#238B45", pairing: "bianco", confirmed: { color: true, pairing: true },
    symbol: "assets/symbols/02-chiaiano.svg" },
  { id: "frullone", num: "03", name: "Frullone", genre: "Drum and Bass",
    color: "#00C2D9", pairing: "nero", confirmed: { color: true, pairing: true },
    symbol: "assets/symbols/03-frullone.svg" },
  { id: "colli-aminei", num: "04", name: "Colli Aminei", genre: "Indie Pop",
    color: "#B58BD9", pairing: "bianco", confirmed: { color: true, pairing: true },
    symbol: "assets/symbols/04-colli-aminei.svg" },
  { id: "policlinico", num: "05", name: "Policlinico", genre: "House",
    color: "#B6DC00", pairing: "nero", confirmed: { color: true, pairing: true },
    symbol: "assets/symbols/05-policlinico.svg" },
  { id: "rione-alto", num: "06", name: "Rione Alto", genre: "R&B",
    color: "#79203E", pairing: "bianco", confirmed: { color: true, pairing: true },
    symbol: "assets/symbols/06-rione-alto.svg" },
  { id: "montedonzelli", num: "07", name: "Montedonzelli", genre: "Funk",
    color: "#EE7E22", pairing: "nero", confirmed: { color: true, pairing: true },
    symbol: "assets/symbols/07-montedonzelli.svg" },
  { id: "medaglie-d-oro", num: "08", name: "Medaglie d'Oro", genre: "Pop",
    color: "#FF5AA6", pairing: "bianco", confirmed: { color: true, pairing: true },
    symbol: "assets/symbols/08-medaglie-d-oro.svg" },
  { id: "vanvitelli", num: "09", name: "Vanvitelli", genre: "Jazz",
    color: "#4F46FF", pairing: "bianco", confirmed: { color: true, pairing: true },
    symbol: "assets/symbols/09-vanvitelli.svg" },
  { id: "quattro-giornate", num: "10", name: "Quattro Giornate", genre: "Rock",
    color: "#2A2A2A", pairing: "bianco", confirmed: { color: true, pairing: true },
    symbol: "assets/symbols/10-quattro-giornate.svg" },
  { id: "salvator-rosa", num: "11", name: "Salvator Rosa", genre: "Alternative / Experimental",
    color: "#72787F", pairing: "verde", confirmed: { color: true, pairing: true },
    symbol: "assets/symbols/11-salvator-rosa.svg" },
  { id: "materdei", num: "12", name: "Materdei", genre: "Folk",
    color: "#728440", pairing: "bianco", confirmed: { color: true, pairing: true },
    symbol: "assets/symbols/12-materdei.svg" },
  { id: "museo", num: "13", name: "Museo", genre: "Musica Classica",
    color: "#E8DCC0", pairing: "nero", confirmed: { color: true, pairing: true },
    symbol: "assets/symbols/13-museo.svg" },
  { id: "dante", num: "14", name: "Dante", genre: "Cantautorato",
    color: "#905A45", pairing: "bianco", confirmed: { color: true, pairing: true },
    symbol: "assets/symbols/14-dante.svg" },
  { id: "toledo", num: "15", name: "Toledo", genre: "Musica Napoletana / Neomelodico",
    color: "#2374B4", pairing: "bianco", confirmed: { color: true, pairing: true },
    symbol: "assets/symbols/15-toledo.svg" },
  { id: "municipio", num: "16", name: "Municipio", genre: "Latin",
    color: "#FED801", pairing: "nero", confirmed: { color: true, pairing: true },
    symbol: "assets/symbols/16-municipio.svg" },
  { id: "universita", num: "17", name: "Università", genre: "Hyperpop / Future Pop",
    color: "#FF00AA", pairing: "verde", confirmed: { color: true, pairing: true },
    symbol: "assets/symbols/17-universita.svg" },
  { id: "duomo", num: "18", name: "Duomo", genre: "Corale / Gospel",
    color: "#FAFAFA", pairing: "verde", confirmed: { color: true, pairing: true },
    symbol: "assets/symbols/18-duomo.svg" },
  { id: "garibaldi", num: "19", name: "Garibaldi", genre: "World Music",
    color: "#450C0D", pairing: "bianco", confirmed: { color: true, pairing: true },
    symbol: "assets/symbols/19-garibaldi.svg" },
  { id: "centro-direzionale", num: "20", name: "Centro Direzionale", genre: "Techno / Electronic",
    color: "#8A2BE2", pairing: "nero", confirmed: { color: true, pairing: true },
    symbol: "assets/symbols/20-centro-direzionale.svg" }
];


/* Fasce orarie della notte (minuti dalle 00:00) */
window.METROWAVE_SLOTS = [
  { id: "warmup", label: "Warm-up", from: 0, to: 90, note: "Apertura delle stazioni, primi live set nei vagoni." },
  { id: "peak", label: "Peak time", from: 90, to: 210, note: "Tutte le 20 stazioni suonano in contemporanea." },
  { id: "closing", label: "Closing", from: 210, to: 300, note: "Ultimi set e deflusso verso i capolinea." }
];

/* Frequenza dei treni concordata con ANM (minuti dalle 00:00) */
window.METROWAVE_HEADWAY = [
  { from: 0, to: 120, every: 6, note: "Afflusso massimo: treni ravvicinati" },
  { from: 120, to: 240, every: 8, note: "Regime di crociera" },
  { from: 240, to: 300, every: 10, note: "Deflusso graduale verso i capolinea" }
];
