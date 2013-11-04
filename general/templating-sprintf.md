---
layout: guide
permalink: /jumpto/:title/
title: "‚Templating‘ auf Basis von sprintf"
group: "Allgemein"
creator: nikosch
author:
    -   name: nikosch
        profile: 2314

    -   name: mermshaus
        profile: 15041

inhalt:
    -   name: "Ausgangssituation"
        anchor: ausgangssituation
        simple: ""

    -   name: "Lösung"
        anchor: lsung
        simple: ""

    -   name: "Quellen"
        anchor: quellen
        simple: ""

entry-type: in-discussion
---

### Ausgangssituation

Als Beispiel nehmen wir eine Methode eines Fehlerobjektes, die beliebige
Fehlerdaten über einen variablen Formatstring in ein Logfile schreiben soll.
Dazu werden die Objektmember via `sprintf` in den Formatstring eingetragen. Um
eine beliebige Reihenfolge der Daten zu ermöglichen, bieten `printf` und Co.
das sogenannte *argument swapping* an, bei dem der gewünschte Paramter über
einen Index `n$` angegeben wird.

~~~ php
<?php

class MyError
  {
  static $sFormat = '%6$s %2$s (error %1$d) in %4$s line %5$d'; // Logline format, swapped arguments
  static $sLogfile = 'path/to/logfile';

  public function __construct ($iType , $sMessage , $aBackTrace , $sFile , $sLine)
    {
    $this->iType = $iType;
    $this->sMessage = $sMessage;
    $this->aBackTrace = $aBackTrace;
    $this->sFile = $sFile;
    $this->sLine = $sLine;
    }

  static function create ($iType , $sMessage)
    {
    // get BackTrace, File, Line ...
    return (new MyError ($iType , $sMessage , $aBackTrace , $sFile , $sLine));
    }

  public function log ()
    {
    $sMessage = sprintf (self::$sFormat ,
                         $this->iType ,
                         $this->sMessage ,
                         $this->aBackTrace ,
                         $this->sFile ,
                         $this->sLine ,
                         date ('Y-m-d H:i:s') );
    // check log file ...
    error_log ($sMessage , 3 , self::$sLogfile);
    }
  }
~~~

Wie man sieht, ist die Definition des Klassenmembers `$sFormat` sehr kryptisch
und nicht gerade intuitiv. Will man das Format ändern, muss man sich stets die
jeweiligen Indizes der Attribute der `sprintf`-Funktion heraussuchen. Noch
schlimmer: Die Indizes der Parameter sind dazu abhängig von der `log`-Methode,
sind hier quasi fest verdrahtet.

Ziel ist also ein adäquater Ersatz für `sprintf`, der im Formatstring eine
klare Aussage über den einzusetzenden Parameter macht. Im Endeffekt eine Art
Template. Wobei die eigentliche Funktionalität der Parameter von `printf`
erhalten werden soll, also zum Beispiel die explizite Typumwandlung eines
Parameters nach `int`, führende Nullen oder Leerzeichen.



### Lösung

Zunächst die Funktion, die ich `vsprintf_assoc` getauft habe. Genauso denkbar
wären natürlich Pendants für `printf`, `vprintf` und `vsprintf`:

~~~ php
<?php

define ('PRINT_FORMATTED_TAG_MIN_LENGTH' , 1);

/*
string = vsprintf_assoc (string Format , array Settings)

    Liefert einen formatierten String, dessen Platzhalter mit Werten
    aus Settings gefüllt wurden. Die Funktion ist weitgehend identisch
    mit vsprintf (), lediglich die Art der Platzhalter ist anders.

    Die Platzhalter wurden hier zu 'sprechenden' Bezeichnern erweitert,
    die den Schlüsseln des assoziativen Arrays Settings entsprechen.
    Die Platzhalter-Syntax entspricht derjenigen von printf, die Platzhalter
    werden durch die jeweiligen Array Schüssel und ein abschließendes % Zeichen
    ersetzt. Die Funktionalität bleibt erhalten.

    Bsp.

      vsprintf Syntax
      ('%02d Personen namens %s' , array (7 , 'Heinz'));

      vsprintf_assoc Syntax
      ('%02dAnzahl% Personen namens %sName%' ,
       array ('Anzahl' => 7 , 'Name' => 'Heinz'));

    vsprintf_assoc unterstützt auch Array-Werte in beliebiger Dimension. Wichtig
    ist hierbei, die Platzhalterangabe ohne Leerzeichen zwischen Variablennamen
    und Klammer zu machen (ebenso zwischen Klammern mehrdimensionaler Angaben).

      ('%dAnzahl% Tage: %sTag[0]%, %sTag[1]%' ,
       array ('Anzahl' => 2 , 'Tage' => array ('Montag' , 'Mittwoch')));


    Parameter:            Format       Formatstring, siehe Beschreibung
                                       und printf Syntaxschema
                          Settings     assoziatives Array
    Abhängigkeiten:       PRINT_FORMATTED_TAG_MIN_LENGTH
                                       definiert die minimale Länge für
                                       Variablennamen
    Rückgabe:             String mit in die Platzhalter eingesetzten Werten.
    Hinweise:             - Diese Funktion unterstützt kein Argument swapping
                          im Formatstring (ist ja auch nicht sinnvoll)!
                          - Zur Performancesteigerung generiert die Funktion für
                          jeden neuen Formatstring eine eigene Lambdafunktion,
                          die sie selbst verwaltet.
                          - Auf abschließende % achten! Fehlende % werden mit
                          einem 'Too few arguments' Warning quittiert
--------------------------------------------------------------------------- */
function vsprintf_assoc ($sFormat , $aSettings)
  {
  static $aLambda = array ();

  $sIndex = md5 ($sFormat);

  # -- passende Lambda Funktion noch nicht vorhanden
  if (false === isset ($aLambda[$sIndex]))
    {
    # -- Suchpattern für Platzhalter
    $sPattern = '#(%[\-\+]?(?:\s|0|\\\'.)?\-?\d*(?:\.\d+)?[bcdeufFosxX])' .
                '([_A-Za-z][_A-Za-z0-9]{' .
                min (PRINT_FORMATTED_TAG_MIN_LENGTH - 1 , 0) .
                ',}(?:\[\d+\]|\[[\\\'\\"][^\\\'\\"]+?[\\\'\\"]\])*)%#';

    # -- Platzhalter suchen
    preg_match_all ($sPattern , $sFormat , $aOrder);

    # -- Parameterliste für Lambda Funktion zusammenstellen
    #    führendes Komma als Komma zwischen Formatstring und 1. Parameter
    $sParameters = '';
    foreach ($aOrder[2] as $sVariable)
      {
      $sParameters .= ',$' . $sVariable;
      }

    # -- Body der Lambda Funktion:
    #    extract ($aSettings);
    #    return (sprintf (...));
    $sFuncBody = 'extract($aSettings); return (sprintf (\'' .
                  # -- ' escapen
                  addcslashes (
                              # -- Platzhalter auf printf Format reduzieren
                              str_replace ($aOrder[0] , $aOrder[1] , $sFormat) ,
                              '\''
                              ) .
                  '\' ' . $sParameters . '));';

    # -- Lambda Funktion erstellen und im static Array speichern
    $aLambda[$sIndex] = create_function ('$aSettings' , $sFuncBody);
    }

  return ($aLambda[$sIndex] ($aSettings));
  }
~~~

Wie schon beschrieben, werden die `printf`-üblichen Platzhalter einfach durch
den Variablennamen und ein Prozentzeichen ergänzt. Aus `%s` wird also zum
Beispiel `%sAlbumtitel%`, aus `%02d` wird `%02dTracknummer%`. Diese Platzhalter
werden durch einen regulären Audsruck gesucht. Der Ausdruck, den ich für die
original `printf`-Syntax erstellt habe lautet:

~~~
(%[\-\+]?(?:\s|0|\\\'.)?\-?\d*(?:\.\d+)?[bcdeufFosxX])
~~~

Selbiger wird durch eine „Variablen“-Definition ergänzt. Als besonderes Feature
werden auch Arrays (numerisch und assoziativ, auch mehrdimensional)
unterstützt.

Aus den erkannten Settings wird dann eine Liste von Parameternamen
zusammengestellt, der Formatstring selbst wird `sprintf` kompatibel
„zurückentwickelt“. Die eigentliche Ersetzung erfolgt dann durch `sprintf`.

Für häufige Anwendungem sollte die aufwendige reguläre Suche reduziert werden.
Deshalb wird für jeden neuen Formatstring, der `vsprintf_assoc` übergeben wird
eine temporäre (sogenannte Lambda-)Funktion erstellt, deren Namen von
`vsprintf_assoc` selbst statisch verwaltet wird und einem md5-Hash des
Formatstrings zugeordnet wird.

Ein erneuter Aufruf mit diesem Format ruft die entsprechende Funktion –
gegebenenfalls mit anderen Parametern – direkt auf, ohne den Formatstring
erneut zu interpretieren.

Schauen wir uns abschließend die veränderte Sachlage an:

~~~ php
<?php

class MyError
  {
  // intuitive Logline format
  static $sFormat = '%sTimestamp% %sMessage% (error %dType%) in %sFile% line %dLine%';

  // ...
  public function log ()
    {
    $sMessage = vsprintf_assoc (self::$sFormat ,
                                array ('Type' => $this->iType ,
                                       'Message' => $this->sMessage ,
                                       'Backtrace' => $this->aBackTrace ,
                                       'File' => $this->sFile ,
                                       'Line' => $this->sLine ,
                                       'Timestamp' => date ('Y-m-d H:i:s')));
    // check log file ...
    error_log ($sMessage , 3 , self::$sLogfile);
    }
  }
~~~

Möglicherweise nicht das beste Ausgangsbeispiel, aber ich denke der ein oder
andere wird eine geeignete Anwendung finden…



### Quellen

* PHP Manual Funktionreferenzen: [`printf`](http://php.net/printf),
[`sprintf`](http://php.net/sprintf), [`vprintf`](http://php.net/vprintf),
[`vsprintf`](http://php.net/vsprintf)

