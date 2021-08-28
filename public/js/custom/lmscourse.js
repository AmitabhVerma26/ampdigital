$(document).ready(function() {
  var course_url = $('body').data('course_url');
  var course_live = $('body').data('course_live');
  var course_name = $('body').data('course_name');
  var course_id = $('body').data('course_id');

  $('.nav-item-scroll').on('click', function() {
      let scrollto = $(this).data('scrollto');
      $('html, body').animate({
          scrollTop: $("#" + scrollto).offset().top
      });
  })

  function Utils() {

  }

  Utils.prototype = {
      constructor: Utils,
      isElementInView: function(element, fullyInView) {
          var pageTop = $(window).scrollTop();
          var pageBottom = pageTop + $(window).height();
          var elementTop = $(element).offset().top;
          var elementBottom = elementTop + $(element).height();

          if (fullyInView === true) {
              return ((pageTop < elementTop) && (pageBottom > elementBottom));
          } else {
              return ((elementTop <= pageBottom) && (elementBottom >= pageTop));
          }
      }
  };

  var Utils = new Utils();


  $(window).scroll(function() {
      if (Utils.isElementInView($('#coursefeatures'), false)) {
          $(".nav-item-scroll").removeClass("course-navbar-active");
          $(".coursefeatures").addClass("course-navbar-active");
      } else if (Utils.isElementInView($('#topicsyouwilllearn'), false)) {
          $(".nav-item-scroll").removeClass("course-navbar-active");
          $(".topicsyouwilllearn").addClass("course-navbar-active");
      } else if (Utils.isElementInView($('#platforms'), false)) {


          $(".nav-item-scroll").removeClass("course-navbar-active");
          $(".platforms").addClass("course-navbar-active");
      } else if (Utils.isElementInView($('#projects'), false)) {
          $(".nav-item-scroll").removeClass("course-navbar-active");
          $(".projects").addClass("course-navbar-active");
      } else if (Utils.isElementInView($('#leadinstructor'), false)) {
          $(".nav-item-scroll").removeClass("course-navbar-active");
          $(".leadinstructor").addClass("course-navbar-active");
      } else if (Utils.isElementInView($('#certification'), false)) {
          $(".nav-item-scroll").removeClass("course-navbar-active");
          $(".certification").addClass("course-navbar-active");
      } else if (Utils.isElementInView($('#testimonials'), false)) {
          $(".nav-item-scroll").removeClass("course-navbar-active");
          $(".testimonials").addClass("course-navbar-active");
      } else if (Utils.isElementInView($('#faqs'), false)) {
          $(".nav-item-scroll").removeClass("course-navbar-active");
          $(".faqs").addClass("course-navbar-active");
      } else {
          console.log('out of view');
      }

      var height = $(window).scrollTop();
      console.log(height);
      if (height > 100) {
          $('.site-navbar').addClass('d-none');
      } else {
          $('.site-navbar').removeClass('d-none');
      }
      if (height > 785) {
          $('.course-navbar').removeClass('d-none');
      } else {
          $('.course-navbar').addClass('d-none');
      }
  });
  $.ajax({
      type: "GET",
      url: '/courses/topics/'+course_url,
      success: function(courseinfo) {
          $(".accordiondata").html(courseinfo);
          $(".accordiondata .popup-youtube").magnificPopup({
              type: "iframe",
              mainClass: "mfp-fade",
              removalDelay: 160,
              preloader: false,
              fixedContentPos: false
          });
      }
  });
  var width = parseInt($('.navbar').data('discounted_price'));
  $("input[name*='studentcheckbox']").change(function() {
      if (this.checked) {
          var $input = $('.couponcode2, .couponcode3, .couponcode2loginform');
          $input.prop('disabled', true);
          $('.courseprice').html(width / 2);
      } else {
          $('.courseprice').html(width);
          $('.couponcode2, .couponcode3, .couponcode2loginform').removeAttr('disabled').prop('disabled', false)
      }
  });

  function getCookie(cname) {
      var name = cname + "=";
      var decodedCookie = decodeURIComponent(document.cookie);
      var ca = decodedCookie.split(';');
      for (var i = 0; i < ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == ' ') {
              c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
              return c.substring(name.length, c.length);
          }
      }
      return "";
  }
  if (getCookie("referralcode")) {
      var referralcode = getCookie("referralcode");
      $('.couponcode2, .couponcode3').val(referralcode).prop("readonly", true)
      $.ajax({
          type: "GET",
          url: '/payments/isvalidcoupon2?couponcode=' + referralcode,
          success: function(result) {
              var price = $('#studentcheckbox').checked ? 2000 : 4000;
              if (result !== false) {
                  if (result.type == "referralcode") {
                      price = (price) / 1.18 - (.2 * (price) / 1.18);
                      price = price + .18 * price;
                      price = Math.round(price);
                  } else if (result.type == "amount") {
                      price = price - result.discount;
                  } else {
                      price = price - price * result.discount / 100
                  }
                  $('.courseprice, .courseprice3').html(price);
                  $('.discountmessage').html(`<span style="color:green; font-size: small">Referral Code ${referralcode} applied</span>`)
              } else {
                  $('.courseprice, .courseprice3').html(width);
                  $('.discountmessage').html(`<span style="color:red; font-size: small">Referral Code ${referralcode} invalid</span>`)
              }
          }
      });
  }
  $.ajax({
      type: "GET",
      url: '/courses/faqs/'+course_id,
      success: function(faqs) {
          $(".accordionfaq").html(faqs)
      }
  });

  $(".image-container").on("click", function() {
      $("#myModal").modal("toggle");
      var el = $(this).data("img");
      $(".imgsrc").attr("src", el)
  })

  $(".avatar-img, .avatar-img-spinner").toggleClass("d-none");

  $('.forgotpasswordbutton').on('click', function(e) {
      e.preventDefault();
      $('#paymentform2').addClass('d-none');
      $('.forgotpasswordform').removeClass('d-none');
      $('.loginpaneltitle').html('Forgot Password');
  });

  $('.alreadyaccount').on('click', function(e) {
      e.preventDefault()
      $('#loginModal').modal('toggle');
      $('#createAccount').modal('toggle');
  });

  $('.loginformbutton').on('click', function(e) {
      e.preventDefault();
      $('#paymentform2').removeClass('d-none');
      $('.forgotpasswordform').addClass('d-none');
      $('.loginpaneltitle').html('Login & Subscribe');
  });

  $('.forgotpasswordform').on('submit', function(e) {
      e.preventDefault();
      var email = $('#forgotpasswordemail').val();
      var captcharesponse = false;
      var formData = $('.forgotpasswordform').serializeArray().reduce(function(obj, item) {
          if (obj[item.name] == null) {
              obj[item.name] = [];
          }
          if (item.name == "g-recaptcha-response") {
              captcharesponse = !(item.value == "");
          }
          obj[item.name].push(item.value);
          return obj;
      }, {});
      if (captcharesponse) {
          $.ajax({
              method: "POST",
              url: "/forgotpassword",
              data: {
                  email: email,
                  captcharesponse: captcharesponse
              }
          }).done(function(response) {
              if (response == -1) {
                  alert("Recaptcha")
              }
              if (response._id) {
                  $('#loginModal').modal('toggle');
                  $.alert('<div class="text-center"> <i style="font-size: 75px;" class="fab fa-plane color-primary"></i>\n' +
                      '            <h3>\n' +
                      '              Instructions on resetting your password are on their way!\n' +
                      '            </h3>\n' +
                      '            <p>If you do not receive an email soon ensure that the email is valid and that you can receive emails\n' +
                      '              from amitabh@ampdigital.co. Contact amitabh@ampdigital.co for additional assistance.</p></div>');
              }
              console.log(response);
          });
      } else {
          alert("Please fill the recaptcha");
      }
  });


  $('body').removeClass('d-none');
  //setup before functions
  var typingTimer; //timer identifier
  var doneTypingInterval = 1000; //time in ms, 5 second for example
  var $input = $('.couponcode2, .couponcode3, .couponcode2loginform');
  var $input2;

  $('input[name=couponcode]').val('FREEDOM75');
  $('.originalprice').removeClass('d-none')
  doneTyping();

  function doneTyping() {
      let $input2 = $('input[name=couponcode]');
      if ($input2.val() == "") {
          $("input[name*='studentcheckbox']").removeAttr('disabled');
      }
      $.ajax({
          type: "GET",
          url: '/payments/isvalidcoupon2?couponcode=' + $input2.val(),
          success: function(result) {
              var price = width;
              if (result !== false) {
                  if (result.type == "referralcode") {
                      price = (price) / 1.18 - (.2 * (price) / 1.18);
                      price = price + .18 * price;
                      price = Math.round(price);
                  } else if (result.type == "amount") {
                      price = price - result.discount;
                  } else {
                      price = price - price * result.discount / 100
                  }
                  $('.courseprice, .courseprice3').html('₹' + price).removeClass('d-none');
                  $("input[name*='studentcheckbox']").attr("disabled", true)
                  $('.discountmessage').html('<span style="color:green; font-size: small">Coupon applied</span>').removeClass('d-none');
              } else {
                  $('.courseprice, .courseprice3').html('₹' + width)
                  $("input[name*='studentcheckbox']").removeAttr('disabled').removeClass('d-none');
                  $('.discountmessage').html('<span style="color:red; font-size: small">Coupon invalid</span>').removeClass('d-none');
              }
          }
      });
      //do something
  }


  var timer = null;
  $('.emailsignup').keydown(function() {
      clearTimeout(timer);
      timer = setTimeout(doStuff, 1000)
  });

  function doStuff() {
      let emailvalue = $('.emailsignup').val();
      $.ajax({
          type: "GET",
          url: '/userexistsindatabase?email=' + emailvalue + "&password=" + 'aehgipahg' + "&courseid="+course_id,
          success: function(result) {
              if (result == 3) {
                  // $(".form-check-input3").click();
                  // $( "input[name*='studentcheckbox']" ).prop('checked', true)
                  $.alert('You already have an account associated with this email address. Kindly login through it.')
                  $('.paymentsignupform, .paymentloginform').toggleClass('d-none');
                  $('.emailloginform').val($('.emailvalue').val());
                  // $('.passwordloginform').val($('.passwordvalue').val());
                  $('.couponcode2loginform').val($('.couponcode2').val());
              }
          }
      });
  }
  $input.on('keyup', function() {
      clearTimeout(typingTimer);
      $input2 = $(this);
      typingTimer = setTimeout(doneTyping, doneTypingInterval);
  });

  //on keydown, clear the countdown 
  $input.on('keydown', function() {
      clearTimeout(typingTimer);
  });


  //user is "finished typing," do something


  $('.list-group-item').on('click', function(e) {
      e.preventDefault();
  })

  function getUrlVars() {
      var vars = [],
          hash;
      var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
      for (var i = 0; i < hashes.length; i++) {
          hash = hashes[i].split('=');
          vars.push(hash[0]);
          vars[hash[0]] = hash[1];
      }
      return vars;
  }

  if (typeof getUrlVars()['payment'] !== 'undefined' && getUrlVars()['payment'] == "true") {
      var price = width;
      var discount = 0;
      var coupontype = "couponcode";
      var offertoparticipant = 0;
      var participantname = "";
      var email = $('.enrollnow').data('paymentemail');
      var name = $('.enrollnow').data('paymentname');
      var phone = $('.enrollnow').data('paymentphone');
      var couponcode = $('.enrollnow').data('paymentcouponcode');
      if (typeof getUrlVars()['couponcode'] !== 'undefined' && getUrlVars()['couponcode'] !== "") {
          couponcode = getUrlVars()['couponcode'];
      }
      couponcodeexists = false;
      if (getUrlVars()['enrolled'] == "true") {
          return;
      }
      var puserid = $('.enrollnow').data('paymentuser_id');
      $('.paymentgatewayprocessing').html('<div class="container row justify-content-center align-items-center h-100"> <h2 style="color: white;" class="ml-5">Redirecting you to payments page ... <i class="fa fa-spin fa-spinner"></i> </h2> </div>').removeClass('d-none');
      $('header, footer, .breadcrumb-area, .course-details-area').remove();
      console.log("111");
      console.log(price);
      $.ajax({
          type: "GET",
          url: '/payments/isvalidcoupon2?couponcode=' + couponcode,
          success: function(result) {
              console.log("success");
              if (result !== false) {
                  if (result.type == "referralcode") {
                      coupontype = result.type;
                      discount = price * result.offertoenrollment / 100;
                      offertoparticipant = result.offertoparticipant;
                      participantname = result.participantname;

                      price = (price) / 1.18 - (.2 * (price) / 1.18);
                      price = price + .18 * price;
                      price = Math.round(price);
                  } else if (result.type == "amount") {
                      discount = result.discount;
                      price = price - discount;
                  } else {
                      discount = price * result.discount / 100;
                      price = price - discount;
                  }
                  couponcodeexists = true;
              } else {
                  price = width;
              }
              var user_id = puserid + '_'+course_id;

              if (getUrlVars()['enrolled'] !== "true" && email !== '') {
                  console.log("success2");

                  if (getUrlVars()['studentcheckbox'] == "true") {
                      price = price / 2;
                  }

                  const data = {
                      purpose: course_name,
                      amount: price,
                      buyer_name: name,
                      email: email,
                      coupontype: coupontype,
                      couponcodeapplied: couponcodeexists == true ? "yes" : "no",
                      couponcode: couponcodeexists == true ? couponcode : "",
                      discount: discount,
                      offertoparticipant: offertoparticipant,
                      participant: participantname,
                      phone: phone,
                      user_id: user_id,
                      redirect_url: `${window.location.origin}/payments/callback?user_id=${user_id}`,
                      webhook_url: '/webhook/',
                  };

                  console.log(data);


                  $.ajax({
                      type: "POST",
                      url: '/payments/requestpaymenttest',
                      data: data,
                      success: function(result) {
                          console.log("yahaahaeigpaehg")
                          console.log(result);
                          if (result.success == false) {
                              if (result.message && result.message.phone) {
                                  $.alert('Please enter a valid phone number');
                                  setTimeout(() => {
                                      window.location.href = '/courses/'+course_url;
                                  }, 3000);
                              } else {
                                  $.alert(JSON.stringify(result.message).toString());
                                  setTimeout(() => {
                                      window.location.href = '/courses/'+course_url;
                                  }, 3000);
                              }
                          } else {
                              window.location.href = result;
                          }
                      }
                  });
              }
          }
      });
  }

  $('.loginbtn').on('click', function(e) {
      e.preventDefault();
      $('#paymentCreateAccount').modal('toggle');
      $('#paymentLoginModal').modal('toggle');
  })

  $('.enrollnow').on('click', function(e) {
      e.preventDefault();
      var emailvalue = $('.emailvalue').val();
      var passwordvalue = $('.passwordvalue').val();
      var couponcode_el = $('.couponcode2');
      var coursedetails_el = $('.course-details');
      var enrollnow_el = $('.enrollnow');
      var studentcheckbox = $("input[name*='studentcheckbox']:checked").val();
      var studentcheckboxparam = "";
      if (typeof studentcheckboxparam !== "undefined" && studentcheckbox && studentcheckbox == "on") {
          studentcheckboxparam = "&studentcheckbox=true"
      }
      var relatedcourses_el = $('.related-courses');
      var paymentform_el = $('#paymentform');
      if ($("[type=checkbox]:checked").length == 1) {
          if ($(this).data('formtype') == 'loggedin') {
              if ($('.couponcode3').val() !== '') {
                  $.ajax({
                      type: "GET",
                      url: '/payments/isvalidcoupon2?couponcode=' + $('.couponcode3').val(),
                      success: function(result) {
                          if (result !== false) {
                              window.location.href = window.location.origin + '/courses/'+course_url+'?payment=true&couponcode=' + $('.couponcode3').val() + studentcheckboxparam;
                          }
                      }
                  });
              } else {
                  window.location.href = window.location.origin + '/courses/'+course_url+'?payment=true' + studentcheckboxparam;
              }
          } else if ($(this).data('formtype') == 'notloggedinaccountexists') {
              $.ajax({
                  type: "GET",
                  url: '/userexistsindatabase?email=' + $('.emailloginform').val() + "&password=" + $('.passwordloginform').val() + "&courseid="+course_id,
                  success: function(result) {
                      if (result == 3) {
                          $.alert('Invalid Password');
                          return;
                      } else if (result == 4) {
                          // $.alert('Already enrolled');
                          $.confirm({
                              title: 'Already enrolled!',
                              content: 'You are already enrolled in this course!',
                              buttons: {
                                  'Start Learning': function() {
                                      window.location.href = '/dashboard/'+course_url
                                      // here the button key 'hey' will be used as the text.
                                      // $.alert('You clicked on "hey".');
                                  }
                              }
                          });
                          return;
                      } else if (result == 2) {
                          if (studentcheckbox == "on") {
                              $(".studentcheckbox2").val('on');
                          }
                          $('#emaillogin').val($('.emailloginform').val());
                          $('#passwordlogin').val($('.passwordloginform').val());
                          $('input[name=couponcode]').val(couponcode_el.val());
                          $('.paymentlogin').submit();
                      }
                  }
              });
              if ($('.couponcode3').val() !== '') {
                  $.ajax({
                      type: "GET",
                      url: '/payments/isvalidcoupon2?couponcode=' + $('.couponcode3').val(),
                      success: function(result) {
                          if (result !== false) {
                              window.location.href = window.location.origin + '/courses/'+course_url+'?payment=true&couponcode=' + $('.couponcode3').val();
                          }
                      }
                  });
              } else {
                  window.location.href = window.location.origin + '/courses/'+course_url+'?payment=true';
              }
          } else if ($(this).data('formtype') == 'loginsignup') {
              $.ajax({
                  type: "GET",
                  url: '/userexistsindatabase?email=' + $('.emailloginform').val() + "&password=" + $('.passwordloginform').val() + "&courseid="+course_id,
                  success: function(result) {
                      if (result == 3) {
                          $.alert('Invalid Password');
                          return;
                      } else if (result == 2) {
                          $('#emaillogin').val($('.emailloginform').val());
                          $('#passwordlogin').val($('.passwordloginform').val());
                          $('#couponcodelogin').val(couponcode_el.val());
                          $('.paymentlogin').submit();
                      }
                      else if(result == 4){
                        $.confirm({
                            title: 'Already enrolled!',
                            content: 'You are already enrolled in this course!',
                            buttons: {
                                'Start Learning': function() {
                                    window.location.href = '/dashboard/'+course_url
                                    // here the button key 'hey' will be used as the text.
                                    // $.alert('You clicked on "hey".');
                                }
                            }
                        });
                      }
                  }
              });
              if ($('.couponcode3').val() !== '') {
                  $.ajax({
                      type: "GET",
                      url: '/payments/isvalidcoupon2?couponcode=' + $('.couponcode3').val(),
                      success: function(result) {
                          if (result !== false) {
                              window.location.href = window.location.origin + '/courses/'+course_url+'?payment=true&couponcode=' + $('.couponcode3').val();
                          }
                      }
                  });
              } else {
                  window.location.href = window.location.origin + '/courses/'+course_url+'?payment=true';
              }
          } else if ($(this).data('formtype') == 'login') {
              if ($('.couponcode2loginform').val() !== '') {
                  $.ajax({
                      type: "GET",
                      url: '/payments/isvalidcoupon2?couponcode=' + $('.couponcode2loginform').val(),
                      success: function(result) {
                          if (result !== false) {
                              window.location.href = window.location.origin + '/courses/'+course_url+'?payment=true&couponcode=' + $('.couponcode2loginform').val();
                          }
                      }
                  });
              } else {
                  window.location.href = window.location.origin + '/courses/'+course_url+'?payment=true';
              }
          } else if ($(this).data('formtype') == 'signup') {
              $.ajax({
                  type: "GET",
                  url: '/userexistsindatabase?email=' + emailvalue + "&password=" + passwordvalue + "&courseid="+course_id,
                  success: function(result) {
                      if (result == false) {
                          if ($('.namevalue').val() == '') {
                              $.alert('Name cannot be empty');
                          } else if ($('.lastnamevalue').val() == '') {
                              $.alert('Last name cannot be empty');
                          } else if ($('.emailvalue').val() == '') {
                              $.alert('Email cannot be empty');
                          } else if ($('#phonenumber').val() == '') {
                              $.alert('Phone cannot be empty');
                          } else if ($('.passwordvalue').val() == '') {
                              $.alert('Password cannot be empty');
                          } else if ($('.repasswordvalue').val() == '') {
                              $.alert('Re-password cannot be empty');
                          } else if ($('.passwordvalue').val() !== $('.repasswordvalue').val()) {
                              $.alert("Passwords don't match. Kindly try again.");
                          } else {
                              paymentform_el.submit();
                          }
                      } else {
                          if (result == 2) {
                              $('#emaillogin').val(emailvalue);
                              $('#passwordlogin').val(passwordvalue);
                              $('#couponcodelogin').val(couponcode_el.val());
                              $('.paymentlogin').submit();
                          } else if (result == 1) {
                              $('#emaillogin').val(emailvalue);
                              $('#passwordlogin').val(passwordvalue);
                              $('#alreadyenrolled').val("enrolled");
                              $('.paymentlogin').submit();
                          } else if (result == 3) {
                              $(".form-check-input3").click();
                              $("input[name*='studentcheckbox']").prop('checked', true)
                              $.alert('You already have an account associated with this email address. Kindly login through it.')
                              $('.paymentsignupform, .paymentloginform').toggleClass('d-none');
                              $('.emailloginform').val($('.emailvalue').val());
                              // $('.passwordloginform').val($('.passwordvalue').val());
                              $('.couponcode2loginform').val($('.couponcode2').val());
                          }
                      }
                  }
              });
          } else {
              if ($('.passwordloginform').val() == '') {
                  $.alert('Kindly fill password');
              } else {
                  $('#paymentform2').submit();
              }
          }
      } else {
          $.alert("Kindly agree to terms and conditions")
      }
  })
});

(function(b, o, i, l, e, r) {
  b.GoogleAnalyticsObject = l;
  b[l] || (b[l] =
      function() {
          (b[l].q = b[l].q || []).push(arguments)
      });
  b[l].l = +new Date;
  e = o.createElement(i);
  r = o.getElementsByTagName(i)[0];
  e.src = '//www.google-analytics.com/analytics.js';
  r.parentNode.insertBefore(e, r)
}(window, document, 'script', 'ga'));
ga('create', 'UA-XXXXX-X');
ga('send', 'pageview');