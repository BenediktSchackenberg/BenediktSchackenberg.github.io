---
title: "Sichtbare Systeme, Netze und Dienste der Stadt Ludwigshafen"
layout: page
tags: ["Ludwigshafen", "CyberSecurity"]
description: "Sichtbare Systeme, Netze und Dienste der Stadt Ludwigshafen"
permalink: /blog/ludwigshafen-osint/
image: /assets/img/explo.jpg
---

# 🛰️ Was das Internet über die Stadtverwaltung Ludwigshafen verrät  
_Eine kleine, völlig legale OSINT-Reise_

Vor ein paar Tagen habe ich aus reiner Neugier einmal geschaut, **was die Stadtverwaltung Ludwigshafen eigentlich so alles im Internet sichtbar hat**.  
Nicht aus böser Absicht, nicht technisch tief eingegriffen – einfach nur aus Interesse.

Geplant war eigentlich nur ein kurzer Blick in die DNS-Einträge und ein paar harmlose Nmap-Scans auf öffentlich sichtbare IP-Bereiche.  
Ein paar Stunden später stand fest:

> **Das Internet plaudert hier erstaunlich offen.**

Alle Informationen unten stammen aus **offenen Quellen** (DNS, Zertifikate, Standard-Scans).  
Es wurde **nichts gehackt**, es wurden keine Passwörter ausprobiert und keine Systeme angefasst.

---

## 📚 Inhaltsverzeichnis

- [Interaktive Tabelle: Öffentliche Systeme](#-interaktive-tabelle-öffentliche-systeme)
- [Highlights der Analyse](#-highlights-der-analyse)
- [Fazit](#-fazit)

---

# 📋 Interaktive Tabelle: Öffentliche Systeme

Die folgende Tabelle fasst alle relevanten öffentlichen Systeme zusammen, die im Rahmen der Analyse sichtbar waren.

🔹 **Hinweis:**  
Du kannst auf die Spaltenüberschriften klicken, um die Tabelle zu sortieren (z. B. nach IP, Netz, Risiko).

<style>
  .osint-table-wrapper {
    width: 100%;
    overflow-x: auto;
    margin: 1.5rem 0;
  }

  table.osint-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;
  }

  table.osint-table thead {
    background: #111827;
    color: #f9fafb;
  }

  table.osint-table th,
  table.osint-table td {
    padding: 0.5rem 0.75rem;
    border: 1px solid #e5e7eb;
    text-align: left;
    white-space: nowrap;
  }

  table.osint-table th {
    cursor: pointer;
    position: relative;
    user-select: none;
  }

  table.osint-table th span.sort-indicator {
    font-size: 0.75rem;
    opacity: 0.6;
    margin-left: 0.25rem;
  }

  table.osint-table tbody tr:nth-child(even) {
    background: #f9fafb;
  }

  table.osint-table tbody tr:hover {
    background: #e5f2ff;
  }

  .badge-risk-high {
    background: #b91c1c;
    color: #fff;
    padding: 0.1rem 0.5rem;
    border-radius: 999px;
    font-size: 0.7rem;
  }

  .badge-risk-medium {
    background: #92400e;
    color: #fff;
    padding: 0.1rem 0.5rem;
    border-radius: 999px;
    font-size: 0.7rem;
  }

  .badge-risk-low {
    background: #065f46;
    color: #fff;
    padding: 0.1rem 0.5rem;
    border-radius: 999px;
    font-size: 0.7rem;
  }
</style>

<div class="osint-table-wrapper">
  <table class="osint-table" id="osint-table">
    <thead>
      <tr>
        <th data-sort-key="ip"><span>IP-Adresse</span><span class="sort-indicator">↕</span></th>
        <th data-sort-key="host"><span>Hostname / Kontext</span><span class="sort-indicator">↕</span></th>
        <th data-sort-key="net"><span>Netz</span><span class="sort-indicator">↕</span></th>
        <th data-sort-key="services"><span>Dienste / Ports</span><span class="sort-indicator">↕</span></th>
        <th data-sort-key="os"><span>System / OS</span><span class="sort-indicator">↕</span></th>
        <th data-sort-key="role"><span>Rolle / Funktion</span><span class="sort-indicator">↕</span></th>
        <th data-sort-key="risk"><span>Risiko</span><span class="sort-indicator">↕</span></th>
      </tr>
    </thead>
    <tbody>
      <!-- Check Point Firewall -->
      <tr
        data-ip="80.208.232.201"
        data-net="80.208.232.0"
        data-host="Check Point Firewall"
        data-os="OpenBSD 4.0"
        data-role="Firewall"
        data-risk="3"
      >
        <td>80.208.232.201</td>
        <td>Alte Check Point Firewall (CPGWDMZ01)</td>
        <td>80.208.232.0/24</td>
        <td>80, 443, 264</td>
        <td>Check Point NGX · OpenBSD 4.0</td>
        <td>Firewall / VPN-Gateway in der DMZ</td>
        <td><span class="badge-risk-high">hoch</span></td>
      </tr>

      <!-- Windows VoIP -->
      <tr
        data-ip="80.208.232.226"
        data-net="80.208.232.0"
        data-host="Windows VoIP"
        data-os="Windows"
        data-role="VoIP"
        data-risk="3"
      >
        <td>80.208.232.226</td>
        <td>VoIP-/SIP-Server (vermutlich Windows PBX)</td>
        <td>80.208.232.0/24</td>
        <td>5060, 5061, 443</td>
        <td>Windows-Server mit SIP-Diensten</td>
        <td>PBX / SIP-Server öffentlich erreichbar</td>
        <td><span class="badge-risk-high">hoch</span></td>
      </tr>

      <!-- Router / MikroTik -->
      <tr
        data-ip="80.208.232.238"
        data-net="80.208.232.0"
        data-host="Router"
        data-os="Linux 4.x-5.x"
        data-role="Router"
        data-risk="2"
      >
        <td>80.208.232.238</td>
        <td>Router / BGP-Knoten</td>
        <td>80.208.232.0/24</td>
        <td>179, 443, 691</td>
        <td>MikroTik RouterOS / Linux 4.x–5.x</td>
        <td>Routing / Admin-Interface über HTTPS</td>
        <td><span class="badge-risk-medium">mittel</span></td>
      </tr>

      <!-- Mail-Gateway -->
      <tr
        data-ip="80.208.232.221"
        data-net="80.208.232.0"
        data-host="Mail"
        data-os="TLS-Server"
        data-role="Mail"
        data-risk="2"
      >
        <td>80.208.232.221</td>
        <td>Mail-Gateway / Submission</td>
        <td>80.208.232.0/24</td>
        <td>443, 587, 993, 995, 5001</td>
        <td>Mailserver mit TLS</td>
        <td>Mail-Infrastruktur (öffentlich notwendig)</td>
        <td><span class="badge-risk-medium">mittel</span></td>
      </tr>

      <!-- TWL Webserver 91 -->
      <tr
        data-ip="80.208.232.91"
        data-net="80.208.232.0"
        data-host="Web"
        data-os="Linux 4.x-5.x"
        data-role="Web"
        data-risk="2"
      >
        <td>80.208.232.91</td>
        <td>TWL-Webserver</td>
        <td>80.208.232.0/24</td>
        <td>80, 443</td>
        <td>nginx 1.28.0 · Linux</td>
        <td>Öffentliche Website</td>
        <td><span class="badge-risk-medium">mittel</span></td>
      </tr>

      <!-- TWL Webcluster 92 -->
      <tr
        data-ip="80.208.232.92"
        data-net="80.208.232.0"
        data-host="Webcluster"
        data-os="Linux"
        data-role="Web"
        data-risk="2"
      >
        <td>80.208.232.92</td>
        <td>TWL-Webcluster (Drupal, Proxy)</td>
        <td>80.208.232.0/24</td>
        <td>80, 443, 8080, 8443</td>
        <td>nginx + Apache · Drupal 10</td>
        <td>Web-/CMS-Cluster</td>
        <td><span class="badge-risk-medium">mittel</span></td>
      </tr>

      <!-- Streaming-Server -->
      <tr
        data-ip="80.208.234.196"
        data-net="80.208.234.0"
        data-host="Streaming"
        data-os="Test Streaming 9.0.10"
        data-role="Streaming"
        data-risk="2"
      >
        <td>80.208.234.196</td>
        <td>Streaming-Server</td>
        <td>80.208.234.0/24</td>
        <td>80, 443, 8000, 9002, 9003, 10001</td>
        <td>Test Streaming 9.0.10</td>
        <td>Video-/Streaming-Backend</td>
        <td><span class="badge-risk-medium">mittel</span></td>
      </tr>

      <!-- LB / Webknoten -->
      <tr
        data-ip="80.208.234.208"
        data-net="80.208.234.0"
        data-host="LB"
        data-os="Unbekannt"
        data-role="LB"
        data-risk="2"
      >
        <td>80.208.234.208</td>
        <td>Webknoten / Loadbalancer</td>
        <td>80.208.234.0/24</td>
        <td>80, 443, 8000, 8002</td>
        <td>HTTP/HTTPS</td>
        <td>Reverse Proxy / Loadbalancer</td>
        <td><span class="badge-risk-medium">mittel</span></td>
      </tr>

      <!-- SSH Server -->
      <tr
        data-ip="80.208.234.216"
        data-net="80.208.234.0"
        data-host="SSH"
        data-os="Linux"
        data-role="Server"
        data-risk="2"
      >
        <td>80.208.234.216</td>
        <td>Server mit SSH</td>
        <td>80.208.234.0/24</td>
        <td>22, 80, 8000</td>
        <td>Linux</td>
        <td>Allzweck-Server mit direktem SSH</td>
        <td><span class="badge-risk-medium">mittel</span></td>
      </tr>

      <!-- ESX Cluster (zusammengefasst) -->
      <tr
        data-ip="80.208.234.200"
        data-net="80.208.234.0"
        data-host="ESX"
        data-os="ESX 3.x"
        data-role="Hypervisor"
        data-risk="3"
      >
        <td>80.208.234.x</td>
        <td>Mehrere ESX-Hosts</td>
        <td>80.208.234.0/24</td>
        <td>Ports gefiltert, typische ESX-Signatur</td>
        <td>VMware ESX 3.x (EOL seit 2011)</td>
        <td>Alte Hypervisor-Systeme</td>
        <td><span class="badge-risk-high">hoch</span></td>
      </tr>

      <!-- Abfallkalender -->
      <tr
        data-ip="185.10.195.102"
        data-net="185.10.195.0"
        data-host="Abfallkalender"
        data-os="Linux"
        data-role="Web/FTP"
        data-risk="3"
      >
        <td>185.10.195.102</td>
        <td>Abfallkalender-Server</td>
        <td>185.10.195.0/24</td>
        <td>FTP, SSH, HTTP(S)</td>
        <td>Linux · Apache · Pure-FTPd</td>
        <td>Webserver mit vielen offenen Protokollen</td>
        <td><span class="badge-risk-high">hoch</span></td>
      </tr>

      <!-- Mailcluster -->
      <tr
        data-ip="217.151.147.130"
        data-net="217.151.147.0"
        data-host="Mailcluster"
        data-os="Linux"
        data-role="Mail"
        data-risk="2"
      >
        <td>217.151.147.x</td>
        <td>Mailcluster (twl-mx01–mx04, mailsec01/02)</td>
        <td>217.151.147.0/24</td>
        <td>25, 443</td>
        <td>Linux / Apache / Mailserver</td>
        <td>Mail-Infrastruktur (öffentlich nötig)</td>
        <td><span class="badge-risk-medium">mittel</span></td>
      </tr>

      <!-- Multi-Server pep2/lucloud -->
      <tr
        data-ip="217.151.155.179"
        data-net="217.151.155.0"
        data-host="pep2-lucloud"
        data-os="Linux"
        data-role="Web"
        data-risk="2"
      >
        <td>217.151.155.179</td>
        <td>pep2, LuCloud, Stadtbibliothek, TevisWeb</td>
        <td>217.151.155.0/24</td>
        <td>HTTP(S), diverse Webports</td>
        <td>Webserver / Multi-Tenant</td>
        <td>Verwaltungs- & Bürgerportale</td>
        <td><span class="badge-risk-medium">mittel</span></td>
      </tr>

      <!-- BBB Hetzner -->
      <tr
        data-ip="162.55.245.77"
        data-net="162.55.245.0"
        data-host="BBB2"
        data-os="Linux"
        data-role="BBB"
        data-risk="1"
      >
        <td>162.55.245.77</td>
        <td>videokonferenz2.ludwigshafen.de</td>
        <td>162.55.245.0/24</td>
        <td>443</td>
        <td>Linux · BigBlueButton</td>
        <td>Externe BBB-Instanz (Hetzner)</td>
        <td><span class="badge-risk-low">niedrig</span></td>
      </tr>

      <tr
        data-ip="162.55.245.78"
        data-net="162.55.245.0"
        data-host="BBB1"
        data-os="Linux"
        data-role="BBB"
        data-risk="1"
      >
        <td>162.55.245.78</td>
        <td>videokonferenz.ludwigshafen.de</td>
        <td>162.55.245.0/24</td>
        <td>443</td>
        <td>Linux · BigBlueButton</td>
        <td>Externe BBB-Instanz (Hetzner)</td>
        <td><span class="badge-risk-low">niedrig</span></td>
      </tr>
    </tbody>
  </table>
</div>

<script>
  (function() {
    const table = document.getElementById('osint-table');
    if (!table) return;

    const getCellValue = (tr, sortKey) => {
      const attr = tr.getAttribute('data-' + sortKey);
      if (attr !== null && attr !== '') return attr;
      // fallback: text of first cell
      return tr.children[0].innerText || tr.children[0].textContent;
    };

    const comparer = (sortKey, asc) => (a, b) => {
      const v1 = getCellValue(a, sortKey);
      const v2 = getCellValue(b, sortKey);

      // numeric compare, wenn beides Zahlen sind
      const n1 = parseFloat(v1.replace(/[^\d.]/g, ''));
      const n2 = parseFloat(v2.replace(/[^\d.]/g, ''));
      if (!isNaN(n1) && !isNaN(n2)) {
        return asc ? n1 - n2 : n2 - n1;
      }

      // string compare
      return asc
        ? v1.toString().localeCompare(v2.toString(), 'de')
        : v2.toString().localeCompare(v1.toString(), 'de');
    };

    const headers = table.querySelectorAll('thead th');
    headers.forEach((th) => {
      th.addEventListener('click', () => {
        const sortKey = th.getAttribute('data-sort-key');
        if (!sortKey) return;

        const tbody = table.tBodies[0];
        const rows = Array.from(tbody.querySelectorAll('tr'));

        const currentAsc = th.classList.contains('sorted-asc');
        headers.forEach(h => h.classList.remove('sorted-asc', 'sorted-desc'));

        const asc = !currentAsc;
        th.classList.add(asc ? 'sorted-asc' : 'sorted-desc');

        rows.sort(comparer(sortKey, asc));
        rows.forEach(tr => tbody.appendChild(tr));
      });
    });
  })();
</script>

---

# 🌟 Highlights der Analyse

Auch wenn die Tabelle alle Details enthält, stechen drei Punkte besonders heraus:

### 🔥 1. Uralt-Firewall mit offenem Zertifikat

- **System:** Check Point Firewall-1 NGX auf **OpenBSD 4.0**  
- **IP:** `80.208.232.201`  
- **Merkmale:**
  - Ports: 80, 443, 264 (klassisch Check Point)
  - Zertifikat mit Namen wie `CPGWDMZ01`, `fwmgmt`, `dmz`, `rathaus-*`
- **Problem:**
  - Betriebssystem und Produkt sind seit vielen Jahren **EOL**
  - Zertifikat verrät interne Struktur und Rollen
  - Für heutige Standards sicherheitstechnisch nicht mehr vertretbar

---

### 📞 2. Öffentlich erreichbarer Windows-VoIP-Server

- **IP:** `80.208.232.226`  
- **Ports:** 5060 (SIP), 5061 (SIP-TLS), 443  
- **Charakteristik:**
  - Verhalten wie **Windows-Server** mit VoIP-/PBX-Software  
  - Denkbar: 3CX, Starface, proprietäre TK-Lösung
- **Risiko:**
  - SIP im Internet ist eines der meistgescannten Protokolle weltweit
  - Angriffsvektor für Call-Spam, Fraud, PBX-Hijacking
  - Solche Systeme gehören normalerweise **hinter SBC, Proxy oder VPN**, nicht direkt ins Netz

---

### 🧾 3. Zertifikate, die zu viel erzählen

- Beim Aufruf bestimmter IPs über HTTPS geben die Systeme:
  - exakte interne Hostnamen preis  
  - DMZ- und Management-Bezeichnungen  
  - Laufzeiten und Strukturen der PKI
- Beispiel:  
  - Firewall-Zertifikat auf `80.208.232.201`  
  - Zertifikate auf TWL-Webservern mit Wildcard-Namen (`*.twl.de`)
- **Warum problematisch?**
  - Erleichtert Angreifern die **Zuordnung von Rollen und Systemen**
  - Unterstützt zielgerichtete Angriffe (spezifische Firewalls, Proxies, Mailserver)

---

<div class="retro-gallery">
  <img src="/assets/img/zertifikat.jpg" alt="Metzger" class="retro-img" />
  <img src="/assets/img/explo.jpg" alt="Cartoons" class="retro-img" />
  <img src="/assets/img/ipopen.jpg" alt="Muethenmuh" class="retro-img" />
  <img src="/assets/img/ichbinoffen.jpg" alt="Benedikt" class="retro-img round" />
</div>


# ✅ Fazit

Diese Analyse zeigt, wie viel man über eine gewachsene IT-Landschaft einer Stadt herausfinden kann, ohne auch nur eine einzige Tür zu „öffnen“:

- Nur mit **DNS-Einträgen**, **Zertifikaten** und **Standard-Scans**  
- Ohne Hacks, ohne Passwörter, ohne Ausnutzung von Schwachstellen

Gerade alte Firewalls, offene VoIP-Systeme und sprechfreudige Zertifikate sorgen dafür, dass das Internet mehr über die interne Struktur weiß, als eigentlich nötig wäre.

> **Es ist beeindruckend, was man alles sehen kann – und ein guter Anlass, mal aufzuräumen.**


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
