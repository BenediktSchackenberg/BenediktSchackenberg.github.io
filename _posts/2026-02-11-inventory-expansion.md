---
layout: post
title: "7 Features, 1 Abend: Das Inventory kriegt Muskeln"
date: 2026-02-11
thumbnail-img: /assets/images/controller.png
tags: [openclaw, release, devops, dashboard]
---

Manchmal sitzt man abends da und denkt: "Das Dashboard könnte mehr." Drei Stunden später hat man sieben neue Features deployed und fragt sich, ob man nicht doch mal schlafen sollte.

![Controller](/assets/images/controller.png)

## Was neu ist

**🛡️ Compliance Dashboard** — Endlich sehen, welche Rechner Defender deaktiviert haben. Oder keine Firewall. Oder BitLocker vergessen. Pie Charts zeigen den Security-Status der ganzen Flotte. Die roten Balken sind absichtlich rot.

**📊 Software Compare** — Chrome auf 30 Rechnern in 12 verschiedenen Versionen? Jetzt findest du raus welche. Klick auf einen Namen, sieh alle Versionen, schäm dich für dein Patch-Management.

**📈 Eventlog Charts** — Trends über die letzten 7 Tage. Errors gehen hoch? Schlecht. Errors gehen runter? Weniger schlecht. Zumindest weißt du jetzt Bescheid.

**🥧 OS Distribution** — Pie Chart auf dem Dashboard. Windows 11 in blau, Windows 10 in lila, der eine Windows Server 2019 in grün. Schön bunt, überraschend nützlich.

**📥 Export** — CSV oder JSON, für Nodes, Software oder Compliance. Dropdown in der Navbar. Klick, Download, fertig. Dein Excel freut sich.

**🌙 Dark Mode Toggle** — Weil manche Leute tatsächlich Light Mode benutzen. Ich versteh's nicht, aber bitte.

## Backend

Sechs neue Endpoints:
- `/api/v1/eventlog/trends` — Aggregierte Fehler pro Tag
- `/api/v1/software/compare` — Versions-Vergleich
- `/api/v1/compliance/summary` — Security-Übersicht
- `/api/v1/nodes/os-distribution` — Wer hat was
- `/api/v1/export/*` — Alles raus in CSV/JSON

Die `main.py` wächst langsam Richtung 5000 Zeilen. Irgendwann muss ich das aufteilen. Heute ist nicht irgendwann.

## Der Workflow

Komponente bauen, TypeScript beschwert sich, `percent` könnte `undefined` sein, Fix pushen, Build läuft, Services neustarten, Browser refreshen, funktioniert. Repeat.

Git sagt 1500+ Zeilen geändert. Fühlte sich nach weniger an.

## Warum das Ganze

Weil ein Inventory-System ohne Compliance-Übersicht nur eine glorifizierte Hostliste ist. Weil ich wissen will ob meine Rechner sicher sind, ohne auf jeden einzeln zu klicken. Weil Charts besser aussehen als Tabellen.

Und weil's Spaß macht.

---

*Code: [github.com/BenediktSchackenberg/openclaw-windows-agent](https://github.com/BenediktSchackenberg/openclaw-windows-agent)*

*Live: http://192.168.0.5:3000 (wenn du im Netzwerk bist)*
