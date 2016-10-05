---
layout: front
root: .
title: index
---

{% assign pageCounter = 0 %}
{% for sitegroup in site.groups %}
    {% for current in site.pages %}
        {% if sitegroup.name == current.group %}
            {% assign pageCounter = pageCounter | plus: 1 %}
        {% endif %}
    {% endfor %}
{% endfor %}

Herzlich Willkommen in der **PHP.de Wissenssammlung**! Diese wurde mit der Intention aufgebaut, Wissen einfach und zentral für jeden zugänglich zu machen. Technisch basiert sie auf einem bei **[GitHub gehosteten Repository](https://github.com/php-de/php-de.github.io)**. Es befinden sich zur Zeit ***{{ pageCounter }} Beiträge*** in diesem Repository. Du kannst dich jederzeit mit eigenen Beiträgen an diesem Projekt beteiligen. Wie du dabei vorgehen musst, kannst du in der **[Contribute-Richtlinie]({{ page.root }}/jumpto/contribute/)** nachlesen. Alle Beiträge sind auch über einen **[Atom-Feed]({{ page.root }}/feed/atom.xml)** abrufbar.
