var express = require("express");
var router = express.Router();
var lmsCourses = require("../models/courses");
var lmsUsers = require("../models/user");
var lmsForgotpassword = require("../models/forgotpassword");
var moment = require("moment");
var aws = require("aws-sdk");
const dotenv = require("dotenv");
dotenv.config();
aws.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
});

var awsSesMail = require("aws-ses-mail");
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
 * tags:
 *   name: Users
 *   description: API operations related to users
 * /users/datatable:
 *   get:
 *     summary: Get data for validated users in server-side datatable
 *     description: Retrieve data for validated users to be displayed in a server-side datatable.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Data for validated users retrieved successfully.
 *       500:
 *         description: Internal server error.
 */
router.get("/datatable", function (req, res) {
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
    "user",
    "email",
    "collegename",
    "access",
    "certificate",
    "ip",
    "created",
    "lastloggedin",
    "action",
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

  var query = {
    $or: [
      { deleted: { $ne: true }, validated: true },
      { "paymentids.0": { $exists: true } },
    ],
  };
  /*
   * Filtering
   * NOTE this does not match the built-in DataTables filtering which does it
   * word by word on any field. It's possible to do here, but concerned about efficiency
   * on very large tables, and MySQL's regex functionality is very limited
   */
  if (req.query.sSearch != "") {
    var arr = [
      { "local.name": { $regex: "" + req.query.sSearch + "", $options: "i" } },
      { email: { $regex: "" + req.query.sSearch + "", $options: "i" } },
      {
        "local.lastname": {
          $regex: "" + req.query.sSearch + "",
          $options: "i",
        },
      },
    ];
    query.$or = arr;
  }

  var filterArray = [];

  if (req.query.fromdatefilter !== "") {
    filterArray.push({ createddate: { $gte: req.query.fromdatefilter } });
    query.$and = filterArray;
  }
  if (req.query.todatefilter !== "") {
    console.log("1111");
    filterArray.push({ createddate: { $lte: req.query.todatefilter } });
    query.$and = filterArray;
  }
  if (req.query.purposefilter !== "") {
    console.log("222");
    filterArray.push({ courses: req.query.purposefilter });
    query.$and = filterArray;
  }

  /*
   * Ordering
   */
  var sortObject = { date: -1 };
  if (req.query.iSortCol_0 && req.query.iSortCol_0 == 0) {
    if (req.query.sSortDir_0 == "desc") {
      var sortObject = {};
      var stype = "local.name";
      var sdir = -1;
      sortObject[stype] = sdir;
    } else {
      var sortObject = {};
      var stype = "local.name";
      var sdir = 1;
      sortObject[stype] = sdir;
    }
  } else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 1) {
    if (req.query.sSortDir_0 == "desc") {
      var sortObject = {};
      var stype = "email";
      var sdir = -1;
      sortObject[stype] = sdir;
    } else {
      var sortObject = {};
      var stype = "email";
      var sdir = 1;
      sortObject[stype] = sdir;
    }
  } else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 2) {
    if (req.query.sSortDir_0 == "desc") {
      var sortObject = {};
      var stype = "collegename";
      var sdir = -1;
      sortObject[stype] = sdir;
    } else {
      var sortObject = {};
      var stype = "collegename";
      var sdir = 1;
      sortObject[stype] = sdir;
    }
  } else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 5) {
    if (req.query.sSortDir_0 == "desc") {
      var sortObject = {};
      var stype = "ip";
      var sdir = -1;
      sortObject[stype] = sdir;
    } else {
      var sortObject = {};
      var stype = "ip";
      var sdir = 1;
      sortObject[stype] = sdir;
    }
  } else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 6) {
    if (req.query.sSortDir_0 == "desc") {
      var sortObject = {};
      var stype = "createddate";
      var sdir = -1;
      sortObject[stype] = sdir;
    } else {
      var sortObject = {};
      var stype = "createddate";
      var sdir = 1;
      sortObject[stype] = sdir;
    }
  } else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 7) {
    if (req.query.sSortDir_0 == "desc") {
      var sortObject = {};
      var stype = "date";
      var sdir = -1;
      sortObject[stype] = sdir;
    } else {
      var sortObject = {};
      var stype = "date";
      var sdir = 1;
      sortObject[stype] = sdir;
    }
  }
  lmsUsers
    .find(query)
    .skip(parseInt($sDisplayStart))
    .limit(parseInt($sLength))
    .sort(sortObject)
    .exec(function (err, docs) {
      lmsUsers.count(query, function (err, count) {
        lmsCourses.find({ deleted: { $ne: "true" } }, function (err, courses) {
          var aaData = [];
          for (let i = 0; i < docs.length; i++) {
            var $row = [];
            for (var j = 0; j < $aColumns.length; j++) {
              if ($aColumns[j] == "user") {
                $row.push(docs[i].local.name);
              } else if ($aColumns[j] == "email") {
                $row.push(docs[i].local.email);
              } else if ($aColumns[j] == "collegename") {
                $row.push(docs[i].collegename ? docs[i].collegename : "NA");
              } else if ($aColumns[j] == "access") {
                var accesscourses = "";
                for (var h = 0; h < courses.length; h++) {
                  accesscourses =
                    accesscourses +
                    `<option ${
                      docs[i].courses &&
                      docs[i].courses.indexOf(courses[h]["_id"]) > -1
                        ? "selected"
                        : ""
                    } value="${courses[h]["_id"]}">${
                      courses[h]["course_name"]
                    }</option>`;
                }
                $row.push(`<form data-id="${docs[i]._id}" class="addaccess" action="">
                      <select class="js-example-basic-multiple" name="states[]" multiple="multiple">
                      ${accesscourses}
                      </select>
                      <input type="submit">
                      </form>`);
              } else if ($aColumns[j] == "certificate") {
                var accesscourses = "";
                for (var h = 0; h < courses.length; h++) {
                  accesscourses =
                    accesscourses +
                    `<option ${
                      docs[i].certificates &&
                      docs[i].certificates.indexOf(courses[h]["_id"]) > -1
                        ? "selected"
                        : ""
                    } value="${courses[h]["_id"]}">${
                      courses[h]["course_name"]
                    }</option>`;
                }
                $row.push(`
                          <form data-certificates="${docs[i].certificates}" data-name="${docs[i].local.name}" data-email="${docs[i].local.email}" data-id="${docs[i]._id}" class="addcertificate" action="">
                      <select class="js-example-basic-multiple certificateselect" name="states[]" multiple="multiple">
                      ${accesscourses}
                      </select>
                      <input type="submit">
                      </form>`);
              } else if ($aColumns[j] == "ip") {
                if (docs[i]["ip"]) {
                  $row.push(docs[i]["ip"]);
                } else {
                  $row.push("NA");
                }
              } else if ($aColumns[j] == "created") {
                $row.push(
                  moment(docs[i]["createddate"]).format("DD/MMM/YYYY HH:mm A"),
                );
              } else if ($aColumns[j] == "lastloggedin") {
                $row.push(
                  moment(docs[i]["date"]).format("DD/MMM/YYYY HH:mm A"),
                );
              } else if ($aColumns[j] == "action") {
                var user = docs[i];
                if (
                  typeof user.isadmin == "undefined" &&
                  user.isadmin == null
                ) {
                  var isadmin = "false";
                  var dataisadmin = "false";
                  var tooltiptitle = "Make admin";
                  var membertext = "Member";
                } else if (user.isadmin == "true") {
                  var isadmin = "true";
                  var dataisadmin = "true";
                  var tooltiptitle = "Remove admin";
                  var membertext = "Admin";
                } else {
                  var isadmin = "false";
                  var dataisadmin = "false";
                  var tooltiptitle = "Make admin";
                  var membertext = "Member";
                }
                var iconadmin;
                if (isadmin == "true") {
                  iconadmin = `<i data-sample="aeg" data-isadmin="true" class="adminaddremoveicon fa fa-times"></i>`;
                } else {
                  iconadmin = `<i data-sample="aeohgi" data-isadmin="false" class="adminaddremoveicon fa fa-plus"></i>`;
                }
                $row.push(`<a data-html="true" data-toggle="tooltip" data-placement="top" data-userid="${docs[i]["_id"]}" data-email="${docs[i].local.email}" class="toggleadmin" data-isadmin="${dataisadmin}" href="#" class="table-link">
                              <span class="fa-stack">
                              ${iconadmin}
                              </span>
                              </a>
                              <a data-html="true" data-toggle="tooltip" data-placement="top" title="Remove user" data-email="${docs[i].local.email}" href="#" class="removeuser table-link danger">
                              <span style="color: red!important;" class="fa-stack">
                              <i class="fa fa-square fa-stack-2x"></i>
                              <i class="fa fa-trash-o fa-stack-1x fa-inverse"></i>
                              </span>
                              </a>`);
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
});

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API operations related to users
 * /users/datatable/unvalidated:
 *   get:
 *     summary: Get data for unvalidated users in server-side datatable
 *     description: Retrieve data for unvalidated users to be displayed in a server-side datatable.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Data for unvalidated users retrieved successfully.
 *       500:
 *         description: Internal server error.
 */
router.get("/datatable/unvalidated", function (req, res) {
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
    "user",
    "email",
    "collegename",
    "access",
    "certificate",
    "ip",
    "created",
    "lastloggedin",
    "action",
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

  var query = { deleted: { $ne: true }, validated: false };
  /*
   * Filtering
   * NOTE this does not match the built-in DataTables filtering which does it
   * word by word on any field. It's possible to do here, but concerned about efficiency
   * on very large tables, and MySQL's regex functionality is very limited
   */
  if (req.query.sSearch != "") {
    var arr = [
      { "local.name": { $regex: "" + req.query.sSearch + "", $options: "i" } },
      { email: { $regex: "" + req.query.sSearch + "", $options: "i" } },
      {
        "local.lastname": {
          $regex: "" + req.query.sSearch + "",
          $options: "i",
        },
      },
    ];
    query.$or = arr;
  }

  var filterArray = [];

  if (req.query.fromdatefilter !== "") {
    filterArray.push({ createddate: { $gte: req.query.fromdatefilter } });
    query.$and = filterArray;
  }
  if (req.query.todatefilter !== "") {
    console.log("1111");
    filterArray.push({ createddate: { $lte: req.query.todatefilter } });
    query.$and = filterArray;
  }
  if (req.query.purposefilter !== "") {
    console.log("222");
    filterArray.push({ courses: req.query.purposefilter });
    query.$and = filterArray;
  }

  var sortObject = { date: -1 };
  if (req.query.iSortCol_0 && req.query.iSortCol_0 == 0) {
    if (req.query.sSortDir_0 == "desc") {
      var sortObject = {};
      var stype = "local.name";
      var sdir = -1;
      sortObject[stype] = sdir;
    } else {
      var sortObject = {};
      var stype = "local.name";
      var sdir = 1;
      sortObject[stype] = sdir;
    }
  } else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 1) {
    if (req.query.sSortDir_0 == "desc") {
      var sortObject = {};
      var stype = "email";
      var sdir = -1;
      sortObject[stype] = sdir;
    } else {
      var sortObject = {};
      var stype = "email";
      var sdir = 1;
      sortObject[stype] = sdir;
    }
  } else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 2) {
    if (req.query.sSortDir_0 == "desc") {
      var sortObject = {};
      var stype = "collegename";
      var sdir = -1;
      sortObject[stype] = sdir;
    } else {
      var sortObject = {};
      var stype = "collegename";
      var sdir = 1;
      sortObject[stype] = sdir;
    }
  } else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 5) {
    if (req.query.sSortDir_0 == "desc") {
      var sortObject = {};
      var stype = "ip";
      var sdir = -1;
      sortObject[stype] = sdir;
    } else {
      var sortObject = {};
      var stype = "ip";
      var sdir = 1;
      sortObject[stype] = sdir;
    }
  } else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 6) {
    if (req.query.sSortDir_0 == "desc") {
      var sortObject = {};
      var stype = "createddate";
      var sdir = -1;
      sortObject[stype] = sdir;
    } else {
      var sortObject = {};
      var stype = "createddate";
      var sdir = 1;
      sortObject[stype] = sdir;
    }
  } else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 7) {
    if (req.query.sSortDir_0 == "desc") {
      var sortObject = {};
      var stype = "date";
      var sdir = -1;
      sortObject[stype] = sdir;
    } else {
      var sortObject = {};
      var stype = "date";
      var sdir = 1;
      sortObject[stype] = sdir;
    }
  }
  lmsUsers
    .find(query)
    .skip(parseInt($sDisplayStart))
    .limit(parseInt($sLength))
    .sort(sortObject)
    .exec(function (err, docs) {
      lmsUsers.count(query, function (err, count) {
        lmsCourses.find({ deleted: { $ne: "true" } }, function (err, courses) {
          var aaData = [];
          for (let i = 0; i < docs.length; i++) {
            var $row = [];
            for (var j = 0; j < $aColumns.length; j++) {
              if ($aColumns[j] == "user") {
                $row.push(docs[i].local.name);
              } else if ($aColumns[j] == "email") {
                $row.push(docs[i].local.email);
              } else if ($aColumns[j] == "collegename") {
                $row.push(docs[i].collegename ? docs[i].collegename : "NA");
              } else if ($aColumns[j] == "access") {
                var accesscourses = "";
                for (var h = 0; h < courses.length; h++) {
                  accesscourses =
                    accesscourses +
                    `<option ${
                      docs[i].courses &&
                      docs[i].courses.indexOf(courses[h]["_id"]) > -1
                        ? "selected"
                        : ""
                    } value="${courses[h]["_id"]}">${
                      courses[h]["course_name"]
                    }</option>`;
                }
                $row.push(`<form data-id="${docs[i]._id}" class="addaccess" action="">
                      <select class="js-example-basic-multiple" name="states[]" multiple="multiple">
                      ${accesscourses}
                      </select>
                      <input type="submit">
                      </form>`);
              } else if ($aColumns[j] == "certificate") {
                var accesscourses = "";
                for (var h = 0; h < courses.length; h++) {
                  accesscourses =
                    accesscourses +
                    `<option ${
                      docs[i].certificates &&
                      docs[i].certificates.indexOf(courses[h]["_id"]) > -1
                        ? "selected"
                        : ""
                    } value="${courses[h]["_id"]}">${
                      courses[h]["course_name"]
                    }</option>`;
                }
                $row.push(`
                          <form data-certificates="${docs[i].certificates}" data-name="${docs[i].local.name}" data-email="${docs[i].local.email}" data-id="${docs[i]._id}" class="addcertificate" action="">
                      <select class="js-example-basic-multiple certificateselect" name="states[]" multiple="multiple">
                      ${accesscourses}
                      </select>
                      <input type="submit">
                      </form>`);
              } else if ($aColumns[j] == "ip") {
                if (docs[i]["ip"]) {
                  $row.push(docs[i]["ip"]);
                } else {
                  $row.push("NA");
                }
              } else if ($aColumns[j] == "created") {
                $row.push(
                  moment(docs[i]["createddate"]).format("DD/MMM/YYYY HH:mm A"),
                );
              } else if ($aColumns[j] == "lastloggedin") {
                $row.push(
                  moment(docs[i]["date"]).format("DD/MMM/YYYY HH:mm A"),
                );
              } else if ($aColumns[j] == "action") {
                var user = docs[i];
                if (
                  typeof user.isadmin == "undefined" &&
                  user.isadmin == null
                ) {
                  var isadmin = "false";
                  var dataisadmin = "false";
                  var tooltiptitle = "Make admin";
                  var membertext = "Member";
                } else if (user.isadmin == "true") {
                  var isadmin = "true";
                  var dataisadmin = "true";
                  var tooltiptitle = "Remove admin";
                  var membertext = "Admin";
                } else {
                  var isadmin = "false";
                  var dataisadmin = "false";
                  var tooltiptitle = "Make admin";
                  var membertext = "Member";
                }
                var iconadmin;
                if (isadmin == "true") {
                  iconadmin = `<i data-sample="aeg" data-isadmin="true" class="adminaddremoveicon fa fa-times"></i>`;
                } else {
                  iconadmin = `<i data-sample="aeohgi" data-isadmin="false" class="adminaddremoveicon fa fa-plus"></i>`;
                }
                $row.push(` <a data-email="${docs[i].local.email}" class="validateuser">Validate</a><a data-html="true" data-toggle="tooltip" data-placement="top" data-userid="${docs[i]["_id"]}" data-email="${docs[i].local.email}" class="toggleadmin" data-isadmin="${dataisadmin}" href="#" class="table-link">
                              <span class="fa-stack">
                              ${iconadmin}
                              </span>
                              </a>
                             
                              <a data-html="true" data-toggle="tooltip" data-placement="top" title="Remove user" data-email="${docs[i].local.email}" href="#" class="removeuser table-link danger">
                              <span style="color: red!important;" class="fa-stack">
                              <i class="fa fa-square fa-stack-2x"></i>
                              <i class="fa fa-trash-o fa-stack-1x fa-inverse"></i>
                              </span>
                              </a>`);
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
});

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API operations related to users
 * /users/user:
 *   delete:
 *     summary: Remove user
 *     description: Remove a user based on email
 *     tags: [Users]
 *     parameters:
 *       - in: body
 *         name: requestBody
 *         description: The request body containing the email of the user to be removed.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             emailid:
 *               type: string
 *               description: The email of the user to be removed.
 *     responses:
 *       200:
 *         description: User removed successfully.
 *       400:
 *         description: Bad request, invalid parameters.
 *       500:
 *         description: Internal server error.
 */
router.delete("/user", function (req, res) {
  lmsUsers.remove({ email: req.body.emailid }, function (err, count) {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(count);
    }
  });
});


/**
 * @swagger
 * /users/resetpassword:
 *   put:
 *     tags: [Users]
 *     summary: Reset user password
 *     description: Reset user password based on email
 *     parameters:
 *       - in: body
 *         name: requestBody
 *         description: The request body containing email and password.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               description: The email of the user whose password needs to be reset.
 *             password:
 *               type: string
 *               description: The new password for the user.
 *     responses:
 *       200:
 *         description: Password reset successfully.
 *       400:
 *         description: Bad request, invalid parameters.
 *       500:
 *         description: Internal server error.
 */
router.put("/resetpassword", function (req, res) {
  var password = req.body.password;
  var email = req.body.email;
  console.log("FORM DATA");
  console.log(password);
  console.log(email);
  var newUser = new lmsUsers();
  lmsUsers.update(
    {
      email: email,
    },
    {
      $set: { "local.password": newUser.generateHash(password) },
    },
    function (err, count) {
      if (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json(count);
      }
    },
  );
});


/**
 * @swagger
 * /users/retrievepassword/{forgotpasswordid}:
 *   get:
 *     tags: [Users]
 *     summary: Render the password reset page
 *     description: |
 *       Retrieves information for rendering the password reset page based on the provided forgot password ID.
 *     parameters:
 *       - in: path
 *         name: forgotpasswordid
 *         description: Forgot password record ID
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Password reset page rendered successfully
 *         content:
 *           text/html:
 *             example: '<html><head></head><body>Reset your password for ampdigital.co</body></html>'
 *       400:
 *         description: Invalid request or forgot password record not found
 *       500:
 *         description: Internal server error
 */
router.get("/retrievepassword/:forgotpasswordid", function (req, res) {
  lmsForgotpassword.find({ _id: req.params.forgotpasswordid }, function (err, docs) {
    if (docs && docs.length > 0) {
      console.log(docs);
      res.render("resetpassword", {
        title: "Express",
        email: docs[0].email,
        name: "User",
      });
    } else {
      // Forgot password record not found
      res.status(400).json({ error: "Invalid request or forgot password record not found" });
    }
  });
});

/**
 * @swagger
 * /users/forgotpassword:
 *   post:
 *     tags: [Users]
 *     summary: Request to reset password
 *     description: |
 *       Sends an email with a link to reset the user's password.
 *       The link is valid for 30 minutes.
 *     parameters:
 *       - in: body
 *         name: email
 *         description: User's email address
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *     responses:
 *       200:
 *         description: Email sent successfully
 *       400:
 *         description: Invalid request payload
 *       404:
 *         description: User not found or not validated
 *       500:
 *         description: Internal server error
 */
router.post("/forgotpassword", function (req, res) {
  // Find the user by email and check if validated
  lmsUsers.findOne({ email: req.body.email, validated: true }, function (err, user) {
    if (user) {
      // Create a new forgotpassword record
      var forgotpassword = new lmsForgotpassword({
        email: req.body.email,
        date: new Date(),
      });

      // Save the forgotpassword record
      forgotpassword.save(function (err, results) {
        if (err) {
          // Handle save error
          res.json(err);
        } else {
          // Generate reset link
          var link = "http://www.ampdigital.co/users/retrievepassword/" + results["_id"];
          var email = req.body.email;
          
          // Configure AWS SES
          var awsSesMail = require("aws-ses-mail");
          var sesMail = new awsSesMail();
          var sesConfig = {
            accessKeyId: process.env.ACCESS_KEY_ID,
            secretAccessKey: process.env.SECRET_ACCESS_KEY,
            region: process.env.REGION,
          };
          sesMail.setConfig(sesConfig);

          // HTML content for the email
          var html = `
            Hello from AMP Digital,<br>
            <br>
            We recently received your request to reset the password for your AMP Digital account.&nbsp; &nbsp;To do so, click the following link:<br>
            <br>
            <a href="${link}" target="_blank">Link</a><br>
            <br>
            For your account's protection, the above link is good only for single use and expires in thirty (30) minutes.<br>
            <br>
            If you have any follow-up questions or concerns, please contact us anytime at <a href="amitabh@ampdigital.co">amitabh@ampdigital.co</a>.<br>
            <br>
            <br>
            Best Wishes,<br>
            ${getContactInformationHtml()}
          `;

          // Email options
          var options = {
            from: "ampdigital.co <amitabh@ads4growth.com>",
            to: email,
            subject: "ampdigital.co: Password reset instructions",
            content: "<html><head></head><body>" + html + "</body></html>",
          };

          // Send email
          sesMail.sendEmail(options, function (err) {
            // TODO sth....
            console.log(err);
            res.json(results);
          });
        }
      });
    } else {
      // User not found or not validated
      res.json(-1);
    }
  });
});

/**
 * @swagger
 * /users/makeadmin:
 *   put:
 *     summary: Grant admin privileges to a user
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: emailid
 *         required: true
 *         description: The email address of the user to be made an admin
 *         schema:
 *           type: string
 *           example: user@example.com
 *     responses:
 *       200:
 *         description: Admin privileges granted successfully
 *       400:
 *         description: Bad request. Check your query parameters.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error. Something went wrong on the server.
 */
router.put("/makeadmin", function (req, res) {
  // Grant admin privileges to the user
  lmsUsers.updateOne(
    { email: req.query.emailid },
    { $set: { isadmin: true } },
    function (err, result) {
      if (err) {
        // Handle database error
        console.error("Error granting admin privileges:", err);
        res.status(500).json({ error: 'Internal server error' });
      } else if (result.nModified === 0) {
        // User not found
        res.status(404).json({ error: 'User not found' });
      } else {
        // Admin privileges granted successfully
        res.status(200).json({ message: 'Admin privileges granted successfully' });
      }
    }
  );
});

/**
 * @swagger
 * /users/validateuser:
 *   put:
 *     summary: Validate a user by updating their validation status
 *     tags: [Users]
 *     parameters:
 *       - in: body
 *         name: user
 *         required: true
 *         description: The email address of the user to be validated
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               description: The email address of the user to be validated
 *               example: user@example.com
 *     responses:
 *       200:
 *         description: User successfully validated
 *       400:
 *         description: Bad request. Check your request payload.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error. Something went wrong on the server.
 */
router.put("/validateuser", function (req, res) {
  // Update the validation status of the user
  lmsUsers.findOneAndUpdate(
    { email: req.body.email },
    { $set: { validated: true } },
    { new: true }, // Return the updated document
    function (err, user) {
      if (err) {
        // Handle database error
        console.error("Error updating user validation status:", err);
        res.status(500).json({ error: 'Internal server error' });
      } else if (!user) {
        // User not found
        res.status(400).json({ error: 'User not found' });
      } else {
        // User successfully validated
        res.status(200).json({ message: 'User successfully validated', user });
      }
    }
  );
});

/**
 * @swagger
 * /users/removeadmin:
 *   put:
 *     summary: Remove admin status from a user.
 *     description: Removes admin status from a user based on the provided email.
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: emailid
 *         required: true
 *         description: Email of the user to remove admin status.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success. Returns the updated user object.
 *       500:
 *         description: Internal Server Error. Something went wrong on the server.
 */
router.put("/removeadmin", function (req, res) {
  lmsUsers.findOneAndUpdate(
    {
      email: req.query.emailid,
    },
    {
      $unset: { isadmin: "" },
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

module.exports = router;
