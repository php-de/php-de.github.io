---
layout: guide

permalink: /jumpto/verzeichnis-auslesen/
title: "Verzeichnis auslesen"
group: "HTTP / URL / Requests / Dateisystem"
orderId: 8

creator: nikosch
author:
    -   name: nikosch
        profile: 2314

    -   name: mermshaus
        profile: 15041

inhalt:
    -   name: "Hinweis"
        anchor: hinweis
        simple: ""

    -   name: "Der moderne Weg"
        anchor: der-moderne-weg
        simple: ""

    -   name: "Grundlage"
        anchor: grundlage
        simple: ""

    -   name: "Erweiterung"
        anchor: erweiterung
        simple: ""

    -   name: "Unterverzeichnisse rekursiv auslesen"
        anchor: unterverzeichnisse-rekursiv-auslesen
        simple: ""

    -   name: "Verarbeitung der Inhalte"
        anchor: verarbeitung-der-inhalte
        simple: ""

    -   name: "Anmerkungen"
        anchor: anmerkungen
        simple: ""

entry-type: in-discussion
---

### Hinweis

* Der Übersichtlichkeit halber werden Kommentare des vorhergehenden Codes
  teilweise weggelassen.
* Die Beispielcodes machen Gebrauch von sogenanntem „linksgehaltenem Code“. Es
  ist sinnvoll, sich vor der Lektüre mit diesem Ansatz vertraut zu machen.



### Der moderne Weg

Das folgende Beispiel nutzt
[SPL-Klassen](http://us3.php.net/manual/en/book.spl.php), die in PHP 5.3
hinzugefügt wurden. Iteratoren sind der empfohlene Weg, das Dateisystem
rekursiv zu durchlaufen.

~~~ php
$iterator = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator(__DIR__)
);

foreach ($iterator as $file) {
    /* @var $file SplFileInfo */

    if (false === $file->isFile()) {
        continue;
    }

    echo $file->getPathname() . "\n";
}
~~~



### Grundlage

~~~ php
$dir = '/path/to/files/';

// Verzeichnis öffnen
$handle = opendir($dir);

// Auslesen bis readdir FALSE zurückgibt
while (false !== ($file = readdir($handle))) {

    // Verarbeitung des Dateinamens, Zuweisung o.ä.
    $file;

}
closedir($handle);
~~~



### Erweiterung

* Fehlerkontrolle (fehlendes oder nicht lesbares Verzeichnis)
* Ausschluss der Dateieinträge `.` (Selbstreferenz) und `..` (übergeordneter
  Ordner)
* Ausschluss von Unterverzeichniseinträgen

~~~ php
$dir = '/path/to/files/';

if (false === is_dir($dir)) {
    // Fehlerverarbeitung
    // Abbruch
    die;
}

$handle = opendir($dir);

if (false === $handle) {
    // Fehlerverarbeitung
    // Abbruch
    die;
}

while (false !== ($file = readdir($handle))) {

    // Ausschluss von . und ..
    if ('.' == $file || '..' == $file) {
        // nächstes Element
        continue;
    }

    // Ausschluss von Verzeichnisnamen
    if (is_dir($dir . $file)) {
        // nächstes Element
        continue;
    }

    // Verarbeitung des Dateinamens, Zuweisung o.ä.
    $file;

}
closedir($handle);
~~~

#### Hinweis

Hier und nachfolgend muss sichergestellt werden, dass `$dir` einen
abschließenden `/` enthält. Grund ist die Kombination mit dem ausgelesenen
Datenamen über `$dir .  $file`. Dies kann beispielsweise durch dieses
Codefragment sicher gestellt werden.

~~~ php
$dir = rtrim($dir , ' /\\') . '/';
~~~

Ebenfalls ist die Problematik verschiedener Pfadbegrenzern (`/` und `\`) zu
berücksichtigen.



### Unterverzeichnisse rekursiv auslesen

Um im Leseordner auch die Einträge von Unterverzeichnissen zu berücksichtigen,
wird ein Teil Funktionalität in eine selbstaufrufende Funktion ausgelagert.

~~~ php
function readDirRecursive($dir)
{
    if (false === is_dir($dir)) {
        return false;
    }

    $handle = opendir($dir);

    if (false === $handle) {
        return false;
    }

    while (false !== ($file = readdir($handle))) {

        // Ausschluss von . und ..
        if ('.' == $file || '..' == $file) {
            // nächstes Element
            continue;
        }

        // Verarbeitung von Verzeichnisnamen
        if (is_dir($dir . $file)) {

            // Selbstaufruf
            readDirRecursive($dir . $file . '/');

            // nächstes Element
            continue;
        }

        // Verarbeitung des Dateinamens, Zuweisung o.ä.
        $file;

    }
    closedir($handle);

    return true;
}


$dir = '/path/to/files';

readDirRecursive($dir);
~~~



### Verarbeitung der Inhalte

Bisher wurden die Dateinamen noch nicht weiter verarbeitet. Sollen die
Dateinamen nicht direkt ausgegeben werden, sondern beispielsweise in ein Array
eingehen, macht es uns die Funktionskapselung etwas schwieriger. Nachfolgend
werden zwei Arten aufgeführt: Die Rückgabe via `return` und die Nutzung eines
referentiellen Parameters.

Grundlage ist bei beiden Lösungen ein Sammeln der Dateinamen im Array
`$result`.  Die Einträge werden dabei in Reihenfolge der Abarbeitung erstellt:
Ein an der Leseposition gefundenes Unterverzeichnis wird zuerst durchlaufen
(und gegebenenfalls weitere in ihm), bevor zur nächsten Position
zurückgesprungen wird.

#### Array Return

Hier ist die Fehlerausgabe `false` zu beachten, die im Anfang der Funktion
erfolgen kann.

~~~ php
function readDirRecursive($dir)
{
    if (false === is_dir($dir)) {
        return false;
    }

    $handle = opendir($dir);

    if (false === $handle) {
        return false;
    }

    $result = array();

    while (false !== ($file = readdir($handle))) {

        // Ausschluss von . und ..
        if ('.' == $file || '..' == $file) {
            // nächstes Element
            continue;
        }

        // Verarbeitung von Verzeichnisnamen
        if (is_dir($dir . $file)) {

            // Selbstaufruf
            $resultSubdir = readDirRecursive($dir . $file . '/');

            // gültige Werte dem Rsultset hinzufügen
            if (false !== $resultSubdir) {
                $result = array_merge($result , $resultSubdir);
            }

            // nächstes Element
            continue;
        }

        // Array Zuweisung des Dateinamens
        $result[] = $file;

    }
    closedir($handle);

    return $result;
}


$dir = '/path/to/files';

$result = readDirRecursive($dir);
~~~

#### Referenz-Aufruf

Der Vorteil dieser Funktion: Es muß nicht mit einer Zwischenmenge
`$resultSubdir` gearbeitet werden, da der rekursive Aufruf direkt in die
Ergebnismenge schreiben kann. Weiterhin bleibt der Rückgabewert der Funktion
frei und könnte beispielsweise bei einem Verzeichnislesefehler ein entstehendes
`false` bis zum Ur-Aufruf „durchschleifen“.

~~~ php
function readDirRecursive($dir , & $result)
{
    if (false === is_dir($dir)) {
        return false;
    }

    $handle = opendir($dir);

    if (false === $handle) {
        return false;
    }

    while (false !== ($file = readdir($handle))) {

        // Ausschluss von . und ..
        if ('.' == $file || '..' == $file) {
            // nächstes Element
            continue;
        }

        // Verarbeitung von Verzeichnisnamen
        if (is_dir($dir . $file)) {

            // Selbstaufruf
            readDirRecursive($dir . $file . '/' , $result);

            // nächstes Element
            continue;
        }

        // Array Zuweisung des Dateinamens
        $result[] = $file;

    }
    closedir($handle);

    return true;
}


$dir = '/path/to/files';

$result = array();
readDirRecursive($dir , $result);
~~~



### Anmerkungen

#### Verzeichnisprüfung

Da die Einträge `.` und `..` in jedem normalen Verzeichnis vorhanden sind und
stets als erste Einträge zurückgegeben werden, wird oft statt `is_dir($file)`
eine alternative Syntax gebraucht: Es werden zwei pauschale `readdir($handle)`;
Aufrufe gestartet, deren Rückgabe nicht verarbeitet wird.

Diese Aufrufe müssen natürlich vor der while Schleife erfolgen.

#### `readdir` Rückgabe

Das PHP Manual stellt ausdrücklich in seinem Beispiel die Verwendung von `while
(false !== ($file = readdir($handle)))` als korrekt gegenüber `while ($file =
readdir($handle))` heraus.

Hintergrund: Nur die Identitätsprüfung (===) bzw. deren Negation nimmt eine explizite Typprüfung vor.

Alle anderen Vergleiche unterscheiden faktisch nicht zwischen `null`, `''`
(leerer String), `0`, `'0'` und anderen. Ein Dateiname namens `"0"` würde hier
also beispielsweise zum Schleifenabbruch führen.

Analog sind die folgenden Schleifenbedingungen falsch:

~~~ php
while (false != ($file = readdir($handle)) {}
while (! false == ($file = readdir($handle)) {}
~~~

#### Verzeichnisse auslesen

Natürlich ist auch das Auslesen aller „Nicht-Dateien“ (Verzeichnisse) möglich.
Dabei kehren sich quasi die Bearbeitung der Zustände `is_dir($file)` und
„restliche“ um. Der Selbstaufruf muss natürlich weiterhin für
Verzeichniseinträge erfolgen. Relevanter Schleifencode:

~~~ php
while (false !== ($file = readdir($handle))) {

    // Ausschluss von . und ..
    if ('.' == $file || '..' == $file) {
        // nächstes Element
        continue;
    }

    // Verarbeitung von Verzeichnisnamen
    if (is_dir($dir . $file)) {

        // Verarbeitung des Verzeichnisnamens, Zuweisung o.ä.
        $file;

        // Selbstaufruf
        readDirRecursive($dir . $file . '/');
    }

    // Else Fall: Für Dateien passiert nichts
}
~~~

