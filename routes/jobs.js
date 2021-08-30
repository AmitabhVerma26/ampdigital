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


/**
 * Jobs Post Page
 */
router.get('/post', myLogger, function (req, res, next) {
    req.session.returnTo = req.path;
    if (!req.isAuthenticated()) {
        res.render('jobs/postjob', { title: 'Express', authenticated: false });
    }
    else {
        res.render('jobs/postjob', { title: 'Express', authenticated: true, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
    }
});

/**
 * Jobs Posts Page
 */
router.get('/', myLogger, function (req, res, next) {
    req.session.returnTo = req.path;
    job.find({ deleted: { $ne: "true" }, approved: true, company: { $ne: "AMP Digital Solutions Pvt Ltd" } }).skip(0).limit(10).sort({ date: -1 }).exec(function (err, jobs) {
        job.find({ deleted: { $ne: "true" }, approved: true, company: { $in: ["AMP Digital Solutions Pvt Ltd"] } }).skip(0).limit(10).sort({ date: -1 }).exec(function (err, ampdigitaljobs) {
            for (var i = 0; i < jobs.length; i++) {
                ampdigitaljobs.push(jobs[i]);
            }
            if (req.isAuthenticated()) {
                res.render('jobs/jobs', { title: 'Express', active: "all", jobs: ampdigitaljobs, moment: moment, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
            }
            else {
                res.render('jobs/jobs', { title: 'Express', active: "all", jobs: ampdigitaljobs, moment: moment });
            }
        });
    });
});

/**
 * Jobs Home Page
 */
router.get('/home', myLogger, function (req, res, next) {
    req.session.returnTo = req.path;
    if (req.isAuthenticated()) {
        res.render('jobs/jobslandingpage', { moment: moment, success: '_', title: 'Express', email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
    }
    else {
        res.render('jobs/jobslandingpage', { moment: moment, success: '_', title: 'Express' });
    }
});

/* GET blog post page. */
router.get('/:joburl', myLogger, function (req, res, next) {
    req.session.returnTo = req.path;
    var joburl = req.params.joburl;
    var jobidArray = joburl.split("-");
    var jobid = jobidArray[jobidArray.length - 1];
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;
    job.findOne({ deleted: { $ne: true }, _id: safeObjectId(jobid) }, function (err, job) {
        if (job) {
            if (req.isAuthenticated()) {
                res.render('jobs/job', { title: 'Express', job: job, moment: moment, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), phone: req.user.local.phone, notifications: req.user.notifications });
            }
            else {
                res.render('jobs/job', { job: job, moment: moment });
            }
        }
        else {
            res.redirect('/')
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
    res.redirect('/auth');
}

function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.role == '2')
        return next();
    res.redirect('/');
}

module.exports = router;