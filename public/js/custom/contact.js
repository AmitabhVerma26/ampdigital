$(".forgotpasswordbutton").on("click", function (e) {
  e.preventDefault();
  $(".loginform").addClass("d-none");
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
  $(".loginform").removeClass("d-none");
  $(".forgotpasswordform").addClass("d-none");
  $(".loginpaneltitle").html("Login");
});

$(".forgotpasswordform").on("submit", function (e) {
  $(this).children("button").attr("disabled", "disabled");
  e.preventDefault();
  var email = $("#forgotpasswordemail").val();
  $.ajax({
    method: "POST",
    url: "/users/forgotpassword",
    data: { email: email },
  }).done(function (response) {
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
});

// Captcha Script

function checkform(theform) {
  var why = "";

  if (theform.CaptchaInput.value == "") {
    why += "- Please Enter CAPTCHA Code.\n";
  }
  if (theform.CaptchaInput.value != "") {
    if (ValidCaptcha(theform.CaptchaInput.value) == false) {
      why += "- The CAPTCHA Code Does Not Match.\n";
    }
  }
  if (why != "") {
    alert(why);
    return false;
  }
}

var a = Math.ceil(Math.random() * 9) + "";
var b = Math.ceil(Math.random() * 9) + "";
var c = Math.ceil(Math.random() * 9) + "";
var d = Math.ceil(Math.random() * 9) + "";
var e = Math.ceil(Math.random() * 9) + "";

var code = a + b + c + d + e;
document.getElementById("txtCaptcha").value = code;
document.getElementById("CaptchaDiv").innerHTML = code;

// Validate input against the generated number
function ValidCaptcha() {
  var str1 = removeSpaces(document.getElementById("txtCaptcha").value);
  var str2 = removeSpaces(document.getElementById("CaptchaInput").value);
  if (str1 == str2) {
    return true;
  } else {
    return false;
  }
}

$("#CaptchaInput").on("keyup", function () {
  var isValid = ValidCaptcha();
  if (isValid) {
    $(".gacontactbtn").removeAttr("disabled");
  } else {
    $(".gacontactbtn").attr("disabled", "disabled");
  }
});

// Remove the spaces from the entered and generated code
function removeSpaces(string) {
  return string.split(" ").join("");
}
