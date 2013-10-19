---
layout: guide
title: "Float vereinheitlichen"
group: "Allgemein"
creator: nikosch
author:
    -   name: nikosch
        profile: 2314

    -   name: hausl
        profile: 21246

    -   name: mermshaus
        profile: 15041

inhalt:
    -   name: ""
        anchor:
        simple: ""

entry-type: in-discussion

---

Vereinheitlicht alternative Formate von Kommazahlen-Eingaben unter Berücksichtigung von Tausenderzeichen zum üblichen Punkt-separierten Floattyp.

~~~ php
function get_float($value)
{
    // enthaltene Leerzeichen entfernen
    // ausschließlich als 1000er-Trennzeichen verw. Zeichen können hier vorab ersetzt werden
    $value = str_replace (' ', '', $value);

    // suche letztes nichtnumerisches Zeichen
    preg_match('#([^0-9])[0-9]+$#', $value, $found);

    // $found[1] ist jetzt ein Trennzeichen (oder NULL)

    // Trennzeichen gefunden
    if (false === empty($found[1])) {

        // mehr als ein Trennzeichen gefunden - kann kein Dezimaltrennzeichen sein
        if (substr_count($value, $found[1]) > 1) {
            // entferne alle Trennzeichen, Rückgabe
            return ((float) str_replace($found[1], '', $value));
        }

        // Tausender-Zeichen entfernen Dezimaltrennzeichen nach . vereinheitlichen
        switch ($found[1]) {

        case ',':
            $value = str_replace ('.', '', $value);
            $value = str_replace (',', '.', $value);
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
$filterFloatSeparatorAutoDetect = function ($value) {
    $a = filter_var($value, FILTER_VALIDATE_FLOAT, array(
        'options' => array('decimal' => '.'),
        'flags'   => FILTER_FLAG_ALLOW_THOUSAND
    ));

    $b = filter_var($value, FILTER_VALIDATE_FLOAT, array(
        'options' => array('decimal' => ','),
        'flags'   => FILTER_FLAG_ALLOW_THOUSAND
    ));

    if ($a === $b) {
        return $a;
    } elseif ($a === false) {
        return $b;
    } elseif ($b === false) {
        return $a;
    }

    return false;
};
~~~

Tests:

~~~ php
$arr = array(
    '1500.23',       // double(1500.23)     double(1500.23)
    '1500,23',       // double(1500.23)     double(1500.23)
    '1.500,23',      // double(1500.23)     double(1500.23)
    '1,500.23',      // double(1500.23)     double(1500.23)
    '-1,500.23',     // double(-1500.23)    double(-1500.23)
    '-1,500,000',    // double(-1500000)    double(-1500000)
    '-1,500',        // double(-1.5)        bool(false)
    '1.500',         // double(1.5)         bool(false)
    '-1,50',         // double(-1.5)        double(-1.5)
    '-1.500,000',    // double(-1500)       double(-1500)
    '1500,000,000',  // double(1500000000)  bool(false)
    '-10',           // double(-10)         double(-10)
    '.5',            // double(0.5)         double(0.5)
    '.',             // double(0)           bool(false)
    '',              // double(0)           bool(false)
    ' ',             // double(0)           bool(false)
    ' 5.',           // double(5)           double(5)
    '5. ',           // double(5)           double(5)
    'abc',           // double(0)           bool(false)
    '1abc',          // double(1)           bool(false)
    'abc1'           // double(0)           bool(false)
);

foreach ($arr as $val) {
    echo 'Test: "' . $val . '"' . "\n";

    var_dump(
        get_float($val),
        filter_var($val, FILTER_CALLBACK, array('options' => $filterFloatSeparatorAutoDetect))
    );

    echo "\n";
}
~~~

Zu beachten ist die unterschiedliche Ausgabe bei Eingaben wie `"1.500"` und `"1,500"`, die `get_float` als `double(1.5)` interpretiert, während der Ansatz mit `filter_var` hier `bool(false)` zurückgibt, was „nicht entscheidbar“ bedeutet. Zudem akzeptiert nur `get_float` eine Eingabe wie `"1500,000,000"`, in der nicht jeder mögliche Tausenderseparator gesetzt ist.

