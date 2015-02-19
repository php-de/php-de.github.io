---
layout: guide

permalink: /jumpto/array-as-json-to-sqldb/
title: "Arrays als JSON-String in SQL-Datenbank speichern"
group: "Standard Implementierungsansätze / Code-Snippets"
orderId: 17

creator: jspit
author:
    -   name: jspit
        profile: 26032

    -   name: hausl
        profile: 21246

inhalt:
    -   name: ""
        anchor: 
        simple: ""

---

### Arrays als JSON-String in SQL-Datenbank speichern


Kleine komplexe Arrays mal schnell in eine SQL-Datenbank zu schreiben wird häufiger gewünscht. 
Hinweise findet man genug, kurze nachvollziehbare C&P-Beispiele schon weniger. 
Das liegt wohl auch daran, dass immer eine Datenbank benötigt wird. 
Für solche kleinen Tests eignet sich SQLite hervorragend, zumal die Datenbank auch im Speicher erstellt werden kann.


#### Beispiel

~~~ php
<?php 
if(bin2hex('ä')!=='c3a4') die('Diese Seite muss unbedingt als UTF-8 gespeichert werden !'); 

header("Content-Type: text/html; charset=utf-8"); 

// unser test-array 
$array_org = array( 
  "abc äöü test", 
  array(2,16,45), 
  "und noch ein text für 1€", 
  true 
); 

// orginal ausgeben 
var_dump($array_org);
echo "<br>"; 

// JSON String erzeugen 
$js = json_encode($array_org); 

// SQlite im Speicher erstellen 
$db = new PDO("sqlite::memory:"); 
$sql = "CREATE TABLE jtab (id INTEGER PRIMARY KEY, json TEXT )"; 
$db->exec($sql); 

// json einfügen 
$sql = "INSERT INTO jtab (id, json) VALUES (?,?)"; 
$stmt = $db->prepare($sql); // SQL_statment vorbereiten 
$stmt->execute(array(0, $js)); 

// json auslesen 
$stmt = $db->query("SELECT json FROM jtab WHERE id = 0");
$row = $stmt->fetch(PDO::FETCH_ASSOC);

// Array wiederherstellen 
$array_db = json_decode($row['json'], true); 
// zum Vergleich ausgeben 
var_dump($array_db);
echo "<br>"; 
~~~

#### Ausgabe


<pre>
<b>array</b> <i>(size=4)</i>
  0 <font color='#888a85'>=&gt;</font> <small>string</small> <font color='#cc0000'>'abc äöü test'</font> <i>(length=15)</i>
  1 <font color='#888a85'>=&gt;</font> 
    <b>array</b> <i>(size=3)</i>
      0 <font color='#888a85'>=&gt;</font> <small>int</small> <font color='#4e9a06'>2</font>
      1 <font color='#888a85'>=&gt;</font> <small>int</small> <font color='#4e9a06'>16</font>
      2 <font color='#888a85'>=&gt;</font> <small>int</small> <font color='#4e9a06'>45</font>
  2 <font color='#888a85'>=&gt;</font> <small>string</small> <font color='#cc0000'>'und noch ein text für 1€'</font> <i>(length=27)</i>
  3 <font color='#888a85'>=&gt;</font> <small>boolean</small> <font color='#75507b'>true</font>
</pre><br><pre class='xdebug-var-dump' dir='ltr'>
<b>array</b> <i>(size=4)</i>
  0 <font color='#888a85'>=&gt;</font> <small>string</small> <font color='#cc0000'>'abc äöü test'</font> <i>(length=15)</i>
  1 <font color='#888a85'>=&gt;</font> 
    <b>array</b> <i>(size=3)</i>
      0 <font color='#888a85'>=&gt;</font> <small>int</small> <font color='#4e9a06'>2</font>
      1 <font color='#888a85'>=&gt;</font> <small>int</small> <font color='#4e9a06'>16</font>
      2 <font color='#888a85'>=&gt;</font> <small>int</small> <font color='#4e9a06'>45</font>
  2 <font color='#888a85'>=&gt;</font> <small>string</small> <font color='#cc0000'>'und noch ein text für 1€'</font> <i>(length=27)</i>
  3 <font color='#888a85'>=&gt;</font> <small>boolean</small> <font color='#75507b'>true</font>
</pre>


~~~ php
array (size=4)
  0 => string 'abc äöü test' (length=15)
  1 => 
    array (size=3)
      0 => int 2
      1 => int 16
      2 => int 45
  2 => string 'und noch ein text für 1€' (length=27)
  3 => boolean true

array (size=4)
  0 => string 'abc äöü test' (length=15)
  1 => 
    array (size=3)
      0 => int 2
      1 => int 16
      2 => int 45
  2 => string 'und noch ein text für 1€' (length=27)
  3 => boolean true
~~~

Das Beispiel zeigt, wird konsequent mit UTF-8 gearbeitet, sind auch Umlaute und Sonderzeichen kein Problem.
Die Prepared Statements sorgen hier gleich für die unbedingt notwendige Maskierung der Daten. 


Quelle-Originalbeitrag: [http://www.php.de/php-einsteiger/97089-erledigt-arrays-als-json-string-sql-datenbank-speichern.html](http://www.php.de/php-einsteiger/97089-erledigt-arrays-als-json-string-sql-datenbank-speichern.html)
