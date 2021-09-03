var express = require('express');
var passport = require('passport');
var router = express.Router();
var Contactuser = require('../models/contactuser');
var Event = require('../models/event');
var submission = require('../models/submission');
var lmsCourses = require('../models/courses');
var testimonial = require('../models/testimonial');
var category = require('../models/category');
var quote = require('../models/quote');
var lmsModules = require('../models/modules');
var lmsForums = require('../models/forums');
var simulationtool = require('../models/simulationtool');
var simulatorpoint = require('../models/simulatorpoint');
var simulationppcad = require('../models/simulationppcad');
var lmsForumfilecount = require("../models/forumfiles")
var lmsBatches = require('../models/batches');
var lmsTopics = require('../models/topics');
var lmsElements = require('../models/elements');
var lmsQuiz = require('../models/quiz');
var lmsUsers = require('../models/user');
var faqModel = require('../models/faq');
var coursefeatureModal = require('../models/coursefeature');
var blog = require('../models/blog');
var job = require('../models/job');
var jobapplication = require('../models/jobapplication');
var bookdownload = require('../models/bookdownload');
var webinar = require('../models/webinar');
var webinaree = require('../models/webinaree');
var forum = require('../models/forum');
var lmsForgotpassword = require('../models/forgotpassword');
var lmsQuizlog = require('../models/quizlog');
var lmsQueLog = require('../models/quelog');
var Eventjoinee = require('../models/event_joinee');
var payment = require('../models/payment');
var coupon = require('../models/coupon');
var comment = require('../models/comment');
var forumcomment = require('../models/comments');
var pageview = require('../models/pageview');
var teamperson = require('../models/teamperson');
var teammember = require('../models/teammember');
var moment = require('moment');
var aws = require('aws-sdk');
aws.config.update({
    accessKeyId: "AKIAQFXTPLX2CNUSHP5C",
    secretAccessKey: "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",
    "region": "us-west-2"
});
var s3 = new aws.S3();
const Insta = require('instamojo-nodejs');

var awsSesMail = require('aws-ses-mail');

var sesMail = new awsSesMail();
var sesConfig = {
    accessKeyId: "AKIAQFXTPLX2CNUSHP5C",
    secretAccessKey: "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",
    region: 'us-west-2'
};
sesMail.setConfig(sesConfig);

/* GET blog post page. */
router.get('/', function (req, res, next) {
    req.session.returnTo = req.baseUrl + req.path;
    webinar.find({ deleted: { $ne: "true" } }, null, { sort: { date: -1 } }, function (err, webinars) {
        if (req.isAuthenticated()) {
            res.render('webinars/webinars', { title: 'Express', active: "all", webinars: webinars, moment: moment, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
        }
        else {
            res.render('webinars/webinars', { title: 'Express', active: "all", webinars: webinars, moment: moment });
        }
    });
});

router.get('/accomplishments/:webinarid/:userid', function (req, res, next) {
    req.session.returnTo = req.path;
    console.log("_ainegaeg")
    console.log(req.originalUrl);
    webinaree.findOne({ _id: req.params.userid }, function (err, user) {
        if (user) {
            webinar.findOne({ 'deleted': { $ne: 'true' }, "_id":  req.params.webinarid }, function (err, webinar) {
                if(webinar){
                    if(req.isAuthenticated()){
                        res.render('webinars/webinaraccomplishments', { moment: moment, verification_url: "www.ampdigital.co"+req.originalUrl, certificateuser: user, webinar: webinar, success: '_', title: 'Express', email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
                    }
                    else{
                        res.render('webinars/webinaraccomplishments', { moment: moment,  verification_url: "www.ampdigital.co"+req.originalUrl, certificateuser: user, title: 'Express', webinar: webinar});
                    }
                }
            });
        }
        else {
            res.json(-1);
        }
    });
});

/**
 * Updating db after providing certificate for webinar
 */
 router.put('/certificate', function (req, res) {
    var arr = [];
    if (req.body.length > 1) {
        var temp = req.body.courses.split(',');
        for (var i = 0; i < temp.length; i++) {
            arr.push(temp[i]);
        }
    }
    else if (req.body.length == 1) {
        arr.push(req.body.courses);
    }
    else if (req.body.length == 0) {
        arr = [];
    }
    webinaree.update(
        {
            _id: req.body.id
        },
        {
            $set: { certificates: arr }
        }
        ,
        function (err, count) {
            if (err) {
                res.json(-1);
            }
            else {
                // res.json(1);
                var awsSesMail = require('aws-ses-mail');

                var sesMail = new awsSesMail();
                var sesConfig = {
                    accessKeyId: "AKIAQFXTPLX2CNUSHP5C",
                    secretAccessKey: "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",
                    region: 'us-west-2'
                };
                sesMail.setConfig(sesConfig);

                var html = `Hello ${req.body.name},<br>\n` +
                    '<br>\n' +
                    'Congratulations! You did it. You\'ve successfully completed the workshop. <br>\n' +
                    'AMP Digital has issued an official Workshop Certificate to you. <br>' +
                    '<br> <a style="text-decoration: none!important;" href="http://www.ampdigital.co/webinars/accomplishments/' + req.body.webinarid + '/'+ req.body.id + '"><div style="width:220px;color:#ffffff;background-color:#7fbf4d;border:1px solid #63a62f;border-bottom:1px solid #5b992b;background-image:-webkit-linear-gradient(top,#7fbf4d,#63a62f);background-image:-moz-linear-gradient(top,#7fbf4d,#63a62f);background-image:-ms-linear-gradient(top,#7fbf4d,#63a62f);background-image:-o-linear-gradient(top,#7fbf4d,#63a62f);background-image:linear-gradient(top,#7fbf4d,#63a62f);border-radius:3px;line-height:1;padding:1%;text-align:center"><span>View Your Accomplishments</span></div></a>' +
                    '\n <br>' +
                    '<p>'+
                    'Please download the certificate on the desktop or laptop for better resolution. <br><br>'+
                    '</p> Thanks, <br>'+
                    '<table width="351" cellspacing="0" cellpadding="0" border="0"> <tr> <td style="text-align:left;padding-bottom:10px"><a style="display:inline-block" href="https://www.ampdigital.co"><img style="border:none;" width="100" src="https://www.ampdigital.co/maillogo.png"></a></td> </tr> <tr> <td style="border-top:solid #000000 2px;" height="12"></td> </tr> <tr> <td style="vertical-align: top; text-align:left;color:#000000;font-size:12px;font-family:helvetica, arial;; text-align:left"> <span> </span> <br> <span style="font:12px helvetica, arial;">Email:&nbsp;<a href="mailto:amitabh@ampdigital.co" style="color:#3388cc;text-decoration:none;">amitabh@ampdigital.co</a></span> <br><br> <span style="margin-right:5px;color:#000000;font-size:12px;font-family:helvetica, arial">Registered Address: AMP Digital</span> 403, Sovereign 1, Vatika City, Sohna Road,, Gurugram, Haryana, 122018, India<br><br> <table cellpadding="0" cellpadding="0" border="0"><tr><td style="padding-right:5px"><a href="https://facebook.com/https://www.facebook.com/AMPDigitalNet/" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/23f7b48395f8c4e25e64a2c22e9ae190.png" alt="Facebook" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://twitter.com/https://twitter.com/amitabh26" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3949237f892004c237021ac9e3182b1d.png" alt="Twitter" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://linkedin.com/in/https://in.linkedin.com/company/ads4growth?trk=public_profile_topcard_current_company" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/dcb46c3e562be637d99ea87f73f929cb.png" alt="LinkedIn" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://youtube.com/https://www.youtube.com/channel/UCMOBtxDam_55DCnmKJc8eWQ" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3b2cb9ec595ab5d3784b2343d5448cd9.png" alt="YouTube" style="border:none;"></a></td></tr></table><a href="https://www.ampdigital.co" style="text-decoration:none;color:#3388cc;">www.ampdigital.co</a> </td> </tr> </table> <table width="351" cellspacing="0" cellpadding="0" border="0" style="margin-top:10px"> <tr> <td style="text-align:left;color:#aaaaaa;font-size:10px;font-family:helvetica, arial;"><p>AMP&nbsp;Digital is a Google Partner Company</p></td> </tr> </table>';

                var options = {
                    from: 'ampdigital.co <amitabh@ads4growth.com>',
                    to: req.body.email,
                    subject: 'Congratulations, Your Workshop Certificate is Ready!',
                    content: '<html><head></head><body>' + html + '</body></html>'
                };

                sesMail.sendEmail(options, function (err, data) {
                    // TODO sth....
                    console.log(err);
                    res.json(1);
                });
            }
        });
});

/* GET blog post page. */
router.get('/upcoming', function (req, res, next) {
    req.session.returnTo = req.baseUrl + req.path;
    webinar.find({ deleted: { $ne: "true" }, date: { $gte: new Date() } }, null, { sort: { date: -1 } }, function (err, webinars) {
        if (req.isAuthenticated()) {
            res.render('webinars/webinars', { title: 'Express', active: "upcoming", webinars: webinars, moment: moment, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
        }
        else {
            res.render('webinars/webinars', { title: 'Express', active: "upcoming", webinars: webinars, moment: moment });
        }
    });
});

/* GET blog post page. */
router.get('/concluded', function (req, res, next) {
    req.session.returnTo = req.baseUrl + req.path;
    webinar.find({ deleted: { $ne: "true" }, date: { $lte: new Date() } }, null, { sort: { date: -1 } }, function (err, webinars) {
        if (req.isAuthenticated()) {
            res.render('webinars/webinars', { title: 'Express', active: "concluded", webinars: webinars, moment: moment, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
        }
        else {
            res.render('webinars/webinars', { title: 'Express', active: "concluded", webinars: webinars, moment: moment });
        }
    });
});

/* GET courses page. */
router.get('/thankyoupage/:webinarurl', function (req, res, next) {
    req.session.returnTo = req.baseUrl + req.path;
    webinar.findOne({ deleted: { $ne: true }, webinarurl: req.params.webinarurl }, function (err, webinar) {
        if (req.isAuthenticated()) {
            res.render('thankyoupage', { title: 'Express', moment: moment, webinar: webinar, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
        }
        else {
            res.render('thankyoupage', { title: 'Express', moment: moment, webinar: webinar, payment_id: '' });
        }
    });
});

/* GET faq page */
router.get('/manage', isAdmin, function (req, res, next) {
    req.session.returnTo = req.baseUrl + req.path;
    if (req.isAuthenticated()) {
        res.render('adminpanel/webinar', { moment: moment, title: 'Express', email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
    }
    else {
        res.redirect('/auth');
    }
});

/* GET faq page */
router.get('/iframe', function (req, res, next) {
    webinar.find({ deleted: { $ne: true } }, function (err, webinars) {
        if (req.isAuthenticated()) {
            res.render('adminpanel/webinariframe', { moment: moment, webinars: webinars, title: 'Express', email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
        }
        else {
            res.render('adminpanel/webinariframe', { moment: moment, webinars: webinars, title: 'Express' });
        }
    });
});

router.post('/updateinfo', function (req, res) {
    let updateQuery = {};
    updateQuery[req.body.name] = req.body.value
    webinar.update(
        {
            _id: req.body.pk
        },
        {
            $set: updateQuery
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

router.put('/uploadwebinarpicture', function (req, res) {
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;

    var doc = req.body.image;
    var element_id = req.body.id;
    var fieldname = req.body.fieldname;
    var updateObj = {};
    updateObj[fieldname] = doc;

    webinar.update(
        { _id: safeObjectId(element_id) },
        {
            $set: updateObj
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


/*GET contact requests page*/
router.get('/manageattendees', isAdmin, function (req, res, next) {
    res.render('adminpanel/webinarees', { email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, moment: moment });
});

router.get('/webinarattendees/datatable', function (req, res, next) {
    /*
   * Script:    DataTables server-side script for NODE and MONGODB
   * Copyright: 2018 - Siddharth Sogani
   */

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * Easy set variables
     */

    /* Array of columns to be displayed in DataTable
     */
    var $aColumns = ['name', 'email', 'webinarname', 'phone', 'termsandconditions', 'date', 'certificate'];

    /*
     * Paging
     */
    var $sDisplayStart = 0;
    var $sLength = "";
    if ((req.query.iDisplayStart) && req.query.iDisplayLength != '-1') {
        $sDisplayStart = req.query.iDisplayStart;
        $sLength = req.query.iDisplayLength;
    }

    var query = {};
    /*
   * Filtering
   * NOTE this does not match the built-in DataTables filtering which does it
   * word by word on any field. It's possible to do here, but concerned about efficiency
   * on very large tables, and MySQL's regex functionality is very limited
   */
    if (req.query.sSearch != "") {
        var arr = [{ "firstname": { $regex: '' + req.query.sSearch + '', '$options': 'i' } }, { "webinarname": { $regex: '' + req.query.sSearch + '', '$options': 'i' } }, { "lastname": { $regex: '' + req.query.sSearch + '', '$options': 'i' } }, { "email": { $regex: '' + req.query.sSearch + '', '$options': 'i' } }, { "phone": { $regex: '' + req.query.sSearch + '', '$options': 'i' } }];
        query.$or = arr;
    }

    /*
   * Ordering
   */
    var sortObject = { 'date': -1 };
    if (req.query.iSortCol_0 && req.query.iSortCol_0 == 0) {
        if (req.query.sSortDir_0 == 'desc') {
            var sortObject = {};
            var stype = 'firstname';
            var sdir = -1;
            sortObject[stype] = sdir;
        }
        else {
            var sortObject = {};
            var stype = 'firstname';
            var sdir = 1;
            sortObject[stype] = sdir;
        }

    }
    else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 1) {
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
            var stype = 'webinarname';
            var sdir = -1;
            sortObject[stype] = sdir;
        }
        else {
            var sortObject = {};
            var stype = 'webinarname';
            var sdir = 1;
            sortObject[stype] = sdir;
        }
    }
    else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 3) {
        if (req.query.sSortDir_0 == 'desc') {
            var sortObject = {};
            var stype = 'phone';
            var sdir = -1;
            sortObject[stype] = sdir;
        }
        else {
            var sortObject = {};
            var stype = 'phone';
            var sdir = 1;
            sortObject[stype] = sdir;
        }
    }
    else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 4) {
        if (req.query.sSortDir_0 == 'desc') {
            var sortObject = {};
            var stype = 'termsandconditions';
            var sdir = -1;
            sortObject[stype] = sdir;
        }
        else {
            var sortObject = {};
            var stype = 'termsandconditions';
            var sdir = 1;
            sortObject[stype] = sdir;
        }
    }
    else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 5) {
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

    webinaree.find(query).skip(parseInt($sDisplayStart)).limit(parseInt($sLength)).sort(sortObject).exec(function (err, docs) {
        webinaree.count(query, function (err, count) {
            webinar.find({ 'deleted': { $ne: 'true' } }, function (err, courses) {
                var aaData = [];
                for (let i = 0; i < (docs).length; i++) {
                    var $row = [];
                    for (var j = 0; j < ($aColumns).length; j++) {
                        if ($aColumns[j] == 'name') {
                            $row.push(docs[i]["firstname"] + " " + docs[i]["lastname"])
                        }
                        else if ($aColumns[j] == 'email') {
                            $row.push(docs[i][$aColumns[j]])
                        }
                        else if ($aColumns[j] == 'webinarname') {
                            $row.push(docs[i][$aColumns[j]])
                        }
                        else if ($aColumns[j] == 'phone') {
                            $row.push(docs[i][$aColumns[j]])
                        }
                        else if ($aColumns[j] == 'termsandconditions') {
                            $row.push(docs[i][$aColumns[j]] == true ? "Yes" : "Not")
                        }
                        else if ($aColumns[j] == 'date') {
                            $row.push(moment(docs[i]['date']).format("DD/MMM/YYYY HH:mm A"));
                        }
                        else if ($aColumns[j] == 'certificate') {
                            var accesscourses = '';
                            for (var h = 0; h < courses.length; h++) {
                                if(courses[h]['_id'] == docs[i].webinarid)
                                    accesscourses = accesscourses + `<option ${docs[i].certificates && docs[i].certificates.indexOf(courses[h]['_id']) > -1 ? "selected" : ""} value="${courses[h]['_id']}">${courses[h]['webinarname']}</option>`;
                            }
                            $row.push(`
                            <form data-certificates="${docs[i].certificates}" data-name="${docs[i]["firstname"] + " " + docs[i]["lastname"]}" data-email="${docs[i].email}" data-id="${docs[i]._id}" data-webinarid="${docs[i].webinarid}" class="addcertificate" action="">
                        <select class="js-example-basic-multiple certificateselect" name="states[]" multiple="multiple">
                        ${accesscourses}
                        </select>
                        <input type="submit">
                        </form>`);
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

router.get('/:webinarurl', function (req, res, next) {
    req.session.returnTo = req.baseUrl + req.path;
    webinar.findOne({ deleted: { $ne: true }, webinarurl: req.params.webinarurl }, function (err, webinar) {
        if (webinar) {
            if (req.isAuthenticated()) {
                res.render('webinars/webinar', { title: 'Express', webinar: webinar, moment: moment, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
            }
            else {
                res.render('webinars/webinar', { webinar: webinar, moment: moment });
            }
        }
        else {
            res.redirect('/webinars')
        }
    });
});

// Create a new webinar
router.post('/addwebinar', function (req, res, next) {
    // res.json(Buffer.from(req.body.content).toString('base64'));
    var webinar2 = new webinar({
        webinarname: req.body.webinarname,
        speakername: req.body.speakername,
        speakerdescription: req.body.speakerdescription,
        duration: req.body.duration,
        level: req.body.level,
        date: new Date(req.body.date)
    });
    webinar2.save(function (err, results) {
        if (err) {
            res.json(err);
        }
        else {
            res.redirect('/webinars/manage');
        }
    });
});

// Add a webinaree
router.post('/addwebinaree', function (req, res, next) {
    // res.json(Buffer.from(req.body.content).toString('base64'));
    var termsandconditions = false;
    if (req.body.termsandconditions && req.body.termsandconditions == "on") {
        termsandconditions = true;
    }
    var webinaree2 = new webinaree({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        countrycode: req.body.countrycode,
        phone: req.body.phone,
        termsandconditions: termsandconditions,
        webinarname: req.body.webinarname,
        webinarid: req.body.webinarid,
        date: new Date()
    });
    webinaree2.save(function (err, results) {
        if (err) {
            res.json(err);
        }
        else {
            var awsSesMail = require('aws-ses-mail');

            var sesMail = new awsSesMail();
            var sesConfig = {
                accessKeyId: "AKIAQFXTPLX2CNUSHP5C",
                secretAccessKey: "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",
                region: 'us-west-2'
            };
            sesMail.setConfig(sesConfig);
             var html = `<html>
                                <head>
                                    <title></title>
                                </head>
                                <body>
                                <table cellpadding="0" cellspacing="0" style="background:#f6f6f6" width="100%">
                                    <tbody>
                                        <tr>
                                            <td>
                                            <table cellpadding="0" cellspacing="0" style="max-width:600px;min-width:300px;margin:0 auto" width="100%">
                                                <tbody>
                                                    <tr>
                                                        <td style="background-color:transparent;line-height:18px;padding:0px 0px 0px 0px">
                                                        <table align="center" height="30" style="width:100%;background-color:#ffffff;color:#ffffff;border-collapse:collapse" width="100%">
                                                            <tbody>
                                                                <tr height="30" style="height:30px">
                                                                    <td align="center" style="vertical-align:middle;background-color:#f6f6f6" valign="middle"><span><img alt="" src="${req.body.webinarpicture}" style="width: 100%;" /></span></td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                
                                            <table cellpadding="0" cellspacing="0" style="max-width:600px;min-width:300px;margin:0 auto" width="100%">
                                                <tbody>
                                                    <tr>
                                                        <td style="background:#ffffff">
                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                            <tbody>
                                                                <tr>
                                                                    <td>
                                                                    <table cellpadding="0" cellspacing="0" width="100%">
                                                                        <tbody>
                                                                            <tr>
                                                                                <td style="text-align:left;vertical-align:top;font-size:0px">
                                                                                <table cellpadding="0" cellspacing="0" style="vertical-align:top;display:inline-table;background:transparent;table-layout:fixed;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#31302f;max-width:100%;width:100%;width:-webkit-calc(230400px - 48000%);width:calc(230400px - 48000%);min-width:480px;min-width:-webkit-calc(100%);min-width:calc(100%)">
                                                                                    <tbody>
                                                                                        <tr>
                                                                                            <td style="background-color:transparent;line-height:18px;padding:10px 30px 0px 30px">
                                                                                            <div style="display:inline-block;width:100%">
                                                                                            <div style="line-height:21px"><span style="font-size:14px">Dear attendee, </span></div>
                                
                                                                                            <div style="line-height:18px">&nbsp;</div>
                                
                                                                                            <div style="line-height:21px"><span style="font-size:14px">
                                                                                            We're looking forward to hosting you on ${moment(new Date(req.body.webinardate)).format("DD/MMM/YYYY")} at ${moment(new Date(req.body.webinardate)).format("HH:mm A")} at our ${req.body.webinarname == "Google Analytics for Digital Marketing" ?  "workshop" : "webinar"} - <a target="_blank" href="${'https://www.ampdigital.co/webinars/' + req.body.webinarurl}">${req.body.webinarname}</a> .
                                                                                            <br>
                                                                                            <br>
                                                                                            You will receive the workshop link on your email, a day in advance.
                                                                                            <br>
                                                                                            </div>
                                                                                                                            </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td style="background-color:transparent;line-height:18px;padding:10px 30px 10px 30px">
                                                                                            <div style="display:inline-block;width:100%">
                                
                                                                                            <div>&nbsp;</div>
                                
                                                                                            <div>Thanks, <br> Amitabh Verma</div>
                                
                                                                                            <div>&nbsp;</div>
                                
                                                                                            <table border="0" cellpadding="0" cellspacing="0" width="351">
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td style="text-align:left;padding-bottom:10px"><a href="https://www.ampdigital.co" style="display:inline-block"><img src="https://s1g.s3.amazonaws.com/36321c48a6698bd331dca74d7497797b.jpeg" style="border:none;" width="150" /></a></td>
                                                                                                    </tr>
                                                                                                    <tr>
                                                                                                        <td height="12" style="border-top:solid #000000 2px;">&nbsp;</td>
                                                                                                    </tr>
                                                                                                    <tr>
                                                                                                        <td style="vertical-align: top; text-align:left;color:#000000;font-size:12px;font-family:helvetica, arial;; text-align:left"><br />
                                                                                                        <span style="font:12px helvetica, arial;">Email:&nbsp;<a href="mailto:amitabh@ampdigital.co" style="color:#3388cc;text-decoration:none;">amitabh@ampdigital.co</a></span><br />
                                                                                                        <br />
                                                                                                        <span style="margin-right:5px;color:#000000;font-size:12px;font-family:helvetica, arial">Registered Address: AMP Digital</span> 403, Sovereign 1, Vatika City, Sohna Road,, Gurugram, Haryana, 122018, India<br />
                                                                                                        &nbsp;
                                                                                                        <table border="0" cellpadding="0">
                                                                                                            <tbody>
                                                                                                                <tr>
                                                                                                                    <td style="padding-right:5px"><a href="https://facebook.com/https://www.facebook.com/AMPDigitalNet/" style="display: inline-block;"><img alt="Facebook" height="40" src="https://s1g.s3.amazonaws.com/23f7b48395f8c4e25e64a2c22e9ae190.png" style="border:none;" width="40" /></a></td>
                                                                                                                    <td style="padding-right:5px"><a href="https://twitter.com/https://twitter.com/amitabh26" style="display: inline-block;"><img alt="Twitter" height="40" src="https://s1g.s3.amazonaws.com/3949237f892004c237021ac9e3182b1d.png" style="border:none;" width="40" /></a></td>
                                                                                                                    <td style="padding-right:5px"><a href="https://linkedin.com/in/https://in.linkedin.com/company/ads4growth?trk=public_profile_topcard_current_company" style="display: inline-block;"><img alt="LinkedIn" height="40" src="https://s1g.s3.amazonaws.com/dcb46c3e562be637d99ea87f73f929cb.png" style="border:none;" width="40" /></a></td>
                                                                                                                    <td style="padding-right:5px"><a href="https://youtube.com/https://www.youtube.com/channel/UCMOBtxDam_55DCnmKJc8eWQ" style="display: inline-block;"><img alt="YouTube" height="40" src="https://s1g.s3.amazonaws.com/3b2cb9ec595ab5d3784b2343d5448cd9.png" style="border:none;" width="40" /></a></td>
                                                                                                                </tr>
                                                                                                            </tbody>
                                                                                                        </table>
                                                                                                        <a href="https://www.ampdigital.co" style="text-decoration:none;color:#3388cc;">www.ampdigital.co</a></td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                
                                                                                            <table border="0" cellpadding="0" cellspacing="0" style="margin-top:10px" width="351">
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td style="text-align:left;color:#aaaaaa;font-size:10px;font-family:helvetica, arial;">
                                                                                                        <p>AMP&nbsp;Digital is a Google Partner Company</p>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                            </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                </table>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                
                                            <table cellpadding="0" cellspacing="0" style="max-width:600px;min-width:300px;margin:0 auto" width="100%">
                                                <tbody>
                                                    <tr>
                                                        <td style="background-color:transparent;line-height:18px;padding:0px 0px 0px 0px">&nbsp;</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                </body>
                                </html>`;

            var options = {
                from: 'ampdigital.co <amitabh@ads4growth.com>',
                to: req.body.email,
                subject: 'AMP Digital: Your Webinar Registration',
                content: '<html><head></head><body>' + html + '</body></html>'
            };

            sesMail.sendEmail(options, function (err, data) {
                // TODO sth....
                if (err) {
                    console.log(err);
                }
                var Sendy = require('sendy-api'),
                sendy = new Sendy('http://sendy.ampdigital.co/', 'tyYabXqRCZ8TiZho0xtJ');

                sendy.subscribe({ api_key: 'tyYabXqRCZ8TiZho0xtJ', name: req.body.firstname+" "+req.body.lastname, email: req.body.email, list_id: 'Euqm1IPXhLOYYBVPfi1d8Q' }, function (err, result) {
                    if (err){
                        res.set('Content-Type', 'text/html');
                        res.send(Buffer.from('<h2>This email ID is already registered to the workshop</h2>'));
                    }
                    else {
                        res.redirect("/webinars/thankyoupage/" + req.body.webinarurl);
                    }
                });
            });
        }
    });
});

// Delete a Webinar
router.delete('/removewebinar', function (req, res, next) {
    webinar.update(
        {
            _id: req.body.webinarid
        },
        {
            $set: { deleted: true }
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



  function getusername(user){
    var name = "";
    if(user.local.name){
        name = user.local.name
    }
    else if(user.google.name){
        name = user.google.name;
    }
    else if(user.twitter.displayName){
        name = user.twitter.displayName;
    }
    else if(user.linkedin.name){
        name = user.linkedin.name;
    }
    return name;
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    req.session.returnTo = req.path;
    res.redirect('/signin');
}

function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.role == '2')
        return next();
    res.redirect('/');
}

module.exports = router;
