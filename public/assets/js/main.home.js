$(document).on("ready", function () {
    $('.customizedtraining').on('click', function(e){
        e.preventDefault();
        $('.chat-widget-container').click();
    })
    $('.startlearning').on('click', function(e){
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $("#digitalmarketingcourses").offset().top
        }, 1000);
    })
		function t(t) {
			t.each(function () {
				var t = $(this),
					i = t.data("animation");
				t.addClass(i).one("webkitAnimationEnd animationend", function () {
					t.removeClass(i)
				})
			})
		}
		$(".popup-youtube, .popup-vimeo, .popup-gmaps").magnificPopup({
			type: "iframe",
			mainClass: "mfp-fade",
			removalDelay: 160,
			preloader: !1,
			fixedContentPos: !1
		}), $(".testimonials-carousel").owlCarousel({
			dots: !0,
			loop: !0,
			margin: 30,
			nav: !0,
			navText: ["<img src='/move-left.png'>", "<img src='/move-right.png'>"],
			// autoplay: !0,
			responsive: {
				0: {
					dotsEach: 1,
					items: 1
				},
				600: {
					dotsEach: 1,
					items: 1
				},
				1000: {
					dotsEach: 1,
					items: 2
				}
			}
		}), $(".courses-carousel").owlCarousel({
			loop: false,
            rewind: true,
			nav: !0,
			margin: 30,
			dots: true,
			autoplay: true,
			items: 1,
			navText: ["<img src='/move-left.png'>", "<img src='/move-right.png'>"],
			responsive: {
				0: {
					items: 1
				},
				600: {
					items: 1
				},
				1000: {
					items: 4
				}
			}
		}), $(window).on("load", function () {
			$(".se-pre-con").fadeOut("slow")
		})
         
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
          var target = $(e.target).attr("href") // activated tab
          const id = parseInt(target.split('-')[1])-1;
          $('.carousel').carousel(id);
        
        });
        
        $('.carousel').on('slide.bs.carousel', function onSlide (ev) {
          const id = ev.to%9+1;
          $('.nav-link').css("background", "#4285F4");
          $('.nav-link').css("border-color", "#4285F4");
          $('.nav-link-'+id).click();
          $('.nav-link.active').css("background", "white")
          // $('.nav-link').removeClass('active').removeClass('show');
          // $('.nav-link-'+id).addClass('active show')
          // $('.nav-item-'+(ev.from+1).toString()).children('a').click();
        })
               /* ==================================================
                # Testimonials Carousel
             ===============================================*/
          
        
        })
        $(function(){
                $("#menu-toggle").click(function(e) {
                    e.preventDefault();
                    $("#wrapper").toggleClass("toggled");
                });
                 /* ==================================================
                # Youtube Video Init
             ===============================================*/
            $('.player').mb_YTPlayer();
        
            /* ==================================================
                # Magnific popup init
             ===============================================*/
             $(".popup-link").magnificPopup({
                type: 'image',
                // other options
            });
        
            $(".popup-gallery").magnificPopup({
                type: 'image',
                gallery: {
                    enabled: true
                },
                // other options
            });
        
            $(".popup-youtube, .popup-vimeo, .popup-gmaps").magnificPopup({
                type: "iframe",
                mainClass: "mfp-fade",
                removalDelay: 160,
                preloader: false,
                fixedContentPos: false
            });
              });
     