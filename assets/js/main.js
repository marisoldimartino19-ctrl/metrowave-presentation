/* =========================================================
   METROWAVE — presentazione a slide orizzontali
   ========================================================= */
(() => {
  const STATIONS = window.METROWAVE_STATIONS;
  const PAIRINGS = window.METROWAVE_PAIRINGS;
  const FLOW = window.METROWAVE_FLOW;
  const SLOTS = window.METROWAVE_SLOTS;
  const HEADWAY = window.METROWAVE_HEADWAY;
  const SVG_NS = "http://www.w3.org/2000/svg";
  const NIGHT = "#07070C";
  const ABYSS = "#0A0F2E";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const pad = (n) => String(n).padStart(2, "0");
  const fmtMinutes = (m) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
  const wrap = (i, n) => (i + n) % n;

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

  // Colore della stazione sui fondi scuri, schiarito verso il bianco
  // solo se non raggiunge 3:1 di contrasto
  const mixWhite = (hex, t) =>
    "#" + [1, 3, 5].map((i) => Math.round(parseInt(hex.slice(i, i + 2), 16) * (1 - t) + 255 * t).toString(16).padStart(2, "0")).join("");
  const onDark = (hex) => {
    let t = 0;
    while (Math.min(contrast(mixWhite(hex, t), NIGHT), contrast(mixWhite(hex, t), ABYSS)) < 3) t += 0.01;
    return mixWhite(hex, t);
  };
  const star = (ok) => (ok ? "" : "*");

  // Simbolo della stazione (SVG inline da symbols.js: eredita il colore con currentColor),
  // oppure lo spazio predisposto se non c'è ancora
  const SYMBOLS = window.METROWAVE_SYMBOLS || {};
  const symbol = (s, color, cls = "") =>
    s.symbol && SYMBOLS[s.symbol]
      ? `<span class="symbol ${cls}" style="--sym:${color}">${SYMBOLS[s.symbol]}</span>`
      : `<span class="symbol-slot ${cls}" aria-label="Spazio per il simbolo di ${s.name}"><span>Simbolo<br/>${s.num}</span></span>`;

  /* =========================================================
     DECK: navigazione orizzontale tra le slide
     ========================================================= */
  const deck = { i: 0, slides: [], onLeave: {}, onKey: {} };

  function initDeck() {
    const track = $("#deck-track");
    deck.slides = $$(".slide", track);
    const n = deck.slides.length;

    $("#deck-total").textContent = pad(n);
    $("#deck-menu").innerHTML = deck.slides.map(
      (s, i) => `<li><button type="button" class="t-label" data-go="${i}"><span class="num">${pad(i + 1)}</span><span class="lbl">${s.dataset.title}</span></button></li>`
    ).join("");

    document.addEventListener("click", (e) => {
      const go = e.target.closest("[data-go]");
      if (go) return goTo(Number(go.dataset.go));
      const step = e.target.closest("[data-deck-step]");
      if (step) goTo(deck.i + Number(step.dataset.deckStep));
    });

    // Tastiera: frecce, PagSu/PagGiù (telecomandi da presentazione), Home/Fine
    document.addEventListener("keydown", (e) => {
      if (!$("#lightbox").hidden) return;
      if (e.target.closest("input, textarea, select")) return;
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const k = e.key;
      let to = null;
      if (k === "ArrowRight" || k === "PageDown") to = deck.i + 1;
      else if (k === "ArrowLeft" || k === "PageUp") to = deck.i - 1;
      else if (k === "Home") to = 0;
      else if (k === "End") to = n - 1;
      else if (k === "ArrowDown" || k === "ArrowUp") {
        // Su/giù scorrono gli elementi interni della slide (stazioni, step)
        const handler = deck.onKey[deck.slides[deck.i].id];
        if (handler) { e.preventDefault(); handler(k === "ArrowDown" ? 1 : -1); }
        return;
      }
      if (to === null) return;
      e.preventDefault();
      goTo(to);
    });

    // Rotella / trackpad: un gesto = una slide. Il blocco resta finché
    // arrivano eventi (inerzia del trackpad) e si libera poco dopo.
    let wheelLock = false;
    let wheelTimer;
    document.addEventListener("wheel", (e) => {
      if (!$("#lightbox").hidden) return;
      const horizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      const slide = deck.slides[deck.i];
      // Su schermi piccoli la slide può scorrere in verticale: lasciala scorrere
      if (!horizontal && canScroll(slide, e.deltaY)) return;
      e.preventDefault();
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => (wheelLock = false), 200);
      const d = horizontal ? e.deltaX : e.deltaY;
      if (wheelLock || Math.abs(d) < 10) return;
      wheelLock = true;
      goTo(deck.i + Math.sign(d));
    }, { passive: false });

    // Swipe su touch
    let touch = null;
    track.addEventListener("touchstart", (e) => {
      const t = e.touches[0];
      touch = { x: t.clientX, y: t.clientY };
    }, { passive: true });
    track.addEventListener("touchend", (e) => {
      if (!touch) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - touch.x;
      const dy = t.clientY - touch.y;
      touch = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) goTo(deck.i + (dx < 0 ? 1 : -1));
    }, { passive: true });

    // Apertura diretta con ancora (#stazioni…)
    const start = deck.slides.findIndex((s) => `#${s.id}` === location.hash);
    goTo(Math.max(0, start), { instant: true, force: true });
    addEventListener("hashchange", () => {
      const i = deck.slides.findIndex((s) => `#${s.id}` === location.hash);
      if (i >= 0) goTo(i);
    });
  }

  function canScroll(el, dy) {
    if (el.scrollHeight <= el.clientHeight + 1) return false;
    return dy > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 1 : el.scrollTop > 0;
  }

  function goTo(i, { instant = false, force = false } = {}) {
    const n = deck.slides.length;
    i = Math.max(0, Math.min(n - 1, i));
    if (i === deck.i && !force) return;

    const leaving = deck.slides[deck.i];
    if (leaving && i !== deck.i) deck.onLeave[leaving.id]?.();
    deck.i = i;

    const track = $("#deck-track");
    if (instant) track.style.transition = "none";
    track.style.transform = `translate3d(${-i * 100}%, 0, 0)`;
    if (instant) { void track.offsetWidth; track.style.transition = ""; }

    deck.slides.forEach((s, k) => {
      const on = k === i;
      s.classList.toggle("is-active", on);
      s.inert = !on;
      s.setAttribute("aria-hidden", String(!on));
      if (on) s.scrollTop = 0;
    });
    $$("#deck-menu [data-go]").forEach((b, k) => (k === i ? b.setAttribute("aria-current", "step") : b.removeAttribute("aria-current")));
    $("#deck-count").textContent = pad(i + 1);
    $("#deck-progress").style.width = `${((i + 1) / n) * 100}%`;
    $(".deck-arrow--prev").disabled = i === 0;
    $(".deck-arrow--next").disabled = i === n - 1;
    history.replaceState(null, "", `#${deck.slides[i].id}`);
  }

  /* =========================================================
     01 · COVER: titolo a onda
     ========================================================= */
  function initHero() {
    const title = $("#hero-title");
    $$("[data-split]", title).forEach((word, w) => {
      const outline = word.hasAttribute("data-outline");
      word.innerHTML = [...word.dataset.split]
        .map((ch, i) => `<span class="hero-letter${outline ? " outline" : ""}" style="--i:${i + w * 5}">${ch}</span>`)
        .join("");
    });

    const letters = $$(".hero-letter", title);
    const hero = $("#cover");
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

    // Mini linea con i colori delle 20 stazioni: apre la stazione nella slide 04
    $("#hero-line").innerHTML = STATIONS.map(
      (s, i) => `<button type="button" data-station-goto="${i}" title="${s.num} ${s.name} · ${s.genre}" aria-label="${s.num} ${s.name}, ${s.genre}" class="block w-2.5 h-2.5 md:w-3 md:h-3 rounded-full ring-2 ring-night hover:scale-150 transition-transform" style="background:${s.color}"></button>`
    ).join("");
    $("#hero-line").addEventListener("click", (e) => {
      const b = e.target.closest("[data-station-goto]");
      if (!b) return;
      selectStation(Number(b.dataset.stationGoto));
      goTo(slideIndex("stazioni"));
    });
  }

  const slideIndex = (id) => deck.slides.findIndex((s) => s.id === id);

  /* =========================================================
     02 · INSIGHT: togli le cuffie
     ========================================================= */
  function initHeadphones() {
    const slide = $("#insight");
    const btn = $("#headphones-toggle");
    const status = $("#headphones-status");
    btn.addEventListener("click", () => {
      const muffled = slide.classList.toggle("muffled");
      $("[data-label]", btn).textContent = muffled ? "Togli le cuffie" : "Rimetti le cuffie";
      status.textContent = muffled ? "● Cuffie: ON" : "○ Cuffie: OFF";
      status.classList.toggle("text-spotify", !muffled);
    });
  }

  /* =========================================================
     04 · STAZIONI: una alla volta, scelte dalla linea
     ========================================================= */
  const station = { i: 0 };

  function initStations() {
    const line = $("#station-line");
    line.innerHTML = STATIONS.map(
      (s, i) => `<button type="button" class="line-stop" data-station="${i}" style="--c:${s.color}" title="${s.name} · ${s.genre}" aria-label="${s.num} ${s.name}, ${s.genre}"><span class="line-dot"></span><span class="line-num">${s.num}</span></button>`
    ).join("");
    line.addEventListener("click", (e) => {
      const b = e.target.closest("[data-station]");
      if (b) selectStation(Number(b.dataset.station));
    });
    $$("[data-station-step]").forEach((b) =>
      b.addEventListener("click", () => selectStation(station.i + Number(b.dataset.stationStep)))
    );
    deck.onKey.stazioni = (d) => selectStation(station.i + d);
    selectStation(0);
  }

  function selectStation(i) {
    station.i = wrap(i, STATIONS.length);
    const s = STATIONS[station.i];
    const p = PAIRINGS[s.pairing];

    $("#station-detail").innerHTML = `
      <div class="panel-swap">
        <p class="font-display leading-none text-[clamp(3rem,min(7vw,10svh),7rem)]" style="color:${onDark(s.color)}">${s.num}</p>
        <h3 class="t-lg font-display uppercase mt-3">${s.name}</h3>
        <p class="t-label text-paper/60 mt-3">${s.genre}</p>
        <dl class="grid grid-cols-2 gap-6 max-w-sm mt-[3svh] border-t border-paper/20 pt-4">
          <div>
            <dt class="t-label text-paper/50">Colore${star(s.confirmed.color)}</dt>
            <dd class="flex items-center gap-2 mt-2 font-mono text-sm"><span class="w-4 h-4" style="background:${s.color}"></span>${s.color}</dd>
          </div>
          <div>
            <dt class="t-label text-paper/50">Abbinamento${star(s.confirmed.pairing)}</dt>
            <dd class="flex items-center gap-2 mt-2 text-sm font-bold"><span class="w-4 h-4 border border-paper/30" style="background:${p.hex}"></span>${p.label}</dd>
          </div>
        </dl>
      </div>`;

    // Pannello nell'abbinamento finale: fondo colore del genere, segno nel colore primario
    const visual = $("#station-visual");
    visual.style.backgroundColor = s.color;
    visual.style.color = p.hex;
    visual.innerHTML = `
      <div class="corner t-label"><span>L1 · ${s.num}</span><span>${s.name}</span></div>
      ${symbol(s, p.hex, "panel-swap")}
      <div class="genre-tag"><span class="font-display uppercase leading-[0.9] text-[clamp(1.75rem,3.2vw,3.25rem)]">${s.genre}</span></div>`;

    $("#station-count").textContent = `${s.num} / ${pad(STATIONS.length)}`;
    $$("#station-line .line-stop").forEach((b, k) => {
      b.classList.toggle("is-active", k === station.i);
      b.setAttribute("aria-pressed", String(k === station.i));
    });
  }

  /* =========================================================
     05 · USER FLOW + MAPPA
     ========================================================= */
  const flow = { i: 0 };

  function initFlow() {
    const list = $("#flow-steps");
    list.innerHTML = FLOW.map(
      (f, i) => `<li><button type="button" data-flow="${i}" aria-label="Step ${f.num}: ${f.title}">${f.num}</button></li>`
    ).join("");
    list.addEventListener("click", (e) => {
      const b = e.target.closest("[data-flow]");
      if (b) selectFlow(Number(b.dataset.flow));
    });
    deck.onKey.flow = (d) => selectFlow(Math.max(0, Math.min(FLOW.length - 1, flow.i + d)));
    selectFlow(0);
  }

  function selectFlow(i) {
    flow.i = i;
    const f = FLOW[i];
    $("#flow-detail").innerHTML = `
      <div class="panel-swap">
        <p class="font-display leading-none text-[clamp(3.5rem,min(7vw,12svh),7rem)] text-spotify">${f.num}</p>
        <h3 class="t-md font-display uppercase mt-3">${f.title}</h3>
        <p class="t-body text-paper/70 mt-4">${f.text}</p>
      </div>`;
    $$("#flow-steps button").forEach((b, k) => {
      b.classList.toggle("is-active", k === i);
      b.classList.toggle("is-done", k < i);
    });
  }

  const map = { active: 0, playing: false, raf: null, timer: null, train: null };

  function initMap() {
    const svg = $("#metro-map");
    const pts = STATIONS.map((s) => s.map);
    const d = "M" + pts.map((p) => `${p.x},${p.y}`).join(" L");

    svg.innerHTML = `
      <path d="${d}" fill="none" stroke="#F2EFE8" stroke-opacity=".14" stroke-width="12" stroke-linejoin="round" stroke-linecap="round"/>
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
        <text class="map-label" x="${x + o.dx}" y="${y + o.dy}" text-anchor="${o.anchor}">${s.name}</text>
      `;
      const pick = () => { stopJourney(); selectStop(i); };
      g.addEventListener("click", pick);
      g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); } });
      svg.appendChild(g);
    });

    const train = document.createElementNS(SVG_NS, "g");
    train.innerHTML = `<rect x="-17" y="-10" width="34" height="20" fill="#1ED760" stroke="${NIGHT}" stroke-width="4"/><rect x="-10" y="-4" width="7" height="8" fill="${NIGHT}"/><rect x="3" y="-4" width="7" height="8" fill="${NIGHT}"/>`;
    svg.appendChild(train);
    map.train = train;

    $("#play-journey").addEventListener("click", () => (map.playing ? stopJourney() : playJourney()));
    deck.onLeave.flow = stopJourney;
    selectStop(0);
  }

  function placeTrain(distance) {
    const p = map.progress.getPointAtLength(distance);
    map.train.setAttribute("transform", `translate(${p.x},${p.y})`);
    map.progress.style.strokeDashoffset = map.total - distance;
  }

  function selectStop(i) {
    map.active = i;
    const s = STATIONS[i];
    $$(".map-node").forEach((n, k) => n.classList.toggle("is-active", k === i));
    if (!map.playing) placeTrain(map.dist[i]);
    $("#map-caption").innerHTML = `<span class="inline-block w-2.5 h-2.5 rounded-full mr-2 align-middle" style="background:${s.color}"></span>${s.num} ${s.name} <span class="text-paper/50">— ${s.genre}</span>`;
  }

  function playJourney() {
    map.playing = true;
    $("#play-journey [data-label]").textContent = "Ferma il viaggio";
    const SPEED = 0.45; // unità SVG per ms
    const DWELL = 1100; // sosta in stazione (ms)
    let from = map.active === STATIONS.length - 1 ? 0 : map.active;
    selectStop(from);
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
        selectStop(from);
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

  /* =========================================================
     06 · AMBIENT ACTIVATION: galleria + lightbox
     ========================================================= */
  const shotImg = (shot, cls, lazy) =>
    `<img src="${shot.src}" alt="${shot.title}: ${shot.caption}" class="${cls}"${lazy ? ' loading="lazy"' : ""} />`;

  function initActivation() {
    const SHOTS = window.METROWAVE_ACTIVATION;
    const gallery = $("#activation-gallery");
    gallery.innerHTML = SHOTS.map(
      (shot, i) => `
      <button type="button" class="shot" data-shot="${i}" aria-label="Apri a tutto schermo: ${shot.title}, ${shot.place}">
        ${shotImg(shot, "", i > 0)}
        <div class="shot-meta">
          <p class="t-label text-paper/70">${shot.place}</p>
          <p class="font-display uppercase text-2xl md:text-3xl leading-none mt-2">${shot.title}</p>
        </div>
        <span class="shot-open t-label" aria-hidden="true">⤢</span>
      </button>`
    ).join("");

    const box = $("#lightbox");
    let current = 0;
    let lastFocus = null;
    const show = (i) => {
      current = wrap(i, SHOTS.length);
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
      void box.offsetWidth; // applica display prima della dissolvenza
      box.classList.add("is-open");
      $("[data-close]", box).focus();
    };
    const close = () => {
      box.classList.remove("is-open");
      setTimeout(() => (box.hidden = true), 250);
      lastFocus?.focus();
    };

    gallery.addEventListener("click", (e) => {
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
        items[wrap(k + (e.shiftKey ? -1 : 1), items.length)].focus();
      }
    });
  }

  /* =========================================================
     07 · TIMETABLE
     ========================================================= */
  function initTimetable() {
    $("#tt-slots").innerHTML = SLOTS.map(
      (sl) => `
      <li class="tt-slot">
        <p class="font-display uppercase text-3xl leading-none tt-name">${sl.label}</p>
        <p class="font-mono text-xs text-paper/50 mt-2">${fmtMinutes(sl.from)}—${fmtMinutes(sl.to)}</p>
        <p class="text-sm text-paper/70 mt-3">${sl.note}</p>
      </li>`
    ).join("");

    const scrubber = $("#tt-scrubber");
    const cells = $$(".tt-slot");
    const update = () => {
      const m = Number(scrubber.value);
      $("#tt-time").textContent = fmtMinutes(m);
      const h = HEADWAY.find((x) => m >= x.from && m < x.to);
      $("#tt-headway").textContent = h.every;
      $("#tt-headway-note").textContent = h.note;
      cells.forEach((cell, k) => {
        const sl = SLOTS[k];
        cell.classList.toggle("is-live", m >= sl.from && m < sl.to);
        cell.classList.toggle("is-past", m >= sl.to);
      });
    };
    scrubber.addEventListener("input", update);
    update();
  }

  /* ---------- CURSORE ---------- */
  function initCursor() {
    const c = $(".cursor");
    window.addEventListener("pointermove", (e) => {
      c.style.left = `${e.clientX}px`;
      c.style.top = `${e.clientY}px`;
      c.classList.toggle("is-big", !!e.target.closest("a, button, .map-node, input"));
    });
  }

  initDeck();
  initHero();
  initHeadphones();
  initStations();
  initFlow();
  initMap();
  initActivation();
  initTimetable();
  initCursor();
})();
