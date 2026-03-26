---
layout: post
title: "How I Accidentally Started a Container Security Drama at NVIDIA"
subtitle: "A tale of Linux capabilities, code reviews, and why docs-only fixes don't cut it"
date: 2026-03-26
tags: [security, containers, open-source, NVIDIA, NemoClaw]
thumbnail-img: /assets/images/cap-drop-meme.png
share-img: /assets/images/cap-drop-meme.png
---

# The Day I Poked NVIDIA About Their Container Security

You know that feeling when you leave a comment on a GitHub issue and suddenly you're in the middle of a security drama? Yeah, that happened.

## It Started With a Simple Question

[NemoClaw](https://github.com/NVIDIA/NemoClaw) is NVIDIA's open-source AI agent orchestration framework. Cool project. But while poking around the Dockerfile, something caught my eye: **the container wasn't dropping any Linux capabilities**.

![Container running with all capabilities](/assets/images/cap-drop-before.png)
*The container after startup. Look at all those juicy capabilities. CAP_NET_RAW? Don't mind if I do!*

For the uninitiated: Linux capabilities are like fine-grained root permissions. Docker containers get a bunch by default — including fun ones like:

- **CAP_NET_RAW** — craft raw packets, ARP spoofing, the works
- **CAP_DAC_OVERRIDE** — who needs file permissions anyway?
- **CAP_SYS_CHROOT** — chroot calls for everyone!

This is basically [CIS Docker Benchmark 5.3](https://www.cisecurity.org/benchmark/docker): "Restrict Linux kernel capabilities within containers." One of those things that everyone agrees on but nobody actually does.

## The Docs-Only "Fix" That Wasn't

The first attempt to address issue [#797](https://github.com/NVIDIA/NemoClaw/issues/797) was... a documentation update. Basically: "Hey, just add `--cap-drop=ALL` to your docker run command." 

The community wasn't having it. As one contributor pointedly asked: *"How does this cover #797?"* — and they were right. Telling users to remember a CLI flag isn't the same as actually fixing the problem. The PR author gracefully acknowledged:

> "Fair point — you're right that our PR doesn't actually enforce capability dropping at the container level."

**Lesson learned:** Docs are great. Docs as a security fix? Not so much. 📝 ≠ 🔒

## The Real Fix: capsh to the Rescue

Here's where it gets interesting. The NemoClaw container is managed by OpenShell's sandbox runtime, which means **you can't just pass `--cap-drop=ALL` to docker run**. The runtime doesn't expose that flag. Classic.

So [@ericksoa](https://github.com/ericksoa) came up with an elegant solution: use `capsh` (from `libcap2-bin`) in the entrypoint script to **self-re-exec with a stripped bounding set**:

```bash
if [ "${NEMOCLAW_CAPS_DROPPED:-}" != "1" ] && command -v capsh >/dev/null 2>&1; then
  export NEMOCLAW_CAPS_DROPPED=1
  exec capsh \
    --drop=cap_net_raw,cap_dac_override,cap_sys_chroot,cap_fsetid,... \
    -- -c 'exec /usr/local/bin/nemoclaw-start "$@"' -- "$@"
fi
```

The beauty: it drops 9 dangerous capabilities while keeping only the 5 needed for `gosu` privilege separation. And the `NEMOCLAW_CAPS_DROPPED` guard prevents infinite re-exec loops. Chef's kiss. 👨‍🍳

## My Review (and the Accidental Empty Approval)

I got to [review the PR](https://github.com/NVIDIA/NemoClaw/pull/917) and... well, first I accidentally submitted an empty approval. Automation things. 😅

But then I left actual feedback:

1. **The e2e test** used `bash -c` with nested arithmetic to decode hex capability masks — suggested using `capsh --print` and grepping for `cap_net_raw` in the Bounding set instead. Simpler, less fragile.

2. **Spotted a sneaky one:** `cap_dac_read_search` wasn't in the drop list. Intentional? Some hardening guides flag it. Always worth asking.

![The capability drop in action](/assets/images/cap-drop-after.png)
*After the fix: bounding set stripped clean. Only the essentials remain.*

## The Plot Twist: cap_setpcap

Of course, no good security PR ships without a follow-up fix. Turns out, **you need `CAP_SETPCAP` to drop other capabilities**. Dropping it from the bounding set means `capsh` can't... well, do its job. The sandbox wouldn't start.

[PR #929](https://github.com/NVIDIA/NemoClaw/pull/929) landed the same day to keep `cap_setpcap` and add a pre-check with `capsh --has-p`. If the capability isn't available (like in OpenShell's sandbox), the drop is skipped gracefully since the runtime is already restricting things.

## Takeaways

1. **Defense in depth actually matters.** Don't rely on one layer (docs, runtime, or Dockerfile alone).
2. **Community pressure works.** The docs-only approach got rightfully challenged, leading to a proper fix.
3. **capsh is underrated.** When you can't control the runtime, the entrypoint can still harden itself.
4. **Always read the capability list twice.** Missing one (`cap_setpcap`) broke the entire sandbox startup.
5. **Open source reviews are fun.** You get thanked in NVIDIA PRs for pointing out CIS benchmarks. Not bad for a Tuesday evening.

---

*The PR [#917](https://github.com/NVIDIA/NemoClaw/pull/917) was merged on March 25, 2026. Many thanks to [@ericksoa](https://github.com/ericksoa) for the implementation, [@h-network](https://github.com/h-network) for keeping the bar high, and the NemoClaw maintainers for a smooth review process.*
