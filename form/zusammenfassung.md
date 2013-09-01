---
layout: guide
group: "Formularverarbeitung"
title: "Zusammenfassung"
creator: nikosch
author:
    -   name: nikosch
        profile: 2314
    -   name: mermshaus
        profile: 15041
    -   name: Asipak
        profile: 4413
    -   name: hausl
        profile: 21246

inhalt:
    -   name: "Formularnotierung"
        anchor: formularnotierung
        simple: ""

    -   name: "Übertragung"
        anchor: bertragung
        simple: ""

    -   name: "Gemeinsamkeiten"
        anchor: gemeinsamkeiten
        simple: ""

    -   name: "Datentypen (nativer Ansatz)"
        anchor: datentypen-nativer-ansatz
        simple: ""

    -   name: "Datentypen (technischer Ansatz)"
        anchor: datentypen-technischer-ansatz
        simple: ""

    -   name: "Komplettbeispiel"
        anchor: komplettbeispiel
        simple: ""
        
entry-type: in-progress
---

### Formularnotierung

HTML besitzt Sprachelemente für Formularfelder, Buttons und das Form selbst. Nur Formularfelder innerhalb von `<form>` werden beim Absenden übertragen. Das Absenden erfolgt nur durch Bestätigung eines Submit- oder Image-Buttons oder durch ein `<button>`-Element. Das Übertragen des Formulars nach Enter in einem einzeiligen Eingabefeld ist browserspezifisch und damit nicht verlässlich. Zudem kann durch den Javascript-Aufruf `submit()` das zugehörige Formularobjekt übertragen werden (also ein Request gestartet werden).


### Übertragung

Die Übertragungsmethode von Formulardaten wird durch das *method*-Attribut des `<form>`-Tags bestimmt. Mögliche Methoden sind [POST- und GET-Request](http://php-de.github.io/request-handling/request.html), die Formulardaten werden dabei je nach Typ im Anfragekörper oder in der URL übertragen. 


### Gemeinsamkeiten

Alle Eingaben und Auswahlen treten im Folgescript (*action*-Angabe des Formulars) stets als Wert des Requestparameterarrays auf, je nach *method*-Attributangabe des Formulars unter `$_POST` oder `$_GET`. Der oder die Elementwerte sind dabei jeweils unter einem assoziativen Arrayschlüssel hinterlegt, der dem *name*-Attribut des jeweiligen Formularelements entspricht. Ist das *name*-Attribut eine Arraynotation in HTML: 

~~~
<input name="angaben[]" value="Angabe 1" />
<input name="angaben[]" value="Angabe 2" />

<input name="werte[abc][1]"    value="Wert 1" />
<input name="werte[abc][2000]" value="Wert 2000" />
~~~

So spiegelt sich diese Struktur im Requestparameterarray wieder:

~~~ php
array (
  'angaben' => array (
                 0 => "Angabe 1"
                 1 => "Angabe 2"
                 ) ,

  'werte' => array (
               'abc' => array (
                          1    => "Wert 1"
                          2000 => "Wert 2000"
                          )
               )
)
~~~

Wenn angegeben, werden konkrete Schlüssel benutzt, sonst erfolgt die Vergabe numerisch fortlaufend. Auch assoziative Schlüssel in HTML und mehrfache Arrayverschachtelungen sind dabei möglich.


### Datentypen (nativer Ansatz)

Grundlegend betrachtet, unterscheidet die Verabeitung von Formularelementen aktueller Browser nur zwei Typen:

##### Skalare Eingabetypen

- input type=text
- input type=hidden
- input type=password
- input type=radio
- textarea
- select (einfach, kein multiple)


Dazu gehören alle Textfelder, Einfach-Selections und Radiobuttons. Nur ein Wert ist auswählbar oder direkt eingebbar. Zur Verarbeitung ist jeweils der Attributwert von value aus dem Formularelemnent Als Requestparametereintrag verfügbar. (Ausnahme: Textareas besitzen kein *value*-Attribut sondern benutzen den Taginhalt des Elements.

Skalare Eingabefelder übermitteln in (ungefälschten) abgesendeten Formularen stets eine Stringtyp. Das gilt auch für numerische Angaben im HTML Bereich. Dieser Fakt ist durch das HTTP Protokoll bedingt und ist wichtig für die [Validierung](http://www.php.de/wiki-php/index.php/Validierung) von Eingabedaten.

#### Mehrdimensionale Eingabetypen

- input type=checkbox (Gruppe von Elementem)
- select multiple=multiple

Mehrdimensionale Eingabefelder werden in (ungefälschten) abgesendeten Formularen stets als Arraystruktur aus Stringtypen abgebildet. Auch hier können keine anderen Datentypen als Strings auftreten.

Zur Verabeitung einer Gruppe bietet sich stets `foreach()` an:

- Es werden alle Werte durchlaufen
- Die Menge der übertragenen Werte muß nicht bekannt sein
- Die Schlüssel müssen nicht fortlaufend sein (siehe oben, assoziative Schlüssel in HTML)

Zur Verarbeitung einzelner Werte sollte stets eine Verfügbarkeitsprüfung über `empty()` oder `isset()` erfolgen. 

<div class="alert alert-danger"><strong>Achtung! </strong>Häufig gemachter Fehler:
Checkboxgruppen und Multiselections ermöglichen die Abwahl aller Einträge/Auswahlen. Wird nicht mindestens ein Wert ausgewählt, wird das gesamte Formularelement aber nicht übertragen! Dies ist bei Zugriffen auf Werte und Arrayschlüssel unbedingt zu beachten.</div>


### Datentypen (technischer Ansatz)

Die bisherigen Betrachtungen sind nur halb wahr. Genau betrachtet, ergibt sich der Datentyp eines Elements ausschließlich aus den unter "Gemeinsamkeiten" genannten Fakten. Es ist also genauso möglich, mehrere Textfelder als assoziatives Array darzustellen

~~~
<input name="interessen[]" type="text" value="" />
<input name="interessen[]" type="text" value="" />
~~~

Checkboxes als skalaren Wert, also statt

~~~
<input name="lieblingsfarben[]" type="checkbox" value="rot"  /> rot
<input name="lieblingsfarben[]" type="checkbox" value="grün" /> grün
<input name="lieblingsfarben[]" type="checkbox" value="gelb" /> gelb

<input name="lieblingsfarben_rot"  type="checkbox" value="1" /> rot
<input name="lieblingsfarben_grün" type="checkbox" value="1" /> grün
<input name="lieblingsfarben_gelb" type="checkbox" value="1" /> gelb
~~~

usw. Im Beispiel ist das Vorgehen augenscheinlich unsinnig, da eine nachfolgende Verabeitung keinem Vorteil gegenübersteht. In anderen Fällen kann dieser Ansatz aber sinnvoll sein:

~~~
<input name="agb"  type="checkbox" value="1" /> Ja, ich habe die AGB gelesen
~~~

Schließlich kann sogar eine Multiselection skalar übertragen werden

~~~
<select name="auswahl"  multiple="multiple">
  <option>Wert 1<option>
  <option>Wert 2<option>
  <option>Wert 3option>
  <option>Wert 4<option>
</select>
~~~

Dabei werden konsequent alle ausgewählten Werte den vorhergehenden überschreiben. Was übrig bleibt ist ein String mit dem letzten der ausgewählten Werte. Nicht sinnvoll, aber möglich (Anmerkung: Über die Request-URL kann man diese Daten auch auswerten, nur die Superglobalen Arrays sind hier nicht nutzbar).

### Komplettbeispiel

Für die Themen Formularverarbeitung und Affenformular wurde ein Beispiel verfasst, das die meisten Eingabeelemente und deren Verarbeitung abdeckt.
Komplettbeispiel, [einfache Verarbeitung](http://www.php.de/wiki-php/index.php/Formularverarbeitung%2C_Komplettbeispiel) und Lösung als [Affenformular](http://www.php.de/wiki-php/index.php/Formularverarbeitung%2C_Komplettbeispiel).
