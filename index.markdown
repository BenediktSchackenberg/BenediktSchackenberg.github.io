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
    }
    * { box-sizing: border-box; }
    body { margin:0; background:#f6f8fb; color:#111; font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial; overflow-x:hidden; }
    main { width:min(100%, var(--maxw)); margin: 1.5rem auto 3rem; padding: 0 1rem; }

    .frame { background:#fff; border:1px solid var(--border); border-radius:16px; box-shadow:var(--shadow); overflow:hidden; }
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
    footer { text-align:center; color:#667085; padding:1rem 0 1.2rem; font-size:.95rem; }

    /* Rechts: Hoppel-Widget */
    .hoppel { position:fixed; top:1rem; right:1rem; width:280px; height:220px;
      border:4px solid #3b2f2f; border-radius:14px; background:var(--hoppel-bg);
      box-shadow:0 12px 30px rgba(0,0,0,.18); overflow:hidden; image-rendering:pixelated; z-index:999; }
    @media (max-width:880px){ .hoppel {display:none;} }
    .hoppel .bunny{ position:absolute; bottom:0; left:-120px; width:96px; height:96px;
      background: url("{{ '/assets/img/hase-sprite.png' | relative_url }}") 0 0 / 384px 96px no-repeat;
      animation: hopFrames .6s steps(4) infinite, hopMove 6s linear infinite;
    }
    .hoppel .bunny.flip{ transform:scaleX(-1);}
    @keyframes hopFrames{from{background-position:0 0;}to{background-position:-384px 0;}}
    @keyframes hopMove{0%{left:-120px;bottom:0;}20%{bottom:60px;}40%{bottom:0;}60%{bottom:50px;}80%{bottom:0;}100%{left:calc(100% + 40px);bottom:0;}}

    /* Fallende Sprüche */
    .fall { position:fixed; top:-2rem; left:50%; transform:translateX(-50%);
      font:700 1rem/1.3 ui-sans-serif,system-ui; color:#3b2f2f;
      white-space:nowrap; pointer-events:none; opacity:.9;
      animation: fallDown 8s linear forwards; z-index:500;
    }
    @keyframes fallDown { to{ transform:translateX(-50%) translateY(110vh);} }
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
    <pre id="pgp-key">
-----BEGIN PGP PUBLIC KEY BLOCK-----
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
=qPcL
-----END PGP PUBLIC KEY BLOCK-----

</pre>
  </section>
</main>

<aside class="hoppel"><div id="bunny" class="bunny"></div></aside>

<script>
  // === Bilder laden und rotieren ===
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

  // === Fallende Hasensprüche nach 10 Sekunden ===
  const FUNNY=[
    "Kein Bug – nur ein fluffiges Feature!","Hasen-Alarm! Wo ist die Möhre? 🥕","Heute schon gehoppelt?","Zwei Möhren am Tag halten den Fuchs fern.","Hoppel.exe läuft stabil.","Bitte nicht stören. Ich kompiliere Möhren.","Möhre rein, Glück raus.","Pixelhase v1.0 – jetzt mit Extra-Ohren.","Fehler 404: Möhre nicht gefunden.","Flauschfaktor: over 9000!"
  ];
  setTimeout(()=>{
    setInterval(()=>{
      const el=document.createElement('div');
      el.className='fall';
      el.style.left=Math.random()*90+5+'vw';
      el.textContent=FUNNY[Math.floor(Math.random()*FUNNY.length)];
      document.body.appendChild(el);
      el.addEventListener('animationend',()=>el.remove());
    },800);
  },10000);

  // === Bunny Flip ===
  document.getElementById('bunny').addEventListener("animationiteration",e=>{
    if(e.animationName==="hopMove"&&Math.random()<0.5){e.target.classList.toggle("flip");}
  });
</script>
</body>
</html>
