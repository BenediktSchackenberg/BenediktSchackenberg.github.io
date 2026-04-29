---
layout: post
title: "SQL Server 2022 Contained Availability Groups: What Actually Changes for DBAs"
subtitle: "A hands-on look at what Contained AGs solve, what they don't, and where the caveats are"
date: 2026-04-29
tags: [sql-server, high-availability, dba, always-on, sql-server-2022]
thumbnail-img: /assets/images/contained-ag-thumb.png
share-img: /assets/images/contained-ag-thumb.png
---

If you've been running SQL Server Always On Availability Groups for a while, you probably have a script somewhere that syncs logins between replicas. Maybe it's Ola Hallengren's, maybe it's something you wrote at midnight after a failover left your application users locked out. Either way — Contained Availability Groups in SQL Server 2022 are meant to fix exactly that class of problem.

Here's what they actually do, what the limitations are, and a few things worth knowing before you build on them.

---

## The Problem They Solve

Traditional AGs replicate user databases. What they don't replicate is anything that lives in `master` or `msdb` at the instance level:

- SQL Server logins
- SQL Agent jobs
- Database Mail profiles and accounts
- Linked server definitions
- Custom error messages

This matters because after a failover, the new primary has your databases intact — but if the secondary never had the logins or jobs set up independently, things break. The standard answer has always been: keep your instance-level objects in sync manually, or with a script, or with a third-party tool.

It works, but it's overhead. You have to remember to run the sync after every change. And in disaster recovery scenarios where you're failing over to a completely separate environment, the list of things to recreate gets long fast.

---

## What Contained AGs Do Differently

A Contained AG includes its own AG-local system databases. When you create the AG with the `CONTAINED` option, SQL Server creates two additional databases that are replicated as part of the AG:

- `[AG_Name]_master` — the AG-local master context
- `[AG_Name]_msdb` — the AG-local msdb context

Logins, Agent jobs, DB Mail configuration and other supported objects that you create via the AG listener are stored in these AG-local databases — not in the instance-level `master` or `msdb`. When the AG fails over, these databases fail over with it.

The syntax for creating one:

```sql
CREATE AVAILABILITY GROUP [ContainedAG]
WITH (
    CLUSTER_TYPE = WSFC,
    CONTAINED
)
FOR DATABASE [YourDatabase]
REPLICA ON
    N'Node1' WITH (
        ENDPOINT_URL     = N'TCP://node1.domain.local:5022',
        AVAILABILITY_MODE = SYNCHRONOUS_COMMIT,
        FAILOVER_MODE    = AUTOMATIC,
        SEEDING_MODE     = AUTOMATIC
    ),
    N'Node2' WITH (
        ENDPOINT_URL     = N'TCP://node2.domain.local:5022',
        AVAILABILITY_MODE = SYNCHRONOUS_COMMIT,
        FAILOVER_MODE    = AUTOMATIC,
        SEEDING_MODE     = AUTOMATIC
    );
```

To work in the contained context, you connect via the **AG listener** — not directly to the instance. Objects created through the listener land in the AG-local system databases.

```sql
-- Connect via the listener, then create a login in the contained context
CREATE LOGIN [app_user]
    WITH PASSWORD = N'...',
    DEFAULT_DATABASE = [YourDatabase];
```

---

## Practical Advantages

**Failover consistency.** The clearest benefit: logins and Agent jobs that were created through the listener are present on both replicas automatically. No post-failover sync step, no manual script run.

**Cleaner DR setup.** When you're setting up a DR site, the AG-local objects come along with the replication. You don't need a separate process to bring the secondary up to parity on instance-level objects — at least for the objects that are scoped to the AG.

**Isolation in multi-AG environments.** If you're running multiple AGs on the same instances — common in consulting or shared infrastructure scenarios — Contained AGs let each AG carry its own context. A login created for AG-A doesn't need to exist at the instance level, reducing the risk of cross-AG credential drift.

---

## What You Need to Know (The Less Obvious Parts)

**Contained AGs are not a security boundary.** Microsoft is explicit about this. The AG-local context is for configuration consistency, not isolation. It doesn't prevent a sysadmin-level login on the instance from accessing data in the AG databases. Don't design a multi-tenant security model around this feature.

**You can't convert an existing AG.** There's no `ALTER AVAILABILITY GROUP ... ADD CONTAINED`. If you want to move an existing AG to contained, you create a new one and migrate your databases to it. Worth factoring into upgrade planning.

**Instance-level objects still exist separately.** The AG-local `[AG_Name]_master` and `[AG_Name]_msdb` are *in addition to* the instance-level `master` and `msdb`, not instead of them. Startup procedures, instance-wide configurations (`sp_configure`), certificates and keys that aren't scoped to the AG — those still need to be managed independently on each replica.

**Not everything in msdb is covered.** Some msdb objects don't replicate. SSIS packages stored in msdb, maintenance plan metadata, and certain system jobs are examples that you'll want to verify for your specific workload.

---

## Quick Reference: Traditional vs. Contained AG

| Object | Traditional AG | Contained AG |
|---|---|---|
| User database data | Replicated | Replicated |
| SQL logins (AG-scope) | Manual sync | Replicated via listener |
| SQL Agent jobs (AG-scope) | Manual sync | Replicated via listener |
| DB Mail profiles | Manual sync | Replicated via listener |
| Linked servers (AG-scope) | Manual sync | Replicated via listener |
| Instance config (sp_configure) | Manual sync | Still manual |
| Startup procedures | Manual sync | Still manual |
| Security boundary | No | No |
| Supported from | SQL Server 2012 | SQL Server 2022 |

---

## When It Makes Sense

Contained AGs are a solid choice when:

- You're building new AG topologies on SQL Server 2022 and don't want to inherit the login-sync problem from the start
- You have environments where failovers need to be clean without post-failover manual steps (DR drills, for example)
- You're running multiple AGs on shared infrastructure and want object isolation per AG

It's less useful if you're heavily invested in instance-level customization that falls outside what the contained context covers, or if you need to support SQL Server versions prior to 2022 across your replicas.

---

## Bottom Line

Contained Availability Groups remove a well-known operational gap in Always On setups. The implementation is clean — a single keyword at AG creation time, and from that point logins and jobs created through the listener travel with the AG.

The caveats are real but manageable: it's not a security boundary, it doesn't cover every msdb object, and instance-level configuration still needs separate attention. But for the core use case of login and Agent job consistency across failover, it does what it says.

If you're spinning up new AGs on SQL Server 2022, there's little reason not to use it.

---

*Running Always On in production and have questions or edge cases worth discussing? [LinkedIn](https://linkedin.com/in/benedikt-schackenberg-b7422338b) or open an issue on any of my projects — always happy to talk shop.*
