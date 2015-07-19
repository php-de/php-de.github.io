---
layout: guide

permalink: /jumpto/kontextwechsel/
root: ../..
title: "Kontextwechsel"
group: "Sicherheit"
orderId: 5

creator: nikosch
author:
    -   name: nikosch
        profile: 2314

    -   name: mermshaus
        profile: 15041

inhalt:
    -   name: "Beispiele"
        anchor: beispiele
        simple: ""

    -   name: "Relevanz"
        anchor: relevanz
        simple: ""

    -   name: "Lösung"
        anchor: loesung
        simple: ""

    -   name: "Referenzen"
        anchor: referenzen
        simple: ""

entry-type: in-progress
---

Als **Zeichenmaskierung** oder **Escaping** wird ein Verfahren bezeichnet, um in einem
sprachlichen Kontext ein Zeichen dastellen zu können, das Teil der verwendeten
Syntax ist und damit ohne spezielle Auszeichnung eine Doppeldeutigkeit erzeugen
könnte. Zeichenmaskierung erfolgt im Allgemeinen durch die Definition einer
speziellen Zeichensequenz (Kombination von Zeichen), die per Definition dann
als ein anderes Zeichen interpretiert wird.

Eine zweite Anwendung für Zeichensequenzen ist die Abbildung von fremden
Zeichen auf einen eingeschränkten Sprachraum.



### [Beispiele](#beispiele)
{: #beispiele}

#### [HTML](#html)
{: #html}

HTML benutzt wenige Sonderzeichen, wie `" < > &`, die immer maskiert werden
sollten. Ansonsten können Situationen entstehen, die für den Parser nicht
eindeutig sind.

Normale Definition einer Textbox in HTML:

~~~ html
<textarea name="Textangabe">
   Dies ist ein Testinhalt.
</textarea>
~~~

Definition einer Textbox in HTML mit problematischen Inhalt:

~~~ html
<textarea name="Textangabe">
  Textareas benutzen "</textarea>", um das Ende des Eingabefeldes zu notieren.
</textarea>
~~~

#### [PHP-Strings](#php-strings)
{: #php-strings}

Strings in PHP haben zwei relevante Ebenen. Auf der einen Seite werden Strings
syntaktisch mit Hochkommata notiert, weshalb dieses Zeichen nicht „unbehandelt“
im String selbst vorkommen kann. Ein PHP-Parser würde in diesem Fall an dieser
Stelle die Definition des Stringwertes abbrechen. Desweiteren kennen
PHP-Strings diverse Zeichensequenzen, die Zeilenumbrüche, Tabs oder ähnliche
spezielle Zeichensequenzen darstellen.

Zeichenkollisionen Wert und Stringbegrenzer:

~~~ php
$foo = 'It's a problem.';
$foo = "Ich sagte "Hallo" zu Ihnen.";
~~~

Zeichenmaskierung eines Tab-Zeichens:

~~~ php
$foo = "Vor und \t nach dem Tab.";
~~~

#### [SQL](#sql)
{: #sql}

Ebengesagtes gilt genauso für Angaben von SQL-Strings (CHAR-Typen). Zusätzlich
kann bei einer SQL-Query in PHP sowohl ein String-Escaping (für PHP), als auch
ein CHAR-Escaping für die Query selbst nötig sein. Das Problem tritt auch bei
regulären Ausdrücken und HTML auf, insofern diese als String in PHP definiert
werden.

Zeichenkollisionen Wert und Stringbegrenzer:

~~~ sql
INSERT INTO Foo (id , bar) VALUES (47 , 'It's a problem')
~~~

Zeichenkollisionen PHP-String und SQL-Stringbegrenzer:

~~~ php
$query = 'INSERT INTO Users (id , name) VALUES (23 , 'Horst')';
~~~

#### [Reguläre Ausdrücke](#regulaere-ausdruecke)
{: #regulaere-ausdruecke}

Reguläre Ausdrücke haben eine komplexe Syntax mit sehr vielen
Zeichen-„Operatoren“. Insofern diese Zeichen nicht als Operator
(Quantifizierer, Klammer, …) fungieren sollen, müssen alle Zeichen escaped
werden. Zusätzlich verwenden POSIX-basierte Ausdrücke (`preg_*`) ein äußeres
Begrenzerzeichen, für das Zeichenmaskierung ebenfalls nötig wird. Typische
problematische Zeichen sind: `+ . ( ) - | * $ ^ [ ] { }`, die je nach Position
im Ausdruck unmaskiert zu unerwarteten Ergebnissen führen können.



### [Relevanz](#relevanz)
{: #relevanz}

Zeichenmaskierung wird immer dann wichtig, wenn die Gefahr besteht, dass
Eingabewerte und syntaktischer Sprachraum in einem Kontext kollidieren. Viele
Bugs und Angriffsszenarien auf Software basieren auf dieser Problematik. Gerade
deshalb werden Maßnahmen wie das Verwenden von `mysql_real_escape_string` oft dem
Securitybereich zugeordnet, obgleich sie eigentlich eher dem allgemeinen
Syntaxbereich zuzurechnen sind. Sicherheitsrelevante Verbesserungen sind
eigentlich nur Abfall von Escaping-Prozeduren.

Oben wurden verschiedene Beispiele gezeigt, in denen die Problematik
offensichtlich ist. Da PHP eine dynamische Sprache ist, besteht die eigentlich
Problematik darin, dass Zeichen von Variableninhalten, die zu einer Query,
einem HTML-Fragment oder einem regulären Ausdruck kombiniert werden, erst dort
einen unerwarteten Effekt erzeugen. So könnten Variablenwerte bspw. durch
Usereingaben entstehen, die durchaus gültig und typisch sein können. Eine
Namensangabe Wie `O'Brian`, die sprachliche Verwendung von Auslassungszeichen
oder die Auszeichnung wörtlicher Rede, sind Anwendungsfälle, die, auch ohne ein
Angriffsszenario vorauszusetzen, unbehandelt zum Crash einer Applikation führen
können. Das Bewußtsein um Syntaxkollisionen ist also entscheidend für eine
Anwendung, die mit Usereingaben und dynamischen Ausdrücken hantiert.



### [Lösung](#loesung)
{: #loesung}

### [Referenzen](#referenzen)
{: #referenzen}

* [http://wiki.selfhtml.org/wiki/Artikel:Kontextwechsel](http://wiki.selfhtml.org/wiki/Artikel:Kontextwechsel)
