---
layout: post
title: "Shipping v0.3.6: Jobs, Package Management, and 32 Tests"
date: 2026-02-08
tag: release
headerimage: /assets/images/job-system-hero.jpg
description: "Building a proper job execution system, package management on the agent side, and why I finally wrote tests."
---

# Shipping v0.3.6: Jobs, Package Management, and 32 Tests That Actually Pass

It's 4 PM on a Saturday and I just pushed a release. Not because I had to, but because the dopamine of green checkmarks is too addictive.

Let me tell you about the last 24 hours.

---

## The Job System Finally Works

Remember that endpoint management platform I've been building? The one where you can push commands to Windows agents remotely? 

Well, "pushing commands" is nice, but what I really needed was a proper **job queue**. Something where I could say "install 7-Zip on all machines in the Production group" and have it... actually happen.

### What I Built

**E3: Job System Core** is now complete. All 14 tasks. Here's what that means:

1. **Job Queue in PostgreSQL** — Jobs get created, instances spawn for each target node, and everything tracks state properly (pending → queued → running → success/failed)

2. **Agent Polling** — Every 30 seconds, the Windows agent checks: "Hey, got any work for me?" Clean, simple, doesn't hammer the API.

3. **Pre/Post Scripts** — Need to stop a service before installing something? Run a cleanup script after? Handled.

4. **Reboot Handling** — Some installs need a reboot. The agent can schedule one (`shutdown /r /t 60`), and the job system tracks that the reboot was requested.

5. **Exponential Backoff** — If the API is down or network is flaky, the agent backs off: 1 min → 2 min → 4 min → ... → 15 min max. No thundering herd when things come back online.

---

## Package Management (Agent Side)

The fun part: teaching a Windows service to download and install things.

**E4-10 through E4-16** are done. The agent can now:

- **Download from SMB shares** — `\\fileserver\packages\7zip.msi` just works
- **Download from HTTP** — Public URLs, signed with SHA-256 verification
- **Cache locally** — No re-downloading if the file's already there
- **Run detection rules** — Is the package already installed? Check MSI product codes, registry keys, file versions, or Windows services
- **Execute silently** — MSI, EXE, scripts — whatever your package needs

The detection rules are the interesting bit. Before installing anything, the agent asks:

```json
{
  "type": "msi_product_code",
  "productCode": "{23170F69-40C1-2702-2401-000001000000}"
}
```

Is 7-Zip already installed? Cool, skip. Is it an older version? Install the new one. This is how you avoid "already installed" errors at scale.

---

## The Bug That Wasted an Hour

Here's a fun one. I created a job to update all agents to v0.3.6:

```bash
curl -X POST http://localhost:8080/api/v1/jobs \
  -d '{"name": "Update Agent", "targetType": "all", ...}'
```

Response: `"instancesCreated": 3`

Great! Three nodes, three job instances. Except... none of them were getting picked up. The agents polled, saw nothing, polled again. Nothing.

**The problem?** Schema mismatch.

My `nodes` table has:
- `id` — UUID (primary key)
- `node_id` — TEXT (like "BALTASA")

My `system_current` table stores the node's `id` in a column also named `node_id`. Why? Because past-me thought that was clever.

When creating job instances for "all nodes", I was pulling `node_id` from `system_current` — but that's a UUID, not the text identifier the agents use when polling.

Fix: Join through the `nodes` table to get the actual text `node_id`.

```sql
SELECT n.node_id 
FROM nodes n 
INNER JOIN system_current sc ON sc.node_id = n.id
```

Then there was a second issue: agents poll with `win-baltasa` (lowercase, prefixed), but the database stores `BALTASA` (uppercase, no prefix). 

Fix: Make the pending jobs endpoint case-insensitive and strip the `win-` prefix:

```python
if node_id.startswith("win-"):
    lookup_id = node_id[4:].upper()
```

Sometimes the bugs that take the longest are the dumbest.

---

## 32 Tests. Zero Failures.

I finally wrote E2E tests. Playwright, because I already know it and it's fast.

```
✓ Navigation (3 tests)
✓ Dashboard (6 tests)  
✓ Nodes Page (6 tests)
✓ Jobs Page (8 tests)
✓ Groups & Packages (9 tests)
```

The tests cover:
- Page navigation and loading
- API responses (nodes, hardware, software, jobs, groups, packages)
- UI elements and interactions
- Edge cases (POST endpoints return 401 without API key — that's expected)

Running them:
```bash
npm test          # Headless, CI-friendly
npm run test:ui   # Interactive mode for debugging
```

I should've written these earlier. Would've caught that snake_case vs camelCase issue in the API responses way faster.

---

## Release v0.3.6

Tagged, built, published:

<https://github.com/BenediktSchackenberg/openclaw-windows-agent/releases/tag/v0.3.6>

**What's in the box:**
- Complete job system (E3: 14/14 tasks)
- Package manager agent-side (E4: 16/20 tasks — frontend remaining)
- 32 Playwright tests
- Bug fixes for job routing

**What's next:**
- E4-17 to E4-20: Package management UI
- E5: Deployment engine (assign packages to groups, track rollouts)
- Maybe E11-E14 if I'm feeling ambitious (software depot)

---

## The ROADMAP is Now in English

Someone pointed out that a German roadmap makes collaboration harder. Fair point.

[ROADMAP.md](https://github.com/BenediktSchackenberg/openclaw-windows-agent/blob/main/ROADMAP.md) now has all 14 epics documented in English, with task-level tracking.

E3 is marked complete. E4 is 80% done. The finish line is visible.

---

## Lessons from Today

1. **Match your identifiers** — If agents use `win-hostname` and the DB stores `HOSTNAME`, you're gonna have a bad time. Pick one format and stick to it.

2. **Write tests when things work** — Not after they break. The 30 minutes spent writing tests saves hours of "why doesn't this work anymore?"

3. **Release often** — v0.3.5 was yesterday. v0.3.6 is today. Small, focused releases mean smaller blast radius when something breaks.

4. **Document as you go** — The roadmap update took 10 minutes. Future-me will thank present-me.

---

## What's Running on My Network Right Now

Three Windows machines, all checking in every 30 seconds:
- Hardware inventory (CPU, RAM, disks, GPUs)
- Software inventory (installed apps, browsers, updates)
- Security posture (AV status, firewall, BitLocker)
- Job polling (waiting for work)

One PostgreSQL + TimescaleDB instance holding it all.

One FastAPI backend coordinating everything.

One Next.js frontend showing me the dashboard.

And one AI assistant that can tell any of them what to do.

It's starting to feel like a real product.

---

*If you're building something similar, [OpenClaw](https://github.com/openclaw/openclaw) is open source. The Windows agent code is at [openclaw-windows-agent](https://github.com/BenediktSchackenberg/openclaw-windows-agent). PRs welcome, issues expected.*
