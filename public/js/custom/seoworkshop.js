$(document).ready(function () {
  var width = $("#firstsection").data("sectionwidth");
  function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") {
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
    $(".couponcode2, .couponcode3").val(referralcode).prop("readonly", true);
    $.ajax({
      type: "GET",
      url: "/payments/isvalidcoupon3?couponcode=" + referralcode,
      success: function (result) {
        var price = width;
        if (result !== false) {
          if (result !== false) {
            if (result.type == "referralcode") {
              price = price / 1.18 - (0.1 * price) / 1.18;
              price = price + 0.18 * price;
              price = Math.round(price);
            } else if (result.type == "amount") {
              price = price - result.discount;
            } else {
              price = price - (price * result.discount) / 100;
            }
            $(".courseprice, .courseprice3").html(price);
            $(".discountmessage").html(
              '<span style="color:green; font-size: small">Coupon applied</span>',
            );
          } else if (result.type == "amount") {
            price = price - result.discount;
          } else {
            price = price - (price * result.discount) / 100;
          }
          $(".courseprice, .courseprice3").html(price);
          $(".discountmessage").html(
            `<span style="color:green; font-size: small">Referral Code ${referralcode} applied</span>`,
          );
        } else {
          $(".courseprice, .courseprice3").html(width);
          $(".discountmessage").html(
            `<span style="color:red; font-size: small">Referral Code ${referralcode} invalid</span>`,
          );
        }
      },
    });
  }

  function Utils() {}

  Utils.prototype = {
    constructor: Utils,
    isElementInView: function (element, fullyInView) {
      var pageTop = $(window).scrollTop();
      var pageBottom = pageTop + $(window).height();
      var elementTop = $(element).offset().top;
      var elementBottom = elementTop + $(element).height();

      if (fullyInView === true) {
        return pageTop < elementTop && pageBottom > elementBottom;
      } else {
        return elementTop <= pageBottom && elementBottom >= pageTop;
      }
    },
  };

  var Utils = new Utils();

  $(".image-container").on("click", function () {
    $("#myModal").modal("toggle");
    var el = $(this).data("img");
    $(".imgsrc").attr("src", el);
  });

  $(window).scroll(function () {
    if (Utils.isElementInView($("#programhighlights"), false)) {
      console.log("in viewaeg");
      $(".nav-item-scroll").removeClass("active");
      $(".programhighlights").addClass("active");
    } else if (Utils.isElementInView($("#sessiondetails"), false)) {
      console.log("in viewsession");
      $(".nav-item-scroll").removeClass("active");
      $(".sessiondetails").addClass("active");
    } else if (Utils.isElementInView($("#certificate"), false)) {
      console.log("Aegaegaeg");
      console.log("in view");
      $(".nav-item-scroll").removeClass("active");
      $(".certificate").addClass("active");
    } else if (Utils.isElementInView($("#rationale"), false)) {
      console.log("in view");
      $(".nav-item-scroll").removeClass("active");
      $(".rationale").addClass("active");
    } else if (Utils.isElementInView($("#teachers"), false)) {
      console.log("in view");
      $(".nav-item-scroll").removeClass("active");
      $(".teachers").addClass("active");
    } else if (Utils.isElementInView($("#testimonials"), false)) {
      console.log("in view");
      $(".nav-item-scroll").removeClass("active");
      $(".testimonialscls").addClass("active");
    } else if (Utils.isElementInView($("#faqs"), false)) {
      console.log("in view");
      $(".nav-item-scroll").removeClass("active");
      $(".faqscls").addClass("active");
    } else {
      console.log("out of view");
    }

    var height = $(window).scrollTop();

    if (height > 100) {
      $(".fixed-top").addClass("show-me").removeClass("hiddennav");
    } else {
      $(".fixed-top").removeClass("show-me").addClass("hiddennav");
    }
  });

  $(".nav-link-scroll").click(function (e) {
    e.preventDefault();
    var el = $(this).data("href");
    $("html, body").animate(
      {
        scrollTop: $("#" + el).offset().top,
      },
      500,
    );
  });
  var batchdate = "";
  var swiper = new Swiper(".swiper-container", {
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

  $(".avatar-img, .avatar-img-spinner").toggleClass("d-none");
  $(".forgotpasswordbutton").on("click", function (e) {
    e.preventDefault();
    $("#paymentform2").addClass("d-none");
    $(".forgotpasswordform").removeClass("d-none");
    $(".loginpaneltitle").html("Forgot Password");
  });

  $(".alreadyaccount").on("click", function (e) {
    e.preventDefault();
    $("#loginModal").modal("toggle");
    $("#createAccount").modal("toggle");
  });

  $(".loginformbutton").on("click", function (e) {
    e.preventDefault();
    $("#paymentform2").removeClass("d-none");
    $(".forgotpasswordform").addClass("d-none");
    $(".loginpaneltitle").html("Login & Subscribe");
  });

  $(".forgotpasswordform").on("submit", function (e) {
    // $(this).children('button').attr('disabled', 'disabled');
    e.preventDefault();
    var email = $("#forgotpasswordemail").val();
    var captcharesponse = false;
    var formData = $(".forgotpasswordform")
      .serializeArray()
      .reduce(function (obj, item) {
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
        url: "/users/forgotpassword",
        data: { email: email, captcharesponse: captcharesponse },
      }).done(function (response) {
        if (response == -1) {
          alert("Recaptcha");
        }
        if (response._id) {
          $("#loginModal").modal("toggle");
          $.alert(
            '<div class="text-center"> <i style="font-size: 75px;" class="fab fa-plane color-primary"></i>\n' +
              "            <h3>\n" +
              "              Instructions on resetting your password are on their way!\n" +
              "            </h3>\n" +
              "            <p>If you do not receive an email soon ensure that the email is valid and that you can receive emails\n" +
              "              from amitabh@ampdigital.co. Contact amitabh@ampdigital.co for additional assistance.</p></div>",
          );
        }
        console.log(response);
      });
    } else {
      alert("Please fill recaptcha");
    }
  });

  $("body").removeClass("d-none");
  //setup before functions
  var typingTimer; //timer identifier
  var doneTypingInterval = 1000; //time in ms, 5 second for example
  var $input = $(".couponcode2, .couponcode3");

  //on keyup, start the countdown
  $input.on("keyup", function () {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTyping, doneTypingInterval);
  });

  //on keydown, clear the countdown
  $input.on("keydown", function () {
    clearTimeout(typingTimer);
  });

  //user is "finished typing," do something
  function doneTyping() {
    if ($input.val() == "COFFEEHOURS") {
      var price = width;
      price = price / 1.18 - (0.1 * price) / 1.18;
      price = price + 0.18 * price;
      price = Math.round(price);
      $(".courseprice, .courseprice3").html(price);
      $(".discountmessage").html(
        '<span style="color:green; font-size: small">Coupon applied</span>',
      );
    } else {
      $.ajax({
        type: "GET",
        url: "/payments/isvalidcoupon3?couponcode=" + $input.val(),
        success: function (result) {
          var price = width;
          if (result !== false) {
            if (result.type == "referralcode") {
              price = price / 1.18 - (0.1 * price) / 1.18;
              price = price + 0.18 * price;
              price = Math.round(price);
            } else if (result.type == "amount") {
              price = price - result.discount;
            } else {
              price = price - (price * result.discount) / 100;
            }
            $(".courseprice, .courseprice3").html(price);
            $(".discountmessage").html(
              '<span style="color:green; font-size: small">Coupon applied</span>',
            );
          } else {
            $(".courseprice, .courseprice3").html(width);
            $(".discountmessage").html(
              '<span style="color:red; font-size: small">Coupon invalid</span>',
            );
          }
        },
      });
    }
    //do something
  }

  $(".list-group-item").on("click", function (e) {
    e.preventDefault();
  });

  function getUrlVars() {
    var vars = [],
      hash;
    var hashes = window.location.href
      .slice(window.location.href.indexOf("?") + 1)
      .split("&");
    for (var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split("=");
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  }

  if (
    typeof getUrlVars()["payment"] !== "undefined" &&
    getUrlVars()["payment"] == "true"
  ) {
    var batchdate = getUrlVars()["batchdate"];
    var price = width;
    var discount = 0;
    var coupontype = "couponcode";
    var offertoparticipant = 0;
    var participantname = "";
    var email = $(".enrollnow").data("paymentemail");
    var name = $(".enrollnow").data("paymentname");
    var phone = $(".enrollnow").data("paymentphone");
    var couponcode = $(".enrollnow").data("paymentcouponcode");
    if (
      typeof getUrlVars()["couponcode"] !== "undefined" &&
      getUrlVars()["couponcode"] !== ""
    ) {
      couponcode = getUrlVars()["couponcode"];
    }
    couponcodeexists = false;
    if (getUrlVars()["enrolled"] == "true") {
      return;
    }
    var puserid = $(".enrollnow").data("paymentuser_id");
    $(".course-details").before(
      '<h2 class="ml-5">Redirecting you to payments page ... <i class="fa fa-spin fa-spinner"></i> </h2>',
    );
    $(".related-courses, footer").remove();
    if (couponcode == "COFFEEHOURS") {
      price = price / 1.18 - (0.1 * price) / 1.18;
      price = price + 0.18 * price;
      price = Math.round(price);
      couponcodeexists = true;
    } else {
      $.ajax({
        type: "GET",
        url: "/payments/isvalidcoupon3?couponcode=" + couponcode,
        success: function (result) {
          if (result !== false) {
            if (result.type == "referralcode") {
              alert("1");
              coupontype = result.type;
              discount = (price * result.offertoenrollment) / 100;
              offertoparticipant = result.offertoparticipant;
              participantname = result.participantname;
              price = price / 1.18 - (0.1 * price) / 1.18;
              price = price + 0.18 * price;
              price = Math.round(price);
            } else if (result.type == "amount") {
              alert("2");
              discount = result.discount;
              price = price - discount;
              alert(discount);
              alert(price);
            } else {
              discount = (price * result.discount) / 100;
              price = price - discount;
              alert("3");
              alert(discount);
              alert(price);
            }
            couponcodeexists = true;
          }
          var user_id = puserid + "_5f62ecff258cf800145b71e4";

          if (getUrlVars()["enrolled"] !== "true" && email !== "") {
            const data = {
              purpose: "SEO Workshop",
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
              redirect_url: `${window.location.origin}/callback?user_id=${user_id}&batchdate=${batchdate}`,
              webhook_url: "/webhook/",
            };

            $.ajax({
              type: "POST",
              url: "/requestpayment",
              data: data,
              success: function (result) {
                console.log(result);
                if (result == -1) {
                  $.confirm({
                    title: "Invalid Referral Code!",
                    content: " You cannot use your own referral code.!",
                    buttons: {
                      somethingElse: {
                        text: "Okay take me back to enrollment form",
                        btnClass: "btn-blue",
                        action: function () {
                          window.location.href =
                            window.location.origin + "/courses/seo-workshop";
                        },
                      },
                    },
                  });
                } else if (result == "Invalid Phone") {
                  setTimeout(function () {
                    window.location.href =
                      window.location.origin + "/courses/seo-workshop";
                  }, 2000);
                } else {
                  window.location.href = result;
                }
              },
            });
          }
        },
      });
    }
  }

  $(".loginbtn").on("click", function (e) {
    e.preventDefault();
    $("#paymentCreateAccount").modal("toggle");
    $("#paymentLoginModal").modal("toggle");
  });

  $(".enrollnow").on("click", function (e) {
    e.preventDefault();
    var emailvalue = $(".emailvalue").val();
    var passwordvalue = $(".passwordvalue").val();
    var couponcode_el = $(".couponcode2");
    var coursedetails_el = $(".course-details");
    var enrollnow_el = $(".enrollnow");
    var relatedcourses_el = $(".related-courses");
    var paymentform_el = $("#paymentform");
    if ($(".form-check-input:checked").length == 1) {
      if ($(this).data("formtype") == "loggedin") {
        batchdate = $(".batchdatevalueloggedin").val();
        if (
          typeof batchdate == "undefined" ||
          batchdate == "" ||
          batchdate == null
        ) {
          $.alert("Kindly fill batchdate");
        } else if ($(".couponcode3").val() !== "") {
          $.ajax({
            type: "GET",
            url:
              "/payments/isvalidcoupon3?couponcode=" + $(".couponcode3").val(),
            success: function (result) {
              if (result !== false) {
                window.location.href =
                  window.location.origin +
                  "/courses/seo-workshop?batchdate=" +
                  batchdate +
                  "&payment=true&couponcode=" +
                  $(".couponcode3").val();
              }
            },
          });
        } else {
          window.location.href =
            window.location.origin +
            "/courses/seo-workshop?batchdate=" +
            batchdate +
            "&payment=true";
        }
      }
      if ($(this).data("formtype") == "login") {
        batchdate = $(".batchdatevalue").val();
        if (
          typeof batchdate == "undefined" ||
          batchdate == "" ||
          batchdate == null
        ) {
          $.alert("Kindly fill batchdate");
        } else {
          $.ajax({
            type: "GET",
            url:
              "/userexistsindatabase?email=" +
              $(".emailloginform").val() +
              "&password=" +
              $(".passwordloginform").val() +
              "&courseid=5f62ecff258cf800145b71e4",
            success: function (result) {
              if (result == 3) {
                $.alert("Invalid Password");
                return;
              } else if (result == 2) {
                $("#emaillogin").val($(".emailloginform").val());
                $("#passwordlogin").val($(".passwordloginform").val());
                $("#couponcodelogin").val(couponcode_el.val());
                $("#paymentform2").submit();
              }
            },
          });
        }
      } else if ($(this).data("formtype") == "signup") {
        batchdate = $(".batchdatevaluesignupform").val();
        if (
          typeof batchdate == "undefined" ||
          batchdate == "" ||
          batchdate == null
        ) {
          $.alert("Kindly fill batchdate");
        } else {
          $.ajax({
            type: "GET",
            url:
              "/userexistsindatabase?email=" +
              emailvalue +
              "&password=" +
              passwordvalue +
              "&courseid=5f62ecff258cf800145b71e4",
            success: function (result) {
              if (result == false) {
                if ($(".namevalue").val() == "") {
                  $.alert("Name cannot be empty");
                } else if ($(".lastnamevalue").val() == "") {
                  $.alert("Last name cannot be empty");
                } else if ($(".emailvalue").val() == "") {
                  $.alert("Email cannot be empty");
                } else if ($("#phonenumber").val() == "") {
                  $.alert("Phone cannot be empty");
                } else if ($(".passwordvalue").val() == "") {
                  $.alert("Password cannot be empty");
                } else if ($(".repasswordvalue").val() == "") {
                  $.alert("Re-password cannot be empty");
                } else if (
                  $(".passwordvalue").val() !== $(".repasswordvalue").val()
                ) {
                  $.alert("Passwords don't match. Kindly try again.");
                } else {
                  paymentform_el.submit();
                }
              } else {
                if (result == 2) {
                  $("#emaillogin").val(emailvalue);
                  $("#passwordlogin").val(passwordvalue);
                  $("#couponcodelogin").val(couponcode_el.val());
                  $(".paymentlogin").submit();
                } else if (result == 1) {
                  $("#emaillogin").val(emailvalue);
                  $("#passwordlogin").val(passwordvalue);
                  $("#alreadyenrolled").val("enrolled");
                  $(".paymentlogin").submit();
                } else if (result == 3) {
                  $(".form-check-input2").click();
                  $.alert(
                    "You already have an account associated with this email address. Kindly login through it.",
                  );
                  $(".paymentsignupform, .paymentloginform").toggleClass(
                    "d-none",
                  );
                  $(".emailloginform").val($(".emailvalue").val());
                  // $('.passwordloginform').val($('.passwordvalue').val());
                  $(".couponcode2loginform").val($(".couponcode2").val());
                }
              }
            },
          });
        }
      } else {
        if ($(".passwordloginform").val() == "") {
          $.alert("Kindly fill password");
        } else {
          $("#paymentform2").submit();
        }
      }
    } else {
      $.alert("Kindly agree to terms and conditions");
    }
  });
});

(function (b, o, i, l, e, r) {
  b.GoogleAnalyticsObject = l;
  b[l] ||
    (b[l] = function () {
      (b[l].q = b[l].q || []).push(arguments);
    });
  b[l].l = +new Date();
  e = o.createElement(i);
  r = o.getElementsByTagName(i)[0];
  e.src = "//www.google-analytics.com/analytics.js";
  r.parentNode.insertBefore(e, r);
})(window, document, "script", "ga");
ga("create", "UA-XXXXX-X");
ga("send", "pageview");
