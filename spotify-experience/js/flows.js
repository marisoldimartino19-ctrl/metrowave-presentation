/* =====================================================================
   F2 · BIGLIETTO
   ===================================================================== */
function ensurePass(){if(!S.pass)S.pass={type:S.passSel,code:'MW-2706-'+String(1000+Math.floor(Math.random()*8999))}}
function setTicket(v){S.ticket=v;if(v)ensurePass();else{S.pass=null}}
/* Login rapido con Eventbrite / ticket partner: trova il biglietto sull'account e lo collega */
function openPartnerLogin(){
  openSheet(`<div class="sh-body" style="padding-top:22px">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px"><span class="ci" style="width:48px;height:48px;border-radius:10px;background:#F05537;color:#fff;display:grid;place-items:center;font:700 15px var(--ui)"><b>eb</b></span>
      <div><b style="font-size:17px;display:block">Sincronizza i tuoi biglietti</b><span style="color:var(--text-2);font-size:13px">Accedi al partner da cui hai acquistato</span></div></div>
    <div style="display:grid;gap:10px">
      <button class="btn-white full" onclick="closeSheet();go('verify',{src:'partner'})">Continua con Eventbrite</button>
      <button class="btn-ghost full" onclick="toast('Altri partner disponibili presto')">Altro ticket partner</button></div>
    <div class="fine" style="margin-top:14px">Leggiamo solo i biglietti Metrowave collegati al tuo account.</div></div>`);
}
function fmtCode(el){
  let v=el.value.toUpperCase().replace(/[^A-Z0-9]/g,'');
  if(v.length>2)v=v.slice(0,2)+'-'+v.slice(2);
  if(v.length>7)v=v.slice(0,7)+'-'+v.slice(7);
  el.value=v.slice(0,12);
  const ok=/^MW-\d{4}-\d{4}$/.test(el.value);
  document.getElementById('actbtn').disabled=!ok;
  document.getElementById('fld').className='field'+(ok?' ok':'');
  document.getElementById('ferr').innerHTML='';
}
function pasteCode(c){const el=document.getElementById('codein');el.value=c;fmtCode(el)}
function submitCode(){
  const v=document.getElementById('codein').value, f=document.getElementById('fld'), e=document.getElementById('ferr');
  if(!v.startsWith('MW-')){f.className='field err';e.innerHTML='Questo codice non ci risulta. Controlla l’email di Eventbrite: inizia con MW-';return}
  if(v.includes('0000')){f.className='field err';e.innerHTML='Questo biglietto è già attivo su un altro account. <a onclick="toast(\'Assistenza contattata\')">Contatta l’assistenza</a>';return}
  S.pass={type:'notte',code:v};replaceTop('verify');
}
function simTicket(){
  const vf=document.getElementById('vf');
  document.getElementById('totem').innerHTML=`<div class="totem" style="background:#fff;color:#000"><div class="tk">BIGLIETTO · BOTTEGHINO</div><div class="qrb">${qr('BOX')}</div><div class="tn">Metrowave</div></div>`;
  vf.classList.add('found');
  document.getElementById('hint').innerHTML='Biglietto rilevato<span>Attivazione in corso…</span>';
  setTimeout(()=>replaceTop('verify'),900);
}

/* =====================================================================
   F3 · POP-UP + QUIZ
   ===================================================================== */
function freshQA(){return {idx:0,likes:[],nopes:[],consent:null,chips:new Set(HISTORY.map(h=>h.k)),energy:55,amb:null,comp:null,comfort:3}}
function startQuiz(replace){hidePopup();S.qa=freshQA();if(replace)replaceTop('quiz',{step:1});else go('quiz',{step:1})}
function closeQuiz(){const st=S.stacks[S.tab];while(st.length>1&&['quiz','quizcalc'].includes(st[st.length-1].s))st.pop();render(true)}
function toggleChip(k){const c=S.qa.chips;c.has(k)?c.delete(k):c.add(k);render()}
function energyLabel(v){return v<25?'Divano e cuffie':v<50?'Testa che dondola':v<75?'Si balla':'Pogo'}
function energyBars(v){return [...Array(12)].map((_,i)=>`<i style="height:${Math.max(8,Math.min(80,(v/100)*80*(0.45+0.55*Math.abs(Math.sin(i*1.7+1)))))}px;background-position:${-i*25}px 0"></i>`).join('')}
function setEnergy(v){S.qa.energy=+v;document.getElementById('enval').textContent=energyLabel(+v);document.getElementById('enbars').innerHTML=energyBars(+v)}
function swipe(like){
  const qa=S.qa,n=QUIZ_DECK[qa.idx],el=document.getElementById('qtop');
  (like?qa.likes:qa.nopes).push(n);
  if(el){el.style.transition='transform .28s ease';el.style.transform=`translateX(${like?520:-520}px) rotate(${like?24:-24}deg)`}
  setTimeout(()=>{qa.idx++;if(qa.idx>=QUIZ_DECK.length)replaceTop('quiz',{step:2});else render()},280);
}
function attachSwipe(){
  const el=document.getElementById('qtop');if(!el)return;
  let x0=null,dx=0;
  const y=el.querySelector('.qstamp.y'),n=el.querySelector('.qstamp.n');
  el.addEventListener('pointerdown',e=>{x0=e.clientX;dx=0;el.style.transition='none';el.setPointerCapture(e.pointerId)});
  el.addEventListener('pointermove',e=>{if(x0===null)return;dx=(e.clientX-x0)/(+getComputedStyle(document.documentElement).getPropertyValue('--s')||1);
    el.style.transform=`translateX(${dx}px) rotate(${dx/18}deg)`;y.style.opacity=Math.max(0,dx/90);n.style.opacity=Math.max(0,-dx/90)});
  el.addEventListener('pointerup',()=>{if(x0===null)return;x0=null;
    if(dx>90)swipe(true);else if(dx<-90)swipe(false);else{el.style.transition='transform .25s';el.style.transform='';y.style.opacity=0;n.style.opacity=0}});
}
function computeQuiz(qa){
  const sc={};STATIONS.forEach(s=>sc[s.n]=10);
  qa.likes.forEach(n=>{sc[n]+=40;STATIONS.filter(s=>s.fam===ST(n).fam&&s.n!==n).forEach(s=>sc[s.n]+=12)});
  qa.nopes.forEach(n=>sc[n]-=15);
  if(qa.consent)HISTORY.filter(h=>qa.chips.has(h.k)).forEach(h=>Object.entries(h.w).forEach(([n,w])=>sc[n]+=w));
  STATIONS.forEach(s=>sc[s.n]+=Math.max(0,30-Math.abs(qa.energy-s.energy)*0.45));
  const a=AMB.find(x=>x.k===qa.amb);if(a)a.g.forEach(n=>sc[n]+=20);
  const vals=Object.values(sc),mx=Math.max(...vals),mn=Math.min(...vals);
  const aff={};STATIONS.forEach(s=>aff[s.n]=Math.round(8+89*(sc[s.n]-mn)/((mx-mn)||1)));
  const sorted=STATIONS.map(s=>s.n).sort((x,y)=>sc[y]-sc[x]);
  const ref=sorted[0];
  const asc=[...sorted].reverse().filter(n=>ST(n).fam!==ST(ref).fam);
  const challenge=asc[Math.min(asc.length-1,5-(qa.comfort||3))];
  return {ref,challenge,aff,top:sorted.slice(0,3),comp:qa.comp};
}
function finishQuiz(){S.quiz=computeQuiz(S.qa);replaceTop('quizcalc')}
function demoQuiz(){S.quiz=computeQuiz({likes:[15,1],nopes:[20],consent:true,chips:new Set(HISTORY.map(h=>h.k)),energy:55,amb:'piazza',comp:'amici',comfort:5})}
function acceptChallenge(){toast('Sfida accettata · punti ×2');const st=S.stacks[S.tab];while(st.length>1&&['quiz','quizcalc','result','challenge','activated','verify','code','activate','buy'].includes(st[st.length-1].s))st.pop();go('map')}

/* =====================================================================
   POP-UP A TUTTO SCHERMO · variant 'launch' (apertura app) | 'event' (notte)
   ===================================================================== */
const popupEl=document.getElementById('popup');
/* Nessun pulsante "chiudi": si esce solo con l'unica azione, "Entra nell'Esperienza". */
/* Pop-up modale in stile Spotify, due momenti del festival:
   'launch' = PREVENDITA (giorni prima): porta all'acquisto del Wave Pass
   'event'  = LIVE (notte del 27 giugno): porta alla Home in Metrowave Mode */
const POPUP_COPY={
  launch:{kicker:'',line:'27 Giugno 2027',desc:'La Linea 1 si accende per una notte. Assicurati l\'accesso a tutte le 20 stazioni.',cta:'Acquista il tuo Wave Pass',go:'buyFromPopup()'},
  event:{kicker:'● Live ora',line:'Linea 1 Notte',desc:'Il festival è in corso. 20 Stazioni, 20 Generi, 1 Notte.',cta:'Entra nell\'Esperienza',go:'enterFest()'},
};
function showPopup(variant){
  closeSheet();
  popupEl.className='popup';
  const c=POPUP_COPY[variant==='event'?'event':'launch'];
  popupEl.innerHTML=`<div class="mwm" role="dialog" aria-modal="true" aria-labelledby="mwm-t">
     <div class="mwm-card">
       ${c.kicker?`<p class="mwm-live">${c.kicker}</p>`:''}
       <div class="mwm-logo">${mwLogo(58)}</div>
       <h2 class="mwm-title" id="mwm-t">Metrowave<span class="mwm-line">— ${c.line}</span></h2>
       <p class="mwm-desc">${c.desc}</p>
       <button class="mwm-cta" onclick="${c.go}">${c.cta}</button>
       <button class="mwm-close" onclick="dismissPopup()">Chiudi</button>
     </div>
   </div>`;
  phone.classList.add('popup-on');
}
function hidePopup(){phone.classList.remove('popup-on');popupEl.className='popup'}
function enterFest(){
  popupEl.classList.add('entering');
  setTimeout(()=>{
    S.festival=true;phone.classList.add('fest');S.homeFilter='mw';jump('home');
    popupEl.classList.add('leaving');
    setTimeout(()=>{hidePopup();toast('Metrowave Mode attiva')},300);
  },320);
}
/* Prevendita: dal pop-up direttamente alla schermata d'acquisto (Wave Pass Notte €15 / Crew ×4 €52) */
function buyFromPopup(){
  popupEl.classList.add('leaving');
  setTimeout(()=>{hidePopup();S.homeFilter='mw';jump('home','buy')},300);
}
/* Chiudi: resta nella Home standard; Metrowave si ritrova nella pill e nella Ricerca */
function dismissPopup(){
  popupEl.classList.add('leaving');
  setTimeout(()=>{hidePopup();S.homeFilter='tutti';jump('home');toast('Trovi Metrowave nella Home')},300);
}
function exitFest(){S.festival=false;phone.classList.remove('fest');S.homeFilter='tutti';jump('home');toast('Metrowave Mode disattivata')}
function enterFestQuick(){S.festival=true;phone.classList.add('fest');hidePopup()}

/* =====================================================================
   F5 · CHECK-IN · F7 · PUNTI
   ===================================================================== */
function addVisit(n){
  if(S.visited.has(n))return [];
  S.visited.add(n);S.here=n;
  const g=[['Check-in '+ST(n).name,100]], q=S.quiz;
  if(q&&q.challenge===n)g.push(['Bonus sfida ×2',100]);
  else if(q&&q.aff[n]<30){g.push(['Esploratore · genere inaspettato',150]);S.explorer.add(n)}
  for(let k=n-2;k<=n;k++){if(k>=1&&k+2<=20&&!S.combos.has(k)&&[k,k+1,k+2].every(x=>S.visited.has(x))){S.combos.add(k);g.push(['Combo 3 stazioni',100])}}
  S.points+=g.reduce((a,x)=>a+x[1],0);
  return g;
}
function seedVisits(list){list.forEach(addVisit)}
function totem(st){return `<div class="totem paper" style="box-shadow:inset 0 0 0 4px ${symColor(st)}"><div class="tk">METROWAVE · STAZIONE ${pad(st.n)}</div><div class="qrb">${qr('ST'+st.n)}</div><div class="tn"><span class="tsy">${sym(st.n,'100%')}</span>${st.name}</div></div>`}
function simScan(n,geo){
  if(S.visited.has(n)){toast(`Hai già il timbro di ${ST(n).name}`);return}
  if(!S.ticket){toast('Collega il tuo Wave Pass per fare check-in');replaceTop('activate');return}
  const st=ST(n),vf=document.getElementById('vf');
  document.getElementById('totem').innerHTML=geo?`<div class="totem" style="background:#111;color:#fff;justify-content:center;gap:10px">${ic('pin',{size:64})}<div class="tn">${st.name}</div></div>`:totem(st);
  vf.classList.add('found');
  document.getElementById('hint').innerHTML=`${geo?'Posizione verificata':'QR rilevato'} · ${st.name}<span>Timbro in corso…</span>`;
  setTimeout(()=>{const g=addVisit(n);replaceTop('checked',{n,gained:g})},900);
}
function seeOnMap(n){S.lit=n;const tot=(cur().gained||[]).reduce((a,x)=>a+x[1],0);replaceTop('map');setTimeout(()=>showPoints(`+${tot}${S.quiz&&S.quiz.challenge===n?' · SFIDA!':''}`),500)}
function showPoints(t){const el=document.getElementById('ptoast');el.textContent=t;el.classList.remove('on');void el.offsetWidth;el.classList.add('on')}
function redeem(i){S.redeemed.add(i);toast('Gadget ritirato ✓');back()}

/* =====================================================================
   F6 · VAGONI-PALCO
   ===================================================================== */
function nextStop(t){return t.dir>0?Math.min(20,Math.floor(t.p+1e-6)+1):Math.max(1,Math.ceil(t.p-1e-6)-1)}
function positionTrains(){
  const rows=[...document.querySelectorAll('.mrow')];if(!rows.length)return;
  const cy=rows.map(r=>r.offsetTop+r.offsetHeight/2);
  TRAINS.forEach(t=>{const el=document.getElementById('tr-'+t.id);if(!el)return;
    const i=Math.min(19,Math.floor(t.p)-1),f=t.p-Math.floor(t.p);
    const y=i>=19?cy[19]:cy[i]+(cy[i+1]-cy[i])*f;el.style.top=(y-12)+'px'});
}
setInterval(()=>{
  TRAINS.forEach(t=>{t.p+=t.dir*0.025;if(t.p>=20){t.p=20;t.dir=-1}if(t.p<=1){t.p=1;t.dir=1}});
  if(cur().s==='map')positionTrains();
},1000);
function openTrain(id){
  const t=TRAINS.find(x=>x.id===id),s=ST(t.st),nx=nextStop(t),mins=Math.max(1,Math.round(Math.abs(nx-t.p)*2.5));
  openSheet(`<div class="sh-head" style="background:${s.fill};color:${s.text}">
      <span class="stc paper" style="width:84px;height:84px;display:grid;place-items:center;padding:12px">${sym(s.n,'100%')}</span>
      <div><div class="k">${t.name.toUpperCase()} · LIVE A BORDO</div><h4>${s.genre.split(' /')[0]}</h4><span class="gtag" style="background:#000;color:#fff">${t.dj}</span></div></div>
    <div class="sh-body">
      <div class="sh-now"><span class="badge live sm"><i class="dot"></i>IN CORSA</span> Direzione <b>${t.dir>0?'Centro Direzionale':'Piscinola'}</b></div>
      <div class="preview" onclick="this.classList.toggle('on')"><span class="pb">${ic('clock',{size:18})}</span><div class="pt2"><b style="color:#fff;font-size:15px">A ${ST(nx).name} tra ${mins} min</b><div class="bar"><i></i></div></div></div>
      <div class="sh-actions"><button class="btn-white" onclick="remindTrain(${id})">${ic('bolt',{size:16})} Avvisami</button><button class="btn-ghost" onclick="go('scan',{mode:'train'})">${ic('qr',{size:16})} Sono a bordo</button></div>
    </div>`);
}
function remindTrain(id){
  const t=TRAINS.find(x=>x.id===id),s=ST(t.st);closeSheet();toast('Ti avvisiamo 2 minuti prima');
  setTimeout(()=>showPush(`${t.name} · ${s.genre.split(' /')[0]}`,`Arriva a ${ST(nextStop(t)).name} tra 2 min. Binario direzione ${t.dir>0?'Centro Direzionale':'Piscinola'}.`,()=>openTrain(id)),3500);
}
function simTrain(id){
  if(!S.ticket){toast('Collega il tuo Wave Pass per salire a bordo');replaceTop('activate');return}
  const t=TRAINS.find(x=>x.id===id),s=ST(t.st),vf=document.getElementById('vf');
  document.getElementById('totem').innerHTML=`<div class="totem" style="background:${s.fill};color:${s.text}"><div class="tk">${t.name.toUpperCase()}</div><div class="qrb">${qr('TR'+id)}</div><div class="tn">A bordo</div></div>`;
  vf.classList.add('found');document.getElementById('hint').innerHTML=`${t.name} rilevato<span>Benvenuto a bordo</span>`;
  setTimeout(()=>{const first=!S.rides.has(id);if(first){S.rides.add(id);S.points+=50}
    S.onboard=id;S.track={title:`A bordo · ${t.name}`,artist:`${t.dj} · ${s.genre.split(' /')[0]}`,color:s.fill,live:true};S.playing=true;
    replaceTop('onboard',{t:id});if(first)setTimeout(()=>showPoints('+50 · A BORDO'),300)},900);
}
function getOff(){S.onboard=null;S.track=liveTrack(S.quiz?S.quiz.ref:15);toast('Sei sceso dal vagone-palco');back()}
let pushT;
function showPush(title,body,fn){
  const el=document.getElementById('push');
  el.innerHTML=`<span class="pi">${mwLogo(14)}</span><div style="flex:1;min-width:0"><b>${title}<small>ora</small></b><span>${body}</span></div>`;
  el.onclick=()=>{el.classList.remove('on');fn&&fn()};
  el.classList.add('on');clearTimeout(pushT);pushT=setTimeout(()=>el.classList.remove('on'),5000);
}
