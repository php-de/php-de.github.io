---
layout: guide

title: "Codeoptimierung: Wächter"

author:
    -   name: nikosch
        profile: 2314
    -   name: hausl
        profile: 21246

creator: nikosch

inhalt:
    -   name: "Wächter vs. Schachtel-If"
        anchor: waechterorif
        simple: "Grundlagen"

    -   name: "Möglichkeiten"
        anchor: moeglichkeiten
        simple: "Schleifenabbrüche mit break;<br>
		Schleifenabbrüche mit continue;<br>
        	Funktionsabbrüche mit return;"

    -   name:  "Spezialfälle"
        anchor: spezial
        simple: "Verlassen tieferer Strukturen
        	Bedingter Abbruch mit künstlichem Blockelement"

    -   name: "Siehe auch"
        anchor: sieheauch
        simple: "Link-Verweise"

entry-type: in-progress
---

#### <a id="waechterorif"></a> Wächter vs. Schachtel-If

In komplexem Code kommt es oft zu einer mehrfachen Verschachtelung von Kontrollstrukturen. Infolge dessen werden relevante Codeteile oft erst in Blöcken 2. oder 3. Ordnung aufgerufen. Nicht immer ist diese Problematik mit AND/OR Operatoren im Bedingungsausdruck zu lösen, ohne gleichzeitig das DRY-Prinzip (don't repeat yourself - Maxime, die besagt, keinen redundanten Code zu schreiben) zu verletzen. 

Eine Lösung können hier sogenannte **Wächter** bilden, die auf der Grundlage von frühzeitigen Schleifen- bzw. Strukturabbrüchen basieren. 

**Information**  
Vorzeitige Abbrüche sind unter Anhängern reiner Lehren wie der strukturierten Programmierung verpönt. Die Gratwanderung zwischem elegantem und verständlichem Code muß jeder selbst vollbringen. 

##### Grundlagen
Code funktioniert linear, wird also von oben nach unten, in einer Schleife auch mehrfach abgearbeitet. Jeder Code, der bedingt verarbeitet wird, wird in einem Block geklammert, der je nach Eintreffen der Bedingung durchlaufen wird oder nicht. In einer Schleife ist dies der gesamte zu wiederholende Block, der je nach Schleifenbedingung (Zählervergleich, Durchlaufen einer Menge oder dergl.) geloopt wird. Auch eine Funktion oder Methode ist ein solcher Anweisungsblock, der normalerweise als letztes ein Ergebnis oder einen boolschen Wert als Statusinformation zurückgibt. 

Bedingungen haben im Bereich der Datenverarbeitung zwei Zustände. Sie werden deshalb so ausgeführt: 

    Wenn Bedingung 1: 
        Führe Block 1 aus
    Sonst: 
        Führe Block 2 aus

Das alternative Wächterprinzip macht sich die Logik zunutze, dass eine nicht erfüllte Bedingung 1 ja zwangsläufig zur Ausführung des zweiten Blocks führt. Also

    Wenn Bedingung 1: 
        Führe Block 1 aus
        Verlasse die Bedingungsprüfung
    Führe Block 2 aus


**Beispiel 1**

Im Vergleich: Ein Wertebereich soll durchlaufen werden und für alle enthaltenen Datensätze angeben, on sie 1 sind oder nicht.  

Pseudocode:
  
Bsp. 1, klassischer Ansatz, Pseudocode

    Schleifendurchlauf
        Ist Wert = 1:
            Schreibe "key ist 1"
        Sonst:
            Schreibe "key ist ungleich 1"

  Bsp. 1, alternativer Ansatz, Pseudocode

    Schleifendurchlauf
        Ist Wert = 1:
            Schreibe "key ist 1"
            nächstes Schleifenelement
        Schreibe "key ist ungleich 1"


  Bsp. 1, klassischer Ansatz, PHP Umsetzung

    foreach ($array as $key => $value) {

        // positiver Bedingungszweig
        if ($value == 1) {
            echo $key . ' ist 1<br>';
        }
        // negativer Bedingungszweig
        else {
            echo $key . ' ist ungleich 1<br>';
        }
    }

Bsp. 1, alternativer Ansatz, PHP Umsetzung

    foreach ($array as $key => $value) {

        // positiver Bedingungszweig
        if ($value == 1) {
            echo $key . ' ist 1<br>';
            continue;
        }
        // negativer Bedingungszweig
        echo $key . ' ist ungleich 1<br>';
    }

**Beispiel 2**

Besonders in Funktionen ist das Prinzip des vorzeitigen Abbruchs sehr verständlich und am weitesten verbreitet. Im Beispiel soll eine Query an eine Datenbank abgesetzt werden. Die Funktion erzeugt dabei eine Datenbankverbindung, wählt die Datenbank aus und führt die Query aus. Alle drei Operationen können zu Fehlern führen, die die Funktion berücksichtigen soll.
Wieder klassische Lösung und alternative im Vergleich:

  Bsp. 2, klassischer Ansatz, Pseudocode

    Funktionsblock
        Verbindungsaufbau

        Verbindung erfolgreich:
            Datenbankwahl

            Datenbankwahl erfolgreich:
                Queryanfrage
                Returnwert zuweisen

            Sonst (Datenbankwahl nicht erfolgreich):
                Schreibe "Datenbankverbindung fehlgeschlagen"
                Returnwert zuweisen

        Sonst (Verbindung nicht erfolgreich):
            Schreibe "Verbindung fehlgeschlagen"
            Returnwert zuweisen

        Returnwert zurückgeben

  Bsp. 2, alternativer Ansatz, Pseudocode

    Funktionsblock
        Verbindungsaufbau

        Verbindung nicht erfolgreich:
            Schreibe "Verbindung fehlgeschlagen"
            Funktionsabbruch

        Datenbankwahl

        Datenbankwahl nicht erfolgreich:
            Schreibe "Datenbankverbindung fehlgeschlagen"
            Funktionsabbruch

        Queryanfrage
        Returnwert zuweisen

        Returnwert zurückgeben

  Bsp. 2, klassischer Ansatz, PHP Umsetzung:

    function dbQuery ($querystring) {
        // Verbindungsaufbau
        $link = mysql_connect('example.com:3307', 'mysql_user', 'mysql_password');
    
        if ($link) {
            // erfolgreiche Verbindung 
    
        // Datenbankwahl
            $db_selected = mysql_select_db("mydbname" , $link);
    
        if ($db_selected) {
                // erfolgreiche Datenbankwahl
    
            // Queryanfrage
                $result = mysql_query($querystring , $link);
    
        } else {
                // fehlgeschlagene Datenbankwahl
    
                echo 'Datenbankverbindung fehlgeschlagen';
                $result = false;
            }
            mysql_close($link);
    
        } else {
            // fehlgeschlagene Verbindung 
            echo 'Verbindung fehlgeschlagen';
            $result = false;
        }
     
        return $result;
    }

Bsp. 2, alternativer Ansatz, PHP Umsetzung:

    function dbQuery ($querystring) 
    {
        // Verbindungsaufbau
        $link = mysql_connect('example.com:3307', 'mysql_user', 'mysql_password');
 
        if (false === $link) {
            // fehlgeschlagene Verbindung 
 
            echo 'Datenbankverbindung fehlgeschlagen';
            return false;
        }
 
        // Datenbankwahl
        $db_selected = mysql_select_db("mydbname" , $link);
 
        if (false === $db_selected) {
            // fehlgeschlagene Datenbankwahl
 
            echo 'Verbindung fehlgeschlagen';
            mysql_close($link);
            return false;
        }
 
        // Queryanfrage
        $result = mysql_query($querystring , $link);
        return $result;
    }

Wie bereits dieses kurze Beispiel zeigt ist der Code nicht nur wesentlich kompakter und weniger geschachtelt, auch die Reihenfolge der Ausführung ist weit verständlicher, weil die else Zweige nicht in umgekehrter Reihenfolge wie ihre positiven Bedingungen abgearbeitet werden.
Eine kleine Falle, der beim obigen Pseudocode unterschlagen wurde, enthält die Alternativlösung: Die Freigabe der Verbindungsressource durch mysql_close($link); muß für zwei Fälle erfolgen: Für den positiven, aber auch den negativen Fall der Datenbankwahl. In der klassischen Umsetzung ist dies aufgrund der Schachtelung schon eingebaut.

#### <a id="moeglichkeiten"></a> Möglichkeiten

##### Schleifenabbrüche mit break;

Prüfung einer Bedingung und Abarbeitung zugehöriger Operationen. Vorzeitiger Abbruch der Schleife, Unterbinden der Abarbeitung weiterer Schleifenelemente.

* Fehlerkontrolle und -abbruch
* Spezialisierter Suchalgorithmus mit Abbruch beim ersten Fund

##### Schleifenabbrüche mit continue;

Prüfung einer Bedingung und Abarbeitung zugehöriger Operationen. Unterbinden weiterer Prüfungen und Operationen auf das laufende Schleifenelement.

* Komplexe Verarbeitung von Elementen einer Menge.
* Vereinfachung der Codestruktur.

##### Funktionsabbrüche mit return;

Synonym für Schleifenabbrüche mit break; im Bereich von Funktions und -methodenblöcken. Zusätzlich Rückgabe eines Wertes an den aufrufenden Kontext.

#### <a id="spezial"></a> Spezialfälle

##### Verlassen tieferer Strukturen

Sowohl continue als auch break (nicht aber return) bieten die Möglichkeit, auch mehrfach verschachtelte Strukturen (Schleifen) vorzeitig zu beenden bzw. das nächste Element der äußeren Schleife auszuführen. Als Beispiel soll hier eine bewußt dumme Suchfunktion dienen:
Eine Funktion durchläuft eine Menge von Wörtern und untersucht diese, ob sie vollständig aus Buchstaben einer Codemenge bestehen. Der bedingte Abbruch prüft hier, ob ein Buchstabe existiert, der nicht dieser Menge entspricht und bricht dann mit diesem hinreichenden Kriterium die Prüfung für das aktuelle Wort-Element ab. Die verbleibenden Buchstaben werden also übersprungen.

Bsp. 3, alternativer Ansatz, PHP Umsetzung:

    $buchstaben = array ('a' , 'b' , 'c'); 
    $worte = array ('abbabab' , 'babajaga' , 'acab'); 
 
    foreach ($worte as $wort) {
        echo '<br>Prüfe ' . $wort . ': '; 
 
        for ($i = 0 ; $i < strlen($wort) ; $i++) {
            // Anzeige aktueller Buchstabe
            echo $wort[$i];
 
            // Prüfung aktueller Buchstabe
            if (false === in_array($wort[$i] , $buchstaben)) {
                // ungültiges Wort - Abbruch, nächstes Wort
                echo ' failed';
                continue 2;
            }
        }
    }

Anmerkung: Verwendete man statt des continue 2; hier ein break 2; Statement, ergäbe sich eine andere Funktionalität: Statt jedes einzelne Wort hinsichtlich der gültigen Buchstabenmenge zu validieren, würde dann die Wortmenge geprüft, ob sie ausschließlich aus gültigen Buchstaben besteht.

##### Bedingter Abbruch mit künstlichem Blockelement

Es kann Codebeispiele geben, in denen kein Blockelement existiert, eine Wächterlösung aber trotzdem sinnvoll ist. Hier kann sich mit einem künstlichen Blockelement beholfen werden.
Für Anwendungen wie dem Datenbankbeispiel kann eine mit FALSE initialisierte do-while Schleife benutzt werden. Das Besondere an diesem Schleifentyp ist, dass sie unabhängig von ihren Bedingungen mindestens einmal durchlaufen wird. Das FALSE als Bedingung garantiert die Beschränkung auf einen Durchlauf.

    do {
        // Bedingungsblock
    }
	while (false);

führt also alle Anweisungen (hier durch // Bedingungsblock repräsentiert) genau einmal aus. Der Vorteil, der sich gegenüber einer Ausführung ohne Blockelement ergibt, ist, dass die Schleife nun jederzeit mit einem break; vorzeitig verlassen werden. 
Bezugnehmend auf das obige Beispiel könnte also bspw. ein Fehler bei der Datenbankverbindung so abgefangen werden:  

Ergänzung zu Bsp. 2, alternativer Ansatz ohne natives Blockelement, PHP Umsetzung:

    do {
        // Verbindungsaufbau
        $link = mysql_connect('example.com:3307', 'mysql_user', 'mysql_password');
 
        if (false === $link) {
            // fehlgeschlagene Verbindung 
 
            echo 'Datenbankverbindung fehlgeschlagen';
            break;
        }
        // ... weitere Datenbank-Operationen
    }
    while (false);
   

#### <a id="sieheauch"></a> Siehe auch

[http://c2.com/cgi/wiki?GuardClause](http://c2.com/cgi/wiki?GuardClause)  
[http://programming-php.net/de/clean-code/guard-clauses/](http://programming-php.net/de/clean-code/guard-clauses/)  
