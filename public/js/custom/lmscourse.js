$(document).ready(function () {
  $(".dropdown-menu .category-column .nav-link").on("mouseover", function () {
    // alert($(this).data('target'));
    let courseColumn = $(this).data("target");
    $(".course-column").addClass("d-none");
    $("." + courseColumn).removeClass("d-none");
    $(".dropdown-menu .category-column li").removeClass("showhov");
    $(this).parent("li").addClass("showhov");
  });
  // $('.dropdown-menu .nav-link').on('mouseout', function(){
  //    $(this).parent('li').removeClass('showhov')
  // })
  // executes when HTML-Document is loaded and DOM is ready

  // breakpoint and up
  $(window).resize(function () {
    if ($(window).width() >= 980) {
      // when you hover a toggle show its dropdown menu
      $(".navbar .dropdown-toggle").hover(function () {
        $(this).parent().toggleClass("show");
        $(this).parent().find(".dropdown-menu").toggleClass("show");
      });

      // hide the menu when the mouse leaves the dropdown
      $(".navbar .dropdown-menu").mouseleave(function () {
        $(this).removeClass("show");
      });

      // do something here
    }
  });
  var course_url = $("body").data("course_url");
  var course_live = $("body").data("course_live");
  var course_name = $("body").data("course_name");
  var course_id = $("body").data("course_id");
  var timer = null;

  $(".nav-item-scroll").on("click", function () {
    let scrollto = $(this).data("scrollto");
    $("html, body").animate({
      scrollTop: $("#" + scrollto).offset().top,
    });
  });

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

  $(window).scroll(function () {
    if (Utils.isElementInView($("#coursefeatures"), false)) {
      $(".nav-item-scroll").removeClass("course-navbar-active");
      $(".coursefeatures").addClass("course-navbar-active");
    } else if (Utils.isElementInView($("#topicsyouwilllearn"), false)) {
      $(".nav-item-scroll").removeClass("course-navbar-active");
      $(".topicsyouwilllearn").addClass("course-navbar-active");
    } else if (Utils.isElementInView($("#platforms"), false)) {
      $(".nav-item-scroll").removeClass("course-navbar-active");
      $(".platforms").addClass("course-navbar-active");
    } else if (Utils.isElementInView($("#projects"), false)) {
      $(".nav-item-scroll").removeClass("course-navbar-active");
      $(".projects").addClass("course-navbar-active");
    } else if (Utils.isElementInView($("#leadinstructor"), false)) {
      $(".nav-item-scroll").removeClass("course-navbar-active");
      $(".leadinstructor").addClass("course-navbar-active");
    } else if (Utils.isElementInView($("#certification"), false)) {
      $(".nav-item-scroll").removeClass("course-navbar-active");
      $(".certification").addClass("course-navbar-active");
    } else if (Utils.isElementInView($("#testimonials"), false)) {
      $(".nav-item-scroll").removeClass("course-navbar-active");
      $(".testimonials").addClass("course-navbar-active");
    } else if (Utils.isElementInView($("#faqs"), false)) {
      $(".nav-item-scroll").removeClass("course-navbar-active");
      $(".faqs").addClass("course-navbar-active");
    } else {
      console.log("out of view");
    }

    var height = $(window).scrollTop();
    console.log(height);
    if (height > 100) {
      $(".site-navbar").addClass("d-none");
    } else {
      $(".site-navbar").removeClass("d-none");
    }
    if (height > 785) {
      $(".course-navbar").removeClass("d-none");
    } else {
      $(".course-navbar").addClass("d-none");
    }
  });

  // Call the async function
  fetchData();

  // Call the async function
  fetchFaqs();

  var width = parseInt($(".navbar").data("discounted_price"));

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
      url: "/payments/isvalidcoupon2?couponcode=" + referralcode,
      success: function (result) {
        var price = $("#studentcheckbox").checked ? 2000 : 4000;
        if (result !== false) {
          if (result.type == "referralcode") {
            price = price / 1.18 - (0.2 * price) / 1.18;
            price = price + 0.18 * price;
            price = Math.round(price);
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

  $("body").removeClass("d-none");
  //setup before functions
  var typingTimer; //timer identifier
  var doneTypingInterval = 1000; //time in ms, 5 second for example
  var $input = $(".couponcode2, .couponcode3, .couponcode2loginform");

  $("input[name=couponcode]").val("FREEDOM75");
  $(".originalprice").removeClass("d-none");
  validateCouponAndApplyDiscount();

  async function validateCouponAndApplyDiscount() {
    let $input2 = $("input[name=couponcode]");

    if ($input2.val() == "") {
      $("input[name*='studentcheckbox']").removeAttr("disabled");
    }

    try {
      const response = await fetch(
        `/payments/isvalidcoupon2?couponcode=${$input2.val()}`,
      );
      const result = await response.json();

      var price = width;

      if (result !== false) {
        if (result.type == "referralcode") {
          price = price / 1.18 - (0.2 * price) / 1.18;
          price = price + 0.18 * price;
          price = Math.round(price);
        } else if (result.type == "amount") {
          price = price - result.discount;
        } else {
          price = price - (price * result.discount) / 100;
        }

        $(".courseprice, .courseprice3")
          .html(`₹${price}`)
          .removeClass("d-none");
        $("input[name*='studentcheckbox']").attr("disabled", true);
        $(".discountmessage")
          .html(
            '<span style="color:green; font-size: small">Coupon applied</span>',
          )
          .removeClass("d-none");
      } else {
        $(".courseprice, .courseprice3").html(`₹${width}`);
        $("input[name*='studentcheckbox']")
          .removeAttr("disabled")
          .removeClass("d-none");
        $(".discountmessage")
          .html(
            '<span style="color:red; font-size: small">Coupon invalid</span>',
          )
          .removeClass("d-none");
      }
    } catch (error) {
      console.error("Error during coupon validation:", error);
      // Handle the error as needed
    }

    // Do something after the AJAX call
  }

  async function fetchData() {
    try {
      const response = await fetch("/courses/topics/" + course_url);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const courseinfo = await response.text();
      $(".accordiondata").html(courseinfo);

      $(".accordiondata .popup-youtube").magnificPopup({
        type: "iframe",
        mainClass: "mfp-fade",
        removalDelay: 160,
        preloader: false,
        fixedContentPos: false,
      });
    } catch (error) {
      console.error("Error fetching course information:", error);
    }
  }

  async function fetchFaqs() {
    const courseId =
      course_id === "6057fde1af237d00148162de"
        ? "5ba67703bda6d500142e2d15"
        : course_id;

    try {
      const response = await fetch("/courses/faqs/" + courseId);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const faqs = await response.text();
      $(".accordionfaq").html(faqs);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    }
  }

  function checkEmailExistsAlready() {
    let emailvalue = $(".emailsignup").val();
    $.ajax({
      type: "GET",
      url:
        "/userexistsindatabase?email=" +
        emailvalue +
        "&password=" +
        "aehgipahg" +
        "&courseid=" +
        course_id,
      success: function (result) {
        if (result == 3) {
          // $(".form-check-input3").click();
          // $( "input[name*='studentcheckbox']" ).prop('checked', true)
          $.alert(
            "You already have an account associated with this email address. Kindly login through it.",
          );
          $(".paymentsignupform, .paymentloginform").toggleClass("d-none");
          $(".emailloginform").val($(".emailvalue").val());
          // $('.passwordloginform').val($('.passwordvalue').val());
          $(".couponcode2loginform").val($(".couponcode2").val());
        }
      },
    });
  }

  // Function to extract URL parameters and return them as an object
  function getUrlVars() {
    var vars = [],
      hash;

    // Split the URL into an array of key-value pairs
    var hashes = window.location.href
      .slice(window.location.href.indexOf("?") + 1)
      .split("&");

    // Iterate through the key-value pairs and store them in the 'vars' array
    for (var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split("=");
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }

    // Return the object containing URL parameters
    return vars;
  }

  // Async function to fetch user data based on user ID
  async function getUserData(puserid) {
    try {
      // Make a fetch request to the server to get user data
      const response = await fetch(`/getuserfromid?id=${puserid}`);

      // Check if the response status is OK
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Parse the JSON response
      const userData = await response.json();

      // Return the user data
      return userData;
    } catch (error) {
      // Handle errors by logging and returning null
      console.error("Error fetching user data:", error);
      return null; // or handle the error in a way that makes sense for your application
    }
  }

  // Function to initiate payment process
  async function initiatePayment() {
    console.log("__________nice");
    
    // Check if payment parameter is present in the URL and is set to true
    if (
      typeof getUrlVars()["payment"] !== "undefined" &&
      getUrlVars()["payment"] == "true"
    ) {
      // Get user ID for payment
      var puserid = $(".sidebar").data("paymentuser_id");

      try {
        // Fetch user data asynchronously
        const userData = await getUserData(puserid);
        console.log("_______________data", JSON.stringify(userData));

        // Initialize payment-related variables
        var price = width;
        var discount = 0;
        var coupontype = "couponcode";
        var offertoparticipant = 0;
        var participantname = "";
        var email = userData["email"];
        var name = userData["local"]["name"];
        var phone = userData["local"]["phone"];
        var couponcode = userData["local"]["couponcode"];

        // Check if coupon code is present in the URL
        if (
          typeof getUrlVars()["couponcode"] !== "undefined" &&
          getUrlVars()["couponcode"] !== ""
        ) {
          couponcode = getUrlVars()["couponcode"];
        }

        // Flag to track whether the coupon code exists
        let couponcodeexists = false;

        // Check if user is already enrolled
        if (getUrlVars()["enrolled"] == "true") {
          return;
        }

        // Display payment processing message
        $(".paymentgatewayprocessing")
          .html(
            '<div class="container row justify-content-center align-items-center h-100"> <h2 style="color: white;" class="ml-5">Redirecting you to payments page ... <i class="fa fa-spin fa-spinner"></i> </h2> </div>',
          )
          .removeClass("d-none");
        // Remove unnecessary elements from the UI
        $("header, footer, .breadcrumb-area, .course-details-area").remove();
        console.log("111");
        console.log(price);

        // Validate coupon code using Fetch API
        const couponValidationResponse = await fetch(
          `/payments/isvalidcoupon2?couponcode=${couponcode}`,
        );
        const result = await couponValidationResponse.json();

        // Check if coupon code is valid
        if (result !== false) {
          // Handle different coupon code types
          if (result.type == "referralcode") {
            coupontype = result.type;
            discount = (price * result.offertoenrollment) / 100;
            offertoparticipant = result.offertoparticipant;
            participantname = result.participantname;

            // Adjust price calculation for referral code
            price = price / 1.18 - (0.2 * price) / 1.18;
            price = price + 0.18 * price;
            price = Math.round(price);
          } else if (result.type == "amount") {
            discount = result.discount;
            price = price - discount;
          } else {
            discount = (price * result.discount) / 100;
            price = price - discount;
          }
          couponcodeexists = true;
        } else {
          price = width;
        }

        // Generate a unique user ID for payment
        var user_id = puserid + "_" + course_id;

        // Check if user is not enrolled and has provided an email
        if (getUrlVars()["enrolled"] !== "true" && email !== "") {
          // Adjust price for student checkbox
          if (getUrlVars()["studentcheckbox"] == "true") {
            price = price / 2;
          }

          // Construct payment data
          const paymentData = {
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
            webhook_url: "/webhook/",
          };

          console.log("_______________paymentdata", paymentData);

          // Request payment using Fetch API
          const paymentRequestResponse = await fetch(
            "/payments/requestpayment",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(paymentData),
            },
          );

          const paymentResult = await paymentRequestResponse.json();

          // Handle the payment result
          if (paymentResult.success == false) {
            if (paymentResult.message && paymentResult.message.phone) {
              // Display error message for invalid phone number
              $.alert("Please enter a valid phone number");
              setTimeout(() => {
                window.location.href = "/courses/" + course_url;
              }, 3000);
            } else {
              // Display general error message
              $.alert(JSON.stringify(paymentResult.message).toString());
              setTimeout(() => {
                window.location.href = "/courses/" + course_url;
              }, 3000);
            }
          } else {
            // Redirect to the payment page
            window.location.href = paymentResult;
          }
        }
      } catch (error) {
        console.error("Error during payment initiation:", error);
      }
    }
  }

  // Function to handle redirection
  async function handleRedirection(url, redirectionUrl, redirectionUrlDefault) {
    try {
      const response = await fetch(url);
      const result = await response.json();

      if (result !== false) {
        window.location.href = redirectionUrl;
      }
      else{
        window.location.href=redirectionUrlDefault;
      }
    } catch (error) {
      console.error("Error handling redirection:", error);
    }
  }

  // Function to validate coupon and redirect
  async function validateCouponAndRedirect(
    couponCode,
    courseUrl,
    studentCheckboxParam = "",
  ) {
    const url = `/payments/isvalidcoupon2?couponcode=${couponCode}`;
    const redirectionUrl = `${window.location.origin}/courses/${courseUrl}?payment=true&couponcode=${couponCode}${studentCheckboxParam}`;

    await handleRedirection(url, redirectionUrl, `${window.location.origin}/courses/${courseUrl}?payment=true`);
  }

  // Function to check user existence and redirect accordingly
  async function checkUserAndRedirect(
    email,
    password,
    courseUrl,
    formType,
    couponCode,
    couponCodeEl,
    studentCheckboxParam = "",
  ) {
    try {
      const response = await fetch(
        `/userexistsindatabase?email=${email}&password=${password}&courseid=${course_id}`,
      );
      const result = await response.json();

      if (result === 3) {
        $.alert("Invalid Password");
      } else if (result === 4) {
        $.confirm({
          title: "Already enrolled!",
          content: "You are already enrolled in this course!",
          buttons: {
            "Start Learning": function () {
              window.location.href = `/dashboard/${courseUrl}`;
            },
          },
        });
      } else if (result === 2) {
        if (formType === "notloggedinaccountexists") {
          if (studentCheckbox === "on") {
            $(".studentcheckbox2").val("on");
          }

          $("#emaillogin").val(email);
          $("#passwordlogin").val(password);
          $("input[name=couponcode]").val(couponCodeEl.val());
          $(".paymentlogin").submit();
        } else if (formType === "loginsignup") {
          $("#emaillogin").val(email);
          $("#passwordlogin").val(password);
          $("#couponcodelogin").val(couponCodeEl.val());
          $(".paymentlogin").submit();
        }
      }
    } catch (error) {
      console.error("Error checking user existence:", error);
    }

    await validateCouponAndRedirect(couponCode, courseUrl);
  }

  // Function to handle signup form submission
  async function handleSignupForm(
    emailValue,
    passwordValue,
    courseUrl,
    couponCode,
    couponCodeEl,
  ) {
    try {
      const response = await fetch(
        `/userexistsindatabase?email=${emailValue}&password=${passwordValue}&courseid=${course_id}`,
      );
      const result = await response.json();

      if (!result) {
        validateAndSubmitPaymentForm();
      } else {
        handleExistingUser(
          result,
          emailValue,
          passwordValue,
          courseUrl,
          couponCode,
          couponCodeEl,
        );
      }
    } catch (error) {
      console.error("Error checking user existence:", error);
    }
  }

  // Function to handle existing user scenarios
  function handleExistingUser(
    result,
    emailValue,
    passwordValue,
    courseUrl,
    couponCode,
    couponCodeEl,
  ) {
    if (result === 2) {
      $("#emaillogin").val(emailValue);
      $("#passwordlogin").val(passwordValue);
      $("#couponcodelogin").val(couponCodeEl.val());
      $(".paymentlogin").submit();
    } else if (result === 1) {
      $("#emaillogin").val(emailValue);
      $("#passwordlogin").val(passwordValue);
      $("#alreadyenrolled").val("enrolled");
      $(".paymentlogin").submit();
    } else if (result === 3) {
      $(".form-check-input3").click();
      $("input[name*='studentcheckbox']").prop("checked", true);
      $.alert(
        "You already have an account associated with this email address. Kindly login through it.",
      );
      $(".paymentsignupform, .paymentloginform").toggleClass("d-none");
      $(".emailloginform").val(emailValue);
      $(".couponcode2loginform").val(couponCodeEl.val());
    }
  }

  // Function to validate and submit payment form
  function validateAndSubmitPaymentForm() {
    if ($(".namevalue").val() === "") {
      $.alert("Name cannot be empty");
    } else if ($(".lastnamevalue").val() === "") {
      $.alert("Last name cannot be empty");
    } else if ($(".emailvalue").val() === "") {
      $.alert("Email cannot be empty");
    } else if ($("#phonenumber").val() === "") {
      $.alert("Phone cannot be empty");
    } else if ($(".passwordvalue").val() === "") {
      $.alert("Password cannot be empty");
    } else if ($(".repasswordvalue").val() === "") {
      $.alert("Re-password cannot be empty");
    } else if ($(".passwordvalue").val() !== $(".repasswordvalue").val()) {
      $.alert("Passwords don't match. Kindly try again.");
    } else {
      $("#paymentform").submit();
    }
  }

  // Invoke the function to initiate payment
  initiatePayment();

  $(".list-group-item").on("click", function (e) {
    e.preventDefault();
  });

  $(".loginbtn").on("click", function (e) {
    e.preventDefault();
    $("#paymentCreateAccount").modal("toggle");
    $("#paymentLoginModal").modal("toggle");
  });

  // Main function to handle enroll button click
  $(".enrollnow").on("click", async function (e) {
    e.preventDefault();

    const emailValue = $(".emailvalue").val();
    const passwordValue = $(".passwordvalue").val();
    const couponCodeEl = $(".couponcode2");
    const studentCheckbox = $("input[name*='studentcheckbox']:checked").val();
    let studentCheckboxParam = "";

    if (
      typeof studentCheckboxParam !== "undefined" &&
      studentCheckbox &&
      studentCheckbox === "on"
    ) {
      studentCheckboxParam = "&studentcheckbox=true";
    }

    if ($("[type=checkbox]:checked").length === 1) {
      const formType = $(this).data("formtype");
      if (formType === "loggedin") {
        if ($(".couponcode3").val() !== "") {
          await validateCouponAndRedirect(
            $(".couponcode3").val(),
            course_url,
            studentCheckboxParam,
          );
        } else {
          window.location.href = `${window.location.origin}/courses/${course_url}?payment=true${studentCheckboxParam}`;
        }
      } else if (formType === "notloggedinaccountexists") {
        await checkUserAndRedirect(
          $(".emailloginform").val(),
          $(".passwordloginform").val(),
          course_url,
          formType,
          $(".couponcode3").val(),
          couponCodeEl,
          studentCheckboxParam,
        );
      } else if (formType === "loginsignup") {
        await checkUserAndRedirect(
          $(".emailloginform").val(),
          $(".passwordloginform").val(),
          course_url,
          formType,
          $(".couponcode3").val(),
          couponCodeEl,
        );
      } else if (formType === "login") {
        await validateCouponAndRedirect(
          $(".couponcode2loginform").val(),
          course_url,
        );
      } else if (formType === "signup") {
        handleSignupForm(
          emailValue,
          passwordValue,
          course_url,
          $(".couponcode3").val(),
          couponCodeEl,
        );
      } else {
        if ($(".passwordloginform").val() === "") {
          $.alert("Kindly fill password");
        } else {
          $("#paymentform2").submit();
        }
      }
    } else {
      $.alert("Kindly agree to terms and conditions");
    }
  });

  $(".image-container").on("click", function () {
    $("#myModal").modal("toggle");
    var el = $(this).data("img");
    $(".imgsrc").attr("src", el);
  });

  $(".avatar-img, .avatar-img-spinner").toggleClass("d-none");

  $input.on("keyup", function () {
    clearTimeout(typingTimer);
    $input2 = $(this);
    typingTimer = setTimeout(doneTyping, doneTypingInterval);
  });

  //on keydown, clear the countdown
  $input.on("keydown", function () {
    clearTimeout(typingTimer);
  });

  $(".emailsignup").keydown(function () {
    clearTimeout(timer);
    timer = setTimeout(checkEmailExistsAlready, 1000);
  });

  $("input[name*='studentcheckbox']").change(function () {
    if (this.checked) {
      var $input = $(".couponcode2, .couponcode3, .couponcode2loginform");
      $input.prop("disabled", true);
      $(".courseprice").html(width / 2);
    } else {
      $(".courseprice").html(width);
      $(".couponcode2, .couponcode3, .couponcode2loginform")
        .removeAttr("disabled")
        .prop("disabled", false);
    }
  });

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
        data: {
          email: email,
          captcharesponse: captcharesponse,
        },
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
      alert("Please fill the recaptcha");
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
