---
layout: guide
permalink: /jumpto/geltungsbereich-namensraum/
title: "Geltungsbereich (Scope) und Namensraum (Namespace)"
group: "Allgemein"
creator: Manko10
author:
    -   name: Manko10
        profile: 1139

    -   name: nikosch
        profile: 2314

    -   name: hausl
        profile: 21246

    -   name: mermshaus
        profile: 15041

inhalt:
    -   name: "Globaler Geltungsbereich"
        anchor: der-globale-geltungsbereich
        simple: ""

    -   name: "Lokaler Geltungsbereich"
        anchor: der-lokale-geltungsbereich
        simple: ""

    -   name: "Schlüsselwort static"
        anchor: das-schlsselwort-static
        simple: ""

    -   name: "Schlüsselwort global"
        anchor: das-schlsselwort-global
        simple: ""

    -   name: "Superglobals"
        anchor: superglobals
        simple: ""

    -   name: "Bezeichnerklassen"
        anchor: bezeichnerklassen
        simple: ""

    -   name: "Geltungsbereich-Strukturen"
        anchor: geltungsbereich-strukturen
        simple: ""

entry-type: in-discussion
---


Als **Geltungsbereich** oder Sichtbarkeitsbereich (*scope*, engl. für Geltungsbereich, Wirkungsfeld) wird der Kontext bezeichnet, in dem eine Variable oder Funktion sichtbar ist.

Die meisten Hochsprachen bieten die Möglichkeit, mehrere Namensräume zu definieren. Damit wird es möglich, mehrere Variablen gleichen Namens zu deklarieren, die nebeneinander existieren können, da sie sich in unterschiedlichen Namensräumen befinden. Der Sichtbarkeitsraum ist also eine praktische Sache, um Daten zu kapseln, bietet aber auch Tücken, wenn man nicht beachtet, wo eine Variable definiert wurde.


### Der globale Geltungsbereich

Standardmäßig werden Variablen im globalen Geltungsbereich definiert. "Global" ist der Geltungsbereich, in dem das Skript läuft.

~~~ php
// Variablendefinition im globalen Geltungsbereich
$var = 5;
echo $var;
~~~

Das Ergebnis:

~~~ php
5
~~~

Diese Variable ist nun im folgenden Skriptverlauf sicht- und nutzbar, solange man sich im selben Geltungsbereich befindet.


### Der lokale Geltungsbereich

Definiert man nun einen lokalen Geltungsbereich, so hat das zur Folge, dass die darin enthaltenen Variablen von außen nicht sichtbar sind. Ebenso gilt das Umgekehrte: Variablen aus dem globalen Geltungsbereich sind (im Regelfall) im lokalen Geltungsbereich nicht sichtbar.

Einen lokalen Geltungsbereich kann man durch eine Funktion definieren. Innerhalb dieser Funktion gilt eine andere Sichtbarkeit als außerhalb.

~~~ php
function func()
{
    $var = 4;
    echo $var . '<br />';
}

$var = 5;
echo $var . '<br />';
func();
echo $var . '<br />';
~~~

Das Ergebnis:

~~~ php
5
4
5
~~~

Obwohl der Variablen `$var` innerhalb der Funktion der Wert `4` zugewiesen wurde, wurde der Wert außerhalb der Funktion nicht verändert. Das liegt daran, dass es sich nicht um dieselbe Variable handelt. Stattdessen existieren hier zwei gleichnamige Variablen zur selben Zeit. Da sie sich aber in zwei verschiedenen Namensräumen befinden, haben sie keinen Einfluss aufeinander.

Noch deutlicher wird es bei folgendem Beispiel:

~~~ php
function func()
{
    echo $var;
}

$var = 5;
func();
~~~

Innerhalb des lokalen Geltungsbereiches existiert die Variable `$var` nicht, weshalb eine Notice ausgegeben wird:

~~~
Notice: Undefined variable: var in /var/www/xyz/abc.php on line x
~~~


### Das Schlüsselwort static

Eine Variable geht verloren, wenn der Geltungsbereich geschlossen wird. Wenn also die Abarbeitung einer Funktion beendet wird und die Ausführung zum Funktionsaufruf zurückkehrt, wird auch die Variable gelöscht. Ein Beispiel demonstriert dieses:

~~~ php
function func()
{
    if (!isset($var)) {
        $var = 5;
    }
    $var++;
    echo $var . '<br />';
}

func();
func();
~~~

Das Ergebnis:

~~~
6
6
~~~

 Möchte man diese Variable nun erhalten, kann das Schlüsselwort `static` verwendet werden:

~~~ php
function func()
{
    if (!isset($var)) {
        static $var = 5;
    }
    $var++;
    echo $var . '<br />';
}

func();
func();
~~~

Die auf `static` folgende Initialisierung wird genau einmal wirksam – beim Erstaufruf der Funktion.

Das Ergebnis diesmal:

~~~
6
7
~~~

`static` hat die Variable also erhalten, obwohl der Geltungsbereich selbst schon verlassen wurde. Beim erneuten Aufruf wurde die Zuweisung des Wertes 5 nicht erneut ausgeführt. Der Zugriff von außen ist dennoch nicht möglich, da der Geltungsbereich dieser Variablen weiterhin lokal ist:


~~~ php
function func()
{
    if (!isset($var)) {
        static $var = 5;
    }
    $var++;
    echo $var . '<br />';
}

func();
func();
// ergibt Fehlermeldung:
echo $var;
~~~

### Das Schlüsselwort global

Das Schlüsselwort `global` durchbricht den Geltungsbereich und macht eine Variable in einem anderen Geltungsbereich sichtbar. Mithilfe von `global` ist es möglich, im lokalen Geltungsbereich auf Variablen des globalen Geltungsbereiches zuzugreifen und umgekehrt kann aus dem globalen Geltungsbereich auf Variablen des lokalen Geltungsbereiches zugegriffen werden.

~~~ php
function func()
{
    global $var;
    echo $var;
}

$var = 5;
func();
~~~

Das Ergebnis:

~~~
5
~~~

Ebenso funktioniert dies andersherum:

~~~ php
function func()
{
    global $var;
    $var = 5;
}

func();
echo $var;
~~~

Das Ergebnis ist dasselbe:

~~~
5
~~~

<div class="alert alert-warning"><strong>Achtung: </strong>Durch die Verwendung von global wird das Prinzip des Geltungsbereiches außer Kraft gesetzt und es ist nicht mehr sicher, ob eine Variable bereits definiert wurde oder nicht. So kommt es leicht zu einer ungewollten Überschreibung von Variablen. Deshalb wird geraten, auf <code>global</code> zu verzichten. Wenn innerhalb einer Funktion auf eine Variable aus dem globalen Geltungsbereich zugegriffen werden muss, sollte lieber eine <a href="{{ site.url }}/jumpto/referenz/">Referenz</a> als Parameter übergeben werden.</div>


### Superglobals

Superglobals sind von PHP reservierte Variablen, die in jedem Geltungsbereich verfügbar sind. Superglobals beginnen immer mit einem Unterstrich _ im Namen. Zu ihnen gehören `$_SERVER`, `$_GET`, `$_POST`, `$_COOKIE`, `$_REQUEST`, `$_FILES`, `$_SESSION`, `$_ENV` und `$GLOBALS`.

`$GLOBALS` stellt die einzige Ausnahme in der Namenskonvention dar und wird ohne Unterstrich geschrieben. Dieses Array enthält alle globalen Variablen, auch die zuvor genannten Superglobals. `$GLOBALS` kann also als die Hauptvariable bezeichnet werden.
Ein Aufruf von

~~~ php
echo '<pre>' . print_r($GLOBALS, true) . '</pre>';
~~~

beweist dies.

`$GLOBALS` enthält übrigens auch die Variablen, die mit dem Schlüsselwort `global` deklariert wurden. Es gilt: alle Variablen, die in `$GLOBALS` gespeichert wurden, sind fortan im globalen Geltungsbereich verfügbar.
Das `global`-Beispiel von vorhin kann man also auch umschreiben:

~~~ php
function func()
{
    $GLOBALS['var'] = 5;
}

func();
echo $var;
~~~

Das Ergebnis, wie erwartet:

~~~
5
~~~

<div class="alert alert-warning"><strong>Achtung: </strong>Wenn kein triftiger Grund dafür existiert, so sollte auf den Gebrauch von <code>$GLOBALS</code> für die Variablendefinition natürlich ebenso verzichtet werden, wie auf das Schlüsselwort <code>global</code>. Stattdessen sollten die bereits vordefinierten Superglobals Verwendung finden.</div>


### Bezeichnerklassen

Streng genommen unterliegen alle Bezeichner der PHP-Syntax einer Namensraumregelung. So wird zwischen Funktionsnamen, Variablenbezeichnern, Klassenbezeichnern und Konstantennamen unterschieden. All diese Bezeichner benutzen in der PHP-Syntax unterschiedliche Namensräume, können also theoretisch in jedem Kontext mit dem selben Namen belegt werden.
Es obliegt dem Parser, den zuständigen Namensraum aufgrund der Syntax zu bestimmen. So wird bspw. ein Bezeichner mit folgenden Klammern stets als Funktion bzw. im Klassenkontext als Methode interpretiert werden.


### Geltungsbereich-Strukturen

In PHP gibt es zwei Strukturen (oder drei, je nach Betrachtungsweise), die jenseits der globalen Sichtbarkeit einen eigenen lokalen (Variablen-)Geltungsbereich abbilden. Die Funktionen wurden bereits genannt.
Einen zweiten Geltungsbereich bilden Klassenstrukturen, auf deren Eigenschaften aus anderen Geltungsbereichen nur über ihr zugehöriges Objekt zugegriffen werden kann. Das Objekt muss dazu im aufrufenden Variablenraum als Variable verfügbar sein.
Innerhalb eines Objektes sind weiterhin die Methoden zu nennen, die zur Auflösung von Zugriffen auf Objekteigenschaften das Schlüsselwort `$this` verwenden, was ebenfalls die Objektinstanz kennzeichnet.
