/* =====================================================================
   DATA · 20 STAZIONI
   fill = colore genere · accent = abbinamento palette finale (grafiche, titoli
   dove il contrasto regge) · text = colore testo leggibile (WCAG) · disp = titoli grandi
   ===================================================================== */
const FAM={all:'Tutti',urban:'Urban & Soul',elettronica:'Elettronica',poprock:'Pop & Rock',radici:'Radici & World',colta:'Jazz & Classica'};
const B='#000000',W='#FFFFFF',G='#1ED760';
// [nome, genere, famiglia, fill, accent, text, disp, dark, interscambio, energia, artisti]
const RAW=[
 ['Piscinola','Hip Hop / Rap','urban','#C62828',B,W,B,0,'Metrocampania NordEst',70,['Scampia Kid','Vela Rossa','MC Capolinea']],
 ['Chiaiano','Reggae','urban','#238B45',W,B,W,0,'',40,['Selva Roots','Chiaiano Sound System','Dub Collina']],
 ['Frullone','Drum and Bass','elettronica','#00C2D9',B,B,B,0,'',95,['Frullo Bass','Breakline','Sub Lava']],
 ['Colli Aminei','Indie Pop','poprock','#B58BD9',W,B,B,0,'',50,['Colline Sospese','Le Aminee','Tenue']],
 ['Policlinico','House','elettronica','#A3E000',B,B,B,0,'',80,['Reparto House','Corsia 9','Deep Collina']],
 ['Rione Alto','R&B','urban','#7A1F3D',W,W,W,1,'',45,['Altitudine','Velluto','Mira Soul']],
 ['Montedonzelli','Funk','urban','#F07C21',B,B,B,0,'',65,['Donzelle Groove','Basso Continuo','Funk Collinare']],
 ["Medaglie d'Oro",'Pop','poprock','#FF5AA5',W,B,B,0,'',60,['Oro 1986','Medaglia','Neon Vomero']],
 ['Vanvitelli','Jazz','colta','#4F46FF',W,W,W,0,'Funicolari',35,['Vanvi Trio','Scala Minore','Ottone Blu']],
 ['Quattro Giornate','Rock','poprock','#242424',W,W,W,1,'',80,['Le Giornate','Barricata','Cemento Armato']],
 ['Salvator Rosa','Alternative / Experimental','poprock','#70757D',G,W,W,0,'',55,['Rosa Rumore','Tufo Elettrico','Ombra Grigia']],
 ['Materdei','Folk','radici','#71843F',W,B,W,0,'',35,['Mater Folk','Tammurriata Nova','Vicolo Antico']],
 ['Museo','Musica Classica','colta','#E8E7C4',B,B,B,0,'Linea 2 · Cavour',15,['Archeo Ensemble','Statua Liquida','Quartetto Mosaico']],
 ['Dante','Cantautorato','radici','#8C5946',W,W,W,0,'',25,['Terzine',"Port'Alba",'Inferno Gentile']],
 ['Toledo','Musica Napoletana / Neomelodico','radici','#2474B5',W,W,W,0,'',55,['Core Sotterraneo','Partenope 303','Marea Profonda']],
 ['Municipio','Latin','radici','#FFD600',B,B,B,0,'Porto · Molo Beverello',75,['Molo Latino','Castel Salsa','Sirena Cumbia']],
 ['Università','Hyperpop / Future Pop','elettronica','#FF00A8',G,B,B,0,'',90,['Matricola.exe','Lode++','Aula Glitch']],
 ['Duomo','Corale / Gospel','urban','#FAFAFA',G,B,B,0,'',30,['Voci di Tufo','Ampolla Choir','Coro Sotterraneo']],
 ['Garibaldi','World Music','radici','#440C0C',W,W,W,1,'FS · Linea 2 · Circumvesuviana',50,['Ferrovia Afro','Binario Mondo','Kora Napoli']],
 ['Centro Direzionale','Techno / Electronic','elettronica','#8A2BE2',B,W,B,0,'',95,['Torri di Vetro','Abisso Blu','Skyline 140']],
];
const STATIONS=RAW.map((r,i)=>({n:i+1,name:r[0],genre:r[1],fam:r[2],fill:r[3],accent:r[4],text:r[5],disp:r[6],dark:!!r[7],x:r[8],energy:r[9],artists:r[10]}));
const ST=n=>STATIONS[n-1];
const SETS=['22:00','23:40','01:20','03:00'], ROLES=['Opening','Prime time','Closing'], CUR=1;
const POOL=['Ultima Corsa','Binario Zero','Notte Partenopea','Scale Mobili','Lava Lenta','Mare Sotto','Fermata Richiesta','Tufo Giallo','Neon Vico','Corsa delle Tre','Onda Lunga','Respira Napoli','Tornello','Vagone 4','Luce di Servizio','Capolinea','Sotto il Vomero','Sirena','Interscambio','Galleria','Porta Chiusa','Cento Gradini','Vapore','Ritorno'];
const tracks=st=>[0,1,2,3,4].map(i=>({t:POOL[(st.n*5+i*3)%POOL.length],a:st.artists[i%3]}));
const EVENT=new Date('2027-06-27T22:00:00+02:00');
const DEFAULT_TRACK={title:'NON SEI PIÙ TU (feat. Lazza)',artist:'Geolier, Lazza',color:'#1B3A4F',cover:['#0B2A3F','#4A90B8']};
const WAVE_POINTS=[[19,'Garibaldi','atrio FS'],[15,'Toledo','mezzanino'],[13,'Museo','uscita Cavour']];

/* quiz */
const QUIZ_DECK=[15,20,1,9,18];
const HISTORY=[
 {k:'rap',l:'Rap italiano',src:'Geolier, Lazza',w:{1:35,15:25}},
 {k:'th',l:'Tech House',src:'TECH HOUSE 2026',w:{5:35,20:20}},
 {k:'brit',l:'Britpop',src:'Oasis',w:{10:30,4:15}},
 {k:'pop',l:'Pop italiano',src:'Olly',w:{8:30,17:10}},
 {k:'cant',l:'Cantautorato',src:'Jovanotti · Classici Italiani',w:{14:25,12:10}},
];
const AMB=[
 {k:'club',l:'Club buio',g:[3,5,17,20,10,11],bg:'radial-gradient(circle at 70% 20%,#8A2BE2,transparent 60%),radial-gradient(circle at 20% 80%,#00C2D9,transparent 55%),#050505'},
 {k:'piazza',l:'Piazza piena',g:[15,16,8,2,7,1],bg:'radial-gradient(circle at 30% 20%,#FFD600,transparent 60%),radial-gradient(circle at 80% 90%,#C62828,transparent 60%),#3a1200'},
 {k:'teatro',l:'Teatro',g:[13,9,14,18],bg:'radial-gradient(circle at 50% 10%,#E8E7C4,transparent 55%),radial-gradient(circle at 50% 100%,#7A1F3D,transparent 60%),#1a0a0a'},
 {k:'spiaggia',l:'Spiaggia al tramonto',g:[2,19,12,4,6],bg:'linear-gradient(180deg,#F07C21 0%,#FF5AA5 45%,#2474B5 100%)'},
];
const COMP=[{k:'solo',l:'Da solo/a',d:'Mi perdo tra le stazioni',i:'user'},{k:'amici',l:'Con gli amici',d:'Crew compatta, percorso condiviso',i:'users'},{k:'coppia',l:'In coppia',d:'Due pass, una rotta',i:'heart'}];
const CZ=['','Restiamo sul sicuro','Un pizzico di novità','Mi lascio sorprendere','Portami lontano','Stupiscimi davvero'];

/* gamification */
const LEVELS=[{p:0,n:'In partenza'},{p:300,n:'Primo Binario'},{p:700,n:'Night Rider'},{p:1200,n:'Line Master'},{p:2000,n:'Capolinea'}];
const GADGETS=[
 {p:300,t:'Spilla smaltata della tua stazione',d:'Nel colore della tua fermata',dig:'Badge stazione',i:'medal'},
 {p:700,t:'Tote bag Metrowave',d:'Serigrafia della Linea 1',dig:'Live esclusivo',i:'bag'},
 {p:1200,t:'Poster serigrafato Linea 1',d:'Tiratura numerata 50×70',dig:'Set completi in HQ',i:'map'},
 {p:1500,t:'Cuffie Metrowave',d:'Edizione limitata · 50 pezzi',dig:'',i:'phones',soldout:true},
 {p:2000,t:'Flexi-disc “Live from Linea 1”',d:'I set migliori della notte',dig:'Badge oro Capolinea',i:'disc'},
];
const TRAINS=[
 {id:1,name:'Vagone-palco 1',st:7,dj:'Basso Continuo',p:3.3,dir:1},
 {id:2,name:'Vagone-palco 2',st:16,dj:'Sirena Cumbia',p:11.6,dir:-1},
 {id:3,name:'Vagone-palco 3',st:20,dj:'Skyline 140',p:16.4,dir:1},
 {id:4,name:'Vagone-palco 4',st:2,dj:'Dub Collina',p:8.7,dir:-1},
];

/* =====================================================================
   STATE
   ===================================================================== */
const S={tab:'home',stacks:{home:[{s:'home'}],search:[{s:'search'}],library:[{s:'library'}]},
  homeFilter:'tutti',phase:'pre',ticket:false,pass:null,passSel:'notte',quiz:null,qa:null,mapUnlocked:false,mapSeen:false,
  mapFam:'all',hubFam:'all',trainLayer:true,festival:false,
  saved:new Set(),visited:new Set(),here:null,lit:null,points:0,log:[],combos:new Set(),explorer:new Set(),rides:new Set(),redeemed:new Set(),onboard:null,
  playing:false,track:{...DEFAULT_TRACK},liked:false,q:''};
let TOPC='#121212',TOPT='#fff';

/* Il Wave Pass si compra (o si collega) in prevendita, ma l'accesso e la mappa interattiva
   si attivano SOLO dalla notte del festival: in prevendita il pass è "acquistato", non "attivo". */
const mapOpen=()=>S.ticket&&S.phase!=='pre';
const EVENT_LABEL='27 Giugno 2027';
