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
        simple: "Welche Varianten gibt es?"

    -   name:   "Verweise"
        anchor: links
        simple: ""


entry-type: in-progress

---


Dieser Überblick beschäftigt sich mit konkreten Anwendungsbeispielen von PDO bzw. Prepared Statements mit PDO. Weitere Informationen dazu sind in der PHP-Doku zu finden:

* [PDO](http://php.net/manual/de/intro.pdo.php)
* [Prepared Statements](http://php.net/manual/de/pdo.prepared-statements.php)


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

Je nach Vorlieben bzw. Entwicklungsumgebung können Parameter auch anderweitig gesetzt werden. Nachfolgend zwei bekannte Beispiele - weitere Parameter sind in der Doku zu finden.

* `PDO::FETCH_ASSOC` Fetch-Varianten: [http://php.net/manual/de/pdostatement.fetch.php]([http://php.net/manual/de/pdostatement.fetch.php)
Hier wird durchgängig die objektorientierte (OO) Variante für den Zugriff auf die Eigenschaften verwendet.

* `PDO::ERRMODE_EXCEPTION` Mögliche Error-Modi: [http://php.net/manual/de/pdo.error-handling.php](http://php.net/manual/de/pdo.error-handling.php)



#### Wiederverwendung der Verbindung
{: #verbindung-param}

Benötigt eine Funktion oder ein Objekt eine DB-Verbindung, so wird die bestehende PDO-Instanz `$pdo` dorthin als Parameter übergeben.

~~~ php
function getUsernameById($userID, $pdo) {
    // ...
}

// oder

// Übergabe ins Objekt
$user = new User($pdo);
~~~



### Einfache Query ohne Parameter
{: #simple-query}

Gibt es keine Parameter von "aussen", so ist der Einsatz von Prepared Statements nicht nötig.

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

// alle Daten in ein Array holen
$arr = $stmt->fetchAll();
print_r($arr);

~~~


### Prepared Statements
{: #prepared-statements}

PHP-Doku:

*Die Parameter für Prepared Statements müssen nicht maskiert werden. Der Treiber übernimmt das automatisch. Wenn eine Anwendung ausschließlich Prepared Statements benutzt, kann sich der Entwickler sicher sein, dass keine SQL-Injection auftreten wird. (Wenn aber trotzdem andere Teile der Abfrage aus nicht zuverlässigen Eingaben generiert werden, ist dies immer noch möglich.)*


**Nachfolgende Möglichkeiten bestehen (u.a.) um die Parameter zu übergeben bzw. an das Statement zu binden.**


#### Parameter einzeln binden
{: #bind-param}

~~~ php
$username = "Joachim";
$gender = 'M';

$sql = "SELECT `username`, `gender` FROM `user` WHERE `username` = :username AND `gender` = :gender";
$stmt = $pdo->prepare($sql);

$stmt->bindParam(':username', $username, PDO::PARAM_STR);
$stmt->bindParam(':gender',   $gender,   PDO::PARAM_STR);
if ($stmt->execute()) {
    $row = $stmt->fetch();
    echo $row->username;
}
~~~


#### Parameter per Array binden
{: #bind-array}

~~~ php
$username = 'Sarah';
$gender = 'F';

$sql = "SELECT `username`, `gender` FROM `user` WHERE `username` = :username AND `gender` = :gender";
$stmt = $pdo->prepare($sql);

// Parameter-Array
$aParams = array(':username' => $username, ':gender' => $gender);
$stmt->execute($aParams);

echo $stmt->rowCount();
~~~


#### Multi-Execute
{: #multi-execute}

**Anmerkung:**<br>
Dieses Beispiel dient der syntaktischen Demonstration der Anwendung. Speziell bei INSERT Operationen sollte eine einzige(!) Query erzeugt und an die DB geschickt werden. Die DB mit Queries in Schleifen zu "befeuern" ist grundsätzlich zu vermeiden!

~~~ php
$sql = "INSERT INTO `user` (`username`, `gender`) VALUES (:user, :gender)";

$stmt = $pdo->prepare($sql);
$stmt->bindParam(':username', $username);
$stmt->bindParam(':gender', $gender);

// einen Datensatz einfügen
$username = 'Sarah';
$gender = 'F';
$stmt->execute();

// einen weiteren Datensatz mit anderen Werten einfügen
$username = 'Rolf';
$gender = 'M';
$stmt->execute();
~~~


### Querverweise
{: #links}

* [Einführung zur *"PHP Data Objects-Erweiterung (PDO)"* auf php.net](http://php.net/manual/de/intro.pdo.php)
* [Arrays als JSON-String in SQL-Datenbank speichern]({{ page.root }}/jumpto/array-as-json-to-sqldb/)
