var TxtRotate = function (t, i, e) {
	this.toRotate = i, this.el = t, this.loopNum = 0, this.period = parseInt(e, 10) || 2e3, this.txt = "", this.tick(), this.isDeleting = !1
};
TxtRotate.prototype.tick = function () {
		var t = this.loopNum % this.toRotate.length,
			i = this.toRotate[t];
		this.isDeleting ? this.txt = i.substring(0, this.txt.length - 1) : this.txt = i.substring(0, this.txt.length + 1), this.el.innerHTML = '<span class="wrap">' + this.txt + "</span>";
		var e = this,
			o = 241 - 100 * Math.random();
		this.isDeleting && (o /= 10), this.isDeleting || this.txt !== i ? this.isDeleting && "" === this.txt && (this.isDeleting = !1, this.loopNum++, o = 500) : (o = this.period, this.isDeleting = !0), setTimeout(function () {
			e.tick()
		}, o)
	}, window.onload = function () {
		$(".default-features-area .item a").on("click", t => {
			t.preventDefault()
		}), $(".image-container").on("click", function () {
			$("#myModal").modal("toggle");
			var t = $(this).data("img");
			$(".imgsrc").attr("src", t)
		});
		for (var t = document.getElementsByClassName("txt-rotate"), i = 0; i < t.length; i++) {
			var e = t[i].getAttribute("data-rotate"),
				o = t[i].getAttribute("data-period");
			e && new TxtRotate(t[i], JSON.parse(e), o)
		}
		var a = document.createElement("style");
		a.type = "text/css", a.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid #666 }", document.body.appendChild(a)
	},
	function (t) {
		t(function () {
			t("#enquirenow2, #enqirenow3").on("click", function (i) {
				i.preventDefault(), t(".chat-widget-container").click()
			}), setTimeout(function () {
				t.getScript("https://sdk.amazonaws.com/js/aws-sdk-2.41.0.min.js"), t.getScript("https://www.ampdigital.co/js/chatbot.js")
			}, 2e3), t(".bgmobile").addClass("backgroundmobile");
			var i = 0;
			setInterval(function () {
				t("#clientimg_" + (i += 1) % 5).click()
			}, 3e3), t(".testimonial-pics img").click(function () {
				t(".testimonial-pics img").removeClass("active"), t(this).addClass("active"), t(".testimonial-words").removeClass("active"), t("#client-" + t(this).data("pk")).addClass("active")
			}), t("nav ul li a:not(:only-child)").click(function (i) {
				t(this).siblings(".nav-dropdown").toggle(), t(".nav-dropdown").not(t(this).siblings()).hide(), i.stopPropagation()
			}), t(".hero, .navigation").click(function () {
				t(".nav-dropdown").hide()
			}), t("#nav-toggle").click(function () {
				t("nav ul").slideToggle()
			}), t("#nav-toggle").on("click", function () {
				this.classList.toggle("active")
			})
		})
	}(jQuery), $(document).on("ready", function () {
		function t(t) {
			t.each(function () {
				var t = $(this),
					i = t.data("animation");
				t.addClass(i).one("webkitAnimationEnd animationend", function () {
					t.removeClass(i)
				})
			})
		}
		new WOW({
			boxClass: "wow",
			animateClass: "animated",
			offset: 0,
			mobile: !0,
			live: !0
		}).init(), $('[data-toggle="tooltip"]').tooltip(), $("body").scrollspy({
			target: ".navbar-collapse",
			offset: 200
		}), $("a.smooth-menu").on("click", function (t) {
			var i = $(this);
			$("html, body").stop().animate({
				scrollTop: $(i.attr("href")).offset().top - "75" + "px"
			}, 1500, "easeInOutExpo"), t.preventDefault()
		});
		var i = $(".animate_text"),
			e = i.find(".item:first").find("[data-animation ^= 'animated']");
		i.carousel(), t(e), i.on("slide.bs.carousel", function (i) {
			t($(i.relatedTarget).find("[data-animation ^= 'animated']"))
		}), $(".player").mb_YTPlayer(), $("#portfolio-grid,.blog-masonry").imagesLoaded(function () {
			$(".mix-item-menu").on("click", "button", function () {
				var i = $(this).attr("data-filter");
				t.isotope({
					filter: i
				})
			}), $(".mix-item-menu button").on("click", function (t) {
				$(this).siblings(".active").removeClass("active"), $(this).addClass("active"), t.preventDefault()
			});
			var t = $("#portfolio-grid").isotope({
				itemSelector: ".pf-item",
				percentPosition: !0,
				masonry: {
					columnWidth: ".pf-item"
				}
			});
			$(".blog-masonry").isotope({
				itemSelector: ".blog-item",
				percentPosition: !0,
				masonry: {
					columnWidth: ".blog-item"
				}
			})
		}), $(".timer").countTo(), $(".fun-fact").appear(function () {
			$(".timer").countTo()
		}, {
			accY: -100
		}), $("select").niceSelect(), loopcounter("counter-class"), $(".popup-link").magnificPopup({
			type: "image"
		}), $(".popup-gallery").magnificPopup({
			type: "image",
			gallery: {
				enabled: !0
			}
		}), $(".popup-youtube, .popup-vimeo, .popup-gmaps").magnificPopup({
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
			navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
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
			loop: !0,
			nav: !0,
			margin: 30,
			dots: !1,
			autoplay: !1,
			items: 1,
			navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
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
	});