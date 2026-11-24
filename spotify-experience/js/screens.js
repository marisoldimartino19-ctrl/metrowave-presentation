/* =====================================================================
   SCREENS
   ===================================================================== */
const SCREENS={
/* ---------- F1 · HOME ---------- */
home(){
  const f=S.homeFilter;
  const pills=[['tutti','Tutti'],['mw',`${mwLogo(13)} Metrowave${S.phase==='pre'?' '+ic('lock',{size:13,sw:2.6}):''}`],['musica','Musica'],['podcast','Podcast'],['audiolibri','Audiolibri']];
  let h=`<div class="screen pt"><div class="${S.festival?'fhead':''}">${S.festival?`<div class="festbar">${mwLogo(16)}Metrowave Mode<span class="pts">★ ${S.points} PT</span><button onclick="exitFest()">Esci</button></div>`:''}
    <div class="pills"><button class="avatar" onclick="tab('library')">M</button>
    ${pills.map(([k,l])=>`<button class="pill ${k==='mw'?'mw':''} ${f===k?'active':''}" onclick="setFilter('${k}')">${l}</button>`).join('')}</div></div>`;
  h+= f==='mw'?homeMW(): f==='tutti'?homeAll(): homeOther();
  return h+'</div>';
},
preview(){
  TOPC='#121212';
  return `<div class="screen">${topbar('Metrowave',true)}${previewBody()}</div>`;
},
search(){
  return `<div class="screen pt">
    <div class="search-head"><div class="avatar">M</div><h1>Cerca</h1><button class="icb" style="color:#fff" onclick="go('scan')" aria-label="Scansiona">${ic('camera',{size:28})}</button></div>
    <label class="searchbar">${ic('search',{sw:2.4,size:26})}<input id="q" placeholder="Cosa vuoi ascoltare?" value="${esc(S.q)}" oninput="onQ(this.value)" autocomplete="off"></label>
    <div id="sr">${searchBody()}</div></div>`;
},
hub(){
  TOPC='#121212';
  const list=STATIONS.filter(s=>S.hubFam==='all'||s.fam===S.hubFam);
  return `<div class="screen">${topbar('Metrowave')}
   <div class="hubhead grain">
     <div style="position:relative">${S.phase==='live'?'<span class="badge live"><i class="dot"></i>LIVE ORA</span>':S.phase==='pre'?`<span class="badge"><i class="dot"></i>TRA <span class="cd">${cdText()}</span></span>`:'<span class="badge">CONCLUSO</span>'}</div>
     <h1>METRO<br>WAVE</h1>
     <div class="meta">Linea 1 · Napoli · Dom 27.06.2027 · 22:00–03:00</div>
     <div class="chips"><span class="chip">20 STAZIONI</span><span class="chip">20 GENERI</span><span class="chip">5 ORE NO-STOP</span></div>
   </div>
   <div class="actions">${S.phase==='post'?`<button class="btn-white" onclick="go('recap')">Il tuo recap</button>`:mainCta()}
     <button class="icb" onclick="toast('Evento salvato')">${ic('plusc',{size:28})}</button>
     <button class="icb" onclick="toast('Link copiato')">${ic('share')}</button>
     <button class="play" onclick="playMix()">${ic('play',{fill:true})}</button></div>
   ${myRoute()}
   <div class="sec"><h2>Sfoglia per stazione</h2><button class="more" onclick="go('map')">Mappa →</button></div>
   ${famPills('hubFam')}
   <div class="grid2" style="margin-top:4px">${list.map(scard).join('')}</div>
   <div class="sec"><h2>La linea</h2></div>${mapPromo()}
   <div class="sec"><h2>Line-up</h2></div>${lineup()}
   <div class="sec"><h2>Info pratiche</h2></div>${infoBox()}
  </div>`;
},

/* ---------- F2 · ATTIVAZIONE BIGLIETTO ---------- */
activate(){
  TOPC='#121212';
  if(S.ticket) return SCREENS.activated();
  const row=(on,bg,fg,icn,t,d)=>`<button class="chn" onclick="${on}"><span class="ci" style="background:${bg};color:${fg}">${icn}</span><div class="x"><b>${t}</b><span>${d}</span></div>${ic('chev',{size:18})}</button>`;
  /* LIVE senza pass: riscatto di un biglietto preso su Eventbrite / partner o al botteghino */
  if(S.phase==='live') return `<div class="screen">${topbar('Collega il pass',true)}
   <div class="acthead" style="padding-top:16px"><span class="badge live"><i class="dot"></i>LIVE ORA</span><h1>COLLEGA IL TUO<br>WAVE PASS</h1>
     <p>Hai acquistato su Eventbrite o al botteghino? Collega il biglietto a Spotify: si attiva subito e sblocca la mappa e le funzioni live.</p></div>
   <div style="height:18px"></div>
   ${row("openPartnerLogin()",'#F05537','#fff','<b>eb</b>','Sincronizza con Eventbrite / Ticket Partner','Accesso rapido: troviamo noi il tuo biglietto')}
   ${row("go('scan',{mode:'ticket'})",'#FFFFFF','#000',ic('qr'),'Scansiona il QR Code del biglietto','Per i biglietti presi al botteghino')}
   ${row("go('code',{ch:'serial'})",'#2A2A2A','#fff',ic('type'),'Inserisci il codice seriale','Lo trovi sul biglietto o nell’email di conferma')}
   <div class="note">Non hai ancora un biglietto? <button class="inlink" onclick="go('buy')">Acquista il Wave Pass</button></div>
  </div>`;
  const ch=[
   ['spotify','Acquistato qui','Il biglietto preso in app si attiva da solo','#1ED760','#000',ic('check',{sw:3})],
   ['eventbrite','Eventbrite','Inserisci il codice ordine o collega l’account','#F05537','#fff','<b>eb</b>'],
   ['box','Botteghino','Scansiona il QR stampato sul biglietto','#FFFFFF','#000',ic('qr')],
   ['buy','Non ce l’hai ancora?','Acquista il Wave Pass','#2A2A2A','#fff',ic('plus')],
  ];
  const act={spotify:"go('verify')",eventbrite:"go('code',{ch:'eventbrite'})",box:"go('scan',{mode:'ticket'})",buy:"go('buy')"};
  return `<div class="screen">${topbar('Attiva biglietto',true)}
   <div class="acthead" style="padding-top:16px"><span class="badge"><i class="dot"></i>WAVE PASS</span><h1>DOVE HAI PRESO<br>IL BIGLIETTO?</h1>
     <p>Collegalo al tuo account: diventa il tuo Wave Pass. Accesso e mappa della Linea 1 si attivano la notte del festival.</p></div>
   <div style="height:18px"></div>
   ${ch.map(([k,t,d,bg,fg,icn])=>row(act[k],bg,fg,icn,t,d)).join('')}
   <div class="note">Hai problemi? Il biglietto è nominale e si attiva su un solo account.</div>
  </div>`;
},
code(c){
  TOPC='#121212';
  const serial=c.ch==='serial';
  return `<div class="screen">${topbar(serial?'Codice seriale':'Eventbrite',true)}
   <div class="acthead" style="padding-top:16px"><h1>${serial?'INSERISCI IL<br>CODICE SERIALE':'INSERISCI IL<br>CODICE ORDINE'}</h1><p>${serial?'È stampato sul biglietto del botteghino o nell’email di conferma del partner.':'Lo trovi nell’email di conferma di Eventbrite.'} Inizia con <b style="color:#fff">MW-</b>.</p></div>
   <div style="height:22px"></div>
   <div class="field" id="fld"><label>${serial?'CODICE SERIALE':'CODICE ORDINE'}</label><input id="codein" placeholder="MW-XXXX-XXXX" maxlength="12" oninput="fmtCode(this)" autocomplete="off" spellcheck="false"><div class="ferr" id="ferr"></div></div>
   <button class="paste" onclick="pasteCode('MW-2706-1906')">${ic('ticket',{size:16})} Incolla dagli appunti: <b>MW-2706-1906</b></button>
   <button class="paste" onclick="pasteCode('MW-0000-1111')" style="margin-left:0">Prova un errore: <b>MW-0000-1111</b></button>
   <div style="margin:24px 16px 0"><button class="btn-green full" id="actbtn" onclick="submitCode()" disabled>${S.phase==='pre'?'Collega il biglietto':'Attiva il Wave Pass'}</button></div>
   ${serial?'':`<div style="text-align:center;margin-top:14px"><button class="more" style="color:#fff;text-decoration:underline" onclick="openPartnerLogin()">Oppure collega l’account Eventbrite</button></div>`}
  </div>`;
},
verify(c){
  return `<div class="screen"><div class="verify"><div class="ring"></div><b>${S.phase==='pre'?'Stiamo salvando il tuo Wave Pass…':'Stiamo attivando il tuo Wave Pass…'}</b><span>${c.src==='partner'?'Sincronizzazione con Eventbrite in corso':S.phase==='pre'?'Conferma dell\'acquisto in corso':'Verifica del biglietto in corso'}</span></div></div>`;
},
activated(){
  TOPC='#121212';
  ensurePass();
  const kind=S.pass.type==='crew'?'CREW ×4':'NOTTE';
  /* PREVENDITA: pass acquistato e salvato nell'account, niente attivazione né mappa */
  if(S.phase==='pre') return `<div class="screen">${topbar('Wave Pass',true)}
   <div class="passflip" style="margin-top:10px"><div class="passcard grain">
     <div style="position:relative;display:flex;justify-content:space-between"><span class="badge">ACQUISTATO</span><span class="k">LINEA 1</span></div>
     <h2>WAVE PASS</h2><div class="k">${kind} · ${S.pass.code}</div>
     <div class="k pc-valid">Valido per il ${EVENT_LABEL}</div>
     ${lineSvg('#000','#000')}</div></div>
   <div class="okmsg"><div class="ck">${ic('check',{sw:3})}</div><b>Acquisto completato</b>
     <span>Il tuo Wave Pass è stato salvato nel tuo account. Potrai attivarne l'accesso e sbloccare la mappa interattiva della Linea 1 direttamente la notte del festival.</span></div>
   <div class="tk-actions"><button class="btn-green full" onclick="jump('home','ticket')">${ic('ticket',{size:18})} Visualizza i tuoi Ticket</button></div>
  </div>`;
  /* LIVE: attivo, mappa sbloccata */
  return `<div class="screen">${topbar('Wave Pass',true)}
   <div class="passflip" style="margin-top:10px"><div class="passcard grain">
     <div style="position:relative;display:flex;justify-content:space-between"><span class="badge"><i class="dot"></i>ATTIVO</span><span class="k">LINEA 1</span></div>
     <h2>WAVE PASS</h2><div class="k">${kind} · ${S.pass.code}</div>
     ${lineSvg('#000','#000')}</div></div>
   <div class="okmsg"><div class="ck">${ic('check',{sw:3})}</div><b>Biglietto attivato</b><span>La mappa della Linea 1 è sbloccata.</span></div>
   <div class="tk-actions"><button class="btn-green full" onclick="S.homeFilter='mw';jump('home')">${mwLogo(16)} Torna all'Hub Metrowave</button>
     <button class="btn-ghost full" onclick="go('map')">${ic('map',{size:18})} Esplora la mappa</button></div>
  </div>`;
},
buy(){
  TOPC='#121212';
  const opts=[{id:'notte',n:'Wave Pass · Notte',d:'Accesso alle 20 stazioni · corse illimitate sulla Linea 1 dalle 21:30 alle 04:00',p:15},
              {id:'crew',n:'Wave Pass · Crew ×4',d:'4 pass collegati · vi ritrovate sulla mappa live',p:52}];
  const sel=opts.find(o=>o.id===S.passSel);
  return `<div class="screen">${topbar('Acquista',true)}
   <div class="acthead" style="padding-top:16px"><h1>WAVE PASS</h1><p>Un solo pass per tutta la notte: biglietto della metro + ingresso alle 20 stazioni.</p></div>
   <div style="height:18px"></div>
   ${opts.map(o=>`<button class="popt ${o.id===S.passSel?'on':''}" onclick="S.passSel='${o.id}';render()"><span class="radio"></span><div class="pc"><b>${o.n}</b><span>${o.d}</span></div><span class="price">€${o.p}</span></button>`).join('')}
   <div style="margin:20px 16px 0"><button class="btn-green full" onclick="go('verify')">Conferma · €${sel.p}</button><div class="fine">Prototipo · nessun pagamento reale</div></div>
  </div>`;
},

/* ---------- F3 · QUIZ ---------- */
quiz(c){
  const s=c.step, qa=S.qa;
  const head=`<div class="qhead"><button class="rb" onclick="closeQuiz()" aria-label="Chiudi">${ic('x',{sw:2.5})}</button>
    <div class="qprog">${[1,2,3,4,5,6].map(i=>`<i class="${i<s?'done':i===s?'cur':''}"></i>`).join('')}</div><span class="qstep">${s}/6</span></div>`;
  let body='',foot='',canNext=true;
  if(s===1){
    const rest=QUIZ_DECK.slice(qa.idx);
    body=`<div class="qk">ASCOLTA E SCEGLI · ${qa.idx+1}/${QUIZ_DECK.length}</div><h2 class="qt">Ti fa muovere?</h2><p class="qs">Swipe a destra se ti piace, a sinistra se no.</p>
      <div class="deck">${rest.slice(0,2).reverse().map((n,i,arr)=>qcard(ST(n),i===arr.length-1)).join('')}</div>
      <div class="qbtns"><button class="qno" onclick="swipe(false)" aria-label="No">${ic('x',{sw:2.6,size:28})}</button><button class="qyes" onclick="swipe(true)" aria-label="Mi piace">${ic('heart',{fill:true,size:28})}</button></div>`;
    return `<div class="qz">${head}<div class="qbody">${body}</div></div>`;
  }
  if(s===2){
    body=`<div class="qk">I TUOI ASCOLTI</div><h2 class="qt">Partiamo da quello che già ascolti</h2>`;
    if(qa.consent===null){
      body+=`<p class="qs">Possiamo usare i tuoi ascolti per affinare il risultato.</p>
       <div class="consent"><div class="ci">${ic('note')}</div><b>Usiamo i tuoi ascolti?</b><p>Leggiamo solo i generi che ascolti di più. Nessun dato viene condiviso con i partner del festival.</p>
       <div class="cb"><button class="btn-green" onclick="S.qa.consent=true;render()">Sì, usali</button><button class="btn-ghost" onclick="S.qa.consent=false;render()">No, grazie</button></div></div>`;
      canNext=false;
    }else if(qa.consent){
      body+=`<p class="qs">Abbiamo trovato questi generi. Togli quelli che non ti rappresentano.</p>
       ${HISTORY.map(h=>`<button class="hchip ${qa.chips.has(h.k)?'on':''}" onclick="toggleChip('${h.k}')"><div class="x"><b>${h.l}</b><span>da ${h.src}</span></div><span class="ck">${qa.chips.has(h.k)?ic('check',{sw:3,size:14}):''}</span></button>`).join('')}`;
    }else body+=`<p class="qs">Nessun problema: ci basiamo solo sulle tue risposte.</p>`;
  }
  if(s===3){
    body=`<div class="qk">ENERGIA</div><h2 class="qt">Quanta energia vuoi stanotte?</h2>
      <div class="energy"><div class="val" id="enval">${energyLabel(qa.energy)}</div>
      <div class="bars" id="enbars">${energyBars(qa.energy)}</div>
      <input class="range" type="range" min="0" max="100" value="${qa.energy}" oninput="setEnergy(this.value)" aria-label="Energia">
      <div class="rlab"><span>CHILL</span><span>POGO</span></div></div>`;
  }
  if(s===4){
    body=`<div class="qk">AMBIENTE</div><h2 class="qt">Dove ti senti a casa?</h2><p class="qs">Scegli il posto che ti somiglia di più.</p>
      <div class="amb">${AMB.map(a=>`<button class="ambc grain ${qa.amb===a.k?'on':''}" style="background:${a.bg}" onclick="S.qa.amb='${a.k}';render()"><span class="ck">${ic('check',{sw:3,size:15})}</span><span>${a.l}</span></button>`).join('')}</div>`;
    canNext=!!qa.amb;
  }
  if(s===5){
    body=`<div class="qk">COMPAGNIA</div><h2 class="qt">Con chi vieni?</h2><p class="qs">Ci serve per suggerirti il percorso giusto.</p>
      ${COMP.map(o=>`<button class="cmp ${qa.comp===o.k?'on':''}" onclick="S.qa.comp='${o.k}';render()"><span class="ci">${ic(o.i)}</span><div><b>${o.l}</b><span>${o.d}</span></div></button>`).join('')}`;
    canNext=!!qa.comp;
  }
  if(s===6){
    body=`<div class="qk">COMFORT ZONE</div><h2 class="qt">Quanto vuoi farti sorprendere?</h2><p class="qs">Ti assegniamo una stazione-sfida, lontana dai tuoi gusti. Lì i punti valgono doppio.</p>
      <div class="cz">${[1,2,3,4,5].map(v=>`<button class="${qa.comfort===v?'on':''}" onclick="S.qa.comfort=${v};render()">${v}</button>`).join('')}</div>
      <div class="rlab"><span>ZERO SORPRESE</span><span>STUPISCIMI</span></div>
      <div class="czd">${CZ[qa.comfort]}</div>`;
  }
  foot=`<div class="qfoot"><button class="qback" onclick="${s===2?"S.qa=freshQA();replaceTop('quiz',{step:1})":`replaceTop('quiz',{step:${s-1}})`}">Indietro</button>
     <button class="btn-green" ${canNext?'':'disabled'} onclick="${s===6?'finishQuiz()':`replaceTop('quiz',{step:${s+1}})`}">${s===6?'Calcola la mia stazione':'Avanti'}</button></div>`;
  return `<div class="qz">${head}<div class="qbody">${body}</div>${foot}</div>`;
},
quizcalc(){
  return `<div class="calc grain"><div style="font:700 12px var(--mono);letter-spacing:.14em">METROWAVE</div>
    <div class="qline">${lineSvg('#FFCD00','#fff')}<i class="dot"></i></div>
    <b>Stiamo incrociando i tuoi gusti<br>con le 20 stazioni…</b><span>Affinità, energia, ascolti</span></div>`;
},
result(){
  const q=S.quiz, st=ST(q.ref);
  return `<div class="res" style="background:${st.fill};color:${st.text}">
    <button class="rb" onclick="jump('home')" aria-label="Chiudi">${ic('x',{sw:2.5})}</button>
    <div class="rs-k">IL TUO SOUND PATH PARTE DA</div>
    <div class="rs-card">${stCard(st,250)}</div>
    <div class="rs-g">Stazione ${pad(st.n)} · affinità ${q.aff[st.n]}%</div>
    <div class="rs-top"><div class="h">LE TUE TOP 3</div>
      ${q.top.map(n=>`<div class="rs-bar"><span>${ST(n).name} · ${ST(n).genre}</span><em>${q.aff[n]}%</em><div class="tr"><i style="width:${q.aff[n]}%"></i></div></div>`).join('')}</div>
    <div class="rs-act"><button class="btn-green" style="${onBtn(st)}" onclick="replaceTop('challenge')">Vedi la tua sfida →</button>
      <button class="btn-ghost" style="box-shadow:inset 0 0 0 1.5px currentColor;color:inherit" onclick="toast('Story pronta da condividere')">${ic('share',{size:18})} Condividi</button></div>
  </div>`;
},
challenge(){
  const q=S.quiz, st=ST(q.challenge);
  return `<div class="chl"><button class="rb" onclick="replaceTop('result')" aria-label="Indietro">${ic('back',{sw:2.5})}</button>
    <div class="k">LA TUA SFIDA</div><h1>Fuori dalla comfort zone</h1>
    <div class="chcard" style="${svar(st)}"><span class="chsym paper" style="top:16px;bottom:auto">${sym(st.n,'100%')}</span><span class="x2" style="right:106px">PUNTI ×2</span>
      <div class="n">STAZIONE ${pad(st.n)}</div><b>${st.name}</b><span>${st.genre} · affinità ${q.aff[st.n]}%</span></div>
    <p>Un genere lontano dai tuoi ascolti. Fai check-in a <b>${st.name}</b>: lì i punti valgono il doppio, e magari scopri qualcosa che non avresti mai scelto.</p>
    <div class="rs-act"><button class="btn-green" onclick="acceptChallenge()">Accetto la sfida · apri la mappa</button>
      <button class="btn-ghost" onclick="jump('home')">Più tardi</button></div>
  </div>`;
},

/* ---------- F4 · MAPPA ---------- */
map(){
  S.mapSeen=true;
  const live=S.phase==='live', fam=S.mapFam, q=S.quiz, locked=!mapOpen();
  const unlocking=!locked&&!S.mapUnlocked;
  const rows=STATIONS.map((st,i)=>{
    const on=fam==='all'||st.fam===fam, vis=S.visited.has(st.n), ref=q&&q.ref===st.n, ch=q&&q.challenge===st.n, here=S.here===st.n;
    const nc=['node']; if(vis)nc.push('visited'); if(st.dark)nc.push('dkn'); if(live&&!vis)nc.push('live'); if(ref)nc.push('ref'); if(ch)nc.push('ch'); if(st.x)nc.push('x'); if(S.lit===st.n)nc.push('lit');
    const tc=['trk']; if(vis&&S.visited.has(st.n-1))tc.push('lt'); if(vis&&S.visited.has(st.n+1))tc.push('lb');
    const sub=live?`<span class="lv">● ${st.artists[CUR]}</span>`:S.phase==='post'?`<span class="tm">CONCLUSO</span>`:`<span class="tm">22:00–03:00</span>`;
    const tags=`${ref?'<span class="mtag ref">LA TUA STAZIONE</span>':''}${ch?'<span class="mtag ch">SFIDA ×2</span>':''}${here?'<span class="mtag here">SEI QUI</span>':''}`;
    return `<button class="mrow ${i===0?'first':''} ${i===19?'last':''} ${on?'':'dim'}" id="st-${st.n}" style="${svar(st)}--i:${i}" onclick="openStation(${st.n})">
      <div class="${tc.join(' ')}"><i class="${nc.join(' ')}">${vis?ic('check',{sw:4,size:12}):''}</i></div>
      <div class="mi"><div class="mn"><span class="mnum">${pad(st.n)}</span>${st.name}${tags}</div>
        <div class="ms"><span class="gtag" style="background:${st.fill};color:${st.text}${st.dark?';box-shadow:inset 0 0 0 1px rgba(255,255,255,.3)':''}">${st.genre}</span>${sub}</div>
        ${st.x?`<div class="mx">${ic('swap',{size:13})} ${st.x}</div>`:''}</div>
      <span class="msym">${sym(st.n,'100%')}</span>${ic('chev',{size:18})}</button>`;
  }).join('');
  const dots=STATIONS.map(st=>`<button class="mmd ${fam==='all'||st.fam===fam?'':'dim'} ${S.visited.has(st.n)?'vis':''} ${q&&q.ref===st.n?'ref':''}" style="${svar(st)}" onclick="scrollToSt(${st.n})" aria-label="${esc(st.name)}"></button>`).join('');
  const trains=S.trainLayer&&!locked?TRAINS.map(t=>{const s=ST(t.st);return `<button class="train" id="tr-${t.id}" style="${svar(s)}" onclick="openTrain(${t.id})" aria-label="${t.name}">${ic('train',{size:14,sw:2.2})}</button>`}).join(''):'';
  return `<div class="screen"><div class="maptop">
     <div class="bar"><button class="back" style="background:none" onclick="back()">${ic('back',{sw:2.5})}</button>
       <div class="tt">Linea 1 · Mappa ${live?'<span class="badge live sm"><i class="dot"></i>LIVE</span>':''}</div><span style="width:36px"></span></div>
     ${famPills('mapFam')}
     ${!locked?`<div class="layerbar"><button class="pill ${S.trainLayer?'active':''}" onclick="S.trainLayer=!S.trainLayer;render()">${ic('train',{size:15})} Vagoni-palco</button><button class="pts" onclick="go('wave')">★ ${S.points} PT</button></div>`:''}
     <div class="minimap">${dots}</div>
     <div class="mapends"><span>PISCINOLA</span><span>CENTRO DIREZIONALE</span></div>
   </div>
   ${q&&!live&&!locked?`<button class="banner" onclick="scrollToSt(${q.challenge})">${ic('route',{size:26})}<div><b>Percorso consigliato</b><span>Da ${ST(q.ref).name} (la tua) a ${ST(q.challenge).name} (sfida ×2)</span></div></button>`:''}
   <div id="rows" class="${locked?'locked':''} ${unlocking?'unlocking':''}">${trains}${rows}</div>
   ${locked?(S.ticket
     ?`<div class="lockcard"><div class="li">${ic('clock',{size:26})}</div><b>Si sblocca la notte del festival</b><p>Il tuo Wave Pass è salvato. La notte del ${EVENT_LABEL} attivi l'accesso e la mappa interattiva della Linea 1 si apre.</p><button class="btn-green full" onclick="go('ticket')">Visualizza i tuoi Ticket</button></div>`
     :(live
     ?`<div class="lockcard"><div class="li">${ic('lock',{size:26})}</div><b>Collega il tuo Wave Pass</b><p>Hai acquistato su Eventbrite o al botteghino? Collegalo a Spotify per sbloccare la mappa e le funzioni live.</p><button class="btn-green full" onclick="go('activate')">Collega il tuo Wave Pass</button></div>`
     :`<div class="lockcard"><div class="li">${ic('lock',{size:26})}</div><b>Mappa bloccata</b><p>Acquista o collega il tuo Wave Pass: la mappa interattiva della Linea 1 si sblocca la notte del festival.</p><button class="btn-green full" onclick="go('activate')">Ottieni il Wave Pass</button></div>`)):''}
   <div class="legend"><span><i class="node"></i>Stazione</span><span><i class="node x"></i>Interscambio</span><span><i class="node ref" style="--c:#fff;width:16px;height:16px"></i>La tua</span><span><i class="node ch" style="--c:#1ED760;width:16px;height:16px"></i>Sfida</span><span><i class="node visited" style="--c:#1ED760"></i>Visitata</span></div>
  </div>`;
},
station(c){
  const st=ST(c.n), live=S.phase==='live', post=S.phase==='post', saved=S.saved.has(st.n), q=S.quiz;
  TOPC=st.fill;TOPT=st.text;
  const tr=tracks(st), same=STATIONS.filter(s=>s.fam===st.fam&&s.n!==st.n);
  const tag=q&&q.ref===st.n?`<span class="mtag ref">LA TUA STAZIONE · ${q.aff[st.n]}%</span>`:q&&q.challenge===st.n?`<span class="mtag ch">SFIDA ×2 · ${q.aff[st.n]}%</span>`:q?`<span class="gtag" style="background:rgba(0,0,0,.35);color:#fff">Affinità ${q.aff[st.n]}%</span>`:'';
  return `<div class="screen">${topbar(st.name)}
   <div class="dhead" style="background:${st.fill};color:${st.text}">
     <div class="dcv">${stCard(st,236)}</div>
     <div class="dlabel">STAZIONE ${pad(st.n)} · LINEA 1 · METROWAVE</div>
     <h1 class="dtitle">${st.name}</h1>
     <div class="dmeta"><span class="gtag" style="background:${st.fill};color:${st.text};box-shadow:inset 0 0 0 1px rgba(255,255,255,.3)">${st.genre}</span>${tag}</div>
   </div>
   <div class="actions">
     <button class="icb ${saved?'on':''}" onclick="toggleSave(${st.n})" aria-label="Salva">${saved?ic('checkc',{size:28}):ic('plusc',{size:28})}</button>
     <button class="icb" onclick="toast('Link copiato')">${ic('share')}</button>
     <button class="icb" onclick="openStation(${st.n})">${ic('more')}</button>
     <button class="play" onclick="playStation(${st.n})">${ic('play',{fill:true})}</button></div>
   <div class="sec"><h2>Stasera in consolle</h2></div>
   ${st.artists.map((a,i)=>`<div class="lrow ${live&&i===CUR?'now':''}"><span class="ltime">${SETS[i]}</span>${avatar(a,st.fill,46)}
      <div class="lt"><b>${a}</b><span class="r">${ROLES[i]} · ${SETS[i]}–${SETS[i+1]}</span></div>
      ${live&&i===CUR?'<span class="badge live sm"><i class="dot"></i>LIVE</span>':post||(live&&i<CUR)?'<span class="done">CONCLUSO</span>':''}</div>`).join('')}
   <div class="sec"><h2>Live esclusiva</h2></div>
   ${S.visited.has(st.n)?`<button class="excl" onclick="playExclusive(${st.n})">${stCover(st,56)}<div class="x"><b>Live @ ${st.name}</b><span>${st.artists[CUR]} · sbloccata con il check-in</span></div><span class="play" style="width:44px;height:44px">${ic('play',{fill:true,size:20})}</span></button>`
     :`<div class="excl"><span class="ri">${ic('lock',{size:22})}</span><div class="x"><b>Live @ ${st.name}</b><span>Fai check-in in stazione per sbloccare il set registrato</span></div><button class="btn-green" style="height:36px;padding:0 14px;font-size:13px" onclick="go('scan',{n:${st.n}})">${ic('qr',{size:16})} Scan</button></div>`}
   <div class="sec"><h2>Playlist ${st.genre}</h2></div>
   ${tr.map((t,i)=>{const on=S.track.title===t.t&&S.track.n===st.n;return `<button class="trow" onclick="playTrack(${st.n},${i})">${stCover(st,50)}
      <div class="tt2"><b class="${on?'g':''}">${t.t}</b><span>${t.a}</span></div><span class="icb">${ic('more')}</span></button>`}).join('')}
   <div class="sec"><h2>Come arrivare</h2></div>
   <div class="info">
     <div>${ic('train')}<p style="margin:0">Linea 1 · fermata ${st.name}<span>Treni ogni 6 min durante il festival, ultima corsa 04:00</span></p></div>
     ${st.x?`<div>${ic('swap')}<p style="margin:0">Interscambio<span>${st.x}</span></p></div>`:''}
     <div>${ic('shield')}<p style="margin:0">Accessibilità e sicurezza<span>Staff Metrowave e punto info in banchina</span></p></div>
   </div>
   ${same.length?`<div class="sec"><h2>Altre stazioni ${FAM[st.fam]}</h2></div><div class="row">${same.map(scard).join('')}</div>`:''}
  </div>`;
},

/* ---------- F5 · SCANNER (mode: station | ticket | train) ---------- */
scan(c){
  const mode=c.mode||'station', live=S.phase==='live';
  let hint,sub,chips,geo='';
  if(mode==='ticket'){
    hint='Inquadra il QR stampato sul biglietto';sub='Lo trovi in basso a destra sul biglietto del botteghino';
    chips=`<button class="schip" onclick="simTicket()"><span class="d" style="background:#fff;color:#000">${ic('ticket',{size:16})}</span>Biglietto botteghino</button>`;
  }else if(mode==='train'){
    hint='Inquadra il QR dentro il vagone-palco';sub='È sopra le porte centrali';
    chips=TRAINS.map(t=>{const s=ST(t.st);return `<button class="schip ${S.rides.has(t.id)?'done':''}" onclick="simTrain(${t.id})"><span class="d" style="background:${s.fill};color:${s.text}">${ic('train',{size:15})}</span>${t.name} · ${s.genre.split(' /')[0]}</button>`}).join('');
  }else{
    const pri=c.n?[c.n]:[15,1,13,14,9,19,16,11];
    if(S.quiz){if(!pri.includes(S.quiz.challenge))pri.splice(1,0,S.quiz.challenge)}
    const order=pri.map(ST).concat(STATIONS.filter(s=>!pri.includes(s.n)));
    hint=c.n?`Cerca il totem Metrowave a ${ST(c.n).name}`:'Inquadra il QR sul totem Metrowave';
    sub='Lo trovi in banchina, accanto alla consolle';
    chips=order.map(s=>`<button class="schip ${S.visited.has(s.n)?'done':''}" onclick="simScan(${s.n})"><span class="d paper" style="padding:4px">${S.visited.has(s.n)?'✓':sym(s.n,'100%')}</span>${s.name}</button>`).join('');
    geo=`<button class="geo" onclick="simScan(${c.n||15},true)">QR non leggibile? Check-in con la posizione</button>`;
  }
  const camc=mode==='station'&&c.n?ST(c.n).fill:mode==='ticket'?'#444':'#2474B5';
  return `<div class="scan" style="--camc:${camc}"><div class="cam"></div><div class="cam-dim"></div>
   <div class="scan-top"><button class="rb" onclick="back()" aria-label="Chiudi">${ic('x',{sw:2.5})}</button><span class="tt">${mode==='ticket'?'Scansiona biglietto':mode==='train'?'Sali a bordo':'Check-in stazione'}</span><button class="rb" onclick="toast('Torcia accesa')" aria-label="Torcia">${ic('bolt',{size:20})}</button></div>
   <div class="vf" id="vf"><i></i><i></i><i></i><i></i><div class="scanline"></div><div class="totem-wrap" id="totem"></div></div>
   <div class="hint" id="hint">${hint}<span>${sub}</span></div>
   <div class="scan-bot"><div class="k">DEMO · SIMULA LA SCANSIONE</div>
     <div class="row" style="gap:8px">${chips}</div>${geo}</div>
  </div>`;
},
checked(c){
  const st=ST(c.n), g=c.gained||[], tot=g.reduce((a,x)=>a+x[1],0), lv=level(S.points), nx=nextLevel(S.points);
  return `<div class="okscr" style="background:#121212;color:#fff">
   <button class="rb" onclick="back()" aria-label="Chiudi">${ic('x',{sw:2.5})}</button>
   <div class="bigstamp" style="--c:${symColor(st)}"><span class="k">CHECK-IN ✓</span><span class="bs">${sym(st.n,'100%')}</span><b>${st.name}</b><span class="d">STAZIONE ${pad(st.n)} · 00:14</span></div>
   <div class="ok-t">TIMBRATO!</div>
   <div class="ok-s">${S.visited.size}/20 stazioni · livello <b>${lv.n}</b></div>
   ${lineSvg('#FFCD00','#3A3A3A',[...S.visited],true)}
   <div class="ptsbox">${g.map(x=>`<div class="r"><span>${x[0]}</span><em>+${x[1]}</em></div>`).join('')}<div class="r tot"><span>Totale · ${S.points} pt</span><em>+${tot}</em></div></div>
   <div class="unlock"><span class="ri">${ic('note',{size:22})}</span><div class="x"><div class="k">SBLOCCATO · ESCLUSIVA</div><b>Live @ ${st.name}</b><span>${st.artists[CUR]} · registrata stanotte</span></div><button class="play" style="width:44px;height:44px" onclick="playExclusive(${st.n})">${ic('play',{fill:true,size:20})}</button></div>
   ${nx?`<div class="ok-s" style="margin-top:12px;color:#ccc">Ancora ${nx.p-S.points} pt per il livello <b style="color:#fff">${nx.n}</b></div>`:''}
   <div class="ok-actions"><button class="btn-white full" onclick="seeOnMap(${st.n})">${ic('map',{size:18})} Vedi la tappa sulla mappa</button><button class="btn-ghost full" onclick="replaceTop('wave')">Il tuo Wave Pass</button></div>
  </div>`;
},

/* ---------- F6 · A BORDO ---------- */
onboard(c){
  const t=TRAINS.find(x=>x.id===(c.t||1)), s=ST(t.st), nxt=nextStop(t);
  TOPC=s.fill;TOPT=s.text;
  const stops=[0,1,2].map(k=>{const n=nxt+k*t.dir;return n>=1&&n<=20?ST(n):null}).filter(Boolean);
  return `<div class="screen">${topbar(t.name)}
   <div class="onb" style="background:${s.fill};color:${s.text};padding-bottom:20px"><span class="onb-sym paper">${sym(s.n,'100%')}</span>
     <span class="badge live"><i class="dot"></i>SEI A BORDO</span>
     <div class="k" style="margin-top:16px">${t.name.toUpperCase()} · DIREZIONE ${t.dir>0?'CENTRO DIREZIONALE':'PISCINOLA'}</div>
     <h1>${s.genre.split(' /')[0]}</h1><div class="who">Live set di ${t.dj}</div>
     <div class="eq"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
     <span class="pts">★ +50 PT · CORSA A BORDO</span>
   </div>
   <div class="sec"><h2>Prossime fermate</h2></div>
   <div class="stops">${stops.map((x,i)=>`<div class="stop ${i===0?'next':''}"><i style="border-color:${x.fill}"></i><b>${x.name}</b><span style="color:var(--text-2);font-size:13px">${x.genre}</span><em>${i===0?'tra '+Math.max(1,Math.round(Math.abs(nxt-t.p)*2.5))+' min':'+'+(i*3+Math.round(Math.abs(nxt-t.p)*2.5))+' min'}</em></div>`).join('')}</div>
   <div class="safety">${ic('alert',{size:20})}<span>Durante il set resta lontano dalle porte. Si scende con calma: il prossimo vagone-palco passa tra 8 minuti.</span></div>
   <div class="tk-actions"><button class="btn-white full" onclick="getOff()">Scendo alla prossima</button></div>
  </div>`;
},

/* ---------- F7 · WAVE PASS / PUNTI ---------- */
wave(){
  TOPC='#121212';
  ensurePass();
  const v=S.visited.size, live=S.phase==='live', lv=level(S.points), nx=nextLevel(S.points), q=S.quiz;
  const base=lv.p, pct=nx?((S.points-base)/(nx.p-base))*100:100;
  const ng=GADGETS.find(g=>g.p>S.points&&!g.soldout);
  return `<div class="screen">${topbar('Wave Pass',true)}
   <div class="wv-card grain">
     <div style="position:relative"><span class="badge ${live?'live':''}"><i class="dot"></i>${live?'ATTIVO ORA':S.phase==='post'?'UTILIZZATO':'VALIDO · 27.06.27'}</span>
       <h3>WAVE PASS</h3><div class="k">${S.pass.type==='crew'?'CREW ×4':'NOTTE'} · ${S.pass.code}</div></div>
     <button class="qrbtn" onclick="go('ticket')">${ic('qr',{size:30})}QR PASS</button>
   </div>
   <div class="wv-prog">
     <div class="wv-num"><b>${S.points}</b><span>punti</span><span class="tier">${lv.n.toUpperCase()}</span></div>
     <div class="pbar"><i style="width:${pct}%"></i></div>
     <div class="pnext">${nx?`Ancora <b>${nx.p-S.points} pt</b> per <b>${nx.n}</b>${ng?` · prossimo gadget: ${ng.t}`:''}`:'Hai raggiunto il Capolinea. Leggenda.'}</div>
     <div class="stats"><div><b>${v}/20</b><span>STAZIONI</span></div><div><b>${q&&S.visited.has(q.challenge)?'✓':'—'}</b><span>SFIDA</span></div><div><b>${S.rides.size}</b><span>VAGONI</span></div></div>
   </div>
   <div style="margin:14px 16px 0"><button class="btn-green full" onclick="go('scan')">${ic('qr',{size:20})} Scansiona il QR della stazione</button></div>
   <div class="sec"><h2>I tuoi timbri</h2><span class="more">${v}/20</span></div>
   <div class="stamps">${STATIONS.map(s=>{const on=S.visited.has(s.n),ch=q&&q.challenge===s.n,ref=q&&q.ref===s.n;
     return `<button class="stamp ${on?'on':''} ${ch?'ch':''}" style="${svar(s)}${on?`background:${PAPER};box-shadow:inset 0 0 0 3px ${symColor(s)};`:''}" onclick="go('station',{n:${s.n}})" title="${esc(s.name)}">${on?`<span class="ss">${sym(s.n,'100%')}</span>`:pad(s.n)}${ch?'<span class="tg">×2</span>':ref?'<span class="tg">TUA</span>':''}</button>`}).join('')}</div>
   <div class="sec"><h2>Come guadagni punti</h2></div>
   ${[['qr','Check-in in una stazione','Scansiona il totem in banchina',100],['star','Stazione sfida','Fuori dalla comfort zone: punti ×2',200],['compass','Genere inaspettato','Affinità del quiz sotto il 30%: badge Esploratore',150],['train','Live set a bordo','Scansiona il QR nel vagone-palco',50],['route','Combo','Tre stazioni consecutive',100]]
     .map(([i,t,d,p])=>`<div class="rw"><span class="ri">${ic(i,{size:20})}</span><div class="x"><b>${t}</b><span>${d}</span></div><span class="st">+${p}</span></div>`).join('')}
   <div class="sec"><h2>Gadget esclusivi</h2><button class="more" onclick="go('gadgets')">Catalogo →</button></div>
   ${GADGETS.slice(0,2).map((g,i)=>gadRow(g,i)).join('')}
   <div class="sec"><h2>Badge sul profilo</h2></div>${badgesRow()}
   ${S.festival?`<div style="text-align:center;margin-top:24px"><button class="btn-ghost" onclick="exitFest()">Esci dalla Metrowave Mode</button></div>`:''}
  </div>`;
},
gadgets(){
  TOPC='#121212';
  return `<div class="screen">${topbar('Gadget esclusivi',true)}
   <div class="wv-prog" style="margin-top:6px"><div class="wv-num"><b>${S.points}</b><span>punti disponibili</span><span class="tier">${level(S.points).n.toUpperCase()}</span></div>
     <div class="pnext">I gadget sono premi a soglia: ritirarli non scala i punti. Uno per tipo, fino a esaurimento.</div></div>
   <div style="height:16px"></div>
   ${GADGETS.map((g,i)=>gadRow(g,i)).join('')}
   <div class="sec"><h2>Wave Point</h2></div>
   <div class="wp">${WAVE_POINTS.map(([n,name,where])=>`<div><i style="width:12px;height:12px;border-radius:50%;background:${ST(n).fill}"></i><b>${name}</b><span style="color:var(--text-2);font-size:13px">${where}</span><em>22:30–03:30</em></div>`).join('')}</div>
  </div>`;
},
voucher(c){
  TOPC='#121212';
  const g=GADGETS[c.g], code='MWG-'+(1000+c.g*137)+'-'+(S.pass?S.pass.code.slice(-4):'0000');
  return `<div class="screen">${topbar('Ritira gadget',true)}
   <div class="voucher"><div class="vt grain"><span class="badge"><i class="dot"></i>VOUCHER · ${g.p} PT</span><b>${g.t}</b></div>
     ${qr(code)}<div class="code">${code}</div>
     <div style="font-size:13.5px;color:#555;margin-top:8px;padding:0 18px">Mostra questo codice a un Wave Point. Valido fino al 4 luglio 2027.</div></div>
   <div class="wp">${WAVE_POINTS.map(([n,name,where])=>`<div><i style="width:12px;height:12px;border-radius:50%;background:${ST(n).fill}"></i><b>${name}</b><span style="color:var(--text-2);font-size:13px">${where}</span><em>22:30–03:30</em></div>`).join('')}</div>
   <div class="tk-actions"><button class="btn-white full" onclick="redeem(${c.g})">Segna come ritirato (demo)</button></div>
  </div>`;
},
ticket(){
  TOPC='#121212';
  ensurePass();
  const st=S.phase==='live'?'<span class="badge live"><i class="dot"></i>ATTIVO ORA</span>':S.phase==='post'?'<span class="badge">UTILIZZATO</span>':'<span class="badge"><i class="dot"></i>VALIDO · 27.06.27</span>';
  return `<div class="screen">${topbar('QR del pass',true)}
   <div class="ticket">
     <div class="tk-top grain">
       <div style="position:relative;display:flex;justify-content:space-between;align-items:center">${st}<span style="font:700 11px var(--mono);letter-spacing:.1em">LINEA 1</span></div>
       <h2>METROWAVE</h2><div class="ty">${S.pass.type==='crew'?'Wave Pass · Crew ×4':'Wave Pass · Notte'}</div>
       ${lineSvg('#000','#000')}</div>
     <div class="tk-cut"></div>
     <div class="tk-bot">${qr(S.pass.code)}<div class="code">${S.pass.code}</div>
       <div class="tk-grid"><div><span>DATA</span><b>Dom 27 giu 2027</b></div><div><span>VALIDITÀ</span><b>21:30 – 04:00</b></div>
         <div><span>ACCESSO</span><b>20 stazioni</b></div><div><span>TITOLARE</span><b>Marisol D.</b></div></div></div>
   </div>
   <div class="tk-actions"><button class="btn-white full" onclick="toast('Aggiunto al Wallet')">${ic('wallet',{size:20})} Aggiungi al Wallet</button>
     ${mapOpen()?`<button class="btn-ghost full" onclick="go('map')">${ic('map',{size:20})} Apri la mappa</button>`:''}</div>
  </div>`;
},
recap(){
  TOPC='#121212';
  if(S.visited.size<1){seedVisits([15,14,13,16,18,19,9])}
  const v=[...S.visited].sort((a,b)=>a-b), q=S.quiz, ex=[...S.explorer][0];
  return `<div class="screen">${topbar('Il tuo recap',true)}
   <div class="story grain">
     <div class="k">LA TUA NOTTE</div><h2>METROWAVE</h2>
     <div class="rc-body">
       ${recapLine(v)}
       <div class="rc-stats">
         <div><b class="rc-big">${S.points}</b><span>PUNTI</span></div>
         <div><b>${v.length}<small>/20</small></b><span>STAZIONI</span></div>
         <div><b class="rc-txt">${level(S.points).n}</b><span>LIVELLO</span></div>
         <div><b class="rc-txt">${q?ST(q.ref).name:'—'}</b><span>LA TUA STAZIONE</span></div>
         <div><b class="rc-txt">${q&&S.visited.has(q.challenge)?'Superata':'Non tentata'}</b><span>SFIDA</span></div>
       </div>
     </div>
     <div class="ft"><span>27.06.27</span><span>LINEA 1 · NAPOLI</span></div>
   </div>
   <div class="tk-actions"><button class="btn-white full" onclick="toast('Pronto da condividere')">${ic('share',{size:20})} Condividi nelle storie</button>
     <button class="btn-ghost full" onclick="go('gadgets')">Ritira i tuoi gadget</button></div>
  </div>`;
},
library(){
  const rows=[];
  if(S.ticket) rows.push(`<button class="lr" onclick="go('wave')">${mwCover(64)}<div><b>Wave Pass · Metrowave</b><span><span class="pinic">${ic('pin',{size:13,sw:2.6})}</span>Biglietto · ${S.points} pt</span></div></button>`);
  if(S.quiz){const s=ST(S.quiz.ref);rows.push(`<button class="lr" onclick="go('station',{n:${s.n}})">${stCover(s,64)}<div><b>La tua stazione · ${s.name}</b><span>Playlist ${s.genre}</span></div></button>`)}
  [...S.saved].forEach(n=>{const s=ST(n);rows.push(`<button class="lr" onclick="go('station',{n:${n}})">${stCover(s,64)}<div><b>${s.name} · ${s.genre}</b><span>Stazione · Metrowave</span></div></button>`)});
  rows.push(`<button class="lr">${gcover('#450AF5','#C4EFD9','',64,'heart')}<div><b>Brani che ti piacciono</b><span>Playlist · 214 brani</span></div></button>`);
  rows.push(`<button class="lr">${avatar('Geolier','#1B3A4F',64)}<div><b>Geolier</b><span>Artista</span></div></button>`);
  rows.push(`<button class="lr">${gcover('#FFD600','#C62828','Classici',64)}<div><b>Classici Italiani</b><span>Playlist</span></div></button>`);
  return `<div class="screen pt">
    <div class="search-head"><div class="avatar">M</div><h1>La tua libreria</h1><button class="icb" style="color:#fff">${ic('search',{size:26})}</button><button class="icb" style="color:#fff">${ic('plus',{size:26})}</button></div>
    <div class="pills" style="padding-top:0"><button class="pill">Playlist</button><button class="pill">Artisti</button><button class="pill">Album</button><button class="pill mw">Eventi</button></div>
    <div class="libsort"><span>⇅ Recenti</span><span>☷</span></div>${rows.join('')}</div>`;
},
};
