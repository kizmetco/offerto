/* ===================================================
 * bootstrap-transition.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#transitions
 * ===================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  $(function () {

    "use strict"; // jshint ;_;


    /* CSS TRANSITION SUPPORT (http://www.modernizr.com/)
     * ======================================================= */

    $.support.transition = (function () {

      var transitionEnd = (function () {

        var el = document.createElement('bootstrap')
          , transEndEventNames = {
               'WebkitTransition' : 'webkitTransitionEnd'
            ,  'MozTransition'    : 'transitionend'
            ,  'OTransition'      : 'oTransitionEnd'
            ,  'msTransition'     : 'MSTransitionEnd'
            ,  'transition'       : 'transitionend'
            }
          , name

        for (name in transEndEventNames){
          if (el.style[name] !== undefined) {
            return transEndEventNames[name]
          }
        }

      }())

      return transitionEnd && {
        end: transitionEnd
      }

    })()

  })

}(window.jQuery);
/* ========================================================
 * bootstrap-tab.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#tabs
 * ========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* TAB CLASS DEFINITION
  * ==================== */

  var Tab = function ( element ) {
    this.element = $(element)
  }

  Tab.prototype = {

    constructor: Tab

  , show: function () {
      var $this = this.element
        , $ul = $this.closest('ul:not(.dropdown-menu)')
        , selector = $this.attr('data-target')
        , previous
        , $target
        , e

      if (!selector) {
        selector = $this.attr('href')
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
      }

      if ( $this.parent('li').hasClass('active') ) return

      previous = $ul.find('.active a').last()[0]

      e = $.Event('show', {
        relatedTarget: previous
      })

      $this.trigger(e)

      if (e.isDefaultPrevented()) return

      $target = $(selector)

      this.activate($this.parent('li'), $ul)
      this.activate($target, $target.parent(), function () {
        $this.trigger({
          type: 'shown'
        , relatedTarget: previous
        })
      })
    }

  , activate: function ( element, container, callback) {
      var $active = container.find('> .active')
        , transition = callback
            && $.support.transition
            && $active.hasClass('fade')

      function next() {
        $active
          .removeClass('active')
          .find('> .dropdown-menu > .active')
          .removeClass('active')

        element.addClass('active')

        if (transition) {
          element[0].offsetWidth // reflow for transition
          element.addClass('in')
        } else {
          element.removeClass('fade')
        }

        if ( element.parent('.dropdown-menu') ) {
          element.closest('li.dropdown').addClass('active')
        }

        callback && callback()
      }

      transition ?
        $active.one($.support.transition.end, next) :
        next()

      $active.removeClass('in')
    }
  }


 /* TAB PLUGIN DEFINITION
  * ===================== */

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tab')
      if (!data) $this.data('tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


 /* TAB DATA-API
  * ============ */

  $(function () {
    $('body').on('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
      e.preventDefault()
      $(this).tab('show')
    })
  })

}(window.jQuery);
/* ==========================================================
 * bootstrap-alert.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#alerts
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* ALERT CLASS DEFINITION
  * ====================== */

  var dismiss = '[data-dismiss="alert"]'
    , Alert = function (el) {
        $(el).on('click', dismiss, this.close)
      }

  Alert.prototype.close = function (e) {
    var $this = $(this)
      , selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = $(selector)

    e && e.preventDefault()

    $parent.length || ($parent = $this.hasClass('alert') ? $this : $this.parent())

    $parent.trigger(e = $.Event('close'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent
        .trigger('closed')
        .remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent.on($.support.transition.end, removeElement) :
      removeElement()
  }


 /* ALERT PLUGIN DEFINITION
  * ======================= */

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('alert')
      if (!data) $this.data('alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


 /* ALERT DATA-API
  * ============== */

  $(function () {
    $('body').on('click.alert.data-api', dismiss, Alert.prototype.close)
  })

}(window.jQuery);





/*!
 * jQuery Scrollspy Plugin
 * Author: @sxalexander
 * Licensed under the MIT license
 */
;(function ( $, window, document, undefined ) {

    $.fn.extend({
      scrollspy: function ( options ) {
        
          var defaults = {
            min: 0,
            max: 0,
            mode: 'vertical',
            buffer: 0,
            container: window,
            onEnter: options.onEnter ? options.onEnter : [],
            onLeave: options.onLeave ? options.onLeave : [],
            onTick: options.onTick ? options.onTick : []
          }
          
          var options = $.extend( {}, defaults, options );

          return this.each(function (i) {

              var element = this;
              var o = options;
              var $container = $(o.container);
              var mode = o.mode;
              var buffer = o.buffer;
              var enters = leaves = 0;
              var inside = false;
                            
              /* add listener to container */
              $container.bind('scroll', function(e){
                  var position = {top: $(this).scrollTop(), left: $(this).scrollLeft()};
                  var xy = (mode == 'vertical') ? position.top + buffer : position.left + buffer;
                  var max = o.max;
                  var min = o.min;
                  
                  /* fix max */
                  if($.isFunction(o.max)){
                    max = o.max();
                  }

                  /* fix max */
                  if($.isFunction(o.min)){
                    min = o.min();
                  }

                  if(max == 0){
                      max = (mode == 'vertical') ? $container.height() : $container.outerWidth() + $(element).outerWidth();
                  }
                  
                  /* if we have reached the minimum bound but are below the max ... */
                  if(xy >= o.min && xy <= max){
                    /* trigger enter event */
                    if(!inside){
                       inside = true;
                       enters++;
                       
                       /* fire enter event */
                       $(element).trigger('scrollEnter', {position: position})
                       if($.isFunction(o.onEnter)){
                         o.onEnter(element, position);
                       }
                      
                     }
                     
                     /* triger tick event */
                     $(element).trigger('scrollTick', {position: position, inside: inside, enters: enters, leaves: leaves})
                     if($.isFunction(o.onTick)){
                       o.onTick(element, position, inside, enters, leaves);
                     }
                  }else{
                    
                    if(inside){
                      inside = false;
                      leaves++;
                      /* trigger leave event */
                      $(element).trigger('scrollLeave', {position: position, leaves:leaves})

                      if($.isFunction(o.onLeave)){
                        o.onLeave(element, position);
                      }
                    }
                  }
              }); 

          });
      }

    })

    
})( jQuery, window );






/* CUSTOM FUNCTIONS */
$(document).ready(function(){

	/* Jigowatt AJAX Form */
	$('#contact-form').submit(function(){

		var action = $(this).attr('action');

		$('#contact-submit').after('<img src="../../js/images/ajax-loader.gif" class="loader" />');

		$("#ajax-console").slideUp(750,function() {
		$('#ajax-console').hide();
		$('#ajax-console-success').hide();

		$.post(action, {
			name: $('#contact-name').val(),
			email: $('#contact-email').val(),
			website: $('#contact-website').val(),
			comments: $('#contact-comments').val(),
			verify: $('#verify').val()
		},
			function(data){
				if(data.match('success') != null) {
					$('#contact-form').slideUp('slow', function(){
						$('#ajax-console-success').slideDown('slow');
					});
					document.getElementById('ajax-console-success').innerHTML = data;
				} else {
					document.getElementById('ajax-console').innerHTML = data;
					$('#ajax-console').slideDown('slow');
					$('#contact-form img.loader').fadeOut('fast',function(){$(this).remove()});
				}
			}
		);

		});

		return false;

	});
	
	/* Adding Automatic Navigation for the Tour */
	var navParentLinkPrev = null, navParentTextPrev = null, navParentLinkNext = null, navParentTextNext = null, tourNav = null;

    $('.tour-navigation ul li').each(function(i, elem){
    	navParentLinkPrev = $(elem).prev().children().attr('href');
    	navParentTextPrev = $(elem).prev().children().text();
    	navParentLinkNext = $(elem).next().children().attr('href');
    	navParentTextNext = $(elem).next().children().text();
    	
    	if (navParentLinkPrev == null) {
    		tourNav = '<div class="tour-nav-container clearfix">'+
			'<a href="../../js/'+navParentLinkNext+'" data-toggle="tab" class="external-tab-hook fr neutral-button icon-right">' + navParentTextNext + ' <i class="icon-arrow-right"></i></a>' +
        	'</div>';
        } else if (navParentLinkNext == null) {
    		tourNav = '<div class="tour-nav-container clearfix">'+
			'<a href="../../js/'+navParentLinkPrev+'" data-toggle="tab" class="external-tab-hook fl neutral-button icon-left"><i class="icon-arrow-left"></i> ' + navParentTextPrev + '</a>' +
        	'</div>';
        } else {
    		tourNav = '<div class="tour-nav-container clearfix">'+
			'<a href="../../js/'+navParentLinkNext+'" data-toggle="tab" class="external-tab-hook fr neutral-button icon-right">' + navParentTextNext + ' <i class="icon-arrow-right"></i></a>' +
			'<a href="../../js/'+navParentLinkPrev+'" data-toggle="tab" class="external-tab-hook fl neutral-button icon-left"><i class="icon-arrow-left"></i> ' + navParentTextPrev + '</a>' +
        	'</div>';
        }
    	
        $($(elem).children().attr("href")).prepend(tourNav);
    });	
	
	
	
	// Dynamically create the floating nav
	$('h2.spy-hook').each(function(){
		$('.floating-nav ul').append('<li><a href="#'+$(this).attr('id')+'">'+$(this).text()+'</a></li>');
	});

	// Extending Bootstrap tabs by adding support for outside links
	// Once clicked, these act as a tab
	$('.external-tab-hook').click(function(){
		var targetTab = $(this).attr("href");
		
		$('a[href="' + targetTab + '"]').tab('show');
	});


	// Scrollspy
	// Only activating this if viewed on a screen > 960px
	if ($(window).width() > 960) {
		$('.floating-nav').scrollspy({
			min: $('.floating-nav').offset().top,
			max: 99999,
			onEnter: function(element, position) {
				$(".floating-nav").addClass('fixed').removeClass('container');
				$(".floating-nav div").addClass('container');
				$("body").addClass('fixed-nav');
			},
			onLeave: function(element, position) {
				$(".floating-nav").removeClass('fixed').addClass('container');
				$(".floating-nav div").removeClass('container');
				$("body").removeClass('fixed-nav');
			}
		});
		
		$('.spy-hook').each(function(i) {
			var position = $(this).position();
			$(this).scrollspy({
				min: position.top-220,
				max: position.top + $(this).parent().height()-220,
				onEnter: function(element, position) {
					$('a[href$=' + element.id + ']').parent().addClass('active')
				},
				onLeave: function(element, position) {
					$('a[href$=' + element.id + ']').parent().removeClass('active');
				}
			});
		});
	}
	

		
	/* Smooth Scrolling */
	$('.floating-nav ul li a, a[href$="top"]').click(function(event){		
		event.preventDefault();
		$('html, body').animate({scrollTop:$(this.hash).offset().top-100}, 500);
	});
	
	
	/* jQuery Slider for Testimonials */
	$('.slider li').each(function(i){
		$(this).attr('id', 'slide-' + (i+1));
		$('.slider-controls').append('<li><a href="#slide-'+(i+1)+'">'+ (i+1) +'</a></li>')
	});
	
	$('.slider li:gt(0)').hide();
	$('.slider-controls li a:lt(1)').addClass('controls-active');
	
	$('.slider-controls a').click(function(event){
		event.preventDefault();
		$('.slider-controls a').removeClass('controls-active');
		$(this).addClass('controls-active');
		$('.slider li:visible').fadeOut();
		var targetSlide = $(this).attr('href');
		$(targetSlide).fadeIn();
	});
	
	
	
	/* Create a secondary menu for the responsive navigation */
	$("<select />").addClass('responsive-nav').appendTo(".floating-nav");
	
	$("<option />", {
		"selected": "selected",
		"value"   : "",
		"text"    : "Jump to..."
	}).appendTo(".floating-nav select");
	
	/* Populate dropdown with menu items */
	$(".floating-nav ul li a").each(function() {
		var el = $(this);
		$("<option />", {
			"value"   : el.attr("href"),
			"text"    : el.text()
		}).appendTo(".floating-nav select");
	});
	
	/* Make the drop-down work */
	$(".floating-nav select").change(function() {
		window.location = $(this).find("option:selected").val();
	});
	
	
	
	/* Submit the Sign-up Form */
	$('#signup-submit').click(function(event) {
		event.preventDefault();
		$('#signup-form').submit();
	});
});