---
layout: guide
title: "Method-Chaining"
creator: Flor1an
group: "Objektorientierte Programmierung (OOP)"
author:
    -   name: Flor1an
        profile: 2991

    -   name: Manko10
        profile: 1139

    -   name: nikosch
        profile: 2314

    -   name: hausl
        profile: 21246

inhalt:
    -   name: "Anwendung"
        anchor: anwendung
        simple: "Datenbank, Formular-Validierung"

    -   name: "Schluss"
        anchor: schluss
        simple: "Schlussbemerkungen"

entry-type: in-progress

---

Unter **Method chaining** (engl. *chaining* = Verkettung) wird in der Welt der objektorientierten Programmierung (OOP) eine spezielle Syntax verstanden, die das Ausführen einer Reihe von Methoden eines Objektes beschreibt. Mit der Umstellung der Syntax geht eine Änderung des Rückgabeverhaltens der beteiligten Methoden einher. 

Method chaining funktioniert nur mit mit dem erweiterten Objektmodell von PHP5. 

<div class="alert alert-info"><strong>Hinweis: </strong>Für folgende Beispiele wird grundlegendes Verständnis von OOP vorrausgesetzt.</div>


### Anwendung

<div class="alert alert-warning"><strong>Achtung! </strong>Aus Gründen der Übersicht wurde auf Fehlerbehandlungen verzichtet, dies obliegt dem Nutzer.</div>

#### klassische Anwendung von Methoden
 
Hier ein Beispiel mit einer Klasse und Methoden, die im klassischen Sinne verwendet werden. 

~~~ php
class Person 
{
 
    private $__name;
    private $__age;
 
    public function setName($name)  
    {
        $this->__name = $name;
    }
 
    public function setAge($age)
    {
        $this->__age = $age;
    }
 
    public function displayPerson() 
    {
        return 'My Name is ' , $this->__name , '! And I am ' , $this->__age , ' years old!<br />';
    }

}
 
$person = new Person();
$person->setName('Flo');
$person->setAge(21);
echo $person->displayPerson();
~~~

~~~
My Name is Flo! And I am 21 years old!
~~~

Die Klasse Person wird als Objekt instanziert. Anschließend werden nacheinander Methoden über den -> Operator ausgerufen. 

#### Anwendung von Method chaining
 
Folgendes Beispiel produziert die selbe Ausgabe allerdings wird Method chaining angewendet. 

~~~ php
class Person_chaining
{
 
    private $__name;
    private $__age;
 
    public function setName($name) 
    {
        $this->__name = $name;
        return $this;
    }
 
    public function setAge($age) 
    {
        $this->__age = $age;
        return $this;
    }
 
    public function displayPerson() 
    {
        return 'My Name is ' . $this->__name . '! And I am ' . $this->__age . ' years old!<br />';
    }

}
 
$person = new Person_chaining();
echo $person->setName('Flo')->setAge(21)->displayPerson();
~~~

~~~
My Name is Flo! And I am 21 years old!
~~~

Es erfolgt genau die selbe Ausgabe wie bei dem ersten Beispiel. Der Unterschied ist dass hier die Methodenaufrufe einfach aneinander gehängt werden. Dies kann unter Umständen Schreibarbeit sparen und ein besseres Verständnis bieten. Dazu später noch ein paar Beispiele. 

Doch warum können wir diese Methoden hintereinander aufrufen? Ein Aufruf funktioniert nach diesem Schema: `$object->method();`. Es gibt ein Objekt und es wird eine Methode dieses Objektes aufgerufen. Der Rückgabewert wird durch return in der Methode definiert. Das kann z.B. ein String, ein Integer oder ein Array sein natürlich kann auch nichts (null) zurück gegeben werden. Man könnte sich vorstellen das bei folgendem Aufruf `$x = $number->getValue();` die Methode eine Zahl zurück gibt. Es wird also der Variable `$x` zum Beispiel 5 zugewiesen. 5 wäre also der Rückgabewert der von der Methode `getValue()` zurück gegeben wird. 

Bei Method chaining soll aber nach dem Methodenaufruf noch eine weitere Methode aufgerufen werden.Angenommen nach `getValue()` soll noch `setNewValue()` aufgerufen werden, also `$number->getValue()->setNewValue();`, würde also `$numer->getValue()` eine 5 ergeben und daraufhin noch `setNewValue()` aufgerufen werden. Hier die einzelnen Schritte die von PHP intern ausgeführt werden würden. 

~~~ php
$number->getValue()->setNewValue(); // aus $number->getValue() wird 5
5->setNewValue(); // jetzt wird noch setNewValue() aufgerufen
~~~

Dies kann natürlich nicht funktionieren da keine Methode auf einen Integer Wert aufgerufen werden kann. Die Methode soll natürlich wieder vom selben Objekt aufgerufen. Die Lösung ist also bei er ersten Methode das Objekt selber zurückzugeben. Denn dann kann wieder eine Methode auf dieses Objekt aufgerufen werden. 

~~~ php
public function setName($name) 
{
    $this->__name = $name;
    return $this; // hier wird das Objekt selbst zurückgegeben
}
~~~

Das ganze würde also wie folgt ablaufen, hier dargestellt die einzelnen Schritte die intern von PHP ausgeführt werden würden. 

~~~ php
$number->getValue()->setNewValue(); // $number ist wieder das Objekt und $number->getValue() gibt wieder das Objekt $number zurück
$number->setNewValue(); // da das Objekt selbst zurückgegeben wurde kann eine weitere Methode ganz normal aufgerufen werden.
~~~

Um Method chaining zu nutzen muss also **nur** das Objekt selbst in den Methoden, die aneinander gekettet werden sollen, zurückgegeben werden. Es muss also in diesen Methoden immer ein `return $this;` am Ende aufgerufen werden. Die Daten die in den Methoden gesetzt oder verändert werden müssen allerdings in dem Objekt gespeichert werden um sie dann bei dem letzten Methodenaufruf der Kette verarbeitet zu werden. In dem Beispiel oben wird also das Alter und der Name intern gespeichert und erst bei der letzten Methode ausgegeben. 

#### Anwendungsgebiete
 
Hier sind noch zwei Beispiele bei denen Method chaining verwendet werden kann. 

##### Datenbank
 
Möglich wäre eine Klasse zu erstellen die Datenbank Querys generiert. Dies hat den Vorteil dass man einfach von einem Datenbanksystem auf ein anderes wechseln kann. Es muss dann nur die Klasse die die Querys generiert bearbeitet werden, alle Datenbankabfragen im Quellcode, die über diese Klasse abgehandelt werden, können so bestehen bleiben und müssen nicht extra überarbeitet werden. 

~~~ php
$db->select()
    ->from('user')
    ->where('age > 10')
    ->order_by('username')
    ->limit(10)
    ->execute();
~~~

Die Methoden `from()`, `where()`, `order_by()` und `limit()` geben in diesem Fall das Objekt selbst (mit `return $this;`) zurück. Die Methode `execute()` fügt den Query zusammen und schickt ihn an die Datenbank und gibt das Resultat zurück. 

Auf die Klasse selber wird hier verzichtet da es eine recht komplexe Angelegenheit ist einen Query richtig zu generieren und alle Möglichkeiten einzubauen. 

##### Validierung
 
Um zum Beispiel Formulareingaben zu überprüf kann dafür eine Klasse geschrieben werden die sich nur um die Validierung kümmert. 

~~~ php
$valid = $validator->value($username)
    ->isRequired()
    ->setLength(6, 20)
    ->isValid();
 
// oder
$valid = $validator->value($birthday)
    ->isDate()
    ->isValid();
 
// oder
$valid = $validator->value($postleitzahl)
    ->isNumeric()
    ->numRange(10000, 99999)
    ->isValid();
 
// hier wird überprüft ob die entsprechende Eingabe erfolgreich validiert wurde
if ($valid) {
   // validiert
} else {
   // nicht validiert
}
~~~

Mit `value()` wird der zu überprüfende Wert übergeben, dann kann mit weiteren Methoden überprüft werden ob die Werte bestimmten Kriterien entsprechen und mit `isValid()` wird dann true oder false zurück gegeben je nachdem ob die Validierung erfolgreich oder fehlgeschlagen ist. Nützlich ist eine Validierung wenn es um komplexe Überprüfungen geht. Zum Beispiel wenn ein Username nicht doppelt vorkommen darf, dann könnte es die Methode `isUnique()` geben in der dann in der Datenbank abgefragt wird ob so ein Username schon existiert. 

Eine Klasse zur Validierung könnte so aussehen. 

~~~ php
class Validator
{
 
    private $__value, 
    private $__error = 0;
 
    public function value($value) 
    {
        $this->__value = $value;
        return $this;
    }
 
    public function isRequired() 
    {
        if (empty($this->__value)) {
            $this->__error++;
        }
        return $this;
    }
 
    public function setLength($min, $max = false) 
    {
        if ($min !== false AND strlen($this->__value) < $min) {
            $this->__error++;
        }
        if ($max !== false AND strlen($this->__value) > $max) {
            $this->__error++;
        }
        return $this;
    }
 
    public function isDate() 
    {
        $date = explode('.', $this->__value); // deutsches Datum Format (tt.mm.jjjj)
        if (!checkdate($date[1], $date[0], $date[2])) {
            $this->__error++;
        }
        return $this;
    }
 
    public function isNumeric()
    {
        if (!is_numeric($this->__value)) {
            $this->__error++;
        }
        return $this;
    }
 
    public function numRange($a, $b = false)
    {
        if ($a !== false AND $this->__value < $a) {
            $this->__error++;
        }
        if ($b !== false AND $this->__value > $b) {
            $this->__error++;
        }
        return $this;
    }
 
    public function isValid()
    {
        if ($this->__error == 0) {
            return true;
        }
        return false;
    }
 
}
~~~

### Schluss
 
Method chaining ist also eine interessant Art wie man mit Methoden umgehen kann. Bei sinnvoller Verwendung kann es so die Lesbarkeit erhöhen und den Aufwand für den Programmierer senken. 

Ein Beispiel bei dem Method chaining eingesetzt wird wäre das Zend Framework! 

