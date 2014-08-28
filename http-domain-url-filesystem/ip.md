---
layout: guide

permalink: /jumpto/ip/
title: "IP-Adressen"
group: "HTTP / Domain / URL / Requests / Dateisystem"
orderId: 8

creator: tr0y

author:
    - name: tr0y
      profile: 21125

    - name: hausl
      profile: 21246

inhalt:
    - name: "Grundlagen"
      anchor: grundlagen
      simple: ""

    - name: "Formate"
      anchor: formate
      simple: "IPv4, IPv6"

    - name: "PHP und extrem große Zahlen"
      anchor: php-typen-und-der-umgang-mit-extrem-groen-zahlen
      simple: "32bit, 64bit, 128bit"

    - name: "Magie der Binär-Strings"
      anchor: die-magie-der-binr-strings
      simple: "zur Darstellung von IPs"

    - name: "Der falsche Weg"
      anchor: der-falsche-weg
      simple: "ip2long, long2ip"

    - name: "Der richtige Weg"
      anchor: der-richtige-weg
      simple: "Binäre Darstellung"

    - name: "Der MySQL-Weg"
      anchor: der-mysql-weg-die-konvertierung-auslagern
      simple: "die Konvertierung auslagern"

    - name: "Quellen"
      anchor: quellen
      simple: ""


entry-type: in-progress
---

Diese Anleitung zeigt übliche Methoden um `IPv4`- und `IPv6`-Adressen in ihre `binäre` Darstellung zu konvertieren. 


### Grundlagen

IP-Adressen sind für Menschen lesbare Zeichenfolgen, um Geräte innerhalb von TCP/IP-basierten Netzwerken eindeutig zu identifizieren. In der Vergangenheit des Internets waren IPv4-Adressen der übliche Weg, um einen Server zu adressieren, Clients zu Servern oder zu anderen Clients zu verbinden, um E-Mails zu versenden oder andere netzwerkbezogene Aufgaben durchzuführen. IPs sind im Prinzip gleich wie Telefonnummern (mit lediglich anderem Format), jedoch sind Telefonnummern nicht durch einen bestimmten Bereich beschränkt. 

Heutzutage haben wir die Grenzen des Adressbereiches von IPv4-Adressen erreicht, d.h. `4.294.967.296` gleichzeitg angeschlossene Clients. Aus diesem Grund wurde ein neues Adressformat definiert, um die Aufgaben des IPv4 in der Zukunft erfüllen: IPv6. Mittels IPv6 kann das Internet für eine Weile weiter wachsen, denn  `340.282.366.920.938.463.463.374.607.431.768.211.456` Clients können so zum größten, weltweiten Netzwerk verbunden werden. Ja, das ist eine Zahl mit 39 Stellen.


### Formate 

IPv4-Adressen bestehen aus einer Folge von vorzeichenlosen Ganzzahlen (*unsigned integer*), die in 4 Gruppen, getrennt durch ein `.`, unterteilt sind. Jede Gruppe kann einen Wert von 0 bis 255 haben.

`127.0.0.1` Der lokale Loopback, der gut bekannte `localhost`.

IPv6-Adressen sind eine Folge von Hexadezimalzahlen, die in 8 Gruppen, getrennt durch ein `:`, dargestellt werden. Jede Gruppe kann einen Wert zwischen 0 und ffff haben, führende Nullen können, ebenso wie Folgen von Nullen, ausgelassen werden: 

`0000:0000:0000:0000:0000:0000:0000:0001` oder: `::1` Ja, auch das ist der lokale Loopback. 


### PHP, Typen und der Umgang mit extrem großen Zahlen 

PHP kommt "out of the box" mit Unterstützung für eine "32-Bit-Integer mit Vorzeichen" auf 32-Bit-Plattformen und mit einer "64-Bit-Integer mit Vorzeichen" auf einem 64-Bit-Plattform. Was hier weiter unten aufgezeigt wird: 32-Bit-Integers sind die falsche Wahl um IPv4 Adressen zu speichern, denn diese scheitern bereits an dem Wert der höchsten IPv4-Adresse. 64-Bit-Integers sind ebenfalls nicht in der Lage, IPv6-Adressen zu verarbeiten, denn diese benötigen mindestens 128-Bit. PHP ist in der Lage, eine große Zahl bitweise mit Hilfe von bcmath behandeln. Im Detail: Mit bcmath jede Zahl wird als Zeichenfolge dargestellt werden. Wir werden jedoch Binär-Strings verwenden. 


### Die Magie der Binär-Strings 

Binär-Strings werden im weitern Verlauf zur Darstellung von IP-Adressen unsere Wahl sein. Denn in dieser Formkönnen die IP-Adressen in die Datenbank abgespeichert werden, dort auf Datenbankebene abgefragt bzw. mit anderen IP-Adressen verglichen, oder auch direkt in PHP entsprechend verarbeitet werden.


### Der falsche Weg

**Verwenden Sie nicht ip2long oder long2ip!**. ip2long wandelt eine IPv4-Adresse in einer für Menschen lesbaren `integer`-darstellung. Auf 32-Bit-Plattformen, kann das vorzeitig mit dem Wert der `PHP_MAX_INT` als Obergrenze enden, wenn die angegebene IP-Adresse Darstellung höher als die `PHP_MAX_INT` ist. Dies wird definitiv passieren wenn das erste Segment der IP-Adresse höher als `127` ist.


### Der richtige Weg

Zuerst beginnen wir mit der Umwandlung von `127.0.0.1` in die binäre Darstellung: 

~~~ php
$binaryIP = inet_pton('127.0.0.1');
~~~~

Zu Erinnerung, wir haben nun einen Binär-String. `var_dump()` wird hier nicht helfen um herauszufinden was wir im Detail haben, denn `var_dump()` ist nicht in der Lage, binäre Strings anzuzeigen und wird daher einen leeren String zurückgeben. Daher prüfen wir, ob wir beim Zählen der Byte-Länge des Binär-Strings mit strlen() oder mb_strlen() eine 32-Bit-Darstellung bekommen: 

~~~ php
var_dump(strlen($binaryIP));
~~~

ergibt `int(4)`


Weiter mit der Umwandlung von `::1`, der IPv6-Darstellung von `127.0.0.1`: 

~~~ php
$binaryIPv6 = inet_pton('::1'); 
~~~

Wir überprüfen das Ergebnis wie oben, um sicherzustellen, das wir ein 128-Bit-Darstellung (16-Byte-String-Länge) bekommen haben:

~~~ php
var_dump(strlen($binaryIP)); 
~~~

ergibt `int(16)`


Der nächste Schritt wäre nun die Prüfung, ob sich eine angegebene IPv4-Adresse zwischen zwei anderen IPv4 Adressen befindet:

~~~ php
function ip_between($ip, $ipStart, $ipEnd)
{
     $start = inet_pton($ipStart);
     $end = inet_pton($ipEnd);
     $value = inet_pton($ip);

     return $start <= $value && $end >= $value; 
} 

var_dump(ip_between('127.0.0.10', '127.0.0.1', '127.0.0.255'));
~~~
 
ergibt `bool(true)`

Gleiche Funktion, diesmal  mit IPv6-Adressen: 

~~~ php
var_dump(ip_between('::DD', '::1', '::FFFF')); 
~~~

ergibt ebenfalls `bool(true)`


### Der MySQL-Weg: Die Konvertierung auslagern

Wie oben dargestellt, ist das Handling mit IP-Adressen, egal welcher Version, mit PHP nicht all zu kompliziert. Dennoch solle es vorgezogen werden, solche Konvertierung auf die Datenbank auszulagern, wenn diese zur Speicherung der IP-Adresse dient und die Datenbank auf einem entsprechend aktuellen Stand ist, was die Verfügbarkeit von `inet6_aton` und `inet6_ntoa` betrifft und diese gewährleistet ist. MySQL 5.5 oder höher erfüllt diese Anforderung.


Für einen kleinen Test erstellen wir die folgende Tabelle:

~~~
CREATE TABLE `ip_address_ranges`(
     `start` varbinary(16), 
     `end` varbinary(16) 
) 
~~~


Und fügen zwei Bereiche ein - einen für IPv4 und einen für IPv6: 

~~~
INSERT INTO `ip_address_ranges`(`start`, `end`) 
VALUES 
    ( Inet6_aton('::1'), inet6_aton('::FFFF') ), 
    ( Inet6_aton('127.0.0.1'), inet6_aton('127.0.0.255') ) 
~~~


Und zum Schluss noch jeweils eine IPv6- und eine IPv4 basierende BETWEEN Abfrage: 

~~~
SELECT 
     inet6_ntoa(`start`) AS `start-IP`, 
     inet6_ntoa(`end`) AS `end-IP` 
FROM `ip_address_ranges` 
     WHERE
         inet6_aton('::5') BETWEEN `start` AND `end` 

SELECT 
     inet6_ntoa(`start`) AS `start-IP`,
     inet6_ntoa(`end`) AS `end-IP` 
FROM `ip_address_ranges` 
     WHERE
         inet6_aton('127.0.0.50') BETWEEN `start` AND `end` 
~~~

Beide SELECT-Statements geben jeweils ein Zeile aus, mit den für Menschen lesbaren Darstellung des betreffenden Bereiches.

~~~
+----------+--------+
| start-IP | end-IP |
+----------+--------+
| ::1      | ::ffff |
+----------+--------+

+-----------+-------------+
| start-IP  | end-IP      |
+-----------+-------------+
| 127.0.0.1 | 127.0.0.255 |   
+-----------+-------------+
~~~


Hinweis: MySQL hat ebenfalls `inet_aton`- und `inet_ntoa`-Funktionen. Die `inet6_*`-Funktionen sind jedoch wegen der Kompatibilität für IPv6 und IPv4 zu bevorzugen, denn die `inet_*`-Funktionen sind nur für die Verarbeitung von IPv4-Adressen implementiert.


### Quellen

* [Beitrag im englischen Original von tr0y](https://gist.github.com/Golpha/1a79868b6598f2c6a531)

