/* =========================================================
   METROWAVE — interazioni
   Presentazione a slide: ogni [data-section] è una schermata.
   Navigazione: frecce tastiera, pulsanti, indice, swipe — mai
   lo scroll di pagina (ogni slide scorre solo al proprio interno).
   ========================================================= */
(() => {
  const STATIONS = window.METROWAVE_STATIONS;
  const PRIMARY = window.METROWAVE_PRIMARY;
  const PAIRINGS = window.METROWAVE_PAIRINGS;
  const SLOTS = window.METROWAVE_SLOTS;
  const HEADWAY = window.METROWAVE_HEADWAY;
  const NIGHT = "#07070C";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const pad = (n) => String(n).padStart(2, "0");
  const fmtMinutes = (m) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;

  // Colore del testo leggibile su un fondo: tra nero e bianco, quello con il
  // rapporto di contrasto WCAG più alto
  const luminance = (hex) => {
    const [r, g, b] = [1, 3, 5].map((i) => {
      const c = parseInt(hex.slice(i, i + 2), 16) / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const contrast = (a, b) => {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  };
  const ink = (hex) => (contrast(hex, NIGHT) >= contrast(hex, "#FFFFFF") ? NIGHT : "#FFFFFF");

  // Colore del simbolo sui fondi scuri (card): il colore della stazione,
  // schiarito verso il bianco solo se non raggiunge 3:1 di contrasto
  const ABYSS = "#0A0F2E";
  const mixWhite = (hex, t) =>
    "#" + [1, 3, 5].map((i) => Math.round(parseInt(hex.slice(i, i + 2), 16) * (1 - t) + 255 * t).toString(16).padStart(2, "0")).join("");
  const symbolColor = (hex) => {
    let t = 0;
    while (Math.min(contrast(mixWhite(hex, t), NIGHT), contrast(mixWhite(hex, t), ABYSS)) < 3) t += 0.01;
    return mixWhite(hex, t);
  };

  // Simbolo della stazione, oppure lo spazio predisposto se non c'è ancora
  // (SVG inline da symbols.js: eredita il colore con currentColor, così in hover segue --ink)
  const SYMBOLS = window.METROWAVE_SYMBOLS || {};
  const symbolSlot = (s, cls = "") =>
    s.symbol && SYMBOLS[s.symbol]
      ? `<span class="symbol ${cls}" style="--sym:${symbolColor(s.color)}">${SYMBOLS[s.symbol]}</span>`
      : `<span class="symbol-slot ${cls}" aria-label="Spazio per il simbolo di ${s.name}"><span>Simbolo<br/>${s.num}</span></span>`;

  // Simbolo usato come geometria di sfondo (monocromo, bassa opacità: il
  // colore lo decide il CSS del contenitore, non symbolColor — qui non deve
  // garantire contrasto, deve restare uno sfondo)
  const bgSymbol = (stationId) => {
    const s = STATIONS.find((st) => st.id === stationId);
    return s && SYMBOLS[s.symbol] ? `<span class="symbol">${SYMBOLS[s.symbol]}</span>` : "";
  };

  /* ---------- COVER: campo di simboli originali dietro METRO/WAVE ----------
     Tre forme diverse (cerchio, nodo, quadrato annidato), nessuna in
     particolare: la cover è dell'intero festival, non di una stazione. */
  function initHeroField() {
    const field = $("#hero-field");
    if (!field) return;
    field.innerHTML = ["piscinola", "rione-alto", "centro-direzionale"].map(bgSymbol).join("");
  }

  /* ---------- CONCEPT: simboli originali al posto dell'onda astratta ----------
     "Venti fermate diventano venti palchi": al posto di una linea decorativa
     senza significato, alcuni dei 20 simboli reali, a scala diversa e in
     parte tagliati dal bordo della slide. */
  function initConceptStops() {
    const field = $("#concept-stops");
    if (!field) return;
    field.innerHTML = ["toledo", "vanvitelli", "quattro-giornate", "duomo"].map(bgSymbol).join("");
  }

  /* ---------- COVER: titolo a onda ---------- */
  function initHero() {
    const title = $("#hero-title");
    $$("[data-split]", title).forEach((word, w) => {
      const chars = word.textContent.trim(); // il testo reale resta nel markup: se lo script non parte, la cover è comunque completa
      const outline = word.hasAttribute("data-outline");
      word.innerHTML = [...chars]
        .map((ch, i) => `<span class="hero-letter${outline ? " outline" : ""}" style="--i:${i + w * 5}">${ch}</span>`)
        .join("");
    });

    const letters = $$(".hero-letter", title);
    const hero = $("#hero");
    let idleTimer;

    hero.addEventListener("pointermove", (e) => {
      title.classList.remove("hero-idle");
      letters.forEach((l) => {
        const r = l.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const f = Math.max(0, 1 - Math.hypot(dx, dy * 0.6) / 420);
        l.style.setProperty("--f", f.toFixed(3));
        l.classList.toggle("is-hot", f > 0.55);
      });
      clearTimeout(idleTimer);
      idleTimer = setTimeout(resetLetters, 1800);
    });
    hero.addEventListener("pointerleave", resetLetters);

    function resetLetters() {
      letters.forEach((l) => { l.style.setProperty("--f", 0); l.classList.remove("is-hot"); });
      title.classList.add("hero-idle");
    }

    // Mini linea con i colori delle 20 stazioni
    $("#hero-line").innerHTML = STATIONS.map(
      (s) => `<button type="button" title="${s.num} ${s.name} · ${s.genre}" class="block w-2.5 h-2.5 md:w-3.5 md:h-3.5 rounded-full ring-2 ring-night hover:scale-150 transition-transform" style="background:${s.color}"></button>`
    ).join("");

    const clock = $("#clock");
    const tick = () => {
      clock.textContent = new Date().toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Rome" });
    };
    tick();
    setInterval(tick, 10_000);
  }

  /* ---------- MARQUEE generi ---------- */
  function initMarquee() {
    const items = STATIONS.map(
      (s) => `<span class="inline-flex items-center gap-4 px-4">${s.genre}<span class="inline-block w-4 h-4 md:w-5 md:h-5 border-2 border-night" style="background:${s.color}"></span></span>`
    ).join("");
    $("#marquee-genres").innerHTML = `<div class="marquee__track">${items}${items}</div>`;
  }

  /* ---------- 04 · STAZIONI (griglia 5x2, ogni cella alla stessa posizione) ----------
     Ogni card resta nella sua cella fissa — lettura rigorosamente numerica
     grazie al semplice ordine del DOM (01→10, poi 11→20), nessuna consultazione
     compromessa. Dentro quella stessa griglia, una stazione per riga (quelle col
     simbolo più riconoscibile a colpo d'occhio) ha il simbolo scalato più grande:
     non venti card tutte identiche, ma nemmeno una gerarchia che nasconde le altre. */
  const FEATURED_STATIONS = new Set(["03", "09", "16", "20"]);
  const stationCard = (s) => {
    const style = `--c:${s.color};--ink:${ink(s.color)}`;
    const featured = FEATURED_STATIONS.has(s.num) ? " station-card--feature" : "";
    return `
      <button type="button" class="station-card station-card--grid${featured} reveal text-left bg-night flex flex-col" style="${style}">
        <div class="flex justify-between items-baseline gap-3">
          <span class="font-display leading-none station-card--num">${s.num}</span>
          <span class="t-label opacity-60">L1</span>
        </div>
        <div class="flex-1 flex items-center justify-center min-h-0">
          ${symbolSlot(s, "station-card--symbol")}
        </div>
        <div class="mt-auto">
          <h3 class="font-display uppercase leading-[0.95] station-card--name">${s.name}</h3>
          <p class="t-label mt-1 leading-relaxed">${s.genre}</p>
        </div>
      </button>`;
  };

  function initStationsGrid() {
    $("#stations-grid").innerHTML = STATIONS.slice(0, 10).map(stationCard).join("");
    const gridB = $("#stations-grid-2");
    if (gridB) gridB.innerHTML = STATIONS.slice(10, 20).map(stationCard).join("");
  }

  /* ---------- 03 · PALETTE (spettro continuo, non un elenco di swatch) ----------
     Le 20 stazioni diventano un'unica fascia continua, in ordine di linea:
     il colore del genere riempie quasi tutta la cella, una striscia sottile
     in basso porta il colore di abbinamento (nero/bianco/verde) — due
     informazioni in un solo oggetto visivo, leggibile a colpo d'occhio
     invece che in tre griglie separate. */
  function initPalette() {
    $("#palette-primary").innerHTML = PRIMARY.map(
      (p) => `
      <button type="button" data-copy="${p.hex}" class="palette-primary-tile flex-1 flex flex-col justify-between text-left" style="background:${p.hex};color:${ink(p.hex)}" title="${p.name} · ${p.hex}">
        <span class="t-label opacity-70">Primario</span>
        <span>
          <span class="block font-display uppercase palette-primary-tile__name">${p.name}</span>
          <span class="block font-mono palette-primary-tile__hex opacity-80">${p.hex}</span>
        </span>
      </button>`
    ).join("");

    $("#palette-spectrum").innerHTML = STATIONS.map((s) => {
      const p = PAIRINGS[s.pairing];
      return `
      <button type="button" data-copy="${s.color}" class="palette-band flex flex-col text-left" title="${s.num} · ${s.name} — ${s.genre}">
        <span class="palette-band__fill" style="background:${s.color};color:${ink(s.color)}">
          <span class="font-mono palette-band__num">${s.num}</span>
          <span class="font-display uppercase palette-band__name">${s.name}</span>
          <span class="font-mono palette-band__hex">${s.color}</span>
        </span>
        <span class="palette-band__pair" style="background:${p.hex}"></span>
      </button>`;
    }).join("");

    // Clic su un colore: copia l'HEX negli appunti
    document.addEventListener("click", (e) => {
      const el = e.target.closest("[data-copy]");
      if (!el) return;
      const hex = el.dataset.copy;
      navigator.clipboard?.writeText(hex).then(() => toast(`${hex} copiato`), () => toast(hex));
    });
  }

  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("is-on"), 1600);
  }

  /* ---------- 07 · USER FLOW — biglietto Spotify + esperienza interattiva ---------- */
  // Pattern QR deterministico (stesso seed = stesso disegno): non è un codice
  // funzionante, è il motivo grafico del "biglietto/scansione digitale".
  function qrPattern(seed, n = 6) {
    let h = 0;
    for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    const cells = [];
    for (let i = 0; i < n * n; i++) {
      h = (Math.imul(h, 1103515245) + 12345) >>> 0;
      cells.push(h % 5 === 0 ? 0 : (h >> 3) % 2);
    }
    // i tre angoli "finder" pieni, come nei QR veri: rende il motivo leggibile a colpo d'occhio
    [[0, 0], [0, n - 2], [n - 2, 0]].forEach(([r, c]) => { cells[r * n + c] = cells[r * n + c + 1] = cells[(r + 1) * n + c] = cells[(r + 1) * n + c + 1] = 1; });
    return `<div class="flow-qr" style="--qr-n:${n}">${cells.map((c) => `<span class="${c ? "is-on" : ""}"></span>`).join("")}</div>`;
  }

  function initFlowSlides() {
    const ticketStub = $("#flow-qr-ticket");
    if (ticketStub) ticketStub.innerHTML = qrPattern("metrowave-ticket");
    const scanStub = $("#flow-qr-stazione");
    if (scanStub) scanStub.innerHTML = qrPattern("metrowave-stazione", 5);
  }

  /* ---------- 07 · TIMETABLE ---------- */
  function initTimetable() {
    const table = $("#timetable-table");
    const rows = [
      { name: "A bordo", genre: "Vagoni · artisti emergenti", color: "#1ED760", acts: ["Live set", "Live set", "Live set"] },
      ...STATIONS.map((s) => ({ name: `${s.num} ${s.name}`, genre: s.genre, color: s.color, acts: ["TBA", "TBA", "TBA"] }))
    ];
    // Righe tabella: padding e font in clamp() legati all'altezza di viewport —
    // 21 righe devono stare nello spazio disponibile senza scrollbar interna,
    // su qualunque altezza di finestra (stesso principio delle altre slide).
    table.innerHTML = `
      <thead class="tt-head text-paper/50 sticky top-0 bg-night z-10">
        <tr class="border-b-2 border-paper">
          <th class="tt-cell w-[34%] font-normal">Stazione</th>
          ${SLOTS.map((sl) => `<th class="tt-cell font-normal">${sl.label}<br/><span class="tt-head__range text-paper/40">${fmtMinutes(sl.from)}—${fmtMinutes(sl.to)}</span></th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${rows.map((r) => `
          <tr class="border-b border-paper/10" style="--c:${r.color};--ink:${ink(r.color)}">
            <td class="tt-cell">
              <span class="flex items-center gap-3" title="${r.genre}">
                <span class="tt-swatch shrink-0" style="background:${r.color}"></span>
                <span class="font-display uppercase tt-cell__name leading-none">${r.name}</span>
              </span>
            </td>
            ${r.acts.map((act, k) => `<td class="slot-cell tt-cell tt-cell__slot font-bold" data-slot="${k}">${act}</td>`).join("")}
          </tr>`).join("")}
      </tbody>`;

    const scrubber = $("#tt-scrubber");
    const update = () => {
      const m = Number(scrubber.value);
      $("#tt-time").textContent = fmtMinutes(m);
      const h = HEADWAY.find((x) => m >= x.from && m < x.to);
      $("#tt-headway").textContent = h.every;
      $("#tt-headway-note").textContent = h.note;
      $$(".slot-cell", table).forEach((cell) => {
        const sl = SLOTS[cell.dataset.slot];
        cell.classList.toggle("is-live", m >= sl.from && m < sl.to);
        cell.classList.toggle("is-past", m >= sl.to);
      });
    };
    scrubber.addEventListener("input", update);
    update();
  }

  /* ---------- LIGHTBOX GENERICO: condiviso da Promo, User Flow e Ambient ---------- */
  const lbItemImg = (item, cls, lazy) =>
    `<img src="${item.src}" alt="${item.title}: ${item.caption}" class="${cls}"${lazy ? ' loading="lazy"' : ""} />`;

  let LB_ITEMS = [];
  let LB_INDEX = 0;
  let LB_LAST_FOCUS = null;
  const lbBox = () => $("#lightbox");

  function lbShow(i) {
    LB_INDEX = (i + LB_ITEMS.length) % LB_ITEMS.length;
    const item = LB_ITEMS[LB_INDEX];
    $("#lightbox-media").innerHTML = lbItemImg(item, "block object-contain");
    $("#lightbox-count").textContent = `${pad(LB_INDEX + 1)} / ${pad(LB_ITEMS.length)}`;
    $("#lightbox-place").textContent = item.place;
    $("#lightbox-title").textContent = item.title;
    $("#lightbox-text").textContent = item.caption;
  }
  function lbOpen(items, i) {
    LB_ITEMS = items;
    LB_LAST_FOCUS = document.activeElement;
    const box = lbBox();
    lbShow(i);
    box.hidden = false;
    document.body.classList.add("lightbox-open");
    void box.offsetWidth; // applica display prima della dissolvenza
    box.classList.add("is-open");
    $("[data-close]", box).focus();
  }
  function lbClose() {
    const box = lbBox();
    box.classList.remove("is-open");
    document.body.classList.remove("lightbox-open");
    setTimeout(() => (box.hidden = true), 250);
    LB_LAST_FOCUS?.focus();
  }
  (function initLightbox() {
    const box = lbBox();
    // Un click ovunque chiude, tranne sulle frecce
    box.addEventListener("click", (e) => {
      const nav = e.target.closest("[data-step]");
      if (nav) lbShow(LB_INDEX + Number(nav.dataset.step));
      else lbClose();
    });
    document.addEventListener("keydown", (e) => {
      if (box.hidden) return;
      if (e.key === "Escape") lbClose();
      else if (e.key === "ArrowRight") lbShow(LB_INDEX + 1);
      else if (e.key === "ArrowLeft") lbShow(LB_INDEX - 1);
      else if (e.key === "Tab") {
        // focus intrappolato nel lightbox
        const items = $$("button", box);
        const k = items.indexOf(document.activeElement);
        e.preventDefault();
        items[(k + (e.shiftKey ? -1 : 1) + items.length) % items.length].focus();
      }
    });
  })();

  /* ---------- 06 · PROMO: poster print + affissioni, ogni edizione visibile per intero ---------- */
  const PROMO_GALLERY = [
    { src: "assets/images/posters/01-piscinola-print.jpg", place: "Print · 70×100 cm", title: "01 · Piscinola", caption: "Hip Hop / Rap — poster editoriale, affisso in stazione e nei punti vendita." },
    { src: "assets/images/posters/08-medaglie-d-oro-print.jpg", place: "Print · 70×100 cm", title: "08 · Medaglie d'Oro", caption: "Pop — poster editoriale, affisso in stazione e nei punti vendita." },
    { src: "assets/images/posters/09-vanvitelli-print.jpg", place: "Print · 70×100 cm", title: "09 · Vanvitelli", caption: "Jazz — poster editoriale, affisso in stazione e nei punti vendita." },
    { src: "assets/images/posters/01-piscinola-affissione.jpg", place: "Affissione · 6×3 m", title: "01 · Piscinola", caption: "Hip Hop / Rap — formato banchina, nei corridoi della metro." },
    { src: "assets/images/posters/08-medaglie-d-oro-affissione.jpg", place: "Affissione · 6×3 m", title: "08 · Medaglie d'Oro", caption: "Pop — formato banchina, nei corridoi della metro." },
    { src: "assets/images/posters/09-vanvitelli-affissione.jpg", place: "Affissione · 6×3 m", title: "09 · Vanvitelli", caption: "Jazz — formato banchina, nei corridoi della metro." },
  ];

  function initPromoGallery() {
    const thumb = (item, i) => `
      <button type="button" class="promo-thumb" data-item="${i}" aria-label="Apri a tutto schermo: ${item.title}, ${item.place}">
        ${lbItemImg(item, "w-full h-full block object-cover", true)}
        <span class="promo-thumb__tag t-label">${item.title}</span>
      </button>`;
    $("#promo-gallery").innerHTML = `
      <div class="promo-gallery__row promo-gallery__row--print">${PROMO_GALLERY.slice(0, 3).map((item, i) => thumb(item, i)).join("")}</div>
      <div class="promo-gallery__row promo-gallery__row--affissione">${PROMO_GALLERY.slice(3, 6).map((item, i) => thumb(item, i + 3)).join("")}</div>`;
    $("#promo-gallery").addEventListener("click", (e) => {
      const tile = e.target.closest("[data-item]");
      if (tile) lbOpen(PROMO_GALLERY, Number(tile.dataset.item));
    });
  }

  /* ---------- 07 · USER FLOW: biglietto cartaceo, fronte e retro a schermo intero ---------- */
  const TICKET_GALLERY = [
    { src: "assets/images/tickets/biglietto-cartaceo-fronte.png", place: "Fronte", title: "Biglietto cartaceo", caption: "Tagliando ANM, in vendita alle biglietterie digitali di ogni stazione." },
    { src: "assets/images/tickets/biglietto-cartaceo-retro.png", place: "Retro", title: "Biglietto cartaceo", caption: "QR di accesso, valido su tutta la Linea 1 per la notte del festival." },
  ];

  function initTicketGallery() {
    const classes = ["ticket-big--fronte", "ticket-big--retro"];
    $("#ticket-showcase").innerHTML = TICKET_GALLERY.map((item, i) => `
      <button type="button" class="ticket-big ${classes[i]}" data-item="${i}" aria-label="Apri a tutto schermo: ${item.title}, ${item.place}">
        ${lbItemImg(item, "w-full h-full block object-cover", true)}
        <span class="ticket-big__tag t-label">${item.place}</span>
      </button>`).join("");
    $("#ticket-showcase").addEventListener("click", (e) => {
      const tile = e.target.closest("[data-item]");
      if (tile) lbOpen(TICKET_GALLERY, Number(tile.dataset.item));
    });
  }

  /* ---------- 08 · AMBIENT ACTIVATION: galleria editoriale + lightbox ---------- */
  function initActivation() {
    const SHOTS = window.METROWAVE_ACTIVATION;
    $("#activation-gallery").innerHTML = SHOTS.map(
      (shot, i) => `
      <button type="button" class="shot group relative overflow-hidden bg-night text-left" data-shot="${i}" aria-label="Apri a tutto schermo: ${shot.title}, ${shot.place}">
        <div class="shot-media h-full">${lbItemImg(shot, "w-full h-full block object-cover", true)}</div>
        ${i === 0 ? `
        <div class="ambient-headline reveal absolute inset-x-0 top-0 p-4 md:p-6">
          <p class="t-lg font-display uppercase leading-[0.95]">Fuori, silenzio.<br/>Dentro, la musica.</p>
          <p class="t-label text-paper/70 mt-3 max-w-[14rem]">Il punto segnato si accende solo in cuffia.</p>
        </div>` : ""}
        <div class="shot-meta absolute inset-x-0 bottom-0 p-4 md:p-5">
          <p class="t-label text-paper/70">${shot.place}</p>
          <p class="font-display uppercase text-2xl leading-none mt-2">${shot.title}</p>
        </div>
        <span class="shot-open t-label" aria-hidden="true">⤢</span>
      </button>`
    ).join("");

    $("#activation-gallery").addEventListener("click", (e) => {
      const tile = e.target.closest("[data-shot]");
      if (tile) lbOpen(SHOTS, Number(tile.dataset.shot));
    });
  }

  /* ---------- DECK: motore di navigazione a slide ---------- */
  function initDeck() {
    const slides = $$("[data-section]");
    const total = slides.length;
    const counter = $("#slide-counter");
    const progress = $("#progress");
    const navLinks = $$("[data-nav]");
    const prevBtn = $("#nav-prev");
    const nextBtn = $("#nav-next");
    let current = 0;
    let animating = false;

    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

    function revealIn(slide) {
      $$(".reveal", slide).forEach((el) => el.classList.add("is-in"));
    }

    function goTo(target, { silent } = {}) {
      const idx = typeof target === "number" ? target : slides.findIndex((s) => s.id === target);
      if (idx < 0 || idx === current || idx >= total) return;
      const dir = idx > current ? 1 : -1;
      const prevSlide = slides[current];
      const nextSlide = slides[idx];

      prevSlide.classList.remove("is-active");
      prevSlide.classList.toggle("is-prev-dir", dir > 0);
      nextSlide.classList.remove("is-prev-dir");
      // force reflow così il browser applica lo stato "entrante" prima di animare
      void nextSlide.offsetWidth;
      nextSlide.classList.add("is-active");
      revealIn(nextSlide);

      current = idx;
      updateChrome();
      if (!silent) nextSlide.querySelector("h1, h2")?.setAttribute("tabindex", "-1");
    }

    function updateChrome() {
      counter.textContent = `${pad(current + 1)} / ${pad(total)}`;
      progress.style.width = `${((current + 1) / total) * 100}%`;
      prevBtn.disabled = current === 0;
      nextBtn.disabled = current === total - 1;
      const activeId = slides[current].id;
      const group = activeId.startsWith("flow-") ? "flow-1" : activeId === "concept-2" ? "concept" : activeId === "stazioni-2" ? "stazioni" : activeId;
      navLinks.forEach((l) => l.classList.toggle("text-wred", l.dataset.gotoSlide === group));
    }

    prevBtn.addEventListener("click", () => goTo(current - 1));
    nextBtn.addEventListener("click", () => goTo(current + 1));

    document.addEventListener("click", (e) => {
      const el = e.target.closest("[data-goto-slide]");
      if (!el) return;
      e.preventDefault();
      goTo(el.dataset.gotoSlide);
    });

    document.addEventListener("keydown", (e) => {
      if (e.target.closest("input, textarea")) return;
      if (document.body.classList.contains("lightbox-open")) return;
      if (["ArrowRight", "PageDown"].includes(e.key)) { e.preventDefault(); goTo(current + 1); }
      else if (["ArrowLeft", "PageUp"].includes(e.key)) { e.preventDefault(); goTo(current - 1); }
      else if (e.key === "Home") { e.preventDefault(); goTo(0); }
      else if (e.key === "End") { e.preventDefault(); goTo(total - 1); }
    });

    // Swipe touch (mobile): orizzontale, soglia 48px, ignora gesti verticali
    // (così lo scroll interno di una slide lunga resta libero).
    let touchStartX = 0, touchStartY = 0;
    document.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    document.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
      if (dx < 0) goTo(current + 1); else goTo(current - 1);
    }, { passive: true });

    // Riapri su un hash diretto (#concept…) alla prima apertura
    const startId = location.hash?.slice(1);
    const startIdx = startId ? slides.findIndex((s) => s.id === startId) : 0;
    slides.forEach((s, i) => s.classList.toggle("is-active", i === (startIdx >= 0 ? startIdx : 0)));
    current = startIdx >= 0 ? startIdx : 0;
    revealIn(slides[current]);
    updateChrome();

    window.MetrowaveDeck = { goTo, get current() { return current; } };
  }

  function initCursor() {
    const c = $(".cursor");
    window.addEventListener("pointermove", (e) => {
      c.style.left = `${e.clientX}px`;
      c.style.top = `${e.clientY}px`;
      c.classList.toggle("is-big", !!e.target.closest("a, button, input"));
    });
  }

  initHero();
  initHeroField();
  initMarquee();
  initStationsGrid();
  initPalette();
  initConceptStops();
  initFlowSlides();
  initTicketGallery();
  initTimetable();
  initPromoGallery();
  initActivation();
  initDeck();
  initCursor();
})();
