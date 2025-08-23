---
title: "Profil Benedikt Schackenberg"
layout: default
permalink: /
description: "iaaaaaaaaaaaaaaaaaaaaaaaa"
---

<!-- Zufallsbereich -->
<div style="display:flex;align-items:stretch;gap:2rem;flex-wrap:wrap;margin:0 0 2rem;">

  <!-- Zufalls-Bild -->
  <div style="flex:0 0 300px;display:flex;align-items:center;justify-content:center;">
    <img id="randomImage" 
         src="/assets/img/pixelpapa.png" 
         alt="Benedikt Schackenberg" 
         loading="eager"
         style="max-width:100%;height:auto;border-radius:12px;box-shadow:0 4px 14px rgba(0,0,0,.12);object-fit:cover;" />
  </div>

  <!-- Zufalls-Text -->
  <div style="flex:1;min-width:260px;">
    <section class="random-box" style="height:100%;padding:1.5rem;border-radius:16px;background:#fff;box-shadow:0 8px 20px rgba(0,0,0,.06);line-height:1.6;">
      <div id="randomText">
        <!-- Text wird per JS gesetzt -->
      </div>
    </section>
  </div>
</div>


<!-- Fester Hasen-Alarm Block -->
<div style="display:flex;align-items:stretch;gap:2rem;flex-wrap:wrap;margin:2rem 0;">

  <!-- Bild -->
  <div style="flex:0 0 300px;display:flex;align-items:center;justify-content:center;">
    <img src="/assets/img/hasenpower.png" 
         alt="Benedikt Schackenberg" 
         loading="eager"
         style="max-width:100%;height:auto;border-radius:12px;box-shadow:0 4px 14px rgba(0,0,0,.12);object-fit:cover;" />
  </div>

  <!-- Hasen-Alarm Text -->
  <div style="flex:1;min-width:260px;">
    <section class="hasen-alarm" style="height:100%;padding:1.5rem;border-radius:16px;background:#fff;box-shadow:0 8px 20px rgba(0,0,0,.06);line-height:1.6;">
      <h2 style="text-align:center;font-size:1.8rem;margin-top:0;margin-bottom:1rem;">🐇 Achtung, Hasen-Alarm! 🐇</h2>
<!-- PGP / OpenPGP -->
<h2 id="pgp-title" style="margin-top:2rem; margin-bottom:0.5rem;">PGP / OpenPGP</h2>
<p style="margin-top:0.25rem; color:#444;">
  Du kannst mir gern verschlüsselt schreiben. Lade meinen öffentlichen Schlüssel herunter, importiere ihn in deinen Mail-Client
  und verschlüssele deine Nachricht an <strong>benedikt@schackenberg.com</strong>
</p>

<div style="display:flex; gap:0.75rem; flex-wrap:wrap; align-items:center; margin:0.75rem 0 0.5rem;">
  <a class="btn" href="/assets/keys/benedikt-schackenberg.asc" download
     style="display:inline-block; border:1px solid #ddd; border-radius:10px; padding:0.6rem 0.9rem; text-decoration:none;">
    ⬇️ Schlüssel herunterladen (.asc)
  </a>

  <button type="button" id="copyKeyBtn"
    style="border:1px solid #ddd; border-radius:10px; padding:0.6rem 0.9rem; background:white; cursor:pointer;">
    📋 Schlüssel in Zwischenablage
  </button>
</div>

<div style="font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size:0.95rem; color:#333; margin-top:0.75rem;">
  <div><strong>Key ID:</strong> 0xE89D62B49951C283</div>
  <div><strong>Datei-SHA-256:</strong> <code>d69b927f8a0af4fbfeb05b0908f8424c599978df3a7b7431b38339e3ccff161a</code></div>
</div>
    </section>
  </div>
</div>





<!-- Script für Zufall -->
<script>
  // Array mit Bildpfaden
  const images = [
    "/assets/img/pixelpapa1.png",
    "/assets/img/pixelpapa2.png",
    "/assets/img/pixelpapa3.png"
  ];

  // Array mit Textvarianten
  const texts = [
    `
    <h2 style="text-align:center;font-size:1.8rem;margin:0 0 1rem;">🐇 Achtung, Hasen-Alarm! 🐇</h2>
    <p>Diese Homepage könnte Hasen enthalten.<br>
    Warum? Ganz einfach: 👉 <strong>Ich liebe Hasenbilder!</strong> ❤️🐰</p>
    `,
    `
    <h2 style="text-align:center;font-size:1.8rem;margin:0 0 1rem;">🎩 Überraschung! 🎩</h2>
    <p>Manchmal kommen hier nicht nur Hasen, sondern auch andere Wunder ans Licht.<br>
    Bleib gespannt und schau öfter vorbei! ✨</p>
    `,
    `
    <h2 style="text-align:center;font-size:1.8rem;margin:0 0 1rem;">😏 Masterplan 😏</h2>
    <p>Alles Teil des geheimen Plans der Langohren.<br>
    Ich bin nur der Übermittler der Botschaft. 🐰📡</p>
    `
  ];

  // Zufälliges Bild & Text wählen
  const randomImage = images[Math.floor(Math.random() * images.length)];
  const randomText = texts[Math.floor(Math.random() * texts.length)];

  // In die Seite einsetzen
  document.getElementById("randomImage").src = randomImage;
  document.getElementById("randomText").innerHTML = randomText;
</script>
