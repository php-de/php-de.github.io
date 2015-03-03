---
layout: guide

permalink: /jumpto/template-engine/
root: ../..
title: "Template-Engine"
group: "Tutorials / Fertiglösungen"
orderId: 3

creator: tr0y
author:
    -   name: tr0y
        profile: 21125

    -   name: hausl
        profile: 21246

inhalt:
    -   name:   "Was sind Template Engines?"
        anchor: was-sind-template-engines
        simple: ""

    -   name:   "Wann sind Template Engines sinnvoll?"
        anchor: wann-sind-template-engines-sinnvoll
        simple: ""

    -   name:   "Welche Template Engine sollte ich benutzen?"
        anchor: welche-template-engine-sollte-ich-benutzen
        simple: ""

    -   name:   "Was ist nötig für eine leicht erweiterbare solide Template Engine?"
        anchor: was-ist-ntig-fr-eine-leicht-erweiterbare-solide-template-engine
        simple: ""


    -   name:   "Implementierung"
        anchor: implementierung
        simple: ""
---

#### Was sind Template Engines?

Template Engines sind Bibliotheken, die den notwendigen Aufwand zur Trennung von
HTML und PHP so gering wie möglich halten. Template Engines haben dabei die Aufgabe
Methoden und Variablen in einen für sich geschlossenen Bereich ( Scope ) bereit zu stellen.
Viele Template Engines heben sich von PHP ab, indem sie eine eigene Template-Sprache
mitbringen um somit das direkte Ausführen von PHP-Quellcode im Template verhindern.


#### Wann sind Template Engines sinnvoll?

Will man unbedingt eine Richtlinie festlegen die definiert wann eine Template Engine
sinnvoll ist und wann nicht, würde man sich nach  reichlicher Überlegung auf "immer"
festlegen. Es ist natürlich nicht immer jedes Feature einer Template Engine notwendig.
Die Grundaufgabe ( die Trennung von PHP und HTML ) sollte jedoch immer erfüllt werden.


#### Welche Template Engine sollte ich benutzen?

Kurz gesagt: die mit der du umgehen kannst. Viele würden jetzt blind auf Twig, Smarty
oder Mustache verweisen, was dir aber im Endeffekt erstmal wieder eine Lernphase in die
Entwicklung baut, die impliziert das du dich mit einer möglicherweise Komplexeren Teil-Anwendung
vertraut machen musst, als deine eigentliche Anwendung je sein wird.


#### Was ist nötig für eine leicht erweiterbare solide Template Engine?

Aus technischer Sicht benötigt eine Template Engine zwei Klassen. Eine Klasse, die es ermöglicht
globale Variablen und Template-eigene Funktionen zu registrieren und eine Methode liefert,
die das Rendern des Templates anzustoßen. Eine weitere Klasse, die als Template-Instanz dient, und
die es der Render-Methode ermöglicht dem Template zur Verfügung stehende Methoden von den
eigentlichen Engine-Funktionen zu trennen. Mehr ist aus technischer Sicht für eine traditionelle
Template Engine nicht notwendig.


#### Implementierung


##### Die Engine-Klasse

Um eine generelle leichte Erweiterbarkeit bereitzustellen erzeugen wir zuerst ein Interface
das die Methoden der Engine Klasse definiert. Ein Interface liefert hier die API die der
Anwendung die diese Klasse nutzen soll bereitgestellt wird. Unsere eigentliche Anwendung kann
sich auf die in diesem Interface definierten Methoden verlassen und wird nur diese Methoden
zum bedienen der Template Engine benutzen.

`EngineContract.php`

~~~ php
<?php

namespace TemplateEngine;

interface EngineContract {
    public function directory($aliasName, $directory);
    public function define($functionName, \Closure $callback);
    public function stringify($interface, \Closure $callback);
    public function assign(array $globalAssignments);
    public function build($templateName, array $localAssignments = array());
    public function compile(Template $template);
    public function render($templateName, array $localAssignments = array());
}
~~~

Die konkrete Implementierung:
`Engine.php`

~~~ php
<?php

namespace TemplateEngine;

class Engine implements EngineContract {

    protected $fileExtension = 'phtml';
    protected $functions = array();
    protected $stringifier = array();
    protected $globalAssignments = array();
    protected $directories = array();

    public function __construct(array $directories = array(), $fileExtension = 'phtml')
    {
        if ( ! empty($directories) ) {
            foreach ( $directories as $alias => $directory ) {
                $this->directory($alias, $directory);
            }
        }

        $this->fileExtension = ltrim($fileExtension, '.');

        $this->define('render', function($templateName, array $assignments) {
            return $this->render($templateName, $assignments);
        });
    }

    public function directory($aliasName, $directory)
    {
        if ( ! is_dir($directory) ) {
            throw new \Exception(
                sprintf('`%s` is not a directory', $directory)
            );
        }

        $this->directories['@'.ltrim($aliasName, '@')] = realpath($directory);

        return $this;
    }

    public function define($functionName, \Closure $callback)
    {
        $this->functions[strtolower($functionName)] = $callback;
    }

    public function stringify($interface, \Closure $callback)
    {
        $this->stringifier[$interface] = $callback;
    }

    public function assign(array $globalAssignments)
    {
        $this->globalAssignments = $globalAssignments;
    }

    public function build($templateName, array $localAssignments = array())
    {
        $templateFilename = str_replace(
            array_keys($this->directories),
            array_values($this->directories),
            $templateName
        );

        if ( empty($this->directories) ) {
            throw new Exception(
                'can not resolve template, no directories registered to the engine'
            );
        }

        if ( ! is_file($templateFilename.'.'.$this->fileExtension) ) {
            throw new Exception(
                sprintf(
                    'can not resolve template `%s`, template not found',
                    $templateName
                )
            );
        }

        $file = realpath($templateFilename.'.'.$this->fileExtension);

        $assignments = $this->globalAssignments;

        foreach ( $localAssignments as $key => $value ) {
            $assignments[$key] = $value;
        }

        return new Template($file, $this->functions, $this->stringifier, $assignments);
    }

    public function compile(Template $template)
    {
        $compiler = function() {
            ob_start();
            try {
                include $this->templateFileName();
            }
            catch ( Exception $exception ) {
                ob_end_clean();
                throw $exception;
            }

            $content = ob_get_contents();
            ob_end_clean();

            return $content;
        };

        return call_user_func($compiler->bindTo($template));
    }

    public function render($templateName, array $localAssignments = array())
    {
        return $this->compile($this->build($templateName, $localAssignments));
    }

}

~~~


###### directory()

Die `directory()`-Methode assoziiert einen beliebigen Dateipfad mit einem Alias,
sodass du nicht innerhalb von Template oder beim Render-Aufruf immer den konkreten
Pfad zur Template-Datei angeben musst.


###### define()

Die `define()`-Methode assoziiert einen beliebigen in der Klasse `Template` nicht
existenten Methodennamen mit einem `Closure`-Callback. Die mit dieser Methode
definierten Funktionen sind als Objekt-Methoden mit Hilfe von `$this` aufrufbar.


###### stringify()

Die `stringify()`-Methode assoziiert ein beliebiges Interface ( Klassen- oder Interface-Name )
mit einem `Closure`-Callback. Beim Zugriff auf die Assignments im Template ruft das Template
automatisch das Callback das auf das jeweilige Interface registriert wurde auf wenn ein Objekt
dem Template übergeben wurde.


###### assign()

Die `assign()`-Methode setzt die globalen Assignments. Globale Assignments sind in allen
Templates verfügbar und müssen nicht innerhalb der Templates an weitere Template-Aufrufe
weitergereicht werden.


###### build()

Die `build()`-Methode erzeugt eine Template Instanz. Diese Methode wird von `render()`
benutzt und kann dazu verwendet werden ein traditionelles View-Objekt zu erzeugen.


###### compile()

Die `compile()`-Methode führt das übergebene Template aus. Diese Methode wird von `render()`
benutzt und sollte dazu verwendet werden zuvor mit `build()` erzeugte Template-Instanzen auszuführen.
Die Compile-Methode erzeugt ein Closure und bindet dieses Closure an die Template-Instanz.
Dieses Closure ist notwendig um das Template selbst in einen eigenen Scope zu bringen,
um zu vermeiden das Templates selbst die Engine oder andere anwendungsspezifischen Klassen
direkt manipulieren können.


###### render()

Die `render()`-Methode führt ein angegebenes Template aus. Diese Methode ruft `build()` auf
und benötigt keine Datei-Erweiterung. Es werden zuvor mit `directory()` assoziierte Verzeichnis-Aliase
in dem übergebenen Template-Namen ersetzt. Templates dürfen in dieser Implementierung Exceptions werfen,
die `build()`-Methode reicht diese an den aufrufenden Scope weiter.

Zusätzlich zu diesen Methoden ist noch ein Constructor definiert. Dieser speichert die
File-Extension der Templates und übernimmt generelle Directory-Alias-Assoziationen als Array.
Außerdem registriert der Constructor eine `render`-Template-Funktion sodass innerhalb der
Templates weitere Templates aufgerufen werden können.


##### Die Template-Klasse

Die Template-Klasse dient als Handler und wird in dieser Implementierung als `final` definiert,
um zu verhindern das die Template-Klasse selbst erweitert wird. Dies soll Methoden und
Eigenschaften-Konflikte innerhalb der Templates verhindern.

`Template.php`

~~~ php
<?php

namespace TemplateEngine;

final class Template {

    private $filename;
    private $functions = array();
    private $stringifier = array();
    private $assignments = array();

    public function __construct($filename, array $functions, array $stringifier, array $assignments)
    {
        $this->filename = $filename;
        $this->functions = $functions;
        $this->assignments = $assignments;
        $this->stringifier = $stringifier;
    }

    public function templateFileName()
    {
        return $this->filename;
    }

    public function __get($assignment)
    {
        if ( ! array_key_exists($assignment, $this->assignments) ) {
            throw new \Exception(
                sprintf('Unknown assignment `%s`', $assignment)
            );
        }

        if ( is_object($this->assignments[$assignment]) ) {
            foreach ( $this->stringifier as $currentInterface => $callback) {
                if ( is_a($this->assignments[$assignment], $currentInterface, true) ) {
                    return call_user_func($callback, $this->assignments[$assignment]);
                }
            }
        }

        return $this->assignments[$assignment];
    }

    public function __set($assignment, $value)
    {
        $this->assignments[$assignment] = $value;
    }

    public function __unset($assignment)
    {
        unset($this->assignments[$assignment]);
    }

    public function __isset($assignment)
    {
        return array_key_exists($assignment, $this->assignments);
    }

    public function __call($templateFunction, array $args)
    {
        if ( ! array_key_exists(strtolower($templateFunction), $this->functions) ) {
            throw new \Exception(
                sprintf('Unknown template function `%s`', $templateFunction)
            );
        }

        return call_user_func_array($this->functions[strtolower($templateFunction)], $args);
    }

}
~~~


###### templateFileName()

Die `templateFileName()`-Methode dient der Engine dazu den aktuellen Dateinamen des Templates abzurufen.
Diese Methode kann außerdem innerhalb von Templates für Debugging-Zwecke genutzt werden.


###### Magische Methoden

Die in dieser Klasse definierten Magischen Methoden erlauben das dynamische Implementieren von
öffentlichen Eigenschaften und Methoden. Die Methode `__get()` implementiert außerdem die
Stringify-Auflösung der Engine und untersucht das Assignment nach Objekten. Das automatische
Stringify ist in dieser Implementierung aber nur auf der obersten Ebene ( also dem direkten
Zugriff auf das Assignment ) verfügbar. Du kannst dieses Verhalten aber später mit einer Template-Funktion
für Arrays und andere Strukturen implementieren.


#### Der Test

In diesem Test-Beispiel wird [Composer]({{ page.root }}/jumpto/composer/)
für das Autoloading Verwendet.

`test.phtml`

~~~ php
<h1>Hallo Welt!</h1>
<?= $this->render('@here/another-template', array('today' => $this->today)) ?>
~~~

`another-template.phtml`

~~~ php
<p>Heute ist der: <?= $this->today ?></p>
~~~

`test.php`

~~~ php
<?php

require __DIR__.'/vendor/autoload.php';

$engine = new TemplateEngine\Engine(array('here' => __DIR__));

$engine->stringify(DateTimeInterface::class, function(DateTimeInterface $dt) {
    return $dt->format('d.m.Y');
});

echo $engine->render('@here/test', array('today' => new DateTime));
~~~

Resultat:

~~~ html
<h1>Hallo Welt!</h1>
<p>Heute ist der: 30.11.2014</p>
~~~


Aus technischer Sicht sind den Möglichkeiten dieser Template-Engine keine Grenzen gesetzt.
Du solltest dir aber darüber im klaren sein, was eine Template-Engine für Aufgaben übernehmen
sollte und was eine Template-Engine nicht tun sollte. Sinn und Zweck von Template-Engines
sollte in jedem Fall die strikte Trennung von Business- und Template-Logik sein.
