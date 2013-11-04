---
layout: guide
permalink: /jumpto/document-object-model/
title: "Document Object Model"
group: "Allgemein"
creator: Manko10
author:
    -   name: Manko10
        profile: 1139

    -   name: mermshaus
        profile: 15041

inhalt:
    -   name: "Elementknoten"
        anchor: elementknoten
        simple: ""

    -   name: "Attributknoten"
        anchor: attributknoten
        simple: ""

    -   name: "Verarbeitung des DOM-Baums"
        anchor: verarbeitung-des-dom-baums
        simple: ""

    -   name: "Weiterführende Links"
        anchor: weiterfhrende-links
        simple: ""

entry-type: in-discussion
---

Das **Document Object Model** (DOM) bildet alle Strukturknoten eines Dokuments
in einer Baumstruktur ab, um eine weitere elektronische Verarbeitung des
Dokuments und dessen Daten zu ermöglichen. In aller Regel handelt es sich
hierbei um ein HTML- oder XML-Dokument.



### Elementknoten

Im Folgenden soll ein HTML-Dokument den Aufbau eines DOM-Baums verdeutlichen:

~~~ html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
    <head>
        <title>Meine Seite</title>
    </head>
    <body>
        <div>
            <p>Ein kleiner Beispieltext.</p>
        </div>
    </body>
</html>
~~~

Diese verschachtelte Dokumentenstruktur lässt sich in einem DOM-Baum abbilden:

~~~
#document
    html
        head
            title
                #text
        body
            div
                p
                    #text
~~~

Zu sehen ist: Jedes Element wird seiner Verschachtelung nach in den DOM-Baum
eingegliedert. Der oberste Knoten ist der Dokumentenknoten. Ihn gibt es nur ein
einziges Mal. Untergeordnet folgen die einzelnen Elemente. Der Text innerhalb
eines Elements wird als `#text`-Knoten (`#text`-Node) behandelt.

<div class="alert alert-info">

<strong>Hinweis:</strong>

Gecko-Browser interpretieren die Leerzeichen und Zeilenumbrüche zwischen den
Elementen ebenfalls als <code>#text</code>-Knoten, weshalb es oft zu
unerwarteten Skript-Fehlern kommt. Dieses Verhalten ist laut W3C-Standard
allerdings nicht korrekt. Eine mögliche Lösung dieses Problems gibt es im <a
href="http://developer.mozilla.org/en/whitespace_in_the_DOM">Mozilla Developer
Center</a>.

</div>



### Attributknoten

Nicht nur Elemente stellen Knoten im DOM-Baum dar, auch Attribute tun dies.

~~~ html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
    <head>
        <title>Meine Seite</title>
    </head>
    <body>
        <div id="wrapper">
            <p class="big-paragraph">Ein kleiner Beispieltext.</p>
        </div>
    </body>
</html>
~~~

Der DOM-Baum sieht diesmal so aus:

~~~
#document
    html
        head
            title
                #text
        body
            div [id="wrapper"]
                p [class="big-paragraph"]
                    #text
~~~



### Verarbeitung des DOM-Baums

Der Zweck des Document Object Models ist die maschinelle Verarbeitung des
dargestellten Dokuments. Deshalb bieten viele Programmiersprachen (nativ oder
als Erweiterung) Methoden zur Verarbeitung der im DOM gespeicherten Daten an.
Im Beispiel dient JavaScript als Verarbeitungssprache, welche ausgezeichnete
Methoden zur DOM-Verarbeitung bietet.

Zunächst wird das `<div>`-Element anhand seiner ID selektiert. Hierzu dient die
Methode `getElementById()`.

~~~ js
var div = document.getElementById('wrapper');
~~~

Das Objekt `document` stellt dabei den `#document`-Knoten dar. Unterhalb dieses
Knotens wird dann ein bestimmtes Element anhand seiner `id` identifiziert und
selektiert. Die Variable `div` enthält nun eine Referenz auf das
`<div>`-Element.

Jetzt wird das erste Kindelement, also das erste Element unterhalb von `<div>`,
selektiert. Um dies zu bewerkstelligen, wird auf das Array `childNodes`
zurückgegriffen, welches alle direkten Nachfahren von `<div>` referenziert.
Alternativ kann auch die Eigenschaft `firstChild` genutzt werden.

~~~ js
var div = document.getElementById('wrapper'),
    p   = div.childNodes[0];

// alternativ:
// p = div.firstChild;
~~~

Von diesem Element soll nun das Attribut `class` sowie dessen Kindelement
abgefragt werden. Um Attribute zu erfragen dient die Methode `getAttribute()`
(analog setzt `setAttribute()` einen Attributknoten).

~~~ js
var div = document.getElementById('wrapper'),
    p   = div.childNodes[0],

    classAtt = p.getAttribute('class'),
    txt      = p.childNodes[0];
~~~

`ClassAtt` bekommt in diesem Skript den Wert des Attributs `class` des
`<p>`-Elements zugewiesen (`big-paragraph`) und `txt` enthält den Textknoten,
der Kind von `<p>` ist. Sein Inhalt kann mit der Eigenschaft `nodeValue`
abgefragt werden:

~~~ js
var div = document.getElementById('wrapper'),
    p   = div.childNodes[0],

    classAtt = p.getAttribute('class'),
    txt      = p.childNodes[0],
    txtValue = txt.nodeValue;
~~~



### Weiterführende Links

* [W3C Document Object Model](http://www.w3.org/DOM/)
* [Document Object Model - Wikipedia](http://de.wikipedia.org/wiki/Document_Object_Model)
* [JavaScript DOM](http://krook.org/jsdom/)
* [Javascript Dom objects](http://www.w3schools.com/js/js_obj_htmldom.asp)

