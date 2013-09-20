---
layout: guide
title: "Referenz"
group: "Allgemein"
creator: Manko10
author:
    -   name: Manko10
        profile: 1139

    -   name: hausl
        profile: 21246

inhalt:
    -   name: "Variablen und Referenzen"
        anchor: variablen-und-referenzen
        simple: ""

    -   name: "Referenzen auf nicht-initialisierte Variablen"
        anchor: referenzen-auf-nicht-initialisierte-variablen
        simple: ""


entry-type: in-progress
---

Eine **Referenz** stellt einen Verweis auf eine Speicherstelle dar, in der der Wert einer bereits initialisierten Variablen abgelegt wurde. Dabei übt sie praktisch die Funktion eines Aliasnamens für eine bereits existente Variable aus. Referenzen können auch [namensraumübergreifend](http://php-de.github.io/general/namensraum.html) eingesetzt werden. 

### Variablen und Referenzen
 
Eine Variable ist nur ein Bezeichner für eine Speicherstelle, in der ein Wert abgelegt wurde. Die Variable enthält also selbst keinen Wert, sondern verweist nur auf eine Adresse im Arbeitsspeicher. Erstellt man nun eine Referenz, so ist dies nichts anderes, als einen weiteren Bezeichner für dieselbe Speicheradresse zu erstellen. Es existieren fortan zwei Variablen mit demselben Ziel. Eine Referenz erstellt man mit dem Referenzierungsoperator `&`. 

Ein Beispiel zeigt den Unterschied zwischen einer normalen Wertzuweisung und einer Referenzierung: 

~~~ php
// normale Zuweisung:
$var1 = 5;
$var2 = $var1;
$var2 = 6;
echo $var1 . ' - ' . $var2 . '<br />';
 
// Referenzierung
$var1 = 5;
$var2 = &$var1;$var2 = 6;  // Anwendung des Referenzierungs-Operator
echo $var1 . ' - ' . $var2;
~~~

Die Ausgabe:

~~~ 
5 - 6
6 - 6
~~~

Man beachte den Referenzierungsoperator in der angemerkten Zeile. Bei der ersten Zuweisung wird der Wert der Variablen `$var1` in die Variable `$var2` bzw. deren Speicherstelle kopiert. Die beiden Werte sind fortan unabhängig voneinander. Bei der zweiten Zuweisung handelt es sich nicht um die Übergabe eines Wertes, sondern um die Übergabe der Speicheradresse. `$var1` und `$var2` verweisen also auf dieselbe Speicheradresse. Eine Änderung an der einen Variablen wirkt sich unmittelbar auf die andere aus. 

Will man eine Speicherstelle leeren, kann man ihr den Wert `null` zuweisen. Der Einsatz von `unset()` bewirkt lediglich, dass der Bezeichner gelöscht wird, nicht aber der Wert. Dieser ist weiterhin über andere Referenzen erreichbar: 

~~~ php
$var = 5;
$ref = &$var;
 
// löscht nur $var, nicht aber den Wert und schon gar nicht $ref:
unset($var);
echo $ref;
~~~

Die Ausgabe:

~~~
5
~~~

### Referenzen auf nicht-initialisierte Variablen
 
Was passiert aber, wenn eine Referenz auf eine nicht existierende Variable übergeben wird? Die Referenz würde in dem Falle ins Leere verweisen. Für diesen Fall ist in PHP ein Schutzmechanismus eingebaut. Nicht-initialisierte Variablen werden automatisch mit `null` belegt. 

~~~ php
$ref = &$var;
var_dump($ref);
~~~

Die Ausgabe

~~~ php
null
~~~

Es wird keine Notice ausgegeben, die Variable existiert. 
