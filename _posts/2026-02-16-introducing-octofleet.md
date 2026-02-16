---
layout: post
title: "Introducing Octofleet 🐙 - Open Source Endpoint Management"
subtitle: "From internal project to public release"
date: 2026-02-16
tags: [octofleet, opensource, endpoint-management, monitoring, devops]
image: /assets/img/octofleet-banner.png
---

Today marks a big milestone: **Octofleet is now open source!** 

What started a few weeks ago as a simple Windows inventory agent has evolved into a full-featured endpoint management platform. And now it's available for everyone.

<p align="center">
  <img src="/assets/img/octofleet-logo.png" alt="Octofleet Logo" width="200">
</p>

## 🐙 Why "Octofleet"?

An octopus has eight arms that can independently reach, grab, and control multiple things at once. That's exactly what this platform does - it reaches out to all your endpoints across your fleet and gives you centralized control.

Plus, octopi are cool. 🐙

## 🎯 What is Octofleet?

Octofleet is a **self-hosted endpoint management platform** for Windows and Linux systems. Think of it as your own private fleet management system - no cloud subscriptions, no per-seat licensing, no vendor lock-in.

**Core Features:**
- 📊 **Hardware & Software Inventory** - Know exactly what's deployed
- 🔍 **Vulnerability Scanning** - CVE tracking via NVD API
- 🖥️ **Remote Terminal** - PowerShell/Bash in your browser
- 📺 **Screen Mirroring** - View remote desktops in real-time
- 📈 **Performance Monitoring** - CPU, RAM, Disk metrics over time
- 🚀 **Job System** - Deploy commands across your fleet
- 🔔 **Discord Alerts** - Get notified when things go wrong
- 🛡️ **Auto-Remediation** - Automatically patch vulnerable software

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Web Frontend  │────▶│  Backend API    │────▶│   PostgreSQL    │
│   (Next.js)     │     │  (FastAPI)      │     │  + TimescaleDB  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               ▲
                               │
              ┌────────────────┼────────────────┐
              │                │                │
       ┌──────┴──────┐  ┌──────┴──────┐  ┌──────┴──────┐
       │  Windows    │  │  Windows    │  │   Linux     │
       │   Agent     │  │   Agent     │  │   Agent     │
       │  (.NET 8)   │  │  (.NET 8)   │  │   (Bash)    │
       └─────────────┘  └─────────────┘  └─────────────┘
```

**100% self-hosted.** No external dependencies. No phone-home. Your data stays yours.

## 🚀 Quick Start

**1. Start the backend:**
```bash
git clone https://github.com/BenediktSchackenberg/octofleet.git
cd octofleet/backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8080
```

**2. Start the frontend:**
```bash
cd frontend
npm install && npm run dev
```

**3. Install an agent (Windows):**
```powershell
irm https://raw.githubusercontent.com/BenediktSchackenberg/octofleet/main/scripts/Install-OpenClawAgent.ps1 | iex
```

**4. Open `http://localhost:3000` and watch your fleet appear! 🎉**

## 📸 Screenshots

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
  <img src="https://raw.githubusercontent.com/BenediktSchackenberg/octofleet/main/docs/screenshot-dashboard.png" alt="Dashboard">
  <img src="https://raw.githubusercontent.com/BenediktSchackenberg/octofleet/main/docs/screenshot-node.png" alt="Node Details">
</div>

## 🆚 Why Not Just Use X?

| Feature | Octofleet | PDQ | SCCM | Ansible |
|---------|-----------|-----|------|---------|
| Free & Open Source | ✅ | ❌ | ❌ | ✅ |
| Web UI | ✅ | ✅ | ✅ | ❌ |
| Windows Agents | ✅ | ✅ | ✅ | 🔶 |
| Linux Agents | ✅ | ❌ | ❌ | ✅ |
| Remote Terminal | ✅ | ❌ | ❌ | ❌ |
| Screen Mirroring | ✅ | ❌ | ✅ | ❌ |
| Vulnerability Scan | ✅ | ❌ | 🔶 | ❌ |
| Self-Hosted | ✅ | ✅ | ✅ | ✅ |

## 🗺️ Roadmap

The platform is already production-ready for my use case (~10 nodes), but there's always more to build:

- [ ] macOS Agent
- [ ] Mobile App (Flutter?)
- [ ] Terraform Provider
- [ ] Prometheus Exporter
- [ ] Multi-tenant Mode

## 🤝 Contributing

PRs welcome! Check out the [Contributing Guide](https://github.com/BenediktSchackenberg/octofleet/blob/main/CONTRIBUTING.md).

---

**Links:**
- 🔗 **GitHub:** [github.com/BenediktSchackenberg/octofleet](https://github.com/BenediktSchackenberg/octofleet)
- 📖 **Wiki:** [github.com/BenediktSchackenberg/octofleet/wiki](https://github.com/BenediktSchackenberg/octofleet/wiki)
- 📜 **License:** MIT

---

*Building in public is fun. Let me know what you think!*
