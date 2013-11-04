---
layout: guide
permalink: /jumpto/parameteruebergabe/
title: "Parameterübergabe"
group: "Allgemein"
creator: Manko10
author:
    -   name: Manko10
        profile: 1139

    -   name: nikosch
        profile: 2314

    -   name: mermshaus
        profile: 15041

    -   name: hausl
        profile: 21246
        
    -   name: Trainmaster
        profile: 20243

inhalt:
    -   name: "Festlegung der Parameter"
        anchor: festlegung-der-parameter
        simple: ""

    -   name: "Art der Übergabe"
        anchor: art-der-bergabe
        simple: ""
---

<div class="alert alert-info"><strong>Information:</strong><br>
Dieser Artikel behandelt nicht die Parameterübergabe an ein PHP-Script. Diese Informationen sind in den Artikeln <a href="http://php-de.github.io/request-handling/request.html">Request</a> und <a href="http://php-de.github.io/request-handling/gpc.html">GPC</a> zu finden.</div>


Die **Parameterübergabe** bezeichnet die Übergabe von Werten an eine Funktion oder Methode, welche die weitere Verarbeitung dieser Daten übernimmt. In aller Regel wird eine feste Anzahl von Parametern übergeben, die bei der Funktionsdeklaration bestimmt wird. Diese festgelegte Parameteranzahl nennt man *Funktions-* bzw. *Methodensignatur*. In vielen Hochsprachen stellen die Datentypen der einzelnen Parameter einen Teil der Signatur dar. Weil jedoch PHP eine schwach getypte Sprache ist, ist die Festlegung der Datentypen nur beschränkt möglich. 


### Festlegung der Parameter
 
Die Signatur wird bei der Funktionsdeklaration innerhalb der Klammern angegeben. Die verwendeten Variablennamen sind irrelevant, sollten allerdings die Art des zu übergebenden Wertes erklären. 

~~~ php
function func($param1, $param2)
{
}
~~~


Dies deklariert eine Funktion, die zwei Parameter fordert. Übergeben werden diese Parameter beim Aufruf der Funktion: 

~~~ php
func('Wert1', 'Wert2');
~~~

#### Optionale Parameter
 
Es ist auch möglich, optionale Parameter festzulegen, indem in der Signatur gleich ein Wert zugewiesen wird. Dieser Standardwert wird benutzt, wenn der entsprechende Parameter beim Funktionsaufruf nicht definiert wird. 

~~~ php
function func($param1, $param2 = 'Standardwert2')
{
    echo $param1 . ' - ' . $param2;
}

func('Wert1', 'Wert2');
func('Wert1');
~~~

Ausgabe:

~~~
Wert1 - Wert2
Wert1 - Standardwert2
~~~

Beim zweiten Funktionsaufruf wird der zweite Parameter nicht übergeben, stattdessen wird der Standardwert benutzt. 


<div class="alert alert-danger"><strong>Achtung!</strong> Häufig gemachter Fehler:<br>
Nach einem optionalen Parameter sollten nur noch weitere optionale Parameter folgen. Denn PHP bietet keine Möglichkeit, optionale Parameter zu überspringen.</div> 

~~~ php
function func($param1, $param2 = 'xyz', $param3)
{
    echo $param1 . ' - ' . $param2 . ' - ' . $param3;
}

// Keine Möglichkeit, den Standardwert des zweiten Parameter zu benutzen
// Es müssen drei Argumente übergeben werden
func('Wert1', 'Wert2', 'Wert3');
~~~

Ausgabe:

~~~
Wert1 - Wert2 - Wert3
~~~


#### Variable Parameter
 
Es ist in PHP auch möglich, auf die explizite Festlegung der Signatur zu verzichten und die Parameterübergabe dynamisch zu gestalten. Dies kann in manchen Fällen ganz praktisch sein (vgl. `array()`), sollte aber aus Gründen der Übersichtlichkeit eher sparsam eingesetzt werden. 

Um dennoch auf die Parameter zugreifen zu können, bietet PHP die Funktion `func_get_args()`. 

~~~ php
// Keine explizit angegebenen Parameter
function func()
{
    // Ggf. übergebene Parameter ausgeben
    echo '<pre>' . print_r(func_get_args(), true) . '</pre>';
}
~~~

#### Type Hinting
 
Type Hinting bezeichnet die Festlegung des Datentyps in der Signatur, indem der Datentyp vor dem Parameternamen notiert wird. Übergebene Parameter müssen diesem Datentyp entsprechen, ansonsten wird eine Fehlermeldung von Typ *Catchable fatal error* geworfen. Type Hinting ist **nicht** mit skalaren (primitiven) Datentypen möglich! 

~~~ php
// Der Parameter muss ein Array sein
func1(array $array)
{
}

// Der Parameter muss vom Typ MyInterface sein
func2(MyInterface)
{
}
~~~

Wird ein Klassenname angegeben, so muss der Parameter eine Instanz dieser Klasse oder einer ihrer Kindklassen sein. Handelt es sich um eine Schnittstelle, muss der übergebene Parameter diese implementieren. 


### Art der Übergabe
 
Die Parameter lassen sich auf zwei Arten übergeben. Zum einen durch *Call by Value*, welches einer normalen Übergabe entspricht und zum anderen durch *Call by Reference*. 

Bei der *Call by Value*-Übergabe wird eine Kopie des Wertes im lokalen [Namensraum](http://php-de.github.io/general/geltungsbereich-namensraum.html) der Funktion bekannt gemacht. Dieser ist gekapselt und hat keine Verbindung mehr zur Ursprungsvariablen. Änderungen am Parameterwert wirken sich also nicht auf Variablen des globalen Namensraumes aus. Die Parameterübergaben aus den Beispielen zuvor sind allesamt *Call by Value*-Übergaben. 

*Call by Reference*-Übergaben liefern keine Kopie des Wertes, sondern eine [Referenz](http://php-de.github.io/general/referenz.html) auf die übergebene Variable. Änderungen am Parameter wirken sich also direkt auf die übergebene Variable des aufrufenden Namensraumes aus. Um einen Parameter als Referenz zu deklarieren, wird der Referenz-Operator `&` benutzt. 

~~~ php
function func(&$param)
{
    $param = 6;
}

$var = 5;
echo $var . '<br>';
func($var);
echo $var;
~~~

Die Ausgabe:

~~~
5
6
~~~

Aus diesem Verhalten ergibt sich auch, dass weder Funktionsrückgabewerte noch Literalwerte übergeben werden können: 

~~~ php
function func(&$param)
{
    $param = 6;
}

// fehlerhafte Übergaben:
func(123);
func('abc')
func(foobar());
~~~ 


#### Copy on write
 
Ein beliebtes Missverständnis besteht darin, Funktionsparameter auch dann als Referenz zu übergeben, wenn die Werte während des Durchlaufs der Funktion nicht verändert werden. Der Gedanke dahinter ist, PHP auf diese Weise besonders bei umfangreichem Variableninhalt den vermeintlich aufwendigen Kopiervorgang des Inhalts in den Geltungsbereich der Funktion zu ersparen. Tatsächlich nimmt PHP diese Optimierung jedoch selbstständig vor und erstellt nach dem *Copy on write*-Prinzip nur dann eine Kopie des Variableninhalts, wenn dieser innerhalb des Funktionscodes verändert wird. 


#### Übergabe von Objekten
 
Die Übergabe von Objekten an Funktionen folgt ebenfalls den Prinzipien *Call by Value* und *Call by Reference*. Dies lässt sich an einem Beispiel verdeutlichen: 

~~~ php
// Call by Value
function a($obj)
{
    $obj = null;
}
 
// Call by Reference
function b(&$obj)
{
    $obj = null;
}
 
$x = new stdClass();
 
var_dump($x);
a($x);
var_dump($x);
b($x);
var_dump($x);
~~~

Ausgabe: 

~~~ php
object(stdClass)#1 (0) {
}
object(stdClass)#1 (0) {
}
NULL
~~~

Nach dem Aufruf von Funktion `a` ändert sich nichts am Inhalt der Variablen `$x`. Erst nach dem Aufruf von `b` wird sie im globalen Geltungsbereich mit dem Wert `null` überschrieben. 

Eine Objektvariable in PHP enthält als Wert nicht etwa eine Referenz, sondern einen *object identifier* (entspricht einer eindeutigen ID-Nummer), über den der Speicherbereich der tatsächlichen Instanzdaten bestimmt werden kann. Dieser *object identifier* verhält sich bei Übergabe *by Value* oder *by Reference* genau wie ein normaler Skalarwert. Die Übergabe eines Objekts an eine Funktion ist also üblicherweise die Übergabe *by Value* des *jeweiligen object identifiers*. 