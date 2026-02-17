---
layout: page
title: Projects
subtitle: What I'm building
permalink: /projects/
---

> **📌 Note:** I'm no longer available for consulting or freelance work. I'm happily employed full-time at the University Medical Center Mainz and loving it! If you'd like to connect, feel free to reach out on [LinkedIn](https://www.linkedin.com/in/benedikt-schackenberg-b7422338b/).

---

## 🐙 Octofleet

<div style="text-align: center; margin: 20px 0;">
  <img src="{{ '/assets/img/octofleet-banner.png' | relative_url }}" alt="Octofleet - Open Source Endpoint Management" style="max-width: 100%; border-radius: 8px;">
</div>

A self-hosted solution for managing Windows and Linux fleets. No cloud subscriptions, no vendor lock-in — your infrastructure, your control.

**Features:**
- 📊 **Inventory** — Hardware & software collection across all endpoints
- 🔍 **Vulnerability Scanning** — CVE tracking via NVD API with auto-remediation
- 🖥️ **Remote Terminal** — PowerShell/Bash directly in your browser
- 📺 **Screen Mirroring** — View remote desktops in real-time
- 📈 **Performance Monitoring** — CPU, RAM, Disk metrics over time
- 🚀 **Job System** — Deploy commands and packages across your fleet
- 🔔 **Alerting** — Discord notifications when things go wrong
- 🛡️ **Compliance** — Track Firewall, BitLocker, Antivirus status

**Tech Stack:** Python, FastAPI, PostgreSQL, TimescaleDB, Next.js, .NET 8

<p>
  <a href="https://github.com/BenediktSchackenberg/octofleet">GitHub Repository →</a> · 
  <a href="/2026/02/16/introducing-octofleet.html">Read the announcement →</a>
</p>
