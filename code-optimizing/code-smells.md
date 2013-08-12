---
layout: guide

title: "Codeoptimierung: Code-Smells"

entry-type: in-progress

author:
    -   name: nikosch
        profile: 2314
    -   name: hausl
        profile: 21246

creator: nikosch

inhalt:
    -   name: "1. Leere Strings"
        anchor: emptystring
        simple: ""
        
    -   name: "2. Unnötiges Variablen-Parsing in Doppelquotes"
        anchor: varpars
        simple: ""
---

Es gibt eine Reihe von Unsitten, die offenbar in veralteten Lehrbüchern auftauchen oder sich durch Copy & Paste im Laufe der Jahre im Internet exponentiell verbreitet haben. 

Dieser Artikel richtet sich an Spracheinsteiger, Fortgeschrittene können bei [Wikipedia einige Beispiel zu Code-Smells finden.](http://de.wikipedia.org/wiki/Code_smell)

**Information**  
Achtung! Der Artikel nutzt reduzierte Lehrbeispiele. Der Übersichtlichkeit halber können wichtige Funktionen zur Eingabevalidierung o. ä. weggelassen worden sein.


#### 1. <a id="emptystring"></a> Leere Strings  

##### 1.1 Problem
Code-Smells mit leeren Strings  

    // unsinnig
    $foo = '' . $bar;
    $baz = "" . $bar . "";
    $query = "SELECT myfield FROM mytable WHERE id=" . $id . "";
 
    // halb-sinnig
    $myString = '' . $myInt;
    
##### 1.2 Ersatz
Leere Strings sind ausnahmslos zu streichen. 

    $foo = $bar;
    $baz = $bar;
    $query = "SELECT myfield FROM mytable WHERE id=" . $id;

Wenn es darum geht, andere Typen nach String zu casten, sollte explizites Typ-Casting verwendet werden. 

    // explizites Type-Casting
    $myString = (string)$myInt;

#### 2. <a id="varpars"></a> Unnötiges Variablen-Parsing in Doppelquotes

PHP unterstützt die Verwendung von Variablen innnerhalb von doppelten Anführungszeichen. Dort befindliche     Variablen werden in Ihren Wert aufgelöst: 

    $foo = 12;
    echo "Mein Hut der hat $foo Ecken";


##### 2.1. Problem
Weit verbreitet ist diese unsinnige Variante - Code-Smells mit unnützen Stringsquotes:

    $foo = 'Zwerg';
    echo "$foo"; // Zwerg
 
    // halb-sinnig
    $myInt = 17;
    $stringvar = "$myInt"; 
    var_dump ($stringvar); //(string) 17
    

Die Stringbegrenzer erfüllen hier keinen Zweck - sie umschließen kein weiteres Zeichen außer dem Variableninhalt. Im Gegenteil veranlassen sie PHP zu unnötiger Arbeit, dem Einbetten einer Variable in einen String, der dann wiederum geparst wird. 

##### 2.2. Ersatz
Solche Konstrukte sind gegen die alleinstehende Variable auszutauschen. 

    $foo = 'Zwerg';
    echo $foo; // Zwerg
 
    $myInt = 17;
    $stringvar = (string)$myInt;
    
Wenn es darum geht, andere Typen nach String zu casten, sollte explizites Typ-Casting verwendet werden (siehe oben). 

#### 3. <a id="selectall"></a> SELECT * 

##### 3.1. Problem
Code-Smells mit *-Select

        $query = "SELECT * FROM Personen";

Aus der Datenbanktabelle wird hier stets jedes Feld der Zeile abgefragt. Oft ist das gar nicht nötig, weil nur ein Teil der Felder verarbeitet wird. Zudem sagt das Statement nichts darüber aus, welche Werte es liefert. Kritisch wird es, wenn sich die Tabellenstruktur ändert - Folgefehler (Zugriff auf nicht mehr existente Feldnamen) oder das Auslesen von unnützen Daten (Text, Blob) kann die Folge der *-Konvention sein. 

##### 3.2. Ersatz
Es sind immer die Namen der Felder anzugeben. In Hinsicht auf Keyword-Probleme ist es sinnvoll, dabei Backticks zu verwenden. 

Was dieses Select liefert, ist klar ersichtlich

    $query = "SELECT `Id` , `Name` , `E-Mail` FROM Personen";

Übrigens existiert dieses Problem auch vertikal: Wer sich sicher ist, dass eine Zeile mit einer bestimmten WHERE-Bedingung nur einmal vorkommen kann, hat sicher kein Problem damit, ein LIMIT 1 zu ergänzen. 

#### 4. <a id="counting"></a> LIMIT vs. PHP-Counting 

#### 4.1. Problem
Code-Smells mit Limit


    // Fehlerbehandlung wurde hier mal weggelassen
    $connection = mysql_connect('localhost' , 'root');
    mysql_select_db('userdb' , $connection);
 
    $ress = mysql_query("SELECT `Id` , `Name` FROM Personen");
    $cnt=0;
    while ($data = mysql_fetch_assoc($ress))
    {
      if($cnt>3)
      {
        break;
      }
      echo $data['Id'] , ', ' , $data['Name'] , '<br />';
      $cnt++;
    }

Hier bricht PHP nach 3 Ausgaben das Auslesen der Datenbank ab. Diese hat allerdings im Vorfeld alle Personendatensätze zusammengestellt, und seien es 50000. 

##### 4.2. Ersatz

Wo immer möglich ist ein LIMIT für die Querymenge anzugeben. Die Datenbank kann dann die Anfrage entsprechend optimieren, liefert auch immer gleich die passende Menge und erspart damit auch PHP-seitige Handstände. 

Na, wer hat jetzt die Arbeit?


    // Fehlerbehandlung wurde hier mal weggelassen
    $connection = mysql_connect('localhost' , 'root');
    mysql_select_db('userdb' , $connection);
 
    $ress = mysql_query("SELECT `Id` , `Name` FROM Personen LIMIT 3");
    while ($data = mysql_fetch_assoc($ress))
    {
      echo $data['Id'] , ', ' , $data['Name'] , '<br />';
    }
    
#### 5. <a id="limit"></a> LIMIT und Schleife 

##### 5.1. Problem

Bei Datenbankabfrage, die definitiv nur einen Datensatz liefern, wird oft die übliche Form des Auslesenes verwendet: 
Code-Smells mit auslesenden Schleifen

    // Fehlerbehandlung wurde hier mal weggelassen
    $connection = mysql_connect('localhost' , 'root');
    mysql_select_db('userdb' , $connection);
 
    $ress = mysql_query("SELECT `ID` , `User` , `Password`
                     FROM    Login 
                     WHERE   `User` = '" . mysql_real_escape_string ($_POST['user']) . "' 
                     LIMIT   1");
 
    $auth = false;
 
    while ($data = mysql_fetch_assoc($ress))
    {
      if($_POST['pass'] == $data['Password'])
      {
        $auth = true;
      }
    }
 
    if (!$auth) 
    {
    echo 'Die Anmeldung ist fehlgeschlagen.';
    }

Sowohl LIMIT 1, als auch eine sinnvolle Scriptlogik - in einem Loginprozess sollte es nur einen, datenbankweit eindeutigen Nutzernamen geben können (Primärschlüssel) - begrenzen hier die maximale Menge an Datensätzen auf 1. while (.. fetch()) ist dagegen ein Codefragment, um alle Datensätze einer Anfrage auszulesen. 

##### 5.2. Ersatz

Die meisten Nutzer wissen gar nicht, was das while hier überhaupt tut. Kurz gesagt werden hier per Schleife solange Datensätze von der Datenbank angefordert, bis die Datenbank FALSE für "keine weiteren Datensätze" zurückliefert. Die Schleife läuft dadurch, dass diese Rückgabe die Schleifenbedingung bildenet. 

Mit diesem Wissen können wir einen Ersatz für Fälle schaffen, in denen definitiv nur ein Datensatz erwartet wird oder nur einer ausgelesen werden soll (vgl. dazu aber obige Aussagen zu LIMIT). 

Hier ist eindeutiger, was passiert

    // ... Anfrage von oben
    $auth = false;
 
    if($data = mysql_fetch_assoc($ress))
    {
      if($_POST['pass'] == $data['Password'])
      {
        $auth = true;
      }
    }
 
    if (!$auth) 
    {
      echo 'Die Anmeldung ist fehlgeschlagen.';
    }

Wir benutzen ein If, das hier einen ähnlichen Effekt wie die Schleife erfüllt: Der Datensatz wird geholt, wenn kein false geliefert wird, wird der Block durchlaufen und $data ausgewertet und verarbeitet. Die Lösung gaukelt uns jetzt keine Schleifenbedingung vor, die sowieso nur max. einmal durchläuft sondern bildet klar ersichtlich die Funktionalität ab. 
