---
layout: guide
permalink: /jumpto/validierung/
group: "Allgemein"
title: "Validierung"
creator: nikosch
author:
    -   name: nikosch
        profile: 2314
    -   name: hausl
        profile: 21246

inhalt:
    -   name: "Ansätze"
        anchor: anstze
        simple: ""

    -   name: "Zu prüfende Daten"
        anchor: zu-prfende-daten
        simple: ""

    -   name: "Abgrenzung"
        anchor: abgrenzung
        simple: ""

entry-type: in-discussion
---


Unter **Validierung** oder **Eingabevalidierung** (engl. *valid* = gültig) versteht man allgemein die Prüfung der Integrität von Daten, also die Übereinstimmung eines gegebenen Wertes mit einem erwarteten Wertschema (Einzelheiten siehe unter Ansätze), sozusagen den Vergleich von Soll- und Ist-Zustand. Weiter gefasst meint Validierung meist die Prüfung von Werten, die einem PHP Script als [Parameterdaten](http://php-de.github.io/request-handling/gpc.html) übermittelt wurden. 

Die Eingabevalidierung muß sowohl Nutzerfehler (Fehleingaben, Fehlbedienung), gezielte Datenmanipulation als auch eventuelle Softwarefehler berücksichtigen. Deshalb müssen bei der Entwicklung mögliche Parameterabweichungen gründlich analysiert und Datentypen durch vorausgehende Spezifikation des Eingabe- und Verarbeitungsprozesses möglichst präzise definiert werden. 

### Ansätze

Eine Prüfung solcher Daten kann auf verschiedenen Wegen und hinsichtlich unterschiedlicher Kriterien erfolgen. Motivation für eine Datenprüfung kann u.a. sein: 

- Vermeiden der Angabe von Falschdaten (Wahrung der Datenauthentizität) 
- Vermeidung von Verarbeitungsfehlern 
- Vermeidung von Datenmanipulation 
- Unterbinden und Erkennen von Angriffen auf die Software- oder Serverinfrastruktur 

Je nach Maßgabe zum gewählten Prüfverhalten der Anwendung können daraus verschiedene Prüfarten abgeleitet werden. 

#### Typprüfung und semantische Validierung

Diese Bereiche sind nicht vollständig voneinander zu trennen, besonders da PHP eine schwach typisierte Sprache ist und Request-Parameterdaten bspw. generell als String übertragen werden (vgl. [Formularverarbeitung](http://php-de.github.io/form/form.html)). 

Typische Beispiele konkreter Datentypen: 

- Eine übliche Altersangabe wird immer vom Typ Ganzzahl (INT) sein 
- Eine Angabe zum Einkommen ist numerisch, also ein INT oder Float Typ 

Beispiele abstrakter Feldtypen: 

- Ein Name kann zwar Sonderzeichen wie Umlaute, nie aber Zeichen wie ">" oder "§" enthalten 
- Eine Altersangabe wird nie negativ oder größer als (sagen wir) 120 sein. Sinnvollere Werte ergeben sich auch aus der Zielgruppe der Anwendung 
- Das Format einer Emailadresse ist in einer Spezifikation festgelegt. Eine Emailangabe kann diesbezüglich abgeglichen werden. 
- Eine Währungsangabe erlaubt nur bestimmte Zeichen 
- Eine ID ist als Md5-Hash erzeugt worden und erlaubt nur Hexadezimale Zeichen 
- Eine deutsche Postleitzahl ist eine 5-stellige Zahl, die aber führende Nullen erlaubt 


#### Anwendungsspezifische Prüfkriterien

Beispiele für Anwendungsspezifika: 

- Eine Altersangabe für einen Onlineshop sollte einen Wert 18 oder höher enthalten 
- Eine Emailangabe darf bestimmte Domains nicht im Domainteil enthalten 
- Eine freie Textangabe darf nicht kürzer als 3 Zeichen und nicht länger als 1000 sein (z.B. wegen Anzeigecharakteristika) 
- Eine Textangabe darf nicht länger als 255 sein (z.B. wegen der Maximalgröße eines Datenbankfeldes) 
- Eine Angabe ist als erforderlich markiert und darf kein leerer String sein 

#### Sicherheitsrelevante Prüfkriterien

Hierunter fallen alle Kriterien, die die Anzeige oder Funktion der Anwendung bewußt manipulieren (Code Injection, XSS) oder versuchen, Zugang auf nicht dafür vorgesehene Ressourcen oder Daten zu erlangen (eval geparster Code, als Pfadbestandteile eingebundene URL Parameter ...). 

Beispiele: 

- Pfadangabe darf keine `/../` Bereiche oder `http://` enthalten 
- Eine freie Textangabe darf keine Zeichenkette `<script` enthalten 
- Ein Datenbanksuchstring darf keine `/*` oder `*/` Zeichenketten oder SQL Schlüsselwörter enthalten 

Je nach Toleranz der Anwendung können folgende Fehler als Angriffsversuch oder weniger restriktiv als Fehleingabe kategorisiert und dementsprechend verarbeitet werden: 

- bestimmte Auswahlelemente eines Formulars können nur bestimmte Werte annehmen/liefern.
Anderslautende Parameterdaten können ein Hinweis auf eine Manipulation oder einen Software- oder Übertragungsfehler sein. 
- bestimmte Auswahlelemente liefern festgelegte Datentypen (so z.B. Checkboxfelder einen Array-Typ).
Anderslautende Parametertypen können ein Hinweis auf eine Manipulation der Eingabe sein 
- Herkunft: Die Parameterübergabe wird über einen bestimmten Kanal (Requesttyp) erwartet. 
Abweichungen weisen auf gezielte Manipulationsversuche oder Softwarefehler hin 

Je nach Ansatz und Unsicherheitsfaktor kann eine Validierung hier den Abbruch einer Anwendung veranlassen, ein Logging eines verdächtigen Wertes oder einen kritischen Wert einem speziellen Filter übergeben (Werte solcher Kategorie sollten im Allgemeinen allerdings eher immer gefiltert werden). 

Sicherheitsrelevante Validierung kann also allgemein als informationell verstanden werden (bspw. zur Angriffsanalyse einer Anwendung herangezogen werden) oder dem frühzeitigem Abbruch der Applikation dienen. 

### Zu prüfende Daten

Generell gilt: 

<div class="alert alert-info"><strong>Merke: </strong>Alle vom Client aus übersendeten Daten sind zu validieren und/oder zu filtern.<br> 
(Leitsatz: *never trust user input* – vertraue niemals Nutzereingaben)</div>


#### URL Parameter und Forumlareingaben

Die offensichtlichsten Daten sind die Parameter, die durch Auswertung der URL oder Eingabe in Formularfelder entstehen. 

Keinesfalls zu vergessen ist die Möglichkeit, dass weitere, nicht vorgesehene Parameter übersandt werden können. Gerade in Verbindung mit der Ini-Einstellung [register_globals_gpc](http://php-de.github.io/general/php-ini.html#registerglobals) und nichtinitialiserten Variablen ist dies ein nicht zu unterschätzender Angriffsvektor. Möglichkeiten bietet sich dazu viele: 

- direktes Schreiben der Daten in die URL 
- Verwenden eines selbst erstellten Formulars 
- Verwenden eines durch Javascript manipulierten Formulars 
- Direktes Eintragen der Parameterdaten in den Header des Requests (bspw,. über einen Proxy) 

Daneben gibt es aber weitere Daten, die nicht zu vergessen sind: 

#### Gespeicherte Daten

Alle Daten, die die Webanwendung ohne vorherige Filterung/Validierung speichert und später verwendet, sind Usereingaben gleichzusetzen und spätestens bei der Verwendung zu validieren. Da dieses Verfahren Fehlerpotential nahezu impliziert, ist von der Speicherung ungefilteter Daten generell abzuraten. 

#### Cookiedaten

Auch wenn ein Cookie zunächst sicher scheint, weil alle Daten ja vom Server gesetzt werden – der Cookie liegt auf dem Client-PC und damit ist es dem Client vorbehalten, diese Daten bei jedem Request zu übersenden. Sowohl der Cookie selbst (Editieren der Datei) als auch die Headerangabe im Verbindungsaufruf können manipuliert werden. 

Auch für Cookiedaten gilt das oben gesagte: Nur weil die Anwendung selbst keinen Cookie erstellt, ist das kein Garant dafür, dass nicht trotzdem Cookiedaten übersandt werden. 

#### Browserdaten

Eine Reihe von Parametern wird vom Browser selbst mitgesendet. Typische, oft auch ausgewertete Daten sind hier bspw. eine Browserkennung, Sprach- und Codierungseinstellungen. 

##### Fallstrick vermeintliche Serverdaten

Erst eine intensive Beschäftigung mit Client-Server-Kommunikation offenbart den Umfang der Problematik. Parameterdaten sind weit mehr als Formulareingaben und URL-Parameter. Auch viele Angaben wie Browsersignatur oder aktueller Scriptname werden vom Browser erzeugt und werden als Teil des übermittelten Datenstroms an verschiedenen Stellen Teil einer Manipulationsgefahr. 

Gerade weil Parameter wie `$_SERVER['PHP_SELF']` weit weniger bekannte Angriffsvektoren darstellen, können sie ein lohnendes Ziel für Angreifer darstellen – schließlich ist die Manipulation ebenso einfach die die eines Form-Eingabefeldes. Schließlich suggeriert auch der Bezeichner `$_SERVER` eine trügerische Sicherheit für enthaltene Daten. Das Bewußtsein, wie Daten in einem Client-Server-Prozess entstehen hilft enorm im Verständnis solcher Unsicherheiten. 

Bsp. 

~~~ php
<form action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post">
    <input type="text" name="search">
    <input type="submit" value="Suchen">
</form>
~~~

<div class="alert alert-danger"><strong>Achtung! </strong>Häufig gemachter Fehler: Das vorliegende Beispiel zeigt eine weit verbreitete, sicherheitskritische Angabe, um eine Form-Action wieder auf das aktuelle Script zu leiten (Affenformular).</div>
 

### Abgrenzung

#### Datenfilterung

Genau genommen ist die Eingabenfilterung eher ein Teilbereich der Formularverarbeitung, kann aber auch nicht gänzlich losgelöst von der Validierung betrachtet werden. Insbesondere muß eine Validierung als reiner Erkennungsvorgang stets vor der Eingabefilterung (also der expliziten Löschung oder Aufbereitung von Fehlwerten) erfolgen. Desweiteren kann eine Filterung bestimmten Arten der Validierung vorangestellt werden und den Prozess vereinfachen. 

Bsp. 

~~~ php
// Filterung: explizite Typzuweisung INT
$alter = (int) $_GET['Alter'];
 
// Validierung des Wertebereiches ohne weitere Typprüfung
if (1 > $alter || $alter > 100) {
    $error = 'Als Alter muß eine Ganze Zahl zwischen 1 und 100 angegeben werden.';
}
~~~

Vereinfachung der Altersvalidierung durch vorangehendes explizites Typecasting. Nicht-numerische Stringwerte und andere Datentypen werden dabei zu 0 und fallen automatisch aus dem Raster gültiger Altersangaben. 

~~~ php
// Filterung: Entfernung aller HTML Tags
$meldung = strip_tags($_POST['Meldung']);
 
// Not Null Validierung des resultierenden Codes
if (empty($meldung)) {
    $error = 'Die Eingabe ist leer.';
}
 
// Validierung der Länge des resultierenden Codes
if (1000 < $strlen($meldung)) {
    $error = 'Der Text ist zu lang.';
}
~~~

Der Filter zur Entfernung von HTML Formatierungen wird vorgezogen, um die Validierung der Textlänge auf den tatsächlich verarbeiteten Text anzuwenden. Codepostings ohne Plaintext ergäben sonst nach der Filterung einen leeren Eintrag. 

#### Verifikation
