---
layout:    guide
permalink: /jumpto/editors-ide/
title:     "Editoren und IDE"
creator:   tr0y
group:     "Entwicklungsumgebung"
orderId:   2

author:
    -   name: tr0y
        profile: 21125

    -   name: hausl
        profile: 21246

inhalt:
    -   name:   "PHP Editoren"
        anchor: php-editoren
        simple: ""

    -   name:   "Integrierte PHP Entwicklungsumgebungen (PHP IDE)"
        anchor: integrierte-php-entwicklungsumgebungen-php-ide
        simple: ""
        
    -   name: Sonstige
        anchor: sonstige
        simple: ""

    -   name: Schlusswort
        anchor: schlusswort
        simple: ""

---

Viele von euch beschäftigt das Thema sicherlich weniger, einige von euch schlagen sich noch mit Software aus der Steinzeit herum, dieser Beitrag soll eine Möglichkeit zur Orientierung bieten, um durch den Editor- und IDE-Dschungel durchzublicken. Der eine oder andere von euch ist sicher auf der Suche nach **dem Editor**, viel Glück, den gibt es leider nicht.

Damit ihr einen Anreiz bekommt wer so mit der ein oder anderen IDE arbeitet, werden auch noch namhafte Mitstreiter unserer Zunft jeweils erwähnt. Wer seine Wahl ebenfalls äußern möchte, ist in [diesem Beitrag](http://www.php.de/php-einsteiger/101627-editor-ide-let-me-tell-you-something.html) herzlich dazu eingeladen.

Es folgt nun eine Vorstellung der (kostenlosen wie kostenpflichtigen) Editoren und Integrierten Entwicklungsumgebungen (IDEs) die auf PHP (weitestgehend) ausgelegt sind. Die Für (Quer-)Einsteiger und Fortgeschrittene empfohlenen Editoren sind entsprechend **markiert**{: style="color: #006400"}.

### PHP Editoren

Ein PHP Editor ist eine Anwendung die grundlegende Editor-Funktionen können muss, aber nicht direkt mit PHP interagiert, kein Debugging unterstützt und auch sonstige Qualitätssicherung für die eigene Anwendung gewährt. Er erleichtert eure Arbeit indem er euch via Syntax-Highlighting auf entsprechende Typos und Syntaxfehler hinweist.

* **Sublime Text** - **empfohlen**{: style="color: #006400"}  
    Webseite: [http://www.sublimetext.com](http://www.sublimetext.com)  
    UI-Sprache: Englisch  
    Features: Viele - Siehe Webseite  
    Erweiterbar: Ja - Scriptbasiert (LUA), XML-Basiert  
    Kostet: 70 US-Dollar  
    Platform: Windows, Linux, Mac  
    Benutzer: **Twitter**  

    Sublime Text 2 ist einer der Editoren mit den meisten Features und für den Performance bei großen Dateien kein Problem ist. Die Download-Version ist voll funktionsfähig, die 70 US-Dollar zahlt man quasi nur für das entfernen eines Popups das alle 30-60 Minuten beim Speichervorgang erscheint, aber sofort schließbar ist.


* **Kate** - by KDE Group  
    Webseite: [http://kate-editor.org](http://kate-editor.org)  
    UI-Sprache: sehr viele  
    Features: Viele - Siehe Webseite und <a href="http://de.wikipedia.org/wiki/Kate_(KDE)">http://de.wikipedia.org/wiki/Kate_(KDE)</a>  
    Erweiterbar: Ja  
    Kostet: **kostenlos; freie Software**  
    Platform: Windows, Linux, Mac  

    Kate ist der Editor der KDE-Jungs, durchaus vergleichbar mit Notepad++ und Sublime Text, allerdings nicht so "feature-rich" wie Sublime Text.


* **Notepad++**  
    Webseite: [http://notepad-plus-plus.org/](http://notepad-plus-plus.org/)  
    UI-Sprache: lokalisierbar, Deutsch, Englisch, ...  
    Features: Einige - Siehe Webseite  
    Erweiterbar: Ja - Plugins (c-basiert)  
    Kostet: **kostenlos**  
    Plattform: Windows

    Notepad++ ist ein solides Meisterwerk der Opensource Community und wird stetig weiterentwickelt. Grundsätzlich genauso zuverlässig wie Sublime Text 2, leider nicht so Funktionsreich und von der Handhabung her auch etwas umständlicher.

* **Coda**  
    Webseite: [https://panic.com/coda/](https://panic.com/coda/)  
    Ui-Sprache: englisch  
    Features: Viele - Siehe Webseite  
    Kostet: 99$ (auf Aktionen achten auf der Webseite)  
    Platform: Mac only  

    Coda ist brilliant und wäre eine echte Konkurrenz für Sublime Text, allerdings nur für den Mac.


* **ActiveState Komodo Edit** - **empfohlen**{: style="color: #006400"}  
    Webseite: [http://komodoide.com/](http://komodoide.com/)  
    Ui-Sprache: englisch  
    Features: Siehe Webseite  
    Kostet: **kostenlos**  
    Platform: Windows, Linux, Mac  
    
    Komodo Edit ist wohl der ausgereifteste Editor, man merkt aber schnell das er der kleine Bruder von Komodo Studio ist, was ihm keine Nachteile beschehrt, man aber doch hier und da Funktionen wiederfindet die eigentlich IDE-spezifischer sind.


* **Bluefish** - by OpenOffice  
    Webseite: [http://bluefish.openoffice.nl/index.html](http://bluefish.openoffice.nl/index.html)  
    Ui-Sprache: englisch  
    Features: [http://bluefish.openoffice.nl/features.html](http://bluefish.openoffice.nl/features.html)  
    Kostet: **kostenlos**, hier und da nerven  
    Platform: Windows, Linux, Mac  
    
    Bluefish ist aus der Produktfamilie der Content Editing Environments der Open Office Foundation und ebendso wie Notepad++, Sublime Text 2 und Coda ein leistungsfähiger Editor, der hier und da mit der ein oder anderen Gehirnwindung Gassi geht. 


### Integrierte PHP Entwicklungsumgebungen (PHP IDE)

Integrierte Entwicklungsumgebungen interagieren immer mit PHP und vernetzen eure Scripts so das ihr jederzeit (auch grafisch) durch die Scripts navigieren könnt und schon beim Autocomplete seht wo die Funktion die ihr gerade benutzt definiert wurde und welche Parameter sie hat. Qualitätssicherung steht nicht bei jeder IDE im Vordergrund, wird jedoch in jeder IDE zumindest Ansatzweise implementiert.


* **JetBrains PHPStorm** - **empfohlen**{: style="color: #006400"}  
    Webseite: [http://www.jetbrains.com/phpstorm/](http://www.jetbrains.com/phpstorm/)  
    Ui-Sprache: englisch  
    Features: [http://www.jetbrains.com/phpstorm/features/index.html](http://www.jetbrains.com/phpstorm/features/index.html)  
    Kostet: 89 € + Steuern Vollversion / 44 € + Steuern Upgrade pro Entwickler  
    Platform: Windows, Linux, Mac  
    Benutzer: **Valve, Paypal, MediaWiki**  
    
    Eine der weiterentwickelten IDEs auf dem Markt aus dem Hause Jetbrains, java basiert.


* **ActiveState Komodo IDE**  
    Webseite: [http://www.activestate.com/komodo-ide](http://www.activestate.com/komodo-ide)  
    Ui-Sprache: englisch  
    Features: Siehe Webseite  
    Kostet: 382 $  
    
    Eine etwas teurere IDE aus dem Hause ActiveState, *zeitige Objektive Erfahrungen zur Verbesserung dieses Beitrags erwünscht*.


* **Oracle Netbeans**  
    Webseite: [https://netbeans.org/](https://netbeans.org/)  
    Ui-Sprache: lokalisierbar  
    Features: [https://netbeans.org/features/index.html](https://netbeans.org/features/index.html)  
    Kostet: **kostenlos**  
    
    Netbeans ist die Basis einiger IDEs und natürlich als Ur-Element auch nicht zu verachten. Basiert auf Java und ist erweiterbar.


* **Eclipse**  
    Webseite: [http://www.eclipse.org/](http://www.eclipse.org/)  
    Ui-Sprache: englisch  
    Features: Siehe Webseite  
    Kostet: **kostenlos**  
    
    Eclipse ist die Basis einiger weiterer IDEs wie z.b. ZendStudio.


* **Zend's ZendStudio**  
    Webseite: [http://www.zend.com/de/products/studio/](http://www.zend.com/de/products/studio/)  
    Ui-Sprache: lokalisiert  
    Features: [http://www.zend.com/de/products/studio/features](http://www.zend.com/de/products/studio/features)  
    Kostet: 299 € (ab und zu sind Rabatt-Aktionen, siehe Webseite)  
    Specials: Hoch kompatibel mit dem PHP-Stack aus eigenem Hause (Zend Server)  
    
    ZendStudio ist ziemlich nah an PHP entwickelt und basiert auf Eclipse.


* **Aptana Studio** - **empfohlen**{: style="color: #006400"}  
    Webseite: [http://aptana.com/](http://aptana.com/)  
    Ui-Sprache: englisch  
    Features: [http://aptana.com/products/studio3](http://aptana.com/products/studio3)  
    Kostet: **kostenlos**  
    
    Aptana Studio ist das Sublime Text unter den IDEs, aber nicht ganz so funktionsreich wie PHPStorm, dennoch die kostenlose Empfehlung für Einsteigende und Fortgeschrittene PHP-Entwickler.


* **CSE HTML Validator**  
    Website: [http://www.htmlvalidator.com/](http://www.htmlvalidator.com/)  
    Ui-Sprache: englisch  
    Features: [http://www.htmlvalidator.com/htmlval/comparisonchart.html](http://www.htmlvalidator.com/htmlval/comparisonchart.html)  
    Kostet: abhängig von der Version - Kostenlos als Lite-Version, 299 € als Enterprise-Version, siehe Compairson-Chart  
    
    CSE HTML Validator ist ein ausgereifter Mix-Type aus Editor, Validator und IDE mit Fokus auf Validierung. Ob dieser Typ Anwendung den Anforderungen entspricht hängt wie bei jeder anderen IDE oder Editor vom Entwickler ab. CSE HTML Validator ist definitiv einen Blick wert.


* **phpDesigner 8**  
    Website: [http://www.mpsoftware.dk/](http://www.mpsoftware.dk/)  
    Ui-Sprache: englisch  
    Features: [http://www.mpsoftware.dk/phpdesigner.php](http://www.mpsoftware.dk/phpdesigner.php)  
    Kostet: abhängig von der Version - Personal für 29 €, Commerical für 69 €  
    
    phpDesigner ist eine der kostengüstigeren IDEs, nicht ganz so umfangreich wie phpStorm, dennoch mit allem gerüstet was den täglichen Einsatz als Software-Entwickler leichter macht. 


### Sonstige

Einige Editoren werden es nicht in diese Übersicht schaffen, da sie entweder nicht PHP-Spezifisch und wenn zwar nicht zu wenig verbreitet in der PHP Welt sind. Da diese Editoren nicht gänzlich ungenannt bleiben sollten, findet ihr sie in der folgenden Link-Liste:


* [TextPad](http://www.textpad.com/products/textpad/index.html) - Wenig verbreitet  
* [VIM](http://www.vim.org/index.php) - Zwar verbreitet, aber nur geringe Anfänger-Tauglichkeit  
* [emacs](http://www.gnu.org/software/emacs/) - Verbreitet, aber auch geringe Anfänger-Tauglichkeit - Sehr hohe Erweiterbarkeit  


### Schlusswort

Insofern hier die eine oder andere relevante Editor-/IDE-Software fehlt, bitte diese einfach im Selben Typus wie hier gelistet als Antwort auf [diesen Beitrag](http://www.php.de/php-einsteiger/101627-editor-ide-let-me-tell-you-something.html) darreichen.

Möge euch diese Liste auf den Geschmack kommen lassen, viel Erfolg.

Und ein Danke an: [mermshaus](http://www.php.de/member.php?u=15041), [drsoong](http://www.php.de/member.php?u=6084).

