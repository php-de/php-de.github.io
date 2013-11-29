---
layout: guide

permalink: /jumpto/idna/
title: " Internationalisierte Domainnamen (IDN) / Punycode"
group: "HTTP / Domain / URL / Requests / Dateisystem"
orderId: 9

creator: hausl
author:
    -   name: hausl
        profile: 21246

inhalt:
    -   name: "Begriffserklärung"
        anchor: begriffserklrung
        simple: "IDN, Punycode, Beispiele"

    -   name: "Anwendungsgebiete in PHP"
        anchor: anwendungsgebiete-in-php
        simple: "Wann ist was zu tun?"

    -   name: "Konvertierung in Punycode"
        anchor: konvertierung
        simple: "externe Klassen, PHP-Boardmittel"

    -   name: "Quellen, RFC"
        anchor: quellen-rfc
        simple: "Weiterführendes"


entry-type: in-progress
---


### Begriffserklärung

#### IDN

[Wikipedia:](http://de.wikipedia.org/wiki/Internationalisierter_Domainname)

> Als internationalisierte Domainnamen (englisch internationalized domain name; IDN), umgangssprachlich auch *Umlautdomain* oder *Sonderzeichendomain*, werden Domainnamen bezeichnet, die Umlaute, diakritische Zeichen oder Buchstaben aus anderen Alphabeten als dem lateinischen Alphabet enthalten. Solche Zeichen waren ursprünglich im Domain Name System nicht vorgesehen und wurden nachträglich durch den Internetstandard Internationalizing Domain Names in Applications (IDNA) ermöglicht.

> Grundsätzlich sind alle Unicode-Zeichen in IDNs zulässig. Jede Vergabestelle für Domains regelt jedoch individuell, welche Zeichen sie für Domain-Registrierungen erlaubt. 


#### Punycode

[Wikipedia:](http://de.wikipedia.org/wiki/Punycode)

> Punycode ist ein im RFC 3492 standardisiertes Kodierungsverfahren zum Umwandeln von Unicode-Zeichenketten in ASCII-kompatible Zeichenketten, die aus den Zeichen a bis z, 0 bis 9 und dem Bindestrich bestehen. Punycode wurde entworfen, um internationalisierte Domainnamen aus Unicode-Zeichen eindeutig und umkehrbar durch ASCII-Zeichen darzustellen.


#### Beipiele

Beispiele von IDN - mit entsprechender Punycodedarstellung,  .example wird hier als Beispiel-Topleveldomain verwendet.

~~~
dömäin.example   →  xn--dmin-moa0i.example  
äaaa.example     →  xn--aaa-pla.example  
aaaä.example     →  xn--aaa-sla.example  
déjà.vu.example  →  xn--dj-kia8a.vu.example  
ñandú.example    →  xn--and-6ma2c.example  
~~~


### Anwendungsgebiete in PHP

Sämtliche Funktionen die Operationen mit Domains durchführen, benötigen bei der Anwendung mit Sonderzeichendomains eine vorherige Umwandlung dieser in Punycode. Beispiele dafür wären zB:

- `file_get_contens()`
- `checkdnsrr()`
- filter_var zur [E-Mail-Validierung]({{ site.url }}/jumpto/standard-mail-validation/#filtervar)
- etc ...


##### cURL - Zusatzinfo:

Bei der Anwendung von cURL ist es möglicherweise nicht separat nötig, die Sonderzeichendomains (IDN) vorher in Punycode zu wandeln. Ob cURL mit IDN-Unterstützung verfügbar ist, ist in der phpinfo() ersichtlich.

![cURL phpinfo()]({{ site.url }}/images/idn-phpinfo.jpg)


### Konvertierung 

#### Externe Punycode-Klasse

Für die Punycodeumwandlung gibt es einige PHP-Klassen im Web, dazu am besten mal [Tante G.](https://www.google.at/search?q=php+punycode+OR+idna+converter) fragen.

Weit verbreitet ist die PHP-Klasse [idna_convert von Matthias Sommerfeld](http://phlymail.com/de/downloads/idna-convert.html) - dort gibts es überdies einen [Online-Punycode-Konverter](http://idnaconv.phlymail.de/?lang=de).


#### PHP-Boardmittel

Wenn folgende Voraussetzungen erfüllt sind ...

> PHP 5 >= 5.3.0, [PECL intl >= 1.0.2](http://pecl.php.net/package/intl), [PECL idn >= 0.1](http://pecl.php.net/package/idn) 

... dann steht die Funktion [idn_to_ascii()](http://php.net/manual/de/function.idn-to-ascii.php) zur Konvertierung in Punycode direkt zur Verfügung. Somit würde man sich eine externe Klasse ersparen.

Mittels nachfolgendem Aufruf lässt sich rasch feststellen, ob diese Funktion verfügbar ist.

~~~ php
var_dump(function_exists('idn_to_ascii'));  // true oder false
~~~


### RFC zum Thema IDN(A) / Punycode

[RFC 3490](http://tools.ietf.org/html/rfc3490) - Internationalizing Domain Names in Applications (IDNA)  
[RFC 3491](http://tools.ietf.org/html/rfc3491) - Nameprep: A Stringprep Profile for Internationalized Domain Names (IDN)  
[RFC 3492](http://tools.ietf.org/html/rfc3492) - Punycode: A Bootstring encoding of Unicode for Internationalized Domain Names in Applications (IDNA)  
[RFC 3454](http://tools.ietf.org/html/rfc3454) - Preparation of Internationalized Strings ("stringprep")  
[RFC 5890](http://tools.ietf.org/html/rfc5890) - Internationalized Domain Names for Applications (IDNA): Definitions and Document Framework  
[RFC 5891](http://tools.ietf.org/html/rfc5891) - Internationalized Domain Names in Applications (IDNA): Protocol  
[RFC 5892](http://tools.ietf.org/html/rfc5892) - The Unicode Code Points and Internationalized Domain Names for Applications (IDNA)  
[RFC 5893](http://tools.ietf.org/html/rfc5893) - Right-to-Left Scripts for Internationalized Domain Names for Applications (IDNA)  
[RFC 5894](http://tools.ietf.org/html/rfc5894) - Internationalized Domain Names for Applications (IDNA): Background, Explanation, and Rationale  
