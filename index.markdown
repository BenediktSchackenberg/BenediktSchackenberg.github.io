---
title: "Profil Benedikt Schackenberg"
layout: default
permalink: /
description: "Microsoft SQL Server Spezialist | Performance & Hochverfügbarkeit | Azure & Cloud Architekturen"
---
<html lang="de">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"/>
<title>Benedikt Schackenberg</title>
<link rel="icon" href="data:,">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=VT323&family=Inter:wght@400;600&display=swap" rel="stylesheet">
<style>
  :root{
    --bg:#f9f6ef;       /* hell-freundlich */
    --fg:#2d2a26;       /* dunkles Braun-Grau */
    --ink:#2d2a26;
    --box:#fffaf1;      /* Papier-Look */
    --muted:#6f6a63;
    --accent:#4479ff;   /* Retro-Blau */
    --accent2:#ff6b6b;  /* sanftes Rot */
    --line:#d9d6cd;
    --shadow:0 6px 16px rgba(0,0,0,.12);
  }
  *,*::before,*::after{box-sizing:border-box}
  html,body{height:100%}
  body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.65 Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial}
  main{max-width:1000px;margin:0 auto;padding:28px 16px 72px}

  /* Retro Fensterrahmen */
  .window{background:var(--box);border:2px solid #cfc8b5;border-radius:12px;box-shadow:var(--shadow);overflow:hidden}
  .window-header{background:linear-gradient(180deg,#ece8df,#e2ded5);padding:.45rem .75rem;display:flex;align-items:center;justify-content:space-between;font-family:'VT323',monospace;font-size:1.1rem;border-bottom:1px solid var(--line)}
  .window-buttons span{display:inline-block;width:12px;height:12px;border-radius:50%;margin-right:6px}
  .red{background:#ff6b6b}.yellow{background:#ffca3a}.green{background:#8ac926}

  /* Hero */
  .hero{display:flex;flex-wrap:wrap;gap:18px;padding:14px;align-items:center}
  .avatar{flex:0 0 180px;background:#f3efe5;border:2px solid #cfc8b5;box-shadow:inset 0 0 0 2px #fff, 0 4px 8px rgba(0,0,0,.12);border-radius:8px;padding:6px}
  .avatar img{width:100%;height:auto;image-rendering:pixelated;border-radius:4px}
  .intro{flex:1;min-width:260px}
  h1{font-family:'VT323',monospace;font-size:2rem;margin:.2rem 0 .6rem;color:var(--accent)}
  .subtitle{color:var(--accent2);margin-bottom:.8rem}
  .intro p{margin:.5rem 0}
  .buttons{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:.8rem}
  .btn{display:inline-flex;align-items:center;gap:.45rem;background:#fff;border:2px solid #ccc;border-radius:8px;padding:.5rem .85rem;text-decoration:none;color:var(--fg);font-weight:600;box-shadow:0 3px 0 #ccc}
  .btn:hover{background:#f3efe5}
  .btn-primary{background:var(--accent);color:#fff;border-color:#3d68e3;box-shadow:0 3px 0 #3d68e3}

  /* Info-Karten */
  .grid{display:grid;gap:12px;padding:14px}
  @media(min-width:760px){.grid{grid-template-columns:repeat(2,1fr)}}
  .card{background:#fff;border:1px solid var(--line);border-radius:12px;padding:16px}
  .card h3{margin:.1rem 0 .5rem;font-family:'VT323',monospace;color:var(--accent2);font-size:1.35rem}
  .list{margin:0;padding-left:1.2rem}
  .list li{margin:.35rem 0}

  /* Notice */
  .notice{margin:18px 14px;background:#fffdf5;border:1px solid #e4e1d8;border-radius:12px;padding:14px}

  /* Kontaktblock */
  .contact{margin:14px;padding:14px;border:1px solid var(--line);background:#fff;border-radius:12px}

  /* Kleine Digital-Uhr (ohne Figuren) */
  .clockWrap{padding:0 14px 14px}
  .clock{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;background:#fff;border:1px solid var(--line);border-radius:12px;padding:10px}
  .digits{font-family:'VT323',monospace;font-size:2.2rem;letter-spacing:.06em}
  .date{font-weight:600;color:var(--muted)}

  /* Privat-Block */
  .privat{display:flex;gap:14px;align-items:flex-start}
  .privat .p-avatar{flex:0 0 160px;background:#f3efe5;border:2px solid #cfc8b5;border-radius:8px;padding:6px;box-shadow:inset 0 0 0 2px #fff, 0 3px 6px rgba(0,0,0,.12)}
  .privat .p-avatar img{width:100%;height:auto;image-rendering:pixelated;border-radius:4px}
  .speech{display:inline-block;position:relative;background:#fff;border:2px solid #cfc8b5;border-radius:10px;padding:6px 10px;font-weight:700;margin-bottom:8px}
  .speech::after{content:"";position:absolute;left:14px;bottom:-8px;width:12px;height:12px;background:#fff;border-left:2px solid #cfc8b5;border-bottom:2px solid #cfc8b5;transform:rotate(45deg)}
  .hobbies{display:flex;flex-wrap:wrap;gap:8px;margin-top:6px}
  .chip{border:1px solid var(--line);background:#fff;border-radius:999px;padding:.35rem .6rem;font-size:.95rem;color:var(--muted)}

  /* Footer */
  footer{margin-top:28px;padding-top:14px;border-top:1px solid var(--line);text-align:center;color:#57524a}
</style>
</head>
<body>
<main>
  <div class="window">
    <div class="window-header">
      <div class="window-buttons"><span class="red"></span><span class="yellow"></span><span class="green"></span></div>
      <div>Profil – Benedikt Schackenberg</div>
    </div>

    <!-- HERO -->
    <section class="hero">
      <div class="avatar">
        <img src="/assets/img/pixeldad2.png" alt="Benedikt Schackenberg Pixelavatar" width="180" height="180"/>
      </div>
      <div class="intro">
        <h1>Ich bin Benedikt Schackenberg</h1>
        <div class="subtitle">Microsoft SQL Server & Cloud Architekturen</div>
        <p>Ich lebe im schönen Mainz und arbeite als IT‑Systemadministrator an einem großen Krankenhaus. Dort betreue ich komplexe Datenbanksysteme und sorge dafür, dass Technik zuverlässig läuft – am liebsten mit Microsoft SQL Server und einer guten Portion Kaffee.</p>
        <nav class="buttons" aria-label="Wichtige Links">
          <a class="btn" href="https://github.com/BenediktSchackenberg" target="_blank" rel="noopener">🐙 <b>GitHub</b></a>
          <a class="btn" href="https://dba.stackexchange.com/users/86101/benedikt-schackenberg" target="_blank" rel="noopener">💾 <b>DBA StackExchange</b></a>
          <a class="btn btn-primary" href="/kontakt/"><span aria-hidden>✉️</span> <b>Kontakt &amp; PGP</b></a>
        </nav>
      </div>
    </section>

    <!-- Uhr + Datum (dezent) -->
    <div class="clockWrap">
      <div class="clock" role="status" aria-live="polite">
        <div class="digits" id="digits">--:--</div>
        <div class="date" id="date">–</div>
      </div>
    </div>

    <!-- Was ich anbiete / Wofür ich stehe -->
    <section class="grid">
      <article class="card">
        <h3>Wofür ich stehe</h3>
        <ul class="list">
          <li>Robuste, sichere und nachvollziehbare <strong>SQL Server</strong>-Setups</li>
          <li>Transparente Standards & Dokumentation</li>
          <li>Saubere Backup-/Restore-Prozesse mit Tests</li>
        </ul>
      </article>
      <article class="card">
        <h3>Performance‑Tuning</h3>
        <ul class="list">
          <li>Abfrage‑Optimierung & Index‑Strategien</li>
          <li>Wait‑Analyse, I/O‑Profiling, Query Store</li>
        </ul>
      </article>
      <article class="card">
        <h3>Hochverfügbarkeit & DR</h3>
        <ul class="list">
          <li>Always On AGs, Log‑Shipping, Backups</li>
          <li>Wiederherstellungs‑Strategien & regelmäßige Tests</li>
        </ul>
      </article>
      <article class="card">
        <h3>Azure & Hybrid</h3>
        <ul class="list">
          <li>Sinnvolle Cloud‑Anteile – technisch & wirtschaftlich</li>
          <li>Security, Kosten, Automatisierung im Blick</li>
        </ul>
      </article>
    </section>

    <!-- 🌿 Privat (neu) -->
    <section>
      <h2 style="margin:22px 14px 8px;font-family:'VT323',monospace;color:var(--accent2);font-size:1.5rem">🌿 Privat</h2>
      <article class="card">
        <div class="privat">
          <div class="p-avatar"><img src="/assets/img/rad.png" alt="Benedikt – privat" width="160" height="160"></div>
          <div>
            <div class="speech">Pause vom SQL‑Server!</div>
            <p>Wenn ich nicht gerade Datenbanken pflege, bin ich meistens <strong>Papa, Spaziergänger oder Radfahrer</strong>. Ich mag frische Luft, kleine Abenteuer mit den Kindern und Runden durchs Viertel – mit Sonne, Regen oder Gegenwind.</p>
            <div class="hobbies" aria-label="Hobbys">
              <span class="chip">👨‍👧‍👦 Zeit mit den Kindern</span>
              <span class="chip">🚶 Spazieren</span>
              <span class="chip">🚲 Radfahren</span>
            </div>
          </div>
        </div>
      </article>
    </section>
    <!-- Kontakt -->
    <section class="contact">
      📍 Mainz<br>
      📧 <a href="mailto:benedikt@schackenberg.com">benedikt@schackenberg.com</a><br>
      🔐 <a href="/kontakt/">PGP‑Informationen & öffentlicher Schlüssel</a>
    </section>
  </div>

  <footer>
    „Technologie kann man lernen. Leidenschaft für Lösungen macht den Unterschied.“
  </footer>
</main>

<script>
(function(){
  const d=document.getElementById('digits');
  const dateEl=document.getElementById('date');
  const tz='Europe/Berlin';
  const fmtTime=new Intl.DateTimeFormat('de-DE',{timeZone:tz,hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false});
  const fmtDate=new Intl.DateTimeFormat('de-DE',{timeZone:tz,weekday:'long',day:'2-digit',month:'long',year:'numeric'});
  let lastSec=-1;
  function tick(){
    const now=new Date();
    const parts=fmtTime.formatToParts(now).reduce((a,c)=>{a[c.type]=c.value;return a;},{});
    if(parts.second!==lastSec){
      lastSec=parts.second;
      d.textContent=`${parts.hour}:${parts.minute}`;
      dateEl.textContent=fmtDate.format(now);
    }
    requestAnimationFrame(tick);
  }
  tick();
})();
</script>
</body>
</html>
