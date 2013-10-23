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

Frequently Asked Questions -- häufig gestellte Fragen aus dem Themenbereich des
Forums.



**„Meine mit `mail` versendeten E-Mails haben fehlerhafte Umlaute.“**

Siehe nächste Frage.



**„Wie kann ich mit `mail` Anhänge versenden?“**

Benutze eine fertige Mailsoftware.
[PHPMailer](http://phpmailer.worxware.com/), [Swift
Mailer](http://swiftmailer.org/).



**„Wie kann ich erreichen, dass mein Formular bei Unvollständigkeit wieder
ausgefüllt wird?“**

Ein Affenformular bietet genau diese Funktionalität. siehe
[Affenformular](http://php-de.github.io/form/affenformular.html)



**„Was ist ein Affenformular?“**

Siehe: vorige Frage.



**„Ich erhalte immer die Meldung ‚headers already sent‘.**

Es darf absolut keine Ausgabe vor Header-Aktionen erfolgen. Bereits ein Leer-
oder Steuerzeichen außerhalb von <?php ... ?> genügt dafür. Siehe:
[Standard-Fehler](http://php-de.github.io/debugging/standardfehler.html).



**„Nach Aktion XY zeigt mein Browser nur noch eine weiße Seite.“**

Wahrscheinlich handelt es sich um einen Parser-Fehler. Üblicherweise hast Du
einen Stringbegrenzer, ein Semikolon oder eine Klammer vergessen. Siehe:
[Standard-Fehler](http://php-de.github.io/debugging/standardfehler.html).



**„You have an error in your SQL syntax; check the manual that corresponds to
your MySQL server version for the right syntax to use near '…' at line …“**

Die Query der Datenbankabfrage ist fehlerhaft. Lass Dir den fertigen String
der entsprechenden Query vor der Anfrage testweise ausgeben.



**„Ist die mysql-Erweiterung wirklich veraltet und sollte nicht mehr genutzt
werden?“**

Ja. Das „mysql“ bezieht sich allerdings *nicht* auf das komplette
Datenbanksystem MySQL, sondern ist lediglich der Name eines der drei APIs, die
PHP zur Kommunikation mit MySQL-Datenbanken nutzen kann. Die anderen beiden
(nicht veralteten) APIs sind [mysqli](http://php.net/mysqli) und
[PDO](http://php.net/pdo). Mehr Hintergründe
[hier](http://php.net/manual/en/mysqlinfo.api.choosing.php).
