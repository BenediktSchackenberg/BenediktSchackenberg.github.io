---
layout: post
title: "When Your AI Assistant Can't Run Shell Commands: Debugging an OpenClaw v2026.3.31 Breaking Change"
subtitle: "A quiet config key that wasn't there — and how it broke exec for an entire morning."
date: 2026-04-01
tags: [openclaw, debugging, devops, ai-assistant, configuration, open-source]
author: Benedikt Schackenberg
---

Today was one of those mornings where everything looks fine until nothing works.

I was knee-deep in NemoClaw pull request reviews — fixing CodeRabbit feedback, guarding `registry.clearAll()` on successful gateway destroys, adding JSDoc coverage — when my AI assistant (Rainer, running on OpenClaw) suddenly stopped being able to run any shell commands.

Not some commands. *All* commands.

```
exec denied: allowlist miss
```

Every. Single. Time.

## What OpenClaw Is

[OpenClaw](https://openclaw.ai) is a self-hosted AI assistant runtime. You run it on your own server, connect it to Discord (or Signal, Telegram, etc.), and your AI assistant lives there — with access to your workspace, your repos, your tools. It's powerful precisely because it can actually *do things*, not just talk about doing things.

Which makes it particularly frustrating when it can't do things.

## The Symptom

Rainer (my OpenClaw assistant) was responding to messages just fine. Memory, reasoning, GitHub API calls via `web_fetch` — all working. But anything requiring `exec` — git commands, prettier, gh CLI, grep — was blocked:

```
exec denied: allowlist miss
```

I tried restarting the gateway. I tried `openclaw gateway restart`. I tried stop + start. Nothing helped. The error persisted across session restarts, across new sub-agents, across everything.

## The Hunt

After about two hours of back-and-forth (yes, two hours — the irony of an AI assistant that can't help you fix its own broken shell access is not lost on me), we found it.

OpenClaw v2026.3.31 introduced a breaking change:

> **"honor per-agent tools.exec defaults when no inline directive or session override is present"**

Before this update, the `tools.exec.security` config key was silently ignored if missing. After the update, it's actually enforced. And since it was never explicitly set in my config, it fell back to the built-in default: `allowlist` — a restrictive mode that blocks most exec calls.

The problem is documented in the [v2026.3.31 release notes](https://github.com/openclaw/openclaw/releases/tag/v2026.3.31), but it's easy to miss if you're not actively reading changelogs on every update.

## The Fix

One line in `~/.openclaw/openclaw.json`:

```json
"tools": {
  "exec": {
    "security": "full"
  }
}
```

That's it. Add that block, do a full gateway stop + start (not just restart — `restart` wasn't enough to pick up the change), and exec works again.

The full sequence that fixed it:

```bash
openclaw gateway stop
sleep 2
openclaw gateway start
```

## Why It Took So Long

A few things made this harder to debug than it should have been:

**1. The error message doesn't tell you what to do.**  
`exec denied: allowlist miss` accurately describes what happened, but gives you no hint about *why* the allowlist is in effect or how to change it. A message like "exec blocked by tools.exec.security=allowlist — set to 'full' to allow" would have cut debug time by 90%.

**2. The breaking change was behavioral, not syntactic.**  
The config file didn't break. OpenClaw still started fine. Everything looked normal. The change was that a previously-ignored config key now had real consequences — which is the hardest class of breaking change to notice.

**3. Sub-agents couldn't help.**  
When the main session can't exec, spawning sub-agents doesn't help — they inherit the same restriction. So you can't use your AI to debug the problem that's preventing your AI from working. Classic.

## What I Learned

If you're running OpenClaw and update to v2026.3.31 or later, **explicitly set `tools.exec.security`** in your config. Don't rely on the default. The recommended setting depends on your threat model:

- `"full"` — No restrictions. The assistant can run any shell command. Fine if you trust your setup and channel security.
- `"allowlist"` — Restricts to a pre-approved command list. More secure, but requires maintaining the list.
- `"deny"` — Blocks all exec. Useful for read-only or untrusted environments.

The relevant docs are at [docs.openclaw.ai](https://docs.openclaw.ai).

## The Silver Lining

Once exec was restored, we knocked out three NemoClaw PR reviews in about 20 minutes:

- **[#1245](https://github.com/NVIDIA/NemoClaw/pull/1245)** — guarded `registry.clearAll()` on successful gateway destroy (CodeRabbit: Major)
- **[#1246](https://github.com/NVIDIA/NemoClaw/pull/1246)** — added JSDoc coverage to all `runner.js` functions, pushing docstring coverage from 22% to 100%
- **[#1247](https://github.com/NVIDIA/NemoClaw/pull/1247)** — fixed a sneaky `"x" * 5000` → `NaN` bug in a regression test (JS string multiplication returns NaN, not a long string)

Not a bad morning's work — once the tools actually worked.

---

*Running OpenClaw on a local server and contributing to open source through Discord. If you hit similar issues, check the [release notes](https://github.com/openclaw/openclaw/releases) before assuming it's a config problem on your end.*
