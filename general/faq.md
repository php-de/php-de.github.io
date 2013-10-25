---
layout: guide
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



**„Meine mit `mail` versendeten E-Mails haben fehlerhafte Umlaute.“**
<a href="#mail-umlaute">#mail-umlaute</a>
{: #mail-umlaute}

<div style="margin-left: 20px;">

Siehe nächste Frage.

</div>



**„Wie kann ich mit `mail` Anhänge versenden?“**
<a href="#mail-anhaenge">#mail-anhaenge</a>
{: #mail-anhaenge}

<div style="margin-left: 20px;">

Benutze eine fertige Mailsoftware.
[PHPMailer](http://phpmailer.worxware.com/),
[Swift Mailer](http://swiftmailer.org/). Siehe hierzu auch
[diesen Artikel](http://php-de.github.io/email/mail-class.html).

</div>



**„Wie kann ich erreichen, dass mein Formular bei Unvollständigkeit wieder
ausgefüllt wird?“**
<a href="#formular-gefuellt">#formular-gefuellt</a>
{: #formular-gefuellt}

<div style="margin-left: 20px;">

Ein Affenformular bietet genau diese Funktionalität. siehe
[Affenformular](http://php-de.github.io/form/affenformular.html)

</div>



**„Was ist ein Affenformular?“**
<a href="#affenformular">#affenformular</a>
{: #affenformular}

<div style="margin-left: 20px;">

Siehe: vorige Frage.

</div>



**„Ich erhalte immer die Meldung ‚headers already sent‘.“**
<a href="#headers-already-sent">#headers-already-sent</a>
{: #headers-already-sent}

<div style="margin-left: 20px;">

Es darf absolut keine Ausgabe vor Header-Aktionen erfolgen. Bereits ein Leer-
oder Steuerzeichen außerhalb von <?php ... ?> genügt dafür. Siehe:
[Standardfehler](http://php-de.github.io/debugging/standardfehler.html).

</div>



**„Nach Aktion XY zeigt mein Browser nur noch eine weiße Seite.“**
<a href="#weisse-seite">#weisse-seite</a>
{: #weisse-seite}

<div style="margin-left: 20px;">

Wahrscheinlich handelt es sich um einen Parser-Fehler. Üblicherweise hast Du
einen Stringbegrenzer, ein Semikolon oder eine Klammer vergessen. Siehe:
[Standardfehler](http://php-de.github.io/debugging/standardfehler.html).

</div>



**„You have an error in your SQL syntax; check the manual that corresponds to
your MySQL server version for the right syntax to use near '…' at line …“ /
„Warning: mysql_fetch_row() expects parameter 1 to be resource, boolean
given“**
<a href="#sql-error">#sql-error</a>
{: #sql-error}

<div style="margin-left: 20px;">

Der SQL-String für die Datenbankabfrage ist fehlerhaft. Lass dir den fertigen
String der entsprechenden Query vor der Anfrage testweise ausgeben. Siehe:
[SQL-Fehlerbehebung](http://php-de.github.io/debugging/sql.html).

</div>



**„Ist die mysql-Erweiterung wirklich veraltet und sollte nicht mehr genutzt
werden?“**
<a href="#deprecated-mysql">#deprecated-mysql</a>
{: #deprecated-mysql}

<div style="margin-left: 20px;">

Ja. Das „mysql“ bezieht sich hier allerdings *nicht* auf das komplette
Datenbanksystem MySQL, sondern ist lediglich der Name eines der drei APIs, die
PHP zur Kommunikation mit MySQL-Datenbanken nutzen kann. Die anderen beiden
(nicht veralteten) APIs sind [mysqli](http://php.net/mysqli) und
[PDO](http://php.net/pdo). Mehr Hintergründe und Empfehlungen stehen [in der
PHP-Dokumentation](http://php.net/manual/en/mysqlinfo.api.choosing.php).

</div>

