/* =====================================================================
   NAV / RENDER
   ===================================================================== */
const phone=document.getElementById('phone'), vp=document.getElementById('vp');
const IMMERSIVE=['scan','checked','quiz','quizcalc','result','challenge'];
function cur(){const st=S.stacks[S.tab];return st[st.length-1]}
function go(s,p={}){closeSheet();S.stacks[S.tab].push({s,...p});render(true)}
function back(){const st=S.stacks[S.tab];if(st.length>1){st.pop();render(true)}}
function replaceTop(s,p={}){const st=S.stacks[S.tab];if(st.length>1)st.pop();else st.length=0;st.push({s,...p});if(st[0].s!=='home'&&S.tab==='home')st.unshift({s:'home'});render(true)}
function tab(t){if(t==='crea'){openCrea();return}if(t==='scan'){go('scan');return}if(S.tab===t)S.stacks[t]=[S.stacks[t][0]];S.tab=t;closeSheet();render(true)}
function jump(t,s,p={}){S.tab=t;S.stacks[t]=[S.stacks[t][0]];if(s)S.stacks[t].push({s,...p});closeSheet();render(true)}
function setFilter(f){S.homeFilter=f;if(S.tab==='home'&&cur().s==='home')render(true)}
function setFam(k,f){S[k]=f;render()}
/* PREVENDITA: l'esperienza Metrowave è chiusa fino al 27 giugno. Restano aperti solo
   acquisto / collegamento del pass e "I tuoi Ticket"; tutto il resto atterra sull'anteprima bloccata. */
const PRE_LOCKED=['hub','map','station','quiz','quizcalc','result','challenge','onboard','checked','wave','gadgets','voucher','recap'];
function gate(c){
  if(S.phase!=='pre')return c.s;
  if(c.s==='wave')return S.ticket?'ticket':'preview';          /* il pass si vede solo come biglietto */
  if(c.s==='scan'&&c.mode!=='ticket')return 'preview';        /* lo scanner serve solo a collegare un biglietto */
  return PRE_LOCKED.includes(c.s)?'preview':c.s;
}
function render(reset){
  TOPC='#121212';TOPT='#fff';
  const c=cur();
  vp.innerHTML=SCREENS[gate(c)](c);
  phone.style.setProperty('--topc',TOPC);
  phone.style.setProperty('--topt',TOPT);
  phone.classList.toggle('sb-dark',TOPT==='#000000');
  phone.classList.toggle('on-home',c.s==='home');
  phone.classList.toggle('immersive',IMMERSIVE.includes(c.s));
  if(reset){vp.scrollTop=0;phone.classList.remove('scrolled')}
  updTabs();updMini();updClock();updPanel();
  afterRender(c);
}
function afterRender(c){
  if(c.s==='quiz'&&c.step===1)attachSwipe();
  if(c.s==='map'){
    positionTrains();
    if(mapOpen()&&!S.mapUnlocked){S.mapUnlocked=true;setTimeout(()=>toast('Mappa sbloccata · 20 stazioni'),1500)}
    if(S.lit){const n=S.lit;setTimeout(()=>scrollToSt(n),150);setTimeout(()=>{if(S.lit===n){S.lit=null}},3500)}
  }
  if(c.s==='verify')setTimeout(()=>{if(cur().s==='verify'){setTicket(true);replaceTop('activated')}},1500);
  if(c.s==='quizcalc')setTimeout(()=>{if(cur().s==='quizcalc')replaceTop('result')},1800);
}
vp.addEventListener('scroll',()=>phone.classList.toggle('scrolled',vp.scrollTop>60));

function updTabs(){
  const t=[['home','Home'],['search','Ricerca'],['library','La tua libreria'],S.festival?['scan','Check-in']:['crea','Crea']];
  document.getElementById('tabbar').innerHTML=t.map(([k,l])=>{
    const on=S.tab===k;let i;
    if(k==='home') i=on?ic('home',{fill:true,size:28}):ic('home',{size:28,sw:1.8});
    else if(k==='search') i=ic('search',{size:28,sw:on?3:2});
    else if(k==='library') i=ic('lib',{size:28,sw:on?2.8:2});
    else if(k==='scan') i=`<span class="tck">${ic('qr',{size:26,sw:1.9})}<i></i></span>`;
    else i=ic('plus',{size:28,sw:2});
    return `<button class="tab ${on?'on':''}" onclick="tab('${k}')">${i}<span>${l}</span></button>`}).join('');
}
function updPanel(){
  document.querySelectorAll('#phasesw button').forEach(b=>b.classList.toggle('on',b.dataset.p===(S.phase==='live'?(S.ticket?'live':'livenp'):'pre')));
  document.querySelectorAll('#seg button').forEach(b=>b.className=b.dataset.p===S.phase?'on':'');
  document.getElementById('tg-ticket').classList.toggle('on',S.ticket);
  document.getElementById('tg-quiz').classList.toggle('on',!!S.quiz);
}

/* ---- mini player ---- */
let lastKey='';
function updMini(){
  const t=S.track,m=document.getElementById('mini');
  m.style.background=mix(t.color,40);
  m.classList.toggle('playing',S.playing);
  document.getElementById('mcv').innerHTML=t.n?stCover(ST(t.n),44):t.cover?gcover(t.cover[0],t.cover[1],'',44):mwCover(44);
  document.getElementById('mt').innerHTML=t.live?`<span class="livedot"></span>${t.title}`:t.title;
  document.getElementById('ma').textContent=t.artist;
  document.getElementById('madd').innerHTML=S.liked?`<span style="color:var(--green)">${ic('checkc',{size:28})}</span>`:ic('plusc',{size:28});
  document.getElementById('mpp').innerHTML=ic(S.playing?'pause':'play',{fill:true,size:28});
  const key=t.title+t.artist+t.live;
  if(key!==lastKey){lastKey=key;const pr=document.getElementById('mprog');pr.className='mprog'+(t.live?' live':'');pr.innerHTML='<i></i>'}
}
function setTrack(t){S.track=t;S.playing=true;S.liked=false;render()}
function togglePlay(){S.playing=!S.playing;updMini()}
function likeTrack(){S.liked=!S.liked;updMini();if(S.liked)toast('Aggiunto ai Brani che ti piacciono')}
function miniTap(){if(S.onboard)go('onboard',{t:S.onboard});else if(S.track.n)go('station',{n:S.track.n})}
function liveTrack(n){const s=ST(n);return {title:`In onda a ${s.name}`,artist:`${s.artists[CUR]} · ${s.genre}`,color:s.fill,n,live:true}}
function playStation(n){const s=ST(n);setTrack(S.phase==='live'?liveTrack(n):{title:tracks(s)[0].t,artist:tracks(s)[0].a,color:s.fill,n})}
function playTrack(n,i){const s=ST(n),t=tracks(s)[i];setTrack({title:t.t,artist:t.a,color:s.fill,n})}
function playMix(){setTrack(S.phase==='live'?liveTrack(S.quiz?S.quiz.ref:15):{title:'Metrowave: All Night Mix',artist:'Metrowave · 20 generi',color:'#8A2BE2'})}
function playGeneric(t,a){setTrack({title:t,artist:a,color:'#1B3A4F',cover:['#0B2A3F','#4A90B8']})}
function playExclusive(n){const s=ST(n);setTrack({title:`Live @ ${s.name}`,artist:`${s.artists[CUR]} · Esclusiva Metrowave`,color:s.fill,n});toast(`In riproduzione: Live @ ${s.name}`)}

/* =====================================================================
   ACTIONS / DEMO
   ===================================================================== */
function toggleSave(n){const s=ST(n);if(S.saved.has(n)){S.saved.delete(n);toast('Rimossa da La tua libreria')}else{S.saved.add(n);toast(`${s.name} aggiunta a La tua libreria`)}closeSheet();render()}
function scrollToSt(n){const el=document.getElementById('st-'+n);if(el)el.scrollIntoView({behavior:'smooth',block:'center'})}
function onQ(v){S.q=v;document.getElementById('sr').innerHTML=searchBody()}
function setPhase(p){
  S.phase=p;
  if(p==='live'){if(!S.ticket)setTicket(true);S.mapUnlocked=true;S.track=liveTrack(S.quiz?S.quiz.ref:15);S.playing=true}
  else{
    if(S.track.live){S.track={...DEFAULT_TRACK};S.playing=false}
    S.onboard=null;S.festival=false;phone.classList.remove('fest');hidePopup();
  }
  if(p==='post'){if(!S.ticket)setTicket(true);if(S.visited.size<3)seedVisits([15,14,13,16,18,19,9])}
  render();
  if(p==='live'&&!S.festival)showPopup('event');
}
function toggleTicket(){setTicket(!S.ticket);if(!S.ticket){S.quiz=null;S.mapUnlocked=false}render()}
function toggleQuiz(){if(S.quiz)S.quiz=null;else{if(!S.ticket)setTicket(true);demoQuiz()}render()}
function resetDemo(){
  if(S.phase!=='pre')setPhase('pre');
  Object.assign(S,{ticket:false,pass:null,quiz:null,qa:null,mapUnlocked:false,mapSeen:false,homeFilter:'tutti',visited:new Set(),here:null,lit:null,points:0,combos:new Set(),explorer:new Set(),rides:new Set(),redeemed:new Set(),onboard:null,track:{...DEFAULT_TRACK},playing:false});
  hidePopup();
}
function demoLive(){if(S.phase!=='live')setPhase('live');enterFestQuick();render()}
/* Selettore di stato (angolo della pagina): Prevendita ↔ Live, ognuno col suo pop-up */
function demoPresale(){resetDemo();jump('home');showPopup('launch')}
function demoLiveNight(){if(S.phase==='live'){S.festival=false;phone.classList.remove('fest');S.homeFilter='tutti';jump('home');showPopup('event')}else setPhase('live')}
function demoLiveNoPass(){if(S.phase!=='live')setPhase('live');setTicket(false);S.mapUnlocked=false;S.festival=false;phone.classList.remove('fest');S.homeFilter='tutti';jump('home');showPopup('event')}
function demoSplash(){S.festival=false;phone.classList.remove('fest');if(S.phase!=='live')setPhase('live');else{jump('home');showPopup('event')}}

/* ---- sheet / toast ---- */
const sheet=document.getElementById('sheet');
function openSheet(html){sheet.innerHTML='<div class="grab"></div>'+html;phone.classList.add('sheet-open')}
function closeSheet(){phone.classList.remove('sheet-open')}
function openStation(n){
  const s=ST(n),live=S.phase==='live',vis=S.visited.has(n),q=S.quiz;
  const tag=q&&q.ref===n?'<span class="mtag ref">LA TUA STAZIONE</span>':q&&q.challenge===n?'<span class="mtag ch">SFIDA ×2</span>':'';
  openSheet(`<div class="sh-head" style="background:${s.fill};color:${s.text}">${stCover(s,84)}
      <div><div class="k">STAZIONE ${pad(n)} · LINEA 1</div><h4>${s.name}</h4><span class="gtag" style="background:#000;color:#fff">${s.genre}</span> ${tag}</div></div>
    <div class="sh-body">
      <div class="sh-now">${live?`<span class="badge live sm"><i class="dot"></i>IN ONDA</span><b>${s.artists[CUR]}</b> fino alle ${SETS[CUR+1]}`
        :S.phase==='post'?`Concluso · closing di <b>${s.artists[2]}</b>`:`Primo set <b>22:00</b> · ${s.artists[0]}${q?` · affinità <b>${q.aff[n]}%</b>`:''}`}</div>
      <div class="preview" onclick="this.classList.toggle('on')"><span class="pb">${ic('play',{fill:true,size:18})}</span>
        <div class="pt2">Anteprima 0:30 · ${tracks(s)[0].t}<div class="bar"><i></i></div></div></div>
      ${s.x?`<div class="sh-now" style="margin-bottom:16px">${ic('swap',{size:16})} Interscambio: ${s.x}</div>`:''}
      <div class="sh-actions"><button class="btn-white" onclick="go('station',{n:${n}})">Vai alla stazione</button>
        <button class="btn-ghost" onclick="go('scan',{n:${n}})">${vis?'✓ Timbrata':'Check-in (QR)'}</button></div>
    </div>`);
}
function openCrea(){
  openSheet(`<div style="padding:10px 0 0">
    <button class="opt" onclick="closeSheet();toast('Funzione di esempio')"><span class="oi">${ic('note')}</span><div><b>Playlist</b><span>Crea una playlist con brani o episodi</span></div></button>
    <button class="opt" onclick="go('map')"><span class="oi acid">${ic('route')}</span><div><b>Rotta Metrowave</b><span>Scegli le stazioni e crea il percorso della tua notte</span></div></button>
    <button class="opt" onclick="closeSheet();toast('Funzione di esempio')"><span class="oi">${ic('heart')}</span><div><b>Blend</b><span>Unisci i gusti di amici in una playlist</span></div></button></div>`);
}
let tt;
function toast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),1900)}

/* ---- clock, countdown, fit ---- */
function updClock(){document.getElementById('clock').textContent=S.phase==='live'?'00:14':'11:38'}
setInterval(()=>{document.querySelectorAll('.cd').forEach(e=>e.textContent=cdText());document.querySelectorAll('[data-cdbox]').forEach(e=>e.innerHTML=cdBoxes())},1000);
function fit(){
  const s=innerWidth<=820?1:Math.min(1,(innerHeight-48)/956,(innerWidth-48)/440);
  document.documentElement.style.setProperty('--s',s);
}
/* menu presentazione */
function openMenu(){closeSheet();phone.classList.add('menu-on')}
function closeMenu(){phone.classList.remove('menu-on')}
function toggleMenu(){phone.classList.contains('menu-on')?closeMenu():openMenu()}
addEventListener('keydown',e=>{
  if(e.target.closest&&e.target.closest('input'))return;
  if(e.key==='m'||e.key==='M')toggleMenu();
  if(e.key==='Escape'){closeMenu();closeSheet()}
});
addEventListener('resize',fit);fit();

/* deep link: ?phase=live&ticket=1&quiz=1&go=station&n=15&tab=home&filter=mw&splash=0&v=1,13&popup=launch|event&step=1&menu=1 */
(()=>{const q=new URLSearchParams(location.search);
  if(q.get('ticket'))setTicket(true);
  if(q.get('quiz')){setTicket(true);demoQuiz()}
  if(q.get('unlocked'))S.mapUnlocked=true;
  if(q.get('phase'))setPhase(q.get('phase'));
  if(q.get('splash')==='0')enterFestQuick();
  if(q.get('filter'))S.homeFilter=q.get('filter');
  if(q.get('v'))seedVisits(q.get('v').split(',').map(Number));
  if(q.get('go')==='quiz'){S.qa=freshQA();if(q.get('step')>1){S.qa.idx=5;S.qa.consent=q.get('step')>2?true:null;S.qa.amb=q.get('step')>4?'piazza':null}}
  const p={};if(q.get('n'))p.n=+q.get('n');if(q.get('step'))p.step=+q.get('step');if(q.get('mode'))p.mode=q.get('mode');if(q.get('t'))p.t=+q.get('t');if(q.get('g'))p.g=+q.get('g');
  jump(q.get('tab')||'home',q.get('go')||null,p);
  if(q.get('popup'))showPopup(q.get('popup'));
  if(q.get('sheet'))openStation(+q.get('sheet'));
  /* AVVIO: senza parametri (apertura normale) il pop-up parte subito, in primo piano assoluto */
  if(!location.search||q.get('launch'))showPopup(S.phase==='live'?'event':'launch');
  if(q.get('menu'))openMenu();
  if(q.get('scroll'))setTimeout(()=>{const v=document.querySelector('.viewport');if(v)v.scrollTop=+q.get('scroll')},50);
})();
