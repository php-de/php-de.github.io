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


## [Querverweise](#bedingung)
{: #links}

- [Gruppenbruch]({{ page.root }}/jumpto/gruppenbruch/)
