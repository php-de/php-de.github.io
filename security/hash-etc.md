---
layout: guide

permalink: /jumpto/hash-etc/
root: ../..
title: "Hashing, Kodierung, Verschlüsselung"
group: "Sicherheit"
orderId: 14

creator: hausl

author:
    -   name: hausl
        profile: 21246
inhalt:
    -   name: "Hashing (Hash-Funktion)"
        anchor: hashing
        simple: "Anwendung, Sicherheit"

    -   name: "Kodierung"
        anchor: kodierung
        simple: "base64_encode(), base64_decode()"

    -   name: "Verschlüsselung"
        anchor: verschluesselung
        simple: "Mcrypt-Erweiterung"

entry-type: in-discussion
---


Diese Übersicht gibt einen kurzen Überblick über die unterschiedlichen Verfahren. Weitere Detailinformationen gibt es dazu u.a. bei den verlinkten Quellen.


### [Hashing (Hash-Funktion)](#hashing)
{: #hashing}

Zweck des Hashing ist es aus einem Ausgangswert einen nicht rückrechenbaren Hash zu generieren. Unabhängig der Länge des Ausgangswertes entsteht je nach verwendeter Funktion ein gleich langer Hash. Hierfür stehen in PHP für verschiedene Hash-Algorithmen entsprechende Funktionen zur Verfügung. [Wikipedia Artikel zu "Hashfunktion".](http://de.wikipedia.org/wiki/Hashfunktion)


##### [Anwendung](#anwendung)
{: #anwendung}

Die übliche Anwendung besteht darin, Paswörter zu hashen, bevor diese in der Datenbank gespeichert werden. Damit sind diese in der gehashten Form soweit grundsätzlich nutzlos, selbst wenn man Zugriff darauf erlangt.

Beim Login-Vorgang wird dann das im Login-Formular eingegebene Klartext-Passwort mit dem selben Algorithmus, wie jener der vor der Speicherung angewandt wurde, gehasht und dann dieser eben errechnete Hash mit dem bestehenden Hash in der Datenbank verglichen. Stimmen diese beiden überein, ist das Login-Passwort korrekt.


##### [Sicherheit und Anwendungsempfehlung](#best-practise)
{: #best-practise}

Das Sicherheitsrikiso bei Hash-Werten liegt in der grundsätzlichen Möglichkeit von Kollisionen, Stichwort: ["Rainbow-Tables"](http://de.wikipedia.org/wiki/Rainbow_Table). Dabei geht es in erster Linie darum, einen Ausgangswert zu finden, der nach dem Hash-Vorgang den selben Hash-Wert als Ergebnis hat.

Weitere Details, sowie Anwendungsempfehlungen, sind in den nachfolgenden Artikel zu finden.

[Sicheres Password Hashing](http://php.net/manual/de/faq.passwords.php).

[PHP-Doku zu crypt():](http://php.net/manual/de/function.crypt.php)

> password_hash() verwendet einen starken Hash, erzeugt ein starkes Salt, und wendet eine angemessene Anzahl von Runden automatisch an. password_hash() ist ein einfacher crypt()-Wrapper und kompatibel zu bestehenden Passwort-Hashes. Die Verwendung von password_hash() wird empfohlen.


##### [Anwendungsbeispiel](#beispiel-hash)
{: #beispiel-hash}

~~~php
$plain = "dasPasswort";
$hash  = password_hash($plain, PASSWORD_DEFAULT);

// Kontrolle - F5 drücken ergibt jedes mal einen neuen Hash.
echo $hash;
// z.B: $2y$10$7m/zzhrnqqNm9/Sch2dsUusF4DznOawCB3rLi8JY4mmmtqrx0L97a

// Hash verifizieren
var_dump( password_verify($plain, $hash) ); // true
~~~


### [Kodierung](#kodierung)
{: #kodierung}

[Wikipedia:](http://de.wikipedia.org/wiki/Code)

> Ein Code ist eine Vorschrift, wie Nachrichten oder Befehle zur Übersetzung für ein Zielsystem umgewandelt werden. Beispielsweise stellt der Morsecode eine Beziehung zwischen Buchstaben und einer Abfolge kurzer und langer Tonsignale her. ... In der Kommunikationswissenschaft bezeichnet ein Code im weitesten Sinne eine Sprache.


Üblichster Vertreter ist hier die [Base64-Kodierung](http://de.wikipedia.org/wiki/Base64) für  E-Mails.

> ... findet im Internet-Standard MIME (Multipurpose Internet Mail Extensions) Anwendung und wird damit hauptsächlich zum Versenden von E-Mail-Anhängen verwendet. Nötig ist dies, um den problemlosen Transport von beliebigen Binärdaten zu gewährleisten, da SMTP in seiner ursprünglichen Fassung nur für den Versand von 7-Bit-ASCII-Zeichen ausgelegt war. Durch die Kodierung steigt der Platzbedarf des Datenstroms um 33–36 % (33 % durch die Kodierung selbst, bis zu weitere 3 % durch die im kodierten Datenstrom eingefügten Zeilenumbrüche).


In PHP stehen dafür die Funktionen [base64_encode()](http://php.net/manual/de/function.base64-encode.php) und [base64_decode()](http://php.net/manual/de/function.base64-decode.php) zur Verfügung.


<div class="alert alert-warning"><strong>Achtung!</strong> Die oben erwähnten base64-Funktionen zu verwenden, um Texte "geheim" zu halten oder "unleserlich" zu machen, macht keinen Sinn. Zumeist ist schon am kodierten Ergebnis relativ eindeutig ersichtlich das es sich um das Produkt einer Base64-Kodierung handelt. Hierzu ist eine Verschlüsselung anzuwenden, siehe dazu weiter unten.</div>


### [Verschlüsselung](#verschluesselung)
{: #verschluesselung}

[Wikipedia:](http://de.wikipedia.org/wiki/Verschl%C3%BCsselung)

> Verschlüsselung nennt man den Vorgang, bei dem ein klar lesbarer Text (Klartext, oder auch Informationen anderer Art wie Ton- oder Bildaufzeichnungen) mit Hilfe eines Verschlüsselungsverfahrens (Kryptosystem) in eine "unleserliche", das heißt nicht einfach interpretierbare Zeichenfolge (also Geheimtext) umgewandelt wird. Als entscheidend wichtige Parameter der Verschlüsselung werden hierbei ein oder auch mehrere Schlüssel verwendet.

In PHP stehen dafür die Funktionen der kryptografischen Erweiterung [Mcrypt](http://php.net/manual/de/book.mcrypt.php) zur Verfügung.


##### [Anwendungsbeispiel](#beispiel-crypt)
{: #beispiel-crypt}

Die hier verwendete Klasse wurde als Anwendungsbeispiel [von einigen Benutzern im php.de-Forum](http://www.php.de/forum/php-de-intern/wiki-diskussionsforum/1448256-verschl%C3%BCsselung-erg%C3%A4nzung-beispielklasse) erstellt und ist grundsätzlich lauffähig. Ein Einsatz im produktiven Betrieb liegt natürlich im eigenen Ermessen.

Um das erstellte, verschlüsselte Ergebnis als lesbaren String weitergeben zu können, wird die base64-Kodierung verwendet.

**Die Klasse**

~~~php
<?php
/**
 * Mcrypt Adapter
 *
 * @license https://creativecommons.org/publicdomain/zero/1.0/
 * @see http://php.net/manual/en/book.mcrypt.php
 * @see https://en.wikipedia.org/wiki/Adapter_pattern
 * @see https://en.wikipedia.org/wiki/Padding_(cryptography)#PKCS7
 * @see http://stackoverflow.com/a/7324793
 * @see http://www.cryptofails.com/post/70059609995/crypto-noobs-1-initialization-vectors
*/
class Cipher
{
    /**
     * @var hash of passphrase
     */
    private $secureKey;

    /**
     * @var initialization vector size
     */
    private $initializationVectorSize;

    /**
     * @var en-/decryption method
     */
    private $cryptCipher = MCRYPT_RIJNDAEL_128;

    /**
     * @var en-/decryption mode
     */
    private $cryptMode = MCRYPT_MODE_CBC;

    /**
     * Constructor
     *
     * @api
     * @param string $passpharse
     */
    public function __construct($passphrase)
    {
        $this->secureKey = hash('sha256', $passphrase, true);
        $this->initializationVectorSize = mcrypt_get_iv_size($this->cryptCipher, $this->cryptMode);
    }

    /**
     * query command - encrypts the given data string
     *
     * @api
     * @param string $unencryptedData
     * @return string
     */
    public function encrypt($unencryptedData)
    {
        $iv = mcrypt_create_iv($this->initializationVectorSize, MCRYPT_DEV_URANDOM);

        $blockSize = mcrypt_get_block_size($this->cryptCipher, $this->cryptMode);
        $rest = strlen($unencryptedData) % $blockSize;
        $pad = $blockSize - ($rest > 0) ? $rest : $blockSize;

        return $iv . mcrypt_encrypt(
            $this->cryptCipher,
            $this->secureKey,
            $unencryptedData . str_repeat(chr($pad), $pad),
            $this->cryptMode,
            $iv
        );
    }

    /**
     * query command - decrypts the given encrypted string
     *
     * @api
     * @param string $encryptedData
     * @return string
     */
    public function decrypt($encryptedData)
    {
        $decryptedData = mcrypt_decrypt(
            $this->cryptCipher,
            $this->secureKey,
            substr($encryptedData, $this->initializationVectorSize),
            $this->cryptMode,
            substr($encryptedData, 0, $this->initializationVectorSize)
        );
        $pad = ord($decryptedData[strlen($decryptedData) - 1]);
        return substr($decryptedData, 0, -$pad);
    }
}
~~~


**User A**

~~~php
require_once "cipher.class.php";

$uncrypted = 'Fußball á la Bärbel';

$passphrase = 'f00bar';
$cipher = new Cipher($passphrase);
$crypted = $cipher->encrypt($uncrypted); // ergibt bei jeder Anwendung ein anderes Ergebnis

var_dump( base64_encode($crypted) ); // z.B. MNK5fNUDNj0Nwe2hYbocGMWiNpHmpp8NcpIPr07st2myTi4NuFVq0RDF3f47Aoci
~~~

**User B**

~~~php
require_once "cipher.class.php";

$crypted = 'MNK5fNUDNj0Nwe2hYbocGMWiNpHmpp8NcpIPr07st2myTi4NuFVq0RDF3f47Aoci';
$crypted = base64_decode($crypted);

$passphrase = 'f00bar';
$cipher = new Cipher($passphrase);
$decrypted = $cipher->decrypt($crypted);

var_dump($decrypted); // Fußball á la Bärbel
~~~
