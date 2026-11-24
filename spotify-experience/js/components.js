/* ---- home sections ---- */
function homeAll(){
  /* F1 · replica della Home reale (screenshot) */
  const sc=[
   [`<div class="sc-av" style="padding:0">${gcover('#3F7B2A','#E8115B','Mix',58)}</div>`,'Mix recenti'],
   [gcover('#0B2A3F','#4A90B8','Atto II',58),'Geolier - TUTTO È POSSIBILE - ATTO II','eq'],
   [`<div class="sc-av">${avatar('Oasis','#3a3a3a',46)}</div>`,'Oasis'],
   [gcover('#7A1FFF','#FF00A8','Tech House',58),'TECH HOUSE 2026 🟣 Ibiza Party Remix'],
   [`<div class="sc-av">${avatar('Olly','#E8115B',46)}</div>`,'Olly'],
   [gcover('#FF5AA5','#7A1F3D','Hello',58),'HELLO KITTY (feat. Sillyelly)'],
   [`<div class="sc-av">${avatar('Geolier','#8A8F99',46)}</div>`,'Geolier'],
   [gcover('#FFD600','#C62828','Classici',58),'Classici Italiani'],
  ];
  return `<div class="shortcuts">${sc.map(([cv,l,eq])=>`<button class="sc" onclick="toast('Contenuto di esempio')">${cv}<span class="lbl">${l}</span>${eq?'<span class="eqd">⋯</span>':''}</button>`).join('')}</div>
   <div class="sec" style="padding-bottom:0"><h2>In evidenza</h2></div>${heroPoster()}
   <div class="sec"><h2>Continua ad ascoltare</h2></div>
   <div class="row">${[
     [gcover('#FFE14D','#D32F2F','Il corpo umano',150),'Il corpo umano VOL. 1','Jovanotti'],
     [gcover('#0B2A3F','#4A90B8','Tutto è possibile',150),'TUTTO È POSSIBILE - ATTO II','Geolier'],
     [gcover('#8C7A5B','#3D3326','Noi loro gli altri',150),'NOI, LORO, GLI ALTRI','Marracash'],
   ].map(([cv,t,a])=>item(cv,`<span style="color:var(--text-2);font-weight:500;display:block;font-size:13px">Album</span>${t}`,a,`playGeneric('${t.replace(/'/g,'')}','${a}')`)).join('')}</div>
   <div class="sec"><h2>Album con brani che ti piacciono</h2></div>
   <div class="row">${[['#D9D9D9','#555','In memoria di'],['#111','#C62828','Vasca'],['#C9A27E','#5C3A21','Ritratto']].map(([a,b,t])=>item(gcover(a,b,t,150),t,'Album · Artista','toast(\'Contenuto di esempio\')')).join('')}</div>`;
}
function homeOther(){
  return `<div class="note" style="margin-top:8px">Sezione di esempio · nel prototipo i contenuti sono dimostrativi.</div>
   <div class="sec"><h2>Pensato per la notte</h2></div>
   <div class="row">${[['#1E3264','#FF00A8','Notte a Napoli'],['#C62828','#FFD600','Rap di quartiere'],['#2474B5','#0B1E3F','Deep Techno'],['#238B45','#FFD600','Afro Vibes']].map(([a,b,t])=>item(gcover(a,b,t,150),t,'Playlist',"toast('Playlist di esempio')")).join('')}</div>`;
}

/* hero in stile manifesto (Metrowave Mode): blocco verde, cerchi neri, testo nero che diventa verde sopra i cerchi */
function heroPoster(){
  const p=S.phase;
  const type=`<div class="hp-top">${mwLogo(18)}<span>${p==='live'?'● Live ora':p==='post'?'Concluso':'Dom 27.06.27'}</span><span>${p==='live'?'00:14':'22—03'}</span></div>
    <div class="hp-big">Metro<br>wave</div>
    <div class="hp-mid">20 Stazioni, 20 Generi, 1 Notte</div>`;
  if(p==='pre') return `<div class="hp" onclick="go('hub')">
    ${fluidArt()}
    ${fluidClip('hpclip')}
    <div class="hp-layer">${type}</div><div class="hp-layer hp-in" aria-hidden="true">${type}</div>
    <div class="hp-actions"><span class="hp-lockb">${ic('lock',{size:15,sw:2.6})} Disponibile il ${EVENT_LABEL}</span><button class="play" ${stop('playMix()')} aria-label="Play">${ic('play',{fill:true})}</button></div>
    <div class="pz-paper"></div></div>`;
  const cta=p==='live'?`<button class="btn-dark" ${stop("go('map')")}>${ic('map',{size:18})} Mappa live</button>`
    :p==='post'?`<button class="btn-dark" ${stop("go('recap')")}>Il tuo recap</button>`
    :S.festival?`<button class="btn-dark" ${stop('playMix()')}>${ic('play',{fill:true,size:16})} All Night Mix</button>`:mainCta('btn-dark');
  return `<div class="hp" onclick="go('hub')">
    ${fluidArt()}
    ${fluidClip('hpclip')}
    <div class="hp-layer">${type}</div><div class="hp-layer hp-in" aria-hidden="true">${type}</div>
    <div class="hp-actions">${cta}${p!=='post'?`<button class="icb" ${stop("go('scan')")} aria-label="Check-in">${ic('qr')}</button>`:''}<button class="play" ${stop('playMix()')} aria-label="Play">${ic('play',{fill:true})}</button></div>
    <div class="pz-paper"></div></div>`;
}
/* griglia editoriale delle 20 stazioni: numero fucsia, nome e genere bianchi, pallino colore stazione */
function edGrid(){
  const q=S.quiz;
  return `<div class="eg">${STATIONS.map(s=>{const tag=q&&q.ref===s.n?'TUA':q&&q.challenge===s.n?'×2':S.visited.has(s.n)?'✓':'';
    return `<button class="eg-c" onclick="go('station',{n:${s.n}})"><span class="eg-n">${pad(s.n)}${tag?`<em class="eg-tag">${tag}</em>`:''}</span><span class="eg-sym">${sym(s.n,'100%')}</span><b>${s.name}</b><span class="eg-g">${s.genre}</span></button>`}).join('')}</div>`;
}
function homeMW(){
  if(S.phase==='pre') return previewBody();
  /* Metrowave Mode: 1) Wave Pass 2) Mappa in evidenza · il quiz è un approfondimento più in basso */
  if(S.festival) return `<div class="home-mw">${hubCtas()}
   ${heroPoster()}
   ${S.quiz?myRoute():''}
   <div class="sec"><h2>Vagoni-palco</h2><span class="ed-k">(${TRAINS.length}) in corsa</span></div>
     <div class="row">${TRAINS.map(trainCard).join('')}</div>
   <div class="sec"><h2>Le 20 stazioni</h2><span class="ed-k">(20)</span></div>
   ${edGrid()}
   ${S.quiz?'':quizBanner()}
   <div class="sec"><h2>La linea</h2></div>${mapPromo()}
   <div class="sec"><h2>Line-up</h2></div>${lineup()}
   <div class="sec"><h2>Info</h2></div>${infoBox()}</div>`;
  return `${heroPoster()}
   ${myRoute()}
   ${S.phase==='live'?`<div class="sec"><h2>Vagoni-palco in corsa</h2><button class="more" onclick="go('map')">Mappa →</button></div>
     <div class="row">${TRAINS.map(trainCard).join('')}</div>`:''}
   <div class="sec"><h2>Le 20 stazioni</h2><button class="more" onclick="go('hub')">Mostra tutto</button></div>
   <div class="row">${STATIONS.map(scard).join('')}</div>
   <div class="sec"><h2>La linea</h2></div>${mapPromo()}
   <div class="sec"><h2>Line-up</h2><button class="more" onclick="go('hub')">Mostra tutto</button></div>${lineup()}
   <div class="sec"><h2>Playlist ufficiali</h2></div>
   <div class="row">${[
     [mwCover(150),'All Night Mix','5 ore · 20 generi'],
     [gcover('#FFD600','#F07C21','Warm-up',150),'Warm-up Linea 1','Per arrivare carichi'],
     [gcover('#00C2D9','#8A2BE2','Elettronica',150),'Elettronica · Linea 1','4 stazioni'],
     [gcover('#C62828','#7A1F3D','Urban',150),'Urban & Soul · Linea 1','5 stazioni'],
     [gcover('#2474B5','#440C0C','Radici',150),'Radici & World · Linea 1','5 stazioni'],
   ].map(([cv,t,s])=>item(cv,t,s,'playMix()')).join('')}</div>
   <div class="sec"><h2>Info pratiche</h2></div>${infoBox()}`;
}
/* Anteprima di PREVENDITA: lucchetto, data, conto alla rovescia, cosa si sbloccherà.
   Unica azione: vedere il proprio pass (o, senza pass, acquistarlo / collegarlo). */
function previewBody(){
  const feats=[['map','Mappa interattiva della Linea 1'],['note','20 stazioni e line-up live'],['train','Vagoni-palco in corsa'],['star','Punti, timbri e gadget']];
  return `<div class="pv">
    <div class="pv-lock">${ic('lock',{size:24,sw:2.2})}</div>
    <div class="pv-logo">${mwLogo(40)}</div>
    <h1 class="pv-title">Metrowave</h1>
    <span class="pv-badge">${ic('lock',{size:13,sw:2.6})} Disponibile il ${EVENT_LABEL}</span>
    <div class="pv-cd" data-cdbox>${cdBoxes()}</div>
    <p class="pv-copy">L'esperienza si sblocca la notte del festival. Fino ad allora la Linea 1 resta in silenzio.</p>
    <ul class="pv-list">${feats.map(([i,t])=>`<li>${ic(i,{size:18})}<span>${t}</span>${ic('lock',{size:14,sw:2.4})}</li>`).join('')}</ul>
    ${S.ticket
      ?`<div class="pv-pass">${ic('check',{sw:3,size:16})} Wave Pass acquistato · valido per il ${EVENT_LABEL}</div>
        <button class="btn-green full" onclick="go('ticket')">${ic('ticket',{size:18})} Visualizza i tuoi Ticket</button>`
      :`<button class="btn-green full" onclick="go('buy')">Acquista il tuo Wave Pass</button>
        <button class="pv-link" onclick="go('activate')">Hai già un biglietto? Collegalo</button>`}
  </div>`;
}
/* Hub Metrowave Mode: due CTA separate, in quest'ordine (a) Wave Pass (b) Mappa */
function hubCtas(){
  const pass=S.ticket&&S.phase==='pre'
    ?`<button class="hcta done" onclick="go('ticket')">${ic('ticket',{size:26})}<div><b>WAVE PASS ACQUISTATO</b><span>Valido per il ${EVENT_LABEL} · si attiva la notte del festival</span></div></button>`
    :S.ticket
    ?`<button class="hcta done" onclick="go('wave')">${ic('check',{sw:3,size:26})}<div><b>WAVE PASS ATTIVO</b><span>Apri il tuo pass e il percorso</span></div></button>`
    :S.phase==='live'
    ?`<button class="hcta acid grain" onclick="go('activate')">${ic('link',{size:26})}<div><b>COLLEGA IL TUO WAVE PASS</b><span>Hai acquistato su Eventbrite o al botteghino?</span></div></button>`
    :`<button class="hcta acid grain" onclick="go('activate')">${ic('ticket',{size:26})}<div><b>ATTIVA IL TUO WAVE PASS</b><span>Registra il biglietto e inizia il percorso</span></div></button>`;
  return `<div class="hctas">${pass}
    <button class="hcta map" onclick="go('map')">${ic('map',{size:26})}<div><b>ESPLORA LA MAPPA INTERATTIVA</b><span>20 stazioni e line-up della Linea 1</span></div></button></div>`;
}
/* Quiz di affinità come approfondimento interno: card secondaria (scura), mai in competizione con le CTA verdi */
function quizBanner(){
  return `<div class="sec"><h2>Approfondisci</h2><span class="ed-k">Opzionale</span></div><button class="banner deep" style="margin-top:0" onclick="startQuiz()">${ic('compass',{size:28})}<div><b>Scopri il tuo Vibe</b><span>Quiz di affinità · 6 domande, 1 minuto · trova la tua stazione</span></div></button>`;
}
/* Quiz "Scopri il tuo Vibe" (Home standard): opzionale, compare solo dopo aver attivato il pass o visto la mappa */
function myRoute(){
  const q=S.quiz;
  if(!q) return (S.ticket||S.mapSeen)?quizBanner():'';
  const r=ST(q.ref), c=ST(q.challenge);
  return `<div class="sec"><h2>Il tuo Sound Path</h2><button class="more" onclick="go('map')">Mappa →</button></div>
   <div class="pair"><button class="pcard grain ${r.dark?'dk':''}" style="background:${r.fill};color:${r.text}" onclick="go('station',{n:${r.n}})"><span class="chsym paper" style="width:46px;height:46px;padding:6px;top:12px;right:12px;bottom:auto">${sym(r.n,'100%')}</span><span class="k">LA TUA STAZIONE · ${q.aff[r.n]}%</span><b style="color:${r.disp}">${r.name}</b><span>${r.genre}</span></button>
     <button class="pcard ch" style="${svar(c)}" onclick="go('station',{n:${c.n}})"><span class="x2">×2</span><span class="k" style="color:var(--green)">LA TUA SFIDA · ${q.aff[c.n]}%</span><b>${c.name}</b><span style="color:var(--text-2)">${c.genre}</span></button></div>`;
}
function mapPromo(){
  const live=S.phase==='live';
  return `<button class="mappromo" onclick="go('map')"><b>${mapOpen()?'Mappa interattiva della Linea 1':'Mappa della Linea 1 · '+ic('lock',{size:14})+(S.ticket?' si apre il 27.06':' bloccata')}</b>
    <span class="s">Piscinola → Centro Direzionale · 20 fermate, 20 generi</span>
    ${lineSvg('#FFCD00','#FFCD00',STATIONS.map(s=>s.n),true)}
    <span class="more" style="color:#fff">${live?'● Live su tutte le stazioni · ':''}${mapOpen()?'Apri la mappa →':S.ticket?'Si sblocca la notte del festival →':S.phase==='live'?'Collega il tuo Wave Pass per sbloccarla →':'Ottieni il Wave Pass per sbloccarla →'}</span></button>`;
}
function lineup(){
  return `<div class="row">${[15,1,9,17,19,20,10,13].map(n=>{const s=ST(n),a=s.artists[1];
    return `<button class="item circle" onclick="go('station',{n:${n}})" style="width:132px">${avatar(a,s.fill,132)}<div class="t">${a}</div><div class="s">${s.name} · ${SETS[1]}</div></button>`}).join('')}</div>`;
}
function infoBox(){
  return `<div class="info">
    <div>${ic('clock')}<p style="margin:0">Dom 27 giugno 2027 · 22:00 – 03:00<span>5 ore di musica no-stop in 20 stazioni</span></p></div>
    <div>${ic('train')}<p style="margin:0">Vagoni-palco in corsa<span>Live set itineranti a bordo, tutta la notte</span></p></div>
    <div>${ic('ticket')}<p style="margin:0">Wave Pass = biglietto + ingresso<span>Da app, Eventbrite o botteghino</span></p></div>
    <div>${ic('shield')}<p style="margin:0">Accessibilità e sicurezza<span>Staff e punti info in ogni stazione</span></p></div></div>`;
}
function trainCard(t){
  const s=ST(t.st), nx=nextStop(t), mins=Math.max(1,Math.round(Math.abs(nx-t.p)*2.5));
  return `<button class="trcard" style="${svar(s)}" onclick="openTrain(${t.id})"><span class="bar"></span><span class="k">${t.name.toUpperCase()}</span><b>${s.genre.split(' /')[0]} · ${t.dj}</b><span>Dir. ${t.dir>0?'Centro Direzionale':'Piscinola'}</span><span class="eta" style="color:${s.text}">${ST(nx).name} tra ${mins} min</span></button>`;
}
function gadRow(g,i){
  const red=S.redeemed.has(i), unlocked=S.points>=g.p;
  let right;
  if(g.soldout) right='<span class="gs so">ESAURITO</span>';
  else if(red) right='<span class="gs ok">✓ RITIRATO</span>';
  else if(unlocked) right=`<button class="btn-green" onclick="go('voucher',{g:${i}})">Riscatta</button>`;
  else right=`<span class="gs" style="color:var(--text-2)">${g.p} PT</span>`;
  return `<div class="gad ${unlocked&&!g.soldout?'':'locked'}"><span class="gi">${ic(unlocked&&!g.soldout?g.i:'lock',{size:28})}</span><div class="x"><b>${g.t}</b><span>${g.d}${g.dig?' · + '+g.dig:''}</span>${!unlocked&&!g.soldout?`<div class="mini-bar"><i style="width:${Math.min(100,S.points/g.p*100)}%"></i></div>`:''}</div>${right}</div>`;
}
function badgesRow(){
  const b=[];
  LEVELS.slice(1).forEach(l=>{if(S.points>=l.p)b.push([l.n,l.n==='Capolinea'?'gold':'',ic('medal',{size:24})])});
  if(S.explorer.size)b.push(['Esploratore','',ic('compass',{size:24})]);
  if(S.quiz&&S.visited.has(S.quiz.challenge))b.push(['Fuori comfort','',ic('star',{size:24})]);
  if(S.rides.size)b.push(['A bordo','',ic('train',{size:24})]);
  if(!b.length) return `<div class="pnext" style="margin:0 16px">Ancora nessun badge: il primo arriva a 300 punti.</div>`;
  return `<div class="badges">${b.map(([n,c,i])=>`<div class="bdg ${c}"><div class="m"><i>${i}</i></div>${n}</div>`).join('')}</div>`;
}
function searchBody(){
  const q=S.q.trim().toLowerCase();
  if(!q) return browse();
  const sts=STATIONS.filter(s=>(s.name+' '+s.genre+' '+FAM[s.fam]).toLowerCase().includes(q));
  const ars=[];STATIONS.forEach(s=>s.artists.forEach(a=>{if(a.toLowerCase().includes(q))ars.push([a,s])}));
  const mw='metrowave festival linea 1 eventi'.includes(q)||q.includes('metro');
  if(!sts.length&&!ars.length&&!mw) return `<div class="empty">Nessun risultato per “${esc(S.q)}”</div>`;
  let h='<div>';
  if(mw) h+=`<button class="lr" onclick="go('hub')">${mwCover(56)}<div><b>Metrowave</b><span>Evento · Linea 1 · 27 giu 2027</span></div></button>`;
  sts.forEach(s=>h+=`<button class="lr" onclick="go('station',{n:${s.n}})">${stCover(s,56)}<div><b>${s.name}</b><span>Stazione ${pad(s.n)} · ${s.genre}</span></div></button>`);
  ars.forEach(([a,s])=>h+=`<button class="lr" onclick="go('station',{n:${s.n}})">${avatar(a,s.fill,56)}<div><b>${a}</b><span>Artista · ${s.name}</span></div></button>`);
  return h+'</div>';
}
function browse(){
  const cat=(c,t,cv,on)=>`<button class="cat" style="background:${c}" onclick="${on}"><b>${t}</b><div class="cat-cv">${cv}</div></button>`;
  return `<div class="cats">
    ${cat('#DC148C','Musica',gcover('#FFB3E1','#7A0B4F','',70),"toast('Categoria di esempio')")}
    ${cat('#006450','Podcast',gcover('#8FE3C3','#003D30','',70),"toast('Categoria di esempio')")}
    ${cat('#1E3264','Audiolibri',gcover('#7FA6FF','#0D1B3D','',70),"toast('Categoria di esempio')")}
    <button class="cat acid grain" onclick="go('hub')"><span class="mwtag">METROWAVE</span><b>Eventi dal vivo</b><div class="cat-cv">${stCover(ST(17),70)}</div></button>
   </div>
   <div class="sec"><h2>Potresti apprezzare</h2></div><div class="sub-label">Sponsored recommendation ⓘ</div>
   <div class="spons" onclick="go('hub')">${mwCover(132)}
     <div class="r"><span class="k">Evento · Metrowave</span><b>Metrowave — Linea 1</b><p>20 stazioni, 20 generi, 5 ore no-stop. Dom 27 giugno.</p>
       <div class="ra"><button class="icb" style="color:#fff" ${stop("toast('Evento salvato')")}>${ic('plusc',{size:28})}</button><button class="wplay" ${stop('playMix()')}>${ic('play',{fill:true})}</button></div></div></div>
   <div class="sec"><h2>Sfoglia per stazione</h2><button class="more" onclick="go('hub')">Tutte e 20</button></div>
   <div class="grid2">${[15,17,1,13,18,20].map(n=>scard(ST(n))).join('')}</div>`;
}
function qcard(st,top){
  return `<div class="qcard paper ${top?'top':''}" ${top?'id="qtop"':''}>
    <span class="qstamp y">SÌ</span><span class="qstamp n">NO</span>
    <div class="qc-in"><div class="scd-t">${st.genre}</div><div class="scd-g">Stazione ${pad(st.n)} · ${st.name}</div>
    <div class="qc-s">${sym(st.n,'100%')}</div>
    <div class="qc-p">${ic('play',{fill:true,size:12})} Anteprima · 0:15<div class="bar">${top?`<i style="background:${symColor(st)}"></i>`:''}</div></div></div></div>`;
}
