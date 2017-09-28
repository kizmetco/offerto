(function($){
	var euCookie = {
		g: function(){
			var ca = document.cookie.split(';');

			for(var i=0;i < ca.length;i++) {
				var c = ca[i];
				while (c.charAt(0)==' ') c = c.substring(1, c.length);
				if (c.indexOf("euCookieLaw") == 0) return c.substring("euCookieLaw".length,c.length);
			}

			return null;
		},
		s: function(value){
			var date = new Date();
			date.setTime(date.getTime()+315532800000);

			document.cookie = "euCookieLaw="+value+"; expires="+date.toGMTString()+"; path=/";
		}
	}

	$.extend({
		cookieLaw: function(options){
			var defaults = {
					impliedConsent: true,
					title: 'EU Cookie Waarschuwing',
					shortMessage: 'Wij maken gebruik van cookies. Deze cookies worden geplaatst door Google Analytics om onze paginas te optimaliseren en door Facebook voor social media integratie. Als u verder gebruik maakt van deze website geeft u uw akkoord voor het plaatsen van cookies.',
					longMessage: 'Cookies zijn kleine tekstjes die absoluut geen kwaad kunnen maar die uw internet browser gebruikt om beter te kunnen communiceren met onze site. Op deze manier functioneert onze site optimaal voor u en begrijpt deze beter hoe u onze site gebruikt.',
					onAccepted: function(){}
				},
				cookie = euCookie.g();

			options = $.extend(defaults, options);

			if(cookie == null){
				$.notify({
					inline: true,
					html: '<h3>'+options.title+'</h3><p>'+options.shortMessage+'</p><p id="euCookieLongMessage" style="display: none;">'+options.longMessage+'</p><p id="euCookieButtonContainer">'+(!options.impliedConsent ? '<a id="euCookieAccept" class="btn primary" href="#">I Accept</a>' : '')+' <a class="btn" id="euCookieMoreInfo" href="#">More Info</a> </p>',
					close: (!options.impliedConsent ? $('#euCookieAccept') : 'Close'),
					onComplete: function(){ 
						$('#euCookieMoreInfo').click(function(){
							if($('#euCookieLongMessage').is(':hidden')){
								$(this).text('Less Info');
								$('#euCookieLongMessage').fadeIn(250);

								$.notify("resize", $(this).parents('.notification'));
							}
							else {
								$(this).text('More Info');
								$('#euCookieLongMessage').fadeOut(250, function(){
									$.notify("resize", $(this).parents('.notification'));
								});
							}
						});

						if(options.impliedConsent){
							euCookie.s('implied'); 
							options.onAccepted.call(this);
						}
					},
					onCleanup: function(){
						euCookie.s('accepted');
						options.onAccepted.call(this);
					}
				})
			}
			else {
				options.onAccepted.call(this);
			}
		}
	})
})(jQuery)