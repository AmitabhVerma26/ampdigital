$(function () {
  $(".alreadyaccount")
    .off("click")
    .on("click", function (e) {
      e.preventDefault();
      $("#ex2").modal();
    });

  $("#loginhere").on("click", function () {
    $("#ex1").modal();
  });
  function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }
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
          var html =
            '<div id="newmodal" class="text-center"> <i style="font-size: 75px;" class="fab fa-plane color-primary"></i>\n' +
            "            <h3>\n" +
            "              Instructions on resetting your password are on their way!\n" +
            "            </h3>\n" +
            "            <p>If you do not receive an email soon ensure that the email is valid and that you can receive emails\n" +
            "              from amitabh@ampdigital.co. Contact amitabh@ampdigital.co for additional assistance.</p></div>";
          $("body").append(html);
          $("#newmodal").modal();
        }

        console.log(response);
      });
    } else {
      alert("Please fill recaptcha");
    }
  });
  $(".registernow").on("click", function (e) {
    e.preventDefault();
    var registerform = $(this).closest(".registerform");
    var email = registerform.find(".email").val();
    var emailHelp = registerform.find(".emailHelp");
    var emailInput = registerform.find(".email");
    var name = registerform.find(".name").val();
    var nameHelp = registerform.find(".nameHelp");
    var nameInput = registerform.find(".name");
    var lastname = registerform.find(".lastname").val();
    var lastnameHelp = registerform.find(".lastnameHelp");
    var lastnameInput = registerform.find(".lastname");
    var phone = registerform.find(".phone").val();
    var phoneHelp = registerform.find(".phoneHelp");
    var phoneInput = registerform.find(".phone");
    var password = registerform.find(".password").val();
    var passwordHelp = registerform.find(".passwordHelp");
    var passwordInput = registerform.find(".password");
    var repassword = registerform.find(".repassword").val();
    var repasswordHelp = registerform.find(".repasswordHelp");
    var repasswordInput = registerform.find(".repassword");
    var auth = registerform.find(".auth").val();
    nameHelp.addClass("d-none");
    nameInput.removeClass("is-valid").removeClass("is-invalid");
    lastnameHelp.addClass("d-none");
    lastnameInput.removeClass("is-valid").removeClass("is-invalid");
    phoneHelp.addClass("d-none");
    phoneInput.removeClass("is-valid").removeClass("is-invalid");
    emailHelp.addClass("d-none");
    emailInput.removeClass("is-valid").removeClass("is-invalid");
    passwordHelp.addClass("d-none");
    passwordInput.removeClass("is-valid").removeClass("is-invalid");
    repasswordHelp.addClass("d-none");
    repasswordInput.removeClass("is-valid").removeClass("is-invalid");
    // alert(password);
    if (name == "") {
      nameInput.addClass("is-invalid");
      nameHelp.html("Please enter name").removeClass("d-none");
    } else if (lastname == "") {
      lastnameInput.addClass("is-invalid");
      lastnameHelp.html("Please enter last name").removeClass("d-none");
    } else if (email == "") {
      emailInput.addClass("is-invalid");
      emailHelp.html("Please enter email").removeClass("d-none");
    } else if (!validateEmail(email)) {
      emailInput.addClass("is-invalid");
      emailHelp.html("Please enter valid email").removeClass("d-none");
    } else if (phone == "") {
      $.ajax({
        method: "GET",
        url: `/userexistsindatabase?email=${email.toLowerCase()}&password=aehgaeipg`,
      }).done(function (response) {
        if (response !== false) {
          console.log(response);
          emailInput.addClass("is-invalid");
          emailHelp
            .html(
              `You already have account with this email. <a class="loginthroughthis" href="#">Log in</a> through this email.`,
            )
            .removeClass("d-none");
        } else {
          phoneInput.addClass("is-invalid");
          phoneHelp.html("Please enter phone").removeClass("d-none");
        }
        $(".loginthroughthis").on("click", function (e) {
          e.preventDefault();
          if (auth == "true") {
            $(".loginsectionlink").click();
          } else {
            $(".alreadyaccount").click();
          }
        });
      });
    } else if (password == "") {
      passwordInput.addClass("is-invalid");
      passwordHelp.html("Please enter password").removeClass("d-none");
    } else if (repassword == "") {
      repasswordInput.addClass("is-invalid");
      repasswordHelp.html("Please enter password again").removeClass("d-none");
    } else if (repassword !== password) {
      repasswordInput.addClass("is-invalid");
      repasswordHelp.html("Passwords do not match").removeClass("d-none");
    } else {
      $.ajax({
        method: "GET",
        url: `/userexistsindatabase?email=${email}&password=${password}`,
      }).done(function (response) {
        if (response !== false) {
          emailInput.addClass("is-invalid");
          emailHelp
            .html(
              `You already have account with this email. <a class="loginthroughthis" href="#">Log in</a> through this email.`,
            )
            .removeClass("d-none");
        } else {
          registerform.submit();
        }
        $(".loginthroughthis").on("click", function (e) {
          e.preventDefault();
          if (auth == "true") {
            $(".loginsectionlink").click();
          } else {
            $(".alreadyaccount").click();
          }
        });
      });
    }
  });
  $(".forgotpasswordbutton").on("click", function (e) {
    e.preventDefault();
    $(".loginform").addClass("d-none");
    $(".forgotpasswordform").removeClass("d-none");
    $(".loginheading").html("Forgot Password");
  });

  $(".loginformbutton").on("click", function (e) {
    e.preventDefault();
    $(".loginform").removeClass("d-none");
    $(".forgotpasswordform").addClass("d-none");
    $(".loginheading").html("Login");
  });
  $(".loginformbtn").on("click", function (e) {
    e.preventDefault();
    var loginform = $(this).prev(".loginform");
    var email = loginform.find(".email").val();
    var emailHelp = loginform.find(".emailHelp");
    var password = loginform.find(".password").val();
    var passwordHelp = loginform.find(".passwordHelp");
    var emailInput = loginform.find(".email");
    var passwordInput = loginform.find(".password");
    emailHelp.addClass("d-none");
    emailInput.removeClass("is-valid").removeClass("is-invalid");
    passwordHelp.addClass("d-none");
    passwordInput.removeClass("is-valid").removeClass("is-invalid");
    if (email == "") {
      emailInput.addClass("is-invalid");
      emailHelp.html("Please enter email").removeClass("d-none");
    } else if (!validateEmail(email)) {
      emailInput.addClass("is-invalid");
      emailHelp.html("Please enter valid email").removeClass("d-none");
    } else if (password == "") {
      passwordInput.addClass("is-invalid");
      passwordHelp.html("Please enter password").removeClass("d-none");
    } else {
      loginform.submit();
    }
  });
});
