---
layout: guide
permalink: /jumpto/textfelder/
group: "Formularverarbeitung"
title: "Textfelder"
creator: nikosch
author:
    -   name: nikosch
        profile: 2314

    -   name: mermshaus
        profile: 15041

inhalt:
    -   name: "Browserelemente"
        anchor: browserelemente
        simple: ""

    -   name: "Textfelder auswerten"
        anchor: textfelder-auswerten
        simple: ""

    -   name: "Vorbelegen der Eingabe"
        anchor: vorbelegen-der-eingabe
        simple: ""

entry-type: in-discussion
---

Textfelder sind HTML-Formularelemente, die eine freie Angabe von Daten
ermöglichen. Die Eingabe kann dabei teilweise eingeschränkt werden. Die
Verarbeitung und Darstellung von Eingaben entsprechender Felder ist die
einfachste im Bereich der Formularverarbeitung im Webbereich.



### Browserelemente

Zur Zeit bieten Browser einzeilige und mehrzeilige Eingabefelder als
Formularelemente an.

#### Einzeilige Eingabefelder

* werden mit `<input type="text">` erzeugt
* Es gibt Spezialtypen:
  * `type="password"` erzeugt ein Eingabefeld, bei dem der Eingabestring nicht
     lesbar ist
  * `type="hidden"` erzeugt ein verstecktes Eingabefeld
* Es gibt eine Steuermöglichkeiten für die Eingabe: Maximallänge.

Mehrzeilige Eingabefelder

* werden mit `<textarea>` erzeugt.
* Eingaben können mehrzeilig sein. Elemente zeigen scrollbare Bereiche an
* Eingaben können beliebig lang sein, ein Maximum kann nicht angegeben werden



### Textfelder auswerten

Alle genannten Elemente werden gleich verarbeitet. Der Requestparameter ist ein
String, der je nach Anfragetyp in `$_POST` oder `$_GET` als `string`-Value auftaucht.
Der Name des genutzten Eingabefeldes (`name`-Attribut) dient dabei als Schlüssel
des Wertearrays.

~~~ html
<input type="text" name="Name" value="Horst">
<input type="password" name="MeinPasswort" value="123Kaffepause">

<textarea name="FreierText">Hallo, dies ist ein Satz.</textarea>
~~~

Folglich steht nach Absenden der Wert auch dementsprechend im Eingabeparameter
des Folgescripts:

~~~
array (
  'Name'         => 'Horst' ,
  'MeinPasswort' => '123Kaffepause' ,
  'FreierText'   => 'Hallo, dies ist ein Satz.' ,
)
~~~

Auf Werte einzelner Elemente kann einfach über Schlüssel zugegriffen werden,
der dem `name`-Attribut entspricht, bspw.

~~~ php
<?php
echo $_POST['MeinPasswort']; // 123Kaffepause
?>
~~~

<div class="alert alert-danger">

<strong>Achtung:</strong>

Für alle Ausgaben von Formularwerten besteht die Gefahr von Code-Injection und
<a
href="{{ site.url }}/jumpto/cross-site-scripting.html">Cross-Site-Scripting</a>.
Die Lehrbeispiele werden zunächst ohne entsprechende Maßnahmen reduziert
dargestellt.

</div>



###  Vorbelegen der Eingabe

Die Angabe eine Vorgabewertes unterscheidet sich für die beiden oben genannten
Eingabetypen.

#### Einzeilige Eingabefelder

Hier wird ein Vorgabewert im `value`-Attribut notiert. Eine dynamische Belegung
via PHP kann also so aussehen:

~~~ php
<?php
$name = 'Horst';
?>
<input type="text" name="Name" value="<?php echo $name; ?>">
~~~

Analog kann ein Formularfeld mit einem Wert eines vorherigen Form-Submits
vorbelegt werden. Dieses Prinzip wird vor allem vom Affenformular genutzt. Im
vorliegenden Beispiel würde $name bspw. durch `$_POST['Name']` ersetzt werden,
wenn das Formular an sich selbst abgesendet werden soll. Das Beispiel wird hier
bewußt nicht als Code gelistet, weil der wichtige Teil der Sriptsicherheit –
das Escaping – bisher vernachlässigt wurde. Näheres im Kapitel weiter unten.

Die Vorbelegung von Passwort oder versteckten Eingabefeldern unterscheidet sich nicht vom obigen Lehrbesipiel.

#### Mehrzeilige Eingabefelder

Die Vorbelegung für Textareas unterscheidet sich nur darin, dass der Inhalt
hier zwischen einem Start- und Endtag notiert wird:

~~~ php
<?php
$text = 'Hallo, dies ist ein Satz.';
?>
<textarea><?php echo $text; ?></textarea>
~~~

Wie hier leicht vorstellbar ist, kann `$text` das Wort `</textarea>` enthalten.
Deshalb ist das nachfolgende Thema unbedingt zu beachten.

#### Scriptsicherheit

Die obigen Beispiele sind fehleranfällig, weil die Eingaben keine
[Zeichenmaskierung]({{ site.url }}/jumpto/kontextwechsel/)
vornehmen. So können in den Eingaben potentiell Zeichen wie `"` oder Strings
wie `</textarea>` enthalten sein. Beide Fälle sind geeignet jeweils eines der
Elementtypen syntaktisch zu stören. Der Grund ist, dass PHP nicht
unterscheidet, welche Zeichenkette Teil der HTML-Syntax ist (und damit das
Element formt) und welche Teil von dessen Textinhalt.

Beispiel:

~~~ php
<?php
$name = 'Horst " ist " doof';
?>
<input type="text" name="Name" value="<?php echo $name; ?>">
~~~

erzeugt im Browser:

~~~ html
<input type="text" name="Name" value="Horst " ist " doof">
~~~

Wie man bereits optisch erkennt, wird das `value`-Attribut bereits durch das
erste doppelte Hochkomma geschlossen. Dieses Beispiel erzeugt nur einen
falschen Vorgabewert (Horst). In anderen Fällen ist das Prinzip geeignet,
Javascript-Code auszuführen, Browserlayouts zu zerstören, etc. (Vgl. XSS).

Wirkungsvolle Gegenmaßnahmen ist die konsequente Verwendung von HTML-Maskierung
von Eingabewerten. Geeignete Funktion sind `htmlspecialchars` und
`htmlentities`.

~~~ php
<?php
$text = 'Hallo, dies ist ein Satz.';
?>
<textarea><?php echo htmlspecialchars ($text); ?></textarea>
~~~

Unser obiges Problembeispiel:

~~~ php
<?php
$name = 'Horst " ist " doof';
?>

<input type="text" name="Name" value="<?php echo htmlspecialchars ($name); ?>">
~~~

erzeugt jetzt im Browser:

~~~
<input type="text" name="Name" value="Horst &quote; ist &quote; doof">
~~~

Für Eingaben „von außen“ (wie oben `$_POST['Name']`) sind weitere Maßnahmen
erforderlich. So ist weder gesichert, dass `$_POST['Name']` überhaupt als Eingabe
existiert, noch dass die Eingabe vom Typ `string` ist. Eine vollständige
Vorbelegung sieht damit so aus:

~~~ phph
<input type="text" name="Name" value="<?php if (isset ($_POST['Name'])) { echo htmlspecialchars ($_POST['Name']); } ?>">
~~~

bzw.:

~~~ php
<?php

if (isset ($_POST['Name'])) {
    // beachte: htmlspecialchars  ist jetzt hier zu finden
    $vorgabeName = htmlspecialchars ($_POST['Name']);
}
else {
    // wichtig, nicht vergessen!
    $vorgabeName = '';
}

?>
<input type="text" name="Name" value="<?php echo $vorgabeName; ?>">
~~~

<div class="alert alert-danger">

<strong>Achtung:</strong>

Zeichenmaskierung dient nicht nur der Vermeidung von Angriffen auf die
Anwendung. Auch „normale“, also anwendungsspezifische, Textdaten können Zeichen
oder Strings enthalten, die mit der HTML-Syntax kollidieren. Deshalb muss
jegliche dynamische Vorgabe (eigentlich jegliche Ausgabe in HTML) wie oben
beschrieben escaped werden.

</div>

