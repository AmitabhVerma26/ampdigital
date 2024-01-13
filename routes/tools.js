var express = require("express");
var passport = require("passport");
var router = express.Router();
var simulatorpoint = require("../models/simulatorpoint");
var simulationppcad = require("../models/simulationppcad");
var moment = require("moment");
var aws = require("aws-sdk");
const {
  getusername,
  randomInteger,
} = require("../utils/common");
const dotenv = require("dotenv");
dotenv.config();

aws.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
});
const fetch = require("node-fetch");
const Bluebird = require("bluebird");

fetch.Promise = Bluebird;
var awsSesMail = require("aws-ses-mail");

var sesMail = new awsSesMail();
var sesConfig = {
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
};
sesMail.setConfig(sesConfig);

/**
 * @swagger
 * /tools/google-ads-simulator:
 *   get:
 *     summary: Google Ads Simulator Tool Page
 *     tags: [Google Ads Simulator Tool]
 *     responses:
 *       '200':
 *         description: Successful response
 */
router.get("/google-ads-simulator", function (req, res) {
  req.session.returnTo = req.path;
  simulatorpoint.aggregate(
    [
      {
        $group: {
          _id: "$name",
          value: { $max: "$totalpoints" },
        },
      },
      { $sort: { value: -1 } },
    ],
    function (err, leaderboard) {
      if (req.isAuthenticated()) {
        var toolids = [];
        simulatorpoint.find({ email: req.user.email }, function (err, docs) {
          for (var i = 0; i < docs.length; i++) {
            toolids.push(docs[i]["id"]);
          }
          res.render("simulatorgoogleads", {
            leaderboard: leaderboard,
            loggedin: "true",
            toolids: toolids.join(","),
            title: "Express",
            active: "all",
            moment: moment,
            email: req.user.email,
            registered: req.user.courses.length > 0 ? true : false,
            recruiter: req.user.role && req.user.role == "3" ? true : false,
            name: getusername(req.user),
            notifications: req.user.notifications,
          });
        });
      } else {
        res.render("simulatorgoogleads", {
          leaderboard: leaderboard,
          loggedin: "false",
          toolids: "",
          title: "Express",
          active: "all",
          moment: moment,
        });
      }
    },
  );
});

/**
 * @swagger
 * /tools/google-ads-simulator:
 *   post:
 *     summary: Submit answers for the Google Ads Simulator Tool
 *     tags: [Google Ads Simulator Tool]
 */
router.post(
  "/google-ads-simulator",
  function (req, res, next) {
    if (!req.isAuthenticated()) {
      next();
    } else {
      var id = JSON.parse(req.body.answers).id;
      var result = JSON.parse(req.body.answers);
      var totalpoints = parseInt(result.totalpoints);
      // res.json(totalpoints);
      var name =
        req.user.local.name +
        " " +
        (req.user.local.lastname ? req.user.local.lastname : "");
      var email = req.user.email;
      simulatorpoint.count({ email: email }, function (err, count2) {
        simulatorpoint.count({ email: email, id: id }, function (err, count) {
          if (count > 0) {
            simulatorpoint.findOneAndUpdate(
              {
                id: id,
                email: email,
              },
              {
                $set: {
                  name: name,
                  totalpoints: totalpoints,
                  input1: req.session.input1,
                  input2: req.session.input2,
                  input3: req.session.input3,
                  input4: req.session.input4,
                  input5: req.session.input5,
                  input6: req.session.input6,
                  date: new Date(),
                },
              },
              function () {
                simulatorpoint.aggregate(
                  [
                    {
                      $group: {
                        _id: "$name",
                        value: { $max: "$totalpoints" },
                      },
                    },
                    { $sort: { value: -1 } },
                  ],
                  function (err, leaderboard) {
                    if (err) {
                      return res.redirect("/");
                    } else {
                      var retry = true;
                      res.render("simulatortoolresult", {
                        leaderboard: leaderboard,
                        id: id,
                        retry: retry,
                        moment: moment,
                        title: result.title,
                        content: result.content,
                        email: req.user.email,
                        registered: req.user.courses.length > 0 ? true : false,
                        recruiter:
                          req.user.role && req.user.role == "3" ? true : false,
                        name: getusername(req.user),
                        notifications: req.user.notifications,
                      });
                      return;
                    }
                  },
                );
              },
            );
          } else if (count == 0) {
            var simulatorpoint2 = new simulatorpoint({
              totalpoints: totalpoints,
              input1: req.session.input1,
              input2: req.session.input2,
              input3: req.session.input3,
              input4: req.session.input4,
              input5: req.session.input5,
              input6: req.session.input6,
              name: name,
              email: email,
              id: id,
              date: new Date(),
            });
            simulatorpoint2.save(function (err) {
              if (err) {
                res.redirect("/");
                return;
              } else {
                simulatorpoint.aggregate(
                  [
                    {
                      $group: {
                        _id: "$name",
                        value: { $max: "$totalpoints" },
                      },
                    },
                    { $sort: { value: -1 } },
                  ],
                  function (err, leaderboard) {
                    var retry = false;
                    if (count2 < 2) {
                      retry = true;
                    }
                    res.render("simulatortoolresult", {
                      leaderboard: leaderboard,
                      id: id,
                      retry: retry,
                      moment: moment,
                      title: result.title,
                      content: result.content,
                      email: req.user.email,
                      registered: req.user.courses.length > 0 ? true : false,
                      recruiter:
                        req.user.role && req.user.role == "3" ? true : false,
                      name: getusername(req.user),
                      notifications: req.user.notifications,
                    });
                    return;
                  },
                );
              }
            });
          } else {
            res.redirect("/");
            return;
          }
        });
      });
    }
  },
  passport.authenticate("local-login", { failureRedirect: "/" }),
  function (req, res) {
    var id = JSON.parse(req.body.answers).id;
    var result = JSON.parse(req.body.answers);
    var totalpoints = result.totalpoints;
    // res.json(totalpoints);
    var name =
      req.user.local.name +
      " " +
      (req.user.local.lastname ? req.user.local.lastname : "");
    var email = req.user.email;
    simulatorpoint.count({ email: email }, function (err, count2) {
      simulatorpoint.count({ email: email, id: id }, function (err, count) {
        console.log("haoieghaeg");
        console.log(count);
        if (count > 0) {
          simulatorpoint.findOneAndUpdate(
            {
              id: id,
              email: email,
            },
            {
              $set: {
                name: name,
                totalpoints: totalpoints,
                date: new Date(),
                input1: req.session.input1,
                input2: req.session.input2,
                input3: req.session.input3,
                input4: req.session.input4,
                input5: req.session.input5,
                input6: req.session.input6,
              },
            },
            function (err) {
              if (err) {
                res.redirect("/");
              } else {
                simulatorpoint.aggregate(
                  [
                    {
                      $group: {
                        _id: "$name",
                        value: { $max: "$totalpoints" },
                      },
                    },
                    { $sort: { value: -1 } },
                  ],
                  function (err, leaderboard) {
                    var retry = true;
                    res.render("simulatortoolresult", {
                      leaderboard: leaderboard,
                      id: id,
                      retry: retry,
                      moment: moment,
                      title: result.title,
                      content: result.content,
                      email: req.user.email,
                      registered: req.user.courses.length > 0 ? true : false,
                      recruiter:
                        req.user.role && req.user.role == "3" ? true : false,
                      name: getusername(req.user),
                      notifications: req.user.notifications,
                    });
                  },
                );
              }
            },
          );
        } else if (count == 0) {
          var simulatorpoint2 = new simulatorpoint({
            totalpoints: totalpoints,
            name: name,
            email: email,
            id: id,
            input1: req.session.input1,
            input2: req.session.input2,
            input3: req.session.input3,
            input4: req.session.input4,
            input5: req.session.input5,
            input6: req.session.input6,
            date: new Date(),
          });
          simulatorpoint2.save(function (err) {
            if (err) {
              res.redirect("/");
            } else {
              simulatorpoint.aggregate(
                [
                  {
                    $group: {
                      _id: "$name",
                      value: { $max: "$totalpoints" },
                    },
                  },
                  { $sort: { value: -1 } },
                ],
                function (err, leaderboard) {
                  var retry = false;
                  if (count2 < 2) {
                    retry = true;
                  }
                  res.render("simulatortoolresult", {
                    leaderboard: leaderboard,
                    id: id,
                    retry: retry,
                    moment: moment,
                    title: result.title,
                    content: result.content,
                    email: req.user.email,
                    registered: req.user.courses.length > 0 ? true : false,
                    recruiter:
                      req.user.role && req.user.role == "3" ? true : false,
                    name: getusername(req.user),
                    notifications: req.user.notifications,
                  });
                },
              );
            }
          });
        } else {
          res.redirect("/");
        }
      });
    });
  },
);

/**
 * @swagger
 * /tools/ppcsimulationtool:
 *   get:
 *     summary: Get a Google Ads Simulator Tool
 *     description: |
 *       This endpoint retrieves a Google Ads Simulator Tool based on the provided query parameters.
 *       If `query_id` is provided, it returns the tool with that ID.
 *       If `ids` is provided, it filters out the tools with the specified IDs.
 *       If no valid parameters are provided, it returns a random Google Ads Simulator Tool.
 *     tags: [Google Ads Simulator Tool]
 *     parameters:
 *       - in: query
 *         name: query_id
 *         description: ID parameter representing the specific tool to retrieve.
 *         schema:
 *           type: string
 *       - in: query
 *         name: ids
 *         description: Comma-separated list of IDs to filter out from the result.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response. Returns the selected Google Ads Simulator Tool.
 *       '404':
 *         description: No tool found matching the provided criteria.
 */
router.get("/ppcsimulationtool", function (req, res) {
  req.session.returnTo = req.path;
  var query = {};
  const { ObjectId } = require("mongodb"); // or ObjectID
  const safeObjectId = (s) => (ObjectId.isValid(s) ? new ObjectId(s) : null);

  if (req.query.query_id) {
    query = { _id: safeObjectId(req.query.query_id) };
  } else if (req.query.ids) {
    var ids = req.query.ids.split(",");
    if (typeof ids !== "undefined" && ids && ids.length < 3) {
      var idarray = [];
      for (var i = 0; i < ids.length; i++) {
        idarray.push(safeObjectId(ids[i]));
      }
      query = { _id: { $nin: idarray } };
    } else if (typeof ids !== "undefined" && ids && ids.length == 3) {
      query = query;
    } else {
      query = { _id: { $ne: safeObjectId(req.query.ids) } };
    }
  }
  simulationppcad.find(query, function (err, tools) {
    if (tools && tools.length > 0) {
      res.json(tools[randomInteger(0, tools.length - 1)]);
    } else {
      res.json(-1);
    }
  });
});

/**
 * @swagger
 * /tools/ppcanswersofuser:
 *   get:
 *     summary: Get PPC simulation answers of a user
 *     description: |
 *       This endpoint retrieves the PPC simulation answers of a user based on the provided email and tool ID.
 *       It returns the answers if available; otherwise, it returns -1.
 *     tags: [Google Ads Simulator Tool]
 *     parameters:
 *       - in: query
 *         name: email
 *         description: Email of the user for whom PPC simulation answers are requested.
 *         schema:
 *           type: string
 *           format: email
 *       - in: query
 *         name: id
 *         description: Tool ID for which the answers are requested.
 *         schema:
 *           type: string
 */
router.get("/ppcanswersofuser", function (req, res) {
  var email = req.query.email;
  var id = req.query.id;
  simulatorpoint.findOne({ email: email, id: id }, function (err, doc) {
    if (doc) {
      res.json(doc);
    } else {
      res.json(-1);
    }
  });
});

/**
 * @swagger
 * /tools/checkanswers:
 *   post:
 *     summary: Check answers for a simulation tool
 *     description: |
 *       This endpoint checks the user's answers for a simulation tool, calculates points, and provides feedback.
 *     tags: [Google Ads Simulator Tool]
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: JSON object containing input data.
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               description: The ID of the simulation tool to check answers for.
 *             input1:
 *               type: array
 *               items:
 *                 type: string
 *               description: The user's answers for question 1.
 *             input2:
 *               type: string
 *               description: The user's answer for question 2.
 *             input3:
 *               type: array
 *               items:
 *                 type: string
 *               description: The user's answers for question 3.
 *             input4:
 *               type: string
 *               description: The user's answer for question 4.
 *             input5:
 *               type: string
 *               description: The user's answer for question 5.
 *             input6:
 *               type: string
 *               description: The user's answer for question 6.
 *     responses:
 *       '200':
 *         description: Successful response. Returns the total points, title, and feedback content.
 */
router.post("/checkanswers", function (req, res) {
  const { ObjectId } = require("mongodb"); // or ObjectID
  const safeObjectId = (s) => (ObjectId.isValid(s) ? new ObjectId(s) : null);
  simulationppcad.findOne(
    { _id: safeObjectId(req.body.id) },
    {
      question1answer: 1,
      question2answer: 1,
      question3answer: 1,
      question4answer: 1,
      question5answer: 1,
      question6answer: 1,
    },
    function (err, tool) {
      if (tool) {
        var points1a = 0;
        var points1b = 0;
        var points1c = 0;
        var points2 = 0;
        var points3 = 0;
        var points4 = 0;
        var points5 = 0;
        var points6 = 0;
        var tips = ``;
        var tips2 = ``;
        var input1 = req.body["input1[]"];
        var input2 = req.body.input2;
        var input3 = req.body["input3[]"];
        var input4 = req.body.input4;
        var input5 = req.body.input5;
        var input6 = req.body.input6;
        var question1answer = tool.question1answer;
        var question2answer = tool.question2answer;
        var question3answer = tool.question3answer;
        var question4answer = tool.question4answer;
        var question5answer = tool.question5answer;
        var question6answer = tool.question6answer;
        // return res.json(req.body);
        if (input4 == question4answer) {
          points4 = points4 + 5;
          tips2 =
            tips2 +
            `<td>
                  Answer 1, ${input4}
                                  </td>
                                  <td>
                                    <span style="color: #28a745;"> Perfect answer</span>
                                    </td>
                              </tr>`;
        } else {
          console.log("input4");
          console.log(input4);
          console.log(question4answer);
          tips2 =
            tips2 +
            `<td>
                Answer 1, ${input4}
                                </td>
                                <td>
                                <span style="color: #dc3545;"> Incorrect answer, Try again</span>
                                </td>
                            </tr>`;
        }
        if (input5 == question5answer) {
          points5 = points5 + 5;
          tips2 =
            tips2 +
            `<td>
                  Answer 2, ${input5}
                                  </td>
                                  <td>
                                    <span style="color: #28a745;"> Perfect answer</span>
                                    </td>
                              </tr>`;
        } else {
          tips2 =
            tips2 +
            `<td>
                Answer 2, ${input5}
                                </td>
                                <td>
                                <span style="color: #dc3545;"> Incorrect answer, Try again</span>
                                </td>
                            </tr>`;
        }
        if (input6 == question6answer) {
          points6 = points6 + 5;
          tips2 =
            tips2 +
            `<td>
                  Answer 3, ${input6}
                                  </td>
                                  <td>
                                    <span style="color: #28a745;"> Perfect answer</span>
                                    </td>
                              </tr>`;
        } else {
          tips2 =
            tips2 +
            `<td>
                Answer 3, ${input6}
                                </td>
                                <td>
                                <span style="color: #dc3545;"> Incorrect answer, Try again</span>
                                </td>
                            </tr>`;
        }
        if (input1[0] == question1answer[0]) {
          points1a = points1a + 15;
          tips =
            tips +
            `<strong>Answer 1, ${input1[0]}</strong>: <span style="color: #28a745;">20 Points, Perfect answer</span><br>`;
          tips2 =
            tips2 +
            `<td>
                Answer 4, ${input1[0]}
                                </td>
                                <td>
                                  <span style="color: #28a745;"> Perfect answer</span>
                                  </td>
                            </tr>`;
        } else if (input1[0] == question1answer[1]) {
          points1a = points1a + 5;
          tips =
            tips +
            `<strong>Answer 1, ${input1[0]}</strong>: <span style="color: #17a2b8;">10 Points, Great answer but it should not be the first choice. Try again by reordering.</span><br>`;
          tips2 =
            tips2 +
            `<td>
                Answer 4, ${input1[0]}
                                </td>
                                <td>
                                  <span style="color: #17a2b8;"> Great answer but it should not be the first choice. Try again by reordering.</span>
                                  </td>
                            </tr>`;
        } else if (input1[0] == question1answer[2]) {
          points1a = points1a + 5;
          tips =
            tips +
            `<strong>Answer 1, ${input1[0]}</strong>: <span style="color: #17a2b8;">10 Points, Great answer but it should not be the first choice. Try again by reordering.</span><br>`;
          tips2 =
            tips2 +
            `<td>
                Answer 4, ${input1[0]}
                                </td>
                                <td>
                                  <span style="color: #17a2b8;"> Great answer but it should not be the first choice. Try again by reordering.</span>
                                  </td>
                            </tr>`;
        } else {
          tips =
            tips +
            `<strong>Answer 1, ${input1[0]}</strong>: <span style="color: #dc3545;">0 Points, Incorrect answer, Try again</span><br>`;
          tips2 =
            tips2 +
            `<td>
                Answer 4, ${input1[0]}
                                </td>
                                <td>
                                  <span style="color: #dc3545;"> Incorrect answer, Try again</span>
                                  </td>
                            </tr>`;
        }
        if (input1[1] == question1answer[0]) {
          points1a = points1a + 5;
          tips =
            tips +
            `<strong>${input1[1]}</strong>: <span style="color: #17a2b8;">10 Points, Great answer but it should not be the second choice. Try again by reordering.</span><br>`;
          tips2 =
            tips2 +
            `<td>
                Answer 4, ${input1[1]}
                                </td>
                                <td>
                                  <span style="color: #17a2b8;"> Great answer but it should not be the second choice. Try again by reordering.</span>
                                  </td>
                            </tr>`;
        } else if (input1[1] == question1answer[1]) {
          points1a = points1a + 15;
          tips =
            tips +
            `<strong>${input1[1]}</strong>: <span style="color: #28a745;">20 Points, Perfect answer</span><br>`;
          tips2 =
            tips2 +
            `<td>
                Answer 4, ${input1[1]}
                                </td>
                                <td>
                                  <span style="color: #28a745;"> Perfect answer</span>
                                  </td>
                            </tr>`;
        } else if (input1[1] == question1answer[2]) {
          points1a = points1a + 5;
          tips =
            tips +
            `<strong>${input1[1]}</strong>: <span style="color: #17a2b8;">10 Points, Great answer but it should not be the second choice. Try again by reordering.</span><br>`;
          tips2 =
            tips2 +
            `<td>
                Answer 4, ${input1[1]}
                                </td>
                                <td>
                                  <span style="color: #17a2b8;"> Great answer but it should not be the second choice. Try again by reordering.</span>
                                  </td>
                            </tr>`;
        } else {
          tips =
            tips +
            `<strong>${input1[1]}</strong>: <span style="color: #dc3545;">0 Points, Incorrect answer, Try again</span><br>`;
          tips2 =
            tips2 +
            `<td>
                Answer 4, ${input1[1]}
                                </td>
                                <td>
                                  <span style="color: #dc3545;"> Incorrect answer, Try again</span>
                                  </td>
                            </tr>`;
        }
        if (input1[2] == question1answer[0]) {
          points1a = points1a + 5;
          tips =
            tips +
            `<strong>Answer 1, ${input1[2]}</strong>: <span style="color: #17a2b8;">10 Points, Great answer but it should not be the third choice. Try again by reordering.</span><br>`;
          tips2 =
            tips2 +
            `<td>
                Answer 4, ${input1[2]}
                                </td>
                                <td>
                                  <span style="color: #17a2b8;"> Great answer but it should not be the third choice. Try again by reordering.</span>
                                  </td>
                            </tr>`;
        } else if (input1[2] == question1answer[1]) {
          points1a = points1a + 5;
          tips =
            tips +
            `<strong>${input1[2]}</strong>: <span style="color: #17a2b8;">10 Points, Great answer but it should not be the third choice. Try again by reordering.</span><br>`;
          tips2 =
            tips2 +
            `<td>
                Answer 4, ${input1[2]}
                                </td>
                                <td>
                                  <span style="color: #17a2b8;"> Great answer but it should not be the third choice. Try again by reordering.</span>
                                  </td>
                            </tr>`;
        } else if (input1[2] == question1answer[2]) {
          points1a = points1a + 15;
          tips =
            tips +
            `<strong>${input1[2]}</strong>: <span style="color: #28a745;">20 Points, Perfect answer</span><br>`;
          tips2 =
            tips2 +
            `<td>
                Answer 4, ${input1[2]}
                                </td>
                                <td>
                                  <span style="color: #28a745;"> Perfect answer</span>
                                  </td>
                            </tr>`;
        } else {
          tips =
            tips +
            `<strong>${input1[2]}</strong>: <span style="color: #dc3545;">0 Points, Incorrect answer, Try again</span><br>`;
          tips2 =
            tips2 +
            `<td>
                Answer 4, ${input1[2]}
                                </td>
                                <td>
                                  <span style="color: #dc3545;"> Incorrect answer, Try again</span>
                                  </td>
                            </tr>`;
        }
        if (input2 == question2answer) {
          points2 = points2 + 15;
          tips =
            tips +
            `<strong>Answer 2, ${input2}</strong>: <span style="color: #28a745;">20 Points, Perfect answer</span><br>`;
          tips2 =
            tips2 +
            `<td>
                Answer 5, ${input2}
                                </td>
                                <td>
                                  <span style="color: #28a745;"> Perfect answer</span>
                                  </td>
                            </tr>`;
        } else {
          tips =
            tips +
            `<strong>Answer 2, ${input2}</strong>: <span style="color: #dc3545;">0 Points, Incorrect answer, Try again</span><br>`;
          tips2 =
            tips2 +
            `<td>
                Answer 5, ${input2}
                                </td>
                                <td>
                                  <span style="color: #dc3545;"> Incorrect answer, Try again</span>
                                  </td>
                            </tr>`;
        }
        if (
          input3[0] == question3answer[0] ||
          input3[0] == question3answer[1]
        ) {
          points3 = points3 + 5;
          tips =
            tips +
            `<strong>Answer 3, ${input3[0]}</strong>: <span style="color: #28a745;">20 Points, Perfect answer</span><br>`;
          tips2 =
            tips2 +
            `<td>
                Answer 6, ${input3[0]}
                                </td>
                                <td>
                                  <span style="color: #28a745;"> Perfect answer</span>
                                  </td>
                            </tr>`;
        } else {
          tips =
            tips +
            `<strong>Answer 3, ${input3[0]}</strong>: <span style="color: #dc3545;">0 Points, Incorrect answer, Try again</span><br>`;
          tips2 =
            tips2 +
            `<td>
                Answer 6, ${input3[0]}
                                </td>
                                <td>
                                  <span style="color: #dc3545;"> Incorrect answer, Try again</span>
                                  </td>
                            </tr>`;
        }
        if (
          input3[1] == question3answer[0] ||
          input3[1] == question3answer[1]
        ) {
          points3 = points3 + 5;
          tips =
            tips +
            `<strong>Answer 1, ${input3[1]}</strong>: <span style="color: #17a2b8;">10 Points, Great answer but it should not be the first choice. Try again by reordering.</span><br>`;
          tips2 =
            tips2 +
            `<td>
                Answer 6, ${input3[1]}
                                </td>
                                <td>
                                  <span style="color: #28a745;"> Perfect answer</span>
                                  </td>
                            </tr>`;
        } else {
          tips =
            tips +
            `<strong>Answer 3, ${input3[1]}</strong>: <span style="color: #dc3545;">0 Points, Incorrect answer, Try again</span><br>`;
          tips2 =
            tips2 +
            `<td>
                Answer 6, ${input3[1]}
                                </td>
                                <td>
                                  <span style="color: #dc3545;"> Incorrect answer, Try again</span>
                                  </td>
                            </tr>`;
        }
        var totalpoints =
          points1a +
          points1b +
          points1c +
          points2 +
          points3 +
          points4 +
          points5 +
          points6;
        var title;
        if (totalpoints < 15) {
          title = "You are a Newbie";
        } else if (totalpoints > 14 && totalpoints < 40) {
          title = "You are a Novice";
        } else if (totalpoints > 39 && totalpoints < 60) {
          title = "You are a Learner";
        } else if (totalpoints > 59 && totalpoints < 60) {
          title = "You are a Competent";
        } else if (totalpoints > 59 && totalpoints < 70) {
          title = "You are an Achiever!";
        } else if (totalpoints > 69 && totalpoints < 80) {
          title = "You are Proficient!";
        } else if (totalpoints > 79 && totalpoints < 90) {
          title = "You are an Expert!";
        } else if (totalpoints > 89 && totalpoints < 101) {
          title = "You are a Champion!";
        }

        var content = `<strong>You got ${totalpoints} Points of 100 </strong> <br> Here is your score summary: <br> ${tips}`;

        var content = `<div data-href="/courses/digital-marketing-course" style="cursor: pointer;">
  <div class="course-body text-center">
    <strong><span style="font-size: X-LARGE;">You scored ${totalpoints}%</span> </strong> <br> Here is summary of your score: <br>
    <div class="table-responsive text-left">
                    <table class="table table-hover earning-box">
                            <tr>
                                <th>You Selected</th>
                                <th>Comments</th>
                            </tr>
                            ${tips2}
                    </table>
                </div>
  </div>
</div>`;
        if (!req.isAuthenticated()) {
          req.session.input1 = req.body["input1[]"];
          req.session.input2 = req.body.input2;
          req.session.input3 = req.body["input3[]"];
          req.session.input4 = req.body.input4;
          req.session.input5 = req.body.input5;
          req.session.input6 = req.body.input6;
          res.json({
            totalpoints: totalpoints,
            title: title,
            content: content,
            columnClass: "xlarge",
          });
        } else {
          req.session.input1 = req.body["input1[]"];
          req.session.input2 = req.body.input2;
          req.session.input3 = req.body["input3[]"];
          req.session.input4 = req.body.input4;
          req.session.input5 = req.body.input5;
          req.session.input6 = req.body.input6;
          console.log("__aehigaehgp");
          simulatorpoint.count(
            { email: req.user.email, id: req.body.id },
            function () {
              if (1) {
                simulatorpoint.findOneAndUpdate(
                  {
                    id: req.body.id,
                    email: req.user.email,
                  },
                  {
                    $set: {
                      totalpoints: totalpoints,
                      input1: req.body["input1[]"],
                      input2: req.body.input2,
                      name:
                        req.user.local.name +
                        " " +
                        (req.user.local.lastname
                          ? req.user.local.lastname
                          : ""),
                      id: req.body.id,
                      email: req.user.email,
                      input3: req.body["input3[]"],
                      input4: req.body.input4,
                      input5: req.body.input5,
                      input6: req.body.input6,
                      date: new Date(),
                    },
                  },
                  { upsert: true },
                  function (err) {
                    if (err) {
                      res.json(err);
                    } else {
                      res.json({
                        totalpoints: totalpoints,
                        title: title,
                        content: content,
                        columnClass: "xlarge",
                      });
                    }
                  },
                );
              }
            },
          );
        }
      } else {
        res.json(-1);
      }
    },
  );
});


module.exports = router;
