---
layout: guide

permalink: /jumpto/pdo/
root: ../..
title: "PDO (PHP Data Objects)"
group: "Standard Implementierungsansätze / Code-Snippets"
orderId: 21

creator: hausl
author:
    -   name: hausl
        profile: 21246

inhalt:
    -   name:   "Verbindung erstellen"
        anchor: create-conn
        simple: ""

    -   name:   "Einfache Query ohne Parameter"
        anchor: simple-query
        simple: ""

    -   name:   "Prepared Statements"
        anchor: prepared-statements
        simple: "Varianten der Parameterbindung"

    -   name:   "Verweise"
        anchor: links
        simple: ""


entry-type: in-discussion
---


Dieser Überblick beschäftigt sich mit konkreten Anwendungsbeispielen von PDO bzw. Prepared Statements mittels PDO. Weitere grundsätzliche Informationen dazu sind in der PHP-Doku zu finden:

* [PDO](http://php.net/manual/de/intro.pdo.php){:target="_blank"}
* [Prepared Statements](http://php.net/manual/de/pdo.prepared-statements.php){:target="_blank"}


### Verbindung herstellen
{: #create-conn}

Zuerst wird die Verbindung zum DBMS hergestellt.

~~~ php
$dsn  = 'mysql:dbname=test;host=localhost;charset=utf8';
$user = 'root';
$pass = '';
$options = array(
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ
);
$pdo = new PDO($dsn, $user, $pass, $options);
~~~

**Hinweise zu den Optionsparametern**

Je nach Vorlieben bzw. Entwicklungsstil können Parameter auch anderweitig gesetzt werden. Nachfolgend zwei bekannte Beispiele - weitere Parameter sind in der Doku zu finden.

* `PDO::FETCH_ASSOC` statt `PDO::FETCH_OBJ`<br>
Fetch-Varianten: [http://php.net/manual/de/pdostatement.fetch.php](http://php.net/manual/de/pdostatement.fetch.php){:target="_blank"}<br>
Hier verwenden wir durchgängig die objektorientierte (OO) Variante für den Zugriff auf die Eigenschaften.

* `PDO::ERRMODE_WARNING` statt `PDO::ERRMODE_EXCEPTION`<br>
Mögliche Error-Modi: [http://php.net/manual/de/pdo.error-handling.php](http://php.net/manual/de/pdo.error-handling.php){:target="_blank"}



#### Wiederverwendung der Verbindung
{: #verbindung-param}

Benötigt eine Funktion oder ein Objekt eine DB-Verbindung, so wird die bestehende PDO-Instanz `$pdo` als Parameter übergeben.

Beispiel einer Funktion

~~~ php
function getUsernameById($userID, $pdo) {

    // ...
}


// Funktionsaufruf
$username = getUsernameById(23, $pdo);
~~~

Beispiel einer Klasse

~~~ php
class User
{
    private $pdo; // Eigenschaft deklarieren

    public function __construct($pdo) {
        // PDO-Objekt an die Eigenschaft übergeben
        // diese steht nun in der ganzen Klasse
        // per $this->pdo zur Verfügung.
        $this->pdo = $pdo;
    }

    // ...
}


// Aufruf / Instantiierung
$user = new User($pdo);
~~~



### Einfache Query ohne Parameter
{: #simple-query}

Gibt es keine Parameter von "aussen", so ist der Einsatz von Prepared Statements nicht zwingend nötig.

~~~ php
$sql = "SELECT `username` FROM `user`";

$stmt = $pdo->query($sql);

// zB Anzahl ausgeben
echo $stmt->rowCount();

// Namen einzeln ausgeben
if ($stmt->execute()) {
    while ($row = $stmt->fetch()) {
        echo $row->username."<br>\n";
    }
}

// ODER

// alle Daten in ein Array überführen
$arr = $stmt->fetchAll();
print_r($arr);

~~~


### Prepared Statements
{: #prepared-statements}


[Dazu aus der PHP-Doku](http://php.net/manual/de/pdo.prepared-statements.php){:target="_blank"}

> Die Parameter für Prepared Statements müssen nicht maskiert werden. Der Treiber übernimmt das automatisch. Wenn eine Anwendung ausschließlich Prepared Statements benutzt, kann sich der Entwickler sicher sein, dass keine SQL-Injection auftreten wird. (Wenn aber trotzdem andere Teile der Abfrage aus nicht zuverlässigen Eingaben generiert werden, ist dies immer noch möglich.)


#### Bindung der Parameter
{: #bindings}

Nachfolgende Möglichkeiten bestehen u.a., um die Parameter an das Statement zu binden.


#### Parameter einzeln binden
{: #bind-param}

~~~ php
// Query vorbereiten
$sql = "SELECT `username`, `gender` FROM `user` WHERE `username` = :username AND `gender` = :gender";
$stmt = $pdo->prepare($sql);

// Parameter übergeben und verarbeiten
$username = 'Joachim';
$gender = 'M';

$stmt->bindParam(':username', $username);
$stmt->bindParam(':gender',   $gender);

if ($stmt->execute()) {
    $row = $stmt->fetch();
    echo $row->username;
}
~~~

**Hinweis:** Die Parameterbindung kann alternativ zu `bindParam()` noch mit `bindValue()` vorgenommen werden. Die Unterschiede sind in [diesem stackoverflow-Beitrag](http://stackoverflow.com/a/14413428){:target="_blank"} mittels kurzen Beispielen dargestellt.


#### Parameter per Array binden
{: #bind-array}

~~~ php
// Query vorbereiten
$sql = "SELECT `username`, `gender` FROM `user` WHERE `username` = :username AND `gender` = :gender";
$stmt = $pdo->prepare($sql);

// Parameter übergeben und verarbeiten
$username = 'Sarah';
$gender = 'F';

$aParams = array(':username' => $username, ':gender' => $gender);
$stmt->execute($aParams);

echo $stmt->rowCount();
~~~


### Querverweise
{: #links}

* [PHP Data Objects-Erweiterung (PDO) auf php.net](http://php.net/manual/de/intro.pdo.php){:target="_blank"}
* [Arrays als JSON-String in SQL-Datenbank speichern]({{ page.root }}/jumpto/array-as-json-to-sqldb/){:target="_blank"}
