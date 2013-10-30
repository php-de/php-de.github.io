---
layout: guide
title: "Hashing, Kodierung, Verschlüsselung"
group: "[DRAFT]"
creator: hausl
author:
    -   name: hausl
        profile: 21246

inhalt:
    -   name: ""
        anchor: 
        simple: ""

entry-type: in-progress
---


Diese Übersicht soll einen kurzen Überblick über die unterschiedlichen Verfahren geben. Weitere Detailinformationen gibt es dazu in den bekannten Quellen.


### Hash-Funktionen

[Wikipedia:](http://de.wikipedia.org/wiki/Hashfunktion)

> Eine Hashfunktion (auch Streuwertfunktion) ist eine Abbildung, die eine große Eingabemenge (die Schlüssel) auf eine kleinere Zielmenge (die Hashwerte) abbildet – sie ist daher nicht injektiv. Dabei kann die Eingabemenge auch Elemente mit unterschiedlichen Längen enthalten, die Elemente der Zielmenge haben dagegen meist eine feste Länge.

##### Anwendung

Hashen von Paswörtern in der Datenbank, damit diese unkenntlich sind, und nicht missbräuchlich verwendet werden können, selbst wenn jemand (zB als Admin) Zugriff auf die relevanten Datenbereiche hat.

Das Klartext Passwort welches vom Benutzer im Registrierungsformular angegeben wird wird vor Speicherung in der Datenbank mittels einer der genannten Hash-Funktionen gehasht. Somit ist nur der daraus resultierende Hash in der Datebank vorhanden.

Hash-Werte können nicht direkt (im Gegensatz zu einer Verschlüsselung) zurückgerechnet werden, ein gehashter Leerstring ("") ergibt genauso wie z.B. dieser gehashte Artikel nach Anwendung der jeweiligen Hash-Funktion einen String identer/fixer Länge.


##### Anmerkung

Das mögliche Sicherheitsrikiso bei Hash-Werten liegt in der theorethischen Möglichkeit von Kollisionen. Dabei geht es nicht darum "das Passwort" zu erraten, sondern einen Ausgangswert zu finden, der nach dem Hash-Vorgang den selben Hash-Wert als Ergbnis hat. Dies ist bei [md5() bereits gelungen](http://de.wikipedia.org/wiki/Message-Digest_Algorithm_5#Kollisionsresistenz). Siehe auch [Rainbow-Table](http://de.wikipedia.org/wiki/Rainbow_Table). 

[Wikipedia](http://de.wikipedia.org/wiki/Secure_Hash_Algorithm#Empfehlungen)

> Das [NIST](http://de.wikipedia.org/wiki/National_Institute_of_Standards_and_Technology) (National Institute of Standards and Technology) empfiehlt den Übergang von SHA-1 zu Hashfunktionen der [SHA-2-Familie](http://de.wikipedia.org/wiki/SHA-2) (SHA-224, SHA-256, SHA-384, SHA-512) ... SHA-2 wird aber weiterhin als sicher betrachtet und zur Benutzung empfohlen.


Ein mehrmaliges hashen eines Passwortes bringt keinen Vorteil, mehr einen Nachteil. Der Grund darin liegt daran, das der Ergebnis-Hash "nur" aus den Ziffern 0 bis 9 und den Buchstaben a bis f besteht. Durch erneutes hashen verkleinert man somit nur unötig die Ausgabgs-Wertebasis. Effektiver dazu ist siehe unten - das "Salzen".


##### Beispiele


Beispiel mit sha256-Algorithmus - PHP kennt dazu die Funktion [hash()]()

~~~ php
$str = ""; // Leerstring
echo hash("sha256", $str);
// ergibt:
// e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855

$str = "Franz";
echo hash("sha256", $str);
// ergibt:
// bae10942b11649e784f7e4c2728203612368ff3f871fe0a6c0c706eb52318223

// nur ein Buchstabe Unterschied zum Beispiel davor, ergibt einen völlig anderen Hash
$str = "Frank";
echo hash("sha256", $str);
// ergibt:
// db605e8f71913d1f3966ad908d78b8a8084f5047122037b2b91a7192b598a9ad


// Längere Texte werden duch den Algorithmus ebenfalls auf die idente Länge gebracht
$str = "Franz jagt im komplett verwahrlosten Taxi quer durch Bayern, schlussendlich hat er nach einiger Zeit sein Ziel doch noch erreicht.";
echo hash("sha256", $str);
// ergibt:
// c1827f01d8eb06e68c58414ea7959a788e9804ff0abf5f2c904820c0741a2af0
~~~


#### Gesalzene Hashes
Dazu aus [Wikipedia](http://de.wikipedia.org/wiki/Salt_(Kryptologie))

> Salt (englisch für Salz) bezeichnet in der Kryptographie eine zufällig gewählte Zeichenfolge, die an einen gegebenen Klartext vor der Verwendung als Eingabe einer Hashfunktion angehängt wird, um die Entropie der Eingabe zu erhöhen. Es wird häufig für die Speicherung und Übermittlung von Computer-Passwörtern benutzt.




### Kodierung

[Wikipedia:](http://de.wikipedia.org/wiki/Code)

> Ein Code ist eine Vorschrift, wie Nachrichten oder Befehle zur Übersetzung für ein Zielsystem umgewandelt werden. Beispielsweise stellt der Morsecode eine Beziehung zwischen Buchstaben und einer Abfolge kurzer und langer Tonsignale her. Eine kodierte Nachricht kann aus Daten oder einer Reihe von Ziffern, Zeichen, Buchstaben oder anderen Informationsträgern bestehen, zum Beispiel auch aus den Nukleinbasen in DNA-Strängen. In der Kommunikationswissenschaft bezeichnet ein Code im weitesten Sinne eine Sprache.


Weiterste Vertreter ist hier die [Base64-Kodierung base64()](http://de.wikipedia.org/wiki/Base64) im Zusammenhang mit E-Mails.

> Es findet im Internet-Standard MIME (Multipurpose Internet Mail Extensions) Anwendung und wird damit hauptsächlich zum Versenden von E-Mail-Anhängen verwendet. Nötig ist dies, um den problemlosen Transport von beliebigen Binärdaten zu gewährleisten, da SMTP in seiner ursprünglichen Fassung nur für den Versand von 7-Bit-ASCII-Zeichen ausgelegt war. Durch die Kodierung steigt der Platzbedarf des Datenstroms um 33–36 % (33 % durch die Kodierung selbst, bis zu weitere 3 % durch die im kodierten Datenstrom eingefügten Zeilenumbrüche).

##### Beispiel

~~~ php
$str = "Franz jagt im komplett verwahrlosten Taxi quer durch Bayern.";

// kodieren 
$str_base64 = base64_encode($str);

echo $str_base64;
// ergibt:
// RnJhbnogamFndCBpbSBrb21wbGV0dCB2ZXJ3YWhybG9zdGVuIFRheGkgcXVlciBkdXJjaCBCYXllcm4u

// und wieder zurück
echo base64_decode($str_base64);
// Franz jagt im komplett verwahrlosten Taxi quer durch Bayern.
~~~


### Verschlüsselung

[Wikipedia:](http://de.wikipedia.org/wiki/Verschl%C3%BCsselung)

> Verschlüsselung nennt man den Vorgang, bei dem ein klar lesbarer Text (Klartext) (oder auch Informationen anderer Art wie Ton- oder Bildaufzeichnungen) mit Hilfe eines Verschlüsselungsverfahrens (Kryptosystem) in eine „unleserliche“, das heißt nicht einfach interpretierbare Zeichenfolge (Geheimtext) umgewandelt wird. Als entscheidend wichtige Parameter der Verschlüsselung werden hierbei ein oder auch mehrere Schlüssel verwendet.


PHP-Funktionen: 
[mcrypt()](http://www.php.net/manual/de/book.mcrypt.php)

