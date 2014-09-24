---
layout: guide

permalink: /jumpto/if/
title: "if"
group: "Code-Optimierung"
orderId: 8

creator: hausl

author:
    -   name: hausl
        profile: 21246
    
inhalt:
    -   name: "Mythos if-Schleife"
        anchor: mythos-if-schleife
        simple: "if ist eine Kontrollstruktur"
        
    -   name: "Notierung"
        anchor: notierung
        simple: "Korrekte Notierung gem. PEAR-Standard"

    -   name: "Syntaktische Fallstricke"
        anchor: syntaktische-fallstricke
        simple: "Diese Fallen lauern"

    -   name: "Unnötige Konstrukte"
        anchor: unntige-konstrukte
        simple: "So geht es besser"

---


### Mythos if-Schleife

Zuerst sei ein oft vorkommender Mythos aufgeklärt:

- Es gibt keine `if`-Schleifen.
- Es gibt keine `if`-Schlaufen.
  
Das Wesen einer Schleife ist die Wiederholung. `if` bildet einen Block aus Anweisungen und Ausdrücken.

`if` ist eine [Kontrollstruktur](http://php.net/manual/de/language.control-structures.php) aber deshalb noch lange keine Schleife.


### Notierung  

Die korrekte Notierung gemäß [PEAR Standard](http://pear.php.net/manual/de/standards.control.php) beschreibt die Angabe immer mit geschweiften/geschwungenen  Klammern `{ }`.

Beispiel 

~~~ php
if (Bedingung1) {
    Aktion1;
} elseif (Bedingung2) {
    Aktion2;
} else {
    Standardaktion;
}
~~~

#### Übliche Darstellung `if` / `else`

Nachfolgend eine übliche Darstellung, diese entspricht einem *entweder / oder*.

~~~ php
if (!empty($_POST['action'])) {
    $action = $_POST['action'];
} else {
    $action = 'standard';
}
~~~


#### Etwas verkürzte Notierung mit default-Vorbelegung

Eine alternative, etwas kürzere Variante, mit Wert-Vorbelegung und Übersteuerung, wenn die Bedingung zutrifft.

~~~ php
$action = 'standard'; // Initiale Vorbelegung 
if (!empty($_POST['action'])) {
    $action = $_POST['action'];
}
~~~


#### Trinitäts Operator (Ternärer Operator)

Der [Trinitäts Operator](http://php.net/manual/de/language.operators.comparison.php) (auch "Ternärer Operator") kann unter gewissen Umständen eine Alternative zum `if` darstellen.  

Dieser ist primär ein Zuweisungsoperator, dementsprechend können seine Operanden nur Ausdrücke darstellen, und insbesondere keine Blöcke aus Anweisungen - es sei denn, diese sind als Ausdruck kombinierbar. Dieser bietet sich beispielsweise als Alternative an, wenn es nur ein *entweder / oder* gibt.  

Die grundsätzliche Notation lautet wie folgt:  

~~~ php
(Bedingung) ? Aktion1 : Standardaktion;
~~~

Sollte mehr als das nötig sein (`elseif`, ...), kann diese Variante jedoch sehr schnell unübersichtlich werden. Hier empfiehlt es sich die herkömmliche Variante zu nutzen.

Nachfolgendes Beispiel entspricht den oberen beiden Beispielen:

~~~ php
$action = (!empty($_POST['action'])) ? $_POST['action'] : 'standard';
~~~

Anmerkung: Die Klammerung der Bedingung ist nicht nötig, wird jedoch der besseren Lesbarkeit empfohlen. 


### Syntaktische Fallstricke


#### Nur ein Gleichheitszeichen `=`

~~~ php
if ($ampel = "gruen") {
    echo "Go!";
}
~~~

Nur ein `=` Zeichen ist eine Zuweisung und würde immer als *true* gewertet. Zum direkten Vergleich sind zwei `==` oder drei `===` Zeichen nötig. Details dazu zum Thema *typschwacher* und *typsicherer* Vergleich gibt es [ebenfalls hier](http://php.net/manual/de/language.operators.comparison.php).


#### Schreibweise ohne geschweifte Klammern

Ohne den geschweiften Klammern wird jeweils nur die erste Anweisung nach dem `if` ausgeführt. Nachfolgende Anweisungen werden,  unabhängig davon, immer ausgeführt. Zur besseren Lesbarkeit wird grundsätzich von dieser Notaiton abgeraten, diese findet auch im [PEAR-Standard](http://pear.php.net/manual/en/standards.control.php) keine Anwendung.

Negativbeispiel
 
~~~ php
if ($ampel == "gruen")
    echo "Na endlich!"; // nur diese Anweisung wird gemäß der if-Bedingung ausgeführt
    echo "Go!";         // diese Anweisung wird unabhängig von if immer ausgeführt
~~~


### Unnötige Konstrukte

#### Unnötige Prüfungen zu bool (*true* oder *false*) hin

Das Audruck in der Klammer ( ) nach dem `if` wird direkt immer zu *true* oder *false* ausgewertet. Mit diesem Hintergrundwissen fällt auf, das es oft unnötige Anwendungen des `if` Konstruktes gibt.

Beispiel, eine Prüfung ob ein User Volljährig ist, könnte so aussehen:

~~~ php
if ($userAge >= 18) {
    $userIsAdult = true;
} else {
    $userIsAdult = false;    
}
~~~

Da die Bedigung `($userAge >= 18)` bereits *true* oder *false* zurückgibt, wäre die für diese Fall ausreichend:   

~~~ php
$userIsAdult = ($userAge >= 18);
~~~

Anmerkung: Die Klammerung der Bedingung ist nicht nötig, wird jedoch der besseren Lesbarkeit empfohlen.

