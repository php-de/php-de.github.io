---
layout: guide

permalink: /jumpto/referenz/
title: "Referenz"
group: "Allgemein"
orderId: 13

creator: Manko10
author:
    -   name: Manko10
        profile: 1139

    -   name: hausl
        profile: 21246

    -   name: mermshaus
        profile: 15041

inhalt:
    -   name: "Variablen und Referenzen"
        anchor: variablen-und-referenzen
        simple: ""

    -   name: "Referenzen auf nicht existierende Variablen"
        anchor: referenzen-auf-nicht-existierende-variablen
        simple: ""
---

**Referenzen** in PHP sind gleichberechtigte Aliase für Variablennamen. Sie dienen dazu, mit verschiedenen Variablennamen auf dieselbe Speicherstelle zugreifen zu können. Referenzen können auch [namensraumübergreifend]({{ site.url }}/jumpto/geltungsbereich-namensraum/) eingesetzt werden.

### Variablen und Referenzen

Eine Variable ist ein Bezeichner für eine Speicherstelle, in der ein Wert abgelegt ist. Die Variable enthält also selbst keinen Wert, sondern verweist auf eine Adresse im Arbeitsspeicher. Eine Referenz ist nichts anderes als ein weiterer Bezeichner für dieselbe Speicheradresse. Es existieren fortan zwei Variablen mit demselben Ziel. Diese beiden Variablen sind gleichberechtigt und voneinander unabhängig. Es existiert also keine „Originalvariable“, von der die danach angelegte Referenz in irgendeiner Weise abhängt.

Eine Referenz wird mit dem Referenzierungsoperator `&` erstellt.

Dieses Beispiel zeigt den Unterschied zwischen einer normalen Wertzuweisung und einer Referenzierung:

~~~ php
// normale Zuweisung:
$var1 = 5;
$var2 = $var1;
$var2 = 6;
echo $var1 . ' - ' . $var2 . "\n";

// Referenzierung
$var1 = 5;
$var2 = &$var1; // Anwendung des Referenzierungsoperator
$var2 = 6;
echo $var1 . ' - ' . $var2 . "\n";
~~~

Die Ausgabe:

~~~
5 - 6
6 - 6
~~~

Zu beachten ist der Referenzierungsoperator in der angemerkten Zeile. Bei der ersten Zuweisung wird der Wert der Variablen `$var1` in die Variable `$var2` (beziehungsweise deren Speicherstelle) kopiert. Die beiden Werte sind fortan unabhängig voneinander. Bei der zweiten Zuweisung wird nicht der Wert kopiert, sondern die Speicheradresse. `$var1` und `$var2` verweisen also auf dieselbe Speicheradresse. Eine Änderung an der einen Variablen wirkt sich unmittelbar auf die andere aus.

Soll eine Speicherstelle geleert werden, kann ihr der Wert `null` zugewiesen werden. Im Gegensatz dazu bewirkt der Einsatz von `unset()` lediglich, dass der Bezeichner gelöscht wird, nicht aber der Wert. Dieser ist weiterhin über andere Referenzen erreichbar:

~~~ php
$var = 5;
$ref = &$var;

// löscht nur $var, nicht aber den Wert und schon gar nicht $ref:
unset($var);
echo $ref . "\n";
~~~

Die Ausgabe:

~~~
5
~~~

### Referenzen auf nicht existierende Variablen

Was passiert aber, wenn eine Referenz auf eine nicht existierende Variable erstellt wird? Die Referenz würde in dem Falle ins Leere verweisen. Für diesen Fall ist in PHP ein Schutzmechanismus eingebaut. Nicht existierende Variablen werden automatisch mit `null` belegt.

~~~ php
$ref = &$var;
var_dump($ref, $var);
~~~

Die Ausgabe:

~~~ php
null
null
~~~

Es wird keine Notice ausgegeben, beide Variablen werden initialisiert.

Diese Verhaltensweise kann beispielsweise bei Funktionen genutzt werden, die eine Referenz als Parameter erwarten. Die entsprechende Variable, die als Argument übergeben wird, muss in diesem Fall nicht vor dem Aufruf initialisiert werden.

Das nachfolgende Beispiel ist syntaktisch korrekt:

~~~ php
preg_match('/w[a-z]+/', 'hello world', $matches);
var_dump($matches);
~~~

Eine explizite Initialisierung mit einen Standardwert (`$matches = array();`) vor dem Aufruf kann aber zur Lesbarkeit des Codes beitragen.
