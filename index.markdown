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
    :root {
      --maxw: 1000px;
      --shadow: 0 10px 24px rgba(0,0,0,.07);
      --border:#e9edf3;
      --hoppel-bg: #8ecae6;
      --bubble:#fff;
      --bubble-border:#3b2f2f;
    }
    * { box-sizing: border-box; }
    body { margin:0; background:#f6f8fb; color:#111; font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial; overflow-x:hidden; }
    main { width:min(100%, var(--maxw)); margin: 1.5rem auto 3rem; padding: 0 1rem; }

    .frame { position:relative; background:#fff; border:1px solid var(--border); border-radius:16px; box-shadow:var(--shadow); overflow:hidden; }
    .frame .header { padding: .9rem 1rem; border-bottom: 1px solid var(--border); text-align:center; font-weight:600; }

    /* Kachel-Grid */
    .grid {
      display: grid;
      gap: 8px;
      padding: 10px;
      grid-template-columns: repeat(2, 1fr);
    }
    @media (min-width: 540px) { .grid { grid-template-columns: repeat(3, 1fr); } }
    @media (min-width: 760px) { .grid { grid-template-columns: repeat(4, 1fr); } }
    @media (min-width: 980px) { .grid { grid-template-columns: repeat(6, 1fr); } }
    .tile {
      position: relative; width: 100%; aspect-ratio: 1/1;
      background:#fff; border:1px solid var(--border); border-radius:12px; overflow:hidden;
      box-shadow:0 6px 16px rgba(0,0,0,.05);
    }
    .tile img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; opacity:1; transition: opacity .35s; }
    .tile img.fade-out { opacity:0; }

    /* Rest */
    .card { background:#fff; border:1px solid var(--border); border-radius:16px; padding:1.25rem; box-shadow:var(--shadow); line-height:1.6; margin-top:1rem; }
    .btn { display:inline-block; border:1px solid #e5e7eb; border-radius:10px; padding:.6rem .9rem; text-decoration:none; color:#111; background:#fff; }
    .btn:hover, button.copy:hover { background:#f3f5f8; }
    button.copy { border:1px solid #e5e7eb; border-radius:10px; padding:.6rem .9rem; background:#fff; cursor:pointer; }
    pre { background:#0b1220; color:#e6edf3; padding:1rem; border-radius:12px; overflow:auto;
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size:.9rem; }

    /* Rechts: Hoppel-Widget */
    .hoppel {
      position:fixed; top:1rem; right:1rem; width:300px; height:240px;
      border:4px solid #3b2f2f; border-radius:14px; background:var(--hoppel-bg);
      box-shadow:0 12px 30px rgba(0,0,0,.18); overflow:hidden; image-rendering:pixelated; z-index:999;
      display:flex; flex-direction:column; justify-content:flex-end; align-items:flex-start; padding:8px 10px 10px;
    }
    @media (max-width:880px){ .hoppel {display:none;} }

    /* Sprechblase */
    .bubble {
      position:absolute; top:8px; right:10px; max-width:220px;
      background:var(--bubble); border:3px solid var(--bubble-border); border-radius:12px;
      padding:10px 12px; font:700 .9rem/1.3 ui-sans-serif,system-ui; color:#2b2626;
      box-shadow:0 6px 16px rgba(0,0,0,.12);
      transform-origin: 100% 0;
      animation: bubbleIn .25s ease-out;
    }
    .bubble::after {
      content:""; position:absolute; bottom:-10px; right:22px; width:0; height:0;
      border-left:10px solid transparent; border-right:10px solid transparent;
      border-top:10px solid var(--bubble);
      filter: drop-shadow(0 2px 0 var(--bubble-border));
    }
    @keyframes bubbleIn { from{ transform:scale(.9); opacity:0 } to{ transform:scale(1); opacity:1 } }
    .bubble.fade { opacity:0; transition: opacity .25s ease }

    .hoppel .bunny{
      position:absolute; bottom:8px; left:10px; width:96px; height:96px;
      background: url("{{ '/assets/img/hase-sprite.png' | relative_url }}") 0 0 / 384px 96px no-repeat;
      animation: hopFrames .6s steps(4) infinite, hopMove 6s linear infinite;
    }
    .hoppel .bunny.flip{ transform:scaleX(-1); }
    @keyframes hopFrames{from{background-position:0 0;}to{background-position:-384px 0;}}
    @keyframes hopMove{
      0%{left:-120px;bottom:8px;} 20%{bottom:68px;} 40%{bottom:8px;}
      60%{bottom:58px;} 80%{bottom:8px;} 100%{left:calc(100% + 40px);bottom:8px;}
    }

    /* Fallende Sprüche (optional – bleibt unangetastet) */
    .fall { position:fixed; top:-2rem; left:50%; transform:translateX(-50%);
      font:700 1rem/1.3 ui-sans-serif,system-ui; color:#3b2f2f; white-space:nowrap; pointer-events:none; opacity:.9;
      animation: fallDown 8s linear forwards; z-index:500;
    }
    @keyframes fallDown { to{ transform:translateX(-50%) translateY(110vh);} }

    /* Carrot-Hunt Overlay (bleibt) */
    .hunt-layer{ position: fixed; inset: 0; pointer-events: none; z-index: 700; overflow: hidden; }
    .hunt-emoji{ position:absolute; will-change: transform, opacity; transition: transform var(--moveDur, 3s) linear, opacity .3s ease;
      filter: drop-shadow(0 6px 10px rgba(0,0,0,.12)); user-select: none; }
    .hunt-carrot, .hunt-bunny { font-size: clamp(22px, 2.2vw, 34px); }
    .hunt-fade { opacity:0; }
  </style>
</head>
<body>
  <!-- ElevenLabs Widget links -->
  <div style="position:fixed;top:1rem;left:1rem;z-index:1000;">
    <elevenlabs-convai agent-id="agent_1001k3etgzc8ejnt6q640dcwhxww"></elevenlabs-convai>
  </div>
  <script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async type="text/javascript"></script>

<main>
  <section class="frame">
    <div class="header">Hasen Power</div>
    <div id="grid" class="grid"></div>
  </section>

  <!-- Kontakt & PGP -->
  <section class="card">
    <h2 style="margin:.2rem 0 .5rem;">Kontakt & PGP</h2>
    <div style="display:flex; gap:.75rem; flex-wrap:wrap; align-items:center; margin:.25rem 0 1rem;">
      <a class="btn" href="mailto:benedikt@schackenberg.com">📧 benedikt@schackenberg.com</a>
      <a class="btn" href="{{ '/assets/keys/benedikt-schackenberg.asc' | relative_url }}" download>⬇️ PGP-Schlüssel (.asc)</a>
      <button type="button" class="copy" onclick="copyKey()">📋 PGP in Zwischenablage</button>
    </div>
    <pre id="pgp-key">-----BEGIN PGP PUBLIC KEY BLOCK-----

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
=qPcL
-----END PGP PUBLIC KEY BLOCK-----</pre>
  </section>
</main>

<!-- Rechts: Pixelhase mit Sprechblase -->
<aside class="hoppel" aria-live="polite">
  <div class="bubble" id="hoppel-quote">Möhre in Sicht – Mission gestartet! 🥕</div>
  <div id="bunny" class="bunny" role="img" aria-label="Pixelhase"></div>
</aside>

<!-- Carrot-Hunt Overlay -->
<div id="huntLayer" class="hunt-layer" aria-hidden="true"></div>

<script>
  // === Kachel-Grid wie gehabt ===
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

  // === PGP Copy ===
  function copyKey(){
    const key = document.getElementById('pgp-key')?.innerText || '';
    navigator.clipboard.writeText(key).then(()=>alert('PGP-Schlüssel kopiert ✅'));
  }

  // === Rechts: Pixelhase flippt zufällig ===
  document.getElementById('bunny').addEventListener("animationiteration",e=>{
    if(e.animationName==="hopMove"&&Math.random()<0.5){e.target.classList.toggle("flip");}
  });

  // === Sprechblase: lustige Sprüche rotieren ===
  (function(){
    const QUOTES = [
      "Möhre in Sicht – Mission gestartet! 🥕",
      "Ich bin nicht klein, nur pixel-effizient.",
      "Hasenregel Nr. 1: Erst hoppeln, dann denken.",
      "Mehr Möhren, weniger Sorgen.",
      "95% Hase, 5% Ninja.",
      "Ich cache Karotten im RAM – Rüben-Access-Memory.",
      "Laufzeitoptimierung? Ich hoppel JIT.",
      "An alle: bleibt flauschig! ✨",
      "Wer braucht Glück, wenn man Löffel hat?",
      "Sprint beendet. Nächster Hop incoming…"
    ];
    const el = document.getElementById('hoppel-quote');
    let last = -1;
    function nextQuote(){
      let i; do { i = Math.floor(Math.random()*QUOTES.length); } while(i===last);
      last = i;
      el.classList.add('fade');
      setTimeout(()=>{ el.textContent = QUOTES[i]; el.classList.remove('fade'); }, 250);
    }
    // Wechsel alle 6 Sekunden
    setInterval(nextQuote, 6000);
    // Klick = sofort neuer Spruch
    el.addEventListener('click', nextQuote);
  })();

  // === Endlose, zufällige Carrot-Hunt über gesamte Seite (wie gehabt) ===
  (function(){
    const L = document.getElementById('huntLayer');
    const BUNNIES = ["🐇","🐰","🐭","🐿️","🦝","🦊","👨‍🔧"]; // „Mario“-Gag bleibt :)
    const rand = (a,b)=> Math.random()*(b-a)+a;
    const randint = (a,b)=> Math.floor(rand(a,b+1));
    const vw = ()=> Math.max(document.documentElement.clientWidth,  window.innerWidth  || 0);
    const vh = ()=> Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    function spawnHunt(){
      const cx = randint(10, vw()-50);
      const cy = randint(60, vh()-60);

      const carrot = document.createElement('div');
      carrot.className = 'hunt-emoji hunt-carrot';
      carrot.textContent = '🥕';
      carrot.style.left = cx + 'px';
      carrot.style.top  = cy + 'px';
      L.appendChild(carrot);

      setTimeout(()=>{
        const count = randint(3,5);
        for (let i=0; i<count; i++){
          const h = document.createElement('div');
          h.className = 'hunt-emoji hunt-bunny';
          h.textContent = BUNNIES[randint(0, BUNNIES.length-1)];

          const side = randint(0,3);
          let x, y;
          if (side===0){ x = randint(-60, -20);  y = randint(20, vh()-20); }
          if (side===1){ x = randint(vw()+20, vw()+60); y = randint(20, vh()-20); }
          if (side===2){ x = randint(20, vw()-20); y = randint(-60, -20); }
          if (side===3){ x = randint(20, vw()-20); y = randint(vh()+20, vh()+60); }

          h.style.left = x + 'px';
          h.style.top  = y + 'px';
          const dur = rand(2.8, 4.2).toFixed(2) + 's';
          h.style.setProperty('--moveDur', dur);
          L.appendChild(h);

          setTimeout(()=>{
            const jitterX = randint(-12, 12);
            const jitterY = randint(-10, 10);
            h.style.transform = `translate(${(cx - x + jitterX)}px, ${(cy - y + jitterY)}px)`;
          }, i*180);
        }

        setTimeout(()=>{ carrot.classList.add('hunt-fade'); setTimeout(()=> carrot.remove(), 350); }, randint(4000, 5000));
        setTimeout(()=>{ [...L.querySelectorAll('.hunt-bunny')].forEach(b=>{ b.classList.add('hunt-fade'); setTimeout(()=> b.remove(), 400); }); }, randint(4700, 6200));
      }, 2000);

      setTimeout(spawnHunt, randint(8000, 14000));
    }

    setTimeout(spawnHunt, 1500);
    window.addEventListener('resize', ()=>{ [...L.children].forEach(el=>{ el.classList.add('hunt-fade'); setTimeout(()=>el.remove(), 250); }); });
  })();
</script>

</body>
</html>
