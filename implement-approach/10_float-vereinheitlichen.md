---
layout: guide

permalink: /jumpto/float-vereinheitlichen/
root: ../..
title: "Float vereinheitlichen"
group: "Standard Implementierungsansätze / Code-Snippets"
orderId: 10

creator: nikosch
author:
    -   name: nikosch
        profile: 2314

    -   name: hausl
        profile: 21246

    -   name: Trainmaster
        profile: 20243

    -   name: mermshaus
        profile: 15041

inhalt:
    -   name: ""
        anchor:
        simple: ""

entry-type: in-discussion
---

Auf dieser Seite werden einige Möglichkeiten vorgestellt, einen Eingabestring, der eine Zahl darstellt, in einen numerischen Datentyp zu übertragen, mit dem der Rechner umgehen kann.

Die Herausforderung besteht darin, die menschliche Kreativität sowohl bei der Angabe als auch bei der Interpretation von Eingaben mit einem Algorithmus nachzuvollziehen, sodass am Ende ein Ergebnis vorliegt, das möglichst „richtig“ ist und das der Intention desjenigen entspricht, der die Eingabe getätigt hat.

Probleme bereiten beispielsweise die unterschiedlichen Zeichen, die in verschiedenen geografischen Räumen für Tausendertrennzeichen oder Dezimaltrennzeichen genutzt werden. So kann etwa ein Geldbetrag wie in Deutschland üblich als `15.495,00` angegeben werden, aber auch als `15,495.00` (englisch) oder `15 495,00` (französisch) oder potenziell auch als `15495.0` oder einfach als `15495`.

Diese Beispiele sind für einen Menschen noch relativ eindeutig interpretierbar. Denkbar sind aber auch Eingaben wie `1,250`, bei denen auch ein menschlicher Leser nicht mehr mit letzter Sicherheit sagen kann, ob es sich um den Wert `1.250,00` oder um `1,25` handelt. Das ist letztlich selbst dann nicht mehr der Fall, wenn aus dem Kontext bekannt ist, dass die Eingabe beispielsweise einen Geldbetrag darstellt, denn nicht überall wird mit ganzen Cents gerechnet.

Letztlich gilt es also, eine Lösung für ein Problem zu finden, das überhaupt nur teilweise gelöst werden kann. Die folgenden Vorschläge sind deshalb als Ideen zu verstehen, die unterschiedliche Aspekte bei der Interpretation von Eingaben jeweils unterschiedlich strikt bewerten.

Es soll auf verschiedene mögliche Ansätze hingewiesen werden, aber es soll auch vermittelt werden, dass die Frage nach der grundsätzlichen Entscheidbarkeit bei derlei Problemstellungen von zentraler Bedeutung ist.

~~~ php
// Vereinheitlicht alternative Formate von Kommazahlen-Eingaben unter
// Berücksichtigung von Tausenderzeichen zum üblichen Punkt-separierten
// Floattyp.
function get_float($value)
{
    // enthaltene Leerzeichen entfernen (ausschließlich als 1000er-Trennzeichen
    // verw. Zeichen können hier vorab ersetzt werden)
    $value = str_replace (' ', '', $value);

    // suche letztes nichtnumerisches Zeichen
    $found = array();
    preg_match('#([^0-9])[0-9]+$#', $value, $found);

    // $found[1] ist jetzt ein Trennzeichen (oder NULL)

    // Trennzeichen gefunden
    if (false === empty($found[1])) {

        // mehr als ein Trennzeichen gefunden - kann kein Dezimaltrennzeichen
        // sein
        if (substr_count($value, $found[1]) > 1) {
            // entferne alle Trennzeichen, Rückgabe
            return ((float) str_replace($found[1], '', $value));
        }

        // Tausender-Zeichen entfernen Dezimaltrennzeichen nach "."
        // vereinheitlichen
        switch ($found[1]) {

        case ',':
            $value = str_replace (array('.', ','), array('', '.'), $value);
            break;

        case '.':
            $value = str_replace (',', '', $value);
            break;
        }
    }
    return ((float) $value);
}
~~~

Ein anderer Ansatz per [`filter_var`](http://php.net/filter_var):

~~~ php
$floatAutoDetect = function ($value) {
    // interpretiere die Zahl einmal im "deutschen" und einmal im "englischen"
    // Format
    $a = filter_var($value, FILTER_VALIDATE_FLOAT, array(
        'options' => array('decimal' => '.'),
        'flags'   => FILTER_FLAG_ALLOW_THOUSAND
    ));
    $b = filter_var($value, FILTER_VALIDATE_FLOAT, array(
        'options' => array('decimal' => ','),
        'flags'   => FILTER_FLAG_ALLOW_THOUSAND
    ));

    // sind sich beide Versuche einig oder liefert nur einer der beiden eine
    // sinnvolle Rückgabe, gebe diese zurück
    if ($a === $b) {
        return $a;
    } elseif ($a === false) {
        return $b;
    } elseif ($b === false) {
        return $a;
    }

    // ansonsten erkläre es für nicht zweifelsfrei entscheidbar
    return false;
};
~~~

Zuletzt eine Variante, welche die [intl Erweiterung](http://www.php.net/manual/de/intro.intl.php) voraussetzt. Es muss bedacht werden, dass die übergebene Locale das Parsing beeinflusst (zur Veranschaulichung siehe Tests).

~~~ php
$fmtDE = new NumberFormatter('de', NumberFormatter::DECIMAL);
$fmtEN = new NumberFormatter('en', NumberFormatter::DECIMAL);
~~~

Tests:

~~~ php
                    //     get_float()  $floatAutoDetect   $fmtDE      $fmtEN
$arr = array(
    '1000',         //         1.000,00      1.000,00    1.000,00      1.000,00
    '1500.23',      //         1.500,23      1.500,23           -      1.500,23
    '1500,23',      //         1.500,23      1.500,23    1.500,23             -
    '1500 23',      //       150.023,00             -           -             -
    '150 023',      //       150.023,00             -  150.023,00    150.023,00
    '1 2 3 4',      //         1.234,00             -           -             -
    '1 000,23',     //         1.000,23             -    1.000,23      1.000,00
    '1 000.23',     //         1.000,23             -    1.000,00      1.000,23
    '1000, 23',     //         1.000,23             -    1.000,00      1.000,00
    '1000. 23',     //         1.000,23             -    1.000,00      1.000,00
    '1.500,23',     //         1.500,23      1.500,23    1.500,23          1,50
    '1,500.23',     //         1.500,23      1.500,23        1,50      1.500,23
    '-1,500.23',    //        -1.500,23     -1.500,23       -1,50     -1.500,23
    '-1,500,000',   //    -1.500.000,00 -1.500.000,00       -1,50 -1.500.000,00
    '-1,500',       //            -1,50             -       -1,50     -1.500,00
    '1.500',        //             1,50             -    1.500,00          1,50
    '-1,50',        //            -1,50         -1,50       -1,50             -
    '-1.500,000',   //        -1.500,00     -1.500,00   -1.500,00         -1,50
    '1500,000,000', // 1.500.000.000,00             -    1.500,00             -
    '-10',          //           -10,00        -10,00      -10,00        -10,00
    '- 10',         //           -10,00             -           -             -
    '.5',           //             0,50          0,50           -          0,50
    '.',            //             0,00             -           -             -
    '',             //             0,00             -           -             -
    ' ',            //             0,00             -           -             -
    ' 5.',          //             5,00          5,00           -             -
    '5. ',          //             5,00          5,00        5,00          5,00
    'abc',          //             0,00             -           -             -
    '1abc',         //             1,00             -        1,00          1,00
    'abc1'          //             0,00             -           -             -
);

$f = function ($var) {
    if (is_float($var)) {
        return number_format($var, 2, ',', '.');
    }
    if (is_bool($var)) {
        return $var ? 'true' : '-';
    }
};

echo '                //    get_float()   $floatAutoDetect   $fmtDE     $fmtEN'
    . "\n\n";

foreach ($arr as $val) {
    printf('%-15s // %16s %13s %13s %13s' . "\n",
        "'" . $val . "',",
        $f(get_float($val)),
        $f(filter_var($val, FILTER_CALLBACK, array(
            'options' => $floatAutoDetect))
        ),
        $f($fmtDE->parse($val, NumberFormatter::TYPE_DOUBLE)),
        $f($fmtEN->parse($val, NumberFormatter::TYPE_DOUBLE))
    );
}
~~~

Zu beachten ist beispielsweise die unterschiedliche Ausgabe bei Eingaben wie `"1.500"` und `"1,500"`, die `get_float` als `1,50` interpretiert, während der Ansatz mit `filter_var` hier `bool(false)` zurückgibt, was „nicht entscheidbar“ bedeutet. Zudem akzeptiert nur `get_float` eine Eingabe wie `"1500,000,000"`, in der nicht jeder mögliche Tausenderseparator gesetzt ist.
