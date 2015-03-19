---
layout:    guide

permalink: /jumpto/string-vergleiche/
root:      ../..
title:     "String-Vergleiche - Fallstricke bei der typschwachen Variante"
group:     "Code-Optimierung"
orderId:   8

creator: hausl

author:
    -   name: hausl
        profile: 21246


inhalt:
    -   name: "Beispiele typschwacher Stringvergleiche"
        anchor: beispiel-typschwach
        simple: ""

    -   name: "Beispiel switch"
        anchor: beispiel-switch
        simple: ""

    -   name: "Beispiel usort"
        anchor: beispiel-usort
        simple: ""

    -   name: "Fazit"
        anchor: fazit
        simple: ""

    -   name: "Quelle"
        anchor: quelle
        simple: ""

entry-type: in-progress

---

Häufig ist zu sehen, dass für Stringvergleiche, statt z.B. die in PHP eingebaute Funktion `strcmp()`, der typschwache Vergleichsoperator `==` verwendet wird.

~~~php
if ($product == "Milch") {
    // ...
}
~~~

Dies klappt auch in den meisten Fällen, aber leider nicht immer. <br>
<br>
Weniger bekannt ist: PHP prüft den vor den einfachen (typschwachen) Vergleich beide Stringinhalte, ob diese einen numerischen Inhalt haben. Sind beide Stringinhalte numerisch, wird auch ein numerischer Vergleich durchgeführt. So auch wenn eine Seite ein numerischer Datentyp ist, was allgemein bekannt ist.


### Beispiele typschwacher Stringvergleiche
{: #beispiel-typschwach}

~~~php
$str = '01200';
var_dump( $str == '0001200' ); // true
var_dump( $str == '12e2' ); // true
var_dump( $str == '0x4b0' ); // true
var_dump( $str == ("\r\n\t ".'1200') ); // true
var_dump( $str == '1200.0000000000000000028' ); // true (32Bit System)
~~~

Wie die Beispiele zeigen, werden auch Hexadezimalausdrücke als numerisch angesehen und führende Steuerzeichen werden auch großzügig ignoriert. Eine führende 0 führt dagegen nicht zu einer Interpretation als Oktalzahl.

Diese Stolperfallen lauern versteckt auch in anderen Konstrukten, wie z.B. `switch` oder `usort`.<br>
Dazu die folgenden Beispiele.


### Beispiel switch
{: #beispiel-switch}

~~~php
$selector = '07';

switch ($selector) {

  case '7e0':
      echo 'Fall 1';
      break;

  case '07':
      echo 'Fall 2';
      break;
}

// Fall 1
~~~

Hier wird numerisch verglichen, daher tritt Fall 1 ein, obwohl `'7e0' !== '07'` ist.
Im [PHP-Manual zu switch](http://php.net/manual/de/control-structures.switch.php) ist zwar der Hinweis zu lesen, dass `switch` typeschwache Vergleiche durchführt, ignoriert aber die Probleme durch *"Beispiel #2 switch gestattet den Vergleich mit Strings"*.

Die folgende switch-Variante nutzt den strengen Vergleich, ist aber schlechter lesbar.

~~~php
$selector = '07';

switch (true) {

  case $selector === '7e0':
      echo 'Fall 1';
      break;

  case $selector === '07':
      echo 'Fall 2';
      break;
}

// Fall 2
~~~


### Beispiel usort
{: #beispiel-usort}

~~~php
function cmp($a, $b) {
    // ungeeignet für strings
    if ($a == $b) {
        return 0;
    }
    return ($a < $b) ? -1 : 1;
}

function cmpStr($a, $b) {
    return strcmp($a, $b);
}

$a1 = $a2 = $a3 = array('0xa', '0x1', '011', '0af');

sort($a1, SORT_STRING);
var_dump($a1);

usort($a2, "cmpStr");
var_dump($a2);

usort($a3, "cmp");
var_dump($a3);

/*
 array(4) { [0]=> string(3) "011" [1]=> string(3) "0af" [2]=> string(3) "0x1" [3]=> string(3) "0xa" }
 array(4) { [0]=> string(3) "011" [1]=> string(3) "0af" [2]=> string(3) "0x1" [3]=> string(3) "0xa" }
 array(4) { [0]=> string(3) "0af" [1]=> string(3) "0x1" [2]=> string(3) "0xa" [3]=> string(3) "011" }
*/
~~~

Das Beispiel zeigt deutlich, dass `usort` bei Verwendung der Vergleichsfunktion `cmp` mit dem typschwachen Vergleich nicht das gewünschte Resultat bringt. `sort` und `usort` mit `cmpStr`, welche `strcmp` benutzt, arbeiten richtig.


### Fazit
{: #fazit}

Für den sicheren Stringvergleich auf Gleich/Ungleich kann nur der strenge Vergleich `===` bzw. `!==` empfohlen werden.
Wird in den obigen ersten Beispielcode konsequent `===` benutzt, bleibt die Ausgabe leer. Für einen größer/kleiner Vergleich von Strings bleibt nur `strcmp` zu nehmen.


### Quelle
{: #quelle}

* [Forumsbeitrag von jspit](http://www.php.de/php-einsteiger/95512-fallstricke-bei-typeschwachen-stringvergleichen.html)
