/* =====================================================================
   HELPERS
   ===================================================================== */
const pad=n=>String(n).padStart(2,'0');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const mix=(c,p=45)=>`color-mix(in srgb, ${c} ${p}%, #121212)`;
const dk=(c,p=55)=>`color-mix(in srgb, ${c} ${p}%, #000)`;
const stop=fn=>`onclick="event.stopPropagation();${fn}"`;
const svar=st=>`--c:${st.fill};--t:${st.text};`;
const onBtn=st=>`background:${st.text};color:${st.text===B?'#fff':'#000'}`;

/* linea con 20 punti: hl = stazioni evidenziate (nel loro colore se colored=true) */
function lineSvg(stroke='#fff',fill='#fff',hl=[],colored=false){
  let s=`<svg class="line" viewBox="0 0 400 18"><path d="M9 9H391" stroke="${stroke}" stroke-width="3.5" stroke-linecap="round"/>`;
  for(let i=0;i<20;i++){const x=9+i*(382/19),n=i+1,on=hl.includes(n);
    const c=on?(colored?ST(n).fill:'#fff'):fill;
    s+=`<circle cx="${x}" cy="9" r="${on?6.5:4.2}" fill="${c}" stroke="${on?'#121212':'none'}" stroke-width="2"/>`}
  return s+'</svg>';
}

/* linea del recap: la Linea 1 in verticale, come una mappa della metro.
   Stazioni visitate = cerchietto nel colore della stazione + nome; le altre = puntino nero */
function recapLine(hl){
  return `<div class="rc-line" aria-label="Le tue stazioni sulla Linea 1">${STATIONS.map(st=>{const on=hl.includes(st.n);
    return `<div class="rc-st ${on?'on':''}"><i style="${on?`background:${st.fill}`:''}"></i>${on?`<span>${st.name}</span>`:''}</div>`}).join('')}</div>`;
}

/* =====================================================================
   QR GENERATOR
   ===================================================================== */
function qr(code){
  let seed=[...code].reduce((a,c)=>a*31+c.charCodeAt(0)>>>0,7);
  const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
  const N=25,c=6;let r='';
  const finder=(x,y)=>x<7&&y<7||x>=N-7&&y<7||x<7&&y>=N-7;
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){
    let on;
    if(finder(x,y)){const fx=x<7?x:x-(N-7),fy=y<7?y:y-(N-7);on=fx===0||fx===6||fy===0||fy===6||(fx>=2&&fx<=4&&fy>=2&&fy<=4)}
    else if((x===7||y===7||x===N-8||y===N-8)&&(x<8||x>N-9)&&(y<8||y>N-9)) on=false;
    else on=rnd()>.52;
    if(on) r+=`<rect x="${x*c}" y="${y*c}" width="${c}" height="${c}"/>`;
  }
  return `<svg width="170" height="170" viewBox="-6 -6 ${N*c+12} ${N*c+12}" fill="#111" style="margin-top:6px">${r}</svg>`;
}
