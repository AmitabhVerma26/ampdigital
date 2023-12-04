var express = require('express');
var router = express.Router();
var lmsCourses = require('../models/courses');
var lmsUsers = require('../models/user');
var lmsForgotpassword = require('../models/forgotpassword');
var moment = require('moment');
var aws = require('aws-sdk');
aws.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION
});

var awsSesMail = require('aws-ses-mail');

var sesMail = new awsSesMail();
var sesConfig = {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION
};
sesMail.setConfig(sesConfig);

router.get('/datatable', function (req, res) {
  /*
 * Script:    DataTables server-side script for NODE and MONGODB
 * Copyright: 2018 - Siddharth Sogani
 */

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Easy set variables
   */

  /* Array of columns to be displayed in DataTable
   */
  var $aColumns = ['user', 'email', 'collegename', 'access', 'batches', 'certificate', 'ip', 'created', 'lastloggedin', 'action'];

  /*
   * Paging
   */
  var $sDisplayStart = 0;
  var $sLength = "";
  if ((req.query.iDisplayStart) && req.query.iDisplayLength != '-1') {
      $sDisplayStart = req.query.iDisplayStart;
      $sLength = req.query.iDisplayLength;
  }

  var query = {$or: [{ deleted: { $ne: true }, validated: true}, {'paymentids.0': {$exists: true}}]};
  /*
 * Filtering
 * NOTE this does not match the built-in DataTables filtering which does it
 * word by word on any field. It's possible to do here, but concerned about efficiency
 * on very large tables, and MySQL's regex functionality is very limited
 */
  if (req.query.sSearch != "") {
      var arr = [{ "local.name": { $regex: '' + req.query.sSearch + '', '$options': 'i' } }, { "email": { $regex: '' + req.query.sSearch + '', '$options': 'i' } }, { "local.lastname": { $regex: '' + req.query.sSearch + '', '$options': 'i' } }];
      query.$or = arr;
  }

  var filterArray = [];

  if (req.query.fromdatefilter !== "") {
      
      filterArray.push({ createddate: { $gte: req.query.fromdatefilter } })
      query.$and = filterArray;
  }
  if (req.query.todatefilter !== "") {
      console.log('1111');
      filterArray.push({ createddate: { $lte: req.query.todatefilter } })
      query.$and = filterArray;
  }
  if (req.query.purposefilter !== "") {
      console.log('222');
      filterArray.push({ "courses": req.query.purposefilter })
      query.$and = filterArray;
  }

  /*
 * Ordering
 */
  var sortObject = { 'date': -1 };
  if (req.query.iSortCol_0 && req.query.iSortCol_0 == 0) {
      if (req.query.sSortDir_0 == 'desc') {
          var sortObject = {};
          var stype = 'local.name';
          var sdir = -1;
          sortObject[stype] = sdir;
      }
      else {
          var sortObject = {};
          var stype = 'local.name';
          var sdir = 1;
          sortObject[stype] = sdir;
      }

  } else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 1) {
      if (req.query.sSortDir_0 == 'desc') {
          var sortObject = {};
          var stype = 'email';
          var sdir = -1;
          sortObject[stype] = sdir;
      }
      else {
          var sortObject = {};
          var stype = 'email';
          var sdir = 1;
          sortObject[stype] = sdir;
      }

  } 
  else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 2) {
      if (req.query.sSortDir_0 == 'desc') {
          var sortObject = {};
          var stype = 'collegename';
          var sdir = -1;
          sortObject[stype] = sdir;
      }
      else {
          var sortObject = {};
          var stype = 'collegename';
          var sdir = 1;
          sortObject[stype] = sdir;
      }

  } 
  else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 6) {
      if (req.query.sSortDir_0 == 'desc') {
          var sortObject = {};
          var stype = 'ip';
          var sdir = -1;
          sortObject[stype] = sdir;
      }
      else {
          var sortObject = {};
          var stype = 'ip';
          var sdir = 1;
          sortObject[stype] = sdir;
      }

  } 
  else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 7) {
      if (req.query.sSortDir_0 == 'desc') {
          var sortObject = {};
          var stype = 'createddate';
          var sdir = -1;
          sortObject[stype] = sdir;
      }
      else {
          var sortObject = {};
          var stype = 'createddate';
          var sdir = 1;
          sortObject[stype] = sdir;
      }

  } else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 8) {
      if (req.query.sSortDir_0 == 'desc') {
          var sortObject = {};
          var stype = 'date';
          var sdir = -1;
          sortObject[stype] = sdir;
      }
      else {
          var sortObject = {};
          var stype = 'date';
          var sdir = 1;
          sortObject[stype] = sdir;
      }

  }
  lmsUsers.find(query).skip(parseInt($sDisplayStart)).limit(parseInt($sLength)).sort(sortObject).exec(function (err, docs) {
      lmsUsers.count(query, function (err, count) {
          lmsCourses.find({ 'deleted': { $ne: 'true' } }, function (err, courses) {
              var aaData = [];
              for (let i = 0; i < (docs).length; i++) {
                  var $row = [];
                  for (var j = 0; j < ($aColumns).length; j++) {
                      if ($aColumns[j] == 'user') {
                          $row.push(docs[i].local.name);
                      }
                      else if ($aColumns[j] == 'email') {
                          $row.push(docs[i].local.email);
                      }
                      else if ($aColumns[j] == 'collegename') {
                          $row.push(docs[i].collegename ? docs[i].collegename : 'NA');
                      }
                      else if ($aColumns[j] == 'access') {
                          var accesscourses = '';
                          for (var h = 0; h < courses.length; h++) {
                              accesscourses = accesscourses + `<option ${docs[i].courses && docs[i].courses.indexOf(courses[h]['_id']) > -1 ? "selected" : ""} value="${courses[h]['_id']}">${courses[h]['course_name']}</option>`;
                          }
                          $row.push(`<form data-id="${docs[i]._id}" class="addaccess" action="">
                      <select class="js-example-basic-multiple" name="states[]" multiple="multiple">
                      ${accesscourses}
                      </select>
                      <input type="submit">
                      </form>`);
                      }
                      else if ($aColumns[j] == 'batches') {
                          if (!docs[i].batchesformatted) {
                              $row.push("");
                          }
                          else {
                              var batches = '';
                              for (var h = 0; h < docs[i].batchesformatted.length; h++) {
                                  var key = Object.keys(docs[i].batchesformatted[h])[0];
                                  batches = batches + `${key}: ${docs[i].batchesformatted[h][key]}` + "<br>"
                              }
                              $row.push(batches);
                          }
                      }
                      else if ($aColumns[j] == 'certificate') {
                          var accesscourses = '';
                          for (var h = 0; h < courses.length; h++) {
                              accesscourses = accesscourses + `<option ${docs[i].certificates && docs[i].certificates.indexOf(courses[h]['_id']) > -1 ? "selected" : ""} value="${courses[h]['_id']}">${courses[h]['course_name']}</option>`;
                          }
                          $row.push(`
                          <form data-certificates="${docs[i].certificates}" data-name="${docs[i].local.name}" data-email="${docs[i].local.email}" data-id="${docs[i]._id}" class="addcertificate" action="">
                      <select class="js-example-basic-multiple certificateselect" name="states[]" multiple="multiple">
                      ${accesscourses}
                      </select>
                      <input type="submit">
                      </form>`);
                      }
                      else if ($aColumns[j] == 'ip') {
                          if(docs[i]['ip']){
                              $row.push(docs[i]['ip']);
                          }
                          else{
                              $row.push('NA');
                          }
                      }
                      else if ($aColumns[j] == 'created') {
                          $row.push(moment(docs[i]["createddate"]).format("DD/MMM/YYYY HH:mm A"));
                      }
                      else if ($aColumns[j] == 'lastloggedin') {
                          $row.push(moment(docs[i]['date']).format("DD/MMM/YYYY HH:mm A"));
                      }
                      else if ($aColumns[j] == 'action') {
                          var user = docs[i];
                          if (typeof user.isadmin == 'undefined' && user.isadmin == null) {
                              var isadmin = "false";
                              var dataisadmin = "false";
                              var tooltiptitle = "Make admin";
                              var membertext = "Member"
                          }
                          else if (user.isadmin == "true") {
                              var isadmin = "true";
                              var dataisadmin = "true";
                              var tooltiptitle = "Remove admin";
                              var membertext = "Admin"
                          }
                          else {
                              var isadmin = "false";
                              var dataisadmin = "false";
                              var tooltiptitle = "Make admin";
                              var membertext = "Member"
                          }
                          var iconadmin;
                          if (isadmin == "true") {
                              iconadmin = `<i data-sample="aeg" data-isadmin="true" class="adminaddremoveicon fa fa-times"></i>`;
                          }
                          else {
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
              var sample = { "sEcho": req.query.sEcho, "iTotalRecords": count, "iTotalDisplayRecords": count, "aaData": aaData };
              res.json(sample);
          });
      });
  });
});

router.get('/datatable/unvalidated', function (req, res) {
  /*
 * Script:    DataTables server-side script for NODE and MONGODB
 * Copyright: 2018 - Siddharth Sogani
 */

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Easy set variables
   */

  /* Array of columns to be displayed in DataTable
   */
  var $aColumns = ['user', 'email', 'collegename', 'access', 'batches', 'certificate', 'ip', 'created', 'lastloggedin', 'action'];

  /*
   * Paging
   */
  var $sDisplayStart = 0;
  var $sLength = "";
  if ((req.query.iDisplayStart) && req.query.iDisplayLength != '-1') {
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
      var arr = [{ "local.name": { $regex: '' + req.query.sSearch + '', '$options': 'i' } }, { "email": { $regex: '' + req.query.sSearch + '', '$options': 'i' } }, { "local.lastname": { $regex: '' + req.query.sSearch + '', '$options': 'i' } }];
      query.$or = arr;
  }

  var filterArray = [];

  if (req.query.fromdatefilter !== "") {
      
      filterArray.push({ createddate: { $gte: req.query.fromdatefilter } })
      query.$and = filterArray;
  }
  if (req.query.todatefilter !== "") {
      console.log('1111');
      filterArray.push({ createddate: { $lte: req.query.todatefilter } })
      query.$and = filterArray;
  }
  if (req.query.purposefilter !== "") {
      console.log('222');
      filterArray.push({ "courses": req.query.purposefilter })
      query.$and = filterArray;
  }

  var sortObject = { 'date': -1 };
  if (req.query.iSortCol_0 && req.query.iSortCol_0 == 0) {
      if (req.query.sSortDir_0 == 'desc') {
          var sortObject = {};
          var stype = 'local.name';
          var sdir = -1;
          sortObject[stype] = sdir;
      }
      else {
          var sortObject = {};
          var stype = 'local.name';
          var sdir = 1;
          sortObject[stype] = sdir;
      }

  } else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 1) {
      if (req.query.sSortDir_0 == 'desc') {
          var sortObject = {};
          var stype = 'email';
          var sdir = -1;
          sortObject[stype] = sdir;
      }
      else {
          var sortObject = {};
          var stype = 'email';
          var sdir = 1;
          sortObject[stype] = sdir;
      }

  }
  else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 2) {
      if (req.query.sSortDir_0 == 'desc') {
          var sortObject = {};
          var stype = 'collegename';
          var sdir = -1;
          sortObject[stype] = sdir;
      }
      else {
          var sortObject = {};
          var stype = 'collegename';
          var sdir = 1;
          sortObject[stype] = sdir;
      }

  }
  else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 6) {
      if (req.query.sSortDir_0 == 'desc') {
          var sortObject = {};
          var stype = 'ip';
          var sdir = -1;
          sortObject[stype] = sdir;
      }
      else {
          var sortObject = {};
          var stype = 'ip';
          var sdir = 1;
          sortObject[stype] = sdir;
      }

  } 
  else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 7) {
      if (req.query.sSortDir_0 == 'desc') {
          var sortObject = {};
          var stype = 'createddate';
          var sdir = -1;
          sortObject[stype] = sdir;
      }
      else {
          var sortObject = {};
          var stype = 'createddate';
          var sdir = 1;
          sortObject[stype] = sdir;
      }

  } else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 8) {
      if (req.query.sSortDir_0 == 'desc') {
          var sortObject = {};
          var stype = 'date';
          var sdir = -1;
          sortObject[stype] = sdir;
      }
      else {
          var sortObject = {};
          var stype = 'date';
          var sdir = 1;
          sortObject[stype] = sdir;
      }

  }
  lmsUsers.find(query).skip(parseInt($sDisplayStart)).limit(parseInt($sLength)).sort(sortObject).exec(function (err, docs) {
      lmsUsers.count(query, function (err, count) {
          lmsCourses.find({ 'deleted': { $ne: 'true' } }, function (err, courses) {
              var aaData = [];
              for (let i = 0; i < (docs).length; i++) {
                  var $row = [];
                  for (var j = 0; j < ($aColumns).length; j++) {
                      if ($aColumns[j] == 'user') {
                          $row.push(docs[i].local.name);
                      }
                      else if ($aColumns[j] == 'email') {
                          $row.push(docs[i].local.email);
                      }
                      else if ($aColumns[j] == 'collegename') {
                          $row.push(docs[i].collegename ? docs[i].collegename : 'NA');
                      }
                      else if ($aColumns[j] == 'access') {
                          var accesscourses = '';
                          for (var h = 0; h < courses.length; h++) {
                              accesscourses = accesscourses + `<option ${docs[i].courses && docs[i].courses.indexOf(courses[h]['_id']) > -1 ? "selected" : ""} value="${courses[h]['_id']}">${courses[h]['course_name']}</option>`;
                          }
                          $row.push(`<form data-id="${docs[i]._id}" class="addaccess" action="">
                      <select class="js-example-basic-multiple" name="states[]" multiple="multiple">
                      ${accesscourses}
                      </select>
                      <input type="submit">
                      </form>`);
                      }
                      else if ($aColumns[j] == 'batches') {
                          if (!docs[i].batchesformatted) {
                              $row.push("NA");
                          }
                          else {
                              var batches = '';
                              for (var h = 0; h < docs[i].batchesformatted.length; h++) {
                                  var key = Object.keys(docs[i].batchesformatted[h])[0];
                                  batches = batches + `${key}: ${docs[i].batchesformatted[h][key]}` + "<br>"
                              }
                              $row.push(batches);
                          }
                      }
                      else if ($aColumns[j] == 'certificate') {
                          var accesscourses = '';
                          for (var h = 0; h < courses.length; h++) {
                              accesscourses = accesscourses + `<option ${docs[i].certificates && docs[i].certificates.indexOf(courses[h]['_id']) > -1 ? "selected" : ""} value="${courses[h]['_id']}">${courses[h]['course_name']}</option>`;
                          }
                          $row.push(`
                          <form data-certificates="${docs[i].certificates}" data-name="${docs[i].local.name}" data-email="${docs[i].local.email}" data-id="${docs[i]._id}" class="addcertificate" action="">
                      <select class="js-example-basic-multiple certificateselect" name="states[]" multiple="multiple">
                      ${accesscourses}
                      </select>
                      <input type="submit">
                      </form>`);
                      }
                      else if ($aColumns[j] == 'ip') {
                          if(docs[i]['ip']){
                              $row.push(docs[i]['ip']);
                          }
                          else{
                              $row.push('NA');
                          }
                      }
                      else if ($aColumns[j] == 'created') {
                          $row.push(moment(docs[i]["createddate"]).format("DD/MMM/YYYY HH:mm A"));
                      }
                      else if ($aColumns[j] == 'lastloggedin') {
                          $row.push(moment(docs[i]['date']).format("DD/MMM/YYYY HH:mm A"));
                      }
                      else if ($aColumns[j] == 'action') {
                          var user = docs[i];
                          if (typeof user.isadmin == 'undefined' && user.isadmin == null) {
                              var isadmin = "false";
                              var dataisadmin = "false";
                              var tooltiptitle = "Make admin";
                              var membertext = "Member"
                          }
                          else if (user.isadmin == "true") {
                              var isadmin = "true";
                              var dataisadmin = "true";
                              var tooltiptitle = "Remove admin";
                              var membertext = "Admin"
                          }
                          else {
                              var isadmin = "false";
                              var dataisadmin = "false";
                              var tooltiptitle = "Make admin";
                              var membertext = "Member"
                          }
                          var iconadmin;
                          if (isadmin == "true") {
                              iconadmin = `<i data-sample="aeg" data-isadmin="true" class="adminaddremoveicon fa fa-times"></i>`;
                          }
                          else {
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
              var sample = { "sEcho": req.query.sEcho, "iTotalRecords": count, "iTotalDisplayRecords": count, "aaData": aaData };
              res.json(sample);
          });
      });
  });
});


/*Remove user*/
router.delete('/user', function (req, res) {
  lmsUsers.remove({ email: req.body.emailid }, function (err, count) {
      if (err) {
          console.log(err);
      }
      else {
          res.json(count);
      }
  });
});

router.put('/resetpassword', function (req, res) {
  var password = req.body.password;
  var email = req.body.email;
  console.log('FORM DATA');
  console.log(password);
  console.log(email);
  var newUser = new lmsUsers();
  lmsUsers.update(
      {
          email: email
      },
      {
          $set: { "local.password": newUser.generateHash(password) }
      }
      ,
      function (err, count) {
          if (err) {
              console.log(err);
          }
          else {
              res.json(count);
          }
      });
});

router.get('/retrievepassword/:forgotpasswordid', function (req, res) {
  lmsForgotpassword.find({ _id: req.params.forgotpasswordid }, function (err, docs) {
      console.log(docs);
      res.render('resetpassword', { title: 'Express', email: docs[0].email, name: "User" });

      // var dif = new Date().getTime() - new Date(docs[0].date).getTime();
      // var Seconds_from_T1_to_T2 = dif / 60000;
      // var Seconds_Between_Dates = Math.abs(Seconds_from_T1_to_T2);
      // // res.json(Seconds_Between_Dates);
      // if (Seconds_Between_Dates > 300) {
      //     res.render('resetpassword_error', { title: 'Express', email: docs.email, name: "User" });
      // }
      // else {
      //     res.render('resetpassword', { title: 'Express', email: docs.email, name: "User" });
      // }
  });
});

/*Send Forgot Password mail*/
router.post('/forgotpassword', function (req, res) {
  lmsUsers.findOne({email: email, validated: true}, function (err, user) {
      if(user){
          var forgotpassword = new lmsForgotpassword({
              email: req.body.email,
              date: new Date()
          });
          forgotpassword.save(function (err, results) {
              if (err) {
                  res.json(err);
              }
              else {
                  var link = 'http://www.ampdigital.co/users/retrievepassword/' + results['_id'];
                  var email = req.body.email;
                  var awsSesMail = require('aws-ses-mail');
      
                  var sesMail = new awsSesMail();
                  var sesConfig = {
                    accessKeyId: process.env.ACCESS_KEY_ID,
                    secretAccessKey: process.env.SECRET_ACCESS_KEY,
                    region: process.env.REGION
                  };
                  sesMail.setConfig(sesConfig);
      
                  var html = 'Hello from AMP Digital,<br>\n' +
                      '<br>\n' +
                      'We recently received your request to reset the password for your AMP Digital account.&nbsp; &nbsp;To do so, click the following link:<br>\n' +
                      '<br>\n' +
                      '<a href="' + link + '" target="_blank">' + "Link" + '</a><br>\n' +
                      '<br>\n' +
                      'For your account\'s protection, the above link is good only for single use and expires in thirty (30) minutes.<br>\n' +
                      '<br>\n' +
                      'If you have any follow-up questions or concerns, please contact us anytime at <a href="amitabh@ampdigital.co">amitabh@ampdigital.co</a>.<br>\n' +
                      '<br>\n' +
                      '<br>\n' +
                      'Best Wishes,' +
                      '<br>' +
                      '<table width="351" cellspacing="0" cellpadding="0" border="0"> <tr> <td style="text-align:left;padding-bottom:10px"><a style="display:inline-block" href="https://www.ampdigital.co"><img style="border:none;" width="150" src="https://s1g.s3.amazonaws.com/36321c48a6698bd331dca74d7497797b.jpeg"></a></td> </tr> <tr> <td style="border-top:solid #000000 2px;" height="12"></td> </tr> <tr> <td style="vertical-align: top; text-align:left;color:#000000;font-size:12px;font-family:helvetica, arial;; text-align:left"> <span> </span> <br> <span style="font:12px helvetica, arial;">Email:&nbsp;<a href="mailto:amitabh@ampdigital.co" style="color:#3388cc;text-decoration:none;">amitabh@ampdigital.co</a></span> <br><br> <span style="margin-right:5px;color:#000000;font-size:12px;font-family:helvetica, arial">Registered Address: AMP Digital</span> 403, Sovereign 1, Vatika City, Sohna Road,, Gurugram, Haryana, 122018, India<br><br> <table cellpadding="0" cellpadding="0" border="0"><tr><td style="padding-right:5px"><a href="https://facebook.com/https://www.facebook.com/AMPDigitalNet/" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/23f7b48395f8c4e25e64a2c22e9ae190.png" alt="Facebook" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://twitter.com/https://twitter.com/amitabh26" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3949237f892004c237021ac9e3182b1d.png" alt="Twitter" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://linkedin.com/in/https://in.linkedin.com/company/ads4growth?trk=public_profile_topcard_current_company" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/dcb46c3e562be637d99ea87f73f929cb.png" alt="LinkedIn" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://youtube.com/https://www.youtube.com/channel/UCMOBtxDam_55DCnmKJc8eWQ" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3b2cb9ec595ab5d3784b2343d5448cd9.png" alt="YouTube" style="border:none;"></a></td></tr></table><a href="https://www.ampdigital.co" style="text-decoration:none;color:#3388cc;">www.ampdigital.co</a> </td> </tr> </table> <table width="351" cellspacing="0" cellpadding="0" border="0" style="margin-top:10px"> <tr> <td style="text-align:left;color:#aaaaaa;font-size:10px;font-family:helvetica, arial;"><p>AMP&nbsp;Digital is a Google Partner Company</p></td> </tr> </table>';
                  var options = {
                      from: 'ampdigital.co <amitabh@ads4growth.com>',
                      to: email,
                      subject: 'ampdigital.co: Password reset instructions',
                      content: '<html><head></head><body>' + html + '</body></html>'
                  };
      
                  sesMail.sendEmail(options, function (err) {
                      // TODO sth....
                      console.log(err);
                      res.json(results)
                  });
              }
          });
      }
      else{
          res.json(-1);
      }
  });
 
  // res.json('sent');
});

/*Make a user admin*/
router.put('/makeadmin', function (req, res) {
  lmsUsers.update(
      {
          email: req.query.emailid
      },
      {
          $set: { 'isadmin': true }
      }
      ,
      function (err, count) {
          if (err) {
              console.log(err);
          }
          else {
              res.json(count);
          }
      });
});

/*Make a user admin*/
router.put('/validateuser', function (req, res) {
    lmsUsers.update(
        {
            email: req.body.email
        },
        {
            $set: { 'validated': true }
        }
        ,
        function (err, count) {
            console.log('count', count);
            if (err) {
                res.json(err);
            }
            else {
                res.json(1);
            }
        });
  });

/*Remove a user from admin*/
router.put('/removeadmin', function (req, res) {
  lmsUsers.update(
      {
          email: req.query.emailid
      },
      {
          $unset: { 'isadmin': "" }
      }
      ,
      function (err, count) {
          if (err) {
              console.log(err);
          }
          else {
              res.json(count);
          }
      });
});







module.exports = router;
