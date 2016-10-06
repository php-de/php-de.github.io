---
layout: guide

permalink: /jumpto/verzeichnis-auslesen/
root: ../..
title: "Verzeichnis auslesen"
group: "HTTP / Domain / URL / Requests / Dateisystem"
orderId: 12

creator: nikosch
author:
    -   name: nikosch
        profile: 2314

    -   name: mermshaus
        profile: 15041

    -   name: hausl
        profile: 21246

inhalt:
    -   name: "Verzeichnis auslesen"
        anchor: auslesen
        simple: ""

    -   name: "Verzeichnis rekursiv auslesen"
        anchor: auslesen-rekursiv
        simple: ""

    -   name: "Verzeichnis rekursiv auslesen, mit Filter"
        anchor: auslesen-filter
        simple: ""

    -   name: "Anmerkungen"
        anchor: anmerkungen
        simple: ""


entry-type: in-discussion
---


Iteratoren sind der empfohlene Weg, das Dateisystem zu durchlaufen.
Die folgenden Beispiele nutzten [SPL-Klassen](http://us3.php.net/manual/en/book.spl.php),
die in PHP 5.3 hinzugefügt wurden.


## [Verzeichnis auslesen](#auslesen)
{: #auslesen}

~~~ php
$dir = __DIR__;

$iterator = new DirectoryIterator($dir);

foreach ($iterator as $file) {

    if (!$file->isFile()) {
        continue;
    }
    echo $file->getPathname() . "\n";
}
~~~

Alternativ könnte man hier für einfache Durchläufe auch `glob()` ([Doku](http://php.net/manual/de/function.glob.php)) verwenden.


## [Verzeichnis rekursiv auslesen](#auslesen-rekursiv)
{: #auslesen-rekursiv}

~~~ php
$dir = __DIR__;

$iterator = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($dir)
);

foreach ($iterator as $file) {

    if (!$file->isFile()) {
        continue;
    }
    echo $file->getPathname() . "\n";
}
~~~


## [Verzeichnis rekursiv auslesen - mit Filter](#auslesen-filter)
{: #auslesen-filter}

Will man bsp. nur auf spezielle Dateiendung(en) "filtern", könnte man den RegexIterator verwenden.

Beispiel wie oben, um den RegexIterator erweitert.
Der Filter wird durch ein [Regex-Pattern](http://php.net/manual/de/reference.pcre.pattern.syntax.php) festgelegt.

~~~php
$dir = __DIR__;

$iterator = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($dir)
);
$php_files = new RegexIterator($iterator, '/\.php$/'); // Dateiendung ".php"

foreach ($php_files as $file) {

    if (!$file->isFile()) {
        continue;
    }
    echo $file->getPathname() . "\n";
}
~~~


## [Anmerkungen](#anmerkungen)
{: #anmerkungen}

Es gibt noch andere Wege zB `readdir()`, `dir()`,  etc. die jedoch seit Einführung
der Iteratoren mit PHP 5.3 für diesen Zweck keine Vorteile bringen.
