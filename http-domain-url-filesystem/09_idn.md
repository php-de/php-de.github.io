---
layout: guide

permalink: /jumpto/idna/
root: ../..
title: "Internationalisierte Domainnamen (IDN) / Punycode"
group: "HTTP / Domain / URL / Requests / Dateisystem"
orderId: 9

creator: hausl
author:
    -   name: hausl
        profile: 21246

inhalt:
    -   name:   "Begriffserklärung"
        anchor: begriffserklaerung
        simple: "IDN, Punycode, Beispiele, E-Mail-Adressen"

    -   name:   "Anwendungsgebiete in PHP"
        anchor: anwendungsgebiete-in-php
        simple: "Wann ist was zu tun?"

    -   name:   "Konvertierung in Punycode"
        anchor: konvertierung
        simple: "externe Klassen, PHP-Boardmittel"

    -   name:   "RFC zum Thema IDN(A) / Punycode"
        anchor: rfc-zum-thema-idn-a-punycode
        simple: ""

entry-type: in-discussion
---

## [Begriffserklärung](#begriffserklaerung)
{: #begriffserklaerung}

### [IDN (*Internationalized domain name*)](#idn-internationalized-domain-name)
{: #idn-internationalized-domain-name}

[Wikipedia](http://de.wikipedia.org/wiki/Internationalisierter_Domainname):

> Als internationalisierte Domainnamen (englisch internationalized domain name; IDN), umgangssprachlich auch *Umlautdomain* oder *Sonderzeichendomain*, werden Domainnamen bezeichnet, die Umlaute, diakritische Zeichen oder Buchstaben aus anderen Alphabeten als dem lateinischen Alphabet enthalten. Solche Zeichen waren ursprünglich im Domain Name System nicht vorgesehen und wurden nachträglich durch den Internetstandard Internationalizing Domain Names in Applications (IDNA) ermöglicht.
>
> Grundsätzlich sind alle Unicode-Zeichen in IDNs zulässig. Jede Vergabestelle für Domains regelt jedoch individuell, welche Zeichen sie für Domain-Registrierungen erlaubt.

### [Punycode](#punycode)
{: #punycode}

[Wikipedia](http://de.wikipedia.org/wiki/Punycode):

> Punycode ist ein im [RFC 3492](http://tools.ietf.org/html/rfc3492) standardisiertes Kodierungsverfahren zum Umwandeln von Unicode-Zeichenketten in ASCII-kompatible Zeichenketten, die aus den Zeichen a bis z, 0 bis 9 und dem Bindestrich bestehen. Punycode wurde entworfen, um internationalisierte Domainnamen aus Unicode-Zeichen eindeutig und umkehrbar durch ASCII-Zeichen darzustellen.

### [Beipiele](#beipiele)
{: #beipiele}

Beispiele von IDN mit entsprechender Punycode-Darstellung:

~~~
müller.de    →  xn--mller-kva
übung.de     →  xn--bung-zra.de
dömäin.com   →  xn--dmin-moa0i.com
äaaa.com     →  xn--aaa-pla.com
déjà.vu.com  →  xn--dj-kia8a.vu.com
ñandú.com    →  xn--and-6ma2c.com
~~~

### [E-Mail-Adressen](#e-mail-adressen)
{: #e-mail-adressen}

Für E-Mail-Adressen gilt insgesamt selbiges wie oben erwähnt.

[Beispiele von Wikipedia (en)](http://en.wikipedia.org/wiki/Email_address#Internationalization_examples):

~~~
Pelé@example.com                 →  xn--pel-dma@example.com
δοκιμή@παράδειγμα.δοκιμή         →  xn--jxalpdlp@xn--hxajbheg2az3al.xn--jxalpdlp
чебурашка@ящик-с-апельсинами.рф  →  xn--80aabp1a8au3ao@xn-----8kcayoeblonkwzf2jqc1b.xn--p1ai
~~~



## [Anwendungsgebiete in PHP](#anwendungsgebiete-in-php)
{: #anwendungsgebiete-in-php}

Viele Funktionen, die Operationen mit Domains oder E-Mail-Adressen durchführen, benötigen bei der Anwendung mit Sonderzeichendomains eine vorherige Umwandlung in Punycode. Dies betrifft beispielsweise:

- `file_get_contents()`
- `checkdnsrr()`
- `filter_var($email, FILTER_VALIDATE_EMAIL)` zur [E-Mail-Validierung]({{ page.root }}/jumpto/standard-mail-validation/#filtervar)
- …

### [Zusatzinfo für cURL](#curl-zusatzinfo)
{: #curl-zusatzinfo}

Bei der Anwendung von cURL ist es möglicherweise nicht separat nötig, die Sonderzeichendomains (IDN) vorher in Punycode zu wandeln. Ob cURL bereits mit IDN-Unterstützung verfügbar ist, ist in der phpinfo() ersichtlich.

![cURL phpinfo()]({{ page.root }}/images/idn-phpinfo.jpg)



## [Konvertierung](#konvertierung)
{: #konvertierung}

### [Externe Punycode-Klasse](#externe-punycode-klasse)
{: #externe-punycode-klasse}

Für die Punycode-Umwandlung gibt es einige PHP-Klassen im Web. Dazu für aktuelle Ergebnisse am besten eine [Suchmaschine] befragen. Weit verbreitet ist die PHP-Klasse [idna_convert] von Matthias Sommerfeld. Dort gibt es zudem einen [Online-Punycode-Konverter][OPK].

[Suchmaschine]: https://duckduckgo.com/?q=!g+php+(punycode+OR+idna+converter)
[idna_convert]: http://phlymail.com/de/downloads/idna-convert.html
[OPK]: http://idnaconv.phlymail.de/?lang=de

Einige Beispiele mit dieser Klasse:

~~~ php
require 'idna_convert.class.php';
$idn = new idna_convert();

// kein Unicode
$domain = 'example.com';
echo $idn->encode($domain);
// example.com

// deutsche Umlaute
$domain = 'frühlingsgefühle.de';
echo $idn->encode($domain);
// xn--frhlingsgefhle-hsbj.de

// griechische Zeichen
$domain = 'παράδειγμα.δοκιμή';
echo $idn->encode($domain);
// xn--hxajbheg2az3al.xn--jxalpdlp

// kyrillische Zeichen
$domain = 'ящик-с-апельсинами.рф';
echo $idn->encode($domain);
// xn-----8kcayoeblonkwzf2jqc1b.xn--p1ai
~~~

E-Mail-Adressen:

~~~ php
$email = 'pelé@example.com';
echo $idn->encode($email);
// xn--pel-dma@example.com

$email = 'mail@übung.de';
echo $idn->encode($email);
// mail@xn--bung-zra.de
~~~

### [PHP-Boardmittel](#php-boardmittel)
{: #php-boardmittel}

Wenn folgende Voraussetzungen erfüllt sind…

> PHP 5 >= 5.3.0, [PECL intl >= 1.0.2](http://pecl.php.net/package/intl), [PECL idn >= 0.1](http://pecl.php.net/package/idn)

…, dann steht die Funktion [idn_to_ascii()](http://php.net/manual/de/function.idn-to-ascii.php) zur Konvertierung in Punycode direkt zur Verfügung. Somit könnte auf eine externe Klasse verzichtet werden.

Mit diesem Aufruf kann festgestellt werden, ob die Funktion verfügbar ist:

~~~ php
var_dump(function_exists('idn_to_ascii')); // true oder false
~~~



## [RFC zum Thema IDN(A) / Punycode](#rfc-zum-thema-idn-a-punycode)
{: #rfc-zum-thema-idn-a-punycode}

- [RFC 3454](http://tools.ietf.org/html/rfc3454) - Preparation of Internationalized Strings ("stringprep")
- [RFC 3490](http://tools.ietf.org/html/rfc3490) - Internationalizing Domain Names in Applications (IDNA)
- [RFC 3491](http://tools.ietf.org/html/rfc3491) - Nameprep: A Stringprep Profile for Internationalized Domain Names (IDN)
- [RFC 3492](http://tools.ietf.org/html/rfc3492) - Punycode: A Bootstring encoding of Unicode for Internationalized Domain Names in Applications (IDNA)
- [RFC 5890](http://tools.ietf.org/html/rfc5890) - Internationalized Domain Names for Applications (IDNA): Definitions and Document Framework
- [RFC 5891](http://tools.ietf.org/html/rfc5891) - Internationalized Domain Names in Applications (IDNA): Protocol
- [RFC 5892](http://tools.ietf.org/html/rfc5892) - The Unicode Code Points and Internationalized Domain Names for Applications (IDNA)
- [RFC 5893](http://tools.ietf.org/html/rfc5893) - Right-to-Left Scripts for Internationalized Domain Names for Applications (IDNA)
- [RFC 5894](http://tools.ietf.org/html/rfc5894) - Internationalized Domain Names for Applications (IDNA): Background, Explanation, and Rationale
