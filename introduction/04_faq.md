---
layout: guide

title:       "FAQ – Häufig gestellte Fragen"
description: "Antworten zu häufig gestellten Fragen zu Themen wie Debugging, SQL-Injections, Cross-Site-Scripting, mysql-Erweiterung, Zeichensätze oder Mailer-Klasse."
group:       "Einführung"
orderId:     4
permalink:   /jumpto/faq/
root:        ../..
entry-type:  in-discussion
creator:     nikosch

author:
    - name:    nikosch
      profile: 2314

    - name:    Manko10
      profile: 1139

    - name:    mermshaus
      profile: 15041

    - name:    hausl
      profile: 21246

inhalt:
    -   name:   "Was ist Debugging und wie debugge ich richtig?"
        anchor: debugging
        simple: ""

    -   name:   "Was ist die alternative Syntax für Kontrollstrukturen?"
        anchor: alternative-syntax
        simple: ""

    -   name:   "Warum sollte ich eine Mailerklasse statt der mail()-Funktion verwenden?"
        anchor: mailerklasse
        simple: ""

    -   name:   "Wie kann ich erreichen, dass mein Formular bei Unvollständigkeit wieder ausgefüllt wird?"
        anchor: formular-gefuellt
        simple: ""

    -   name:   "Was ist ein Affenformular?"
        anchor: affenformular
        simple: ""

    -   name:   "Ich erhalte immer die Meldung \"headers already sent\""
        anchor: headers-already-sent
        simple: ""

    -   name:   "Nach Aktion XY zeigt mein Browser nur noch eine weiße Seite"
        anchor: weisse-seite
        simple: ""

    -   name:   "Warum werden auf meiner Seite die Umlaute falsch dargestellt, obwohl ich UTF-8 im HTML-Dokument angegeben habe?"
        anchor: html-charset
        simple: ""

    -   name:   "Ist die mysql-Erweiterung wirklich veraltet und sollte nicht mehr genutzt werden?"
        anchor: deprecated-mysql
        simple: ""

    -   name:   "Was ist eine SQL-Injection und was kann ich dagegen unternehmen?"
        anchor: sql-injection
        simple: ""

    -   name:   "You have an error in your SQL syntax;  ... Warning: mysql_fetch_row() expects parameter 1 to be resource, boolean given"
        anchor: sql-error
        simple: ""

    -   name:   "\"eval is evil\" .. Das lese ich immer wieder. Warum? Was ist denn so schlimm daran?"
        anchor: eval-is-evil
        simple: ""

    -   name:   "Ist es falsch Bilder in der Datenbank, anstatt im Dateisystem zu speichern?"
        anchor: image-storeloc
        simple: ""

    -   name:   "Warum sollte SELECT * in SQL-Abfragen vermieden werden?"
        anchor: select-star
        simple: ""
---

## [Was ist Debugging und wie debugge ich richtig?](#debugging)
{: #debugging}

Richtig debuggen

1. Man bemerkt, dass ein Skript nicht das tut, was es soll.
2. Man schreibt an den Anfang des Scriptes die Zeile: `error_reporting(-1);`
3. Man verwendet `ini_set('display_errors', true);` damit die Fehler auch angezeigt werden.
4. Man versucht, die Stelle die daran Schuld sein kann, schonmal einzugrenzen. Falls dies nicht geht, wird zunächst das komplette Skript als fehlerhaft angesehen.
5. An markanten Stellen im Skript lässt man sich wichtige Variableninhalte ausgeben und ggf. auch in bedingten Anweisungen eine kurze Ausgabe machen, um zu überprüfen, welche Bedingung ausgeführt wurde. Wichtig bei MySQL Fehlern (*…not a valid MySQL result resource…*): `mysqli_error()` verwenden oder Abfrage ausgeben und zum Beispiel mit phpMyAdmin testen.
6. Schritt 5 wird so lange wiederholt, bis Unstimmigkeiten im Skript auffallen
7. Damit hat man das Problem (Unstimmigkeit) gefunden und kann versuchen diese zu beheben. Hierzu dienen dann die PHP-Dokumentation und andere Quellen als Ratgeber.
8. Lässt sich das konkrete Problem trotzdem nicht beheben, kann man in Foren um Rat fragen.
9. Das Programm läuft und man kann die Debug-Ausgaben wieder entfernen.

Die Ausgaben per `var_dump` oder `echo` kann man sich ersparen, indem man einen Debugger einsetzt.

Auf Produktivsystemen sollte die direkte Fehlerausgabe (Punkte 2 und 3) deaktiviert sein, da Fehlermeldungen nicht selten [sensible Daten preisgeben](http://stackoverflow.com/questions/6455018/why-does-pdo-print-my-password-when-the-connection-fails). Die beiden Einstellungen können zudem auch in der `php.ini`-Datei verändert werden.

- [Ausführlichere Informationen zum Thema Debugging]({{ page.root }}/#debugging)


## [Was ist die alternative Syntax für Kontrollstrukturen?](#alternative-syntax)
{: #alternative-syntax}

Neben der üblichen Syntax für Kontrollstrukturen in PHP (`if`, `for`, `while`, …), die geschweifte Klammern nutzt, um den Körper zu definieren, …

~~~ php
if ($var === 42) {
    // ...
} else {
    // ...
}

while ($i > 0) {
    // ...
}
~~~

…existiert eine [alternative Syntax](http://php.net/manual/en/control-structures.alternative-syntax.php), die für jede Kontrollstruktur ein explizites Schlüsselwort enthält, um das Ende des Körpers anzugeben. Zudem wird die öffnende geschweifte Klammer durch einen Doppelpunkt ersetzt:

~~~ php
if ($var === 42):
    // ...
else:
    // ...
endif;

while ($i > 0):
    // ...
endwhile;
~~~

Beide Syntaxvarianten sind von der Funktionsweise her identisch. Die Nutzung der alternativen Syntax ist in Dateien, die nur PHP-Code enthalten, unüblich. Sie wird aber von vielen Entwicklern gern genutzt, wenn PHP-Code mit HTML-Code vermischt ist, wenn PHP also als Templatesprache zur Generierung von HTML-Ausgaben eingesetzt wird. Einerseits lässt sich dadurch hervorheben, dass es sich bei entsprechendem Code um Template-Code handelt und nicht um „normalen“ Anwendungscode, und andererseits sind die Schlüsselwörter der alternativen Syntax im schnell unübersichtlichen Gemisch aus HTML-Tags und PHP-Code leichter einer bestimmten Kontrollstruktur zuzuordnen, als es bei den generischen geschweiften Klammern der Fall ist.

~~~ php
<?php if ($loggedIn): ?>
  <h1>Hallo Nutzer!</h1>
  <p>Deine neuen Nachrichten:</p>
  <ul>
    <?php foreach ($messages as $message): ?>
    <li>...</li>
    <?php endforeach; ?>
  </ul>
<?php endif; ?>
~~~


## [Warum sollte ich eine Mailerklasse statt der `mail()`-Funktion verwenden?](#mailerklasse)
{: #mailerklasse}

Während es für die kleine, schnelle Info-Mail gerade noch okay ist, versuchen
Leute immer wieder, das Rad neu zu erfinden, wenn es um Dinge wie HTML-Mails,
Dateianhänge, eingebette Daten oder die passenden Mail-Header geht.

Das muss heutzutage absolut nicht sein, denn dieses Rad wurde schon zu oft
neu erfunden, und die Chance, dass E-Mails wegen Kleinigkeiten (falscher Umbruch,
ungültiger Header, falsches Datumsformat, …) von anderen Mailservern als Spam
markiert oder ganz abgelehnt werden oder dass der Mailclient sie am Ende nicht
ordentlich darstellen kann, ist einfach zu groß.

- [Mail-Klassen]({{ page.root }}/jumpto/mail-class/)

Geeignete Mailerklassen sind etwa [PHPMailer](https://github.com/PHPMailer/PHPMailer)
und [Swift Mailer](http://swiftmailer.org/). Siehe hierzu auch [diesen
Artikel]({{ page.root }}/jumpto/mail-class/).

Bei der (nicht empfohlenen) direkten Nutzung der `mail()`-Funktion muss
sichergestellt werden, dass
[E-Mail-Injection](http://de.wikipedia.org/wiki/E-Mail-Injection) nicht möglich
ist. Findige Leute können sonst beispielsweise ein einfaches Kontaktformular
für den Versand von Spam an Dritte benutzen.

- [Mail headers injections with PHP](http://www.phpsecure.info/v2/article/MailHeadersInject.en.php)


## [Wie kann ich erreichen, dass mein Formular bei Unvollständigkeit wieder ausgefüllt wird?](#formular-gefuellt)
{: #formular-gefuellt}

Ein Affenformular bietet genau diese Funktionalität. Siehe [Affenformular]({{ page.root }}/jumpto/affenformular/)


## [Was ist ein Affenformular?](#affenformular)
{: #affenformular}
Siehe: vorige Frage.


## [Ich erhalte immer die Meldung "headers already sent"](#headers-already-sent)
{: #headers-already-sent}

Das HTTP schreibt vor, dass der Header einer Response vor dem Body an den
Client geschickt werden muss. Deshalb muss PHP den Header-String generieren
und absenden, sobald die erste Ausgabe erfolgt. Da es danach keinen Sinn
mehr ergibt, die bereits abgeschickten Header-Daten zu bearbeiten, meldet
PHP eben genau das als Fehler.

Um derartige Situationen zu vermeiden, darf keine Ausgabe vor Header-Aktionen
(Aufrufe der `header`-Funktion) erfolgen. Ausgaben sind alles, was vom
Skript an den Besucher geschickt wird. Das ist beispielsweise HTML-Code
außerhalb von `<?php ... ?>`-Tags oder Aufrufe von Konstrukten/Funktionen
wie `print`, `echo`, `readfile`. Besonders schwierig zu entdecken sind
Leerzeilen hinter einem `?>`-Tag am Dateiende oder [Byte Order
Marks](https://de.wikipedia.org/wiki/Byte_Order_Mark). Siehe auch:
[Standardfehler]({{ page.root }}/jumpto/standardfehler/),
[EVA-Prinzip]({{ page.root }}/jumpto/eva-prinzip/).


## [Nach Aktion XY zeigt mein Browser nur noch eine weiße Seite.](#weisse-seite)
{: #weisse-seite}

Wahrscheinlich handelt es sich um einen Parser-Fehler, also einen syntaktischen Fehler im geschriebenen PHP-Quellcode. Vielleicht wurde ein Stringbegrenzer, ein Semikolon oder eine Klammer vergessen?


## <span id="charset"></span>[Warum werden auf meiner Seite die Umlaute falsch dargestellt, obwohl ich UTF-8 im HTML-Dokument angegeben habe?](#html-charset)
{: #html-charset}

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
vernachlässigen. (Quellcode sollte in der Regel als UTF-8 *ohne* BOM
abgespeichert werden.) Interessant ist allerdings Punkt 1, der
`Content-Type`-Header der HTTP-Response. Dieser hat die höchste Priorität und
kann in der Webserver-Konfiguration mit einem Standardwert vorbelegt werden, der
dann die `meta`-Angabe im HTML-Code überschreibt. Das ist in aller Regel die
Ursache für die falsche Darstellung der Nicht-ASCII-Zeichen. Welche
Charset-Angaben für eine Seite gesetzt sind, kann beispielsweise mit dem
[Internationalization Checker](http://validator.w3.org/i18n-checker/) des
W3C geprüft werden. Der `Content-Type`-Header kann über die Konfiguration
des Webservers gesetzt werden oder auch direkt im PHP-Code:

~~~ php
header('Content-Type: text/html; charset=UTF-8');
~~~

Das Hinzufügen dieser Zeile löst das Problem meist. Wie jeder `header`-Aufruf
muss auch dieser vor der ersten Ausgabe des Scripts erfolgen.


## [Ist die mysql-Erweiterung wirklich veraltet und sollte nicht mehr genutzt werden?](#deprecated-mysql)
{: #deprecated-mysql}

Ja. Das „mysql“ bezieht sich hier allerdings *nicht* auf das komplette
Datenbanksystem MySQL, sondern ist lediglich der Name eines der drei APIs, die
PHP zur Kommunikation mit MySQL-Datenbanken nutzen kann. Die anderen beiden
(nicht veralteten) APIs sind [mysqli](http://php.net/mysqli) und
[PDO](http://php.net/pdo). Ab PHP 7 ist die alte mysql-Erweiterung nicht mehr verfügbar. Weitere Hintergründe und Empfehlungen sind [in der
PHP-Dokumentation](http://php.net/manual/en/mysqlinfo.api.choosing.php) zu finden. Ein kurzes Anwendungsbeispiel zu PDO gibt es auch [hier in der Wissenssammlung]({{ page.root }}/jumpto/pdo/).


## [Was ist eine SQL-Injection und was kann ich dagegen unternehmen?](#sql-injection)
{: #sql-injection}

Vor dem Absenden an das Datenbanksystem werden SQL-Queries in PHP in der
Regel wie normale Strings behandelt. Dynamisch hinzugefügte Werte (etwa eine
Benutzereingabe in `$_POST['name']`) können deshalb die vorgesehene Syntax
der Query verändern, wenn sie Zeichen enthalten, die in PHP-Strings
unproblematisch sind, die aber später syntaktische Bedeutung für den
SQL-Kontext haben. Ein Beispiel dafür sind die Anführungszeichen `"` und `'`.
Enthält eine Eingabe wie `$_POST['name']` den Wert `O'Brian`, bringt das
die Syntax eines Query-Strings wie `"WHERE name = '" . $_POST['name'] . "'"`
durcheinander, da der String, mit dem verglichen werden soll, bereits
nach dem `O` geschlossen wird. Dadurch können Fehler entstehen, und durch
gezielt konstruierte Eingaben kann sogar die Query insgesamt so verändert
werden, dass sie eine völlig andere Operation auslöst, als der Entwickler
beabsichtigt hatte. SQL-Injections sind eines der primären Mittel beim Angriff
auf Webseiten.

Weitere Informationen und sinnvolle Gegenmaßnahmen sind im [Hauptartikel
SQL-Injection]({{ page.root }}/jumpto/sql-injection/) zu finden.


## [You have an error in your SQL syntax; ... Warning: mysql_fetch_row() expects parameter 1 to be resource, boolean given](#sql-error)
{: #sql-error}

Der SQL-String für die Datenbankabfrage ist fehlerhaft. Lass dir den fertigen
String der entsprechenden Query vor der Anfrage testweise ausgeben. Siehe:
[SQL-Fehlerbehebung]({{ page.root }}/jumpto/sql/).


## [eval is evil - Warum?](#eval-is-evil)
{: #eval-is-evil}

Um es trefflich auf den Punkt zu bringen,
hier ein [Zitat aus dem php.de-Forum](http://www.php.de/forum/webentwicklung/php-einsteiger/1463694-pack-eines-gesamten-arrays?p=1463709#post1463709)

> eval() ist langsam. <br>
> eval() ist schlecht lesbar. <br>
> eval() ist schwer debugbar. <br>
> eval() ist eine potenzielle Sicherheitslücke. <br>
> eval() ist zu 99,99999% unnötig. <br>
>
> Die Wahrscheinlichkeit, dass eval() der richtige Lösungsweg ist geringer als ein 6er im Lotto.


## [Ist es falsch Bilder in der Datenbank, anstatt im Dateisystem zu speichern?](#image-storeloc)
{: #image-storeloc}

Das ist generell nicht mit "ja" oder "nein" zu beantworten.
Argumente die dafür und dagegen sprechen sind z.B. in
[diesem PHP.de-Forumsthread](http://www.php.de/forum/webentwicklung/datenbanken/111631-bild-aus-datenbank-auslesen?p=1209079#post1209079) zu finden.


## [Warum sollte SELECT * in SQL-Abfragen vermieden werden?](#select-star)
{: #select-star}

Beim Einsatz von SQL-Datenbanken sollte das Abrufen aller Spalten eines Datensatzes per `SELECT *` vermieden werden. Stattdessen sollten die gewünschten Spaltennamen explizit aufgelistet werden (`SELECT col1, col2 FROM …`). Einige Vorteile:

- Häufig werden in einer Abfrage nicht alle Spalten benötigt, die aktuell existieren oder in Zukunft existieren könnten, sodass unnötige Daten übertragen werden.
- Bei expliziter Angabe der gewünschten Spalten können Datenbanksysteme unter Umständen Indizes zur Beantwortung von Abfragen nutzen.
- Eine Auflistung der Spaltennamen macht den Code verständlicher, da die Tabellenstruktur nicht erst im Datenbankschema nachgelesen werden muss.
- Bei Änderungen am Datenbankschema (etwa bei Entfernung oder Umbenennung einer Spalte) schlägt eine Query, die kein `SELECT *` nutzt, sofort fehl. Das ist hilfreich, da so keine Stelle im Code übersehen werden kann, an der wahrscheinlich auch die PHP-Datenstrukturen an das neue Schema angepasst werden müssen.

Unproblematisch ist der Einsatz des Sternchens in `SELECT COUNT(*)`.
