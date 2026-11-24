/* =====================================================================
   ICONS
   ===================================================================== */
const P={
 home:'<path d="M12 3 2.5 10.5V21h7v-6h5v6h7V10.5z"/>',
 search:'<circle cx="10.5" cy="10.5" r="7"/><path d="m16 16 5 5"/>',
 lib:'<path d="M4 3v18M9.5 3v18"/><path d="M14 3.6 20.6 20"/>',
 plus:'<path d="M12 4v16M4 12h16"/>',
 play:'<path d="M7 4.5v15L19.5 12z"/>',
 pause:'<path d="M6 4h4.2v16H6zM13.8 4H18v16h-4.2z"/>',
 plusc:'<circle cx="12" cy="12" r="9.5"/><path d="M12 7.5v9M7.5 12h9"/>',
 checkc:'<circle cx="12" cy="12" r="10" fill="currentColor" stroke="none"/><path d="m7.5 12.3 3 3 6-6" stroke="#000" stroke-width="2.2"/>',
 more:'<circle cx="5" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="19" cy="12" r="1.6" fill="currentColor"/>',
 camera:'<path d="M4 7h3l2-2.5h6L17 7h3a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.8"/>',
 back:'<path d="M15 4 7 12l8 8"/>',
 chev:'<path d="m9 5 7 7-7 7"/>',
 wave:'<path d="M2 12c1.7-3.2 3.3-3.2 5 0s3.3 3.2 5 0 3.3-3.2 5 0 3.3 3.2 5 0"/>',
 share:'<path d="M12 3v12M7.5 7.5 12 3l4.5 4.5M5 13v7h14v-7"/>',
 ticket:'<path d="M3 8V6a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a2.5 2.5 0 0 0 0 5v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5a2.5 2.5 0 0 0 0-5z"/><path d="M14 5v14" stroke-dasharray="2 2.5"/>',
 pin:'<path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>',
 check:'<path d="m5 12.5 4.5 4.5L19 7.5"/>',
 swap:'<path d="M4 8h15l-3.5-3.5M20 16H5l3.5 3.5"/>',
 map:'<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 train:'<rect x="5" y="3" width="14" height="14" rx="3"/><path d="M5 11h14M8.5 20 7 22M15.5 20l1.5 2"/><circle cx="9" cy="14" r=".8" fill="currentColor"/><circle cx="15" cy="14" r=".8" fill="currentColor"/>',
 shield:'<path d="M12 3 4.5 6v6c0 4.5 3.2 8 7.5 9 4.3-1 7.5-4.5 7.5-9V6z"/>',
 heart:'<path d="M12 20s-8-4.8-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 6.2-8 11-8 11z"/>',
 note:'<path d="M9 18V5l11-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>',
 route:'<circle cx="6" cy="19" r="2.2"/><circle cx="18" cy="5" r="2.2"/><path d="M8 19h7.5a3.5 3.5 0 0 0 0-7h-7a3.5 3.5 0 0 1 0-7H16"/>',
 wallet:'<rect x="3" y="6" width="18" height="14" rx="2"/><path d="M3 10h18M16 15h2"/>',
 qr:'<rect x="3" y="3" width="7" height="7" rx="1.2"/><rect x="14" y="3" width="7" height="7" rx="1.2"/><rect x="3" y="14" width="7" height="7" rx="1.2"/><path d="M14 14h3v3h-3zM20.5 14v.01M14 20.5h.01M17.5 20.5h3v-3"/>',
 lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
 medal:'<circle cx="12" cy="14.5" r="5.8"/><path d="M8.6 9.8 6 3h4l2 4.5L14 3h4l-2.6 6.8"/>',
 bolt:'<path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12z"/>',
 star:'<path d="m12 3 2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8l-5.4 2.9 1.1-6.1L3.2 9.4l6.1-.8z"/>',
 x:'<path d="M6 6l12 12M18 6 6 18"/>',
 bag:'<path d="M5 8h14l-1 13H6zM9 8V6a3 3 0 0 1 6 0v2"/>',
 disc:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.5"/>',
 phones:'<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4" height="7" rx="1.5"/><rect x="17" y="14" width="4" height="7" rx="1.5"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
 users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 13.5a6.5 6.5 0 0 1 3.5 6.5"/>',
 compass:'<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
 alert:'<path d="M12 3 2 20h20zM12 10v4M12 17v.01"/>',
 type:'<path d="M5 6h14M12 6v13"/>',
 link:'<path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1.2 1.2"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1.2-1.2"/>',
};
function ic(p,{fill=false,sw=2,size=24}={}){
  return fill?`<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor">${P[p]}</svg>`
   :`<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${P[p]}</svg>`;
}

/* LOGO METROWAVE (file ufficiali: assets/logo/metrowave-logo-black-green.svg / -white-green.svg)
   Inline con sfumatura: la parte "base" (bianca o nera) è decisa dal CSS tramite --mw-base
   in base alla leggibilità sullo sfondo (bianco su scuro, nero su verde/bianco).
   h = altezza in px; la larghezza segue la proporzione del segno (1412.46×802.35). */
const MW_LOGO_D='M0,621.9h169.36c11.42,0,22.33-4.7,30.18-13l254.08-268.6-60.14,364.49c-1.63,9.88,2.29,19.87,10.22,26l75.89,58.71c6.88,5.32,16.66,4.61,22.7-1.64l371.82-384.65-26.3,289.17c-8.34,91.68,101.66,145.98,168.25,82.42q1.33-1.27,2.65-2.59l370.64-393.11c6.56-6.96,12.17-14.79,16.26-23.43,9.39-19.82,9.08-38.25-.66-55.32l-20.26-36.47c-20.04-36.07-69.88-41.34-96.89-10.14q-.41.47-.82.94l-239.73,260.67,45.9-418.63c1.05-9.6-2.31-19.15-9.13-25.97L1017.14,3.86c-5.35-5.35-14.09-5.11-19.15.52l-392.16,436.76,48.91-344.18c1.52-10.71-2.82-21.41-11.37-28.02l-74.22-57.42c-7.21-5.57-17.5-4.64-23.58,2.15L0,621.9';
let MW_LOGO_N=0;
function mwLogo(h=16,cls='mwlogo'){
  const id='mwg'+(++MW_LOGO_N);
  return `<svg class="${cls}" height="${h}" width="${(h*1412.46/802.35).toFixed(1)}" viewBox="0 0 1412.46 802.35" role="img" aria-label="Metrowave"><defs><linearGradient id="${id}" x1="-163.79" y1="43.36" x2="1729.96" y2="800.86" gradientUnits="userSpaceOnUse"><stop offset=".56" style="stop-color:var(--mw-base,#fff)"/><stop offset=".64" stop-color="#5eb563"/><stop offset=".67" stop-color="#63b768"/><stop offset=".71" stop-color="#74bf78"/><stop offset=".75" stop-color="#8fcb92"/><stop offset=".79" stop-color="#b5ddb7"/><stop offset=".84" stop-color="#e5f3e6"/><stop offset=".86" stop-color="#fff"/></linearGradient></defs><path fill="url(#${id})" d="${MW_LOGO_D}"/></svg>`;
}
