---
layout: guide
permalink: /jumpto/:title/
title: "FAQ"
group: "Allgemein"
creator: nikosch

author:
    - name: nikosch
      profile: 2314

    - name: Manko10
      profile: 1139

    - name: mermshaus
      profile: 15041

entry-type: in-discussion
---

{::options parse_block_html="true" /}

Frequently Asked Questions -- häufig gestellte Fragen aus dem Themenbereich des
Forums.



**„Warum sollte ich eine Mailerklasse statt der `mail`-Funktion verwenden?“**
<a href="#mailerklasse">#</a>
{: #mailerklasse}

<div style="margin-left: 20px;">

> Während es für die kleine, schnelle Info-Mail gerade noch okay ist, versuchen
> Leute immer wieder, das Rad neu zu erfinden, wenn es um Dinge wie HTML-Mails,
> Dateianhänge, eingebette Daten oder die passenden Mail-Header geht.
>
> Das muss heutzutage absolut nicht sein, denn dieses Rad wurde schon zu oft
> neu erfunden, und die Chance, dass E-Mails wegen Kleinigkeiten (falscher Umbruch,
> ungültiger Header, falsches Datumsformat, …) von anderen Mailservern als Spam
> markiert oder ganz abgelehnt werden oder dass der Mailclient sie am Ende nicht
> ordentlich darstellen kann, ist einfach zu groß.
>
> *\[Kleinere Fehler behoben.\]*

- [Mail() ist tot, es lebe mail()](http://www.robo47.net/text/38-Mail-ist-tot-es-lebe-mail)

Geeignete Mailerklassen sind etwa [PHPMailer](http://phpmailer.worxware.com/)
und [Swift Mailer](http://swiftmailer.org/). Siehe hierzu auch [diesen
Artikel](http://php-de.github.io/email/mail-class.html).

Bei der (nicht empfohlenen) direkten Nutzung der `mail`-Funktion muss
sichergestellt werden, dass
[E-Mail-Injection](http://de.wikipedia.org/wiki/E-Mail-Injection) nicht möglich
ist. Findige Leute können sonst beispielsweise ein einfaches Kontaktformular
für den Versand von Spam an Dritte benutzen.

- [Mail headers injections with PHP](http://www.phpsecure.info/v2/article/MailHeadersInject.en.php)

</div>



**„Wie kann ich erreichen, dass mein Formular bei Unvollständigkeit wieder
ausgefüllt wird?“**
<a href="#formular-gefuellt">#</a>
{: #formular-gefuellt}

<div style="margin-left: 20px;">

Ein Affenformular bietet genau diese Funktionalität. siehe
[Affenformular](http://php-de.github.io/form/affenformular.html)

</div>



**„Was ist ein Affenformular?“**
<a href="#affenformular">#</a>
{: #affenformular}

<div style="margin-left: 20px;">

Siehe: vorige Frage.

</div>



**„Ich erhalte immer die Meldung ‚headers already sent‘.“**
<a href="#headers-already-sent">#</a>
{: #headers-already-sent}

<div style="margin-left: 20px;">

Es darf absolut keine Ausgabe vor Header-Aktionen erfolgen. Bereits ein Leer-
oder Steuerzeichen außerhalb von <?php ... ?> genügt dafür. Siehe:
[Standardfehler](http://php-de.github.io/debugging/standardfehler.html).

</div>



**„Nach Aktion XY zeigt mein Browser nur noch eine weiße Seite.“**
<a href="#weisse-seite">#</a>
{: #weisse-seite}

<div style="margin-left: 20px;">

Wahrscheinlich handelt es sich um einen Parser-Fehler. Üblicherweise hast Du
einen Stringbegrenzer, ein Semikolon oder eine Klammer vergessen. Siehe:
[Standardfehler](http://php-de.github.io/debugging/standardfehler.html).

</div>



**„Warum werden auf meiner Seite die Umlaute falsch dargestellt, obwohl ich
UTF-8 im HTML-Dokument angegeben habe?“**
<a href="#html-charset">#</a>
{: #html-charset}

<div style="margin-left: 20px;">

Die Zeichensatz-Angabe im `meta`-Element im HTML-Code ist nur eine von mehreren
Möglichkeiten, den Zeichensatz, in dem der Inhalt einer Seite kodiert ist, zu
benennen. Das `meta`-Element hat dabei nur die vierthöchste Priorität.

> In the case of conflict between multiple encoding declarations, precedence
rules apply to determine which declaration wins out. For XHTML and HTML, the
precedence is as follows, with 1 being the highest.
>
> 1. HTTP Content-Type header
> 2. byte-order mark (BOM)
> 3. XML declaration
> 4. meta element
> 5. link charset attribute

* [Declaring character encodings in HTML](http://www.w3.org/International/questions/qa-html-encoding-declarations)

Die Punkte 2 und 3 der Liste kommen in der Praxis selten vor und sind zu
vernachlässigen. Interessant ist allerdings Punkt 1, der `Content-Type`-Header
der HTTP-Response. Dieser hat die höchste Priorität und kann in der
Webserver-Konfiguration mit einem Standardwert vorbelegt werden, der dann die
`meta`-Angabe im HTML-Code überschreibt. Das ist in aller Regel die Ursache für
die falsche Darstellung der Nicht-ASCII-Zeichen. Welche Charset-Angaben für
eine Seite gesetzt sind, kann beispielsweise mit dem [Internationalization
Checker](http://validator.w3.org/i18n-checker/) des W3C geprüft werden. Der
`Content-Type`-Header kann über die Konfiguration des Webservers gesetzt werden
oder auch direkt im PHP-Code:

~~~ php
header('Content-Type: text/html; charset=UTF-8');
~~~

Das Hinzufügen dieser Zeile löst das Problem meist. Wie jeder `header`-Aufruf
muss auch dieser vor der ersten Ausgabe des Scripts erfolgen.

</div>



**„Was ist eine SQL-Injection und was kann ich dagegen unternehmen?“**
<a href="#sql-injection">#</a>
{: #sql-injection}

<div style="margin-left: 20px;">

SQL-Injections fallen in den Bereich der
[Kontextwechsel-Probleme](http://php-de.github.io/general/kontextwechsel.html).

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

Zur Vermeidung von SQL-Injections dienen Funktionen, die die syntaktisch
relevanten Zeichen, die in Eingaben enthalten sein können, durch Escaping so
anpassen, dass sie nicht mehr zu einem Kontextwechsel führen. Aus `"` wird so
beispielsweise `\"`. Das verdeutlicht dem Datenbanksystem, dass hier kein
Stringbegrenzer gemeint ist (syntaktische Funktion), sondern lediglich das
konkrete Zeichen `"` (reiner Inhalt).

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

Es ist zu empfehlen, *jeden* variablen Wert, der in Query-Strings eingefügt
wird, durch die passende Escape-Funktion zu schicken. Also auch dann, wenn der
Wert je nach Logik der Anwendung nur beispielsweise aus `[0-9A-Za-z]` bestehen
kann. Diese Beschränkung könnte sich ändern oder sie könnte durch einen Bug
umgangen werden. Auch sollte kein Entwickler kognitive Leistung dafür
aufbringen müssen, darüber nachzudenken, warum an einer Stelle eine
Escape-Funktion fehlt. Schließlich wäre es denkbar, dass sie versehentlich
vergessen wurde.

Viele Datenbankschnittstellen unterstützen zusätzlich das Konzept der [Prepared
Statements](https://de.wikipedia.org/wiki/Prepared_Statement), das ebenfalls
SQL-Injections verhindert.

</div>



**„You have an error in your SQL syntax; check the manual that corresponds to
your MySQL server version for the right syntax to use near '…' at line …“ /
„Warning: mysql_fetch_row() expects parameter 1 to be resource, boolean
given“**
<a href="#sql-error">#</a>
{: #sql-error}

<div style="margin-left: 20px;">

Der SQL-String für die Datenbankabfrage ist fehlerhaft. Lass dir den fertigen
String der entsprechenden Query vor der Anfrage testweise ausgeben. Siehe:
[SQL-Fehlerbehebung](http://php-de.github.io/debugging/sql.html).

</div>



**„Ist die mysql-Erweiterung wirklich veraltet und sollte nicht mehr genutzt
werden?“**
<a href="#deprecated-mysql">#</a>
{: #deprecated-mysql}

<div style="margin-left: 20px;">

Ja. Das „mysql“ bezieht sich hier allerdings *nicht* auf das komplette
Datenbanksystem MySQL, sondern ist lediglich der Name eines der drei APIs, die
PHP zur Kommunikation mit MySQL-Datenbanken nutzen kann. Die anderen beiden
(nicht veralteten) APIs sind [mysqli](http://php.net/mysqli) und
[PDO](http://php.net/pdo). Mehr Hintergründe und Empfehlungen stehen [in der
PHP-Dokumentation](http://php.net/manual/en/mysqlinfo.api.choosing.php).

</div>

