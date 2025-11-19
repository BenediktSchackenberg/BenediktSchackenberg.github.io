---
title: "Benedikt Schackenberg"
layout: page
permalink: /
description: "Microsoft SQL Server Spezialist | Performance & Hochverfügbarkeit | Azure & Cloud Architekturen"
---

# Hallo auf meiner privaten Homepage 👋

**Hi, ich bin Benedikt Schackenberg – Tüftler und Retro-Nerd. Schön, dass du da bist!**  

<div class="retro-gallery">
  <img src="/assets/img/Metzger.png" alt="Metzger" class="retro-img" />
  <img src="/assets/img/Stop.jpg" alt="Stop" class="retro-img" />
  <img src="/assets/img/cartorns.jpg" alt="Cartoons" class="retro-img" />
  <img src="/assets/img/muethenmuh.jpg" alt="Muethenmuh" class="retro-img" />
  <img src="/assets/img/BenediktSchackenberg.jpg" alt="Benedikt" class="retro-img round" />
  <img src="/assets/img/benediktinBlond.png" alt="Benedikt Blond" class="retro-img round" />
  <img src="/assets/img/abgehts.jpg" alt="Benedikt Blond" class="retro-img round" />
  <img src="/assets/img/nackt.jpg" alt="Benedikt Blond" class="retro-img round" />
</div>

<p>
  Kind der 80er, irgendwo zwischen Diskettenlaufwerk und Modem, ISDN und DSL großgeworden – und gedanklich wahrscheinlich für immer im 2000er-Jahrzehnt hängengeblieben. 😄 Ich freue mich, dass du meine private Webseite gefunden hast!
  Wer wissen will, was ich so mache, ist hier genau richtig.
</p>

<!-- Weihnachtsmann-Button + Audio -->
<div id="xmas-toggle" class="xmas-icon-button" title="Weihnachtsmodus an/aus">
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

  /* Wackel-Animation direkt per :hover */
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

  /* Pixel-Männchen */
  .pixel-sprite {
    position: absolute;
    width: 64px;
    height: 64px;
    image-rendering: pixelated;
    pointer-events: none;
    z-index: 9999;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    animation: float-up 1.1s ease-out forwards;
  }

  @keyframes float-up {
    0% {
      transform: translate(-50%, -20%) scale(0.9);
      opacity: 0;
    }
    15% {
      opacity: 1;
    }
    60% {
      transform: translate(-50%, -60%) scale(1);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, -90%) scale(1);
      opacity: 0;
    }
  }

  /* Weihnachtsmann-Button */
  .xmas-icon-button {
    position: fixed;
    bottom: 30px;            /* <- hier war vorher 90x */
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
    font-size: 42px;         /* groß, aber nicht völlig riesig */
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
</style>
