---
layout: guide
permalink: /jumpto/faq/
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
Artikel]({{ site.url }}/jumpto/mail-class/).

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
[Affenformular]({{ site.url }}/jumpto/affenformular/)

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
[Standardfehler]({{ site.url }}/jumpto/standardfehler/).

</div>



**„Nach Aktion XY zeigt mein Browser nur noch eine weiße Seite.“**
<a href="#weisse-seite">#</a>
{: #weisse-seite}

<div style="margin-left: 20px;">

Wahrscheinlich handelt es sich um einen Parser-Fehler. Üblicherweise hast Du
einen Stringbegrenzer, ein Semikolon oder eine Klammer vergessen. Siehe:
[Standardfehler]({{ site.url }}/jumpto/standardfehler/).

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
[Kontextwechsel-Probleme]({{ site.url }}/jumpto/kontextwechsel/).

SQL-Queries werden in PHP als normaler String zusammengebaut. Dynamisch
hinzugefügte Werte (etwa eine Benutzereingabe in `$_POST['name']`) können dabei
die vorgesehene Logik der Query verändern, wenn sie für den Kontext syntaktisch
relevante Zeichen (etwa die Anführungszeichen `"` und `'`) enthalten.

Weitere Informationen inkl. sinnvoller Gegemaßnahmen findest du hier im [Hauptartikel SQL-Injection]({{ site.url }}/jumpto/sql-injection/).
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
[SQL-Fehlerbehebung]({{ site.url }}/jumpto/sql/).

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

