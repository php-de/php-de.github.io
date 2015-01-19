---
layout: guide

permalink: /jumpto/inhalt-ein-und-ausblenden/
title: "Inhalt ein- und ausblenden"
group: "Standard Implementierungsansätze"
orderId: 8

creator: Manko10
author:
    -   name: Manko10
        profile: 1139

    -   name: nikosch
        profile: 2314

    -   name: mermshaus
        profile: 15041

inhalt:
    -   name: "Einblenden der Box mit CSS"
        anchor: einblenden-der-box-mit-css
        simple: ""

    -   name: "Blenden der Box mit JavaScript"
        anchor: blenden-der-box-mit-javascript
        simple: ""

    -   name: "Blenden der Box mit PHP"
        anchor: blenden-der-box-mit-php
        simple: ""

    -   name: "Kombiniertes Beispiel, JS und PHP als Fallback"
        anchor: kombiniertes-beispiel-js-und-php-als-fallback
        simple: ""

entry-type: in-discussion
---

### Einblenden der Box mit CSS

Am einfachsten lässt sich dieser Effekt mit CSS realisieren. Beim Überfahren
eines Elements wird die Box eingeblendet und verschwindet beim Verlassen
wieder. Dazu ist folgendes Markup nötig:

~~~ html
<div>
    <a href="#"><span class="hover-box">Infobox</span>Hover me!</a>
</div>
~~~

Mithilfe weniger Zeilen CSS-Code wird die Box zum Leben erweckt.

~~~ css
span.hover-box {
    border: 1px solid #fc6;
    color: #000;
    display: none; /* Element standardmäßig nicht darstellen */
    position: absolute;
    text-decoration: none;
    top: 40px;
}
a:hover span.hover-box {
    display: block; /* Beim Überfahren des Links einblenden */
}
~~~

<div class="alert alert-danger">

<strong>Achtung:</strong>

Der Internet Explorer 6 unterstützt die Pseudo-Klasse :hover nur bei Links
(<code>&lt;a&gt;</code>).

</div>



### Blenden der Box mit JavaScript

Als nächstes werde ich eine Möglichkeit vorstellen, die Box mit JavaScript
einzublenden. Diese hat den Vorteil, dass sie nicht auf de Hover-Effekt
beschränkt ist und sich die Box auch nicht innerhalb des zu hovernden Elements
befinden muss.

#### Schalten des style-Attributs display

Zunächst wieder das Markup:

~~~ html
<a href="#" onclick="toggleElementDisplay('funny-box');">Click me!</a>

<div id="funny-box" style="border: 1px solid #fc6; display: none;">
    Here ist some content for you!
</div>
~~~

Das JavaScript dazu sieht so aus:

~~~ js
 function toggleElementDisplay(id)
  {
      var element = document.getElementById(id);
      var css     = element.style;
      if (css.display == 'block') {
          css.display = 'none';
          return;
      }
      css.display = 'block';
  }
~~~

#### Variante: Box mit JavaScript ein- und ausfaden

##### Eigenlösung

Das benötigte Markup sieht wie folgt aus:

~~~ html
<p id="fade">
Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
</p>
~~~

Es handelt sich lediglich um ein `<p>`-Tag mit einem Blindtext. Dieses soll nun
durch eine JavaScript-Methode ein- und ausgefadet werden:

~~~ js
document.fadeElementById = function(id)
{
    var el      = this.getElementById(id);
    var fade    = (typeof arguments[1] == 'number') ? arguments[1] : false;
    var fadeDir = arguments[2] ? arguments[2] : false;

    if (fadeDir == false) {
        fadeDir = (el.style.display != 'none') ? -1 : 1;

    }

    /*
        fadeDir:
            -1 == ausfaden
            +1 == einfaden
    */
    if (fadeDir < 0) {
        fade = fade ? fade - 0.1 : 1;
        if (fade < 0) {
            fade == 0;
            el.style.display = 'none';
            return;
        }
    } else if (fadeDir > 0) {
        el.style.display = 'block';
        fade = (fade !== false) ? fade + 0.1 : 0;
        if (fade > 1) {
            fade = 1;
            return;
        }
    }

    el.style.opacity = fade;
    el.style.filter = 'Alpha(opacity=' + (fade * 100) + ')';

    setTimeout('document.fadeElementById("' + id + '", ' + fade + ', ' + fadeDir + ');', 50);
}
~~~

Die Methode wird dem `document`-Objekt zugewiesen und ist somit ähnlich wie
bekannte andere Selektionsmethoden über `document.fadeElementById('fade')`
aufzurufen. Die Methode arbeitet mit drei Parametern, von denen aber nur einer
explizit angegeben ist, um den Benutzer der Methode nicht zu verwirren. Die
Methode ruft sich selbst immer wieder mit `setTimeout()` auf und übergibt dabei
noch zwei weitere Parameter: die aktuelle Opazität und die Richtung, in die
gefadet werden soll (`-1` oder `+1`). Diese beiden zusätzlichen Parameter
werden über das automatisch generierte Array `arguments` abgerufen. Sind diese
beiden Parameter nicht definiert, so wird davon ausgegangen, dass es sich um
einen rekursiven Aufruf handelt, also um einen durch `setTimeout()`. Die
explizite Typenprüfung bei der Abfrage von `arguments[1]` ist deshalb nötig, da
die Opazitätsstufe durchaus `0` sein kann, was aber nicht mit `null` bzw.
`'undefined'` verwechselt werden darf.

##### Mittels jQuery

Mit jQuery gestaltet sich das Ganze um einiges einfacher:

~~~ js
$.fade = function(query)
{
    if ($(query).css('display') == 'block') {
        $(query).fadeOut();
    } else {
        $(query).fadeIn();
    }
}
~~~

Statt des `document`-Objekts wurde hier die Methode `$` des jQuery-Frameworks
erweitert. Außerdem kann sich hier noch die für jQuery typische Query-Syntax
zum Auswählen von DOM-Elementen zunutze gemacht werden. Um das obige Element zu
faden, ist nun ein Aufruf von `$('#fade').fade()` nötig.

Noch einfacher gehts ohne Fading:

~~~ js
toggleDisplay = function (element)
{
    $(element).toggle();
}
~~~

##### Mittels ExtJS

ExtJS macht es einem ähnlich einfach, Elemente ein- und auszufaden. Diesmal
wurde das Effekte-Object `Ext.Fx` erweitert:

~~~ js
Ext.Fx.fade = function(query)
{
    Ext.select(query).each(function(el)
    {
        if (el.getStyle('display') == 'block') {
            el.fadeOut({
                useDisplay: true
            });
        } else {
            el.fadeIn();
        }
    });
}
~~~

Ein Aufruf von `Ext.Fx.fade('#fade')` genügt, um das Element ein bzw. auszufaden.

Das Erweitern der Frameworks lässt sich natürlich noch stark verfeinern und
verbessern, aber wie sooft geht es auch hier nur um das Prinzip.

#### Schalten eines `class`-Attributs

Eine weitere Abstraktion ermöglicht das Benutzen einer CSS Klasse, die das
Aussehen des Elementes vor und beim Überfahren beschreibt. Im einfachsten Fall
ist das wieder `display:block` bzw. `none`. Die Vorteile, die sich ergeben:

* die Formatierung geschieht dort, wo sie hingehört - im Stylesheet
* die Formatierung kann einheitlich für verschiedene Elemente geschehen
* die Formatierung kann verschiedene Elementeigenschaften berücksichtigen (so
  z.B. inline-Elemente auch inline belassen und nicht in block umwandeln).
* Es ist nur eine Formatierung für den geschalteten Zustand notwendig.
* Der Code läuft nicht Gefahr, mit anderen Scripten oder Stylsheets zu
  kollidieren, solange die Klasse individuell gewählt ist.

~~~ html
<style type="text/css">
  .hidden_element {display:none;}
  .red {color:#ff0000;}
</style>
...
<a href="#" onclick="toggleElementDisplay ('box');">Click me!</a> or
<a href="#" onclick="toggleElementDisplay ('inline');">click me!</a>

<div id="box">Here ist some content for you!</div>
Or toggle some <b id="inline" class="red">inline</b> content here.
~~~

Obwohl es sich um verschiedene Elementtypen handelt, schaltet eine gemeinsame
CSS Klasse (`hidden_element`) jeweils einen spezifischen Versteckt-Zustand.

~~~ js
function toggleElementDisplay (element_id)
{
    element = document.getElementById (element_id);

    var regExpClass = new RegExp ('\\s*\\bhidden_element\\b');
    if (0 == regExpClass.test (element.className)) {
        element.className += ' hidden_element';
        return;
    }
    element.className = element.className.replace (regExpClass , '');
}
~~~

Das Script prüft das `class`-Attribut des Elements mittels eines regulären
Ausdrucks auf das Vorhandensein eines bestimmten Wertes. Die word boundaries
(`\b`) verhindern dabei, dass Attributsettings, die das CSS-Attribut als
Teilstring beinhalten, teilersetzt werden. Durch Verwenden von *Suchen und
Ersetzen* kann das Element auch weitere `class`-Attribute besitzen, die das
Script nicht beeinträchtigt (wie das Attribut `red` im Beispiel). Der
Übersichtlichkeit halber wurde hier die Bestimmung des Elements über die ID mit
in die Funktion übernommen.

Mit jQuery:

~~~ js
toggleElementDisplay = function (element)
{
    $(element).toggleClass('hidden_element');
}
~~~



### Blenden der Box mit PHP

Natürlich funktioniert auch eine serverseitige Variante. Dabei entsteht bei
jedem Umschaltprozess ein Request. Zum Schalten wird eine GET-Variable benutzt,
deren Status zwischen visible und hidden wechselt. Der Einfachheit halber
verwenden wir wieder eine CSS-Klasse, um den View-State anzugeben. Die
Klassenangabe entspricht dabei dem aktuellen GET-Parameterwert.

~~~ php
<?php

// Dieses Array dient gleichzeitig zur Validierung gültiger Zustände
// wie auch zum Zuordnen des Gegenzustands
$states = array(
               'visible' => 'hidden' ,
               'hidden' => 'visible' ,
               );

$display = 'visible'; // dies ist der Initialzustand

if (! empty ($_GET['display'])) {
  // wir nehmen nur 'visible' oder 'hidden an
  if(in_array ($_GET['display'] , $states)) {
      $display = $_GET['display'];
  }
}

$link = '?display=' . $states[$display]; // Gegenteil in den Link
?>
<style>
  .hidden {display:none;}
  .visible {display:block;}
</style>
...
<a href="<?php echo $link; ?>">Click me!</a>
<div class="<?php echo $display; ?>">
Here ist some content for you!
</div>
~~~



### Kombiniertes Beispiel, JS und PHP als Fallback

Aufbauend darauf können wir unseren Link erweitern, so dass er bei
Vorhandensein von Javascript die Box ohne Neuladen der Seite „toggelt“. Wir
benutzen eine jQuery-Variante, behalten aber unsere CSS-Klassen bei, um auch
weiter PHP-seitiges Schalten zu unterstützen.

~~~ php
<?php

// Dieses Array dient gleichzeitig zur Validierung gültiger Zustände
// wie auch zum Zuordnen des Gegenzustands
$states = array(
               'visible' => 'hidden' ,
               'hidden' => 'visible' ,
               );

if (! empty ($_GET['display'])) {
  // wir nehmen nur 'visible' oder 'hidden an
  if(in_array ($_GET['display'] , $states)) {
      $display = $_GET['display'];
  }
}
// Initialsetting oder ungültige GET-Angaben
if (! isset ($display)) {
  $display = 'visible'; // dies ist der Initialzustand
}

$link = '?display=' . $states[$display]; // Gegenteil in den Link
?>

...

<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
<script type="text/javascript">
  $(function () {
    $('a#tgglBox').click (function (){
      $('#box').toggleClass('visible');
      $('#box').toggleClass('hidden');
      return false;
    });
  });
</script>
<style>
  .hidden {display:none;}
  .visible {display:block;}
</style>

...

<a id="tgglBox" href="<?php echo $link; ?>">Click me!</a>

<div id="box" class="<?php echo $display; ?>">Here ist some content for you!</div>
~~~

Der einzige Nachteil der Lösung ist, dass bei Neuladen ein etwaiger Javascript
geschalteter Status verloren geht (wie bei allen JS Lösungen). Eine Lösung
dafür kann in einer Session liegen, die via Ajax auf den aktuellen Status
gesetzt wird. Über jQuery gestaltet sich Ajax sehr einfach. Sinnvollerweise
wird auch der PHP-seitige Fallback an diese Session geknüpft. Dies geschieht am
Anfang unseres Scriptes.

~~~ php
<?php

session_start();

// Dieses Array dient gleichzeitig zur Validierung gültiger Zustände
// wie auch zum Zuordnen des Gegenzustands
$states = array(
               'visible' => 'hidden' ,
               'hidden' => 'visible' ,
               );


// Ajax detektieren
if(isset($_SERVER['HTTP_X_REQUESTED_WITH']) &&
   $_SERVER['HTTP_X_REQUESTED_WITH']=== 'XMLHttpRequest') {

    if(in_array ($_GET['display'] , $states)) {
        $_SESSION['display'] = $_GET['display'];
    }
    else {
        unset ($_SESSION['display']);
    }
    echo $_SESSION['display'];
    exit;
}



if (! empty ($_GET['display'])) {
  // wir nehmen nur 'visible' oder 'hidden an
  if(in_array ($_GET['display'] , $states)) {
      $display = $_GET['display'];
  }
}
// Initialsetting oder ungültige GET-Angaben
if (! isset ($display)) {
    if(isset($_SESSION['display'])) {
        $display = $_SESSION['display'];
    }
    else {
        $display = 'visible'; // dies ist jetzt der Initialzustand
    }
}

$link = '?display=' . $states[$display]; // Gegenteil in den Link
?>
...

<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
<script type="text/javascript">

  $(function () {
    $('a#tgglBox').click (function (){
      var class=$('#box').hasClass('visible')?'hidden':'visible';
      $.ajax({data:{display:class}});
      $('#box').toggleClass('visible');
      $('#box').toggleClass('hidden');
      return false;
    });
  });

</script>
<style>
  .hidden {display:none;}
  .visible {display:block;}
</style>

...

<a id="tgglBox" href="<?php echo $link; ?>">Click me!</a>

<div id="box" class="<?php echo $display; ?>">Here ist some content for you!</div>
~~~
