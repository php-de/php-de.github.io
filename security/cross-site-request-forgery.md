---
layout: guide

permalink: /jumpto/cross-site-request-forgery/
root: ../..
title: "Cross-Site-Request-Forgery (CSRF)"
group: "Sicherheit"
creator: Monolith
orderId: 12

author:
    -   name: Monolith
        profile: 39131

inhalt:
    -   name: "Voraussetzungen"
        anchor: voraussetzungen
        simple: ""

    -   name: "Durchführung einer XSS-Attacke - Beispiel"
        anchor: durchfuehrung
        simple: ""

    -   name: "Konsequenzen einer CSRF-Attacke"
        anchor: konsequenzen
        simple: ""

    -   name: "Schutz vor Cross-Site-Request-Forgery"
        anchor: schutz
        simple: ""

entry-type: in-discussion
---

**Cross-Site-Request-Forgery** (**CSRF**) ist eine Angriffstechnik auf eine Website. Sie bringt einen gegenüber der Website authentisierten Benutzer dazu, unbewusst manipulative Aktionen durchzuführen.

Die konkrete Durchführung ist über verschiedene Angriffsvektoren möglich, darunter auch [Cross-Site-Scripting]({{ page.root }}/jumpto/cross-site-scripting/).

### [Voraussetzungen](#voraussetzungen)
{: #voraussetzungen}

Ein authentisierter Benutzer mit der nötigen Autorisation muss dazu gebracht werden können, von ihm selber unbemerkt manipulative Anfragen an die Website zu senden.

Ein CSRF-Angriff kann gelingen, wenn von einer Webanwendung angenommen wird, dass alle Anfragen, die ein Benutzer an die Website sendet, auch tatsächlich von diesem selbst initiert worden sind und diese Annahme keiner Überprüfung unterzogen wird.

### [Beispiel](#durchfuehrung)
{: #durchfuehrung}

Ein denkbar einfaches Beispiel ist eine Website A, auf der ein vermeintlich unverdächtiger Link eingebettet wird:

~~~ html
<a hef="http://www.b.com/user/delete/123">Mehr lesen</a>
~~~

Achtet der Benutzer nicht auf die tatsächlich hinterlegete URL, klickt er den Link in Erwartung einer harmlosen Aktion an. Tatsächlich wird aber eine Anfrange an Website B gesendet, die das Löschen eines Benutzeraccounts zum Ziel hat. Ist der Besucher von Website A auf Website B authentisiert und entsprechend autorisiert und zudem kein CSRF-Schutz vorhanden, löscht er ungewollt einen Benutzeraccount.

Ein CSRF-Angriff ist dabei nicht auf eine GET-Anfrage reduziert sondern kann beispielsweise auch über ein Formular erfolgen.

### [Konsequenzen einer CSRF-Attacke](#konsequenzen)
{: #konsequenzen}

Je mehr Kenntnisse ein Angreifer über eine Website hat, desto umfangreicher kann er CSRF-Angriffe durchführen. Besteht überhaupt kein Schutz gegen solche Angriffe und kann er einem Benutzer mit entsprechend hoher Autorisationsstufe praktisch beliebig böswillige Aktionen unterschieben, so kann der Angreifer vollständige administrative Kontrolle über die Website erlangen.

Er kann dies nutzen, um sich sich selbst einen Benutzeraccount mit administrativen Rechten anzulegen, andere Administratoren zu löschen und Inhalte zu entfernen, zu manipulieren oder neu zu erstellen. Fehlender Schutz gegen CSRF-Angriffe kann also zu äußerst negativen Konsequenzen führen.

### [Schutz vor Cross-Site-Request-Forgery](#schutz)
{: #schutz}

#### [Als Webmaster](#webmaster)
{: #webmaster}

Um sicherzustellen, dass eine Abfrage an eine Website auch innerhalb ihres Kontext initiiert wurde, wird bei jeder Abfrage geprüft, ob sie ein gültiges CSRF-Token besitzt. Beispielsweise kann bei der Verwendung eines Formulars ein verstecktes (hidden) Feld eingebaut werden, dass diesen Token enthält. Der Token ist in der Regel eine zufällige Ziffern- oder/und Buchstabenkombination mit ausreichender Länge. Im nachfolgenden Beispiel wird eine Zahl, die mindestens vierstellig sein muss, als Token gespeichert:

~~~ php
// ACHTUNG: Vorher ggf. mit srand() den Anfangswert fuer den Zufallsgenerator festlegen!
$min = 1000;
$max = getrandmax();
$_SESSION['token'] = rand($min, $max);
~~~

Im nächsten Beispiel wird davon ausgegangen, dass bereits ein Token-Wert generiert und in einer Session-Variable gespeichert wurde. Dieser wird nun ausgelesen und in das versteckte Feld geschrieben. Wenn das Formular an die Website gesendet wird, liest sie den übermittelten Token-Wert aus und vergleicht ihn mit dem, der in der Session gespeichert ist. Nur bei Übereinstimmung wird die Anfrage als gültig erachtet.

~~~ php
<form action="" method="POST">
    <input type="hidden" name="token" value="<?php echo $_SESSION['token'] ?>">
    ...
</form>
~~~

#### [Als Benutzer](#user)
{: #user}

Serverseitige Schutzmaßnahmen sind in jedem Fall notwendig. Grundsätzlich hat der Benutzer dennoch einige Möglichkeiten zu verhindern, dass er für CSRF-Angriffe missbraucht wird. So kann er sich nach Durchführung einer administrativen Tätigfkeit auf einer Website von selbiger abmelden. Auch Gegenmaßnahmen zur Verhinderung von XSS-Angriffen sind von Vorteil.
