---
title: "Profil Benedikt Schackenberg"
layout: default
permalink: /
description: "Retro-Intro + Digitale Pixeluhr mit Umbau-Animation, Datum, Heiligabend-Countdown, Video & Kontakt"
---

<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Benedikt Schackenberg</title>
<link rel="icon" href="data:,">
<style>
  :root{ --bg:#0e1418; --fg:#f2f5f7; --shadow:0 12px 26px rgba(0,0,0,.25) }
  *{box-sizing:border-box} html,body{height:100%}
  body{margin:0;background:var(--bg);color:var(--fg);font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial;overflow:hidden}

  /* Hintergrund */
  .watermark{position:fixed;inset:0;z-index:0;pointer-events:none;
    background:
      repeating-linear-gradient(25deg,rgba(255,255,255,.03) 0 2px,transparent 2px 14px),
      radial-gradient(1200px 700px at 20% 10%, rgba(125,211,111,.06), transparent 60%),
      radial-gradient(1000px 600px at 85% 80%, rgba(255,210,87,.06), transparent 60%),
      var(--bg);
  }
  .wm-text{position:absolute;inset:0;display:grid;place-items:center;opacity:.06;font-weight:900;text-align:center;line-height:1.1;font-size:clamp(36px,8vw,84px);letter-spacing:.02em;filter:drop-shadow(0 4px 14px rgba(0,0,0,.35));user-select:none}

  /* Video oben links */
  .videoBox{position:fixed;top:12px;left:12px;z-index:30;width:min(360px,32vw)}
  .videoBox iframe{width:100%;aspect-ratio:16/9;border-radius:12px;box-shadow:var(--shadow);border:2px solid #222}
  .videoBox .caption{margin-top:6px;font:700 13px/1.3 ui-sans-serif;text-align:center}
  .videoBox .caption a{color:#ffd257;text-decoration:none}
  .videoBox .caption a:hover{text-decoration:underline}

  /* Kontakt oben rechts */
  .contact{position:fixed;top:12px;right:12px;z-index:20;background:#0d0f12f0;border:1px solid #222a2f;border-radius:12px;box-shadow:var(--shadow);padding:10px 12px;min-width:260px}
  .contact a{color:#eaf2f6;text-decoration:none;border-bottom:1px dotted #6b7a86}
  .contact-actions{display:flex;gap:8px;margin-top:6px}
  .mini{border:1px solid #2a343b;background:#11181d;color:#eaf2f6;border-radius:8px;padding:6px 10px;cursor:pointer;font-size:.85rem}
  .mini:hover{background:#152027}

  /* Bühne */
  .stage{position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:22px;z-index:10;padding:16px}

  /* Name */
  .titleWrap{display:flex;justify-content:center;width:100%}
  .title{display:flex;white-space:nowrap;gap:.18em;filter:drop-shadow(0 8px 22px rgba(0,0,0,.35))}
  .px{
    position:relative;display:inline-block;font-weight:900;font-size:clamp(24px,9vw,92px);letter-spacing:.02em;
    text-shadow:0 0 0 #0008, .6ch .6ch 0 #0006, 1.2ch 1.2ch 0 #0004;
    box-shadow:0 0 0 .15ch #0b0f12 inset;border-radius:.4ch;padding:.02em .06em;
    transform:translateY(-120vh) rotate(-8deg) scale(.8); opacity:0;
    color: var(--col,#f2f5f7); will-change:transform,opacity;
  }
  .falling{ animation:fallIn var(--fall,520ms) cubic-bezier(.2,.8,.2,1) forwards }
  @keyframes fallIn{
    0%   { transform:translateY(-120vh) rotate(-8deg) scale(.8); opacity:0 }
    60%  { transform:translateY(18px)    rotate( 1deg) scale(1.04); opacity:1 }
    78%  { transform:translateY(-8px)    rotate(-1deg) scale(.98) }
    100% { transform:translateY(0)       rotate( 0deg) scale(1);   opacity:1 }
  }

  /* Digital-Uhr */
  .clockArea{display:flex;flex-direction:column;align-items:center;gap:10px}
  .digital{position:relative;width:min(86vw,860px);height:min(30vw,220px);
    background:#0d1014;border:3px solid #222a2f;border-radius:18px;
    box-shadow:inset 0 0 0 6px #121821, 0 10px 26px #0006;overflow:hidden;
  }
  .grid{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:100%;height:100%}
  .pixel{position:absolute;width:14px;height:14px;border-radius:3px;background:#9ac1ff;box-shadow:0 0 0 1px #0006 inset, 0 2px 0 #0004;transition:transform .45s cubic-bezier(.2,.8,.2,1), opacity .25s}
  .pixel.h{background:#ffd257} /* Stunden */
  .pixel.m{background:#7dd36f} /* Minuten */
  .pixel.pulse{animation:pulse .38s ease-out}
  @keyframes pulse{
    0%{transform:scale(1) translate(var(--x,0),var(--y,0)); box-shadow:0 0 0 1px #fff8 inset, 0 0 0 0 rgba(255,255,255,.6)}
    100%{transform:scale(1) translate(var(--x,0),var(--y,0)); box-shadow:0 0 0 1px #0006 inset, 0 0 20px 6px rgba(255,255,255,0)}
  }
  /* Ghost-Plan (Vorschau) */
  .ghost{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);pointer-events:none;opacity:.18;filter:contrast(1.1)}
  .ghost .gpx{position:absolute;width:14px;height:14px;border-radius:3px;background:#86a9ff}

  /* Doppelpunkt */
  .colonDot{position:absolute;width:12px;height:12px;border-radius:3px;background:#eaf2f6;box-shadow:0 0 0 1px #0006 inset, 0 2px 0 #0004;opacity:.85;transition:opacity .35s}

  /* Material / Schutt */
  .yard{position:absolute;bottom:8px;left:10px;font:800 12px ui-sans-serif;opacity:.85}
  .dump{position:absolute;bottom:8px;right:10px;font:800 12px ui-sans-serif;opacity:.85}
  .pile{display:inline-block;margin-left:6px}

  /* Akteure */
  .workers{position:absolute;inset:0;pointer-events:none}
  .actor{
    position:absolute;transform:translate(-50%,-50%);
    font-size:22px; filter:drop-shadow(0 2px 4px rgba(0,0,0,.6));
    animation:wiggle .8s steps(2,end) infinite;
  }
  .actor .bubble{position:absolute;left:50%;top:-22px;transform:translateX(-50%);font:800 10px ui-sans-serif;background:#ffffffd9;color:#111;border:2px solid #2f2626;border-radius:8px;padding:0 6px;white-space:nowrap;display:none}
  @keyframes wiggle{
    0%{transform:translate(-50%,-50%) rotate(-2deg)}
    50%{transform:translate(-50%,-50%) rotate(2deg)}
    100%{transform:translate(-50%,-50%) rotate(-2deg)}
  }

  /* Ziegel */
  .brick{position:absolute;width:14px;height:14px;border-radius:3px;background:#cfe3ff;box-shadow:0 0 0 1px #0006 inset, 0 2px 0 #0004;transform:translate(-50%,-50%)}
  .brick.spin{animation:spin 1.2s linear infinite}
  @keyframes spin{ to{ transform:translate(-50%,-50%) rotate(360deg) } }

  /* Datum / Countdown */
  .dateRow{font:800 14px/1.3 ui-sans-serif;opacity:.9}
  .footer{position:fixed;bottom:10px;right:12px;opacity:.6;font-size:12px;z-index:12}
</style>
</head>
<body>

<!-- Hintergrund -->
<div class="watermark"><div class="wm-text"><div><span>Benedikt Schackenberg</span></div></div></div>

<!-- Video oben links -->
<div class="videoBox">
  <iframe src="https://www.youtube-nocookie.com/embed/8R92e_U0fzI?autoplay=1&mute=1&loop=1&playlist=8R92e_U0fzI"
          title="YouTube video" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
  <div class="caption"><a href="https://blobtv.de" target="_blank">meta-autistische Comedy rund um die Uhr</a></div>
</div>

<!-- Kontakt oben rechts -->
<div class="contact">
  <div>📧 <a href="mailto:benedikt@schackenberg.com">benedikt@schackenberg.com</a></div>
  <div>🔐 <a href="{{ '/assets/keys/benedikt-schackenberg.asc' | relative_url }}" download>PGP-Schlüssel (.asc)</a></div>
  <div class="contact-actions">
    <button class="mini" onclick="navigator.clipboard.writeText('benedikt@schackenberg.com')">E-Mail kopieren</button>
    <button class="mini" onclick="(function(){const t=document.getElementById('pgp-key'); if(t){navigator.clipboard.writeText(t.innerText)}})()">PGP kopieren</button>
  </div>
</div>

<!-- Bühne -->
<div class="stage">
  <div class="titleWrap"><div id="title" class="title" aria-label="Benedikt Schackenberg"></div></div>
  <div class="clockArea">
    <div class="digital" id="digital">
      <div class="grid" id="grid"></div>
      <div class="ghost" id="ghost"></div>
      <div class="yard">Material:<span class="pile" id="pile">🧱🧱🧱🧱🧱</span></div>
      <div class="dump">Schutt:<span class="pile" id="dump">🗿</span></div>
      <div class="workers" id="workers"></div>
    </div>
    <div class="dateRow" id="dateRow">–</div>
    <div class="badge" id="tzLabel">Europa/Berlin</div>
  </div>
</div>

<!-- Versteckter PGP -->
<pre id="pgp-key" style="position:fixed;left:-9999px;top:-9999px">
-----BEGIN PGP PUBLIC KEY BLOCK-----
...dein Key...
-----END PGP PUBLIC KEY BLOCK-----
</pre>

<div class="footer">© <span id="y"></span> Benedikt Schackenberg</div>

<script>
(function(){
  document.getElementById('y').textContent=new Date().getFullYear();

  /* ===== Name – bunte Fall-Animation 90s ===== */
  const titleEl=document.getElementById('title');
  const nameText="Benedikt Schackenberg";
  const colors=["#7dd36f","#ffd257","#9ac1ff","#ffa6e7","#f5a3a3","#a8f0c6","#ff9f7a","#b2f07f","#f5d0fe","#c2e7ff","#ffd6a5","#b8f2e6"];
  const perCharFall=520, betweenChars=90, holdVisibleMs=90000; let nameLoop=null;

  function buildName(){
    clearTimeout(nameLoop); titleEl.innerHTML="";
    const frag=document.createDocumentFragment(); let i=0;
    for(const ch of nameText){
      const s=document.createElement('span'); s.className='px';
      const col=colors[i%colors.length]; s.style.setProperty('--col',col); s.style.color=col; s.textContent=ch;
      frag.appendChild(s); i++;
    } titleEl.appendChild(frag); autoScaleOneLine();
  }
  function autoScaleOneLine(){
    const wrap=document.querySelector('.titleWrap');
    const max=wrap.clientWidth-16; const w=titleEl.getBoundingClientRect().width;
    titleEl.style.transform=`scale(${Math.min(1,max/w)})`;
  }
  window.addEventListener('resize', autoScaleOneLine);
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  async function playName(){ for(const s of [...titleEl.querySelectorAll('.px')]){ s.style.setProperty('--fall', perCharFall+'ms'); s.classList.remove('falling'); void s.offsetWidth; s.classList.add('falling'); await sleep(perCharFall+betweenChars);} nameLoop=setTimeout(()=>{buildName();playName();}, holdVisibleMs); }
  buildName(); playName();

  /* ===== Uhr & Umbau ===== */
  const tz='Europe/Berlin';
  const grid=document.getElementById('grid'), ghost=document.getElementById('ghost'), workersLayer=document.getElementById('workers');
  const tzLabel=document.getElementById('tzLabel'), pileEl=document.getElementById('pile'), dumpEl=document.getElementById('dump');
  const dateRow=document.getElementById('dateRow');

  // 5×7 Font
  const DIGITS={ "0":[1,1,1,1,1, 1,0,0,0,1, 1,0,1,0,1, 1,0,1,0,1, 1,0,1,0,1, 1,0,0,0,1, 1,1,1,1,1],
    "1":[0,1,1,0,0, 0,0,1,0,0, 0,0,1,0,0, 0,0,1,0,0, 0,0,1,0,0, 0,0,1,0,0, 0,1,1,1,0],
    "2":[1,1,1,1,1, 0,0,0,0,1, 0,0,0,0,1, 0,1,1,1,1, 1,0,0,0,0, 1,0,0,0,0, 1,1,1,1,1],
    "3":[1,1,1,1,1, 0,0,0,0,1, 0,0,0,0,1, 0,0,1,1,1, 0,0,0,0,1, 0,0,0,0,1, 1,1,1,1,1],
    "4":[1,0,0,1,0, 1,0,0,1,0, 1,0,0,1,0, 1,1,1,1,1, 0,0,0,1,0, 0,0,0,1,0, 0,0,0,1,0],
    "5":[1,1,1,1,1, 1,0,0,0,0, 1,0,0,0,0, 1,1,1,1,0, 0,0,0,0,1, 0,0,0,0,1, 1,1,1,1,0],
    "6":[1,1,1,1,0, 1,0,0,0,0, 1,0,0,0,0, 1,1,1,1,0, 1,0,0,0,1, 1,0,0,0,1, 0,1,1,1,0],
    "7":[1,1,1,1,1, 0,0,0,0,1, 0,0,0,1,0, 0,0,1,0,0, 0,1,0,0,0, 0,1,0,0,0, 0,1,0,0,0],
    "8":[0,1,1,1,0, 1,0,0,0,1, 1,0,0,0,1, 0,1,1,1,0, 1,0,0,0,1, 1,0,0,0,1, 0,1,1,1,0],
    "9":[0,1,1,1,0, 1,0,0,0,1, 1,0,0,0,1, 0,1,1,1,1, 0,0,0,0,1, 0,0,0,0,1, 1,1,1,1,0] };

  // Layout & Pixelpool
  const px=14, gap=4, cols=5, rows=7, digitGap=10, groupGap=20;
  function layout(){
    const box=grid.getBoundingClientRect();
    const wDigit = cols*px + (cols-1)*gap;
    const wGroup = wDigit*2 + digitGap;
    const total  = wGroup*2 + groupGap;
    const sx=(box.width-total)/2;
    const sy=(box.height - (rows*px+(rows-1)*gap))/2;
    return (di,c,r)=>{
      const gOff = di<2 ? 0 : (wGroup + groupGap);
      const dOff = (di%2)*(wDigit + digitGap);
      return {x:sx + gOff + dOff + c*(px+gap), y: sy + r*(px+gap)};
    };
  }
  const PIXELS=[]; for(let i=0;i<160;i++){ const d=document.createElement('div'); d.className='pixel'; grid.appendChild(d); PIXELS.push(d); }
  const colonTop=document.createElement('div'), colonBot=document.createElement('div'); colonTop.className='colonDot'; colonBot.className='colonDot'; grid.appendChild(colonTop); grid.appendChild(colonBot);

  // Anzeige
  let current="0000"; let lastSec=-1;

  function render(timeStr){
    const pos=layout(); const digits=[timeStr[0],timeStr[1],timeStr[2],timeStr[3]]; let idx=0;
    for(let di=0; di<4; di++){
      const map=DIGITS[digits[di]];
      for(let r=0;r<rows;r++){
        for(let c=0;c<cols;c++){
          const p=PIXELS[idx++], on = map[r*cols+c]===1;
          const {x,y}=pos(di,c,r);
          p.style.setProperty('--x', x+'px'); p.style.setProperty('--y', y+'px');
          p.style.transform=`translate(${x}px,${y}px)`;
          p.style.opacity=on?1:0.08;
          p.classList.toggle('h', di<2); p.classList.toggle('m', di>=2);
          p.dataset.on=on?1:0; p.dataset.x=x; p.dataset.y=y;
        }
      }
    }
    // Doppelpunkt
    const box=grid.getBoundingClientRect(), wDigit=cols*px+(cols-1)*gap, height=rows*px+(rows-1)*gap;
    const y0=(box.height-height)/2, cx=box.width/2-6;
    colonTop.style.transform=`translate(${cx}px, ${y0+height*0.32}px)`;
    colonBot.style.transform=`translate(${cx}px, ${y0+height*0.68}px)`;
  }

  function fmtParts(d=new Date()){
    const p=new Intl.DateTimeFormat('de-DE',{timeZone:tz,hour:'2-digit',minute:'2-digit',second:'2-digit',weekday:'long',day:'2-digit',month:'long',year:'numeric',hour12:false}).formatToParts(d).reduce((a,c)=>{a[c.type]=c.value;return a;},{});
    return {h:p.hour,m:p.minute,s:p.second, w:p.weekday, d:p.day, mo:p.month, y:p.year};
  }

  /* ===== Akteure ===== */
  const ACTOR_TYPES=[
    {em:'👷', lines:["Mörtel!","Wasserwaage!","Abbruch!","Neuaufbau!"]},
    {em:'🐿️', lines:["Nuss gegen Stein!","Flitz!","Ich kann tragen!"]},
    {em:'🐍', lines:["sssschieb!","weg mit dem Klotz","Neuer Block!"]}
  ];
  const ACTOR_COUNT=7;
  const ACTORS=[];
  function spawnActors(){
    workersLayer.innerHTML=""; ACTORS.length=0;
    for(let i=0;i<ACTOR_COUNT;i++){
      const t=ACTOR_TYPES[i % ACTOR_TYPES.length];
      const a=document.createElement('div'); a.className='actor'; a.innerHTML=`<div class="bubble"></div><span>${t.em}</span>`;
      workersLayer.appendChild(a);
      ACTORS.push({el:a, type:t, x:Math.random()*grid.clientWidth, y:Math.random()*grid.clientHeight, vx:0, vy:0, timer:Math.random()*1.2+0.4, job:null, sayCooldown:0, queue:[]});
    }
  }
  function speak(actor, txt, ms=900){ const b=actor.el.querySelector('.bubble'); b.textContent=txt; b.style.display='block'; setTimeout(()=>b.style.display='none',ms); }
  function wander(actor, dt){
    if(actor.job) return;
    actor.timer-=dt;
    if(actor.timer<=0){
      actor.vx=(Math.random()*2-1)*50; actor.vy=(Math.random()*2-1)*50;
      actor.timer=Math.random()*1.2+0.6;
      if(actor.sayCooldown<=0 && Math.random()<.35){ speak(actor, actor.type.lines[(Math.random()*actor.type.lines.length)|0]); actor.sayCooldown=2.5; }
    }
    actor.sayCooldown=Math.max(0, actor.sayCooldown-dt);
    actor.x=Math.max(20, Math.min(grid.clientWidth-20, actor.x+actor.vx*dt));
    actor.y=Math.max(20, Math.min(grid.clientHeight-20,actor.y+actor.vy*dt));
    actor.el.style.left=(grid.offsetLeft+actor.x)+'px'; actor.el.style.top=(grid.offsetTop+actor.y)+'px';
  }

  /* ===== Umbau: Unterschiede, Ghost-Plan, Jobs ===== */
  function layoutForKey(key){
    const pos=layout(); const D=[key[0],key[1],key[2],key[3]]; const pts=[];
    for(let di=0;di<4;di++){
      const m=DIGITS[D[di]];
      for(let r=0;r<rows;r++)for(let c=0;c<cols;c++) if(m[r*cols+c]===1){ const {x,y}=pos(di,c,r); pts.push({x,y}); }
    }
    return pts;
  }
  function showGhost(nextKey){
    ghost.innerHTML='';
    const pts = layoutForKey(nextKey);
    for(const p of pts){
      const g=document.createElement('div'); g.className='gpx'; g.style.left=p.x+'px'; g.style.top=p.y+'px';
      ghost.appendChild(g);
    }
  }
  function hideGhost(){ ghost.innerHTML=''; }

  function diffTo(nextKey){
    const pos=layout();
    const cur=[current[0],current[1],current[2],current[3]];
    const nxt=[nextKey[0],nextKey[1],nextKey[2],nextKey[3]];
    const removes=[], adds=[];
    for(let di=0; di<4; di++){
      const mC=DIGITS[cur[di]], mN=DIGITS[nxt[di]];
      for(let r=0;r<rows;r++){
        for(let c=0;c<cols;c++){
          const {x,y}=pos(di,c,r);
          const i=r*cols+c;
          if(mC[i]===1 && mN[i]===0) removes.push({x,y});
          if(mC[i]===0 && mN[i]===1) adds.push({x,y});
        }
      }
    }
    return {removes, adds};
  }

  const pileIcons=['🧱','🧱','🧱','🧱','🧱'];
  const dumpIcons=['🗿'];
  function updatePiles(){ pileEl.textContent=pileIcons.join(''); dumpEl.textContent=dumpIcons.join(''); }

  function assignJobs(nextKey){
    const {removes, adds}=diffTo(nextKey);
    const jobs=[];
    removes.forEach(pt=> jobs.push({kind:'remove', target:pt}));
    adds.forEach(pt=> jobs.push({kind:'add', target:pt}));
    jobs.forEach((job,i)=>{ ACTORS[i % ACTORS.length].queue.push(job); });
    ACTORS.forEach(a=>{ if(!a.job) runNext(a); });
  }

  function spawnBrickAt(x,y,spin=false){
    const b=document.createElement('div'); b.className='brick'; if(spin) b.classList.add('spin');
    b.style.left=(grid.offsetLeft+x)+'px'; b.style.top=(grid.offsetTop+y)+'px';
    workersLayer.appendChild(b); return b;
  }

  function moveActorTo(actor, tx, ty, dur, onDone, carry){
    const ax=actor.x, ay=actor.y;
    const t0=performance.now();
    function anim(t){
      const p = Math.min(1, (t-t0)/(dur*1000));
      const eased = p<.5 ? (2*p*p) : (-1+(4-2*p)*p); // easeInOutQuad
      const nx = ax + (tx-ax)*eased, ny = ay + (ty-ay)*eased;
      const bob = Math.sin(p*Math.PI*2)*3;
      actor.x=nx; actor.y=ny+bob;
      actor.el.style.left=(grid.offsetLeft+actor.x)+'px'; actor.el.style.top=(grid.offsetTop+actor.y)+'px';
      if(carry){
        carry.style.left=(grid.offsetLeft+actor.x)+'px'; carry.style.top=(grid.offsetTop+actor.y-8)+'px';
        carry.style.transform=`translate(-50%,-50%) rotate(${p*720|0}deg)`;
      }
      if(p<1) requestAnimationFrame(anim); else onDone && onDone();
    }
    requestAnimationFrame(anim);
  }

  function runNext(actor){
    if(actor.job) return;
    const job=actor.queue.shift(); if(!job){ actor.job=null; return; }
    actor.job=job;

    if(job.kind==='remove'){
      speak(actor,"Abbruch!",700);
      moveActorTo(actor, job.target.x, job.target.y, .7, ()=>{
        const px = findNearestPixel(job.target.x, job.target.y); if(px){ px.style.opacity=.12; }
        const brick = spawnBrickAt(job.target.x, job.target.y, true);
        const dumpX = grid.clientWidth-24, dumpY = grid.clientHeight-24;
        moveActorTo(actor, dumpX, dumpY, 1.0, ()=>{
          dumpIcons.push('🗿'); updatePiles();
          brick.remove(); actor.job=null; runNext(actor);
        }, brick);
      });
    } else {
      const pileX=24, pileY=grid.clientHeight-24;
      moveActorTo(actor, pileX, pileY, .7, ()=>{
        speak(actor,"Neuaufbau!",700);
        if(pileIcons.length>0) pileIcons.pop();
        updatePiles();
        const brick = spawnBrickAt(pileX, pileY, true);
        moveActorTo(actor, job.target.x, job.target.y, 1.0, ()=>{
          const px = findNearestPixel(job.target.x, job.target.y);
          if(px){ px.style.opacity=1; px.classList.remove('pulse'); void px.offsetWidth; px.classList.add('pulse'); }
          brick.remove(); actor.job=null; runNext(actor);
        }, brick);
      });
    }
  }

  function findNearestPixel(x,y){
    let best=null, bd=1e12;
    for(const p of PIXELS){
      const px=parseFloat(p.dataset.x||'0'), py=parseFloat(p.dataset.y||'0');
      const d=(px-x)*(px-x)+(py-y)*(py-y);
      if(d<bd){ bd=d; best=p; }
    }
    return best;
  }

  /* ===== Datum & Heiligabend-Countdown ===== */
  function daysUntilChristmasEve(now=new Date()){
    const z=tz;
    const y = new Intl.DateTimeFormat('de-DE',{timeZone:z,year:'numeric'}).format(now)*1;
    const berlinNow = new Date(new Date().toLocaleString('en-US',{timeZone:z}));
    let targetYear = y;
    const xmasThisYear = new Date(Date.UTC(y, 11, 24, 0,0,0)); // 24.12.
    if(berlinNow > xmasThisYear) targetYear = y+1;
    const target = new Date(Date.UTC(targetYear,11,24,0,0,0));
    const diffMs = target - berlinNow;
    return Math.max(0, Math.ceil(diffMs/86400000));
  }
  function updateDateRow(){
    const p=fmtParts(new Date());
    const pretty = `${p.w}, ${p.d}. ${p.mo} ${p.y}`;
    const days = daysUntilChristmasEve();
    dateRow.textContent = `${pretty} • Tage bis Heiligabend: ${days}`;
  }

  /* ===== Haupt-Loop ===== */
  function tick(){
    const now=new Date();
    const p=fmtParts(now);
    tzLabel.textContent=`Europa/Berlin • ${p.h}:${p.m}:${p.s}`;

    if(+p.s!==lastSec){
      const on=(+p.s)%2===0; document.querySelectorAll('.colonDot').forEach(d=>d.style.opacity=on?1:0.35);
      lastSec=+p.s; updateDateRow();
    }

    // 3s vorher: Ghost-Plan und Jobs
    if((+p.s)===57){
      const future=new Date(now.getTime()+3000);
      const np=fmtParts(future); const nextKey=np.h+np.m;
      if(tick.prepared!==nextKey){
        tick.prepared=nextKey;
        showGhost(nextKey);
        assignJobs(nextKey);
      }
    }

    // Wechsel
    const key=p.h+p.m;
    if(key!==current){
      current=key; render(current); hideGhost();
      while(pileIcons.length<5) pileIcons.push('🧱'); updatePiles();
      ACTORS.forEach(a=>{ a.queue=[]; a.job=null; });
    }

    requestAnimationFrame(tick);
  }

  // Dauer-Wandern separat
  function startWanderLoop(){
    let last=performance.now();
    (function loop(ts){
      const dt=Math.min(0.05,(ts-last)/1000); last=ts;
      ACTORS.forEach(a=>wander(a,dt));
      requestAnimationFrame(loop);
    })(last);
  }

  // Init
  function init(){
    const start = fmtParts(); current = start.h + start.m; render(current); updateDateRow();
    spawnActors(); updatePiles(); tick(); startWanderLoop();
  }

  // Resize
  window.addEventListener('resize', ()=>{ render(current); if(ghost.children.length) showGhost(current); });

  init();
})();
</script>
</body>
</html>
