---
layout: guide

permalink: /jumpto/standard-mail-validation/
title: "Standard E-Mail-Validierung"
group: "E-Mail"
orderId: 2

creator: hausl
author:
    -   name: hausl
        profile: 21246

    -   name: tr0y
        profile: 21125
        
inhalt:
    -   name: "filter_var()"
        anchor: filtervar
        simple: "als Standard-Weg"
        
    -   name: "Internationale Domainnamen"
        anchor: exkurs-internationalisierte-domainnamen-idn
        simple: "Domains mit Sonderzeichen"
    
    -   name: "Konvertierung nach Punycode"
        anchor: konvertierung-durch-eine-externe-punycode-klasse
        simple: "Externe Klassen"
        
    -   name: "Konvertierung nach Punycode"
        anchor: konvertierung-durch-php-boardmittel
        simple: "mit PHP Bordmitteln"

    -   name: "Ohne Punycode"
        anchor: ohne-punycode---lose-rahmenprfung-mittels-regulren-ausdrcken-regex
        simple: "Lose Rahmenprüfung durch reguläre Ausdrücke"

    -   name: "DNS Domain-Prüfung"
        anchor: zusatz-option-dns-domain-prfung
        simple: "zusätzliche Existenz-Prüfung"

    -   name: "Weiterführende Quellen"
        anchor: weiterfhrende-quellen
        simple: "Links, RFCs"


entry-type: in-discussion
---

Dieses Tutorial zeigt grundsätzliche (übliche) Möglichkeiten, eine E-Mail-Adresse *(wie sie für den Transport per SMTP im Internet verwendet wird, bestehend aus zwei Teilen, die durch ein @-Zeichen voneinander getrennt sind)*
 zu validieren. 

Vorweg sei an dieser Stelle erwähnt, dass eine Prüfung auf tatsächliche Existenz einer E-Mail-Adresse auf diesem Weg nicht möglich ist. Die nachfolgenden Ansätze dienen lediglich zur Feststellung ob die grundlegenden formellen Rahmenbedingungen erfüllt werden bzw. einer positiven [DNS](http://de.wikipedia.org/wiki/Domain_Name_System)-Antwort im Falle einer [Domain](http://de.wikipedia.org/wiki/Domain)-[DNS](http://de.wikipedia.org/wiki/Domain_Name_System)-Prüfung. Des Weiteren erhebt dieses Tutorial nicht den Anspruch, [sämtlichen RFC zu diesem Thema](#rfc) zu genügen (wenn sich schon die meisten großen Provider und Mail-Anbieter nicht daran halten ...).

### filter_var()

PHP stellt ab Version 5.2 die Funktion [filter_var()](http://php.net/manual/de/function.filter-var.php) zur Verfügung. Mit dem optionalen Parameter FILTER_VALIDATE_EMAIL kann diese grundsätzlich zur E-Mail-Validierung verwendet werden. Jedoch ist es damit nicht möglich internationalisierte E-Mail-Adressen zu prüfen - solche werden immer als falsch ausgewertet. Lösungsansätze folgen [weiter unten](#).

~~~ php
function isValidEmail($mail)
{ 
    return (bool) filter_var($mail, FILTER_VALIDATE_EMAIL);
} 

var_dump(isValidEmail("test@example.com"));  // true
var_dump(isValidEmail("pelé@example.com"));  // false
var_dump(isValidEmail("mail@übung.de"));     // false
~~~

**Hinweis**

Sollte filter_var() nicht verfügbar sein, dann den Provider kontaktieren (oder wechseln ;)). Im ungünstigsten Fall gibt es [auf dieser Seite](http://www.regular-expressions.info/email.html) unten (vorletzter Absatz) ein zu [RFC 2822](http://tools.ietf.org/html/rfc2822) empfohlenen regulären Ausdruck (Regex).

> We get a more practical implementation of RFC 2822 if we omit the syntax using double quotes and square brackets. It will still match 99.99% of all email addresses in actual use today. 

~~~ php
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
~~~

Dies kann alternativ zu filter_var() verwendet werden. Ebenso wie [oben bei filter_var()](#filtervar) schlägt die Prüfung von internationalisierten Domains fehl (was hier bereits am Pattern erkennbar ist).
   
  
### Internationalisierte Domainnamen (IDN)

Um auch internationalisierte Domains auf grundsätzliche formelle Korrektheit zu prüfen ist die Konvertierung in [Punycode](http://de.wikipedia.org/wiki/Punycode) **vor** der eigentlichen Prüfung nötig. Weitere Informationen und Möglichkeiten zur Konvertierung gibt es [hier]({{ site.url }}/jumpto/idna/).


### Ohne Punycode - Lose Rahmenprüfung mittels regulären Ausdrücken (Regex)
 
Diese Variante kommt ohne Punycode-Konvertierung aus. Hierbei spielen die verwendeten Zeichen kaum eine Rolle, denn es wird nur der grobe Rahmen geprüft und ob keine Whitespaces (Leerzeichen, Tabstopps, etc.) vorhanden sind.

~~~ php    
function isValidEmail($mail)
{ 
    // Gesamtlänge check
    // http://de.wikipedia.org/wiki/E-Mail-Adresse#L.C3.A4nge_der_E-Mail-Adresse  
    if (strlen($mail) > 256) {
        return false; 
    }
    $pattern = '#^'
             . '\S+'
             . '@'
             . '(?:[^\s.](?:[^\s.]*[^\s.])?\\.)+[^\s.](?:[^\s.]*[^\s.])?'
             . '$#i';
    return (bool) preg_match($pattern, $mail); 
}  

var_dump(isValidEmail("test@.....com"));                              // false 
var_dump(isValidEmail("test@sub.mail.dot.anything.example.com"));     // true 
var_dump(isValidEmail("test@übärdrübär.com"));                        // true  
var_dump(isValidEmail("test@sub.mail.dot.anything.übärdrübär.com"));  // true 
~~~ 

### Zusatz-Option: DNS-Domain-Prüfung

Generell kann in jeder oben angeführten Varianten, wenn gewüscht, die Antwort des [DNS](http://de.wikipedia.org/wiki/Domain_Name_System) zur Domain (auf vorhandenen ["MX" oder "A"-Record](http://de.wikipedia.org/wiki/Domain_Name_System#Aufbau_der_DNS-Datenbank)) berücksichtigt werden. 

Hinweis: Die an das DNS übergebene Domain der E-Mail-Adresse muss für die Verwendung von internationalisierten Domains (wie bei filter_var()) ebenfalls in [Punycode konvertiert]({{ site.url }}/jumpto/idna/) sein.

~~~ php
function checkEMailDomainDNS($mail)
{
    $parts = explode('@', $mail);
    return (checkdnsrr($parts[1], "MX") or checkdnsrr($parts[1], "A"));
}

var_dump(checkEMailDomainDNS('mail@example.com'));  // true
~~~

### Weiterführende Quellen

#### Links

Wer sich genauer für die Regex-Prüfung interessiert, dem sei [dieser Link](http://squiloople.com/2009/12/20/email-address-validation/) empfohlen. Danke an [Trainmaster](http://www.php.de/member.php?u=20243) für den Link.

Wer sich dafür interessiert wie eigentlich filter_var() validiert, dem sei ein Blick in den Quelltext von PHP empfohlen oder etwas einfacher hier in [diesem Forumsbeitrag](http://www.php.de/wiki-diskussionsforum/101439-sinnvolle-standard-verfahren-zur-e-mail-validierung-3.html#post748505). Danke an [Asterixus](http://www.php.de/member.php?u=21236) für die Recherche.


#### RFC zum Thema E-Mail

[RFC 2142](http://tools.ietf.org/html/rfc2142) - Mailbox Names for Common Services, Roles and Functions  
[RFC 2368](http://tools.ietf.org/html/rfc2368) - The mailto URL scheme  
[RFC 2822](http://tools.ietf.org/html/rfc2822) - Internet Message Format  
[RFC 3696](http://tools.ietf.org/html/rfc3696) - Application Techniques for Checking and Transformation of Names  
[RFC 4021](http://tools.ietf.org/html/rfc4021) - Registration of Mail and MIME Header Fields  
[RFC 5321](http://tools.ietf.org/html/rfc5321) - Simple Mail Transfer Protocol  
[RFC 5322](http://tools.ietf.org/html/rfc5322) - Internet Message Format  
[RFC 5335](http://tools.ietf.org/html/rfc5335) - Internationalized Email Headers  

