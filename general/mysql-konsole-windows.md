---
layout: guide
permalink: /jumpto/:title/
title: "MySQL-Konsole und Umlaute unter Windows"
group: "Allgemein"
creator: dr.e.
author:
    -   name: dr.e.
        profile: 2312

    -   name: mermshaus
        profile: 15041

inhalt:
    -   name: "Problem"
        anchor: problem
        simple: ""

    -   name: "Ursache"
        anchor: ursache
        simple: ""

    -   name: "Lösung"
        anchor: lsung
        simple: ""

    -   name: "Alternative Lösung"
        anchor: alternative-lsung
        simple: ""

entry-type: in-discussion
---

### Problem

Wenn man die MySQL Konsole über die Eingabeaufforderung (cmd.exe) von Windows
aufruft und deutsche Umlaute per `INSERT` oder `UPDATE` in Tabellen einfügt, so
werden diese bei Abruf über die MySQL Konsole zwar korrekt ausgegeben, aber
beim Zugriff mit anderen Datenbank-Clients (z.B. Ausgabe per PHP in eine
Webseite) erscheinen statt der Umlaute andere Sonderzeichen - statt einem `"Ü"`
z.B. `"š"`.



### Ursache

Die Standardeinstellung für den Zeichensatz auf der Clientseite (MySQL Konsole)
und auf der Serverseite ist unter Windows bei einer Standardinstallation des
MySQL Servers „latin1“. Die aktuellen Werte einer Clientverbindung lassen sich
mit `show variables like 'char%';` abfragen. Das Ergebnis ähnelt i.d.R. diesem:

~~~
mysql> show variables like 'char%';
+--------------------------+-----------------------------------------------------+
| Variable_name | Value |
+--------------------------+-----------------------------------------------------+
| character_set_client | latin1 |
| character_set_connection | latin1 |
| character_set_database | latin1 |
| character_set_filesystem | binary |
| character_set_results | latin1 |
| character_set_server | latin1 |
| character_set_system | utf8 |
| character_sets_dir | C:\Programme\MySQL\MySQL Server 5.1\share\charsets\ |
+--------------------------+-----------------------------------------------------+
8 rows in set (0.00 sec)
~~~

Der MySQL Zeichensatz „latin1“ entspricht im Grobem dem Zeichensatz
Windows-1252 bzw. ISO/IEC 8859-1. Windows verwendet aber für die
Eingabeaufforderung (cmd.exe) standardmäßig nicht die Codepage Windows-1252,
sondern MS-DOS 850. Drücke ich mit CodePage 850 das `"Ü"`, so wird dieses vom
Zahlenwert her als `(dec)154` interpretiert und auf der Konsole auch als `"Ü"`
angezeigt. MySQL speichert dieses `"Ü"` dann als ein Byte mit dem Wert
`(dec)154` in der Datenbank. Übersetzt nach Windows-1252 bzw. latin1 bedeutet
`(dec)154` aber `"š"`. Wenn ich umgekehrt z.B. von einem PHP Formular aus ein
`"ü"` eingebe, so wird dies als `(dec)252` in der Datenbank gespeichert,
bedeutet aber in der Zeichentabelle MS-DOS 850 `"³"`. D.h. die Umlaute, die ich
über einen Client eingebe, sind bei Abruf über den selben Weg immer korrekt,
aber bei Abruf über den anderen immer falsch.



### Lösung

Über den Befehl `chcp` (kurz für Change Codepage) kann man die Codepage für die
Kommandozeile ändern. Ein einfaches `chcp 1252` schaltet die cmd.exe auf
Windows-1252 bzw. latin1 um. Tippe ich jetzt ein `"ü"` erscheint bei Verwendung
der Rasterschrift für das Konsolenfenster ein `"³"`. Man kann die Schriftart
für das Konsolenfenster aber auf „Lucida Console“ umstellen, die auch
Windows-1252 beherrscht, und erhält dann wieder ein `"ü"` angezeigt. Rufe ich
danach die MySQL Konsole auf, werden die eingegebenen Umlaute von der
Eingabeaufforderung als die Zahlenwerte an MySQL weitergereicht, die im Rahmen
der Clienteinstellung latin1 erwartet werden. Man kann sich auch eine
Verknüpfung bauen, die die Codepage vor dem Aufruf der MySQL Konsole
automatisch umschaltet. Deren Ziel sähe dann in etwa so aus:

~~~
cmd /c chcp 1252 && mysql -uuser -ppasswort
~~~



### Alternative Lösung


Wenn man die Codepage der Windows Eingabeaufforderung nicht ändern möchte, so
kann man alternativ auch den Zeichensatz der MySQL Verbindung umschalten. Nach
dem Verbinden zum MySQL Server setzt der Befehl

~~~
SET NAMES 'cp850';
~~~

den Verbindungszeichsatz auf MS-DOS 850 um oder man startet die MySQL Konsole
mit dem Parameter:

~~~
--default-character-set=cp850
~~~

Der Befehl

~~~
SHOW VARIABLES LIKE 'char%';
~~~

liefert nun folgendes:

~~~
mysql> show variables like 'char%';
+--------------------------+-----------------------------------------------------+
| Variable_name | Value |
+--------------------------+-----------------------------------------------------+
| character_set_client | cp850 |
| character_set_connection | cp850 |
| character_set_database | latin1 |
| character_set_filesystem | binary |
| character_set_results | cp850 |
| character_set_server | latin1 |
| character_set_system | utf8 |
| character_sets_dir | C:\Programme\MySQL\MySQL Server 5.1\share\charsets\ |
+--------------------------+-----------------------------------------------------+
8 rows in set (0.00 sec)
~~~

Anfragen und Ergebnisse werden nun vom MySQL Server in MS-DOS 850 erwartet und
geliefert.  Nachteil: Generell findet in dieser Variante ein automatischer
Ausgleich der Verschiebungen zwischen cp850 und latin1 statt. Es stehen aber
nicht alle Zeichen auf beiden Seiten zur Verfügung, die der deutsche Anwender
gewöhnt ist. Das Eurozeichen z.B. wird in cp850 nicht unterstützt und bei der
Konvertierung durch ein Fragezeichen ersetzt. Beim Arbeiten mit latin1 ist
diese Variante also etwas „hässlicher“.
