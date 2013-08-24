---
layout: guide

title: "Request"

creator: nikosch

group: "Request-Handling"

author: 
    - name: nikosch
      profile: 2314

    - name: manko10
      profile: 1139

    - name: _cyrix_
      profile: 7661

inhalt:
    - name: "HTTP"
      anchor: http
      simple: ""

    - name: "GET"
      anchor: get
      simple: ""

    - name: "Anwendungsgebiet"
      anchor: anwendungsgebiet
      simple: ""

    - name: "POST"
      anchor: post
      simple: ""

    - name: "Anwendungsgebiet"
      anchor: anwendungsgebiet
      simple: ""

    - name: "Beispiele"
      anchor: beispiele
      simple: ""

    - name: "Request auf eine Bilddatei"
      anchor: request-auf-eine-bilddatei
      simple: ""

---

Ein **Request** ist eine Anfrage eines Clients an einen Server innerhalb eines Client-Server-Systems. Auslösendes Moment eines Request kann beispielsweise die Eingabe einer URL in einen Browser (GET-Request) oder das Absenden eines HTML Formulars sein (je nach action-Attribut GET- oder POST-Request). Weiterhin kann ein Request durch Javascript (respektive AJAX) oder serverseitige Aktionen (Weiterleitungen, cURL) veranlasst werden. Selbst das Einbinden von Bildern, CSS- oder Javascriptdateien erzeugt einen GET-Request auf die betreffende Ressource.

Ein Request an einen existierenden Server wird von diesem mit einem Response beantwortet.

Für das Verständnis der Client-Server-Kommunikation, vor allem aber der Verarbeitung von Parameterdaten ist ein grundlegendes Verständnis des protokollbasierten Aufrufs wichtig.

### HTTP

Ein maßgeblicher Teil der Requestverarbeitung in PHP betrifft das Hypertext Transfer Protocol (HTTP). Hier sind zwei Typen von Parameterübergaben zu unterscheiden.

#### GET

Parameter, die mit einem GET-Request übertragen werden, werden zusätzlich zur Angabe des aufzurufenden Dokuments als Daten an die URL angehängt. Dabei erfolgt die Angabe in der Form Parametername=Parameterwert. Mehrere Parameter werden durch ein Trennzeichen, üblicherweise das kaufmännische Und (&) voneinander getrennt. Zur Abgrenzung von der URL Adresse dient standardmäßig das Fragezeichen.

vereinfachtes Beispiel (ohne Protokoll, Port und Domain):

>
    scriptname.php?parameter1=wert1&parameter2=wert2
>
    Diese URL fordert das Dokument scriptname.php an und übergibt dabei zwei Werte. 
    Die gegebenen Werte sind serverseitig (in diesem Fall z.B. in der angegebenen PHP-Datei) 
    unter den gegebenen Parameternamen abrufbar. 

<div class="alert alert-info"><strong>Information</strong>
Abweichende Trennzeichen für Paramater können in der php.ini 
unter den Einstellungen arg_separator.output und arg_separator.input angegeben werden.</div>


##### Anwendungsgebiet

>
Da ein GET-Request seine Parameter in der URL transportiert (und damit wie eine URL funktioniert) ist er optimal geeignet, einen Parameteraufruf über einen Link abzubilden. Neben der üblichen Linknotation wird dynamisch die Liste der zu übermittelnden Parameter angehängt.
Bsp.

~~~php
<!-- im HTML Bereich -->
<a href="next.php?start=<?php echo $startvalue; ?>" alt="nächste Seite">weiter</a>
 
<?php
// reine PHP Ausgabe
echo '<a href="next.php?start=' . $startvalue . '" alt="nächste Seite">weiter</a>';
 
?>
~~~

Der unter $startvalue eingebundene Wert würde sich nach Anklicken des entstehenden Links im Folgescript (hier next.php) unter dem Schlüssel startvalue im Array $_GETwiederfinden.

#### POST

Bei einem POST-Request werden die Parameter nicht an die URL angehängt, sondern im Textkörper (Body) des Requests gesendet. Dabei folgen sie der gleichen Syntax wie die GET-Requests.
Ein Beispiel-Request könnte z.B. wie folgt aussehen:

~~~html
POST /wiki-php/index.php/Request HTTP/1.1
Host: php.de
Content-Type: application/x-www-form-urlencoded
Content-Length: 33

parameter1=wert1&parameter2=wert2
~~~

Zunächst wird die Sendemethode (hier: POST) angegeben, gefolgt von der URL, an welche der Request gehen soll. Anschließend die Protokollversion. Der Header Host gibt den Host an, an den gesendet werden soll.

Es folgen weiter die Angabe des für einen POST-Request erforderlichen Content-Types sowie die Länge des Requests. Hier wird in Bytes angegeben, wie lang der Body des Requests ist.

Eine Leerzeile trennt schließlich den Headerbereich vom Body. In diesem befinden sich nun die Parameter, vergleichbar mit denen eines GET-Requests.
Die Länge der gesendeten Daten eines POST-Requests ist theoretisch nur von der Einstellung post_max_size  in der [php.ini](http://www.php.de/wiki-php/index.php/Php.ini) abhängig. Allerdings kann es sein, dass das Skript dennoch vorzeitig abbricht, da die Übertragung zu lange dauert oder das Speicherlimit erreicht wurde.

##### Anwendungsgebiet

>
Da bei einem POST-Request (im Gegensatz zum GET-Request) die Parameter nicht an die URL angehängt werden, ist diese Sendemethode transparenter und weniger verwirrend für den Benutzer. Sie bietet sich vor allem für Serveranfragen mit viel Inhalt (z.B. Formulare) an. Da die URL nicht verändert wird, werden die Header auch in der Log-Datei des Servers nicht festgehalten. Somit eignet sich ein POST-Request besser zur Übertragung vertraulicher Daten, als ein GET-Request, wobei natürlich auch hier eine Übertragungs-Verschlüsselung genutzt werden sollte.

### Beispiele

#### Request auf eine Bilddatei

~~~html
GET http://www.google.de:80/images/firefox/sprite.png HTTP/1.1
Host: www.google.de
User-Agent: Mozilla/5.0 (Windows; U; Windows NT 5.1; de; rv:1.8.1.14) Gecko/20080404 Firefox/2.0.0.14
Accept: image/png,*/*;q=0.5
Accept-Language: de-de,de;q=0.8,en-us;q=0.5,en;q=0.3
Accept-Encoding: gzip,deflate
Accept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.7
Keep-Alive: 300
Proxy-Connection: keep-alive
Referer: http://www.google.de/firefox?client=firefox-a&rls=org.mozilla:de:official
Cookie: PREF=ID=d9c2c4a7b3934e4f:TM=1985477463:LM=1212637463:S=PO9u0uh--zL4ComF; 
  NID=14=OaGtP3LajSdudj7ehTKS_cbMP4teQ6ddfreBQ6XbOZqIevMjpKVoUKvyAhQY6rV2R8pm7_ 
  VhqIsiuz34D0peRoxInh4J3A24Skt0DvdL3pWLmkSFMB_VZ9hXt85RmJN9y
If-Modified-Since: Wed, 23 Jan 2008 19:15:23 GMT
Cache-Control: max-age=0
~~~

~~~code
* Fordert über Port 80 der Domain www.google.de aus dem Unterverzeichnis /images/firefox/ die Datei sprite.png an.
* Die Anfrage erfolgt aus einem Firefox-Browser, Version 2.0.0.14 oder einem Programm, dass sich dafür ausgibt.
* Zuvor wurde die Seite "http://www.google.de/firefox?client=firefox-a&rls=org.mozilla:de:official" aufgerufen, in der die Bild-Ressource eingebunden wird.
* Der Browser sendet Cookiedaten mit, die früher auf dem Client abgelegt wurden
~~~
