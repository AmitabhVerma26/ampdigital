Array.prototype.compare = function (testArr) {
  if (this.length != testArr.length) return false;
  for (var i = 0; i < testArr.length; i++) {
    if (this[i].compare) {
      //To test values in nested arrays
      if (!this[i].compare(testArr[i])) return false;
    } else if (this[i] !== testArr[i]) return false;
  }
  return true;
};

function options(number) {
  if (number == 0) {
    return "A";
  } else if (number == 1) {
    return "B";
  } else if (number == 2) {
    return "C";
  } else if (number == 3) {
    return "D";
  }
}
function options2(arr) {
  // alert(arr);
  var str = "";
  for (var i = 0; i < arr.length; i++) {
    var number = arr[i];
    if (number == 0) {
      str = str + "A";
    } else if (number == 1) {
      str = str + "B";
    } else if (number == 2) {
      str = str + "C";
    } else if (number == 3) {
      str = str + "D";
    }
  }
  return str;
}

//Function to save state of the quiz in real time
function updateInfo(
  questionCorrectIncorrect,
  quizAnswers,
  queNo,
  element_id,
  loggedinEmail,
  score,
) {
  $.ajax({
    method: "PUT",
    url: "/courses/elements/updatequizlog",
    beforeSend: function () {},
    data: {
      questionCorrectIncorrect: JSON.stringify(questionCorrectIncorrect),
      quizAnswers: JSON.stringify(quizAnswers),
      queNo: queNo,
      element_id: element_id,
      loggedinEmail: loggedinEmail,
      score: score,
    },
  }).done(function (response) {
    // elarg.children('.fa-check').removeClass('hidden');
  });
  $.ajax({
    method: "POST",
    url: "/courses/elements/updatequelog",
    beforeSend: function () {},
    data: {
      questionCorrectIncorrect: JSON.stringify(questionCorrectIncorrect[queNo]),
      queAns: JSON.stringify(quizAnswers[queNo]),
      queNo: queNo,
      element_id: element_id,
      loggedinEmail: loggedinEmail,
    },
  }).done(function (response) {
    // elarg.children('.fa-check').removeClass('hidden');
  });
}

//Function to save state of the quiz in real time
function updateQuizCompletionStatus(element_id, loggedinEmail) {
  $.ajax({
    method: "PUT",
    url: "/courses/elements/markquizcompleted",
    beforeSend: function () {},
    data: {
      element_id: element_id,
      loggedinEmail: loggedinEmail,
    },
  }).done(function (response) {});
}

function getPercentile(element_id, loggedinEmail, el) {
  $.ajax({
    method: "POST",
    url: "/course/elements/percentile",
    beforeSend: function () {},
    data: {
      quizid: element_id,
      email: loggedinEmail,
    },
  }).done(function (response) {
    el.html(response);
  });
}

var timerCompleted = false;

function quizCode(elarg, element_id, loggedinEmail) {
  var iframe = document.querySelector("iframe");
  if (iframe && typeof iframe !== "undefined") {
    var player = new Vimeo.Player(iframe);
  }
  var quiz_id = elarg.data("element_val");
  var el = $(".element");
  var this_el = elarg;
  $.ajax({
    type: "POST",
    url: "/courses/elements/getquiz?quiz_id =" + quiz_id,
    data: {
      quiz_id: quiz_id,
    },
    success: function (json2) {
      /* ----------Showing Quiz Landing Page ------------ */
      $(".video_div, .exercise_div").addClass("hidden"); //Hiding Video Div
      $(".quiz_div").removeClass("hidden"); //Showing Quiz Div
      $(".quizstartpage").removeClass("hidden"); //Showing Quiz Landing Page (Quiz description with Quiz start button)
      $(".quizquestionpage").addClass("hidden"); //Hiding Quiz Question Page (pages where quiz questions are displayed)

      json2.pages = JSON.parse(json2.pages); //Parsing Pages as JSON

      if (typeof player !== "undefined" && player) {
        //Pause the video if any running in the background
        player
          .pause()
          .then(function () {
            // the video was paused
          })
          .catch(function (error) {
            switch (error.name) {
              case "PasswordError":
                // the video is password-protected and the viewer needs to enter the
                // password first
                break;

              case "PrivacyError":
                // the video is private
                break;

              default:
                // some other error occurred
                break;
            }
          });
      }

      /* -----------Making the quiz link active------------ */
      el.removeClass("liactive");
      this_el.addClass("liactive");
      /* -----------Making the quiz link active------------ */

      $.ajax({
        method: "GET",
        url:
          "/courses/elements/getquizlog?id=" +
          element_id +
          "&userid=" +
          loggedinEmail,
        beforeSend: function () {
          $(".quizstartpage").addClass("hidden");
        },
      }).done(function (response) {
        if (response.length !== 0) {
          //Record found in quiz logs
          if (response[0].quizcompleted == "false") {
            var startedAt = response[0].date;
            var dif = new Date().getTime() - new Date(startedAt).getTime();
            var Seconds_from_T1_to_T2 = dif / 60000;
            var Seconds_Between_Dates = Math.abs(Seconds_from_T1_to_T2);
            if (
              typeof json2["maxTimeToFinish"] !== "undefined" &&
              json2["maxTimeToFinish"] !== null
            ) {
              if (json2["maxTimeToFinish"] < Seconds_Between_Dates) {
                $(".quizstartpage").removeClass("hidden");
                /* ------------------- Quiz Landing page HTML ---------------- */
                $(".startpagehtml").html(
                  "Quiz Time finished. <br> Please click on <b>'Review Quiz'</b> button to review your score.",
                ); //Updating HTML for Quiz Landing Page card-text (You are about to start the quiz.....)
                //Updating the above startpagehtml HTML further for quiz minutes and quiz total questions
                $(".quiztitle").html(json2.quiz_title); //Updating HTML for Quiz Landing page card-title
                $(".startquizbutton").html("Review Quiz");
                setTimeout(function () {
                  $(".queprevbutton").removeAttr("disabled");
                }, 1000);
                /* ------------------- Quiz Landing page HTML ---------------- */
              } else {
                $(".startquizbutton").click();
                setTimeout(function () {
                  $(".queprevbutton").attr("disabled", "disabled");
                }, 1000);
              }
            } else {
              $(".startquizbutton").click();
            }
          } else {
            //Quiz completed already
            // alert('2');
            $(".quizstartpage").removeClass("hidden");
            /* ------------------- Quiz Landing page HTML ---------------- */
            $(".startpagehtml").html(
              "You have finished the quiz. <br> Please click on <b>'Review Quiz'</b> button to review your score.",
            ); //Updating HTML for Quiz Landing Page card-text (You are about to start the quiz.....)
            //Updating the above startpagehtml HTML further for quiz minutes and quiz total questions
            $(".quiztitle").html(json2.quiz_title); //Updating HTML for Quiz Landing page card-title
            $(".startquizbutton").html("Review Quiz");
            /* ------------------- Quiz Landing page HTML ---------------- */
          }
        } else {
          //No record found in quiz logs
          //Means quiz is being started by the user for the first time so create the quiz log and start quiz
          $(".quizstartpage").removeClass("hidden");
          /* ------------------- Quiz Landing page HTML ---------------- */
          $(".startpagehtml").html(json2.pages[0]["questions"][0]["html"]); //Updating HTML for Quiz Landing Page card-text (You are about to start the quiz.....)
          //Updating the above startpagehtml HTML further for quiz minutes and quiz total questions
          $(".quizminutes").html(json2.maxTimeToFinish);
          $(".quiztotalquestions").html(json2.pages.length - 1);
          $(".quiztitle").html(json2.quiz_title); //Updating HTML for Quiz Landing page card-title
          $(".startquizbutton").html("Start Quiz");
          /* ------------------- Quiz Landing page HTML ---------------- */
        }
      });

      $(".progressbartotalquestions").html(json2.pages.length - 1); ///Updating Total Questions of Progress Bar

      //Showing Quiz Complete button and making Prev and Next Questions Read only if there is only 1 question in the quiz
      if (json2.pages.length - 1 == 1) {
        $(".quecompletebutton").removeClass("hidden");
        $(".quenextbutton").hide();
        $(".queprevbutton").attr("disabled", "disabled");
      }

      var queNo; //Current Question Number will be tracked by this variable
      var quizStarted;
      var quizCompleted;
      var quizAnswers; //JS Object which will track the answers marked by user, e.g. {1:1, 2:0}
      var questionCorrectIncorrect; //JS Object which will tell you whether the quiz questions are correctly or incorrectly answered by user, e.g. {1: "correct", 2: "incorret", 3: "correct", 4: "correct"}
      var timeOver = false;

      //Logic to execute on clicking Start Quiz button in Quiz's landing page
      function addMinutes(date, minutes) {
        return new Date(date.getTime() + minutes * 60000);
      }
      $(".startquizbutton")
        .off("click")
        .on("click", function () {
          //Removing timer html and reinserting it
          $("#demo").remove();
          $(".quizquestionpage").prepend('<p id="demo"></p>');

          $.ajax({
            method: "GET",
            url:
              "/courses/elements/getquizlog?id=" +
              element_id +
              "&userid=" +
              loggedinEmail,
            beforeSend: function () {},
          }).done(function (response) {
            function quizStartLogic(
              startedAt,
              que_no,
              quizAnswers2,
              questionCorrectIncorrect2,
              quizFinished,
            ) {
              // alert('hello');
              quizAnswers = quizAnswers2;
              questionCorrectIncorrect = questionCorrectIncorrect2;
              var quizStartedAt = new Date(startedAt);
              var dif = new Date().getTime() - new Date(startedAt).getTime();
              var Seconds_from_T1_to_T2 = dif / 60000;
              var Seconds_Between_Dates = Math.abs(Seconds_from_T1_to_T2);
              //===========================================Quiz Timer===========================//
              // Set the date we're counting down to
              // var countDownDate = new Date("Apr 30, 2018 12:14:10").getTime();
              if (
                typeof json2["maxTimeToFinish"] !== "undefined" &&
                json2["maxTimeToFinish"] !== null
              ) {
                var countDownDate = addMinutes(
                  quizStartedAt,
                  json2["maxTimeToFinish"],
                ).getTime();

                // Update the count down every 1 second
                var x = setInterval(function () {
                  // Get todays date and time
                  var now = new Date().getTime();

                  // Find the distance between now an the count down date
                  var distance = countDownDate - now;

                  // Time calculations for days, hours, minutes and seconds
                  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                  var hours = Math.floor(
                    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
                  );
                  var minutes = Math.floor(
                    (distance % (1000 * 60 * 60)) / (1000 * 60),
                  );
                  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

                  // Output the result in an element with id="demo"
                  document.getElementById("demo").innerHTML =
                    /*days + "d " +*/ "Time Left: " +
                    hours +
                    "h " +
                    minutes +
                    "m " +
                    seconds +
                    "s ";

                  // If the count down is over, write some text
                  if (distance < 0) {
                    clearInterval(x);
                    document.getElementById("demo").innerHTML =
                      "Quiz Time Finished!";
                    // alert('hello');
                    quizCompleted = true;
                    updateQuizCompletionStatus(element_id, loggedinEmail);
                    $(".quecompletebutton").attr("disabled", "disabled");
                    timeOver = true;
                    $("input[type=checkbox]").attr("disabled", true);

                    if (questionCorrectIncorrect[queNo] == "correct") {
                      $(".labelsuccess").removeClass("hidden");
                      $(".labelexplanation").html(
                        json2.pages[queNo]["questions"][0]["explanation"],
                      );
                      $(".labeldanger").addClass("hidden");
                      $(".labelinfo").addClass("hidden");
                    } else {
                      $(".labeldanger").removeClass("hidden");
                      $(".labelsuccess").addClass("hidden");
                      $(".labelinfo").removeClass("hidden");
                      $(".labelexplanation").html(
                        json2.pages[queNo]["questions"][0]["explanation"],
                      );
                      if (
                        json2.pages[queNo]["questions"][0]["type"] == "checkbox"
                      ) {
                        $(".correctanswer").html(
                          options2(
                            json2.pages[queNo]["questions"][0]["correctAnswer"],
                          ),
                        );
                      } else {
                        $(".correctanswer").html(
                          options(
                            json2.pages[queNo]["questions"][0]["correctAnswer"],
                          ),
                        );
                      }
                    }
                    $(".quecompletebutton").attr("disabled", "disabled");
                    var score = 0;
                    for (
                      var i = 1;
                      i < Object.keys(quizAnswers).length + 1;
                      i++
                    ) {
                      if (
                        json2.pages[i]["questions"][0]["type"] == "checkbox"
                      ) {
                        if (
                          quizAnswers[i]
                            .sort()
                            .compare(
                              json2.pages[i]["questions"][0][
                                "correctAnswer"
                              ].sort(),
                            )
                        ) {
                          score = score + 1;
                          questionCorrectIncorrect[i] = "correct";
                        } else {
                          questionCorrectIncorrect[i] = "incorrect";
                        }
                      } else {
                        if (
                          parseInt(quizAnswers[i]) ==
                          json2.pages[i]["questions"][0]["correctAnswer"]
                        ) {
                          score = score + 1;
                          questionCorrectIncorrect[i] = "correct";
                        } else {
                          questionCorrectIncorrect[i] = "incorret";
                        }
                      }
                    }
                    /*============================Calculating Quiz Score, and correctness & incorrectness of each question ===============*/

                    //Showing Quiz Score
                    $(".correctquestions").html(score);
                    $(".totalquestions").html(json2.pages.length - 1);
                    $(".quizscore").removeClass("hidden");
                    getPercentile(
                      element_id,
                      loggedinEmail,
                      $(".quizpercentile"),
                    );
                    // $('#demo').addClass('hidden');
                  }
                }, 1000);
              }
              $(".element").on("click", function (e) {
                e.preventDefault();
                clearInterval(x);
                document.getElementById("demo").innerHTML = "";
              });
              //===========================================Quiz Timer===========================//

              $(".nextbuttonquiz").addClass("hidden");
              queNo = que_no; //Initializing Current Question number to 0
              $(".progressbartext").css(
                "width",
                (queNo * 100) / (json2.pages.length - 1) + "%",
              );
              quizStarted = true;
              quizCompleted = false;
              if (
                typeof json2["maxTimeToFinish"] !== "undefined" &&
                json2["maxTimeToFinish"] !== null
              ) {
                if (json2["maxTimeToFinish"] < Seconds_Between_Dates) {
                  quizCompleted = true;
                  $(".nextbuttonquiz").removeClass("hidden");
                  $(".quecompletebutton").attr("disabled", "disabled");
                }
              }

              $(".quizscore").addClass("hidden"); //hiding score HTML again if someone starts another quiz
              if (quizFinished == "true") {
                quizCompleted = true;
                $(".quecompletebutton").attr("disabled", "disabled");
                $(".nextbuttonquiz").removeClass("hidden");
                var score = 0;
                for (var i = 1; i < Object.keys(quizAnswers).length + 1; i++) {
                  if (json2.pages[i]["questions"][0]["type"] == "checkbox") {
                    if (
                      quizAnswers[i]
                        .sort()
                        .compare(
                          json2.pages[i]["questions"][0][
                            "correctAnswer"
                          ].sort(),
                        )
                    ) {
                      score = score + 1;
                      questionCorrectIncorrect[i] = "correct";
                    } else {
                      questionCorrectIncorrect[i] = "incorrect";
                    }
                  } else {
                    if (
                      parseInt(quizAnswers[i]) ==
                      json2.pages[i]["questions"][0]["correctAnswer"]
                    ) {
                      score = score + 1;
                      questionCorrectIncorrect[i] = "correct";
                    } else {
                      questionCorrectIncorrect[i] = "incorret";
                    }
                  }
                }
                //Showing Quiz Score
                $(".correctquestions").html(score);
                $(".totalquestions").html(json2.pages.length - 1);
                $(".quizscore").removeClass("hidden");
                getPercentile(element_id, loggedinEmail, $(".quizpercentile"));
                $("#demo").addClass("hidden");
              }

              $(".requiredmessage").addClass("hidden");
              $(".quizstartpage").addClass("hidden"); //hiding landing page of quiz
              $(".quizquestionpage").removeClass("hidden"); //and showing question page of quiz
              $(".labelsuccess").addClass("hidden"); //hiding label HTML again if someone starts another quiz
              $(".labeldanger").addClass("hidden"); //hiding label HTML again if someone starts another quiz
              $(".labelinfo").addClass("hidden"); //hiding label HTML again if someone starts another quiz
              $(".quizquestion").html(
                queNo + ". " + json2.pages[1]["questions"][0]["title"],
              ); //Updating question in Quiz question page
              $(".currentquestion").html(queNo); //Updating Current Question to 1 in Progress Bar

              if (json2.pages.length - 1 == 1) {
                //If Quiz has only 1 question disable previous and next button
                $(".queprevbutton").attr("disabled", "disabled");
                $(".quenextbutton").hide();
              } else if (
                quizCompleted == true &&
                json2.pages.length - 1 == queNo
              ) {
                $(".quenextbutton").hide();
                $(".quecompletebutton").addClass("hidden");
              } else {
                //Otherwise just disable previous button as there are more questions and we are at question number 1. Also hide Completed button
                $(".quecompletebutton").addClass("hidden");
                $(".quenextbutton").removeAttr("disabled").show();
                $(".queprevbutton").attr("disabled", "disabled");
              }

              if (que_no > 1) {
                $(".queprevbutton").removeAttr("disabled");
              }

              if (json2.pages[que_no]["questions"][0]["type"] == "checkbox") {
                //If the question type is MCQ More than 1 correct

                /*-------------------------Making HTML of choices of question number 1  --------------------*/
                var html = ""; //Variable which will store HTML of all the choices of current (first) question
                //Iterating over all the choices of current question (question number 1)
                for (
                  var i = 0;
                  i < json2.pages[que_no]["questions"][0]["choices"].length;
                  i++
                ) {
                  if (
                    json2.pages[que_no]["questions"][0]["choices"][i] &&
                    json2.pages[que_no]["questions"][0]["choices"][i].trim() !==
                      ""
                  ) {
                    if (typeof quizAnswers[queNo] !== "undefined") {
                      //Means that the user has already filled the response of the question before and he is right now just reviewing the quiz. So we need to check the checkbox he selected originally
                      var myvar =
                        '<li class = "list-group-item">' +
                        '                <div class="checkbox">' +
                        '                  <input style="margin-left: 0!important;" type="checkbox" id="checkbox" />' +
                        '                  <label for="checkbox">' +
                        json2.pages[queNo]["questions"][0]["choices"][i] +
                        "                  </label>" +
                        "                </div>" +
                        "              </li>";
                      for (var j = 0; j < quizAnswers[queNo].length; j++) {
                        //Checking if this option was checked by user, if yes then add checked attribute to it
                        if (quizAnswers[queNo][j] == i) {
                          var myvar =
                            '<li class = "list-group-item">' +
                            '                <div class="checkbox">' +
                            '                  <input checked style="margin-left: 0!important;" type="checkbox" id="checkbox" />' +
                            '                  <label for="checkbox">' +
                            json2.pages[queNo]["questions"][0]["choices"][i] +
                            "                  </label>" +
                            "                </div>" +
                            "              </li>";
                        }
                      }
                    } else {
                      //User would mark the answer first time
                      var myvar =
                        '<li class = "list-group-item">' +
                        '                <div class="checkbox">' +
                        '                  <input value="' +
                        i +
                        '" style="margin-left: 0!important;" type="checkbox" id="checkbox' +
                        i +
                        '" />' +
                        '                  <label for="checkbox' +
                        i +
                        '">' +
                        json2.pages[que_no]["questions"][0]["choices"][i] +
                        "                  </label>" +
                        "                </div>" +
                        "              </li>";
                    }
                    html = html + myvar;
                  }
                }
                $(".checkboxes").html(html);
                $(".checkbox input")
                  .off("change")
                  .on("change", function () {
                    var selected = [];
                    var j = 0;
                    //Iterating over all checkboxes (choices) of the current question and pushing selected choice into queNo index of quizAnswers JSON variable which tracking quiz answers filled by user
                    $.each($("input[type='checkbox']"), function () {
                      if ($(this).is(":checked")) {
                        $(".requiredmessage").addClass("hidden");
                        selected.push(j); //Pushing selected choice(s) in the queNo key of quizAnswers json object tracking user choices of all the questions of the quiz
                        quizAnswers[queNo] = selected;
                      }
                      j++;
                    });
                    quizAnswers[queNo] = selected;
                    var score = 0;
                    for (var i = 1; i < queNo + 1; i++) {
                      if (
                        json2.pages[i]["questions"][0]["type"] == "checkbox"
                      ) {
                        if (
                          quizAnswers[i]
                            .sort()
                            .compare(
                              json2.pages[i]["questions"][0][
                                "correctAnswer"
                              ].sort(),
                            )
                        ) {
                          score = score + 1;
                          questionCorrectIncorrect[i] = "correct";
                        } else {
                          questionCorrectIncorrect[i] = "incorrect";
                        }
                      } else {
                        if (
                          parseInt(quizAnswers[i]) ==
                          json2.pages[i]["questions"][0]["correctAnswer"]
                        ) {
                          score = score + 1;
                          questionCorrectIncorrect[i] = "correct";
                        } else {
                          questionCorrectIncorrect[i] = "incorret";
                        }
                      }
                    }
                    updateInfo(
                      questionCorrectIncorrect,
                      quizAnswers,
                      queNo,
                      element_id,
                      loggedinEmail,
                      score,
                    );
                  });

                /*-------------------------Making HTML of choices of question number 1  --------------------*/
              } else if (
                json2.pages[que_no]["questions"][0]["type"] == "radiogroup"
              ) {
                //If the question type is MCQ Only 1 correct

                /*-------------------------Making HTML of choices of question number 1  --------------------*/
                var html = ""; //Variable which will store HTML of all the choices of current (first) question
                //Iterating over all the choices of current question (question number 1)
                for (
                  var i = 0;
                  i < json2.pages[que_no]["questions"][0]["choices"].length;
                  i++
                ) {
                  if (
                    json2.pages[que_no]["questions"][0]["choices"][i] &&
                    json2.pages[que_no]["questions"][0]["choices"][i].trim() !==
                      ""
                  ) {
                    var myvar;
                    if (
                      typeof quizAnswers[queNo] !== "undefined" &&
                      quizAnswers[queNo] == i
                    ) {
                      myvar =
                        '<li class = "list-group-item">' +
                        '                <div class="checkbox">' +
                        '                  <input checked value="' +
                        i +
                        '" type="radio" name="radio" id="radio' +
                        i +
                        '" />' +
                        '                  <label for="radio' +
                        i +
                        '">' +
                        json2.pages[que_no]["questions"][0]["choices"][i] +
                        "                  </label>" +
                        "                </div>" +
                        "              </li>";
                    } else {
                      myvar =
                        '<li class = "list-group-item">' +
                        '                <div class="checkbox">' +
                        '                  <input value="' +
                        i +
                        '" type="radio" name="radio" id="radio' +
                        i +
                        '" />' +
                        '                  <label for="radio' +
                        i +
                        '">' +
                        json2.pages[que_no]["questions"][0]["choices"][i] +
                        "                  </label>" +
                        "                </div>" +
                        "              </li>";
                    }

                    html = html + myvar;
                  }
                }
                $(".checkboxes").html(html);
                $('input:radio[name="radio"]')
                  .off("change")
                  .on("change", function () {
                    var radioValue = $("input[name='radio']:checked").val();
                    if (radioValue) {
                      $(".requiredmessage").addClass("hidden");
                      /*============================Calculating Quiz Score, and correctness & incorrectness of each question ===============*/
                      var score = 0;
                      for (var i = 1; i < queNo + 1; i++) {
                        if (
                          json2.pages[i]["questions"][0]["type"] == "checkbox"
                        ) {
                          if (
                            quizAnswers[i]
                              .sort()
                              .compare(
                                json2.pages[i]["questions"][0][
                                  "correctAnswer"
                                ].sort(),
                              )
                          ) {
                            score = score + 1;
                            questionCorrectIncorrect[i] = "correct";
                          } else {
                            questionCorrectIncorrect[i] = "incorrect";
                          }
                        } else {
                          if (
                            parseInt(quizAnswers[i]) ==
                            json2.pages[i]["questions"][0]["correctAnswer"]
                          ) {
                            score = score + 1;
                            questionCorrectIncorrect[i] = "correct";
                          } else {
                            questionCorrectIncorrect[i] = "incorret";
                          }
                        }
                      }
                      updateInfo(
                        questionCorrectIncorrect,
                        quizAnswers,
                        queNo,
                        element_id,
                        loggedinEmail,
                        score,
                      );
                      /*============================Calculating Quiz Score, and correctness & incorrectness of each question ===============*/
                    } else {
                      $(".requiredmessage").removeClass("hidden");
                    }
                  });
                /*-------------------------Making HTML of choices of question number 1  --------------------*/
              }
              if (quizCompleted == true) {
                $("input[type=radio]").attr("disabled", "disabled");
                $("input[type=checkbox]").attr("disabled", true);
              }
            }
            if (response.length !== 0) {
              //Record found in quiz logs
              if (response[0].quizcompleted == "false") {
                if (typeof response[0].queNo !== "undefined") {
                  que_no = parseInt(response[0].queNo);
                } else {
                  que_no = 1;
                }
                var questionCorrectIncorrect2;
                if (
                  typeof response[0].questionCorrectIncorrect !== "undefined"
                ) {
                  questionCorrectIncorrect2 = JSON.parse(
                    response[0].questionCorrectIncorrect,
                  );
                } else {
                  //If started quiz but not even filled first question response
                  questionCorrectIncorrect2 = {};
                }
                var quizAnswers2;
                if (
                  typeof response[0].questionCorrectIncorrect !== "undefined"
                ) {
                  quizAnswers2 = JSON.parse(response[0].quizAnswers);
                } else {
                  //If started quiz but not even filled first question response
                  quizAnswers2 = {};
                }
                quizStartLogic(
                  response[0].date,
                  que_no,
                  quizAnswers2,
                  questionCorrectIncorrect2,
                  "false",
                );
                $(".quecompletebutton").removeAttr("disabled");
              } else {
                //Quiz completed already
                if (typeof response[0].queNo !== "undefined") {
                  que_no = parseInt(response[0].queNo);
                } else {
                  que_no = 1;
                }
                if (
                  typeof response[0].questionCorrectIncorrect !== "undefined"
                ) {
                  questionCorrectIncorrect2 = JSON.parse(
                    response[0].questionCorrectIncorrect,
                  );
                } else {
                  //If started quiz but not even filled first question response
                  questionCorrectIncorrect2 = {};
                }
                var quizAnswers2;
                if (
                  typeof response[0].questionCorrectIncorrect !== "undefined"
                ) {
                  quizAnswers2 = JSON.parse(response[0].quizAnswers);
                } else {
                  //If started quiz but not even filled first question response
                  quizAnswers2 = {};
                }
                quizStartLogic(
                  response[0].date,
                  que_no,
                  quizAnswers2,
                  questionCorrectIncorrect2,
                  "true",
                );
                $(".quecompletebutton").removeAttr("disabled");
                //Quiz finished
              }
            } else {
              //No record found in quiz logs
              //Means quiz is being started by the user for the first time so create the quiz log and start quiz
              $.ajax({
                method: "POST",
                url: "/courses/elements/quizlog",
                beforeSend: function () {},
                data: {
                  id: element_id,
                  userid: loggedinEmail,
                  date: new Date(),
                  totalquestions: json2.pages.length - 1,
                  maxtime: json2["maxTimeToFinish"],
                },
              }).done(function (response) {
                quizStartLogic(new Date(), 1, {}, {}, "false");
                $(".quecompletebutton").removeAttr("disabled");
                // elarg.children('.fa-check').removeClass('hidden');
              });
            }
            // elarg.children('.fa-check').removeClass('hidden');
          });
        });

      //Logic to execute on clicking Next button on a Quiz's question page
      $(".quenextbutton")
        .off("click")
        .on("click", function () {
          $(".quizstartpage").addClass("hidden"); //hiding landing page of quiz
          $(".quizquestionpage").removeClass("hidden"); //and showing question page of quiz
          var logicToExecute = 1; //Variable to track whether next button should take to next question or ask user to fill current question's checkbox or radio button first

          if (json2.pages[queNo]["questions"][0]["type"] == "checkbox") {
            var selected = [];
            var j = 0;
            //Iterating over all checkboxes (choices) of the current question and pushing selected choice into queNo index of quizAnswers JSON variable which tracking quiz answers filled by user
            $.each($("input[type='checkbox']"), function () {
              if ($(this).is(":checked")) {
                $(".requiredmessage").addClass("hidden");
                selected.push(j);
                quizAnswers[queNo] = selected; //Pushing selected choice(s) in the queNo key of quizAnswers json object tracking user choices of all the questions of the quiz
              }
              j++;
            });
            if (selected.length == 0) {
              //If no checkbox is selected in MCQ more than one correct
              if (timeOver == false) {
                $(".requiredmessage").removeClass("hidden");
                logicToExecute = -1;
              }
            }
          } else {
            var radioValue = $("input[name='radio']:checked").val(); //Get value of checked radio box of the current question
            if (radioValue) {
              $(".requiredmessage").addClass("hidden");
              quizAnswers[queNo] = radioValue; //Pushing selected choice in the queNo key of quizAnswers json object tracking user choices of all the questions of the quiz
            } else {
              //means no radio box is checked
              if (timeOver == false) {
                $(".requiredmessage").removeClass("hidden");
                logicToExecute = -1;
              }
            }
          }

          /*var totalQuestions = json2.pages.length - 1;  //Total question in Quiz
                if(queNo > totalQuestions){ //If user is on last question and quiz is finished, then show continue button
                    if(quizCompleted == true){
                        $('.quecompletebutton').attr('disabled', 'disabled');
                    }
                }*/

          //logic to execute if the current question doesn't have empty response to take user to next question
          if (logicToExecute == 1) {
            queNo = queNo + 1; //Updating variable tracking current question no

            $(".currentquestion").html(queNo); //Updating current question no in progress bar
            $(".progressbartext").css(
              "width",
              (queNo * 100) / (json2.pages.length - 1) + "%",
            );

            var totalQuestions = json2.pages.length - 1; //Total question in Quiz
            if (queNo < totalQuestions) {
              //User is not on last question, so enable both Previous and Next buttons
              $(".quecompletebutton").addClass("hidden");
              if (timeOver) {
                $(".queprevbutton").removeAttr("disabled");
              }
              $(".quenextbutton").removeAttr("disabled").show();
            } else {
              //User is on last question, so show Complete button and disable Next button and enable Previous button
              $(".quenextbutton").hide();
              if (quizCompleted == true) {
                $(".quecompletebutton").attr("disabled", "disabled");
                $(".nextbuttonquiz").removeClass("hidden");
              }
              $(".quecompletebutton").removeClass("hidden");
              $(".quecompletebutton").removeClass("hidden");
              if (totalQuestions > 1) {
                if (timeOver) {
                  $(".queprevbutton").removeAttr("disabled");
                }
              }
            }

            if (queNo < totalQuestions || queNo == totalQuestions) {
              //The user is on a question
              $(".currentquestion").html(queNo); //Updating current question in progressbar
              $(".quizquestion").html(
                queNo + ". " + json2.pages[queNo]["questions"][0]["title"],
              ); //Updating question in Quiz question page
              if (json2.pages[queNo]["questions"][0]["type"] == "checkbox") {
                /*-------------------------Making HTML of choices of question number 1  --------------------*/
                var html = "";
                for (
                  var i = 0;
                  i < json2.pages[queNo]["questions"][0]["choices"].length;
                  i++
                ) {
                  //Iterating through all the choices of this MCQ

                  if (
                    json2.pages[queNo]["questions"][0]["choices"][i] &&
                    json2.pages[queNo]["questions"][0]["choices"][i].trim() !==
                      ""
                  ) {
                    if (typeof quizAnswers[queNo] !== "undefined") {
                      //Means that the user has already filled the response of the question before and he is right now just reviewing the quiz. So we need to check the checkbox he selected originally
                      var myvar =
                        '<li class = "list-group-item">' +
                        '                <div class="checkbox">' +
                        '                  <input style="margin-left: 0!important;" type="checkbox" id="checkbox" />' +
                        '                  <label for="checkbox">' +
                        json2.pages[queNo]["questions"][0]["choices"][i] +
                        "                  </label>" +
                        "                </div>" +
                        "              </li>";
                      for (var j = 0; j < quizAnswers[queNo].length; j++) {
                        //Checking if this option was checked by user, if yes then add checked attribute to it
                        if (quizAnswers[queNo][j] == i) {
                          var myvar =
                            '<li class = "list-group-item">' +
                            '                <div class="checkbox">' +
                            '                  <input checked style="margin-left: 0!important;" type="checkbox" id="checkbox" />' +
                            '                  <label for="checkbox">' +
                            json2.pages[queNo]["questions"][0]["choices"][i] +
                            "                  </label>" +
                            "                </div>" +
                            "              </li>";
                        }
                      }
                    } else {
                      //User would mark the answer first time
                      var myvar =
                        '<li class = "list-group-item">' +
                        '                <div class="checkbox">' +
                        '                  <input style="margin-left: 0!important;" type="checkbox" id="checkbox" />' +
                        '                  <label for="checkbox">' +
                        json2.pages[queNo]["questions"][0]["choices"][i] +
                        "                  </label>" +
                        "                </div>" +
                        "              </li>";
                    }
                    html = html + myvar;
                  }
                }
                $(".checkboxes").html(html);
                /*-------------------------Making HTML of choices of question number 1  --------------------*/

                $(".checkbox input")
                  .off("change")
                  .on("change", function () {
                    var selected = [];
                    var j = 0;
                    //Iterating over all checkboxes (choices) of the current question and pushing selected choice into queNo index of quizAnswers JSON variable which tracking quiz answers filled by user
                    $.each($("input[type='checkbox']"), function () {
                      if ($(this).is(":checked")) {
                        $(".requiredmessage").addClass("hidden");
                        selected.push(j); //Pushing selected choice(s) in the queNo key of quizAnswers json object tracking user choices of all the questions of the quiz
                        quizAnswers[queNo] = selected;
                      }
                      j++;
                    });
                    quizAnswers[queNo] = selected;
                    var score = 0;
                    for (var i = 1; i < queNo + 1; i++) {
                      if (
                        json2.pages[i]["questions"][0]["type"] == "checkbox"
                      ) {
                        if (
                          quizAnswers[i]
                            .sort()
                            .compare(
                              json2.pages[i]["questions"][0][
                                "correctAnswer"
                              ].sort(),
                            )
                        ) {
                          score = score + 1;
                          questionCorrectIncorrect[i] = "correct";
                        } else {
                          questionCorrectIncorrect[i] = "incorrect";
                        }
                      } else {
                        if (
                          parseInt(quizAnswers[i]) ==
                          json2.pages[i]["questions"][0]["correctAnswer"]
                        ) {
                          score = score + 1;
                          questionCorrectIncorrect[i] = "correct";
                        } else {
                          questionCorrectIncorrect[i] = "incorret";
                        }
                      }
                    }
                    updateInfo(
                      questionCorrectIncorrect,
                      quizAnswers,
                      queNo,
                      element_id,
                      loggedinEmail,
                      score,
                    );
                  });

                if (quizCompleted == true) {
                  //If Quiz has been completed then disable checkboxes and show whether that question was answered correctly or not
                  $("input[type=checkbox]").attr("disabled", true);
                  if (questionCorrectIncorrect[queNo] == "correct") {
                    $(".labelsuccess").removeClass("hidden");
                    $(".labelexplanation").html(
                      json2.pages[queNo]["questions"][0]["explanation"],
                    );
                    $(".labeldanger").addClass("hidden");
                    $(".labelinfo").addClass("hidden");
                  } else {
                    $(".labeldanger").removeClass("hidden");
                    $(".labelexplanation").html(
                      json2.pages[queNo]["questions"][0]["explanation"],
                    );
                    $(".labelsuccess").addClass("hidden");
                    $(".labelinfo").removeClass("hidden");
                    $(".correctanswer").html(
                      options2(
                        json2.pages[queNo]["questions"][0]["correctAnswer"],
                      ),
                    );
                  }
                }
              } else if (
                json2.pages[queNo]["questions"][0]["type"] == "radiogroup"
              ) {
                var html = "";
                for (
                  var i = 0;
                  i < json2.pages[queNo]["questions"][0]["choices"].length;
                  i++
                ) {
                  if (
                    json2.pages[queNo]["questions"][0]["choices"][i] &&
                    json2.pages[queNo]["questions"][0]["choices"][i].trim() !==
                      ""
                  ) {
                    if (
                      typeof quizAnswers[queNo] !== "undefined" &&
                      quizAnswers[queNo] == i
                    ) {
                      var myvar =
                        '<li class = "list-group-item">' +
                        '                <div class="checkbox">' +
                        '                  <input checked value="' +
                        i +
                        '" type="radio" name="radio" id="radio' +
                        i +
                        '" />' +
                        '                  <label for="radio' +
                        i +
                        '">' +
                        json2.pages[queNo]["questions"][0]["choices"][i] +
                        "                  </label>" +
                        "                </div>" +
                        "              </li>";
                    } else {
                      var myvar =
                        '<li class = "list-group-item">' +
                        '                <div class="checkbox">' +
                        '                  <input value="' +
                        i +
                        '" type="radio" name="radio" id="radio' +
                        i +
                        '" />' +
                        '                  <label for="radio' +
                        i +
                        '">' +
                        json2.pages[queNo]["questions"][0]["choices"][i] +
                        "                  </label>" +
                        "                </div>" +
                        "              </li>";
                    }
                    html = html + myvar;
                  }
                  //alert(json2.pages[1]['questions'][0]['choices'][i]);
                }
                $(".checkboxes").html(html);
                $('input:radio[name="radio"]')
                  .off("change")
                  .on("change", function () {
                    var radioValue = $("input[name='radio']:checked").val();
                    if (radioValue) {
                      $(".requiredmessage").addClass("hidden");
                      quizAnswers[queNo] = radioValue;
                      /*============================Calculating Quiz Score, and correctness & incorrectness of each question ===============*/
                      var score = 0;
                      for (var i = 1; i < queNo + 1; i++) {
                        if (
                          json2.pages[i]["questions"][0]["type"] == "checkbox"
                        ) {
                          if (
                            quizAnswers[i]
                              .sort()
                              .compare(
                                json2.pages[i]["questions"][0][
                                  "correctAnswer"
                                ].sort(),
                              )
                          ) {
                            score = score + 1;
                            questionCorrectIncorrect[i] = "correct";
                          } else {
                            questionCorrectIncorrect[i] = "incorrect";
                          }
                        } else {
                          if (
                            parseInt(quizAnswers[i]) ==
                            json2.pages[i]["questions"][0]["correctAnswer"]
                          ) {
                            score = score + 1;
                            questionCorrectIncorrect[i] = "correct";
                          } else {
                            questionCorrectIncorrect[i] = "incorret";
                          }
                        }
                      }
                      updateInfo(
                        questionCorrectIncorrect,
                        quizAnswers,
                        queNo,
                        element_id,
                        loggedinEmail,
                        score,
                      );
                      /*============================Calculating Quiz Score, and correctness & incorrectness of each question ===============*/
                    } else {
                      $(".requiredmessage").removeClass("hidden");
                    }
                  });
                if (quizCompleted == true) {
                  $("input[type=radio]").attr("disabled", "disabled");
                  if (questionCorrectIncorrect[queNo] == "correct") {
                    $(".labelsuccess").removeClass("hidden");
                    $(".labelexplanation").html(
                      json2.pages[queNo]["questions"][0]["explanation"],
                    );
                    $(".labeldanger").addClass("hidden");
                    $(".labelinfo").addClass("hidden");
                  } else {
                    $(".labeldanger").removeClass("hidden");
                    $(".labelsuccess").addClass("hidden");
                    $(".labelexplanation").html(
                      json2.pages[queNo]["questions"][0]["explanation"],
                    );
                    $(".labelinfo").removeClass("hidden");
                    $(".correctanswer").html(
                      options(
                        json2.pages[queNo]["questions"][0]["correctAnswer"],
                      ),
                    );
                  }
                }
              }
            }
          }
        });

      //Logic to execute on clicking Complete button on a Quiz's question page
      $(".quecompletebutton")
        .off("click")
        .on("click", function () {
          $(".queprevbutton").removeAttr("disabled");
          timeOver = true;
          var logicToExecute = 1;
          if (json2.pages[queNo]["questions"][0]["type"] == "checkbox") {
            var selected = [];
            var j = 0;
            //Iterating over all checkboxes (choices) of the current question and pushing selected choice into queNo index of quizAnswers JSON variable which tracking quiz answers filled by user
            $.each($("input[type='checkbox']"), function () {
              if ($(this).is(":checked")) {
                $(".requiredmessage").addClass("hidden");
                selected.push(j); //Pushing selected choice(s) in the queNo key of quizAnswers json object tracking user choices of all the questions of the quiz
                quizAnswers[queNo] = selected;
              }
              j++;
            });
            if (selected.length == 0) {
              //If no checkbox is selected in MCQ more than one correct
              $(".requiredmessage").removeClass("hidden");
              logicToExecute = -1;
            }
          } else {
            var radioValue = $("input[name='radio']:checked").val();
            if (radioValue) {
              $(".requiredmessage").addClass("hidden");
              quizAnswers[queNo] = radioValue;
            } else {
              $(".requiredmessage").removeClass("hidden");
              logicToExecute = -1;
            }
          }

          if (logicToExecute == 1) {
            $(".nextbuttonquiz").removeClass("hidden"); //Show Next button to move to next content

            /*============================Calculating Quiz Score, and correctness & incorrectness of each question ===============*/
            var score = 0;
            for (var i = 1; i < json2.pages.length; i++) {
              if (json2.pages[i]["questions"][0]["type"] == "checkbox") {
                if (
                  quizAnswers[i]
                    .sort()
                    .compare(
                      json2.pages[i]["questions"][0]["correctAnswer"].sort(),
                    )
                ) {
                  score = score + 1;
                  questionCorrectIncorrect[i] = "correct";
                } else {
                  questionCorrectIncorrect[i] = "incorrect";
                }
              } else {
                if (
                  parseInt(quizAnswers[i]) ==
                  json2.pages[i]["questions"][0]["correctAnswer"]
                ) {
                  score = score + 1;
                  questionCorrectIncorrect[i] = "correct";
                } else {
                  questionCorrectIncorrect[i] = "incorret";
                }
              }
            }
            /*============================Calculating Quiz Score, and correctness & incorrectness of each question ===============*/

            //Showing Quiz Score
            $(".correctquestions").html(score);
            $(".totalquestions").html(json2.pages.length - 1);
            $(".quizscore").removeClass("hidden");
            getPercentile(element_id, loggedinEmail, $(".quizpercentile"));
            $("#demo").addClass("hidden");

            //Disabling the last Question as the quiz is finished and showing it's correctness or incorrectness
            if (json2.pages[queNo]["questions"][0]["type"] == "radiogroup") {
              $("input[type='radio']").attr("disabled", true);
              if (questionCorrectIncorrect[queNo] == "correct") {
                $(".labelsuccess").removeClass("hidden");
                $(".labelexplanation").html(
                  json2.pages[queNo]["questions"][0]["explanation"],
                );
                $(".labeldanger").addClass("hidden");
                $(".labelinfo").addClass("hidden");
              } else {
                $(".labeldanger").removeClass("hidden");
                $(".labelexplanation").html(
                  json2.pages[queNo]["questions"][0]["explanation"],
                );
                $(".labelinfo").removeClass("hidden");
                $(".correctanswer").html(
                  options(json2.pages[queNo]["questions"][0]["correctAnswer"]),
                );
                $(".labelsuccess").addClass("hidden");
              }
            } else {
              $("input[type=checkbox]").attr("disabled", true);
              $(".labelexplanation").html(
                json2.pages[queNo]["questions"][0]["explanation"],
              );
              if (questionCorrectIncorrect[queNo] == "correct") {
                $(".labelsuccess").removeClass("hidden");
                $(".labeldanger").addClass("hidden");
                $(".labelinfo").addClass("hidden");
              } else {
                $(".labeldanger").removeClass("hidden");
                $(".labelinfo").removeClass("hidden");
                $(".correctanswer").html(
                  options2(json2.pages[queNo]["questions"][0]["correctAnswer"]),
                );
                $(".labelsuccess").addClass("hidden");
              }
            }
            quizCompleted = true; //Marking Quiz as Completed
            updateQuizCompletionStatus(element_id, loggedinEmail);
            $(".quecompletebutton").attr("disabled", "disabled");
            $.ajax({
              method: "PUT",
              url:
                "/courses/elements/watchedby?id=" +
                element_id +
                "&userid=" +
                loggedinEmail,
              beforeSend: function () {},
              data: {},
            }).done(function (shortenedurl) {
              elarg.children(".fa-check").removeClass("hidden");
            });
          }
        });

      $(".queprevbutton")
        .off("click")
        .on("click", function () {
          $(".quecompletebutton").addClass("hidden");
          //logic
          queNo = queNo - 1;
          $(".currentquestion").html(queNo);
          $(".progressbartext").css(
            "width",
            (queNo * 100) / (json2.pages.length - 1) + "%",
          );
          var totalQuestions = json2.pages.length - 1;
          if (queNo > 1) {
            $(".queprevbutton").removeAttr("disabled");
          } else {
            $(".queprevbutton").attr("disabled", "disabled");
          }
          if (queNo > 0) {
            $(".quenextbutton").removeAttr("disabled").show();
          }
          if (json2.pages[queNo]["questions"][0]["type"] == "checkbox") {
            var totalQuestions = json2.pages.length - 1;
            var progress = (queNo * 100) / totalQuestions;
            $(".progressbartext")
              .attr("aria-valuenow", progress)
              .css("width", progress + "%");
            var html = "";
            for (
              var i = 0;
              i < json2.pages[queNo]["questions"][0]["choices"].length;
              i++
            ) {
              if (
                json2.pages[queNo]["questions"][0]["choices"][i] &&
                json2.pages[queNo]["questions"][0]["choices"][i].trim() !== ""
              ) {
                var myvar =
                  '<li class = "list-group-item">' +
                  '                <div class="checkbox">' +
                  '                  <input style="margin-left: 0!important;" type="checkbox" id="checkbox" />' +
                  '                  <label for="checkbox">' +
                  json2.pages[queNo]["questions"][0]["choices"][i] +
                  "                  </label>" +
                  "                </div>" +
                  "              </li>";
                for (var j = 0; j < quizAnswers[queNo].length; j++) {
                  if (quizAnswers[queNo][j] == i) {
                    var myvar =
                      '<li class = "list-group-item">' +
                      '                <div class="checkbox">' +
                      '                  <input checked style="margin-left: 0!important;" type="checkbox" id="checkbox" />' +
                      '                  <label for="checkbox">' +
                      json2.pages[queNo]["questions"][0]["choices"][i] +
                      "                  </label>" +
                      "                </div>" +
                      "              </li>";
                  }
                }
              } else {
                var myvar = "";
              }
              html = html + myvar;

              //alert(json2.pages[1]['questions'][0]['choices'][i]);
            }
            $(".checkboxes").html(html);
            $(".checkbox input")
              .off("change")
              .on("change", function () {
                var selected = [];
                var j = 0;
                //Iterating over all checkboxes (choices) of the current question and pushing selected choice into queNo index of quizAnswers JSON variable which tracking quiz answers filled by user
                $.each($("input[type='checkbox']"), function () {
                  if ($(this).is(":checked")) {
                    $(".requiredmessage").addClass("hidden");
                    selected.push(j); //Pushing selected choice(s) in the queNo key of quizAnswers json object tracking user choices of all the questions of the quiz
                    quizAnswers[queNo] = selected;
                  }
                  j++;
                });
                quizAnswers[queNo] = selected;
                var score = 0;
                for (var i = 1; i < queNo + 1; i++) {
                  if (json2.pages[i]["questions"][0]["type"] == "checkbox") {
                    if (
                      quizAnswers[i]
                        .sort()
                        .compare(
                          json2.pages[i]["questions"][0][
                            "correctAnswer"
                          ].sort(),
                        )
                    ) {
                      score = score + 1;
                      questionCorrectIncorrect[i] = "correct";
                    } else {
                      questionCorrectIncorrect[i] = "incorrect";
                    }
                  } else {
                    if (
                      parseInt(quizAnswers[i]) ==
                      json2.pages[i]["questions"][0]["correctAnswer"]
                    ) {
                      score = score + 1;
                      questionCorrectIncorrect[i] = "correct";
                    } else {
                      questionCorrectIncorrect[i] = "incorret";
                    }
                  }
                }
                updateInfo(
                  questionCorrectIncorrect,
                  quizAnswers,
                  queNo,
                  element_id,
                  loggedinEmail,
                  score,
                );
              });

            if (quizCompleted == true) {
              $("input[type=checkbox]").attr("disabled", "disabled");
              $(".labelexplanation").html(
                json2.pages[queNo]["questions"][0]["explanation"],
              );
              if (questionCorrectIncorrect[queNo] == "correct") {
                $(".labelsuccess").removeClass("hidden");
                $(".labeldanger").addClass("hidden");
                $(".labelinfo").addClass("hidden");
              } else {
                $(".labeldanger").removeClass("hidden");
                $(".labelsuccess").addClass("hidden");
                $(".labelinfo").removeClass("hidden");
                $(".correctanswer").html(
                  options2(json2.pages[queNo]["questions"][0]["correctAnswer"]),
                );
              }
            }
            $(".currentquestion").html(queNo);
            $(".quizquestion").html(
              queNo + ". " + json2.pages[queNo]["questions"][0]["title"],
            );
          } else if (
            json2.pages[queNo]["questions"][0]["type"] == "radiogroup"
          ) {
            var totalQuestions = json2.pages.length - 1;
            var progress = (queNo * 100) / totalQuestions;
            $(".progressbartext")
              .attr("aria-valuenow", progress)
              .css("width", progress + "%");
            var html = "";
            for (
              var i = 0;
              i < json2.pages[queNo]["questions"][0]["choices"].length;
              i++
            ) {
              if (
                json2.pages[queNo]["questions"][0]["choices"][i] &&
                json2.pages[queNo]["questions"][0]["choices"][i].trim() !== ""
              ) {
                if (quizAnswers[queNo] == i) {
                  var myvar =
                    '<li class = "list-group-item">' +
                    '                <div class="checkbox">' +
                    '                  <input checked value="' +
                    i +
                    '" type="radio" name="radio" id="radio' +
                    i +
                    '" />' +
                    '                  <label for="radio' +
                    i +
                    '">' +
                    json2.pages[queNo]["questions"][0]["choices"][i] +
                    "                  </label>" +
                    "                </div>" +
                    "              </li>";
                } else {
                  var myvar =
                    '<li class = "list-group-item">' +
                    '                <div class="checkbox">' +
                    '                  <input value="' +
                    i +
                    '" type="radio" name="radio" id="radio' +
                    i +
                    '" />' +
                    '                  <label for="radio' +
                    i +
                    '">' +
                    json2.pages[queNo]["questions"][0]["choices"][i] +
                    "                  </label>" +
                    "                </div>" +
                    "              </li>";
                }
              } else {
                var myvar = "";
              }

              html = html + myvar;
              //alert(json2.pages[1]['questions'][0]['choices'][i]);
            }
            $(".requiredmessage").addClass("hidden");
            $(".checkboxes").html(html);
            $('input:radio[name="radio"]')
              .off("change")
              .on("change", function () {
                var radioValue = $("input[name='radio']:checked").val();
                if (radioValue) {
                  $(".requiredmessage").addClass("hidden");
                  quizAnswers[queNo] = radioValue;
                  /*============================Calculating Quiz Score, and correctness & incorrectness of each question ===============*/
                  var score = 0;
                  for (var i = 1; i < queNo + 1; i++) {
                    if (json2.pages[i]["questions"][0]["type"] == "checkbox") {
                      if (
                        quizAnswers[i]
                          .sort()
                          .compare(
                            json2.pages[i]["questions"][0][
                              "correctAnswer"
                            ].sort(),
                          )
                      ) {
                        score = score + 1;
                        questionCorrectIncorrect[i] = "correct";
                      } else {
                        questionCorrectIncorrect[i] = "incorrect";
                      }
                    } else {
                      if (
                        parseInt(quizAnswers[i]) ==
                        json2.pages[i]["questions"][0]["correctAnswer"]
                      ) {
                        score = score + 1;
                        questionCorrectIncorrect[i] = "correct";
                      } else {
                        questionCorrectIncorrect[i] = "incorret";
                      }
                    }
                  }
                  updateInfo(
                    questionCorrectIncorrect,
                    quizAnswers,
                    queNo,
                    element_id,
                    loggedinEmail,
                    score,
                  );
                  /*============================Calculating Quiz Score, and correctness & incorrectness of each question ===============*/
                } else {
                  $(".requiredmessage").removeClass("hidden");
                }
              });
            if (quizCompleted == true) {
              $("input[type=radio]").attr("disabled", "disabled");
              $(".labelexplanation").html(
                json2.pages[queNo]["questions"][0]["explanation"],
              );
              if (questionCorrectIncorrect[queNo] == "correct") {
                $(".labelsuccess").removeClass("hidden");
                $(".labelinfo").addClass("hidden");
                $(".labeldanger").addClass("hidden");
              } else {
                $(".labeldanger").removeClass("hidden");
                $(".labelinfo").removeClass("hidden");
                $(".correctanswer").html(
                  options(json2.pages[queNo]["questions"][0]["correctAnswer"]),
                );
                $(".labelsuccess").addClass("hidden");
              }
            }
            $(".quizstartpage").addClass("hidden");
            $(".quizquestionpage").removeClass("hidden");
            $(".currentquestion").html(queNo);
            $(".quizquestion").html(
              queNo + ". " + json2.pages[queNo]["questions"][0]["title"],
            );
          }
        });
    },
  });
}
