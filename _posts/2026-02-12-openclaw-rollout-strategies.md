---
layout: post
title: "OpenClaw Inventory System v0.4.5: Rollout Strategies & Maintenance Windows"
date: 2026-02-12 20:00:00 +0100
categories: [DevOps, OpenClaw]
tags: [endpoint-management, deployment, canary, devops, automation]
---

## Controlled Software Rollouts for Enterprise Requirements 🚀

After intensive development work, **OpenClaw v0.4.5** is here — with features previously only found in enterprise tools like SCCM or Intune: **Rollout Strategies** and **Maintenance Windows**.

## What's New?

### 🎯 Rollout Strategies

Not every software deployment should be "YOLO'd" to all devices at once. With v0.4.5, you have four strategies to choose from:

| Strategy | Description | Use Case |
|----------|-------------|----------|
| **Immediate** | All devices at once | Hotfixes, non-critical updates |
| **Staged** | In waves (e.g., 10 devices, 60 min pause, next 10) | Larger rollouts with risk mitigation |
| **Canary** | Test on 1-3 devices first, then manual approval | Critical updates, new software |
| **Percentage** | 10% → 30% → 50% → 100% | Gradual increase with observation time |

### 🕐 Maintenance Windows

Deployments in the middle of the day during productive hours? Not anymore with Maintenance Windows:

- **Define time windows**: e.g., 22:00 - 06:00
- **Select weekdays**: Mon-Fri, weekends only, etc.
- **Per group or node**: Different windows for servers vs. clients
- **Deployment option**: "Only run in maintenance windows" checkbox

```
┌─────────────────────────────────────────────────────────┐
│  🕐 Maintenance Window: "Server Night Window"           │
│  ═══════════════════════════════════════════            │
│  Time:  22:00 - 06:00                                   │
│  Days:  Mon Tue Wed Thu Fri                             │
│  Target: Group "Production Servers"                     │
└─────────────────────────────────────────────────────────┘
```

### 🔒 RBAC Now Complete

The Role-Based Access Control system from the last release is now production-ready:

- **4 system roles**: Admin, Operator, Viewer, Auditor
- **JWT authentication** for all frontend pages
- **API Keys** for automation & integrations
- **Audit Log** — who did what, when

### 🧪 Improved Test Coverage

36 Playwright E2E tests now cover all critical user journeys:
- Login/Auth Flow
- Navigation
- Node Details
- Deployments
- Groups & Packages

## Technical Details

### Backend (FastAPI)

New endpoints:

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

- New page: `/settings/maintenance-windows`
- Deployment dialog extended with rollout strategy selector
- Configuration UI for each strategy

## Installation / Upgrade

### Server

```bash
cd openclaw-windows-agent
git pull
systemctl --user restart openclaw-inventory.service
```

### Windows Agents

Agents with AutoUpdater will receive v0.4.5 automatically within an hour.
Manual installation:

```powershell
irm https://raw.githubusercontent.com/BenediktSchackenberg/openclaw-windows-agent/main/installer/Install-OpenClawAgent.ps1 | iex
```

## What's Next?

- **E4-17 to E4-20**: Package Catalog UI is done, Version Editor coming
- **Compliance Reporting**: Which devices meet security policies?
- **Multi-Tenant**: Different organizations in one instance

## Links

- **GitHub**: [BenediktSchackenberg/openclaw-windows-agent](https://github.com/BenediktSchackenberg/openclaw-windows-agent)
- **Release**: [v0.4.5](https://github.com/BenediktSchackenberg/openclaw-windows-agent/releases/tag/v0.4.5)

---

*OpenClaw is Open Source (MIT License). Contributions welcome!* 🦎
