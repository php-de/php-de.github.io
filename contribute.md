---
layout: guide
permalink: /jumpto/contribute/
root: ../..
title: "Contribute Richtlinie"

creator: tr0y
author:

    -   name: tr0y
        profile: 21125

    -   name: hausl
        profile: 21246

entry-type: in-discussion

inhalt:

    -   name: "Beitragsregeln"
        anchor: beitragsregeln
        simple: "Wann und Warum"

    -   name: "Markdown-Aufbau"
        anchor: markdown-aufbau
        simple: "Programmieren?!"

    -   name: "Komponenten Vernetzung"
        anchor: komponenten-vernetzung
        simple: "composer require ..."


---

Diese Webseite basiert auf einem Github-Repository das durch das
Github-Pages System über JEKYLL statische Webseiten erzeugt. Alle
Beiträge dieses Repository dürfen von jedem weiterentwickelt und
verändert werden. Wie genau die Markdown-Dateien im einzelnen
aufgebaut sind und welche Möglichkeiten für das definieren der
Markdowns bereitgestellt wurden erfährst du in diesem Beitrag.

<div class="alert alert-warning">
<strong>Wichtig!</strong> Beiträge werden nur alle 10 Minuten von JEKYLL auf Github erneuert. Dieser Interval ist nicht davon abhängig wann du Dinge veränderst, es ist ein fester Zeit-Interval.
</div>

### Beitragsregeln

Respektiere folgende Regeln wenn du Beiträge hinzufügen oder bearbeiten möchtest:

* Frühere Autoren insbesondere der Ersteller müssen bestehen bleiben
* Füge dich selbst ans Ende des YAML-Arrays hinzu, es ist nicht nötig seine Leistung besonders hervorzuheben. Das Array dient lediglich als chronologisches Protokoll der Beteiligten Akteure in diesem Repository.
* Wenn du Beiträge anlegen möchtest ist es nötig dieses Repository zu forken um deine Änderungen als Pull-Request an die Owner dieses Repository weiterzuleiten. Die Annahme dieser Pull-Requests kann mitunter etwas dauern, es ist nicht nötig mit den Verantwortlichen Mitgliedern der Community in Verbindung zu treten, wir bemühen uns so schnell wie möglich deinen Pull-Request zu prüfen und zu bestätigen. Übe dich in Geduld.
* Jeglicher PHP Quellcode in den Beiträgen sollte sich an den [PEAR PHP Coding Standard](http://pear.php.net/manual/de/standards.php) halten. Beiträge mit Quellcode die sich nicht an den Standard halten können von uns jederzeit abgelehnt werden.
* Wenn du neue Beiträge hinzufügst kannst du eine eigene Sourcecode-Lizenz verlinken, nutze dazu den Array-Schlüssel `lizense-url`, solltest du keine eigene Lizenz verlinken unterliegt der Quellcode den du hier veröffentlichst der Gesamtwerk-Lizenz, der Beitrag ansich wird dabei immer unter der Gesamtwerk-Lizenz lizensiert, du hast **kein Anrecht auf spätere Löschung**. Dein Beitrag bzw. deine Beitragsveränderung dient dem Nutzen der Community und wird von dir der Community zur Freien verwendung unter dieser Lizenz unumkehrbar bereitgestellt. Vermeide bitte Sourcecode-Lizenzen zu einem späteren Zeitpunkt zu verändern, falls du dies in Betracht ziehst, frage zuerst die Verwalter dieses Repositories, wir wollen dadurch lediglich vermeiden das Sourcecode der schon länger in diesem Repository existiert, die Lizenz verändert.
* Wenn du einen Fehler in einem Beitrag entdeckt hast, nutze immer den Issue-Tracker um ihn zu melden.
* Wenn du selbst einen Beitrag verfasst und ihn nicht als Entgültig einsenden möchtest, konfiguriere den YAML-Kopf so das der Beitrag als `in-progress` eingestellt wird.
* Verändere nichts an den Templates, den `index.md`-Dateien, dem Javascript-Dateien oder den Cascading Style Sheets, empfehle stattdessen im Issue-Tracker eine Veränderung. Pull-Requests die Modifikationen an diesen Dateien vornehmen werden vorbehaltslos abgelehnt.
* Wenn du einen Beitrag diskutieren möchtest, erstelle einen Beitrag im [Wiki-Forum](http://www.php.de/wiki-diskussionsforum/).
* Der Issue-Tracker des Repository kann ebenfalls als To-Do-Liste der einzelnen Beiträge benutzt werden. Beiträge die eine Todo-Liste im Bug-Tracker haben, sollten als `in-progress` oder `in-discussion` markiert sein. Der Eintrag im Bug-Tracker bedarf eines <span class="label label-success">To-Do</span> Labels. Anhand dieser ToDo-Liste können im Zweifelsfall andere deine Arbeit fortführen, außerdem erhalten wir so etwas Einblick in den Status deines Beitrag.

### Markdown-Aufbau

<div class="alert alert-warning">
    <strong>Wichtig:</strong> Änderungen am JEKYLL sind diskutabel und sollten im Forum diskutiert werden.
</div>
Das JEKYLL-System benutzt [kramdown](http://kramdown.rubyforge.org/quickref.html)-Syntax und erlaubt inline HTML. Du kannst also auch Bootstrap-Komponenten wie das obige Warning mit in deinen Beitrag einbauen. Nutze bitte nur folgende Bootstrap-Elemente: Warnings, Wells, Media-Objects, Labels. Nutze HTML **nicht** dazu Demonstrationen deiner Quellcodes auszuliefern. Deine HTML-Elemente dürfen kein Javascript ausführen oder Ziel einer Javascript-Komponente der Seite werden. Die statischen HTML-Seiten werden mit dem HTML5-Doctype erstellt (kein XHTML).

#### YAML

Jedes Dokument fängt mit einem YAML-Kopf an und muss zumindest die Einträge `layout: guide`, `permalink: "/jumpto/dateiname-ohne-extension/"` und `root: "../.."` besitzen. Damit wird JEKYLL angewiesen, das entsprechende Layout für Beiträge zu benutzen, den Permanent-Link richtig zu aggregieren und einen relativen Pfad in der Variablen `{{ "{{ page.root " }}}}` bereitzustellen, über den andere Seiten und sonstige Ressourcen verlinkt werden können.

~~~ yaml
---
layout: guide
permalink: "/jumpto/foobar/"
root: "../.."
---
~~~

Zusätzlich ist es notwendig, einen Titel anzugeben. Dafür wurde das Feld `title` geschaffen.

~~~ yaml
---
layout: guide
permalink: "/jumpto/foobar/"
root: "../.."
title: "Hallo Welt Tutorial"
---
~~~

Damit JEKYLL feststellen kann wer das Tutorial eigentlich ursprünglich verfasst hat, muss jeder Beitrag 2 weitere Felder ausliefern: `authors` und `creator`. Das authors-Feld ist ein YAML-Array aus YAML-Arrays und ist wie folgt aufgebaut:

~~~ yaml
---
layout: guide
permalink: "/jumpto/foobar/"
root: "../.."
title: "Hallo Welt Tutorial"

creator: JohnDoe

authors:

    -   name: JohnDoe
        profile: 12345678
---
~~~

Das Feld `name` ist notwendig, das Feld `profile` ist optional. Wenn einer der Felder `name` und das Feld `creator` übereinstimmen wird der jeweilige Autor als ursprünglicher Ersteller des Beitrags markiert. Zusätzlich zu diesen Feldern gibt es noch ein optionales `entry-type` Feld zur Steuerung der Beitrags-Typen-Mechanik. Als `entry-type` einstellbar sind: `default` ( Standardfall ), `in-progress` ( in Bearbeitung ), `deprecated` ( Veraltet ) und `in-discussion` ( in Diskussion ).

~~~ yaml
---
layout: guide
permalink: "/jumpto/foobar/"
root: "../.."
title: "Hallo Welt Tutorial"

creator: JohnDoe

authors:

    -   name: JohnDoe
        profile: 12345678

    -   name: Austin
        profile: 458238234

entry-type: in-progress
---
~~~

Es wird kein Automatischer Index von deinem Beitrag erstellt, diesen musst du selbstständig im Feld `inhalt` festlegen. Dieses Feld ist ebenfalls ein YAML-Array das YAML-Arrays enthält. Dir stehen die Felder `name` ( Title des Links ), `anchor` ( Anker im Beitrag ) und `simple` ( zusätzlicher kurzer Hinweis ) zur Verfügung, alle 3 sind notwendig wenn du einen Eintrag anlegst. Der Inhalt wird in der Desktop-Version rechts neben dem Beitrag angezeigt, in der mobilen Version oberhalb des Beitrags.

<div class="alert alert-danger"><strong>Fehler-Quelle:</strong> Alle Einträge im YAML-Array die <code>:</code> enthalten sollten außerdem in Double-Quotes <code>"</code> gesetzt werden.</div>

~~~ yaml
---
layout: guide
permalink: "/jumpto/foobar/"
root: "../.."
title: "Hallo Welt Tutorial"

creator: JohnDoe

authors:

    -   name: JohnDoe
        profile: 12345678

    -   name: Austin
        profile: 458238234

entry-type: in-progress

inhalt:
    -   name: "foo"
        anchor: foo
        simple: "foo is my best friend"
---
~~~

#### Sortierung

Grundsätzlich kann für die Anzeige in der Hauptübersicht die Reihenfolge der Beiträge innerhalb einer Kategorie sortiert werden. Generell sortiert jekyll diese Beiträge nicht. Durch Angabe des Wertes `orderId` im jeweiligen Beitrag, kannst du beeinflussen nach welchem Beitrag dein Beitrag eingeordnet wird. Dieser Wert muss zwischen `0` und `25` definiert werden. Für den Fall das unsere Beiträge irgendwann diese Zahl pro Gruppe in der Übersicht übersteigt, werden wir dort mehr Spielraum schaffen. Generell nimmt diese Zahl allerdings direkten Einfluss auf die Generierungzeit die unser Repository in Anspruch nimmt.


#### Pfade für interne Verlinkung von Artikel, Bilder, etc.

In Beiträgen verlinkte Bilder liegen zentral im Verzeichnis `images` im Root.

Die Jekyll-Variable `{{ "{{ page.root " }}}}` kann in *.md-Dateien genutzt werden, um einen (relativen) Pfad zum Document-Root zu erhalten.

Interne Verlinkungen sollten somit so aussehen. Verzeichnisse sind Beispiele, es geht um das `{{ "{{ page.root " }}}}` und die Verankerung:


- `[...]({{ "{{ page.root " }}}}/jumpto/whatever/)`
- `<a href="{{ "{{ page.root " }}}}/jumpto/whatever/">...</a>`
- `<img src="{{ "{{ page.root " }}}}/images/foo.png">`


**Verlinkungen sind generell (intern und extern) ohne dem a-Attribut `target` anzugeben.**


### Komponenten Vernetzung

Grundsätzlich ist es kein Problem wenn du PHP-Komponenten die nicht zum PHP-Kern gehören oder auch Klassen aus Bibliotheken in deinen Beiträgen verlinkst. Wir setzen allerdings voraus, dass die Klasse unter der bis zum Veröffentlichungszeitpunkt aktuellsten PHP-Version fehlerfrei läuft und noch einen aktiven Maintainer besitzt ( also weiterentwickelt und betreut wird ). Du solltest auch den Zustand berücksichigen das die meisten Hosting-Platformen noch ältere PHP-Versionen ausliefern. Als groben Schnitt sollte dein Quellcode mindestens noch PHP 5.3 unterstützen.

Prüfe bitte ebenso ob deine Komponenten mit [Composer](http://getcomposer.org) installierbar ist, ist das der Fall veröffentliche bitte außerdem die Kurzform zur Installation `composer require ...` oder den Inhalt der `composer.json`-Datei oder einen direkten Link auf den [Packagist.org](http://packagist.org)-Eintrag.

Für den Fall das du dir nicht sicher bist ob du diese Komponente in diesem Repository verlinken darfst, sprich uns an. Für den Fall das du dir nicht sicher bist ob diese Komponente aus Lizenz-Sicht verlinkt werden darf, sprech entweder uns an oder bitte den Entwickler der Komponente um Klärung.

### Das Git Repository

Unser Wissens-Repository basiert auf GIT und wird auf Github gehostet. Um etwas über den Umgang mit GIT zu erfahren und wie du dich auf Github an diesem Repository beteiligen kannst, haben wir ebenfalls einen [Beitrag]({{ page.root }}/jumpto/how-to/) bereitgestellt.
