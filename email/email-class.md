---
layout: guide
title: E-Mail-Klassen
creator: nikosch
author:
    -   name: nikosch
        profile: 2314

    -   name: hausl
        profile: 21246

inhalt:
    -   name: ""
        anchor: 
        simple: ""

entry-type: in-progress
---


> Von: Karl-Heinz Gierig  
An: Wunschzettel@Der-Weihnachtsmann-am-Nordpol.org  
Betreff: Will ich haben! Wünsch ich mir!  
Anhang: wunschzettel.pdf{: style="color: green"}

> Lieber Weihnacksmann!

> Auch dieses Jahr war ich sehr ahrtig. Ich habe mir Müe gegeben,
meine Schwester möglichst wenig zu ärgern und immers meine
Hausaufgaben pünktlich gemacht. Naja, fast immers…

> Wie in jedem Jahr schicke ich Dir mein Wunschzettel. Ich hoffe,
Du kannst schön viel davon liefern. Die wichtigsten Sachen stehen 
gleich oben. Weil das so viel war, habe ich Dir diesmal das ganze 
per PDF als Anhang geschickt. Den PDF-Reader findest Du ja bei Adobe.

> Mit freundlichen Grüßen,
in großer Erwatung

> ![xmas](images/smiley_xmas_27x25.gif) Dein Kalle


### Test mit (derzeit noch invaliden) HTML 


<font size="3">

	<font face="Courier New">Von: Karl-Heinz Gierig<br>
		An: Wunschzettel@Der-Weihnachtsmann-am-Nordpol.org<br>
		Betreff: Will ich haben! Wünsch ich mir!<br>
		Anhang: wunschzettel.pdf<br>
	</font>
	
	<br>

	<font face="Georgia"><font color="Green"><i>
	<br>

		<font size="5">L</font>ieber Weihnacksmann!<br>
		<br>
		<font size="5">A</font>uch dieses Jahr war ich sehr ahrtig. Ich habe mir Müe gegeben,<br>
		meine Schwester <b>möglichst wenig</b> zu ärgern und immers meine<br>
		Hausaufgaben pünktlich gemacht. Naja, fast immers…<br>
		<br>
		<font size="5">W</font>ie in jedem Jahr schicke ich Dir mein Wunschzettel. Ich 
		hoffe,<br>
		Du kannst <font size="4">schön viel davon</font> liefern. Die wichtigsten Sachen 
		stehen <br>
		gleich oben. Weil das so viel war, habe ich Dir diesmal das ganze <br>
		per PDF als Anhang geschickt. Den PDF-Reader findest Du ja bei <a href="http://get.adobe.com/de/reader/" target="_blank" rel="nofollow" >Adobe</a>. 
		<br>
		<br>
		Mit freundlichen Grüßen,<br>
		in großer Erwatung<br>
		<br>
		<img src="http://www.macinacs.de/smile/xmass27x25.gif" alt="smiley"> Dein Kalle 
	</i></font></font>

</font>



Wollte Kalle diese E-Mail per PHP schicken, würde Ihm das wohl ziemlich viel Mühe bereiten. Als erstes hätten Ihn vermutlich die Umlaute geärgert. Im Text und vor allem im Betreff, überall Umlaute. Ein Charset-Header muss her. Oder gar eine ISO-Codierung fürs Subject? Dann fällt ihm ein, dass er ja noch ein fetziges Bild und unbedingt den Link zum Adobe Reader einbauen will ― schließlich soll’s der Weihnacksmann ja so einfach wie möglich haben. Außerdem kommt der alte Bärtige doch vermutlich erst mit grüner Schrift so richtig in Schenklaune. Fazit: eine HTML-Mail muss her. Dann noch das Wichtigste: Der PDF-Anhang! 
Mime-Types, Content-Types, Transfer-Encodings, Boundaries… Vielleicht alles noch als Plain text? Sicher ist sicher?

Kalle raucht der Kopf. „Gott“, denkt er sich, „da bin ich ja Ostern noch nicht fertig. Da kann ich meinen PHP-Wunschzettelgenerator wohl vergessen…“

Doch halt! Von ferne naht kein Glockenklang, sondern der Rat der Weisen! „Mailing Klasse“ flüstern Sie in sein Ohr. Kalle fragt kurz Tante Google und plötzlich ist alles ganz einfach. Einmal fix die Hilfe aufgerufen und ein paar Kommandos abgepinselt:


~~~ php
require_once './Swift-4.0.5/lib/swift_required.php'; 


$subject     = 'Will ich haben! Wünsch ich mir!'; 
$from        = 'Karl-Heinz@Gierig-Family.de'; 
$to          = 'Wunschzettel@Der-Weihnachtsmann-am-Nordpol.org'; 
$attachment  = 'wunschzettel.pdf'; // muß im selben Folder liegen 


// Als erstes brauchen wir ein Objekt für unsere Nachricht 
$message = Swift_Message::newInstance($subject); 

// Die bekommt gleich Absender und Empfängerangabe (Kurznotation über Queuing geht auch) 
$message->setTo($to); 
$message->setFrom($from); 


// Ein weihnachtliches Bildchen.. 
$smiley = 'smiley.gif'; // muß im selben Folder liegen 

// ..muß für die Email mit ID eingebettet werden 
$cid = $message->embed(Swift_Image::fromPath($smiley)); 

// ein gutes Schreiben ist die halbe Miete 
$message->setBody( 
' 
<html> 
 <head></head> 
 <body> 
  <div style="color:#0b0;"> 

  <p>Lieber Weihnacksmann!</p> 

  <p>Auch dieses Jahr war ich sehr ahrtig. Ich habe mir Müe gegeben, 
     meine Schwester möglichst wenig zu ärgern und immers meine 
     Hausaufgaben pünktlich gemacht. Naja, fast immers…</p> 

  <p>Wie in jedem Jahr schicke ich Dir mein Wunschzettel. Ich hoffe, 
     Du kannst schön viel davon liefern. Die wichtigsten Sachen stehen 
     gleich oben. Weil das so viel war, habe ich Dir diesmal das ganze 
     per PDF als Anhang geschickt. Den PDF-Reader findest Du ja  
     bei <a href="http://get.adobe.com/de/reader/">Adobe</a>.</p> 

  <p>Mit freundlichen Grüßen,<br /> 
     in großer Erwartung</p> 

  <p><big>Dein Kalle</big> <img src="' . $cid . '" alt="Image" /></p> 
  </div> 
  </body> 
</html>' , 

'text/html'  
); 
   
// Das Wichtigste! Die PDF-Wunschliste 
$message->attach(Swift_Attachment::fromPath($attachment)); 

// Hier bestimmen wir die Sendemethode. Fortgeschrittene benutzen besser SMTP 
$transport = Swift_MailTransport::newInstance(); 

// Unser Mailerobjekt wird mit der Sendemethode erzeugt 
$mailer = Swift_Mailer::newInstance($transport); 

// Und schon geht die Nachricht auf die Reise 
if ($mailer->send($message)) { 
  echo 'Hurra.'; 
} 
else { 
  echo 'Fehler! Schnell F5 drücken!!'; 
} 
~~~

Die Klasse flugs auf dem Server installiert, Pfade angepasst und das Dauerfeuer kann losgehen.

Wenn Ihr noch keine Geschenke habt und ganz Web-Zwei-Nullig noch ein paar Bestellungen ordern wollt, dann flugs zu einem der nachfolgenden Produkte gegriffen:

http://swiftmailer.org/
http://sourceforge.net/projects/phpmailer/
http://pear.php.net/package/Mail/

Auch Zend und ezComponents stellen Mailer bereit, die aber nur in Verbindung mit den jeweiligen Umgebungen funktionieren.


Es gibt also mehr als den altbekannten PHPMailer. Das da oben war ― unschwer zu erkennen ― die Swiftmailer-Klasse in der 4er Version.

Drei Ergänzungen noch:
Natürlich müßt Ihr den Absender an Eure Domain anpassen. Sonst verweigert Euer Mailserver noch die Auslieferung. Oder schlimmer: Der Weihnachtsmann liefert an den Falschen! 
Schützt Eure Verzeichnisse! Oder wollt Ihr auch noch von Fremden ungeliebte Geschenke? 
SwiftMailer benutzt Exceptions. Für alle Fälle solltet Ihr also alles per try/catch umschließen. Leider wird das in Beispielcodes (konsequent auch in meinem) in der Regel vergessen. 

PS: Wer jetzt immer noch uneinsichtig fragt, was denn an mail() so verkehrt ist, der möge sich in einer heimeligen Adventsstunde mal sämtliche RFCs zum Thema E-Mail zu Gemüte führen. Und sich fragen, ob er all diese Vorschriften mal locker aus dem Handgelenk programmiert, wofür etablierte Mailingklassen hunderte Scripte bereitstellen. Auch für einfache Textnachrichten lohnt sich der Griff zur Mailer-Klasse. Nur Mut.

Frohes Mailen! Euer Nikolaus.


LINKS

http://swiftmailer.org/
http://sourceforge.net/projects/phpmailer/
http://pear.php.net/package/Mail/

http://www.robo47.net/text/38-Mail-ist-tot-es-lebe-mail
http://www.php.de/adventskalender-2009/62142-13-die-3-e-postel-und-die-freuden-des-briefverkehrs.html
