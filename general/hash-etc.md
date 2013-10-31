---
layout: guide
title: "Hashing, Kodierung, Verschlüsselung"
group: "[DRAFT]"
creator: hausl
author:
    -   name: hausl
        profile: 21246

inhalt:
    -   name: "Hash-Funktionen"
        anchor: hash-funktionen
        simple: "md5(), sha256(), sha512(), etc."

    -   name: "Kodierung"
        anchor: kodierung
        simple: "base64_encode(), base64_decode()"

    -   name: "Verschlüsselung"
        anchor: verschlsselung
        simple: "Mcrypt-Erweiterung"


entry-type: in-progress
---


Diese Übersicht gibt einen kurzen Überblick über die unterschiedlichen Verfahren. Weitere Detailinformationen gibt es dazu u.a. bei den verlinkten Quellen.


### Hash-Funktionen

[Wikipedia:](http://de.wikipedia.org/wiki/Hashfunktion)

> Eine Hashfunktion (auch Streuwertfunktion) ist eine Abbildung, die eine große Eingabemenge (die Schlüssel) auf eine kleinere Zielmenge (die Hashwerte) abbildet ... Dabei kann die Eingabemenge auch Elemente mit unterschiedlichen Längen enthalten, die Elemente der Zielmenge haben dagegen meist eine feste Länge.


##### Anwendung

Die übliche Anwendung besteht darin, Paswörter zu hashen, bevor diese in der Datenbank gespeichert werden. Damit sind diese grundsätzlich nutzlos, auch wenn man Zugang zu diesen (dem gespeicherten Hash) erlangt.

Beim Login-Vorgang wird das im Login-Formular eingegebene Klartext Passwort mit dem selben Algorithmus wie oben gehasht und dann dieser eben errechnete Hash mit dem Hash in der Datenbank verglichen. Stimmen diese beiden überein, ist das Login-Passwort korrekt.

Hash-Werte können nicht direkt (im Gegensatz zu einer Verschlüsselung) zurückgerechnet werden, ein Leerstring ("") ergibt genauso wie z.B. dieser Artikel nach Anwendung der jeweiligen Hash-Funktion einen String identer/fixer Länge, siehe Beispiele dazu weiter unten.


##### Sicherheit

Das Sicherheitsrikiso bei Hash-Werten liegt in der grundsätzlichen Möglichkeit von Kollisionen. Dabei geht es nicht darum "das" Passwort zu erraten, sondern einen Ausgangswert zu finden, der nach dem Hash-Vorgang den selben Hash-Wert als Ergbnis hat. Dies ist bei [md5() bereits gelungen](http://de.wikipedia.org/wiki/Message-Digest_Algorithm_5#Kollisionsresistenz).

Auf sogenannten [Rainbow-Tables](http://de.wikipedia.org/wiki/Rainbow_Table) werden Paare aus Klartext und dem dazugehörigen Hash "gesammelt" um diese im Einsatz von Brute-Force-Attacken zu verwenden. 

Aus diesem Grund wird von der weiteren Verwendung von md5() abgeraten. Ebenso wie für die Funktionen der [SHA-1 Familie](http://de.wikipedia.org/wiki/Secure_Hash_Algorithm#SHA.2FSHA-1).

Jedoch sind die Meinungen und Empfehlungen zu diesem Thema unterschiedlich:

[Wikipedia](http://de.wikipedia.org/wiki/Secure_Hash_Algorithm#Empfehlungen)

> Das [NIST](http://de.wikipedia.org/wiki/National_Institute_of_Standards_and_Technology) (National Institute of Standards and Technology) empfiehlt den Übergang von SHA-1 zu Hashfunktionen der [SHA-2-Familie](http://de.wikipedia.org/wiki/SHA-2) (SHA-224, SHA-256, SHA-384, SHA-512) ... SHA-2 wird aber weiterhin als sicher betrachtet und zur Benutzung empfohlen.


[php.net FAQ "Save Password Hashing"](http://www.php.net/manual/de/faq.passwords.php)

> Hashing algorithms such as MD5, SHA1 and SHA256 are designed to be very fast and efficient. With modern techniques and computer equipment, it has become trivial to "brute force" the output of these algorithms, in order to determine the original input. 
> 
> Because of how quickly a modern computer can "reverse" these hashing algorithms, many security professionals strongly suggest against their use for password hashing.   


<div class="alert alert-info"><strong>Information!</strong> In den nachfolgenden Beispielen wird zur Demonstartion des grundlegenden Prinzipes sha256() verwendet, auch weil die dadurch entstehenden Hashes um einiges kürzer sind als bsp. von sha512().</div>


Ein mehrmaliges hashen eines Passwortes bringt keinen Vorteil, mehr einen Nachteil. Der Grund darin liegt daran, das der Ergebnis-Hash "nur" aus den Ziffern 0 bis 9 und den Buchstaben a bis f besteht. Durch erneutes hashen verkleinert man somit nur unötig die Ausgabgs-Wertebasis.


##### Beispiele

Beispiele mit sha256-Algorithmus - PHP stellt dazu die Funktion [hash()](http://php.net/manual/de/book.hash.php) zur Verfügung.


Leerstring als Ausgabgsstring

~~~ php
$str = "";
echo hash("sha256", $str);
// ergibt:
// e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
~~~


"Normaler" String

~~~ php
$str = "Franz";
echo hash("sha256", $str);
// ergibt:
// bae10942b11649e784f7e4c2728203612368ff3f871fe0a6c0c706eb52318223
~~~


Zur Demonstration - nur ein Buchstabe Unterschied zum vorigen Beispiel. Es ergibt sich eine völlig anderer Hash

~~~ php
$str = "Frank";
echo hash("sha256", $str);
// ergibt:
// db605e8f71913d1f3966ad908d78b8a8084f5047122037b2b91a7192b598a9ad
~~~


Längere Texte werden duch den Algorithmus ebenfalls auf die idente Länge gebracht

~~~ php
$str = "Das Problem zu erkennen ist wichtiger, als die Lösung zu erkennen, denn die genaue Darstellung des Problems führt zur Lösung. (Albert Einstein)";
echo hash("sha256", $str);
// ergibt:
// 39a448a529b271542bd12ddcd19779c3a0bcaa750442da2e1ad6fbbe0645dd91
~~~


##### Gesalzene Hashes

Dazu aus [Wikipedia](http://de.wikipedia.org/wiki/Salt_(Kryptologie))

> Salt (englisch für Salz) bezeichnet in der Kryptographie eine zufällig gewählte Zeichenfolge, die an einen gegebenen Klartext vor der Verwendung als Eingabe einer Hashfunktion angehängt wird, um die Entropie der Eingabe zu erhöhen. Es wird häufig für die Speicherung und Übermittlung von Computer-Passwörtern benutzt.

Das Prinzip ist, vor dem hashen dem Ausgangswert noch einen weitern Wert, den "Salt", hinzuzufügen. Dadurch ergibt sich ein anderer Hashwert und unterbindet/erschwert somit das herausfinden des Ausgangswertes über die bereits erwähnten [Rainbow-Tables](http://de.wikipedia.org/wiki/Rainbow_Table).


Beispiel mit "Salz". Gäbe es in einer Rainbow-Table bereits die Kombination zwischen Frank und dem ungesalzenen Hash, dann kann mit Hilfe des Salz und des daraus entstehenden abweichenden Hash die Feststellung jedenfalls erschwert werden.

**WICHTIG**: Ändert sich der Salt oder wird dieser "verloren", kann kann eine korrekte Berechnung des richigen Hash durchgeführt werden und es muss ein neues Passwort erstellt werden.

~~~ php
$str = "Frank";
$salt = "sAit,4#";
echo hash("sha256", $str.$salt);
// ergibt:
// af5340996c00a6fcc3146c276e172aa866d0f6ef4ce6df7c44987c5f2bcf6774
~~~


### Kodierung

[Wikipedia:](http://de.wikipedia.org/wiki/Code)

> Ein Code ist eine Vorschrift, wie Nachrichten oder Befehle zur Übersetzung für ein Zielsystem umgewandelt werden. Beispielsweise stellt der Morsecode eine Beziehung zwischen Buchstaben und einer Abfolge kurzer und langer Tonsignale her. ... In der Kommunikationswissenschaft bezeichnet ein Code im weitesten Sinne eine Sprache.


Üblichster Vertreter ist hier die [Base64-Kodierung](http://de.wikipedia.org/wiki/Base64) für  E-Mails. 

> ... findet im Internet-Standard MIME (Multipurpose Internet Mail Extensions) Anwendung und wird damit hauptsächlich zum Versenden von E-Mail-Anhängen verwendet. Nötig ist dies, um den problemlosen Transport von beliebigen Binärdaten zu gewährleisten, da SMTP in seiner ursprünglichen Fassung nur für den Versand von 7-Bit-ASCII-Zeichen ausgelegt war. Durch die Kodierung steigt der Platzbedarf des Datenstroms um 33–36 % (33 % durch die Kodierung selbst, bis zu weitere 3 % durch die im kodierten Datenstrom eingefügten Zeilenumbrüche).


In PHP stehen dafür die Funktionen [base64_encode()](http://php.net/manual/de/function.base64-encode.php) und [base64_decode()](http://www.php.net/manual/de/function.base64-decode.php) zur Verfügung.


<div class="alert alert-info"><strong>Hinweis!</strong> Die oben erwähnten Funktionen zu verwenden, um Texte "geheim" zu halten oder "unleserlich" zu machen, macht wenig Sinn. Zumeist ist schon am kodierten Ergebnis relativ eindeutig ersichtlich das es sich um das Produkt einer Base64-Kodierung handelt. Hierzu ist eine Verschlüsselung anzuwenden, siehe dazu weiter unten.</div>


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
// ergibt:
// Franz jagt im komplett verwahrlosten Taxi quer durch Bayern.
~~~


### Verschlüsselung

[Wikipedia:](http://de.wikipedia.org/wiki/Verschl%C3%BCsselung)

> Verschlüsselung nennt man den Vorgang, bei dem ein klar lesbarer Text (Klartext, oder auch Informationen anderer Art wie Ton- oder Bildaufzeichnungen) mit Hilfe eines Verschlüsselungsverfahrens (Kryptosystem) in eine "unleserliche", das heißt nicht einfach interpretierbare Zeichenfolge (also Geheimtext) umgewandelt wird. Als entscheidend wichtige Parameter der Verschlüsselung werden hierbei ein oder auch mehrere Schlüssel verwendet.


PHP-Funktionen: 
[mcrypt()](http://www.php.net/manual/de/book.mcrypt.php)
