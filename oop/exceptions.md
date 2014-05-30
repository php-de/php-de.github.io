---
layout: guide
permalink: /jumpto/exceptions/
title: "Exceptions - Tutorial"
creator: Zergling-new
group: "Objektorientierte Programmierung (OOP)"
author:
    -   name: Zergling-new
        profile: 2313

    -   name: hausl
        profile: 21246

inhalt:
    -   name: "Was sind Exceptions?"
        anchor: 
        simple: ""

    -   name: "Wie wirft und fängt man Exceptions?"
        anchor: 
        simple: ""

    -   name: "Wann bzw. wo wirft man Exceptions?"
        anchor: 
        simple: ""

    -   name: "Wann bzw. wo fängt man Exceptions?"
        anchor: 
        simple: ""

    -   name: "Wie unterscheidet man Exceptions?"
        anchor: 
        simple: ""

    -   name: "Wie fängt man mehrere Exceptions?"
        anchor: 
        simple: ""

    -   name: "Wie wirft man eine Exception weiter?"
        anchor: 
        simple: ""

entry-type: in-progress
---


Vorweg: Tut mir Leid für diesen Text-Overhead, er war plötzlich da! :-) 


### Was sind Exceptions?

*Exception* bedeutet übersetzt *Ausnahme* und stellt in der objekt-orientierten Programmierung eine elegante Möglichkeit dar, bei besonderen oder schweren Fehlern den aktuellen Programmkontext zu verlassen (!) um ihn mit einer Fehlerbehandlung fortzuführen.

Dhnlich wie 4return4 für das Abliefern eines Ergebnisses funktioniert, funktioniert das Werfen (throw) von Exceptions, also einem Fehler-Objekt, nur wird das Programm nun nicht zwingend in der übergeordneten, aufrufenden Umgebung landen, sondern dort, wo es erwartet und aufgefangen (catch) wird.


### Wie wirft und fängt man Exceptions?

Exception-Handling unterteilt sich in zwei Blvcke, logisch wie syntaktisch.
In try wird ein Algorithmus ausgeführt, der, schlägt er fehl, eine Exception werfen könnte.


~~~ php
<?php 
// ein kleiner dateibasierter Counter 
try { 
  $counter = file_get_contents("counter.txt"); 
  if (!is_numeric($counter)) { // kein gültiger Counter-Wert in der Datei? 
    throw new Exception("invalid counter value"); // dann Exception werfen 
  } 
  file_put_contents("counter.txt", $counter + 1); 
} 
?> 
~~~

Diese Exception können wir auffangen, wenn der Versuch (try) fehlgeschlagen ist:

~~~ php
<?php 
try { 
  $counter = file_get_contents("counter.txt"); 
  if (!is_numeric($counter)) { 
    throw new Exception("invalid counter value"); 
  } 
  file_put_contents("counter.txt", $counter + 1); 
  echo $counter + 1; 
} catch (Exception $e) { 
  echo $e->getMessage(); // die Klasse Exception stellt diese Methode zur Verfügung 
} 
?> 
~~~

Von 4throw new Exception("invalid counter value");4 aus springen wir direkt in den catch-Block und lassen uns die Fehlermeldung ausgeben!

Dabei spielt es keine Rolle, ob die Exception im try-Block direkt geworfen wurde oder nur von einer Funktion, die darin verwendet wurde.

Denkbar wdre also auch folgendes Konstrukt:

~~~ php
<?php 
function getCounterValue() 
{ 
  $counter = file_get_contents("counter.txt"); 
  if (!is_numeric($counter)) { 
    throw new Exception("invalid counter value"); 
  } 
  return $counter; 
} 
function setCounterValue($value) 
{ 
  file_put_contents("counter.txt", $value);   
} 

try { 
  $counter = getCounterValue() + 1; 
  setCounterValue($counter); 
  echo "Hello visitor number ", $counter; 
} catch (Exception $e) { 
  echo $e->getMessage(); // "invalid counter value" 
} 
?> 
~~~

Das Werfen der Exception wird also sogar ausserhalb des try-Blockes deklariert. Relevant ist jedoch, ob dieser Code im try-Block ausgeführt wird und das ist hier der Fall.




### Wann bzw. wo wirft man Exceptions?

Exceptions sind Ausnahmen und ich teile die Meinung aus "Der Pragmatische Programmierer", dass Exceptions die Ausnahme sein sollten.

Das gewdhlte Beispiel ist absichtlich ein schlechtes! Warum?

Es ist davon auszugehen, dass bei der ersten Verwendung des Skriptes die counter.txt nicht existiert und somit 4is_numeric($counter)4 fehlschlägt. Es ist also keine Ausnahme, sondern ein Zustand, der garantiert eintreten wird (wenn auch nur hoffentlich nur einmalig bei der Initiierung).

Richtigerweise sollte man die Datei auf Nicht-Existenz prüfen und dann mit einer 0 initiiert anlegen. Erst wenn dann der Lese- oder sogar Schreibvorgang fehlschlägt, kann man von einer echten Ausnahme reden und eine Exception werfen.

**Eine Faustregel**
Exceptions nur verwenden, wenn man behaupten könnte, dass dieser Fehler nie passieren sollte!

Eine ziemlich schwammige Aussage eigentlich, denn letztlich sollte eine Exception ja nie ausgelvst werden, die \bergdnge sind sowieso flie_end. Trotzdem gibt es einen Unterschied zwischen "sollte nie" und "kommt schonmal vor".


für unser Beispiel hie_e das also:

~~~ php
<?php 
try { 
  if (!file_exists("counter.txt")) { 
    $counter = 0; 
  } else { 
    $counter = file_get_contents("counter.txt"); 
  } 
  if (!is_numeric($counter)) { 
    throw new Exception("invalid counter value"); 
  } 
  $counter++; 
  file_put_contents("counter.txt", $counter); 
  echo "Hello visitor number ", $counter; 
} catch (Exception $e) { 
  echo $e->getMessage(); 
} 
?> 
~~~

Auch dieses Beispiel ist natürlich ungeschickt gewdhlt, da sich die Fehlerbehandlung zufdllig sogar direkt unter dem auslvsenden Fehler befindet. \blicherweise ist das nicht der Fall. Dazu kommen wir im kommenden Kapitel:


### Wann bzw. wo fängt man Exceptions?

Exceptions fängt man dort, wo man das Problem am besten lvsen kann. Das hei_t in dem Block, an dem man mit ausreichender Sicherheit sagen kann, die Ausnahme und ihre Tragweite verstanden zu haben.

Gehen wir von einer einfachen Variante aus:
Eine zentrale index.php (eine sogenannte Bootstrap-Datei) bekommt die Parameter 4module=gallery&show=silvester06074 übergeben. Das Modul "gallery" soll also die Bilder von "silvester0607" laden und anzeigen.
Nun wird versucht ein Bild zu laden, dessen Thumbnail nicht mehr existiert. Zum Beispiel weil man gebeten wurde das Bild zu entfernen, auf die schnelle aber nur per FTP verbunden hat und dort auch zu allem Unglück nur den Thumbnail gelvscht hat, und nicht das vergrv_erte Bild.

Das Fehlen von Dateien in einem Projekt, dass eigene Mechanismen zur Administration bietet, ist eine solche Exception. "Das sollte eigentlich nie passieren".

Nun stellt sich die Frage, wer fängt die Exception auf?
Tut es keiner, wird uns diese Arbeit die PHP-Engine abnehmen und einen Catchable Runtime Error liefern. Catchable!
Wir sollten das selber tun. Mehrere Kandidaten stehen zur Auswahl (in einem komplexeren System ungleich mehr):

* die Bootstrap-Datei
* das Gallery-Modul
* die Image-Klasse (die das Bild laden soll)
* das Ausgabe-Template?


Ist die Ausnahme so schwerwiegend, dass die Bootstrap-Datei über den Fehler informiert werden muss? Muss das Ausgabe-Template beldstigt werden oder kann die Image-Klasse die Tragweite ihrer Handlung verstehen? Nein!

Das Gallery-Modul wird wohl am Besten wissen, was zu tun ist, zumal ihr der meiste Handlungsspielraum gegeben ist.
Sie kann den Fehler (das fehlende Bild)

* überspringen
* ihn ignorieren (Dead image link)
* sie kann ein Standard-Bild laden
* den Benutzer darüber informieren
* oder sogar eine Kombination mehrerer


Wir müssen also darauf achten, Exceptions an der perfekten Stelle abzufangen, dort wo wir die Weitsicht besitzen, ihn angemessen zu verarbeiten.

Denn spielen wir das Szenario mal für den Fall durch, dass erst unsere Bootstrap-Datei den Fehler fängt:

**Szenario 1**
Die Bootstrap wird vermutlich nurnoch dazu in der Lage sein eine Fehlermeldung zu schreiben und abzubrechen. Erinnern wir uns: Exceptions verlassen ihren Programmkontext bis zum ndchsten catch! Wenn wir die Exception nicht früh genug abfangen wird der dahinterliegende Code überhaupt nicht mehr ausgeführt. Wir sind (ohne den Prozess neu anzustossen) garnicht mehr in der Lage die restlichen Bilder auszugeben!

**Szenario 2**
Unsere Image-Klasse zum Laden der Grafik und Berechnen der Grv_e fängt ihren eigenen Fehler sofort auf:

Es könnte nur mit 2 Aktionen auf den Fehler reagieren:

* Bild nicht anzeigen
* Standardbild laden


Was aber, wenn wir dem Betrachter mit einer Nachricht mitteilen mvchten, dass ein Bild nicht gefunden wurde, an einer Stelle, an der die Image-Klasse keinen Einflu_ auf die Anzeige hat?


Das Gallery-Modul scheint also der richtige Ort zum Fangen dieser Exception zu sein!




### Wie unterscheidet man Exceptions?

Es gibt viele verschiedene Variationen von Exceptions. Jede sollte *in ihrem direkten Kontext* schwer und von besonderer Bedeutung sein! Das hei_t aber wie wir gesehen haben nicht unbedingt, dass sie in ihrer Gesamtheit betrachtet schwer sein muss.

Technisch lassen sich Exceptions über ihre Klasse oder ihren Exception-Code unterteilen.

Die Klasse "Exception" ist eine PHP interne Klasse. Von ihr kann abgeleitet werden (Stichwort Vererbung sollte für den Leser zumindest ein Begriff sein):

~~~ php
<?php 
class My_Exception extends Exception 
{ 
} 
?> 
~~~

Dies ist eine vvllig akzeptable, lauffdhige Klasse (besser gesagt Exception). Auch von ihr könnte nun abgeleitet werden:

~~~ php
<?php 
class My_Stupid_Exception extends My_Exception 
{ 
} 
class My_Beloved_Exception extends My_Exception 
{ 
} 
?> 
~~~

Diese Unterteilung ist sehr sinnvoll und erzeugt nur einen ldcherlich geringen Overhead (der durch den Einsatz von 4__autoload4 sowieso in aberwitzige Dimensionen schrumpft).

Denkbar wdren nun also

* eine Bootstrap_Exception (Modul Gallery wird nicht gefunden, ..)
* eine Gallery_Exception (keine Leserechte für den Bilderordner, aber eher nicht für den Fehlerfall, dass die angefragte Gallery silvester0607 nicht existiert, Verlinkungs- oder Copy&paste-Fehler treten stdndig auf)
* eine Image_Exception (siehe Beispiel)


Weiterhin ist es möglich, zusdtzlich zur Message als 1. Parameter des Konstruktors, einen Fehlercode als 2. Parameter anzugeben. Dieser ist jedoch optional (Standard = 0):

~~~ php
<?php 
throw new Image_Exception("Thumbnail ist plötzlich weg", 1); 
?> 
~~~

Schlie_lich könnte die Image-Klasse ja noch mehr Fehler werfen, zum Beispiel diesen:

~~~ php
<?php 
throw new Image_Exception("Hauptbild ist plötzlich weg", 2); 
?> 
~~~

Es wdre nun möglich, die Fehler getrennt zu behandeln:

~~~ php
<?php 
try { 
  $image = new Image($pfad_der_aus_der_datenbank_kommt); 
  $image->showThumbnail(); 
} catch (Image_Exception $e) { 
  if ($e->getCode() == 1) { 
     // thumbnail ist offenbar weg, nicht so tragisch, nehmen wir 
     // das gro_e, html schrumpelt das schon kleiner 
     // (natürlich bad-style, aber einfache beispiele erfordern das nunmal) 
     $image->setThumbnail($image->getBigImage()); 
     $image->showThumbnail(); 
  } 
  if ($e->getCode() == 2) { 
    // ok das gro_e Bild ist weg, was nun? am besten kein  
    // kleistern, einfach nur "oben" bescheid geben 
    $this->addMessage($e->getMessage()); // addMessage sei eine Methode des Gallery-Objektes, in dessen Kontext dieses Beispiel zu sehen ist 
  } 
} 
?> 
~~~

"oben" sei in diesem Fall im Kontext des Gallery-Moduls zu sehen. Wir müssen uns vorstellen, dass dieser try-catch Block irgendwo im Bauch der Gallery-Klasse ablduft.

Etwas ist dem aufmerksamen Leser vielleicht aufgefallen:
Statt 4catch (Exception $e)4 wird plötzlich 4catch (Image_Exception $e)4 verwendet! Diese Notation, die übrigens seit PHP 5 auch für alle normalen Funktions und Methodendeklarationen erlaubt ist, schrdnkt den übergebenen Parameter auf ein Objekt der deklarierten Klasse (oder einer ihrer Ableitungen) ein.

Demnach fängt 4catch (Exception $e)4 alle in seinem try-Block gefangenen Exceptions ab, wdhrend 4catch (Image_Exception $e)4 nur mit 4throw new Image_Exception()4 erzeugte Exceptions abfängt (oder eben solche Exceptions, die von Image_Exception geerbt haben). Schlie_lich könnte die Image-Klasse ja auch einen kontextübergreifend-schweren Fehler werfen, von der sogar die Image-Klasse wei_, dass die Gallery hier nichts mehr retten kann/soll/darf. Zum Beispiel, wenn die Image-Klasse keine Grafik übergeben bekommt, sondern eine EXE-Datei (warum auch immer).

Natürlich darf die Image-Klasse keine *Ueberspring_die_Gallery_Exception* werfen, die Image-Klasse sollte soetwas nicht wissen müssen. Aber sie sollte die Möglichkeit haben auch derbere Ausnahmen auszulvsen. Eine (nennen wir sie) *System_Exception* zum Beispiel.

Zur Verdeutlichung:

~~~ php
<?php 
try { 
  throw new Exception("mieser Fehler"); 
} catch (Image_Exception $e) { 
  echo $e->getMessage(); 
} 
?> 
~~~

Der catch-Block wird nie zur Ausführung kommen.


### Wie fängt man mehrere Exceptions?

Ein Gallery-Modul muss ihre Aufgaben nicht nur an Image-Klassen weiterdelegieren. Der Einsatz vielerlei Klassen ist denkbar, sie müssten nicht einmal direkt etwas mit Bildern zu tun haben .. eine File-Klasse zum Zugriff auf Bilder wdre denkbar oder der Einsatz eines Log-Tools.

All diese Klassen können Ausnahmen erzeugen und viele von ihnen sollte vermutlich die Gallery abfangen, da es wohl niemanden au_erhalb der Gallery interessiert, ob ein Bild nicht gefunden wurde oder eine Log-Datei nicht richtig funktioniert. Schon garnicht den Anwender.

Darum ist es möglich an einen try-Block mehrere catch-Blvcke anzuhdngen, denen nacheinander versucht wird, die Exception zu übergeben. Hinweis: Der erste Treffer zdhlt, egal ob Ableitung oder direkt:


~~~ php
<?php 
class My_Exception extends Exception 
{ 
} 
class My_Stupid_Exception extends My_Exception 
{ 
} 
class My_Never_Used_Exception extends Exception 
{ 
} 

try { 
    throw new My_Stupid_Exception("ach wie blvd"); 
} catch (My_Never_Used_Exception $e) { 
    echo "My_Never_Used_Exception-Block: ", $e->getMessage(); 
} catch (My_Exception $e) { 
    echo "My_Exception-Block: ", $e->getMessage(); 
} catch (My_Stupid_Exception $e) { 
    echo "My_Stupid_Exception-Block: ", $e->getMessage(); 
} catch (Exception $e) { 
    echo "Exception-Block: ", $e->getMessage(); 
} 
?> 
~~~

Beachtet werden sollte, dass man nicht in den 4catch (My_Stupid_Exception $e)4 gelangt, obwohl eine Exception diesen Typs geworfen wurde, sondern 4catch (My_Exception $e)4, denn 4My_Stupid_Exception4 ist nach Deklaration ein Kind von 4My_Stupid_Exception4.

**Der erste Treffer zdhlt.**


### Wie wirft man eine Exception weiter?

Wenn der catch-Block (z.B. anhand des Exception-Codes) feststellt, dass das Problem doch lieber von einer hvheren Instanz gelvst werden sollte oder gar durch seine Problemlvsungsversuche selbst eine neue Exception auslvst, wird dies ganz "normal" gehandhabt, der ndchsthvhere try-catch-Block fängt die Exception auf

Testen wir das ganze mit einer Fu_baller-Weisheit, in dem unser innerer catch-Block die Exception einfach weiterschmei_t:

~~~ php
<?php 
class My_Exception extends Exception 
{ 
} 
class My_Stupid_Exception extends My_Exception 
{ 
} 


try { 
    try { 
        throw new My_Stupid_Exception("ach wie blvd"); 
    } catch (My_Exception $e) { 
        echo ".. nimm du ihn, ich hab ihn sicher .. "; 
        throw $e; 
    } 
} catch (My_Stupid_Exception $e) { 
    echo "ich nehm ihn wohl besser"; 
} 
?> 
~~~

Die Ausgabe lautet, wie erwartet:

~~~
.. nimm du ihn, ich hab ihn sicher .. ich nehm ihn wohl besser
~~~

Hoffentlich konntet ihr einen kleinen Einblick in Exceptions bekommen und gebt eure Fehler nun nicht mehr nur durch return FALSE und Konsorten zurück, sondern lasst das die Exceptios erledigen. Dafür sind sie da.

Danke für eure Aufmerksamkeit! 
