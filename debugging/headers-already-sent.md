---
layout: guide

permalink: /jumpto/headers-already-sent/
root: ../..
title: "Headers already sent"
group: "Debugging"
orderId: 8

creator: nikosch
author:
    -   name: nikosch
        profile: 2314

    -   name: mermshaus
        profile: 15041

inhalt:
    -   name: "Faustregel"
        anchor: faustregel
        simple: ""

    -   name: "Negativbeispiele"
        anchor: negativbeispiele
        simple: ""

    -   name: "Analyse"
        anchor: analyse
        simple: ""

    -   name: "Empfehlungen"
        anchor: empfehlungen
        simple: ""

entry-type: in-discussion
---

**„Headers already sent“** ist eine Fehlermeldung zur Laufzeit eines
PHP-Scripts. PHP zeigt diese Meldung beim Versuch, einen Header zu setzen,
nachdem bereits eine Browserausgabe erfolgt ist.

Header werden in verschiedenen Zusammenhängen gesetzt. Typische Anwendungen
(und damit typische Aktionen, die diesen Fehler erzeugen) sind die Arbeit mit
Cookies und Session(cookie)s, sowie versuchte Weiterleitungen über die
`header`-Funktion. Auch Klassen und Scripte, die Header zur Unterstützung von
bestimmten Zeichensätzen setzen oder damit Dateidownloads einleiten sollen,
sind klassische Kandidaten.



### Faustregel

<div class="alert alert-info">

<strong>Merke:</strong>

Keine Ausgabe vor einem Headeraufruf! Sobald PHP (respektive eingebundenes
HTML, XML, …) Daten ausgibt, erzeugt es vorher einen (genauer mehrere)
Response-Header, gefolgt von den Bildschirmdaten. Für Headerangaben ist es zu
diesem Zeitpunkt bereits zu spät.

</div>

Der Begriff Ausgabe bezeichnet alle Daten eines
[Requests]({{ page.root }}/jumpto/request/) (nicht
Scripts!), also die Gesamtheit aller Ausgabedaten, die durch die Kombination
von Scripten via Include/Require entsteht.



### Negativbeispiele

Die Angabe `header('Content-Type: text/html; charset=utf-8');` steht
nachfolgend exemplarisch für einen beliebigen Headeraufruf, auch für
Funktionen, die einen solchen erzeugen, wie session_start oder setcookie.
Typisch ist auch der Versuch, nach einer Ausgabe mit dem Location-Header
umzuleiten.

#### Quelltext / Bildschirmausgaben

Bsp. 1, HTML vor der Headerausgabe:

~~~ php
<html>
<head>
  <title />
</head>
<body>
<?php

header ('Content-Type: text/html; charset=utf-8');

// more Code

?>
</body>
</html>
~~~

Bsp. 2, HTML vor der Headerausgabe mit Include:

~~~ php
<html>
<?php

include ('script2.php');

?>
<head>
  <title />
</head>
<body>
  Whatever happened to the eighties
</body>
</html>
~~~

Bsp. 2, Include (script2.php):

~~~ php
<?php

header ('Content-Type: text/html; charset=utf-8');

// more Code
~~~

Bsp. 3, HTML vor der Headerausgabe mit Include:

~~~ php
<?php

include ('header.html');

header ('Content-Type: text/html; charset=utf-8');
// more Code


include ('footer.html');
~~~

Bsp. 3, Include (header.html):

~~~ php
<html>
<head>
  <title />
</head>
<body>
~~~

Für die Ausgabe ist nicht entscheidend, ob sie einem HTML-Format entspricht.
PHP-seitige Ausgaben führen genauso genauso zum Fehler:

Bsp. 4, PHP-Ausgabe vor dem Header:

~~~ php
<?php

echo 'Es funktioniert!';
header ('Content-Type: text/html; charset=utf-8');

echo '…nicht!';

?>
~~~

Typisch sind auch Folgefehler:

Bsp. 5, Headers sent als Folgefehler:

~~~ php
<?php

// Führt zu einer Notice, wenn entspr. GET-Parameter nicht gesetzt ist:
$test = $_GET['test']; // Notice: Undefined index:

header ('Content-Type: text/html; charset=utf-8'); // Notice als Ausgabe führt zum Folgefehler
~~~

#### Leerzeichen und anderer Whitespace

Wichtig zu wissen ist, dass jedes Zeichen, auch Whitespace bereits als Ausgabe
zählt:

Bsp. 6, Headers sent als Folgefehler:

~~~ php
 <?php // erstes Zeichen ist ein Space

header ('Content-Type: text/html; charset=utf-8'); // Notice als Ausgabe führt zum Folgefehler
~~~

#### Byte-Order-Mark von signierten UTF-8-kodiertem Quellcode

Besonders heimtückisch ist die Verwendung der Zeichencodierung UTF-8 mit BOM
(Byte-Order-Mark, UTF-8-Signatur), die PHP nicht vernünftig verarbeiten kann
und damit als Zeichen interpretiert. Aus einem

Bsp. 7, Headers sent durch BOM, Editoranzeige des Quellcodes:

~~~ php
<?php // erste Zeichen sind ein BOM (Script Header)

header ('Content-Type: text/html; charset=utf-8');
~~~

wird dann ein…

Bsp. 7, Headers sent durch BOM, Realer Inhalt des Scripts:

~~~ php
ï»¿<?php

header ('Content-Type: text/html; charset=utf-8'); // Headers sent Fehler
~~~

…und der Header schlägt fehl. Problematisch ist daran, dass die meisten
Editoren dieses BOM kennen und aus dem Bearbeitungstext entfernen (nicht
darstellen, oberes Beispiel). PHP scheitert dann daran, weil die Zeichenkette
physisch aber eben existiert (unteres Beispiel).



### Analyse

Mit [eingeschaltetem
Fehlermanagement]({{ page.root }}/jumpto/leitfaden/) meldet PHP
eine Ausgabe vor einem header-Befehl mit einem Warning.

~~~
Warning: Cannot modify header information - headers already sent by
(output started at /var/www/... .php:14) in /var/www/... .php on line 15)
~~~

Die Angabe hinter „output started at“ bezeichnet dabei das Script und die
Zeile, in dem die Ausgabe erfolgte, die anderen Angaben bezeichnen Script und
Zeile, in dem der header-Befehl aufgerufen wurde. Wird unter „output started“
eine Null als Zeilenangabe angegeben, ist die Ursache fürgemein das UTF-8-BOM
(siehe oben).



### Empfehlungen

Es wird empfohlen, generell PHP-Scripte, denen kein Inline-HTML oder anderer
Inline-Content folgt, ohne schließendes PHP-Tag abzuschließen. Also

~~~ php
<?php

// PHP Code
// …
// das entfernen: ?>
~~~

Abschließende PHP-Tags sind für den PHP-Parser nicht relevant, das Weglassen
verhindert aber wirksam, dass versehentliche Leerzeichen nach dem
abschließenden `?>` in einem Includeprozess zu einer Ausgabe vor einem
Headeraufruf werden.

