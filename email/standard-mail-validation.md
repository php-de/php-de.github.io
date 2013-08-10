---
layout: guide
title: Standard E-Mail-Validierung
entry-type: in-progress
creator: hausl
author:
    -   name: hausl
        profile: 21246
---
Dieses Tutorial zeigt grundsätzliche (übliche) Möglichkeiten, eine E-Mail-Adresse *(wie sie für den Transport per SMTP im Internet verwendet wird, besteht aus zwei Teilen, die durch ein @-Zeichen voneinander getrennt sind)*
 zu validieren. 

Vorweg sei an dieser Stelle erwähnt das eine Prüfung auf tatsächliche Existenz einer E-Mail-Adresse auf diesem Weg nicht möglich ist. Die nachfolgende Ansätze dienen lediglich zur Feststellung ob die grundlegenden formellen Rahmenbedingungen erfüllt wurden bzw. einer positiven [DNS](http://de.wikipedia.org/wiki/Domain_Name_System)-Antwort im Falle einer [Domain](http://de.wikipedia.org/wiki/Domain)-[DNS](http://de.wikipedia.org/wiki/Domain_Name_System)-Prüfung. Weiters erhebt dieses Tutorial nicht den Anspruch, sämtlichen [RFC](http://tools.ietf.org/html/rfc2822) zu dem Thema zu genügen (wenn sich schon die meisten großen Provider und Mail-Anbieter nicht daran halten ...).

#### 1. <a name="filtervar"></a> filter_var()

PHP stellt ab Version 5.2 die Funktion [filter_var()](http://php.net/manual/de/function.filter-var.php) zur Verfügung. Mit dem optionalen Parameter FILTER_VALIDATE_EMAIL kann diese grundsätzlich zur E-Mail-Validierung verwendet werden. Jedoch ist es damit nicht möglich internationalisierte E-Mail-Adressen zu prüfen - solche werden immer als falsch ausgewertet. Lösungsansätze folgen [weiter unten](#intdomain).

    function isValidEmail($mail)
    { 
        return (bool) filter_var($mail, FILTER_VALIDATE_EMAIL);
    } 

    var_dump(isValidEmail("test@example.com"));  // true
    var_dump(isValidEmail("pelé@example.com"));  // false
    var_dump(isValidEmail("mail@übung.de"));     // false

**Hinweis**

Sollte filter_var() nicht verfügbar sein, dann den Provider kontaktieren (oder wechseln :)). Im worst-case gibt es [auf dieser Seite](http://www.regular-expressions.info/email.html) unten (vorletzter Absatz) ein zur [RFC 2822](http://tools.ietf.org/html/rfc2822#section-3.4.1) empfohlenes Regex-Pattern.

> We get a more practical implementation of RFC 2822 if we omit the syntax using double quotes and square brackets. It will still match 99.99% of all email addresses in actual use today. 

    function isValidEmail($mail)
    { 
        $pattern = '#[a-z0-9!\\#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!\#$%&\'*+/=?^_`{|}~-]+)*'
                 . '@'
                 . '(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?#i';
        return (bool) preg_match($pattern, $mail);
    } 

    var_dump(isValidEmail("test@example.com"));  // true
    var_dump(isValidEmail("pelé@example.com"));  // false
    var_dump(isValidEmail("mail@übung.de"));     // false 

Dies kann alternativ statt filter_var() verwendet werden. Ebenso wie [oben bei filter_var()](#filtervar) schlägt die Prüfung von internationalisierten Domains damit fehl (was hier bereits am Pattern offensichtlich erkennbar ist).
   
  
#### 2. <a name="intdomain"></a> Exkurs: Internationalisierte Domainnamen (IDN)

[Dazu aus Wikipedia:](http://de.wikipedia.org/wiki/Internationalisierter_Domainname)
> Als internationalisierte Domainnamen (englisch internationalized domain name; IDN), umgangssprachlich auch Umlautdomain oder Sonderzeichendomain, werden Domainnamen bezeichnet, die Umlaute, diakritische Zeichen oder Buchstaben aus anderen Alphabeten als dem lateinischen Alphabet enthalten. Solche Zeichen waren ursprünglich im Domain Name System nicht vorgesehen und wurden nachträglich durch den Internetstandard Internationalizing Domain Names in Applications (IDNA) ermöglicht.

> Grundsätzlich sind alle Unicode-Zeichen in IDNs zulässig. Jede Vergabestelle für Domains regelt jedoch individuell, welche Zeichen sie für Domain-Registrierungen erlaubt. 

[Beispiele von Wikipedia (en)](http://en.wikipedia.org/wiki/Email_address#Internationalization_examples):

> * Latin Alphabet (with diacritics): Pelé@example.com
> * Greek Alphabet: δοκιμή@παράδειγμα.δοκιμή
> * Japanese Characters: 甲斐@黒川.日本
> * Cyrillic Characters: чебурашка@ящик-с-апельсинами.рф


Um auch internationalisierte Domains auf grundsätzliche formelle Korrektheit zu prüfen ist die Konvertierung in [Punycode](http://de.wikipedia.org/wiki/Punycode) vor der eigentlichen Prüfung nötig. Nachfolgend dazu die grundsätzlichen Möglichkeiten:

#### 3. <a name="punyclass"></a> Konvertierung durch eine externe Punycode-Klasse

Für die Punycodeumwandlung gibt es einige PHP-Klassen im Web, dazu am besten mal [Tante G.](https://www.google.at/search?q=php+punycode+OR+idna+converter) fragen.

Durch diese Klasse wir die E-Mail-Adresse vorweg in Punycode konvertiert und anschliessend [wie gehabt mittels filter_var()](#filtervar) geprüft. Nachfolgend Beispiel mit der PHP-Klasse ["idna_convert" von Matthias Sommerfeld] (http://phlymail.com/de/downloads/idna-convert.html) - dort gibts es überdies auch einen online [Punycode-Konverter](http://idnaconv.phlymail.de/?lang=de).

    function isValidEmail($mail)
    { 
        return (bool) filter_var($mail, FILTER_VALIDATE_EMAIL);
    } 

    // Prüfungen ohne/vor Punycode-Konvertierung
    var_dump(isValidEmail('mail@example.com'));  // true
    var_dump(isValidEmail('mail@übung.de'));     // false
    var_dump(isValidEmail('pelé@example.com'));  // false

    require_once('idna_convert.class.php');
    $idn = new idna_convert();

    // Prüfungen nach/mit Punycode-Konvertierung
    var_dump(isValidEmail($idn->encode('mail@example.com')));  // true
    var_dump(isValidEmail($idn->encode('mail@übung.de')));     // true
    var_dump(isValidEmail($idn->encode('pelé@example.com')));  // true


#### 4. <a name="phpconv"></a> Konvertierung durch PHP-Boardmittel

Wenn folgende Voraussetzungen erfüllt sind 
> PHP 5 >= 5.3.0, [PECL intl >= 1.0.2](http://pecl.php.net/package/intl), [PECL idn >= 0.1](http://pecl.php.net/package/idn) 

dann steht euch auch direkt die Funktion [idn_to_ascii()](http://php.net/manual/de/function.idn-to-ascii.php) zum Umwandeln von Punycode zur Verfügung. Somit würde man sich die externe Klasse ersparen.
Mittels nachfolgendem Aufruf läßt sich rasch feststellen, ob diese Funktion zur Verfügung steht.

    var_dump(function_exists('idn_to_ascii'));  // true oder false

Die konvertierte E-Mail-Adresse wird dann von filter_var() zur weiteren Validierung übergeben:

    function isValidEmail($mail)
    {
        return (bool) filter_var(idn_to_ascii($mail), FILTER_VALIDATE_EMAIL);
    }

    var_dump(isValidEmail("mail@uebung.de"));  // true
    var_dump(isValidEmail("mail@übung.de"));   // true 

#### 5. <a name="nopuny"></a> Ohne Punycode - Lose Rahmenprüfung mittels Regulären Ausdrücken (Regex)
 
Diese Variante kommt ohne Punycode aus. Dann hierbei spielen die verwendeten Zeichen kaum eine Rolle, es wird nur der grobe Rahmen geprüft, und ob keine Whitespaces  (Leerzeichen, Tabstopps, etc..) vorhanden sind.

    function isValidEmail($mail)
    { 
        // Gesamtlänge check
        // http://de.wikipedia.org/wiki/E-Mail-Adresse#L.C3.A4nge_der_E-Mail-Adresse  
        if (strlen($mail) > 256) return false; 
        /* 
          Pattern: 
          ^       Anker Line-Start 
          \S+     kein Whitespace, mind. 1x (local part) 
          @       @-Zeichen 
          \S+     kein Whitespace, mind. 1x (second level Domain) 
          \.      Punkt 
          \S+     kein Whitespace, mind. 1x (top level domain) 
          $       Anker Line-End 
          i       Modifier: case-insensitive 
        */ 
        $pattern = '#^\S+@\S+\.\S+$#i'; 
        return (bool) preg_match($pattern, $mail); 
    }  

    // TESTS
    var_dump(isValidEmail("mail@uebung.de"));    // true
    var_dump(isValidEmail("mail@übung.de"));     // true 
    var_dump(isValidEmail("pelé@example.com"));  // true 

#### 6. <a name="dnscheck"></a> Zusatz-Option: DNS-Domain-Prüfung

Generell kann in jeder oben angeführten Varianten noch, wenn gewüscht, die Antwort des [DNS](http://de.wikipedia.org/wiki/Domain_Name_System) zur Domain (auf vorhandenen ["MX" oder "A"-Record](http://de.wikipedia.org/wiki/Domain_Name_System#Aufbau_der_DNS-Datenbank)) berücksichtigt werden. Die an das DNS übergebene Domain der E-Mail-Adresse muss für die Verwendung von internationalisierten Domains (wie bei filter_var()) ebenfalls schon in Punycode konvertiert sein.

    function checkEMailDomainDNS($mail)
    {
        $parts = explode('@', $mail);
        return (checkdnsrr($parts[1], "MX") or checkdnsrr($parts[1], "A"));
    }

    // ohne Punycodeumwandlung - funktioniert nicht!
    var_dump(checkEMailDomainDNS('mail@übung.de'));  // false

    require_once('idna_convert.class.php');
    $idn = new idna_convert();

    // mit Punycodeumwandlung
    var_dump(checkEMailDomainDNS($idn->encode('mail@übung.de')));  // true

#### 7. <a name="extsource"></a> Weiterfürhende Quellen

**RFC zum Thema E-Mail**

[RFC 2142](http://tools.ietf.org/html/rfc2142) - Mailbox Names for Common Services, Roles and Functions  
[RFC 2368](http://tools.ietf.org/html/rfc2368) - The mailto URL scheme  
[RFC 2822](http://tools.ietf.org/html/rfc2822) - Internet Message Format  
[RFC 3696](http://tools.ietf.org/html/rfc3696) - Application Techniques for Checking and Transformation of Names  
[RFC 4021](http://tools.ietf.org/html/rfc4021) - Registration of Mail and MIME Header Fields  
[RFC 5321](http://tools.ietf.org/html/rfc5321) - Simple Mail Transfer Protocol  
[RFC 5322](http://tools.ietf.org/html/rfc5322) - Internet Message Format  
[RFC 5335](http://tools.ietf.org/html/rfc5335) - Internationalized Email Headers  


**RFC zum Thema IDNA / Punycode**

[RFC 3490](http://tools.ietf.org/html/rfc3490) - Internationalizing Domain Names in Applications (IDNA)  
[RFC 3491](http://tools.ietf.org/html/rfc3491) - Nameprep: A Stringprep Profile for Internationalized Domain Names (IDN)  
[RFC 3492](http://tools.ietf.org/html/rfc3492) - Punycode: A Bootstring encoding of Unicode for Internationalized Domain Names in Applications (IDNA)  
[RFC 3454](http://tools.ietf.org/html/rfc3454) - Preparation of Internationalized Strings ("stringprep")  
[RFC 5890](http://tools.ietf.org/html/rfc5890) - Internationalized Domain Names for Applications (IDNA): Definitions and Document Framework  
[RFC 5891](http://tools.ietf.org/html/rfc5891) - Internationalized Domain Names in Applications (IDNA): Protocol  
[RFC 5892](http://tools.ietf.org/html/rfc5892) - The Unicode Code Points and Internationalized Domain Names for Applications (IDNA)  
[RFC 5893](http://tools.ietf.org/html/rfc5893) - Right-to-Left Scripts for Internationalized Domain Names for Applications (IDNA)  
[RFC 5894](http://tools.ietf.org/html/rfc5894) - Internationalized Domain Names for Applications (IDNA): Background, Explanation, and Rationale  
