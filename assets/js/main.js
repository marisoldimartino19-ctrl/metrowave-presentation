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
  const FLOW = window.METROWAVE_FLOW;
  const SLOTS = window.METROWAVE_SLOTS;
  const HEADWAY = window.METROWAVE_HEADWAY;
  const SVG_NS = "http://www.w3.org/2000/svg";
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

  // Colore del simbolo sui fondi scuri (card e pannello mappa): il colore della
  // stazione, schiarito verso il bianco solo se non raggiunge 3:1 di contrasto
  const ABYSS = "#0A0F2E";
  const mixWhite = (hex, t) =>
    "#" + [1, 3, 5].map((i) => Math.round(parseInt(hex.slice(i, i + 2), 16) * (1 - t) + 255 * t).toString(16).padStart(2, "0")).join("");
  const symbolColor = (hex) => {
    let t = 0;
    while (Math.min(contrast(mixWhite(hex, t), NIGHT), contrast(mixWhite(hex, t), ABYSS)) < 3) t += 0.01;
    return mixWhite(hex, t);
  };
  const star = (ok) => (ok ? "" : "*");

  // Simbolo della stazione, oppure lo spazio predisposto se non c'è ancora
  // (SVG inline da symbols.js: eredita il colore con currentColor, così in hover segue --ink)
  const SYMBOLS = window.METROWAVE_SYMBOLS || {};
  const symbolSlot = (s, cls = "") =>
    s.symbol && SYMBOLS[s.symbol]
      ? `<span class="symbol ${cls}" style="--sym:${symbolColor(s.color)}">${SYMBOLS[s.symbol]}</span>`
      : `<span class="symbol-slot ${cls}" aria-label="Spazio per il simbolo di ${s.name}"><span>Simbolo<br/>${s.num}</span></span>`;

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
      (s) => `<button type="button" data-goto="${s.id}" title="${s.num} ${s.name} · ${s.genre}" class="block w-2.5 h-2.5 md:w-3.5 md:h-3.5 rounded-full ring-2 ring-night hover:scale-150 transition-transform" style="background:${s.color}"></button>`
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

  /* ---------- 04 · STAZIONI (10 per slide, geometrie protagoniste) ---------- */
  const stationCard = (s) => `
      <button type="button" class="station-card station-card--grid reveal text-left bg-night flex flex-col" style="--c:${s.color};--ink:${ink(s.color)}" data-goto="${s.id}">
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

  function initStationsGrid() {
    $("#stations-grid").innerHTML = STATIONS.slice(0, 10).map(stationCard).join("");
    const gridB = $("#stations-grid-2");
    if (gridB) gridB.innerHTML = STATIONS.slice(10, 20).map(stationCard).join("");
  }

  /* ---------- 04 · SISTEMA CROMATICO ---------- */
  function initPalette() {
    $("#palette-primary").innerHTML = PRIMARY.map(
      (p) => `
      <button type="button" data-copy="${p.hex}" class="swatch-big text-left p-6 md:p-8 min-h-[9rem] flex flex-col justify-between" style="background:${p.hex};color:${ink(p.hex)}">
        <span class="t-label">Primario</span>
        <span>
          <span class="block t-lg font-display uppercase">${p.name}</span>
          <span class="flex flex-wrap gap-x-6 font-mono text-xs mt-2"><span>HEX ${p.hex}</span><span>RGB ${p.rgb}</span></span>
        </span>
      </button>`
    ).join("");

    $("#palette-secondary").innerHTML = STATIONS.map(
      (s) => `
      <button type="button" data-copy="${s.color}" class="swatch text-left p-3 min-h-[6.5rem] flex flex-col justify-between" style="background:${s.color};color:${ink(s.color)}" title="${s.genre} · ${s.color}">
        <span class="font-display text-xl leading-none">${s.num}</span>
        <span>
          <span class="block text-[11px] font-bold leading-tight">${s.genre}</span>
          <span class="block font-mono text-[10px] mt-1 opacity-80">${s.color}${star(s.confirmed.color)}</span>
        </span>
      </button>`
    ).join("");

    const pairingGrid = $("#palette-pairing");
    pairingGrid.innerHTML = STATIONS.map((s) => {
      const p = PAIRINGS[s.pairing];
      return `
      <div class="pair-tile flex flex-col min-h-[9rem]" data-pairing="${s.pairing}">
        <div class="flex-1 p-3 flex flex-col justify-between" style="background:${s.color};color:${p.hex}">
          <span class="t-label">${s.num} · ${s.name}</span>
          <span class="font-display uppercase text-xl leading-[0.95]">${s.genre}</span>
        </div>
        <div class="flex items-center justify-between px-3 py-2 t-label" style="background:${p.hex};color:${ink(p.hex)}">
          <span>+ ${p.label}${star(s.confirmed.pairing)}</span>
          <span class="font-mono normal-case tracking-normal">${p.hex}</span>
        </div>
      </div>`;
    }).join("");

    $$("#pairing-filter [data-filter]").forEach((btn) =>
      btn.addEventListener("click", () => {
        const f = btn.dataset.filter;
        $$("#pairing-filter .chip").forEach((c) => c.classList.toggle("is-active", c === btn));
        $$(".pair-tile", pairingGrid).forEach((t) => t.classList.toggle("is-dimmed", f !== "tutti" && t.dataset.pairing !== f));
      })
    );

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

  /* ---------- 05 · MAPPA INTERATTIVA ---------- */
  const map = { active: 0, playing: false, raf: null, timer: null, train: null };

  function initMap() {
    const svg = $("#metro-map");
    const pts = STATIONS.map((s) => s.map);
    const d = "M" + pts.map((p) => `${p.x},${p.y}`).join(" L");

    svg.innerHTML = `
      <path d="${d}" fill="none" stroke="#F2EFE8" stroke-opacity=".16" stroke-width="12" stroke-linejoin="round" stroke-linecap="round"/>
      <path id="map-progress" d="${d}" fill="none" stroke="#1ED760" stroke-width="12" stroke-linejoin="round" stroke-linecap="round"/>
    `;
    const progress = $("#map-progress", svg);
    map.progress = progress;
    map.total = progress.getTotalLength();
    progress.style.strokeDasharray = map.total;

    // Distanza cumulata di ogni stazione lungo il tracciato
    map.dist = pts.reduce((acc, p, i) => {
      acc.push(i === 0 ? 0 : acc[i - 1] + Math.hypot(p.x - pts[i - 1].x, p.y - pts[i - 1].y));
      return acc;
    }, []);

    const labelOffset = {
      left: { dx: -26, dy: 5, anchor: "end" },
      right: { dx: 26, dy: 5, anchor: "start" },
      top: { dx: 0, dy: -26, anchor: "middle" },
      bottom: { dx: 0, dy: 36, anchor: "middle" }
    };

    STATIONS.forEach((s, i) => {
      const { x, y, label } = s.map;
      const o = labelOffset[label];
      const g = document.createElementNS(SVG_NS, "g");
      g.setAttribute("class", "map-node");
      g.setAttribute("tabindex", "0");
      g.setAttribute("role", "button");
      g.setAttribute("aria-label", `${s.num} ${s.name}, ${s.genre}`);
      g.style.setProperty("--c", s.color);
      g.innerHTML = `
        <circle class="pulse" cx="${x}" cy="${y}" r="12" fill="${s.color}"/>
        <circle class="ring" cx="${x}" cy="${y}" r="12" fill="${NIGHT}" stroke="${s.color}" stroke-width="5"/>
        <text class="map-label" x="${x + o.dx}" y="${y + o.dy}" text-anchor="${o.anchor}">${s.num} ${s.name}</text>
      `;
      const pick = () => { stopJourney(); selectStation(i); };
      g.addEventListener("click", pick);
      g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); } });
      svg.appendChild(g);
    });

    const train = document.createElementNS(SVG_NS, "g");
    train.innerHTML = `<rect x="-17" y="-10" width="34" height="20" fill="#1ED760" stroke="${NIGHT}" stroke-width="4"/><rect x="-10" y="-4" width="7" height="8" fill="${NIGHT}"/><rect x="3" y="-4" width="7" height="8" fill="${NIGHT}"/>`;
    svg.appendChild(train);
    map.train = train;

    // Selettore a chip per mobile
    $("#map-chips").innerHTML = STATIONS.map(
      (s, i) => `<button type="button" data-chip="${i}" class="chip shrink-0"><span class="chip-dot" style="background:${s.color}"></span>${s.num} ${s.name}</button>`
    ).join("");
    $$("#map-chips [data-chip]").forEach((b) => b.addEventListener("click", () => { stopJourney(); selectStation(Number(b.dataset.chip)); }));

    $("#play-journey").addEventListener("click", () => (map.playing ? stopJourney() : playJourney()));
    selectStation(0);
  }

  function placeTrain(distance) {
    const p = map.progress.getPointAtLength(distance);
    map.train.setAttribute("transform", `translate(${p.x},${p.y})`);
    map.progress.style.strokeDashoffset = map.total - distance;
  }

  function selectStation(i) {
    map.active = i;
    $$(".map-node").forEach((n, k) => n.classList.toggle("is-active", k === i));
    $$("#map-chips .chip").forEach((c, k) => c.classList.toggle("is-active", k === i));
    if (!map.playing) placeTrain(map.dist[i]);
    renderPanel(STATIONS[i]);
  }

  function renderPanel(s) {
    const p = PAIRINGS[s.pairing];
    const panel = $("#station-panel");
    panel.innerHTML = `
      <div class="panel-swap h-full flex flex-col">
        <div class="flex justify-between items-start gap-4">
          <span class="font-display text-4xl md:text-5xl leading-none" style="color:${s.color}">${s.num}</span>
          ${symbolSlot(s, "w-11 h-11 md:w-14 md:h-14")}
        </div>
        <h3 class="font-display uppercase text-2xl md:text-3xl leading-[0.95] mt-3">${s.name}</h3>
        <p class="t-label mt-2 self-start px-2 py-1" style="background:${s.color};color:${ink(s.color)}">${s.genre}</p>

        <dl class="grid grid-cols-2 gap-px bg-paper/15 border border-paper/15 mt-3 text-sm">
          <div class="bg-night p-2.5">
            <dt class="t-label text-paper/50">Colore${star(s.confirmed.color)}</dt>
            <dd class="flex items-center gap-2 mt-1.5 font-mono text-xs"><span class="w-3.5 h-3.5" style="background:${s.color}"></span>${s.color}</dd>
          </div>
          <div class="bg-night p-2.5">
            <dt class="t-label text-paper/50">Abbinamento${star(s.confirmed.pairing)}</dt>
            <dd class="flex items-center gap-2 mt-1.5 font-bold text-xs"><span class="w-3.5 h-3.5 border border-paper/30" style="background:${p.hex}"></span>${p.label}</dd>
          </div>
        </dl>
        <p class="t-label text-paper/40 mt-3 text-[10px]">Scheda stazione e line-up in definizione</p>

        <div class="flex gap-px mt-auto pt-3">
          <button type="button" data-step="-1" class="flex-1 border border-paper/30 py-2 t-label hover:bg-paper hover:text-night">← Prec.</button>
          <button type="button" data-step="1" class="flex-1 border border-paper/30 py-2 t-label hover:bg-paper hover:text-night">Succ. →</button>
        </div>
      </div>`;
    $$("[data-step]", panel).forEach((b) =>
      b.addEventListener("click", () => {
        stopJourney();
        selectStation((map.active + Number(b.dataset.step) + STATIONS.length) % STATIONS.length);
      })
    );
  }

  function playJourney() {
    map.playing = true;
    $("#play-journey [data-label]").textContent = "Ferma il viaggio";
    const SPEED = 0.45; // unità SVG per ms
    const DWELL = 1100; // sosta in stazione (ms)
    let from = map.active === STATIONS.length - 1 ? 0 : map.active;
    selectStation(from);
    placeTrain(map.dist[from]);

    const leg = () => {
      if (from >= STATIONS.length - 1) return stopJourney();
      const a = map.dist[from], b = map.dist[from + 1];
      const start = performance.now();
      const step = (now) => {
        if (!map.playing) return;
        const t = Math.min(1, (now - start) / ((b - a) / SPEED));
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        placeTrain(a + (b - a) * eased);
        if (t < 1) { map.raf = requestAnimationFrame(step); return; }
        from += 1;
        selectStation(from);
        map.timer = setTimeout(leg, DWELL);
      };
      map.raf = requestAnimationFrame(step);
    };
    map.timer = setTimeout(leg, 500);
  }

  function stopJourney() {
    if (!map.playing) return;
    map.playing = false;
    cancelAnimationFrame(map.raf);
    clearTimeout(map.timer);
    $("#play-journey [data-label]").textContent = "Avvia il viaggio";
    placeTrain(map.dist[map.active]);
  }

  // Qualsiasi elemento con data-goto apre la stazione sulla mappa (slide 04)
  function initGoto() {
    document.addEventListener("click", (e) => {
      const el = e.target.closest("[data-goto]");
      if (!el) return;
      e.preventDefault();
      stopJourney();
      selectStation(STATIONS.findIndex((s) => s.id === el.dataset.goto));
      window.MetrowaveDeck?.goTo("mappa");
    });
  }

  /* ---------- 06 · USER FLOW — 7 slide ---------- */
  // Placeholder per i visual non ancora progettati: area dedicata, non un
  // mockup — in attesa dei materiali reali (ticket, quiz UI, QR, ecc.)
  const FLOW_PLACEHOLDER = [
    "VISUAL IN SVILUPPO — BIGLIETTO DIGITALE METRO WAVE",
    null, // step 2: demo quiz già funzionante, nessun placeholder
    "VISUAL IN SVILUPPO — MAPPA + QR CODE METRO WAVE",
    "VISUAL IN SVILUPPO — PERFORMANCE A BORDO",
    "VISUAL IN SVILUPPO — ESPERIENZA IN STAZIONE",
    "VISUAL IN SVILUPPO — MERCHANDISING & REWARD"
  ];

  function initFlowSlides() {
    $$(".flow-slide").forEach((section) => {
      const i = Number(section.dataset.flowSlide);
      const f = FLOW[i];
      section.innerHTML = `
        <div class="slide-inner">
          <div class="section-head grid grid-cols-12 gap-4 t-label">
            <span class="col-span-2">07</span>
            <span class="col-span-7">User flow — la notte di un passeggero</span>
            <span class="col-span-3 text-right">Step ${f.num} / ${pad(FLOW.length)}</span>
          </div>
          <div class="flex-1 min-h-0 flex flex-col gap-6">
            <div class="flow-head">
              <div>
                <span class="flow-num">${f.num}</span>
                <h2 class="t-lg font-display uppercase mt-1">${f.title}</h2>
              </div>
              <div class="flex flex-wrap gap-2 justify-end max-w-sm">${f.tags.map((t) => `<span class="chip">${t}</span>`).join("")}</div>
            </div>
            <p class="t-lead">${f.text}</p>
            <div class="flow-visual${f.demo === "quiz" ? " has-demo" : ""}" id="flow-visual-${i}"></div>
          </div>
        </div>`;
      if (f.demo === "quiz") {
        $(`#flow-visual-${i}`, section).innerHTML = quizMarkup();
        initQuiz($(`#flow-visual-${i}`, section));
      } else if (FLOW_PLACEHOLDER[i]) {
        $(`#flow-visual-${i}`, section).innerHTML = `<p>[ ${FLOW_PLACEHOLDER[i]} ]</p>`;
      }
    });
  }

  // Demo del quiz: la sfida è la stazione all'estremo opposto della linea
  function quizMarkup() {
    return `
      <div class="w-full">
        <p class="t-label text-paper/50 mb-3">Demo · Che genere ascolti sempre?</p>
        <div class="flex flex-wrap gap-2" id="quiz-options">
          ${STATIONS.map((s, k) => `<button type="button" class="chip" data-quiz="${k}"><span class="chip-dot" style="background:${s.color}"></span>${s.genre}</button>`).join("")}
        </div>
        <div class="mt-4 min-h-[4.5rem]" id="quiz-result"><p class="text-sm text-paper/50">Scegli un genere per ricevere la tua sfida.</p></div>
      </div>`;
  }

  function initQuiz(panel) {
    $$("[data-quiz]", panel).forEach((b) =>
      b.addEventListener("click", () => {
        const k = Number(b.dataset.quiz);
        const home = STATIONS[k];
        const dare = STATIONS[(k + STATIONS.length / 2) % STATIONS.length];
        $$("[data-quiz]", panel).forEach((c) => c.classList.toggle("is-active", c === b));
        $("#quiz-result", panel).innerHTML = `
          <div class="grid sm:grid-cols-2 gap-px bg-paper/15 panel-swap">
            <div class="bg-night p-4"><p class="t-label text-paper/50">La tua comfort zone</p><p class="font-display uppercase text-2xl mt-2">${home.name}</p><p class="text-sm text-paper/60">${home.genre}</p></div>
            <div class="p-4" style="background:${dare.color};color:${ink(dare.color)}"><p class="t-label">La tua sfida</p><p class="font-display uppercase text-2xl mt-2">${dare.name}</p><p class="text-sm">${dare.genre}</p></div>
          </div>`;
      })
    );
  }

  /* ---------- 07 · TIMETABLE ---------- */
  function initTimetable() {
    const table = $("#timetable-table");
    const rows = [
      { name: "A bordo", genre: "Vagoni · artisti emergenti", color: "#1ED760", acts: ["Live set", "Live set", "Live set"] },
      ...STATIONS.map((s) => ({ name: `${s.num} ${s.name}`, genre: s.genre, color: s.color, acts: ["TBA", "TBA", "TBA"] }))
    ];
    table.innerHTML = `
      <thead class="t-label text-paper/50 sticky top-0 bg-night z-10">
        <tr class="border-b-2 border-paper">
          <th class="p-3 w-[34%] font-normal">Stazione</th>
          ${SLOTS.map((sl) => `<th class="p-3 font-normal">${sl.label}<br/><span class="text-paper/40">${fmtMinutes(sl.from)}—${fmtMinutes(sl.to)}</span></th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${rows.map((r) => `
          <tr class="border-b border-paper/10" style="--c:${r.color};--ink:${ink(r.color)}">
            <td class="px-3 py-2.5">
              <span class="flex items-center gap-3">
                <span class="w-3 h-3 shrink-0" style="background:${r.color}"></span>
                <span><span class="font-display uppercase text-lg leading-none">${r.name}</span><span class="block font-mono text-[10px] uppercase tracking-widest text-paper/50 mt-1">${r.genre}</span></span>
              </span>
            </td>
            ${r.acts.map((act, k) => `<td class="slot-cell px-3 py-2.5 text-sm font-bold" data-slot="${k}">${act}</td>`).join("")}
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

  /* ---------- 08 · AMBIENT ACTIVATION: galleria editoriale + lightbox ---------- */
  const shotImg = (shot, cls, lazy) =>
    `<img src="${shot.src}" alt="${shot.title}: ${shot.caption}" class="${cls}"${lazy ? ' loading="lazy"' : ""} />`;

  function initActivation() {
    const SHOTS = window.METROWAVE_ACTIVATION;
    $("#activation-gallery").innerHTML = SHOTS.map(
      (shot, i) => `
      <button type="button" class="shot group relative overflow-hidden bg-night text-left" data-shot="${i}" aria-label="Apri a tutto schermo: ${shot.title}, ${shot.place}">
        <div class="shot-media aspect-[4/5] md:aspect-[16/11]">${shotImg(shot, "w-full h-full block object-cover", true)}</div>
        <div class="shot-meta absolute inset-x-0 bottom-0 p-4 md:p-5">
          <p class="t-label text-paper/70">${shot.place}</p>
          <p class="font-display uppercase text-2xl leading-none mt-2">${shot.title}</p>
        </div>
        <span class="shot-open t-label" aria-hidden="true">⤢</span>
      </button>`
    ).join("");

    const box = $("#lightbox");
    let current = 0;
    let lastFocus = null;
    const show = (i) => {
      current = (i + SHOTS.length) % SHOTS.length;
      const shot = SHOTS[current];
      $("#lightbox-media").innerHTML = shotImg(shot, "block object-contain");
      $("#lightbox-count").textContent = `${pad(current + 1)} / ${pad(SHOTS.length)}`;
      $("#lightbox-place").textContent = shot.place;
      $("#lightbox-title").textContent = shot.title;
      $("#lightbox-text").textContent = shot.caption;
    };
    const open = (i) => {
      lastFocus = document.activeElement;
      show(i);
      box.hidden = false;
      document.body.classList.add("lightbox-open");
      void box.offsetWidth; // applica display prima della dissolvenza
      box.classList.add("is-open");
      $("[data-close]", box).focus();
    };
    const close = () => {
      box.classList.remove("is-open");
      document.body.classList.remove("lightbox-open");
      setTimeout(() => (box.hidden = true), 250);
      lastFocus?.focus();
    };

    $("#activation-gallery").addEventListener("click", (e) => {
      const tile = e.target.closest("[data-shot]");
      if (tile) open(Number(tile.dataset.shot));
    });
    // Un click ovunque chiude, tranne sulle frecce
    box.addEventListener("click", (e) => {
      const nav = e.target.closest("[data-step]");
      if (nav) show(current + Number(nav.dataset.step));
      else close();
    });
    document.addEventListener("keydown", (e) => {
      if (box.hidden) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") show(current + 1);
      else if (e.key === "ArrowLeft") show(current - 1);
      else if (e.key === "Tab") {
        // focus intrappolato nel lightbox
        const items = $$("button", box);
        const k = items.indexOf(document.activeElement);
        e.preventDefault();
        items[(k + (e.shiftKey ? -1 : 1) + items.length) % items.length].focus();
      }
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
      c.classList.toggle("is-big", !!e.target.closest("a, button, .map-node, input"));
    });
  }

  initHero();
  initMarquee();
  initStationsGrid();
  initPalette();
  // Sezione Mappa interattiva rimossa dalla presentazione (rimane solo lo
  // step "Mappa + QR code" nello User Flow): initMap()/initGoto() disattivate,
  // definizioni e dati (stations.js) lasciati intatti per usi futuri.
  initFlowSlides();
  initTimetable();
  initActivation();
  initDeck();
  initCursor();
})();
