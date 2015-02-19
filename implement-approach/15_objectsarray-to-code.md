---
layout: guide

permalink: /jumpto/objectsarray-to-code/
title: "Arrays mit Objekten als PHP-Quellcode ausgeben"
group: "Standard Implementierungsansätze / Code-Snippets"
orderId: 15

creator: jspit
author:
    -   name: jspit
        profile: 26032

    -   name: hausl
        profile: 21246

inhalt:
    -   name: "Beispiel"
        anchor: beispiel
        simple: ""

    -   name: "Ausgabe"
        anchor: ausgabe
        simple: ""

---

Manchmal besteht der Wunsch, Arrays die auch Objekte vom Typ `stdClass` enthalten,
als PHP-Quellcode zu exportieren. Die folgende Funktion hilft da `var_export()` etwas nach.

~~~ php
function dump_arrobj($arrobj) { 
    echo '<pre>'.str_ireplace( 'stdClass::__set_state', '(object)', var_export($arrobj,true) ).'</pre>'; 
}  
~~~

#### Beispiel

~~~ php
// Beispiele anlegen 
$obj1 = new stdClass(); 
$obj1->id = 12; 
$obj1->spielername = "Hans"; 
$obj1->allianz = "23"; 

$obj2 = new stdClass(); 
$obj2->id = 18; 
$obj2->spielername = "Peter"; 
$obj2->allianz = "58"; 

$arr = array($obj1, $obj2); 

//PHP-Code ausgeben 
dump_arrobj($arr);  
~~~

#### Ausgabe

~~~ php
array (
  0 => 
  (object)(array(
     'id' => 12,
     'spielername' => 'Hans',
     'allianz' => '23',
  )),
  1 => 
  (object)(array(
     'id' => 18,
     'spielername' => 'Peter',
     'allianz' => '58',
  )),
)
~~~

Eine Variable und = davorgesetzt und ein Semikolon am Ende, und schon kann dies in einem Skript zum Testen benutzt werden.


##### Quelle-Originalbeitrag
[http://www.php.de/php-fortgeschrittene/109293-erledigt-arrays-mit-objekten-als-php-quellcode-ausgeben.html](http://www.php.de/php-fortgeschrittene/109293-erledigt-arrays-mit-objekten-als-php-quellcode-ausgeben.html)
