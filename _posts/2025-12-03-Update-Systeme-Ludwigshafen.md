---
layout: post
title: "Update: Reaktion auf die offenen Systeme der Stadt Ludwigshafen"
date: 2025-12-03 09:25:00 +0100
categories: ["Blog"]
tags: ["osint", "ludwigshafen", "it-sicherheit", "deutschland"]
description: "Nach meinem Hinweis an das BSI wurden Teile der exponierten Systeme der Stadt Ludwigshafen heute abgeschaltet."
image: /assets/img/oldbutgold.jpg
excerpt: "Ein Update zu meiner OSINT-Recherche über die Stadtverwaltung Ludwigshafen: Heute – fünf Tage nach meiner Meldung – wurden erste Systeme abgeschaltet."
---

# Update: Erste Reaktion – ein Teil der Systeme wurde abgeschaltet

Am **28. November 2025** hatte ich in meinem Blog beschrieben, wie offen verschiedene Systeme der Stadtverwaltung Ludwigshafen standen.  
Wer den ursprünglichen Beitrag noch nicht gelesen hat, findet ihn hier:

👉 **[Zum ursprünglichen OSINT-Bericht vom 28.11.2025](https://www.schackenberg.com/blog/ludwigshafen-osint/)**

Parallel dazu hatte ich den Vorfall dem **BSI** gemeldet.  
Heute gibt es dazu eine sichtbare Veränderung – wenn auch noch nicht vollständig.

---

## ✔ Heute, am 03.12.2025, wurden erste Systeme abgeschaltet

Beim erneuten Testen zeigt sich:

- **Ein Teil der exponierten Systeme ist nicht mehr erreichbar.**  
- Die alte **Check Point Firewall CPGWDMZ01** unter der **IP 80.208.232.201** ist weiterhin **offline** – sie blieb komplett verschwunden.  
- Andere IPs der Umgebung reagieren noch, vermutlich weil dort geprüft werden muss, ob das vollständige Abschalten laufender Dienste Auswirkungen auf interne Systeme hat.

Der große, vorher offen im Netz stehende **„Check Point Klotz“** ist also weg – und das ist die wichtigste Veränderung.

Insgesamt waren die Systeme damit:

> **5 Tage lang (28.11. → 03.12.2025)**  
> weiterhin öffentlich erreichbar.

---

## Warum nur teilweise abgeschaltet?

Ich kann nur spekulieren, aber aus Erfahrung weiß man:  
Gerade ältere Firewalls oder Übergangssysteme hängen oft noch an irgendwelchen Altprozessen, die man nicht „einfach so“ kappen kann.  

Dass der dicke Check-Point-Knoten zuerst offline ging, spricht dafür, dass man dort wohl am schnellsten reagieren konnte – eventuell, weil er ohnehin nicht mehr produktiv war.

Bei den restlichen IPs wird vermutlich intern geprüft:

- Welche Dienste hängen noch daran?  
- Gibt es Altanwendungen, die darüber laufen?  
- Können diese Systeme ohne Risiko komplett vom Netz?

Das kostet Zeit – aber wichtig ist: **Die Richtung stimmt.**

---

## Ein paar Gedanken zum heutigen Stand

Ich freue mich ehrlich, dass sich etwas bewegt hat.  
Ich hatte nicht erwartet, dass alle Systeme über Nacht verschwinden, aber eine teilweise Reaktion innerhalb weniger Tage ist ein gutes Zeichen.  

Gleichzeitig zeigt es aber auch, wie fragil manche kommunale IT-Landschaften sind.  
Wer einmal gesehen hat, wie komplex die Abhängigkeiten in solchen Umgebungen sind, wundert sich über gar nichts mehr.

---

## Warum ich dieses Update schreibe

Transparenz ist wichtig.  
Wer öffentlich auf Probleme hinweist, sollte auch öffentlich erwähnen, wenn Dinge verbessert werden.

Dieses Update soll kein „Fingerzeig“ sein, sondern dokumentieren, dass Hinweise ernst genommen werden und im besten Fall Wirkung zeigen.

---

Wenn du selbst schon einmal so etwas beobachtet hast oder dich generell für OSINT & IT-Sicherheitsanalyse interessierst, melde dich gern.  
Solche Fälle zeigen, wie wertvoll gemeinsames Hinschauen ist – und wie wichtig es ist, dass Schwachstellen nicht unbemerkt bleiben.
