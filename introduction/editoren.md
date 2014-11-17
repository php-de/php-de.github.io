---
layout: guide

permalink: /jumpto/php-editoren/
title: "PHP-Editoren"
group: "Einführung"
orderId: 5

creator: tr0y

author:
    - name: tr0y
      profile: 21125

    - name: mermshaus
      profile: 15041

inhalt:
    - name: "PHP-Editoren"
      anchor: php-editoren
      simple: ""

    - name: "PHP-IDEs"
      anchor: php-ides
      simple: ""
---

Viele von euch beschäftigt das Thema sicherlich weniger, einige von euch schlagen sich noch mit Software aus der Steinzeit herum. Dieser Beitrag soll euch eine Möglichkeit zur Orientierung bieten durch den Editor- und IDE-Dschungel zu blicken. Der ein oder andere von euch ist sicher auf der Suche nach **dem Editor**. Viel Glück, den gibt es nicht.

Damit ihr einen Anreiz bekommt, wer so mit der ein oder anderen IDE arbeitet, erwähne ich auch noch namhafte Mitstreiter unserer Zunft.

Es folgt nun eine Vorstellung der (kostenlosen wie kostenpflichtigen) Editoren und Integrierten Entwicklungsumgebungen (IDEs) die auf PHP (weitestgehend) ausgelegt sind. Die Für (Quer-)Einsteiger und Fortgeschrittene empfohlenen Editoren markiere ich entsprechend.

### PHP-Editoren

Ein PHP Editor ist eine Anwendung die grundlegende Editor-Funktionen können muss, aber nicht direkt mit PHP interagiert, kein Debugging unterstützt und auch sonstige Qualitätssicherung für die eigene Anwendung gewährt. Er erleichtert eure Arbeit indem er euch via Syntax-Highlighting auf entsprechende Typos und Syntaxfehler hinweist.

- <div><strong>Sublime Text</strong> - empfohlen<br/>
  Webseite: <a href="http://www.sublimetext.com">http://www.sublimetext.com</a><br/>
  UI-Sprache: Englisch<br/>
  Features: Viele - Siehe Webseite<br/>
  Erweiterbar: Ja - Scriptbasiert (LUA), XML-Basiert<br/>
  Kostet: 70 US-Dollar<br/>
  Platform: Windows, Linux, Mac<br/>
  Benutzer: Twitter</div>

  Sublime Text 2 ist einer der Editoren mit den meisten Features und für den Performance bei großen Dateien kein Problem ist. Die Download-Version ist voll funktionsfähig, die 70 US-Dollar zahlt man quasi nur für das Entfernen eines Popups das alle 30-60 Minuten beim Speichervorgang erscheint, aber sofort schließbar ist.
- <div><strong>Kate</strong> - by KDE Group<br/>
  Webseite: <a href="http://www.kate-editor.org">http://www.kate-editor.org</a><br/>
  UI-Sprache: sehr viele<br/>
  Features: Viele - Siehe Webseite und <a href="http://de.wikipedia.org/wiki/Kate_(KDE)">http://de.wikipedia.org/wiki/Kate_(KDE)</a><br/>
  Erweiterbar: Ja<br/>
  Kostet: kostenlos; freie Software<br/>
  Platform: Windows, Linux, Mac</div>

  Kate ist der Editor der KDE-Jungs, durchaus vergleichbar mit Notepad++ und Sublime Text, allerdings nicht so "feature-rich" wie Sublime Text.
- <div><strong>Notepad++</strong><br/>
  Webseite: <a href="http://notepad-plus-plus.org/">http://notepad-plus-plus.org/</a><br/>
  UI-Sprache: lokalisierbar, Deutsch, Englisch, …<br/>
  Features: Einige - Siehe Webseite<br/>
  Erweiterbar: Ja - Plugins (C-basiert)<br/>
  Kostet: kostenlos<br/>
  Plattform: Windows</div>

  Notepad++ ist ein solides Meisterwerk der Opensource Community und wird stetig weiterentwickelt. Grundsätzlich genauso zuverlässig wie Sublime Text 2, leider nicht so funktionsreich und von der Handhabung her auch etwas umständlicher.
- <div><strong>Coda</strong><br/>
  Webseite: <a href="https://panic.com/coda/">https://panic.com/coda/</a><br/>
  Ui-Sprache: englisch<br/>
  Features: Viele - Siehe Webseite<br/>
  Kostet: 99$ (auf Aktionen achten auf der Webseite)<br/>
  Platform: Mac only</div>

  Coda ist brilliant und wäre eine echte Konkurrenz für Sublime Text, allerdings nur für den Mac.
- <div><strong>ActiveState Komodo Edit</strong> - empfohlen<br/>
  Webseite: <a href="http://www.activestate.com/komodo-edit">http://www.activestate.com/komodo-edit</a><br/>
  Ui-Sprache: englisch<br/>
  Features: Siehe Webseite<br/>
  Kostet: kostenlos<br/>
  Platform: Windows, Linux, Mac</div>

  Komodo Edit ist wohl der ausgereifteste Editor, man merkt aber schnell das er der kleine Bruder von Komodo Studio ist, was ihm keine Nachteile beschert, man aber doch hier und da Funktionen wiederfindet die eigentlich IDE-spezifischer sind.
- <div><strong>Bluefish</strong> - by OpenOffice<br/>
  Webseite: <a href="http://bluefish.openoffice.nl/index.html">http://bluefish.openoffice.nl/index.html</a><br/>
  Ui-Sprache: englisch<br/>
  Features: <a href="http://bluefish.openoffice.nl/features.html">http://bluefish.openoffice.nl/features.html</a><br/>
  Kostet: kostenlos, hier und da nerven<br/>
  Platform: Windows, Linux, Mac</div>

  Bluefish ist aus der Produktfamilie der Content Editing Environments der Open Office Foundation und ebendso wie Notepad++, Sublime Text 2 und Coda ein leistungsfähiger Editor, der hier und da mit der ein oder anderen Gehirnwindung Gassi geht.



### PHP-IDEs

Integrierte Entwicklungsumgebungen interagieren immer mit PHP und vernetzen eure Scripts so das ihr jederzeit (auch grafisch) durch die Scripts navigieren könnt und schon beim Autocomplete seht wo die Funktion die ihr gerade benutzt definiert wurde und welche Parameter sie hat. Qualitätssicherung steht nicht bei jeder IDE im Vordergrund, wird jedoch in jeder IDE zumindest ansatzweise implementiert.

- <div><strong>JetBrains PHPStorm</strong> - empfohlen<br/>
  Webseite: <a href="http://www.jetbrains.com/phpstorm/">http://www.jetbrains.com/phpstorm/</a><br/>
  Ui-Sprache: englisch<br/>
  Features: <a href="http://www.jetbrains.com/phpstorm/features/index.html">http://www.jetbrains.com/phpstorm/features/index.html</a><br/>
  Kostet: 89 € + Steuern Vollversion / 44 € + Steuern Upgrade pro Entwickler<br/>
  Platform: Windows, Linux, Mac<br/>
  Benutzer: Valve, Paypal, MediaWiki</div>

  Eine der weiterentwickelten IDEs auf dem Markt aus dem Hause Jetbrains, java basiert.
- <div><strong>ActiveState Komodo IDE</strong><br/>
  Webseite: <a href="http://www.activestate.com/komodo-ide">http://www.activestate.com/komodo-ide</a><br/>
  Ui-Sprache: englisch<br/>
  Features: Siehe Webseite<br/>
  Kostet: 382 $</div>

  Eine etwas teurere IDE aus dem Hause ActiveState, zeitige Objektive Erfahrungen zur Verbesserung dieses Beitrags erwünscht.
- <div><strong>Oracle Netbeans</strong><br/>
  Webseite: <a href="https://netbeans.org/">https://netbeans.org/</a><br/>
  Ui-Sprache: lokalisierbar<br/>
  Features: <a href="https://netbeans.org/features/index.html">https://netbeans.org/features/index.html</a><br/>
  Kostet: kostenlos</div>

  Netbeans ist die Basis einiger IDEs und natürlich als Ur-Element auch nicht zu verachten. Basiert auf Java und ist erweiterbar.
- <div><strong>Eclipse</strong><br/>
  Webseite: <a href="http://www.eclipse.org/">http://www.eclipse.org/</a><br/>
  Ui-Sprache: englisch<br/>
  Features: Siehe Webseite.<br/>
  Kostet: kostenlos</div>

  Eclipse ist die Basis einiger weiterer IDEs wie z. B. ZendStudio.
- <div><strong>Zend's ZendStudio</strong><br/>
  Webseite: <a href="http://www.zend.com/de/products/studio/">http://www.zend.com/de/products/studio/</a><br/>
  Ui-Sprache: lokalisiert<br/>
  Features: <a href="http://www.zend.com/de/products/studio/features">http://www.zend.com/de/products/studio/features</a><br/>
  Kostet: 299 € (ab und zu sind Rabatt-Aktionen, siehe Webseite)<br/>
  Specials: Hoch kompatibel mit dem PHP-Stack aus eigenem Hause (Zend Server)</div>

  ZendStudio ist ziemlich nah an PHP entwickelt und basiert auf Eclipse.
- <div><strong>Aptana Studio</strong> - empfohlen<br/>
  Webseite: <a href="http://aptana.com/">http://aptana.com/</a><br/>
  Ui-Sprache: englisch<br/>
  Features: <a href="http://aptana.com/products/studio3">http://aptana.com/products/studio3</a><br/>
  Kostet: kostenlos</div>

  Aptana Studio ist das Sublime Text unter den IDEs, aber nicht ganz so funktionsreich wie PHPStorm, dennoch die kostenlose Empfehlung für Einsteigende und Fortgeschrittene PHP-Entwickler.
- <div><strong>CSE HTML Validator</strong><br/>
  Website: <a href="http://www.htmlvalidator.com/">http://www.htmlvalidator.com/</a><br/>
  Ui-Sprache: englisch<br/>
  Features: <a href="http://www.htmlvalidator.com/htmlval/comparisonchart.html">http://www.htmlvalidator.com/htmlval/comparisonchart.html</a><br/>
  Kostet: abhängig von der Version - Kostenlos als Lite-Version, 299 € als Enterprise-Version, siehe Compairson-Chart</div>

  CSE HTML Validator ist ein ausgereifter Mix-Type aus Editor, Validator und IDE mit Fokus auf Validierung. Ob dieser Typ Anwendung den Anforderungen entspricht hängt wie bei jeder anderen IDE oder Editor vom Entwickler ab. CSE HTML Validator ist definitiv einen Blick wert.
- <div><strong>phpDesigner 8</strong><br/>
  Website: <a href="http://www.mpsoftware.dk/">http://www.mpsoftware.dk/</a><br/>
  Ui-Sprache: englisch<br/>
  Features: <a href="http://www.mpsoftware.dk/phpdesigner.php">http://www.mpsoftware.dk/phpdesigner.php</a><br/>
  Kostet: abhängig von der Version - Personal für 29 €, Commerical für 69 €</div>

  phpDesigner ist eine der kostengüstigeren IDEs, nicht ganz so umfangreich wie phpStorm, dennoch mit allem gerüstet was den täglichen Einsatz als Software-Entwickler leichter macht.

Insofern hier die ein oder andere IDE fehlt, möge man mir das verzeihen und sie einfach im selben Typus wie hier gelistet als Antwort auf diesen Beitrag darreichen. Einige Editoren werden es nicht in diese Übersicht schaffen, da sie entweder nicht PHP-Spezifisch und wenn zwar nicht zu wenig verbreitet in der PHP Welt sind. Da diese Editoren nicht gänzlich ungenannt bleiben sollten, findet ihr sie in der folgenden Link-Liste:

- [**TextPad**](http://www.textpad.com/products/textpad/index.html) - Wenig verbreitet
- [**Vim**](http://www.vim.org/index.php) - Zwar verbreitet, aber nur geringe Anfänger-Tauglichkeit
- [**Emacs**](http://www.gnu.org/software/emacs/) - Verbreitet, aber auch geringe Anfänger-Tauglichkeit - Sehr hohe Erweiterbarkeit
