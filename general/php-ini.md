---
layout: guide

title: "php.ini - Wichtigsten Funktionen"

creator: Manko10

group: "Allgemein"

author:
    - name: Manko10
      profile: 1139
      
    - name: nikosch
      profile: 2314
      
    - name: _cyrix_
      profile: 7661
      
inhalt:
    - name: "magic_quotes_gpc"
      anchor: magic-quotes-gpc
      simple: ""

    - name: "register_globals"
      anchor: register-globals
      simple: ""
      
    - name: "Verfügbarkeit"
      anchor: verfgbarkeit
      simple: ""
      
    - name: "Fremdinitialiserung"
      anchor: fremdinitialiserung
      simple: ""
      
    - name: "Kollision von Parameterangaben"
      anchor: kollision-von-parameterangaben
      simple: ""
      
    - name: "Alternative Verwendung von Superglobalen Arrays"
      anchor: alternative-verwendung-von-superglobalen-arrays
      simple: ""

    - name: "Links zum Thema"
      anchor: links-zum-thema
      simple: ""

entry-type: in-progress

---

### magic_quotes_gpc

Die Direktive **magic_quotes_gpc** bezeichnet einen Eintrag der php.ini-Datei, die PHP anweist, die Werte von übermittelten GPC-Parametern (GET, POST und COOKIE) einer automatische Sonderzeichen-Auszeichnung (sogenanntes Escaping) zu unterziehen. Allen der nachfolgend genannten Sonderzeichen wird dabei ein Backslash (\\) als Escapezeichen vorangestellt.

Betroffen sind:

* einfaches Hochkomma (') 
* dopppeltes Hochkomma (")
* NULL Zeichen (\0)
* der Backslash selbst (\\)

Das Verhalten von magic_quotes_gpc ist sehr wichtig für eine nachfolgende Parameterverarbeitung

Um zur Laufzeit herauszufinden, ob die Direktive auf On gesetzt ist, kann die Funktion [get_magic_quotes_gpc()](http://php.net/get_magic_quotes_gpc) herangezogen werden.

<div class="alert">
<strong>Achtung!</strong> magic_quotes_gpc ist als deprecated gekennzeichnet und wird in PHP 6.0.0 entfernt.
Schon jetzt sollten [Alternativen](http://www.php.net/manual/en/security.magicquotes.disabling.php) benutzt werden, um Software zukunftsfähig zu gestalten. 
</div>

### register_globals

Die Direktive register_globals in der php.ini bewirkt, dass alle Request-Parameter unter ihrem Namen als Variable im globalen [Scope](http://www.php.de/wiki-php/index.php/Scope) verfügbar sind. Wird einer PHP-Datei beispielsweise der GET-Parameter foo=bar übergeben, so ist bei aktiver register_globals Einstellung der Wert bar im Skript direkt unter dem Variablennamen $foo abrufbar. 

Da register_globals in frühen PHP-Versionen Standard war, setzen viele alte (veraltete) Scripte noch auf dieses Verhalten. In neuen Serverumgebungen funktionieren diese Scripte jedoch out-of-the-box nicht mehr, da register_globals in aktuellen PHP-Versionen deaktiviert ist und damit die betreffenden Variablen nicht mehr automatisch im Scope deklariert werden. 

#### Problematik

Die Verwendung von Variablen, die durch register_globals automatisch initialisiert wurden, führt zu verschiedenen Problemen, weshalb diese Option zunehmend per Ini-Voreinstellung abgeschaltet ist und in zukünftigen PHP Versionen ganz entfallen wird. Nachfolgend werden die Problematiken aufgeführt. 

<div class="alert">
<strong>Achtung!</strong> register_globals ist seit PHP 4.2.0 standardmäßig deaktiviert und wird in PHP 6.0.0 endgültig entfernt.
Es wird dringend empfohlen, stattdessen [SuperGlobals](http://www.php.de/wiki-php/index.php/SuperGlobals) zu verwenden! 
</div>

##### Verfügbarkeit

Alleine die Möglichkeit, register_globals ein- und auzuschalten führt zum ersten Problem. Ist eine Software so programmiert, dass sie automatisch initialisierte Variablen benutzt, funktioniert sie nicht mehr auf Systemen, die register_globals deaktiviert haben. Gerade auf Serverbereichen, die nicht selbst administrierbar sind, ergibt sich als einzige Möglichkeit eine Änderung der genutzen Software. Die alternative Verwendung der superglobalen Parameterarrays funktioniert dagegen sowohl mit an- als auch abgeschalteter Variablenregistrierung. 

##### Fremdinitialiserung

Betrachtet man das obige Beispiel lässt sich erahnen, dass aus dieser automatischen Variablengenerierung immense Probleme entstehen können, die nicht zuletzt auch die Sicherheit des Skripts beeinträchtigen. Der Programmierer hat durch register_globals keine Kontrolle mehr über die verfügbaren Variablen.

Ein Zugriff auf Variablen, denen in einem Script bisher kein Wert zugewiesen wurde, gibt NULL (und eine Notice) zurück. Verläßt sich der Programmierer unbewußt auf dieses Verhalten, entsteht ein Unsicherheitsfaktor: Wird eine Variable nicht korrekt initialisiert, kann es leicht passieren, dass sie durch eine Übergabe "von außen" (also bspw. über einen GET Parameter in der Browseradresszeile) und das Verhalten von register_globals mit einem Wert vorbelegt wird.

Ein Beispiel, um diese Sicherheitslücke du demonstrieren:

~~~php
if (isset($param)) {
    $passSecondIf = true;
}
 
if (isset($passSecondIf) && true == $passSecondIf) {
    // do something important...
}
~~~

Das Script ist so konzipiert, dass der [GPC](http://php-de.github.io/request-handling/gpc.html)-Parameter $param abgefragt wird. Ist dieser gesetzt, so wird die Variable **$passSeconfIf** deklariert und initialisiert, welche in der zweiten if-Abfrage benutzt wird. Da diese Variable aber nicht sicher initialisiert wurde, ist es einfach möglich, sie von außen zu manipulieren. Wird z.B. der GET- oder POST-Parameter **passSecondIf=abc** übergeben, so ist es möglich, das zweite if-Statement einzuleiten, ohne dass die Prüfung vorher erfolgreich sein muss. 

Um diese Sicherheitslücke zu umgehen, sollten Variablen zuvor fest und ohne umschließende Bedingung initialisiert werden:

~~~php
$passSecondIf = false;
 
if (isset($param)) {
    $passSecondIf = true;
}
 
if (true == $passSecondIf) {
    // do something important...
}
~~~

Somit ist es nicht mehr möglich, $passSecondIf zu manipulieren. Dass das Beispiel ohne register_globals trotzdem nicht wie gewünscht funktionieren würde, ist Problematik 1 geschuldet. Lediglich die Prüfung des Parameters durch den Zugriff über eine Superglobale führt hier zum Ziel. 

##### Kollision von Parametern

Ein weiteres Problem von register_globals ist, dass sich gleichnamige Parameter überschreiben. So wird beispielsweise je nach Einstellung der GET-Parameter **$foo** durch den POST-Parameter **$foo** überschrieben, der wiederum vom COOKIE-Parameter **$foo** überschrieben wird. Werden also mehrere gleichnamige Parameter auf verschiedenem Wege übergeben, so ist nur einer von ihnen schlussendlich verfügbar, da alle denselben Variablennamen (hier: **$foo**) für sich beanspruchen. 

### Alternative Verwendung von Superglobalen Arrays

Seit PHP Version 4.1.0 stehen für jede Art der Request-Parameterübergabe geeignete assoziative Arrays zur Verfügung, die die Werte unter dem Parameternamen als Schlüssel bereitstellen. Die Arrays sind superglobal, also in jedem Variablenraum verfügbar, und nach dem Typ des Request benannt. Ein GET Parameteraufruf mit **?foo=bar** stellt bspw. ein Array **$_GET** mit folgendem Inhalt bereit: 

~~~php
array (
  "foo" => "bar"
  )
~~~

Statt der Benutzung des Parameternamens wird über den Schlüssel des Arrays auf den Wert zugegriffen:

~~~php
// register_globals Syntax
echo $foo;
 
// Superglobals Syntax
echo $_GET['foo'];
 
// Syntax um von register_globals auf Superglobale umzustellen
$foo = $_GET['foo'];
// bzw.
$foo = $_REQUEST['foo'];
~~~

Entsprechend bündelt **$_POST** alle POST Parameter und **$_COOKIE** alle vom Browser gesandten Cookiedaten des Scriptaufrufs. 

### Links zum Thema

* [RegisterGlobals, was ist das?](http://www.openwebboard.org/Tutorials/PHP_MySQL/RegisterGlobals_was_ist_das_1.html)
* [PHP.net: Superglobals](http://de.php.net/manual/de/language.variables.superglobals.php)
* [PHP.net: Verarbeitung von Daten](http://de.php.net/manual/de/ini.sect.data-handling.php#ini.register-globals)
