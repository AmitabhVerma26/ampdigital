$(function () {
  $(".notificationlink").on("click", function (e) {
    e.preventDefault();
    var el = $(this);
    $(".notification-box")
      .addClass("d-none")
      .last()
      .after("<i class='notificationspinner fa fa-spinner fa-spin'></i>");
    var email = $(this).data("email");
    var notifications = $(this).data("notifications");
    var title = $(this).data("title");
    var description = $(this).data("description");
    $.ajax({
      method: "POST",
      url: "/removenotification",
      data: {
        email: email,
        notifications: JSON.stringify(notifications),
        title: title,
        description: description,
      },
    }).done(function () {
      $(".notificationspinner").addClass("d-none");
      $(".notification-box").removeClass("d-none");
      $(".notificationscount").html(
        parseInt($(".notificationscount").html()) - 1,
      );
      el.closest(".notification-box").remove();
      setTimeout(function () {
        window.location.href = "/dashboard";
      }, 2000);
    });
  });

  $("body").on("click", ".dropdown-menu", function (e) {
    $(this).parent().hasClass("show") && e.stopPropagation();
  });
});
