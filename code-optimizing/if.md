---
layout: guide

permalink: /jumpto/if/
root: ../..
title: "if"
group: "Code-Optimierung"
orderId: 8

creator: hausl

author:
    -   name: hausl
        profile: 21246

    -   name: mermshaus
        profile: 15041

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


#### Bedingungsoperator (`?:`)

Der Bedingungsoperator `?:` (auch Konditionaloperator) gehört zur Gruppe der ternären Operatoren (Operatoren mit drei Operanden). Da diese Gruppe in vielen Programmiersprachen lediglich diesen einen Operator umfasst, wird `?:` oftmals einfach nach dem Namen der Gruppe als „ternärer Operator“ bezeichnet.

Im Unterschied zur `if`-Anweisung, die anhand von Bedingungen den Kontrollfluss zu weiteren Anweisungsgruppen steuert, handelt es sich beim Bedingungsoperator lediglich um einen Ausdruck, der (wie jeder Ausdruck) zu einem Wert evaluiert wird. Dieser Wert kann wiederum Operand in einem übergeordneten Ausdruck sein (etwa in einer Zuweisung oder einer Addition). Daraus folgt die weitere Bezeichnung *inline if (iif)*. Der Bedingungsoperator kann nicht dazu genutzt werden, Anweisungen zu gruppieren.

Die grundsätzliche Notation lautet wie folgt:

~~~ php
Ausdruck1 ? Ausdruck2 : Ausdruck3
~~~

Trifft die Bedingung in *Ausdruck1* zu (evaluiert der Ausdruck als `== true`), wird *Ausdruck2* evaluiert und als Wert des Gesamtausdrucks gesetzt, ansonsten *Ausdruck3* („entweder/oder“).

Durch Schachtelung von Bedingungsoperatoren können auch Konzepte  wie `elseif` in Ausdrücke integriert werden. Hier empfiehlt es sich aber gemeinhin, die herkömmliche Variante (die `if`-Anweisung) zu nutzen, um die Übersicht zu behalten.

Nachfolgendes Beispiel entspricht den beiden Beispielen aus den vorherigen Abschnitten:

~~~ php
$action = (!empty($_POST['action'])) ? $_POST['action'] : 'standard';
~~~

Anmerkung: Die Klammerung der Bedingung ist syntaktisch nicht erforderlich, wird jedoch zur besseren Lesbarkeit empfohlen.

Bedingungsoperatoren finden häufig bei derartigen Zuweisungen Verwendung, weil auf diese Weise die Notwendigkeit wegfällt, die Variable vor einer `if`-Anweisung mit einem Standardwert belegen zu müssen, und weil gleichzeitig klar zu erkennen ist, dass die Variable unter allen Umständen mit einem Wert belegt wird.


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

