---
layout: post
title: "I Built an AI That Controls My Windows PCs"
date: 2026-02-07
tag: openclaw
headerimage: /assets/images/openclaw-agent-hero.jpg
description: "How I connected OpenClaw to Windows machines and created a zero-touch deployment system. Now my AI assistant can install software, run commands, and collect inventory across my entire network."
---

# I Built an AI That Controls My Windows PCs (And It's Terrifyingly Awesome)

You know that feeling when you're too lazy to walk to your server room? 

Yeah, me too. So I did what any reasonable person would do: I taught an AI to manage all my Windows machines remotely.

**Spoiler alert: It works. Maybe too well.**

---

## The Problem

I have several Windows PCs scattered around my network:
- **DESKTOP-B4GCTCV** — My main rig with a Ryzen 9 9800X3D (yes, I'm flexing)
- **BALTASA** — A Windows Server doing... server things
- **CONTROLLER** — A machine that needed an agent installed

Managing them manually? Walking to each one? *In this economy?*

No thanks. I wanted to:
1. Install agents remotely with one command
2. Collect hardware/software inventory automatically
3. Run commands from my AI assistant (Discord, Telegram, wherever)
4. Never touch a keyboard that isn't mine

---

## The Solution: OpenClaw Windows Agent

I built a Windows Service that connects back to [OpenClaw](https://openclaw.ai) — an open-source AI gateway that lets you control stuff with natural language.

### What It Does

**🔧 Remote Command Execution**
```
Me: "Hey, what's the hostname of CONTROLLER?"
AI: *runs command* → "CONTROLLER"
Me: "Open Notepad"
AI: *opens Notepad on the remote machine*
```

**📊 Hardware & Software Inventory**
- CPU, RAM, GPU, Disk info
- All installed software with versions
- Windows Updates / Hotfixes
- Network connections
- Security settings (Firewall, TPM, BitLocker)
- Browser extensions (yes, really)

**🚀 Zero-Touch Installation**
One PowerShell command. That's it.

```powershell
.\Install-OpenClawAgent.ps1 -GatewayUrl "http://192.168.0.5:18789" -GatewayToken "your-token"
```

The script:
1. Downloads the agent from GitHub Releases
2. Verifies SHA256 hash
3. Extracts to `C:\Program Files\OpenClaw\Agent`
4. Registers as a Windows Service (auto-start)
5. Writes config file
6. Starts service → connects to Gateway

**Time to deploy: ~30 seconds per machine.**

---

## The Tech Stack

### Windows Agent (C# / .NET 8)
- **WPF GUI** for manual config (MVVM with CommunityToolkit)
- **Windows Service** that runs 24/7
- **WebSocket client** for persistent Gateway connection
- **WMI/CIM queries** for inventory collection

### Linux Gateway (Node.js / OpenClaw)
- Handles AI conversations
- Routes commands to connected nodes
- Stores inventory in PostgreSQL + TimescaleDB

### Web Dashboard (Next.js 16 / shadcn/ui)
- Shows all connected nodes
- Hardware/Software details
- Groups and tags for organization

---

## The Fun Part: What Can You Actually Do?

### Talk to Your Machines via Discord

```
Me: @AI what's installed on BALTASA?

AI: BALTASA has 127 applications installed, including:
- Visual Studio 2022 (17.9.6)
- SQL Server Management Studio
- 7-Zip 24.09
...
```

### Run Arbitrary Commands

```
Me: Run "Get-Process | Select -First 5" on CONTROLLER

AI: *executes*
Handles  NPM(K)  PM(K)   WS(K)  CPU(s)   Id  ProcessName
-------  ------  -----   ----   ------   --  -----------
    155      10   2184   8812     0.08   456  csrss
    ...
```

### Check Security Status

```
Me: Is BitLocker enabled on my machines?

AI: *queries all nodes*
- DESKTOP-B4GCTCV: BitLocker ON (C:, D:)
- BALTASA: BitLocker OFF
- CONTROLLER: BitLocker ON (C:)
```

### Push Inventory Updates

```
Me: Refresh inventory on all nodes

AI: *sends inventory.push to all* 
Done! 3 nodes updated.
```

---

## Zero-Touch Deployment: The Dream

The installer script was the final boss. I wanted:
- **No manual steps** on target machines
- **Download from GitHub Releases** (versioned, hashable)
- **Enrollment tokens** for large deployments (no shared secrets)

Here's the flow:

1. Create enrollment token in dashboard (expires in 24h, max 10 uses)
2. Run one-liner on target machine:
   ```powershell
   .\Install-OpenClawAgent.ps1 -EnrollToken "abc123..."
   ```
3. Script calls API, gets credentials, installs everything
4. Machine appears in dashboard within 30 seconds

**Perfect for imaging, SCCM, Intune, PDQ Deploy, or just being lazy.**

---

## The Numbers

| Metric | Value |
|--------|-------|
| Lines of C# | ~5,000 |
| Lines of Python (backend) | ~800 |
| Lines of TypeScript (frontend) | ~1,500 |
| Time to deploy new machine | ~30 seconds |
| Machines currently connected | 3 |
| Regrets | 0 |

---

## What's Next?

This is just the beginning. The roadmap includes:

- **Job System** — Schedule tasks across machine groups
- **Package Management** — Define, deploy, and update software
- **Compliance Reporting** — Check machines against security baselines  
- **Linux Agent** — Because why stop at Windows?
- **Role-Based Access Control** — Multi-tenant support

---

## Try It Yourself

Everything is open source:

- **Windows Agent**: [github.com/BenediktSchackenberg/openclaw-windows-agent](https://github.com/BenediktSchackenberg/openclaw-windows-agent)
- **OpenClaw**: [github.com/openclaw/openclaw](https://github.com/openclaw/openclaw)
- **Releases**: [v0.3.2 (Latest)](https://github.com/BenediktSchackenberg/openclaw-windows-agent/releases/tag/v0.3.2)

### Quick Start

1. Install OpenClaw on Linux:
   ```bash
   npm install -g openclaw
   openclaw gateway start
   ```

2. Run installer on Windows (as Admin):
   ```powershell
   Invoke-WebRequest -Uri "https://raw.githubusercontent.com/BenediktSchackenberg/openclaw-windows-agent/main/installer/Install-OpenClawAgent.ps1" -OutFile "Install.ps1"
   .\Install.ps1 -GatewayUrl "http://YOUR-IP:18789" -GatewayToken "YOUR-TOKEN"
   ```

3. Talk to your AI. Watch it control your machines. Question your life choices.

---

## Closing Thoughts

Is giving an AI control over your Windows machines a good idea?

*Probably not.*

Is it incredibly fun and surprisingly useful?

*Absolutely.*

The future isn't about AI replacing humans — it's about AI doing the boring stuff so we can focus on... I don't know, touching grass or something.

Now if you'll excuse me, I need to ask my AI to check if my server is still running.

---

*Built with 🐉 energy and questionable decision-making.*

*— Benedikt, February 2026*
