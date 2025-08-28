---
title: "Profil Benedikt Schackenberg"
layout: default
permalink: /
description: "Interaktive Retro-Welt – Tiere, NPCs, Koch & Karma"
---

<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Retro-Wald – Profil Benedikt Schackenberg</title>
<link rel="icon" href="data:,">
<style>
  :root{
    --tile:32px;
    --hud:#0d0d0d; --hud-t:#fff;
    --shadow:0 12px 26px rgba(0,0,0,.18);
  }
  *{box-sizing:border-box}
  html,body{height:100%}
  body{margin:0;background:#567b6c;font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial;color:#111;overflow:hidden}

  /* ===== HUD ===== */
  .score-hud{position:fixed;left:10px;top:10px;z-index:1000;background:rgba(13,13,13,.96);color:#fff;border-radius:12px;box-shadow:var(--shadow);padding:10px 12px;min-width:290px}
  .score-hud h3{margin:.1rem 0 .35rem;font-size:15px}
  .score-hud table{width:100%;border-collapse:collapse;font-size:13px}
  .score-hud td{padding:2px 0}
  .score-hud .avatar{display:inline-block;width:18px;text-align:center;margin-right:6px}
  .hint{font-size:12px;opacity:.75;margin-top:6px}

  .contact-block{position:fixed;top:10px;right:10px;z-index:1100;background:rgba(13,13,13,.96);color:#fff;border-radius:12px;box-shadow:var(--shadow);padding:10px 12px;min-width:260px}
  .contact-block a{color:#fff;text-decoration:none;border-bottom:1px dotted #777}
  .contact-actions{display:flex;gap:8px;margin-top:6px}
  .mini{border:1px solid #2b2b2b;background:#111;color:#fff;border-radius:8px;padding:4px 8px;cursor:pointer;font-size:.85rem}
  .mini:hover{background:#171717}

  .topbar{position:fixed;left:50%;top:10px;transform:translateX(-50%);z-index:1000;display:flex;gap:8px}
  .btn{border:2px solid #2f2626;background:#fff;border-radius:10px;padding:4px 8px;cursor:pointer}
  .btn:active{transform:translateY(1px)}

  /* ===== Welt ===== */
  .world{position:fixed;inset:0;image-rendering:pixelated;overflow:hidden}
  .map{position:absolute;inset:0;display:grid;grid-template-columns:repeat(var(--cols), var(--tile));grid-auto-rows:var(--tile);pointer-events:none;z-index:1}

  .cell{width:var(--tile);height:var(--tile)}
  .bg-grass{background:#5f8460}
  .bg-path{background:
    linear-gradient(45deg,#b8b08a 25%,transparent 25%) 0 0/8px 8px,
    linear-gradient(-45deg,#b3aa83 25%,transparent 25%) 0 0/8px 8px,#9e946c}
  .bg-hedge{background:repeating-linear-gradient(45deg,#2c513e 0 6px,#2b4a39 6px 12px);box-shadow: inset 0 0 0 2px #203a2c}
  .bg-tree::before{content:"🌲";display:block;text-align:center;font-size:24px;margin-top:2px}
  .bg-forest::before{content:"🌳";display:block;text-align:center;font-size:22px;margin-top:4px}

  /* Zonen (Treffpunkte) */
  .zone{position:absolute;transform:translate(-50%,0);z-index:3;text-align:center;pointer-events:none}
  .zone .icon{font-size:24px;filter:drop-shadow(0 4px 8px rgba(0,0,0,.25))}
  .zone .label{margin-top:2px;background:#fff;border:2px solid #2f2626;border-radius:8px;display:inline-block;padding:0 6px;font:700 12px/20px ui-sans-serif}

  /* Häuser */
  .hut{position:absolute;width:96px;height:84px;transform:translate(-50%,0);z-index:4;filter:drop-shadow(0 8px 14px rgba(0,0,0,.24))}
  .hut .roof{position:absolute;left:50%;top:-2px;transform:translateX(-50%);width:100%;height:34px;clip-path:polygon(0 100%,50% 0,100% 100%);background:linear-gradient(#7b3b2d,#5b2a22)}
  .hut.c2 .roof{background:linear-gradient(#5e2f6d,#3f204c)}
  .hut.c3 .roof{background:linear-gradient(#32537b,#233a57)}
  .hut.c4 .roof{background:linear-gradient(#7b692d,#5a4c1c)}
  .hut.c5 .roof{background:linear-gradient(#2e7b4a,#1f5233)}
  .hut.c6 .roof{background:linear-gradient(#7b2e42,#541f2d)}
  .hut.c7 .roof{background:linear-gradient(#a04c1f,#703513)}
  .hut.c8 .roof{background:linear-gradient(#3b7b74,#28534e)}
  .hut.c9 .roof{background:linear-gradient(#7b2e6b,#4e1d44)}
  .hut.c10 .roof{background:linear-gradient(#7b3f15,#4f290d)}
  .hut .body{position:absolute;left:50%;bottom:0;transform:translateX(-50%);width:86px;height:52px;background:#ece3c8;border:3px solid #3b2f2f;border-radius:10px}
  .hut .door{position:absolute;left:50%;bottom:0;transform:translateX(-50%);width:20px;height:32px;background:#7b5b3e;border:3px solid #3b2f2f;border-radius:6px 6px 0 0}
  .hut .win{position:absolute;bottom:18px;width:20px;height:16px;background:#cfe9ff;border:3px solid #3b2f2f;border-radius:6px}
  .hut .win.l{left:14px}.hut .win.r{right:14px}

  /* Restaurant des Kochs */
  .restaurant{position:absolute;width:120px;height:94px;transform:translate(-50%,0);z-index:5;display:none}
  .restaurant .roof{position:absolute;left:50%;top:-4px;transform:translateX(-50%);width:110px;height:40px;clip-path:polygon(0 100%,50% 0,100% 100%);background:linear-gradient(#6b2b1e,#401910)}
  .restaurant .body{position:absolute;left:50%;bottom:0;transform:translateX(-50%);width:110px;height:60px;background:#efe4c9;border:3px solid #3b2f2f;border-radius:10px}
  .restaurant .door{position:absolute;left:50%;bottom:0;transform:translateX(-50%);width:24px;height:36px;background:#7b5b3e;border:3px solid #3b2f2f;border-radius:6px 6px 0 0}
  .chimney{position:absolute;left:18px;top:-8px;width:14px;height:18px;background:#5d4a3b;border:3px solid #3b2f2f;border-bottom:none;border-radius:4px 4px 0 0}
  .smoke{position:absolute;width:10px;height:10px;left:50%;top:-6px;background:radial-gradient(#fff,rgba(255,255,255,.2));border-radius:50%;animation:smoke 2s ease-out forwards;opacity:.8}
  @keyframes smoke{
    0%{transform:translate(-50%,0) scale(1);opacity:.8}
    100%{transform:translate(-50%,-28px) scale(1.8);opacity:0}
  }

  /* Höhlen / Schätze */
  .cave{position:absolute;transform:translate(-50%,0);font-size:26px;z-index:4}
  .cave .tag{position:absolute;left:50%;transform:translateX(-50%);bottom:28px;background:#fff;border:2px solid #2f2626;border-radius:8px;padding:0 6px;font:700 12px/20px ui-sans-serif}
  .treasure{position:absolute;transform:translate(-50%,0);font-size:24px;z-index:4;filter:drop-shadow(0 6px 10px rgba(0,0,0,.15))}

  /* Akteure */
  .actor{position:absolute;transform:translate(-50%,0);user-select:none;pointer-events:none;z-index:6}
  .animal{font-size:48px;line-height:1;filter:drop-shadow(0 6px 10px rgba(0,0,0,.15))}
  .animal.baby{font-size:36px}
  .nameplate{position:absolute;bottom:62px;left:50%;transform:translateX(-50%);font:600 12px ui-sans-serif;color:#20312a;background:#ffffffd9;border:2px solid #2f2626;border-radius:8px;padding:2px 6px;white-space:nowrap}
  .nameplate.baby{bottom:48px;font-size:11px}
  .mini-bubble{position:absolute;bottom:82px;left:50%;transform:translateX(-50%);background:#fff;border:2px solid #2f2626;border-radius:10px;padding:4px 6px;font:700 12px/1.22 ui-sans-serif;color:#222;max-width:220px;filter: drop-shadow(0 4px 10px rgba(0,0,0,.12));white-space:nowrap}

  .karma-pop{position:fixed;transform:translate(-50%,0);background:#111;color:#fff;border-radius:8px;padding:2px 6px;font:700 12px/18px ui-sans-serif;animation:pop .9s ease-out forwards;pointer-events:none;z-index:1200}
  @keyframes pop{0%{opacity:0;transform:translate(-50%,6px)}30%{opacity:1}100%{opacity:0;transform:translate(-50%,-24px)}}

  /* Wetter-Ebenen */
  #sky{position:absolute;inset:0;pointer-events:none;z-index:7;background:rgba(0,0,0,0)}
  #rain{position:absolute;inset:0;pointer-events:none;z-index:8}
  .drop{position:absolute;width:2px;height:16px;background:linear-gradient(#aee0ff,#5ab0e6);opacity:.8;filter:blur(.2px);animation:drop 1.2s linear infinite}
  @keyframes drop{to{transform:translateY(110vh)}}
  #lightning{position:absolute;inset:0;pointer-events:none;z-index:9}
  .flash{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%, rgba(255,255,255,.75), rgba(255,255,255,0) 60%);animation:flash .35s ease-out forwards}
  @keyframes flash{0%{opacity:0}10%{opacity:1}100%{opacity:0}}
  #fog{position:absolute;inset:0;pointer-events:none;z-index:10}
  .mist{position:absolute;left:-20vw;width:40vw;height:18vh;background:radial-gradient(ellipse at 50% 50%, rgba(220,230,230,.35), rgba(220,230,230,0) 60%);filter:blur(4px);animation:mist var(--dur,28s) linear infinite;opacity:.7}
  @keyframes mist{from{transform:translateX(0)}to{transform:translateX(160vw)}}
  #beams{position:absolute;inset:0;pointer-events:none;z-index:11}
  .beam{position:absolute;left:10vw;width:12vw;top:12vh;height:38vh;background:linear-gradient(180deg, rgba(255,255,220,.35), rgba(255,255,220,0));filter:blur(1.5px);transform:rotate(6deg);animation:beam 6s ease-in-out infinite}
  @keyframes beam{50%{transform:translateX(6vw) rotate(-4deg)}}

  /* Minimap */
  .minimap{position:fixed;right:16px;bottom:16px;z-index:1000;background:rgba(13,13,13,.96);color:#fff;border-radius:12px;box-shadow:var(--shadow);padding:6px 8px}
  .minirow{display:flex;align-items:center;gap:6px;margin:4px 0}
  .minirow .btn{padding:2px 6px}
  #minimap{display:block;border-radius:8px;background:#223431}
  .legend{display:flex;gap:10px;font-size:12px;opacity:.85}
  .legend i{display:inline-block;width:10px;height:10px;border-radius:2px;margin-right:4px;vertical-align:middle}
  .lg-cook{background:#ff4d4d}.lg-actor{background:#5cff9d}.lg-cave{background:#9ac1ff}.lg-hub{background:#ffa6e7}.lg-treasure{background:#ffd257}

  /* Kontaktkarte unten (optional) */
  .card{position:relative;margin:12px auto;width:min(100%,1000px);background:#fff;border:1px solid #e9edf3;border-radius:16px;padding:1.25rem;box-shadow:var(--shadow);line-height:1.6}

  /* Saison-Klassen (Hintergrundfeinheiten) */
  .spring .world{background:#5b8a77}
  .summer .world{background:#5f8460}
  .autumn .world{background:#6b7d64}
  .winter .world{background:#6a7a78}
</style>
</head>
<body>

<!-- Score / HUD -->
<div class="score-hud">
  <h3>🌟 Karma-Topliste</h3>
  <table id="scoreTable"><tr><td>…</td><td></td></tr></table>
  <div id="cookline" style="margin-top:6px;font-size:13px">👨‍🍳 –</div>
  <div class="hint">Hotkeys: <b>Z</b> (Minimap-Zoom), <b>P</b> (Pause), <b>WASD</b> (Koch steuern), <b>📸</b> Screenshot oben.</div>
</div>

<!-- Kontaktblock oben rechts -->
<div class="contact-block">
  <div>📧 <a href="mailto:benedikt@schackenberg.com">benedikt@schackenberg.com</a></div>
  <div>🔐 <a href="{{ '/assets/keys/benedikt-schackenberg.asc' | relative_url }}" download>PGP-Schlüssel (.asc)</a></div>
  <div class="contact-actions">
    <button class="mini" onclick="navigator.clipboard.writeText('benedikt@schackenberg.com')">E-Mail kopieren</button>
    <button class="mini" onclick="(function(){const t=document.getElementById('pgp-key'); if(t){navigator.clipboard.writeText(t.innerText)}})()">PGP kopieren</button>
  </div>
</div>

<!-- Topbar -->
<div class="topbar">
  <button id="soundBtn" class="btn" aria-pressed="false">🔇</button>
  <button id="shotBtn" class="btn">📸 Screenshot</button>
</div>

<!-- Welt -->
<div id="worldWrap" class="spring">
  <div id="world" class="world">
    <div id="map" class="map"></div>

    <!-- Koch-Restaurant -->
    <div id="restaurant" class="restaurant">
      <div class="roof"></div>
      <div class="body"><div class="door"></div></div>
      <div class="chimney" id="chimney"></div>
    </div>

    <!-- Wetter -->
    <div id="sky"></div>
    <div id="rain"></div>
    <div id="lightning"></div>
    <div id="fog"></div>
    <div id="beams"></div>
  </div>
</div>

<!-- Minimap -->
<div class="minimap">
  <div class="minirow">
    <button id="zoomOut" class="btn">−</button>
    <button id="zoomIn" class="btn">＋</button>
    <span id="zoomVal" style="font:700 12px ui-sans-serif">1.0×</span>
  </div>
  <canvas id="minimap" width="180" height="180"></canvas>
  <div class="legend" style="margin-top:6px">
    <span><i class="lg-cook"></i>Koch</span>
    <span><i class="lg-actor"></i>Tiere/NPC/Bürger</span>
    <span><i class="lg-cave"></i>Höhlen</span>
    <span><i class="lg-hub"></i>Treffpunkte</span>
    <span><i class="lg-treasure"></i>Schätze</span>
  </div>
</div>

<!-- Optionaler PGP-Block (für Kopieren) -->
<section class="card" style="display:none">
<pre id="pgp-key">-----BEGIN PGP PUBLIC KEY BLOCK-----
...dein Key...
-----END PGP PUBLIC KEY BLOCK-----</pre>
</section>

<!-- html2canvas (für Screenshot) -->
<script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js" integrity="sha256-cm4q6g1mCw0a5D6V+qJb7jQmJrKzq1J+GUX4T/gQK2g=" crossorigin="anonymous"></script>

<script>
document.addEventListener('DOMContentLoaded',()=>{try{
/* ============= Hilfsfunktionen ============= */
const T=32, rand=(a,b)=>Math.random()*(b-a)+a, randint=(a,b)=>Math.floor(rand(a,b+1));
const world=document.getElementById('world'), mapEl=document.getElementById('map');
let W=innerWidth, H=innerHeight, COLS=Math.floor(W/T), ROWS=Math.floor(H/T);
mapEl.style.setProperty('--cols', COLS); mapEl.style.setProperty('--tile', T+'px');

const miniBox=document.querySelector('.minimap');
const miniCanvas=document.getElementById('minimap'), mctx=miniCanvas.getContext('2d');
const zoomIn=document.getElementById('zoomIn'), zoomOut=document.getElementById('zoomOut'), zoomVal=document.getElementById('zoomVal');
let miniScale=1; function applyZoom(){ miniCanvas.style.width=(180*miniScale)+'px'; miniCanvas.style.height=(180*miniScale)+'px'; zoomVal.textContent=miniScale.toFixed(1)+'×'; } applyZoom();
zoomIn.onclick=()=>{ miniScale=Math.min(3, miniScale+0.25); applyZoom(); };
zoomOut.onclick=()=>{ miniScale=Math.max(0.75, miniScale-0.25); applyZoom(); };
document.addEventListener('keydown',e=>{ if(e.key.toLowerCase()==='z') zoomIn.click(); if(e.key.toLowerCase()==='p') paused=!paused; });

/* ============= Datenstrukturen ============= */
let GRID=[], SOLID=new Set();
let HUBS=[], HUTS=[], NPCS=[], CITIZENS=[], CAVES=[], TREASURES=[], ACTORS=[];
const scoreTable=document.getElementById('scoreTable'), cookline=document.getElementById('cookline');

/* ============= Audio ============= */
let audioCtx=null, soundOn=false;
const soundBtn=document.getElementById('soundBtn');
soundBtn.onclick=async()=>{ if(!audioCtx) audioCtx=new (window.AudioContext||window.webkitAudioContext)(); if(audioCtx.state==='suspended') await audioCtx.resume(); soundOn=!soundOn; soundBtn.textContent=soundOn?'🔊':'🔇'; soundBtn.setAttribute('aria-pressed', soundOn); };
function env(dur,amp){ if(!audioCtx||!soundOn) return null; const o=audioCtx.createOscillator(), g=audioCtx.createGain(); o.connect(g); g.connect(audioCtx.destination); g.gain.setValueAtTime(0,audioCtx.currentTime); g.gain.linearRampToValueAtTime(amp,audioCtx.currentTime+.01); g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+dur); return {o,g,stopAt:audioCtx.currentTime+dur}; }
const sMeet =()=>{ const e=env(.2,.25); if(!e) return; e.o.type='triangle'; e.o.frequency.value=600; e.o.start(); e.o.stop(e.stopAt); };
const sGiggle=()=>{ const e=env(.12,.2); if(!e) return; e.o.type='square'; e.o.frequency.value=900; e.o.start(); e.o.stop(e.stopAt); };
const sCatch =()=>{ const e=env(.1,.35); if(!e) return; e.o.type='square'; e.o.frequency.value=660; e.o.start(); e.o.stop(e.stopAt); };
const sCook  =()=>{ const e=env(1.4,.18); if(!e) return; e.o.type='sine'; e.o.frequency.value=220; e.o.start(); e.o.stop(e.stopAt); };

/* ============= Wetter: Regen / Blitz / Nebel / Nachtstrahlen ============= */
const rainLayer=document.getElementById('rain'), lightningLayer=document.getElementById('lightning'),
      fogLayer=document.getElementById('fog'), beamsLayer=document.getElementById('beams'), sky=document.getElementById('sky');
let raining=false, rainTimer=null;
function spawnDrop(){ const d=document.createElement('div'); d.className='drop'; d.style.left=rand(0,100)+'vw'; d.style.top='-10vh'; d.style.animationDuration=(.7+Math.random()*.6)+'s'; rainLayer.appendChild(d); setTimeout(()=>d.remove(),1800); }
function startRain(){ if(raining) return; raining=true; rainTimer=setInterval(()=>{ for(let i=0;i<randint(8,16);i++) spawnDrop(); },160); }
function stopRain(){ raining=false; if(rainTimer) clearInterval(rainTimer), rainTimer=null; rainLayer.innerHTML=''; }
function lightning(){ const f=document.createElement('div'); f.className='flash'; lightningLayer.appendChild(f); setTimeout(()=>f.remove(),350); if(audioCtx&&soundOn){ const e=env(1.2,.2); if(e){ e.o.type='sawtooth'; e.o.frequency.value=40; e.o.start(); e.o.stop(e.stopAt); } } }
function buildFog(){ fogLayer.innerHTML=''; const n=randint(5,8); for(let i=0;i<n;i++){ const m=document.createElement('div'); m.className='mist'; m.style.top=rand(10,80)+'vh'; m.style.setProperty('--dur',(24+Math.random()*16)+'s'); fogLayer.appendChild(m); } }
function clearFog(){ fogLayer.innerHTML=''; }
function addBeams(){ beamsLayer.innerHTML=''; for(let i=0;i<3;i++){ const b=document.createElement('div'); b.className='beam'; b.style.left=(10+10*i)+'vw'; b.style.animationDelay=(-i*2)+'s'; beamsLayer.appendChild(b); } }
function clearBeams(){ beamsLayer.innerHTML=''; }

/* ============= Pfad / Kollision / BFS ============= */
const solidAt=(tx,ty)=> tx<0||ty<0||tx>=COLS||ty>=ROWS || SOLID.has(tx+','+ty);
function canAt(px,py,w=24,h=24){ const half=w/2, base=py; const corners=[[px-half,base],[px+half,base],[px-half,base+h],[px+half,base+h]]; for(const [cx,cy] of corners){ if(solidAt(Math.floor(cx/T), Math.floor(cy/T))) return false; } return true; }
function bfs(sx,sy,gx,gy){ const Q=[[sx,sy]], V=new Set([sx+','+sy]), P={}; while(Q.length){ const [x,y]=Q.shift(); if(x===gx&&y===gy) break; for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){ const nx=x+dx, ny=y+dy, k=nx+','+ny; if(!V.has(k)&&!solidAt(nx,ny)){V.add(k); P[k]=[x,y]; Q.push([nx,ny]);}} } const path=[]; let cx=gx,cy=gy; if(!P[cx+','+cy] && !(sx===gx&&sy===gy)) return null; while(!(cx===sx&&cy===sy)){ path.push([cx,cy]); const p=P[cx+','+cy]; if(!p) break; cx=p[0]; cy=p[1]; } path.reverse(); return path; }
const randomOpenCell=()=>{ let x=0,y=0,c=0; do{ x=1+Math.floor(Math.random()*(COLS-2)); y=1+Math.floor(Math.random()*(ROWS-2)); c++; if(c>200) break; } while(solidAt(x,y)); return {x,y}; };

/* ============= Welt generieren ============= */
function genWorld(){
  mapEl.innerHTML=""; GRID=[]; SOLID.clear(); HUBS=[]; HUTS=[]; NPCS=[]; CITIZENS=[]; CAVES=[]; TREASURES=[]; ACTORS=[];
  // Labyrinth
  const mazeW=(Math.floor(W/T))|1, mazeH=(Math.floor(H/T))|1;
  const M=Array.from({length:mazeH},()=>Array(mazeW).fill(1));
  (function carve(cx,cy){ M[cy][cx]=0; [[2,0],[0,2],[-2,0],[0,-2]].sort(()=>Math.random()-.5).forEach(([dx,dy])=>{ const nx=cx+dx, ny=cy+dy; if(ny>0&&ny<mazeH-1&&nx>0&&nx<mazeW-1 && M[ny][nx]===1){ M[cy+dy/2][cx+dx/2]=0; carve(nx,ny); } }); })(((mazeW/2)|0)|1, ((mazeH/2)|0)|1);
  for(let y=0;y<ROWS;y++){ GRID[y]=[]; for(let x=0;x<COLS;x++){ const cell=document.createElement('i'); cell.className='cell bg-grass'; mapEl.appendChild(cell); if(M[y]?.[x]===0){ cell.className='cell bg-path'; GRID[y][x]=0; } else { const r=Math.random(); if(r<.55) cell.classList.add('bg-hedge'); else if(r<.8) cell.classList.add('bg-forest'); else cell.classList.add('bg-tree'); GRID[y][x]=1; SOLID.add(x+','+y); } } }

  // Treffpunkte / Hubs
  function addZone(x,y,cls,icon,label){ const el=document.createElement('div'); el.className='zone '+cls; el.style.left=(x*T+T/2)+'px'; el.style.bottom=(y*T)+'px'; el.innerHTML='<div class="icon">'+icon+'</div><div class="label">'+label+'</div>'; world.appendChild(el); HUBS.push({x,y,type:cls,el}); }
  const kinds=[['stage','🎤','Bühne'],['market','🛒','Markt'],['cafe','☕','Café'],['hotel','🏨','Hotel'],['playground','🎠','Spielplatz'],['office','🏢','Büro'],['park','⛲','Park']];
  for(let i=0;i<7;i++){ const p=randomOpenCell(), k=kinds[randint(0,kinds.length-1)]; addZone(p.x,p.y,k[0],k[1],k[2]); }

  // Häuser + NPCs
  const roofClasses=['c1','c2','c3','c4','c5','c6','c7','c8','c9','c10'];
  const npcFaces=['🧑‍🌾','👩‍🍳','🧔','👵','🧑‍🔧','🧑‍🎨','🧙‍♀️','🧑‍🏫','🧑‍✈️','🧑‍🚀'];
  const npcFirst=['Tutti','Bello','Rosi','Koko','Lampi','Frau Flausch','Oma Pixel','Robo','Toni','Mia','Klara','Fiete','Lilo','Momo','Piet','Nora','Sven','Giga','Pico','Nana'];
  const npcLast=['Mampfred','Knusper','Pfefferminze','Süßholz','Quark','Zuckerhut','Pastinake','Kessel','KochFix','Topfgeist','Löffel','Möhrex','Mürbe','Schmackofatz'];
  const usedNPC={}; const uniqueNpc=()=>{ let n="",i=0; do{ n=npcFirst[randint(0,npcFirst.length-1)]+" "+npcLast[randint(0,npcLast.length-1)]; i++; if(i>200) break; } while(usedNPC[n]); usedNPC[n]=1; return n; };
  function placeHuts(n=10){
    for(let i=0;i<n;i++){ const p=randomOpenCell(); const hut=document.createElement('div'); hut.className='hut '+roofClasses[i%roofClasses.length]; hut.style.left=(p.x*T+T/2)+'px'; hut.style.bottom=(p.y*T)+'px';
      hut.innerHTML='<div class="roof"></div><div class="body"><div class="door"></div><div class="win l"></div><div class="win r"></div></div>'; world.appendChild(hut);
      const npc=document.createElement('div'); npc.className='actor'; const name=uniqueNpc(); npc.innerHTML='<span class="animal">👩‍🍳</span><div class="nameplate">'+name+'</div>'; npc.style.left=(p.x*T+T/2)+'px'; npc.style.bottom=(p.y*T)+'px'; world.appendChild(npc);
      NPCS.push({el:npc,name,x:p.x*T+T/2,y:p.y*T,speed:1.0+Math.random()*0.3,path:[],feedCooldown:0});
      HUTS.push({x:p.x,y:p.y,el:hut});
    }
  }
  placeHuts(10);

  // Bürger
  const citizenFaces=['🧑‍💻','👩‍💼','🧑‍🎤','🧑‍🎓','🧑‍🎷','🧑‍🚴','🧑‍⚕️','🧑‍🚒','🧑‍🔬','🧑‍🎮'];
  const citFirst=['Glimmer','Turbo','Pixel','Lady','Sir','Captain','Prinz','Keks','Brezel','Wusel','Knall','Mega','Zack','Motte','Zwiebel','Blitz'];
  const citLast=['Fröhlich','Karotti','Hopkinson','von Bytes','von Hoppel','GigaWatt','Sausewind','Schnatter','Flinkbein','Muffin','Smaragd','Wolkig','Schokoguss','Neon'];
  const usedCit={}; const uniqueCit=()=>{ let n="",i=0; do{ n=citFirst[randint(0,citFirst.length-1)]+" "+citLast[randint(0,citLast.length-1)]; i++; if(i>200) break; } while(usedCit[n]); usedCit[n]=1; return n; };
  function spawnCitizens(n=10){ for(let i=0;i<n;i++){ const p=randomOpenCell(), el=document.createElement('div'); el.className='actor'; const name=uniqueCit(); el.innerHTML='<span class="animal">'+citizenFaces[i%citizenFaces.length]+'</span><div class="nameplate">'+name+'</div>'; el.style.left=(p.x*T+T/2)+'px'; el.style.bottom=(p.y*T)+'px'; world.appendChild(el); CITIZENS.push({el,name,x:p.x*T+T/2,y:p.y*T,speed:1.05,path:[],karma:0}); } }
  spawnCitizens(10);

  // Höhlen + Schätze
  function placeCaves(){ const groups=['Hoppel','Kletterer','Schleichis','Royals']; for(const g of groups){ const p=randomOpenCell(); const el=document.createElement('div'); el.className='cave'; el.style.left=(p.x*T+T/2)+'px'; el.style.bottom=(p.y*T)+'px'; el.textContent='🕳️'; const tag=document.createElement('div'); tag.className='tag'; tag.textContent=g+': 0'; el.appendChild(tag); world.appendChild(el); CAVES.push({group:g,x:p.x,y:p.y,el,tag,stored:0}); } }
  placeCaves();
  function spawnTreasure(){ const foods=['🥕','🍓','🥜','🍄','🍎','🌰']; const p=randomOpenCell(); const el=document.createElement('div'); el.className='treasure'; el.textContent=foods[randint(0,foods.length-1)]; el.style.left=(p.x*T+T/2)+'px'; el.style.bottom=(p.y*T)+'px'; world.appendChild(el); TREASURES.push({x:p.x,y:p.y,el,taken:false}); }
  for(let i=0;i<18;i++) spawnTreasure();

  // Restaurant platzieren
  function placeRestaurant(){ const resto=document.getElementById('restaurant'); const p=randomOpenCell(); resto.style.left=(p.x*T+T/2)+'px'; resto.style.bottom=(p.y*T)+'px'; resto.style.display='block'; resto.dataset.tx=p.x; resto.dataset.ty=p.y; }
  placeRestaurant();

  // Tiere
  const SPECIES=[ {emoji:"🐰",group:"Hoppel"}, {emoji:"🐿️",group:"Kletterer"}, {emoji:"🦝",group:"Kletterer",nocturnal:true},
                  {emoji:"🦊",group:"Schleichis",nocturnal:true}, {emoji:"🦡",group:"Schleichis",nocturnal:true}, {emoji:"🐗",group:"Schleichis",nocturnal:true},
                  {emoji:"🦌",group:"Royals"}, {emoji:"🐻",group:"Royals"}, {emoji:"🦉",group:"Royals",nocturnal:true}, {emoji:"🐦",group:"Royals"}, {emoji:"🐸",group:"Royals"} ];
  const titleA=["Sir","Lady","Meister","Baron","Graf","Dr.","Captain","Professor","Sultan","Queen","König","Fräulein"];
  const funnyB=["Flauschi","Wuseline","Zappel","Turbo","Pixel","Kicher","Hopps","Nüssli","Schnuff","Mopps","Quaki","Wolke","Knusper","Wackel","Fuzzy","Möhrex","Krümel","Flummi"];
  const usedAnimal={}; const uniqueAnimalName=()=>{ let n="",i=0; do{ n=titleA[randint(0,titleA.length-1)]+" "+funnyB[randint(0,funnyB.length-1)]+(Math.random()<.3?("-"+funnyB[randint(0,funnyB.length-1)]):""); i++; if(i>300) break; } while(usedAnimal[n]); usedAnimal[n]=1; return n; };
  const babyNames=['Püppi','Mopsi','Puschel','Wölkchen','Nüsschen','Flitzi','Schnuffel','Lotti','Bobi','Minihop','Pico','Mimi','Mümmelchen','Krümelchen','Flauschli'];
  const cuteBabyName=()=> babyNames[randint(0,babyNames.length-1)]+'-'+(Math.random()<.5?'chen':'li');
  function makeActor(sp,x,y,isBaby){ const el=document.createElement('div'); el.className='actor'; const span=document.createElement('span'); span.className='animal'+(isBaby?' baby':''); span.textContent=sp.emoji; const label=document.createElement('div'); label.className='nameplate'+(isBaby?' baby':''); const name=isBaby?cuteBabyName():uniqueAnimalName(); label.textContent=name; el.appendChild(span); el.appendChild(label); world.appendChild(el); return {el,emoji:sp.emoji,group:sp.group,nocturnal:!!sp.nocturnal,name,x:x*T+T/2,y:y*T,speed:(isBaby?.9:1)+Math.random()*0.35,state:'roam',goal:null,karma:0,talking:false,isBaby:!!isBaby,born:performance.now(),carrying:null}; }
  function spawnAnimal(){ const sp=SPECIES[randint(0,SPECIES.length-1)], p=randomOpenCell(); const a=makeActor(sp,p.x,p.y,false); ACTORS.push(a); }
  for(let i=0;i<18;i++) spawnAnimal();

  updateScore();
}

/* ============= Score & Karma ============= */
function popKarma(px,py,txt){ const d=document.createElement('div'); d.className='karma-pop'; d.textContent=txt; d.style.left=Math.round(px)+'px'; d.style.top=Math.round(py)+'px'; document.body.appendChild(d); setTimeout(()=>d.remove(),900); }
function addKarma(entity,delta){ entity.karma=(entity.karma||0)+delta; popKarma(entity.x, innerHeight - entity.y, (delta>0?'+':'')+delta+' ⚡'); updateScore(); }

function updateScore(){
  const rows=[...ACTORS.filter(a=>!a.dead), ...CITIZENS, ...NPCS].map(x=>({emoji:x.emoji||'🙂',name:x.name,karma:x.karma||0}));
  rows.sort((a,b)=>b.karma-a.karma);
  scoreTable.innerHTML = rows.slice(0,10).map(r=>`<tr><td><span class="avatar">${r.emoji}</span>${r.name}</td><td style="text-align:right">${r.karma} ⚡</td></tr>`).join('') || '<tr><td colspan="2">…</td></tr>';
  cookline.textContent = `👨‍🍳 ${cook.name}: ${cook.scoreCook} gekocht • ${cook.scoreLoot} Beute`;
}

/* ============= Dialoge ============= */
const THEMES={ generic:[(a,b)=>`${a}: „CI/CD = Carrot Integration/Delivery!“`,(a,b)=>`${b}: „TLS: Tolle Löffel Sicherheit.“`,(a,b)=>`${a}: „Pair-Hoppeln?“`,(a,b)=>`${b}: „Nur mit Snacks!“`], cafe:[(a,b)=>`${a}: „Flat White … ohne Milch?“`,(a,b)=>`${b}: „Und ein Keks-LB.“`], park:[(a,b)=>`${a}: „Monitoring grün.“`,(a,b)=>`${b}: „Plätscher-OK.“`], stage:[(a,b)=>`${a}: „Kara-oke?“`,(a,b)=>`${b}: „Löffel-Solo!“`], playground:[(a,b)=>`${a}: „Wer schneller?“`,(a,b)=>`${b}: „Bis zur Rutsche!“`], office:[(a,b)=>`${a}: „Stand-up?“`,(a,b)=>`${b}: „Sitz-down.“`], hotel:[(a,b)=>`${a}: „All-you-can-Möhre?“`,(a,b)=>`${b}: „Mit Frühstück!“`], market:[(a,b)=>`${a}: „2× Karotten bitte.“`,(a,b)=>`${b}: „Nur fair gehandelt.“`] };
function say(entity,text,ms=1600){ if(!entity||entity.dead) return; if(!entity.mini){ const m=document.createElement('div'); m.className='mini-bubble'; entity.el.appendChild(m); entity.mini=m; } entity.mini.textContent=text; entity.mini.style.display='block'; setTimeout(()=>{ if(entity.mini) entity.mini.style.display='none'; }, ms); }
function startDialogue(A,B,topic){ if(!A||!B||A.talking||B.talking) return; A.talking=B.talking=true; const lines=(THEMES[topic]||[]).concat(THEMES.generic), total=30000, step=3300; sMeet(); say(A,"Hi "+(B.name?.split(' ')[0]||'du')+"!",1000); say(B,"Hi "+(A.name?.split(' ')[0]||'du')+"!",1000); let t=0; const timer=setInterval(()=>{ if(A.dead||B.dead){ clearInterval(timer); A.talking=B.talking=false; return; } const L=lines[randint(0,lines.length-1)]; if(Math.random()<.5) say(A,L(A.name||'A',B.name||'B'),3000); else say(B,L(A.name||'A',B.name||'B'),3000); t+=step; if(t>=total){ clearInterval(timer); A.talking=B.talking=false; say(A,"*kicher* 🤭",900); say(B,"*kicher* 🤭",900); sGiggle(); addKarma(A,1); addKarma(B,1);
    // Babys
    if(!A.isBaby && !B.isBaby && A.group && A.group===B.group && Math.random()<.35){ const tx=Math.floor((A.x+B.x)/2/T), ty=Math.floor((A.y+B.y)/2/T); const sp={emoji:A.emoji,group:A.group,nocturnal:A.nocturnal}; const baby=makeActor(sp,tx,ty,true); baby.karma=1; ACTORS.push(baby); say(baby,"Hallo! 💖",1200); }
  } }, step); }

/* ============= Spielobjekte-Finder ============= */
function nearestTreasure(a){ let best=null,bd=1e9; for(const t of TREASURES){ if(t.taken) continue; const d=Math.abs(t.x-Math.floor(a.x/T))+Math.abs(t.y-Math.floor(a.y/T)); if(d<bd){ bd=d; best=t; } } return best; }
const caveFor=g=>CAVES.find(c=>c.group===g)||CAVES[0];
function nearHub(obj,hub){ return Math.hypot(obj.x-(hub.x*T+T/2), obj.y-(hub.y*T))<70; }

/* ============= Koch ============= */
const cookNames=["Chef Carbonara","Onkel Kasserolle","Koch Kichererbse","Meister Mampf","Sir Schmor","Pan Peter","Saucier Sören"];
const cook={ name:cookNames[randint(0,cookNames.length-1)], x:T*2+T/2, y:T*2, speed:1.35, path:[], carrying:null, carryingLoot:false, scoreCook:0, scoreLoot:0, stuck:0 };
const cookEl=document.createElement('div'); cookEl.className='actor'; cookEl.style.zIndex=7; cookEl.innerHTML='<span class="animal">👨‍🍳</span><div class="nameplate">'+cook.name+'</div>'; world.appendChild(cookEl);
const resto=document.getElementById('restaurant'), chimney=document.getElementById('chimney');
const doorCell=()=>({x:parseInt(resto.dataset.tx,10),y:parseInt(resto.dataset.ty,10)});
function puffSmoke(n=6){ let i=0; const t=setInterval(()=>{ const b=document.createElement('div'); b.className='smoke'; chimney.appendChild(b); setTimeout(()=>b.remove(),2000); i++; if(i>=n) clearInterval(t); },220); }
let keys={w:false,a:false,s:false,d:false}, manualUntil=0;
document.addEventListener('keydown',e=>{ const k=e.key.toLowerCase(); if(keys[k]!==undefined){ keys[k]=true; manualUntil=Date.now()+3000; cook.path=[]; } });
document.addEventListener('keyup',e=>{ const k=e.key.toLowerCase(); if(keys[k]!==undefined) keys[k]=false; });
function moveCookManual(){ const vx=(keys.a?-1:0)+(keys.d?1:0), vy=(keys.s?1:0)+(keys.w?-1:0); if(vx||vy){ const m=Math.hypot(vx,vy); const nx=cook.x+(vx/m)*cook.speed*1.9, ny=cook.y+(vy/m)*cook.speed*1.9; if(canAt(nx,ny)){ cook.x=nx; cook.y=ny; } } }
function planHunt(){
  if(Date.now()<manualUntil) return;
  if(cook.carrying || cook.carryingLoot){ const d=doorCell(); cook.path=bfs(Math.floor(cook.x/T),Math.floor(cook.y/T),d.x,d.y)||[]; return; }
  const richest=CAVES.reduce((p,c)=> c.stored>(p?.stored||0)?c:p, null);
  if(richest && richest.stored>0 && Math.random()<.6){ cook.path=bfs(Math.floor(cook.x/T),Math.floor(cook.y/T),richest.x,richest.y)||[]; return; }
  const target=ACTORS.filter(a=>!a.dead).sort((a,b)=>(b.karma-a.karma)||(Math.hypot(a.x-cook.x,a.y-cook.y)-Math.hypot(b.x-cook.x,b.y-cook.y)) )[0];
  if(target){ cook.path=bfs(Math.floor(cook.x/T),Math.floor(cook.y/T),Math.floor(target.x/T),Math.floor(target.y/T))||[]; return; }
  const hub=HUBS[randint(0,HUBS.length-1)]; if(hub) cook.path=bfs(Math.floor(cook.x/T),Math.floor(cook.y/T),hub.x,hub.y)||[];
}
setInterval(planHunt,900);

/* ============= Steuerungen/KI ============= */
function steerNPC(n,mul){
  if(n.feedCooldown>0) n.feedCooldown--;
  if(!n.path || n.path.length===0){ const hub=HUBS[randint(0,HUBS.length-1)]; if(hub) n.path=bfs(Math.floor(n.x/T),Math.floor(n.y/T),hub.x,hub.y)||[]; }
  else{ const [gx,gy]=n.path[0], tx=gx*T+T/2, ty=gy*T, dx=tx-n.x, dy=ty-n.y, m=Math.hypot(dx,dy)||1; const nx=n.x+(dx/m)*n.speed*mul, ny=n.y+(dy/m)*n.speed*mul; if(canAt(nx,ny)){ n.x=nx; n.y=ny; } else n.path.shift(); if(Math.hypot(dx,dy)<6) n.path.shift(); }
  for(const a of ACTORS){ if(a.dead||a.state==='carried') continue; if(Math.hypot(a.x-n.x,a.y-n.y)<22 && n.feedCooldown<=0){ n.feedCooldown=120; const el=document.createElement('div'); el.className='treasure'; el.textContent=(['🥕','🍓','🍎','🥜','🍄'])[randint(0,4)]; const tx=Math.floor(a.x/T), ty=Math.floor(a.y/T); el.style.left=(tx*T+T/2)+'px'; el.style.bottom=(ty*T)+'px'; world.appendChild(el); TREASURES.push({x:tx,y:ty,el,taken:false}); say(a,"Danke, "+n.name.split(' ')[0]+"! ❤️",1300); addKarma(a,2); sMeet(); } }
  n.el.style.left=n.x+'px'; n.el.style.bottom=n.y+'px';
}
function steerCitizen(c,mul){
  if(!c.path || c.path.length===0){ const hub=HUBS[randint(0,HUBS.length-1)]; if(hub) c.path=bfs(Math.floor(c.x/T),Math.floor(c.y/T),hub.x,hub.y)||[]; }
  else{ const [gx,gy]=c.path[0], tx=gx*T+T/2, ty=gy*T, dx=tx-c.x, dy=ty-c.y, m=Math.hypot(dx,dy)||1; const nx=c.x+(dx/m)*c.speed*mul, ny=c.y+(dy/m)*c.speed*mul; if(canAt(nx,ny)){ c.x=nx; c.y=ny; } else c.path.shift(); if(Math.hypot(dx,dy)<6) c.path.shift(); }
  c.el.style.left=c.x+'px'; c.el.style.bottom=c.y+'px';
}
function steerAnimal(a,mul){
  if(a.dead||a.talking||a.state==='carried') return;
  if(a.isBaby && performance.now()-a.born>120000){ a.isBaby=false; a.el.querySelector('.animal').classList.remove('baby'); a.el.querySelector('.nameplate').classList.remove('baby'); say(a,"Ich bin groß! ✨",1200); a.speed+=.2; }
  const dToCook=Math.hypot(a.x-cook.x,a.y-cook.y);
  if(dToCook<9*T){ const vx=a.x-cook.x, vy=a.y-cook.y; const tx=Math.max(0,Math.min(COLS-1, Math.floor(a.x/T + Math.sign(vx)*4))); const ty=Math.max(0,Math.min(ROWS-1, Math.floor(a.y/T + Math.sign(vy)*4))); a.goal=bfs(Math.floor(a.x/T),Math.floor(a.y/T),tx,ty)||a.goal; }
  if(!a.carrying && !a.goal && Math.random()<.02){ const hub=HUBS[randint(0,HUBS.length-1)]; if(hub) a.goal=bfs(Math.floor(a.x/T),Math.floor(a.y/T),hub.x,hub.y)||[]; }
  if(!a.carrying && !a.goal){ const tr=nearestTreasure(a); if(tr){ a.targetTreasure=tr; a.goal=bfs(Math.floor(a.x/T),Math.floor(a.y/T),tr.x,tr.y)||[]; } }
  if(a.carrying && !a.goal){ const cv=caveFor(a.group); a.goal=bfs(Math.floor(a.x/T),Math.floor(a.y/T),cv.x,cv.y)||[]; }

  if(a.goal && a.goal.length){ const [gx,gy]=a.goal[0], tx=gx*T+T/2, ty=gy*T, dx=tx-a.x, dy=ty-a.y, m=Math.hypot(dx,dy)||1; const nx=a.x+(dx/m)*a.speed*mul, ny=a.y+(dy/m)*a.speed*mul; if(canAt(nx,ny)){ a.x=nx; a.y=ny; } else a.goal.shift(); if(Math.hypot(dx,dy)<6) a.goal.shift();
    if(!a.carrying && a.targetTreasure && Math.floor(a.x/T)===a.targetTreasure.x && Math.floor(a.y/T)===a.targetTreasure.y && !a.targetTreasure.taken){ a.carrying=a.targetTreasure; a.targetTreasure.taken=true; if(a.carrying.el) a.carrying.el.style.display='none'; addKarma(a,2); const cv=caveFor(a.group); a.goal=bfs(Math.floor(a.x/T),Math.floor(a.y/T),cv.x,cv.y)||[]; }
    if(a.carrying){ const cv=caveFor(a.group); if(Math.floor(a.x/T)===cv.x && Math.floor(a.y/T)===cv.y){ cv.stored++; cv.tag.textContent=cv.group+': '+cv.stored; a.carrying=null; addKarma(a,3); if(Math.random()<.6) spawnTreasure(); } }
    for(const h of HUTS){ if(Math.floor(a.x/T)===h.x && Math.floor(a.y/T)===h.y){ addKarma(a,1); say(a,"Nom nom 😋❤️",1000); } }
  } else if(Math.random()<.02){ const p=randomOpenCell(); a.goal=bfs(Math.floor(a.x/T),Math.floor(a.y/T),p.x,p.y)||[]; }

  a.el.style.left=a.x+'px'; a.el.style.bottom=a.y+'px';
}

/* ============= Koch-Update ============= */
function updateCook(mul){
  if(Date.now()<manualUntil) moveCookManual();
  else if(cook.path && cook.path.length){ const [gx,gy]=cook.path[0], tx=gx*T+T/2, ty=gy*T, dx=tx-cook.x, dy=ty-cook.y, m=Math.hypot(dx,dy)||1; const nx=cook.x+(dx/m)*cook.speed*1.3*mul, ny=cook.y+(dy/m)*cook.speed*1.3*mul; if(canAt(nx,ny)){ cook.x=nx; cook.y=ny; cook.stuck=0; } else { cook.path.shift(); cook.stuck++; } if(Math.hypot(dx,dy)<6) cook.path.shift(); if(cook.stuck>8){ cook.path=[]; cook.stuck=0; } }
  else planHunt();

  if(!cook.carrying && !cook.carryingLoot){
    for(const a of ACTORS){ if(a.dead||a.state==='carried') continue; if(Math.hypot(a.x-cook.x,a.y-cook.y)<20){ sCatch(); a.state='carried'; a.el.style.display='none'; cook.carrying=a; break; } }
    if(!cook.carrying){ for(const c of CAVES){ if(Math.hypot(c.x*T+T/2 - cook.x, c.y*T - cook.y)<18 && c.stored>0){ c.stored--; c.tag.textContent=c.group+': '+c.stored; cook.carryingLoot=true; break; } } }
  } else {
    const d=doorCell(); if(Math.floor(cook.x/T)===d.x && Math.floor(cook.y/T)===d.y){
      if(cook.carrying){ cook.carrying.dead=true; cook.carrying=null; cook.scoreCook++; sCook(); puffSmoke(8); }
      if(cook.carryingLoot){ cook.carryingLoot=false; cook.scoreLoot++; }
      updateScore(); planHunt();
    }
  }
  cookEl.style.left=cook.x+'px'; cookEl.style.bottom=cook.y+'px';
}

/* ============= Minimap ============= */
let miniBG=null, miniReady=false;
function buildMiniBG(){ const c=document.createElement('canvas'); c.width=miniCanvas.width; c.height=miniCanvas.height; const cc=c.getContext('2d'); const sx=c.width/COLS, sy=c.height/ROWS; for(let y=0;y<ROWS;y++){ for(let x=0;x<COLS;x++){ cc.fillStyle = SOLID.has(x+','+y)?'#34513f':'#bcae84'; cc.fillRect(Math.floor(x*sx), c.height-Math.floor((y+1)*sy), Math.ceil(sx), Math.ceil(sy)); } } miniBG=c; miniReady=true; }
function drawMinimap(){ if(!miniReady) buildMiniBG(); mctx.drawImage(miniBG,0,0); const sx=miniCanvas.width/COLS, sy=miniCanvas.height/ROWS;
  mctx.fillStyle='#ffa6e7'; HUBS.forEach(h=>mctx.fillRect(h.x*sx, miniCanvas.height-(h.y+1)*sy, Math.max(2,1*sx), Math.max(2,1*sy)));
  mctx.fillStyle='#9ac1ff'; CAVES.forEach(c=>mctx.fillRect(c.x*sx, miniCanvas.height-(c.y+1)*sy, Math.max(2,1*sx), Math.max(2,1*sy)));
  mctx.fillStyle='#ffd257'; TREASURES.forEach(t=>{ if(!t.taken) mctx.fillRect(t.x*sx, miniCanvas.height-(t.y+1)*sy, Math.max(2,1*sx), Math.max(2,1*sy)); });
  const dot=(x,y,col)=>{ mctx.fillStyle=col; mctx.fillRect((x/T-0.5)*sx, miniCanvas.height-((y/T)+0.5)*sy, Math.max(2,1*sx), Math.max(2,1*sy)); };
  ACTORS.forEach(a=>!a.dead&&dot(a.x,a.y,'#5cff9d')); CITIZENS.forEach(c=>dot(c.x,c.y,'#5cff9d')); NPCS.forEach(n=>dot(n.x,n.y,'#5cff9d')); dot(cook.x,cook.y,'#ff4d4d');
}

/* ============= Tageszeit & Saison ============= */
const worldWrap=document.getElementById('worldWrap');
const SEASONS=['spring','summer','autumn','winter']; const SEASON_MS=60000, DAY_MS=90000;
let seasonIndex=0, seasonStart=performance.now(), dayStart=performance.now();
function seasonLoop(){
  const t=performance.now();
  // Saison
  const sProg=((t-seasonStart)%(SEASON_MS*SEASONS.length))/SEASON_MS; const idx=Math.floor(sProg)%SEASONS.length;
  if(idx!==seasonIndex){ worldWrap.classList.remove(SEASONS[seasonIndex]); seasonIndex=idx; worldWrap.classList.add(SEASONS[seasonIndex]); if(SEASONS[seasonIndex]!=='spring') stopRain(); if(SEASONS[seasonIndex]==='autumn') buildFog(); else clearFog(); }
  // Tag/Nacht
  const dProg=((t-dayStart)%DAY_MS)/DAY_MS; const night=(dProg<0.25 || dProg>0.75);
  sky.style.background=`radial-gradient(120vw 80vh at 50% 60%, rgba(255,255,255,${night?0.03:0.06}), rgba(0,0,0,0) 40%), rgba(10,17,28,${(night?0.55:0)})`;
  if(night && !beamsLayer.firstChild) addBeams(); if(!night && beamsLayer.firstChild) clearBeams();
  // Frühling-Wetter
  if(SEASONS[seasonIndex]==='spring'){ if(!raining && Math.random()<.02) startRain(); if(raining && Math.random()<.006) stopRain(); if(Math.random()<.006) lightning(); }
  drawMinimap();
  requestAnimationFrame(seasonLoop);
}

/* ============= Screenshot ============= */
document.getElementById('shotBtn').onclick=async()=>{ try{ const c=await html2canvas(document.getElementById('world'),{backgroundColor:null,scale:2}); const a=document.createElement('a'); a.href=c.toDataURL('image/png'); a.download='wald-screenshot.png'; a.click(); }catch(e){ alert('Screenshot nicht möglich'); } };

/* ============= Loop ============= */
function activityMul(nocturnal){ const dProg=((performance.now())%DAY_MS)/DAY_MS; const night=(dProg<0.25 || dProg>0.75), dusk=(dProg>=0.25 && dProg<0.35)||(dProg>0.65 && dProg<=0.75); if(nocturnal) return night?1.35:(dusk?1.1:0.85); return night?0.85:(dusk?1.05:1.2); }

let paused=false;
function gameLoop(){
  if(!paused){
    updateCook(activityMul(false));
    for(const n of NPCS) steerNPC(n, activityMul(false));
    for(const c of CITIZENS) steerCitizen(c, activityMul(false));
    for(const a of ACTORS) steerAnimal(a, activityMul(a.nocturnal));
    // Treffen/Dialogs an Hubs
    HUBS.forEach(h=>{
      const nearby=[...ACTORS.filter(a=>!a.talking && Math.hypot(a.x-(h.x*T+T/2), a.y-(h.y*T))<70), ...CITIZENS.filter(c=>Math.hypot(c.x-(h.x*T+T/2), c.y-(h.y*T))<70), ...NPCS.filter(n=>Math.hypot(n.x-(h.x*T+T/2), n.y-(h.y*T))<70)];
      if(nearby.length>=2 && Math.random()<.03){ const A=nearby[randint(0,nearby.length-1)]; let B=null; do{ B=nearby[randint(0,nearby.length-1)]; } while(B===A); startDialogue(A,B,h.type); }
    });
  }
  requestAnimationFrame(gameLoop);
}

/* ============= Start ============= */
genWorld(); buildMiniBG(); updateScore(); requestAnimationFrame(gameLoop); requestAnimationFrame(seasonLoop);

/* ============= Resize ============= */
window.addEventListener('resize',()=>{ W=innerWidth; H=innerHeight; COLS=Math.floor(W/T); ROWS=Math.floor(H/T); mapEl.style.setProperty('--cols', COLS); genWorld(); buildMiniBG(); updateScore(); });

}catch(err){ console.error(err); const o=document.createElement('div'); o.style.cssText='position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);background:#111;color:#fff;padding:10px 14px;border-radius:10px;z-index:2000;font:600 14px ui-sans-serif'; o.textContent='Fehler: '+(err.message||err); document.body.appendChild(o); }
});
</script>
</body>
</html>
