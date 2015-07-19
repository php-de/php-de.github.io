---
layout: guide
permalink: /jumpto/sicherheit/
root: ../..
group: "Formularverarbeitung"
title: "Sicherheit"
orderId: 12
creator: nikosch
author:
    -   name: nikosch
        profile: 2314

    -   name: mermshaus
        profile: 15041

inhalt:
    -   name: "Grundlegende Angriffsszenarien"
        anchor: grundlegende-angriffsszenarien
        simple: ""

    -   name: "Sicherheitsaspekte"
        anchor: sicherheitsaspekte
        simple: ""

    -   name: "Zusammenfassung"
        anchor: zusammenfassung
        simple: ""

entry-type: in-discussion
---

### [Grundlegende Angriffsszenarien](#grundlegende-angriffsszenarien)
{: #grundlegende-angriffsszenarien}

*„Never trust user input“* ist ein wichtiger Grundsatz der Softwaresicherheit,
der insbesondere für die Webentwicklung gilt. Die Aussicht auf das Stehlen
großer Mengen zentral gespeicherter Nutzerdaten und das global erreichbare
Publikum, das sie dem Angreifer bieten, machen Webseiten zu einem verlockenden
Ziel. HTML-Formulare sind dabei als Inbegriff für User-Input ein
hauptsächlicher Ausgangspunkt für Manipulationsversuche. Das Eingabeprinzip von
Formularen ist intuitiv, der Übertragungsmechanismus simpel und der
Sendeprozess zumeist beliebig wiederholbar. Oftmals reicht ein Klick auf den
„Zurück“-Button des Browsers aus, um ein Formular erneut aufrufen und
abschicken zu können und somit einen weiteren potentiellen Angriff auszulösen.

#### [Manipulation durch Nachbau von Formularen](#manipulation-durch-nachbau-von-formularen)
{: #manipulation-durch-nachbau-von-formularen}

Kommunikation im Web erfolgt zwischen Client und Server nach dem
Frage-Antwort-Muster. Prinzipbedingt hat der antwortende Server dabei keine
Kontrolle über den Ausgangspunkt einer Anfrage oder über ihren genauen Inhalt.
Zwar wird eine etwa durch ein Formular ausgelöste Anfrage im Normalfall von
demjenigen Server ausgewertet, der das Formular zuvor an den Client
ausgeliefert hat. Dennoch gleicht dieses Prinzip einer Pressekonferenz, auf der
im Vorfeld alle erlaubten Fragen ausgeteilt wurden, bei der aber keine
Gewissheit darüber besteht, ob sich alle beteiligten Journalisten an diese
Vorgaben halten werden. Stellt nun ein Jounalist (ein Client) eigenmächtig eine
abweichende Frage, muss der Befragte (der Server) trotz allem darauf in
irgendeiner Weise reagieren (zum Beispiel indem er die Frage zurückweist).

Die meisten HTML-Anfänger sind nach kurzer Zeit in der Lage, Formulare zu
erstellen und an eine beliebige Serveradresse zu verschicken. Im einfachsten
Fall kann dazu ein bestehendes Formular per Copy and Paste kopiert und beliebig
abgeändert werden. Dabei können Felder umbenannt, gelöscht oder ergänzt werden.
Ebenfalls kann der Typ eines Eingabefelds beliebig manipuliert werden. So wird
aus einem Select- oder gar Multi-Select-Element ein Textfeld und aus einem
Passwortfeld eine Klartexteingabe. Daraus ergeben sich bereits diverse
Sicherheitsaspekte, die bei der serverseitigen Auswertung zu bedenken sind
(siehe unten).

#### [Manipulation durch Umschreiben von URL-Parametern](#manipulation-durch-umschreiben-von-url-parametern)
{: #manipulation-durch-umschreiben-von-url-parametern}

Noch offensichtlicher und einfacher zu manipulieren sind URL-Parametern. Die
Möglichkeit dazu besteht immer dann, wenn Formulare mit der Methode GET
übertragen werden. Selbst Laien finden es aus verschiedenen Gründen
interessant, durch Manipulation der Übergabe festzustellen, inwieweit sich die
Ausgabe und das Verhalten einer Webseite beeinflussen lassen. Zusätzlich könnte
eine URL unbeabsichtigt, etwa durch unvorsichtiges Kopieren, verändert werden
und somit beim Aufruf zu einer ungültigen Serveranfrage führen. Nicht jeder
unerwarteten Anfrage muss also eine böse Absicht vorausgehen.

Hinsichtlich des Umgangs mit unzulässigen Eingaben im serverseitigen Script
unterscheidet sich diese vielleicht einfachste Möglichkeit der Manipulation
strukturell nicht von komplizierteren Vorgehensweisen. Durch die Veränderung
der URL vor dem Aufruf wird die Client-Anwendung dazu veranlasst, eine
modifizierte HTTP-Anfrage abzusenden.

#### [Manipulation durch direktes Verändern von HTTP-Anfragen](#manipulation-durch-direktes-veraendern-von-http-anfragen)
{: #manipulation-durch-direktes-veraendern-von-http-anfragen}

Sogar die direkte Manipulation der HTTP-Anfrage wird für potentielle Angreifer
zunehmend einfacher, da immer mehr entsprechende, leicht zu bedienende Tools
beispielsweise als Browser-Plugins zur Verfügung stehen. Hier wird das
technische Prinzip ausgenutzt, dass eine vom Browser oder anderen
Client-Anwendungen ausgehende Anfrage an den Server zunächst in einen
Datenstrom umgewandelt und als klar spezifiziertes
[HTTP-Paket]({{ page.root }}/jumpto/request/) aufbereitet
wird, um dann durch die Schichten des Clientsystems gereicht und schließlich
physisch an den Server geschickt zu werden. Während dieses Vorgangs können
clientseitige Anwendungen die Pakete vor Weitergabe an den Server nach ihren
Wünschen anpassen. Beispiele dieser Anwendungen sind Proxy-Programme oder die
angesprochenen Browser-Plugins. Jede Veränderung der HTTP-Anfrage erlaubt
vollumfängliche Möglichkeiten zur Manipulation und damit letztlich auch zum
Angriff.



### [Sicherheitsaspekte](#sicherheitsaspekte)
{: #sicherheitsaspekte}

#### [Typsicherheit](#typsicherheit)
{: #typsicherheit}

HTTP-Parameter werden immer als Strings übergeben. Im PHP-Bereich werden jedoch
mehrere gleichartige Parameter unter bestimmten Voraussetzungen der
PHP-Umgebung als Array zur Verfügung gestellt (Näheres ist im [Artikel für
Selections]({{ page.root }}/jumpto/auswahllisten/) beschrieben). Oben
wurde beschrieben, dass Formulare gefälscht werden können oder gar freie
Parameterangaben übermittelt werden. Damit kann serverseitig nicht davon
ausgegangen werden, dass ein namentlich bekannter Parameter im erwarteten
Datentyp auftaucht.

#### [Wertmanipulation](#wertmanipulation)
{: #wertmanipulation}

Gerade bei Auswahlelementen (Select, Checkbox …) wird oft übersehen, dass nicht
garantiert ist, dass diese Werte nicht zwingend im Aktionsscript auftauchen
(vgl. obige Techniken). Während bei einfachen Vergleichsoperationen allgemein
keine Gefahr besteht, mal abgesehen von der eben genannten Typabweichung, wird
Wertmanipulation der Eingabe immer dann gefährlich, wenn die Daten in andere
Kontexte überführt werden:

* Bei der Ausgabe (Eingabefeedback, Wiederausfüllen eines Formularelements)
besteht die Gefahr des sogenannten
[Cross-Site-Scripting]({{ page.root }}/jumpto/cross-site-scripting/),
wobei im Eingabewert Syntaxbestandteile der Ausgabesprache – meist HTML –
enthalten sind, die dann die HTML-Ausgabe im Browser manipulieren oder sogar
clientseitiges Scripting (JavaScript) erzeugen.

* Bei der Übertragung in Datenbanken kann wiederum die Syntax der verwendeten
Technologie (bspw. SQL-Bestandteile) in der Eingabe verwendet werden, um die
Abfrage zu manipulieren. Im schlimmsten Fall kann es dabei zum Löschen ganzer
Datenbanken oder Übernahme des Serversustems durch Ausführen von
Systemkommandos kommen.

Auch eine Kombination beider Verfahren ist gefährlich. In diesem Fall kann eine
gefährliche Eingabe zunächst in der Datenbank landen und dann später zur
Ausgabe gelangen. Hier ergibt sich eine XSS-Gefährdung für alle Nutzer des
Systems, nicht nur für den jeweils manipulierenden Nutzer.

Scriptsicherheit ist ein komplexes Gebilde verschiedener Einzelbestandteile. Es
gibt kein Verfahren, das an einer lokalen Stelle eine Gesamtsicherheit erzeugen
kann. Wichtig ist also, bei jedem Schritt die richtige Maßnahmen zu treffen.
Vor der Ausgabe eine
[Zeichenmaskierung]({{ page.root }}/jumpto/kontextwechsel/) bspw.

#### [Fehlende Elemente](#fehlende-elemente)
{: #fehlende-elemente}

Es gibt keine Garantie, dass eine Anfrage alle Parameter aufweist, die als
Element im Formular gegeben waren. Teilweise ist dies sogar Normalverhalten. So
werden Checkbox- und Radio-Felder nicht übertragen, wenn nicht wenigstens einer
der angebotenen Werte ausgewählt wurde.

Das Fehlern von Parametern kann durch `empty` oder `isset` geprüft und
entsprechend behandelt werden. Näheres beschreibt der Einzelartikel
Formularverarbeitung, Auswahlfelder.

##### [Submit-Buttons](#submit-buttons)
{: #submit-buttons}

Auch Submit-Buttons sind Formularelemente und können so geprüft werden. Hier
gibt es eine Besonderheit. Einige Browser schicken Formulare auch ab, wenn in
einem einzeiligen Eingabefeld Enter betätigt wird. Je nach Browserverhalten
wird dabei oft der Buttonwert *nicht* mitgesendet. Damit stellt dieses
Verhalten nicht unbedingt einen Angriff auf die Anwendung dar. Wie mit diesem
Umstand umgegangen werden kann, [ist hier
beschrieben]({{ page.root }}/jumpto/affenformular/).

#### [Unbekannte Elemente](#unbekannte-elemente)
{: #unbekannte-elemente}

Es gibt keine Garantie, dass eine Anfrage nur Parameter eines bestimmten Forms
enthält. GET-Anfragen enthalten oft weitere Parameter (wie solche zur
Seitenkontrolle), POST-Anfragen können durch gefälschte Formulare o.ä.
entstehen. Wichtig ist, dass unerwartete Eingaben ignoriert werden.

##### [Register Globals](#register-globals)
{: #register-globals}

[Hauptartikel Register
Globals]({{ page.root }}/jumpto/php-ini/#register_globals)

Mit dieser veralteten Servereinstellung werden alle Eingabedaten nicht nur in
den Requestvariablen (`$_POST`, `$_GET`), sondern auch als lokale Variablen
angelegt. Damit sind unter Umständen Variablen mit Werten vorbelegt und können
zu verändertem Applikationsverhalten führen. Gegenmaßnahmen sind das
Ausschalten der PHP-Direktive `register_globals_gpc`, das konsequente
Vorbelegen aller Variablen mit Initialwerten und das ausführen kritischer
Anwendungsteile in geschlossenen Scopes (Funktionen, Objekte oder dergleichen).

##### [Image-Buttons](#image-buttons)
{: #image-buttons}

Auch das Verhalten von Image-Buttons ist browserübergreifend verschieden.
Einige Browser erzeugen bei einem Submit zwei zusätzliche Parameter `<name>_x`
und `<name>_y`, die eine Koordinate des Mausklicks im Button enthält. Diese
Parameter ergänzen die gegebenen Formularparameter um zusätzliche Eingaben.



### [Zusammenfassung](#zusammenfassung)
{: #zusammenfassung}

**Vertraue niemals Usereingaben!**

Prüfe…

* die Art des Aufrufs (GET oder POST)
* die Existenz eines Parameters
* den Typ eines Parameters
* die Gültigkeit eines Parameterbereichs für einen Wertebereich (vgl.
  Validierung)
* die Existenz nicht erwarteter Parameter, alternativ:
* Stelle sicher, dass weitere übermittelte Parameter keinen Einfluss auf die
  Applikation haben (Stichwort Register Globals).
* Gib niemals Eingaben direkt (= unmaskiert) aus. Verlasse Dich nicht auf Magic
  Quotes.
* Verwende niemals Eingaben direkt (= unmaskiert) in einem Datenbank-Statement.
  Verlasse Dich nicht auf Magic Quotes.

