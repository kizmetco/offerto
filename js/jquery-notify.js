(function($){		  
	function close(options, wrapper){
		options.onCleanup.call(this);
		wrapper.fadeOut('fast', function(){
			$(this).remove();
			options.onClosed();
		})
	}
		
	function create_element(tag, cl){
		return $(document.createElement(tag)).addClass(cl);
	}

	var methods = {
		resize: function(notification){
			var data = notification.data('notification');

			data.east.add(data.west).add(data.center).animate({
				height: data.content.outerHeight()
			}, 250);
		}
	}
		  
    $.extend({
        notify: function(options, duration) {
        	if(methods[options]){
				return methods[options].apply(this, Array.prototype.slice.call(arguments, 1));
        	}
        	else if(typeof options === 'object' || ! options){
        		var
				// Default options object
				defaults = {
					inline: false,
					href: '',
					html: '',
					close: '',
					onStart: function(){},
					onComplete: function(){},
					onCleanup: function(){},
					onClosed: function(){}
				},
				
				// Useful variables
				clone,
				iframe = false,
				container, 
				wrapper = $('<li></li>').addClass('notification'),
				north,
				south,
				east,
				west,
				center,
				content;
				
				options = $.extend(defaults, options);
	            options.onStart.call(this);
	            
	            if($('ul#notification_area').length) {
					container = $('ul#notification_area');
				} 
				else {
					container = $('<ul></ul>').attr('id', 'notification_area');
					$('body').append(container);
				}
	            
	            if(options.href){
					if(options.inline){
						clone = $(options.href).clone();
					}
					else {
						iframe = true;
						clone = $('<iframe></iframe>').attr('src', options.href).css({width: '100%', height: '100%'});
					}
				}
				else if(options.html){
					clone = $(options.html);
				}
					
				wrapper.append(
					create_element('div', 'notify_top').append(
						create_element('div', "notify_nw"),
						north = create_element('div', "notify_n"),
						create_element('div', "notify_ne")
					),
					center = create_element('div', 'notify_center').append(
					   east = create_element('div', "notify_w"),
						content = create_element('div', 'notify_content').append(clone),
						west = create_element('div', "notify_e")
					),
					create_element('div', 'notify_bottom').append(
						create_element('div', "notify_se"),
						south = create_element('div', "notify_s"),
						create_element('div', "notify_sw")
					)
				);
		
				wrapper.data('notification', {
	            	north: north, 
	            	south: south,
	            	east: east,
	            	west: west,
	            	content: content,
	            	center: center
	            }).css("visibility", "hidden").appendTo(container);
				
				if(options.close){
					if(typeof options.close === 'object'){
						var click_type = 'live';

						close_elem = options.close;
					}
					else {
						var close_elem = $('<span></span>').addClass('cl').html(options.close),
							click_type = 'bind';

						content.append(close_elem);
					}
				}

				var anim_length = 0 - parseInt(wrapper.outerHeight());
				wrapper.css('marginBottom', anim_length);
		
				if(iframe){
					content.height(parseInt(content.find('iframe').height()+16))
				}
				north.width(parseInt(wrapper.width())-40);
				south.width(parseInt(wrapper.width())-40);
				east.height(parseInt(content.outerHeight()));
				west.height(parseInt(content.outerHeight()));
				center.height(parseInt(content.outerHeight())).css('overflow', 'hidden');
				
				wrapper.animate({marginBottom: 0}, 'fast', function(){
					wrapper.hide().css('visibility', 'visible').fadeIn('fast');
					if(duration){
						setTimeout(function(){
							close(options, wrapper);
						}, duration); 
					}
					
					if(!options.close){
						wrapper.live('click', function(e){
							e.preventDefault();
							close(options, wrapper);
						})
					}
					else {
						if(click_type == 'bind'){
							close_elem.bind('click', function(e){
								e.preventDefault();
								close(options, wrapper);
							})
						}
						else {
							close_elem.live('click', function(e){
								e.preventDefault();
								close(options, wrapper);
							})
						}
					}
					
					options.onComplete.call(this);
				});
        	}
        	else {
        		console.error('Method "'+options+'" doesn\'t exist.');
        	}
        }
    });

})(jQuery);
