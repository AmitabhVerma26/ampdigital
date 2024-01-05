$(document).ready(function () {
  $(".clients_spinner").addClass("d-none");
  $(".clients").removeClass("d-none");
  $(".testimonial_spinner").addClass("d-none");
  $(".testimonial_div").removeClass("d-none");
  $(".trainingpartner_spinner").addClass("d-none");
  $(".trainingpartner_div").removeClass("d-none");

  var swiper = new Swiper(".swiper-container", {
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

  $(".alreadyaccount").on("click", function (e) {
    e.preventDefault();
    $("#loginModal").modal("toggle");
    $("#createAccount").modal("toggle");
  });

  $(".course").on("click", function (e) {
    e.preventDefault();
    window.location.href = $(this).data("href");
  });

  if (
    $("body").data("success") == "true" ||
    $("body").data("success") == true
  ) {
    // console.log('HEREEE');
    // $.alert('aeg');
    window.history.pushState("Details", "Title", "/");
    $.alert("We have received your query. We will get back to you soon.");
  }
  $("#tocert").on("click", function (e) {
    e.preventDefault();
    $("html, body").animate(
      {
        scrollTop: $("#certifications").offset().top,
      },
      500,
    );
  });
  $("#enquirenow, #enquirenow2, #enqirenow3").on("click", function (e) {
    e.preventDefault();
    $("html, body").animate(
      {
        scrollTop: $("#courses").offset().top,
      },
      500,
    );
  });

  $("#viewcourses").on("click", function (e) {
    e.preventDefault();
    $("html, body").animate(
      {
        scrollTop: $("#courses").offset().top,
      },
      500,
    );
  });
  $(".forgotpasswordbutton").on("click", function (e) {
    e.preventDefault();
    $(".loginform").addClass("d-none");
    $(".forgotpasswordform").removeClass("d-none");
    $(".loginpaneltitle").html("Forgot Password");
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
});
