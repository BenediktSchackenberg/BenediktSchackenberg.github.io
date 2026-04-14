---
layout: post
title: "NemoClaw: NVIDIA's Sandbox for AI Agents — and Why I Keep Contributing to It"
subtitle: "Tamper-evident audit logs, policy presets, and way too many rebases."
date: 2026-04-14
tags: [nemoclaw, nvidia, open-source, ai-safety, sandbox, contributing, security]
author: Benedikt Schackenberg
---

There's a specific kind of Saturday afternoon that goes like this: you open your laptop, tell yourself you'll just "quickly check one PR", and three hours later you're neck-deep in Rust serde internals because a field called `tool_policy` doesn't exist in OpenShell's schema and you've just found out the hard way.

That's NemoClaw. And I kind of love it.

## What Even Is NemoClaw?

Let me back up.

NemoClaw is NVIDIA's open-source project for running AI coding agents — Claude, GPT, whatever you prefer — inside isolated, hardened sandboxes. Think of it as "Docker, but specifically designed so the AI can't escape and delete your production database."

The core idea: when you give an AI agent access to your terminal, your files, and your APIs, you need guardrails. Not because AI is inherently malicious, but because AI is *confidently wrong* in ways that can be catastrophic. NemoClaw is the project that takes "here's a powerful model" and adds "...and here's exactly what it's allowed to touch."

**In concrete terms, NemoClaw lets you:**

- **Run AI coding agents** (Claude, GPT-4, local Ollama/vLLM models) in a sandboxed container — the agent can write code, run tests, make API calls, and open PRs, but can't touch anything outside its defined scope
- **Define network policies** — exactly which endpoints the agent can reach, with which HTTP methods, on which paths. Want the agent to use Slack but not be able to delete channels? One YAML stanza.
- **Use local or cloud inference** — NVIDIA NIM, vLLM, Ollama on your own hardware, or cloud providers. `nemoclaw onboard` walks you through the whole setup in minutes.
- **Isolate filesystem access** — Landlock-based enforcement means the agent can only read/write what you explicitly allow. Your SSH keys, your production configs, your secrets — not accessible.
- **Integrate with messaging** — Telegram, Slack, Discord. The agent can send you updates or accept instructions through these channels, with the same policy enforcement in place.
- **Automate enterprise workflows** — Jira, Outlook, GitHub. You configure the preset, the agent handles the repetitive work, and the policy layer makes sure it stays in its lane.

The project is built on top of OpenShell (NVIDIA's container runtime for AI workloads) and the OpenClaw agent framework. The CLI is TypeScript, the orchestration is Python, the policy files are YAML, and the hardening is... a lot of bash. A *lot* of bash.

## Why Do I Contribute in My Free Time?

Honest answer: because the problem is genuinely interesting.

Security for AI agents is not a solved problem. It's not even a well-framed problem yet. Most people are either in the "just let it rip and hope for the best" camp or the "don't give it any tools at all" camp. NemoClaw is trying to chart a path down the middle — maximum capability, minimum attack surface. That's hard engineering.

The second reason is more practical: I use this stuff. I run OpenClaw (the agent framework) on my own infrastructure, and NemoClaw is directly relevant to how those agents operate. When I fix a bug here, I'm also fixing it for myself.

The third reason, and I'll be honest here, is that contributing to a project with active NVIDIA engineers reviewing your code is a pretty good way to learn. cv (one of the maintainers) writes review comments that are worth more than most blog posts. When he approves something with "Security design is sound — three independent defense layers verified," that means something.

## What We've Actually Shipped

Over the past few weeks, my AI assistant Rainer and I (yes, I use an AI agent to help contribute to an AI agent sandbox project, the irony is not lost on me) have gotten a non-trivial list of PRs merged:

**Sandbox hardening:**
- [**#830**](https://github.com/NVIDIA/NemoClaw/pull/830) — Removed `gcc`, `g++`, `cpp`, `make`, and `netcat` from the sandbox image. These tools have no business being in an agent's runtime environment. ulimit hard+soft limits added.
- [**#654**](https://github.com/NVIDIA/NemoClaw/pull/654) — Multi-layer config protection: `openclaw.json` moved to `/etc/openclaw/` (outside the agent-writable tree), root:root 555 permissions, TOCTOU guard with `rmtree` before the runtime copy. Three independent layers. Took several rounds of review to get right — including discovering that `tool_policy` is not a valid OpenShell schema field (more on that below).

**CLI fixes:**
- [**#1245**](https://github.com/NVIDIA/NemoClaw/pull/1245) — `registry.clearAll()` was called unconditionally on `gateway destroy`, which wiped your sandbox list even if the destroy failed. Now it only runs on success.
- [**#1246**](https://github.com/NVIDIA/NemoClaw/pull/1246) — Secret patterns (API keys, tokens) are now redacted from CLI log output and error messages before they hit disk or stdout. Simple but important.
- [**#1526**](https://github.com/NVIDIA/NemoClaw/pull/1526) — The `nemoclaw destroy` confirmation prompt now explicitly tells you that *workspace files will be permanently deleted*. Previously it just said "This cannot be undone." Technically true, but not helpful.
- [**#1884**](https://github.com/NVIDIA/NemoClaw/pull/1884) — Model and provider were never persisted to the sandbox registry after onboarding. `registry.updateSandbox()` was called before `registerSandbox()`, so it silently no-oped. One line fix, annoying to track down.

**Policy and network:**
- [**#1540**](https://github.com/NVIDIA/NemoClaw/pull/1540) — Two policy preset fixes: the HuggingFace inference endpoint had migrated from `api-inference.huggingface.co` to `router.huggingface.co` (the old one returns HTTP 410), and the Discord preset allowed `DELETE` on all paths including channels and roles. Scoped it down to message/reaction paths only.
- [**#1700**](https://github.com/NVIDIA/NemoClaw/pull/1700) — The baseline sandbox policy included `/usr/local/bin/npm` and `/usr/local/bin/node` in the `npm_registry` binaries list, which meant `npm install` worked even with the "none" policy preset selected. The entry exists for `openclaw plugins install` only. Fixed.
- [**#1885**](https://github.com/NVIDIA/NemoClaw/pull/1885) — Removed the deprecated `tls: terminate` field from every policy YAML in the repo — 40 lines gone across presets, the baseline policy, and the Hermes agent additions. Was generating WARN logs on every sandbox start.

**Runtime improvements:**
- [**#980**](https://github.com/NVIDIA/NemoClaw/pull/980) — vLLM and NVIDIA NIM backends were broken with the standard chat completions API. Added forced routing to the right API type during onboard.
- [**#1359**](https://github.com/NVIDIA/NemoClaw/pull/1359) — Podman support alongside Docker. Socket detection, CoreDNS patching, the works.
- [**#433**](https://github.com/NVIDIA/NemoClaw/pull/433) — Kubelet conflict detection before gateway start. If you're running k3s, MicroK8s, or kubeadm on the same host, the cgroup namespace clash will silently break things. Now you get a warning.

## The `tool_policy` Lesson

I want to tell this story because it's a good one.

[PR #654](https://github.com/NVIDIA/NemoClaw/pull/654) — the config hardening one — looked clean. cv approved it. The security design was solid. And then ericksoa dug into the OpenShell Rust source code and found that `PolicyFile` uses `#[serde(deny_unknown_fields)]`. Which means if you add a field OpenShell doesn't know about — like, say, a `tool_policy` block — it doesn't ignore it. It **rejects the entire policy file at deserialization time**. Sandboxes fail to start.

We had been so focused on the security logic that nobody had checked the schema constraints. The fix was straightforward (remove the block, add a comment explaining why it's absent and what the actual enforcement is), but it was a good reminder that "looks good in YAML" and "parses correctly at runtime" are two different things.

This is the kind of thing you only learn by actually submitting code to a project with people who read the source.

## The Rebase Loop

One thing nobody tells you about open-source contribution is the rebasing. You open a PR, it looks good, someone reviews it, you address the feedback, you push — and then three days later there's a merge conflict because 40 other commits landed on main.

I have a small script at this point that fetches upstream, rebases, force-pushes, and leaves a comment so the maintainer knows it's been updated. I've used it approximately forty-seven times across these PRs. The `fix/kubelet-cgroup-conflict` branch has been rebased so many times it knows the codebase better than I do.

## What's Next

A few PRs are still in review — the tamper-evident audit logging ([#916](https://github.com/NVIDIA/NemoClaw/pull/916)), the kubelet detection ([#433](https://github.com/NVIDIA/NemoClaw/pull/433)), the K8s resource limits ([#1448](https://github.com/NVIDIA/NemoClaw/pull/1448)). There are also some newer issues I'm tracking: sandbox image missing `gnupg`, the Slack `SLACK_APP_TOKEN` not being forwarded, the `nemoclaw list` resurrection bug.

The project is moving fast. Between PRs, there was a full TypeScript migration of the CLI (which required rebasing everything again, obviously), new preset infrastructure, and a handful of security audit issues opened in bulk. It's an active codebase.

If you're interested in AI agent security, sandboxing, or just want to contribute to something that actually runs NVIDIA inference workloads in production — take a look at [github.com/NVIDIA/NemoClaw](https://github.com/NVIDIA/NemoClaw). The maintainers are responsive, the reviews are thorough, and there are always open issues that need someone to pick them up.

Just don't put `tool_policy` in your YAML.
