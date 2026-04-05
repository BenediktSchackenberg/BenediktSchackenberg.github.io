---
layout: post
title: "Upgrading to SQL Server 2022: Paths, Pitfalls, and Best Practices"
subtitle: "A practical guide to in-place upgrades, side-by-side migrations, and Always On rolling upgrades — with everything you need to know before you start."
date: 2026-04-05
tags: [sql-server, sql-server-2022, upgrade, migration, dba, mssql, always-on, on-premises]
author: Benedikt Schackenberg
---

SQL Server 2022 (internal version 16.x) is the most feature-rich release Microsoft has shipped in years — better Azure integration, improved Query Store defaults, ledger tables, and performance improvements that actually matter in production. If you're still running SQL Server 2014, 2016, or 2019, the upgrade is worth doing. The question is how.

This post covers what you need to know: supported upgrade paths, the three main methods, Always On rolling upgrades, and what to check before you touch anything in production.

## Supported Source Versions

Not every version can upgrade directly to SQL Server 2022. According to Microsoft's official documentation, in-place upgrades are supported from:

| Source Version | Minimum Build Required |
|---|---|
| SQL Server 2012 | SP4 or later |
| SQL Server 2014 | SP3 or later |
| SQL Server 2016 | SP3 or later |
| SQL Server 2017 | Any RTM or later |
| SQL Server 2019 | Any RTM or later |

If you're on SQL Server 2008 or 2008 R2, you **cannot** upgrade directly — you'll need to go via an intermediate version (e.g., 2014 or 2016) first. Same if you're on SQL Server 2012 SP3 or lower: get to SP4 before you attempt anything.

Also worth noting: SQL Server 2022 is **64-bit only**. If you're still running a 32-bit SQL Server instance (unlikely in 2026, but it happens in legacy environments), you can't do an in-place upgrade. You'll need to restore databases to a fresh 64-bit installation and recreate all logins manually.

## Before You Touch Anything: The Checklist

Every DBA has a story about an upgrade that went sideways because someone skipped the prep work. Here's what actually matters:

**1. Get sign-off from the application vendor.**
This is the step most people skip and then regret. Before you upgrade the SQL Server, confirm that your application supports SQL Server 2022. Some ISVs are slow to certify new versions, and you don't want to find out post-upgrade that your ERP system throws errors.

**2. Check OS compatibility.**
SQL Server 2022 requires Windows Server 2019 or later. If you're running Windows Server 2016, you're still fine. Windows Server 2012 R2? You'll need to upgrade the OS first — or migrate to new hardware.

**3. No pending restarts.**
SQL Server Setup will block the upgrade if Windows has a pending restart. Check with `Get-PendingReboot` (from the `PendingReboot` module) or just reboot before you start.

**4. Full backups — and verify them.**
This sounds obvious, but verify that your backups actually restore. A backup you haven't tested is not a backup.

```sql
-- Check last backup dates for all user databases
SELECT 
    d.name,
    MAX(b.backup_finish_date) AS last_full_backup,
    DATEDIFF(HOUR, MAX(b.backup_finish_date), GETDATE()) AS hours_since_backup
FROM sys.databases d
LEFT JOIN msdb.dbo.backupset b 
    ON d.name = b.database_name AND b.type = 'D'
WHERE d.database_id > 4
GROUP BY d.name
ORDER BY last_full_backup ASC;
```

**5. Check database compatibility levels.**
Post-upgrade, your databases will keep their existing compatibility level. You should plan to raise them — but not on upgrade day. Raise them in a maintenance window after you've confirmed everything works.

```sql
-- Current compatibility levels
SELECT name, compatibility_level FROM sys.databases ORDER BY name;

-- SQL Server 2022 native level is 160
-- SQL Server 2019 = 150, 2017 = 140, 2016 = 130
```

**6. Run the Database Experimentation Assistant (DEA) or Query Store.**
If you're going from 2016 or later, enable Query Store before the upgrade, let it collect a workload baseline, then compare after the compatibility level change. DEA does this comparison automatically and flags query regressions.

**7. Disable Auto-Failover (if Always On).**
More on this below.

---

## The Three Upgrade Methods

### Method 1: In-Place Upgrade

The simplest path. You run SQL Server 2022 Setup on the existing server, it replaces the binaries, upgrades the system databases, and you're done. IP address, instance name, and port don't change — applications don't need to be reconfigured.

**Pros:**
- Fast (downtime is typically 15–45 minutes, independent of database size)
- No application reconfiguration
- Logins, jobs, and linked servers are preserved automatically

**Cons:**
- If something goes wrong, rollback means restoring from backup (time-consuming)
- You can't add new features during the upgrade; you have to run Setup again afterward
- Not supported for 32-bit instances or cross-platform upgrades

**When to use it:** When you have a maintenance window, a solid backup, and a relatively straightforward environment without custom components that might conflict.

### Method 2: Side-by-Side Migration (New Server)

You set up a fresh SQL Server 2022 instance on new hardware (or a new VM), then migrate databases using backup/restore or detach/attach, recreate logins, and reconfigure your application to point at the new server.

```powershell
# dbatools makes this significantly easier
# Copy all user databases from old to new server
Copy-DbaDatabase -Source OLDSQLSERVER -Destination NEWSQLSERVER2022 `
    -Database (Get-DbaDatabase -SqlInstance OLDSQLSERVER -ExcludeSystem).Name `
    -BackupRestore -SharedPath \\fileserver\backup -WithReplace

# Sync logins (including passwords and SIDs)
Copy-DbaLogin -Source OLDSQLSERVER -Destination NEWSQLSERVER2022

# Copy SQL Agent jobs
Copy-DbaAgentJob -Source OLDSQLSERVER -Destination NEWSQLSERVER2022
```

**Pros:**
- Clean installation on new hardware
- Easy rollback (old server still exists)
- Opportunity to consolidate or change hardware specs

**Cons:**
- Application connection strings must be updated (or DNS aliasing used)
- Takes longer, especially for large databases
- More operational complexity

**When to use it:** When you're also replacing hardware, when rollback safety is paramount, or when your environment has grown significantly since the last SQL Server install.

### Method 3: Rolling Upgrade with Always On Availability Groups

If you're running Always On AGs, you can upgrade with near-zero downtime. The approach works because SQL Server supports mixed-version AGs during the upgrade window.

**The sequence:**

1. **Disable automatic failover** on all AG groups before you start.

2. **Upgrade secondary replicas first** — start with async secondaries, then sync secondaries. During this period, replication from primary to upgraded secondary still works (newer versions can receive from older primaries).

3. **Failover to an upgraded secondary.** Your primary is now on SQL Server 2022. The old primary becomes a secondary.

4. **Upgrade the remaining replicas** (including what was the original primary).

5. **Re-enable automatic failover.**

Important caveat: while the primary is still on the old version and a secondary has been upgraded to 2022, you temporarily lose the ability to failover back to the old-version secondary. Plan your maintenance window accordingly.

```sql
-- Check AG synchronization state before and during upgrade
SELECT 
    ag.name AS ag_name,
    ar.replica_server_name,
    ars.role_desc,
    ars.synchronization_health_desc,
    ars.last_redone_time
FROM sys.availability_groups ag
JOIN sys.availability_replicas ar ON ag.group_id = ar.group_id
JOIN sys.dm_hadr_availability_replica_states ars ON ar.replica_id = ars.replica_id;
```

---

## After the Upgrade: Don't Forget the Compatibility Level

This is the most commonly skipped step post-upgrade. Your databases are now running on SQL Server 2022 but still operating at their old compatibility level — which means they don't benefit from new query optimizer improvements, better cardinality estimator behavior, or features like Parameter Sensitive Plan optimization (new in 2022).

**Do this in a separate maintenance window, after you've confirmed stability:**

```sql
-- Step 1: Enable Query Store to capture baseline before changing compat level
ALTER DATABASE YourDatabase SET QUERY_STORE = ON;
ALTER DATABASE YourDatabase SET QUERY_STORE (OPERATION_MODE = READ_WRITE);

-- Step 2: Change compatibility level
ALTER DATABASE YourDatabase SET COMPATIBILITY_LEVEL = 160;

-- Step 3: Monitor for regressions
-- If a query regresses, you can force the old plan via Query Store
-- or temporarily revert compat level while you investigate
```

Wait at least a week of production load at the new compatibility level before declaring the upgrade complete. Query Store will show you if any plan regressions happened.

---

## A Note on SQL Server 2022 Features Worth Using After Upgrade

Once you're fully on 2022 with compatibility level 160:

- **Parameter Sensitive Plan (PSP) optimization** — automatically creates multiple query plans for parameterized queries where a single plan performed poorly. This is a significant improvement for workloads with data skew.
- **Improved Query Store defaults** — enabled by default in new databases; includes read replica support.
- **Ledger tables** — tamper-evident tables backed by cryptographic hashes. Useful for compliance scenarios.
- **Azure Synapse Link** — if you have hybrid or Azure-connected scenarios.
- **S3-compatible object storage** for backup** — backup directly to any S3-compatible endpoint (MinIO, Cloudflare R2, etc.), not just Azure Blob.

---

## Why SQL Server Upgrades Really Fail (It's Not the Technology)

Here's something most upgrade guides won't tell you: the technical part is rarely where upgrades fall apart. The blockers are almost always organizational.

**Third-party software is the #1 real-world killer.** You've done everything right — backups, testing, maintenance window booked — and then you discover your ERP vendor hasn't certified SQL Server 2022 yet. Or your hospital information system (HIS) has a hardcoded SQL Server version check that throws an error on anything newer than 2016. These things exist in production, and they will surprise you if you don't check upfront.

Microsoft explicitly calls this out in their upgrade guidance: verify third-party compatibility *before* you start. This means contacting vendors, checking their compatibility matrices, and getting written confirmation. Don't rely on "it should work."

**Other common reasons upgrades fail in practice:**
- **Missing vendor sign-off** — upgrade happens, application breaks, vendor says "unsupported configuration, fix it yourself"
- **No staging environment** — first test of the upgraded stack is production
- **Incorrect expectations about downtime** — stakeholders weren't told there would be a maintenance window, causing last-minute cancellations
- **Forgotten dependencies** — linked servers, SSIS packages, Reporting Services, custom CLR assemblies that need recompilation
- **Skipped compatibility level raise** — databases upgraded but running with "handbrake on" at old compat level for months

The pattern is always the same: the SQL Server upgrade itself takes 20 minutes. The surrounding project work takes weeks.

---

## My Recommendation from the Field

If you ask me directly: **default to Side-by-Side migration over In-Place Upgrade**, especially in production environments.

Yes, in-place is faster and simpler on paper. But side-by-side gives you something that in-place doesn't: your old server still exists and still works. If something goes wrong post-migration — an application compatibility issue surfaces 48 hours later, a stored procedure behaves differently at the new compatibility level — you can fail back immediately without a restore.

The extra effort of a side-by-side migration (DNS alias switchover, migrating logins with dbatools) pays off the first time something unexpected happens. And in my experience, something unexpected happens on roughly one in three upgrades.

The one exception: if you're running Always On AGs, use the rolling upgrade method. It's the only approach that lets you maintain HA throughout the process.

---

## Quick-Reference Checklist

Print this out or put it in your runbook:

**Pre-Upgrade**
- [ ] Vendor compatibility confirmed (written, not verbal)
- [ ] OS version supported (Windows Server 2019+ for SQL 2022)
- [ ] No pending Windows restarts
- [ ] All databases in FULL recovery model
- [ ] Full backup taken and restore-tested
- [ ] Query Store enabled for baseline collection
- [ ] Maintenance window scheduled and communicated
- [ ] Rollback plan documented
- [ ] Auto-failover disabled (if Always On)

**During Upgrade**
- [ ] AG sync state verified before each replica upgrade (if rolling)
- [ ] System databases checked post-upgrade
- [ ] SQL Agent running
- [ ] Application smoke test completed

**Post-Upgrade**
- [ ] Compatibility level raised (in separate maintenance window)
- [ ] Query Store monitored for plan regressions (min. 1 week)
- [ ] Auto-failover re-enabled (if Always On)
- [ ] Documentation updated
- [ ] Old server decommissioned (not immediately — keep it for 2–4 weeks)

---

## Summary

| Method | Downtime | Rollback Complexity | Best For |
|---|---|---|---|
| In-Place Upgrade | 15–45 min | High (restore from backup) | Simple environments, maintenance windows |
| Side-by-Side | Hours (migration-dependent) | Low (old server intact) | Hardware refresh, maximum safety |
| Always On Rolling | Near-zero | Medium | HA environments, production-critical systems |

The upgrade itself is usually not the hard part. The preparation — vendor sign-off, OS compatibility, backup verification, baseline collection — is what determines whether the upgrade is a non-event or a weekend of fire-fighting.

If you're running SQL Server 2014 or older, the support lifecycle argument alone makes the upgrade mandatory: SQL Server 2014 exited Extended Support in July 2024. At this point you're running unsupported software in production.

Do the upgrade. Do it properly. And raise the compatibility level afterward.

---

*Questions or something to add? Open an issue or drop a comment below.*
