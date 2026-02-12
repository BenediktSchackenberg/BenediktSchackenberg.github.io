---
layout: post
title: "OpenClaw v0.4.5: Rollout Strategies & Maintenance Windows"
date: 2026-02-12 20:00:00 +0100
categories: [DevOps, OpenClaw]
tags: [endpoint-management, deployment, canary, devops, automation]
---

## Kontrollierte Software-Rollouts für Enterprise-Anforderungen 🚀

Nach intensiver Entwicklungsarbeit ist **OpenClaw v0.4.5** da — mit Features, die bisher nur in Enterprise-Tools wie SCCM oder Intune zu finden waren: **Rollout Strategies** und **Maintenance Windows**.

## Was ist neu?

### 🎯 Rollout Strategies

Nicht jede Software-Verteilung sollte "YOLO" auf alle Geräte gleichzeitig losgelassen werden. Mit v0.4.5 habt ihr vier Strategien zur Auswahl:

| Strategie | Beschreibung | Use Case |
|-----------|--------------|----------|
| **Immediate** | Alle Geräte gleichzeitig | Hotfixes, unkritische Updates |
| **Staged** | In Wellen (z.B. 10 Geräte, 60 Min Pause, nächste 10) | Größere Rollouts mit Risikominimierung |
| **Canary** | Erst 1-3 Testgeräte, dann manuell freigeben | Kritische Updates, neue Software |
| **Percentage** | 10% → 30% → 50% → 100% | Schrittweise Erhöhung mit Beobachtungszeit |

### 🕐 Maintenance Windows

Deployments mitten am Tag während der Produktivzeit? Nicht mehr mit Maintenance Windows:

- **Zeitfenster definieren**: z.B. 22:00 - 06:00 Uhr
- **Wochentage auswählen**: Mo-Fr, nur Wochenende, etc.
- **Pro Gruppe oder Node**: Unterschiedliche Fenster für Server vs. Clients
- **Deployment-Option**: "Nur in Wartungsfenstern ausführen" checkbox

```
┌─────────────────────────────────────────────────────────┐
│  🕐 Wartungsfenster: "Nachtfenster Server"              │
│  ═══════════════════════════════════════════            │
│  Zeit:  22:00 - 06:00 Uhr                               │
│  Tage:  Mo Di Mi Do Fr                                  │
│  Ziel:  Gruppe "Production Servers"                     │
└─────────────────────────────────────────────────────────┘
```

### 🔒 RBAC jetzt vollständig

Das Role-Based Access Control System aus dem letzten Release ist jetzt produktionsreif:

- **4 System-Rollen**: Admin, Operator, Viewer, Auditor
- **JWT-Authentifizierung** für alle Frontend-Seiten
- **API Keys** für Automation & Integrations
- **Audit Log** — wer hat wann was gemacht

### 🧪 Test-Coverage verbessert

36 Playwright E2E-Tests decken jetzt alle kritischen User Journeys ab:
- Login/Auth Flow
- Navigation
- Node Details
- Deployments
- Groups & Packages

## Technische Details

### Backend (FastAPI)

Neue Endpoints:

```
GET/POST /api/v1/maintenance-windows
GET/PUT/DELETE /api/v1/maintenance-windows/{id}
GET /api/v1/maintenance-windows/check/{node_id}

GET /api/v1/rollout-strategies
POST /api/v1/deployments/{id}/rollout
GET /api/v1/deployments/{id}/rollout
POST /api/v1/deployments/{id}/rollout/advance
```

### Frontend (Next.js)

- Neue Seite: `/settings/maintenance-windows`
- Deployment-Dialog erweitert mit Rollout-Strategy-Auswahl
- Konfigurations-UI für jede Strategie

## Installation / Upgrade

### Server

```bash
cd openclaw-windows-agent
git pull
systemctl --user restart openclaw-inventory.service
```

### Windows Agents

Agents mit AutoUpdater bekommen v0.4.5 automatisch innerhalb einer Stunde.
Manuelle Installation:

```powershell
irm https://raw.githubusercontent.com/BenediktSchackenberg/openclaw-windows-agent/main/installer/Install-OpenClawAgent.ps1 | iex
```

## Was kommt als Nächstes?

- **E4-17 bis E4-20**: Package Catalog UI ist fertig, Version-Editor kommt
- **Compliance Reporting**: Welche Geräte erfüllen die Sicherheitsrichtlinien?
- **Multi-Tenant**: Verschiedene Organisationen in einer Instanz

## Links

- **GitHub**: [BenediktSchackenberg/openclaw-windows-agent](https://github.com/BenediktSchackenberg/openclaw-windows-agent)
- **Release**: [v0.4.5](https://github.com/BenediktSchackenberg/openclaw-windows-agent/releases/tag/v0.4.5)

---

*OpenClaw ist Open Source (MIT License). Contributions welcome!* 🦎
