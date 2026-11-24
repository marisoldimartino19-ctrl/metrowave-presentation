/* =====================================================================
   SIMBOLI DELLE 20 STAZIONI (SVG 100×100, dalla reference "METRO WAVE simboli")
   Sempre su carta #F4F1E8, nel colore della stazione.
   ===================================================================== */
const PAPER='#F4F1E8';
const symColor=st=>st.n===13?'#111111':st.n===18?'#1ED760':st.fill;
const polar=(r,deg)=>[50+r*Math.cos(deg*Math.PI/180),50+r*Math.sin(deg*Math.PI/180)];
const PT=p=>p.map(v=>v.toFixed(1)).join(' ');
const DIA=(x,y,r,f)=>`<polygon points="${x},${y-r} ${x+r},${y} ${x},${y+r} ${x-r},${y}" fill="${f}"/>`;
const SYM={
 1:(c,bg)=>`<circle cx="50" cy="50" r="47" fill="${c}"/>`+[42,37.5,33,28.5,24,19.5].map(r=>`<circle cx="50" cy="50" r="${r}" fill="none" stroke="${bg}" stroke-width="1.6"/>`).join(''),
 2:c=>{let s='';for(let i=0;i<15;i++){const y=12+i*5.4,side=y<50.9?-1:1,A=Math.max(0,16-Math.abs(y-50.9)*.42)*side;let d='';
    for(let x=2;x<=98;x+=4)d+=(x===2?'M':'L')+x+' '+(y+A*Math.exp(-(((x-50)/20)**2))).toFixed(1)+' ';
    s+=`<path d="${d}" fill="none" stroke="${c}" stroke-width="2.6"/>`}return s},
 3:c=>[...Array(15)].map((_,i)=>{const h=Math.max(14,84*(1-Math.abs(i-7)/8));return `<rect x="${(8+i*5.9).toFixed(1)}" y="${(50-h/2).toFixed(1)}" width="3.6" height="${h.toFixed(1)}" fill="${c}"/>`}).join(''),
 4:c=>[0,1,2,3,4,5,6,7].map(k=>`<ellipse cx="50" cy="50" rx="${48-k*4.6}" ry="${30-k*2.9}" fill="${c}" opacity=".17"/>`).join(''),
 5:c=>{const L=(a,b,x,y)=>`<line x1="${a}" y1="${b}" x2="${x}" y2="${y}"/>`;let s='';const f=12,ox=8,oy=34,dx=24,dy=-22;
    for(let i=0;i<=5;i++){const t=i/5;
      s+=L(ox+f*i,oy,ox+f*i,oy+60)+L(ox,oy+f*i,ox+60,oy+f*i);
      s+=L(ox+f*i,oy,ox+f*i+dx,oy+dy)+L(ox+dx*t,oy+dy*t,ox+60+dx*t,oy+dy*t);
      s+=L(ox+60+dx*t,oy+dy*t,ox+60+dx*t,oy+60+dy*t)+L(ox+60,oy+f*i,ox+60+dx,oy+f*i+dy);}
    return `<g stroke="${c}" stroke-width="1.5" stroke-linecap="square">${s}</g>`},
 6:(c,bg)=>{const d='M34 20A14 14 0 1 0 20 34H80A14 14 0 1 0 66 20V80A14 14 0 1 0 80 66H20A14 14 0 1 0 34 80Z';
    return `<g transform="translate(50 50) scale(.84) translate(-50 -50)">`+[[17,c],[13.4,bg],[11,c],[7.4,bg],[5,c],[1.4,bg]].map(([w,col])=>`<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linejoin="round"/>`).join('')+'</g>'},
 7:c=>[0,1,2,3,4,5].map(i=>{const x=6+i*12.5;return `<polygon points="${x},18 ${x+9},18 ${x+30},50 ${x+9},82 ${x},82 ${x+21},50" fill="${c}"/>`}).join(''),
 8:(c,bg)=>{const p=[];for(let i=0;i<32;i++){const r=i%2?17:(i/2)%2?38:48;p.push(PT(polar(r,i*11.25-90)))}
    return `<polygon points="${p.join(' ')}" fill="${c}"/>`+[...Array(16)].map((_,i)=>`<line x1="50" y1="50" x2="${PT(polar(i%2?36:46,i*22.5-90)).replace(' ','" y2="')}" stroke="${bg}" stroke-width=".9"/>`).join('')},
 9:c=>`<path d="M8 62C8 52 18 52 18 62V70C18 78 26 78 26 70V40C26 32 34 32 34 40V78C34 86 42 86 42 78V18C42 10 50 10 50 18V70C50 78 58 78 58 70V30C58 22 66 22 66 30V80C66 88 74 88 74 80V48C74 40 82 40 82 48V60C82 68 92 68 92 60" fill="none" stroke="${c}" stroke-width="6.5" stroke-linecap="round"/><circle cx="8" cy="64" r="5" fill="${c}"/><circle cx="92" cy="58" r="5" fill="${c}"/>`,
 10:c=>`<polygon points="6,52 14,40 18,50 26,28 30,46 40,12 38,44 48,30 50,52 58,34 62,58 70,38 72,56 80,40 94,38 82,62 76,52 70,74 64,60 58,84 52,62 46,94 42,64 34,78 32,60 24,72 20,56 12,66 10,56" fill="${c}"/>`,
 11:c=>{let seed=11;const R=()=>(seed=(seed*16807)%2147483647)/2147483647;let s='';
    for(let i=0;i<150;i++){const x=50+(R()+R()+R()-1.5)*40,y=50+(R()+R()+R()-1.5)*34,z=[1.6,2.4,3.4,5][Math.floor(R()*4)];
      s+=`<rect x="${(x-z/2).toFixed(1)}" y="${(y-z/2).toFixed(1)}" width="${z}" height="${z}" fill="${c}" opacity="${(.55+R()*.45).toFixed(2)}"/>`}return s},
 12:c=>{let s=DIA(50,50,8,c);
    [[0,-1],[1,0],[0,1],[-1,0]].forEach(([dx,dy])=>{s+=DIA(50+dx*18,50+dy*18,4,c)+DIA(50+dx*31,50+dy*31,7.5,c)+DIA(50+dx*44,50+dy*44,4,c)});
    [[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([dx,dy])=>{s+=`<rect x="${50+dx*13-3}" y="${50+dy*13-3}" width="6" height="6" fill="${c}"/><rect x="${50+dx*24-2.5}" y="${50+dy*24-2.5}" width="5" height="5" fill="${c}"/>`+DIA(50+dx*33,50+dy*33,3.5,c)});return s},
 13:c=>{let s='',x=10,w=3.4;while(x<90&&w>.35){s+=`<rect x="${x.toFixed(2)}" y="12" width="${w.toFixed(2)}" height="76" fill="${c}"/>`;x+=w+1.4;w*=.93}return s},
 14:(c,bg)=>`<path d="M50 6C56 30 92 46 92 66C92 84 72 94 50 94C28 94 8 84 8 66C8 46 44 30 50 6Z" fill="${c}"/>`+[-30,-20,-10,0,10,20,30].map(k=>`<path d="M50 12C${50+k*1.3} 40 ${50+k*1.4} 80 50 93" fill="none" stroke="${bg}" stroke-width="1.2"/>`).join(''),
 15:c=>[28,41,54,67].map(y=>`<path d="M4 ${y}C18 ${y-12} 30 ${y-12} 42 ${y}S70 ${y+12} 96 ${y-4}" fill="none" stroke="${c}" stroke-width="5.5"/>`).join(''),
 16:c=>[...Array(12)].map((_,i)=>{const a=i*30;return `<path d="M${PT(polar(7,a))}Q${PT(polar(30,a+6))} ${PT(polar(48,a+38))}L${PT(polar(48,a+56))}Q${PT(polar(28,a+28))} ${PT(polar(7,a+17))}Z" fill="${c}"/>`}).join(''),
 17:c=>{const p='4,80 10,70 16,73 22,50 28,66 34,58 40,86 48,44 54,62 60,50 66,72 72,38 78,58 84,50 90,58 96,26';
    return `<polyline points="${p}" fill="none" stroke="#1ED760" stroke-width="8" transform="translate(2 4)"/><polyline points="${p}" fill="none" stroke="${c}" stroke-width="7"/>`},
 18:c=>[0,1,2,3,4,5].map(k=>{const l=14+k*5,r=86-k*5,ap=8+k*7;return `<path d="M${l} 96V52Q${l} 26 50 ${ap}Q${r} 26 ${r} 52V96" fill="none" stroke="${c}" stroke-width="1.6"/>`}).join(''),
 19:(c,bg)=>DIA(50,50,46,c)+DIA(30,50,11,bg)+DIA(30,50,7,c)+DIA(30,50,3,bg)+DIA(70,50,11,bg)+DIA(70,50,7,c)+DIA(70,50,3,bg)+`<polygon points="40,16 50,26 60,16 60,23 50,33 40,23" fill="${bg}"/>`+DIA(50,74,8,bg)+DIA(50,74,4,c)+`<rect x="47" y="42" width="6" height="16" fill="${bg}"/>`,
 20:c=>[...Array(15)].map((_,k)=>{const i=k*3.2;return `<rect x="${4+i}" y="${4+i}" width="${92-2*i}" height="${92-2*i}" style="fill:color-mix(in srgb, ${c} ${Math.max(0,100-k*7)}%, #000)" stroke="rgba(0,0,0,.35)" stroke-width=".6"/>`}).join(''),
};
/* simboli ufficiali (file PNG trasparenti in assets/symbols/NN.png); le stazioni senza file usano ancora il disegno SVG */
const SYM_FILES=new Set([1,2,3,4,5,6,7,8,10,11,12,13,14,16,18,19]);
function sym(n,size){const st=ST(n);
  const inner=SYM_FILES.has(n)?`<image href="assets/symbols/${String(n).padStart(2,'0')}.png?v=3" x="0" y="0" width="100" height="100" preserveAspectRatio="xMidYMid meet"/>`:SYM[n](symColor(st),PAPER,st);
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" aria-hidden="true">${inner}</svg>`}
/* copertina quadrata: carta + simbolo (grande: anche nome e genere, come la card di reference) */
function stCover(st,sz){
  const big=sz>=120;
  return `<div class="stc paper ${big?'':'sm'}" style="width:${sz}px;height:${sz}px">
    ${big?`<div class="stc-t" style="font-size:${(sz*.085).toFixed(1)}px">${st.name}</div><div class="stc-g" style="font-size:${(sz*.05).toFixed(1)}px">${st.genre}</div>`:''}
    <div class="stc-s">${sym(st.n,'100%')}</div></div>`;
}
/* card stazione in stile reference: carta, filetto interno arrotondato, nome bold, genere, simbolo */
function stCard(st,w){return `<div class="scd" style="width:${w}px"><div class="scd-in"><div class="scd-t">${st.name}</div><div class="scd-g">${st.genre}</div><div class="scd-a">${sym(st.n,'100%')}</div></div></div>`}
function mwCover(sz){
  /* copertina playlist/evento: verde, logo nero; sopra i 70px anche il nome */
  return `<div class="stc grain acid mwcv" style="width:${sz}px;height:${sz}px">${mwLogo(Math.round(sz*(sz<70?.36:.26)))}
    ${sz<70?'':`<span class="stname" style="font-size:${(sz*.17).toFixed(1)}px">Metro<br>wave</span>`}</div>`;
}
function gcover(a,b,title,sz,icon){
  return `<div class="gcv grain" style="width:${sz}px;height:${sz}px;background:linear-gradient(135deg,${a},${b});${icon?'align-items:center;justify-content:center;':''}">${icon?ic(icon,{fill:true,size:sz*.4}):`<span style="font-size:${sz*.13}px;position:relative">${title}</span>`}</div>`;
}
function avatar(name,c,sz){
  const ini=name.split(/[\s.\-_'+]+/).filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase();
  return `<div class="av" style="width:${sz}px;height:${sz}px;background:radial-gradient(circle at 30% 25%, ${c}, ${dk(c,45)});font-size:${sz*.36}px">${ini}</div>`;
}
function item(cv,t,s,on,circle){return `<button class="item ${circle?'circle':''}" onclick="${on}">${cv}<div class="t">${t}</div><div class="s">${s}</div></button>`}
function scard(st){
  return `<button class="scard ${st.dark?'dk':''}" style="background:${st.fill};color:${st.text}" onclick="go('station',{n:${st.n}})">
    <span class="scn">${pad(st.n)}</span><b>${st.name}</b><span class="scg">${st.genre}</span>
    <div class="tilt">${stCover(st,74)}</div></button>`;
}
function famPills(key){
  return `<div class="pills">${Object.entries(FAM).map(([k,l])=>`<button class="pill ${S[key]===k?'active':''}" onclick="setFam('${key}','${k}')">${l}</button>`).join('')}</div>`;
}
function topbar(title,solid){
  return `<div class="topbar ${solid?'solid':''}"><button class="back" onclick="back()" aria-label="Indietro">${ic('back',{sw:2.5})}</button><div class="tt">${title}</div><span style="width:36px"></span></div>`;
}
function cdText(){
  const d=Math.max(0,EVENT-Date.now());
  return `${Math.floor(d/864e5)}G ${pad(Math.floor(d/36e5)%24)}H ${pad(Math.floor(d/6e4)%60)}M ${pad(Math.floor(d/1e3)%60)}S`;
}
function cdBoxes(){
  const d=Math.max(0,EVENT-Date.now()),v=[[Math.floor(d/864e5),'giorni'],[Math.floor(d/36e5)%24,'ore'],[Math.floor(d/6e4)%60,'min'],[Math.floor(d/1e3)%60,'sec']];
  return v.map(([n,l],i)=>`<div><b>${i?pad(n):n}</b><span>${l}</span></div>`).join('');
}
function level(p){let l=LEVELS[0];LEVELS.forEach(x=>{if(p>=x.p)l=x});return l}
function nextLevel(p){return LEVELS.find(x=>x.p>p)}
/* CTA principale in base allo stato utente */
function mainCta(cls='btn-green'){
  if(!S.ticket) return `<button class="${cls}" ${stop("go('activate')")}>${ic('ticket',{size:18})} ${S.phase==='live'?'Collega il pass':'Attiva il biglietto'}</button>`;
  return `<button class="${cls}" ${stop("go('wave')")}>${ic('check',{sw:3,size:18})} Il tuo Wave Pass</button>`;
}
