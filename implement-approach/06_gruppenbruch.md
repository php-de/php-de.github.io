---
layout: guide

permalink: /jumpto/gruppenbruch/
root: ../..
title: "Gruppenbruch"
group: "Standard Implementierungsansätze / Code-Snippets"
orderId: 6

creator: nikosch
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



### Prinzip und Voraussetzung

Alle zu gruppierenden Elemente werden in einer Schleife durchlaufen und in den
Ausgabepuffer oder eine Variable geschrieben. Gruppierende Elemente erfolgen
dann als Ausgabe dazwischen. Aus den Elementen oder der Schleifenumgebung muß
sich dabei ein gemeinsames Gruppierungkriterium ableiten lassen.



### Bruch nach Vergleichskriterium

Das gruppierende Kriterium wird hier stets mit seinem Vorgänger verglichen, der
für diesen Zweck bis zum nächsten Schleifendurchlauf temporär gespeichert wird.
Dieses Funktionsprinzip verlangt zwingend eine Sortierung aller Elemente nach
dem/den genutzten Gruppenkriterium/en (wie bspw. eine alphabetische Sortierung
für eine Gruppierung nach Anfangsbuchstaben). Ist dies nicht möglich, kann
mithilfe von Arrays ein alternatives Vorgehen verwendet werden (siehe unten).

Bsp. 1, Gruppenbruch mit Vorgängervergleich, PHP Umsetzung:

~~~ php
$array = array
  (
  'Alf' ,
  'Bibi Blocksberg' ,
  'Bibo' ,
  'Biene Maja' ,
  'Peter Pan' ,
  'Urmel aus dem Eis' ,
  );

$last_character = null;

// Elemente durchlaufen
foreach ($array as $entry) {
    $character = $entry[0];

    // Gruppenbruch, neuer Anfangsbuchstabe
    if ($last_character != $character) {
        echo 'Buchstabe: ' . $character . '<br />';
    }
    echo '  ' . $entry . '<br />';

    // neuen Vergleichswert setzen
    $last_character = $character;
    }
~~~

Bsp. 1, Ausgabe:

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



### Bruch nach sonstigen Kriterien

#### Modulo

Der Modulo ist der Rest einer Ganzzahldivision. Damit liefert `Modulo(n)` für
in einer Schleife durchlaufene numerische Werte für jeden n-ten Wert ein
identisches Ergebnis und ist so ein optimales Vergleichskriterium, um eine
Liste von Elementen gleichmäßig tabellarisch abzubilden. Der Modulo-Operator
wird in PHP mit einem Prozentzeichen (`%`) gekennzeichnet.

Beispielhaft wird nachfolgend eine imaginäre Datenbankausgabe ausgelesen und in
Dreiergruppen angeordnet. Im ersten Beispiel werden die Daten dazu
nebeneinander ausgeben und alle drei Durchläufe durch eine horizontale
Trennlinie durchbrochen.

Bsp. 2, Gruppenbruch mit Indexmodulo, PHP Umsetzung:

~~~
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

Bsp. 3a, Gruppenbruch mit Indexmodulo, PHP Umsetzung:

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

Bsp. 3b, Gruppenbruch mit Indexmodulo, datensatzabhängig, PHP Umsetzung:

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



### Alternativen

#### Abbildung einer Zwischenstruktur auf Arrays

Eine einfach Alternative bieten mehrdimensionale Arrays, die als Schlüssel der
obersten Ebene das Sortierkriterium nutzen und als Unterebene eine Menge von
automatisch angelegten numerischen Indizies.

Bsp. 4, Gruppierung über Zwischenarray, PHP Umsetzung:

~~~ php
$array = array
  (
  'Bibo' ,
  'Alf' ,
  'Peter Pan' ,
  'Biene Maja' ,
  'Bibi Blocksberg' ,
  'Urmel aus dem Eis' ,
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
    echo $character . '<br />';
    echo implode (' | ' , $set) . '<br />';
}
~~~

Bsp. 4, Strukturlisting und Ausgabe:

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

#### Verschachtelte Schleifen mit Abbruchbedingung

Bsp. 5, Gruppierung über Schleifenabbruch, PHP Umsetzung:

~~~ php
// ... Datenbankverbindung etc.

$elements = (0 < mysql_num_rows ($dbResult));

if ($elements) {
    echo '<table>';
    while ($elements) {
        echo '<tr>';

        // drei Elemente am Stück auslesen und ausgeben
        for ($index = 0; $index < 3; $index++) {
            // keine weiteren Elemente
            if (false === $set = mysql_fetch_assoc ($dbResult)) {
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

