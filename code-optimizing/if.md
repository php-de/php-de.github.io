---
layout: guide
permalink: /jumpto/if/
title: "if"
group: "Code-Optimierung"
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

    -   name: "Sinnlose Konstrukte"
        anchor: sinnlose-konstrukte
        simple: "So geht es besser"


entry-type: in-discussion
---


### Mythos `if`-Schleife

Zuerst sei ein oft vorkommender Mythos aufgeklärt:

- Es gibt keine `if`-Schleifen.
- Es gibt keine `if`-Schlaufen.
  
Das Wesen einer Schleife ist die Wiederholung. `if` bildet einen Block aus Anweisungen und Ausdrücken.

`if` ist eine [Kontrollstruktur](http://www.php.net/manual/de/language.control-structures.php) aber deshalb noch lange keine Schleife.


### Notierung  

Die korrekte Notierung gemäß [PEAR Standard](http://pear.php.net/manual/de/standards.control.php) beschreibt die Angabe immer mit Klammern.

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

Die übliche Darstellung entspricht somit *entweder / oder* 

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

Eine weitere alternative Darstellungsweise ist der [Trinitäts Operator](http://php.net/manual/de/language.operators.comparison.php), auch Ternärer Operator genannt. Dieser bietet sich ins Besondere an, wenn es nur ein *entweder / oder* gibt. Sollte mehr als das nötig sein (`elseif`, ...), kann diese Variante jedoch sehr schnell unübersichtlich werden. Hier empfiehlt es sich oft zur herkömmlichen Variante zu greifen.

~~~ php
(Bedingung) ? Aktion1 : Standardakion;
~~~

Beispiel entspricht den oberen beiden:

~~~ php
$action = (!empty($_POST['action'])) ? $_POST['action'] : 'standard';
~~~

Anmerkung: Die Klammerung der Bedingung im Trinitäts Operator ist nicht nötig, wird jedoch der besseren Lesbarkeit empfohlen. 


### Syntaktische Fallstricke


#### Nur ein Gleichheitszeichen `=`

~~~ php
if ($ampel = "gruen") {
    echo "Go!";
}
~~~

Nur ein `=` Zeichen ist eine Zuweisung und würde immer als *true* gewertet. Zum direkten Vergleich sind zwei `==` oder drei `===` Zeichen nötig. Details dazu zum Thema typschwacher und typsicherer Vergleich gibt es [ebenfalls hier](http://php.net/manual/de/language.operators.comparison.php).


#### Schreibweise ohne geschweifte Klammern

Nur die erste Zeile nach dem `if` wird als Aktion behandelt. Die nächste Zeile nicht mehr, diese wird immer ausgeführt. Zur besseren Lesbarkeit wird von dieser Notaiton abgeraten, diese findet auch im PEAR Standard keine Anwendung.

Negativbeispiel

~~~ php
if ($ampel == "gruen")
    echo "Na endlich!"; // nur diese Zeile wird gem if ausgeführt
    echo "Go!";         // diese Zeile wird immer(!) ausgeführt
~~~


### Sinnlose Konstruke

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

