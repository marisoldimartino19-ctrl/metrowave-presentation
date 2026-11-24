/* =====================================================================
   CORE · le "bolle" del manifesto
   Cerchi pieni di misure diverse che si sovrappongono al lettering: dove
   il testo passa sopra un cerchio cambia colore (nero/bianco ↔ verde).
   Non appartengono a una stazione: sono l'energia del festival che si
   propaga lungo la Linea 1. Ogni cerchio fluttua piano, ognuno col suo tempo.
   Coordinate in pixel (userSpaceOnUse): disegno e clip-path usano gli stessi
   cerchi con le stesse animazioni, quindi restano sempre allineati.
   Cerchio = [cx, cy, r, dx, dy, durata] · dx/dy = ampiezza della deriva.
   ===================================================================== */
const REDUCED=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* composizione della card poster della Home in Metrowave Mode (408×530) */
const CORE_HOME={w:408,h:530,circles:[
  [318, 98,82,  -8, 10, 11],
  [ 70,214,46,  10, -6,  9],
  [252,318,112,-10,  8, 13],
  [ 64,398,52,   8, -8, 10],
  [372,384,48,  -6,-10,  8],
]};

/* sx/sy = scala: 1 per il disegno in pixel, 1/w e 1/h per il clip-path in coordinate 0..1
   (objectBoundingBox: l'unico sistema che Chrome e Safari allineano in modo affidabile su elementi HTML) */
const f4=v=>+v.toFixed(4);
const drift=([, , ,dx,dy,dur],sx,sy)=>REDUCED?'':
  `<animateTransform attributeName="transform" type="translate" values="0 0;${f4(dx*sx)} ${f4(dy*sy)};0 0" keyTimes="0;.5;1" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1" dur="${dur}s" repeatCount="indefinite"/>`;
const circles=(list,sx,sy,fill)=>list.map(c=>`<ellipse cx="${f4(c[0]*sx)}" cy="${f4(c[1]*sy)}" rx="${f4(c[2]*sx)}" ry="${f4(c[2]*sy)}"${fill?` fill="${fill}"`:''}>${drift(c,sx,sy)}</ellipse>`).join('');

/* stile vinile: disco nero, solchi concentrici, riflesso fisso, etichetta verde col foro */
const LABEL=.34; /* raggio etichetta / raggio disco */
function vinyl(c,fill){
  const [x,y,r]=c, n=Math.max(4,Math.round(r/7)), g=[];
  for(let i=1;i<=n;i++){const rr=r*LABEL+(r*(.96-LABEL))*i/n; g.push(`<circle cx="${x}" cy="${y}" r="${f4(rr)}" fill="none" stroke="#fff" stroke-opacity="${i%3?.07:.13}" stroke-width=".7"/>`)}
  return `<g>${drift(c,1,1)}
    <circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>
    ${g.join('')}
    <circle cx="${x}" cy="${y}" r="${f4(r*.98)}" fill="url(#vSheen)"/>
    <circle cx="${x}" cy="${y}" r="${f4(r*LABEL)}" fill="var(--green)"/>
    <circle cx="${x}" cy="${y}" r="${f4(r*LABEL*.72)}" fill="none" stroke="#000" stroke-opacity=".25" stroke-width=".8"/>
    <circle cx="${x}" cy="${y}" r="${f4(Math.max(2.5,r*.05))}" fill="#000"/></g>`;
}
const SHEEN=`<defs><linearGradient id="vSheen" x1="0" y1="0" x2="1" y2="1">
  <stop offset=".18" stop-color="#fff" stop-opacity="0"/><stop offset=".34" stop-color="#fff" stop-opacity=".16"/><stop offset=".44" stop-color="#fff" stop-opacity="0"/>
  <stop offset=".6" stop-color="#fff" stop-opacity="0"/><stop offset=".7" stop-color="#fff" stop-opacity=".08"/><stop offset=".8" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>`;

/* disegno dei cerchi (vinili) */
function coreArt({w,h,circles:list},fill){
  return `<svg class="pz-art" viewBox="0 0 ${w} ${h}" aria-hidden="true">${SHEEN}${list.map(c=>vinyl(c,fill)).join('')}</svg>`;
}
/* stessa forma come clip-path: il testo sul disco nero si inverte (verde),
   sull'etichetta verde torna nero (evenodd: l'etichetta è un buco nel clip) */
const ring=(cx,cy,rx,ry)=>`M${f4(cx-rx)} ${f4(cy)}a${f4(rx)} ${f4(ry)} 0 1 0 ${f4(2*rx)} 0a${f4(rx)} ${f4(ry)} 0 1 0 ${f4(-2*rx)} 0Z`;
function coreClip(id,{w,h,circles:list}){
  const sx=1/w, sy=1/h;
  const paths=list.map(c=>{const [x,y,r]=c;
    return `<path clip-rule="evenodd" d="${ring(x*sx,y*sy,r*sx,r*sy)}${ring(x*sx,y*sy,r*LABEL*sx,r*LABEL*sy)}">${drift(c,sx,sy)}</path>`}).join('');
  return `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><clipPath id="${id}" clipPathUnits="objectBoundingBox">${paths}</clipPath></svg>`;
}

/* =====================================================================
   LOCANDINA HOME · forme nere fluide (al posto dei vinili) su verde.
   Il testo nero diventa verde dove passa sopra le forme
   (stessa forma usata come clip-path, in coordinate 0..1).
   ===================================================================== */
const FL_W=361, FL_H=530;
/* solo M, C, L e Z con coppie x y: così si possono riscalare facilmente */
const FLUID=[
  'M214 0L361 0L361 196C334 214 292 200 284 162C276 124 318 108 309 74C300 42 246 40 214 0Z',
  'M0 250C50 215 110 225 160 260C210 295 270 300 361 240L361 300C280 355 210 350 155 315C105 285 55 280 0 305Z',
  'M0 400C60 370 120 395 170 410C230 428 290 400 361 380L361 425C300 445 240 470 175 455C115 441 60 420 0 440Z'];
const flScale=(d,sx,sy)=>{let k=0;return d.replace(/-?\d+(\.\d+)?/g,m=>(+m*(k++%2?sy:sx)).toFixed(4))};
/* animazione: le onde scorrono lentamente (onda che viaggia lungo i punti di ogni forma).
   Fatta in JavaScript (requestAnimationFrame) perché Safari non anima bene SMIL dentro i clip-path.
   Stessa forma sul disegno e sul clip-path, così il testo invertito resta allineato.
   I punti sul bordo alto/basso restano fermi. Spenta con "riduci movimento". */
const FL_MOTION=!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
const FL_NUMS=FLUID.map(d=>d.match(/-?\d+(\.\d+)?/g).map(Number));
function flShape(i,t,sx,sy){
  const n=FL_NUMS[i];let k=0;const amp=[9,14,12][i],sp=[.55,.8,.65][i],ph=i*2.1;
  return FLUID[i].replace(/-?\d+(\.\d+)?/g,()=>{const j=k++;
    if(j%2===0)return (n[j]*sx).toFixed(4);
    const x=n[j-1],y=n[j];const yy=(y<=0||y>=FL_H)?y:y+amp*Math.sin(x/52-t*sp+ph);
    return (yy*sy).toFixed(4)});
}
function fluidArt(){
  return `<svg class="pz-art" viewBox="0 0 ${FL_W} ${FL_H}" preserveAspectRatio="none" aria-hidden="true">${FLUID.map((d,i)=>`<path data-fl="${i}" d="${flShape(i,0,1,1)}" fill="#000"/>`).join('')}</svg>`;
}
function fluidClip(id){
  return `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><clipPath id="${id}" clipPathUnits="objectBoundingBox">${FLUID.map((d,i)=>`<path data-fl="${i}" data-clip="1" d="${flShape(i,0,1/FL_W,1/FL_H)}"/>`).join('')}</clipPath></svg>`;
}
(function flLoop(){
  if(FL_MOTION){
    const els=document.querySelectorAll('path[data-fl]');
    if(els.length){const t=performance.now()/1000;
      els.forEach(el=>{const i=+el.dataset.fl,c=el.dataset.clip;el.setAttribute('d',c?flShape(i,t,1/FL_W,1/FL_H):flShape(i,t,1,1))})}
  }
  requestAnimationFrame(flLoop);
})();
