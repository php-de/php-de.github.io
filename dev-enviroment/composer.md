---
layout:    guide
permalink: /jumpto/composer/
title:     "Composer Kickstart-Guide"
creator:   tr0y
group:     "Entwicklungsumgebung"
orderId:   2

author:
    -   name: tr0y
        profile: 21125

    -   name: hausl
        profile: 21246

inhalt:
    -   name:   "Was ist Composer?"
        anchor: was-ist-composer
        simple: ""

    -   name:   "Wozu Packagist.org?"
        anchor: wozu-dient-packagistorg
        simple: ""

    -   name:   "Brauche ich Composer als Anfänger?"
        anchor: ich-bin-anfnger-brauche-ich-composer
        simple: ""

    -   name:   "Composer - Vorbereitung, Installation, Tests"
        anchor: composer-installation
        simple: ""

    -   name:   "Komponenten Installieren"
        anchor: komponenten-installieren
        simple: ""

    -   name:   "Komponenten und Installationen updaten"
        anchor: komponenten-und-installationen-updaten
        simple: ""

    -   name:   "Komponenten verwenden"
        anchor: komponenten-verwenden
        simple: ""

    -   name:   "Appendix"
        anchor: appendix
        simple: ""

---

![Composer]({{ site.url }}/images/composer-logo.png){: class="pull-right"} 

Dieser Guide soll (allem voran Einsteigern) einen Einblick in das Abhängigkeits-Management-Werkzeug [Composer](http://getcomposer.org/) und das Komponenten-Repository [Packagist.org](http://packagist.org/) bieten. In diesem Guide wird speziell auf den Installations- und Verwendungsprozess unter Microsoft Windows eingegangen.

### Was ist Composer?

Composer ist ein auf PHP basierender Dependency Manager (Abhängigkeitsverwalter). Dependency Manager dienen dazu Anwendungen modular zu warten - also den Prozess der Wartung von Anwendungskomponenten wie Frameworks und Libraries auf ein Minimum zu reduzieren. Außerdem dienen Dependency Manager dazu den ständig wiederkehrenden Prozess der *Komponenten-Installation* bei neue erstellten Projekten stark zu vereinfachen.


### Wozu dient Packagist.org?

Packagist.org ist das zu Composer gehörende [Repository](http://de.wikipedia.org/wiki/Repository), quasi ein Verzeichnis darüber was via Composer verwendet werden kann. Packagist.org ist aber nur eine Quelle von wo Composer Komponenten in euer Projekt *einspeisen* kann.


### Ich bin Anfänger, brauche ich Composer?

Nicht ganz leicht zu beantworten. Es hängt zum einen davon ab auf welchem Wissensstand du im Moment bist. Grundsätzlich erleichtert Composer deine Arbeit und erspart dir kompliziertes *durch die Welt includen*. Zum anderen gibt Composer einen Autoloading-Mechanismus vor, den du verwenden solltest (aber nicht musst) damit du deine Anwendungen nicht mit Teilprozesse überlädst die eigentlich das selbe tun.

Außerdem bedient der Großteil der Libraries und Frameworks die Composer liefern kann die Objektorientierte Entwicklung. Solltest du mit OOP (noch) nichts am Hut haben, ist Composer vorerst uninteressant für dich.


### Composer Installation


#### Vorbereitung

Composer selbst benötigt zum Reibungslosen ablauf des Paket-Imports der Packagist.org-Pakete [Git](http://de.wikipedia.org/wiki/Git). Git ist ein Versionskontrollsystem (VCS) das Composer als Werkzeug nutzt um Komponenten direkt von [Github.com](http://github.com/) in deinen Projektordner zu importieren.

Lade dir Git-SCM [herunter](http://git-scm.com/download/win) und installiere es wie folgt:

* Starte den Installer durch einen doppelklick auf die heruntergeladene Datei. Alle Windowsversionen mit aktivierter Benutzerkontrolle werden dich danach fragen ob dem Installer erlaubt werden soll ausgeführt zu werden, bestätige diese anfrage mit **Ja**.  

* Bestätige die Lizenz mit klick auf **Next >**  

* Bestätige die Komponenten mit klick auf **Next >**  

* Wähle beim *Path-Environment*, **Run git from the Windows-Prompt** aus und bestätige mit klick auf **Next >** (Wichtig für den Betrieb von Composer)  

* Wähle beim *Line Ending Conversion*, **Checkout Windows-Style, commit Linux-Style line endings** aus und bestätige mit klick auf **Next >**  

* Bestätige den Abschluss der Installation mit klick auf **Finish**  


Gratulation, du verfügst nun über eine voll funktionsfähige Git-Installation.


#### Installation

Composer selbst steht zum einen als phar-Executable bereit, verwenden wirst du allerdings (da du unter Windows arbeitest) den Composer Windows Installer, welchen du hier [runterlädst](http://getcomposer.org/Composer-Setup.exe).


* Starte den Installer durch einen doppelklick auf die heruntergeladene Datei. Alle Windowsversionen mit aktivierter Benutzerkontrolle werden dich danach fragen ob dem Installer erlaubt werden soll ausgeführt zu werden, bestätige diese anfrage mit **Ja**.  

* Klicke auf **Next >**  
Überprüfe den Pfad zu deiner PHP-Installation. Dieses Guide setzt voraus das du bereits eine Funktionierende [XAMPP](http://www.apachefriends.org/de/xampp.html), [WampServer](http://www.wampserver.com/en/), [SecureWAMP](http://securewamp.org/de/), [ZendServer](http://www.zend.com/de/products/server/) oder [WPN-XM](http://wpn-xm.org/) Installation hast. In der Regel brauchst du hier nichts verändern, der Installer arretiert das Verzeichnis zur PHP Installation der Jeweiligen PHP-Umgebungen selbst. Bestätige dort bitte mit Klick auf **Next >**  

* Klicke auf **Install**  

* Bestätige die Erfolgreiche Installation durch Klick auf **Finish**  


Gratulation, du verfügst nun über eine funktionierende Composer-Installation.


#### Testen der Composer Konnektivität und Git-Verfügbarkeit in der CL (Eingabeaufforderung)

In wenigen Netzwerkumgebungen kann es zu schwierigkeiten Zwischen deinem PC und dem Host den Composer nutzt kommen. Noch geringer ist die Chance das der Installationsprozess eine defekte Composer-Konfiguration mitgeliefert hat. Damit du diesem Problem vorbeugen kannst, teste die Konnektivität von Composer wie folgt:


Drücke ![Windows Taste]({{ site.url }}/images/win_logo_2012_black.png) (Windows Taste) + R und gib in dem darauf erscheinenden *Ausführen...*-Dialog **cmd** ein und bestätige mit der &crarr;-Taste (Enter-Taste).

Du befindest dich nun in der Eingabeaufforderung deines Betriebssystems, gib dort 

~~~
composer diagnose
~~~

ein. Wenn du bei allen Tests **OK** zurückgemeldet bekommst, ist alles in Ordnung. Wenn nicht solltest du dich mit deiner Netzwerkumgebung auseinander setzen.

Typische Rückgabe der Composer Diagnose:

~~~
Checking platform settings: OK
Checking http connectivity: OK
Checking composer version: OK
~~~

Du kannst sicherheitshalber auch die Git-Verfügbarkeit für CLI-Anwendungen prüfen in dem du in der selben offenen Eingabeaufforderung git eingibst. Im Normalfall gibt dieser Befehl die Hilfe des Befehls aus.


~~~
usage: git [--version] [--exec-path[=<path>]] [--html-path] [--man-path] [--info
-path]
           [-p|--paginate|--no-pager] [--no-replace-objects] [--bare]
           [--git-dir=<path>] [--work-tree=<path>] [--namespace=<name>]
           [-c name=value] [--help]
           <command> [<args>]

The most commonly used git commands are:
   add        Add file contents to the index
   bisect     Find by binary search the change that introduced a bug
   branch     List, create, or delete branches
   checkout   Checkout a branch or paths to the working tree
   clone      Clone a repository into a new directory
   commit     Record changes to the repository
   diff       Show changes between commits, commit and working tree, etc
   fetch      Download objects and refs from another repository
   grep       Print lines matching a pattern
   init       Create an empty git repository or reinitialize an existing one
   log        Show commit logs
   merge      Join two or more development histories together
   mv         Move or rename a file, a directory, or a symlink
   pull       Fetch from and merge with another repository or a local branch
   push       Update remote refs along with associated objects
   rebase     Forward-port local commits to the updated upstream head
   reset      Reset current HEAD to the specified state
   rm         Remove files from the working tree and from the index
   show       Show various types of objects
   status     Show the working tree status
   tag        Create, list, delete or verify a tag object signed with GPG

See 'git help <command>' for more information on a specific command.
~~~


Soweit so gut, Composer ist nun einsatzbereit. 

Die Installation von Composer ist nun abgeschlossen. Im folgenden beschäftigst du dich nun damit Composer zu verwenden:


### Komponenten Installieren

Composer benötigt zum durchführen der Installation und dem einspielen von Updates eine Datei mit dem Namen **composer.json** im Hauptverzeichnis deiner Anwendung. Wie die Datei-Erweiterung schon verrät ist diese Datei im JSON-Format gehalten. Composer wird bei der Installation der Komponenten automatisch ein *vendor*-Verzeichnis anlegen, in dem der Autoloader und alle installierten Komponenten hinterlegt werden. Später, wenn dein Knowhow und der Umgang mit Composer sicherer geworden ist kannst du dieses Verhalten auch verändern, dieses Guide bezieht sich allerdings auf die Vorgabe von Composer.

Ein Beispiel: Auf Packagist.org hast du 2 Komponenten gefunden, die du gerne für dein Projekt verwenden möchtest: [Swiftmailer](https://packagist.org/packages/swiftmailer/swiftmailer) und das [Microframework](https://packagist.org/search/?tags=microframework) [Silex](https://packagist.org/packages/silex/silex). Auf den jeweiligen Packagist.org-Seiten zu den jeweiligen Komponenten siehst du einige Informationen, folgende Abschnitte sind für die Installation relevant:

* Swiftmailer:

        require: "swiftmailer/swiftmailer": "4.3.*@dev"


* Silex:

        require: "silex/silex": "1.0.*@dev"


Diese musst du nun in validem JSON in deiner composer.json-Datei notieren, diese Datei **muss** im UTF-8 Format abgespeichert werden:


~~~
{
   "require": {
      "swiftmailer/swiftmailer": "4.3.*@dev",
      "silex/silex": "1.0.*@dev"
   }
}
~~~

Navigiere nun in dein Anwendungsverzeichnis (dorthin wo du deine composer.json angelegt hast) und drücke &uArr; (Shift-Taste), halte die Taste und rechtsklicke auf der freien Fläche des Ordners (ohne irgendetwas zu selektieren). Das Kontext-Menü das sich dann öffnet verfügt über den Eintrag *Eingabeaufforderung hier öffnen*, wähle diesen aus.

In der Eingabeaufforderung gib 

~~~
composer install
~~~

ein.

Wenn alles richtig lieft, bekommst du folgende Rückmeldung von Composer:

~~~
Loading composer repositories with package information
Installing dependencies
  - Installing psr/log (1.0.0)
    Loading from cache

  - Installing symfony/routing (v2.2.1)
    Downloading: 100%

  - Installing symfony/http-foundation (v2.2.1)
    Downloading: 100%

  - Installing symfony/event-dispatcher (v2.2.1)
    Downloading: 100%

  - Installing symfony/http-kernel (v2.2.1)
    Downloading: 100%

  - Installing pimple/pimple (v1.0.2)
    Loading from cache

  - Installing silex/silex (dev-master 1cd7f3f)
    Cloning 1cd7f3f050b78dae4458d93892355720f56659f9

  - Installing swiftmailer/swiftmailer (dev-master e77eb35)
    Cloning e77eb358a1aa7157afb922f33e2afc22f6a7bef2

symfony/routing suggests installing symfony/config (2.2.*)
symfony/routing suggests installing symfony/yaml (2.2.*)
symfony/routing suggests installing doctrine/common (~2.2)
symfony/event-dispatcher suggests installing symfony/dependency-injection (2.2.*
)
symfony/http-kernel suggests installing symfony/browser-kit (2.2.*)
symfony/http-kernel suggests installing symfony/class-loader (2.2.*)
symfony/http-kernel suggests installing symfony/config (2.2.*)
symfony/http-kernel suggests installing symfony/console (2.2.*)
symfony/http-kernel suggests installing symfony/dependency-injection (2.2.*)
symfony/http-kernel suggests installing symfony/finder (2.2.*)
silex/silex suggests installing symfony/browser-kit (>=2.1,<2.3-dev)
silex/silex suggests installing symfony/css-selector (>=2.1,<2.3-dev)
silex/silex suggests installing symfony/dom-crawler (>=2.1,<2.3-dev)
silex/silex suggests installing symfony/form (To make use of the FormServiceProv
ider, >= 2.1.4 is required)
Writing lock file
Generating autoload files
~~~

Wie du siehst, wurden mehrere Komponenten Installiert, da bspw. Silex auf mehreren Symfony-Komponenten aufbaut, genauer davon abhängt. Worauf man schnell den Rückschluss auf die Begriffserklärung eines Abhängigkeits-Managers erfährt.

Einmal installierte Komponenten hinterlegen im Hauptverzeichnis eine composer.lock, dort ist gespeichert was wo wann wie installiert wurde. Außerdem verhindert diese Datei ein nochmaliges ausführen des install-Befehls im selben Verzeichnis. Ab jetzt musst du deine Installation updaten:


### Komponenten und Installationen updaten

Wann immer du deine composer.json veränderst führe wie bei der Komponenten-Installation composer aus, allerdings nicht mit der Ergänzung *install* sondern mit der Ergänzung *update*

~~~
composer update
~~~


### Komponenten verwenden

Um die Komponenten verwenden zu können ist nicht viel Mühe notwendig. Als Beispiel erstelle ein PHP-Script im Anwendungsverzeichnis mit dem Namen *index.php*, dort testen wir aus der vorherigen Installation eine einfache Silex-basierende Anwendung:


~~~
<?php

require 'vendor/autoload.php';

$app = new Silex\Application;

$app->get('/', function() use ($app) {
   return 'Hello World.';
});

$app->get('/foo', function() use ($app) {
   return 'This is the /foo request.';
});

$app->run();
~~~

Glückwunsch, du hast nun Composer erfolgreich getestet und verfügst nun über einen soliden Zugang zum Packagist-Repository.


### Appendix

Vorschläge, Anregungen, Feedback? Dann bitte [hier in diesem Forumsthread](http://www.php.de/php-einsteiger/98949-guide-composer-kickstart-guide.html) posten.
