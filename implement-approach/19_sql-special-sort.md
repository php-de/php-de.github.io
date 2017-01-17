---
layout: guide

permalink: /jumpto/sql-special-sort/
root: ../..
title: "SQL - Spezielle Sortierungen"
group: "Standard Implementierungsansätze / Code-Snippets"
orderId: 19

creator: hausl
author:
    -   name: hausl
        profile: 21246

inhalt:
    -   name:   "Sortierung nach unterschiedlichen Kriterien"
        anchor: div-kriterien
        simple: ""

    -   name:   "Vorsortierung nach einer Bedingung"
        anchor: bedingung
        simple: ""

    -   name:   "Blockweise Sortierung nach einem Wert je Block"
        anchor: block
        simple: ""

    -   name:   "Querverweise"
        anchor: links
        simple: ""


entry-type: in-discussion
---

Manchmal möchte man eine spezielle Sortierung der Ausgabe, welche mit dem üblichen
`ORDER BY field1, field2, ...` nicht erreicht werden kann. Nachfolgend ein paar Beispiele
mit Lösungsansätzen dazu.


## [Sortierung nach unterschiedlichen Kriterien](#div-kriterien)
{: #div-kriterien}

Dazu verwenden wir folgende Ausgangstabelle:

~~~ sql
SELECT name, date_birth FROM persons

+---------+------------+
| name    | date_birth |
+---------+------------+
| Stefan  | 1955-08-01 |
| Andrea  | 1966-11-01 |
| Klaus   | 1978-02-01 |
| Petra   | 2000-10-02 |
| Joachim | 2002-01-01 |
| Sandra  | 1980-12-01 |
| Dieter  | 1950-03-01 |
| Claudia | 2002-05-01 |
+---------+------------+
8 rows in set (0.00 sec)
~~~


Möchten wir uns nun beispielsweise die ältesten drei Personen ausgeben lassen,
so reicht dafür ein `LIMIT 3` mit der entsprechenden Sortierung aus.

~~~ sql
SELECT name, date_birth FROM persons ORDER BY date_birth LIMIT 3

+--------+------------+
| name   | date_birth |
+--------+------------+
| Dieter | 1950-03-01 |
| Stefan | 1955-08-01 |
| Andrea | 1966-11-01 |
+--------+------------+
3 rows in set (0.00 sec)
~~~


Wollen wir nun wieder die ältersten drei Personen ausgeben, dieses mal jedoch, entgegen der obigen für `LIMIT` nötigen Sortierlogik,
 von jung nach alt (also umgekehrt) sortieren lasen, benötigen wir ein Sub-Select.

~~~ sql
SELECT * FROM
  (SELECT name, date_birth FROM persons ORDER BY date_birth LIMIT 3) AS sub
ORDER BY sub.date_birth DESC

+--------+------------+
| name   | date_birth |
+--------+------------+
| Andrea | 1966-11-01 |
| Stefan | 1955-08-01 |
| Dieter | 1950-03-01 |
+--------+------------+
3 rows in set (0.00 sec)
~~~


Je nach Belieben kann die `ORDER`-Klausel verändert werden, z.B. die ältersen drei Personen, alphabetisch sortiert.

~~~ sql
SELECT * FROM
  (SELECT name, date_birth FROM persons ORDER BY date_birth LIMIT 3) AS sub
ORDER BY sub.name

+--------+------------+
| name   | date_birth |
+--------+------------+
| Andrea | 1966-11-01 |
| Dieter | 1950-03-01 |
| Stefan | 1955-08-01 |
+--------+------------+
3 rows in set (0.00 sec)
~~~


## [Vorsortierung nach einer Bedingung](#bedingung)
{: #bedingung}

Ein anderer Fall ist eine Art Vorsortierung nach einer gewissen Bedingung.

Angenommen folgende Ausgangstabelle, in der das Geburtsdatum von
Klaus und Sandra noch nicht bekannt, und daher mit `NULL` gesetzt ist.

~~~ sql
SELECT name, date_birth FROM persons

+---------+------------+
| name    | date_birth |
+---------+------------+
| Stefan  | 1955-08-01 |
| Andrea  | 1966-11-01 |
| Klaus   | NULL       |
| Petra   | 2000-10-02 |
| Joachim | 2002-01-01 |
| Sandra  | NULL       |
| Dieter  | 1950-03-01 |
| Claudia | 2002-05-01 |
+---------+------------+
8 rows in set (0.00 sec)
~~~


Nun wollen wir uns zuerst alle Personen ausgeben lassen, die noch kein Geburtsdatum haben,
und danach alle anderen, und das alphabetisch sortiert. Da dies mittels einem einfachen
`ORDER BY date_birth, name` nicht wie gewünscht funktioniert, müssen wir in diesem Fall
ein zusätzliches `IS NULL` in der `ORDER`-Klausel verwenden.

~~~ sql
SELECT name, date_birth FROM persons ORDER BY date_birth IS NULL DESC, name

+---------+------------+
| name    | date_birth |
+---------+------------+
| Klaus   | NULL       |
| Sandra  | NULL       |
| Andrea  | 1966-11-01 |
| Claudia | 2002-05-01 |
| Dieter  | 1950-03-01 |
| Joachim | 2002-01-01 |
| Petra   | 2000-10-02 |
| Stefan  | 1955-08-01 |
+---------+------------+
8 rows in set (0.00 sec)
~~~



## [Blockweise Sortierung nach einem Wert je Block](#block)
{: #block}

Wir haben Kunden und zu jedem Kunden mehrere Aufträge.
Es sollen die Aufträge "geblockt nach Kunden" so ausgeben werden,
dass die Blöcke in sich nach Datum sortiert sind. Zusätzlich soll
der gesamte Block mit dem aktuellsten/jüngsten Datum zuerst erscheinen.

**Die Kunden**

~~~ sql
SELECT id, name FROM kunde

+----+----------+
| id | name     |
+----+----------+
|  1 | Aigner   |
|  2 | Gruber   |
|  3 | Sandmann |
+----+----------+
3 rows in set (0.00 sec)
~~~


**Die Aufträge**

~~~ sql
SELECT id, kunde_id, produkt, deadline
FROM auftrag
ORDER BY deadline

+----+----------+--------------+------------+
| id | kunde_id | produkt      | deadline   |
+----+----------+--------------+------------+
|  1 |        3 | Tisch eckig  | 2017-02-01 |
|  4 |        1 | Kasten       | 2017-03-15 |
|  7 |        2 | Gartenzaun   | 2017-04-01 |
|  5 |        1 | Tisch rund   | 2017-04-15 |
|  2 |        3 | Vitrine      | 2017-05-01 |
|  9 |        2 | Schreibtisch | 2017-09-01 |
|  6 |        1 | Essecke      | 2017-10-01 |
|  8 |        2 | Carport      | 2017-10-15 |
|  3 |        3 | Lampe        | 2018-02-01 |
+----+----------+--------------+------------+
9 rows in set (0.00 sec)
~~~


**Ergibt "gejoint"**

~~~ sql
SELECT k.id, k.name, a.produkt, a.deadline
FROM kunde k
INNER JOIN auftrag a ON k.id = a.kunde_id
ORDER BY deadline

+----+----------+--------------+------------+
| id | name     | produkt      | deadline   |
+----+----------+--------------+------------+
|  3 | Sandmann | Tisch eckig  | 2017-02-01 |
|  1 | Aigner   | Kasten       | 2017-03-15 |
|  2 | Gruber   | Gartenzaun   | 2017-04-01 |
|  1 | Aigner   | Tisch rund   | 2017-04-15 |
|  3 | Sandmann | Vitrine      | 2017-05-01 |
|  2 | Gruber   | Schreibtisch | 2017-09-01 |
|  1 | Aigner   | Essecke      | 2017-10-01 |
|  2 | Gruber   | Carport      | 2017-10-15 |
|  3 | Sandmann | Lampe        | 2018-02-01 |
+----+----------+--------------+------------+
9 rows in set (0.00 sec)
~~~


Zuerst brauchen wir das jeweils jüngste Datum der Aufträge je Kunde.

~~~ sql
SELECT k.id, k.name, MIN(a.deadline) AS min_date
FROM kunde k
INNER JOIN auftrag a ON k.id = a.kunde_id
GROUP BY k.id, k.name
ORDER BY min_date

+----+----------+------------+
| id | name     | min_date   |
+----+----------+------------+
|  3 | Sandmann | 2017-02-01 |
|  1 | Aigner   | 2017-03-15 |
|  2 | Gruber   | 2017-04-01 |
+----+----------+------------+
3 rows in set (0.00 sec)
~~~

Nun verwenden wir diese Daten als "innere" Tabelle
und joinen uns den Rest wie benötigt dazu.

~~~ sql
SELECT
    k.id, k.name,
    a.produkt, a.deadline,
    k.min_date
FROM
    (
        -- frühestes deadline-datum je kunde
        SELECT k.id, k.name, MIN(a.deadline) AS min_date
        FROM kunde k
        INNER JOIN auftrag a ON k.id = a.kunde_id
        GROUP BY k.id
        ORDER BY min_date
    ) k
INNER JOIN auftrag a ON k.id = a.kunde_id
ORDER BY k.min_date, a.deadline

+----+----------+--------------+------------+------------+
| id | name     | produkt      | deadline   | min_date   |
+----+----------+--------------+------------+------------+
|  3 | Sandmann | Tisch eckig  | 2017-02-01 | 2017-02-01 |
|  3 | Sandmann | Vitrine      | 2017-05-01 | 2017-02-01 |
|  3 | Sandmann | Lampe        | 2018-02-01 | 2017-02-01 |
|  1 | Aigner   | Kasten       | 2017-03-15 | 2017-03-15 |
|  1 | Aigner   | Tisch rund   | 2017-04-15 | 2017-03-15 |
|  1 | Aigner   | Essecke      | 2017-10-01 | 2017-03-15 |
|  2 | Gruber   | Gartenzaun   | 2017-04-01 | 2017-04-01 |
|  2 | Gruber   | Schreibtisch | 2017-09-01 | 2017-04-01 |
|  2 | Gruber   | Carport      | 2017-10-15 | 2017-04-01 |
+----+----------+--------------+------------+------------+
9 rows in set (0.00 sec)
~~~

**Fertig!**<br>
Dies kann nun mit dem [Gruppenbruch]({{ page.root }}/jumpto/gruppenbruch/) wie gewünscht ausgegeben werden.


**Hinweis zur `WHERE`-Klausel**

Aus Performancegründen sollten Bedingungen möglichst in der inneren
Query notiert werden. Bspw. sollte ein Filter nach einer Kundengruppe so aussehen:

~~~ sql
SELECT
    k.id, k.name,
    a.produkt, a.deadline,
    k.min_date
FROM
    (
        -- frühestes deadline-datum je kunde
        SELECT k.id, k.name, MIN(a.deadline) AS min_date
        FROM kunde k
        INNER JOIN auftrag a ON k.id = a.kunde_id
        WHERE k.gruppe = 'A' -- Hier ist der Filter anzugeben
        GROUP BY k.id
        ORDER BY min_date
    ) k
INNER JOIN auftrag a ON k.id = a.kunde_id
ORDER BY k.min_date, a.deadline
~~~


## [Querverweise](#bedingung)
{: #links}

- [Gruppenbruch]({{ page.root }}/jumpto/gruppenbruch/)
