---
layout: post
title: "How Octofleet Patches Windows Servers — From Catalog to Kernel Reboot 🩹"
subtitle: "A deep dive into our WSUS-free patch orchestration engine: rings, deployments, and a .NET agent that talks to Windows Update"
date: 2026-03-06
tags: [octofleet, patching, windows-update, wsus, endpoint-management, dotnet, devops, security]
thumbnail-img: /assets/img/patch-management-thumb.png
share-img: /assets/img/patch-management-thumb.png
---

Let's talk about one of those problems that every Windows admin knows and loves: **patching servers without losing your sanity** 🧠

WSUS has been the go-to for decades, but let's be honest — it's showing its age. The UI looks like it was designed during the Windows XP era (because it was), GPO-based targeting feels like wrestling an octopus 🐙, and if you've ever debugged a WSUS sync failure at 2 AM... you know.

So we built our own. From scratch. Here's how Octofleet patches a Windows fleet without WSUS, without Intune, without any Microsoft infrastructure at all.

---

## 🏗️ The Architecture: Four Moving Pieces

Octofleet's patch management has four main components working together:

```
┌─────────────────────────────────────────────┐
│              Octofleet Server                │
│  ┌─────────────┐  ┌──────────────────────┐  │
│  │ Patch Catalog│  │ Deployment Engine    │  │
│  │ (22 patches) │  │ (Rings → Jobs)       │  │
│  └──────┬──────┘  └──────────┬───────────┘  │
│         │                    │               │
│  ┌──────┴──────┐  ┌─────────┴────────────┐  │
│  │ Ring Manager │  │ Compliance Tracker   │  │
│  │ (Groups)     │  │ (Results + Status)   │  │
│  └─────────────┘  └──────────────────────┘  │
└──────────────────────┬──────────────────────┘
                       │ HTTP API
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
   ┌─────────┐   ┌─────────┐   ┌─────────┐
   │ Agent   │   │ Agent   │   │ Agent   │
   │ Scanner │   │ Scanner │   │ Scanner │
   │ + Inst. │   │ + Inst. │   │ + Inst. │
   │ (WUA)   │   │ (WUA)   │   │ (WUA)   │
   └─────────┘   └─────────┘   └─────────┘
   SQLSERVER1     BALTASA       HYPERV02
```

Let me walk you through each piece.

---

## 📦 The Patch Catalog: Your Single Source of Truth

Every patch starts its life in the **Patch Catalog**. This is a server-side database of all known Windows Updates across your fleet. Think of it as your personal Windows Update catalog, but without the 47 GB WSUS database.

```sql
CREATE TABLE patch_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kb_id VARCHAR(20) NOT NULL,
    title TEXT NOT NULL,
    severity VARCHAR(20),        -- critical, important, moderate, low
    category VARCHAR(50),        -- security, feature, driver, definition
    status VARCHAR(20) DEFAULT 'pending',  -- pending, approved, excluded
    release_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

Patches enter the catalog in two ways:

1. **Agent Discovery** — The `PatchScanner` on each Windows agent scans for available updates using the Windows Update Agent (WUA) COM API and reports them back
2. **Manual Import** — Admins can add specific KB articles they want to track

Each patch has a status: **pending** (just discovered), **approved** (ready to deploy), or **excluded** (nah, we don't want this one). That SQL Server CU2 you see as "Approved"? That means it's cleared for deployment. The other patches sitting at "Pending"? They're waiting for someone to say "go".

---

## 🎯 Deployment Rings: Because You Don't YOLO-Patch Production

Here's where it gets fun. Instead of "deploy to all 500 servers and pray" (the WSUS classic), Octofleet uses **deployment rings**.

A ring is basically: **a patch + a group of nodes + a timeline**.

```
Ring: "SQL Servers"
├── Group: "Sql Server" (contains SQLSERVER1)
├── Schedule: Immediate
└── Reboot Policy: no_reboot
```

The ring system lets you do phased rollouts:

1. **Ring 0 — Canary**: Deploy to 1-2 test servers
2. **Ring 1 — Early Adopters**: Expand to a dev/staging group
3. **Ring 2 — Production**: Roll out to everyone

Each ring is linked to a **node group**. Node groups are just collections of servers — you might have "SQL Servers", "Domain Controllers", "Web Servers", etc. When you create a deployment, it targets a ring, which resolves to the nodes in that ring's group.

```sql
CREATE TABLE patch_rings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    node_group_id UUID REFERENCES node_groups(id),
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);
```

The important bit: **rings don't know about individual nodes**. They know about groups. The node-to-group membership is managed separately. This means you can shuffle servers between groups without touching your deployment config.

---

## 🚀 The Deployment: Where Rubber Meets Road

When you click "New Deployment" in the UI, here's what happens behind the scenes:

### Step 1: Create the Deployment Record

```python
@router.post("/api/v1/patches/deployments")
async def create_patch_deployment(request):
    # Resolve which nodes are in the ring's group
    nodes = await get_group_members(request.ring_id)
    
    # Create deployment record
    deployment = await db.insert("patch_deployments", {
        "patch_id": request.patch_id,
        "ring_id": request.ring_id,
        "status": "pending",
        "reboot_policy": request.reboot_policy  # no_reboot | schedule | force
    })
```

### Step 2: Create Jobs + Job Instances

This is the clever part. The deployment doesn't talk to agents directly. Instead, it creates **jobs** — the same job system used for scripts, package installs, and everything else:

```python
    # Create a job for this deployment
    job = await db.insert("jobs", {
        "name": f"Patch: {patch.title}",
        "command_type": "patch_install",
        "target_type": "group",
        "target_id": ring.node_group_id
    })
    
    # Create one job_instance per node in the group
    for node in nodes:
        await db.insert("job_instances", {
            "job_id": job.id,
            "node_id": node.id,
            "status": "pending"
        })
```

Each node in the ring gets its own `job_instance`. The agent polls for these on its regular interval.

### Step 3: Agent Picks Up the Job

Every 30 seconds, the agent's `JobPoller` calls:

```
GET /api/v1/jobs/pending/win-sqlserver1
```

The backend looks up the node UUID from the hostname, finds pending job instances, and returns them. The response includes the `command_type: "patch_install"` and the `command_data` with the KB ID to install.

But wait — there's a sneaky problem here. The agent polls as `win-sqlserver1` (lowercase hostname with `win-` prefix), but `job_instances.node_id` stores UUIDs. So the backend has to do a hostname-to-UUID resolution:

```python
# Agent sends hostname, we need the UUID
node = await db.fetchrow(
    "SELECT id FROM nodes WHERE LOWER(hostname) = $1 OR node_id = $1",
    node_id.replace("win-", "")
)
# Then query job_instances with the UUID
```

This was one of those bugs that took us 6 separate commits to fully squash 😅

---

## 🔧 The Agent: PatchInstaller.cs

This is where the magic happens. The `PatchInstaller` is a .NET 8 class that talks directly to the **Windows Update Agent COM API**. No WSUS. No GPO. Just pure COM interop.

Here's the simplified flow:

```csharp
public async Task<JobResult> InstallPatch(string kbId, string rebootPolicy)
{
    // Step 1: Create an Update Session
    var session = new UpdateSession();
    var searcher = session.CreateUpdateSearcher();
    
    // Step 2: Search for the specific KB
    var searchResult = searcher.Search($"IsInstalled=0 AND UpdateID='{kbId}'");
    
    if (searchResult.Updates.Count == 0)
    {
        // KB not found or already installed
        return JobResult.Success("Patch already installed or not applicable");
    }
    
    // Step 3: Download the update
    var downloader = session.CreateUpdateDownloader();
    downloader.Updates = searchResult.Updates;
    var downloadResult = downloader.Download();
    
    // Step 4: Install the update
    var installer = session.CreateUpdateInstaller();
    installer.Updates = searchResult.Updates;
    var installResult = installer.Install();
    
    // Step 5: Handle reboot
    if (installResult.RebootRequired)
    {
        switch (rebootPolicy)
        {
            case "no_reboot":
                return JobResult.Success("Installed - reboot pending");
            case "schedule":
                ScheduleReboot(TimeSpan.FromHours(4));
                break;
            case "force":
                Process.Start("shutdown", "/r /t 60 /c \"Octofleet patch reboot\"");
                break;
        }
    }
    
    return JobResult.Success($"Installed {installResult.Updates.Count} updates");
}
```

The WUA COM API is surprisingly powerful. It handles:
- **Searching** for specific updates by KB ID
- **Downloading** update packages (from Microsoft's CDN, not from us)
- **Installing** with proper privilege escalation
- **Reboot detection** — knows if the update requires a restart

### The Three Reboot Policies

This was a design decision we thought about carefully:

| Policy | Behavior | Use Case |
|--------|----------|----------|
| `no_reboot` | Install only, never reboot | SQL Servers, DCs — schedule maintenance window manually |
| `schedule` | Reboot in 4 hours | General servers — gives time to drain connections |
| `force` | Reboot in 60 seconds with warning | Dev/test — just get it done |

For our SQL Server CU2 deployment, we used `no_reboot` because... you don't just reboot a production SQL Server. That's a career-limiting move 💀

---

## 🔍 The Scanner: How Agents Discover Patches

Before you can deploy patches, you need to know what's missing. That's the `PatchScanner`'s job.

Every 6 hours (configurable), each agent runs a WUA scan:

```csharp
public class PatchScanner : BackgroundService
{
    private const int ScanIntervalHours = 6;
    
    protected override async Task ExecuteAsync(CancellationToken token)
    {
        while (!token.IsCancellationRequested)
        {
            var session = new UpdateSession();
            var searcher = session.CreateUpdateSearcher();
            
            // Find all missing updates
            var result = searcher.Search("IsInstalled=0");
            
            var patches = result.Updates.Cast<IUpdate>().Select(u => new {
                kb_id = u.KBArticleIDs[0],
                title = u.Title,
                severity = MapSeverity(u.MsrcSeverity),
                category = u.Categories[0]?.Name ?? "other"
            });
            
            // Report to server
            await PostToApi("/api/v1/patches/scan-results", patches);
            
            await Task.Delay(TimeSpan.FromHours(ScanIntervalHours), token);
        }
    }
}
```

The server receives the scan results and:
1. Adds new KBs to the `patch_catalog` (status: `pending`)
2. Updates the `patch_catalog_nodes` table (which node needs which patch)
3. Recalculates compliance percentages

This means your catalog grows organically. You never have to manually import anything — the agents tell you what they're missing.

---

## 📊 Compliance: Are We There Yet?

After deployments run, the compliance tracker tells you how you're doing:

```
┌──────────────────────────────────────────────────────┐
│  Patch Management Dashboard                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐ │
│  │ Total: 22│ │Pending:68│ │ Compli-  │ │ Active  │ │
│  │10 approv.│ │ 0 failed │ │ ance: 0% │ │ Deploy: │ │
│  │          │ │          │ │ MTTP:N/A │ │   0     │ │
│  └──────────┘ └──────────┘ └──────────┘ └─────────┘ │
└──────────────────────────────────────────────────────┘
```

**MTTP** (Mean Time To Patch) is calculated from the delta between a patch appearing in the catalog and it being successfully installed on all targeted nodes. It's your fleet's "patch velocity" metric.

Compliance is per-node: `(installed_approved_patches / total_approved_patches) * 100`. A node at 100% has every approved patch installed. A node at 0% is... concerning.

The deployment results are tracked per-node:

```sql
CREATE TABLE patch_deployment_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deployment_id UUID REFERENCES patch_deployments(id),
    node_id TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    installed_at TIMESTAMP,
    reboot_required BOOLEAN DEFAULT FALSE,
    error_message TEXT
);
```

---

## 🤯 The Config That Broke Everything

Fun story: when we first deployed the agent on SQLSERVER1, the `patch_install` job sat in `queued` forever. The agent was online, polling happily... but only for terminal commands, not jobs.

Turns out the agent has **two configuration domains**:

```json
{
  "GatewayUrl": "http://server:18789",     // For remote access (terminal, screen, shell)
  "GatewayToken": "...",                   
  "InventoryApiUrl": "http://server:8080",  // For inventory, jobs, patches, remediation
  "InventoryApiKey": "..."                  
}
```

If you only set the Gateway fields (which the installer does by default), you get remote access but **no job polling, no patch scanning, no inventory push**. The `JobPoller` explicitly checks for `InventoryApiUrl` before starting:

```csharp
// Wait for inventory config to be ready
while (!stoppingToken.IsCancellationRequested)
{
    var config = ServiceConfig.Load();
    if (!string.IsNullOrEmpty(config.InventoryApiUrl) 
        && !string.IsNullOrEmpty(config.InventoryApiKey))
    {
        break;  // ✅ Config found, start polling
    }
    await Task.Delay(5000, stoppingToken);  // 🔄 Keep waiting...
}
```

No `InventoryApiUrl`? The JobPoller sits in that loop forever, politely waiting. The terminal poller works fine because it uses the Gateway URL. Two different config paths, two different behaviors.

We've since updated the [Agent Setup Guide](https://github.com/BenediktSchackenberg/octofleet/blob/main/docs/AGENT-SETUP.md) to make this crystal clear. Both fields are marked as **required** now.

---

## 🆚 Why Not Just Use WSUS?

Fair question. Here's the honest comparison:

| Feature | WSUS | Octofleet |
|---------|------|-----------|
| Setup | GPO + IIS + SQL Server | Docker Compose |
| Targeting | GPO-based (pain) | Group-based (clicks) |
| Approval | UI from 2006 | Modern dark mode UI |
| Rings | Manual | Built-in phased rollout |
| Reboot Control | GPO | Per-deployment policy |
| Compliance | WSUS Reports | Real-time dashboard |
| Agent | Windows Update Client | Our own (.NET 8, 20MB) |
| Remediation | None | Auto-remediate vulns |
| 3rd Party | Nope | Winget + custom scripts |
| Cost | Free (+ your sanity) | Free (+ your sanity stays) |

The key difference: **Octofleet patches are just another job type**. The same infrastructure that runs scripts, installs packages, and remediates vulnerabilities also handles Windows Updates. One agent, one API, one dashboard.

---

## 🛣️ What's Next

We're not done. The current patch system is solid for targeted deployments, but there's more coming:

- **Automatic approval rules** — "Auto-approve all Critical security patches after 72h in Ring 0"
- **Maintenance windows** — "Only install between 02:00-06:00 UTC on Saturdays"
- **Rollback detection** — If a patch breaks something, flag it across the fleet
- **Third-party patch catalog** — Chrome, Firefox, Adobe, Java — everything through the same pipeline
- **MTTP trending** — Track your patching speed over time

---

## 🎯 TL;DR

Octofleet's patch management:
1. **Agents scan** for missing updates via WUA COM API (every 6h)
2. **Catalog grows** automatically from agent discoveries
3. **Admins approve/exclude** patches in the web UI
4. **Deployments target rings** (ring → group → nodes)
5. **Jobs are created** per-node, picked up by agent's JobPoller
6. **PatchInstaller** uses WUA COM to download + install the specific KB
7. **Results flow back** to update compliance and deployment status

No WSUS. No GPO. No tears. Just HTTP, JSON, and a .NET agent that knows how to talk to Windows Update.

The full source is on [GitHub](https://github.com/BenediktSchackenberg/octofleet) — MIT licensed, as always. Star it if you think Windows patching shouldn't require a PhD 🎓

---

*Got questions? Found a bug? [Open an issue](https://github.com/BenediktSchackenberg/octofleet/issues) — we actually respond to those.* 🐙
