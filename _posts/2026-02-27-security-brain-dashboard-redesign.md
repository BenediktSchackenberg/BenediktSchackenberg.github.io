---
layout: post
title: "The Week Octofleet Got a Security Brain 🧠"
subtitle: "Dashboard redesign, 14 security stories, community users, and too much coffee"
date: 2026-02-27
tags: [octofleet, security, dashboard, open-source, devops]
thumbnail-img: /assets/images/octofleet-dashboard-2026-02-27.png
share-img: /assets/images/octofleet-dashboard-2026-02-27.png
---

You know that feeling when your side project suddenly has actual users asking real questions? Yeah, this week was that week.

## The New Dashboard

Let's start with the eye candy. The dashboard got a complete facelift — gone is the utilitarian table layout, replaced by a proper **bento grid** with sparklines, color-coded status cards, and error toasts that don't make you want to close the tab.

![Octofleet Dashboard](/assets/images/octofleet-dashboard-2026-02-27.png)
*The new dashboard. Yes, I'm unreasonably proud of it.*

The frontend now has a global `apiClient` with automatic error handling, so instead of every component doing its own sad `try/catch` dance, there's one consistent place where things fail gracefully. Revolutionary, I know.

## 14 Security Stories in One Epic

This was the big one. **Epic E21: Security Monitoring, Insider-Risk & Long-Term Data Integrity Audit** — a name so long it barely fits in a GitHub issue title.

14 stories. All closed. Here's what Octofleet can do now:

### 🔍 Monitoring & Detection
- **Monitoring Profiles** — define what to watch, per node or group
- **Agent Health Reporting** — are your agents alive? What can they do?
- **File Audit** — real-time file system monitoring on both Windows (FileSystemWatcher) and Linux (inotifywait)
- **Behavior Rules** — threshold, pattern, and time-based rules that auto-generate findings. "100 deletions in 10 minutes in `/etc`? That's a finding."

### 📊 Analysis & Compliance
- **Config Posture Snapshots** — baseline your systems, detect drift over time. Did someone enable RDP at 3am? You'll know.
- **Vulnerability Fleet View** — aggregate CVEs across your entire fleet. Sort by severity, filter by node, see which package is your biggest liability.
- **Findings & Risk Scoring** — everything gets a risk score. Severity × frequency, capped at 10. Simple, effective.
- **Activity Dashboards** — who touched what file, when, and from where. After-hours activity detection included for the paranoid.

### 🔒 Evidence & Retention
- **Evidence Pack Export** — bundle events, findings, and audit logs into tamper-evident packages
- **Retention & Legal Hold** — because sometimes you need to keep data around even when you'd rather not
- **UI Audit Logging** — every click in the security center is logged. Quis custodiet ipsos custodes.

The whole thing is built on TimescaleDB hypertables for the event data, which means it doesn't choke when you throw a million file events at it. In theory. I haven't tested a million yet. Give me time.

## Community Moment

Something cool happened this week — a user named **battilanah** started actually using the PXE provisioning feature. Like, for real. Setting up network boot, asking about the iPXE flow, running into CORS issues.

The CORS thing was embarrassing (FastAPI's CORSMiddleware silently drops headers on unhandled 500 errors — who thought that was a good idea?), but it led to a proper global exception handler and a one-command setup script for PXE that handles everything automatically:

```bash
sudo ./provisioning/setup-pxe.sh
```

NFS, Docker, ISO extraction, iPXE menu, API registration, systemd service — done. The only manual step is telling your router where the TFTP server lives. Can't automate that one. Yet.

## The Unglamorous Bits

Not everything this week was new features. There was also:

- A **CI pipeline** that broke in creative ways (22 missing tables, FK type mismatches, double URL prefixes)
- A server crash and recovery from NFS backup (note to self: backups are not optional)
- Agent self-update that couldn't replace its own exe while running (solved with a batch file that yeehaws itself into existence, kills the service, copies files, and restarts)
- The classic "it works on my machine" → docker compose rebuild cycle, repeated approximately 47 times

## The Stack

For the curious:

| Layer | Tech |
|-------|------|
| Backend | Python/FastAPI (~15,000 lines and counting) |
| Frontend | Next.js 16 with Turbopack |
| Database | PostgreSQL 16 + TimescaleDB |
| Windows Agent | .NET 8 WPF Service (~3,000 lines) |
| Linux Agent | Bash (~1,500 lines, fight me) |
| PXE | iPXE + NFS + Docker |

## What's Next

- **Windows WIM deployment** via PXE (the config is there, the automation isn't)
- **Cloud-init integration** for Ubuntu auto-provisioning
- Probably more community issues (which is awesome)
- Maybe sleep

## The Vibe

I have a day job. A good one, actually — enterprise IT, the kind where you manage real infrastructure and occasionally get paged at 2am. Octofleet started because the tools I used at work were either too expensive, too clunky, or both.

Building this as a side project means I get to make all the decisions: the tech stack, the UX, the "should we add behavior rules at 11pm on a Thursday" questions (yes, apparently). It's the kind of creative freedom you don't always get when there are stakeholders and sprint reviews.

Is it production-ready? Beta. Very beta. But it's honest beta — the kind where things actually work, they're just not polished yet. And every week it gets a little more real.

If you're interested, the repo is public: [github.com/BenediktSchackenberg/octofleet](https://github.com/BenediktSchackenberg/octofleet)

Until next week. 🐙

---

*Benedikt builds endpoint management tools during questionable hours. When not writing FastAPI endpoints, he's probably debugging NFS exports or arguing with Docker about port bindings.*
