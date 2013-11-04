---
layout: guide
permalink: /jumpto/float-vereinheitlichen/
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
        
    -   name: Trainmaster
        profile: 20243

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
$floatAutoDetect = function ($value) {
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

Zuletzt eine Variante, welche die [intl Erweiterung](http://www.php.net/manual/de/intro.intl.php) voraussetzt. Es muss bedacht werden, dass die übergebene Locale das Parsing beeinflusst (zur Veranschaulichung siehe Tests).

~~~ php
$fmtDE = new NumberFormatter('de', NumberFormatter::DECIMAL);
$fmtEN = new NumberFormatter('en', NumberFormatter::DECIMAL);
~~~


Tests:

~~~ php
                     // get_float()         $floatAutoDetect    $fmtDE          $fmtEN
$arr = array(
    '1500.23',       // double(1500.23)     double(1500.23)     float(150023)   float(1500.23)
    '1500,23',       // double(1500.23)     double(1500.23)     float(1500.23)  float(150023)
    '1.500,23',      // double(1500.23)     double(1500.23)     float(1500.23)  float(1.50023)
    '1,500.23',      // double(1500.23)     double(1500.23)     float(1.50023)  float(1500.23)
    '-1,500.23',     // double(-1500.23)    double(-1500.23)    float(-1.50023) float(-1500.23)
    '-1,500,000',    // double(-1500000)    double(-1500000)    float(-1.5)     float(-1500000)
    '-1,500',        // double(-1.5)        bool(false)         float(-1.5)     float(-1500)
    '1.500',         // double(1.5)         bool(false)         float(1500)     float(1.5)
    '-1,50',         // double(-1.5)        double(-1.5)        float(-1.5)     float(-150)
    '-1.500,000',    // double(-1500)       double(-1500)       float(-1500)    float(-1.5)    
    '1500,000,000',  // double(1500000000)  bool(false)         float(1500)     float(1500000000)
    '-10',           // double(-10)         double(-10)         float(-10)      float(-10)
    '.5',            // double(0.5)         double(0.5)         float(5)        float(0.5)
    '.',             // double(0)           bool(false)         bool(false)     bool(false)
    '',              // double(0)           bool(false)         bool(false)     bool(false)
    ' ',             // double(0)           bool(false)         bool(false)     bool(false)
    ' 5.',           // double(5)           double(5)           bool(false)     bool(false)
    '5. ',           // double(5)           double(5)           float(5)        float(5)
    'abc',           // double(0)           bool(false)         bool(false)     bool(false)
    '1abc',          // double(1)           bool(false)         float(1)        float(1)    
    'abc1'           // double(0)           bool(false)         bool(false)     bool(false)
);

foreach ($arr as $val) {
    echo 'Test: "' . $val . '"' . "\n";

    var_dump(
        get_float($val),
        filter_var($val, FILTER_CALLBACK, array('options' => $floatAutoDetect)),
        $fmtDE->parse($val, NumberFormatter::TYPE_DOUBLE),
        $fmtEN->parse($val, NumberFormatter::TYPE_DOUBLE)
    );

    echo "\n";
}
~~~

Zu beachten ist die unterschiedliche Ausgabe bei Eingaben wie `"1.500"` und `"1,500"`, die `get_float` als `double(1.5)` interpretiert, während der Ansatz mit `filter_var` hier `bool(false)` zurückgibt, was „nicht entscheidbar“ bedeutet. Zudem akzeptiert nur `get_float` eine Eingabe wie `"1500,000,000"`, in der nicht jeder mögliche Tausenderseparator gesetzt ist.