---
layout: guide

permalink:  /jumpto/performance/
root:       ../..
title:      "Performance"
group:      "Code-Optimierung"
orderId:    12
entry-type: in-discussion

creator: Andreas

author:
    - name:    Andreas
      profile: 4302
    - name:    mermshaus
      profile: 15041

---

Einige Grundregeln, die in vielen Fällen sinnvoll erscheinen, um die Performance eines Scripts oder einer PHP-Anwendung positiv zu beeinflussen:

- **Die Datenbank gut konfigurieren**

  Indizes und gut gewählte Datentypen in der Datenbank sowie eine gute Partitionierung und Konfiguration des DBMS vermeiden Performanceprobleme von Grund auf. Schlecht konfigurierte Datenbanken sind eine häufige Problemursache.

- **Prepared Statements verwenden**

  Prepared Statements sind nicht nur aus Sicherheitsgründen empfehlenswert, sondern verbessern auch die Performance, weil der Ausführungsplan in der Datenbank nur einmal erstellt werden muss. Somit wird bei jeder SQL-Query, die schon in ähnlicher Form ausgeführt wurde und bei der sich nur einige Werte ändern, Zeit eingespart.

- **Die Datenbank die Arbeit machen lassen, wo es geht**

  500.000 Datenbankeinträge zu laden, um in PHP einen Durchschnitt auszurechnen, ist nicht sinnvoll. Das kann auch mit Datenbankfunktionen erledigt werden. Besonders bei aufwändigen PHP-Bausteinen sollte die Frage gestellt werden, ob das nicht auch die Datenbank machen kann.

- **Nicht zu viele Daten auf einmal laden**

  Bei jedem Request einen Join auf sechs Tabellen zu machen, damit in einer Tooltip-Ansicht auch die Berechtigungen und Rollen des angemeldeten Benutzers angezeigt werden, ist wahrscheinlich übertrieben. Hier sollte überlegt werden, ob diese Infos unter allen Umständen benötigt werden oder ob es nicht klüger wäre, einzelne Datensätze per Klick und Ajax nachzuladen. Wahlweise könnte auch Caching verwendet werden.

- **Caching (sinnvoll) einsetzen**

  Die Resultate aufwändiger Berechnungen und lang andauernder Programmteile sollten in einem Cache zwischengespeichert werden, wenn sich die Daten nicht allzu oft ändern. Dabei empfiehlt sich auch die Beschäftigung mit den HTTP-Caching-Headern (z. B. 304 not modified, IF-MODIFIED-SINCE, pragma, cache-control, etag, last-modified). Oft muss PHP gar nicht gestartet werden, sondern eine Ressource kann bereits auf Protokoll- oder Webserver-Ebene bereitgestellt werden. Webserver unterstützen zumeist Multithreading und sind deutlich schneller als PHP.

- **Session nicht als Datencache missbrauchen**

  Etliche PHP-Programmierer nutzen die Session als Zwischenspeicher für diverse Infos (z. B. Benutzerdaten oder Konfigurationsdaten). Das ist keine gute Idee, denn die Session ist häufig ein sehr langsamer Speicher, der bei jedem Request für jeden User geschrieben und gelesen werden muss. Das führt dazu, dass PHP für andere Requests blockiert wird. Das ist insbesondere bei parallelen Ajax-Requests sehr nachteilig. Mehr dazu:

  \- [maximem: Speed up your sessions, part 1 – Best practices](http://phpchunk.net/2011/06/speed-up-your-sessions-part-1-best-practices/)

- **Autoloader optimieren**

  [Composer]({{ page.root }}/jumpto/composer/) ist *das* Werkzeug für PHP, um Abhängigkeiten effizient zu verwalten. Composer verfügt auch über einen guten Autoloader. Leider wird dieser nur selten so konfiguriert, dass die Autoload-Dateien in Form einer Classmap optimiert werden. Das kann spürbaren Einfluss auf die Laufzeit haben. Mehr dazu:

  \- [Composer: Command-line interface/Commands, dump-autoload](https://getcomposer.org/doc/03-cli.md#dump-autoload)

  Dieser Eintrag in der `composer.json`-Datei ist recht hilfreich:

  ~~~
  {
      "config": {
          "optimize-autoloader": true
      },
      ...
  }
  ~~~

  \- [Composer: Config, optimize-autoloader](https://getcomposer.org/doc/06-config.md#optimize-autoloader)

- **Performance Probleme nicht vermuten, sondern verifizieren**

  Häufig werden Performance-Probleme dort vermutet, wo keine sind. Verifiziert werden können Performance-Engpässe etwa mit der [Xdebug-Erweiterung](https://xdebug.org/). Dort kann ein Profiler aktiviert werden, der relativ genaue Auskunft darüber liefert, in welchen Teilen des PHP-Programms die meiste Zeit verbracht wird. Ohne ein solches Werkzeug ist es schwierig bis unmöglich, Performance-Problemen auf die Spur zu kommen. Zur Analyse der Dateien, die vom Profiler generiert werden (Cachegrind-Format), kann unter Windows beispielsweise [QCacheGrind](https://sourceforge.net/projects/qcachegrindwin/) verwendet werden. Auch IDEs bieten teilweise eine entsprechende Funktionalität an (PhpStorm: Tools, Analyse XDebug Profiler Snapshot).

Wenn die „bestmögliche“ Performance gewollt ist und das Hauptaugenmerk nicht etwa auf unkomplizierter Entwicklung, Kompatibilität zu vielen Webhostern oder einer großen Community liegt, dann ist PHP wahrscheinlich nicht die beste Wahl, da es sich bei PHP um eine Scriptsprache handelt, deren Code nicht in dem Sinne kompiliert und für die Ziel-Hardware optimiert wird. In den meisten Fällen können mit guter Pflege aber auch große Anwendungen mit PHP performant umgesetzt werden.
