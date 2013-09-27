---
layout: guide
title: "Entwicklungsumgebung mit Vagrant"
creator: BlackScorp
group: "Entwicklungs Umgebung"
author:
    -   name: BlackScorp
        profile: 16579

inhalt:
    -   name: "Motivation"
        anchor: motivation
        simple: ""

entry-type: in-progress
---

### Motivation

In der Regel reicht eine XAMPP Installation unter Windows komplett aus, um mal eben mit PHP entwicklen zu können. 
Doch sobald man unter umständen NodeJS oder nginx Server verwenden will, oder statt MySql MongoDB reicht da XAMPP nicht mehr aus.

Dazu gibt es mehrere Alternativen.

1) Man nimmt einen Alten PC oder Notebook, installiert dort Linux und alles was man für die Entwicklung benötigt. 
Nachteil ist: wenn man entwickeln will, muss man das Notebook einschalten, gegebenfalls updates installieren usw..
2) Man installiert sich Linux mit DualBoot und wechselt zwischen Windows und Linux beim booten
Nachteil: Unter Windows kann man nicht entwickeln, nur noch unter Linux
3) Man installiert sich VirtualBox und hat einen einen Virtuellen PC
Nachteil: Es tauchen ab und zu Probleme auf mit der virtuellen Festplatte der VirtualBox manchmal kommt es sogar soweit, dass man die Virtuelle Umgebung neu aufsetzen muss

Die Vorteile einer Virtuellen Machine sind:

1) Testen im Internet Explorer ist Möglich
2) Man hat die Möglichkeit unterschiedliche Server zu testen. 
