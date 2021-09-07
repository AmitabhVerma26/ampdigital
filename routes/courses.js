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

router.get('/manage', isAdmin, function (req, res, next) {
    lmsCourses.find({ 'deleted': { $ne: 'true' } }, function (err, docs) {
        res.render('adminpanel/courses', { email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications, docs: docs, moment: moment });

    });
});

router.get('/populate', function (req, res, next) {
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;
    req.session.returnTo = req.path;
    if (req.isAuthenticated()) {
        lmsQuizlog.aggregate([
            {
                "$match": {
                    "email": req.query.email
                }
            },
            {
                $group: {
                    _id: "$email",
                    total: { $sum: 1 },
                    quizes: { $push: { $concat: ["$quizid", "-", "$questionCorrectIncorrect"] } }
                }
            }
        ], function (err, result) {
            if (err) {
                res.json(err);
            }
            else {
                if (result.length > 0) {
                    var arr = [];
                    var quizes = result[0]['quizes'];
                    var quizids = [];
                    var quizlogs = [];
                    for (var j = 0; j < quizes.length; j++) {
                        if (quizes[j]) {
                            quizids.push(quizes[j].split('-')[0]);
                            quizlogs.push(getQuizScore(JSON.parse(quizes[j].split('-')[1])));
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
                        queries.push(lmsElements.findOne({ _id: safeObjectId(log.quizids[i]) }));
                    }
                    Promise.all(queries).then(function (response) {
                        obj.quizdata = response;
                        res.json(obj);
                    });
                }
                else {
                    res.json(0);
                }
            }
        });
    }
    else {
        res.json(-1);
    }
});

/*POST new course*/
router.post('/', function (req, res, next) {
    var course = new lmsCourses({
        course_createdon: new Date(),
        course_name: req.body.course_name,
        course_objective: req.body.course_objective,
        course_projects: req.body.course_projects,
        course_duration: req.body.course_duration,
        course_target_audience: req.body.course_target_audience,
        course_tools_requirements: req.body.course_tools_requirements
    });
    course.save(function (err, results) {
        if (err) {
            res.json(err);
        }
        else {
            res.json(results);
        }
    });
});

/*Update Access*/
router.put('/updateaccess', function (req, res) {
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
    lmsUsers.update(
        {
            _id: req.body.id
        },
        {
            $set: { courses: arr }
        }
        ,
        function (err, count) {
            if (err) {
                res.json(-1);
            }
            else {
                res.json(1);
            }
        });
});

/* GET accomplishments page. */
router.get('/accomplishments/:userid/:courseurl', function (req, res, next) {
    req.session.returnTo = req.path;
    lmsUsers.findOne({ _id: req.params.userid }, function (err, user) {
        if (user) {
            lmsCourses.findOne({ 'deleted': { $ne: 'true' }, "course_url":  req.params.courseurl }, function (err, course) {
                if(course){
                    if(req.isAuthenticated()){
                        res.render('courses/accomplishments', { moment: moment, verification_url: "www.ampdigital.co"+req.originalUrl, certificateuser: user, course: course, success: '_', title: 'Express', email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
                    }
                    else{
                        res.render('courses/accomplishments', { moment: moment,  verification_url: "www.ampdigital.co"+req.originalUrl, certificateuser: user, title: 'Express', course: course});
                    }
                }
            });
        }
        else {
            res.json(-1);
        }
    });
});

/* GET accomplishments page. */
router.get('/accomplishments/:userid', function (req, res, next) {
    req.session.returnTo = req.path;
    lmsUsers.findOne({ _id: req.params.userid }, function (err, user) {
        if (user) {
            if (req.isAuthenticated()) {
                if (user.certificates) {
                    lmsCourses.find({ 'deleted': { $ne: 'true' }, "_id": { $in: user.certificates } }, function (err, certificates) {
                        res.render('courses/certificates', { moment: moment, certificateuser: user, title: 'Express', courses: certificates, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
                    });
                }
            }
            else {
                if (user.certificates) {
                    lmsCourses.find({ 'deleted': { $ne: 'true' }, "_id": { $in: user.certificates } }, function (err, certificates) {
                        res.render('courses/certificates', { moment: moment, certificateuser: user, title: 'Express', courses: certificates });
                    });
                }
            }
        }
        else {
            res.json(-1);
        }
    });
});

/**
 * Updating db after providing certificate for course
 */
 router.put('/accomplishment', function (req, res) {
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
    lmsUsers.update(
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
                    'Congratulations! You did it. You\'ve successfully completed the course. <br>\n' +
                    'AMP Digital has issued an official Course Certificate to you. <br>' +
                    '<br> <a style="text-decoration: none!important;" href="http://www.ampdigital.co/courses/accomplishments/' + req.body.id + '"><div style="width:220px;color:#ffffff;background-color:#7fbf4d;border:1px solid #63a62f;border-bottom:1px solid #5b992b;background-image:-webkit-linear-gradient(top,#7fbf4d,#63a62f);background-image:-moz-linear-gradient(top,#7fbf4d,#63a62f);background-image:-ms-linear-gradient(top,#7fbf4d,#63a62f);background-image:-o-linear-gradient(top,#7fbf4d,#63a62f);background-image:linear-gradient(top,#7fbf4d,#63a62f);border-radius:3px;line-height:1;padding:1%;text-align:center"><span>View Your Accomplishments</span></div></a>' +
                    '\n <br>' +
                    '<p>'+
                    'Please download the certificate on the desktop or laptop for better resolution. <br><br>'+
                    '</p> Thanks, <br>'+
                    '<table width="351" cellspacing="0" cellpadding="0" border="0"> <tr> <td style="text-align:left;padding-bottom:10px"><a style="display:inline-block" href="https://www.ampdigital.co"><img style="border:none;" width="100" src="https://www.ampdigital.co/maillogo.png"></a></td> </tr> <tr> <td style="border-top:solid #000000 2px;" height="12"></td> </tr> <tr> <td style="vertical-align: top; text-align:left;color:#000000;font-size:12px;font-family:helvetica, arial;; text-align:left"> <span> </span> <br> <span style="font:12px helvetica, arial;">Email:&nbsp;<a href="mailto:amitabh@ampdigital.co" style="color:#3388cc;text-decoration:none;">amitabh@ampdigital.co</a></span> <br><br> <span style="margin-right:5px;color:#000000;font-size:12px;font-family:helvetica, arial">Registered Address: AMP Digital</span> 403, Sovereign 1, Vatika City, Sohna Road,, Gurugram, Haryana, 122018, India<br><br> <table cellpadding="0" cellpadding="0" border="0"><tr><td style="padding-right:5px"><a href="https://facebook.com/https://www.facebook.com/AMPDigitalNet/" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/23f7b48395f8c4e25e64a2c22e9ae190.png" alt="Facebook" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://twitter.com/https://twitter.com/amitabh26" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3949237f892004c237021ac9e3182b1d.png" alt="Twitter" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://linkedin.com/in/https://in.linkedin.com/company/ads4growth?trk=public_profile_topcard_current_company" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/dcb46c3e562be637d99ea87f73f929cb.png" alt="LinkedIn" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://youtube.com/https://www.youtube.com/channel/UCMOBtxDam_55DCnmKJc8eWQ" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3b2cb9ec595ab5d3784b2343d5448cd9.png" alt="YouTube" style="border:none;"></a></td></tr></table><a href="https://www.ampdigital.co" style="text-decoration:none;color:#3388cc;">www.ampdigital.co</a> </td> </tr> </table> <table width="351" cellspacing="0" cellpadding="0" border="0" style="margin-top:10px"> <tr> <td style="text-align:left;color:#aaaaaa;font-size:10px;font-family:helvetica, arial;"><p>AMP&nbsp;Digital is a Google Partner Company</p></td> </tr> </table>';

                var options = {
                    from: 'ampdigital.co <amitabh@ads4growth.com>',
                    to: req.body.email,
                    subject: 'Congratulations, Your Course Certificate is Ready!',
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

/* GET accomplishments page. */
router.get('/accomplishment/:userid/:courseid', function (req, res, next) {
    req.session.returnTo = req.path;
    lmsCourses.findOne({ _id: req.params.courseid }, function (err, course) {
        if (course) {
            lmsUsers.findOne({ _id: req.params.userid }, function (err, user) {
                if (user && (user.certificates.indexOf(req.params.courseid) > -1)) {
                    var fs = require('fs');
                    var pdf = require('html-pdf');

                    var certificate;

                    if (req.params.courseid == '5ad4889235aea65a2fa7759b') {
                        certificate = 'http://www.ampdigital.co/digitalmarketingcertificate.png';
                    }
                    else if (req.params.courseid == '5ba67703bda6d500142e2d15') {
                        certificate = 'http://www.ampdigital.co/advanceddigitalmarketingcertificate.png';
                    }
                    else {
                        certificate = 'http://www.ampdigital.co/certificatebackground.png'
                    }


                    var html = "<html>" +
                        "<head>" +
                        "<style>" +
                        "body{" +
                        "height:100vh;}" +
                        "</style>" +
                        "</head>" +
                        "<body>" +
                        "<div style='background-image: url(\"http://www.ampdigital.co/certificatebackground.png\"); width:720px; height:520px; margin-left: 2.5%; padding:20px; text-align:center;'>" +
                        "<div style='margin-top: 25%;'>" +
                        "<span>" + user.local.name + "</span>" +
                        "</div>" +
                        "<div style='margin-top: 15%;'>" +
                        "<span>" + course.course_name + "</span>" +
                        "</div>" +
                        "<div style='margin-top: 28%;'>" +
                        "<p style='font-size: 10px;'>AMP digital has verified the identify of the individual and participation the course. </p><p style='font-size: 10px;'>" +
                        "Verify at www.ampdigital.co/courses/accomplishment/" + req.params.userid + "/" + req.params.courseid + " <br>" +
                        "</p>" +
                        "</div>" +
                        "</div>" +
                        "</body>" +
                        "</html>"
                    var options = { orientation: "landscape", "type": "pdf" };

                    pdf.create(html, options).toStream(function (err, pdfStream) {
                        if (err) {
                            // handle error and return a error response code
                            console.log(err)
                            return res.sendStatus(500)
                        } else {
                            // send a status code of 200 OK
                            res.statusCode = 200;

                            res.setHeader('Content-type', 'application/pdf');
                            // res.setHeader('Content-disposition', 'attachment; filename=' + user.local.name+'_'+course.course_name+'_'+'certificate');

                            // once we are done reading end the response
                            pdfStream.on('end', function () {
                                // done reading
                                return res.end();
                            });

                            // pipe the contents of the PDF directly to the response
                            pdfStream.pipe(res)
                        }
                    });
                }
                else {
                    res.json('Not verified');
                }
            });
        }
        else {
            res.json('Not verified');
        }
    });
});


router.get('/:courseurl', function (req, res, next) {
    req.session.returnTo = req.baseUrl+req.url;
    lmsCourses.findOne({course_url: req.params.courseurl}, function (err, course) {
        if(!course){
            res.render('error');
        }
        else if(course.course_live && course.course_live == 'Live'){
            lmsBatches.find({ course_id: course._id, deleted: { $ne: true } }, function (err, batches) {
                testimonial.find({ deleted: false }, function (err, testimonials) {
                    lmsCourses.find({ 'deleted': { $ne: 'true' }, course_live: "Live"}, function (err, courses) {
                        if (req.isAuthenticated()) {
                            lmsUsers.findOne({email: req.user.email }, function (err, lmsuser) {
                                let count = lmsuser.courses.indexOf(course._id)
                                if (count !== -1) {
                                    res.render('courses/'+req.params.courseurl, { path: req.path, course: course,  courses: courses, moment: moment, cls: req.query.payment && req.query.payment == "true" ? " d-none" : "", batches: batches, testimonials: testimonials, title: 'Express', 'enrolled': true, paymentemail: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, paymentname: getusername(req.user), notifications: req.user.notifications, paymentcouponcode: req.user.local.couponcode, paymentphone: req.user.local.phone, paymentuser_id: req.user._id.toString(), email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications, phone: req.user.phone, user_id: req.user._id, user: req.user });
                                }
                                else {
                                    res.render('courses/'+req.params.courseurl, { path: req.path, course: course,  courses: courses, moment: moment, cls: req.query.payment && req.query.payment == "true" ? "d-none" : "", batches: batches, testimonials: testimonials, title: 'Express', 'enrolled': false, paymentemail: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, paymentname: getusername(req.user), notifications: req.user.notifications, paymentcouponcode: req.user.local.couponcode, paymentphone: req.user.local.phone, paymentuser_id: req.user._id.toString(), email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications, phone: req.user.phone, user_id: req.user._id, user: req.user });
                                }
                            });
                        }
                        else {
                            res.render('courses/'+req.params.courseurl, { path: req.path, course: course, moment: moment, courses: courses, cls: req.query.payment && req.query.payment == "true" ? "d-none" : "", batches: batches, testimonials: testimonials, title: 'Express', 'enrolled': false, paymentcouponcode: '', paymentemail: '', paymentname: '', paymentphone: '', paymentuser_id: '', user: null });
                        }
                    });
                });
            })
        }
        else{
            res.render('error');
        }
    });
});

/**
 * Get percentage course completion
 */
router.get('/progress/:courseid', function (req, res, next) {
    var email = req.query.email
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;
    lmsModules.find({ course_id: req.params.courseid, deleted: { $ne: "true" } }, function (err, modules) {
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
            jobQueries.push(lmsElements.find({ element_module_id: safeObjectId(modules[i]['_id']), deleted: { $ne: "true" } }));
        }
        for (var i = 0; i < modules.length; i++) {
            jobQueries2.push(lmsElements.find({ element_module_id: safeObjectId(modules[i]['_id']), deleted: { $ne: "true" }, watchedby: email }));
        }

        Promise.all(jobQueries).then(function (listOfJobs) {
            Promise.all(jobQueries2).then(function (listOfJobs2) {
                var lArray = [];
                var modulesVideoLength = [];
                for (var i = 0; i < jobQueries.length; i++) {
                    var temp = 0;
                    for (var j = 0; j < listOfJobs[i].length; j++) {
                        // if(listOfJobs[i][j]['element_type'] == 'video'){
                        if (typeof listOfJobs[i][j]['duration'] !== 'undefined' && listOfJobs[i][j]['duration']) {
                            temp = temp + parseInt(listOfJobs[i][j]['duration']);
                        }
                        // }
                    }
                    modules[i]['modulesVideoLength'] = 'Duration: ' + (Math.round(temp / 60) + ' minutes ');
                }
                var modulesInfo = {};
                var sum = 0;
                var moduleCnt;
                for (var i = 0; i < jobQueries.length; i++) {
                    moduleCnt = jobQueries.length;
                    modules[i]['percentagecompleted'] = Math.round((listOfJobs2[i].length * 100 / listOfJobs[i].length));
                    sum = sum + parseInt(modules[i]['percentagecompleted']);
                }
                var avg = sum / countModules;
                res.json(Math.round(avg * 100) / 100);
            });
        });
    });
});

function getQuizScore(quiz) {
    var count = 0;
    var quizlength = 0;
    for (var key in quiz) {
        quizlength = quizlength + 1;
        if (quiz.hasOwnProperty(key)) {
            console.log(key + " -> " + quiz[key]);
        }
        if (quiz[key] == 'correct') {
            count = count + 1;
        }
    }
    return [count, quizlength];
}

router.get('/topics/:courseurl', function (req, res, next) {
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;
    var courseObj;
    var modulesObj;
    var topicsObj;
    var elementsObj;
    lmsCourses.findOne({ 'course_url': "" + req.params.courseurl }, function (err, courseobj) {
        if (courseobj) {
            var courseid = courseobj._id;
            lmsModules.find({ course_id: (courseid), deleted: { $ne: "true" } }, async function (err, moduleslist) {
                moduleslist.sort(function (a, b) {
                    var keyA = a.module_order,
                        keyB = b.module_order;
                    // Compare the 2 dates
                    if (keyA < keyB) return -1;
                    if (keyA > keyB) return 1;
                    return 0;
                });
                var coursedata = [];
                for(var module of moduleslist){
                    var moduledata = await getModuleData(module._id);
                    coursedata.push(moduledata);
                }
                // res.json(coursedata);
                let html = `<div class="topicsaccordion" id="accordion">
                ${coursedata.map((module, moduleindex)=>{
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
                        ${module[0].topics.map((topic, topicindex)=>{
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
                                ${topic.elements.map((element, elementindex)=>{
                                    if(element.element_type=='video'){
                                        if(elementindex ==0 && topicindex==0){
                                            return `
                                            <li>
                                        <div class="left-content">
                                        <i class="fa fa-play-circle"></i>&nbsp;&nbsp;
                                        <h5><a href="#">${element.element_name}</a>
                                        </h5>
                                        </div>
                                        <div class="right-content">
                                        <a href="https://vimeo.com/${element.element_val.match(/([^\/]*)\/*$/)[1]}" class="popup-youtube light">
                                        <i class="fa fa-play-circle play-preview"></i>
                                        </a>
                                        </div>
                                    </li>`;
                                        }
                                        else{
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
                                    }
                                    else if(element.element_type=='quiz'){
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
                                    }
                                    else if(element.element_type=='exercise'){
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
                                }).join("")}
                            </ul>
                            </div>
                            </div>
                          </div>`
                        }).join("")}
                        </div>      
                      
                      </div>
                    </div>`
                }).join("")}
                </div>
              </div>`;
                let html2 = `
                <div class="accordion" id="accordionExample">
                        ${coursedata.map((module, moduleindex)=>{
                            return `<div class="card">
                            <div class="card-header" id="heading${moduleindex}">
                               <h5 class="mb-0 collapsed moduleheader" data-toggle="collapse" data-target="#collapse${moduleindex}" aria-expanded="false" aria-controls="collapse${moduleindex}">
                                  ${module[0].module_name}
                               </h5>
                               <hr>
                            </div>
                            <div id="collapse${moduleindex}" class="collapse ${moduleindex == 0 ? 'show' : ''}" aria-labelledby="heading${moduleindex}" data-parent="#accordionExample" style="">
                               <div class="card-body">
                               <div class="accordion" id="accordionExample${moduleindex}">
                               ${module[0].topics.map((topic, topicindex)=>{
                                   return  `
                                   <div class="card-header card-header-topic" id="heading${moduleindex}${topicindex}">
                                        <h5 class="mb-0 collapsed topicheader ${topicindex == 0 ? 'moduletopic1': ''}" data-toggle="collapse" data-target="#collapse${moduleindex}${topicindex}" aria-expanded="false" aria-controls="collapse${moduleindex}${topicindex}">
                                        ${topic.topic_name}
                                        </h5>
                                    </div>
                                    <div id="collapse${moduleindex}${topicindex}" class="collapse ${topicindex==0 ? 'show' : ''}" aria-labelledby="heading${moduleindex}${topicindex}" data-parent="#accordionExample${moduleindex}" style="">
                                        <div class="card-body">
                                        <ul>
                                            ${topic.elements.map((element, elementindex)=>{
                                                if(element.element_type=='video'){
                                                    if(elementindex ==0 && topicindex==0){
                                                        return `
                                                        <li>
                                                    <div class="left-content">
                                                    <i class="fa fa-play-circle"></i>
                                                    <h5><a href="#">${element.element_name}</a>
                                                    </h5>
                                                    </div>
                                                    <div class="right-content">
                                                    <a href="https://vimeo.com/${element.element_val.match(/([^\/]*)\/*$/)[1]}" class="popup-youtube light">
                                                    <i class="fa fa-play-circle play-preview"></i>
                                                    </a>
                                                    </div>
                                                </li>`;
                                                    }
                                                    else{
                                                        return `<li>
                                                    <div class="left-content">
                                                    <i class="fa fa-play-circle"></i>
                                                    <h5><a href="#">${element.element_name}</a>
                                                    </h5>
                                                    </div>
                                                    <div class="right-content">
                                                   <i class="fa fa-lock" style="color: #DB4437!important"></i>
                                                </div>
                                                </li>`;
                                                    }
                                                }
                                                else if(element.element_type=='quiz'){
                                                    return `<li>
                                                    <div class="left-content">
                                                    <i class="fa fa-question-circle"></i>
                                                    <h5><a href="#">${element.element_name}</a>
                                                    </h5>
                                                    </div>
                                                    <div class="right-content">
                                                   <i class="fa fa-lock" style="color: #DB4437!important"></i>
                                                </div>
                                                </li>`;
                                                }
                                                else if(element.element_type=='exercise'){
                                                    return `<li>
                                                    <div class="left-content">
                                                    <i class="fa fa-file-text"></i>
                                                    <h5><a href="#">${element.element_name}</a>
                                                    </h5>
                                                    </div>
                                                    <div class="right-content">
                                                   <i class="fa fa-lock" style="color: #DB4437!important"></i>
                                                </div>
                                                </li>`;
                                                }
                                            }).join("")}
                                        </ul>
                                        </div>
                                    </div>
                                    ${(module[0].topics.length+1) == topicindex ? '' : '<hr>'}
                                   `
                               }).join('')}
                               </div>
                               </div>
                            </div>
                         </div>`
                        }).join("")}
                     </div>`;
                     res.json(html);
            });

        }
        else {
            res.redirect('/');
        }
    });
});


async function getModuleData(module_id) {
    const myPromise = new Promise((resolve, reject) => {
        const { ObjectId } = require('mongodb'); // or ObjectID
        const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;

        lmsModules.find({ _id: safeObjectId(module_id), deleted: { $ne: "true" } }, function (err, modules) {
            if (modules.length == 0) {
                reject(-1)
            }
            else {
                var order = modules[0].module_order;
                modulesObj = modules;
                console.log(modules);
                lmsTopics.find({ module_id: safeObjectId(modules[0]["_id"]), deleted: { $ne: "true" } }, function (err, topics) {
                    topicsObj = topics;
                    lmsElements.find({ element_module_id: safeObjectId(modules[0]["_id"]), deleted: { $ne: "true" } }, function (err, elements) {
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
                            topicsObj[i]['elements'] = [];
                            for (let j = 0; j < elementsObj.length; j++) {
                                if ((elementsObj[j]['element_taskid']) == topicsObj[i]['_id']) {
                                    topicsObj[i]['elements'].push(elementsObj[j]);
                                    topicsObj[i]['elements'].sort(function (a, b) {
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
                            modulesObj[i]['topics'] = [];
                            for (let j = 0; j < topicsObj.length; j++) {
                                if ((topicsObj[j]['module_id']) == modulesObj[i]['_id']) {
                                    modulesObj[i]['topics'].push(topicsObj[j]);
                                }
                            }
                        }
                        resolve(modulesObj);
                    });
                });
            }
        });
    });
    return myPromise;
}

router.post('/updateinfo', function (req, res) {
    let updateQuery = {};
    updateQuery[req.body.name] = req.body.value
    lmsCourses.update(
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


/**
 * Upload course card image
 */
router.post('/uploadimage', function (req, res, next) {
    var courseid = req.body.courseid;
    var bucketParams = { Bucket: 'ampdigital' };
    s3.createBucket(bucketParams);
    var s3Bucket = new aws.S3({ params: { Bucket: 'ampdigital' } });
    // res.json('succesfully uploaded the image!');
    if (!req.files) {
        // res.json('NO');
    }
    else {
        var imageFile = req.files.avatar;
        var data = { Key: imageFile.name, Body: imageFile.data };
        s3Bucket.putObject(data, function (err, data) {
            if (err) {
                res.json(err);
            } else {
                var urlParams = { Bucket: 'ampdigital', Key: imageFile.name };
                s3Bucket.getSignedUrl('getObject', urlParams, function (err, url) {
                    if (err) {
                        res.json(err);
                    }
                    else {
                        lmsCourses.update(
                            {
                                _id: courseid
                            },
                            {
                                $set: { "course_image": url }
                            }
                            ,
                            function (err, count) {
                                if (err) {
                                    res.json(err);
                                }
                                else {
                                    res.json('Success: Image Uploaded!');
                                }
                            });
                    }
                });
            }
        });
    }

});

/**
 * Upload assignment image
 */
router.put('/assignment/uploadimage', function (req, res) {
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;

    var doc = req.body.image;
    var element_id = req.body.id;

    lmsElements.findOne({ _id: safeObjectId(element_id) }, function (err, element) {
        if (element) {
            lmsCourses.findOne({ _id: safeObjectId(element.element_course_id) }, function (err, course) {
                lmsModules.findOne({ _id: safeObjectId(element.element_module_id) }, function (err, moduleObj) {
                    lmsTopics.findOne({ _id: safeObjectId(element.element_taskid) }, function (err, topic) {
                        if (course && moduleObj && topic) {
                            var submission2 = new submission({
                                course_name: course.course_name,
                                module_name: moduleObj.module_name,
                                topic_name: topic.topic_name,
                                assignment_name: element.element_name,
                                assignment_id: element_id,
                                doc_url: doc,
                                submitted_by_name: getusername(req.user), notifications: req.user.notifications,
                                submitted_by_email: req.user.email,
                                submitted_on: new Date()
                            });
                            submission2.save(function (err, results) {
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

                                    var html = 'Hello from AMP Digital,<br>\n' +
                                        '<br>\n' +
                                        `${getusername(req.user)} has submitted assignment: ${element.element_name} on topic ${topic.topic_name} of module ${moduleObj.module_name} of course ${course.course_name}. Please go to admin panel and review.` +
                                        '<br>\n' +
                                        'Best Wishes,' +
                                        '<br>' +
                                        '<table width="351" cellspacing="0" cellpadding="0" border="0"> <tr> <td style="text-align:left;padding-bottom:10px"><a style="display:inline-block" href="https://www.ampdigital.co"><img style="border:none;" width="150" src="https://s1g.s3.amazonaws.com/36321c48a6698bd331dca74d7497797b.jpeg"></a></td> </tr> <tr> <td style="border-top:solid #000000 2px;" height="12"></td> </tr> <tr> <td style="vertical-align: top; text-align:left;color:#000000;font-size:12px;font-family:helvetica, arial;; text-align:left"> <span> </span> <br> <span style="font:12px helvetica, arial;">Email:&nbsp;<a href="mailto:amitabh@ampdigital.co" style="color:#3388cc;text-decoration:none;">amitabh@ampdigital.co</a></span> <br><br> <span style="margin-right:5px;color:#000000;font-size:12px;font-family:helvetica, arial">Registered Address: AMP Digital</span> 403, Sovereign 1, Vatika City, Sohna Road,, Gurugram, Haryana, 122018, India<br><br> <table cellpadding="0" cellpadding="0" border="0"><tr><td style="padding-right:5px"><a href="https://facebook.com/https://www.facebook.com/AMPDigitalNet/" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/23f7b48395f8c4e25e64a2c22e9ae190.png" alt="Facebook" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://twitter.com/https://twitter.com/amitabh26" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3949237f892004c237021ac9e3182b1d.png" alt="Twitter" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://linkedin.com/in/https://in.linkedin.com/company/ads4growth?trk=public_profile_topcard_current_company" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/dcb46c3e562be637d99ea87f73f929cb.png" alt="LinkedIn" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://youtube.com/https://www.youtube.com/channel/UCMOBtxDam_55DCnmKJc8eWQ" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3b2cb9ec595ab5d3784b2343d5448cd9.png" alt="YouTube" style="border:none;"></a></td></tr></table><a href="https://www.ampdigital.co" style="text-decoration:none;color:#3388cc;">www.ampdigital.co</a> </td> </tr> </table> <table width="351" cellspacing="0" cellpadding="0" border="0" style="margin-top:10px"> <tr> <td style="text-align:left;color:#aaaaaa;font-size:10px;font-family:helvetica, arial;"><p>AMP&nbsp;Digital is a Google Partner Company</p></td> </tr> </table>';
                                    var options = {
                                        from: 'ampdigital.co <amitabh@ads4growth.com>',
                                        to: ["siddharthsogani22@gmail.com", "rakhee@ads4growth.com", "amitabh@ads4growth.com"],
                                        subject: 'ampdigital.co: Assignment Submission',
                                        content: '<html><head></head><body>' + html + '</body></html>'
                                    };

                                    sesMail.sendEmail(options, function (err, data) {
                                        // TODO sth....
                                        console.log(err);
                                        res.json(results)
                                    });
                                }
                            });
                        }
                    });
                });
            });
        }
    });
});

/*POST new module*/
router.post('/modules', function (req, res, next) {
    var module = new lmsModules({
        module_createdon: new Date(),
        module_name: req.body.module_name,
        module_description: req.body.module_description,
        module_image: req.body.module_image,
        module_order: req.body.module_order,
        course_id: req.body.course_id
    });
    module.save(function (err, results) {
        if (err) {
            res.json(err);
        }
        else {
            res.json(results);
        }
    });
});

router.post('/modules/uploadimage', function (req, res, next) {
    var moduleid = req.body.moduleid;
    var bucketParams = { Bucket: 'ampdigital' };
    s3.createBucket(bucketParams);
    var s3Bucket = new aws.S3({ params: { Bucket: 'ampdigital' } });
    // res.json('succesfully uploaded the image!');
    if (!req.files) {
        // res.json('NO');
    }
    else {
        var imageFile = req.files.avatar;
        var data = { Key: imageFile.name, Body: imageFile.data };
        s3Bucket.putObject(data, function (err, data) {
            if (err) {
                res.json(err);
            } else {
                var urlParams = { Bucket: 'ampdigital', Key: imageFile.name };
                s3Bucket.getSignedUrl('getObject', urlParams, function (err, url) {
                    if (err) {
                        res.json(err);
                    }
                    else {
                        lmsModules.update(
                            {
                                _id: moduleid
                            },
                            {
                                $set: { "module_image": url }
                            }
                            ,
                            function (err, count) {
                                if (err) {
                                    res.json(err);
                                }
                                else {
                                    res.json('Success: Image Uploaded!');
                                }
                            });
                    }
                });
            }
        });
    }

});

// Update FAQ Question
router.post('/modules/updateinfo', function (req, res) {
    let updateQuery = {};
    updateQuery[req.body.name] = req.body.value
    lmsModules.update(
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

router.get('/modules/forum/:course', function (req, res, next) {
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;
    if (req.isAuthenticated()) {
        lmsModules.findOne({ _id: ObjectId(req.params.course), deleted: { $ne: "true" } }, function (err, module) {
            lmsCourses.findOne({ '_id': ObjectId(module.course_id) }, function (err, course) {
                if (course) {
                    var courseid = course._id
                    lmsModules.find({ course_id: courseid, deleted: { $ne: "true" } }, function (err, modules) {
                        modules.sort(function (a, b) {
                            var keyA = a.module_order,
                                keyB = b.module_order;
                            // Compare the 2 dates
                            if (keyA < keyB) return -1;
                            if (keyA > keyB) return 1;
                            return 0;
                        });
                        res.json(modules);
                    });
                }
                else {
                    res.redirect('/');
                }
            });
        });
    }
    else {
        res.json(-1);
    }
});

/*REMOVE a module*/
router.delete('/modules/removemodule', function (req, res) {
    var module_id = req.body.module_id;
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;

    lmsModules.update(
        {
            _id: safeObjectId(module_id)
        },
        {
            $set: { 'deleted': 'true' }
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

/*GET modules page for a course*/
router.get('/:id/modules/manage', isAdmin, function (req, res, next) {
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;
    lmsCourses.find({ _id: safeObjectId(req.params.id) }, function (err, course) {
        lmsModules.find({ course_id: req.params.id, deleted: { $ne: "true" } }, function (err, modules) {
            res.render('adminpanel/modules', { course: course, modules: modules, moment: moment, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
        });
    });
});

router.get('/getmodules/:course', function (req, res, next) {
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;
    if (req.isAuthenticated()) {
        lmsCourses.findOne({ 'course_access_url': "/" + req.params.course }, function (err, course) {
            if (course) {
                var courseid = course._id
                lmsModules.find({ course_id: courseid, deleted: { $ne: "true" } }, function (err, modules) {
                    modules.sort(function (a, b) {
                        var keyA = a.module_order,
                            keyB = b.module_order;
                        // Compare the 2 dates
                        if (keyA < keyB) return -1;
                        if (keyA > keyB) return 1;
                        return 0;
                    });
                    res.json(modules);
                });
            }
            else {
                res.redirect('/');
            }
        });
    }
    else {
        res.json(-1);
    }
});

/*GET topics page for a module*/
router.get('/topics/:courseid/:moduleid/manage', isAdmin, function (req, res, next) {
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;
    lmsCourses.find({ _id: safeObjectId(req.params.courseid) }, function (err, course) {
        lmsModules.find({ _id: safeObjectId(req.params.moduleid) }, function (err, module) {
            lmsTopics.find({ module_id: req.params.moduleid, deleted: { $ne: "true" } }, null, { sort: { order: 1 } }, function (err, topics) {
                res.render('adminpanel/topics', { course: course, module: module, topics: topics, moment: moment, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
            });
        });
    });
});

/*POST new topic*/
router.post('/topics', function (req, res, next) {
    var topic = new lmsTopics({
        topic_createdon: new Date(),
        topic_name: req.body.topic_name,
        topic_order: req.body.topic_order,
        course_id: req.body.course_id,
        module_id: req.body.module_id
    });
    topic.save(function (err, results) {
        if (err) {
            res.json(err);
        }
        else {
            res.json(results);
        }
    });
});

/*REMOVE a topic*/
router.delete('/topics/removetopic', function (req, res) {
    var topic_id = req.body.topic_id;
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;

    lmsTopics.update(
        {
            _id: safeObjectId(topic_id)
        },
        {
            $set: { 'deleted': 'true' }
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

// Update FAQ Question
router.post('/topics/updateinfo', function (req, res) {
    let updateQuery = {};
    updateQuery[req.body.name] = req.body.value
    lmsTopics.update(
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

/*GET elements page for a topic*/
router.get('/elements/:courseid/:moduleid/:topicid/manage', isAdmin, function (req, res, next) {
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;
    lmsCourses.find({ _id: safeObjectId(req.params.courseid) }, function (err, course) {
        lmsModules.find({ _id: safeObjectId(req.params.moduleid) }, function (err, module) {
            lmsTopics.find({ _id: safeObjectId(req.params.topicid) }, function (err, topic) {
                lmsElements.find({ element_taskid: safeObjectId(req.params.topicid), deleted: { $ne: "true" } }, function (err, elements) {
                    res.render('adminpanel/elements', { course: course, module: module, topic: topic, elements: elements, moment: moment, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
                });
            });
        });
    });
});

/*Mark that the quiz has been completed or video has been watched by the user*/
router.put('/elements/watchedby', function (req, res) {
    lmsElements.findByIdAndUpdate(
        req.query.id,
        {
            $addToSet: { "watchedby": req.query.userid }
        },
        { safe: true, upsert: true },
        function (err, model) {
            console.log(err);
            if (err) {
                res.json(err);
            }
            else {
                lmsUsers.update(
                    { email: req.query.userid },
                    {
                        $addToSet: { "elementswatched": req.query.id }
                    },
                    { safe: true, upsert: true },
                    function (err, model) {
                        console.log(err);
                        if (err) {
                            res.json(err);
                        }
                        else {
                            res.json(model);
                        }
                    }
                );
            }
        }
    );
});

/*Insert Quiz Log*/
router.post('/elements/quizlog', function (req, res, next) {
    var quizlog = new lmsQuizlog({
        quizid: req.body.id,
        email: req.body.userid,
        date: req.body.date,
        maxtime: req.body.maxtime,
        totalquestions: req.body.totalquestions,
        quizcompleted: 'false'
    });
    quizlog.save(function (err, results) {
        if (err) {
            res.json(err);
        }
        else {
            res.json(results);
        }
    });
});

/*Get Quiz Log*/
router.get('/elements/getquizlog', function (req, res, next) {
    lmsQuizlog.find({
        quizid: req.query.id,
        email: req.query.userid
    }, function (err, quizes) {
        res.json(quizes);
    });
});

/*Update Quiz Log*/
router.put('/elements/resetquiz', function (req, res, next) {
    // res.json({email : req.body.emailid, quizid: req.body.quizid});
    var querystring = { quizid: req.body.quizid, email: req.body.emailid };
    // res.json(querystring);
    lmsQuizlog.remove(
        querystring,
        function (err, count) {
            console.log(count);
            if (err) {
                console.log(err);
            }
            else {
                lmsQueLog.remove(
                    querystring,
                    function (err, count) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log(count);
                            res.json(count);
                        }
                    })
            }
        });
});

/*GET/PUT  Que Log*/
router.post('/elements/updatequelog', function (req, res, next) {
    lmsQueLog.find({
        queNo: req.body.queNo,
        quizid: req.body.element_id,
        email: req.body.loggedinEmail
    }, function (err, results) {
        if (err) {
            res.json(err);
        }
        else {
            if (results.length > 0) {
                var updateQuery = {
                    questionCorrectIncorrect: req.body.questionCorrectIncorrect,
                    queAns: req.body.queAns
                };

                var findQuery = {
                    queNo: req.body.queNo,
                    quizid: req.body.element_id,
                    email: req.body.loggedinEmail
                };
                lmsQueLog.update(
                    findQuery,
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

            }
            else {
                var quelog = new lmsQueLog({
                    date: new Date(),
                    questionCorrectIncorrect: req.body.questionCorrectIncorrect,
                    queAns: req.body.queAns,
                    queNo: req.body.queNo,
                    quizid: req.body.element_id,
                    email: req.body.loggedinEmail
                });
                quelog.save(function (err, results) {
                    if (err) {
                        res.json(err);
                    }
                    else {
                        res.json(results);
                    }
                });
            }
        }
    });
});

/*Update Quiz Log*/
router.put('/elements/updatequizlog', function (req, res, next) {
    var updateQuery = {
        questionCorrectIncorrect: req.body.questionCorrectIncorrect,
        quizAnswers: req.body.quizAnswers,
        queNo: req.body.queNo,
        score: req.body.score
    };

    var findQuery = {
        quizid: req.body.element_id,
        email: req.body.loggedinEmail
    };
    lmsQuizlog.update(
        findQuery,
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

/*Mark Quiz as Completed*/
router.put('/elements/markquizcompleted', function (req, res, next) {
    var updateQuery = {
        quizcompleted: 'true'
    };

    var findQuery = {
        quizid: req.body.element_id,
        email: req.body.loggedinEmail
    };
    lmsQuizlog.update(
        findQuery,
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

/*GET quiz*/
router.post('/elements/getquiz', function (req, res, next) {
    var quiz_id = req.body.quiz_id;
    console.log(quiz_id);
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;
    lmsQuiz.find({ _id: safeObjectId(quiz_id) }, function (err, docs) {
        res.json(docs[0]);
    });
});

router.post('/elements/percentile', function (req, res, next) {
    lmsQuizlog.find({ quizid: req.body.quizid }, function (err, docs) {
        var quizPercentageArray = [];
        var myPercentage;
        for (var i = 0; i < docs.length; i++) {
            if (docs[i]['email'] == req.body.email) {
                myPercentage = docs[i]['score'] * 100 / docs[i]['totalquestions'];
            }
            quizPercentageArray.push(docs[i]['score'] * 100 / docs[i]['totalquestions']);
        }
        res.json(100 * percentRank(quizPercentageArray.sort(), myPercentage));
    });
});

// Returns the percentile of the given value in a sorted numeric array.
function percentRank(arr, v) {
    if (typeof v !== 'number') throw new TypeError('v must be a number');
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

router.post('/elements/quiz', function (req, res, next) {
    var quiz = new lmsQuiz({
        quiz_title: req.body.quiz_name,
        maxTimeToFinish: req.body.quiz_time,
        pages: req.body.quiz_questions
    });
    quiz.save(function (err, results) {
        if (err) {
            res.json(err);
        }
        else {
            res.json(results);
        }
    });
});

router.put('/elements/quiz', function (req, res, next) {
    var quiz = {
        quiz_title: req.body.quiz_name,
        maxTimeToFinish: req.body.quiz_time,
        pages: req.body.quiz_questions
    };
    lmsQuiz.update(
        {
            _id: req.body.pk
        },
        {
            $set: quiz
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

/*REMOVE a module*/
router.delete('/elements/removequiz', function (req, res) {
    var quiz_id = req.body.quiz_id;
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;

    lmsQuiz.update(
        {
            _id: safeObjectId(quiz_id)
        },
        {
            $set: { 'deleted': 'true' }
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

/*POST new element*/
router.post('/elements', function (req, res, next) {
    req.body.element_createdon = new Date();
    var element = new lmsElements(req.body);
    element.save(function (err, results) {
        if (err) {
            res.json(err);
        }
        else {
            res.json(results);
        }
    });
});

// Update FAQ Question
router.post('/elements/updateinfo', function (req, res) {
    let updateQuery = {};
    updateQuery[req.body.name] = req.body.value
    lmsElements.update(
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

/*REMOVE a video or quiz*/
router.delete('/elements/removeelement', function (req, res) {
    var element_id = req.body.element_id;
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;

    lmsElements.update(
        {
            _id: safeObjectId(element_id)
        },
        {
            $set: { 'deleted': 'true' }
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

/*GET courses page*/
router.get('/faqs/manage/:courseid', isAdmin, function (req, res, next) {
    faqModel.find({ 'deleted': { $ne: 'true' }, 'course_id': req.params.courseid }, function (err, faqdocs) {
        res.render('adminpanel/faq', { email: req.user.email, courseid: req.params.courseid, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications, faqdocs: faqdocs, moment: moment });
    });
});

/* GET courses page. */
router.get('/faqs/:course_id', function (req, res, next) {
    req.session.returnTo = '/courses/digital-marketing-course';
    faqModel.aggregate([
        {
            $match: { "deleted": { $ne: true }, course_id: req.params.course_id }
        },
        {
            $group: {
                _id: { category: "$category" },
                question: { $push: "$question" },
                answer: { $push: "$answer" }
            }
        }
    ], function (err, faqdocs) {
        var html = "";
        for (var i = 0; i < faqdocs.length; i++) {
            html = html + `
            <div class="card">
            <div class="card-header" id="headingfaq${i}">
                <h4 class="mb-0 ${i!==0 ? 'collapsed' : 'collapsed'} categoryheading" data-toggle="collapse"
                    data-target="#collapsefaq${i}" aria-expanded="${i==0?'false':'false'}"
                    aria-controls="collapse${i}">
                    ${faqdocs[i]['_id'].category}
                </h4>
                <hr class="mx-5">
            </div>
            <div id="collapsefaq${i}" class="collapse ${i==0?'':''}"
                aria-labelledby="headingfaq${i}" data-parent="#accordionExample">
                <div class="accordion" id="accordionExamplefaq${i}">
                    
                  ${Object.keys(faqdocs[i].question).map(function (j) {
                return `
                <div class="faqcard">
                    <div class="card-header" id="headingfaq${i}-${j}">
                        <h4 class="mb-0" data-toggle="collapse"
                            data-target="#collapsefaq${i}-${j}" aria-expanded="${j==0?'true':'true'}"
                            aria-controls="collapse${i}-${j}">
                            Q. ${faqdocs[i].question[j]}
                        </h4>
                    </div>

                    <div id="collapsefaq${i}-${j}" class="collapse ${j==0?'show':'show'}"
                        aria-labelledby="heading${i}-${j}"
                        data-parent="#accordionExamplefaq">
                        <div class="card-body ml-4">
                            <p class="mb-0">
                            ${faqdocs[i].answer[j]}
                            </p>
                        </div>
                    </div>
                    ${(j+1) == faqdocs[i].question.length ? '' : `<hr class="faqcard-hr ml-5">`}
                </div>`
            }).join("")}
              </div>      
            
            </div>
          </div>
        </div>`
        }
        res.json(html);
    });
});

// Create a new faq
router.post('/faqs/addfaq', function (req, res, next) {
    var faq = new faqModel({
        question: req.body.question,
        answer: req.body.answer,
        course_id: req.body.courseid,
        date: new Date()
    });
    faq.save(function (err, results) {
        if (err) {
            res.json(err);
        }
        else {
            res.redirect('/courses/faqs/manage/'+req.body.courseid);
        }
    });
});

// Update FAQ Question
router.post('/faqs/updateinfo', function (req, res) {
    let updateQuery = {};
    updateQuery[req.body.name] = req.body.value
    faqModel.update(
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

// Delete a FAQ
router.delete('/faqs/removefaq', function (req, res, next) {
    faqModel.update(
        {
            _id: req.body.faqid
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
