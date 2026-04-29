---
layout: post
title: "Contained Availability Groups in SQL Server 2022: Finally, AG Gets Its Passport"
subtitle: "How SQL Server 2022 fixed the most annoying thing about Always On — and why you should care"
date: 2026-04-29
tags: [sql-server, high-availability, dba, always-on, sql-server-2022]
thumbnail-img: /assets/images/contained-ag-thumb.png
share-img: /assets/images/contained-ag-thumb.png
---

# Contained Availability Groups: Finally, the AG Got Its Own Passport

Picture this: You're a DBA. It's 2 AM. You're staring at a failed AG failover. The secondary just became primary, everything looks fine — except *nothing works*. Your logins are gone. Your SQL Agent jobs vanished. Your linked servers are missing. The application team is calling. The on-call manager is calling. Your cat is judging you.

Welcome to the pre-SQL Server 2022 experience with Always On Availability Groups.

But SQL Server 2022 brought something beautiful to fix this pain: **Contained Availability Groups**. Let's dig in.

---

## The Old Problem: AGs Were Basically Homeless

Traditional Availability Groups replicate your **user databases** brilliantly. Failover? Done. RPO near-zero? Done. Automatic failover? Absolutely.

But here's what they *didn't* replicate:

- **Logins** (stored in `master`, not in your AG databases)
- **SQL Agent Jobs** (stored in `msdb`, also not in your AG)
- **Linked Servers** (also `master`)
- **Database Mail profiles** (you guessed it — `msdb`)
- **Custom error messages** (`master` again)

Every time you failed over, your AG databases landed on the secondary perfectly intact — but completely stranded, like a tourist who arrived in a foreign country without their wallet, phone, or pants.

DBAs developed elaborate workarounds: manual login sync scripts, Ola Hallengren job copies, PowerShell automation, prayers to the SQL Server gods. Some of us wrote `sp_help_revlogin` so many times we can recite it in our sleep.

There had to be a better way.

---

## Enter: Contained Availability Groups

SQL Server 2022 introduced **Contained Availability Groups** — a feature that gives your AG its own, self-contained system metadata. Think of it as giving the AG its own passport, its own wallet, and yes, its own pants.

### What Does "Contained" Actually Mean?

A Contained AG creates a **contained `master` and `msdb`** database *within the AG itself*. These AG-local system databases travel with the AG when it fails over.

This means:
- ✅ **Logins** — replicated within the AG
- ✅ **SQL Agent Jobs** — replicated within the AG  
- ✅ **Database Mail** — replicated within the AG
- ✅ **Custom error messages** — replicated within the AG
- ✅ **Linked servers** — replicated within the AG

When you fail over, *everything comes with it*. No more 2 AM panic. No more sync scripts. Your secondary becomes primary and applications just... work.

---

## How It Works Under the Hood

When you create a Contained AG, SQL Server creates special system databases that are part of the AG:

```sql
-- Creating a Contained Availability Group
CREATE AVAILABILITY GROUP [MyContainedAG]
WITH (
    CLUSTER_TYPE = WSFC,
    CONTAINED              -- This is the magic word
)
FOR DATABASE [YourDatabase]
REPLICA ON
    N'Node1' WITH (
        ENDPOINT_URL = N'TCP://Node1.domain.com:5022',
        AVAILABILITY_MODE = SYNCHRONOUS_COMMIT,
        FAILOVER_MODE = AUTOMATIC
    ),
    N'Node2' WITH (
        ENDPOINT_URL = N'TCP://Node2.domain.com:5022',
        AVAILABILITY_MODE = SYNCHRONOUS_COMMIT,
        FAILOVER_MODE = AUTOMATIC
    );
```

The `CONTAINED` keyword is doing a *lot* of heavy lifting there. Behind the scenes, SQL Server creates:

- `master_<AG_Name>` — the AG-local master database
- `msdb_<AG_Name>` — the AG-local msdb database

These are replicated as part of the AG, just like your user databases.

### Connecting to the Contained Context

To manage objects *inside* the contained AG (logins, jobs, etc.), you connect via the **AG listener** — not directly to the instance:

```sql
-- Connect via the AG listener to work in the contained context
-- This creates a login INSIDE the AG, not on the instance
USE [master]
GO

CREATE LOGIN [AppServiceAccount]
WITH PASSWORD = N'SuperSecurePassword123!',
     DEFAULT_DATABASE = [YourDatabase];
GO

-- Grant database access
USE [YourDatabase]
GO
CREATE USER [AppServiceAccount] FOR LOGIN [AppServiceAccount];
GO
```

When connected through the listener, SQL Server knows you're working in the contained AG context and creates the login in the AG-local `master` — not the instance-level `master`.

---

## The Practical Advantages (or: Why Your 2 AM Self Will Thank You)

### 1. Zero-Script Failover — For Real This Time

Before Contained AGs, "seamless failover" was a marketing term that DBAs read with a knowing smirk. Yes, the data failed over. But then you had to run scripts to sync logins, re-create jobs, fix linked servers...

With Contained AGs, failover is actually seamless. The AG listener points to the new primary, and everything — logins, jobs, all of it — is right there waiting.

### 2. Disaster Recovery Just Got Way Simpler

Remember setting up DR? You had a 47-page runbook that included:
- Sync logins (Step 12)
- Re-create SQL Agent jobs (Step 23)
- Update linked server passwords (Step 31)
- Hope you didn't forget anything (Step 47)

With Contained AGs, your DR runbook for the AG-related stuff is basically:
1. Fail over
2. That's it

Your junior DBA can do it. *At 2 AM.* Without calling you.

### 3. Multi-Instance Cleanliness

In environments with multiple SQL Server instances and multiple AGs, Contained AGs give you **isolation**. The logins and jobs for AG-A don't bleed into the instance-level configuration for AG-B. Each AG carries exactly what it needs.

This is particularly useful in:
- **Shared hosting** environments (multiple customer AGs on the same instances)
- **Cloud migrations** — each AG is self-sufficient and portable
- **Multi-tenant architectures** — tenant A's stuff stays with tenant A

### 4. Easier Cloud and Container Migrations

Moving a traditional AG to Azure SQL MI, or containerizing SQL Server? You had to script out and re-apply all the instance-level objects at the destination.

With a Contained AG, the AG is much more self-sufficient. Less to reconstruct, less to forget, less to break.

---

## What's NOT Covered (Keep Your Expectations Realistic)

Let's be honest — Contained AGs don't solve *everything*:

| Still replicated by Contained AG | Still on-your-own |
|----------------------------------|-------------------|
| Logins (AG-local) | Instance-level logins (for things outside the AG) |
| SQL Agent Jobs (AG-local) | Instance configuration (sp_configure, etc.) |
| Database Mail profiles | Startup procedures |
| Linked servers (AG-local) | SSIS packages in msdb (instance-level) |
| Custom error messages | Certificates/keys not in the AG |

The instance-level `master` and `msdb` still exist. The Contained AG gives you AG-local versions *in addition to* the instance-level ones. Objects that need to work at the instance level (like startup procs) still need manual sync.

Also worth noting: you **cannot convert an existing AG** to a Contained AG directly. It's a create-new, migrate-to affair. Plan accordingly.

---

## Contained AG vs. Traditional AG: Quick Comparison

| Feature | Traditional AG | Contained AG |
|---------|---------------|--------------|
| User database replication | ✅ | ✅ |
| Login replication | ❌ (manual sync) | ✅ |
| SQL Agent job replication | ❌ (manual sync) | ✅ |
| Database Mail profiles | ❌ (manual sync) | ✅ |
| Linked servers | ❌ (manual sync) | ✅ |
| Failover complexity | Medium–High | Low |
| Convert existing AG | N/A | ❌ (new AG required) |
| SQL Server version | 2012+ | 2022+ |

---

## Should You Use It?

**Yes, if:**
- You're on SQL Server 2022 (obviously)
- You're tired of maintaining login sync scripts
- You have multiple DBA-less teams that need to do failovers
- You're building new AG topologies from scratch
- You're in a multi-tenant or shared hosting scenario

**Wait, if:**
- You have a heavily customized instance-level setup that's hard to untangle
- You're mid-migration and can't afford the disruption of rebuilding AGs

**No, if:**
- You're still on SQL Server 2019 or older (upgrade first, then revisit)

---

## The Bottom Line

Contained Availability Groups in SQL Server 2022 fix a problem that's been annoying DBAs since Always On was introduced in SQL Server 2012. Ten years of sync scripts, login drift, and 2 AM "where did my jobs go?" incidents — finally addressed with a single `CONTAINED` keyword.

It's not magic. It doesn't replicate *everything*. But for the most common failover pain points — logins, jobs, mail profiles — it's a genuine quality-of-life improvement that your future self (especially your 2 AM future self) will deeply appreciate.

Now if only someone could fix the AG dashboard in SSMS. But that's a blog post for another day. 😅

---

*Have questions about Contained AGs or want to share your Always On war stories? Connect on [LinkedIn](https://linkedin.com/in/benedikt-schackenberg-b7422338b) — I collect SQL Server disaster recovery tales like trading cards.*
