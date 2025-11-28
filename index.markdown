---
title: "Benedikt Schackenberg"
layout: page
permalink: /
description: "Microsoft SQL Server Spezialist | Performance & Hochverfügbarkeit | Azure & Cloud Architekturen"
---

# Hallo auf meiner privaten Homepage 👋

**Hi, ich bin Benedikt Schackenberg – Tüftler und Retro-Nerd. Schön, dass du da bist!**  

<div class="retro-gallery">
  <img src="/assets/img/mette.jpg" alt="Metzger" class="retro-img" />
  <img src="/assets/img/cartorns.jpg" alt="Cartoons" class="retro-img" />
  <img src="/assets/img/muethenmuh.jpg" alt="Muethenmuh" class="retro-img" />
  <img src="/assets/img/benediktread.jpg" alt="Benedikt" class="retro-img round" />
  <img src="/assets/img/blony.jpg" alt="Benedikt Blond" class="retro-img round" />
  <img src="/assets/img/stube.jpg" alt="Benedikt Blond" class="retro-img round" />
  <img src="/assets/img/nackt.jpg" alt="Benedikt Blond" class="retro-img round" />
  <img src="/assets/img/stopo.jpg" alt="stopo mainz" class="retro-img round" />
</div>

<p>
  Kind der 80er, irgendwo zwischen Diskettenlaufwerk und Modem, ISDN und DSL großgeworden – und gedanklich wahrscheinlich für immer im 2000er-Jahrzehnt hängengeblieben. 😄 Ich freue mich, dass du meine private Webseite gefunden hast!
  Wer wissen will, was ich so mache, ist hier genau richtig.
</p>

<!-- Weihnachtsmann-Button + Audio (nur noch für Musik) -->
<div id="xmas-toggle" class="xmas-icon-button" title="Weihnachtsmusik an/aus">
  🎅
</div>
<audio id="xmas-audio" src="/assets/audio/chiptune-christmas.mp3" loop></audio>

<style>
  .retro-gallery {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin: 20px 0 30px 0;
    justify-content: flex-start;
  }

  .retro-img {
    width: 150px;
    height: 150px;
    object-fit: cover;
    border-radius: 10px;
    image-rendering: pixelated;
    border: 3px solid #111827;
    box-shadow: 0 4px 0 #4b5563;
    cursor: pointer;
    transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
  }

  .retro-img.round {
    border-radius: 5px;
  }

  .retro-img:hover {
    animation: retro-wiggle 0.3s ease-in-out 0s 2;
    transform: translateY(-4px) scale(1.03);
    box-shadow: 0 7px 0 #1f2937;
    filter: saturate(1.25);
  }

  @keyframes retro-wiggle {
    0%   { transform: translateX(0); }
    25%  { transform: translateX(-3px); }
    50%  { transform: translateX(3px); }
    75%  { transform: translateX(-2px); }
    100% { transform: translateX(0); }
  }

  /* Weihnachtsmann-Button */
  .xmas-icon-button {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background: #0f172a;
    border: 3px solid #fbbf24;
    box-shadow: 0 0 12px rgba(255, 255, 0, 0.55), 0 4px 0 #b45309;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 42px;
    user-select: none;
    opacity: 0.92;
    transition:
      transform 0.1s ease,
      box-shadow 0.2s ease,
      background 0.2s ease,
      opacity 0.2s ease;
    z-index: 10000;
  }

  .xmas-icon-button:hover {
    transform: scale(1.07);
    opacity: 1;
    background: #1e293b;
    box-shadow: 0 0 16px rgba(255, 255, 0, 0.7), 0 2px 0 #92400e;
  }

  .xmas-icon-button.active {
    border-color: #22c55e;
    box-shadow: 0 0 14px rgba(0, 255, 100, 0.8), 0 4px 0 #15803d;
  }

  body.xmas-mode {
    background-image:
      radial-gradient(circle at 10% 20%, rgba(255,255,255,0.12) 0, transparent 60%),
      radial-gradient(circle at 80% 0%, rgba(255,255,255,0.09) 0, transparent 55%),
      radial-gradient(circle at 40% 90%, rgba(255,255,255,0.1) 0, transparent 60%);
    background-color: #020617;
  }

  /* Laufender Weihnachtsmann */
  .santa-walker {
    position: fixed;
    bottom: 90px;                /* etwas über dem Button */
    left: -80px;                 /* Start links außerhalb */
    width: 64px;
    height: 64px;
    image-rendering: pixelated;
    pointer-events: none;
    z-index: 9998;
    background-image: url('/assets/img/pixel-santa.png'); /* <- deine Grafik */
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    animation: santa-walk 12s linear forwards;
  }

  @keyframes santa-walk {
    0%   { transform: translateX(0) translateY(0); }
    25%  { transform: translateX(30vw) translateY(-3px); }
    50%  { transform: translateX(60vw) translateY(0); }
    75%  { transform: translateX(90vw) translateY(-3px); }
    100% { transform: translateX(120vw) translateY(0); }
  }
</style>

<script>
  (function () {
    /* -----------------------------
       1) Bilder zufällig anordnen
       ----------------------------- */
    var gallery = document.querySelector('.retro-gallery');
    if (gallery) {
      var items = Array.prototype.slice.call(gallery.children);
      items.sort(function () {
        return Math.random() - 0.5;
      });
      items.forEach(function (item) {
        gallery.appendChild(item);
      });
    }

    /* -----------------------------
       2) Weihnachtsmann läuft immer
       ----------------------------- */
    var SANTA_INTERVAL = 14000;

    function createSanta() {
      var santa = document.createElement('div');
      santa.className = 'santa-walker';
      document.body.appendChild(santa);

      santa.addEventListener('animationend', function () {
        santa.remove();
      });
    }

    // direkt beim Laden einmal starten
    createSanta();
    // danach alle 14 Sekunden wieder
    setInterval(createSanta, SANTA_INTERVAL);

    /* -----------------------------
       3) Button nur für Musik
       ----------------------------- */
    var xmasToggle = document.getElementById('xmas-toggle');
    var xmasAudio  = document.getElementById('xmas-audio');

    if (xmasToggle) {
      xmasToggle.addEventListener('click', function () {
        var isActive = xmasToggle.classList.toggle('active');
        document.body.classList.toggle('xmas-mode', isActive);

        if (xmasAudio) {
          if (isActive) {
            xmasAudio.play().catch(function () {});
          } else {
            xmasAudio.pause();
            xmasAudio.currentTime = 0;
          }
        }
      });
    }
  })();
</script>
