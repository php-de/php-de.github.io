---
layout: guide

permalink: /jumpto/cross-site-scripting/
root: ../..
title: "Cross-Site-Scripting (XSS)"
group: "Sicherheit"
creator: Manko10
orderId: 11

author:
    -   name: Manko10
        profile: 1139

    -   name: nikosch
        profile: 2314

    -   name: mermshaus
        profile: 15041

inhalt:
    -   name: "Voraussetzungen"
        anchor: voraussetzungen
        simple: ""

    -   name: "Code Injection allgemein"
        anchor: code-injection-allgemein
        simple: ""

    -   name: "Durchführung einer XSS-Attacke"
        anchor: durchfuehrung-einer-xss-attacke
        simple: ""

    -   name: "Konsequenzen einer XSS-Attacke"
        anchor: konsequenzen-einer-xss-attacke
        simple: ""

    -   name: "Schutz vor Cross-Site-Scripting"
        anchor: schutz-vor-cross-site-scripting
        simple: ""

entry-type: in-discussion
---

**Cross-Site-Scripting** (**XSS**) ist eine Angriffstechnik auf die Besucher
eine Webseite mittels
[JavaScript]({{ page.root }}/jumpto/javascript/) oder anderer
clientbasierter Skriptsprachen. Dabei wird eine unzureichende Prüfung der
eingegebenen Daten ausgenutzt.

Ein verwandtes Problem ist das Einschleusen anderer durch den Client
verarbeiteter Sprachteile (Code Injection) wie HTML-Code oder
CSS-Formatierungsangaben. Das Spektrum reicht hier von der Einbringung eigener
Inhalte bis zur Neuformatierung, damit schlimmstenfalls bis zur Unbenutzbarkeit
der Seite.  Neben konkreten Schäden für den Nutzer kann ein erheblicher
Imageschaden für den Seitenbetreiber entstehen.



## [Voraussetzungen](#voraussetzungen)
{: #voraussetzungen}

Die Manipulation clientbasierter Sprachen funktioniert dann, wenn Teilinhalte
dynamisch auf einem Server erzeugt und in die HTML Ausgabe (oder jede andere
interpretierte Ressource) geschrieben werden. Da der Seitennutzer erst diese
Ausgabe direkt wahrnimmt, basieren XSS & Co immer auf einer Sicherheitslücke
auf dem Server.

Die zweite Komponente ist der zeitliche Aspekt. Ein Angriff über XSS soll nicht
den Manipulierenden selbst, sondern Besucher dieser Seite treffen. Deshalb ist
ein erfolgreicher XSS-Angriff nur möglich, wenn der Schadcode in irgendeiner
Form gespeichert und Teil der öffentlichen Ausgabe der Website wird. Aus
demselben Grund kann eine dynamische Seitenmanipulation über Javascript/DOM
nicht zu den Cross-Site-Scripting-Attacken gezählt werden.



## [Code Injection allgemein](#code-injection-allgemein)
{: #code-injection-allgemein}

Dynamische Websiteprogrammierung fußt auf einer Kombination von statischen
HTML-Codeelementen und darin eingefügten Inhaltsteilen. Das fertige Produkt
wird als HTML-Quellcode vom Webserver ausgeliefert (siehe
[Was ist PHP?]({{ page.root }}/jumpto/was-ist-php/)). Daraus
entsteht ein ungewöhnlicher Effekt, wenn die Möglichkeit der Flexibilität zu
einseitig betrachtet wird.

~~~ php
<h1><?php echo $myHeader; ?></h1>
~~~

~~~ php
<p title="<?php echo $myTitle; ?>">
~~~

~~~ php
<input type="text" name="test" value="<?php echo $myValue; ?>">
~~~

Direkte Angabe eines dynamischen Werts und zweier dynamischer
Attributzuweisungen. Denkbar wären folgende Angaben, die aus Nutzereingaben
entstehen könnten:

~~~ php
$myHeader = 'Überschrift 1</h1>
<p>Ein zusätzliches Kapitel</p>
<h1>Überschrift 2';
~~~

~~~ php
$myTitle = '" style="background:url(http://xss.example.org/badimage.jpg);';
~~~

~~~ php
$myValue = '"><input type="text" name="badtest" value="bad value';
~~~

Als Resultat ergibt sich in allen drei Fällen ein völlig neuer Kontext als
angedacht:

~~~ html
<h1>Überschrift 1</h1>
<p>Ein zusätzliches Kapitel</p>
<h1>Überschrift 2</h1>
~~~

Statt einer Überschrift wird eine zweite Headline und sogar ein zusätzlicher
Absatz eingefügt.

~~~ html
<p title="" style="background:url(http://xss.example.org/badimage.jpg);">
~~~

Statt eines relativ harmlosen `title`-Attributs wird ein `style`-Attribut
gesetzt und der Absatz neu formatiert.

~~~ html
<input type="text" name="test" value=""><input type="text" name="badtest" value="bad value">
~~~

Statt ein Formfeld auszufüllen, wird der Tag geschlossen und ein weiteres
Eingabefeld in den Quelltext geschrieben.

Code Injection für sich ist zwar ein vom Entwickler nicht vorgesehener Effekt,
schadet aber vornehmlich erst einmal dem Manipulator selbst. Der veränderte
Browserquelltext ist damit zunächst nicht schwerwiegender, als wäre er
nachträglich auf dem Client auf einen andere Weise, etwa über einen Proxy oder
ein Browserplugin wie Greasemonkey, verändert worden.

Wie bereits einleitend beschrieben, ergibt sich die eigentlich Gefahr dann,
wenn so eingeschleuster Code – vornehmlich JavaScript – gespeichert und auch
für andere Nutzer ausgegeben wird.



## [Durchführung einer XSS-Attacke](#durchfuehrung-einer-xss-attacke)
{: #durchfuehrung-einer-xss-attacke}

Als Beispiel für einen erfolgreichen XSS-Angriff soll ein Gästebuch dienen.
Werden die Daten unzureichend validiert, ist es dem Angreifer ein Leichtes,
schädlichen Code einzuschleusen.

~~~ html
<script type="text/javascript">alert('XSS!');</script>
~~~

Wird dieser Code nicht validiert (und beispielsweise mit `htmlspecialchars`
behandelt), so ist er für jeden Besucher des Gästebuchs sichtbar und kommt
demnach zur Ausführung. Dem Besucher wird eine `alert`-Box mit dem Inhalt
„XSS!“ angezeigt.

### [Problem magic_quotes_gpc](#problem-magic_quotes_gpc)
{: #problem-magic_quotes_gpc}

Ist die Direktive
[magic_quotes_gpc]({{ page.root }}/jumpto/php-ini/#magic_quotes_gpc)
in der [php.ini]({{ page.root }}/jumpto/php-ini/) eingeschaltet,
wird der obige Code unter Umständen nicht funktionieren, da die Stringbegrenzer
`"` und `'` nicht funktionieren werden. Dies stellt jedoch kein Problem dar, da
die Angabe `type="text/javascript"` für die Ausführung in den meisten Browsern
nicht vonnöten ist. Ebenso können Strings in JavaScript auch auf andere Weise
dargestellt werden, indem die Syntax regulärer Ausdrücke genutzt wird.

~~~ html
<script>alert(/XSS!/.source);</script>
~~~

Dieser Code enthält keine üblichen Stringbegrenzer und ist dennoch
funktionstüchtig.



## [Konsequenzen einer XSS-Attacke](#konsequenzen-einer-xss-attacke)
{: #konsequenzen-einer-xss-attacke}

Das obige Beispiel zum Einschleusen schädlichen Codes ist nur eine milde
Variante dessen, was möglich ist. Möglich ist zum Beispiel Folgendes:

* Umleiten des Besuchers auf eine andere Seite
* Auslesen der Zugangsdaten, die eventuell durch den Browser in Login-Felder eingefüllt werden
* Verunsicherung internet-unerfahrener Besucher (Beispiel: `alert`-Box als Betriebssystemmeldung tarnen)
* Manipulation der Internetseite
* Abfangen von Tastatureingaben

Cross-Site-Scripting stellt also, wie unschwer zu erkennen ist, eine
unmittelbare Gefahr für den Besucher der Seite dar. Eine Gefahr, die oft
unterschätzt wird. Nicht selten wird der Benutzer auf eine andere Seite
umgeleitet, die das gleiche Aussehen hat, aber mit dem Zweck erstellt wurde,
Zugangsdaten oder E-Mail-Adressen der Benutzer herauszufinden (Phishing).



## [Schutz vor Cross-Site-Scripting](#schutz-vor-cross-site-scripting)
{: #schutz-vor-cross-site-scripting}

### [Als Webmaster](#als-webmaster)
{: #als-webmaster}

Der Webmaster beziehungsweise Programmierer besitzt hier besondere Verantwortung, da das Wohl der eigenen Besucher von den getroffenen Sicherheitsvorkehrungen abhängt.

Es ist unumgänglich, alle vom Benutzer eingegebenen Daten als potenziell gefährlich einzustufen und entsprechend zu behandeln. Dazu gibt es verschiedene Ansätze.

<div class="alert alert-danger">
    <strong>Achtung!</strong>

    Häufig gemachter Fehler: Es kann nicht oft genug gesagt werden, dass <strong>alle</strong> vom User kommenden Daten bösartiger Natur sein können, nicht nur <a href="{{ page.root }}/jumpto/gpc/">GPC-Werte</a>. Auch manche Inhalte des <code>$_SERVER</code>-Arrays (etwa <a href="http://blog.oncode.info/2008/05/07/php_self-ist-boese-potentielles-cross-site-scripting-xss/">PHP_SELF</a>) gehören zur Kategorie der gefährlichen Datenquellen, die unbedingt validiert werden müssen.
</div>

<div class="alert alert-info">
    <strong>Hinweis:</strong>

    Um den Benutzern trotz Bearbeitung des HTML-Codes Formatierungsmöglichkeiten für ihre Inhalte zu bieten, können BB-Codes oder ähnliche Textauszeichnungsformate eingeführt werden.
</div>

### [Maskieren des Markups](#maskieren-des-markups)
{: #maskieren-des-markups}

Die standardmäßige und oftmals beste Vorgehensweise zur Verhinderung von Cross-Site-Scripting ist das korrekte Behandeln des Kontextwechsels nach HTML. Dabei werden alle HTML-Steuerzeichen (wie `<`, `>`, `"` oder `&`) durch ihre Entitäten ersetzt (`&lt;`, `&gt;`, `&quot;`, `&amp;`). PHP bietet dazu die beiden Funktion `htmlspecialchars` (empfohlen) und `htmlentities` an. Während letztgenannte Funktion diverse „Sonderzeichen“ (so auch deutsche Umlaute) in HTML-Code umschreibt, beschränkt sich `htmlspecialchars` auf syntaxrelevante Sprachbestandteile, was für den Anwendungszweck der Funktion ausreichend ist.

### [Entfernen des Markups](#entfernen-des-markups)
{: #entfernen-des-markups}

Bei dieser Option werden mit der Funktion `strip_tags` sämtliche HTML-Tags (sowie PHP-Tags und NUL-Bytes) aus einem String entfernt. Je nach konkreter Anwendung kann das eine unnötige Einschränkung für die Inhalte sein, da möglicherweise verhindert wird, einen Artikel wie diesen schreiben zu können, in dem HTML-Tags wie `<script>` im Fließtext vorkommen. Auch ersetzt `strip_tags` nicht die Notwendigkeit, den Kontextwechsel nach HTML durchzuführen, da Zeichen wie `<`, `>` und `&` auch außerhalb von HTML-Tags auftreten können (etwa als Kleiner-als-Zeichen).

<div class="alert alert-info">
    <strong>Hinweis:</strong>

    Das vollständige Entfernen des HTML-Markups ist nur sehr situativ sinnvoll anwendbar. Häufig ist es vorzuziehen, Daten, die keine HTML-Tags enthalten sollten (etwa Telefonnummern oder Adressen), bereits bei der Eingabevalidierung entsprechend zu prüfen und als Eingabefehler zurückzuweisen.
</div>

### [Softwaregestütztes Whitelisting](#softwaregestuetztes-whitelisting)
{: #softwaregestuetztes-whitelisting}

Abgesehen von den oben genannten Lösungen kann zudem der Einsatz von HTML-Validierungswerkzeugen wie [HTML Purifier](http://htmlpurifier.org/) in Betracht gezogen werden. Diese bieten eine extrem hohe Sicherheit gegen Cross-Site-Scripting. Ein kleines Restrisiko, das durch neu entdeckte Sicherheitslücken in Browsern entstehen kann, ist aber nie auszuräumen.

### [Unvollständige Maßnahmen](#unvollstaendige-massnahmen)
{: #unvollstaendige-massnahmen}

Es ist an vielen Stellen im Web zu lesen, aber es reicht nicht aus, beispielsweise lediglich die `<script>`-Tags unschädlich zu machen, da JavaScript prinzipiell auch über Attribute anderer Elemente eingeschleust werden kann.

~~~ html
<img src="javascript:alert('XSS')">
<img src="javascript:alert(/XSS/.source)">
<span onmouseover="alert('XSS')">demo</span>
~~~

Zudem lassen sich viele auf den ersten Blick sinnvoll wirkende Regex-Pattern zum Entfernen bestimmter Tags durch geschickten Aufbau der Eingabe überlisten.

~~~ php
$pattern = '@<script[^>]*?>.*?</script>@si';

$input = '<scrip<script></script>t>alert("XSS");<<script></script>/script>';

echo preg_replace($pattern, '', $input);
    // <script>alert("XSS");</script>
~~~

### [Als Benutzer](#als-benutzer)
{: #als-benutzer}

Für Benutzer gibt es einige Tipps, mit denen ein besserer Schutz vor
Cross-Site-Scripting möglich ist. Zunächst sollte die automatische
Passwortspeicherung des Browsers abschaltet werden, sofern diese bei
Wiedererkennung der Login-Seite die Daten automatisch in die dafür vorgesehenen
Felder füllt. Andere Passwortmanager wie Operas *Wand* oder das Addon *Secure
Login* für Firefox bieten hier mehr Sicherheit, da die Daten nicht direkt in
die Felder gefüllt werden.

Dazu sollten auf Login- sowie anderen Seiten mit sensiblen Daten sämtliche
Skript-Sprachen ausgeschaltet werden, bevor mit der Dateneingabe begonnen wird.

Vor der Eingabe sensibler Daten ist außerdem unbedingt zu prüfen, ob sich der
Browser noch auf der korrekten Seite befindet oder ob er heimlich auf eine
Fremdseite geleitet wurde.

