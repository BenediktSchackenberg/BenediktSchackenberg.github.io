---
layout: post
title: "PXE Zero-Touch Deployment: Lessons Learned"
subtitle: "From wimboot bugs to automated Windows rollouts"
date: 2026-02-24
tags: [octofleet, pxe, windows, deployment, devops]
---

After a few intense debugging sessions, Zero-Touch Windows Deployment for Octofleet finally works. Here are the key lessons learned - hopefully this saves someone a few hours.

## The Goal

Deploy Windows Server 2025 automatically on VMs. No manual clicking, no USB sticks. Register MAC address, start VM, done.

## The Pitfalls

### 1. wimboot initrd injection is unreliable

My first approach was injecting deployment scripts via iPXE initrd:

```bash
kernel ${pxe-server}/winpe/wimboot
initrd ${pxe-server}/scripts/startnet.cmd startnet.cmd
initrd ${pxe-server}/winpe/boot.wim boot.wim
boot
```

The problem: Scripts arrived truncated or not at all. After lots of debugging, the insight: **Scripts must go directly INTO the boot.wim**.

```bash
wimlib-imagex mountrw boot.wim 1 /tmp/mount
cp startnet.cmd /tmp/mount/Windows/System32/
cp curl.exe /tmp/mount/Windows/System32/
wimlib-imagex unmount --commit /tmp/mount
```

WinPE automatically executes `startnet.cmd` from `/Windows/System32/` on boot. Problem solved.

### 2. Watch the Boot Index!

The Windows boot.wim contains two images:
- Index 1: WinPE (command line)
- Index 2: Windows Setup (GUI with driver dialog)

Default Boot Index is often 2. If you see the "Select driver" dialog instead of command line:

```bash
wimlib-imagex info boot.wim 1 --boot
```

This sets Boot Index to 1 = pure WinPE.

### 3. KVM/libvirt: SATA instead of VirtIO

VirtIO is faster, but WinPE doesn't include VirtIO drivers. The options:

1. Inject VirtIO drivers into boot.wim (complicated, needs Windows DISM)
2. Switch disk to SATA (works immediately)

For deployment I use SATA. Performance doesn't matter when 7GB are flying over the network anyway.

### 4. Hyper-V: Gen2 only!

Hyper-V Gen1 (BIOS) has a bug with wimboot - "Bad CPIO magic". Gen2 (UEFI) works fine.

### 5. Old hardware and iPXE RAM limit

On an old i5-2400 board I got "No space" errors. iPXE can only load ~400MB into RAM, regardless of system RAM. boot.wim over 500MB = no chance.

Modern VMs don't have this problem.

## The Final Flow

1. VM starts, boots PXE
2. iPXE loads wimboot + boot.wim
3. WinPE starts, `startnet.cmd` runs automatically
4. Initialize network
5. Partition disk (GPT/UEFI)
6. Download Windows image via HTTP (curl.exe)
7. DISM apply-image
8. bcdboot for UEFI bootloader
9. Reboot → Windows starts

The minimal iPXE script:

```bash
#!ipxe
kernel http://192.168.0.5:9080/winpe/wimboot
initrd -n boot.wim http://192.168.0.5:9080/winpe/boot.wim
boot
```

Yes, really just three lines. The rest happens inside boot.wim.

## Conclusion

PXE deployment isn't rocket science, but the details matter. Key takeaways:

- Scripts IN the boot.wim, not via initrd
- Boot Index = 1 for WinPE
- SATA for KVM when no driver integration
- Hyper-V Gen2 only

The setup now works reliably for Windows Server 2022 and 2025. Linux is next.

Full documentation is in the [Octofleet Repo](https://github.com/BenediktSchackenberg/octofleet/tree/main/provisioning/docs).

---

*Octofleet is my open-source endpoint management tool. Still in development, but PXE deployment already works pretty well.*
