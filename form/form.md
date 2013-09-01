---
layout: guide
title: "Überblick"
group: "Formularverarbeitung"
creator: nikosch
author:
    -   name: nikosch
        profile: 2314

    -   name: hausl
        profile: 21246

inhalt:
    -   name: "Grundlagen"
        anchor: grundlagen
        simple: ""

    -   name: "Parametermengen"
        anchor: parametermengen
        simple: ""

    -   name: "Parameterformat"
        anchor: parameterformat
        simple: ""

    -   name: "Komplettbeispiel"
        anchor: komplettbeispiel
        simple: ""

    -   name: "Weitere Beiträge zum Thema"
        anchor: weitere-beitrge-zum-thema
        simple: ""

entry-type: in-discussion
---

Die **Formularverarbeitung** ist ein Schwerpunktgebiet serverseitiger Programmiersprachen – und ein klassischer Grund, sich mit Sprachen wie PHP auseinanderzusetzen. 

HTML bietet verschiedene Eingabeelemente an, die ähnlich den Feldern einer Erfassungsmaske gestaltet sind. Das Angebot umfasst klassische Eingabefelder, Ankreuz- und Auswahlelemente. Aktuelle Webbrowser können die Daten solcher Elememente zwar verarbeiten ([JavaScript](http://php-de.github.io/general/javascript.html)), aber nicht speichern. Auch sind Eingabedaten meist eher relevant für den Anbieter eines Webdienstes, nicht aber den Nutzer selbst, weshalb die Verarbeitung serverseitig erfolgt. Hier können die Daten beliebig analysiert (vgl. [Eingabevalidierung](http://www.php.de/wiki-php/index.php/Validierung)), manipuliert und verarbeitet werden. Das Spektrum reicht dabei von der Speicherung in einer Datenbank, über den Versand als Email bis hin zu aufwendigen Verarbeitungsmethoden. 

Da die Natur des Menschen (die, Fehler zu machen) dem zustandslosen Verbindungsverhalten (oder der Vergesslichkeit) PHPs entgegenläuft, hat sich als Standardmethode der Datenverarbeitung das sogenannte [Affenformular (Standardverfahren)](http://php-de.github.io/form/affenformular.html) etabliert, das sich solange mit bereits eingetragenen Daten selbst aufruft, bis die Eingabe vollständig und fehlerfrei ist. Das Verfahren ist so praktisch, dass ihm in diesem Wiki ein eigener Themenbereich gewidmet wurde. 
 

### Grundlagen

Wichtig zu wissen ist, dass die Daten beim Aufruf des Serverscripts im [Request](http://php-de.github.io/request-handling/request.html) enthalten sind und dem Script dadurch zur Verfügung stehen. Die Kehrseite dieser Tatsache sind Sicherheitsaspekte, die auf der leichten Manipulierbarkeit von Formularen und Verbindungsdaten fußen. 


### Parametermengen

Je nachdem, wie die Datenübertragung erfolgt, gibt es für PHP verschiedene Array-Variablen, die Parameterdaten enthalten können. 

Siehe dazu auch:  
[Hauptartikel Request](http://php-de.github.io/request-handling/request.html)  
[Hauptartikel GPC](http://php-de.github.io/request-handling/gpc.html)  

Nachfolgend wird stets der POST Request bei der PHP-seitigen Verarbeitung zugrunde gelegt und `<form>` Tags im der HTML Code der Übersichtlichkeit halber weggelassen. 


### Parameterformat

Formular-Parameterdaten (nachfolgend Formulardaten) kann man grob in zwei Datentypen einteilen: Skalare, d. h. eindimensionale Daten und mehrdimensionale Typen. 


#### Skalare Elementtypen

Klassische eindimensionale Formulardaten sind Einträge einer Textbox oder eines Inputfeldes vom Typ `'text'`. Hier steht ein konkreter Wert einem Namen gegenüber. Auch der Eintrag einer Gruppe von Radioboxes ist ein solcher Typ, weil nur jeweils eine der möglichen Auswahlen als Wert übertragen wird. 

~~~ php
<input type="text" name="Textfeld" value="abc">
<textarea name="Textbox">123</textarea>
 
<input type="radio" name="Auswahlfeld" value="Auswahl 1"> wähle mich
<input type="radio" name="Auswahlfeld" value="Auswahl 2"> oder wähle mich
 
<select name="EinfachSelektion">
    <option value="Option 1">wähle mich</option>
    <option value="Option 2">oder wähle mich</option>
</select>
~~~

Der Zugriff auf einen Wert dieses Typs erfolgt einfach über den Namen als Arrayschlüssel, bspw. so für ein per POST übermitteltes Formular: 

~~~ php
echo $_POST['Textfeld'];
echo $_POST['Textbox'];
echo $_POST['Auswahlfeld'];
echo $_POST['EinfachSelektion'];
~~~

Dieses Script wird mit den oben vorgegebenen Felddaten nacheinander "*abc*", "*123*" und – je nach Auswahl – "*Auswahl 1*" bzw. "*Auswahl 2*", "*Option 1*" bzw. "*Option 2*" ausgeben. 


#### Mehrdimensionale Elementtypen

Alle anderen Eingabeelemente (außer Buttons, die genau genommen auch als solche benutzt werden können) erzeugen mehrdimensionale Daten. Das liegt in der Natur der Eingabe begründet: Sobald mehrere Optionen auswählbar sind, müssen diese Werte auch als Wertmenge übertragen werden. Zu nennen sind hier Checkbox-Elemente und Select-Auswahlen mit einem `multiple` Attribut. 

~~~ php
<input type="checkbox" name="Auswahlfeld[]" value="Auswahl 1"> wähle mich
<input type="checkbox" name="Auswahlfeld[]" value="Auswahl 2"> wähle mich auch
 
<select name="MehrfachSelektion[]">
    <option value="Option 1">wähle mich</option>
    <option value="Option 2">und wähle mich</option>
</select>
~~~

Entscheidend sind hier die [] im name Attribut, die das Feld als Mehrfachauswahl kennzeichnen. 

~~~ php
// Ausgabe der Mengen der ausgewählten Werte
print_r($_POST['Auswahlfeld']);
print_r($_POST['MehrfachSelektion']);
 
// Ausgabe der ersten Auswahl des Selektfeldes
echo $_POST['MehrfachSelektion'][0];
~~~

Wiederum wird auf einen Wert über den Namen als Arrayschlüssel zugegriffen. Genauer gesagt auf die übertragene Menge von Werten, denn die Abfrage wird stets ein Array zurückliefern. Ein konkreter Auswahlwert läßt sich wiederum durch einen numerischen Schlüssel auslesen. Dabei werden die ausgewählten Werte fortlaufend numeriert im Array aufgeschlüsselt. 

<div class="alert alert-info"><strong>Information! </strong>Genau betrachtet können auch oben genannte 'skalare' Elementtypen mit einem [] erweitert werden, um ihre Werte in der Parametermenge als Array abzubilden. In bestimmten Fällen – meist um eine JavaScript Funktionalität umzusetzen – kann dieses Verhalten sinnvoll sein.</div>

##### Vorhergehende Existenz-Prüfung

Der Zugriff auf einen konkreten Wert einer Mehrfachauswahl kann tückisch sein. Werden bspw. keine Elemente angewählt oder ist die Anzahl der ausgewählten Optionen kleiner als der angeforderte Index, wird PHP angewiesen, auf einen nicht existierenden Wert (genauer: Arrayschlüssel) zuzugreifen und wird diesen Versuch mit einer Fehlermeldung quittieren. 

Dieser Effekt läßt sich durch eine vorhergehende Variablenprüfung verhindern. Bspw. stehen die Befehle `isset()`, `array_key_exists()` und `empty()` zur Verfügung, wobei letzterer noch einen Mehrwert erfüllt. 

Bezugnehmend auf den obigen Code erfüllt `isset()` hier seinen Zweck 

~~~ php
// Ausgabe der ersten Auswahl des Selektfeldes
if (isset($_POST['MehrfachSelektion'][0])) {
    echo $_POST['MehrfachSelektion'][0];
}
~~~

solange nicht unterschieden werden soll, ob nur der erste Eintrag des Feldes "MehrfachSelektion" existiert (also mindestens ein Wert gewählt wurde) oder ob "MehrfachSelektion" *überhaupt* existiert. 


##### Vorbestimmte Wertmengenschlüssel

Ein anderer Ansatz, der dieses Problem weiter beleuchtet, besteht darin, die automatische Numerierung übertragener Feldwerte zu unterbinden, indem im HTML Formelement bereits konkrete Schlüssel vergeben werden. Üblicherweise werden hier Strings verwendet, numerische Schlüssel sind aber auch durchaus möglich. 

~~~ php
<input type="checkbox" name="AuswahlfeldAssoc[a]" value="Auswahl 1"> wähle mich
<input type="checkbox" name="AuswahlfeldAssoc[b]" value="Auswahl 2"> wähle mich auch
 
<input type="checkbox" name="AuswahlfeldNum[3]" value="Auswahl 1"> wähle mich
<input type="checkbox" name="AuswahlfeldNum[1000]" value="Auswahl 2"> wähle mich auch
~~~

Ein `print_r($_POST)` nach Ankreuzen aller Felder wird also liefern: 

~~~ php
Array (
   [AuswahlfeldAssoc] => Array
       (
           [a] => Auswahl 1
           [b] => Auswahl 2
       )

   [AuswahlfeldNum] => Array
       (
           [3] => Auswahl 1
           [1000] => Auswahl 2
       )
)
~~~

##### Spezielle Übergabeverhalten

Radio- und Checkboxes, sowie Mehrfachselektionen erfordern eine zusätzliche Aufmerksamkeit. Diese Elementtypen legen bei der Datenübergabe ein besonderes Verhalten an den Tag: Nur Elemente, von denen die im Formular mindestens eine Option angekreuzt bzw. ausgewählt wurde, werden übertragen. Von nicht angewählten Formularelementen tauchen also auch nicht die Elementnamen im Parameterarray auf. Demgegenüber werden bspw. Textfelder immer übertragen, auch wenn die Eingabe leer ist.

In Kombination mit Ebengesagtem zur Existenzprüfung ergibt sich ein neuer Ansatz zur Checkbox-Verarbeitung.
Aus Sicht von HTML bilden die Elemente weiterhin eine Gruppe, während aus Sicht von PHP jedes Element nun für sich betrachtet werden kann und sich der binäre Zustand (Checkbox an/aus) nicht wie bisher über seinen value, sondern über die Existenz des Elements in der Menge der übertragenen Parameterwerte (bzw. des Elementnamens in der Menge der Parameterschlüssel) ergibt.

Gegenübergestellt kann eine Optionswahl also so aussehen:

~~~ php
<input type="checkbox" name="Auswahlfeld[]" value="Auswahl 1"> wähle mich
<input type="checkbox" name="Auswahlfeld[]" value="Auswahl 2"> wähle mich auch
~~~

~~~ php
if (in_array('Auswahl 1' , $_POST['Auswahlfeld'])) {
    echo 'die erste Option wurde gewählt';
}
~~~

aber auch so:

~~~ php
<input type="checkbox" name="AuswahlfeldAssoc['Auswahl 1']" value="on"> wähle mich
<input type="checkbox" name="AuswahlfeldAssoc['Auswahl 2']" value="on"> wähle mich auch
~~~

~~~ php
if (isset($_POST['AuswahlfeldAssoc']['Auswahl 1'])) {
    echo 'die erste Option wurde gewählt';
}
~~~

Die zweite Variante wird oft benutzt, um gleichzeitig zwei Daten über eine Checkbox zu übergeben, der zweite Wert wird hier alternativ zum oben verwendeten "on" angegeben.

#### Datentypen

Steigt man tiefer in PHP ein und beschäftigt sich mit Typen und expliziter/impliziter Umwandlung, ist es wichtig zu wissen, dass HTML-Formelemente nach einem Submit stets Stringtypen (bzw. Arrays aus Stringtypen) im Parameter Array erzeugen.

Dieses Verhalten gilt es z.B. bei der Parametervalidierung zu beachten. So wird die nachfolgende Prüfung unabhängig von der Eingabe stets anschlagen:

~~~ php
if (false === is_int($_POST['Anzahl'])) {
    echo 'ungültige Menge';
}
~~~


Abhilfe schafft im konkreten Fall `is_numeric()`, allgemein eine semantische Prüfung, bspw. durch reguläre Ausdrücke. Eine interessante Lösung für INT Typen (analog auch Float) ist eine Gleichheits- (nicht Identitäts!) Prüfung mit einer explizit typ-gecasteten Kopie des Eingabewertes:

~~~ php
if ($_POST['Anzahl'] != (int) $_POST['Anzahl']) {
    echo 'ungültige Menge';
}
~~~

Jede Art von nicht-INT-Eingabe wird hier durch die explizite Typumwandlung durch `(int)` eine 0, und damit einen von der Eingabe verschiedenen Wert, erzeugen.

### Komplettbeispiel

Beispielhaft soll hier ein minimaler Personendatensatz übertragen und von PHP strukturiert ausgegeben werden. Als einfache Typprüfung wird exemplarisch eine Altersprüfung vorgenommen.

~~~ php
<!DOCTYPE html>
<html>
    <head>
        <title>Anmeldung</title>
        <meta charset="UTF-8">
    </head>
    <body>
        <h1>Anmeldung</h1>
        <form action="ausgabe.php" method="post">
            <label>Anrede:</label>
            <select name="Anrede">
                <option value="Herr">Herr</option>
                <option value="Frau">Frau</option>
            </select><br>

            <label>Name:</label> 
            <input type="text" name="Name" value=""><br>

            <label>Alter:</label>
            <input type="text" name="Alter" value=""><br>
            <label>Sonstiges:</label>
            <input type="checkbox" name="Raucher" value="ja"> ich bin Raucher<br>

            <input type="radio" name="Kost" value="halb"> Halbpension<br>
            <input type="radio" name="Kost" value="voll" checked="checked"> Vollpension<br>

            <input type="submit" value="Absenden">
        </form>
    </body>
</html> <html>
    <head>
        <title>Anmeldung</title>
    </head>
    <body>
<?php
 
// minimale Validierung: Altersprüfung
 
if (empty($_POST['Alter']) || false === is_numeric($_POST['Alter'])) {
    die('<p>Es wurde kein gültiges Alter angegeben. Die Anmeldung wurde abgebrochen.</p></body></html>');
}
 
if ($_POST['Alter'] < 18) {
    die('<p>Du bist leider zu jung für eine Anmeldung. Die Anmeldung wurde abgebrochen.</p></body></html>');
}
 
// hier existieren ungeprüfte und ungefilterte Werte. Kein Beispiel für ein Livesystem!
 
echo '<p>Hallo ' . $_POST['Anrede'] . ' ' . $_POST['Name'] . ', willkommen in unserer Anmeldung.</p>';
echo '<p>Ihre Wahl:</p><ul>';
if (isset($_POST['Raucher'])) {
    echo '<li>Raucherzimmer</li>';
}
 
$kost = 'voll' == $_POST['Kost'] ? 'Vollpension' : 'Halbpension';
echo '<li>' . $kost . '</li>';
echo '</ul>';
 
?>
    </body>
</html>
~~~

Wie dieses Beispiel als Affenformular und mit kompletter Eingabeprüfung aussieht, kann unter den entsprechenden Wiki-Artikeln nachgelesen werden.

### Weitere Beiträge zum Thema

[Affenformular (Standardverfahren)](http://php-de.github.io/form/affenformular.html)
[Eingabevalidierung](http://www.php.de/wiki-php/index.php/Validierung)
[Parametersicherheit](http://www.php.de/wiki-php/index.php?title=Parametersicherheit&action=edit)

