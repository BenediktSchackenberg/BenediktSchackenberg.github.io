---
layout: post
title: "Octofleet v0.6.0: Security Brains, Patch Orchestration & a Navbar That Doesn't Suck 🐙"
subtitle: "Two new epics, 50+ commits, dark mode everywhere, and an agent that updates itself"
date: 2026-03-03
tags: [octofleet, security, patching, compliance, open-source, devops, endpoint-management]
---

You know that feeling when you sit down on a Friday to "fix one small bug" and wake up on Tuesday with two entire feature epics shipped, a redesigned navigation system, and your agents auto-updating themselves from GitHub releases?

Yeah. That happened.

Buckle up — this is a big one. ☕

---

## 🎨 The Great Dark Mode Migration

Let's start with the one that annoyed me every single day: **half the app was still bright white.** Login page? Dark. Dashboard? Blinding. It was like walking from a movie theater into a parking lot at noon.

The diagnosis was brutal: **418 hardcoded colors** scattered across the entire frontend. Every `bg-white`, every `text-gray-800`, every `border-gray-200` — all of them completely ignoring the dark mode class on the root element.

The fix? A surgical strike across **23 files, 149 replacements:**

| Before | After |
|--------|-------|
| `bg-white` | `bg-white dark:bg-zinc-900` |
| `text-gray-800` | `text-gray-800 dark:text-zinc-100` |
| `border-gray-200` | `border-gray-200 dark:border-zinc-800` |
| `bg-blue-100 text-blue-800` | `bg-blue-500/20 text-blue-400` |

That last one is my favorite trick. Instead of having separate light/dark badge colors, translucent backgrounds (`bg-*-500/20`) with bright text (`text-*-400`) look great in both modes. Stolen from Discord's playbook, honestly.

**Result:** Every. Single. Page. Now dark. Login ✅ Dashboard ✅ Nodes ✅ Jobs ✅ Vulnerabilities ✅ Security Center ✅ Services ✅ Reports ✅ Settings ✅

No more retina burns at 2 AM. You're welcome. 🌙

---

## 🔐 E30: Patch & Update Orchestration

This is the big kahuna. The one feature every IT admin asks about first: *"Can it patch my machines?"*

Before v0.6.0, Octofleet could tell you about vulnerabilities. It could even remediate some of them through the remediation engine. But it didn't have a proper **patch management pipeline** — you know, the whole ring-based, staged rollout, compliance-tracking thing that makes SCCM admins feel warm and fuzzy.

Now it does.

### What We Built

**🗄️ Server Side (Phase 1)**

Five new database tables form the backbone:
- `patch_catalog` — Your master list of patches with severity, KB numbers, and affected products
- `patch_rings` — Deployment rings (Dev → Pilot → Broad → Critical) with configurable delays
- `patch_deployments` — Scheduled rollouts targeting specific rings
- `patch_deployment_results` — Per-node results tracking
- `patch_catalog_nodes` — Which nodes need which patches

Twenty API endpoints under `/api/v1/patches/` handle everything from catalog management to deployment approval workflows.

The frontend got a proper `/patches` page with four tabs: Catalog, Rings, Deployments, and Compliance. There's a deployment wizard that walks you through selecting patches, picking a ring, setting a schedule, and kicking it off.

**🖥️ Agent Side (Phase 2)**

Here's where it gets spicy. `PatchScanner.cs` talks directly to the Windows Update Agent COM API:

```csharp
var updateSession = new UpdateSession();
var updateSearcher = updateSession.CreateUpdateSearcher();
var searchResult = updateSearcher.Search("IsInstalled=0");
```

Every 6 hours, the agent scans for missing updates and reports back to the server. No WSUS required. No SCCM. Just the agent talking to Windows Update and telling headquarters what's missing.

The scanner categorizes patches by severity (Critical, Important, Moderate) and maps them to KB numbers so the server-side catalog stays in sync.

**Is it SCCM?** No. Is it enough for 90% of environments under 500 nodes? Absolutely. 💪

---

## 📏 E31: Configuration Baselines & Drift Management

If E30 is about *"are my machines patched?"*, E31 is about *"are my machines configured correctly?"*

Think Group Policy auditing, but vendor-agnostic and with actual drift detection.

### The Concept

You define a **baseline** — a collection of rules that describe how a machine *should* be configured. Things like:

- 🔒 Password policy: minimum 12 characters
- 🛡️ Windows Firewall: enabled on all profiles
- 🚫 Guest account: disabled
- 💻 RDP: Network Level Authentication required

Then you assign that baseline to nodes or groups. Octofleet evaluates the rules against inventory data and tells you who's compliant and who's drifting.

### Phase 1: The Engine

- `config_baselines` — Named baselines (e.g., "Windows Server 2022 Hardening")
- `config_baseline_rules` — Individual rules with expected values and evaluation logic
- `config_baseline_assignments` — Which nodes/groups get which baselines
- `config_baseline_evaluations` — Results from the last evaluation run
- `config_drift_events` — Timeline of when drift was detected (and resolved)

The evaluation engine runs server-side against inventory data that agents already collect. No extra agent configuration needed.

### Phase 2: CIS Benchmarks & Auto-Remediation

This is where it gets *really* cool. We built two CIS benchmark templates out of the box:

**Windows Server 2022/2025 L1** (9 rules):
- Password history, max age, min length, complexity
- Account lockout threshold and duration
- Windows Firewall profiles
- Remote Desktop NLA

**Windows 11 Enterprise L1** (6 rules):
- UAC enforcement
- Windows Defender real-time protection
- BitLocker drive encryption
- Audit policy configuration

Each rule has an evaluation type (`registry`, `policy`, `service`, `feature`) and many come with **auto-remediation scripts**. Click "Remediate" and Octofleet generates the appropriate PowerShell command:

```powershell
# For non-Server SKUs (Win10/11):
try { 
    Install-WindowsFeature Windows-Defender -IncludeManagementTools -ErrorAction Stop 
} catch { 
    Add-WindowsCapability -Online -Name 'Microsoft.Windows.Defender~~~~' -ErrorAction Stop 
}
```

That `try/catch` fallback? Yeah, that's because `Install-WindowsFeature` only exists on Server editions. Spent a fun hour debugging why remediation worked on HYPERV02 but crashed on desktop machines. The joys of cross-SKU PowerShell. 🙃

---

## 🧭 The Mega Dropdown Navigation

The old navbar had seven top-level items and a secondary tab bar on the Security page. It was fine when we had 15 pages. We now have **40+**. Something had to give.

Enter the **mega dropdown:**

```
┌─────────────────────────────────────────────┐
│  🔒 Security                                │
├─────────────────┬───────────────────────────┤
│  Monitoring      │  Compliance               │
│  ────────────── │  ──────────────────────── │
│  📊 Dashboard    │  📏 Baselines              │
│  🔍 Findings     │  📋 CIS Benchmarks         │
│  📡 Events       │  🔄 Drift Events           │
│  📁 File Audit   │  🛡️ Posture                │
│  🧠 Behavior     │  💊 Remediation            │
│  👁️ Activity     │  ⚖️ Retention              │
│  📦 Evidence     │  🎯 Policies               │
└─────────────────┴───────────────────────────┘
```

Two columns. Section headers. 14 items organized by function. Persistent context — the dropdown highlights which section you're currently in.

The navbar now has six dropdowns: **Fleet** (emerald), **Software** (blue), **Infra** (amber), **Security** (red, 2-column mega), **Ops** (cyan), and **Admin** (purple). Each with its own color identity so you always know where you are.

Goodbye, tab bar. You served us well. 👋

---

## 🔧 The Job System Bug That Wasn't a Bug

This one's a good story.

Users reported that jobs showed "device" instead of the actual hostname in the jobs list. Also, some jobs were stuck at 0/0 instances. Classic.

**Round 1:** I added a `LEFT JOIN nodes` to resolve hostnames. Committed. Deployed. Still showing "device."

**Round 2:** Turns out FastAPI has a *last-registered-wins* behavior for routes. The `routers/jobs.py` file was overriding the endpoint in `main.py`. My fix was in `main.py`. The wrong file. 🤦

**Round 3:** Fixed `routers/jobs.py` with the proper JOIN. Now hostnames show up. But wait — *why are jobs stuck at 0/0 instances?*

**Round 4:** The `create_job()` function in `routers/jobs.py` was inserting into the `jobs` table... but **never creating `job_instances`**. Jobs existed in the database, but agents had nothing to pick up. It's like placing an order at a restaurant but nobody sending it to the kitchen.

**Round 5:** Fixed instance creation. Jobs now show `instances: 1`. But agents *still* aren't executing them?!

**Round 6:** The agent polls as `win-baltasa`, which resolves to `BALTASA`. But `job_instances.node_id` stores UUIDs like `d7cc6f42-735a-409c-...`. The query was comparing apples to UUIDs. Added a node lookup step that resolves hostname → UUID before querying.

Six rounds. One "simple" feature. Welcome to distributed systems.

Jobs now show actual hostnames, create proper instances, and agents actually pick them up. What a concept. 🎪

---

## 🤖 Self-Updating Agents

Speaking of agents — v0.6.0 includes the `PatchScanner` and `PostureCollector`, so all nodes needed an update. The auto-updater checks GitHub releases on startup, downloads the ZIP, extracts, and restarts itself.

**The catch:** When running as a Windows Service, the agent can't cleanly restart itself (you can't kill the process that's killing the process). In interactive/PowerShell mode? Works beautifully. As a service? The restart script spawns but the timing is... unpredictable.

Current rollout status:
- ✅ DESKTOP-B4GCTCV — self-updated to v0.6.0
- ✅ BALTASA — manual PowerShell restart → auto-updated
- ✅ HYPERV02 — updated via restart job
- 🔄 SCVMM, SQLSERVER1 — in progress

For the remaining two, a quick `Restart-Service OctofleetNodeAgent` on the box does the trick. Not elegant, but it works.

---

## 🖥️ Hardware Fleet Dashboard

New page alert! `/fleet/hardware` now shows a fleet-wide hardware overview:

- **📦 Total Storage:** 12.44 TB across all nodes
- **💽 Disk Health:** 5 healthy, 4 unknown (virtual disks don't report SMART)
- **🧮 CPU Breakdown:** AMD Ryzen 9800X3D, Intel i7-13700, i9-13900K, i7-8550U
- **⚠️ Issues:** Auto-detects drives above 90% capacity

All data pulled from the `hardware_current` table that agents populate automatically. Zero configuration required.

---

## 🩹 The Remediation Engine Saga

The vulnerability remediation pipeline got *a lot* of love this release. Here's a highlight reel of bugs found and squashed:

| Bug | Root Cause | Fix |
|-----|-----------|-----|
| Remediation jobs fail to create | `node_id` inserted as `text`, column is `uuid` | Cast to `::uuid` |
| Agent never picks up jobs | Status filter only matched `approved`, engine creates `pending` | `IN ('pending', 'approved')` |
| Dashboard shows wrong counts | API returned `completed`, frontend expected `success` | Return both key formats |
| SSE stream crashes | `json.dumps()` on raw UUID objects | `default=str` serializer |
| 500 duplicate jobs | Double-click on "Remediate" button | Cleaned up + added debounce |
| `winget` returns exit code 1 | "No upgrade available" is technically exit 1 | Treat as success |

After remediation succeeds, vulnerabilities are now **automatically marked as fixed** in `node_vulnerabilities`. The vulnerability dashboard filters these out, so your numbers actually go down when you fix things. Revolutionary, I know. 📉

---

## 📊 By The Numbers

Since v0.5.6 (5 days ago):

| Metric | Count |
|--------|-------|
| Commits | 50+ |
| New API endpoints | 40+ |
| New DB tables | 10 |
| Files changed | 100+ |
| New frontend pages | 8 |
| E2E tests passing | 41/44 |
| Dark mode pages | 9/9 ✅ |
| Bugs squashed | ~20 |
| Coffee consumed | ☕☕☕☕☕ |

---

## What's Next?

The roadmap still has plenty of meat on it:

- **E33 — Software Metering & License Tracking** (P2)
- **E34 — Network Discovery & Topology** (P2) 
- **E35 — Enterprise Reporting Suite** (P3)
- Agent registry inventory for CIS registry rule evaluation
- Build agent v0.6.0 binary via CI (currently requires Windows + dotnet publish)

Oh, and `main.py` is still 11,500 lines. That number only goes in one direction around here, and it's not the direction I'd like. But that's a problem for future me.

---

The full release is tagged as [v0.6.0 on GitHub](https://github.com/BenediktSchackenberg/octofleet/releases/tag/v0.6.0). Star the repo if you're into this kind of thing. Or don't. I'm not your dad. 🐙

*— Benedikt*
