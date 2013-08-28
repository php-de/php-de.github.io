---
layout: guide
title: "Pfade in der Webentwicklung"
group: "Allgemein"
creator: nikosch
author:
    -   name: nikosch
        profile: 2314

    -   name: hausl
        profile: 21246

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


entry-type: in-progress 

---

### Serverpfade

#### Anwendung 

Serverpfade sind relevant für 

- Dateisystemfunktionen (`dir()`, `is_file()`, `glob()`, ...) 
- normale Includes (`include`, `require`, ...)
<br>


#### Aufbau
 
Serverpfade bestehen aus Verzeichnisnamen, die durch Slashes voneinander getrennt sind. Die Gültigkeit der Verzeichnisnamen richtet sich dabei nach dem verwendeten Betriebssystem - Windows und Linux erlauben damit abweichende Zeichenmengen für die Namen der Verzeichnisse. Windows benutzt `\` als Pfadtrennzeichen, Linux dagegen `/`. Unter PHP ist das irrelevant. Da `\` aber eine Sonderbedeutung in Strings hat (Escapezeichen), empfielt sich eine generelle Verwendung von `/`, auch unter Windows-Serversystemen. 

#### Absolute Serverpfade
 
**Absolute Serverpfade** beginnen mit `/` und beziehen sich stets auf das Wurzelverzeichnis des Mount points (Linux, Unix) bzw. das Laufwerk (Windows) in dessen Subpfad sich das aktuell gestartete PHP-Script befindet. 

Beispiel: 

: index.php liegt unter Windows in `C:\xampp\htdocs\test\`.  
Eine darin referenzierte Pfadangabe `/abc/cde/` bezieht sich dann auf den Systempfad `C:\abc\cde\`.  
  
Alle anderen Pfade werden als relativ interpretiert. 

#### Relative Serverpfade
 
**Relative Serverpfade** beginnen mit einer Verzeichnisangabe (`.`, `..`, ein oder mehrere Verzeichnisse durch `/` getrennt) oder sind leer (für das aktuelle Verzeichnis). Sie beziehen sich stets auf den kompletten Serverpfad des aktuell gestarteten PHP-Scripts. 

Beispiel: 

: index.php liegt unter Linux in `/homepages/47/u110815/htdocs/` eines Mount points.  
Eine darin referenzierte Pfadangabe `../abc/cde/test.txt` bezieht sich dann auf den Systempfad `/homepages/47/u110815/abc/cde/test.txt`. 

Hinweise: 

- Werden mehrere Scripte durch `include` bzw. `require` verbunden, ist das erste (also das gestartete) Script relevant. 
- Die obigen Ausführungen nehmen keinen Bezug auf Zugriffsberechtigungen. Pfade wie im zweiten Beispiel lassen sich zwar adressieren, i. A. wird aber bspw. bei Webhostern der Zugriff auf fremde Userverzeichnisse rechtlich eingeschränkt sein. 

### Webpfade
 
Webpfade adressieren über eine URL bestimmte Ressourcen (Dateien oder generierte Daten). Die URLs können dabei echte, physische Pfade, aber auch generische Adressen referenzieren (siehe dazu Abschnitt mod rewrite). 


#### Anwendung
 
Webpfade 

- bilden konkrete Daten oder Dokumente auf Pfade ab 
- dienen clientseitig zur Angabe einzubindender Ressourcen (Dokumente über `href`, Bilder über `src`, ...) 
- können über sogenannte URL-Wrapper Dateizugriffe auf fremde Server ermöglichen (siehe dazu Abschnitt URL-Wrapper)  - 
  

#### Aufbau 

Da sie im Allgemeinen physische Dateien referenzieren, unterliegen Webpfade zum einen den Beschränkungen des verwendeten Filesystems (Ausnahme: Mod Rewrite und vergleichbare Techniken). Desweiteren ist die Menge der für URLs gültigen Zeichen weiter eingeschränkt. Hier kommen Escapezeichenketten zum Einsatz. 


#### Prinzip
 
Die Grundlage der URL-Adressierung bildet das DNS System und das Routing über daraus ermittelte IP-Adressen. Grob gesagt, stehen einer oder mehreren IP-Adressen ein physisches Gerät gegenüber. Das DNS wertet dabei den Domain-Teil einer URL aus. 

Auf dem jeweiligen Server können anschließend weitere URL-Bestandteile auf konkrete Pfade gemappt werden. In der Regel sind das: 

- die Domain selbst - ein Hoster kann so viele Domains auf einer Maschine vertwalten, indem jeder Domain oder jedem dahinterstehenden Kunden ein konkretes Userverzeichnis bereitsgestellt wird. 

- eine Subdomain - innerhalb des Userverzeichnisses kann ein Unterverzeichnis/ein Subpfad das Rootverzeichnis für die Domain mit Subdomain abbilden. 
  
- Pfadangaben in der URL werden relativ zum Userverzeichnis adressiert.


Beispiel: 

: Ein Nutzer reserviert sich die Domain `http://example.com` bei seinem Hoster HostingXY. HostingXY richtet dem Nutzer jetzt auf seinem Server das Userverzeichnis `/homepages/47/u110815/` ein und mappt die Domain `http://example.com/` auf `/homepages/47/u110815/htdocs/`.  
Legt der User nun eine Datei in dieses Verzeichnis (`/homepages/47/u110815/htdocs/index.html`), so wird der Server die URL `http://example.com/index.html` entsprechend auflösen und das Dokument ausliefern. 


Bezugnehmend auf diese Aussagen, ergeben sich folgende Referenzierungsarten: 


#### Vollständige URL-Angaben
 
Für diese gilt Ebengesagtes. Domain und Subdomain bestimmen das physische Serververzeichnis, weitere URL-Pfadangaben werden relativ zum Serververzeichnis benutzt. 

Beispiel: 

: Bezieht sich die Domain `http://example.com` auf das Verzeichnis `/homepages/47/u110815/htdocs/`, so referenziert die URL `http://example.com/images/test.jpg` die Datei `/homepages/47/u110815/htdocs/images/test.jpg` auf der entsprechenden Maschine. 


#### Absolute Webpfade
 
Die aktuelle Domain (oben `http://example.com`) kann durch `/` angesprochen werden. Es ergibt sich eine absolute Pfadangabe, bspw. `/images/test.jpg` für ebengenanntes Beispiel. 


#### Relative Webpfade
 
Analog zu Relativen Serverpfaden kann eine Ressource auch relativ zum aktuellen Dokument referenziert werden. Wiederum sind die Angaben `.`, `..`, ein Verzeichnispfad oder der leere String gültig. Die Angabe ist dabei relativ zum sogenannten Doc Root. Das ist physisch der o.g. Mapping-Ordner für die aktuelle Domain, aus Sicht der URL-Adressierung ist das Serverdateisystem aber nicht transparent. Das bedeutet, der Doc Root bildet aus Sicht der URL das Wurzelverzeichnis, das auch nicht mit `..` verlassen werden kann. 

#### Analogie
 
Der Serverpfad ist ein Dateisystempfad auf einer konkreten Maschine. Webpfade kann man sich so vorstellen, dass ein Subpfad dieses Dateisystems als eigenes Laufwerk „gemountet“ wird (unter Windows: subst). Damit ergibt sich ein neues Wurzelverzeichnis, das nach „oben hin“ nicht verlassen werden kann und ansonsten normals absolut oder relativ adressiert werden kann. 


Hinweise: 

Sowohl absolute als auch relative Webpfad sind relativ zur aktuellen Domain. „Absolut“ bzw. „relativ“ bezieht sich hier nur auf den Rootpfad der Domain (Doc Root). 
Wie gesagt, ist das referenzierende Dokument relevant. Gerade bei CSS-Dateien mit url()-Stylesheetangaben ist hier der Webpfad der CSS-Datei maßgebich, nicht der Pfad des (HTML-)Dokuments, das im Browser aufgerufen wurde. 

### Komplettbeispiel
 
Struktur des Projektes im Dateisystem

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

index.php

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
</html>function.php
<?php
 
function getContent ($file)
{
  // absoluter Serverpfad
  $path= PATH_PROJECT . 'contents/' . $file;
 
  return(file_get_contents($path));
}
~~~

styles.css

~~~ php
 #logo {
   width :100px;
   height:100px;
 
   background-image:url(../images/test.jpg); /* relativer Webpfad */
 }
~~~

inhalt.txt 

~~~ php
<h1>Dies ist ein Text</h1>
<p>
   <!-- Webpfad mit vollständiger URL -->
   <img src="http://example.com/images/title.jpg" /> 
 
   Dies ist ein Text.
</p>
~~~

### Sichtbarkeit
 
Als logische Konsequenz aus den obigen Aussagen zum DocRoot ergibt sich, dass jenseits des DocRoots abgelegte Dateien nicht öffentlich über den Webserver erreichbar sind. Serverseitig (bspw. durch PHP) kann dagegen frei auf solche Dateien zugegriffen werden, die entspr. Userrechte vorausgesetzt. 

„Jenseits des Docroot“ bezeichnet alle Pfade, die oberhalb oder parallel zum DocRoot (und selbst nicht als DocRoot gemappt sind). 


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

#### mod rewrite

#### URL-Wrapper

#### (Dateisystem)-Links
 
