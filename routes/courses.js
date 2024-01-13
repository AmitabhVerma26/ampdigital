var express = require("express");
var router = express.Router();
var submission = require("../models/submission");
var lmsCourses = require("../models/courses");
var lmsModules = require("../models/modules");
var lmsTopics = require("../models/topics");
var lmsElements = require("../models/elements");
var lmsQuiz = require("../models/quiz");
var lmsUsers = require("../models/user");
var faqModel = require("../models/faq");
var lmsQuizlog = require("../models/quizlog");
var lmsQueLog = require("../models/quelog");
var moment = require("moment");
var aws = require("aws-sdk");
const dotenv = require("dotenv");
dotenv.config();
aws.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
});
var s3 = new aws.S3();

var awsSesMail = require("aws-ses-mail");
const { getusername, isAdmin } = require("../utils/common");
const coupon = require("../models/coupon");
const { getContactInformationHtml } = require("../utils/html_templates");

var sesMail = new awsSesMail();
var sesConfig = {
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
};
sesMail.setConfig(sesConfig);

/**
 * @swagger
 * /courses/accomplishments/{userid}/{courseurl}:
 *   get:
 *     summary: Get course certificate page
 *     description: |
 *       This endpoint retrieves the course certificate page for a specific user and course.
 *     tags: [Course Accomplishments]
 *     parameters:
 *       - in: path
 *         name: userid
 *         required: true
 *         description: The ID of the user.
 *         schema:
 *           type: string
 *       - in: path
 *         name: courseurl
 *         required: true
 *         description: The URL of the course.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response. Renders the accomplishments page.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Rendered HTML content of the accomplishments page.
 *       '404':
 *         description: User or course not found.
 *         schema:
 *           type: integer
 *           example: -1
 */
router.get("/accomplishments/:userid/:courseurl", function (req, res) {
  req.session.returnTo = req.path;
  lmsUsers.findOne({ _id: req.params.userid }, function (err, user) {
    if (user) {
      lmsCourses.findOne(
        { deleted: { $ne: "true" }, course_url: req.params.courseurl },
        function (err, course) {
          if (course) {
            if (req.isAuthenticated()) {
              res.render("courses/accomplishments", {
                moment: moment,
                verification_url: "www.ampdigital.co" + req.originalUrl,
                certificateuser: user,
                course: course,
                success: "_",
                title: "Express",
                email: req.user.email,
                registered: req.user.courses.length > 0 ? true : false,
                recruiter: req.user.role && req.user.role == "3" ? true : false,
                name: getusername(req.user),
                notifications: req.user.notifications,
              });
            } else {
              res.render("courses/accomplishments", {
                moment: moment,
                verification_url: "www.ampdigital.co" + req.originalUrl,
                certificateuser: user,
                title: "Express",
                course: course,
              });
            }
          }
          else{
            res.status(404).json('Course not found'); // User or course not found
          }
        },
      );
    } else {
      res.status(404).json('User not found'); // User or course not found
    }
  });
});

/**
 * @swagger
 * /courses/accomplishments/update:
 *   put:
 *     summary: Update user's certificates after providing a course certificate
 *     description: |
 *       This endpoint updates the user's certificates after providing a course certificate.
 *       It also sends a congratulatory email to the user.
 *     tags: [Course Accomplishments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: The ID of the user.
 *               name:
 *                 type: string
 *                 description: The name of the user.
 *               email:
 *                 type: string
 *                 description: The email address of the user.
 *               courses:
 *                 type: string
 *                 description: A comma-separated string of course IDs.
 */
router.put("/accomplishments/update", function (req, res) {
  var arr = [];
  if (req.body.length > 1) {
    var temp = req.body.courses.split(",");
    for (var i = 0; i < temp.length; i++) {
      arr.push(temp[i]);
    }
  } else if (req.body.length == 1) {
    arr.push(req.body.courses);
  } else if (req.body.length == 0) {
    arr = [];
  }
  lmsUsers.findOneAndUpdate(
    {
      _id: req.body.id,
    },
    {
      $set: { certificates: arr },
    },
    function (err) {
      if (err) {
        res.json(-1);
      } else {
        // res.json(1);
        var awsSesMail = require("aws-ses-mail");

        var sesMail = new awsSesMail();
        var sesConfig = {
          accessKeyId: process.env.ACCESS_KEY_ID,
          secretAccessKey: process.env.SECRET_ACCESS_KEY,
          region: process.env.REGION,
        };
        sesMail.setConfig(sesConfig);

        var html =
          `Hello ${req.body.name},<br>\n` +
          "<br>\n" +
          "Congratulations! You did it. You've successfully completed the course. <br>\n" +
          "AMP Digital has issued an official Course Certificate to you. <br>" +
          '<br> <a style="text-decoration: none!important;" href="http://www.ampdigital.co/courses/accomplishments/' +
          req.body.id +
          '"><div style="width:220px;color:#ffffff;background-color:#7fbf4d;border:1px solid #63a62f;border-bottom:1px solid #5b992b;background-image:-webkit-linear-gradient(top,#7fbf4d,#63a62f);background-image:-moz-linear-gradient(top,#7fbf4d,#63a62f);background-image:-ms-linear-gradient(top,#7fbf4d,#63a62f);background-image:-o-linear-gradient(top,#7fbf4d,#63a62f);background-image:linear-gradient(top,#7fbf4d,#63a62f);border-radius:3px;line-height:1;padding:1%;text-align:center"><span>View Your Accomplishments</span></div></a>' +
          "\n <br>" +
          "<p>" +
          "Please download the certificate on the desktop or laptop for better resolution. <br><br>" +
          "</p> Thanks, <br>" +
          getContactInformationHtml();

        var options = {
          from: "ampdigital.co <amitabh@ads4growth.com>",
          to: req.body.email,
          subject: "Congratulations, Your Course Certificate is Ready!",
          content: "<html><head></head><body>" + html + "</body></html>",
        };

        sesMail.sendEmail(options, function (err, data) {
          console.log(err);
          res.json(1);
        });
      }
    },
  );
});

/**
 * @swagger
 * /courses/accomplishments/{userid}:
 *   get:
 *     summary: Get user's certificates and accomplishments
 *     description: |
 *       This endpoint retrieves the certificates and accomplishments of a user.
 *     tags: [Course Accomplishments]
 *     parameters:
 *       - in: path
 *         name: userid
 *         required: true
 *         description: The ID of the user.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response. User's certificates and accomplishments retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 moment:
 *                   type: string
 *                 certificateuser:
 *                   type: object
 *                   # Include properties based on the actual structure of the 'lmsUsers' model
 *                 title:
 *                   type: string
 *                 courses:
 *                   type: array
 *                   items:
 *                     type: object
 *                     # Include properties based on the actual structure of the 'lmsCourses' model
 *                 email:
 *                   type: string
 *                 registered:
 *                   type: boolean
 *                 recruiter:
 *                   type: boolean
 *                 name:
 *                   type: string
 *                 notifications:
 *                   type: array
 *                   items:
 *                     type: object
 *                     # Include properties based on the actual structure of the 'notifications' model
 *       '404':
 *         description: User not found.
 *         schema:
 *           type: integer
 *           example: -1
 */
router.get("/accomplishments/:userid", function (req, res) {
  req.session.returnTo = req.path;
  lmsUsers.findOne({ _id: req.params.userid }, function (err, user) {
    if (user) {
      if (req.isAuthenticated()) {
        if (user.certificates) {
          lmsCourses.find(
            { deleted: { $ne: "true" }, _id: { $in: user.certificates } },
            function (err, certificates) {
              res.render("courses/certificates", {
                moment: moment,
                certificateuser: user,
                title: "Express",
                courses: certificates,
                email: req.user.email,
                registered: req.user.courses.length > 0 ? true : false,
                recruiter: req.user.role && req.user.role == "3" ? true : false,
                name: getusername(req.user),
                notifications: req.user.notifications,
              });
            },
          );
        }
      } else {
        if (user.certificates) {
          lmsCourses.find(
            { deleted: { $ne: "true" }, _id: { $in: user.certificates } },
            function (err, certificates) {
              res.render("courses/certificates", {
                moment: moment,
                certificateuser: user,
                title: "Express",
                courses: certificates,
              });
            },
          );
        }
      }
    } else {
      res.status(404).json('User not found'); // User not found
    }
  });
});

/**
 * Upload assignment image
 */
router.put("/assignment/uploadimage", function (req, res) {
  const { ObjectId } = require("mongodb"); // or ObjectID
  const safeObjectId = (s) => (ObjectId.isValid(s) ? new ObjectId(s) : null);

  var doc = req.body.image;
  var element_id = req.body.id;

  lmsElements.findOne(
    { _id: safeObjectId(element_id) },
    function (err, element) {
      if (element) {
        lmsCourses.findOne(
          { _id: safeObjectId(element.element_course_id) },
          function (err, course) {
            lmsModules.findOne(
              { _id: safeObjectId(element.element_module_id) },
              function (err, moduleObj) {
                lmsTopics.findOne(
                  { _id: safeObjectId(element.element_taskid) },
                  function (err, topic) {
                    if (course && moduleObj && topic) {
                      var submission2 = new submission({
                        course_name: course.course_name,
                        module_name: moduleObj.module_name,
                        topic_name: topic.topic_name,
                        assignment_name: element.element_name,
                        assignment_id: element_id,
                        doc_url: doc,
                        submitted_by_name: getusername(req.user),
                        notifications: req.user.notifications,
                        submitted_by_email: req.user.email,
                        submitted_on: new Date(),
                      });
                      submission2.save(function (err, results) {
                        if (err) {
                          res.json(err);
                        } else {
                          var awsSesMail = require("aws-ses-mail");

                          var sesMail = new awsSesMail();
                          var sesConfig = {
                            accessKeyId: process.env.ACCESS_KEY_ID,
                            secretAccessKey: process.env.SECRET_ACCESS_KEY,
                            region: process.env.REGION,
                          };
                          sesMail.setConfig(sesConfig);

                          var html =
                            "Hello from AMP Digital,<br>\n" +
                            "<br>\n" +
                            `${getusername(
                              req.user,
                            )} has submitted assignment: ${
                              element.element_name
                            } on topic ${topic.topic_name} of module ${
                              moduleObj.module_name
                            } of course ${
                              course.course_name
                            }. Please go to admin panel and review.` +
                            "<br>\n" +
                            "Best Wishes," +
                            "<br>" +
                            getContactInformationHtml();
                          var options = {
                            from: "ampdigital.co <amitabh@ads4growth.com>",
                            to: [
                              "siddharthsogani22@gmail.com",
                              "rakhee@ads4growth.com",
                              "amitabh@ads4growth.com",
                            ],
                            subject: "ampdigital.co: Assignment Submission",
                            content:
                              "<html><head></head><body>" +
                              html +
                              "</body></html>",
                          };

                          sesMail.sendEmail(options, function (err) {
                            // TODO sth....
                            console.log(err);
                            res.json(results);
                          });
                        }
                      });
                    }
                  },
                );
              },
            );
          },
        );
      }
    },
  );
});

/**
 * @swagger
 * /courses/submissions/manage:
 *   get:
 *     summary: Get the page to manage course assignment submissions (Admin Only).
 *     tags: [Course Assignment Submissions]
 */
router.get("/submissions/manage", isAdmin, function (req, res) {
  lmsCourses.find({ deleted: { $ne: "true" } }, function (err, courses) {
    res.render("adminpanel/submissions", {
      courses: courses,
      email: req.user.email,
      registered: req.user.courses.length > 0 ? true : false,
      recruiter: req.user.role && req.user.role == "3" ? true : false,
      moment: moment,
    });
  });
});

/**
 * @swagger
 * /courses/submissions/datatable:
 *   get:
 *     summary: Get DataTables server-side script for course assignment submissions.
 *     tags: [Course Assignment Submissions]
 */
router.get("/submissions/datatable", function (req, res) {
  /*
   * Script:    DataTables server-side script for NODE and MONGODB
   * Copyright: 2018 - Siddharth Sogani
   */

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Easy set variables
   */

  /* Array of columns to be displayed in DataTable
   */
  var $aColumns = [
    "submitted_by_name",
    "submitted_by_email",
    "assignment_name",
    "topic_name",
    "module_name",
    "course_name",
    "doc_url",
    "submitted_on",
    "grade",
  ];

  /*
   * Paging
   */
  var $sDisplayStart = 0;
  var $sLength = "";
  if (req.query.iDisplayStart && req.query.iDisplayLength != "-1") {
    $sDisplayStart = req.query.iDisplayStart;
    $sLength = req.query.iDisplayLength;
  }

  var query = { deleted: { $ne: true } };
  /*
   * Filtering
   * NOTE this does not match the built-in DataTables filtering which does it
   * word by word on any field. It's possible to do here, but concerned about efficiency
   * on very large tables, and MySQL's regex functionality is very limited
   */
  if (req.query.sSearch != "") {
    var arr = [
      {
        submitted_by_name: {
          $regex: "" + req.query.sSearch + "",
          $options: "i",
        },
      },
      {
        submitted_by_email: {
          $regex: "" + req.query.sSearch + "",
          $options: "i",
        },
      },
      {
        assignment_name: { $regex: "" + req.query.sSearch + "", $options: "i" },
      },
      { topic_name: { $regex: "" + req.query.sSearch + "", $options: "i" } },
      { module_name: { $regex: "" + req.query.sSearch + "", $options: "i" } },
      { course_name: { $regex: "" + req.query.sSearch + "", $options: "i" } },
    ];
    query.$or = arr;
  }

  var filterArray = [];
  if (req.query.fromdatefilter !== "") {
    console.log("11111");
    filterArray.push({
      submitted_on: { $gte: req.query.fromdatefilter + " 00:00" },
    });
    query.$and = filterArray;
  }
  if (req.query.todatefilter !== "") {
    console.log("1111");
    filterArray.push({
      submitted_on: { $lte: req.query.todatefilter + " 23:59" },
    });
    query.$and = filterArray;
  }
  if (req.query.purposefilter !== "") {
    console.log("222");
    filterArray.push({ course_name: req.query.purposefilter });
    query.$and = filterArray;
  }

  /*
   * Ordering
   */
  var sortObject = { date: -1 };
  if (req.query.iSortCol_0 && req.query.iSortCol_0 == 0) {
    if (req.query.sSortDir_0 == "desc") {
      var sortObject = {};
      var stype = "submitted_by_name";
      var sdir = -1;
      sortObject[stype] = sdir;
    } else {
      var sortObject = {};
      var stype = "submitted_by_name";
      var sdir = 1;
      sortObject[stype] = sdir;
    }
  } else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 1) {
    if (req.query.sSortDir_0 == "desc") {
      var sortObject = {};
      var stype = "submitted_by_email";
      var sdir = -1;
      sortObject[stype] = sdir;
    } else {
      var sortObject = {};
      var stype = "submitted_by_email";
      var sdir = 1;
      sortObject[stype] = sdir;
    }
  } else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 2) {
    if (req.query.sSortDir_0 == "desc") {
      var sortObject = {};
      var stype = "assignment_name";
      var sdir = -1;
      sortObject[stype] = sdir;
    } else {
      var sortObject = {};
      var stype = "assignment_name";
      var sdir = 1;
      sortObject[stype] = sdir;
    }
  } else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 3) {
    if (req.query.sSortDir_0 == "desc") {
      var sortObject = {};
      var stype = "topic_name";
      var sdir = -1;
      sortObject[stype] = sdir;
    } else {
      var sortObject = {};
      var stype = "topic_name";
      var sdir = 1;
      sortObject[stype] = sdir;
    }
  } else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 4) {
    if (req.query.sSortDir_0 == "desc") {
      var sortObject = {};
      var stype = "module_name";
      var sdir = -1;
      sortObject[stype] = sdir;
    } else {
      var sortObject = {};
      var stype = "module_name";
      var sdir = 1;
      sortObject[stype] = sdir;
    }
  } else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 5) {
    if (req.query.sSortDir_0 == "desc") {
      var sortObject = {};
      var stype = "course_name";
      var sdir = -1;
      sortObject[stype] = sdir;
    } else {
      var sortObject = {};
      var stype = "course_name";
      var sdir = 1;
      sortObject[stype] = sdir;
    }
  }

  submission
    .find(query)
    .skip(parseInt($sDisplayStart))
    .limit(parseInt($sLength))
    .sort(sortObject)
    .exec(function (err, docs) {
      submission.count(query, function (err, count) {
        var aaData = [];
        for (let i = 0; i < docs.length; i++) {
          var $row = [];
          for (var j = 0; j < $aColumns.length; j++) {
            if ($aColumns[j] == "submitted_by_name") {
              $row.push(docs[i][$aColumns[j]]);
            } else if ($aColumns[j] == "submitted_by_email") {
              $row.push(docs[i][$aColumns[j]]);
            } else if ($aColumns[j] == "assignment_name") {
              $row.push(docs[i][$aColumns[j]]);
            } else if ($aColumns[j] == "topic_name") {
              $row.push(docs[i][$aColumns[j]]);
            } else if ($aColumns[j] == "module_name") {
              $row.push(docs[i][$aColumns[j]]);
            } else if ($aColumns[j] == "course_name") {
              $row.push(docs[i][$aColumns[j]]);
            } else if ($aColumns[j] == "doc_url") {
              $row.push(
                `<a target="_blank" href="${
                  docs[i][$aColumns[j]]
                }">Download</a>`,
              );
            } else if ($aColumns[j] == "submitted_on") {
              $row.push(
                moment(docs[i]["submitted_on"]).format("DD/MMM/YYYY HH:mm A"),
              );
            } else {
              $row.push(
                `<button class="btn btn-primary btn-sm">Grade</button>`,
              );
            }
          }
          aaData.push($row);
        }
        var sample = {
          sEcho: req.query.sEcho,
          iTotalRecords: count,
          iTotalDisplayRecords: count,
          aaData: aaData,
        };
        res.json(sample);
      });
    });
});

/**
 * @swagger
 * /courses/submissions/exists:
 *   get:
 *     summary: Check if a submission exists for a given assignment and user.
 *     tags: [Course Assignment Submissions]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: Assignment ID to check.
 *         schema:
 *           type: string
 *       - in: query
 *         name: userid
 *         required: true
 *         description: User ID to check for submission.
 *         schema:
 *           type: string
 */
router.get("/submissions/exists", function (req, res) {
  submission.findOne(
    { assignment_id: req.query.id, submitted_by_email: req.query.userid },
    function (err, submission) {
      if (err) {
        res.json(err);
      } else if (submission) {
        res.json({ exists: true, submission: submission });
      } else {
        res.json({ exists: false, submission: null });
      }
    },
  );
});

/**
 * @swagger
 * /courses/coupons/manage:
 *   get:
 *     summary: Get a list of all coupons (requires admin privileges).
 *     tags: [Courses]
 */
router.get("/coupons/manage", isAdmin, function (req, res) {
  coupon.find({}, function (err, docs) {
    res.render("adminpanel/manage_coupons", {
      docs: docs,
      email: req.user.email,
      moment: moment,
    });
  });
});

/**
 * @swagger
 * /courses/coupons/manage/createcouponcode:
 *   post:
 *     summary: Create a new coupon code
 *     tags: [Courses]
 *     parameters:
 *       - in: body
 *         name: couponData
 *         required: true
 *         description: JSON object containing coupon details
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             discount:
 *               type: number
 *             type:
 *               type: string
 *             validfrom:
 *               type: string
 *               format: date
 *             validto:
 *               type: string
 *               format: date
 *     responses:
 *       '200':
 *         description: Successfully created the coupon code
 *       '500':
 *         description: Internal server error
 */
router.post("/coupons/manage/createcouponcode", function (req, res) {
  var name = req.body.name;
  var discount = req.body.discount;
  var type = req.body.type;
  var validfrom = req.body.validfrom;
  var validto = req.body.validto;
  var created = new Date();
  var deleted = false;
  var couponcode = new coupon({
    name: name,
    discount: discount,
    type: type,
    validfrom: validfrom,
    validto: validto,
    created: created,
    deleted: deleted,
  });

  couponcode.save(function (err) {
    if (err) {
      return res.status(500).json({ error: 'Internal Server Error' });
    } else {
      //res.json(results._id);
      res.redirect("/courses/coupons/manage");
    }
  });
});

/**
 * @swagger
 * /courses/report/manage:
 *   get:
 *     summary: Get course reports
 *     tags: [Course reports]
 */
router.get("/report/manage", isAdmin, function (req, res) {
  req.session.returnTo = req.session.returnTo = req.baseUrl + req.url;
  lmsCourses.find({ deleted: { $ne: "true" } }, function (err, courses) {
    lmsUsers.find(
      { courses: { $exists: true, $not: { $size: 0 } } },
      function (err, users) {
        res.render("adminpanel/courseprogress", {
          docs: users,
          courses: courses,
          email: req.user.email,
          registered: req.user.courses.length > 0 ? true : false,
          recruiter: req.user.role && req.user.role == "3" ? true : false,
          name: getusername(req.user),
          notifications: req.user.notifications,
        });
      },
    );
  });
});

/**
 * @swagger
 * /courses/report/manage/getnamefromemail:
 *   get:
 *     summary: Get user name based on email
 *     tags: [Course reports]
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         description: User email for which to retrieve the name
 *         schema:
 *           type: string
 *           format: email
 */
router.get("/report/manage/getnamefromemail", function (req, res) {
  lmsUsers.findOne({ email: req.query.email }, function (err, user) {
    if (user) {
      res.json(user.local.name);
    } else {
      //User not found
      res.json(-1);
    }
  });
});

/**
 * @swagger
 * /courses/report/progress/{courseid}:
 *   get:
 *     summary: Get percentage course completion
 *     tags: [Course reports]
 *     parameters:
 *       - in: path
 *         name: courseid
 *         required: true
 *         description: ID of the course to retrieve progress for
 *         schema:
 *           type: string
 *       - in: query
 *         name: email
 *         required: true
 *         description: User email for which to retrieve the course progress
 *         schema:
 *           type: string
 *           format: email
 *     responses:
 *       '200':
 *         description: Successfully retrieved percentage course completion
 *       '500':
 *         description: Internal server error
 */
router.get("/report/progress/:courseid", function (req, res) {
  var email = req.query.email;
  const { ObjectId } = require("mongodb"); // or ObjectID
  const safeObjectId = (s) => (ObjectId.isValid(s) ? new ObjectId(s) : null);
  lmsModules.find(
    { course_id: req.params.courseid, deleted: { $ne: "true" } },
    function (err, modules) {
      if(err){
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      modules.sort(function (a, b) {
        var keyA = a.module_order,
          keyB = b.module_order;
        // Compare the 2 dates
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
      });
      var jobQueries = [];
      var jobQueries2 = [];
      var countModules = modules.length;
      for (var i = 0; i < modules.length; i++) {
        jobQueries.push(
          lmsElements.find({
            element_module_id: safeObjectId(modules[i]["_id"]),
            deleted: { $ne: "true" },
          }),
        );
      }
      for (var i = 0; i < modules.length; i++) {
        jobQueries2.push(
          lmsElements.find({
            element_module_id: safeObjectId(modules[i]["_id"]),
            deleted: { $ne: "true" },
            watchedby: email,
          }),
        );
      }

      Promise.all(jobQueries).then(function (listOfJobs) {
        Promise.all(jobQueries2).then(function (listOfJobs2) {
          for (var i = 0; i < jobQueries.length; i++) {
            var temp = 0;
            for (var j = 0; j < listOfJobs[i].length; j++) {
              // if(listOfJobs[i][j]['element_type'] == 'video'){
              if (
                typeof listOfJobs[i][j]["duration"] !== "undefined" &&
                listOfJobs[i][j]["duration"]
              ) {
                temp = temp + parseInt(listOfJobs[i][j]["duration"]);
              }
              // }
            }
            modules[i]["modulesVideoLength"] =
              "Duration: " + (Math.round(temp / 60) + " minutes ");
          }
          var sum = 0;
          var moduleCnt;
          for (var i = 0; i < jobQueries.length; i++) {
            moduleCnt = jobQueries.length;
            modules[i]["percentagecompleted"] = Math.round(
              (listOfJobs2[i].length * 100) / listOfJobs[i].length,
            );
            sum = sum + parseInt(modules[i]["percentagecompleted"]);
          }
          var avg = sum / countModules;
          res.json(Math.round(avg * 100) / 100);
        });
      });
    },
  );
});

/**
 * @swagger
 * /courses/reports/populate:
 *   get:
 *     summary: Populate quiz reports for a user
 *     tags: [Course reports]
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         description: User email for which to retrieve quiz reports
 *         schema:
 *           type: string
 *           format: email
 */
router.get("/reports/populate", function (req, res) {
  const { ObjectId } = require("mongodb"); // or ObjectID
  const safeObjectId = (s) => (ObjectId.isValid(s) ? new ObjectId(s) : null);
  req.session.returnTo = req.path;
  if (req.isAuthenticated()) {
    lmsQuizlog.aggregate(
      [
        {
          $match: {
            email: req.query.email,
          },
        },
        {
          $group: {
            _id: "$email",
            total: { $sum: 1 },
            quizes: {
              $push: { $concat: ["$quizid", "-", "$questionCorrectIncorrect"] },
            },
          },
        },
      ],
      function (err, result) {
        if (err) {
          res.json(err);
        } else {
          if (result.length > 0) {
            var quizes = result[0]["quizes"];
            var quizids = [];
            var quizlogs = [];
            for (var j = 0; j < quizes.length; j++) {
              if (quizes[j]) {
                quizids.push(quizes[j].split("-")[0]);
                quizlogs.push(
                  getQuizScore(JSON.parse(quizes[j].split("-")[1])),
                );
              }
            }
            var obj = {};
            obj.email = result[0]._id;
            obj.quizids = quizids;
            obj.quizlogs = quizlogs;
            var log = obj;
            var queries = [];

            //Fetching additional Quiz data (from quizes table)
            for (var i = 0; i < log.quizids.length; i++) {
              queries.push(
                lmsElements.findOne({ _id: safeObjectId(log.quizids[i]) }),
              );
            }
            Promise.all(queries).then(function (response) {
              obj.quizdata = response;
              res.json(obj);
            });
          } else {
            res.json(0);
          }
        }
      },
    );
  } else {
    res.json(-1);
  }
});

/**
 * @swagger
 * /courses/quizes/manage:
 *   get:
 *     summary: Get page in admin panel to manage quizes
 *     tags: [Courses]
 */
router.get("/quizes/manage", isAdmin, function (req, res) {
  req.session.returnTo = req.session.returnTo = req.baseUrl + req.url;
  lmsQuiz.find({ deleted: { $ne: "true" } }, function (err, quizes) {
    res.render("adminpanel/quizes", {
      moment: moment,
      quizes: quizes,
      email: req.user.email,
      registered: req.user.courses.length > 0 ? true : false,
      recruiter: req.user.role && req.user.role == "3" ? true : false,
      name: getusername(req.user),
      notifications: req.user.notifications,
    });
  });
});

/**
 * @swagger
 * /courses/elements/quiz:
 *   post:
 *     summary: Create a new quiz for a course
 *     tags: [Courses]
 *     parameters:
 *       - in: formData
 *         name: quiz_name
 *         required: true
 *         description: The title of the quiz
 *         type: string
 *       - in: formData
 *         name: quiz_time
 *         required: true
 *         description: The maximum time allowed to finish the quiz
 *         type: integer
 *       - in: formData
 *         name: quiz_questions
 *         required: true
 *         description: Number of questions in the quiz
 *         type: integer
 *     responses:
 *       '200':
 *         description: Quiz created successfully
 */
router.post("/elements/quiz", function (req, res) {
  var quiz = new lmsQuiz({
    quiz_title: req.body.quiz_name,
    maxTimeToFinish: req.body.quiz_time,
    pages: req.body.quiz_questions,
  });
  quiz.save(function (err, results) {
    if (err) {
      res.json(err);
    } else {
      res.json(results);
    }
  });
});

/**
 * @swagger
 * /courses/quizes/manage/csvupload:
 *   post:
 *     summary: Upload a CSV file to create a quiz
 *     tags: [Courses]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         type: file
 *         description: The CSV file containing quiz data
 *       - in: formData
 *         name: quiz_name
 *         type: string
 *         description: Name of the quiz
 *       - in: formData
 *         name: quiz_time
 *         type: integer
 *         description: Maximum time to finish the quiz in minutes
 *     responses:
 *       '200':
 *         description: Successfully uploaded the quiz CSV file
 *       '500':
 *         description: Internal server error
 */
router.post("/quizes/manage/csvupload", function (req, res) {
  let csvtojson = require("csvtojson");
  let csvData = req.files.file.data.toString("utf8");
  csvtojson()
    .fromString(csvData)
    .then((json) => {
      // return res.json(json);
      let jsonarray = [];
      jsonarray[0] = {
        questions: [
          {
            type: "html",
            html: "You are about to start the quiz. <br/>You have <span class='quizminutes'> 5 </span> mins whole quiz of <span class='quiztotalquestions'>4</span> questions.<br/>Please click on <b>'Start Quiz'</b> button when you are ready.",
          },
        ],
      };

      for (let i = 0; i < json.length; i++) {
        let arr2 = [];
        if (json[i].Identifier == 1) {
          if (typeof json[i].Answer.trim().split(",") !== "undefined") {
            let arr = json[i].Answer.trim().split(",");
            for (let j = 0; j < arr.length; j++) {
              arr2.push(parseInt(arr[j]));
            }
          } else {
            arr2 = parseInt(json[i].Answer);
          }
        }

        jsonarray.push({
          questions: [
            {
              isRequired: true,
              type: json[i].Identifier == 0 ? "radiogroup" : "checkbox",
              title: json[i].Question,
              choices: [
                json[i].Option1,
                json[i].Option2,
                json[i].Option3,
                json[i].Option4,
              ],
              correctAnswer:
                json[i].Identifier == 0 ? parseInt(json[i].Answer) : arr2,
            },
          ],
        });
      }

      var quiz = new lmsQuiz({
        quiz_title: req.body.quiz_name,
        maxTimeToFinish: req.body.quiz_time,
        pages: JSON.stringify(jsonarray),
      });
      quiz.save(function (err) {
        if (err) {
          return res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res.redirect("/quizes");
        }
      });
    });
});

/**
 * @swagger
 * /courses/manage:
 *   get:
 *     summary: Get a list of courses for admin management
 *     tags: [Courses]
 */
router.get("/manage", isAdmin, function (req, res) {
  lmsCourses.find({ deleted: { $ne: "true" } }, function (err, docs) {
    res.render("adminpanel/courses", {
      email: req.user.email,
      registered: req.user.courses.length > 0 ? true : false,
      recruiter: req.user.role && req.user.role == "3" ? true : false,
      name: getusername(req.user),
      notifications: req.user.notifications,
      docs: docs,
      moment: moment,
    });
  });
});

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     parameters:
 *       - in: formData
 *         name: course_name
 *         required: true
 *         type: string
 *         description: Name of the course
 *       - in: formData
 *         name: course_objective
 *         required: true
 *         type: string
 *         description: Objective of the course
 *       - in: formData
 *         name: course_projects
 *         required: true
 *         type: string
 *         description: Projects related to the course
 *       - in: formData
 *         name: course_duration
 *         required: true
 *         type: string
 *         description: Duration of the course
 *       - in: formData
 *         name: course_target_audience
 *         required: true
 *         type: string
 *         description: Target audience for the course
 *       - in: formData
 *         name: course_tools_requirements
 *         required: true
 *         type: string
 *         description: Tools and requirements for the course
 *     responses:
 *       '200':
 *         description: Successfully created a new course
 *       '400':
 *         description: Bad request. Check the request parameters.
 *       '500':
 *         description: Internal server error
 */
router.post("/", function (req, res) {
  var course = new lmsCourses({
    course_createdon: new Date(),
    course_name: req.body.course_name,
    course_objective: req.body.course_objective,
    course_projects: req.body.course_projects,
    course_duration: req.body.course_duration,
    course_target_audience: req.body.course_target_audience,
    course_tools_requirements: req.body.course_tools_requirements,
  });
  course.save(function (err, results) {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json(results);
    }
  });
});

/**
 * @swagger
 * /courses/updateaccess:
 *   put:
 *     summary: Update user access to courses
 *     tags: [Courses]
 *     parameters:
 *       - in: formData
 *         name: id
 *         required: true
 *         type: string
 *         description: User ID
 *       - in: formData
 *         name: courses
 *         required: true
 *         type: string
 *         description: Comma-separated string of course IDs
 *     responses:
 *       '200':
 *         description: Successfully updated user access to courses
 *         content:
 *           application/json:
 *             example:
 *               status: 1
 *       '400':
 *         description: Bad request. Check the request parameters.
 *       '500':
 *         description: Internal server error
 */
router.put("/updateaccess", function (req, res) {
  var arr = [];
  if (req.body.length > 1) {
    var temp = req.body.courses.split(",");
    for (var i = 0; i < temp.length; i++) {
      arr.push(temp[i]);
    }
  } else if (req.body.length == 1) {
    arr.push(req.body.courses);
  } else if (req.body.length == 0) {
    arr = [];
  }
  lmsUsers.findOneAndUpdate(
    {
      _id: req.body.id,
    },
    {
      $set: { courses: arr },
    },
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json('Access updated');
      }
    },
  );
});

/**
 * @swagger
 * /courses/{courseurl}:
 *   get:
 *     summary: Retrieve information about a specific course and renders it
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: courseurl
 *         required: true
 *         description: URL of the course to retrieve
 *         schema:
 *           type: string
 */
router.get("/:courseurl", async function (req, res) {
  try {
    // Save the current URL to the session for later redirection
    req.session.returnTo = req.baseUrl + req.url;

    // Find the course based on the provided course URL
    const course = await lmsCourses.findOne({ course_url: req.params.courseurl });

    // Check if the course doesn't exist or is not live
    if (!course || (course.course_live && course.course_live !== "Live")) {
      res.render("error");
      return;
    }

    // Find all live courses
    const courses = await lmsCourses.find({ deleted: { $ne: "true" }, course_live: "Live" });

    if (req.isAuthenticated()) {
      // If the user is authenticated, fetch user details and check enrollment
      const lmsuser = await lmsUsers.findOne({ email: req.user.email });
      const enrolled = lmsuser.courses.indexOf(course._id) !== -1;

      // Common data for rendering the view
      const commonData = {
        path: req.path,
        course: course,
        courses: courses,
        moment: moment,
        cls: req.query.payment && req.query.payment === "true" ? "d-none" : "",
        paymentuser_id: req.user._id.toString(),
        email: req.user.email,
        name: getusername(req.user),
        phone: req.user.phone,
        user_id: req.user._id,
        user: req.user,
      };

      // Render the course view with common data and enrollment status
      res.render("courses/" + req.params.courseurl, {
        ...commonData,
        enrolled: enrolled,
      });
    } else {
      // If the user is not authenticated, render the course view with default data
      res.render("courses/" + req.params.courseurl, {
        path: req.path,
        course: course,
        moment: moment,
        courses: courses,
        cls: req.query.payment && req.query.payment === "true" ? "d-none" : "",
        enrolled: false,
        paymentuser_id: "",
        user: null,
      });
    }
  } catch (error) {
    // Handle any errors that might occur during the async operations
    console.error(error);
    res.render("error");
  }
});


function getQuizScore(quiz) {
  var count = 0;
  var quizlength = 0;
  for (var key in quiz) {
    quizlength = quizlength + 1;
    if (quiz.hasOwnProperty(key)) {
      console.log(key + " -> " + quiz[key]);
    }
    if (quiz[key] == "correct") {
      count = count + 1;
    }
  }
  return [count, quizlength];
}

async function getModuleData(module_id) {
  const myPromise = new Promise((resolve, reject) => {
    const { ObjectId } = require("mongodb"); // or ObjectID
    const safeObjectId = (s) => (ObjectId.isValid(s) ? new ObjectId(s) : null);

    lmsModules.find(
      { _id: safeObjectId(module_id), deleted: { $ne: "true" } },
      function (err, modules) {
        if (modules.length == 0) {
          reject(-1);
        } else {
          modulesObj = modules;
          console.log(modules);
          lmsTopics.find(
            {
              module_id: safeObjectId(modules[0]["_id"]),
              deleted: { $ne: "true" },
            },
            function (err, topics) {
              topicsObj = topics;
              lmsElements.find(
                {
                  element_module_id: safeObjectId(modules[0]["_id"]),
                  deleted: { $ne: "true" },
                },
                function (err, elements) {
                  elementsObj = elements;
                  topicsObj.sort(function (a, b) {
                    var keyA = a.topic_order,
                      keyB = b.topic_order;
                    // Compare the 2 dates
                    if (keyA < keyB) return -1;
                    if (keyA > keyB) return 1;
                    return 0;
                  });
                  for (let i = 0; i < topicsObj.length; i++) {
                    topicsObj[i]["elements"] = [];
                    for (let j = 0; j < elementsObj.length; j++) {
                      if (
                        elementsObj[j]["element_taskid"] == topicsObj[i]["_id"]
                      ) {
                        topicsObj[i]["elements"].push(elementsObj[j]);
                        topicsObj[i]["elements"].sort(function (a, b) {
                          var keyA = a.element_order,
                            keyB = b.element_order;
                          // Compare the 2 dates
                          if (keyA < keyB) return -1;
                          if (keyA > keyB) return 1;
                          return 0;
                        });
                        /*console.log('TOPICS ELEMENTS');
                                    console.log(topicsObj[i]['elements']);*/
                      }
                    }
                  }

                  for (let i = 0; i < modulesObj.length; i++) {
                    modulesObj[i]["topics"] = [];
                    for (let j = 0; j < topicsObj.length; j++) {
                      if (topicsObj[j]["module_id"] == modulesObj[i]["_id"]) {
                        modulesObj[i]["topics"].push(topicsObj[j]);
                      }
                    }
                  }
                  resolve(modulesObj);
                },
              );
            },
          );
        }
      },
    );
  });
  return myPromise;
}


/**
 * @swagger
 * /courses/updateinfo:
 *   post:
 *     summary: Update course information
 *     tags: [Courses]
 *     parameters:
 *       - in: formData
 *         name: pk
 *         required: true
 *         type: string
 *         description: Course ID
 *       - in: formData
 *         name: name
 *         required: true
 *         type: string
 *         description: Property name to update (e.g., "course_name")
 *       - in: formData
 *         name: value
 *         required: true
 *         type: string
 *         description: New value for the specified property
 *     responses:
 *       '200':
 *         description: Course information updated successfully
 *         content:
 *           application/json:
 *             example:
 *               nModified: 1
 *       '400':
 *         description: Bad request. Check the request parameters.
 *       '500':
 *         description: Internal server error
 */
router.post("/updateinfo", function (req, res) {
  let updateQuery = {};
  updateQuery[req.body.name] = req.body.value;
  lmsCourses.findOneAndUpdate(
    {
      _id: req.body.pk,
    },
    {
      $set: updateQuery,
    },
    function (err, count) {
      if (err) {
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.json(count);
      }
    },
  );
});

/**
 * @swagger
 * /courses/uploadimage:
 *   post:
 *     summary: Upload course card image
 *     tags: [Courses]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: courseid
 *         type: string
 *         description: ID of the course for which the image is being uploaded
 *       - in: formData
 *         name: avatar
 *         type: file
 *         description: Course card image file
 *     responses:
 *       '200':
 *         description: Course card image uploaded successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Success: Image Uploaded!"
 *       '400':
 *         description: Bad request. Check the request parameters.
 *       '500':
 *         description: Internal server error
 */
router.post("/uploadimage", function (req, res) {
  var courseid = req.body.courseid;
  var bucketParams = { Bucket: "ampdigital" };
  s3.createBucket(bucketParams);
  var s3Bucket = new aws.S3({ params: { Bucket: "ampdigital" } });
  // res.json('succesfully uploaded the image!');
  if (!req.files) {
    res.status(400).json({ error: 'No image file provided' });
  } else {
    var imageFile = req.files.avatar;
    var data = { Key: imageFile.name, Body: imageFile.data };
    s3Bucket.putObject(data, function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        var urlParams = { Bucket: "ampdigital", Key: imageFile.name };
        s3Bucket.getSignedUrl("getObject", urlParams, function (err, url) {
          if (err) {
            res.status(500).json({ error: err.message });
          } else {
            lmsCourses.findOneAndUpdate(
              {
                _id: courseid,
              },
              {
                $set: { course_image: url },
              },
              function (err) {
                if (err) {
                  res.status(500).json({ error: err.message });
                } else {
                  res.json("Success: Image Uploaded!");
                }
              },
            );
          }
        });
      }
    });
  }
});

/**
 * @swagger
 * /courses/modules:
 *   post:
 *     summary: Create a new module for a course
 *     tags: [Courses]
 *     parameters:
 *       - in: formData
 *         name: module_name
 *         required: true
 *         type: string
 *         description: Name of the new module
 *       - in: formData
 *         name: module_description
 *         required: true
 *         type: string
 *         description: Description of the new module
 *       - in: formData
 *         name: module_image
 *         required: true
 *         type: string
 *         description: URL of the module image
 *       - in: formData
 *         name: module_order
 *         required: true
 *         type: integer
 *         description: Order of the module
 *       - in: formData
 *         name: course_id
 *         required: true
 *         type: string
 *         description: ID of the course to which the module belongs
 *     responses:
 *       '200':
 *         description: Module created successfully
 *       '400':
 *         description: Bad request. Check the request parameters.
 *       '500':
 *         description: Internal server error
 */
router.post("/modules", function (req, res) {
  var module = new lmsModules({
    module_createdon: new Date(),
    module_name: req.body.module_name,
    module_description: req.body.module_description,
    module_image: req.body.module_image,
    module_order: req.body.module_order,
    course_id: req.body.course_id,
  });
  module.save(function (err, results) {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json(results);
    }
  });
});

/**
 * @swagger
 * /courses/modules/uploadimage:
 *   post:
 *     summary: Upload image for a module
 *     tags: [Courses]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: moduleid
 *         type: string
 *         description: ID of the module for which the image is being uploaded
 *       - in: formData
 *         name: avatar
 *         type: file
 *         description: Module image file
 *     responses:
 *       '200':
 *         description: Module image uploaded successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Success: Image Uploaded!"
 *       '400':
 *         description: Bad request. Check the request parameters.
 *       '500':
 *         description: Internal server error
 */
router.post("/modules/uploadimage", function (req, res) {
  var moduleid = req.body.moduleid;
  var bucketParams = { Bucket: "ampdigital" };
  s3.createBucket(bucketParams);
  var s3Bucket = new aws.S3({ params: { Bucket: "ampdigital" } });
  // res.json('succesfully uploaded the image!');
  if (!req.files) {
    res.status(400).json({ error: 'No image file provided' });
  } else {
    var imageFile = req.files.avatar;
    var data = { Key: imageFile.name, Body: imageFile.data };
    s3Bucket.putObject(data, function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        var urlParams = { Bucket: "ampdigital", Key: imageFile.name };
        s3Bucket.getSignedUrl("getObject", urlParams, function (err, url) {
          if (err) {
            res.status(500).json({ error: err.message });
          } else {
            lmsModules.findOneAndUpdate(
              {
                _id: moduleid,
              },
              {
                $set: { module_image: url },
              },
              function (err) {
                if (err) {
                  res.status(500).json({ error: err.message });
                } else {
                  res.json("Success: Image Uploaded!");
                }
              },
            );
          }
        });
      }
    });
  }
});

/**
 * @swagger
 * /courses/modules/updateinfo:
 *   post:
 *     summary: Update information for a module
 *     tags: [Courses]
 *     parameters:
 *       - in: formData
 *         name: pk
 *         type: string
 *         required: true
 *         description: ID of the module to be updated
 *       - in: formData
 *         name: name
 *         type: string
 *         required: true
 *         description: Name of the field to be updated
 *       - in: formData
 *         name: value
 *         type: string
 *         required: true
 *         description: New value for the field
 *     responses:
 *       '200':
 *         description: Module information updated successfully
 *       '400':
 *         description: Bad request. Check the request parameters.
 *       '500':
 *         description: Internal server error
 */
router.post("/modules/updateinfo", function (req, res) {
  let updateQuery = {};
  updateQuery[req.body.name] = req.body.value;
  lmsModules.findOneAndUpdate(
    {
      _id: req.body.pk,
    },
    {
      $set: updateQuery,
    },
    function (err, count) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(count);
      }
    },
  );
});

/**
 * @swagger
 * /courses/modules/removemodule:
 *   delete:
 *     summary: Remove a module
 *     tags: [Courses]
 *     parameters:
 *       - in: formData
 *         name: module_id
 *         type: string
 *         required: true
 *         description: ID of the module to be removed
 *     responses:
 *       '200':
 *         description: Module removed successfully
 *       '400':
 *         description: Bad request. Check the request parameters.
 *       '500':
 *         description: Internal server error
 */
router.delete("/modules/removemodule", function (req, res) {
  var module_id = req.body.module_id;
  const { ObjectId } = require("mongodb"); // or ObjectID
  const safeObjectId = (s) => (ObjectId.isValid(s) ? new ObjectId(s) : null);

  lmsModules.findOneAndUpdate(
    {
      _id: safeObjectId(module_id),
    },
    {
      $set: { deleted: "true" },
    },
    function (err, count) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(count);
      }
    },
  );
});

/**
 * @swagger
 * /courses/{courseid}/modules/manage:
 *   get:
 *     summary: Get manage modules page specific course (admin access)
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: courseid
 *         type: string
 *         required: true
 *         description: ID of the course to retrieve modules for
 *     responses:
 *       '200':
 *         description: Modules retrieved successfully
 *       '404':
 *         description: Course not found
 */
router.get("/:courseid/modules/manage", isAdmin, function (req, res) {
  const { ObjectId } = require("mongodb"); // or ObjectID
  const safeObjectId = (s) => (ObjectId.isValid(s) ? new ObjectId(s) : null);
  lmsCourses.find({ _id: safeObjectId(req.params.courseid) }, function (err, course) {
    if (course.length === 0) {
      res.status(404).send("Course not found");
      return;
    }
    lmsModules.find(
      { course_id: req.params.courseid, deleted: { $ne: "true" } },
      function (err, modules) {
        if(err){
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.render("adminpanel/modules", {
          course: course,
          modules: modules,
          moment: moment,
          email: req.user.email,
          registered: req.user.courses.length > 0 ? true : false,
          recruiter: req.user.role && req.user.role == "3" ? true : false,
          name: getusername(req.user),
          notifications: req.user.notifications,
        });
      },
    );
  });
});

/**
 * @swagger
 * /courses/topics/{courseurl}:
 *   get:
 *     summary: Get topics HTML response for displaying course modules and topics for a specific course URL
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: courseurl
 *         type: string
 *         required: true
 *         description: URL of the course to retrieve topics for
 *     responses:
 *       '200':
 *         description: Topics retrieved successfully
 *       '404':
 *         description: Course not found
 *       '500':
 *         description: Internal server error
 */
router.get("/topics/:courseurl", function (req, res) {
  const { ObjectId } = require("mongodb"); // or ObjectID
  lmsCourses.findOne(
    { course_url: "" + req.params.courseurl },
    function (err, courseobj) {
      if(err){
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      if (courseobj) {
        var courseid = courseobj._id;
        lmsModules.find(
          { course_id: courseid, deleted: { $ne: "true" } },
          async function (err, moduleslist) {
            moduleslist.sort(function (a, b) {
              var keyA = a.module_order,
                keyB = b.module_order;
              // Compare the 2 dates
              if (keyA < keyB) return -1;
              if (keyA > keyB) return 1;
              return 0;
            });
            var coursedata = [];
            for (var module of moduleslist) {
              var moduledata = await getModuleData(module._id);
              coursedata.push(moduledata);
            }
            // res.json(coursedata);
            let html = `<div class="topicsaccordion" id="accordion">
                ${coursedata
                  .map((module, moduleindex) => {
                    return `<div class="card ">
                    <div class="card-header" id="heading-${moduleindex}">
                      <h5 class="mb-0">
                        <a role="button" data-toggle="collapse" href="#collapse-${moduleindex}" aria-expanded="false" aria-controls="collapse-${moduleindex}">
                        ${module[0].module_name}
                        </a>
                      </h5>
                    </div>
                    <div id="collapse-${moduleindex}" class="collapse" data-parent="#accordion" aria-labelledby="heading-${moduleindex}">
                      <div class="card-body">
                
                        <div id="accordion-${moduleindex}">
                        ${module[0].topics
                          .map((topic, topicindex) => {
                            return `<div class="">
                            <div class="card-header" id="heading-${moduleindex}-${topicindex}">
                              <h5 class="mb-0">
                                <a class="collapsed" role="button" data-toggle="collapse" href="#collapse-${moduleindex}-${topicindex}" aria-expanded="false" aria-controls="collapse-${moduleindex}-${topicindex}">
                                ${topic.topic_name}
                                </a>
                              </h5>
                            </div>
                            <div id="collapse-${moduleindex}-${topicindex}" class="collapse" data-parent="#accordion-${moduleindex}" aria-labelledby="heading-${moduleindex}-${topicindex}">
                            <div class="card-body">
                            <ul>
                                ${topic.elements
                                  .map((element, elementindex) => {
                                    if (element.element_type == "video") {
                                      if (
                                        elementindex == 0 &&
                                        topicindex == 0
                                      ) {
                                        return `
                                            <li>
                                        <div class="left-content">
                                        <i class="fa fa-play-circle"></i>&nbsp;&nbsp;
                                        <h5><a href="#">${
                                          element.element_name
                                        }</a>
                                        </h5>
                                        </div>
                                        <div class="right-content">
                                        <a href="https://vimeo.com/${
                                          element.element_val.match(
                                            /([^\/]*)\/*$/,
                                          )[1]
                                        }" class="popup-youtube light">
                                        <i class="fa fa-play-circle play-preview"></i>
                                        </a>
                                        </div>
                                    </li>`;
                                      } else {
                                        return `<li>
                                        <div class="left-content">
                                        <i class="fa fa-play-circle"></i>&nbsp;&nbsp;
                                        <h5><a href="#">${element.element_name}</a>
                                        </h5>
                                        </div>
                                        <div class="right-content">
                                       <i class="fa fa-lock" style="color: #DB4437!important"></i>
                                    </div>
                                    </li>`;
                                      }
                                    } else if (element.element_type == "quiz") {
                                      return `<li>
                                        <div class="left-content">
                                        <i class="fa fa-question-circle"></i>&nbsp;&nbsp;
                                        <h5><a href="#">${element.element_name}</a>
                                        </h5>
                                        </div>
                                        <div class="right-content">
                                       <i class="fa fa-lock" style="color: #DB4437!important"></i>
                                    </div>
                                    </li>`;
                                    } else if (
                                      element.element_type == "exercise"
                                    ) {
                                      return `<li>
                                        <div class="left-content">
                                        <i class="fa fa-file-text"></i>&nbsp;&nbsp;
                                        <h5><a href="#">${element.element_name}</a>
                                        </h5>
                                        </div>
                                        <div class="right-content">
                                       <i class="fa fa-lock" style="color: #DB4437!important"></i>
                                    </div>
                                    </li>`;
                                    }
                                  })
                                  .join("")}
                            </ul>
                            </div>
                            </div>
                          </div>`;
                          })
                          .join("")}
                        </div>      
                      
                      </div>
                    </div>`;
                  })
                  .join("")}
                </div>
              </div>`;
            res.json(html);
          },
        );
      } else {
        return res.status(401).json({ error: 'Course not found' });
      }
    },
  );
});

/**
 * @swagger
 * /courses/topics/{courseid}/{moduleid}/manage:
 *   get:
 *     summary: Get the admin panel for managing topics in a module
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: courseid
 *         type: string
 *         required: true
 *         description: ID of the course to manage topics for
 *       - in: path
 *         name: moduleid
 *         type: string
 *         required: true
 *         description: ID of the module to manage topics for
 */
router.get("/topics/:courseid/:moduleid/manage", isAdmin, function (req, res) {
  const { ObjectId } = require("mongodb"); // or ObjectID
  const safeObjectId = (s) => (ObjectId.isValid(s) ? new ObjectId(s) : null);
  lmsCourses.find(
    { _id: safeObjectId(req.params.courseid) },
    function (err, course) {
      lmsModules.find(
        { _id: safeObjectId(req.params.moduleid) },
        function (err, module) {
          lmsTopics.find(
            { module_id: req.params.moduleid, deleted: { $ne: "true" } },
            null,
            { sort: { order: 1 } },
            function (err, topics) {
              res.render("adminpanel/topics", {
                course: course,
                module: module,
                topics: topics,
                moment: moment,
                email: req.user.email,
                registered: req.user.courses.length > 0 ? true : false,
                recruiter: req.user.role && req.user.role == "3" ? true : false,
                name: getusername(req.user),
                notifications: req.user.notifications,
              });
            },
          );
        },
      );
    },
  );
});

/**
 * @swagger
 * /courses/topics:
 *   post:
 *     summary: Create a new topic for a course module
 *     tags: [Courses]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: topic_name
 *         type: string
 *         description: The name of the topic
 *       - in: formData
 *         name: topic_order
 *         type: integer
 *         description: The order of the topic
 *       - in: formData
 *         name: course_id
 *         type: string
 *         description: ID of the course the topic belongs to
 *       - in: formData
 *         name: module_id
 *         type: string
 *         description: ID of the module the topic belongs to
 *     responses:
 *       '201':
 *         description: Topic created successfully
 *       '500':
 *         description: Internal server error
 */
router.post("/topics", function (req, res) {
  var topic = new lmsTopics({
    topic_createdon: new Date(),
    topic_name: req.body.topic_name,
    topic_order: req.body.topic_order,
    course_id: req.body.course_id,
    module_id: req.body.module_id,
  });
  topic.save(function (err, results) {
    if (err) {
      return res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});

/**
 * @swagger
 * /courses/topics/removetopic:
 *   delete:
 *     summary: Remove a topic
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: topic_id
 *         type: string
 *         description: ID of the topic to be removed
 *         required: true
 *     responses:
 *       '200':
 *         description: Topic removed successfully
 *       '500':
 *         description: Internal server error
 */
router.delete("/topics/removetopic", function (req, res) {
  var topic_id = req.body.topic_id;
  const { ObjectId } = require("mongodb"); // or ObjectID
  const safeObjectId = (s) => (ObjectId.isValid(s) ? new ObjectId(s) : null);

  lmsTopics.findOneAndUpdate(
    {
      _id: safeObjectId(topic_id),
    },
    {
      $set: { deleted: "true" },
    },
    function (err, count) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(count);
      }
    },
  );
});

/**
 * @swagger
 * /courses/topics/updateinfo:
 *   post:
 *     summary: Update information of a topic
 *     tags: [Courses]
 *     parameters:
 *       - in: formData
 *         name: name
 *         required: true
 *         description: The field name to be updated
 *         type: string
 *       - in: formData
 *         name: value
 *         required: true
 *         description: The new value for the specified field
 *         type: string
 *       - in: formData
 *         name: pk
 *         required: true
 *         description: ID of the topic to be updated
 *         type: string
 *     responses:
 *       '200':
 *         description: Topic information updated successfully
 */
router.post("/topics/updateinfo", function (req, res) {
  let updateQuery = {};
  updateQuery[req.body.name] = req.body.value;
  lmsTopics.findOneAndUpdate(
    {
      _id: req.body.pk,
    },
    {
      $set: updateQuery,
    },
    function (err, count) {
      if (err) {
        console.log(err);
      } else {
        res.json(count);
      }
    },
  );
});

/**
 * @swagger
 * /courses/elements/{courseid}/{moduleid}/{topicid}/manage:
 *   get:
 *     summary: Retrieve and render elements for a course's module's topic (Admin Panel)
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: courseid
 *         required: true
 *         description: ID of the course
 *         type: string
 *       - in: path
 *         name: moduleid
 *         required: true
 *         description: ID of the module
 *         type: string
 *       - in: path
 *         name: topicid
 *         required: true
 *         description: ID of the topic
 *         type: string
 *     responses:
 *       '200':
 *         description: Elements retrieved successfully
 */
router.get(
  "/elements/:courseid/:moduleid/:topicid/manage",
  isAdmin,
  function (req, res) {
    const { ObjectId } = require("mongodb"); // or ObjectID
    const safeObjectId = (s) => (ObjectId.isValid(s) ? new ObjectId(s) : null);
    lmsCourses.find(
      { _id: safeObjectId(req.params.courseid) },
      function (err, course) {
        lmsModules.find(
          { _id: safeObjectId(req.params.moduleid) },
          function (err, module) {
            lmsTopics.find(
              { _id: safeObjectId(req.params.topicid) },
              function (err, topic) {
                lmsElements.find(
                  {
                    element_taskid: safeObjectId(req.params.topicid),
                    deleted: { $ne: "true" },
                  },
                  function (err, elements) {
                    res.render("adminpanel/elements", {
                      course: course,
                      module: module,
                      topic: topic,
                      elements: elements,
                      moment: moment,
                      email: req.user.email,
                      registered: req.user.courses.length > 0 ? true : false,
                      recruiter:
                        req.user.role && req.user.role == "3" ? true : false,
                      name: getusername(req.user),
                      notifications: req.user.notifications,
                    });
                  },
                );
              },
            );
          },
        );
      },
    );
  },
);

/**
 * @swagger
 * /courses/elements/watchedby:
 *   put:
 *     summary: Mark that the quiz has been completed or video has been watched by the user
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: ID of the element (quiz or video)
 *         type: string
 *       - in: query
 *         name: userid
 *         required: true
 *         description: User ID or email who watched the element
 *         type: string
 *     responses:
 *       '200':
 *         description: Element watched status updated successfully
 *       '500':
 *         description: Internal server error
 */
router.put("/elements/watchedby", function (req, res) {
  lmsElements.findByIdAndUpdate(
    req.query.id,
    {
      $addToSet: { watchedby: req.query.userid },
    },
    { safe: true, upsert: true },
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        lmsUsers.findOneAndUpdate(
          { email: req.query.userid },
          {
            $addToSet: { elementswatched: req.query.id },
          },
          { safe: true, upsert: true },
          function (err, model) {
            if (err) {
              res.status(500).json({ error: err.message });
            } else {
              res.json(model);
            }
          },
        );
      }
    },
  );
});

/**
 * @swagger
 * /courses/elements/quizlog:
 *   post:
 *     summary: Record quiz log
 *     tags: [Courses]
 *     parameters:
 *       - in: formData
 *         name: id
 *         type: string
 *         required: true
 *         description: ID of the quiz
 *       - in: formData
 *         name: userid
 *         type: string
 *         required: true
 *         description: User ID or email who took the quiz
 *       - in: formData
 *         name: date
 *         type: string
 *         format: date
 *         required: true
 *         description: Date when the quiz log is recorded
 *       - in: formData
 *         name: maxtime
 *         type: integer
 *         required: true
 *         description: Maximum time allowed for the quiz in seconds
 *       - in: formData
 *         name: totalquestions
 *         type: integer
 *         required: true
 *         description: Total number of questions in the quiz
 *       - in: formData
 *         name: quizcompleted
 *         type: string
 *         required: true
 *         description: Flag indicating whether the quiz is completed or not
 *     responses:
 *       '201':
 *         description: Quiz log recorded successfully
 *       '400':
 *         description: Bad request. Check the request parameters.
 */
router.post("/elements/quizlog", function (req, res) {
  var quizlog = new lmsQuizlog({
    quizid: req.body.id,
    email: req.body.userid,
    date: req.body.date,
    maxtime: req.body.maxtime,
    totalquestions: req.body.totalquestions,
    quizcompleted: "false",
  });
  quizlog.save(function (err, results) {
    if (err) {
      res.json(err);
    } else {
      res.json(results);
    }
  });
});

/**
 * @swagger
 * /courses/elements/getquizlog:
 *   get:
 *     summary: Get quiz log
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: id
 *         type: string
 *         required: true
 *         description: ID of the quiz
 *       - in: query
 *         name: userid
 *         type: string
 *         required: true
 *         description: User ID or email for whom to retrieve the quiz log
 *     responses:
 *       '200':
 *         description: Quiz log retrieved successfully
 *       '500':
 *         description: Internal server error
 */
router.get("/elements/getquizlog", function (req, res) {
  lmsQuizlog.find(
    {
      quizid: req.query.id,
      email: req.query.userid,
    },
    function (err, quizes) {
      if(err){
        return res.status(500).json({ error: err.message });
      }
      res.json(quizes);
    },
  );
});

/**
 * @swagger
 * /courses/elements/resetquiz:
 *   put:
 *     summary: Reset quiz for a user
 *     tags: [Courses]
 *     parameters:
 *       - in: formData
 *         name: emailid
 *         type: string
 *         description: The email ID of the user
 *       - in: formData
 *         name: quizid
 *         type: string
 *         description: The ID of the quiz
 *     responses:
 *       '200':
 *         description: Quiz reset successfully
 *       '400':
 *         description: Bad request. Check the request parameters.
 */
router.put("/elements/resetquiz", function (req, res) {
  // res.json({email : req.body.emailid, quizid: req.body.quizid});
  var querystring = { quizid: req.body.quizid, email: req.body.emailid };
  // res.json(querystring);
  lmsQuizlog.remove(querystring, function (err, count) {
    console.log(count);
    if (err) {
      res.status(400).json(err);
    } else {
      lmsQueLog.remove(querystring, function (err, count) {
        if (err) {
          res.status(400).json(err);
        } else {
          console.log(count);
          res.json(count);
        }
      });
    }
  });
});

/**
 * @swagger
 * /courses/elements/updatequelog:
 *   post:
 *     summary: Update quiz and question log for a user
 *     tags: [Courses]
 *     parameters:
 *       - in: formData
 *         name: queNo
 *         type: string
 *         description: The question number
 *       - in: formData
 *         name: element_id
 *         type: string
 *         description: The ID of the quiz
 *       - in: formData
 *         name: loggedinEmail
 *         type: string
 *         description: The email of the logged-in user
 *       - in: formData
 *         name: questionCorrectIncorrect
 *         type: string
 *         description: Indicates whether the question was correct or incorrect
 *       - in: formData
 *         name: queAns
 *         type: string
 *         description: The user's answer to the question
 *     responses:
 *       '200':
 *         description: Quiz log updated successfully
 *       '400':
 *         description: Bad request. Check the request payload.
 */
router.post("/elements/updatequelog", function (req, res) {
  lmsQueLog.find(
    {
      queNo: req.body.queNo,
      quizid: req.body.element_id,
      email: req.body.loggedinEmail,
    },
    function (err, results) {
      if (err) {
        res.status(400).json(err);
      } else {
        if (results.length > 0) {
          var updateQuery = {
            questionCorrectIncorrect: req.body.questionCorrectIncorrect,
            queAns: req.body.queAns,
          };

          var findQuery = {
            queNo: req.body.queNo,
            quizid: req.body.element_id,
            email: req.body.loggedinEmail,
          };
          lmsQueLog.findOneAndUpdate(
            findQuery,
            {
              $set: updateQuery,
            },
            function (err, count) {
              if (err) {
                res.status(400).json(err);
              } else {
                res.json(count);
              }
            },
          );
        } else {
          var quelog = new lmsQueLog({
            date: new Date(),
            questionCorrectIncorrect: req.body.questionCorrectIncorrect,
            queAns: req.body.queAns,
            queNo: req.body.queNo,
            quizid: req.body.element_id,
            email: req.body.loggedinEmail,
          });
          quelog.save(function (err, results) {
            if (err) {
              res.json(err);
            } else {
              res.json(results);
            }
          });
        }
      }
    },
  );
});

/**
 * @swagger
 * /courses/elements/updatequizlog:
 *   put:
 *     summary: Update quiz log for a user
 *     tags: [Courses]
 *     parameters:
 *       - in: formData
 *         name: element_id
 *         required: true
 *         type: string
 *         description: ID of the quiz element
 *       - in: formData
 *         name: loggedinEmail
 *         required: true
 *         type: string
 *         description: Email of the logged-in user
 *       - in: formData
 *         name: questionCorrectIncorrect
 *         required: true
 *         type: string
 *         description: Indicates if the question was answered correctly or incorrectly
 *       - in: formData
 *         name: quizAnswers
 *         required: true
 *         type: array
 *         items:
 *           type: string
 *         description: List of answers submitted by the user for the quiz
 *       - in: formData
 *         name: queNo
 *         required: true
 *         type: integer
 *         description: Question number
 *       - in: formData
 *         name: score
 *         required: true
 *         type: integer
 *         description: Score achieved by the user
 *     responses:
 *       '200':
 *         description: Quiz log updated successfully
 *       '400':
 *         description: Bad request. Check the request parameters.
 */
router.put("/elements/updatequizlog", function (req, res) {
  var updateQuery = {
    questionCorrectIncorrect: req.body.questionCorrectIncorrect,
    quizAnswers: req.body.quizAnswers,
    queNo: req.body.queNo,
    score: req.body.score,
  };

  var findQuery = {
    quizid: req.body.element_id,
    email: req.body.loggedinEmail,
  };
  lmsQuizlog.findOneAndUpdate(
    findQuery,
    {
      $set: updateQuery,
    },
    function (err, count) {
      if (err) {
        res.status(400).json({ error: "Bad request. Check the request parameters." });
      } else {
        res.json(count);
      }
    },
  );
});

/**
 * @swagger
 * /courses/elements/markquizcompleted:
 *   put:
 *     summary: Mark a quiz as completed for a user
 *     tags: [Courses]
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     parameters:
 *       - in: formData
 *         name: element_id
 *         required: true
 *         type: string
 *         description: ID of the quiz element
 *       - in: formData
 *         name: loggedinEmail
 *         required: true
 *         type: string
 *         description: Email of the logged-in user
 *     responses:
 *       '200':
 *         description: Quiz marked as completed successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Quiz marked as completed successfully
 *       '400':
 *         description: Bad request. Check the request parameters.
 *         content:
 *           application/json:
 *             example:
 *               error: Bad request. Check the request parameters.
 */
router.put("/elements/markquizcompleted", function (req, res) {
  var updateQuery = {
    quizcompleted: "true",
  };

  var findQuery = {
    quizid: req.body.element_id,
    email: req.body.loggedinEmail,
  };
  lmsQuizlog.findOneAndUpdate(
    findQuery,
    {
      $set: updateQuery,
    },
    function (err, count) {
      if (err) {
        console.log(err);
      } else {
        res.json(count);
      }
    },
  );
});

/**
 * @swagger
 * /courses/elements/getquiz:
 *   post:
 *     summary: Get details of a quiz
 *     tags: [Courses]
 *     parameters:
 *       - in: formData
 *         name: quiz_id
 *         required: true
 *         type: string
 *         description: ID of the quiz
 *     responses:
 *       '200':
 *         description: Quiz details retrieved successfully
 *       '400':
 *         description: Bad request. Check the request parameters.
 */
router.post("/elements/getquiz", function (req, res) {
  var quiz_id = req.body.quiz_id;
  console.log(quiz_id);
  const { ObjectId } = require("mongodb"); // or ObjectID
  const safeObjectId = (s) => (ObjectId.isValid(s) ? new ObjectId(s) : null);
  lmsQuiz.find({ _id: safeObjectId(quiz_id) }, function (err, docs) {
    if (err || docs.length === 0) {
      console.log(err);
      res.status(400).json({ error: "Bad request. Check the request parameters." });
    } else {
      res.status(200).json(docs[0]);
    }
  });
});

/**
 * @swagger
 * /courses/elements/getquizreport:
 *   post:
 *     summary: Get the report for a quiz
 *     tags: [Courses]
 *     parameters:
 *       - in: formData
 *         name: quiz_id
 *         required: true
 *         type: string
 *         description: ID of the quiz
 *     responses:
 *       '200':
 *         description: Quiz report retrieved successfully
 *       '400':
 *         description: Bad request. Check the request parameters.
 */
router.post("/elements/getquizreport", function (req, res) {
  var quiz_id = req.body.quiz_id;
  lmsElements.find({ element_val: quiz_id }, function (err, docs) {
    if (err || docs.length === 0) {
      res.status(400).json({ error: "Bad request. Check the request parameters." });
    } else {
      const quizElementId = docs[docs.length - 1]["_id"];
      lmsQuizlog.find({ quizid: quizElementId }, function (err, docs) {
        res.status(200).json(docs);
      });
    }
  });
});

/**
 * @swagger
 * /courses/elements/percentile:
 *   post:
 *     summary: Get the percentile for a user's quiz score
 *     tags: [Courses]
 *     parameters:
 *       - in: formData
 *         name: quizid
 *         required: true
 *         type: string
 *         description: ID of the quiz
 *       - in: formData
 *         name: email
 *         required: true
 *         type: string
 *         description: Email of the user
 *     responses:
 *       '200':
 *         description: Percentile calculated successfully
 *       '400':
 *         description: Bad request. Check the request parameters.
 */
router.post("/elements/percentile", function (req, res) {
  lmsQuizlog.find({ quizid: req.body.quizid }, function (err, docs) {
    if (err || docs.length === 0) {
      return res.status(400).json({ error: "Bad request. Check the request parameters." });
    }
    var quizPercentageArray = [];
    var myPercentage;
    for (var i = 0; i < docs.length; i++) {
      if (docs[i]["email"] == req.body.email) {
        myPercentage = (docs[i]["score"] * 100) / docs[i]["totalquestions"];
      }
      quizPercentageArray.push(
        (docs[i]["score"] * 100) / docs[i]["totalquestions"],
      );
    }
    res.json(100 * percentRank(quizPercentageArray.sort(), myPercentage));
  });
});

// Returns the percentile of the given value in a sorted numeric array.
function percentRank(arr, v) {
  if (typeof v !== "number") throw new TypeError("v must be a number");
  for (var i = 0, l = arr.length; i < l; i++) {
    if (v <= arr[i]) {
      while (i < l && v === arr[i]) i++;
      if (i === 0) return 0;
      if (v !== arr[i - 1]) {
        i += (v - arr[i - 1]) / (arr[i] - arr[i - 1]);
      }
      return i / l;
    }
  }
  return 1;
}

/**
 * @swagger
 * /courses/elements/quiz:
 *   put:
 *     summary: Update quiz details
 *     tags: [Courses]
 *     parameters:
 *       - in: formData
 *         name: pk
 *         required: true
 *         type: string
 *         description: ID of the quiz
 *       - in: formData
 *         name: quiz_name
 *         required: true
 *         type: string
 *         description: New name of the quiz
 *       - in: formData
 *         name: quiz_time
 *         required: true
 *         type: integer
 *         description: New maximum time to finish the quiz
 *       - in: formData
 *         name: quiz_questions
 *         required: true
 *         type: array
 *         items:
 *           type: object
 *           properties:
 *             question:
 *               type: string
 *               description: Quiz question
 *             options:
 *               type: array
 *               items:
 *                 type: string
 *               description: Array of options for the question
 *             correct_option:
 *               type: string
 *               description: Correct option for the question
 *         description: Array of quiz questions with options and correct answers
 *     responses:
 *       '200':
 *         description: Quiz details updated successfully
 *       '400':
 *         description: Bad request. Check the request parameters.
 */
router.put("/elements/quiz", function (req, res) {
  var quiz = {
    quiz_title: req.body.quiz_name,
    maxTimeToFinish: req.body.quiz_time,
    pages: req.body.quiz_questions,
  };
  lmsQuiz.findOneAndUpdate(
    {
      _id: req.body.pk,
    },
    {
      $set: quiz,
    },
    function (err, count) {
      if (err) {
        res.status(400).json({ error: "Bad request. Check the request parameters." });
      } else {
        res.json(count);
      }
    },
  );
});

/**
 * @swagger
 * /courses/elements/removequiz:
 *   delete:
 *     summary: Remove a quiz
 *     tags: [Courses]
 *     parameters:
 *       - in: formData
 *         name: quiz_id
 *         required: true
 *         type: string
 *         description: ID of the quiz to be removed
 *     responses:
 *       '200':
 *         description: Quiz removed successfully
 *       '400':
 *         description: Bad request. Check the request parameters.
 */
router.delete("/elements/removequiz", function (req, res) {
  var quiz_id = req.body.quiz_id;
  const { ObjectId } = require("mongodb"); // or ObjectID
  const safeObjectId = (s) => (ObjectId.isValid(s) ? new ObjectId(s) : null);

  lmsQuiz.findOneAndUpdate(
    {
      _id: safeObjectId(quiz_id),
    },
    {
      $set: { deleted: "true" },
    },
    function (err, count) {
      if (err) {
        console.log(err);
      } else {
        res.json(count);
      }
    },
  );
});

/**
 * @swagger
 * /courses/elements/removequiz:
 *   delete:
 *     summary: Remove a quiz
 *     tags: [Courses]
 *     parameters:
 *       - in: formData
 *         name: quiz_id
 *         required: true
 *         type: string
 *         description: ID of the quiz to be removed
 *     responses:
 *       '200':
 *         description: Quiz removed successfully
 *       '400':
 *         description: Bad request. Check the request parameters.
 */
router.post("/elements", function (req, res) {
  req.body.element_createdon = new Date();
  var element = new lmsElements(req.body);
  element.save(function (err, results) {
    if (err) {
      res.status(400).json({ error: "Bad request. Check the request parameters." });
    } else {
      res.json(results);
    }
  });
});

/**
 * @swagger
 * /courses/elements/updateinfo:
 *   post:
 *     summary: Update information for an element
 *     tags: [Courses]
 *     parameters:
 *       - in: formData
 *         name: pk
 *         required: true
 *         type: string
 *         description: ID of the element to update
 *       - in: formData
 *         name: name
 *         required: true
 *         type: string
 *         description: Name of the field to update
 *       - in: formData
 *         name: value
 *         required: true
 *         type: string
 *         description: New value for the specified field
 *     responses:
 *       '200':
 *         description: Element information updated successfully
 *       '400':
 *         description: Bad request. Check the request payload.
 */
router.post("/elements/updateinfo", function (req, res) {
  let updateQuery = {};
  updateQuery[req.body.name] = req.body.value;
  lmsElements.findOneAndUpdate(
    {
      _id: req.body.pk,
    },
    {
      $set: updateQuery,
    },
    function (err, count) {
      if (err) {
        res.status(400).json({ error: "Bad request. Check the request payload." });
      } else {
        res.json(count);
      }
    },
  );
});

/**
 * @swagger
 * /courses/elements/removeelement:
 *   delete:
 *     summary: Remove an element
 *     tags: [Courses]
 *     parameters:
 *       - in: body
 *         name: element_id
 *         required: true
 *         description: ID of the element to be removed
 *         schema:
 *           type: object
 *           properties:
 *             element_id:
 *               type: string
 *         example:
 *           element_id: 5f8f3b9e1c9d44000047b997
 *     responses:
 *       '200':
 *         description: Element removed successfully
 *       '404':
 *         description: Element not found
 */
router.delete("/elements/removeelement", function (req, res) {
  var element_id = req.body.element_id;
  const { ObjectId } = require("mongodb"); // or ObjectID
  const safeObjectId = (s) => (ObjectId.isValid(s) ? new ObjectId(s) : null);

  lmsElements.findOneAndUpdate(
    {
      _id: safeObjectId(element_id),
    },
    {
      $set: { deleted: "true" },
    },
    function (err, count) {
      if (err) {
        console.log(err);
      } else {
        res.json(count);
      }
    },
  );
});

/**
 * @swagger
 * /courses/faqs/manage/{courseid}:
 *   get:
 *     summary: Retrieve FAQs for a course (Admin)
 *     tags: [FAQs]
 *     parameters:
 *       - in: path
 *         name: courseid
 *         required: true
 *         description: ID of the course for which FAQs are to be retrieved
 *         schema:
 *           type: string
 *         example: 5f8f3b9e1c9d44000047b999
 */
router.get("/faqs/manage/:courseid", isAdmin, function (req, res) {
  faqModel.find(
    { deleted: { $ne: "true" }, course_id: req.params.courseid },
    function (err, faqdocs) {
      res.render("adminpanel/faq", {
        email: req.user.email,
        courseid: req.params.courseid,
        registered: req.user.courses.length > 0 ? true : false,
        recruiter: req.user.role && req.user.role == "3" ? true : false,
        name: getusername(req.user),
        notifications: req.user.notifications,
        faqdocs: faqdocs,
        moment: moment,
      });
    },
  );
});

/**
 * @swagger
 * /courses/faqs/{course_id}:
 *   get:
 *     summary: Retrieve FAQs for a specific course
 *     tags: [FAQs]
 *     parameters:
 *       - in: path
 *         name: course_id
 *         required: true
 *         description: ID of the course for which FAQs are to be retrieved
 *         schema:
 *           type: string
 *         example: 5f8f3b9e1c9d44000047b999
 */
router.get("/faqs/:course_id", function (req, res) {
  req.session.returnTo = "/courses/digital-marketing-course";
  faqModel.aggregate(
    [
      {
        $match: { deleted: { $ne: true }, course_id: req.params.course_id },
      },
      {
        $group: {
          _id: { category: "$category" },
          question: { $push: "$question" },
          answer: { $push: "$answer" },
        },
      },
    ],
    function (err, faqdocs) {
      var html = "";
      for (var i = 0; i < faqdocs.length; i++) {
        html =
          html +
          `
            <div class="card">
            <div class="card-header" id="headingfaq${i}">
                <h4 class="mb-0 ${
                  i !== 0 ? "collapsed" : "collapsed"
                } categoryheading" data-toggle="collapse"
                    data-target="#collapsefaq${i}" aria-expanded="${
                      i == 0 ? "false" : "false"
                    }"
                    aria-controls="collapse${i}">
                    ${faqdocs[i]["_id"].category}
                </h4>
                <hr class="mx-5">
            </div>
            <div id="collapsefaq${i}" class="collapse ${i == 0 ? "" : ""}"
                aria-labelledby="headingfaq${i}" data-parent="#accordionExample">
                <div class="accordion" id="accordionExamplefaq${i}">
                    
                  ${Object.keys(faqdocs[i].question)
                    .map(function (j) {
                      return `
                <div class="faqcard">
                    <div class="card-header" id="headingfaq${i}-${j}">
                        <h4 class="mb-0" data-toggle="collapse"
                            data-target="#collapsefaq${i}-${j}" aria-expanded="${
                              j == 0 ? "true" : "true"
                            }"
                            aria-controls="collapse${i}-${j}">
                            Q. ${faqdocs[i].question[j]}
                        </h4>
                    </div>

                    <div id="collapsefaq${i}-${j}" class="collapse ${
                      j == 0 ? "show" : "show"
                    }"
                        aria-labelledby="heading${i}-${j}"
                        data-parent="#accordionExamplefaq">
                        <div class="card-body ml-4">
                            <p class="mb-0">
                            ${faqdocs[i].answer[j]}
                            </p>
                        </div>
                    </div>
                    ${
                      j + 1 == faqdocs[i].question.length
                        ? ""
                        : `<hr class="faqcard-hr ml-5">`
                    }
                </div>`;
                    })
                    .join("")}
              </div>      
            
            </div>
          </div>
        </div>`;
      }
      res.json(html);
    },
  );
});

/**
 * @swagger
 * /courses/faqs/addfaq:
 *   post:
 *     summary: Add a new FAQ
 *     tags: [FAQs]
 *     parameters:
 *       - in: formData
 *         name: question
 *         type: string
 *         required: true
 *         description: The question for the FAQ
 *       - in: formData
 *         name: answer
 *         type: string
 *         required: true
 *         description: The answer for the FAQ
 *       - in: formData
 *         name: courseid
 *         type: string
 *         required: true
 *         description: ID of the course for which FAQ is being added
 *     responses:
 *       '200':
 *         description: FAQ added successfully
 *       '400':
 *         description: Bad request. Check the request parameters.
 *       '500':
 *         description: Internal Server Error
 */
router.post("/faqs/addfaq", function (req, res) {
  var faq = new faqModel({
    question: req.body.question,
    answer: req.body.answer,
    course_id: req.body.courseid,
    date: new Date(),
  });
  faq.save(function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.redirect("/courses/faqs/manage/" + req.body.courseid);
    }
  });
});

/**
 * @swagger
 * /courses/faqs/updateinfo:
 *   post:
 *     summary: Update FAQ information
 *     tags: [FAQs]
 *     parameters:
 *       - in: formData
 *         name: pk
 *         type: string
 *         required: true
 *         description: The ID of the FAQ to update
 *       - in: formData
 *         name: name
 *         type: string
 *         required: true
 *         description: The property name to update (e.g., 'question' or 'answer')
 *       - in: formData
 *         name: value
 *         type: string
 *         required: true
 *         description: The new value for the specified property
 *     responses:
 *       '200':
 *         description: FAQ information updated successfully
 *       '400':
 *         description: Bad request. Check the request parameters.
 *       '500':
 *         description: Internal Server Error
 */
router.post("/faqs/updateinfo", function (req, res) {
  let updateQuery = {};
  updateQuery[req.body.name] = req.body.value;
  faqModel.findOneAndUpdate(
    {
      _id: req.body.pk,
    },
    {
      $set: updateQuery,
    },
    function (err, count) {
      if (err) {
        res.status(500).json(err);
      } else {
        res.json(count);
      }
    },
  );
});

/**
 * @swagger
 * /faqs/removefaq:
 *   delete:
 *     summary: Remove FAQ
 *     tags: [FAQs]
 *     parameters:
 *       - in: formData
 *         name: faqid
 *         type: string
 *         required: true
 *         description: The ID of the FAQ to remove
 *     responses:
 *       '200':
 *         description: FAQ removed successfully
 *       '400':
 *         description: Bad request. Check the request parameters.
 *       '500':
 *         description: Internal Server Error
 */
router.delete("/faqs/removefaq", function (req, res) {
  faqModel.findOneAndUpdate(
    {
      _id: req.body.faqid,
    },
    {
      $set: { deleted: true },
    },
    function (err, count) {
      if (err) {
        res.status(500).json(err);
      } else {
        res.json(count);
      }
    },
  );
});

module.exports = router;
