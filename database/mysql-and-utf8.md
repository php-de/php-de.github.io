---
layout: guide
title: "MySQL und UTF-8"
creator: Manko10
group: "Datenbanken"
author:
    -   name: Manko10
        profile: 1139

    -   name: hausl
        profile: 21246

inhalt:
    -   name: "MySQL und UTF-8"
        anchor: wie-bringe-ich-meiner-datenbank-utf-8-bei
        simple: ""
---

### Wie bringe ich meiner Datenbank UTF-8 bei?

Mittlerweile nutzen die meisten Webanwendungen UTF-8 und das aus gutem Grund. In einem internationalen Raum muss auch für jede Sprache und deren Zeichen Platz sein und jeden Benutzer erst einstellen zu lassen, welchen Zeichensatz er gern hätte, ist eine unsägliche Methode. Einerseits fände dies der Benutzer sicherlich nicht so lustig wie vielleicht der Programmierer, andererseits bedeutete es einen enormen Aufwand, der sich nicht rechnet. Folglich wird auf Unicode gesetzt, im Speziellen auf UTF-8.

In Verbindung mit MySQL gab es aber seit jeher Probleme mit diesem Zeichensatz, sicherlich deshalb, weil er erst mit MySQL 4.1 eingeführt wurde, welches auch erst im März 2005 released wurde… also praktisch gestern Abend.
Intern nutzt MySQL für die Metadaten zwar ausschließlich UTF-8, aber irgendwie wird stets angenommen, dass der Programmierer, der MySQL benutzen soll, zu dämlich dafür sei, weshalb der Standardzeichensatz stets Latin1 ist.
Um dem garstigen MySQL nun endlich UTF-8 beizubringen, bietet sich das allseits bekannte

~~~ php
SET NAMES 'utf8';
~~~

an, das meist mit [mysqli_query()](http://php.net/manual/en/mysqli.query.php) an die Datenbank gesendet wird.
Doch halt! So sicher diese Methode zu sein scheint, umso tückischer ist sie, denn auch hier lauern diverse Stolpersteine, über die der eine oder andere sicherlich schon unglücklich gefallen ist.
Um diese zu umgehen, muss man zunächst verstehen, wie MySQL arbeitet und mit `SET NAMES` umgeht.
`SET NAMES 'xyz'` ist ein Shortcut für die folgenden Verbindungsparameter:

~~~ php
SET character_set_client = xyz;
SET character_set_results = xyz;
SET character_set_connection = xyz;
~~~

Damit wird MySQL erzählt, dass alle vom Client kommenden Daten im Zeichensatz `xyz` kodiert sind, dass alle Daten, die der Server zurückgibt, ebenfalls `xyz`-kodiert sein sollen und der vom Server selbst genutzte Zeichensatz auch `xyz` sein soll (dazu später mehr). Jetzt ist es aber am Client, dafür zu sorgen, dass die Daten auch wirklich im Zeichensatz `xyz` vorliegen, da MySQL hier nicht nachhelfen kann.

Ist also die Verbindung bspw. auf UTF-8 gesetzt, im Query werden aber tatsächlich Latin1-kodierte Daten gesendet, dann nimmt der Server dennoch an, dass es sich um UTF-8 handelt. Ebenso verhält es sich umgekehrt, wenn Latin1 eingestellt, aber UTF-8 gesendet wird. Da UTF-8 die Zeichen mit 1 bis 4 Bytes speichert, ergeben sich bei Multibyte-Zeichen die allseits beliebten Doppelzeichen mit allerlei Buchstaben- und Tildensalat.

Aber Vorsicht: ein Zeichensatzmischmasch kann auch vorkommen, ohne dass man es direkt merkt. Nämlich dann, wenn der Client den Server anweist, Zeichensatz A zu verwenden, Daten im Zeichensatz B sendet und vom MySQL-Server zurückbekommene Daten wieder als Zeichensatz A ausgibt. Die Verwunderung ist dann groß, wenn man phpMyAdmin öffnet und die seltsamen Zeichensatzfehler bemerkt.

Wofür genau jetzt `character_set_connection` steht, ist schnell erklärt. Da der Zeichensatz des Clients nicht unbedingt mit dem Zeichensatz der Datenbank übereinstimmen muss, nimmt MySQL intern eine Konvertierung vor. Es nimmt Daten im Zeichensatz `character_set_client` an und wandelt diese in `character_set_connection` um, ehe sie gespeichert werden (soll keine Konvertierung vorgenommen werden, kann dieser Parameter übrigens auch auf NULL gesetzt werden).

Es existiert aber noch eine zweite Variante neben `SET NAMES`, nämlich

~~~ php
SET CHARACTER SET 'utf8';
~~~

Die Verwirrung ist oft groß, da kaum jemandem die Unterschiede in allen Einzelheiten bekannt sind. Dabei ist der Unterschied gar nicht so kompliziert, wie er anmutet. Er besteht in den Systemvariablen, die gesetzt werden. Im Großen und Ganzen ist `SET CHARACTER SET` zum vorigen Statement identisch, besitzt aber einen entscheidenden Unterschied:

~~~ php
SET character_set_client = xyz;
SET character_set_results = xyz;
SET collation_connection = @@collation_database;
~~~

wobei `SET collation_connection = @@collation_database` implizit auch ein `SET character_set_connection = @@character_set_database` durchführt. Doch was heißt das nun? Um das zu verstehen, ist es zuerst wichtig, zu wissen, was eine Kollation (Collation) ist. Auch das ist sehr einfach zu erklären. Der Zeichensatz (Character Set) legt die Zuordnungen der Zeichen fest. Bis jetzt ist jedes Zeichen aber vollkommen einzigartig ohne jeden Bezug zu einem anderen Zeichen, also case-sensitive. Um jetzt festzulegen, dass A der gleiche Buchstabe ist wie a und ä ebenfalls dem a entspricht, muss eine Kollation her, welche diese Informationen bereitstellt.

MySQL nutzt Kollationen, um Literale miteinander vergleichen zu können. `collation_connection` legt dabei fest, in welchem Zeichensatz dies geschieht (wird allerdings ein Vergleich mit einer Spalte vorgenommen, so wird unabhängig von der Vorgabe auf jeden Fall die Kollation dieser Spalte genutzt, also bitte nie UTF-8-Daten mit einer Latin1-Spalte vergleichen!).

Bei `SET CHARACTER SET` wird die Kollation nun auf den Wert von `collation_database`, also die Kollation der Datenbank gesetzt anstatt auf den übergebenen Wert.
Dies kann aber zu Informationsverlusten führen, wenn Vergleiche mit Unicode-Zeichen vorgenommen werden, die Datenbank aber auf Latin1 eingestellt ist. `SET CHARACTER SET` sollte also nur eingesetzt werden, wenn die Kodierung der Datenbank definitiv bekannt ist.

Fassen wir somit zusammen. Um MySQL erfolgreich mit UTF-8 zu quälen, muss Folgendes gegeben sein:

- Der Client selbst muss UTF-8 sprechen (heißt konkret: die PHP-Datei muss unbedingt in UTF-8 kodiert werden und vom Benutzer kommende Daten müssen ebenfalls in UTF-8 vorliegen) 
- `SET NAMES 'utf8'` muss an die Datenbank gesendet werden (auf der Kommandozeile wird dafür der Parameter `--default-character-set=UTF8` genutzt) 
- Die Datenbank sowie deren Tabellen und Spalten müssen auf UTF-8 gestellt sein 
- Die von MySQL zurückgegebenen Werte sind UTF-8 und müssen auch als solche behandelt werden.  
<br>  

Ab PHP 5.2.3 existiert übrigens die Funktion [mysqli_set_charset()](http://php.net/manual/de/mysqli.set-charset.php), welche statt einem manuellen `SET NAMES` genutzt werden sollte, da hier noch verifiziert wird, ob der gewünschte Zeichensatz vom Client überhaupt unterstützt wird. Darüberhinaus wird das interne Feld `mysql->charset` auf den entsprechenden Zeichensatz gesetzt, was bei der manuellen Variante ebenfalls nicht gegeben wäre.
Zu bedenken ist aber, dass neben der richtigen PHP-Version auch eine MySQL-Version 5.0.7 oder höher benötigt wird.

