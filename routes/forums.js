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

const getComments = (moduleid=-1)=>{
    var query = {moduleid: moduleid, rootid: { $type: 10 }};
    if(moduleid==-1){
        query = {rootid: { $type: 10 }};
    }
    return new Promise(function(resolve, reject) {
        var comments = {};
        forumcomment.find(query, null, { sort: { created: -1 } }, function (err, response) {
            if(err){
                reject(err);
            }
            if(response){
                comments.all = response;
                var query = {moduleid: moduleid, answered: true, rootid: { $type: 10 }};
                if(moduleid==-1){
                    query = {rootid: { $type: 10 }, answered: true};
                }
                forumcomment.find(query, null, { sort: { created: -1 } }, function (err, response) {
                    if(err){
                        reject(err)
                    }
                    if(response){
                        comments.answered = response;
                        var query = {moduleid: moduleid, answered: false, rootid: { $type: 10 }};
                        if(moduleid==-1){
                            query = {rootid: { $type: 10 }, answered: false};
                        }
                        forumcomment.find(query, null, { sort: { created: -1 } }, function (err, response) {
                            if(err){
                                reject(err)
                            }
                            if(response){
                                comments.unanswered = response;
                                resolve(comments);
                            }
                        });
                    }
                });
            }
        });
    });
}

router.get('/', myLogger, function (req, res, next) {
    const { ObjectId } = require('mongodb'); // or ObjectID
    req.session.returnTo = req.path;
    var commentsPromise = getComments();
            commentsPromise.then(
                function(value) { 
                    lmsForums.find({  deleted: { $ne: "true" } }, function (err, moduleslist) {
                        moduleslist.sort(function (a, b) {
                            var keyA = a.module_order,
                                keyB = b.module_order;
                            // Compare the 2 dates
                            if (keyA < keyB) return -1;
                            if (keyA > keyB) return 1;
                            return 0;
                        });
                    if (req.isAuthenticated()) {
                        res.render('community/community', {url: req.url, comments: value, fullname: getusername(req.user) + " " + (req.user.local.lastname?req.user.local.lastname: ""), moduleslist: moduleslist, moment: moment, moment: moment, email: req.user.email, userid: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, user: req.user, name: getusername(req.user), notifications: req.user.notifications });
                    }
                    else {
                        res.render('community/community', {url: req.url, comments: value, userid: null, fullname: null, name: null, moduleslist: moduleslist, moment: moment, moduleid: req.params.moduleid, title: 'Express' });
                    }
                });
                 },
                function(error) { res.json(error) }
              );
})

router.get('/getcomments', function(req, res) {
    if(req.query.type == "all"){
        forumcomment.find({moduleid: req.query.moduleid}, function (err, response) {
            if(err){
                res.json(err);
            }
            if(response){
                res.json(response);
            }
        });
    }
    else if(req.query.type == "answered"){
        forumcomment.find({moduleid: req.query.moduleid}, function (err, response) {
            if(err){
                res.json(err);
            }
            if(response){
                var parentArray=[];
                var parentArray2=[];
                console.log(response);
                for(var i = 0; i<response.length; i++){
                    if(response[i]["parent"]!==""){
                        parentArray2.push((response[i]["parent"]));
                        parentArray.push(parseInt(response[i]["parent"]));
                    }
                    // else if(response[i]["rootid"]!==""){
                    //     parentArray.push(parseInt(response[i]["rootid"]));
                    // }
                }
                console.log(parentArray);
                forumcomment.find({moduleid: req.query.moduleid, parent: {$nin: parentArray}, id: {$nin: parentArray}}, function (err, response) {
                    if(err){
                        res.json(err);
                    }
                    if(response){
                        var idArray=[];
                        for(var i = 0; i<response.length; i++){
                            idArray.push(response[i]["id"]);
                        }
                        forumcomment.find({moduleid: req.query.moduleid, id: {$nin: idArray}}, function (err, response) {
                            if(err){
                                res.json(err);
                            }
                            if(response){
                                res.json(response);
                            }
                        });
                    }
                });
            }
        });
    }
    else if(req.query.type == "unanswered"){
        forumcomment.find({moduleid: req.query.moduleid}, function (err, response) {
            if(err){
                res.json(err);
            }
            if(response){
                var parentArray=[];
                var parentArray2=[];
                console.log(response);
                for(var i = 0; i<response.length; i++){
                    if(response[i]["parent"]!==""){
                        parentArray2.push((response[i]["parent"]));
                        parentArray.push(parseInt(response[i]["parent"]));
                    }
                    // else if(response[i]["rootid"]!==""){
                    //     parentArray.push(parseInt(response[i]["rootid"]));
                    // }
                }
                console.log(parentArray);
                forumcomment.find({moduleid: req.query.moduleid, parent: {$nin: parentArray}, id: {$nin: parentArray}}, function (err, response) {
                    if(err){
                        res.json(err);
                    }
                    if(response){
                        res.json(response);
                    }
                });
            }
        });
    }
});

router.get('/:moduleid', myLogger, function (req, res, next) {
    const { ObjectId } = require('mongodb'); // or ObjectID
    req.session.returnTo = req.path;
    var module_id = req.params.moduleid;
    var modulesObj;
    lmsModules.findOne({module_id: module_id}, function(err, module){
        if(err){
            res.json(err);
        }
        if(module){
            var commentsPromise = getComments(module._id);
            commentsPromise.then(
                function(value) { 
                    lmsForums.find({  deleted: { $ne: "true" } }, function (err, moduleslist) {
                        moduleslist.sort(function (a, b) {
                            var keyA = a.module_order,
                                keyB = b.module_order;
                            // Compare the 2 dates
                            if (keyA < keyB) return -1;
                            if (keyA > keyB) return 1;
                            return 0;
                        });
                        lmsForums.findOne({ module_id: (module_id), deleted: { $ne: "true" } }, function (err, module) {
                            if(module){
                                if (req.isAuthenticated()) {
                                    res.render('community/community_module', {url: req.url, comments: value, fullname: getusername(req.user) + " " + (req.user.local.lastname?req.user.local.lastname: ""), module: module, moduleslist: moduleslist, moment: moment, moduleid: req.params.moduleid, course: modulesObj, moment: moment, email: req.user.email, userid: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, user: req.user, name: getusername(req.user), notifications: req.user.notifications });
                                }
                                else {
                                    res.render('community/community_module', {url: req.url, comments: value, userid: null, fullname: null, name: null, module: module, moduleslist: moduleslist, moment: moment, moduleid: req.params.moduleid, course: modulesObj, title: 'Express' });
                                }
                            }
                            else{
                                res.redirect("/digital-marketing-community-forums/search-engine-optimization")
                            }
                        });
                    });
                 },
                function(error) { res.json(error) }
              );
        }
    });
})


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
