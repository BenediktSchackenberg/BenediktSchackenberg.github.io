---
title: "Profil Benedikt Schackenberg"
layout: default
permalink: /
description: "Kachel-Grid: alle Bilder klein, Wechsel alle 5 Sekunden"
---

<html lang="de">
<head>
  <meta charset="utf-8" />
  <title>{{ page.title }}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="description" content="{{ page.description }}" />
  <link rel="icon" href="data:,">
  <style>
    :root{
      --maxw: 1000px;
      --shadow: 0 10px 24px rgba(0,0,0,.07);
      --border:#e9edf3;
      --bubble:#fff;
      --bubble-border:#2e2727;
      --roof:#783b2b;          /* Dachfarbe */
      --roof-dark:#4b2a22;     /* Dachumriss */
      --wall:#e7e0c9;          /* Wand */
      --beam:#8B0000;          /* Kontaktbalken (dunkles Rot) */
    }
    *{ box-sizing:border-box }
    body{ margin:0; background:#f6f8fb; color:#111; font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial; overflow-x:hidden }
    main{ width:min(100%, var(--maxw)); margin:1.5rem auto 3rem; padding:0 1rem }

    /* Rahmen + Grid */
    .frame{ position:relative; background:#fff; border:1px solid var(--border); border-radius:16px; box-shadow:var(--shadow); overflow:hidden }
    .frame .header{ padding:.9rem 1rem; border-bottom:1px solid var(--border); text-align:center; font-weight:600 }
    .grid{ display:grid; gap:8px; padding:10px; grid-template-columns:repeat(2,1fr) }
    @media (min-width:540px){ .grid{ grid-template-columns:repeat(3,1fr) } }
    @media (min-width:760px){ .grid{ grid-template-columns:repeat(4,1fr) } }
    @media (min-width:980px){ .grid{ grid-template-columns:repeat(6,1fr) } }
    .tile{ position:relative; width:100%; aspect-ratio:1/1; background:#fff; border:1px solid var(--border); border-radius:12px; overflow:hidden; box-shadow:0 6px 16px rgba(0,0,0,.05) }
    .tile img{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; opacity:1; transition:opacity .35s }
    .tile img.fade-out{ opacity:0 }

    /* Card + PGP */
    .card{ background:#fff; border:1px solid var(--border); border-radius:16px; padding:1.25rem; box-shadow:var(--shadow); line-height:1.6; margin-top:1rem; position:relative; z-index:1004; }
    .btn, button.copy{ display:inline-block; border:1px solid #e5e7eb; border-radius:10px; padding:.6rem .9rem; text-decoration:none; color:#111; background:#fff; cursor:pointer }
    .btn:hover, button.copy:hover{ background:#f3f5f8 }
    pre{ background:#0b1220; color:#e6edf3; padding:1rem; border-radius:12px; overflow:auto; font-family:ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size:.9rem }

    /* ===== Vollbild-Wald-Overlay ===== */
    .forest{
      position:fixed; inset:0; z-index:10; image-rendering:pixelated; pointer-events:none;
    }
    .forest .ui{ position:absolute; top:8px; left:8px; pointer-events:auto; z-index:1003; }
    .sound-btn{ border:2px solid #2f2626; background:#fff; border-radius:10px; padding:4px 8px; cursor:pointer; font-size:.9rem }

    /* Parallax-Layer – bewusst niedrige Ebenen */
    .layer{ position:absolute; inset:0; background-repeat:repeat-x; background-position:0 bottom; z-index:1; }
    .sky{ background:linear-gradient(#9ad1f2 0%, #8ecae6 60%, #7fb8d1 100%) }
    .far{
      background-image:
        radial-gradient(#568f75 10%, transparent 11%),
        linear-gradient(to top, #6aa186 0 45%, transparent 45%);
      background-size:40px 40px, 100% 100%; opacity:.45; animation: slideFar 60s linear infinite;
    }
    @keyframes slideFar{ from{ background-position: 0 bottom } to{ background-position: -1200px bottom } }
    .mid{
      background-image:
        radial-gradient(#3b6b57 8%, transparent 9%),
        linear-gradient(to top, #4f876e 0 55%, transparent 55%);
      background-size:50px 50px, 100% 100%; opacity:.7; animation: slideMid 32s linear infinite;
    }
    @keyframes slideMid{ from{ background-position: 0 bottom } to{ background-position: -1200px bottom } }
    .near{
      background-image:
        radial-gradient(#285445 7%, transparent 8%),
        linear-gradient(to top, #3d6b58 0 65%, transparent 65%);
      background-size:60px 60px, 100% 100%; opacity:.9; animation: slideNear 18s linear infinite;
    }
    @keyframes slideNear{ from{ background-position: 0 bottom } to{ background-position: -1200px bottom } }
    .ground{
      position:absolute; left:0; right:0; bottom:0; height:64px; z-index:2;
      background: repeating-linear-gradient(45deg, #5c7f57 0 10px, #62875e 10px 20px);
      box-shadow: 0 -6px 0 rgba(0,0,0,.05) inset;
    }

    /* ===== Pixel-Haus exakt in der Mitte ===== */
    .house{
      position:absolute; left:50%; top:50%; transform:translate(-50%, -50%);
      width: clamp(260px, 28vw, 420px); height: clamp(180px, 22vw, 320px);
      pointer-events:auto; z-index:1002; filter: drop-shadow(0 10px 20px rgba(0,0,0,.18));
    }
    /* Dach als Polygon mit sichtbarem Rand */
    .house .roof{ position:absolute; left:50%; top:0; transform:translateX(-50%); width:100%; height:40% }
    .house .roof::before{
      content:""; position:absolute; inset:0;
      background:linear-gradient(#804233, #6e3629);
      clip-path:polygon(0% 100%, 50% 0%, 100% 100%);
      filter: drop-shadow(0 3px 0 var(--roof-dark));
    }
    /* Kontakt-Balken auf dem Dach – JETZT HELL LESBAR */
    .house .beam{
      position:absolute; left:50%; top:58%; transform:translate(-50%, -50%);
      background: var(--beam); border:3px solid #3b2f2f; border-radius:10px;
      padding:8px 12px; display:flex; gap:12px; align-items:center; box-shadow:0 6px 16px rgba(0,0,0,.22);
      font: 800 clamp(.72rem, .95vw, 1.05rem)/1.2 ui-sans-serif, system-ui; color:#fff; white-space:nowrap;
      text-shadow: 0 1px 0 #2b1f1f;
      z-index:1003;
    }
    .house .beam a{ color:#fff; text-decoration:none; border-bottom:2px dotted #ffffffaa; }
    .house .beam a:hover{ background:#ffffff22 }
    /* Hauskörper */
    .house .body{
      position:absolute; left:50%; bottom:0; transform:translateX(-50%);
      width: 90%; height: 56%; background: var(--wall);
      border:3px solid #3b2f2f; border-radius:12px;
    }
    .door{
      position:absolute; left:50%; bottom:0; transform:translateX(-50%);
      width:18%; height:60%; background:#7b5b3e; border:3px solid #3b2f2f; border-radius:8px 8px 0 0;
    }
    .win{ position:absolute; bottom:24%; width:18%; height:28%; background:#cfe9ff;
      border:3px solid #3b2f2f; border-radius:6px; box-shadow:inset 0 0 0 3px #ffffff66 }
    .win.l{ left:18% } .win.r{ right:18% }

    /* Sprechblase (folgt dem Hasen) */
    .bubble{
      position:absolute; transform:translate(-50%,0);
      background:var(--bubble); border:3px solid var(--bubble-border); border-radius:12px;
      padding:10px 12px; font:700 .95rem/1.32 ui-sans-serif, system-ui; color:#2b2626;
      box-shadow:0 6px 16px rgba(0,0,0,.12); max-width:min(420px, 46vw);
      transition:opacity .25s ease; pointer-events:none; z-index:1003;
    }
    .bubble::after{
      content:""; position:absolute; bottom:-10px; left:26px; width:0; height:0;
      border-left:10px solid transparent; border-right:10px solid transparent; border-top:10px solid var(--bubble);
      filter: drop-shadow(0 2px 0 var(--bubble-border));
    }
    .bubble.fade{ opacity:0 }

    /* Akteure */
    .actor{ position:absolute; transform:translate(-50%,0); user-select:none; pointer-events:none; z-index:1001 }
    .bunny{ width:96px; height:96px; background: url("{{ '/assets/img/hase-sprite.png' | relative_url }}") 0 0 / 384px 96px no-repeat;
      animation: hopFrames .6s steps(4) infinite; filter: drop-shadow(0 6px 10px rgba(0,0,0,.18)) }
    @keyframes hopFrames{ from{ background-position:0 0 } to{ background-position:-384px 0 } }
    .bunny.flip{ transform: translate(-50%,0) scaleX(-1) }
    .fallback-emoji{ font-size:68px; line-height:1 }
    .animal{ font-size:54px; line-height:1; filter: drop-shadow(0 6px 10px rgba(0,0,0,.15)) }
    .nameplate{
      position:absolute; bottom:72px; left:50%; transform:translateX(-50%);
      font:600 .75rem ui-sans-serif, system-ui; color:#20312a; background:#ffffffd9; border:2px solid #2f2626; border-radius:8px; padding:2px 6px;
    }
    .mini-bubble{
      position:absolute; bottom:90px; left:50%; transform:translateX(-50%);
      background:#fff; border:2px solid #2f2626; border-radius:10px; padding:4px 6px; font:700 .75rem/1.22 ui-sans-serif; color:#222; max-width:220px;
      filter: drop-shadow(0 4px 10px rgba(0,0,0,.12)); white-space:nowrap;
    }
    .mini-bubble::after{
      content:""; position:absolute; bottom:-8px; left:50%; transform:translateX(-50%);
      border-left:8px solid transparent; border-right:8px solid transparent; border-top:8px solid #fff; filter: drop-shadow(0 1px 0 #2f2626);
    }

    /* Items */
    .item{ position:absolute; transform:translate(-50%,0); font-size:28px; line-height:1; pointer-events:none; filter: drop-shadow(0 6px 10px rgba(0,0,0,.15)) }

    /* Lagerfeuer */
    .camp{ position:absolute; transform:translate(-50%,0); width:110px; height:110px; pointer-events:none; z-index:1003 }
    .logs::before, .logs::after{ content:""; position:absolute; left:50%; top:65%; width:90px; height:12px; background:#6b4631; border:2px solid #3f281d; border-radius:6px; transform-origin:center }
    .logs::before{ transform:translate(-50%,-50%) rotate(22deg) }
    .logs::after { transform:translate(-50%,-50%) rotate(-22deg) }
    .flame{
      position:absolute; left:50%; top:42%; width:54px; height:54px; transform:translate(-50%,-50%);
      background: radial-gradient(closest-side, #ffd66b, #ff8c3a 65%, rgba(255,140,58,.1) 70%);
      border-radius:50%; animation: flicker .9s ease-in-out infinite; filter: blur(.3px) drop-shadow(0 0 16px rgba(255,128,0,.5));
    }
    @keyframes flicker{ 0%,100%{ transform:translate(-50%,-50%) scale(1) } 40%{ transform:translate(calc(-50% + 1px), calc(-50% - 2px)) scale(1.12) } 70%{ transform:translate(calc(-50% - 1px), calc(-50% - 1px)) scale(.92) } }
    .camp-bubble{
      position:absolute; left:50%; bottom:98px; transform:translateX(-50%);
      background:#fff; border:2px solid #2f2626; border-radius:10px; padding:6px 8px; font:700 .8rem/1.25 ui-sans-serif; color:#222; max-width:220px; text-align:center;
    }
    .camp-bubble::after{ content:""; position:absolute; bottom:-8px; left:50%; transform:translateX(-50%); border-left:8px solid transparent; border-right:8px solid transparent; border-top:8px solid #fff; filter: drop-shadow(0 1px 0 #2f2626); }
  </style>
</head>
<body>
  <main>
    <!-- Kontakt & PGP (bleibt sichtbar über Overlay) -->
    <section class="card" id="kontakt">
      <h2 style="margin:.2rem 0 .5rem;">Kontakt & PGP</h2>
      <div style="display:flex; gap:.75rem; flex-wrap:wrap; align-items:center; margin:.25rem 0 1rem;">
        <a class="btn" href="mailto:benedikt@schackenberg.com">📧 benedikt@schackenberg.com</a>
        <a class="btn" href="{{ '/assets/keys/benedikt-schackenberg.asc' | relative_url }}" download>⬇️ PGP-Schlüssel (.asc)</a>
        <button type="button" class="copy" onclick="copyKey()">📋 PGP in Zwischenablage</button>
      </div>
<pre id="pgp-key">HASE HASE
     (\_/)
     (o.o)
     (> <)</pre>
    </section>

    <!-- Optionales Grid (falls du Bilder rotieren lässt) -->
    <section class="frame" style="margin-top:1rem;">
      <div class="header">Galerie</div>
      <div id="grid" class="grid"></div>
    </section>
  </main>

  <!-- ===== Vollbild-Wald Overlay ===== -->
  <div id="forest" class="forest" aria-live="polite">
    <div class="ui"><button id="soundBtn" class="sound-btn" aria-pressed="false" title="Sound an/aus">🔇</button></div>
    <div class="floaty">
      <div class="layer sky"></div>
      <div class="layer far"></div>
      <div class="layer mid"></div>
      <div class="layer near"></div>
      <div class="ground"></div>

      <!-- Pixel-Haus in der Mitte (mit sichtbarem Dach & Kontaktbalken) -->
      <div id="house" class="house">
        <div class="roof"></div>
        <div class="beam">
          <a href="mailto:benedikt@schackenberg.com" title="E-Mail senden">📧 benedikt@schackenberg.com</a>
          <span>•</span>
          <a href="{{ '/assets/keys/benedikt-schackenberg.asc' | relative_url }}" title="PGP-Schlüssel herunterladen" download>🔐 PGP</a>
        </div>
        <div class="body">
          <div class="door"></div>
          <div class="win l"></div>
          <div class="win r"></div>
        </div>
      </div>

      <!-- Hase -->
      <div id="bunnyWrap" class="actor" style="left:20%; bottom:64px;">
        <div id="bunny" class="bunny" role="img" aria-label="Pixelhase"></div>
      </div>

      <!-- Globale Sprechblase (folgt dem Hasen) -->
      <div class="bubble" id="bubble" style="left:20%; bottom:180px;">Möhre in Sicht – Mission gestartet! 🥕</div>

      <!-- Lagerfeuer -->
      <div id="camp" class="camp" style="left:50%; bottom:64px; display:none;">
        <div class="logs"></div>
        <div class="flame"></div>
        <div class="camp-bubble" id="campTalk">Willkommen am Feuer!</div>
      </div>
    </div>
  </div>

  <script>
    /* ===== Grid ===== */
    const IMAGES = [
      {% assign pics = site.static_files | where_exp:"f","f.path contains '/assets/img/'" | where_exp:"f","f.extname == '.png' or f.extname == '.jpg' or f.extname == '.jpeg' or f.extname == '.gif' or f.extname == '.webp'" %}
      {% for f in pics %}"{{ f.path | relative_url }}"{% unless forloop.last %},{% endunless %}{% endfor %}
    ];
    (function(){
      const c=document.getElementById('grid'); if(!c||!IMAGES.length)return;
      const N=12; let start=0;
      const tiles=[]; for(let i=0;i<N;i++){let f=document.createElement('figure');f.className='tile';let im=document.createElement('img');f.appendChild(im);c.appendChild(f);tiles.push(im);}
      const next=()=>{let set=[];for(let i=0;i<N;i++)set.push(IMAGES[(start+i)%IMAGES.length]);start=(start+N)%IMAGES.length;return set;};
      const swap=urls=>tiles.forEach((im,i)=>{im.classList.add('fade-out');setTimeout(()=>{im.src=urls[i];im.onload=()=>im.classList.remove('fade-out');},180);});
      swap(next()); setInterval(()=>swap(next()),5000);
    })();

    /* ===== PGP Copy ===== */
    function copyKey(){
      const key = document.getElementById('pgp-key')?.innerText || '';
      navigator.clipboard.writeText(key).then(()=>alert('PGP-Schlüssel kopiert ✅'));
    }

    /* ===== Vollbild-Wald Logik ===== */
    (function(){
      const forest = document.getElementById('forest');
      const bubble = document.getElementById('bubble');
      const bunnyWrap = document.getElementById('bunnyWrap');
      const bunny = document.getElementById('bunny');
      const camp = document.getElementById('camp');
      const campTalk = document.getElementById('campTalk');
      const house = document.getElementById('house');

      let W = window.innerWidth, H = window.innerHeight, GROUND = 64;
      function onResize(){ W = window.innerWidth; H = window.innerHeight; computeHouseX(); }
      window.addEventListener('resize', onResize);

      /* Haus-Position X (Tür) für Ziele */
      let houseX = 0;
      function computeHouseX(){
        const rect = house.getBoundingClientRect();
        houseX = rect.left + rect.width/2; // Mitte des Hauses
      }
      computeHouseX();

      /* Fallback Sprite */
      const img = new Image();
      img.src = "{{ '/assets/img/hase-sprite.png' | relative_url }}";
      img.onerror = () => { bunny.className = 'fallback-emoji'; bunny.textContent = '🐰'; };

      /* ===== Mini-Audioengine ===== */
      let audioCtx = null, soundOn = false, fireGain = null, fireSrc = null;
      const soundBtn = document.getElementById('soundBtn');
      soundBtn.addEventListener('click', async () => {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') await audioCtx.resume();
        soundOn = !soundOn;
        soundBtn.textContent = soundOn ? '🔊' : '🔇';
        soundBtn.setAttribute('aria-pressed', soundOn ? 'true' : 'false');
        if (!soundOn) stopFire();
      });

      function env(duration=0.15, gain=0.25){
        if (!audioCtx || !soundOn) return null;
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.connect(g); g.connect(audioCtx.destination);
        g.gain.setValueAtTime(0, audioCtx.currentTime);
        g.gain.linearRampToValueAtTime(gain, audioCtx.currentTime + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
        return {o,g,stopAt: audioCtx.currentTime + duration};
      }
      function playHop(){ const e = env(0.12, 0.18); if(!e) return; e.o.type='sine'; e.o.frequency.setValueAtTime(320, audioCtx.currentTime); e.o.frequency.exponentialRampToValueAtTime(180, e.stopAt); e.o.start(); e.o.stop(e.stopAt); }
      function playMeet(){ const e = env(0.22, 0.25); if(!e) return; e.o.type='triangle'; e.o.frequency.setValueAtTime(520, audioCtx.currentTime); e.o.frequency.exponentialRampToValueAtTime(880, e.stopAt); e.o.start(); e.o.stop(e.stopAt); }
      function startFire(){
        if (!audioCtx || !soundOn || fireSrc) return;
        const bufferSize = 2 * audioCtx.sampleRate;
        const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) { output[i] = Math.random()*2 - 1; }
        const noise = audioCtx.createBufferSource(); noise.buffer = noiseBuffer; noise.loop = true;
        const filter = audioCtx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 1800;
        fireGain = audioCtx.createGain(); fireGain.gain.value = 0.08;
        noise.connect(filter); filter.connect(fireGain); fireGain.connect(audioCtx.destination);
        noise.start(); fireSrc = noise;
      }
      function stopFire(){ if (fireSrc){ try{ fireSrc.stop(); }catch{} fireSrc.disconnect(); fireSrc=null; } if (fireGain){ fireGain.disconnect(); fireGain=null; } }

      /* ===== „KI“-artige Hasen-Sprüche ===== */
      function pick(a){ return a[Math.floor(Math.random()*a.length)]; }
      const who = ["Hase", "Meister Lampe", "Pixel-Hoppel", "Karotten-Profi", "Wald-Admin"];
      const rule = ["Regel", "Weisheit", "Memo", "Best Practice", "Hotfix"];
      const nouns = ["Möhre", "Wiese", "Wald", "Nuss-Cache", "Rüben-Cluster", "Karotten-Index"];
      const endings = ["– erst hoppeln, dann denken.","mit flauschiger Zuverlässigkeit.","bei niedriger Latenz und hoher Flauschigkeit.","… bitte nicht in Produktion testen.","und bleibt dabei 100 % süß.","— Commit und weg!"];
      const techAddons = ["JIT-Hoppeln aktiviert.","Transaktion: BEGIN… HOP… COMMIT.","Monitoring: alles grün.","Load Balancer verteilt Möhren fair.","TLS: Tolle Löffel Sicherheit."];
      function genQuote(){
        const r = Math.random();
        if (r < 0.33) return `${pick(who)} ${pick(rule)} Nr. ${1+Math.floor(Math.random()*9)}: ${pick(nouns)} ${pick(endings)}`;
        if (r < 0.66) return `Fun-Fact: ${pick(who)} ${pick(nouns)}. ${pick(techAddons)}`;
        return `Gerücht im Wald: ${pick(nouns)} auf Version ${1+Math.floor(Math.random()*3)}.${Math.floor(Math.random()*10)} gepatcht. ${pick(techAddons)}`;
      }

      /* ===== Tiere ===== */
      const ANIMALS = [
        {sp:"fox",  emoji:"🦊", name:"Fuchs Fritz",  lines:["Deal: Du die Möhre, ich den Ruhm?","Heute nur Salat – Ehrenwort!"]},
        {sp:"raccoon",emoji:"🦝", name:"Rudi Waschbär", lines:["Hab’ die Möhre im Cache.","Nur kurz Admin… für die Wissenschaft."]},
        {sp:"squirrel",emoji:"🐿️", name:"Elli Eichhörnchen", lines:["Sprint? Ich hab Nüsse!","Latency niedrig, Spaß hoch!"]},
        {sp:"bird", emoji:"🐦", name:"Amy Amsel", lines:["Ich logge deine Hops in die Cloud.","Bandbreite: 100 Löffel/s."]},
        {sp:"frog", emoji:"🐸", name:"Fred Frosch",  lines:["QuakOps meldet: Alles grün.","CI/CD = Continuous Insekten Delivery!"]},
        {sp:"rabbit",emoji:"🐰", name:"Hugo Hase",   lines:["Hop-Partner gefunden!","Synchron-Hoppeln aktiviert."]},
        {sp:"hedgehog",emoji:"🦔", name:"Ida Igel",  lines:["Ich rolle, wenn’s brenzlig wird.","Schnell, aber stachelig."]},
        {sp:"bear", emoji:"🐻", name:"Berti Bär",    lines:["Ich mache nur Long-Hops.","Cache? Ich nenne es Winter."]},
        {sp:"deer", emoji:"🦌", name:"Rika Reh",     lines:["Licht? Ich freeze kurz…","Silent Mode aktiviert."]},
        {sp:"owl",  emoji:"🦉", name:"Olli Eule",    lines:["Night-Shift online.","Weise hoppelt, wer spät hoppelt."]},
        {sp:"boar", emoji:"🐗", name:"Willi Wildschwein", lines:["Root-Rechte? Ich grunze mal.","Schlamm-Logging aktiv."]},
        {sp:"badger",emoji:"🦡", name:"Dora Dachs",  lines:["Ich buddle den Tunnel – VPN!","Backups im Bau."]},
      ];
      function pairMode(a,b){
        const pair = [a.sp, b.sp].sort().join("-");
        if (pair.includes("fox") && (pair.includes("rabbit") || pair.includes("squirrel"))) return "chase";
        if (Math.random() < 0.25) return "trade";
        return Math.random() < 0.6 ? "chat" : "dance";
      }

      const actors = []; // aktive Tiere
      const MAX_ANIMALS = 12, MIN_ANIMALS = 7;
      const ITEM_EMO = ["🥕","🌰","🍄","🍎"];

      const aliveCount = () => actors.filter(a=>!a.dead).length;

      function spawnAnimal(towardsX = null){
        if (aliveCount() >= MAX_ANIMALS) return;
        const a = ANIMALS[Math.floor(Math.random()*ANIMALS.length)];
        const wrap = document.createElement('div'); wrap.className='actor';
        const span = document.createElement('span'); span.className='animal'; span.textContent = a.emoji;
        const label = document.createElement('div'); label.className='nameplate'; label.textContent = a.name;
        wrap.appendChild(span); wrap.appendChild(label);
        forest.querySelector('.floaty').appendChild(wrap);

        const side = Math.floor(Math.random()*4);
        let ax, ay, vx, vy;
        const margin = 30;
        if (side===0){ ax = -40; ay = GROUND; vx = 0.28 + Math.random()*0.35; vy = 0; }
        if (side===1){ ax = W+40; ay = GROUND; vx = -(0.28 + Math.random()*0.35); vy = 0; }
        if (side===2){ ax = Math.random()*(W-2*margin)+margin; ay = H+40; vx = (Math.random()<.5?-1:1)*(0.2+Math.random()*0.2); vy = -(0.35+Math.random()*0.3); }
        if (side===3){ ax = Math.random()*(W-2*margin)+margin; ay = GROUND; vx = (Math.random()<.5?-1:1)*(0.25+Math.random()*0.3); vy = 0; }

        wrap.style.left = ax + 'px'; wrap.style.bottom = ay + 'px';
        const actor = {el:wrap, sp:a.sp, x:ax, y:ay, vx, vy, lines:a.lines, name:a.name, state:towardsX!=null?'toCamp':'roam', targetX:towardsX};
        actors.push(actor);

        setTimeout(()=>despawn(actor), 20000 + Math.random()*10000);
      }

      function despawn(actor){
        if (!actor || actor.dead) return;
        actor.dead = true;
        actor.el.style.opacity = 0;
        setTimeout(()=>{
          try{ actor.el.remove(); }catch{}
          const idx = actors.indexOf(actor);
          if (idx > -1) actors.splice(idx,1);
        }, 350);
      }

      function say(actor, text, ms=1900){
        if (!actor || actor.dead) return;
        if (!actor.mini){
          actor.mini = document.createElement('div');
          actor.mini.className = 'mini-bubble';
          actor.el.appendChild(actor.mini);
        }
        actor.mini.textContent = text;
        actor.mini.style.display = 'block';
        setTimeout(()=>{ if(actor.mini) actor.mini.style.display='none'; }, ms);
      }

      function setBubble(text){
        bubble.classList.add('fade');
        setTimeout(()=>{ bubble.textContent = text; bubble.classList.remove('fade'); }, 200);
      }

      // Lagerfeuer
      let campActive = false, campX = W/2, campTimer = null, campChatTimer = null;
      function moveCampRandom(){ const margin = 100; campX = Math.floor(margin + Math.random()*(W-2*margin)); camp.style.left = campX + 'px'; }
      function startFireCamp(){
        campActive = true; camp.style.display='block'; moveCampRandom();
        campTalk.textContent = "🔥 Lagerfeuer: Treffpunkt!";
        const needed = 3 + Math.floor(Math.random()*3);
        let redirected = 0;
        actors.forEach(a => { if (!a.dead && redirected < needed){ a.targetX = campX; a.state='toCamp'; redirected++; }});
        for (let i=redirected; i<needed; i++) spawnAnimal(campX);
        if (campChatTimer) clearInterval(campChatTimer);
        campChatTimer = setInterval(()=> {
          const atCamp = actors.filter(a => !a.dead && Math.abs(a.x - campX) < 36 && Math.abs(a.y - GROUND) < 12);
          campTalk.textContent = atCamp.length ? `${pick(atCamp).name}: ${pick(pick(atCamp).lines)}` : "🔥 Knistern…";
        }, 2600);
        if (campTimer) clearTimeout(campTimer);
        campTimer = setTimeout(stopCamp, 15000 + Math.random()*5000);
      }
      function stopCamp(){ campActive=false; camp.style.display='none'; actors.forEach(a=>{ if(!a.dead){ a.targetX=undefined; a.state='roam'; }}); clearInterval(campChatTimer); setTimeout(startFireCamp, 14000 + Math.random()*10000); }

      // Items
      function spawnItem(){
        const margin = 80;
        const x = Math.floor(margin + Math.random()*(W-2*margin));
        const el = document.createElement('div');
        el.className = 'item';
        el.textContent = ["🥕","🌰","🍄","🍎"][Math.floor(Math.random()*4)];
        el.style.left = x + 'px';
        el.style.bottom = (GROUND + 2) + 'px';
        forest.querySelector('.floaty').appendChild(el);
        return {el, x};
      }

      function scheduleTask(){
        const alive = actors.filter(a=>!a.dead && (a.state==='roam' || a.state==='met'));
        if (!alive.length) return;
        const choice = Math.random();
        if (choice < 0.33){
          const a = alive[Math.floor(Math.random()*alive.length)];
          const item = spawnItem();
          a.targetX = item.x; a.state='toItem';
          const chk = setInterval(()=>{
            if (a.dead){ clearInterval(chk); return; }
            if (Math.abs(a.x - item.x) < 22){
              if (!a.item){
                a.item = document.createElement('div'); a.item.className='item'; a.item.textContent = item.el.textContent;
                a.el.appendChild(a.item); a.item.style.left='50%'; a.item.style.bottom='84px';
              }
              try{ item.el.remove(); }catch{}
              a.targetX = houseX; a.state='toHouse'; say(a,"Lieferung!",1400);
              clearInterval(chk);
            }
          }, 200);
        } else if (choice < 0.6){
          const leader = alive[Math.floor(Math.random()*alive.length)]; say(leader,"Parade!",1200);
          const followers = alive.filter(x=>x!==leader).slice(0, Math.min(3, alive.length-1));
          followers.forEach((f,k)=>{ f.state='follow'; f.follow={leader, offset:(k+1)*40, sign: Math.random()<.5?-1:1}; say(f,"🎺",1000); setTimeout(()=>{ f.state='roam'; f.follow=null; }, 5000); });
          setTimeout(()=>{ leader.state='roam'; }, 5200);
        } else {
          const group = alive.slice(0, Math.min(4, alive.length));
          group.forEach((g,i)=>{ g.targetX = houseX + (i-1.5)*28; g.state='toHouse'; });
          setTimeout(()=>{ group.forEach(g=>say(g, g.lines[Math.floor(Math.random()*g.lines.length)])); }, 2000);
        }
      }
      setInterval(scheduleTask, 5000);

      // Population dauerhaft halten
      setInterval(()=>{
        const alive = aliveCount();
        if (alive < MIN_ANIMALS){ for (let i=0;i<MIN_ANIMALS-alive;i++) spawnAnimal(null); }
        else if (alive < MAX_ANIMALS && Math.random()<0.6){ spawnAnimal(null); }
      }, 2200);

      // Hase
      let dir = 1, bunnyX = Math.max(120, window.innerWidth*0.2), bunnySpeed = 0.9;
      bunnyWrap.style.left = bunnyX + 'px';
      bubble.style.left = bunnyX + 'px';

      function tryPairInteractions(){
        const list = actors.filter(a=>!a.dead && (a.state==='roam' || a.state==='met'));
        for (let i=0;i<list.length;i++){
          for (let j=i+1;j<list.length;j++){
            const a = list[i], b = list[j];
            if (a.busy || b.busy) continue;
            const dx = Math.abs(a.x - b.x), dy = Math.abs(a.y - b.y);
            if (dx < 70 && dy < 40 && Math.random()<0.3){
              const r = Math.random();
              let mode = "chat";
              if (r < .25) mode = "trade"; else if (r < .55) mode = "dance"; else if (r < .75) mode = "chat"; else mode = "chase";
              if (mode==="chat"){
                a.busy=b.busy=true; a.state=b.state='pairChat'; say(a, a.lines[Math.floor(Math.random()*a.lines.length)]); say(b, b.lines[Math.floor(Math.random()*b.lines.length)]);
                setTimeout(()=>{ a.busy=b.busy=false; a.state='roam'; b.state='roam'; }, 1900);
              } else if (mode==="dance"){
                a.busy=b.busy=true; a.state=b.state='dance';
                const oa=a.vx, ob=b.vx; a.vx = (a.x<b.x?-1:1)*0.15; b.vx = -a.vx; say(a,"🕺"); say(b,"💃");
                setTimeout(()=>{ a.vx=oa; b.vx=ob; a.busy=b.busy=false; a.state='roam'; b.state='roam'; }, 1600);
              } else if (mode==="chase"){
                a.busy=b.busy=true; const fox = a.sp==="fox"?a:b, prey = a.sp==="fox"?b:a;
                fox.state='chase'; prey.state='run'; const foxBoost=0.55, preyBoost=0.45; const chaseDur=2200+Math.random()*1200; const start=performance.now();
                (function chaseStep(t){
                  if (fox.dead || prey.dead){ fox.busy=prey.busy=false; return; }
                  if ((t-start) > chaseDur){ fox.busy=prey.busy=false; fox.state=prey.state='roam'; return; }
                  fox.vx = Math.sign(prey.x - fox.x) * foxBoost; prey.vx = Math.sign(prey.x - fox.x) * preyBoost;
                  if (Math.abs(fox.x - prey.x) < 40){ say(fox,"Gefangen!"); say(prey,"GG!"); fox.busy=prey.busy=false; fox.state=prey.state='roam'; return; }
                  requestAnimationFrame(chaseStep);
                })(performance.now());
              } else if (mode==="trade"){
                a.busy=b.busy=true; a.state=b.state='trade';
                if (!a.item){ a.item=document.createElement('div'); a.item.className='item'; a.item.textContent=["🥕","🌰","🍄","🍎"][Math.floor(Math.random()*4)]; a.el.appendChild(a.item); a.item.style.left='50%'; a.item.style.bottom='84px'; }
                if (!b.item){ b.item=document.createElement('div'); b.item.className='item'; b.item.textContent=["🥕","🌰","🍄","🍎"][Math.floor(Math.random()*4)]; b.el.appendChild(b.item); b.item.style.left='50%'; b.item.style.bottom='84px'; }
                const tmp = a.item.textContent; a.item.textContent=b.item.textContent; b.item.textContent=tmp; say(a,"Tausch!"); say(b,"Deal!");
                setTimeout(()=>{ a.busy=b.busy=false; a.state=b.state='roam'; }, 1800);
              }
            }
          }
        }
      }

      // Hauptloop
      function tick(){
        // Hase bewegt sich
        bunnyX += dir * bunnySpeed;
        const minX = 40, maxX = W - 40;
        if (bunnyX > maxX){ dir = -1; bunny.classList.add('flip'); }
        if (bunnyX < minX){ dir = 1;  bunny.classList.remove('flip'); }
        bunnyWrap.style.left = bunnyX + 'px';
        bubble.style.left = bunnyX + 26 + 'px';
        bubble.style.bottom = (GROUND + 96 + 20) + 'px';

        // Tiere bewegen + Ziele
        for (const a of actors){
          if (a.dead) continue;

          if (a.state==='follow' && a.follow){
            const {leader, offset, sign} = a.follow;
            if (!leader.dead){ const target = leader.x + sign*offset; a.vx = Math.sign(target - a.x) * 0.22; }
          }
          if (a.state==='toItem' && typeof a.targetX==='number'){ a.vx = Math.sign(a.targetX - a.x) * Math.max(0.22, Math.abs(a.vx)); }
          if (a.state==='toHouse' && typeof a.targetX==='number'){
            a.vx = Math.sign(a.targetX - a.x) * Math.max(0.22, Math.abs(a.vx));
            if (Math.abs(a.targetX - a.x) < 24){ if (a.item){ try{ a.item.remove(); }catch{} a.item=null; say(a,"Abgelegt! ✅",1200); a.state='roam'; } }
          }
          if (a.state==='toCamp' && typeof a.targetX==='number'){ a.vx = Math.sign(a.targetX - a.x) * Math.max(0.22, Math.abs(a.vx)); if (Math.abs(a.targetX - a.x) < 28){ a.vx = 0; a.state='atCamp'; } }

          a.x += a.vx; a.y += a.vy;
          if (a.y < GROUND){ a.y = GROUND; a.vy = 0; }
          a.el.style.left = a.x + 'px'; a.el.style.bottom = a.y + 'px';

          // Begegnung mit Hase
          const dx = Math.abs(a.x - bunnyX), dy = Math.abs(a.y - GROUND);
          if (dx < 60 && dy < 40 && a.state !== 'atCamp' && !a.met){
            setBubble(genQuote());
            a.met = true; setTimeout(()=>{ a.met = false; }, 6000);
          }

          // raus -> despawn
          if (a.state==='roam' && (a.x < -80 || a.x > W+80 || a.y > H+80)) despawn(a);
        }

        tryPairInteractions();
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);

      // generierte Hasen-Sprüche
      setInterval(()=> setBubble(genQuote()), 8000 + Math.random()*4000);

      // Camp starten & versetzen
      setTimeout(startFireCamp, 3000);
      setInterval(()=> { if (campActive) moveCampRandom(); }, 6000);

      // initiale Population
      for (let i=0;i<MIN_ANIMALS;i++) spawnAnimal(null);
    })();
  </script>
</body>
</html>
