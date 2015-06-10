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
    -   name:   "Verbindung herstellen"
        anchor: create-conn
        simple: ""

    -   name:   "Prepared Statements"
        anchor: prepared-statements
        simple: "mit und ohne Parameter, Varianten der Parameterbindung"

    -   name:   "Verweise"
        anchor: links
        simple: ""

---


Dieser Überblick beschäftigt sich mit konkreten Anwendungsbeispielen von PDO bzw. Prepared Statements mittels PDO. Weitere grundsätzliche Informationen dazu sind in der PHP-Doku zu finden:

* [PDO](http://php.net/manual/de/intro.pdo.php)
* [Prepared Statements](http://php.net/manual/de/pdo.prepared-statements.php)



### Verbindung herstellen [#](#create-conn)
{: #create-conn}

Nachfolgend wird die Verbindung zum [DBMS](http://de.wikipedia.org/w/index.php?title=DBMS) hergestellt.

~~~ php
$dsn  = 'mysql:dbname=test;host=localhost;charset=utf8';
$user = 'root';
$pass = '';
$options = array(
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ,
    PDO::ATTR_EMULATE_PREPARES => false
);
$pdo = new PDO($dsn, $user, $pass, $options);
~~~

**Hinweise zu den Optionsparametern**

Je nach Vorlieben bzw. Entwicklungsstil können Parameter auch anderweitig gesetzt werden. Nachfolgend zwei übliche Beispiele - weitere Parameter sind in der Doku zu finden.

* `PDO::FETCH_ASSOC` statt `PDO::FETCH_OBJ`<br>
Fetch-Varianten: [http://php.net/manual/de/pdostatement.fetch.php](http://php.net/manual/de/pdostatement.fetch.php)<br>
Hier verwenden wir durchgängig die objektorientierte (OO) Variante für den Zugriff auf die Eigenschaften.

* `PDO::ERRMODE_WARNING` statt `PDO::ERRMODE_EXCEPTION`<br>
Mögliche Error-Modi: [http://php.net/manual/de/pdo.error-handling.php](http://php.net/manual/de/pdo.error-handling.php)



#### Wiederverwendung der Verbindung [#](#recycle-conn)
{: #recycle-conn}

Benötigt eine Funktion oder ein Objekt eine DB-Verbindung, so wird die bestehende PDO-Instanz `$pdo` als Parameter übergeben.

**Beispiel - Funktion**

~~~ php
function getUsernameById($userID, $pdo) {
    // ...
}


// Funktionsaufruf
$username = getUsernameById(23, $pdo);
~~~

**Beispiel - Klasse**

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


### Prepared Statements  [#](#prepared-statements)
{: #prepared-statements}


[Dazu aus der PHP-Doku](http://php.net/manual/de/pdo.prepared-statements.php)

> Die Parameter für Prepared Statements müssen nicht maskiert werden. Der Treiber übernimmt das automatisch. Wenn eine Anwendung ausschließlich Prepared Statements benutzt, kann sich der Entwickler sicher sein, dass keine SQL-Injection auftreten wird. (Wenn aber trotzdem andere Teile der Abfrage aus nicht zuverlässigen Eingaben generiert werden, ist dies immer noch möglich.)


<div class="alert alert-info"><strong>`Backticks` vermeiden</strong><br>Einer der Vorteile von PDO ist die Portabilität zwischen den unterschiedlichen DBMS. Um dem zu entsprechen, sollten in der Query <strong>keine</strong> (MySQL spezifischen) <strong>`Backticks`</strong> verwendet werden. Daraus resultiert, das auf die <strong>Benennung der Spalten</strong> entsprechend zu achten ist, um <strong>nicht mit den reservierten Keywords</strong> des jeweilig verwendeten DBMS zu <strong>kollidieren</strong>.</div>


#### Query ohne Parameter [#](#no-param)
{: #no-param}

~~~ php
$sql = "SELECT username FROM user";
$stmt = $pdo->prepare($sql);

// Namen einzeln ausgeben
if ($stmt->execute()) {
    while ($row = $stmt->fetch()) {
        echo $row->username."<br>\n";
    }
}

// ODER

// alle Daten in ein Array überführen
$stmt->execute();
$arr = $stmt->fetchAll();
print_r($arr);
~~~



#### Mit Parameter - Bindung der Parameter [#](#with-param)
{: #with-param}

Nachfolgende Möglichkeiten bestehen u.a., um die Parameter an das Statement zu binden.


#### Parameter einzeln binden [#](#bind-param)
{: #bind-param}

~~~ php
// Query vorbereiten
$sql = "SELECT username, gender FROM user WHERE username = :username AND gender = :gender";
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

**Hinweis**<br>
Die Parameterbindung kann alternativ zu `bindParam()` mit `bindValue()` vorgenommen werden. Die Unterschiede sind in [diesem stackoverflow-Beitrag](http://stackoverflow.com/a/14413428) mittels kurzen Beispielen dargestellt.


#### Parameter per Array binden [#](#bind-array)
{: #bind-array}

~~~ php
// Query vorbereiten
$sql = "SELECT username, gender FROM user WHERE username = :username AND gender = :gender";
$stmt = $pdo->prepare($sql);

// Parameter übergeben und verarbeiten
$username = 'Sarah';
$gender = 'F';

$aParams = array(':username' => $username, ':gender' => $gender);
$stmt->execute($aParams);

echo $stmt->rowCount();
~~~


### Querverweise [#](#links)
{: #links}

* [Forums-Thread zu diesem Beitrag](http://www.php.de/forum/php-de-intern/wiki-diskussionsforum/1431002-pdo-beitrag)
* [PHP Data Objects-Erweiterung (PDO) auf php.net](http://php.net/manual/de/intro.pdo.php)
* [Arrays als JSON-String in SQL-Datenbank speichern]({{ page.root }}/jumpto/array-as-json-to-sqldb/)
