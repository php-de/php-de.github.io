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
    -   name: "Zeitzone"
        anchor: zeitzone
        simple: ""

    -   name: "DateTime-Objekt erstellen"
        anchor: datetime-erstellen
        simple: ""

    -   name: "DateTime-Objekt von abweichenden Formaten"
        anchor: von-abweichenden-formaten
        simple: ""

    -   name: "Schaltjahr"
        anchor: schaltjahr
        simple: ""

    -   name: "Berechnungen auf bestehende DateTime-Objekte"
        anchor: berechnungen-auf-bestehende
        simple: ""

    -   name: "Differenzen, Interval"
        anchor: differenzen
        simple: ""

    -   name: "Perioden"
        anchor: perioden
        simple: ""

    -   name: "Vergleiche"
        anchor: vergleiche
        simple: ""

    -   name: "Kalenderwochen"
        anchor: kalenderwochen
        simple: ""

    -   name: "Quartal"
        anchor: quartal
        simple: ""

    -   name: "Deutsche Tages- und Monatsnamen"
        anchor: deutsche-namen
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

entry-type: in-discussion
---

Dieses Tutorial zeigt, an Hand von der in PHP ausgelieferten Klasse DateTime, eine Sammlung an üblichen Anwendungsszenarien. Bei den Beispielen wird durchgängig die objektorientierte Variante von DateTime verwendet. Bei etwaigen externen Beispielen kann dies abweichen bzw. wenn bewusst auf alternative Methoden zurückgegriffen wird, so wird dies explizit erwähnt.


Nachfolgende Seiten aus der PHP-Dokumentation finden in den Beispielen laufend Verwendung.

- [Formate Datum und Uhrzeit](http://php.net/manual/de/datetime.formats.php)
- [Relative Formate](http://php.net/manual/de/datetime.formats.relative.php)
- [DateTime::createFromFormat](http://php.net/manual/de/datetime.createfromformat.php)


## [Zeitzone](#zeitzone)
{: #zeitzone}

Für alle nachfolgenden Beispiele wurde wie folgt die verwendete **Standard-Zeitzone** gesetzt.

~~~php
date_default_timezone_set('Europe/Berlin');
~~~

Alternativ kann die Zeitzone auch jeweils separat im jeweiligen DateTime-Objekt im Konstruktor angegeben werden.

~~~php
$dt = new DateTime('now', new DateTimeZone('Europe/Berlin'));

// bzw.

$dtZone = new DateTimeZone('Europe/Berlin');
$dt = new DateTime('now', $dtZone);
~~~


## [DateTime-Objekt erstellen](#datetime-erstellen)
{: #datetime-erstellen}

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


## [Von abweichenden Format-Strings erzeugen](#von-abweichenden-formaten)
{: #von-abweichenden-formaten}

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


## [Schaltjahr](#schaltjahr)
{: #schaltjahr}

~~~ php
$dt = DateTime::createFromFormat('Y', '2015');
echo $dt->format('L');
// 0 (kein Schaltjahr)

$dt = DateTime::createFromFormat('Y', '2016');
echo $dt->format('L');
// 1 (Schaltjahr)
~~~


## [Berechnungen auf vorhandene DateTime-Objekte](#berechnungen-auf-bestehende)
{: #berechnungen-auf-bestehende}

~~~ php
$dt = new DateTime(); // 2015-01-19
$dt->modify('+2 months');
echo $dt->format('Y-m-d');
// 2015-03-19
~~~


## [Differenzen, Interval](#differenzen)
{: #differenzen}


~~~ php
$dt1 = new DateTime('2015-01-01');
$dt2 = new DateTime('2015-01-12');

$dtInterval = $dt1->diff($dt2);
echo $dtInterval->format('%R%a days');
// +11 days
~~~

~~~ php
// Bsp: Wie lange ist ein Benutzer schon registriert?

$now     = new DateTime(); // 2015-01-19
$regDate = new DateTime('2014-12-15');

echo $now->diff($regDate)->days;
// 35
~~~

~~~ php
$now      = new DateTime(); // 2016-01-14
$refDate  = new DateTime('2013-02-10');

$format = '%y Jahre, %m Monate und %d Tage.';
$period = $now->diff($refDate)->format($format);

echo $period;
// 2 Jahre, 11 Monate und 4 Tage.
~~~


### [Interval - Anwendungsbeispiel ("Vor x Tagen/Monaten/...")](#interval-anwendung)
{: #interval-anwendung}

Auf Basis der obigen Ansätze ist bspw. nachfolgende konkrete Anwendung **"Vor x Tagen/Monaten/..."** möglich.
Basis und Codebeispiel entstammen diesen [PHP.de-Forumsbeitrag](https://www.php.de/forum/webentwicklung/php-einsteiger/1524146-php-vor-x-tagen).

~~~ php
$ts = 1517580600;

$date = new DateTime('now');
$date->setTimestamp($ts);

$now = new DateTime('now');
$diff = $now->diff($date);

$aPairs = [
    'y' => 'Jahr',
    'm' => 'Monat',
    'd' => 'Tag',
    'h' => 'Stunde',
    'i' => 'Minute',
    's' => 'Sekunde',
];

$interval = 0;

foreach ($aPairs as $att => $unit) {
    if ($diff->{$att} > 0) {
        $interval = $diff->{$att};
        break;
    }
}

// ev. Pluralform erzeugen
if ($interval !== 1 ) {
    $unit .= 'en';
    $unit = str_replace('een', 'en', $unit);
}

// Ausgabe
printf('Thema erstellt vor %s %s.', $interval, $unit);
~~~

Ergibt testweise bei folgenden Eingabe die als Kommentar nebenstehenden Ausgaben.

~~~php
$ts = time();           // Thema erstellt vor 0 Sekunden.
$ts = time() - 1800;    // Thema erstellt vor 30 Minuten.
$ts = time() - 3600;    // Thema erstellt vor 1 Stunde.
$ts = time() - 1036800; // Thema erstellt vor 12 Tagen.
~~~



## [Perioden](#perioden)
{: #perioden}

Will man bspw. eine Auflistung, mit den kommenden Samstagen (hier der nächsten zwei Monate),
so kann man hier z.B. `DatePeriod` nutzen.

~~~ php
// heute Fr. 13.01.2017

$dtStart = new DateTimeImmutable('this saturday'); // Datum von
$dtEnd   = $dtStart->modify('+2 months');          // Datum bis

$period = new DatePeriod(
    $dtStart,
    new DateInterval('P1W'), // Periode: 1 Woche
    $dtEnd
);

foreach ($period as $date) {
    echo $date->format('D. d.m.Y') . "\n";
}

/*
Sat. 14.01.2017
Sat. 21.01.2017
Sat. 28.01.2017
Sat. 04.02.2017
Sat. 11.02.2017
Sat. 18.02.2017
Sat. 25.02.2017
Sat. 04.03.2017
Sat. 11.03.2017
*/
~~~


## [Vergleiche](#vergleiche)
{: #vergleiche}

~~~ php
$dt1 = new DateTime('now');
$dt2 = new DateTime('tomorrow');

var_dump($dt1 == $dt2); // false
var_dump($dt1 < $dt2);  // true
var_dump($dt1 > $dt2);  // false
~~~


## [Kalenderwochen](#kalenderwochen)
{: #kalenderwochen}

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


## [Quartal](#quartal)
{: #quartal}

In welchem Quartal ein Datum liegt, kann bsp. wie folgt berechnet werden.

~~~php
$dt = new DateTime('2015-08-10');

$monat = $dt->format('n'); // Monat ohne führender Null
$quartal = floor(($monat - 1) / 3) + 1;

echo $quartal;  // 3
~~~


## [Deutsche Tages- und Monatsnamen](#deutsche-namen)
{: #deutsche-namen}

### [Wochentage](#deutsche-wochentage)
{: #deutsche-wochentage}

~~~ php
$aWeekdayNamesDE = [
    'Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'
];
$dt = new DateTime();
echo $aWeekdayNamesDE[$dt->format('w')];  // 'w': 0 (für Sonntag) bis 6 (für Samstag)
// Montag (heute Mo. 2015-01-12)
~~~

### [Monate](#deutsche-monate)
{: #deutsche-monate}

~~~ php
$aMonthNamesDE = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
];
$dt = new DateTime();
echo $aMonthNamesDE[$dt->format('n')-1];
// Januar (heute 2015-01-12)
~~~

Ergänzend sei auch auf diese Beiträge/Threads hingewiesen:

* [http://www.php.de/php-einsteiger/112963-kalendermonat-und-kalendertag-bestimmten.html#post831698](http://www.php.de/php-einsteiger/112963-kalendermonat-und-kalendertag-bestimmten.html#post831698)
* [http://www.php.de/forum/webentwicklung/php-einsteiger/117066-erledigt-datum-plus-42-tage-in-deutsch?p=1265559#post1265559](http://www.php.de/forum/webentwicklung/php-einsteiger/117066-erledigt-datum-plus-42-tage-in-deutsch?p=1265559#post1265559)


## [Überschneidungen Zeiträume](#ueberschneidungen)
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


## [Sternzeichen](#sternzeichen)
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


## [Ostern](#ostern)
{: #ostern}

Zu diesem Thema gibt es im Forum einige Threads

- [http://www.php.de/php-fortgeschrittene/112867-western-catholic-und-orthodox-easter-date.html#post830921](http://www.php.de/php-fortgeschrittene/112867-western-catholic-und-orthodox-easter-date.html#post830921)
- [http://www.php.de/php-fortgeschrittene/112772-zeitfehler.html#post830611](http://www.php.de/php-fortgeschrittene/112772-zeitfehler.html#post830611)


## [Links](#links)
{: #links}

- [CARBON, a simple API extension for DateTime with PHP 5.3+](https://github.com/briannesbitt/Carbon)
