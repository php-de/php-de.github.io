---
layout:    guide

permalink: /jumpto/eva-prinzip/
root:      ../..
title:     "EVA-Prinzip (Standardverfahren)"
orderId:   4
group:     "Code-Optimierung"

creator: nikosch

author:
    -   name: nikosch
        profile: 2314
    -   name: hausl
        profile: 21246

inhalt:
    -   name: "Einleitung"
        anchor: einleitung
        simple: ""

    -   name: "EVA und das Client-Server-Prinzip"
        anchor: client-server-prinzip
        simple: ""

    -   name: "Bedeutung"
        anchor: bedeutung
        simple: ""

    -   name: "Umsetzung"
        anchor: umsetzung
        simple: "Funktions-/Methodenrückgabe, Dependency Injection"

    -   name: "Includes"
        anchor: includes
        simple: ""

    -   name: "Templating"
        anchor: templating
        simple: ""


entry-type: in-discussion
---

Das **EVA-Prinzip** (Eingabe - Verarbeitung - Ausgabe) steht für ein Paradigma, das die Arbeitsfolge von Komponenten einer Anwendung beschreibt. Die Kernaussage ist dabei, dass die grundlegende Arbeitsweise die Arbeitsschritte


- Eingabe von Daten,
- programmatischer Verarbeitungsprozess,
- Ausgabe des Ergebnisses
<br>


linear in dieser Reihenfolge erfolgen sollen. Dies ist technisch sinnvoll, soll aber auch eine Abbildbarkeit eines Softwareprozesses auf eine abstraktes Prinzip unterstützen, das dem Prinzip *Ursache* und *Wirkung* nahekommt.


## [Einleitung](#einleitung)
{: #einleitung}

Die Sprache PHP ist eng mit dem EVA-Prinzip verknüpft, weil der übliche Spracheinstieg eng mit der Funktion von PHP als dynamische Ausgabe verknüpft ist:

~~~ php
<html>
  ...
  <body>
  <?php echo 'Hallo Welt'; ?>
  </body>
</html>
~~~

PHP kommt hier die Rolle der Ausgabe einer Information zu. Diese ist zunächst statisch - „Hallo Welt“.

Im nächsten Schritt soll das Script eine URL-Übergabe wiedergeben. Aus Gründen der [Scriptsicherheit]({{ page.root }}/jumpto/cross-site-scripting/) fügen wir einen htmlspecialchars-Befehl ein, der sich um die [Maskierung]({{ page.root }}/jumpto/kontextwechsel/) (sog. Escaping) schädlicher Eingabewerte kümmert:

~~~ php
<html>
  ...
  <body>
  <?php echo htmlspecialchars($_GET['test']); ?>
  <a href="?test=Hallo+Welt">Test</a>
  </body>
</html>
~~~

Schließlich wollen wir noch etwas Logik hinzufügen. Z.B. eine Prüfung, ob der Link geklickt wurde:

~~~ php
<html>
  ...
  <body>
  <?php
  if (isset($_GET['test'])) {
      echo htmlspecialchars($_GET['test']);
  } else {
      echo 'Zum ersten mal hier?';
  } ?>
  <a href="?test=Hallo+Welt">Test</a>
  </body>
</html>
~~~

Im Prinzip haben wir jetzt alle Komponenten zusammen. Die Eingabe (hier durch die superglobale $_GET repräsentiert), die Verarbeitung (Existenzprüfung, Umwandlung der Eingabe und Rückgabe als Escape-String), die Ausgabe (statischer Wert bzw. echo dieses Escape-Ausdrucks).

Im Beispiel wirkt PHP größtenteil als Templating-Funktion. Das bedeutet, in ein statisches (Text-)Konstrukt (Template) wird ein dynamischer Inhalt „eingebaut“. Im Prinzip ist das auch die Hauptaufgabe von PHP - die Sprache wurde entworfen, um dynamisch HTML-Dokumente zu generieren. PHP ist jedoch auch eine vollwertige Programmiersprache. Wir könnten also innerhalb unseres Dokuments Werte berechnen, Dateisystemoperationen durchführen o.ä. In diesem Fall wird unser Template schnell fragmentiert, da die Anzahl von Codezeilen der Verarbeitungs-Komponente stark zunimmt. Auch stellt sich die Frage, an welche Stelle diese Verarbeitung gehört. Praktisch gesehen natürlich vor die Ausgabe (das ist logisch), das EVA-Prinzip geht allerdings weiter und definiert den richtigen Platz dafür vor jegliche Ausgabe.


## [EVA und das Client-Server-Prinzip](#client-server-prinzip)
{: #client-server-prinzip}

Um dies weiter zu betrachten, müssen wir uns kurz das Prinzip von Webkommunikation ansehen. Auf einen Request des Client erfolgt die Antwort in Form unseres PHP-generierten Dokuments. Auf einer tieferen Ebene (vgl. OSI-Modell) wird neben den offensichtlichen Textinhalten aber auch eine Reihe von Meta-Informationen versendet: die sogenannten HTTP-Header. Diese Header können auch durch PHP gesetzt werden. Nicht gesetzte Header produziert der Webserver eigenständig. Für das EVA-Prinzip relevant ist vor allem, dass dies vor jeglicher Textausgabe erfolgt. Das bedeutet, der Webserver erkennt eine Textausgabe und verschickt die HTTP-Header des Dokuments, bevor er die Ausgabe ausliefert.

An dieser Stelle ist es Zeit, unser Verständnis für das Funktionsprinzip von PHP „umzukrempeln“. Der Spracheinsteiger interpretiert PHP zumeist als „in HTML eingebettete“, dynamische Komponente. Betrachtet man die Komponenten (PHP, HTML, Server, Client, HTTP) auf technischer Ebene, ergibt sich ein anderes Bild: Der Server, auf dem PHP läuft, kennt im Prinzip gar keine HTML-Dokumente. Seine einzige Aufgabe ist das Ausliefern (und über PHP auch das Generieren) von Dokumenten, die über eine Adresse (die URI) angefordert werden. Erst auf der Clientseite - für gewöhnlich ein Browser - wird das Dokument als HTML (oder eben als Bild, XML-Dokument, Stylesheet...) identifiziert und angemessen dargestellt.

**Als Erkenntnis ergibt sich, dass PHP die „umschließende“ Sprache ist, nicht HTML.**

Für unser Hallo-Welt-Beispiel:

~~~ php
<?php
// PHP vor HTML
?>
<html>
  ...
  <body>
  <?php echo 'Hallo Welt'; ?>
  </body>
</html>
<?php
// PHP nach HTML
?>
~~~

oder in einer alternativen Schreibweise:

~~~ php
<?php
// PHP vor HTML

$out = 'Hallo Welt';
echo '<html> ... <body>' , $out , '</body></html>';

// PHP nach HTML
?>
~~~

Der HTML-Inhalt wird zu einem reinen Ausgabetext von PHP, der erst im Browser seine Bedeutung erhält.

Gehen wir zurück zur obigen AUssage zu Headern, werden die Header ziemlich genau in dem Moment „abgesendet“, in dem der PHP-Parser `echo` druchläuft.


## [Bedeutung](#bedeutung)
{: #bedeutung}

Solange wir PHP in seiner Grundfunktion als Ausgabesprache nutzen, brauchen wir uns im Prinzip keine Sorgen um EVA und die HTTP-Header machen. Sobald wir etwas tiefer einsteigen, wird das schnell unabdingbar. Viele wichtige Mechanismen basieren auf dem Prinzip von HTTP-Headern:

- Cookieverarbeitung,
- damit zumeist auch Sessions
- PHP-Header-Weiterleitungen (location-redirect)
- spezielle Mimetype- oder Download-Header
<br>


All diese Funktionen müssen vor jeglichen Textausgaben des Dokuments geschehen, sonst resultieren sie in einem [headers-sent-Fehler]({{ page.root }}/jumpto/headers-already-sent/).


## [Umsetzung](#umsetzung)
{: #umsetzung}

Der klassische Einsteigerfehler ist, die Anwendung nach dem Funktionsprinzip und nicht nach EVA zu gliedern:

Verarbeitung einer Formulareingabe (Form nicht im Code)

~~~ php
<html>
  ...
  <body>
  <?php if ($_POST['Name'] == 'geheim') {
      header('Location: http://www.example.com/success.php');
      exit;
  } else {
      ?>Die Anmeldung war leider falsch.<?php
  } ?>
  </body>
</html>
~~~

Der Code versucht, ein Kennwort zu prüfen und im Erfolgsfall zu „success.php“ weiterzuleiten. Was mit einer Ausgabe noch funktionierte und von der Abfolge logisch aufgebaut war, wird mit dem header-Befehl fehlschlagen, da hier ein nötiger HTTP-Header bereits nicht mehr abgesetzt werden kann.

Wir wollen uns auf PHP als die „umschließende“ Sprache zurückbesinnen und stellen den Code um:

Verarbeitung einer Formulareingabe, diesmal nach EVA

~~~ php
// Eingabe
$input = null;
if (isset($_POST['Name'])) {
  $input = $_POST['Name'];
}

// Verarbeitung

if ($input == 'geheim') {
    header('Location: http://www.example.com/success.php');
    exit;
} else {
    $out = '<html>...<body>Die Anmeldung war leider falsch.</body></html>';
}

// Ausgabe

echo $out;
~~~

Die Prüfung ist nicht direkt für die Ausgabe verantwortlich und kann deshalb früher erfolgen. Die Ausgabe ist sowieso nur für den Fehlerfall relevant, im Erfolgsfall wird ja gleich weitergeleitet.


### [Funktionsrückgabe](#funktionsrueckgabe)
{: #funktionsrueckgabe}

Die meisten der obigen Aussagen, lassen sich auf Funktionen übertragen. Meist dienen Funktionen ja dazu, wiederverwendbare oder zusammengehörige Funktionalität zu kapseln. Damit können Sie ein Paradebesipiel für EVA sein: Sie erhalten nötige Eingabewerte, stellen irgendetwas damit an und geben das fertige Produkt zurück. Leider sieht die Realität sehr oft immer noch so aus:

Satz des Pythagoras, richtig gerechnet, falsch verarbeitet

~~~ php
function doPythagorean ($a, $b)
{
    $sum = pow ($a , 2 ) + pow ($b , 2);
    $c = sqrt ($sum);

    echo 'Der Pythagoras lautet: ' , $c;
}

doPythagorean(17 , 4);
~~~

Was fällt auf? Die Funktion ist hoch spezialisiert, nicht wiederverwendbar, bspw. wenn ich den Ausgabesatz in Englisch ausgeben wollte oder mit dem Wert noch weiterrechnen. EVA in all seiner Einfachheit:

Satz des Pythagoras, diesmal mit EVA

~~~ php
function doPythagorean ($a, $b) // Eingabe
{
    // Verarbeitung
    $sum = pow ($a , 2 ) + pow ($b , 2);
    $c = sqrt ($sum);

    return $c;
}

// Ausgabe nach außen verlagert
echo 'Der Pythagoras lautet: ' , doPythagorean(17 , 4);
~~~

Die Funktion stellt sozusagen den Schritt „Verarbeitung“ dar, Ihre Schnittstellen die Schritte Eingabe (Liste der Parameter) und Ausgabe (Return-Wert).


### [Methodenrückgabe](#methodenrueckgabe)
{: #methodenrueckgabe}

Auch in der objektorientierten Programmierung (OOP) läßt sich vortefflich schludern. Für Eingaben, vor allem die Instanziierung von Objekten, spiegelt sich EVA im Pattern der sog. Dependency Injection wieder, wir wollen aber zunächst die Methodenrückgabe betrachten.

Prinzipiell gilt das eben für Funktionen gesagte. Auch für ein Objekt besteht keine Notwendigkeit, eine direkte Bildschirmausgabe zu machen. Mit einer Wertrückgabe wird immer ein höherer Grad an Wiederverwendbarkeit erreicht werden.
Objekte bieten aber noch eine andere Gefahr zur Verletzung von EVA: Sie bilden einen eigenen Werteraum (Scope), der dazu verführt, Funktionsergebnisse direkt im Objekt abzulegen, statt an den aufrufenden Kontext zurückzugeben. Für einige Methoden mag das sinnvoll sein (Init-, Settermethoden), für manche eine Philosophiefrage, für viele aber auch schlechter Stil. In der OOP dreht sich ein großer Teil der Eleganz um sogenannte Schnittstellen: Objekte und auch deren Methoden haben eine gewisse Signatur, sie zeigen über Ihre festgelegten Eingabeparameter, welche Daten sie verarbeiten können, sie zeigen über ihren Namen, welchen Verarbeitungsschritt sie anbieten oder welche Funktion sie erfüllen. Auch die Rückgabe einer Methode sollte diesem Ideal folgen und einen vorhersehbaren Wert liefern. Eine Methode namens „getAge()“ lässt die Rückgabe eines Alters erwarten, für ein Objekt „User“ wird das vermutlich ein Integer kleiner 100 sein. Eine Methode „checkAge()“ sagt uns aufgrund Ihres Namens, dass sie ein Alter prüft. In der OOP kann das verschieden aussehen. Als Beispielfall denke man sich eine Nutzergenerierung auf Grundlage eines POST-Formulars, dass einen Usernamen und eine Altersangabe abfragt:

EVA bei der Arbeit mit Objekten, Negativbeispiel

~~~ php
$user = new User($_POST['username']);

$user->setAge ($_POST['age']);
$user->checkAge();
$user->getStatus();
~~~

**Variante 1.** Wir erzeugen ein Userobjekt. SetAge() setzt das Alter als Property im Userobjekt. checkAge() prüft jetzt diese Property. Offensichtlich wird diese Prüfung irgendwo im Objekt gespeichert, getStatus() scheint diese Information - vielleicht auch weitere - auszuwerten.

EVA bei der Arbeit mit Objekten, verbessert

~~~ php
$user = new User($_POST['username']);

$user->setAge ($_POST['age']);
if (false === $user->checkAge()) {
    echo 'invalid age';
}
~~~

**Variante 2.** Hier erhalten wir außerhalb des Objekts eine Information, ob das Alter eine sinnvolle Angabe darstellt und können geeignet reagieren, bspw. eine Ausgabe machen, die Anwendung beenden oder das Userobjekt verwerfen. Der Vorteil: Wir benötigen keine zusätzliche Property, die die Gültigkeit der Altersangabe speichert (siehe oben, Methode getStatus()). Trotzdem greift checkAge() offensichtlich auf die objekteigene Property zu, in die vorher das Alter gespeichert wurde.

EVA bei der Arbeit mit Objekten, sauberes Interface

~~~ php
$user = new User($_POST['username']);

if (true === $user->checkAge($_POST['age'])) {
    $user->setAge ($_POST['age']);
}
~~~

**Variante 3.** checkAge() besitzt hier einen Parameter und liefert die Information zur Gültigkeit des Alters zurück. Das gibt uns neue Möglichkeiten: Wir können bereits im Vorfeld entscheiden, ob wir das Userobjekt auf das offensichtlich falsche Alter setzen wollen.


<div class="alert alert-info"><strong>Information!</strong> Die vorliegenden Codes sind Lehrbeispiele und der Übersichtlichkeit halber stark vereinfacht. Der Sinn, einen User ggf. ohne Altersangabe und ohne Validierung des Namens zu erstellen, ist natürlich in Frage zu stellen.</div>


#### [Dependency Injection (DI)](#di)
{: #di}

Die obigen Codebeispiele zeigen auch einen einfachen Fall von DI. $_POST ist eine Superglobale und technisch gesehen ist es nicht notwendig, sie als Parameter von Methoden (Konstruktor und setAge ()) zu übergeben, sie ist ohnehin in jedem Kontext verfügbar. Schauen wir uns mal das obige Beispiel an, wenn wir diese Variablen einfach im Objekt auslesen:

Negativbeispiel, alles sehr sehr übersichtlich

~~~ php
$user = new User;
~~~

Schön kurz. Aber informativ? Was passiert an dieser Stelle? Wer das aus dieser Perspektive betrachtet, wird sicher nicht antworten: „Hier wird ein User erzeugt, dabei wird intern $_POST['username'] als Name gesetzt, $_POST['age'] als mögliche Altersangabe validiert und bei Erfolg als Alter des Users gesetzt.“ Technisch möglich ist das aber, wir hätten hier unsere saubere Schnittstelle gegen einen Einzeiler und eine halbe A4-Seite zusätzlicher Dokumenatation eingetauscht.

Die meisten nicht-trivialen Objekte, sind von anderen Objekten oder Vorgabewerten abhängig (sog. Dependencies), die sie verarbeiten oder verändern. Zugunsten einer verständlichen Arbeitsweise, zur Erhöhung der Wartbarkeit und Testbarkeit von Code ist die Einhaltung von EVA in der OOP maßgeblich.

3 Fragen an den obigen Kurz-Code:

- Was passiert, wenn wir den Usernamen prinzipiell in Kleinschreibung setzen wollen?
- Was passiert, wenn wir statt $_POST zusätzlich auch $_GET erlauben wollen?
- Was passiert, wenn wir bei einer ungültigen Altersangabe eine Information ausgeben wollen?
<br>
<br>

Die Antwort auf alle drei Fragen lautet: Geht nicht, das Funktionsprinzip ist fest verdrahtet, dazu muß der Code für das Userobjekt geändert werden.


### [Includes](#includes)
{: #includes}

...


### [Templating](#templating)
{: #templating}

...
