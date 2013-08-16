---
layout: guide

title: "Request"

creator: nikosch

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

entry-type: in-progress

---

Ein **Request** ist eine Anfrage eines Clients an einen Server innerhalb eines Client-Server-Systems. Auslösendes Moment eines Request kann beispielsweise die Eingabe einer URL in einen Browser (GET-Request) oder das Absenden eines HTML Formulars sein (je nach action-Attribut GET- oder POST-Request). Weiterhin kann ein Request durch Javascript (respektive AJAX) oder serverseitige Aktionen (Weiterleitungen, cURL) veranlasst werden. Selbst das Einbinden von Bildern, CSS- oder Javascriptdateien erzeugt einen GET-Request auf die betreffende Ressource.

Ein Request an einen existierenden Server wird von diesem mit einem Response beantwortet.

Für das Verständnis der Client-Server-Kommunikation, vor allem aber der Verarbeitung von Parameterdaten ist ein grundlegendes Verständnis des protokollbasierten Aufrufs wichtig.

### HTTP
---
Ein maßgeblicher Teil der Requestverarbeitung in PHP betrifft das Hypertext Transfer Protocol (HTTP). Hier sind zwei Typen von Parameterübergaben zu unterscheiden.

#### GET
---
Parameter, die mit einem GET-Request übertragen werden, werden zusätzlich zur Angabe des aufzurufenden Dokuments als Daten an die URL angehängt. Dabei erfolgt die Angabe in der Form Parametername=Parameterwert. Mehrere Parameter werden durch ein Trennzeichen, üblicherweise das kaufmännische Und (&) voneinander getrennt. Zur Abgrenzung von der URL Adresse dient standardmäßig das Fragezeichen.

vereinfachtes Beispiel (ohne Protokoll, Port und Domain):

    scriptname.php?parameter1=wert1&parameter2=wert2

    Diese URL fordert das Dokument scriptname.php an und 
    übergibt dabei zwei Werte. Die gegebenen Werte sind serverseitig 
    (in diesem Fall z.B. in der angegebenen PHP-Datei) 
    unter den gegebenen Parameternamen abrufbar. 

    <div class="alert alert-info"><strong>Information</strong>
    Abweichende Trennzeichen für Paramater können in der php.ini 
    unter den Einstellungen arg_separator.output und arg_separator.input angegeben werden.</div>
    
    Anwendungsgebiet

Da ein GET-Request seine Parameter in der URL transportiert (und damit wie eine URL funktioniert) ist er optimal geeignet, einen Parameteraufruf über einen Link abzubilden. Neben der üblichen Linknotation wird dynamisch die Liste der zu übermittelnden Parameter angehängt.

Bsp.

 [php.ini](http://www.php.de/wiki-php/index.php/Php.ini)
