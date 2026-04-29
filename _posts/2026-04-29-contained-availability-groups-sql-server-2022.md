---
layout: post
title: "Contained Availability Groups in SQL Server 2022: Reducing Failover Drift and Manual Sync Work"
subtitle: "What changes operationally, what the limits are, and what Microsoft buries in the docs"
date: 2026-04-29
tags: [sql-server, high-availability, dba, always-on, sql-server-2022]
thumbnail-img: /assets/images/contained-ag-thumb.png
share-img: /assets/images/contained-ag-thumb.png
---

In classic Always On Availability Groups, user databases are replicated — but many instance-level objects are not. Logins, SQL Agent jobs, linked servers, Database Mail configuration: all of these live in `master` or `msdb` at the instance level, outside the AG's replication scope. In practice, this gap tends to surface at the worst possible moment — during a failover or a DR test, when the database is online but something that depends on those objects isn't working.

The standard approach has been to keep those objects in sync manually: scripts, scheduled jobs, documentation that someone eventually stops updating. It works until it doesn't.

Contained Availability Groups in SQL Server 2022 address this directly. Here's how they work, what they solve, and where the boundaries are.

---

## How It Works

A Contained AG maintains AG-local versions of the system databases. When the AG is created with the `CONTAINED` option, SQL Server creates two additional databases that replicate as part of the AG:

- `[AG_Name]_master` — AG-local master context
- `[AG_Name]_msdb` — AG-local msdb context

For example, an AG named `ContainedAG` would have `ContainedAG_master` and `ContainedAG_msdb`.

Logins, Agent jobs, DB Mail profiles, and linked servers that you create through the AG listener are stored in these AG-local databases — not in the instance-level system databases. They replicate to all replicas and fail over with the AG.

```sql
CREATE AVAILABILITY GROUP [ContainedAG]
WITH (
    CLUSTER_TYPE = WSFC,
    CONTAINED
)
FOR DATABASE [YourDatabase]
REPLICA ON
    N'Node1' WITH (
        ENDPOINT_URL      = N'TCP://node1.domain.local:5022',
        AVAILABILITY_MODE = SYNCHRONOUS_COMMIT,
        FAILOVER_MODE     = AUTOMATIC,
        SEEDING_MODE      = AUTOMATIC
    ),
    N'Node2' WITH (
        ENDPOINT_URL      = N'TCP://node2.domain.local:5022',
        AVAILABILITY_MODE = SYNCHRONOUS_COMMIT,
        FAILOVER_MODE     = AUTOMATIC,
        SEEDING_MODE      = AUTOMATIC
    );
```

To create objects in the contained context, connect through the AG listener — not directly to the instance. Objects created via the listener land in the AG-local system databases:

```sql
-- Creates the login in ContainedAG_master, not instance-level master
CREATE LOGIN [app_svc]
    WITH PASSWORD    = N'...',
    DEFAULT_DATABASE = [YourDatabase];
```

---

## What Changes Operationally

**Login and job consistency after failover.** This is the core benefit. Logins and Agent jobs created through the listener exist on all replicas from the start. There's no post-failover sync step. In environments where failovers have historically required follow-up work on instance-level objects, this removes a significant chunk of that manual overhead.

**DR site setup is simpler.** When a new replica joins the AG, AG-local objects come along with replication. You don't need a separate synchronization process for logins and jobs that belong to the AG's scope.

**Cleaner object isolation in multi-AG environments.** On instances running several AGs — common in shared infrastructure or consulting setups — each Contained AG carries its own login and job context. Objects for one AG don't need to exist at the instance level, which reduces configuration drift across AGs over time.

---

## Limitations

**SQL Agent jobs run on the primary only.** Agent jobs replicate to all replicas in the contained context, but they execute only on the current primary. If your jobs have any node-specific assumptions, review them before migrating.

**Contained AGs are not a security boundary.** Microsoft is explicit about this. The AG-local system databases are a configuration consistency mechanism — not an isolation layer. Instance-level sysadmin access still reaches the AG databases. Building a multi-tenant security model around Contained AGs is not supported and not safe.

**No in-place conversion from a traditional AG.** There is no `ALTER AVAILABILITY GROUP ... ADD CONTAINED`. Converting an existing AG means creating a new Contained AG and migrating databases into it. This is worth planning carefully if you have many databases or complex Agent job configurations.

**Instance-level objects remain separate.** The AG-local `[AG_Name]_master` and `[AG_Name]_msdb` exist alongside the instance-level system databases — they don't replace them. Startup procedures, server-scoped configuration (`sp_configure`), instance-wide linked servers, and certificates not scoped to the AG still need to be managed independently on each replica.

**Not all msdb objects are covered.** SSIS packages stored in msdb, certain maintenance plan metadata, and some system-managed jobs do not replicate. Audit your msdb contents before assuming everything will be included.

---

## Object Replication: What's Covered

| Object | Traditional AG | Contained AG |
|---|---|---|
| User database data | Replicated | Replicated |
| Logins (AG-scoped) | Manual sync | Replicated via listener |
| SQL Agent jobs (AG-scoped) | Manual sync | Replicated; primary only |
| DB Mail profiles | Manual sync | Replicated via listener |
| Linked servers (AG-scoped) | Manual sync | Replicated via listener |
| Instance configuration | Manual sync | Still manual |
| Startup procedures | Manual sync | Still manual |
| SSIS packages in msdb | Manual sync | Not covered |
| Security boundary | No | No |
| Minimum version | SQL Server 2012 | SQL Server 2022 |

---

## When to Use It

Contained AGs make the most sense for new deployments on SQL Server 2022 where you want login and job consistency handled at the infrastructure level rather than through scripts. The benefit is most visible in environments with frequent failovers, regular DR testing, or teams where multiple people manage the secondary replicas.

For existing environments: if your current sync process is reliable and tested, rebuilding the AG as a contained one carries real disruption. It's not necessarily worth doing mid-cycle. For greenfield setups, there's little reason not to use it.

---

*I work as a database architect and consultant across logistics, banking, and healthcare environments — AlwaysOn clusters are a recurring topic. Feedback or questions: [LinkedIn](https://linkedin.com/in/benedikt-schackenberg-b7422338b).*
