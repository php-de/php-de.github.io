---
layout: guide

permalink: /jumpto/lokalisierung/
root: ../..
title: "Lokalisierung"
group: "Standard Implementierungsansätze / Code-Snippets"
orderId: 5

creator: mermshaus
author:
    -   name: mermshaus
        profile: 15041

inhalt:
    -   name: "Datums- und Zeitangaben"
        anchor: datum-und-zeit
        simple: ""

entry-type: in-discussion
---

### [Datums- und Zeitangaben](#datum-und-zeit)
{: #datum-und-zeit}

(Für Linux, Windows und OS X mit `setlocale` und Ausgabe in UTF-8.)

~~~ php
// Deutsch (Januar, Februar, März, ..., Oktober, November, Dezember)

setlocale (LC_TIME, 'German', 'de_DE', 'deu');
utf8_encode(strftime ("%B" , $date->getTimestamp()))

// Französisch (janvier, février, mars, ..., octobre, novembre, décembre)
// Italienisch (gennaio, febbraio, marzo, ..., ottobre, novembre, dicembre)

// Russisch (Январь, Февраль, Март, ..., Октябрь, Ноябрь, Декабрь)

setlocale (LC_Time, 'ru_RU.utf8');
strftime("%B" , $date->getTimestamp());
// NICHT unter Windows. Nur Linux, daher entfällt die Konvertierung.

//Für Windows hingegen:
setlocale (LC_ALL, 'Russian');
iconv("CP1251", "utf-8", strftime("%B" , $date->getTimestamp()))';
~~~

#### [Allgemeines und Ausgabe unter UTF-8](#utf8-allgemein)
{: #utf8-allgemein}

Ländercodes findet man unter [http://www.w3.org/WAI/ER/IG/ert/iso639.htm](http://www.w3.org/WAI/ER/IG/ert/iso639.htm). Es sind nicht immer alle Codes auf dem jeweiligen System verfügbar, daher gilt es zu testen. Bei nicht UTF-8 Codes wie Windows ("deu" oder "German") muss man die Rückgabe von `strftime` zusätzlich vom ursprünglichen Zeichencode in den von UTF-8 konvertieren. Bei Windows-1252 geschieht dies zum Beispiel mit `utf8_encode`. Für andere Zeichenkodierungen wie Russisch muss `iconv` angewendet werden. Die Ausgabe auf dem Zielsystem (Client oder Browser) wird durch die Zeichenkodierung vorher festgelegt. UTF-8 ist hier laut W3C der zu verwendende Standard. Ist im Server keine Zeichenkodierung vorgegeben, muss bei Ausgabe durch den Metatag Charset die Ausgabe auf UTF-8 festgelegt werden. In jedem Fall sollte das Script im Editor als UTF-8-Datei abgespeichert werden, um hier nicht noch zusätzlichen Zeichensalat entstehen zu lassen.

Zusammengefasst:

- Script in UTF-8 Speichern
- Server UTF-8 ausgeben lassen (Content-Type: text/html; charset=utf-8).
- HTML5-Doctype und Charset UTF-8 verwenden.

#### [Linux-Server und UTF-8](#utf8-linux)
{: #utf8-linux}

Unter Linux kann man sich die verfügbaren Ländercodes mit `locale -a` in der Konsole anzeigen lassen. Läuft das Script auf einem Linux-Server, kann man auf die UTF-8-Zeichensätze zurückgreifen, indem man `.utf8` hinten dranhängt. Also `setlocale(LC_TIME, 'de_DE.utf8')` für Ausgaben der Kalendernamen auf Deutsch mit korrekten Umlauten. Man spart sich dadurch die Konvertierung. Dies gilt nur für Linux Server mit zum Beispiel Apache.

#### [Windows-Server und UTF-8](#utf8-windows)
{: #utf8-windows}

Für Windows sind die ausgeschriebenen Ländernamen zu bevorzugen, da sie schneller abgearbeitet werden (laut MSDN). Also `setlocale(LC_TIME, 'German')` statt `setlocale(LC_TIME, 'deu')` oder `setlocale(LC_TIME, 'Ger')`. Unter Windows-Server fallen auch alle WAMP- oder XAMPP-Installationen, da hier auf Windows-Libraries zurückgegriffen wird.

Leider gibt es in Windows keine UTF-8-Zeichen wie unter Linux. Es wird also immer Windows-1252 beziehungsweise CP1252 verwendet, das mit ISO-8859-1 fast identisch ist und den Zeichensatz Latin-1 abdeckt. Da Windows-1252 ein 8-Bit-Zeichencode ist, ist die maximale Zeichenanzahl begrenzt und es muss für die korrekte Darstellung zu UTF-8 konvertiert werden. Dies geschieht entweder mit `utf8_encode` oder mit `iconv`.

Entwickelt man nun beispielsweise unter Windows mit installiertem WAMP als Serverumgebung und hat beim Hoster Linux mit Apache laufen, so möchte man nur zu gern alle Eventualitäten abdecken. Bleibt man zudem nur im lateinischen Sprachraum, so kann man sich damit behelfen, einfach alle möglichen Kodierungen aufzuführen. Das wäre beispielsweise für Italienisch `setlocale(LC_TIME, 'Italian', 'it_IT', 'ita')`. Damit hätte man die kalendarischen Ausgaben auf Italienisch, jedoch noch nicht in UTF-8. Daher muss noch zu der gewünschten Ausgabe nach UTF-8 konvertiert werden, damit Sonderzeichen auch als solche dargestellt werden. Hier bitte nicht für Linux `it_IT.utf8` verwenden, da es sonst bei der Konvertierung wieder problematisch wird. Während `utf8_encode(strftime('%B', $timestamp))` die Monatsnamen aus Windows in UTF-8 konvertiert, ist es für Linux notwendig, auch auf die ISO-8859-1 Sprachkodierungen zurückzugreifen.

Richtig problematisch wird das Ganze, wenn man nicht nur lateinische Sprachen ausgeben möchte, sondern mit `setlocale` auch andere Sprachen wie zum Beispiel Russisch ausgeben lassen möchte, wie oben dargestellt. (Siehe auch Problem auf [Stack Overflow](http://stackoverflow.com/questions/18513742/ru-ru-russian-setlocale-not-working-on-date-and-time).) Da wir bei der Ausgangskodierung bisher immer von Latin-1-Zeichen ausgegangen sind, haben wir bei Russisch gleich zwei kyrillische Varianten (eigentlich sogar noch mehr, wie etwa im Browser bei der Liste der Encodings zu sehen ist). Da `setlocale` bei `LC_TIME` lediglich die Sprache der zeitlichen Ausgabe, jedoch nicht den Zeichensatz, berücksichtigt, muss hier mit `LC_ALL` gearbeitet werden, was aber wiederum andere Probleme mit sich bringt, die im PHP-Handbuch nur angerissen werden. Sofern nicht alle Ausgaben in Kyrillisch gewünscht werden, ist hiervon abzuraten.

Kurzum: Wird Windows eingesetzt oder darunter entwickelt und ist die Darstellung mehrerer Sprachen aus dem Nichtlateinischen wichtig, dann ist ein selbsterstelltes Array, das die übersetzten Sprachnamen der Monate und Tage in UTF-8 enthält, wahrscheinlich die bessere Wahl.
