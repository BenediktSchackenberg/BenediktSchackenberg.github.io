---
layout: post
title: "OpenClaw Inventory Platform v0.4.26 - Screen Sharing, Live View & Auto-Remediation"
subtitle: "Enterprise endpoint management is getting real"
date: 2026-02-14
tags: [openclaw, inventory, windows, endpoint-management, security]
---

After weeks of intensive development, the OpenClaw Inventory Platform has reached a major milestone with **v0.4.26**. What started as a simple Windows agent has evolved into a comprehensive endpoint management solution with real-time monitoring, security automation, and remote capabilities.

## 🖥️ Screen Sharing (E17)

The most exciting new feature is **real-time screen sharing**. You can now view any managed endpoint's screen directly from the web UI:

- **WebSocket-based streaming** for low-latency viewing
- **Quality controls** - adjust JPEG quality on the fly
- **Multi-monitor support** - select which display to view
- **Secure by default** - API key authentication required

No VNC installation needed. No firewall rules to configure. Just click "Screen" on any online node and you're in.

## 📊 Live View Dashboard (E16)

Real-time system monitoring via Server-Sent Events (SSE):

- **Live Performance Graphs** - CPU, RAM, Disk I/O, Network
- **Process List** - See running processes in real-time
- **Network Connections** - Active TCP/UDP connections
- **Event Log Stream** - Windows events as they happen

The Live View automatically reconnects if the connection drops and shows a clear "Live" indicator when streaming.

## 🔧 Auto-Remediation (E14)

Security automation that actually works:

- **Vulnerability Detection** → Automatic Fix
- **Winget + Chocolatey** - Uses winget first, falls back to Chocolatey if needed
- **Auto-installs Chocolatey** if missing on the endpoint
- **Package mapping** - Knows that "Google Chrome" = "googlechrome" in Chocolatey
- **Approval workflows** - Optional human approval for critical systems

Current stats from my production environment:
- 51 successful remediations
- 149 failed (mostly Chocolatey not installed - now auto-fixed!)
- 20 running
- 3 active remediation packages

## 🏭 Hardware Fleet Dashboard (E15)

Complete hardware inventory across your fleet:

- **CPU Details** - Model, cores, speed
- **Memory** - Total RAM, slots, speed
- **Storage** - All disks with SMART health data
- **Physical health badges** - Green/Yellow/Red status

Export your entire fleet inventory to CSV with one click.

## 🎫 Zero-Touch Enrollment (E10)

Deploy agents without manual configuration:

```powershell
# One-liner to install and auto-enroll
irm https://raw.githubusercontent.com/BenediktSchackenberg/openclaw-windows-agent/main/Install-OpenClawAgent.ps1 | iex
```

The installer:
- Downloads the latest release from GitHub
- Verifies SHA256 hash
- Installs as Windows Service
- Auto-connects to your inventory server

Enrollment tokens let you pre-authorize new devices.

## 🔐 Full RBAC (E8)

Enterprise-grade access control:

- **4 Built-in Roles** - Admin, Operator, Viewer, API
- **JWT Authentication** - Secure token-based auth
- **API Keys** - For automation and integrations
- **Audit Logging** - Every action is tracked

## 📡 SSE Everywhere

Server-Sent Events power real-time updates across the platform:

- Live View performance metrics
- Remediation job status changes
- Node online/offline status

No more refreshing pages. Data flows to you.

## The Stack

**Backend:**
- Python FastAPI
- PostgreSQL 16 + TimescaleDB
- asyncpg for async database access

**Frontend:**
- Next.js 14 with App Router
- Tailwind CSS + Lucide Icons
- Real-time SSE integration

**Agent:**
- .NET 8 Windows Service
- WMI for hardware inventory
- Native screen capture APIs

## What's Next?

- **Linux Agent** - Already in progress
- **macOS Support** - On the roadmap
- **Patch Tuesday automation** - Deploy Windows updates fleet-wide
- **Compliance reporting** - CIS benchmarks

## Try It Out

The entire platform is open source:

- 🔗 [GitHub: openclaw-windows-agent](https://github.com/BenediktSchackenberg/openclaw-windows-agent)
- 📚 [Wiki Documentation](https://github.com/BenediktSchackenberg/openclaw-windows-agent/wiki)

Current version: **v0.4.26**

---

*Built with [OpenClaw](https://github.com/openclaw/openclaw) - Your personal AI assistant that actually ships code.* 🦞
