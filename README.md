Contribute!-Richtlinie
================

Dies ist das GitHub-Pages Repository der PHP.de-Community. 
Das GitHub-Pages Repository gliedert sich in Sektionen. 
Jede Sektion ist in ein eigenes Repository entkoppelt, du
kannst jederzeit Beiträge auf Basis dieser Richtline verändern
oder erweitern. Nur Besitzern ( Owner ) der Organisation php-de
ist es gewährt Änderungen an diesem Repository zu handhaben oder
an andere Mitglieder der Community zu deligieren. Bitte verändere
an diesem Repository nichts, da dies unter Umständen Auswirkungen
auf die Stabilität oder Funktionalität unserer Github-Page hat.

### 1. Grundsätzliches

Respektiere folgende Regeln wenn du Content hinzufügst oder bearbeiten möchtest:
* Wenn du existierende Beiträge bearbeitest, verändere nicht den ursprünglichen Autor
* Wenn du existierende Beiträge bearbeitest, füge dich als Autor in das YAML-Array hinzu
* Wenn du neue Beiträge hinzufügst, muss die Markdown Datei der MarkDown-Richtlinie entsprechen
* Wenn du neue Beiträge hinzufügst, bist du damit Einverstanden das der von dir geleistete Beitrag unter Namensnennung in jedem Medien-Format ( Zeitungen, Zeitschriften, Internet-Blogs, Internet-Foren, Bücher, Podcasts, ... ) wiederverwendet werden darf
* Wenn du neue Beiträge hinzufügst, deligierst du die Verantwortung über die Pflege und Weiterentwicklung deines Beitrags an die Community, du hast keinen Anspruch auf Löschung.
* Wenn du neue Beiträge hinzufügst oder existierende Beiträge veränderst, trägst du eine Sorgfaltspflicht. Achte auf eine vernünftige objektive Ausdrucksweise und veröffentliche nur Quellcodes die du auch getestet hast. PHP-Quellcodes sollten nach dem [PEAR PHP Coding Standard](http://pear.php.net/manual/de/standards.php) verfasst sein.
* Wenn du neue Beiträge hinzufügst oder existierende Beiträge veränderst, bist du damit einverstanden das dein Beitrag Aufgrund Inkompatibilität oder bedingt der aktuellen PHP-Version als obsolete angesehen werden könnte. Solche Beiträge werden in der Regel überarbeitet oder bei zweifelhafter Sinnhaftigkeit entfernt und ggf. durch alternativen Ersetzt.
* Wenn du Issues im Bug-Tracker der Beiträge kommentierst sei objektiv und sozial, du handelst wenn du dich hier einbringst innerhalb der Community, also innerhalb eines großen Teams mit unterschiedlichen Meinungen.
* Wenn du Issues in den Bug-Tracker der Beiträge erstellst, stelle sicher das du wirklich einen Fehler oder eine Verbesserung melden möchtest. Solltest du einen Beitrag oder dessen Verwendung diskutieren wollen, so solltest du auf [PHP.de](http://www.php.de) einen Beitrag erstellen.

### 2. How to share

Dieses Repository basiert auf einem kombinierten Datei-Format, 
das die original MarkDown definition in den ausgegliederten Mark-Down aufbricht.
Du solltest beim teilen von Inhalten aus den Repositories darauf verzichten direkt
auf die Markdown-Dateien zu verlinken ( hotlinking ) stattdessen verlinke auf den
generierten HTML-Inhalt in der entsprechenden Sektion auf der Github-Page.
Das kombinierte Datei-Format ist nötig um Meta-Daten an die JEKYLL-Instanz die für
das automatisierte Erstellen der statischen HTML-Dateien notwendig ist zu definieren.

### 3. MarkDown

Jede MarkDown-Datei muss sich an den [MarkDown Syntax](https://github.com/mojombo/github-flavored-markdown/issues/1)
halten, zusätzlich zu dem MarkDown muss jede Datei einen YAML-Kopf besitzen, der mindestens so aufgebaut sein muss:
```yaml
---
layout: entry
author:
   -:
      name: "MyUserNameOnPhpDeOrRealName"
      profileId: "12398123"
---
```
Folgende Felder werden von der GitHub-Page innerhalb der JEKYLL-Instanz berücksichtigt:
```
layout: <wert>

Mögliche Werte: entry
Setzt das Template in das der Markdown eingefügt wird.

author: <array>

Mögliche Werte: -: <return> <array-key: author> [Text] <return> <array-key: profileId> [Text]
Setzt Informationen über den Autor des Dokuments

shortDescription: <text>

Setzt die Beschreibung für die Suchmaschinen-Indizierung der Github-Page ( meta-tag )

keywords: <array>

Mögliche Werte: ["wert1","wert2","wert3","..."]
Setzt keywords für die Suchmaschinen-Indizierung der Github-Page ( meta-tag ).

```
Beispielhaft könnte eine hallo-welt.md so aussehen:
```markdown
---
layout: entry
author:
   name: "John Doo"
   profileId: "1234567890123"
sortDescription: "How to Hallo Welt!"
keywords: ["standard", "implementierung", "hallo", "welt", "php"]
---

Hallo-Welt Standard-Implementierung
================

...
```

### 4. Komponenten-Vernetzung

Grundsätzlich ist es kein Problem wenn du PHP-Komponenten die nicht zum PHP-Kern gehören 
oder auch Komponenten-Klassen aus Bibliotheken in deinen Beiträgen verlinkst. Wir setzen
allerdings voraus das die Klasse unter der bis zum Veröffentlichungszeitpunkt aktuellsten
PHP-Version fehlerfrei läuft und weistestgehend ( wenn das Thema des Beitrags allgemein gehalten ist )
auch auf allen Umgebungen ( Windows, Linux, MacOS ) lauffähig ist. Du solltest auch den Zustand
berücksichtigen das die meisten Hosting-Platformen noch niedrigere PHP-Versionen ausliefern.
Als grobe Empfehlung: Der Quellcode und/oder die Komponente sollte ab PHP 5.3 lauffähig sein.

Versuche bitte weitestgehend Komponenten die auf PHP-Quellcode basieren auf Github gehostet 
sind und wenn möglich [Composer](http://getcomposer.org)-Support bieten 
( auf [Packagist.org](http://packagist.org) gelistet sind ).

Für den Fall das eine verwendete Komponente per Composer verfügbar ist, solltest du in deinem Beitrag
außerdem die dafür notwendige composer.json als Quellcode mit in deinen Beitrag einbeziehen.
