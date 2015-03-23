---
layout: guide

permalink: /jumpto/pdo/
root: ../..
title: "PDO"
group: "Standard Implementierungsansätze / Code-Snippets"
orderId: 21

creator: hausl
author:
    -   name: hausl
        profile: 21246

inhalt:
    -   name:   ""
        anchor:
        simple: ""

    -   name:   ""
        anchor:
        simple: ""

    -   name:   ""
        anchor:
        simple: ""


entry-type: in-progress

---


### in Arbeit ...



**INIT**

~~~ php
$host = "localhost";
$name = "test";
$user = "root";
$pass = "";
$options = array(
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
);

$pdo = new PDO('mysql:host='.$host.';dbname='.$name, $user, $pass, $options);
~~~


**EINFACH ABFRAGE OHNE DATEN VON AUSSEN**


~~~ php
$sql = "SELECT `name` FROM `user`";

$stmt = $pdo->query($sql);

// Anzahl ausgeben
echo $stmt->rowCount();

// alle Daten in Array holen
$arr = $stmt->fetchAll();
print_r($arr);

// ODER
// Alle Namen einzeln ausgeben lassen
if ($stmt->execute()) {
    while ($row = $stmt->fetch()) {
        echo $row['name']."<br>\n";
    }
}
~~~

**PREPARED STATMENT**


**LOGIN**

~~~ php
$username = "hans55";

$sql = "SELECT `name`, `password_hash` FROM `user` WHERE `name` = :username LIMIT 1";

$stmt = $pdo->prepare($sql);
$stmt->bindParam(':username', $username, PDO::PARAM_STR);

if ($stmt->execute()) {
    $row = $stmt->fetch();
    echo $row['name']."<br>\n";
    echo $row['password_hash']."<br>\n";
}
~~~


**INSERT**


~~~ php
$sql = "INSERT INTO `user` (`name`, `gender`) VALUES (:name, :gender)";

$stmt = $pdo->prepare($sql);
$stmt->bindParam(':name', $name);
$stmt->bindParam(':gender', $gender);

// eine Zeile einfügen
$name = 'Sarah';
$gender = 'F';
$stmt->execute();

// eine weitere Zeile mit anderen Werten einfügen
$name = 'Rolf';
$gender = 'M';
$stmt->execute();
~~~
