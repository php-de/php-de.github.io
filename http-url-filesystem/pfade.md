---
layout: guide

permalink: /jumpto/pfade/
title: "Pfade in der Webentwicklung"
group: "HTTP / URL / Requests / Dateisystem"

creator: nikosch
author:
    -   name: nikosch
        profile: 2314

    -   name: hausl
        profile: 21246

    -   name: mermshaus
        profile: 15041

inhalt:
    -   name: "Serverpfade"
        anchor: serverpfade
        simple: ""

    -   name: "Webpfade"
        anchor: webpfade
        simple: ""

    -   name: "Komplettbeispiel"
        anchor: komplettbeispiel
        simple: ""

    -   name: "Sichtbarkeit"
        anchor: sichtbarkeit
        simple: ""

    -   name: "Besonderheiten"
        anchor: besonderheiten
        simple: ""

entry-type: in-discussion
---

### Serverpfade

#### Anwendung

Serverpfade sind relevant für

- Dateisystemfunktionen (`dir()`, `is_file()`, `glob()`, ...)
- normale Includes (`include`, `require`, ...)



#### Aufbau

Serverpfade bestehen aus Verzeichnisnamen, die durch Slashes voneinander
getrennt sind. Die Gültigkeit der Verzeichnisnamen richtet sich dabei nach dem
verwendeten Betriebssystem – Windows und Linux erlauben damit abweichende
Zeichenmengen für die Namen der Verzeichnisse. Windows benutzt `\` als
Pfadtrennzeichen, Linux dagegen `/`. Unter PHP ist das irrelevant. Da `\` aber
eine Sonderbedeutung in Strings hat (Escapezeichen), empfiehlt sich eine
generelle Verwendung von `/`, auch unter Windows-Serversystemen.

#### Absolute Serverpfade

**Absolute Serverpfade** beginnen mit `/` und beziehen sich stets auf das
Wurzelverzeichnis des Mount points (Linux, Unix) bzw. das Laufwerk (Windows),
in dessen Subpfad sich das aktuell gestartete PHP-Script befindet.

Beispiel: index.php liegt unter Windows in `C:\xampp\htdocs\test`. Eine darin
referenzierte Pfadangabe `/abc/cde` bezieht sich dann auf den Systempfad
`C:\abc\cde`.

Alle anderen Pfade werden als relativ interpretiert.

#### Relative Serverpfade

**Relative Serverpfade** beginnen mit einer Verzeichnisangabe (`.`, `..`, ein
oder mehrere Verzeichnisse durch `/` getrennt) oder sind leer (für das aktuelle
Verzeichnis). Sie beziehen sich stets auf den kompletten Serverpfad des aktuell
gestarteten PHP-Scripts.

Beispiel: index.php liegt unter Linux in `/homepages/47/u110815/htdocs` eines
Mount points. Eine darin referenzierte Pfadangabe `../abc/cde/test.txt`
bezieht sich dann auf den Systempfad `/homepages/47/u110815/abc/cde/test.txt`.

Hinweise:

- Werden mehrere Scripte durch `include` bzw. `require` verbunden, ist das
  erste (also das gestartete) Script relevant.
- Die obigen Ausführungen nehmen keinen Bezug auf Zugriffsberechtigungen. Pfade
  wie im zweiten Beispiel lassen sich zwar adressieren, i. A. wird aber bspw.
  bei Webhostern der Zugriff auf fremde Userverzeichnisse rechtlich
  eingeschränkt sein.



### Webpfade

Webpfade adressieren über einen URL bestimmte Ressourcen (Dateien oder
generierte Daten). Die URLs können dabei echte, physische Pfade, aber auch
generische Adressen referenzieren (siehe dazu Abschnitt mod_rewrite).

Grundsätzlich ist die Vorstellung, dass zu einem URL
`http://www.example.org/foo/bar.html` irgendwo eine Datei `bar.html` in einem
Verzeichnis `foo` existieren muss, nicht zutreffend. Bei vielen Frameworks oder
Webseiten ist eine Entsprechung zwischen URL und tatsächlichem Speicherort nur
bei Ressourcen wie CSS- und JavaScript-Dateien oder Grafiken gegeben, während
Requests, die HTML-Code anfordern, von einem einzigen zentralen Skript
abgehandelt werden, das den URL in seine Bestandteile zerlegt und anhand dieser
die korrekte Ausgabe generiert (manchmal als [Front Controller
pattern](https://en.wikipedia.org/wiki/Front_Controller_pattern) bezeichnet).

#### Anwendung

Webpfade

- bilden konkrete Daten oder Dokumente auf Pfade ab, müssen dabei aber nicht
  zwingend auf eine existierende Datei zeigen
- dienen clientseitig zur Angabe einzubindender Ressourcen (Dokumente über
  `href`, Bilder über `src`, …)
- können über sogenannte URL-Wrapper Dateizugriffe auf fremde Server
  ermöglichen (siehe dazu Abschnitt URL-Wrapper)

#### Aufbau

Wenn sie physische Dateien referenzieren, unterliegen Webpfade zum einen den
Beschränkungen des verwendeten Filesystems (Ausnahme: mod_rewrite und
vergleichbare Techniken). Desweiteren ist die Menge der für URLs gültigen
Zeichen weiter eingeschränkt. Hier kommen
[Escapezeichenketten](https://de.wikipedia.org/wiki/URL-Encoding) zum Einsatz.

#### Prinzip

Die Grundlage der URL-Adressierung bildet das DNS System und das Routing über
daraus ermittelte IP-Adressen. Grob gesagt, stehen einer oder mehreren
IP-Adressen ein physisches Gerät gegenüber. Das DNS wertet dabei den
Domain-Teil einer URL aus.

Auf dem jeweiligen Server können anschließend weitere URL-Bestandteile auf
konkrete Pfade gemappt werden. In der Regel sind das:

- die Domain selbst -- ein Hoster kann so viele Domains auf einer Maschine
  vertwalten, indem jeder Domain oder jedem dahinterstehenden Kunden ein
  konkretes Userverzeichnis bereitsgestellt wird.
- eine Subdomain -- innerhalb des Userverzeichnisses kann ein
  Unterverzeichnis/ein Subpfad das Rootverzeichnis für die Domain mit Subdomain
  abbilden.
- Pfadangaben in der URL werden relativ zum Userverzeichnis adressiert.

Beispiel: Ein Nutzer reserviert sich die Domain `http://example.com/` bei seinem
Hoster *HostingXY*. *HostingXY* richtet dem Nutzer jetzt auf seinem Server das
Userverzeichnis `/homepages/47/u110815` ein und mappt die Domain
`http://example.com/` auf `/homepages/47/u110815/htdocs`. Legt der User nun
eine Datei in dieses Verzeichnis (`/homepages/47/u110815/htdocs/index.html`),
so wird der Server den URL `http://example.com/index.html` entsprechend
auflösen und das Dokument ausliefern.

Bezugnehmend auf diese Aussagen, ergeben sich folgende Referenzierungsarten:

#### Vollständige URL-Angaben

Für diese gilt eben Gesagtes. Domain und Subdomain bestimmen das physische
Serververzeichnis, weitere URL-Pfadangaben werden relativ zum Serververzeichnis
benutzt, sofern kein Rewriting im Spiel ist.

Beispiel: Bezieht sich die Domain `http://example.com/` auf das Verzeichnis
`/homepages/47/u110815/htdocs`, so referenziert die URL
`http://example.com/images/test.jpg` die Datei
`/homepages/47/u110815/htdocs/images/test.jpg` auf der entsprechenden Maschine.

#### Absolute Webpfade

Die aktuelle Domain (oben `http://example.com/`) kann durch `/` angesprochen
werden. Es ergibt sich eine absolute Pfadangabe, etwa `/images/test.jpg`, für
eben genanntes Beispiel.

#### Relative Webpfade

Analog zu absoluten Serverpfaden kann eine Ressource auch relativ zum aktuellen
Dokument referenziert werden. Wiederum sind die Angaben `.`, `..`, ein
Verzeichnispfad oder der leere String gültig. Die Angabe ist dabei relativ zum
URL des HTML-Dokuments. Es ist dabei natürlich nicht möglich, den Document-Root
zu verlassen, indem ausreichend oft `../` in den Pfad eingefügt wird.

#### Analogie

Der Serverpfad ist ein Dateisystempfad auf einer konkreten Maschine. Webpfade
kann man sich so vorstellen, dass ein Subpfad dieses Dateisystems als eigenes
Laufwerk „gemountet“ wird (unter Windows: subst). Damit ergibt sich ein neues
Wurzelverzeichnis, das nach „oben hin“ nicht verlassen werden kann und
ansonsten normal absolut oder relativ adressiert werden kann.

Hinweise:

- Sowohl absolute als auch relative Webpfade sind relativ zur aktuellen Domain.
  „Absolut“ beziehungsweise „relativ“ bezieht sich hier nur auf den Rootpfad
  der Domain (Document-Root).

- Wie gesagt, ist das referenzierende Dokument relevant. Gerade bei CSS-Dateien
  mit `url()`-Stylesheet-Angaben ist hier der Webpfad der CSS-Datei maßgeblich,
  nicht der Pfad des (HTML-)Dokuments, das im Browser aufgerufen wurde.



### Komplettbeispiel

Struktur des Projekts im Dateisystem:

~~~
/
+ homepages
  + 47
    + u110815
      + htdocs
        + includes
            function.php
        + contents
            inhalt.txt
        + images
            title.jpg
            test.jpg
        + css
            styles.css
          index.php
~~~

index.php:

~~~ php
<?php

// absoluter Serverpfad als Konstante
define('PATH_PROJECT' , '/homepages/47/u110815/htdocs/');

// relativer Serverpfad
require('includes/function.php');

?><html>
<head>
  <title />
  <!-- absoluter Webpfad -->
  <link rel="stylesheet" href="/css/styles.css">
</head>
<body>

  <div id="logo"></div>
  <?php echo getContent ('inhalt.txt'); ?>

</body>
</html>
~~~

function.php:

~~~ php
<?php

function getContent ($file)
{
  // absoluter Serverpfad
  $path= PATH_PROJECT . 'contents/' . $file;

  return(file_get_contents($path));
}
~~~

styles.css:

~~~ php
 #logo {
   width :100px;
   height:100px;

   background-image:url(../images/test.jpg); /* relativer Webpfad */
 }
~~~

inhalt.txt:

~~~ php
<h1>Dies ist ein Text</h1>
<p>
   <!-- Webpfad mit vollständiger URL -->
   <img src="http://example.com/images/title.jpg" />

   Dies ist ein Text.
</p>
~~~

### Sichtbarkeit

Als logische Konsequenz aus den obigen Aussagen zum Document-Root ergibt sich, dass
jenseits des Document-Roots abgelegte Dateien nicht öffentlich über den Webserver
erreichbar sind. Serverseitig (beispielsweise durch PHP) kann dagegen frei auf solche
Dateien zugegriffen werden, die entsprechenden Userrechte vorausgesetzt.

„Jenseits des Document-Roots“ bezeichnet alle Pfade, die oberhalb oder parallel zum
Document-Root existieren (und selbst nicht als Document-Root gemappt sind).

~~~
+ homepages
  + 47
    + u110815
      + htdocs
        + includes
            unsicher
        unsicher
      + more
          + misc
            sicher
          sicher
        sicher
~~~

Eine alternative Zugriffssicherung wird in der Praxis durch Einsatz einer .htaccess-Datei erreicht.



### Besonderheiten

#### mod_rewrite

#### URL-Wrapper

#### (Dateisystem)-Links

