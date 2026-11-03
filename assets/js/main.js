/* =========================================================
   METROWAVE — interazioni
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

  /* ---------- HERO: titolo a onda ---------- */
  function initHero() {
    const title = $("#hero-title");
    $$("[data-split]", title).forEach((word, w) => {
      const outline = word.hasAttribute("data-outline");
      word.innerHTML = [...word.dataset.split]
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
      (s) => `<a href="#mappa" data-goto="${s.id}" title="${s.num} ${s.name} · ${s.genre}" class="block w-2.5 h-2.5 md:w-3.5 md:h-3.5 rounded-full ring-2 ring-night hover:scale-150 transition-transform" style="background:${s.color}"></a>`
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
      (s) => `<span class="inline-flex items-center gap-5 px-5">${s.genre}<span class="inline-block w-5 h-5 md:w-7 md:h-7 border-2 border-night" style="background:${s.color}"></span></span>`
    ).join("");
    $("#marquee-genres").innerHTML = `<div class="marquee__track">${items}${items}</div>`;
  }

  /* ---------- INSIGHT: togli le cuffie ---------- */
  function initHeadphones() {
    const section = $("#insight");
    const btn = $("#headphones-toggle");
    const status = $("#headphones-status");
    btn.addEventListener("click", () => {
      const muffled = section.classList.toggle("muffled");
      $("[data-label]", btn).textContent = muffled ? "Togli le cuffie" : "Rimetti le cuffie";
      status.textContent = muffled ? "● Cuffie: ON" : "○ Cuffie: OFF";
      status.classList.toggle("text-spotify", !muffled);
    });
  }

  /* ---------- 03 · STAZIONI ---------- */
  function initStationsGrid() {
    $("#stations-grid").innerHTML = STATIONS.map(
      (s) => `
      <button type="button" class="station-card reveal text-left bg-night p-4 sm:p-5 flex flex-col gap-5 min-h-[16rem] sm:min-h-[19rem]" style="--c:${s.color};--ink:${ink(s.color)}" data-goto="${s.id}">
        <div class="flex justify-between items-baseline gap-3">
          <span class="font-display text-3xl leading-none">${s.num}</span>
          <span class="t-label opacity-60">L1</span>
        </div>
        ${symbolSlot(s, "w-14 h-14 sm:w-20 sm:h-20")}
        <div class="mt-auto">
          <h3 class="font-display uppercase text-2xl sm:text-[1.7rem] leading-[0.95]">${s.name}</h3>
          <p class="t-label mt-3 leading-relaxed">${s.genre}</p>
          <div class="flex items-center gap-2 mt-4">
            <span class="station-swatch h-3 flex-1" style="background:${s.color}"></span>
            <span class="font-mono text-[10px] opacity-60">${s.color}${star(s.confirmed.color)}</span>
          </div>
        </div>
      </button>`
    ).join("");
  }

  /* ---------- 04 · SISTEMA CROMATICO ---------- */
  function initPalette() {
    $("#palette-primary").innerHTML = PRIMARY.map(
      (p) => `
      <button type="button" data-copy="${p.hex}" class="swatch-big text-left p-6 md:p-8 min-h-[11rem] flex flex-col justify-between" style="background:${p.hex};color:${ink(p.hex)}">
        <span class="t-label">Primario</span>
        <span>
          <span class="block t-lg font-display uppercase">${p.name}</span>
          <span class="flex flex-wrap gap-x-6 font-mono text-xs mt-2"><span>HEX ${p.hex}</span><span>RGB ${p.rgb}</span></span>
        </span>
      </button>`
    ).join("");

    $("#palette-secondary").innerHTML = STATIONS.map(
      (s) => `
      <button type="button" data-copy="${s.color}" class="swatch text-left p-3 min-h-[7.5rem] flex flex-col justify-between" style="background:${s.color};color:${ink(s.color)}" title="${s.genre} · ${s.color}">
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
      <div class="pair-tile flex flex-col min-h-[11rem]" data-pairing="${s.pairing}">
        <div class="flex-1 p-4 flex flex-col justify-between" style="background:${s.color};color:${p.hex}">
          <span class="t-label">${s.num} · ${s.name}</span>
          <span class="font-display uppercase text-2xl leading-[0.95]">${s.genre}</span>
        </div>
        <div class="flex items-center justify-between px-4 py-2 t-label" style="background:${p.hex};color:${ink(p.hex)}">
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
          <span class="font-display text-7xl leading-none" style="color:${s.color}">${s.num}</span>
          ${symbolSlot(s, "w-20 h-20")}
        </div>
        <h3 class="font-display uppercase text-4xl md:text-5xl leading-[0.95] mt-6">${s.name}</h3>
        <p class="t-label mt-3 self-start px-2 py-1" style="background:${s.color};color:${ink(s.color)}">${s.genre}</p>

        <dl class="grid grid-cols-2 gap-px bg-paper/15 border border-paper/15 mt-6 text-sm">
          <div class="bg-night p-3">
            <dt class="t-label text-paper/50">Colore${star(s.confirmed.color)}</dt>
            <dd class="flex items-center gap-2 mt-2 font-mono"><span class="w-4 h-4" style="background:${s.color}"></span>${s.color}</dd>
          </div>
          <div class="bg-night p-3">
            <dt class="t-label text-paper/50">Abbinamento${star(s.confirmed.pairing)}</dt>
            <dd class="flex items-center gap-2 mt-2 font-bold"><span class="w-4 h-4 border border-paper/30" style="background:${p.hex}"></span>${p.label}</dd>
          </div>
        </dl>
        <div class="mt-4 p-4 font-display uppercase text-2xl leading-none" style="background:${s.color};color:${p.hex}">${s.genre}</div>
        <p class="t-label text-paper/40 mt-4">Scheda stazione e line-up in definizione</p>

        <div class="flex gap-px mt-auto pt-6">
          <button type="button" data-step="-1" class="flex-1 border border-paper/30 py-3 t-label hover:bg-paper hover:text-night">← Prec.</button>
          <button type="button" data-step="1" class="flex-1 border border-paper/30 py-3 t-label hover:bg-paper hover:text-night">Succ. →</button>
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

  // Qualsiasi elemento con data-goto apre la stazione sulla mappa
  function initGoto() {
    document.addEventListener("click", (e) => {
      const el = e.target.closest("[data-goto]");
      if (!el) return;
      e.preventDefault();
      stopJourney();
      selectStation(STATIONS.findIndex((s) => s.id === el.dataset.goto));
      $("#mappa").scrollIntoView({ behavior: "smooth" });
    });
  }

  /* ---------- 06 · USER FLOW ---------- */
  function initFlow() {
    const list = $("#flow-steps");
    list.innerHTML = FLOW.map(
      (f, i) => `
      <li><button type="button" data-flow="${i}" class="flow-step w-full text-left flex items-center gap-5 px-5 md:px-6 py-4 border-b border-paper/10">
        <span class="font-display text-3xl leading-none w-10 shrink-0">${f.num}</span>
        <span class="font-bold">${f.title}</span>
        <span class="ml-auto t-label opacity-0 flow-arrow">→</span>
      </button></li>`
    ).join("");
    $$("[data-flow]", list).forEach((b) => b.addEventListener("click", () => selectFlow(Number(b.dataset.flow))));
    selectFlow(0);
  }

  function selectFlow(i) {
    const f = FLOW[i];
    $$("#flow-steps .flow-step").forEach((b, k) => b.classList.toggle("is-active", k === i));
    const panel = $("#flow-panel");
    panel.innerHTML = `
      <div class="panel-swap h-full flex flex-col gap-6">
        <div class="flex items-start justify-between gap-6">
          <span class="font-display leading-[0.8] text-[clamp(5rem,10vw,9rem)] text-spotify">${f.num}</span>
          <span class="t-label text-paper/50">Step ${i + 1} / ${FLOW.length}</span>
        </div>
        <h3 class="t-lg font-display uppercase">${f.title}</h3>
        <p class="t-lead">${f.text}</p>
        <div class="flex flex-wrap gap-2">${f.tags.map((t) => `<span class="chip">${t}</span>`).join("")}</div>
        ${f.demo === "quiz" ? quizMarkup() : ""}
        ${i === 2 || i === 3 ? `<a href="#mappa" class="self-start t-label border-b border-spotify text-spotify pb-1">Apri la mappa della Linea 1 →</a>` : ""}
        <div class="flex gap-px mt-auto pt-2">
          <button type="button" data-flow-step="-1" class="flex-1 border border-paper/30 py-3 t-label hover:bg-paper hover:text-night disabled:opacity-30" ${i === 0 ? "disabled" : ""}>← Step prec.</button>
          <button type="button" data-flow-step="1" class="flex-1 border border-paper/30 py-3 t-label hover:bg-paper hover:text-night disabled:opacity-30" ${i === FLOW.length - 1 ? "disabled" : ""}>Step succ. →</button>
        </div>
      </div>`;
    $$("[data-flow-step]", panel).forEach((b) => b.addEventListener("click", () => selectFlow(i + Number(b.dataset.flowStep))));
    if (f.demo === "quiz") initQuiz(panel);
  }

  // Demo del quiz: la sfida è la stazione all'estremo opposto della linea
  function quizMarkup() {
    return `
      <div class="border border-paper/15 p-5">
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

  /* ---------- 08 · AMBIENT ACTIVATION: bolla di silenzio ---------- */
  function initSilence() {
    const box = $("#silence-box");
    $("#silence-bars").innerHTML = Array.from({ length: 28 }, (_, i) => `<span class="eq-bar" style="--d:${(i * 0.137) % 1}s;--h:${30 + ((i * 37) % 70)}%"></span>`).join("");
    const btn = $("#silence-toggle");
    btn.addEventListener("click", () => {
      const silent = box.classList.toggle("is-silent");
      $("[data-label]", btn).textContent = silent ? "Collega le cuffie" : "Scollega le cuffie";
      const status = $("#silence-status");
      status.textContent = silent ? "● Silenzio" : "● In ascolto";
      status.classList.toggle("text-spotify", !silent);
      status.classList.toggle("text-paper/50", silent);
    });
  }

  /* ---------- NAVIGAZIONE / PRESENTAZIONE ---------- */
  function initNavigation() {
    const sections = $$("[data-section]");
    const links = $$("[data-nav]");
    const navList = $("#nav-links");
    const bar = $("#progress");

    window.addEventListener("scroll", () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.width = `${(scrollY / max) * 100}%`;
    }, { passive: true });

    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((l) => {
          const on = l.getAttribute("href") === `#${en.target.id}`;
          l.classList.toggle("text-wred", on);
          // Su mobile il menu scorre: porta in vista la voce attiva (solo il menu, non la pagina)
          if (on) navList.scrollTo({ left: l.offsetLeft - navList.clientWidth / 2 + l.offsetWidth / 2, behavior: "smooth" });
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => io.observe(s));

    // Apertura diretta con ancora (#concept…): il salto nativo avviene prima
    // che font, Tailwind e contenuti generati fissino il layout. Riallinea.
    window.addEventListener("load", () => {
      const target = location.hash && document.querySelector(location.hash);
      if (!target) return;
      document.fonts.ready.then(() =>
        requestAnimationFrame(() => target.scrollIntoView({ behavior: "instant", block: "start" }))
      );
    });

    // Frecce / PagSu-PagGiù: salta da una sezione all'altra come in una slide
    document.addEventListener("keydown", (e) => {
      if (e.target.closest("input, textarea, [role='button']")) return;
      const next = ["ArrowRight", "PageDown"].includes(e.key);
      const prev = ["ArrowLeft", "PageUp"].includes(e.key);
      if (!next && !prev) return;
      e.preventDefault();
      // Le sezioni atterrano sotto l'header (scroll-padding-top in CSS)
      const offset = $("header").offsetHeight;
      const tops = sections.map((s) => Math.round(s.getBoundingClientRect().top));
      const current = Math.max(0, tops.findLastIndex((t) => t <= offset + 2));
      let idx = current + (next ? 1 : -1);
      // A metà di una sezione lunga, "indietro" riporta prima al suo inizio
      if (prev && tops[current] < offset - 2) idx = current;
      sections[Math.max(0, Math.min(sections.length - 1, idx))].scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  /* ---------- REVEAL & CURSORE ---------- */
  function initReveal() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { threshold: 0.15 });
    $$(".reveal").forEach((el) => io.observe(el));
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
  initHeadphones();
  initStationsGrid();
  initPalette();
  initMap();
  initGoto();
  initFlow();
  initTimetable();
  initSilence();
  initNavigation();
  initReveal();
  initCursor();
})();
