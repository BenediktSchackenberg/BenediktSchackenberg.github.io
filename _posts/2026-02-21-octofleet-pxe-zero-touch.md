---
layout: post
title: "Octofleet: Zero-Touch OS Deployment mit PXE Boot"
date: 2026-02-21
categories: [octofleet, automation]
tags: [pxe, windows, deployment, devops]
image: /assets/images/octofleet-logo.png
---

# Octofleet: Zero-Touch OS Deployment mit PXE Boot 🐙

![Octofleet Logo](/assets/images/octofleet-logo.png){: width="256" }

Heute war ein produktiver Tag! Wir haben **Octofleet** um ein mächtiges Feature erweitert: **Zero-Touch OS Deployment via PXE Boot**.

## Was ist Octofleet?

Octofleet ist unsere Open-Source Endpoint Management Platform. Stell dir vor: Du hast 50 Server oder Workstations, die alle ein frisches Betriebssystem brauchen. Normalerweise heißt das: USB-Sticks brennen, BIOS-Settings ändern, durch Installer klicken... **Langweilig!**

Mit Octofleet geht das jetzt so:

1. MAC-Adresse eingeben
2. Betriebssystem auswählen
3. Klick auf "Create Job"
4. Server einschalten → **fertig!**

Kein USB-Stick. Kein Installer. Kein Rumgeklicke. Zero-Touch eben.

## Wie funktioniert PXE Boot?

**PXE (Preboot Execution Environment)** erlaubt es einem Computer, direkt über das Netzwerk zu booten – ganz ohne lokale Festplatte oder USB.

Der Ablauf:

```
1. Server startet → DHCP Request
2. DHCP antwortet mit IP + PXE Server Adresse
3. Server lädt iPXE Bootloader (via TFTP)
4. iPXE fragt Octofleet API: "Was soll ich tun?"
5. API antwortet: "Hier ist dein Boot-Script für Windows Server 2025!"
6. WinPE startet → Partitioniert → Lädt Image → Installiert
7. Windows bootet → Domain Join → Agent installiert → FERTIG!
```

Das Schöne: Alles passiert über **HTTP**. Kein SMB-Share, keine Firewall-Probleme.

## Was wir heute gebaut haben

### 🔧 Backend

- **Provisioning API** mit CRUD-Endpoints für Tasks, Images und Templates
- **Dynamische iPXE-Generierung** – jede MAC bekommt ihr eigenes Boot-Script
- **Database Schema** für Provisioning Tasks
- **Status-Callbacks** – der Server meldet seinen Fortschritt zurück

### 🎨 Frontend

- **Provisioning Dashboard** mit Live-Daten aus der API (keine Mock-Daten mehr!)
- **"New Job" Dialog** – MAC eingeben, OS auswählen, los geht's
- **Task Queue** mit Status-Anzeige (Pending → Booting → Installing → Done)
- **Auto-Refresh** alle 10 Sekunden

### 📦 Windows Deployment

- **Windows Server 2025** (Standard & Datacenter)
- **Unattend.xml** für vollautomatische Installation:
  - Deutsche Locale & Zeitzone
  - Admin-Passwort vorkonfiguriert
  - RDP aktiviert
  - Domain Join automatisch
- **WinPE Boot Image** mit curl.exe für HTTP-Downloads

### 🖥️ Hypervisor Support

- **Hyper-V Generation 2** (UEFI) – getestet und läuft!
- **KVM/libvirt** – Template vorbereitet mit VirtIO-Treibern
- **Bare Metal** – Template für physische Server

## Der Tech Stack

```
┌─────────────────────────────────────────────┐
│              Octofleet UI                   │
│         (Next.js + Tailwind CSS)            │
└─────────────────┬───────────────────────────┘
                  │ HTTP/REST
┌─────────────────▼───────────────────────────┐
│           Octofleet Backend                 │
│      (FastAPI + PostgreSQL + asyncpg)       │
└─────────────────┬───────────────────────────┘
                  │ 
┌─────────────────▼───────────────────────────┐
│             PXE Server                      │
│   (dnsmasq + nginx + iPXE + WinPE)          │
└─────────────────┬───────────────────────────┘
                  │ PXE/HTTP
┌─────────────────▼───────────────────────────┐
│            Target Server                    │
│      (booted via network → installed!)      │
└─────────────────────────────────────────────┘
```

## Was kommt als nächstes?

Das war erst der Anfang! Auf der Roadmap steht:

- **Ubuntu/Linux Support** – Autoinstall & Cloud-Init
- **Windows 11** – für Client-Deployments
- **Windows Server 2019** – Legacy-Support
- **Status-Callbacks** – Live-Progress im UI
- **Systems Registry** – Provisionierte Systeme als permanente Entitäten

## Fazit

Von "Server einschalten" bis "Domain-joined & RDP-ready" vergehen jetzt nur noch **15-20 Minuten**. Ohne dass jemand einen Finger rühren muss. Das ist die Magie von Zero-Touch Deployment!

Der Code ist Open Source auf GitHub: [BenediktSchackenberg/octofleet](https://github.com/BenediktSchackenberg/octofleet)

Fragen? Feedback? Schreib mir auf Discord!

---

*🐙 Octofleet – Weil Server-Installation nicht langweilig sein muss.*
