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

Tests:

~~~ php
$arr = array(
           "1500.23",
           "1500,23",
           "1.500,23",
           "1,500.23",
       );


foreach ($arr as $val) {
    var_dump(get_float($val));
}

/*
    float 1500.23
    float 1500.23
    float 1500.23
    float 1500.23
*/
~~~

