---
layout: post
category: technik
image: /assets/img/ludwigshafen.jpg
---
# 🌤️ Stadtverwaltung Ludwigshafen offline – vermutlich über VPN kompromittiert

Die Stadtverwaltung Ludwigshafen hat am 6. November vorsorglich ihre Systeme vom Netz genommen – ein harter, aber in solchen Fällen völlig richtiger Schritt. Dass viele Dienste und Kontaktwege vorübergehend nicht erreichbar sind, ist natürlich ärgerlich für Bürgerinnen, Bürger und Mitarbeitende. Trotzdem: lieber kontrolliert herunterfahren, als ein unklares Risiko weiterlaufen zu lassen.

Ich vermute, dass das Ganze ähnlich gelaufen sein könnte wie im bekannten NRW-Fall, der inzwischen gut dokumentiert ist.
Dort zeigten die forensischen Untersuchungen, dass Angreifer über eine VPN-Schwachstelle in das Netzwerk eindringen konnten. [Im SIT Incident-Response-Abschlussbericht (Version 1.1, PDF)](https://www.sit.nrw/fileadmin/user_upload/SIT_Incident_Response_v1.1.pdf){:class="external"}
 wird genau beschrieben, wie über kompromittierte Benutzerkonten ohne Multi-Faktor-Authentifizierung mehrere unautorisierte VPN-Verbindungen aufgebaut wurden – teils aus dem Ausland. Wenige Tage später folgte dann die Verschlüsselung der Systeme durch Ransomware.

Das Muster ist leider typisch: Erst der Einstieg über VPN, dann Bewegung im internen Netz (RDP, SMB, Adminrechte), und am Ende steht der Totalausfall.
Klassische VPN-Setups sind hier besonders gefährlich, weil sie – einmal kompromittiert – wie eine offene Tür ins interne Netzwerk wirken. Ohne Segmentierung, ohne MFA und ohne aktuelle Firmware genügt oft ein einziger Zugang, um großen Schaden anzurichten.

Was jetzt wichtig ist:

- VPN-Zugänge konsequent mit Multi-Faktor-Authentifizierung schützen.
- Firmware- und Sicherheitsupdates regelmäßig einspielen.
- Netzwerksegmentierung und eingeschränkte Rechte konsequent umsetzen.
- Administrative Zugänge gesondert absichern und überwachen.

Darüber hinaus lohnt es sich, über modernere Ansätze nachzudenken:
Zero-Trust-Konzepte setzen nicht mehr auf pauschales Vertrauen, sondern auf kontextabhängige Prüfungen pro Verbindung. Microsegmentation begrenzt das Schadensausmaß, und Conditional Access sorgt dafür, dass nur bekannte, sichere Geräte ins Netz dürfen.
Als Alternative zu herkömmlichen VPN-Systemen bietet sich WireGuard an – eine moderne, schlanke Lösung mit starker Kryptografie (Curve25519, ChaCha20, Poly1305). Sie ist leicht zu konfigurieren, performant und reduziert durch ihr minimalistisches Design die Angriffsfläche erheblich. In Kombination mit MFA und Endpoint-Prüfung kann WireGuard ein echter Fortschritt in Richtung sicherer Fernzugriff sein.

Die Entscheidung der Stadt Ludwigshafen war also richtig: lieber einmal zu viel die Notbremse ziehen, als später tagelang auf verschlüsselte Server zu starren. Jetzt gilt es, den Wiederanlauf zu nutzen, um die Architektur sicherer und moderner zu gestalten – damit solche Vorfälle bald der Vergangenheit angehören.