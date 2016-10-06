---
layout: guide

permalink: /jumpto/standardfehler/
root: ../..
title: "Standardfehler"
group: "Debugging"
orderId: 6

creator: nikosch

author:
    -   name: nikosch
        profile: 2314

    -   name: Manko10
        profile: 1139

    -   name: hausl
        profile: 21246

inhalt:
    -   name: "Headervorgänge und „Headers already sent"
        anchor: headervorgaenge-und-headers-already-sent
        simple: ""

    -   name: "Kontrollstrukturen: Zuweisung statt Vergleich"
        anchor: kontrollstrukturen-zuweisung-statt-vergleich
        simple: ""

    -   name: "Kontrollstrukturen: Vorzeitige Beendigung durch Anweisungsende"
        anchor: kontrollstrukturen-vorzeitige-beendigung-durch-anweisungsende
        simple: ""

    -   name: "Kontrollstrukturen: Fehlende Blöcke"
        anchor: kontrollstrukturen-fehlende-bloecke
        simple: ""

---

## [Headervorgänge und „Headers already sent“](#headervorgaenge-und-headers-already-sent)
{: #headervorgaenge-und-headers-already-sent}

### [Problem](#problem)
{: #problem}

Bei einer Sessioninitialisierung (`session_start()`), einem Cookiesetzen oder einer versuchten Header-Weiterleitung (`header("Location: ... ")`) erfolgt eine Fehlermeldung („Headers already sent“) und die Aktion bleibt aus.

### [Fehler](#fehler)
{: #fehler}

Der Fehler kann mannigfaltige Ursachen haben, die aber alle die Gemeinsamkeit besitzen, dass sie vor der jeweiligen Headerausgabe Zeichenausgaben erzeugen.

Liste möglicher Ursachen im [Hauptartikel zu Headers already sent]({{ page.root }}/jumpto/headers-already-sent/).

### [Lösung](#loesung)
{: #loesung}

Es gibt zwei prinzipielle Lösungsansätze. Der erste besteht darin, die gesamte Scriptstruktur (aller beteiligten Scripte) so zu strukturieren, dass vor einer Aktion wie Sessionstart oder Header-Weiterleitung keine Ausgabe erfolgen kann. Dies kann im allgemeinen durch Ergänzen von Bedingungen oder Anlegen von Variablen für Ausgabestrings erreicht werden. Eine wichtige Maßnahme ist auch, alle Funktionen so einzurichten, dass sie keine Bildschirmausgabe erzeugen, sondern Code mittels `return` als String zurückgeben.

Näheres findet man im Hauptartikel zum [EVA Prinzip]({{ page.root }}/jumpto/eva-prinzip/).

Variante zwei nutzt den sogenannten [Ausgabepuffer](http://php.net/manual/de/intro.outcontrol.php), den man nutzen kann, um Bildschirmausgaben vorübergehend in eine Variable umzuleiten. Das funktioniert sogar mit Inline-HTML:

~~~ php
<?php

// Ausgabepuffer starten
ob_start ();

// nachfolgende Ausgaben werden jetzt gepuffert

?><html>
...
<body>
<?php

if (empty ($_GET['navigation'])) {
    header('Location: http://www.example.com/error.php');
    exit;
}

// weitere PHP Aktionen, die evtl. Ausgaben erzeugen
// ..

$output = ob_get_clean(); // nur exemplarisch

// weitere PHP Aktionen, die keine (!) Ausgaben erzeugen
// ..

// Hier erfolgt die Ausgabe <html> … etc.
echo $output;
?>
</body>
</html>
~~~

Prinzipiell ist der ersten Variante der Vorrang zu geben. Der Ausgabepuffer ist kein Allheilmittel gegen schlechte Programmstrukturen!

## [Kontrollstrukturen: Zuweisung statt Vergleich](#kontrollstrukturen-zuweisung-statt-vergleich)
{: #kontrollstrukturen-zuweisung-statt-vergleich}

### [Problem](#problem-2)
{: #problem-2}

~~~ php
if ($a = 5) {
  do_something();
}
~~~

Der Code erzeugt unerwartete Ergebnisse.

### [Ziel](#ziel-2)
{: #ziel-2}

In 95% aller Fälle soll hier der Wert in $a mit dem konstanten Wert „5“ verglichen werden und bei Erfolg ein Ausdruck ausgeführt werden. do_something soll dann abhängig von der Bedingung ausgeführt werden.

### [Fehler](#fehler-2)
{: #fehler-2}

In der Bedingung wird eine Zuweisung (=-Operator) statt eines Vergleichs (== bzw. ===-Operator) benutzt. In einigen Sprachen ist „=“ ein Vergleichsoperator, in PHP jedoch nicht.

### [Lösung](#loesung-2)
{: #loesung-2}

Der PHP-Parser kann diesen Fall nicht erkennen, weil `if( )` nur einen Ausdruck mit einem Rückgabewert erfordert. Eine Zuweisung hat einen Rückgabewert (den zugewiesenen Wert) und ist damit erfüllt (bzw. nicht erfüllt, je nach zugewiesenem Wert). Die Lösung besteht in der Benutzung der korrekten Vergleichsoperatoren:

~~~ php
if ($a == 5) {
  do_something();
}
~~~

Die bessere Lösung besteht darin, zusätzlich die Reihenfolge der Argumente umzukehren.

~~~ php
if (5 == $a) {
  do_something();
}
~~~

Wird in diesem Fall ein „=“ vergessen, erzeugt dies einen Parser Fehler, weil Zuweisungen an Werte nicht möglich sind. In Fällen, wo zwei Variablen auf Gleichheit verglichen werden, klappt dieser Trick natürlich nicht.


## [Kontrollstrukturen: Vorzeitige Beendigung durch Anweisungsende](#kontrollstrukturen-vorzeitige-beendigung-durch-anweisungsende)
{: #kontrollstrukturen-vorzeitige-beendigung-durch-anweisungsende}

### [Problem](#problem-3)
{: #problem-3}

~~~ php
if ($a == 5);
{
  do_something();
}
~~~

Der Code erzeugt unerwartete Ergebnisse. Die geklammerten Anweisungen werden immer ausgeführt.


### [Ziel](#ziel-3)
{: #ziel-3}

Die geklammerten Anweisungen (do_something) sollen abhängig von der Bedingung ausgeführt werden.

### [Fehler](#fehler-3)
{: #fehler-3}

Hinter der Bedingung wurde versehentlich ein Semikolon notiert. Semikolons schließen Anweisungen ab, das `if` wird also für einen leeren Ausdruck ausgewertet. {}-Blöcke dürfen in PHP auch alleinstehend existieren, auch wenn sie keinen Zweck erfüllen. Daher reagiert der PHP-Parser hier mit keiner Meldung.

### [Lösung](#loesung-3)
{: #loesung-3}

Ein geeignetes Syntaxhighlighting und eine andere Einrückformatierung können zur Vermeidung dieses Schreibfehlers beitragen:

~~~ php
if ($a == 5) {
  do_something();
}
~~~

Verwandte Probleme
Auch für andere Kontrollstrukturen wird dieser Fehler gerne gemacht:

~~~ php
// „do_something“ wird nur einmal ausgeführt
for ($i = 0; $i < 5 ; $i++);
{
  do_something();
}

$x = 5;
// Endlosschleife, „do_something“ und $x-Dekrement werden nie erreicht
while ($x > 0);
{
  do_something();
  $x--;
}
~~~

## [Kontrollstrukturen: Fehlende Blöcke](#kontrollstrukturen-fehlende-bloecke)
{: #kontrollstrukturen-fehlende-bloecke}

### [Problem](#problem-4)
{: #problem-4}

~~~ php
if ($a == 5)
  do_something_1();
  do_something_2();
~~~

Der Code erzeugt unerwartete Ergebnisse. Die erste Anweisung (do_something_1) wird korrekt, die zweite (do_something_2) immer ausgeführt.

### [Ziel](#ziel-4)
{: #ziel-4}

Alle eingerückten Befehle sollen abhängig von der Bedingung ausgeführt werden.

### [Fehler](#fehler-4)
{: #fehler-4}

PHP nutzt eine Blocksyntax, um Ausdrücke einer Kontrollstruktur zuzuordnen. Fehlen nach der Kontrollstruktur geschweifte Klammern, wird lediglich der erste nachfolgende Ausdruck der Bedingung oder Schleife zugeordnet. Einrückungen haben dagegen keine Bedeutung für die Zugehörigkeit von Ausdrücken zu Kontrollstrukturen. Das ist bspw. bei Python anders.

### [Lösung](#loesung-4)
{: #loesung-4}

Die konditionalen Ausdrücke (auch einzeilige!) von Bedingungen und Schleifen sollten immer in geschweiften Klammern als Block gefasst werden.

~~~ php
if ($a == 5) {
  do_something_1();
  do_something_2();
}
~~~

### [Verwandte Probleme](#verwandte-probleme)
{: #verwandte-probleme}

Das Problem ist genauso auf andere Kontrollstrukturen übertragbar:

~~~ php
$x = 5;
// Endlosschleife, „do_something_2“ und $x-Dekrement werden nie erreicht
while ($x > 0)
  do_something_1();
  do_something_2();
  $x--;
~~~
