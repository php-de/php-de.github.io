---
layout: guide

permalink: /jumpto/kombinatorik-loesungen/
root: ../..
title: "Lösungsvorschläge zu kombinatorischen Standardaufgaben"
group: "Standard Implementierungsansätze / Code-Snippets"
orderId: 12

creator: mermshaus
author:
    -   name: mermshaus
        profile: 15041

inhalt:
    -   name: "Grundlegende Funktionen"
        anchor: grundlegende-funktionen
        simple: ""

    -   name: "Alle Kombinationen der Elemente eines Arrays"
        anchor: alle-kombinationen-der-elemente-eines-arrays
        simple: ""

    -   name: "Alle Kombinationen einer bestimmten Anzahl der Elemente eines Arrays"
        anchor: alle-kombinationen-einer-bestimmten-anzahl-der-elemente-eines-arrays
        simple: ""

    -   name: "Ziehen mit Zurücklegen"
        anchor: ziehen-mit-zuruecklegen
        simple: ""

    -   name: "Weblinks"
        anchor: weblinks
        simple: ""

entry-type: in-discussion
---

## [Grundlegende Funktionen](#grundlegende-funktionen)
{: #grundlegende-funktionen}

### [Berechnung der Fakultät](#berechnung-der-fakultaet)
{: #berechnung-der-fakultaet}

~~~ php
/**
 * Calculates the factorial of a given non-negative integer
 *
 * @param  int $n Non-negative integer
 * @return int Factorial of $n
 */
function fac($n)
{
    if (!is_int($n) || $n < 0) {
        throw new InvalidArgumentException(
                'n has to be a non-negative (int)');
    }

    for ($f = 1; $n > 1; $n--) {
        $f *= $n;
    }

    return $f;
};
~~~

### [Berechnung des Binomialkoeffizienten (n über k)](#berechnung-des-binomialkoeffizienten-n-ueber-k)
{: #berechnung-des-binomialkoeffizienten-n-ueber-k}

~~~ php
function nChooseK($n, $k)
{
    $top    = 1;
    $bottom = 1;

    for ($i = 0; $i < $k; $i++) {
        $top    *= $n - $i;
        $bottom *= $i + 1;
    }

    return $top / $bottom;
}
~~~



## [Alle Kombinationen der Elemente eines Arrays](#alle-kombinationen-der-elemente-eines-arrays)
{: #alle-kombinationen-der-elemente-eines-arrays}

~~~ php
/**
 * Returns a specific permutation of an array
 *
 * This function does not preserve key/value pairs.
 *
 * Permutation table for input (a, b, c):
 *
 *    n   result
 *   -------------
 *   ...
 *   -6   a, b, c    initial state
 *   -5   a, c, b
 *   -4   b, a, c
 *   -3   b, c, a
 *   -2   c, a, b
 *   -1   c, b, a
 *    0   a, b, c    initial state
 *    1   a, c, b
 *    2   b, a, c
 *    3   b, c, a
 *    4   c, a, b
 *    5   c, b, a
 *    6   a, b, c    initial state
 *   ...
 *
 * @param  array $items Array to calculate permutation of
 * @param  int   $n     Index of wanted permutation
 * @return array Resulting array
 */
function getNthPermutation(array $items, $n)
{
    if (!is_int($n)) {
        throw new InvalidArgumentException(
                'n has to be of type int');
    }

    $result = array();
    $l      = count($items);

    $facL = fac($l);

    while ($n < 0) {
        $n += $facL;
    }

    $n = $n % $facL;

    for ($i = 1; $l >= $i; $i++) {
        $facLI = fac($l - $i);

        // Calculate current index in $items
        $k = (int) ($n / $facLI);

        // Remove element from items and push to result
        $curItem = array_splice($items, $k, 1);
        $result[] = $curItem[0];

        $n -= $k * $facLI;
    }

    return $result;
}
~~~

Anwendungsbeispiel:

~~~ php
$items = range(1, 4);

$f = fac(count($items));

for ($i = 0; $i < $f; $i++) {
    printf("% 3d  :  %s\n", $i, join(', ', getNthPermutation($items, $i)));
}
~~~

Ausgabe:

~~~
  0  :  1, 2, 3, 4
  1  :  1, 2, 4, 3
  2  :  1, 3, 2, 4
  3  :  1, 3, 4, 2
  4  :  1, 4, 2, 3
  5  :  1, 4, 3, 2
  6  :  2, 1, 3, 4
  7  :  2, 1, 4, 3
  8  :  2, 3, 1, 4
  9  :  2, 3, 4, 1
 10  :  2, 4, 1, 3
 11  :  2, 4, 3, 1
 12  :  3, 1, 2, 4
 13  :  3, 1, 4, 2
 14  :  3, 2, 1, 4
 15  :  3, 2, 4, 1
 16  :  3, 4, 1, 2
 17  :  3, 4, 2, 1
 18  :  4, 1, 2, 3
 19  :  4, 1, 3, 2
 20  :  4, 2, 1, 3
 21  :  4, 2, 3, 1
 22  :  4, 3, 1, 2
 23  :  4, 3, 2, 1
~~~



## [Alle Kombinationen einer bestimmten Anzahl der Elemente eines Arrays](#alle-kombinationen-einer-bestimmten-anzahl-der-elemente-eines-arrays)
{: #alle-kombinationen-einer-bestimmten-anzahl-der-elemente-eines-arrays}

Beispiel: Lottozahlen (alle Kombinationen von 6 aus 49).

Für eine Anzahl von `$k` Elementen aus `$n` Elementen gibt es `nChooseK($n,
$k)` Kombinationsmöglichkeiten.

~~~ php
$n = 49;
$k = 6;

var_dump(nChooseK($n, $k)); // int(13983816)
~~~

Funktionen zur Berechnung der `$k` Elemente einer beliebigen dieser
`nChooseK($n, $k)` Kombinationen:

~~~ php
/**
 * Creates a lookup table for Fibonacci numbers
 *
 * Table size: (N - k + 1) * k
 *
 * @param $n int N
 * @param $k int k
 * @return array Lookup table for this (N choose k)
 */
function calcLookupTable($n, $k)
{
   $b = $n - $k + 1;
   $fib = range(0, $k - 1);

   for ($i = 0; $i < count($fib); $i++)
   {
       $fib[$i] = range(0, $b - 1);
       $fib[$i][0] = 1;
   }

   for ($x = 0; $x < $k; $x++)
   {
       for ($y = 1; $y < $b; $y++)
       {
           $p = (isset($fib[$x - 1][$y])) ? $fib[$x - 1][$y] : 0;
           $q = (isset($fib[$x][$y - 1])) ? $fib[$x][$y - 1] : 0;
           $fib[$x][$y] = $p + $q;
       }
   }

   return $fib;
}

/**
 * Returns path vector by number
 *
 * @param $n int N
 * @param $k int k
 * @param $w int Path number (between 1 and (N choose k))
 * @param $fib array Lookup table for (N choose k) (see calcLookupTable)
 * @return array Path at given index
 */
function getPathByNumber($n, $k, $w, array $fib)
{
   $b = $n - $k + 1;
   $x = range(0, $k - 1);

   for ($i = 0; $i < $k; $i++)
   {
       $j = 1;
       $u = $fib[$k - $i - 1][$b - $j];
       while ($u < $w)
       {
           $j++;
           $u += $fib[$k - $i - 1][$b - $j];
       }
       $x[$i] =  ($i > 0) ? $x[$i - 1] + $j : $j;
       $w = $w - ($u - $fib[$k - $i - 1][$b - $j]);
       $b = $b - $j + 1;
   }

   return $x;
}
~~~

Anwendungsbeispiel:

~~~ php
$n = 49;
$k = 6;
$w = nChooseK($n, $k);

$fibTable = calcLookupTable($n, $k);

$path1 = getPathByNumber($n, $k, $w, $fibTable);
echo implode('-', $path1) . "\n"; // 44-45-46-47-48-49

$path2 = getPathByNumber($n, $k, 1, $fibTable);
echo implode('-', $path2) . "\n"; // 1-2-3-4-5-6

$path3 = getPathByNumber($n, $k, 10000, $fibTable);
echo implode('-', $path3) . "\n"; // 1-2-3-17-28-39
~~~



## [Ziehen mit Zurücklegen](#ziehen-mit-zuruecklegen)
{: #ziehen-mit-zuruecklegen}

~~~ php
<?php

/**
 * Liefert die $i-te Permutation von $k Elementen aus $data (Ziehen mit
 * Zurücklegen)
 *
 * @param array $data
 * @param int $k
 * @param int $i
 * @return array
 */
function get_perm(array $data, $k, $i)
{
    $ret = array();
    $n = count($data);

    for ($exp = $k - 1; $exp >= 0; $exp--) {
        $pow = pow($n, $exp);
        $idx = (int) ($i / $pow);

        $ret[] = $data[$idx];

        $i -= $idx * $pow;
    }

    return $ret;
}

// Ziehe achtmal mit Zurücklegen aus [a..f]
$elements = range('a', 'f');
$draw = 8;
$pow = pow(count($elements), $draw);

echo implode(', ', get_perm($elements, $draw, 0)) . "\n";
echo implode(', ', get_perm($elements, $draw, 1)) . "\n";
echo implode(', ', get_perm($elements, $draw, 2)) . "\n";
echo '...' . "\n";
echo implode(', ', get_perm($elements, $draw, $pow - 3)) . "\n";
echo implode(', ', get_perm($elements, $draw, $pow - 2)) . "\n";
echo implode(', ', get_perm($elements, $draw, $pow - 1)) . "\n";

// a, a, a, a, a, a, a, a
// a, a, a, a, a, a, a, b
// a, a, a, a, a, a, a, c
// ...
// f, f, f, f, f, f, f, d
// f, f, f, f, f, f, f, e
// f, f, f, f, f, f, f, f
~~~



## [Weblinks](#weblinks)
{: #weblinks}

- [Finding All Permutations of an Array (PHP Cookbook)](http://docstore.mik.ua/orelly/webprog/pcook/ch04_26.htm)
