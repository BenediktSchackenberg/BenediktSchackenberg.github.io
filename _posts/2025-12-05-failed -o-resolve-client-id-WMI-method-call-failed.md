---
layout: post
title: "KVM + Windows Server: UUID fehlt → Veeam-Agent startet nicht"
date: 2025-12-05 20:30:00 +0100
categories: ["Blog"]
tags: ["kvm", "libvirt", "ubuntu", "windows server", "veeam", "homelab", "fehlersuche"]
description: "Warum der Veeam Agent unter KVM plötzlich mit 'Failed to resolve client id' aussteigt – und wie eine fehlende SMBIOS-UUID schuld war."
image: /assets/img/homelab.jpg
---

Ich bastle mir privat gerade eine kleine Testumgebung: Ubuntu 24.04 als Host, KVM/libvirt als Virtualisierung und darin ein paar Windows-Server-VMs (2022/2025).  
Bis der Veeam Agent for Windows meinte, er müsse streiken.

Die Fehlermeldung:

> Failed to resolve client id. WMI method call failed. Object reference not set to an instance of an object.

Nach einiger Suche stellte sich heraus: Die VM hatte **keine gültige SMBIOS-UUID**. Ohne UUID kann Veeam die Client-ID nicht erzeugen – und schmeißt genau diesen Fehler.  
Bei mir war der Auslöser der Maschinentyp `pc-q35-8.2`.

---

## Ursache: Q35-Maschinentyp ohne UUID

Mit `pc-q35-8.2` bekam die Windows-VM keine UUID.  
Ein Wechsel auf `pc-q35-8.0` hat das Problem sofort behoben.

---

## Fix: Q35-Maschinentyp ändern

Hier mein Ablauf für eine bestehende VM:

---

## Schritt 1: VM-XML exportieren

~~~bash
sudo virsh dumpxml <VMNAME> > /tmp/<vmname>.xml
~~~

---

## Schritt 2: Maschinentyp anpassen

In der XML-Datei diese Zeile suchen:

~~~xml
<type arch='x86_64' machine='pc-q35-8.2'>hvm</type>
~~~

Ersetzen durch:

~~~xml
<type arch='x86_64' machine='pc-q35-8.0'>hvm</type>
~~~

---

## Schritt 3: XML wieder einspielen

~~~bash
sudo virsh define /tmp/<vmname>.xml
~~~

---

## Schritt 4: VM neu starten

~~~bash
sudo virsh reboot <VMNAME>
~~~

---

## Schritt 5: UUID in Windows prüfen

~~~cmd
wmic csproduct get uuid
~~~

Jetzt sollte eine UUID erscheinen.  
Sobald das der Fall war, lief der Veeam Agent bei mir sofort wieder ohne Fehlermeldung.

---

## Fazit

Wenn der Veeam Agent in einer KVM-VM mit Windows Server mit  
„Failed to resolve client id“ aussteigt, lohnt sich ein Blick auf:

- den verwendeten **Q35-Maschinentyp**  
- die **SMBIOS-UUID** in Windows

Mit `pc-q35-8.0` war das Problem bei mir sofort behoben.
