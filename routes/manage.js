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

router.get('/coursereport', isAdmin, function (req, res, next) {
    req.session.returnTo = req.baseUrl+req.path;
    if (1) {
        lmsCourses.find({ 'deleted': { $ne: 'true' } }, function (err, courses) {
            lmsUsers.find({}, function (err, users) {
                res.render('adminpanel/courseprogress', { docs: users, courses: courses, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
            });
        });
    }
    else {
        res.redirect('/signin');
    }
});

router.get('/quizes', isAdmin, function (req, res, next) {
    req.session.returnTo = req.baseUrl+req.path;
    lmsQuiz.find({ deleted: { $ne: 'true' } }, function (err, quizes) {
        res.render('adminpanel/quizes', { moment: moment, quizes: quizes, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
    });
});

/*GET manage events page*/
router.get('/coupons', isAdmin, function (req, res, next) {
    coupon.find({}, function (err, docs) {
        res.render('adminpanel/manage_coupons', { docs: docs, email: req.user.email, moment: moment });
    });
});

router.get('/quotes', function (req, res, next) {
    res.render('quotes', { moment: moment });
});

router.post('/quizes/csvupload', function (req, res, next) {
    let csvtojson = require("csvtojson");
    let csvData = req.files.file.data.toString('utf8');
    csvtojson().fromString(csvData).then(json => {
        // return res.json(json);
        let jsonarray = [];
        jsonarray[0] =
        {
            "questions": [
                {
                    "type": "html",
                    "html": "You are about to start the quiz. <br/>You have <span class='quizminutes'> 5 </span> mins whole quiz of <span class='quiztotalquestions'>4</span> questions.<br/>Please click on <b>'Start Quiz'</b> button when you are ready."
                }
            ]
        }

        for (let i = 0; i < json.length; i++) {
            let arr2 = [];
            if (json[i].Identifier == 1) {
                if (typeof json[i].Answer.trim().split(",") !== 'undefined') {
                    let arr = json[i].Answer.trim().split(",");
                    for (let j = 0; j < arr.length; j++) {
                        arr2.push(parseInt(arr[j]));
                    }
                }
                else {
                    arr2 = parseInt(json[i].Answer);
                }
            }

            jsonarray.push({
                "questions": [
                    {
                        "isRequired": true,
                        "type": json[i].Identifier == 0 ? "radiogroup" : "checkbox",
                        "title": json[i].Question,
                        "choices": [
                            json[i].Option1,
                            json[i].Option2,
                            json[i].Option3,
                            json[i].Option4
                        ],
                        "correctAnswer": json[i].Identifier == 0 ? parseInt(json[i].Answer) : arr2

                    }
                ]
            });
        }

        var quiz = new lmsQuiz({
            quiz_title: req.body.quiz_name,
            maxTimeToFinish: req.body.quiz_time,
            pages: JSON.stringify(jsonarray)
        });
        quiz.save(function (err, results) {
            if (err) {
                res.json(err);
            }
            else {
                res.redirect('/quizes');
            }
        });
    })
})



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
