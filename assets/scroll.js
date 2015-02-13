/*
$(function(){
    $('a[href*=#]').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'')
        && location.hostname == this.hostname) {
            var $target = $(this.hash);
            $target = $target.length && $target || $('[name=' + this.hash.slice(1) +']');
            if ($target.length) {
                var targetOffset = $target.offset().top;
                $('html,body').animate({scrollTop: targetOffset}, 1000);
                return false;
            }
        }
    });
});
*/

$(document).ready(function() {
	// Alle internen Links auswählen
	$('a[href*=#]').bind("click", function(event) {
		// Standard Verhalten unterdrücken
		event.preventDefault();
		// Linkziel in Variable schreiben
		var ziel = $(this).attr("href");
		//Scrollen der Seite animieren, body benötigt für Safari
		$('html,body').animate({
			//Zum Ziel scrollen (Variable)
			scrollTop: $(ziel).offset().top
		// Dauer der Animation und Callbackfunktion die nach der Animation aufgerufen wird,
		// sie stellt das Standardverhalten wieder her und ergänzt die URL
		}, 2000 , function (){location.hash = ziel;});
   });
return false;
});
