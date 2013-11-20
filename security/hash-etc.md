---
layout: guide
permalink: /jumpto/hash-etc/
title: "Hashing, Kodierung, Verschlüsselung"
group: "Sicherheit"
creator: hausl
author:
    -   name: hausl
        profile: 21246
inhalt:
    -   name: "Hashing (Hash-Funktion)"
        anchor: hashing-hash-funktion
        simple: "Anwendung, Sicherheit, Beispiele, Gesalzene Hashes"

    -   name: "Kodierung"
        anchor: kodierung
        simple: "base64_encode(), base64_decode()"

    -   name: "Verschlüsselung"
        anchor: verschlsselung
        simple: "Mcrypt-Erweiterung"

entry-type: in-discussion
---


Diese Übersicht gibt einen kurzen Überblick über die unterschiedlichen Verfahren. Weitere Detailinformationen gibt es dazu u.a. bei den verlinkten Quellen.


### Hashing (Hash-Funktion)

Zweck des Hashing ist es aus einem Ausgangswert einen nicht rückrechenbaren Hash zu generieren. Unabhängig der Länge des Ausgangswertes entsteht je nach verwendeter Funktion ein gleich langer Hash. Hierfür stehen in PHP für verschiedene Hash-Algorithmen entsprechende Funktionen zur Verfügung (zB hash(), crypt()...). 

[Weiters Details bei Wikipedia: Hashfunktion](http://de.wikipedia.org/wiki/Hashfunktion)

[PHP.de - Hash](http://php.net/manual/de/book.hash.php)


##### Anwendung

Die übliche Anwendung besteht darin, Paswörter zu hashen, bevor diese in der Datenbank gespeichert werden. Damit sind diese in der gehashten Form soweit nutzlos, selbst wenn man Zugriff darauf erlangt.

Beim Login-Vorgang wird dann das im Login-Formular eingegebene Klartext Passwort mit dem selben Algorithmus, wie jener der vor der Speicherung angewandt wurde, gehasht und dann dieser eben errechnete Hash mit dem bestehenden Hash in der Datenbank verglichen. Stimmen diese beiden überein, ist das Login-Passwort korrekt.


##### Sicherheit der Hash-Algorithmen

Das Sicherheitsrikiso bei Hash-Werten liegt in der grundsätzlichen Möglichkeit von Kollisionen. Dabei geht es in erster Linie darum, einen Ausgangswert zu finden, der nach dem Hash-Vorgang den selben Hash-Wert als Ergebnis hat.

Weitere Informationen dazu:

Warum man [md5() nicht mehr verwenden sollte](http://de.wikipedia.org/wiki/Message-Digest_Algorithm_5#Kollisionsresistenz)

Stichwort [Rainbow-Tables](http://de.wikipedia.org/wiki/Rainbow_Table) 

Aus diesem Grund wird von der weiteren Verwendung von MD5 (PHP-Funktion md5()) abgeraten. Ebenso wie  die Funktionen der [SHA-1 Familie](http://de.wikipedia.org/wiki/Secure_Hash_Algorithm#SHA.2FSHA-1).

PHP.net empfiehlt an dieser Stelle, auf den SHA256 Algorithmus ebenfalls zu verzichten.

[php.net FAQ "Save Password Hashing"](http://www.php.net/manual/de/faq.passwords.php)


##### Gesalzene Hashes

Dazu aus [Wikipedia](http://de.wikipedia.org/wiki/Salt_(Kryptologie))

> Salt (englisch für Salz) bezeichnet in der Kryptographie eine zufällig gewählte Zeichenfolge, die an einen gegebenen Klartext vor der Verwendung als Eingabe einer Hashfunktion angehängt wird, um die Entropie der Eingabe zu erhöhen. Es wird häufig für die Speicherung und Übermittlung von Computer-Passwörtern benutzt.

Das Prinzip ist, vor dem hashen dem Ausgangswert noch einen weitern Wert, den "Salt", hinzuzufügen. Dadurch ergibt sich ein anderer Hashwert und unterbindet/erschwert somit das herausfinden des Ausgangswertes über die bereits erwähnten [Rainbow-Tables](http://de.wikipedia.org/wiki/Rainbow_Table).


Beispiel mit "Salz". Gäbe es in einer Rainbow-Table bereits die Kombination zwischen *Frank* und dem ungesalzenen Hash, dann kann mit Hilfe des Salz und des daraus entstehenden abweichenden Hash die direkte Feststellung verhindert werden.



### Kodierung

[Wikipedia:](http://de.wikipedia.org/wiki/Code)

> Ein Code ist eine Vorschrift, wie Nachrichten oder Befehle zur Übersetzung für ein Zielsystem umgewandelt werden. Beispielsweise stellt der Morsecode eine Beziehung zwischen Buchstaben und einer Abfolge kurzer und langer Tonsignale her. ... In der Kommunikationswissenschaft bezeichnet ein Code im weitesten Sinne eine Sprache.


Üblichster Vertreter ist hier die [Base64-Kodierung](http://de.wikipedia.org/wiki/Base64) für  E-Mails. 

> ... findet im Internet-Standard MIME (Multipurpose Internet Mail Extensions) Anwendung und wird damit hauptsächlich zum Versenden von E-Mail-Anhängen verwendet. Nötig ist dies, um den problemlosen Transport von beliebigen Binärdaten zu gewährleisten, da SMTP in seiner ursprünglichen Fassung nur für den Versand von 7-Bit-ASCII-Zeichen ausgelegt war. Durch die Kodierung steigt der Platzbedarf des Datenstroms um 33–36 % (33 % durch die Kodierung selbst, bis zu weitere 3 % durch die im kodierten Datenstrom eingefügten Zeilenumbrüche).


In PHP stehen dafür die Funktionen [base64_encode()](http://php.net/manual/de/function.base64-encode.php) und [base64_decode()](http://www.php.net/manual/de/function.base64-decode.php) zur Verfügung.


<div class="alert alert-info"><strong>Hinweis!</strong> Die oben erwähnten Funktionen zu verwenden, um Texte "geheim" zu halten oder "unleserlich" zu machen, macht wenig Sinn. Zumeist ist schon am kodierten Ergebnis relativ eindeutig ersichtlich das es sich um das Produkt einer Base64-Kodierung handelt. Hierzu ist eine Verschlüsselung anzuwenden, siehe dazu weiter unten.</div>


### Verschlüsselung

[Wikipedia:](http://de.wikipedia.org/wiki/Verschl%C3%BCsselung)

> Verschlüsselung nennt man den Vorgang, bei dem ein klar lesbarer Text (Klartext, oder auch Informationen anderer Art wie Ton- oder Bildaufzeichnungen) mit Hilfe eines Verschlüsselungsverfahrens (Kryptosystem) in eine "unleserliche", das heißt nicht einfach interpretierbare Zeichenfolge (also Geheimtext) umgewandelt wird. Als entscheidend wichtige Parameter der Verschlüsselung werden hierbei ein oder auch mehrere Schlüssel verwendet.


PHP-Funktionen z.B. über die Erweiterung MCrypt: 
[mcrypt()](http://www.php.net/manual/de/book.mcrypt.php)

