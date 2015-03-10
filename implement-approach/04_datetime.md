---
layout: guide

permalink: /jumpto/datetime/
root: ../..
title: "Datum und Uhrzeit"
group: "Standard Implementierungsansätze / Code-Snippets"
orderId: 4

creator: hausl
author:
    -   name: hausl
        profile: 21246

inhalt:
    -   name: "DateTime-Objekt erstellen"
        anchor: datetime-objekt-erstellen
        simple: ""

    -   name: "DateTime-Objekt von abweichenden Formaten"
        anchor: von-abweichenden-formaten-erzeugen
        simple: ""

    -   name: "Berechnungen auf bestehende DateTime-Objekte"
        anchor: berechnungen-auf-vorhandene-datetime-objekte
        simple: ""

    -   name: "Schaltjahr"
        anchor: schaltjahr
        simple: ""

    -   name: "Differenzen, Interval"
        anchor: differenzen
        simple: ""

    -   name: "Vergleiche"
        anchor: vergleiche
        simple: ""

    -   name: "Kalenderwochen"
        anchor: kalenderwochen
        simple: ""

    -   name: "Deutsche Wochentage"
        anchor: deutsche-wochentage
        simple: ""

    -   name: "Deutsche Monatsnamen"
        anchor: deutsche-monatsnamen
        simple: ""

    -   name: "Überschneidungen Zeiträume"
        anchor: ueberschneidungen
        simple: ""

    -   name: "Sternzeichen"
        anchor: sternzeichen
        simple: ""

    -   name: "Ostern"
        anchor: ostern
        simple: ""

    -   name: "Links"
        anchor: links
        simple: ""

entry-type: in-progress
---

Dieses Tutorial zeigt, an Hand von der in PHP ausgelieferten Klasse DateTime, eine Sammlung an üblichen Anwendungsszenarien. Bei den Beispielen wird durchgängig die objektorientierte Variante von DateTime verwendet. Bei etwaigen externen Beispielen kann dies abweichen bzw. wenn bewusst auf alternative Methoden zurückgegriffen wird, so wird dies explizit erwähnt.


Nachfolgende Seiten aus der PHP-Dokumentation finden in den Beispielen laufend Verwendung.

- [Formate Datum und Uhrzeit](http://php.net/manual/de/datetime.formats.php)
- [Relative Formate](http://php.net/manual/de/datetime.formats.relative.php)
- [DateTime::createFromFormat](http://php.net/manual/de/datetime.createfromformat.php)


<div class="alert alert-info">
  Für alle nachfolgenden Beispiele wird mittels <code>date_default_timezone_set('Europe/Berlin');</code>
  die verwendete <strong>Standard-Zeitzone</strong> gesetzt.
</div>


### DateTime-Objekt erstellen

~~~ php
// Jetzt
$dt = new DateTime();
echo $dt->format('Y-m-d');
// 2015-01-19
~~~

Ebenso können auch gleich relative Formate verwendet werden.

~~~ php
// Morgen
$dt = new DateTime('tomorrow');
echo $dt->format('Y-m-d');
// 2015-01-20

// Übermorgen
$dt = new DateTime('+2 days');
echo $dt->format('Y-m-d');
// 2015-01-21

// Letzter Freitag im Januar (des aktuellen Jahres)
$dt = new DateTime('last friday of january');
echo $dt->format('Y-m-d');
// 2015-01-30

// Letzter Freitag im Januar 2016
$dt = new DateTime('last friday of january 2016');
echo $dt->format('Y-m-d');
// 2016-01-29

// Erster Tag (Montag) der KW2 (Kalenderwoche) von 2015
$dt = new DateTime('2015-W03'); // Woche muss zweistellig sein
echo $dt->format('Y-m-d');
// 2015-01-12 (Montag)
~~~


### Von abweichenden Format-Strings erzeugen


~~~ php
$str = '13012015';
$format = 'dmY';
$dt = DateTime::createFromFormat($format, $str);
echo $dt->format('Y-m-d');
// 2015-01-13
~~~


~~~ php
$d = 18;   // 18. Tag
$y = 2015; // des Jahres 2015
$dt = DateTime::createFromFormat('z Y', sprintf('%s %s', $d - 1, $y));
echo $dt->format('Y-m-d');
// 2015-01-18
~~~


### Schaltjahr


~~~ php
$dt = DateTime::createFromFormat('Y', '2015');
echo $dt->format('L');
// 0 (kein Schaltjahr)

$dt = DateTime::createFromFormat('Y', '2016');
echo $dt->format('L');
// 1 (Schaltjahr)
~~~


### Berechnungen auf vorhandene DateTime-Objekte


~~~ php
$dt = new DateTime(); // 2015-01-19
$dt->modify('+2 months');
echo $dt->format('Y-m-d');
// 2015-03-19
~~~


### Differenzen


~~~ php
$dt1 = new DateTime('2015-01-01');
$dt2 = new DateTime('2015-01-12');

$dtInterval = $dt1->diff($dt2);
echo $dtInterval->format('%R%a days');
// +11 days

// ist Benutzer schon seit 30 Tagen registriert?
$regDate = new DateTime('2014-12-15');
$now     = new DateTime(); // 2015-01-19

if ( $now->modify('-30 days') >= $regDate ) {
    echo "Ja!";
}
// Ja!

// oder

$regDate = new DateTime('2014-12-15');
$now     = new DateTime(); // 2015-01-19

echo $now->diff($regDate)->days; // 35
// somit:
var_dump($now->diff($regDate)->days > 30); // true
~~~



### Vergleiche

~~~ php
$dt1 = new DateTime('now');
$dt2 = new DateTime('tomorrow');

// ab PHP 5.2.2 - davor siehe Doku
var_dump($dt1 == $dt2); // false
var_dump($dt1 < $dt2);  // true
var_dump($dt1 > $dt2);  // false
~~~



### Kalenderwochen

~~~ php
// erster Tag von KW2 in 2015
$dt = new DateTime('2015-W03'); // Woche muss zweistellig sein
echo $dt->format('Y-m-d');
// 2015-01-12 (Montag)

// alternativ
$dt = new DateTime();
$dt->setISODate(2015, 3);
echo $dt->format('Y-m-d');
// 2015-01-12 (Montag)
~~~


~~~ php
// Tag gehört zu welcher Kalenderwoche
$dt = new DateTime('2015-01-15');
echo $dt->format('W');
// 03
~~~


~~~ php
// Wie viele Kalenderwochen hat das Jahr ... ?
$ultimo = '2015-12-31';
$dt = new DateTime($ultimo);
echo ($dt->format('W') > 52) ? 53 : 52;
// 53
~~~



### Deutsche Wochentage

~~~ php
$aWeekdayNamesDE = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
$dt = new DateTime();
echo $aWeekdayNamesDE[$dt->format('w')];  // 'w': 0 (für Sonntag) bis 6 (für Samstag)
// Montag (Mo. 2015-01-12)
~~~

Hierzu sein auch noch auf diesen Thread hingewiesen: [http://www.php.de/php-einsteiger/112963-kalendermonat-und-kalendertag-bestimmten.html#post831698](http://www.php.de/php-einsteiger/112963-kalendermonat-und-kalendertag-bestimmten.html#post831698)


### Deutsche Monatsnamen

~~~ php
$aMonthNamesDE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
$dt = new DateTime();
echo $aMonthNamesDE[$dt->format('n')-1];
// Januar (2015-01-12)
~~~

Hierzu sein auch noch auf diesen Thread hingewiesen: [http://www.php.de/php-einsteiger/112963-kalendermonat-und-kalendertag-bestimmten.html#post831698](http://www.php.de/php-einsteiger/112963-kalendermonat-und-kalendertag-bestimmten.html#post831698)



### Überschneidungen Zeiträume
{: #ueberschneidungen}


Üblicherweise lagert man diese Vergleiche direkt an die Datebank aus. Hier dennoch als Beispiel eine PHP-Variante.

~~~ php
function overlap_timespans($sBegin1, $sEnd1, $sBegin2, $sEnd2, $sTimeTolerance = '') {

    $dt1_begin = new DateTime($sBegin1);
    $dt1_end   = new DateTime($sEnd1);

    $dt2_begin = new DateTime($sBegin2);
    $dt2_end   = new DateTime($sEnd2);

    // correct tolerance if given
    if (!empty($sTimeTolerance)) {
        $dt1_begin->modify('-'.$sTimeTolerance);
        $dt1_end->modify('-'.$sTimeTolerance);
    }

    // check for possible overlaps

    // 2 encolsures 1, or is the same
    if ($dt2_begin <= $dt1_begin && $dt2_end >= $dt1_end) {
        return true;
    }

    // 2 begins within 1
    if ($dt2_begin >= $dt1_begin && $dt2_begin <= $dt1_end) {
        return true;
    }

    // 2 ends within 1
    if ($dt2_end >= $dt1_begin && $dt2_end <= $dt1_end) {
        return true;
    }

    // no overlap
    return false;
}


var_dump( overlap_timespans('14:00', '15:00', '15:00', '16:00') ); // true
var_dump( overlap_timespans('14:00', '15:00', '15:00', '16:00', '1 minute') ); // false

var_dump( overlap_timespans('2015-02-01', '2015-02-02', '2015-02-02', '2015-02-03') ); // true
var_dump( overlap_timespans('2015-02-01', '2015-02-02', '2015-02-02', '2015-02-03', '1 minute') ); // false
~~~


### Sternzeichen
{: #sternzeichen}

Um das Sternzeichen eines Datums zu ermitteln, kann beispielsweise folgender Ansatz
[aus dem PHP.de-Forum](http://www.php.de/php-einsteiger/114039-erledigt-monat-und-tag-aus-input-type-date-auslesen.html#post839874)
verwendet werden.


~~~ php
function getSignOfZodiacFromDate($date) {
    // $date is an object of DateTime or a string
    if (is_string($date)) {
         $date = new DateTime($date);
    }
    if (!$date instanceof DateTime) {
        return false;
    }
    $monthDay = $date->format('md');
    // SignsOfZodiac: to('md') => sign
    $signs = array(
        '0120' => 'Steinbock',
        '0219' => 'Wassermann',
        '0320' => 'Fische',
        '0420' => 'Widder',
        '0520' => 'Stier',
        '0621' => 'Zwilling',
        '0722' => 'Krebs',
        '0823' => 'Löwe',
        '0923' => 'Jungfrau',
        '1023' => 'Waage',
        '1122' => 'Skorpion',
        '1221' => 'Schütze',
        '1231' => 'Steinbock'
    );
    foreach ($signs as $toMonthDay => $sign) {
        if ($monthDay <= $toMonthDay) {
            return $sign;
        }
    }
    return false;
}


// als string
echo getSignOfZodiacFromDate('today'); // Fische (heute 10.03.2015)
echo getSignOfZodiacFromDate('15.01.1984'); // Steinbock

// als objekt
$oDate = new DateTime('03.04.1981');
echo getSignOfZodiacFromDate($oDate); // Widder
~~~


### Ostern

Zu diesem Thema gibt es im Forum einige Threads

- [http://www.php.de/php-fortgeschrittene/112867-western-catholic-und-orthodox-easter-date.html#post830921](http://www.php.de/php-fortgeschrittene/112867-western-catholic-und-orthodox-easter-date.html#post830921)
- [http://www.php.de/php-fortgeschrittene/112772-zeitfehler.html#post830611](http://www.php.de/php-fortgeschrittene/112772-zeitfehler.html#post830611)


### Links

- [CARBON, a simple API extension for DateTime with PHP 5.3+](https://github.com/briannesbitt/Carbon)
