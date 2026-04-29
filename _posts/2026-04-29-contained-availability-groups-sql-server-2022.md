---
layout: post
title: "Contained Availability Groups in SQL Server 2022: Less Manual Work After Failover"
subtitle: "What actually changes operationally, what the limits are, and a few things Microsoft buries in the docs"
date: 2026-04-29
tags: [sql-server, high-availability, dba, always-on, sql-server-2022]
thumbnail-img: /assets/images/contained-ag-thumb.png
share-img: /assets/images/contained-ag-thumb.png
---

Anyone who has managed Always On Availability Groups in production knows the drill: you set up the AG, configure synchronous replication, test failover — and then spend the next hour making sure both instances have the same logins, the same Agent jobs, the same linked servers. Because those live in `master` and `msdb` at the instance level, and the AG doesn't touch them.

It works, but it's overhead. And it's the kind of thing that bites you at the worst possible moment: you fail over, the database comes online cleanly on the secondary, and then something downstream breaks because a login or a job isn't where it's expected to be.

Contained Availability Groups in SQL Server 2022 address this directly. Here's what they do, where they help, and where the limits are.

---

## The Core Idea

A Contained AG includes AG-local versions of `master` and `msdb`. When you create the AG with the `CONTAINED` option, SQL Server creates two additional databases that replicate as part of the AG:

- `[AG_Name]_master` — AG-local master context
- `[AG_Name]_msdb` — AG-local msdb context

Objects you create through the AG listener — logins, Agent jobs, DB Mail profiles, linked servers — are stored in these AG-local databases, not in the instance-level system databases. They replicate to all replicas automatically and fail over with the AG.

The syntax is straightforward:

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

To create objects in the contained context, connect via the AG listener rather than directly to the instance:

```sql
-- Via the listener: creates the login in [ContainedAG]_master, not instance master
CREATE LOGIN [app_svc]
    WITH PASSWORD    = N'...',
    DEFAULT_DATABASE = [YourDatabase];
```

---

## What This Fixes in Practice

**Login and job consistency after failover.** The most immediate benefit. Logins and Agent jobs created through the listener are present on all replicas from the moment they're created. No post-failover sync step, no script to remember to run.

In practice this matters most in a few scenarios: unplanned failovers where there's no time for manual steps, DR drills where you want a clean test without post-failover remediation, and environments where the secondary might be managed by a different team that doesn't have visibility into instance-level object history.

**Simpler DR site setup.** When you stand up a new DR replica, the AG-local objects come along with the replication. You don't need a parallel process to bring the secondary up to parity on logins and jobs — at least for objects scoped to the AG.

**Better isolation in multi-AG environments.** On instances running multiple AGs — which is common in consulting work or shared infrastructure — Contained AGs let each AG carry its own login and job context. A login created for one AG doesn't need to exist at the instance level, which reduces the risk of configuration drift across AGs over time.

---

## Limitations Worth Knowing

**SQL Agent jobs run on the primary only.** This is documented but easy to miss. Even though Agent jobs replicate to all replicas in the contained context, they execute only on whichever replica is currently primary. If you have jobs with logic that assumes they're running on a specific node, that's worth checking before you migrate.

**Not a security boundary.** Microsoft is explicit about this. Contained AGs are a configuration consistency mechanism, not an isolation layer. An instance-level sysadmin can still access data in contained AG databases. Don't design multi-tenant security architecture around this feature.

**No in-place conversion from traditional AG.** There's no `ALTER AVAILABILITY GROUP ... ADD CONTAINED`. If you want to move an existing AG to a contained one, you create a new AG and migrate your databases into it. Worth accounting for in upgrade planning, especially if you have a large number of databases or complex Agent job configurations to recreate.

**Instance-level objects are still separate.** The AG-local system databases coexist with the instance-level `master` and `msdb` — they don't replace them. Anything that needs to work at the instance level (startup procedures, server-scoped configurations via `sp_configure`, certificates, instance-wide linked servers) still needs to be managed independently on each replica.

**Not all msdb objects are covered.** SSIS packages stored in msdb, certain maintenance plan metadata, and some system-managed jobs are not replicated. It's worth auditing what you have in msdb before assuming everything will come along.

---

## Reference: What Replicates and What Doesn't

| Object | Traditional AG | Contained AG |
|---|---|---|
| User database data | ✓ | ✓ |
| Logins (AG-scoped) | Manual sync required | ✓ Replicated via listener |
| SQL Agent jobs (AG-scoped) | Manual sync required | ✓ Replicated, primary only |
| DB Mail profiles | Manual sync required | ✓ Replicated via listener |
| Linked servers (AG-scoped) | Manual sync required | ✓ Replicated via listener |
| Instance configuration | Manual sync required | Still manual |
| Startup procedures | Manual sync required | Still manual |
| SSIS packages in msdb | Manual sync required | Not covered |
| Security boundary | No | No |
| Minimum SQL version | 2012 | 2022 |

---

## When It Makes Sense to Use It

Contained AGs are worth using when you're building new AG topologies on SQL Server 2022 and want login and job consistency handled at the infrastructure level rather than through scripts. The operational simplification is real, particularly for failover scenarios and DR environments.

They're less useful if your workload relies heavily on instance-level customization that falls outside the contained context, or if you need to keep the same AG topology working across mixed SQL Server versions.

For existing environments: if your current login sync process is reliable and well-tested, the disruption of rebuilding AGs may not be worth it immediately. But for new deployments, the contained option is the cleaner default.

---

*I've been running AlwaysOn clusters in production for several years across logistics, banking, and healthcare environments. If you have questions or edge cases to discuss, [LinkedIn](https://linkedin.com/in/benedikt-schackenberg-b7422338b) is the best place to reach me.*
