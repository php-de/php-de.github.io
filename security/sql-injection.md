---
layout: guide

permalink: /jumpto/sql-injection/
title: "SQL-Injection"
group: "Sicherheit"
orderId: 8

creator: nikosch

author:
    -   name: nikosch
        profile: 2314

    -   name: mermshaus
        profile: 15041
        
    -   name: hausl 
        profile: 21246

inhalt:
    -   name: "Ursprung"
        anchor: ursprung
        simple: ""
        
    -   name: "Gegenmaßnahmen"
        anchor: gegenmanahmen
        simple: ""

    -   name: "Anwendung"
        anchor: anwendung
        simple: ""

    -   name: "Sicher ist sicher"
        anchor: sicher-ist-sicher
        simple: ""

    -   name: "Prepared-Statements"
        anchor: prepared-statements
        simple: ""


entry-type: in-discussion
---

### Ursprung

SQL-Injections fallen in den Bereich der
[Kontextwechsel-Probleme]({{ site.url }}/jumpto/kontextwechsel/).

SQL-Queries werden in PHP als normaler String zusammengebaut. Dynamisch
hinzugefügte Werte (etwa eine Benutzereingabe in `$_POST['name']`) können dabei
die vorgesehene Logik der Query verändern, wenn sie für den Kontext syntaktisch
relevante Zeichen (etwa die Anführungszeichen `"` und `'`) enthalten.

~~~ php
$_POST['name'] = "Max' OR 1 --";
$query = "DELETE FROM nutzer WHERE name = '" . $_POST['name'] . "'";
// Resultierender String:
// DELETE FROM nutzer WHERE name = 'Max' OR 1 --'
~~~

In diesem Beispiel gelingt es der Eingabe in `$_POST['name']`, durch ein
geschickt platziertes Anführungszeichen den Kontext „String in einer SQL-Query“
zu verlassen und in den Kontext „SQL-Query“ darüber auszubrechen. Dort wird die
Bedingung, welche Einträge aus `nutzer` gelöscht werden sollen, um den Teil `OR
1` erweitert und die Abfrage sofort danach mit einem Kommentar (eingeleitet
durch `--`) beendet. Das führt dazu, dass die Gesamtbedingung für jeden
Datensatz in dieser Tabelle erfüllt ist. Durch die fertige Abfrage werden somit
*alle* Datensätze in der Tabelle gelöscht.

Wie bei allen Kontextwechseln muss derlei unerwünschten Effekten kein gezielter
Angriffsversuch vorausgehen. Im Beispiel würde bereits die Eingabe eines Namens
wie `O'Brian` die Query syntaktisch ungültig werden und fehlschlagen lassen.


### Gegenmaßnahmen


Zur Vermeidung von SQL-Injections dienen Funktionen, die die syntaktisch
relevanten Zeichen, die in Eingaben enthalten sein können, durch Escaping so
anpassen, dass sie nicht mehr zu einem Kontextwechsel führen. Aus `"` wird so
beispielsweise `\"`. Das verdeutlicht dem Datenbanksystem, dass hier kein
Stringbegrenzer gemeint ist (syntaktische Funktion), sondern lediglich das
konkrete Zeichen `"` (reiner Inhalt).


### Anwendung 

Für jede Datenbankschnittstelle existiert mindestens eine spezielle Funktion
oder Methode, die dieses Escaping durchführen kann. Es *muss* diese zur
Schnittstelle gehörende Funktion genutzt werden. Eine allgemeine Funktion wie
`addslashes` ist *nicht* ausreichend. Eine Auswahl dieser Funktionen für einige
Schnittstellen:

* mysql (veraltet): [`mysql_real_escape_string`](http://us1.php.net/manual/en/function.mysql-real-escape-string.php)
* mysqli: [`mysqli_real_escape_string`](http://us1.php.net/manual/en/mysqli.real-escape-string.php)
* PDO: [`PDO::Quote`](http://www.php.net/manual/en/pdo.quote.php)
* postgresql: [`pg_escape_string`](http://www.php.net/manual/en/function.pg-escape-string.php) (und andere)

Die Anwendung dieser Funktionen ist quasi immer gleich und nicht sonderlich
kompliziert: Bevor ein Wert in den Query-String eingefügt wird, muss er die
passende Escape-Funktion durchlaufen.

~~~ php
$query = "
    DELETE FROM nutzer
    WHERE name = '" . mysqli_real_escape_string($link, $_POST['name']) . "'
";
~~~


### Sicher ist sicher


Es ist zu empfehlen, *jeden* variablen Wert, der in Query-Strings eingefügt
wird, durch die passende Escape-Funktion zu schicken. Also auch dann, wenn der
Wert je nach Logik der Anwendung nur beispielsweise aus `[0-9A-Za-z]` bestehen
kann. Diese Beschränkung könnte sich ändern oder sie könnte durch einen Bug
umgangen werden. Auch sollte kein Entwickler kognitive Leistung dafür
aufbringen müssen, darüber nachzudenken, warum an einer Stelle eine
Escape-Funktion fehlt. Schließlich wäre es denkbar, dass sie versehentlich
vergessen wurde.


### Prepared-Statements

Viele Datenbankschnittstellen unterstützen zusätzlich das Konzept der [Prepared
Statements](https://de.wikipedia.org/wiki/Prepared_Statement), das ebenfalls
SQL-Injections verhindert.
