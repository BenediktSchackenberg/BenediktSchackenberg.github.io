---
layout: post
title: "Octofleet v0.4.38: Service Orchestration is Here! 🐙"
subtitle: "All 18 epics complete - the platform is feature-complete"
date: 2026-02-17
tags: [octofleet, opensource, service-orchestration, devops, infrastructure]
image: /assets/img/octofleet-guardian.svg
---

<p align="center">
  <img src="/assets/img/octofleet-guardian.svg" alt="Octofleet Guardian" width="400">
</p>

Today we're releasing **Octofleet v0.4.38** — our biggest update yet! This release introduces **Service Orchestration**, completing all 18 planned epics and making Octofleet a truly enterprise-ready endpoint management platform.

## 🎯 What's New: Service Orchestration

The star of this release is our new **Service Orchestration** system. Define service templates, deploy them to nodes, and let the agent automatically maintain the desired state.

### Key Features

- **Service Classes** — Define reusable templates (nginx, PostgreSQL, custom apps)
- **Role-Based Deployment** — Assign nodes with roles (primary, replica, web, loadbalancer)
- **Health Checks** — HTTP, TCP, Process, and Windows Service monitoring
- **Drift Detection** — Automatically detect configuration drift
- **Auto-Healing** — Agents continuously reconcile to the desired state

### Reference Service Templates

We've included production-ready templates:

| Template | Type | Description |
|----------|------|-------------|
| `nginx-webserver` | Cluster | Load-balanced web servers (1-10 nodes) |
| `postgresql-single` | Single | Standalone PostgreSQL database |
| `postgresql-cluster` | Cluster | Primary-replica PostgreSQL (2-5 nodes) |

### How It Works

```
┌──────────────────┐      ┌──────────────────┐
│  Service Class   │─────▶│     Service      │
│  (Template)      │      │   (Instance)     │
└──────────────────┘      └────────┬─────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    ▼              ▼              ▼
              ┌──────────┐  ┌──────────┐  ┌──────────┐
              │  Node A  │  │  Node B  │  │  Node C  │
              │ (primary)│  │ (replica)│  │ (replica)│
              └──────────┘  └──────────┘  └──────────┘
```

The new `ServiceReconciliationPoller` in the agent:

1. **Polls** assigned services from the server
2. **Compares** current state with desired state
3. **Installs** missing packages (winget → choco fallback)
4. **Applies** configuration templates
5. **Runs** health checks
6. **Reports** status back to the dashboard

## 🏆 All 18 Epics Complete!

With this release, we've completed our entire roadmap:

| Epic | Feature | Status |
|------|---------|--------|
| E1 | Enhanced Inventory | ✅ |
| E2 | Device Grouping | ✅ |
| E3 | Job System | ✅ |
| E4 | Package Management | ✅ |
| E5 | Deployment Engine | ✅ |
| E6 | Linux Agent | ✅ |
| E7 | Alerting & Notifications | ✅ |
| E8 | Security & RBAC | ✅ |
| E9 | Rollout Strategies | ✅ |
| E10 | Zero-Touch Installation | ✅ |
| E12 | Eventlog Collection | ✅ |
| E13 | Vulnerability Tracking | ✅ |
| E14 | Auto-Remediation | ✅ |
| E15 | Hardware Fleet Dashboard | ✅ |
| E16 | Live View (SSE) | ✅ |
| E17 | Screen Mirroring | ✅ |
| E18 | Service Orchestration | ✅ |

## 📊 Test Coverage

All features are backed by comprehensive tests:

- **11 API Tests** — Backend endpoint validation
- **30 E2E Tests** — Full UI workflow coverage
- **100% Pass Rate** — Every test green ✅

## 🚀 Getting Started

### Update Your Installation

```bash
# Pull latest
git pull origin main

# Rebuild
docker compose up -d --build
```

### Try Service Orchestration

1. Navigate to **Services** in the sidebar
2. Click **Templates** tab → **New Template**
3. Create a service from the template
4. Assign nodes and watch the magic happen!

## 🔮 What's Next?

With all planned epics complete, we're focusing on:

- **Community feedback** — Tell us what you need!
- **Documentation improvements**
- **Performance optimizations**
- **Cloud integrations** (Azure, AWS, GCP)

## 📦 Download

- **GitHub Release:** [v0.4.38](https://github.com/BenediktSchackenberg/octofleet/releases/tag/v0.4.38)
- **Agent Size:** 7.7 MB

---

Thanks for following the Octofleet journey! If you're using it, I'd love to hear about your setup.

⭐ [Star on GitHub](https://github.com/BenediktSchackenberg/octofleet) if you find it useful!
