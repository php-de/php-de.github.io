---
layout: guide

title:       "Gruppenbruch / Gruppenwechsel"
description: ""
group:       "Standard Implementierungsansätze / Code-Snippets"
orderId:     6
permalink:   /jumpto/gruppenbruch/
root:        ../..
creator:     nikosch

author:
    -   name: nikosch
        profile: 2314

    -   name: mermshaus
        profile: 15041

inhalt:
    -   name: "Prinzip und Voraussetzung"
        anchor: prinzip-und-voraussetzung
        simple: ""

    -   name: "Bruch nach Vergleichskriterium"
        anchor: bruch-nach-vergleichskriterium
        simple: ""

    -   name: "Bruch nach sonstigen Kriterien"
        anchor: bruch-nach-sonstigen-kriterien
        simple: ""

    -   name: "Alternativen"
        anchor: alternativen
        simple: ""

entry-type: in-discussion
---

Der **Gruppenbruch** oder **Gruppenwechsel** ist ein Verfahren zum Gruppieren
linear verwalteter Daten (wie zum Beispiel die Rückgabemenge einer
Datenbankabfrage). Ziel ist die Unterteilung einer Liste von Daten in einzelne
Kapitel oder Abschnitte mit gemeinsamen Merkmalen. Typische Beispiele sind nach
Anfangsbuchstaben gestaffelte Einträge oder Gruppen-/Zwischenüberschriften,
aber auch tabellarisch dargestellte Bildgalerien mit n Elementen pro Zeile
können als Gruppenbruch umgesetzt werden.



## [Prinzip und Voraussetzung](#prinzip-und-voraussetzung)
{: #prinzip-und-voraussetzung}

Alle zu gruppierenden Elemente werden in einer Schleife durchlaufen und in den
Ausgabepuffer oder eine Variable geschrieben. Gruppierende Elemente erfolgen
dann als Ausgabe dazwischen. Aus den Elementen oder der Schleifenumgebung muß
sich dabei ein gemeinsames Gruppierungkriterium ableiten lassen.



## [Bruch nach Vergleichskriterium](#bruch-nach-vergleichskriterium)
{: #bruch-nach-vergleichskriterium}

Das gruppierende Kriterium wird hier stets mit seinem Vorgänger verglichen, der
für diesen Zweck bis zum nächsten Schleifendurchlauf temporär gespeichert wird.
Dieses Funktionsprinzip verlangt zwingend eine Sortierung aller Elemente nach
dem/den genutzten Gruppenkriterium/en (wie bspw. eine alphabetische Sortierung
für eine Gruppierung nach Anfangsbuchstaben). Ist dies nicht möglich, kann
mithilfe von Arrays ein alternatives Vorgehen verwendet werden (siehe unten).


#### [Beispiel 1a - Gruppenbruch mit Vorgängervergleich](#beispiel-1a)
{: #beispiel-1a}

~~~ php
$array = array(
  'Alf',
  'Bibi Blocksberg',
  'Bibo',
  'Biene Maja',
  'Peter Pan',
  'Urmel aus dem Eis'
);

$last_entry = null;

// Elemente durchlaufen
foreach ($array as $current_entry) {

    $first_char = $current_entry[0]; // erstes Zeichen des aktuellen Wertes

    // Gruppenbruch, neuer Anfangsbuchstabe
    if ($first_char != $last_entry) {
        echo 'Buchstabe: ' . $first_char . '<br>';
    }
    echo '  ' . $current_entry . '<br>';

    // neuen Vergleichswert setzen
    $last_entry = $first_char;
}
~~~

Ausgabe:

~~~
Buchstabe: A
  Alf
Buchstabe: B
  Bibi Blocksberg
  Bibo
  Biene Maja
Buchstabe: P
  Peter Pan
Buchstabe: U
  Urmel aus dem Eis
~~~


#### [Beispiel 1b - Gruppenbruch mit Vorgängervergleich mit JOIN-Daten aus DB](#beispiel-1b)
{: #beispiel-1b}

Angenommen wir haben folgende DB-Tabellen zu Automarken und dazugehörigen Modellen
und wollen daraus eine Auflistung aller Modelle je Marke.

Tabelle `marke`

~~~
+----+-------+
| id | name  |
+----+-------+
|  1 | Audi  |
|  2 | VW    |
|  3 | Skoda |
|  4 | Seat  |
+----+-------+
~~~

Tabelle `modell`

~~~
+----+---------+----------+
| id | name    | marke_id |
+----+---------+----------+
|  1 | A2      |        1 |
|  2 | A4      |        1 |
|  3 | A6      |        1 |
|  4 | Golf    |        2 |
|  5 | Sharan  |        2 |
|  6 | Touareg |        2 |
|  7 | Octavia |        3 |
|  8 | Fabia   |        3 |
|  9 | Yeti    |        3 |
| 10 | Leon    |        4 |
| 11 | Ibiza   |        4 |
+----+---------+----------+
~~~

Zuerst holen wir uns daraus mittels einem JOIN die benötigten Daten.

~~~
SELECT
  ma.name AS marke_name,
  mo.name AS modell_name
FROM marke ma
INNER JOIN modell mo
  ON ma.id = mo.marke_id
ORDER BY ma.name, mo.name

+------------+-------------+
| marke_name | modell_name |
+------------+-------------+
| Audi       | A2          |
| Audi       | A4          |
| Audi       | A6          |
| Seat       | Ibiza       |
| Seat       | Leon        |
| Skoda      | Fabia       |
| Skoda      | Octavia     |
| Skoda      | Yeti        |
| VW         | Golf        |
| VW         | Sharan      |
| VW         | Touareg     |
+------------+-------------+
~~~

Nun wird die Ausgabe mittels Gruppenbruch in eine lesbar gegliederte Form gebracht.

~~~ php
$last_entry = null;

while ($row = $result->fetch_object()) {

   if ($last_entry != $row->marke_name) {
        echo $row->marke_name.'<br>';
        $last_entry = $row->marke_name;
    }
    echo '- '.$row->modell_name.'<br>';
}
~~~

Ausgabe:

~~~
Audi
- A2
- A4
- A6
Seat
- Ibiza
- Leon
Skoda
- Fabia
- Octavia
- Yeti
VW
- Golf
- Sharan
- Touareg
~~~


## [Bruch nach sonstigen Kriterien](#bruch-nach-sonstigen-kriterien)
{: #bruch-nach-sonstigen-kriterien}


### [Modulo](#modulo)
{: #modulo}

Der Modulo ist der Rest einer Ganzzahldivision. Damit liefert `Modulo(n)` für
in einer Schleife durchlaufene numerische Werte für jeden n-ten Wert ein
identisches Ergebnis und ist so ein optimales Vergleichskriterium, um eine
Liste von Elementen gleichmäßig tabellarisch abzubilden. Der Modulo-Operator
wird in PHP mit einem Prozentzeichen (`%`) gekennzeichnet.

Beispielhaft wird nachfolgend eine imaginäre Datenbankausgabe ausgelesen und in
Dreiergruppen angeordnet. Im ersten Beispiel werden die Daten dazu
nebeneinander ausgeben und alle drei Durchläufe durch eine horizontale
Trennlinie durchbrochen.


#### [Beispiel 2 - Gruppenbruch mit Indexmodulo](#beispiel-2)
{: #beispiel-2}

~~~ php
// ... Datenbankverbindung etc.

// Zähler
$index = 0;
while ($set = mysql_fetch_assoc ($dbResult)) {
    echo $set['output'] . ' ';

    // Zählermodulo, gültig alle 3 Schleifendurchläufe
    if (2 == ($index % 3)) {
        echo '<hr>';
    }

    $index++;
}
~~~

Auch eine tabellarische Ausgabe ist so möglich. Das Trennelement bildet hier
der Abschluss der laufenden Tabellenzeile und der Anfang einer neuen
(`</tr></tr>`).


#### [Beispiel 3a - Gruppenbruch mit Indexmodulo](#beispiel-3a)
{: #beispiel-3a}

~~~ php
// ... Datenbankverbindung etc.

// Zähler
$index = 0;

echo '<table><tr>';

while ($set = mysql_fetch_assoc ($dbResult)) {
    echo '<td>' . $set['output'] . '</td>';

    // Zählermodulo, gültig alle 3 Schleifendurchläufe
    if (2 == ($index % 3)) {
        echo '</tr><tr>';
    }

    $index++;
}
echo '</tr></table>';
~~~

Prinzipbedingt gibt diese Lösung immer Tabletags und mindestens eine
Tabellenzeile aus, selbst für Leere Datenmengen. Abhilfe schafft hier nur die
Zwischenspeicherung der Ausgabe, bspw.:


#### [Beispiel 3b - Gruppenbruch mit Indexmodulo, datensatzabhängig](#beispiel-3b)
{: #beispiel-3b}

~~~ php
// ... Datenbankverbindung etc.

// Zähler
$index = 0;
$content = '';

while ($set = mysql_fetch_assoc ($dbResult)) {
    $content .= '<td>' . $set['output'] . '</td>';

    // Zählermodulo, gültig alle 3 Schleifendurchläufe
    if (2 == ($index % 3)) {
        $content .= '</tr><tr>';
    }

    $index++;
}

if (false === empty ($content)) {
    echo '<table><tr>' . $content . '</tr></table>';
}
~~~



## [Alternativen](#alternativen)
{: #alternativen}


### [Abbildung einer Zwischenstruktur auf Arrays](#abbildung-einer-zwischenstruktur-auf-arrays)
{: #abbildung-einer-zwischenstruktur-auf-arrays}

Eine einfach Alternative bieten mehrdimensionale Arrays, die als Schlüssel der
obersten Ebene das Sortierkriterium nutzen und als Unterebene eine Menge von
automatisch angelegten numerischen Indizies.


#### [Beispiel 4a - Gruppierung über Zwischenarray](#beispiel-4a)
{: #beispiel-4a}

~~~ php
$array = array(
  'Bibo' ,
  'Alf' ,
  'Peter Pan' ,
  'Biene Maja' ,
  'Bibi Blocksberg' ,
  'Urmel aus dem Eis'
);

foreach ($array as $entry) {
    if (false === isset ($ordered[$entry[0]])) {
        $ordered[$entry[0]] = array ();
    }
    $ordered[$entry[0]][] = $entry;
}

print_r ($ordered);

// Ausgabe nach Reihenfolge des ersten Auftretens
foreach ($ordered as $character => $set) {
    echo $character . '<br>';
    echo implode (' | ' , $set) . '<br>';
}
~~~

Strukturlisting und Ausgabe:

~~~
Array
(
    [B] => Array
        (
            [0] => Bibo
            [1] => Biene Maja
            [2] => Bibi Blocksberg
        )

    [A] => Array
        (
            [0] => Alf
        )

    [P] => Array
        (
            [0] => Peter Pan
        )

    [U] => Array
        (
            [0] => Urmel aus dem Eis
        )
)

B
Bibo | Biene Maja | Bibi Blocksberg
A
Alf
P
Peter Pan
U
Urmel aus dem Eis
~~~

Als Nachteil ergibt sich, dass alle Daten nochmals gespeichert und nicht direkt
verarbeitet werden. Das ist besonders kritisch für sehr große Datenmengen. Als
Vorteil ergibt sich, dass die Eingansreihenfolge nicht durch Sortierung
verändert werden muss. Das kann für bestimmte Daten, etwa Logfile-Daten oder
IMAP-Listen, die zum Beispiel zeitlich angeordnet sind, vorteilhaft sein.


#### [Beispiel 4b - Gruppierung über Zwischenarray aus einer Datenbankabfrage mit PDO](#beispiel-4b)
{: #beispiel-4b}


Die Namen liegen hier in der Filmfiguren-Tabelle `filmfigures` vor.
Es wird `PDO::FETCH_GROUP` genutzt, um das komplette Zwischenarray direkt aus einer Datenbankabfrage zu generieren.
Erstellt wird ein mehrdimensionales Array mit dem ersten Feldelement des Selects (= der Anfangsbuchstabe) als Key und
mit Subarrays, welche alle weiteren Feldelemente (die Gruppen) enthalten.

~~~
SELECT
  SUBSTR(name, 1, 1) as firstchar,
  name
FROM
  filmfigures
ORDER BY
  name

+-----------+-------------------+
| firstchar | name              |
+-----------+-------------------+
| A         | Alf               |
| B         | Bibi Blocksberg   |
| B         | Bibo              |
| B         | Biene Maja        |
| P         | Peter Pan         |
| U         | Urmel aus dem Eis |
+-----------+-------------------+
~~~


Verarbeitung in PHP mittels PDO

~~~ php
$sql = "
    SELECT
      SUBSTR(name, 1, 1) as firstchar,
      name
    FROM
      filmfigures
    ORDER BY
      name
";

$stmt = $pdo->query($sql);
$result = $stmt->fetchAll(PDO::FETCH_GROUP);

print_r($result);

foreach ($result as $firstChar => $groupArray) {
    echo $firstChar.'<br>';
    foreach ($groupArray as $group){
        echo ' - '.$group->name.'<br>';
    }
}
~~~

Ergibt folgende Ausgabe

~~~
Array
(
    [A] => Array
        (
            [0] => stdClass Object
                (
                    [name] => Alf
                )
        )

    [B] => Array
        (
            [0] => stdClass Object
                (
                    [name] => Bibi Blocksberg
                )

            [1] => stdClass Object
                (
                    [name] => Bibo
                )

            [2] => stdClass Object
                (
                    [name] => Biene Maja
                )
        )

    [P] => Array
        (
            [0] => stdClass Object
                (
                    [name] => Peter Pan
                )
        )

    [U] => Array
        (
            [0] => stdClass Object
                (
                    [name] => Urmel aus dem Eis
                )
        )
)


A
 - Alf
B
 - Bibi Blocksberg
 - Bibo
 - Biene Maja
P
 - Peter Pan
U
 - Urmel aus dem Eis
~~~

Der Vorteil dieser Variante ergibt sich aus den vielfältigen Möglichkeiten einer Datenbank in Bezug auf Auswahl und Sortierung.



### [Verschachtelte Schleifen mit Abbruchbedingung](#verschachtelte-schleifen-mit-abbruchbedingung)
{: #verschachtelte-schleifen-mit-abbruchbedingung}


#### [Beispiel 5 - Gruppierung über Schleifenabbruch](#beispiel-5)
{: #beispiel-5}


~~~ php
// ... Datenbankverbindung etc.

$elements = (0 < mysqli_num_rows($dbResult));

if ($elements) {
    echo '<table>';
    while ($elements) {
        echo '<tr>';

        // drei Elemente am Stück auslesen und ausgeben
        for ($index = 0; $index < 3; $index++) {
            // keine weiteren Elemente
            if (false === $set = mysqli_fetch_assoc($dbResult)) {
                // Verhindert weiterlaufen der äußeren Schleife
                $elements = false;
                // vorzeitiger Abbruch der For-Schleife
                break;
                }

            echo '<td>' . $set['output'] . '</td>';
            }

        echo '</tr>';
        }
    }
    echo '</table>';
}
~~~
