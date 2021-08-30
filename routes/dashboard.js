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

/* GET dashboard page. */
router.get('/', myLogger, isLoggedIn, function (req, res, next) {
    req.session.returnTo = req.path;
    var courses = [];
    if (req.user.courses) {
        lmsCourses.find({ 'deleted': { $ne: 'true' }, "_id": { $in: req.user.courses } }, function (err, courses) {
            res.render('courses/dashboard', { title: 'Express', courses: courses, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
        });
    }
    else {
        res.render('courses/dashboard', { title: 'Express', courses: [], email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
    }
});

/*Digital Marketing Course Page*/
router.get('/:course', myLogger, function (req, res, next) {
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
                    var jobQueries = [];
                    var jobQueries2 = [];
                    var jobQueries3 = [];
                    var countModules = modules.length;
                    for (var i = 0; i < modules.length; i++) {
                        jobQueries.push(lmsElements.find({ element_type: {$ne: "exercise"}, element_module_id: safeObjectId(modules[i]['_id']), deleted: { $ne: "true" } }));
                    }
                    for (var i = 0; i < modules.length; i++) {
                        jobQueries2.push(lmsElements.find({ element_type: {$ne: "exercise"}, element_module_id: safeObjectId(modules[i]['_id']), deleted: { $ne: "true" }, watchedby: req.user.email }));
                    }
                    for (var i = 0; i < modules.length; i++) {
                        jobQueries3.push(submission.find({ module_name: (modules[i]['module_name']), deleted: { $ne: "true" }, watchedby: req.user.email }));
                    }

                    Promise.all(jobQueries).then(function (listOfJobs) {
                        Promise.all(jobQueries2).then(function (listOfJobs2) {
                            Promise.all(jobQueries3).then(function (listOfJobs3) {
                            var lArray = [];
                            var modulesVideoLength = [];
                            for (var i = 0; i < jobQueries.length; i++) {
                                var temp = 0;
                                for (var j = 0; j < listOfJobs[i].length; j++) {
                                    if (listOfJobs[i][j]['element_type'] == 'video') {
                                        temp = temp + parseInt(listOfJobs[i][j]['duration']);
                                    }
                                    else if (listOfJobs[i][j]['element_type'] == 'quiz') {
                                        if (typeof listOfJobs[i][j]['duration'] !== 'undefined' && listOfJobs[i][j]['duration']) {
                                            temp = temp + parseInt(listOfJobs[i][j]['duration']) * 60;
                                        }
                                    }
                                }
                                modules[i]['modulesVideoLength'] = (Math.round(temp / 60) + ' minutes ');
                            }
                            var modulesInfo = {};
                            var sum = 0;
                            var moduleCnt;
                            for (var i = 0; i < jobQueries.length; i++) {
                                moduleCnt = jobQueries.length;
                                modules[i]['percentagecompleted'] = Math.round(( (listOfJobs2[i].length + listOfJobs3[i].length ) * 100 / listOfJobs[i].length));
                                sum = sum + parseInt(modules[i]['percentagecompleted']);
                            }
                            var avg = sum / countModules;
                            // res.json(modules);
                            res.render('courses/course_modules', { course: course, avg: avg, title: 'Express', modulesVideoLength: modulesVideoLength, modules: modules, moment: moment, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
                        });
                        });
                    });
                });
            }
            else {
                res.redirect('/');
            }
        });
    }
    else {
        req.session.returnTo = '/' + req.params.course;
        res.redirect('/signin');
    }
    /**/
});

router.get('/:courseurl/:moduleid', myLogger, function (req, res, next) {
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;
    var module_id = req.params.moduleid;
    var courseObj;
    var modulesObj;
    var topicsObj;
    var elementsObj;
    lmsCourses.findOne({ 'course_access_url': "/" + req.params.courseurl }, function (err, courseobj) {
        if (courseobj) {
            var courseid = courseobj._id;
            lmsModules.find({ course_id: (courseid), deleted: { $ne: "true" } }, function (err, moduleslist) {
                moduleslist.sort(function (a, b) {
                    var keyA = a.module_order,
                        keyB = b.module_order;
                    // Compare the 2 dates
                    if (keyA < keyB) return -1;
                    if (keyA > keyB) return 1;
                    return 0;
                });
                lmsModules.find({ module_id: (module_id), deleted: { $ne: "true" } }, function (err, modules) {
                    if(modules.length==0){
                        res.redirect("/")
                    }
                    else{
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
                                // var topics = modulesObj[0].topics;
                                // var videos = [];
                                // for(var i = 0; i < topics.length; i++){
                                //     for(var j = 0; j < topics[i].elements.length; j++){
                                //         videos.push(topics[i].elements[j])
                                //     }
                                // }
                                // res.json(modulesObj);
                                // return;
                                lmsModules.findOne({ course_id: courseid.toString(), module_order: order + 1, deleted: { $ne: "true" } }, function (err, moduleNext) {
                                    forum.find({}, function (err, forumdocs) {
                                        if (req.isAuthenticated()) {
                                            if (moduleNext) {
                                                res.render('courses/course_module', { moduleslist: moduleslist, forumdocs: forumdocs, moment: moment, courseurl: req.params.courseurl, moduleid: req.params.moduleid, nextmoduleid: moduleNext.module_id.toString(), title: 'Express', courseobj: courseobj, course: modulesObj, moment: moment, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, user: req.user });
                                            }
                                            else {
                                                res.render('courses/course_module', { moduleslist: moduleslist, forumdocs: forumdocs, moment: moment, courseurl: req.params.courseurl, moduleid: req.params.moduleid, nextmoduleid: null, title: 'Express', courseobj: courseobj, course: modulesObj, moment: moment, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, user: req.user });
                                            }
                                        }
                                        else {
                                            req.session.returnTo = req.path;
                                            res.redirect('/signin');
                                        }
                                    })
                                })
                            });
                        });
                    }
                });
            });

        }
        else {
            res.redirect('/');
        }
    });
});

function myLogger(req, res, next) {
    next();
  }

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
