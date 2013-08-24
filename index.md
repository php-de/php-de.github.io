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
{% for calc in site.pages %}{% assign totalGuides = forloop.length %}{% endfor %}
Herzlich Willkommen in der **PHP.de Wissenssammlung**. Diese Wissenssammlung wurde mit der Intention aufgebaut Wissen einfach und zentral für jeden zugänglich zu machen. Diese Wissenssammlung basiert auf einem **[Git-Repository](http://github.com/php-de/php-de.github.io)** und wird auf [Github](http://github.com) gehostet, es befinden sich zur Zeit ***{{ totalGuides }} Beiträge*** in diesem Repository. Du kannst dich jederzeit an diesem Projekt mit eigenen Beiträgen beteiligen. Wie du dabei vorgehen musst kannst du in der **[Contribute-Richtlinie](/contribute.html)** nachlesen.