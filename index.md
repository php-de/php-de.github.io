---
layout: front
title: php.de

# WICHTIG !
#
# pageSections ist obsolote
# Es wurde ein Autoindizierungs-Array in _config.yml angelegt
#
# WICHTIG !

---
{% for calc in site.pages %}{% assign totalGuides = forloop.length | minus:2 %}{% endfor %}
Herzlich Willkommen in der **PHP.de Wissenssammlung**!  
Diese wurde mit der Intention aufgebaut, Wissen einfach und zentral für jeden zugänglich zu machen. Technisch basiert sie auf einem bei **[GitHub gehosteten Repository](http://github.com/php-de/php-de.github.io)**. Es befinden sich zur Zeit ***{{ totalGuides }} Beiträge*** in diesem Repository. Du kannst dich jederzeit an diesem Projekt mit eigenen Beiträgen beteiligen. Wie du dabei vorgehen musst kannst du in der **[Contribute-Richtlinie]({{ site.url }}/jumpto/contribute/)** nachlesen.  Alle Beiträge sind auch über einen **[Atom-Feed](http://php-de.github.io/feed/atom.xml)** zu abonnieren.
