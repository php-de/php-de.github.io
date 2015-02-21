---
layout: guide

permalink: /jumpto/sql-special-sort/
title: "SQL - Spezielle Sortierungen"
group: "Standard Implementierungsansätze / Code-Snippets"
orderId: 19

creator: hausl
author:
    -   name: hausl
        profile: 21246

inhalt:
    -   name:   "Soriterung nach unterschiedlichen Kriterien"
        anchor: div-kriterien
        simple: ""

    -   name:   "Vorsortierung nach einer Bedingung"
        anchor: bedingung
        simple: ""

    -   name:   "Querverweise"
        anchor: links
        simple: ""


entry-type: in-progress
---

Oft möchte man eine spezielle, abweichende Sortierung erhalten, welche mit dem üblichen 
`ORDER BY field1, field2` nicht erreicht werden kann. Nachfolgend ein paar Beispiele dazu.


### Sortierung nach unterschiedlichen Logiken
{: #div-kriterien}

Dazu verwenden wir folgende Ausgangstabelle:

~~~ sql
SELECT name, date_birth FROM persons
~~~

~~~
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


Möchten wir uns nun beispielsweise die ältersten drei Personen ausgeben lassen,
so reicht bekannterweise ein LIMIT 3 dafür aus.

~~~
SELECT name, date_birth FROM persons LIMIT 3
~~~

~~~
+--------+------------+
| name   | date_birth |
+--------+------------+
| Stefan | 1955-08-01 |
| Andrea | 1966-11-01 |
| Klaus  | 1978-02-01 |
+--------+------------+
3 rows in set (0.00 sec)
~~~


Wollen wir jedoch die ältersten drei Personen ausgeben, diese jedoch entgegen der obigen, 
für LIMIT nötigen, Sortierung von jung nach alt soriteren lasen, benötigen wir ein Sub-Select.

~~~
SELECT * FROM
  (SELECT name, date_birth FROM persons LIMIT 3) AS sub
ORDER BY sub.date_birth DESC
~~~

~~~
+--------+------------+
| name   | date_birth |
+--------+------------+
| Klaus  | 1978-02-01 |
| Andrea | 1966-11-01 |
| Stefan | 1955-08-01 |
+--------+------------+
3 rows in set (0.00 sec)
~~~

Je nach Belieben kann die ORDER-Klausel verändert werden, z.B die ältersen drei Personen, 
jedoch alphabetisch sortiert.

~~~
SELECT * FROM
  (SELECT name, date_birth FROM persons LIMIT 3) AS sub
ORDER BY sub.name
~~~

~~~
+--------+------------+
| name   | date_birth |
+--------+------------+
| Andrea | 1966-11-01 |
| Klaus  | 1978-02-01 |
| Stefan | 1955-08-01 |
+--------+------------+
3 rows in set (0.00 sec)
~~~


### Vorsortierung nach einer Bedingung
{: #bedingung}

Ein etwas anderer Fall ist eine Art Vorsortierung nach einer gewissen Bedingung.

Angenommen sein nun folgende Ausgangstabelle, in der uns das Geburtsdatum von 
Sandra und Klaus noch nicht bekannt, und daher mit NULL gesetzt ist.

~~~
SELECT name, date_birth FROM persons
~~~

~~~
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


Nun wollen wir uns zuerst alle ausgeben lassen, die noch kein Gebturtsdatum haben,
und danach alle anderen, aber alphabetisch sortiert. Da dies mittels `ORDER BY date_birth, 
name` nicht mehr wie gewünscht funktioniert, müssen wir in diesem Fall ein zusätzliches 
`IS NULL` in der ORDER-Klausel verwenden.

~~~
SELECT name, date_birth FROM persons ORDER BY date_birth IS NULL DESC, name
~~~

~~~
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


### Querverweise
{: #links}

- [Gruppenbruch](http://php-de.github.io/jumpto/gruppenbruch/)
