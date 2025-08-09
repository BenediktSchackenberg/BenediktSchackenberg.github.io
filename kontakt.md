---
title: "Kontakt"
layout: page
permalink: /kontakt/
---

<div class="contact" style="max-width: 720px; margin: 0 auto; text-align:center; line-height:1.6;">
  <h1 style="margin-bottom:0.25rem;">Meld dich bei mir</h1>
  <p style="margin-top:0; color:#555;">Ganz oldschool per E‑Mail – immer noch besser als Rauchzeichen.</p>

  <p style="font-size:1.15rem; margin: 0.5rem 0 1rem;">
    <a href="mailto:benedikt@schackenberg.com" style="text-decoration:none;">benedikt@schackenberg.com</a>
  </p>

  <p style="margin:1rem 0 2rem; color:#333;">
    Ich lese alles (wirklich alles) und melde mich bei dir zurück – vielleicht nicht in Lichtgeschwindigkeit,
    aber garantiert mit Hirn, Herz und Humor.
  </p>

  <div style="font-size: 1.05rem; line-height: 1.6; margin: 1.5rem 0 2rem;">
    <strong>Benedikt Schackenberg</strong><br>
    CAYA PostBox 94520X<br>
    96035 Bamberg
  </div>

  <!-- PGP / OpenPGP -->
<section aria-labelledby="pgp-title" style="text-align:left; border:1px solid #eee; border-radius:12px; padding:1rem 1.25rem; background:#fafafa;">
  <h2 id="pgp-title" style="margin-top:0; margin-bottom:0.5rem;">PGP / OpenPGP</h2>
  <p style="margin-top:0.25rem; color:#444;">
    Du kannst mir gern verschlüsselt schreiben. Lade meinen öffentlichen Schlüssel herunter, importiere ihn in deinen Mail‑Client
    und verschlüssele deine Nachricht an <strong>benedikt@schackenberg.com</strong>.
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
    <div><strong>Datei‑SHA‑256:</strong> <code>d69b927f8a0af4fbfeb05b0908f8424c599978df3a7b7431b38339e3ccff161a</code></div>
  </div>

  <details id="keyDetails" style="margin-top:0.75rem;">
    <summary style="cursor:pointer; font-weight:600;">🔐 Schlüssel anzeigen</summary>
    <pre id="pgpKeyBlock" style="white-space:pre-wrap; overflow:auto; background:#fff; border:1px solid #eee; border-radius:8px; padding:0.75rem; margin-top:0.5rem;">Lade Schlüssel…</pre>
    <p style="margin-top:0.5rem; color:#666; font-size:0.95rem;">
      Tipp: Fingerprint nach dem Import im Mail‑Client prüfen.
    </p>
  </details>
</section>

<script>
  (function() {
    const KEY_URL = '/assets/keys/benedikt-schackenberg.asc';
    const btn = document.getElementById('copyKeyBtn');
    const details = document.getElementById('keyDetails');
    const pre = document.getElementById('pgpKeyBlock');
    let loaded = false, cache = '';

    // Laden, sobald der Nutzer den <details>-Block öffnet (Lazy Load)
    details?.addEventListener('toggle', async () => {
      if (!details.open || loaded) return;
      try {
        const res = await fetch(KEY_URL, { cache: 'no-store' });
        const text = await res.text();
        cache = text;
        pre.textContent = text;
        loaded = true;
      } catch (e) {
        pre.textContent = 'Fehler beim Laden des Schlüssels.';
      }
    });

    // Copy-Button
    btn?.addEventListener('click', async () => {
      try {
        if (!cache) {
          const res = await fetch(KEY_URL, { cache: 'no-store' });
          cache = await res.text();
        }
        await navigator.clipboard.writeText(cache);
        btn.textContent = '✅ Kopiert';
        setTimeout(() => btn.textContent = '📋 Schlüssel in Zwischenablage', 2000);
      } catch(e) {
        btn.textContent = '❌ Fehler';
        setTimeout(() => btn.textContent = '📋 Schlüssel in Zwischenablage', 2000);
      }
    });
  })();
</script>