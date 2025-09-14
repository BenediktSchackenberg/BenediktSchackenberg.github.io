---
title: "Profil Benedikt Schackenberg"
layout: default
permalink: /
description: "Retro-Intro + Digitale Pixeluhr mit Umbau-Workern, Datum & Countdown – mobil optimiert"
---

<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"/>
<title>Benedikt Schackenberg</title>
<link rel="icon" href="data:,">
<style>
  html,body{height:100%;background:#0e1418}
  .site-header, header, .page, .page-content, main, .site-footer{background:transparent!important;box-shadow:none!important;border:0!important}
  :root{--fg:#f2f5f7;--shadow:0 12px 26px rgba(0,0,0,.25)}
  *{box-sizing:border-box}
  body{margin:0;color:var(--fg);font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial;overflow:hidden;-webkit-tap-highlight-color:transparent}

  /* Retro-Hintergrund */
  .retro-sky{position:fixed;inset:0;z-index:0;pointer-events:none;background:
    radial-gradient(2px 2px at 10% 12%, #fff8 50%, transparent 51%),
    radial-gradient(2px 2px at 22% 28%, #fff6 50%, transparent 51%),
    radial-gradient(2px 2px at 78% 18%, #fff7 50%, transparent 51%),
    radial-gradient(2px 2px at 65% 30%, #fff8 50%, transparent 51%),
    repeating-linear-gradient(0deg,transparent 0 6px,rgba(255,255,255,.03) 6px 12px),
    linear-gradient(180deg,#0f1a22 0%,#0e1418 42%,#0e1418 100%)}
  .retro-sky::before{content:"";position:absolute;left:-20vw;right:-20vw;height:28vh;top:0;
    background:
      radial-gradient(70px 18px at 12% 34%, #ffffff15 60%, transparent 61%),
      radial-gradient(90px 20px at 40% 26%, #ffffff18 60%, transparent 61%),
      radial-gradient(70px 18px at 72% 32%, #ffffff12 60%, transparent 61%),
      radial-gradient(90px 22px at 90% 22%, #ffffff14 60%, transparent 61%);
    image-rendering:pixelated;animation:clouds 60s linear infinite;filter:drop-shadow(0 6px 10px rgba(0,0,0,.2))}
  @keyframes clouds{to{transform:translateX(40vw)}}

  .ambient{position:fixed;inset:0;pointer-events:none;z-index:1}
  .layer{position:absolute;inset:-10vh -10vw;opacity:.08;filter:blur(.2px)}
  .l1{background:
      radial-gradient(1200px 700px at 20% 10%, rgba(125,211,111,.6), transparent 60%),
      radial-gradient(1000px 600px at 85% 80%, rgba(255,210,87,.65), transparent 60%);
     animation:drift1 60s linear infinite}
  .l2{background:repeating-linear-gradient(25deg,rgba(255,255,255,.8) 0 2px,transparent 2px 14px);opacity:.05;animation:drift2 70s linear infinite reverse}
  @keyframes drift1{to{transform:translate3d(6vw,-4vh,0)}}
  @keyframes drift2{to{transform:translate3d(-6vw,3vh,0)}}
  @media (prefers-reduced-motion:reduce){
    .retro-sky::before,.l1,.l2{animation:none}
  }

  .watermark{position:fixed;inset:0;z-index:0;pointer-events:none}
  .wm-text{position:absolute;inset:0;display:grid;place-items:center;opacity:.06;font-weight:900;text-align:center;line-height:1.1;font-size:clamp(28px,8vw,84px);letter-spacing:.02em;filter:drop-shadow(0 4px 14px rgba(0,0,0,.35));user-select:none}

  /* Kontakt */
  .contact{position:fixed;top:12px;right:12px;z-index:20;background:#0d0f12f0;border:1px solid #222a2f;border-radius:12px;box-shadow:var(--shadow);padding:10px 12px;min-width:260px;max-width:42vw}
  .contact a{color:#eaf2f6;text-decoration:none;border-bottom:1px dotted #6b7a86}
  .contact-actions{display:flex;gap:8px;margin-top:6px;flex-wrap:wrap}
  .mini{border:1px solid #2a343b;background:#11181d;color:#eaf2f6;border-radius:8px;padding:6px 10px;cursor:pointer;font-size:.85rem}
  .mini:hover{background:#152027}
  @media (max-width:540px){
    .contact{min-width:auto;max-width:calc(100vw - 24px);left:12px;right:12px;top:auto;bottom:12px}
  }

  /* Bühne */
  .stage{position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;z-index:10;padding:16px}

  /* Titel */
  .titleWrap{display:flex;justify-content:center;width:100%;padding-inline:12px}
  .title{display:flex;white-space:nowrap;gap:.18em;filter:drop-shadow(0 8px 22px rgba(0,0,0,.35))}
  .px{
    position:relative;display:inline-block;font-weight:900;font-size:clamp(22px,9vw,92px);letter-spacing:.02em;
    text-shadow:0 0 0 #0008, .6ch .6ch 0 #0006, 1.2ch 1.2ch 0 #0004;
    box-shadow:0 0 0 .15ch #0b0f12 inset;border-radius:.4ch;padding:.02em .06em;
    transform:translateY(-120vh) rotate(-8deg) scale(.8);opacity:0;color:var(--col,#f2f5f7);will-change:transform,opacity
  }
  .falling{animation:fallIn var(--fall,520ms) cubic-bezier(.2,.8,.2,1) forwards}
  @keyframes fallIn{
    0%{transform:translateY(-120vh) rotate(-8deg) scale(.8);opacity:0}
    60%{transform:translateY(18px) rotate(1deg) scale(1.04);opacity:1}
    78%{transform:translateY(-8px) rotate(-1deg) scale(.98)}
    100%{transform:translateY(0) rotate(0) scale(1);opacity:1}
  }

  /* Digitale Pixel-Uhr */
  .clockArea{display:flex;flex-direction:column;align-items:center;gap:10px;width:100%}
  .digital{position:relative;width:min(92vw,860px);height:min(56vw,220px);background:#0d1014;border:3px solid #222a2f;border-radius:18px;box-shadow:inset 0 0 0 6px #121821,0 10px 26px #0006;overflow:hidden}
  .grid{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:100%;height:100%}
  .pixel{position:absolute;width:14px;height:14px;border-radius:3px;background:#9ac1ff;box-shadow:0 0 0 1px #0006 inset,0 2px 0 #0004;transition:transform .45s cubic-bezier(.2,.8,.2,1),opacity .25s}
  .pixel.h{background:#ffd257}.pixel.m{background:#7dd36f}
  .pixel.pulse{animation:pulse .38s ease-out}
  @keyframes pulse{0%{filter:drop-shadow(0 0 10px #fff8)}100%{filter:none}}
  @media (max-width:480px){
    .digital{height:min(64vw,220px)}
  }

  .ghost{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);pointer-events:none;opacity:.18;filter:contrast(1.1)}
  .ghost .gpx{position:absolute;width:14px;height:14px;border-radius:3px;background:#86a9ff;transition:background .2s,transform .2s}
  .colonDot{position:absolute;width:12px;height:12px;border-radius:3px;background:#eaf2f6;box-shadow:0 0 0 1px #0006 inset,0 2px 0 #0004;opacity:.85;transition:opacity .35s}

  .yard,.dump{position:absolute;bottom:8px;font:800 12px ui-sans-serif;opacity:.85}
  .yard{left:10px}.dump{right:10px}
  .pile{display:inline-block;margin-left:6px}
  .workers{position:absolute;inset:0;pointer-events:none}
  .actor{position:absolute;transform:translate(-50%,-50%);font-size:22px;filter:drop-shadow(0 2px 4px rgba(0,0,0,.6));animation:wiggle .8s steps(2,end) infinite}
  .actor .bubble{position:absolute;left:50%;top:-22px;transform:translateX(-50%);font:800 10px ui-sans-serif;background:#ffffffd9;color:#111;border:2px solid #2f2626;border-radius:8px;padding:0 6px;white-space:nowrap;display:none}
  @keyframes wiggle{0%{transform:translate(-50%,-50%) rotate(-2deg)}50%{transform:translate(-50%,-50%) rotate(2deg)}100%{transform:translate(-50%,-50%) rotate(-2deg)}}
  @media (prefers-reduced-motion:reduce){
    .actor{animation:none}
  }

  .brick{position:absolute;width:14px;height:14px;border-radius:3px;background:#cfe3ff;box-shadow:0 0 0 1px #0006 inset,0 2px 0 #0004;transform:translate(-50%,-50%)}
  .brick.spin{animation:spin 1.2s linear infinite}
  @keyframes spin{to{transform:translate(-50%,-50%) rotate(360deg)}}
  .spark{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-size:14px;opacity:1;pointer-events:none}
  .progress{position:absolute;left:0;right:0;bottom:0;height:6px;background:#1a2330}
  .progress i{display:block;height:100%;background:#86a9ff;transition:width .2s}

  .dateRow{font:800 14px/1.3 ui-sans-serif;opacity:.9;padding-inline:8px;text-align:center}
  .footer{position:fixed;bottom:10px;right:12px;opacity:.6;font-size:12px;z-index:12}

  /* Krokodile (Original-Version, nur Anzahl reduziert) */
  .crocs{position:fixed;left:0;right:0;bottom:18px;pointer-events:none;z-index:15}
  .croc{
    position:absolute;bottom:0;transform:translateX(-50%);
    font-size:28px;filter:drop-shadow(0 3px 8px rgba(0,0,0,.6))
  }
  .croc.flip{transform:translateX(-50%) scaleX(-1)}
  .croc .bubble{
    position:absolute;bottom:32px;left:50%;transform:translateX(-50%);
    font:800 11px/1.2 ui-sans-serif;background:#fff;color:#111;border:2px solid #2f2626;border-radius:10px;padding:3px 6px;white-space:nowrap;display:none
  }
  .croc.walk{animation:step 600ms steps(2,end) infinite}
  @keyframes step{50%{transform:translateX(-50%) translateY(-2px)}}
  @media (max-width:540px){
    .croc{font-size:22px}
    .croc .bubble{font-size:10px}
  }
  @media (prefers-reduced-motion:reduce){
    .croc.walk{animation:none}
  }
</style>
</head>
<body>

<div class="retro-sky" aria-hidden="true"></div>
<div class="ambient"><div class="layer l1"></div><div class="layer l2"></div></div>
<div class="watermark"><div class="wm-text"><div><span>Benedikt Schackenberg</span></div></div></div>

<!-- Kontakt -->
<div class="contact">
  <div>📧 <a href="mailto:benedikt@schackenberg.com">benedikt@schackenberg.com</a></div>
  <div>🔐 <a href="{{ '/assets/keys/benedikt-schackenberg.asc' | relative_url }}" download>PGP-Schlüssel (.asc)</a></div>
  <div class="contact-actions">
    <button class="mini" onclick="navigator.clipboard.writeText('benedikt@schackenberg.com')">E-Mail kopieren</button>
    <button class="mini" onclick="(function(){const t=document.getElementById('pgp-key'); if(t){navigator.clipboard.writeText(t.innerText)}})()">PGP kopieren</button>
  </div>
</div>

<!-- Bühne -->
<div class="stage" id="stage">
  <div class="titleWrap"><div id="title" class="title" aria-label="Benedikt Schackenberg"></div></div>
  <div class="clockArea">
    <div class="digital" id="digital" aria-live="polite">
      <div class="grid" id="grid"></div>
      <div class="ghost" id="ghost"></div>
      <div class="yard">Material:<span class="pile" id="pile">🧱🧱🧱🧱🧱</span></div>
      <div class="dump">Schutt:<span class="pile" id="dump">🗿</span></div>
      <div class="workers" id="workers"></div>
      <div class="progress"><i id="prog" style="width:0%"></i></div>
    </div>
    <div class="dateRow" id="dateRow">–</div>
    <div class="badge" id="tzLabel">Europa/Berlin</div>
  </div>
</div>

<!-- Krokodil-Layer -->
<div class="crocs" id="crocs" aria-hidden="true"></div>

<!-- versteckter PGP-Text fürs Kopieren -->
<pre id="pgp-key" style="position:fixed;left:-9999px;top:-9999px">
-----BEGIN PGP PUBLIC KEY BLOCK-----
...dein Key...
-----END PGP PUBLIC KEY BLOCK-----
</pre>

<div class="footer">© <span id="y"></span> Benedikt Schackenberg</div>

<script>
(function(){
  document.getElementById('y').textContent=new Date().getFullYear();

  /* ===== Name – bunte Fall-Animation ===== */
  const titleEl=document.getElementById('title');
  const nameText="Benedikt Schackenberg";
  const colors=["#7dd36f","#ffd257","#9ac1ff","#ffa6e7","#f5a3a3","#a8f0c6","#ff9f7a","#b2f07f","#f5d0fe","#c2e7ff","#ffd6a5","#b8f2e6"];
  const perCharFall=520, betweenChars=90, holdVisibleMs=90000; let nameLoop=null;

  function autoScaleOneLine(){
    const wrap=document.querySelector('.titleWrap');
    const max=wrap.clientWidth-16;
    const w=titleEl.getBoundingClientRect().width || 1;
    titleEl.style.transform=`scale(${Math.min(1,max/w)})`;
  }
  function buildName(){
    clearTimeout(nameLoop); titleEl.innerHTML="";
    const frag=document.createDocumentFragment(); let i=0;
    for(const ch of nameText){
      const s=document.createElement('span'); s.className='px';
      const col=colors[i%colors.length]; s.style.setProperty('--col',col); s.style.color=col; s.textContent=ch;
      frag.appendChild(s); i++;
    } titleEl.appendChild(frag); autoScaleOneLine();
  }
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  async function playName(){
    for(const s of [...titleEl.querySelectorAll('.px')]){
      s.style.setProperty('--fall', perCharFall+'ms'); s.classList.remove('falling'); void s.offsetWidth; s.classList.add('falling');
      await sleep(perCharFall+betweenChars);
    }
    nameLoop=setTimeout(()=>{buildName();playName();}, holdVisibleMs);
  }
  buildName(); playName();
  addEventListener('resize', autoScaleOneLine);

  /* ===== Uhr & Umbau ===== */
  const tz='Europe/Berlin';
  const grid=document.getElementById('grid');
  const ghost=document.getElementById('ghost');
  const workersLayer=document.getElementById('workers');
  const tzLabel=document.getElementById('tzLabel');
  const pileEl=document.getElementById('pile');
  const dumpEl=document.getElementById('dump');
  const dateRow=document.getElementById('dateRow');
  const prog=document.getElementById('prog');
  const stage=document.getElementById('stage');

  let PX=14, GAP=4, COLS=5, ROWS=7, DIGIT_GAP=10, GROUP_GAP=20;
  function recomputeSizes(){
    const w=grid.clientWidth||window.innerWidth;
    const h=grid.clientHeight||window.innerHeight;
    const s=Math.min(w,h);
    PX = s<420 ? 10 : s<680 ? 12 : 14;
    GAP = s<420 ? 3 : 4;
    DIGIT_GAP = s<420 ? 8 : 10;
    GROUP_GAP = s<420 ? 14 : 20;
    document.querySelectorAll('.pixel,.ghost .gpx').forEach(el=>{
      el.style.width=PX+'px'; el.style.height=PX+'px'; el.style.borderRadius=Math.max(2,Math.round(PX*.22))+'px';
    });
  }

  const DIGITS={
    "0":[1,1,1,1,1,1,0,0,0,1,1,0,1,0,1,1,0,1,0,1,1,0,1,0,1,1,0,0,0,1,1,1,1,1,1],
    "1":[0,1,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,1,1,1,0],
    "2":[1,1,1,1,1,0,0,0,0,1,0,0,0,0,1,0,1,1,1,1,1,1,0,0,0,0,1,1,0,0,0,1,1,1,1],
    "3":[1,1,1,1,1,0,0,0,0,1,0,0,0,0,1,0,0,1,1,1,0,0,0,0,1,0,0,0,0,1,1,1,1,1,1],
    "4":[1,0,0,1,0,1,0,0,1,0,1,0,0,1,0,1,1,1,1,1,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0],
    "5":[1,1,1,1,1,1,0,0,0,0,1,0,0,0,0,1,1,1,1,0,0,0,0,0,1,0,0,0,0,1,1,1,1,1,0],
    "6":[1,1,1,1,0,1,0,0,0,0,1,0,0,0,0,1,1,1,1,0,1,0,0,0,1,1,0,0,0,1,0,1,1,1,0],
    "7":[1,1,1,1,1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0],
    "8":[0,1,1,1,0,1,0,0,0,1,1,0,0,0,1,0,1,1,1,0,1,0,0,0,1,1,0,0,0,1,0,1,1,1,0],
    "9":[0,1,1,1,0,1,0,0,0,1,1,0,0,0,1,0,1,1,1,1,0,0,0,0,1,0,0,0,0,1,1,1,1,0]
  };

  function layout(){
    const box=grid.getBoundingClientRect();
    const wDigit = COLS*PX + (COLS-1)*GAP;
    const wGroup = wDigit*2 + DIGIT_GAP;
    const total  = wGroup*2 + GROUP_GAP;
    const sx=(box.width-total)/2;
    const sy=(box.height - (ROWS*PX+(ROWS-1)*GAP))/2;
    return (di,c,r)=>{
      const gOff = di<2 ? 0 : (wGroup + GROUP_GAP);
      const dOff = (di%2)*(wDigit + DIGIT_GAP);
      return {x:sx + gOff + dOff + c*(PX+GAP), y: sy + r*(PX+GAP)};
    };
  }

  const PIXELS=[]; for(let i=0;i<160;i++){ const d=document.createElement('div'); d.className='pixel'; grid.appendChild(d); PIXELS.push(d); }
  const colonTop=document.createElement('div'), colonBot=document.createElement('div'); colonTop.className='colonDot'; colonBot.className='colonDot'; grid.appendChild(colonTop); grid.appendChild(colonBot);

  function render(key){
    recomputeSizes();
    const pos=layout(); const digits=[key[0],key[1],key[2],key[3]]; let idx=0;
    for(let di=0; di<4; di++){
      const map=DIGITS[digits[di]];
      for(let r=0;r<ROWS;r++){
        for(let c=0;c<COLS;c++){
          const p=PIXELS[idx++], on = map[r*COLS+c]===1;
          const {x,y}=pos(di,c,r);
          p.style.transform=`translate(${x}px,${y}px)`;
          p.style.opacity=on?1:0.08;
          p.classList.toggle('h', di<2); p.classList.toggle('m', di>=2);
          p.dataset.x=x; p.dataset.y=y; p.dataset.on=on?1:0;
          p.style.width=PX+'px'; p.style.height=PX+'px';
        }
      }
    }
    const box=grid.getBoundingClientRect(), height=ROWS*PX+(ROWS-1)*GAP;
    const y0=(box.height-height)/2, cx=box.width/2-6;
    colonTop.style.transform=`translate(${cx}px, ${y0+height*0.32}px)`;
    colonBot.style.transform=`translate(${cx}px, ${y0+height*0.68}px)`;
  }

  function fmtParts(d=new Date()){
    const p=new Intl.DateTimeFormat('de-DE',{timeZone:tz,hour:'2-digit',minute:'2-digit',second:'2-digit',weekday:'long',day:'2-digit',month:'long',year:'numeric',hour12:false}).formatToParts(d).reduce((a,c)=>{a[c.type]=c.value;return a;},{});
    return {h:p.hour,m:p.minute,s:p.second,w:p.weekday,d:p.day,mo:p.month,y:p.year};
  }

  /* Akteure */
  const ACTOR_TYPES=[
    {em:'👷', lines:["Mörtel!","Wasserwaage!","Abbruch!","Neuaufbau!"]},
    {em:'🐿️', lines:["Nuss gegen Stein!","Flitz!","Ich kann tragen!"]},
    {em:'🐍', lines:["sssschieb!","weg mit dem Klotz","Neuer Block!"]},
    {em:'🦺', lines:["Plan A!","Nicht anfassen!","Ich zähl'…"]}
  ];
  const ACTORS=[];
  function actorCount(){
    const w=window.innerWidth;
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 4;
    return w<420 ? 5 : w<768 ? 7 : 8;
  }
  function spawnActors(){
    workersLayer.innerHTML=""; ACTORS.length=0;
    const N=actorCount();
    for(let i=0;i<N;i++){
      const t=ACTOR_TYPES[i % ACTOR_TYPES.length];
      const a=document.createElement('div'); a.className='actor'; a.innerHTML=`<div class="bubble"></div><span>${t.em}</span>`;
      workersLayer.appendChild(a);
      ACTORS.push({el:a,type:t,x:Math.random()*grid.clientWidth,y:Math.random()*grid.clientHeight,vx:0,vy:0,timer:Math.random()*1.2+0.4,sayCooldown:0,job:null,queue:[]});
    }
  }
  function speak(actor, txt, ms=900){ const b=actor.el.querySelector('.bubble'); b.textContent=txt; b.style.display='block'; setTimeout(()=>b.style.display='none',ms); }
  function wander(actor, dt){
    if(actor.job) return;
    actor.timer-=dt;
    if(actor.timer<=0){
      const speed = (window.innerWidth<420)?35:50;
      actor.vx=(Math.random()*2-1)*speed; actor.vy=(Math.random()*2-1)*speed;
      actor.timer=Math.random()*1.2+0.6;
      if(actor.sayCooldown<=0 && Math.random()<.35){ speak(actor, actor.type.lines[(Math.random()*actor.type.lines.length)|0]); actor.sayCooldown=2.5; }
    }
    actor.sayCooldown=Math.max(0, actor.sayCooldown-dt);
    actor.x=Math.max(20, Math.min(grid.clientWidth-20, actor.x+actor.vx*dt));
    actor.y=Math.max(20, Math.min(grid.clientHeight-20,actor.y+actor.vy*dt));
    actor.el.style.left=(grid.offsetLeft+actor.x)+'px'; actor.el.style.top=(grid.offsetTop+actor.y)+'px';
  }

  const pileIcons=['🧱','🧱','🧱','🧱','🧱']; const dumpIcons=['🗿'];
  function updatePiles(){ pileEl.textContent=pileIcons.join(''); dumpEl.textContent=dumpIcons.join(''); }

  function layoutForKey(key){
    const pos=layout(); const D=[key[0],key[1],key[2],key[3]]; const pts=[];
    for(let di=0;di<4;di++){
      const m=DIGITS[D[di]];
      for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++) if(m[r*COLS+c]===1){ const {x,y}=pos(di,c,r); pts.push({x,y}); }
    }
    return pts;
  }
  function showGhost(nextKey){
    ghost.innerHTML='';
    const pts = layoutForKey(nextKey);
    for(const p of pts){
      const g=document.createElement('div'); g.className='gpx'; g.style.left=p.x+'px'; g.style.top=p.y+'px';
      g.style.width=PX+'px'; g.style.height=PX+'px';
      ghost.appendChild(g);
    }
  }
  function tintGhost(progress){
    ghost.querySelectorAll('.gpx').forEach(g=>{
      g.style.background=`hsl(${200 - progress*80}deg 80% ${70+progress*10}%)`;
      g.style.transform=`scale(${1+progress*0.05})`;
    });
  }
  function hideGhost(){ ghost.innerHTML=''; }

  function diffTo(nextKey){
    const pos=layout();
    const cur=[current[0],current[1],current[2],current[3]];
    const nxt=[nextKey[0],nextKey[1],nextKey[2],nextKey[3]];
    const removes=[], adds=[];
    for(let di=0; di<4; di++){
      const mC=DIGITS[cur[di]], mN=DIGITS[nxt[di]];
      for(let r=0;r<ROWS;r++){
        for(let c=0;c<COLS;c++){
          const {x,y}=pos(di,c,r);
          const i=r*COLS+c;
          if(mC[i]===1 && mN[i]===0) removes.push({x,y});
          if(mC[i]===0 && mN[i]===1) adds.push({x,y});
        }
      }
    }
    return {removes, adds};
  }

  function spawnBrickAt(x,y,spin=false){
    const b=document.createElement('div'); b.className='brick'; if(spin) b.classList.add('spin');
    b.style.width=PX+'px'; b.style.height=PX+'px';
    b.style.left=(grid.offsetLeft+x)+'px'; b.style.top=(grid.offsetTop+y)+'px';
    workersLayer.appendChild(b); return b;
  }
  function moveActorTo(actor, tx, ty, dur, onDone, carry){
    const ax=actor.x, ay=actor.y; const t0=performance.now();
    const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = RM ? dur*0.5 : dur;
    (function anim(t){
      const p = Math.min(1, (t-t0)/(duration*1000));
      const eased = p<.5 ? (2*p*p) : (-1+(4-2*p)*p);
      const wobble = RM?0:Math.sin(p*Math.PI*2)*3;
      const nx = ax + (tx-ax)*eased, ny = ay + (ty-ay)*eased + wobble;
      actor.x=nx; actor.y=ny;
      actor.el.style.left=(grid.offsetLeft+nx)+'px'; actor.el.style.top=(grid.offsetTop+ny)+'px';
      if(carry){
        carry.style.left=(grid.offsetLeft+nx)+'px'; carry.style.top=(grid.offsetTop+ny-8)+'px';
        if(!RM) carry.style.transform=`translate(-50%,-50%) rotate(${p*720|0}deg)`;
      }
      if(p<1) requestAnimationFrame(anim); else onDone && onDone();
    })(t0);
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
  function burst(x,y,emoji='✨',n=14,life=0.8){
    const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const count = RM ? Math.max(4, n*0.4|0) : n;
    for(let i=0;i<count;i++){
      const s=document.createElement('div'); s.className='spark';
      s.textContent=emoji; s.style.left=(grid.offsetLeft+x)+'px'; s.style.top=(grid.offsetTop+y)+'px';
      stage.appendChild(s);
      const ang=Math.random()*Math.PI*2, sp=60+Math.random()*120;
      const vx=Math.cos(ang)*sp, vy=Math.sin(ang)*sp-40;
      const t0=performance.now();
      (function anim(t){
        const dt=(t-t0)/1000, px2=x+vx*dt, py2=y+vy*dt+220*dt*dt;
        s.style.left=(grid.offsetLeft+px2)+'px'; s.style.top=(grid.offsetTop+py2)+'px'; s.style.opacity=1-Math.min(1,dt/life);
        if(dt<life) requestAnimationFrame(anim); else s.remove();
      })(t0);
    }
  }
  function ploppAt(x,y){ burst(x,y,'✨',10,0.6); setTimeout(()=>burst(x,y,'🧱',6,0.6),90); }
  function dust(x,y){ burst(x,y,'·',8,0.5); }

  function assignJobs(nextKey){
    const {removes, adds}=diffTo(nextKey);
    const jobs=[];
    removes.forEach(pt=> jobs.push({kind:'remove', target:pt}));
    adds.forEach(pt=> jobs.push({kind:'add', target:pt}));
    jobs.forEach((job,i)=>{ ACTORS[i % ACTORS.length].queue.push(job); });
    ACTORS.forEach(a=>{ if(!a.job) runNext(a); });
  }
  function runNext(actor){
    if(actor.job) return;
    const job=actor.queue.shift(); if(!job){ actor.job=null; return; }
    actor.job=job;

    if(job.kind==='remove'){
      speak(actor,"Abbruch!",700);
      moveActorTo(actor, job.target.x, job.target.y, .6, ()=>{
        const px = findNearestPixel(job.target.x, job.target.y); if(px){ px.style.opacity=.12; dust(job.target.x, job.target.y); }
        const brick = spawnBrickAt(job.target.x, job.target.y, true);
        const dumpX = grid.clientWidth-24, dumpY = grid.clientHeight-24;
        moveActorTo(actor, dumpX, dumpY, .9, ()=>{
          dumpIcons.push('🗿'); updatePiles();
          brick.remove(); actor.job=null; runNext(actor);
        }, brick);
      });
    } else {
      const pileX=24, pileY=grid.clientHeight-24;
      moveActorTo(actor, pileX, pileY, .6, ()=>{
        speak(actor,"Neuaufbau!",700);
        if(pileIcons.length>0) pileIcons.pop(); updatePiles();
        const brick = spawnBrickAt(pileX, pileY, true);
        moveActorTo(actor, job.target.x, job.target.y, .9, ()=>{
          const px = findNearestPixel(job.target.x, job.target.y);
          if(px){ px.style.opacity=1; px.classList.remove('pulse'); void px.offsetWidth; px.classList.add('pulse'); ploppAt(job.target.x, job.target.y); }
          brick.remove(); actor.job=null; runNext(actor);
        }, brick);
      });
    }
  }

  function daysUntilChristmasEve(now=new Date()){
    const berlinNow = new Date(new Date().toLocaleString('en-US',{timeZone:tz}));
    const y = berlinNow.getFullYear();
    let target = new Date(Date.UTC(y,11,24,0,0,0));
    if(berlinNow > target) target = new Date(Date.UTC(y+1,11,24,0,0,0));
    const diffMs = target - berlinNow;
    return Math.max(0, Math.ceil(diffMs/86400000));
  }
  function updateDateRow(){
    const p=fmtParts(new Date());
    const pretty = `${p.w}, ${p.d}. ${p.mo} ${p.y}`;
    const days = daysUntilChristmasEve();
    dateRow.textContent = `${pretty} • Tage bis Heiligabend: ${days}`;
  }

  let current="0000", lastBlink=-1;
  function tick(){
    const now=new Date(); const p=fmtParts(now);
    tzLabel.textContent=`Europa/Berlin • ${p.h}:${p.m}:${p.s}`;
    const s=+p.s;

    if(s!==lastBlink){
      const on=(s%2===0); document.querySelectorAll('.colonDot').forEach(d=>d.style.opacity=on?1:0.35);
      lastBlink=s; updateDateRow();
    }

    if(s>=57){
      const ms = now.getMilliseconds();
      const future = new Date(now.getTime() + (60000 - (s-57)*1000 - ms));
      const np=fmtParts(future); const nextKey=np.h+np.m;
      if(tick.prepared!==nextKey){
        tick.prepared=nextKey; showGhost(nextKey); assignJobs(nextKey);
      }
      const progVal=(s-57 + ms/1000)/3; prog.style.width=(progVal*100)+'%'; tintGhost(progVal);
    } else { prog.style.width='0%'; tintGhost(0); }

    const key=p.h+p.m;
    if(key!==current){
      current=key; render(current); hideGhost();
      while(pileIcons.length<5) pileIcons.push('🧱'); updatePiles();
      ACTORS.forEach(a=>{ a.queue=[]; a.job=null; });
      const box=grid.getBoundingClientRect(), height=ROWS*PX+(ROWS-1)*GAP;
      const y0=(box.height-height)/2, cx=box.width/2-6;
      burst(cx, y0+height*0.5, '✨', 20, 1.0);
    }

    requestAnimationFrame(tick);
  }

  function startWanderLoop(){
    let last=performance.now();
    (function loop(ts){
      const dt=Math.min(0.05,(ts-last)/1000); last=ts;
      ACTORS.forEach(a=>wander(a,dt));
      requestAnimationFrame(loop);
    })(last);
  }

  /* ===== Krokodile – wie zuvor, aber MAX=2 ===== */
  function spawnCrocs(){
    const layer=document.getElementById('crocs');
    layer.innerHTML='';
    const MAX = 2; // <— nur zwei Krokos
    const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const voices=["Mama?","Maaaaama?","Wo bist du?","Mama, ich hab Hunger!","Hallo?"];
    const W = () => document.documentElement.clientWidth;

    for(let i=0;i<MAX;i++){
      const c=document.createElement('div');
      c.className='croc walk';
      c.innerHTML=`<div class="bubble"></div><span aria-hidden="true">🐊</span>`;
      layer.appendChild(c);

      const startLeft = Math.random()<0.5;
      let x = startLeft ? -20 - Math.random()*80 : W() + 20 + Math.random()*80;
      let dir = startLeft ? 1 : -1;
      let speed = (RM?32:48) + Math.random()*28; // Originaltempo

      c.style.bottom = (12 + Math.random()*10) + 'px';
      function updateFlip(){ c.classList.toggle('flip', dir<0); }
      updateFlip();

      const bubble=c.querySelector('.bubble');
      function say(){
        if(Math.random()<0.35){
          bubble.textContent=voices[(Math.random()*voices.length)|0];
          bubble.style.display='block';
          setTimeout(()=> bubble.style.display='none', 1200);
        }
      }
      setInterval(say, 2000 + (Math.random()*2000|0));

      let last=performance.now();
      (function loop(ts){
        const dt = Math.min(0.05,(ts-last)/1000); last=ts;
        x += dir * speed * dt;

        if(dir>0 && x > W()+40){ dir=-1; updateFlip(); say(); }
        if(dir<0 && x < -40){ dir=1; updateFlip(); say(); }
        if(Math.random()<0.01){ speed = Math.max(28,(RM?32:48) + (Math.random()*36-18)); }

        c.style.left = x + 'px';
        requestAnimationFrame(loop);
      })(last);
    }
  }

  function init(){
    recomputeSizes();
    const start=fmtParts(); let key=start.h+start.m; current=key; render(current); updateDateRow();
    spawnActors(); updatePiles(); tick(); startWanderLoop();
    spawnCrocs(); // 🐊
  }

  addEventListener('resize', ()=>{ render(current); if(ghost.children.length) showGhost(current); autoScaleOneLine(); });

  init();
})();
</script>
</body>
</html>
