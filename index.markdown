---
title: "Profil Benedikt Schackenberg"
layout: default
permalink: /
description: "Kachel-Grid + Retro-Wald"
---

<html lang="de">
<head>
<meta charset="utf-8" />
<title>{{ page.title }}</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="description" content="{{ page.description }}" />
<link rel="icon" href="data:,">
<style>
  :root{ --maxw:1000px; --shadow:0 10px 24px rgba(0,0,0,.07); --border:#e9edf3; --tile:32px; }
  *{box-sizing:border-box}
  body{ margin:0; background:#f6f8fb; color:#111; font-family: ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial; overflow:hidden }
  main{ width:min(100%,var(--maxw)); margin:1.5rem auto 3rem; padding:0 1rem }

  .frame{ position:relative; background:#fff; border:1px solid var(--border); border-radius:16px; box-shadow:var(--shadow); overflow:hidden }
  .frame .header{ padding:.9rem 1rem; border-bottom:1px solid var(--border); text-align:center; font-weight:600 }
  .grid{ display:grid; gap:8px; padding:10px; grid-template-columns:repeat(2,1fr) }
  @media (min-width:540px){ .grid{ grid-template-columns:repeat(3,1fr) } }
  @media (min-width:760px){ .grid{ grid-template-columns:repeat(4,1fr) } }
  @media (min-width:980px){ .grid{ grid-template-columns:repeat(6,1fr) } }
  .tile{ position:relative; width:100%; aspect-ratio:1/1; background:#fff; border:1px solid var(--border); border-radius:12px; overflow:hidden; box-shadow:0 6px 16px rgba(0,0,0,.05) }
  .tile img{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; transition:opacity .35s }
  .tile img.fade-out{ opacity:0 }

  .card{ background:#fff; border:1px solid var(--border); border-radius:16px; padding:1.25rem; box-shadow:var(--shadow); line-height:1.6; margin-top:1rem }
  .btn, button.copy{ display:inline-block; border:1px solid #e5e7eb; border-radius:10px; padding:.6rem .9rem; text-decoration:none; color:#111; background:#fff; cursor:pointer }
  .btn:hover, button.copy:hover{ background:#f3f5f8 }
  pre{ background:#0b1220; color:#e6edf3; padding:1rem; border-radius:12px; overflow:auto; font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace; font-size:.9rem }

  /* ===== Kontaktblock oben rechts ===== */
  .contact-block{
    position:fixed; top:10px; right:10px; z-index:1100;
    background:#0d0d0d; color:#fff; border-radius:12px; box-shadow:0 10px 24px rgba(0,0,0,.25);
    padding:10px 12px; font:600 .94rem/1.4 ui-sans-serif; min-width:260px;
  }
  .contact-block a{ color:#fff; text-decoration:none; border-bottom:1px dotted #999; }
  .contact-actions{ display:flex; gap:8px; margin-top:6px; }
  .contact-actions .mini{ border:1px solid #2b2b2b; background:#111; color:#fff; border-radius:8px; padding:4px 8px; cursor:pointer; font-size:.85rem }
  .contact-actions .mini:hover{ background:#171717 }

  /* ===== Scoreboard oben links ===== */
  .score{
    position:fixed; left:10px; top:10px; z-index:1100;
    background:#111; color:#fff; border:2px solid #2a2a2a; border-radius:12px;
    padding:10px 12px; width:min(400px, 46vw); font:600 .9rem/1.35 ui-sans-serif;
    box-shadow:0 10px 24px rgba(0,0,0,.25);
  }
  .score h3{ margin:.1rem 0 .4rem; font-size:1rem }
  .score .tip{ opacity:.7; font-weight:500; font-size:.78rem; margin-top:.35rem }
  .score table{ width:100%; border-collapse:collapse; }
  .score td{ padding:4px 6px; border-bottom:1px solid #2a2a2a; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .score tr:last-child td{ border-bottom:none }
  .avatar{ display:inline-grid; place-items:center; width:22px; height:22px; border-radius:6px; background:#222; margin-right:6px; font-size:16px; line-height:1 }

  .karma-pop{ position:fixed; z-index:1200; pointer-events:none; font:800 .95rem/1 ui-sans-serif; color:#fff; padding:3px 8px; border-radius:10px; background:rgba(0,0,0,.75); transform:translate(-50%,-50%); animation:pop 900ms ease-out forwards; filter: drop-shadow(0 6px 14px rgba(0,0,0,.4)); }
  @keyframes pop{ 0%{opacity:0; transform:translate(-50%,-20px) scale(.8)} 30%{opacity:1} 100%{opacity:0; transform:translate(-50%,-60px) scale(1.05)} }

  /* ===== Retro Welt ===== */
  .world{ position:fixed; inset:0; z-index:999; image-rendering:pixelated; background:#567b6c }
  .map{ position:absolute; inset:0; display:grid; grid-template-columns:repeat(var(--cols), var(--tile)); grid-auto-rows:var(--tile); pointer-events:none; z-index:1 }
  .cell{ width:var(--tile); height:var(--tile) }
  .bg-grass{ background:
    linear-gradient(45deg,#6a8f68 25%,transparent 25%) 0 0/var(--tile) var(--tile),
    linear-gradient(-45deg,#658963 25%,transparent 25%) 0 0/var(--tile) var(--tile),
    #5f8460; opacity:.9 }
  .bg-path{ background:
    linear-gradient(45deg,#b8b08a 25%,transparent 25%) 0 0/8px 8px,
    linear-gradient(-45deg,#b3aa83 25%,transparent 25%) 0 0/8px 8px,#9e946c }
  .bg-hedge{ background:repeating-linear-gradient(45deg,#2c513e 0 6px,#2b4a39 6px 12px); box-shadow: inset 0 0 0 2px #203a2c }
  .bg-tree::before{ content:"🌲"; display:block; text-align:center; font-size:24px; margin-top:2px }
  .bg-forest::before{ content:"🌳"; display:block; text-align:center; font-size:22px; margin-top:4px }
  .bg-fountain::before{ content:"⛲"; display:block; text-align:center; font-size:20px; margin-top:6px }
  .bg-tunnel::before{ content:"🕳️"; display:block; text-align:center; font-size:20px; margin-top:6px }

  /* Kleines Zentrales Haus (Deko) */
  .house{ position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); z-index:3;
    width: clamp(140px, 14vw, 220px); height: clamp(110px, 12vw, 180px); filter: drop-shadow(0 10px 20px rgba(0,0,0,.18)) }
  .house .roof{ position:absolute; left:50%; top:0; transform:translateX(-50%); width:100%; height:40% }
  .house .roof::before{ content:""; position:absolute; inset:0; background:linear-gradient(#804233,#6e3629);
    clip-path:polygon(0% 100%,50% 8%,100% 100%); filter: drop-shadow(0 3px 0 #4b2a22) }
  .house .body{ position:absolute; left:50%; bottom:0; transform:translateX(-50%); width:90%; height:56%; background:#e7e0c9; border:3px solid #3b2f2f; border-radius:12px }
  .door{ position:absolute; left:50%; bottom:0; transform:translateX(-50%); width:18%; height:60%; background:#7b5b3e; border:3px solid #3b2f2f; border-radius:8px 8px 0 0 }
  .win{ position:absolute; bottom:24%; width:18%; height:28%; background:#cfe9ff; border:3px solid #3b2f2f; border-radius:6px; box-shadow:inset 0 0 0 3px #ffffff66 }
  .win.l{ left:18% } .win.r{ right:18% }

  /* Koch-Restaurant mit Kamin */
  .restaurant{ position:absolute; transform:translate(-50%,0); z-index:4; width:140px; height:110px; filter: drop-shadow(0 8px 16px rgba(0,0,0,.2)) }
  .restaurant .roof{ position:absolute; left:50%; top:0; transform:translateX(-50%); width:100%; height:42% }
  .restaurant .roof::before{ content:""; position:absolute; inset:0; background:linear-gradient(#7a3c2f,#5e2b22);
    clip-path:polygon(0% 100%,50% 12%,100% 100%); filter: drop-shadow(0 2px 0 rgba(0,0,0,.35)) }
  .restaurant .body{ position:absolute; left:50%; bottom:0; transform:translateX(-50%); width:92%; height:58%; background:#f1e6cf; border:3px solid #2f2626; border-radius:10px }
  .restaurant .door{ position:absolute; left:50%; bottom:0; transform:translateX(-50%); width:22%; height:64%; background:#7b5b3e; border:3px solid #2f2626; border-radius:6px 6px 0 0 }
  .chimney{ position:absolute; right:18px; top:6px; width:16px; height:18px; background:#6b5a4a; border:3px solid #2f2626; border-bottom:none; border-radius:4px 4px 0 0 }
  .smoke{ position:absolute; width:10px; height:10px; background:rgba(240,240,240,.9); border-radius:50%; left:50%; transform:translateX(-50%); animation: puff 2s ease-out forwards; filter:blur(.5px) drop-shadow(0 2px 4px rgba(0,0,0,.15)) }
  @keyframes puff{ 0%{opacity:0; transform:translate(-50%,6px) scale(.6)} 20%{opacity:1} 100%{opacity:0; transform:translate(-50%,-40px) scale(1.6)} }

  /* Kleine Pixel-Häuser (NPC) */
  .hut{ position:absolute; transform:translate(-50%,0); z-index:4; width: clamp(84px, 8.8vw, 120px); height: clamp(62px, 7vw, 95px); filter: drop-shadow(0 6px 12px rgba(0,0,0,.18)) }
  .hut .roof{ position:absolute; left:50%; top:0; transform:translateX(-50%); width:100%; height:46% }
  .hut .roof::before{ content:""; position:absolute; inset:0; background:var(--roof,#7a3c2f); clip-path:polygon(0% 100%,50% 10%,100% 100%); filter:drop-shadow(0 2px 0 rgba(0,0,0,.35)) }
  .hut .body{ position:absolute; left:50%; bottom:0; transform:translateX(-50%); width:90%; height:58%; background:var(--wall,#e9e2cc); border:2px solid #2f2626; border-radius:8px }
  .hut .door{ position:absolute; left:50%; bottom:0; transform:translateX(-50%); width:18%; height:62%; background:#7b5b3e; border:2px solid #2f2626; border-radius:6px 6px 0 0 }
  .hut .win{ position:absolute; bottom:26%; width:18%; height:32%; background:#cfe9ff; border:2px solid #2f2626; border-radius:5px }
  .hut .win.l{ left:16% } .hut .win.r{ right:16% }
  .hut.c1{ --roof:linear-gradient(#7a3c2f,#5e2b22); --wall:#f0ead6; }
  .hut.c2{ --roof:linear-gradient(#3c5c7a,#2b425e); --wall:#e5f0f4; }
  .hut.c3{ --roof:linear-gradient(#7a6a3c,#5e512b); --wall:#efe7c9; }
  .hut.c4{ --roof:linear-gradient(#6f3c7a,#4c2b5e); --wall:#f3e5f6; }
  .hut.c5{ --roof:linear-gradient(#2f7a55,#245a3f); --wall:#e3f2e9; }

  /* NPC (füttert & läuft) */
  .npc{ position:absolute; transform:translate(-50%,0); z-index:5 }
  .npc .face{ font-size:36px; filter: drop-shadow(0 6px 10px rgba(0,0,0,.15)) }
  .npc .name{ position:absolute; bottom:50px; left:50%; transform:translateX(-50%); font:600 .72rem ui-sans-serif; background:#ffffffe6; border:2px solid #2a2a2a; padding:2px 6px; border-radius:8px }

  /* Akteure & Items */
  .actor{ position:absolute; transform:translate(-50%,0); user-select:none; pointer-events:none; z-index:5 }
  .animal{ font-size:54px; line-height:1; filter: drop-shadow(0 6px 10px rgba(0,0,0,.15)) }
  .nameplate{ position:absolute; bottom:72px; left:50%; transform:translateX(-50%); font:600 .75rem ui-sans-serif; color:#20312a; background:#ffffffd9; border:2px solid #2f2626; border-radius:8px; padding:2px 6px }
  .mini-bubble{ position:absolute; bottom:90px; left:50%; transform:translateX(-50%); background:#fff; border:2px solid #2f2626; border-radius:10px; padding:4px 6px; font:700 .78rem/1.22 ui-sans-serif; color:#222; max-width:240px; filter: drop-shadow(0 4px 10px rgba(0,0,0,.12)); white-space:nowrap }
  .mini-bubble::after{ content:""; position:absolute; bottom:-8px; left:50%; transform:translateX(-50%); border-left:8px solid transparent; border-right:8px solid transparent; border-top:8px solid #fff; filter:drop-shadow(0 1px 0 #2f2626) }

  .treasure{ position:absolute; transform:translate(-50%,0); font-size:28px; line-height:1; z-index:3; filter: drop-shadow(0 6px 10px rgba(0,0,0,.15)) }
  .cave{ position:absolute; transform:translate(-50%,0); z-index:3; font-size:30px; text-align:center; }
  .cave .tag{ position:absolute; left:50%; bottom:30px; transform:translateX(-50%); background:#111; color:#fff; padding:2px 6px; border:2px solid #2a2a2a; border-radius:8px; font:700 .7rem ui-sans-serif }

  .ui{ position:absolute; top:8px; left:50%; transform:translateX(-50%); z-index:10 }
  .sound-btn{ border:2px solid #2f2626; background:#fff; border-radius:10px; padding:4px 8px; cursor:pointer; font-size:.9rem }
</style>
</head>
<body>

<!-- Kontaktblock -->
<div class="contact-block">
  <div>📧 <a href="mailto:benedikt@schackenberg.com">benedikt@schackenberg.com</a></div>
  <div>🔐 <a href="{{ '/assets/keys/benedikt-schackenberg.asc' | relative_url }}" download>PGP-Schlüssel (.asc)</a></div>
  <div class="contact-actions">
    <button class="mini" onclick="navigator.clipboard.writeText('benedikt@schackenberg.com')">E-Mail kopieren</button>
    <button class="mini" onclick="(function(){const x=document.getElementById('pgp-key');if(x)navigator.clipboard.writeText(x.innerText)})();">PGP kopieren</button>
  </div>
</div>

<!-- Scoreboard -->
<div id="score" class="score" aria-live="polite">
  <h3>🌟 Karma-Topliste</h3>
  <div id="cookline" class="cookline">👨‍🍳 Koch: –</div>
  <table id="scoreTable"></table>
  <div class="tip">Tipp: 👨‍🍳 mit <b>WASD</b> steuern (nach 3s Inaktivität übernimmt die KI).</div>
</div>

<!-- ElevenLabs optional -->
<div style="position:fixed;top:1rem;left:1rem;z-index:1000;">
  <elevenlabs-convai agent-id="agent_1001k3etgzc8ejnt6q640dcwhxww"></elevenlabs-convai>
</div>
<script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async type="text/javascript"></script>

<main>
  <section class="frame">
    <div class="header">Hasen Power</div>
    <div id="grid" class="grid"></div>
  </section>

  <section class="card" id="kontakt">
    <h2 style="margin:.2rem 0 .5rem;">Kontakt & PGP</h2>
    <div style="display:flex; gap:.75rem; flex-wrap:wrap; align-items:center; margin:.25rem 0 1rem;">
      <a class="btn" href="mailto:benedikt@schackenberg.com">📧 benedikt@schackenberg.com</a>
      <a class="btn" href="{{ '/assets/keys/benedikt-schackenberg.asc' | relative_url }}" download>⬇️ PGP-Schlüssel (.asc)</a>
      <button type="button" class="copy" onclick="(function(){const x=document.getElementById('pgp-key');if(x)navigator.clipboard.writeText(x.innerText)})();">📋 PGP in Zwischenablage</button>
    </div>
<pre id="pgp-key">-----BEGIN PGP PUBLIC KEY BLOCK-----
[... dein Key ...]
-----END PGP PUBLIC KEY BLOCK-----</pre>
  </section>
</main>

<!-- Welt -->
<div id="world" class="world">
  <div class="ui"><button id="soundBtn" class="sound-btn" aria-pressed="false" title="Sound an/aus">🔇</button></div>
  <div id="map" class="map"></div>

  <!-- zentrales, kleines Deko-Haus -->
  <div id="house" class="house">
    <div class="roof"></div>
    <div class="body"><div class="door"></div><div class="win l"></div><div class="win r"></div></div>
  </div>

  <!-- Koch-Restaurant (Position wird per JS gesetzt) -->
  <div id="restaurant" class="restaurant" style="display:none;">
    <div class="roof"></div>
    <div class="body"><div class="door"></div></div>
    <div class="chimney" id="chimney"></div>
  </div>
</div>

<script>
/* ==== kleines Bild-Grid ==== */
const IMAGES = [
  {% assign pics = site.static_files | where_exp:"f","f.path contains '/assets/img/'" | where_exp:"f","f.extname == '.png' or f.extname == '.jpg' or f.extname == '.jpeg' or f.extname == '.gif' or f.extname == '.webp'" %}
  {% for f in pics %}"{{ f.path | relative_url }}"{% unless forloop.last %},{% endunless %}{% endfor %}
];
(function(){
  const c=document.getElementById('grid'); if(!c||!IMAGES.length)return;
  const N=12; let start=0; const tiles=[];
  for(let i=0;i<N;i++){let f=document.createElement('figure');f.className='tile';let im=document.createElement('img');f.appendChild(im);c.appendChild(f);tiles.push(im);}
  const next=()=>{let set=[];for(let i=0;i<N;i++)set.push(IMAGES[(start+i)%IMAGES.length]);start=(start+N)%IMAGES.length;return set;};
  const swap=urls=>tiles.forEach((im,i)=>{im.classList.add('fade-out');setTimeout(()=>{im.src=urls[i];im.onload=()=>im.classList.remove('fade-out');},180);});
  swap(next()); setInterval(()=>swap(next()),5000);
})();

/* ===== Spiel ===== */
(function(){
  function rand(a,b){ return Math.random()*(b-a)+a; }
  function randint(a,b){ return Math.floor(rand(a,b+1)); }

  const T=32, world=document.getElementById('world'), mapEl=document.getElementById('map'), house=document.getElementById('house');
  const resto=document.getElementById('restaurant'), chimney=document.getElementById('chimney');
  let W=window.innerWidth, H=window.innerHeight, COLS=Math.floor(W/T), ROWS=Math.floor(H/T);
  let GRID=[], SOLID=new Set(), FOUNTAINS=[], CAVES=[], TREASURES=[], HUTS=[], NPCS=[];
  mapEl.style.setProperty('--cols', COLS); mapEl.style.setProperty('--tile', T+'px');

  window.addEventListener('resize', ()=>{ W=innerWidth; H=innerHeight; COLS=Math.floor(W/T); ROWS=Math.floor(H/T); mapEl.style.setProperty('--cols', COLS); genWorld(); });

  /* ===== Audio ===== */
  let audioCtx=null, soundOn=false;
  const soundBtn=document.getElementById('soundBtn');
  soundBtn.addEventListener('click', async ()=>{ if(!audioCtx) audioCtx=new (window.AudioContext||window.webkitAudioContext)(); if(audioCtx.state==='suspended') await audioCtx.resume(); soundOn=!soundOn; soundBtn.textContent=soundOn?'🔊':'🔇'; soundBtn.setAttribute('aria-pressed', soundOn); });
  function env(dur,amp){ if(!audioCtx||!soundOn) return null; const o=audioCtx.createOscillator(), g=audioCtx.createGain(); o.connect(g); g.connect(audioCtx.destination); g.gain.setValueAtTime(0,audioCtx.currentTime); g.gain.linearRampToValueAtTime(amp,audioCtx.currentTime+.01); g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+dur); return {o,g,stopAt:audioCtx.currentTime+dur}; }
  function sMeet(){ const e=env(.2,.25); if(!e)return; e.o.type='triangle'; e.o.frequency.setValueAtTime(520,audioCtx.currentTime); e.o.frequency.exponentialRampToValueAtTime(880,e.stopAt); e.o.start(); e.o.stop(e.stopAt); }
  function sGiggle(){ const e=env(.12,.22); if(!e)return; e.o.type='square'; e.o.frequency.setValueAtTime(900,audioCtx.currentTime); e.o.frequency.linearRampToValueAtTime(500,e.stopAt); e.o.start(); e.o.stop(e.stopAt); }
  function sCatch(){ const e=env(.1,.35); if(!e)return; e.o.type='square'; e.o.frequency.setValueAtTime(660,audioCtx.currentTime); e.o.frequency.exponentialRampToValueAtTime(220,e.stopAt); e.o.start(); e.o.stop(e.stopAt); }
  function sCook(){ const e=env(1.4,.18); if(!e)return; e.o.type='sine'; e.o.frequency.setValueAtTime(220,audioCtx.currentTime); e.o.frequency.linearRampToValueAtTime(440,e.stopAt); e.o.start(); e.o.stop(e.stopAt); }

  /* ===== Helper ===== */
  function solidAt(tx,ty){ return tx<0||ty<0||tx>=COLS||ty>=ROWS || SOLID.has(tx+','+ty); }
  function canAt(px,py,w,h){ if(!w)w=24; if(!h)h=24; var half=w/2, base=py; var c=[[px-half,base],[px+half,base],[px-half,base+h],[px+half,base+h]]; for(var i=0;i<c.length;i++){ var cx=Math.floor(c[i][0]/T), cy=Math.floor(c[i][1]/T); if(solidAt(cx,cy)) return false; } return true; }
  function bfs(sx,sy,gx,gy){
    var Q=[[sx,sy]], V={}, P={}; V[sx+','+sy]=1;
    while(Q.length){
      var p=Q.shift(), x=p[0], y=p[1]; if(x===gx&&y===gy) break;
      var neigh=[[1,0],[-1,0],[0,1],[0,-1]];
      for(var k=0;k<neigh.length;k++){
        var nx=x+neigh[k][0], ny=y+neigh[k][1], kk=nx+','+ny;
        if(!V[kk] && !solidAt(nx,ny)){ V[kk]=1; P[kk]=[x,y]; Q.push([nx,ny]); }
      }
    }
    var out=[], cx=gx, cy=gy, key=cx+','+cy;
    if(!P[key] && !(sx===gx&&sy===gy)) return null;
    while(!(cx===sx&&cy===sy)){ out.push([cx,cy]); var prev=P[cx+','+cy]; if(!prev) break; cx=prev[0]; cy=prev[1]; }
    out.reverse(); return out;
  }
  function randomOpenCell(){ var x=0,y=0, tries=0; do{ x=1+Math.floor(Math.random()*(COLS-2)); y=1+Math.floor(Math.random()*(ROWS-2)); tries++; if(tries>200) break; } while(solidAt(x,y)); return {x:x,y:y}; }
  function popKarma(px,py,txt){ var d=document.createElement('div'); d.className='karma-pop'; d.textContent=txt; d.style.left=Math.round(px)+'px'; d.style.top=Math.round(py)+'px'; document.body.appendChild(d); setTimeout(function(){ d.remove(); }, 950); }

  /* ===== Welt bauen ===== */
  function genWorld(){
    mapEl.innerHTML=""; GRID=[]; SOLID.clear(); FOUNTAINS=[]; CAVES=[]; TREASURES=[]; HUTS=[]; NPCS=[];
    // Labyrinth
    var mazeW=(Math.floor(W/T))|1, mazeH=(Math.floor(H/T))|1;
    var M=Array(mazeH); for(var y=0;y<mazeH;y++){ M[y]=Array(mazeW); for(var x=0;x<mazeW;x++) M[y][x]=1; }
    function carve(cx,cy){
      M[cy][cx]=0;
      var dirs=[[2,0],[0,2],[-2,0],[0,-2]].sort(function(){return Math.random()-.5;});
      for(var i=0;i<4;i++){
        var dx=dirs[i][0], dy=dirs[i][1], nx=cx+dx, ny=cy+dy;
        if(ny>0&&ny<mazeH-1&&nx>0&&nx<mazeW-1 && M[ny][nx]===1){ M[cy+dy/2][cx+dx/2]=0; carve(nx,ny); }
      }
    }
    carve(((mazeW/2)|0)|1, ((mazeH/2)|0)|1);

    for(var yy=0;yy<ROWS;yy++){
      GRID[yy]=[];
      for(var xx=0;xx<COLS;xx++){
        var cell=document.createElement('i'); cell.className='cell bg-grass'; mapEl.appendChild(cell);
        if(M[yy] && M[yy][xx]===0){ cell.className='cell bg-path'; GRID[yy][xx]=0; }
        else{ var r=Math.random(); if(r<.6) cell.classList.add('bg-hedge'); else if(r<.82) cell.classList.add('bg-forest'); else cell.classList.add('bg-tree'); GRID[yy][xx]=1; SOLID.add(xx+','+yy); }
      }
    }
    // Brunnen
    for(var i=0;i<4;i++){ var fx=2+Math.floor(Math.random()*(COLS-4)), fy=2+Math.floor(Math.random()*(ROWS-4)); GRID[fy][fx]=0; mapEl.children[fy*COLS+fx].className='cell bg-fountain'; FOUNTAINS.push({x:fx,y:fy}); }

    // Zentrales Dekohaus blockieren
    var r=house.getBoundingClientRect(); var left=Math.floor(r.left/T), right=Math.floor(r.right/T), top=Math.floor(r.top/T), bottom=Math.floor(r.bottom/T);
    for(var yb=top; yb<=bottom; yb++) for(var xb=left; xb<=right; xb++) SOLID.add(xb+','+yb);

    // Restaurant platzieren
    placeRestaurant();

    // Höhlen (Gruppenlager)
    placeCaves();

    // 10 Häuser + NPCs
    placeHuts(10);

    // Anfangsschätze
    for(var s=0;s<12;s++) spawnTreasure();
  }

  function placeRestaurant(){
    var p=randomOpenCell();
    resto.style.left=(p.x*T+T/2)+'px'; resto.style.bottom=(p.y*T)+'px';
    resto.style.display='block';
    resto.dataset.tx=p.x; resto.dataset.ty=p.y;
    // Felder begehbar halten (nur Kollision außen)
    SOLID.add(p.x+','+p.y);
  }
  function doorCell(){ return { x:parseInt(resto.dataset.tx,10), y:parseInt(resto.dataset.ty,10) }; }
  function puffSmoke(times){
    var i=0; var timer=setInterval(function(){
      var b=document.createElement('div'); b.className='smoke';
      b.style.left='50%'; b.style.top='-6px';
      chimney.appendChild(b); setTimeout(function(){ b.remove(); }, 2000);
      i++; if(i>=times) clearInterval(timer);
    }, 220);
  }

  function placeCaves(){
    var groups=['Hoppel','Kletterer','Schleichis','Royals'];
    for(var i=0;i<groups.length;i++){
      var p=randomOpenCell();
      var el=document.createElement('div'); el.className='cave'; el.style.left=(p.x*T+T/2)+'px'; el.style.bottom=(p.y*T)+'px'; el.textContent='🕳️';
      var tag=document.createElement('div'); tag.className='tag'; tag.textContent=groups[i]+': 0'; el.appendChild(tag);
      world.appendChild(el);
      CAVES.push({group:groups[i], x:p.x, y:p.y, el:el, tag:tag, stored:0});
    }
  }
  function spawnTreasure(){
    var foods=['🥕','🍓','🥜','🍄','🍎','🌰'];
    var p=randomOpenCell();
    var el=document.createElement('div'); el.className='treasure'; el.textContent=foods[randint(0,foods.length-1)];
    el.style.left=(p.x*T+T/2)+'px'; el.style.bottom=(p.y*T)+'px';
    world.appendChild(el);
    TREASURES.push({x:p.x, y:p.y, el:el, taken:false});
  }

  /* ====== Huts + NPC feeder (eindeutige Namen, Bewegung, füttern) ====== */
  var npcFaces=['🧑‍🌾','👩‍🍳','🧔','👵','🧑‍🔧','🧑‍🎨','🧙‍♀️','🧑‍🚀','🧑‍🏫','🧑‍✈️'];
  var roofClasses=['c1','c2','c3','c4','c5'];
  var npcFirst=['Tutti','Bello','Rosi','Koko','Lampi','Frau Flausch','Oma Pixel','Robo','Toni','Mia','Klara','Fiete','Lilo','Momo'];
  var npcLast=['Mampfred','Knusper','Pfefferminze','Süßholz','Quark','Zuckerhut','Pastinake','Kessel','KochFix','Topfgeist','Porridge','Löffel'];

  function uniqueNpcName(used){
    var name=""; var tries=0; do{
      name = npcFirst[randint(0,npcFirst.length-1)]+" "+npcLast[randint(0,npcLast.length-1)];
      tries++; if(tries>200) break;
    } while(used[name]); used[name]=1; return name;
  }

  function placeHuts(n){
    var used={};
    for(var i=0;i<n;i++){
      var p=randomOpenCell();
      var hut=document.createElement('div'); hut.className='hut '+roofClasses[randint(0,roofClasses.length-1)];
      hut.style.left=(p.x*T+T/2)+'px'; hut.style.bottom=(p.y*T)+'px';
      hut.innerHTML='<div class="roof"></div><div class="body"><div class="door"></div><div class="win l"></div><div class="win r"></div></div>';
      world.appendChild(hut);

      // NPC
      var npcName=uniqueNpcName(used);
      var npc=document.createElement('div'); npc.className='npc'; npc.style.left=(p.x*T+T/2)+'px'; npc.style.bottom=(p.y*T)+'px';
      npc.innerHTML='<div class="face">'+npcFaces[i % npcFaces.length]+'</div><div class="name">'+npcName+'</div>';
      world.appendChild(npc);

      // NPC-Objekt
      var obj={ x:p.x*T+T/2, y:p.y*T, tx:p.x, ty:p.y, speed:0.9, el:npc, hutX:p.x, hutY:p.y, name:npcName, feedCooldown:0, path:[] };
      NPCS.push(obj);
      HUTS.push({x:p.x,y:p.y, el:hut, npc:obj, timer:setInterval(function(px,py){
        // droppt Snack vor der Hütte
        var dx=px+randint(-1,1), dy=py+randint(-1,1); if(solidAt(dx,dy)) { dx=px; dy=py; }
        var el=document.createElement('div'); el.className='treasure'; el.textContent=(['🥕','🍓','🍎','🥜','🍄'])[randint(0,4)];
        el.style.left=(dx*T+T/2)+'px'; el.style.bottom=(dy*T)+'px'; world.appendChild(el);
        TREASURES.push({x:dx,y:dy,el:el,taken:false,hutDrop:true});
      }.bind(null,p.x,p.y), 7000+randint(0,4000))});
    }
  }

  function steerNPC(n){
    // nahe Tiere füttern
    if(n.feedCooldown>0) n.feedCooldown--;
    var targetAnimal=null, best=1e9;
    for(var i=0;i<actors.length;i++){
      var a=actors[i]; if(a.dead || a.state==='carried') continue;
      var d=Math.hypot(a.x-n.x, a.y-n.y);
      if(d<140 && d<best){ best=d; targetAnimal=a; }
    }
    if(targetAnimal && n.feedCooldown<=0){
      // gehe näher ran
      var gx=Math.floor(targetAnimal.x/T), gy=Math.floor(targetAnimal.y/T);
      n.path = bfs(Math.floor(n.x/T), Math.floor(n.y/T), gx, gy) || n.path;
      // wenn sehr nah -> füttern
      if(best<22){
        n.feedCooldown=120; // ~2s
        // direkter Feed: Spawne Essen unter dem Tier
        var el=document.createElement('div'); el.className='treasure'; el.textContent=(['🥕','🍓','🍎','🥜','🍄'])[randint(0,4)];
        el.style.left=(Math.floor(targetAnimal.x/T)*T+T/2)+'px'; el.style.bottom=(Math.floor(targetAnimal.y/T)*T)+'px'; world.appendChild(el);
        TREASURES.push({x:Math.floor(targetAnimal.x/T),y:Math.floor(targetAnimal.y/T),el:el,taken:false});
        say(targetAnimal,"Danke, "+n.name.split(' ')[0]+"! ❤️",1300);
        targetAnimal.mood='lieb';
        addKarma(targetAnimal,2);
        sMeet();
      }
    }

    // Bewegung: um Hütte patrouillieren, ansonsten zum nächsten Pfadziel
    if(!n.path || n.path.length===0){
      // wähle einen Punkt um die Hütte herum
      var rx=n.hutX + randint(-3,3), ry=n.hutY + randint(-3,3);
      if(rx<1)rx=1; if(ry<1)ry=1; if(rx>COLS-2)rx=COLS-2; if(ry>ROWS-2)ry=ROWS-2;
      if(!solidAt(rx,ry)) n.path = bfs(Math.floor(n.x/T), Math.floor(n.y/T), rx, ry) || [];
    }else{
      var step=n.path[0], tx=step[0]*T+T/2, ty=step[1]*T, dx=tx-n.x, dy=ty-n.y, m=Math.hypot(dx,dy)||1;
      var nx=n.x+(dx/m)*n.speed, ny=n.y+(dy/m)*n.speed; if(canAt(nx,ny)){ n.x=nx; n.y=ny; } else { n.path.shift(); }
      if(Math.hypot(dx,dy)<6) n.path.shift();
    }
    n.el.style.left=n.x+'px'; n.el.style.bottom=n.y+'px';
  }

  /* ====== Namen & Tiere ====== */
  var usedNames={};
  var titleA=["Sir","Lady","Meister","Baron","Graf","Dr.","Captain","Professor","Sultan","Queen","König","Fräulein"];
  var funnyB=["Flauschi","Wuseline","Zappel","Turbo","Pixel","Kicher","Hopps","Nüssli","Schnuff","Mopps","Quaki","Wolke","Knusper","Wackel","Fuzzy","Möhrex","Krümel","Flummi"];
  function uniqueName(){ var n=""; var tries=0; do{ n = titleA[randint(0,titleA.length-1)]+" "+funnyB[randint(0,funnyB.length-1)]+(Math.random()<.35?("-"+funnyB[randint(0,funnyB.length-1)]):""); tries++; if(tries>200) break; } while(usedNames[n]); usedNames[n]=1; return n; }

  var SPECIES=[ {emoji:"🐰", group:"Hoppel"}, {emoji:"🐿️", group:"Kletterer"}, {emoji:"🦝", group:"Kletterer"},
                {emoji:"🦊", group:"Schleichis"}, {emoji:"🦡", group:"Schleichis"}, {emoji:"🐗", group:"Schleichis"},
                {emoji:"🦌", group:"Royals"}, {emoji:"🐻", group:"Royals"}, {emoji:"🦉", group:"Royals"}, {emoji:"🐦", group:"Royals"}, {emoji:"🐸", group:"Royals"} ];
  var actors=[], MAX=14, MIN=10;

  function makeActor(sp,x,y){
    var el=document.createElement('div'); el.className='actor';
    var span=document.createElement('span'); span.className='animal'; span.textContent=sp.emoji;
    var label=document.createElement('div'); label.className='nameplate';
    el.appendChild(span); el.appendChild(label); world.appendChild(el);
    var a={el:el, emoji:sp.emoji, group:sp.group, name:uniqueName(), x:x*T+T/2, y:y*T, speed:1+Math.random()*0.5, stamina:100,
           state:'roam', goal:null, talking:false, lastTalk:0, karma:0, carrying:null, mood:''};
    label.textContent=a.name;
    return a;
  }
  function spawnAnimal(){ if(actors.filter(function(a){return !a.dead;}).length>=MAX) return; var sp=SPECIES[randint(0,SPECIES.length-1)], p=randomOpenCell(); var a=makeActor(sp,p.x,p.y); actors.push(a); }
  for(var i=0;i<MIN;i++) spawnAnimal();
  setInterval(function(){ var alive=actors.filter(function(a){return !a.dead;}).length; if(alive<MIN) for(var i=0;i<MIN-alive;i++) spawnAnimal(); else if(alive<MAX && Math.random()<.5) spawnAnimal(); }, 4000);

  /* ====== Scoreboard ====== */
  var scoreTable=document.getElementById('scoreTable'), cookline=document.getElementById('cookline');
  function updateScoreboard(){
    actors.sort(function(a,b){ return b.karma - a.karma; });
    var rows="";
    for(var i=0;i<Math.min(9,actors.length);i++){
      var a=actors[i]; if(a.dead) continue;
      rows += '<tr><td><span class="avatar">'+a.emoji+'</span>'+a.name+'</td><td style="text-align:right">'+a.karma+' ⚡</td></tr>';
    }
    if(rows==="") rows='<tr><td colspan="2">Noch keine Punkte …</td></tr>';
    scoreTable.innerHTML=rows;
    cookline.innerHTML='👨‍🍳 '+cook.name+': '+cook.scoreCook+' gekocht • '+cook.scoreLoot+' Beute';
  }
  function addKarma(a,delta){ a.karma+=delta; popKarma(a.x, H - a.y, (delta>0?'+':'')+delta+' ⚡'); updateScoreboard(); }
  function say(actor, text, ms){ if(actor.dead) return; if(!actor.mini){ actor.mini=document.createElement('div'); actor.mini.className='mini-bubble'; actor.el.appendChild(actor.mini); } actor.mini.textContent=text; actor.mini.style.display='block'; setTimeout(function(){ if(actor.mini) actor.mini.style.display='none'; }, ms||1600); }

  /* ====== Dialoge ====== */
  var DLINES=[
    function(a,b){return a+': „CI/CD – Carrot Integration/Delivery!“';},
    function(a,b){return b+': „Load-Möhre balanciert.“';},
    function(a,b){return a+': „Pair-Hoppeln?“';},
    function(a,b){return b+': „Nur mit Snacks!“';},
    function(a,b){return a+': „Ich cache heut die Nüsse.“';},
    function(a,b){return b+': „TLS: Tolle Löffel Sicherheit!“';},
  ];
  function startDialogue(A,B){
    if(!A||!B||A.dead||B.dead||A.talking||B.talking) return;
    A.talking=B.talking=true; A.state=B.state='talk'; A.goal=B.goal=null;
    var total=30000, step=3600, t=0;
    sMeet(); say(A,"Hi "+B.name.split(' ')[0]+"!",1000); say(B,"Hi "+A.name.split(' ')[0]+"!",1000);
    var timer=setInterval(function(){
      if(A.dead||B.dead){ clearInterval(timer); A.talking=B.talking=false; return; }
      var L=DLINES[randint(0,DLINES.length-1)];
      if(Math.random()<.5) say(A,L(A.name.split(' ')[0],B.name.split(' ')[0]),3000); else say(B,L(A.name.split(' ')[0],B.name.split(' ')[0]),3000);
      t+=step; if(t>=total){ clearInterval(timer); A.talking=B.talking=false; A.lastTalk=B.lastTalk=Date.now(); say(A,"*kicher* 🤭",900); say(B,"*kicher* 🤭",900); sGiggle(); addKarma(A,1); addKarma(B,1); }
    }, step);
  }
  setInterval(function(){ var pool=actors.filter(function(a){return !a.dead && !a.talking && a.state!=='carried' && Date.now()-a.lastTalk>45000;}); for(var i=0;i<pool.length-1;i+=2) startDialogue(pool[i], pool[i+1]); }, 5000);

  /* ====== Koch (WASD + KI, Restaurant) ====== */
  var cookNames=["Chef Carbonara","Onkel Kasserolle","Koch Kichererbse","Meister Mampf","Sir Schmor","Pan Peter","Saucier Sören"];
  var cook={ name:cookNames[randint(0,cookNames.length-1)], x:T*2+T/2, y:T*2, speed:1.2, path:[], carrying:null, carryingLoot:false, scoreCook:0, scoreLoot:0, stuck:0 };
  var cookEl=document.createElement('div'); cookEl.className='actor'; cookEl.style.zIndex=7;
  cookEl.innerHTML='<span class="animal">👨‍🍳</span><div class="nameplate">'+cook.name+'</div>'; world.appendChild(cookEl);

  function placeCookOnOpen(){ var sx=Math.floor(cook.x/T), sy=Math.floor(cook.y/T); if(solidAt(sx,sy)){ var p=randomOpenCell(); cook.x=p.x*T+T/2; cook.y=p.y*T; } }
  placeCookOnOpen();

  var keys={w:false,a:false,s:false,d:false}, manualUntil=0;
  document.addEventListener('keydown', function(e){ var k=e.key.toLowerCase(); if(k==='w'||k==='a'||k==='s'||k==='d'){ keys[k]=true; manualUntil=Date.now()+3000; cook.path=[]; }});
  document.addEventListener('keyup', function(e){ var k=e.key.toLowerCase(); if(keys[k]!==undefined){ keys[k]=false; }});
  function moveCookManual(){ var vx=(keys.a?-1:0)+(keys.d?1:0), vy=(keys.s?1:0)+(keys.w?-1:0); if(vx===0&&vy===0) return; var m=Math.sqrt(vx*vx+vy*vy); vx/=m; vy/=m; var nx=cook.x+vx*cook.speed*1.8, ny=cook.y+vy*cook.speed*1.8; if(canAt(nx,ny)){ cook.x=nx; cook.y=ny; } }

  function targetByKarma(){
    var list=actors.filter(function(a){return !a.dead && a.state!=='carried';});
    if(!list.length) return null;
    list.sort(function(a,b){ return (b.karma - a.karma) || (Math.hypot(a.x-cook.x,a.y-cook.y) - Math.hypot(b.x-cook.x,b.y-cook.y)); });
    return list[0];
  }
  function planHunt(){
    if(Date.now()<manualUntil) return;
    if(cook.carrying || cook.carryingLoot){
      var d=doorCell(); cook.path = bfs(Math.floor(cook.x/T), Math.floor(cook.y/T), d.x, d.y) || []; return;
    }
    // reichste Höhle beklauen
    if(Math.random()<.5){
      var richest=null, best=0;
      for(var i=0;i<CAVES.length;i++){ if(CAVES[i].stored>best){ best=CAVES[i].stored; richest=CAVES[i]; } }
      if(richest && best>0){ cook.path = bfs(Math.floor(cook.x/T), Math.floor(cook.y/T), richest.x, richest.y) || []; return; }
    }
    var t=targetByKarma(); if(t){ cook.path = bfs(Math.floor(cook.x/T), Math.floor(cook.y/T), Math.floor(t.x/T), Math.floor(t.y/T)) || []; return; }
    // Patrouille: zu zufälliger Hütte
    if(HUTS.length){ var h=HUTS[randint(0,HUTS.length-1)]; cook.path = bfs(Math.floor(cook.x/T), Math.floor(cook.y/T), h.x, h.y) || []; }
  }
  setInterval(planHunt, 1200);

  /* ====== Tiere (Aufgaben) ====== */
  function nearestTreasure(a){
    var best=null, bd=1e9;
    for(var i=0;i<TREASURES.length;i++){ var t=TREASURES[i]; if(t.taken) continue; var d=Math.abs(t.x-Math.floor(a.x/T))+Math.abs(t.y-Math.floor(a.y/T)); if(d<bd){ bd=d; best=t; } }
    return best;
  }
  function caveForGroup(g){
    for(var i=0;i<CAVES.length;i++) if(CAVES[i].group===g) return CAVES[i];
    return CAVES[0];
  }
  function nearestHut(a){
    var best=null, bd=1e9; for(var i=0;i<HUTS.length;i++){ var h=HUTS[i], d=Math.abs(h.x-Math.floor(a.x/T))+Math.abs(h.y-Math.floor(a.y/T)); if(d<bd){ bd=d; best=h; } } return best;
  }

  function steerAnimal(a){
    if(a.dead || a.talking || a.state==='carried') return;
    a.stamina -= 0.02;

    // Flucht vor Koch
    var dd=Math.hypot(a.x-cook.x, a.y-cook.y);
    if(dd<9*T){
      var vx=a.x-cook.x, vy=a.y-cook.y;
      var tx=Math.max(0,Math.min(COLS-1, Math.floor(a.x/T + Math.sign(vx)*4)));
      var ty=Math.max(0,Math.min(ROWS-1, Math.floor(a.y/T + Math.sign(vy)*4)));
      a.goal=bfs(Math.floor(a.x/T), Math.floor(a.y/T), tx, ty) || a.goal;
    }

    // zum Essen (Hütte) wenn hungrig
    if(a.stamina<60 && !a.carrying && !a.goal){
      var h=nearestHut(a); if(h) a.goal=bfs(Math.floor(a.x/T), Math.floor(a.y/T), h.x, h.y) || [];
    }

    // Schatz suchen/bringen
    if(!a.carrying && !a.goal){
      var tr=nearestTreasure(a);
      if(tr){ a.targetTreasure=tr; a.goal=bfs(Math.floor(a.x/T), Math.floor(a.y/T), tr.x, tr.y) || []; }
    }
    if(a.carrying && !a.goal){
      var cave=caveForGroup(a.group); a.goal=bfs(Math.floor(a.x/T), Math.floor(a.y/T), cave.x, cave.y) || [];
    }

    if(a.goal && a.goal.length){
      var cell=a.goal[0], tx=cell[0]*T+T/2, ty=cell[1]*T, dx=tx-a.x, dy=ty-a.y, m=Math.hypot(dx,dy)||1;
      var nx=a.x+(dx/m)*a.speed, ny=a.y+(dy/m)*a.speed; if(canAt(nx,ny)){ a.x=nx; a.y=ny; } else { a.goal.shift(); }
      if(Math.hypot(dx,dy)<6) a.goal.shift();

      // Abholen / Abgeben
      if(!a.carrying && a.targetTreasure && Math.floor(a.x/T)===a.targetTreasure.x && Math.floor(a.y/T)===a.targetTreasure.y && !a.targetTreasure.taken){
        a.carrying=a.targetTreasure; a.targetTreasure.taken=true; if(a.carrying.el) a.carrying.el.style.display='none';
        addKarma(a,2); // gefunden
        var cave=caveForGroup(a.group); a.goal=bfs(Math.floor(a.x/T), Math.floor(a.y/T), cave.x, cave.y) || [];
      }
      if(a.carrying){
        var cave2=caveForGroup(a.group);
        if(Math.floor(a.x/T)===cave2.x && Math.floor(a.y/T)===cave2.y){
          cave2.stored++; cave2.tag.textContent=cave2.group+': '+cave2.stored; a.carrying=null; addKarma(a,3); // abgegeben
          if(Math.random()<.6) spawnTreasure();
        }
      }

      // an Hütte essen (lieb)
      for(var i=0;i<HUTS.length;i++){
        var h=HUTS[i];
        if(Math.floor(a.x/T)===h.x && Math.floor(a.y/T)===h.y){
          a.stamina=100; a.mood='lieb'; addKarma(a,1); say(a,"Nom nom 😋❤️",1000);
        }
      }
    } else if(Math.random()<.02){ var p=randomOpenCell(); a.goal=bfs(Math.floor(a.x/T), Math.floor(a.y/T), p.x, p.y) || []; }

    a.el.style.left=a.x+'px'; a.el.style.bottom=a.y+'px';
  }

  /* ====== Loop ====== */
  function updateCook(){
    if(Date.now()<manualUntil){ moveCookManual(); cook.stuck=0; }
    else if(cook.path && cook.path.length){
      var step=cook.path[0], tx=step[0]*T+T/2, ty=step[1]*T, dx=tx-cook.x, dy=ty-cook.y, m=Math.hypot(dx,dy)||1;
      var nx=cook.x+(dx/m)*cook.speed*1.25, ny=cook.y+(dy/m)*cook.speed*1.25;
      if(canAt(nx,ny)){ cook.x=nx; cook.y=ny; cook.stuck=0; } else { cook.path.shift(); cook.stuck++; }
      if(Math.hypot(dx,dy)<6){ cook.path.shift(); }
      if(cook.stuck>8){ cook.path=[]; cook.stuck=0; }
    } else { planHunt(); }

    // Fangen / Beute
    if(!cook.carrying && !cook.carryingLoot){
      for(var i=0;i<actors.length;i++){
        var a=actors[i]; if(a.dead || a.state==='carried') continue;
        var d=Math.hypot(a.x-cook.x, a.y-cook.y);
        if(d<20){ sCatch(); a.state='carried'; a.el.style.display='none'; cook.carrying=a; break; }
      }
      // Höhle beklauen
      for(var j=0;j<CAVES.length && !cook.carrying;j++){
        var c=CAVES[j]; var dd=Math.hypot(c.x*T+T/2 - cook.x, c.y*T - cook.y);
        if(dd<18 && c.stored>0){ c.stored--; c.tag.textContent=c.group+': '+c.stored; cook.carryingLoot=true; break; }
      }
    } else {
      var dcell=doorCell();
      if(Math.floor(cook.x/T)===dcell.x && Math.floor(cook.y/T)===dcell.y){
        if(cook.carrying){ cook.carrying.dead=true; cook.carrying=null; cook.scoreCook++; sCook(); puffSmoke(8); }
        if(cook.carryingLoot){ cook.carryingLoot=false; cook.scoreLoot++; }
        updateScoreboard(); planHunt();
      }
    }
    cookEl.style.left=cook.x+'px'; cookEl.style.bottom=cook.y+'px';
  }

  function loop(){
    updateCook();
    for(var n=0;n<NPCS.length;n++) steerNPC(NPCS[n]);
    for(var k=0;k<actors.length;k++) steerAnimal(actors[k]);
    requestAnimationFrame(loop);
  }

  // Start
  genWorld();
  // Score
  updateScoreboard();
  // Erste Gespräche
  setTimeout(function(){ var pool=actors.slice(0,Math.min(actors.length-1,4)); for(var i=0;i<pool.length-1;i+=2) (function(a,b){ setTimeout(function(){ startDialogue(a,b); }, i*400); })(pool[i],pool[i+1]); }, 1000);
  planHunt();
  requestAnimationFrame(loop);
})();
</script>
</body>
</html>
