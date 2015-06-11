---
layout: guide

permalink: /jumpto/javascript/
root: ../..
title: "JavaScript"
group: "Allgemein"
orderId: 24

creator: Manko10

author:
    -   name: Manko10
        profile: 1139

    -   name: nikosch
        profile: 2314

    -   name: hausl
        profile: 21246

inhalt:
    -   name: "Sprachelemente und Systematik"
        anchor: sprachelemente
        simple: ""

    -   name: "Prototypen vs. Klassen"
        anchor: prototyp-vs-klassen
        simple: ""

    -   name: "Weiterführende Informationen"
        anchor: links
        simple: ""

---

**JavaScript** ist eine auf ECMAScript ([ECMA 262](http://www.ecma-international.org/publications/standards/Ecma-262.htm)) basierende Skriptsprache, die im Browser des Anwenders läuft. Es ist mit JavaScript also möglich, Operationen auf Client-Ebene durchzuführen. Meist handelt es sich dabei um Manipulationen des [Document Object Model]({{ page.root }}/jumpto/document-object-model/) (DOM, Objektbaum eines HTML- oder XML-Dokumentes), Benutzerinteraktion oder Browserabfragen.


### [Sprachelemente und Systematik](#sprachelemente)
{: #sprachelemente}

JavaScript zeichnet sich besonders durch seine vollständige Objektorientierung und Modularität sowie eine baumartige Objektstruktur aus, an dessen Wurzel das Objekt `window` steht. Alle weiteren Objekte sind diesem Hauptobjekt untergeordnet. Somit sind alle Variablen und Funktionen des globalen Namensraumes in Wirklichkeit nur Member des `window`-Objektes. Aus diesem Grund können in JavaScript die Begriffe *Variable* und *Eigenschaft* sowie *Methode* und *Funktion* synonym verwendet werden, da jede Variable eine Eigenschaft und jede Funktion eine Methode eines übergeordneten Objektes darstellt, das wiederum direkt oder indirekt ein Kind von `window` ist. Da `window` alle anderen Objekte in sich vereint, ist eine explizite Angabe nicht notwendig.

~~~ javascript
window.setTimeout('Foobar()', 123);
~~~

und

~~~ javascript
setTimeout('Foobar()', 123);
~~~

sind also äquivalent.

Dass in JavaScript alle globalen Variablen und Funktionen Member von `window` sind, lässt sich mit dem folgenden Skript leicht beweisen:

~~~ javascript
var x = 'Hallo Welt';

function sayHelloWorld() {
    alert(x);
    alert(window.x);
};

sayHelloWorld();
window.sayHelloWorld();
~~~


Es werden vier `alert`-Boxen mit demselben Text ausgegeben.

Die vollkommene Modularität der Sprache erlaubt es, jedes Objekt zur Laufzeit mit Eigenschaften und Methoden zu erweitern, indem eine simple Zuweisung stattfindet. Im Folgenden soll dies demonstriert werden:

~~~ javascript
// das Literal-Objekt, das erweitert werden soll
var myObject = {
    myProperty : 'Hallo Welt'
};

// hier wird das Objekt erweitert
myObject.myMethod = function()
{
    alert(this.myProperty);
};

// Benutzung der neu erzeugten Methode
myObject.myMethod();

// ebenso lassen sich bereits definierte Member überschreiben
myObject.myProperty = 'Hallo Wiki!';
myObject.myMethod();
~~~

Es zeigt sich auch, dass Methoden sich wie Eigenschaften verhalten, also der Wert einer Zuweisung sein können. Diese Notation der Zuweisung sogenannter *anonymer Funktionen* ist ein äußerst mächtiges Mittel und findet in vielen Bereichen Anwendung. Insbesondere für Callback-Übergaben werden anonyme Funktionen gern genutzt. Diese Art von Funktion wird auch „Lambda-Funktion“ oder „Funktion im Lambda-Stil“ genannt.


### [Prototypen vs. Klassen](#prototyp-vs-klassen)
{: #prototyp-vs-klassen}

JavaScript ist vollständig objektorientiert bzw. objektbasiert, jedoch sind im jetzigen Entwicklungsstand der Sprache keine Klassen vorgesehen (dennoch ist das Schlüsselwort `class` nach ECMAScript ein reservierter Bezeichner und kann deshalb nicht verwendet werden. Allerdings empfiehlt sich die Nutzung solcher Bezeichner ohnehin nicht).

In JavaScript existieren nur Objekte. Alternativ zum Klassenkonzept in der Objektorientierung arbeitet Javascript mit sogenannten Prototypen. Diese stellen eine Art Vorlage für ein Objekt dar. Da es sich bei Prototypen selbst um Objekte handelt, können diese jederzeit um bestimmte Eigenschaften und Methoden erweitert werden. Ebenso kann jedes beliebige Objekt als Prototyp für ein weiteres dienen. Der Prototyp kommt immer dann zum Tragen, wenn eine neue Instanz eines Objektes abgeleitet wird, hat aber keinen direkten Einfluss auf die aktuelle Instanz (dazu im weiteren Verlauf mehr).

Jede Methode/Funktion stellt intern ein Objekt dar, das einer Eigenschaft zugewiesen ist, die den Namen der Funktion trägt. Dies ist so zu verstehen, dass beim Erstellen einer Funktion `myFunction()` eine Eigenschaft mit diesem Namen im aktuellen Objektkontext angelegt wird, der als Wert die Funktion zugewiesen wird. Diese Funktion ist selbst jedoch ein Objekt und kann somit wieder Eigenschaften besitzen, welchen wiederum Objekte zugewiesen werden können.

Mit diesem Wissen können wir wieder zu den Prototypen zurückkehren. Jede Funktion (also jedes Objekt) besitzt per se ein eigenes prototypisches Objekt, oder auch kurz: einen Prototypen. Dieser „Bauplan“ des Objektes befindet sich in dessen Eigenschaft `prototype` und lässt sich über diese manipulieren. Wenn eine Funktion und somit ein Objekt erstellt werden, ist der Prototyp zunächst leer, jedoch kann er wie jedes andere Objekt entweder erweitert oder durch ein anderes Objekt ersetzt werden. Im Folgenden soll dies demonstriert werden:

~~~ javascript
function myObject() {
};
var myPrototype = {
    myProperty1 = 123;
};

// Prototypen ersetzen:
myObject.prototype = myPrototype;

// Prototypen ergänzen:
myObject.prototype.myProperty2 = 'abc';

// Neue Instanz des Objektes erstellen:
var myNewInstance = new myObject();

// nun können wir auf myProperty1 und myProperty2 zugreifen:
alert(myNewInstance.myProperty1 + ' - ' + myNewInstance.myProperty2);
~~~

Im obigen Beispiel wurde der (eingangs natürlich noch leere) Prototyp zunächst vollständig durch ein anderes Objekt ersetzt, welches dann um eine Eigenschaft ergänzt wurde. Nachdem eine zweite Instanz des Objektes erstellt wurde, standen diese beiden durch den Prototypen erstellten Eigenschaften zur Verfügung. Der Operator new mag hier vielleicht verwirren, da eingangs gesagt wurde, dass JavaScript keine Klassen kennt, doch stellt dies keinen Widerspruch dar. Das Objekt `myObject` agiert hier praktisch als „Pseudoklasse“. Sein Prototyp dient dabei als Vorlage, nach der ein neues Objekt zu erzeugt wird. Das Objekt selbst wird streng genommen aber nicht instantiiert. Es wird nur ein neues Objekt nach Vorlage des eben erstellten Prototypen abgeleitet. Die als Pseudoklasse dienende Funktion selbst stellt dabei den Konstruktor dar.

<div class="alert alert-danger">
<strong>Achtung!</strong> Häufig gemachter Fehler:<br>
JavaScript ist nicht Java! Diese beiden grundlegend verschiedenen Sprachen werden oft verwechselt. Bis auf den Namen und eine ähnliche Syntax haben sie aber nichts gemein.</div>

### [Weiterführende Informationen](#links)
{: #links}

* [http://aktuell.de.selfhtml.org/artikel/javascript/oomodell/](http://aktuell.de.selfhtml.org/artikel/javascript/oomodell/)
* [http://mckoss.com/jscript/object.htm](http://mckoss.com/jscript/object.htm)
* [http://developer.yahoo.com/yui/theater/](http://developer.yahoo.com/yui/theater/) (Videos von Douglas Crockford)
