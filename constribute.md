---
layout: guide
title: "Constribute Richtlinie"

creator: tr0y
author:

    -   name: tr0y
        profile: 21125

entry-type: in-progress

inhalt:

    -   name: "Beitragsregeln"
        anchor: entry-rules
        simple: "Wann und Warum"

    -   name: "Markdown-Aufbau"
        anchor: markdown-structure
        simple: "Programmieren?!"

    -   name: "Komponenten Vernetzung"
        anchor: component-networking
        simple: "composer require ..."


---

Diese Webseite basiert auf einem Github-Repository das durch das
Github-Pages System über JEKYLL statische Webseiten erzeugt. Alle
Beiträge dieses Repository dürfen von jedem weiterentwickelt und
verändert werden. Wie genau die Markdown-Dateien im einzelnen
aufgebaut sind und welche Möglichkeiten für das definieren der
Markdowns bereitgestellt wurden erfährst du in diesem Beitrag.

<div class="alert">
<strong>Wichtig!</strong> Beiträge werden nur alle 10 Minuten von JEKYLL auf Github erneuert.
</div>

#### Beitragsregeln
<a id="entry-rules"></a>

Respektiere folgende Regeln wenn du Beiträge hinzufügen oder bearbeiten möchtest:

* Frühere Autoren insbesondere der Ersteller müssen bestehen bleiben
* Füge dich selbst ans Ende des YAML-Arrays hinzu, es ist nicht nötig seine Leistung besonders hervorzuheben.
* Wenn du Beiträge anlegen möchtest ist es nötig dieses Repository zu forken um deine Änderungen als Pull-Request an die Owner dieses Repository weiterzuleiten. Die Annahme dieser Pull-Requests kann mitunter etwas dauern, es ist nicht nötig mit den Verantwortlichen Mitgliedern der Community in Verbindung zu treten, wir bemühen uns so schnell wie möglich deinen Pull-Request zu prüfen und zu bestätigen. Übe dich in Geduld.
* Jeglicher PHP Quellcode in den Beiträgen sollte sich an den [PEAR PHP Coding Standard](http://pear.php.net/manual/de/standards.php) halten. Beiträge mit Quellcode die sich nicht an den Standard halten können von uns jederzeit abgelehnt werden.
* Wenn du neue Beiträge hinzufügst oder ältere Beiträge veränderst bist du damit einverstanden das der Beitrag unter der Creative Commons Lizenz BY-SA veröffentlicht wird, du hast **kein Anrecht auf spätere Löschung**. Dein Beitrag bzw. deine Beitragsveränderung dient dem Nutzen der Community und wird von dir der Community zur Freien verwendung unter dieser Lizenz unumkehrbar bereitgestellt.
* Wenn du einen Fehler in einem Beitrag entdeckt hast nutze den Issue-Tracker um ihn zu melden.
* Wenn du selbst einen Beitrag verfasst und ihn nicht als Entgültig einsenden möchtest, konfiguriere den YAML-Kopf so das der Beitrag als `in-progress` eingestellt wird.
* Verändere nichts an den Templates, den `index.md`-Dateien, dem Javascript-Dateien oder den Cascading Style Sheets, empfehle stattdessen im Issue-Tracker eine Veränderung. Pull-Requests die Modifikationen an ebendsolchen Dateien vornehmen werden vorbehaltslos abgelehnt.
* Wenn du einen Beitrag diskutieren möchtest, erstelle einen Beitrag im Forum.
* Der Issue-Tracker des Repository kann ebenfalls als To-Do-Liste der einzelnen Beiträge benutzt werden. Beiträge die eine Todo-Liste im Bug-Tracker haben, sollten als `in-progress` oder `in-discussion` markiert sein. Der Eintrag im Bug-Tracker bedarf eines <span class="label">To-Do</span> Labels.

#### Markdown-Aufbau
<a id="markdown-structure"></a>

<div class="alert">
    <strong>Wichtig:</strong> Änderungen am JEKYLL sind diskutabel und sollten im Forum diskutiert werden.
</div>
Das JEKYLL-System benutzt nDiscount-Markdown und erlaubt inline HTML, du kannst also auch Bootstrap-Komponenten wie das obige Warning mit in deinen Beitrag einbauen. Nutze bitte nur folgende Bootstrap-Elemente: Warnings, Wells, Media-Objects, Labels. Nutze HTML **nicht** dazu demonstrationen deiner Quellcodes auszuliefern. Deine HTML-Elemente dürfen kein Javascript ausführen oder Ziel einer Javascript-Komponente der Seite werden.

##### YAML

Jedes Dokument fängt mit einem YAML-Kopf an. Und muss zumindest den Eintrag `layout: guide` besitzen. Damit wird JEKYLL angewiesen das entsprechende Layout für Beiträge zu benutzen.
    ---
    layout: guide
    ---
Zusätzlich ist es notwendig einen Titel anzugeben, dafür wurde das Feld `title` geschaffen.
    ---
    layout: guide
    title: "Hallo Welt Tutorial"
    ---
Damit JEKYLL feststellen kann wer das Tutorial eigentlich ursprünglich verfasst hat, muss jeder Beitrag 2 weitere Felder ausliefern: `authors` und `creator`. Das authors-Feld ist ein YAML-Array aus YAML-Arrays und ist wie folgt aufgebaut:
    ---
    layout: guide
    title: "Hallo Welt Tutorial"

    creator: JohnDoe

    authors:

        -   name: JohnDoe
            profile: 12345678
    ---
Das Feld `name` ist notwendig, das Feld `profile` ist optional. Wenn einer der Felder `name` und das Feld `creator` übereinstimmen wird der jeweilige Autor als ursprünglicher Ersteller des Beitrags markiert. Zusätzlich zu diesen Feldern gibt es noch ein optionales `entry-type` Feld zur Steuerung der Beitrags-Typen-Mechanik. Als `entry-type` einstellbar sind: `default` ( Standardfall ), `in-progress` ( in Bearbeitung ), `deprecated` ( Veraltet ), `marked-to-delete` ( markiert zur Löschung ) und `in-discussion` ( in Diskussion ).
    ---
    layout: guide
    title: "Hallo Welt Tutorial"

    creator: JohnDoe

    authors:

        -   name: JohnDoe
            profile: 12345678

        -   name: Austin
            profile: 458238234

    entry-type: in-progress
    ---
Es wird kein Automatischer Index von deinem Beitrag erstellt, diesen musst du selbstständig im Feld `inhalt` festlegen. Dieses Feld ist ebenfalls ein YAML-Array das YAML-Arrays enthält. Dir stehen die Felder `name` ( Title des Links ), `anchor` ( Anker im Beitrag ) und `simple` ( zusätzlicher kurzer Hinweis ) zur Verfügung, alle 3 sind notwendig wenn du einen Eintrag anlegst. Der Inhalt wird in der Desktop-Version rechts neben dem Beitrag angezeigt, in der mobilen Version oberhalb des Beitrags.

<div class="alert">Alle Einträge im YAML-Array die ":" enthalten sollten außerdem in Double-Quotes ( " ) gesetzt werden.</div>
    ---
    layout: guide
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

#### Komponenten Vernetzung
<a id="component-networking"></a>

Grundsätzlich ist es kein Problem wenn du PHP-Komponenten die nicht zum PHP-Kern gehören oder auch Klassen aus Bibliotheken in deinen Beiträgen verlinkst. Wir setzen allerdings voraus das die Klasse unter der bis zum Veröffentlichungszeitpunkt aktuellsten PHP-Version fehlerfrei läuft und noch einen aktiven Maintainer besitzt ( also weiterentwickelt und betreut wird ). Du solltest auch den Zustand berücksichigen das die meisten Hosting-Platformen noch ältere PHP-Versionen ausliefern. Als groben Schnitt sollte dein Quellcode mindestens noch PHP 5.3 unterstützen.

Prüfe bitte ebenso ob deine Komponenten mit [Composer](http://getcomposer.org) installierbar ist, ist das der Fall veröffentliche bitte außerdem die Kurzform zur Installation `composer require ...` oder den Inhalt der `composer.json`-Datei oder einen direkten Link auf den [Packagist.org](http://packagist.org)-Eintrag.
