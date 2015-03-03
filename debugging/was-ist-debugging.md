---
layout: guide

permalink: /jumpto/was-ist-debugging/
root: ../..
title: "Was ist Debugging?"
group: "Debugging"
orderId: 2

creator: nikosch

author:
    -   name: nikosch
        profile: 2314

    -   name: Manko10
        profile: 1139

    -   name: hausl
        profile: 21246

inhalt:
    -   name: "Debugging"
        anchor: begriffserklrung
        simple: "Was ist das?"

---

### Begriffserklärung

Das **Debugging** bezeichnet im Prozess der Softwareentwicklung die gezielte Fehlersuche in einem vorhandenen Code. Das Wort leitet sich aus der Negation des Wortes *Bug* ab, das im Programmiererjargon einen Programmfehler bezeichnet.


Debugging umfasst eine Vielzahl von Methoden, die zunehmend auch durch technische Mittel von Codeeditoren oder IDEs (*Integrated development environment*, Entwicklungsumgebungen für Programmierer) unterstützt werden. Zu nennende Methoden sind:

- Ausgabe von systemgenerierten und eigenen Fehlermeldungen
- Ausgabe von Informationen zur Festellung durchlaufener Codezweige
- Ausgabe aktueller Variablenwerte
- Ausgabe eines Backtrace (Liste von durchlaufenen verschachtelten Prozeduren)
- Logging verschiedener Informationen
- schrittweise Abarbeitung des Programmcodes durch softwareunterstützte Breakpoints
- Einzelschrittanalyse des Programmzustands
<br>

Debugging in der Webentwicklung kann ein komplexer Prozess sein, weil sich Fehler in verschiedenen Quellcode-Bestandteilen der Applikation ereignen können, bspw. serverseitig durch einen Fehler in PHP Code oder eine ungültige Datenbankabfrage, aber auch auf Clientseite durch logische Fehler in der Auszeichnung oder in einem Javascript. Somit ist es sehr wichtig, dass man die [Zusammenhänge zwischen den eigenen Sprachen sowie die Client-Server-Interaktion]({{ page.root }}/jumpto/was-ist-php/) verinnerlicht hat.

Die zunehmende Verbreitung von Ajax und Javascript-erzeugten, dynamischen Inhalten erhöht die Komplexität der Seitengenerierung weiter; und damit auch den Aufwand der Fehlersuche. Eine größere Anzahl von Schichten, welche Inhalt verarbeiten und darstellen, steht der beschränkten Wahrnehmung entgegen, wie eine Ausgabe im Fehlerkontext erkannt werden kann. Es gilt, sich von der reinen (fehlerhaften) Browserdarstellung zur Ursache des Problems 'durchzuhangeln'.

Nicht zuletzt ist einfaches Debugging ein gutes Argument dafür, seine Applikation in voneinander weitgehend unabhängigen Schichten anzulegen. Das betrifft sowohl die Programmierung selbst, als auch die Abstraktion der oben genannten Darstellungskomponenten.

