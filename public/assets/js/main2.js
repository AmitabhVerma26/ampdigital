
    $(document).ready(function(){
        $(".termsandconditionscheckbox").on("change", function(){
            if(this.checked){
                $(".sendquery").removeAttr('disabled');
            }
            else{
                $(".sendquery").attr('disabled', true)
            }
        });
                    var filter = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;

        function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
        $(".sendquery").on('click', function(e){
            e.preventDefault();
            var el = $(this);
            el.html('<i class="fa fa-spin fa-spinner"></i> Sending...').attr('disabled', true);
            const name = $("#name").val();
            const email = $("#email").val();
            const phone = $("#phone").val();
            const city = $("#city").val();
            const query = $("#query").val();
            if(name==""){
                $.alert("Kindly fill your name");
                el.html('<i class="fa fa-plane"></i> Contact Us').removeAttr('disabled');
            }
            else if(email==""){
               $.alert("Kindly fill your email"); 
            }
            else if(email!=="" && !validateEmail(email)){
                $.alert("Kindly fill valid email"); 
                el.html('<i class="fa fa-plane"></i> Contact Us').removeAttr('disabled');

            }
            else if(phone==""){
                $.alert("Kindly fill your phone");
                el.html('<i class="fa fa-plane"></i> Contact Us').removeAttr('disabled');
            }
            else if(phone.length!==10){
                $.alert("Kindly fill valid phone");
                el.html('<i class="fa fa-plane"></i> Contact Us').removeAttr('disabled');
            }
            else if(phone.length==10 && !filter.test(phone)){
                $.alert("Kindly fill valid phone");
                el.html('<i class="fa fa-plane"></i> Contact Us').removeAttr('disabled');
            }
            else if(city==""){
                $.alert("Kindly fill your city");
                el.html('<i class="fa fa-plane"></i> Contact Us').removeAttr('disabled');
            }
            else if(query==""){
                $.alert("Kindly fill your query");
                el.html('<i class="fa fa-plane"></i> Contact Us').removeAttr('disabled');
            }
            else{
                const formdata = {name, email, phone, city, query};
            

            $.ajax({
                url: "https://api.pipedrive.com/v1/persons?api_token=8f33a5757178ad7713a06f1ca6be344f8d0b9e38",
                method: "POST",
                data: JSON.stringify({
                    "name": name,
                    "email": [email],
                    "phone": phone,
                    "postal_address": city,
                    "visible_to": "3"
                    }),
                dataType: 'json',
                contentType: "application/json",
                 success: function(response ){
                     if(response.success == true){
                         var personId = response.data.id;
                         $.ajax({
                            url: "https://api.pipedrive.com/v1/leads?api_token=8f33a5757178ad7713a06f1ca6be344f8d0b9e38",
                            method: "POST",
                            data: JSON.stringify({
                                "title": name,
                                "note": query,
                                "person_id": personId
                                }),
                            dataType: 'json',
                            contentType: "application/json",
                             success: function(response ){
                                 el.html('<i class="fa fa-plane"></i> Contact Us').removeAttr('disabled');
                                 if(response.success == true){
                                     window.location.href = '/trade-finance-thankyou.php';
                                 }   
                                 else{
                                     alert('Please fill valid data');
                                 }      
                            },
                             error(jqXHR, textStatus, errorThrown){
                                 //Do something
                             }
                        }); 
                     }   
                     else{
                         alert('Please fill valid data');
                         el.html('<i class="fa fa-plane"></i> Contact Us').removeAttr('disabled');
                     }      
                },
                 error(jqXHR, textStatus, errorThrown){
                     //Do something
                 }
            }); 
            }
        })
        $('[data-toggle="popover"]').popover()

        $('.readmore').on('click', function(){
            $('.readmoretext').toggleClass('d-none');
            if($(this).text().toLowerCase() == 'read more'){
                $('.readmore').text('Read Less');
            }
            else{
                $('.readmore').text('Read More');
            }
        })
        $('.ctabtn').on('click', function(e){
            e.preventDefault();
            $('html, body').animate({ scrollTop: $('#section1').offset().top }, 'slow');
        })
        $('.customer-logos').slick({
            slidesToShow: 5,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 1500,
            arrows: true,
            dots: false,
            pauseOnHover: false,
            responsive: [{
                breakpoint: 768,
                settings: {
                    slidesToShow: 4
                }
            }, {
                breakpoint: 520,
                settings: {
                    slidesToShow: 2
                }
            }]
        });
    });
    "use strict";

    $(document).on('ready', function() {


        /* ==================================================
            # Wow Init
         ===============================================*/
        var wow = new WOW({
            boxClass: 'wow', // animated element css class (default is wow)
            animateClass: 'animated', // animation css class (default is animated)
            offset: 0, // distance to the element when triggering the animation (default is 0)
            mobile: true, // trigger animations on mobile devices (default is true)
            live: true // act on asynchronously loaded content (default is true)
        });
        wow.init();
        

        /* ==================================================
            # Tooltip Init
        ===============================================*/
        $('[data-toggle="tooltip"]').tooltip(); 
        

        /* ==================================================
            # Smooth Scroll
         ===============================================*/
        $("body").scrollspy({
            target: ".navbar-collapse",
            offset: 200
        });
        $('a.smooth-menu').on('click', function(event) {
            var $anchor = $(this);
            var headerH = '75';
            $('html, body').stop().animate({
                scrollTop: $($anchor.attr('href')).offset().top - headerH + "px"
            }, 1500, 'easeInOutExpo');
            event.preventDefault();
        });


        /* ==================================================
            # Banner Animation
        ===============================================*/
        function doAnimations(elems) {
            //Cache the animationend event in a variable
            var animEndEv = 'webkitAnimationEnd animationend';
            elems.each(function() {
                var $this = $(this),
                    $animationType = $this.data('animation');
                $this.addClass($animationType).one(animEndEv, function() {
                    $this.removeClass($animationType);
                });
            });
        }

        //Variables on page load
        var $immortalCarousel = $('.animate_text'),
            $firstAnimatingElems = $immortalCarousel.find('.item:first').find("[data-animation ^= 'animated']");
        //Initialize carousel
        $immortalCarousel.carousel();
        //Animate captions in first slide on page load
        doAnimations($firstAnimatingElems);
        //Other slides to be animated on carousel slide event
        $immortalCarousel.on('slide.bs.carousel', function(e) {
            var $animatingElems = $(e.relatedTarget).find("[data-animation ^= 'animated']");
            doAnimations($animatingElems);
        });


        /* ==================================================
            # Youtube Video Init
         ===============================================*/
        $('.player').mb_YTPlayer();


        /* ==================================================
            # imagesLoaded active
        ===============================================*/
        $('#portfolio-grid,.blog-masonry').imagesLoaded(function() {

            /* Filter menu */
            $('.mix-item-menu').on('click', 'button', function() {
                var filterValue = $(this).attr('data-filter');
                $grid.isotope({
                    filter: filterValue
                });
            });

            /* filter menu active class  */
            $('.mix-item-menu button').on('click', function(event) {
                $(this).siblings('.active').removeClass('active');
                $(this).addClass('active');
                event.preventDefault();
            });

            /* Filter active */
            var $grid = $('#portfolio-grid').isotope({
                itemSelector: '.pf-item',
                percentPosition: true,
                masonry: {
                    columnWidth: '.pf-item',
                }
            });

            /* Filter active */
            $('.blog-masonry').isotope({
                itemSelector: '.blog-item',
                percentPosition: true,
                masonry: {
                    columnWidth: '.blog-item',
                }
            });

        });


         /* ==================================================
            # Fun Factor Init
        ===============================================*/
        $('.timer').countTo();
        $('.fun-fact').appear(function() {
            $('.timer').countTo();
        }, {
            accY: -100
        });


        /* ==================================================
            Nice Select Init
         ===============================================*/
        $('select').niceSelect();


        /* ==================================================
            Countdown Init
         ===============================================*/
        loopcounter('counter-class');


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

        $('.magnific-mix-gallery').each(function() {
            var $container = $(this);
            var $imageLinks = $container.find('.item');

            var items = [];
            $imageLinks.each(function() {
                var $item = $(this);
                var type = 'image';
                if ($item.hasClass('magnific-iframe')) {
                    type = 'iframe';
                }
                var magItem = {
                    src: $item.attr('href'),
                    type: type
                };
                magItem.title = $item.data('title');
                items.push(magItem);
            });

            $imageLinks.magnificPopup({
                mainClass: 'mfp-fade',
                items: items,
                gallery: {
                    enabled: true,
                    tPrev: $(this).data('prev-text'),
                    tNext: $(this).data('next-text')
                },
                type: 'image',
                callbacks: {
                    beforeOpen: function() {
                        var index = $imageLinks.index(this.st.el);
                        if (-1 !== index) {
                            this.goTo(index);
                        }
                    }
                }
            });
        });


        /* ==================================================
            # Feature Carousel
         ===============================================*/
        $('.feature-carousel').owlCarousel({
            loop: true,
            nav: false,
            margin:30,
            dots: true,
            autoplay: true,
            items: 1,
            navText: [
                "<i class='fa fa-angle-left'></i>",
                "<i class='fa fa-angle-right'></i>"
            ],
            responsive: {
                1000: {
                    stagePadding: 100,
                }
            }
        });


        /* ==================================================
            # Cateogries Carousel
         ===============================================*/
        $('.categories-carousel').owlCarousel({
            loop: false,
            margin: 30,
            nav: false,
            navText: [
                "<i class='fa fa-angle-left'></i>",
                "<i class='fa fa-angle-right'></i>"
            ],
            dots: true,
            autoplay: true,
            responsive: {
                0: {
                    items: 1
                },
                600: {
                    items: 2
                },
                1000: {
                    items: 2
                }
            }
        });

        /* ==================================================
            # Cateogries Carousel Two
         ===============================================*/
        $('.thumb-categories-carousel').owlCarousel({
            loop: true,
            nav: false,
            margin:30,
            dots: false,
            autoplay: true,
            items: 1,
            navText: [
                "<i class='fa fa-angle-left'></i>",
                "<i class='fa fa-angle-right'></i>"
            ],
            responsive: {
                0: {
                    items: 1
                },
                800: {
                    items: 2
                },
                1000: {
                    items: 3,
                    stagePadding: 100,
                }
            }
        });


        /* ==================================================
            # Testimonials Carousel
         ===============================================*/
         $('.testimonials-carousel').owlCarousel({
            dots: true,
            loop: true,
            margin: 30,
            nav: true,
            navText: [
                "<i class='fa fa-angle-left'></i>",
                "<i class='fa fa-angle-right'></i>"
            ],
            autoplay: true,
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
        });


        /* ==================================================
            # Advisor Carousel
         ===============================================*/
        $('.advisor-carousel').owlCarousel({
            dots: false,
            loop: true,
            margin: 30,
            nav: true,
                        navText: [
                "<i class='fa fa-angle-left nav-btn prev-slide'></i>",
                "<i class='fa fa-angle-right nav-btn next-slide'></i>"
            ],
            autoplay: true,
            autoplayTimeout: 2000,
            responsive: {
                0: {
                    dotsEach: 1,
                    items: 2
                },
                600: {
                    dotsEach: 1,
                    items: 2
                },
                1000: {
                    dotsEach: 1,
                    items: 6
                }
            }
        });


        /* ==================================================
            # Courses Carousel
         ===============================================*/
        $('.courses-carousel').owlCarousel({
            loop: true,
            nav: true,
            margin:30,
            dots: false,
            autoplay: false,
            items: 1,
            navText: [
                "<i class='fa fa-angle-left'></i>",
                "<i class='fa fa-angle-right'></i>"
            ],
            responsive: {
                0: {
                    items: 1
                },
                600: {
                    items: 1
                },
                1000: {
                    items: 3,
                }
            }
        });


        /* ==================================================
            # Partner Carousel
         ===============================================*/
        $('.partner-carousel').owlCarousel({
            loop: true,
            nav: false,
            margin:80,
            dots: false,
            autoplay: false,
            items: 1,
            navText: [
                "<i class='fa fa-angle-left'></i>",
                "<i class='fa fa-angle-right'></i>"
            ],
            responsive: {
                0: {
                    items: 2,
                    margin:30
                },
                600: {
                    items: 3,
                    margin:30
                },
                1000: {
                    items: 5,
                }
            }
        });


        /* ==================================================
            Preloader Init
         ===============================================*/
        $(window).on('load', function() {
            // Animate loader off screen
            $(".se-pre-con").fadeOut("slow");;
        });


        /* ==================================================
            Contact Form Validations
        ================================================== */
        $('.contact-form').each(function() {
            var formInstance = $(this);
            formInstance.submit(function() {

                var action = $(this).attr('action');

                $("#message").slideUp(750, function() {
                    $('#message').hide();

                    $('#submit')
                        .after('<img src="assets/img/ajax-loader.gif" class="loader" />')
                        .attr('disabled', 'disabled');

                    $.post(action, {
                            name: $('#name').val(),
                            email: $('#email').val(),
                            phone: $('#phone').val(),
                            comments: $('#comments').val()
                        },
                        function(data) {
                            document.getElementById('message').innerHTML = data;
                            $('#message').slideDown('slow');
                            $('.contact-form img.loader').fadeOut('slow', function() {
                                $(this).remove()
                            });
                            $('#submit').removeAttr('disabled');
                        }
                    );
                });
                return false;
            });
        });

    }); // end document ready function
