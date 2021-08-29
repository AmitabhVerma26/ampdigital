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

router.post('/addnewquestion', function(req, res) {
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;
    if(req.isAuthenticated()){
        // res.json('succesfully uploaded the image!');
        lmsForumfilecount.findOne({id: 1}, function(err, doc){
            lmsModules.findOne({_id: safeObjectId(req.body.moduleid)}, function(err, module){
                if(err){
                    res.json(err);
                }
                if(module){
                    if(req.files && !(Object.keys(req.files).length === 0 && req.files.constructor === Object)){
                        var bucketParams = { Bucket: 'ampdigital' };
                        s3.createBucket(bucketParams);
                        var s3Bucket = new aws.S3({ params: { Bucket: 'ampdigital' } });
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
                                        forumcomment.find({}, null, {sort: {id: -1}}, function (err, response) {
                                            if(err){
                                                res.json(err);
                                            }
                                            if(response){
                                                var count = response[0]["id"];
                                                var item = {};
                                                item.id = (count+1);
                                                item.idcount = (count+1);
                                                item.storyid = null;
                                                item.upvoters = [];
                                                item.modulename = req.body.modulename;
                                                item.moduleid = req.body.moduleid;
                                                item.content = req.body.content? req.body.content: "";
                                                item.created = new Date();
                                                item.created_by_current_user = false;
                                                item.modified = new Date();
                                                item.rootid= req.body.rootid?req.body.rootid: null;
                                                item.parent= req.body.parent?req.body.parent: "";
                                                item.profile_picture_url = "https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png";
                                                item.upvote_count = 0;
                                                item.user_has_upvoted = false;
                                                item.email = req.user.email;
                                                item.attachment_url = url;
                                                item.fullname = req.user.local.name + " " + (req.user.local.lastname?req.user.local.lastname: "")
                                                if(req.body.rootid){
                                                    forumcomment.findOne({"id": parseInt(req.body.rootid)}, function(err, doc){
                                                        if(doc){
                                                            var setData = {}
                                                            if(doc.email == item.email){
                                                                setData = {answered: true, replies: doc.replies+1}
                                                            }
                                                            else{
                                                                setData = {answered: true, replies: doc.replies+1}
                                                            }
                                                            forumcomment.update({"id": parseInt(req.body.rootid)}, {$set: setData}, function(err, count){
                                                                forumcomment.update({ "created": item.created} ,{ "$set": item }, { upsert: true }, function (err, response) {
                                                                    if(err){
                                                                        res.json(err);
                                                                    }
                                                                    if(response){
                                                                        response.id = item.id;
                                                                        var url = item.content.replace(/(([^\s]+\s\s*){14})(.*)/,"$1…")
                                                                        url = url.replace(/[^a-zA-Z0-9! ]+/g, "").replace(/\s+/g, '-').toLowerCase();
                                                                        var url = "https://www.ampdigital.co/digital-marketing-community/post/"+url + "-" + item.id;
                                
                                                                        var html = `Hi,
                                                                                    <br><br>
                                                                                    New reply on the forum question from ${item.fullname} on the module ${item.modulename}.
                                                                                    <br><br>
                                                                                    Click to <a target="_blank" href="${url}">view/reply</a> to the same
                                                                                    <br><br>
                                                                                    regards,
                                                                                    <br>
                                                                                    <table width="351" cellspacing="0" cellpadding="0" border="0"> <tr> <td style="text-align:left;padding-bottom:10px"><a style="display:inline-block" href="https://www.ampdigital.co"><img style="border:none;" width="150" src="https://s1g.s3.amazonaws.com/36321c48a6698bd331dca74d7497797b.jpeg"></a></td> </tr> <tr> <td style="border-top:solid #000000 2px;" height="12"></td> </tr> <tr> <td style="vertical-align: top; text-align:left;color:#000000;font-size:12px;font-family:helvetica, arial;; text-align:left"> <span> </span> <br> <span style="font:12px helvetica, arial;">Email:&nbsp;<a href="mailto:amitabh@ampdigital.co" style="color:#3388cc;text-decoration:none;">amitabh@ampdigital.co</a></span> <br><br> <span style="margin-right:5px;color:#000000;font-size:12px;font-family:helvetica, arial">Registered Address: AMP Digital</span> 403, Sovereign 1, Vatika City, Sohna Road,, Gurugram, Haryana, 122018, India<br><br> <table cellpadding="0" cellpadding="0" border="0"><tr><td style="padding-right:5px"><a href="https://facebook.com/https://www.facebook.com/AMPDigitalNet/" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/23f7b48395f8c4e25e64a2c22e9ae190.png" alt="Facebook" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://twitter.com/https://twitter.com/amitabh26" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3949237f892004c237021ac9e3182b1d.png" alt="Twitter" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://linkedin.com/in/https://in.linkedin.com/company/ads4growth?trk=public_profile_topcard_current_company" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/dcb46c3e562be637d99ea87f73f929cb.png" alt="LinkedIn" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://youtube.com/https://www.youtube.com/channel/UCMOBtxDam_55DCnmKJc8eWQ" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3b2cb9ec595ab5d3784b2343d5448cd9.png" alt="YouTube" style="border:none;"></a></td></tr></table><a href="https://www.ampdigital.co" style="text-decoration:none;color:#3388cc;">www.ampdigital.co</a> </td> </tr> </table> <table width="351" cellspacing="0" cellpadding="0" border="0" style="margin-top:10px"> <tr> <td style="text-align:left;color:#aaaaaa;font-size:10px;font-family:helvetica, arial;"><p>AMP&nbsp;Digital is a Google Partner Company</p></td> </tr> </table> `;
                                    
                                    
                                                                        var options = {
                                                                            from: 'ampdigital.co <amitabh@ads4growth.com>',
                                                                            to: [doc.email, "amitabh@ads4growth.com"],
                                                                            subject: `New Reply to Forum Question on module ${item.modulename}`,
                                                                            content: '<html><head></head><body>' + html + '</body></html>'
                                                                        };
                                    
                                                                        sesMail.sendEmail(options, function (err, data) {
                                                                            // TODO sth....
                                                                            if (err) {
                                                                                console.log(err);
                                                                            }
                                                                            console.log(data);
                                                                            res.redirect(req.baseUrl+req.body.url)
                                                                        });
                                                                    }
                                                                });
                                                            })
                                                        }
                                                    })
                                                }
                                                else{
                                                    forumcomment.update({ "created": item.created} ,{ "$set": item }, { upsert: true }, function (err, response) {
                                                        if(err){
                                                            res.json(err);
                                                        }
                                                        if(response){
                                                            response.id = item.id;
                                                            var url = item.content.replace(/(([^\s]+\s\s*){14})(.*)/,"$1…")
                                                            url = url.replace(/[^a-zA-Z0-9! ]+/g, "").replace(/\s+/g, '-').toLowerCase();
                                                            var url = "https://www.ampdigital.co/digital-marketing-community/post/"+url + "-" + item.id;
                    
                                                            if(item.parent==""){
                                                                var html = `Hi Team,
                                                                        <br><br>
                                                                        You have a new forum question (question: ${req.body.content}) from ${item.fullname} on the module ${item.modulename}.
                                                                        <br><br>
                                                                        Please <a target="_blank" href="${url}">reply</a> to the same
                                                                        <br><br>
                                                                        regards,
                                                                        <br>
                                                                        <table width="351" cellspacing="0" cellpadding="0" border="0"> <tr> <td style="text-align:left;padding-bottom:10px"><a style="display:inline-block" href="https://www.ampdigital.co"><img style="border:none;" width="150" src="https://s1g.s3.amazonaws.com/36321c48a6698bd331dca74d7497797b.jpeg"></a></td> </tr> <tr> <td style="border-top:solid #000000 2px;" height="12"></td> </tr> <tr> <td style="vertical-align: top; text-align:left;color:#000000;font-size:12px;font-family:helvetica, arial;; text-align:left"> <span> </span> <br> <span style="font:12px helvetica, arial;">Email:&nbsp;<a href="mailto:amitabh@ampdigital.co" style="color:#3388cc;text-decoration:none;">amitabh@ampdigital.co</a></span> <br><br> <span style="margin-right:5px;color:#000000;font-size:12px;font-family:helvetica, arial">Registered Address: AMP Digital</span> 403, Sovereign 1, Vatika City, Sohna Road,, Gurugram, Haryana, 122018, India<br><br> <table cellpadding="0" cellpadding="0" border="0"><tr><td style="padding-right:5px"><a href="https://facebook.com/https://www.facebook.com/AMPDigitalNet/" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/23f7b48395f8c4e25e64a2c22e9ae190.png" alt="Facebook" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://twitter.com/https://twitter.com/amitabh26" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3949237f892004c237021ac9e3182b1d.png" alt="Twitter" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://linkedin.com/in/https://in.linkedin.com/company/ads4growth?trk=public_profile_topcard_current_company" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/dcb46c3e562be637d99ea87f73f929cb.png" alt="LinkedIn" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://youtube.com/https://www.youtube.com/channel/UCMOBtxDam_55DCnmKJc8eWQ" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3b2cb9ec595ab5d3784b2343d5448cd9.png" alt="YouTube" style="border:none;"></a></td></tr></table><a href="https://www.ampdigital.co" style="text-decoration:none;color:#3388cc;">www.ampdigital.co</a> </td> </tr> </table> <table width="351" cellspacing="0" cellpadding="0" border="0" style="margin-top:10px"> <tr> <td style="text-align:left;color:#aaaaaa;font-size:10px;font-family:helvetica, arial;"><p>AMP&nbsp;Digital is a Google Partner Company</p></td> </tr> </table> `;
                        
                        
                                                                var options = {
                                                                    from: 'ampdigital.co <amitabh@ads4growth.com>',
                                                                    to: "amitabh@ads4growth.com",
                                                                    subject: `New Forum Question on module ${item.modulename}`,
                                                                    content: '<html><head></head><body>' + html + '</body></html>'
                                                                };
                                                            }
                                                            else{
                                                                var html = `Hi,
                                                                            <br><br>
                                                                            New reply on the forum question from ${item.fullname} on the module ${item.modulename}.
                                                                            <br><br>
                                                                            Click to <a target="_blank" href="${url}">view/reply</a> to the same
                                                                            <br><br>
                                                                            regards,
                                                                            <br>
                                                                            <table width="351" cellspacing="0" cellpadding="0" border="0"> <tr> <td style="text-align:left;padding-bottom:10px"><a style="display:inline-block" href="https://www.ampdigital.co"><img style="border:none;" width="150" src="https://s1g.s3.amazonaws.com/36321c48a6698bd331dca74d7497797b.jpeg"></a></td> </tr> <tr> <td style="border-top:solid #000000 2px;" height="12"></td> </tr> <tr> <td style="vertical-align: top; text-align:left;color:#000000;font-size:12px;font-family:helvetica, arial;; text-align:left"> <span> </span> <br> <span style="font:12px helvetica, arial;">Email:&nbsp;<a href="mailto:amitabh@ampdigital.co" style="color:#3388cc;text-decoration:none;">amitabh@ampdigital.co</a></span> <br><br> <span style="margin-right:5px;color:#000000;font-size:12px;font-family:helvetica, arial">Registered Address: AMP Digital</span> 403, Sovereign 1, Vatika City, Sohna Road,, Gurugram, Haryana, 122018, India<br><br> <table cellpadding="0" cellpadding="0" border="0"><tr><td style="padding-right:5px"><a href="https://facebook.com/https://www.facebook.com/AMPDigitalNet/" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/23f7b48395f8c4e25e64a2c22e9ae190.png" alt="Facebook" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://twitter.com/https://twitter.com/amitabh26" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3949237f892004c237021ac9e3182b1d.png" alt="Twitter" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://linkedin.com/in/https://in.linkedin.com/company/ads4growth?trk=public_profile_topcard_current_company" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/dcb46c3e562be637d99ea87f73f929cb.png" alt="LinkedIn" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://youtube.com/https://www.youtube.com/channel/UCMOBtxDam_55DCnmKJc8eWQ" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3b2cb9ec595ab5d3784b2343d5448cd9.png" alt="YouTube" style="border:none;"></a></td></tr></table><a href="https://www.ampdigital.co" style="text-decoration:none;color:#3388cc;">www.ampdigital.co</a> </td> </tr> </table> <table width="351" cellspacing="0" cellpadding="0" border="0" style="margin-top:10px"> <tr> <td style="text-align:left;color:#aaaaaa;font-size:10px;font-family:helvetica, arial;"><p>AMP&nbsp;Digital is a Google Partner Company</p></td> </tr> </table> `;
                            
                            
                                                                var options = {
                                                                    from: 'ampdigital.co <amitabh@ads4growth.com>',
                                                                    to: [item.email, "amitabh@ads4growth.com"],
                                                                    subject: `New Reply to Forum Question on module ${item.modulename}`,
                                                                    content: '<html><head></head><body>' + html + '</body></html>'
                                                                };
                                                            }
                        
                                                            sesMail.sendEmail(options, function (err, data) {
                                                                // TODO sth....
                                                                if (err) {
                                                                    console.log(err);
                                                                }
                                                                console.log(data);
                                                                res.redirect(req.baseUrl+req.body.url)
                                                            });
                                                        }
                                                    });
                                                }
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                    else{ 
                        forumcomment.find({}, null, {sort: {id: -1}}, function (err, response) {
                            if(err){
                                res.json(err);
                            }
                            if(response){
                                var count = response[0]["id"];
                                var item = {};
                                item.id = (count+1);
                                item.idcount = (count+1);
                                item.storyid = null;
                                item.upvoters = [];
                                item.modulename = req.body.modulename;
                                item.moduleid = req.body.moduleid;
                                item.content = req.body.content;
                                item.created = new Date();
                                item.created_by_current_user = false;
                                item.modified = new Date();
                                item.rootid= req.body.rootid?req.body.rootid: null;
                                item.parent= req.body.parent?req.body.parent: "";
                                item.profile_picture_url = "https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png";
                                item.upvote_count = 0;
                                item.user_has_upvoted = false;
                                item.email = req.user.email;
                                item.fullname = req.user.local.name + " " + (req.user.local.lastname?req.user.local.lastname: "")
                                if(req.body.rootid){
                                    forumcomment.findOne({"id": parseInt(req.body.rootid)}, function(err, doc){
                                        if(doc){
                                            var setData = {}
                                            if(doc.email == item.email){
                                                setData = {answered: true, replies: doc.replies+1}
                                            }
                                            else{
                                                setData = {answered: true, replies: doc.replies+1}
                                            }
                                            forumcomment.update({"id": parseInt(req.body.rootid)}, {$set: setData}, function(err, count){
                                                forumcomment.update({ "created": item.created} ,{ "$set": item }, { upsert: true }, function (err, response) {
                                                    if(err){
                                                        res.json(err);
                                                    }
                                                    if(response){
                                                        response.id = item.id;
                                                        var url = item.content.replace(/(([^\s]+\s\s*){14})(.*)/,"$1…")
                                                        url = url.replace(/[^a-zA-Z0-9! ]+/g, "").replace(/\s+/g, '-').toLowerCase();
                                                        var url = "https://www.ampdigital.co/digital-marketing-community/post/"+url + "-" + item.id;
                
                                                        var html = `Hi,
                                                                    <br><br>
                                                                    New reply on the forum question from ${item.fullname} on the module ${item.modulename}.
                                                                    <br><br>
                                                                    Click to <a target="_blank" href="${url}">view/reply</a> to the same
                                                                    <br><br>
                                                                    regards,
                                                                    <br>
                                                                    <table width="351" cellspacing="0" cellpadding="0" border="0"> <tr> <td style="text-align:left;padding-bottom:10px"><a style="display:inline-block" href="https://www.ampdigital.co"><img style="border:none;" width="150" src="https://s1g.s3.amazonaws.com/36321c48a6698bd331dca74d7497797b.jpeg"></a></td> </tr> <tr> <td style="border-top:solid #000000 2px;" height="12"></td> </tr> <tr> <td style="vertical-align: top; text-align:left;color:#000000;font-size:12px;font-family:helvetica, arial;; text-align:left"> <span> </span> <br> <span style="font:12px helvetica, arial;">Email:&nbsp;<a href="mailto:amitabh@ampdigital.co" style="color:#3388cc;text-decoration:none;">amitabh@ampdigital.co</a></span> <br><br> <span style="margin-right:5px;color:#000000;font-size:12px;font-family:helvetica, arial">Registered Address: AMP Digital</span> 403, Sovereign 1, Vatika City, Sohna Road,, Gurugram, Haryana, 122018, India<br><br> <table cellpadding="0" cellpadding="0" border="0"><tr><td style="padding-right:5px"><a href="https://facebook.com/https://www.facebook.com/AMPDigitalNet/" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/23f7b48395f8c4e25e64a2c22e9ae190.png" alt="Facebook" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://twitter.com/https://twitter.com/amitabh26" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3949237f892004c237021ac9e3182b1d.png" alt="Twitter" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://linkedin.com/in/https://in.linkedin.com/company/ads4growth?trk=public_profile_topcard_current_company" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/dcb46c3e562be637d99ea87f73f929cb.png" alt="LinkedIn" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://youtube.com/https://www.youtube.com/channel/UCMOBtxDam_55DCnmKJc8eWQ" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3b2cb9ec595ab5d3784b2343d5448cd9.png" alt="YouTube" style="border:none;"></a></td></tr></table><a href="https://www.ampdigital.co" style="text-decoration:none;color:#3388cc;">www.ampdigital.co</a> </td> </tr> </table> <table width="351" cellspacing="0" cellpadding="0" border="0" style="margin-top:10px"> <tr> <td style="text-align:left;color:#aaaaaa;font-size:10px;font-family:helvetica, arial;"><p>AMP&nbsp;Digital is a Google Partner Company</p></td> </tr> </table> `;
                    
                    
                                                        var options = {
                                                            from: 'ampdigital.co <amitabh@ads4growth.com>',
                                                            to: [doc.email, "amitabh@ads4growth.com"],
                                                            subject: `New Reply to Forum Question on module ${item.modulename}`,
                                                            content: '<html><head></head><body>' + html + '</body></html>'
                                                        };
                    
                                                        sesMail.sendEmail(options, function (err, data) {
                                                            // TODO sth....
                                                            if (err) {
                                                                console.log(err);
                                                            }
                                                            console.log(data);
                                                            res.redirect(req.baseUrl+req.body.url)
                                                        });
                                                    }
                                                });
                                            })
                                        }
                                    })
                                }
                                else{
                                    forumcomment.update({ "created": item.created} ,{ "$set": item }, { upsert: true }, function (err, response) {
                                        if(err){
                                            res.json(err);
                                        }
                                        if(response){
                                            response.id = item.id;
                                            var url = item.content.replace(/(([^\s]+\s\s*){14})(.*)/,"$1…")
                                            url = url.replace(/[^a-zA-Z0-9! ]+/g, "").replace(/\s+/g, '-').toLowerCase();
                                            var url = "https://www.ampdigital.co/digital-marketing-community/post/"+url + "-" + item.id;
    
                                            if(item.parent==""){
                                                var html = `Hi Team,
                                                        <br><br>
                                                        You have a new forum question (question: ${req.body.content}) from ${item.fullname} on the module ${item.modulename}.
                                                        <br><br>
                                                        Please <a target="_blank" href="${url}">reply</a> to the same
                                                        <br><br>
                                                        regards,
                                                        <br>
                                                        <table width="351" cellspacing="0" cellpadding="0" border="0"> <tr> <td style="text-align:left;padding-bottom:10px"><a style="display:inline-block" href="https://www.ampdigital.co"><img style="border:none;" width="150" src="https://s1g.s3.amazonaws.com/36321c48a6698bd331dca74d7497797b.jpeg"></a></td> </tr> <tr> <td style="border-top:solid #000000 2px;" height="12"></td> </tr> <tr> <td style="vertical-align: top; text-align:left;color:#000000;font-size:12px;font-family:helvetica, arial;; text-align:left"> <span> </span> <br> <span style="font:12px helvetica, arial;">Email:&nbsp;<a href="mailto:amitabh@ampdigital.co" style="color:#3388cc;text-decoration:none;">amitabh@ampdigital.co</a></span> <br><br> <span style="margin-right:5px;color:#000000;font-size:12px;font-family:helvetica, arial">Registered Address: AMP Digital</span> 403, Sovereign 1, Vatika City, Sohna Road,, Gurugram, Haryana, 122018, India<br><br> <table cellpadding="0" cellpadding="0" border="0"><tr><td style="padding-right:5px"><a href="https://facebook.com/https://www.facebook.com/AMPDigitalNet/" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/23f7b48395f8c4e25e64a2c22e9ae190.png" alt="Facebook" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://twitter.com/https://twitter.com/amitabh26" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3949237f892004c237021ac9e3182b1d.png" alt="Twitter" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://linkedin.com/in/https://in.linkedin.com/company/ads4growth?trk=public_profile_topcard_current_company" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/dcb46c3e562be637d99ea87f73f929cb.png" alt="LinkedIn" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://youtube.com/https://www.youtube.com/channel/UCMOBtxDam_55DCnmKJc8eWQ" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3b2cb9ec595ab5d3784b2343d5448cd9.png" alt="YouTube" style="border:none;"></a></td></tr></table><a href="https://www.ampdigital.co" style="text-decoration:none;color:#3388cc;">www.ampdigital.co</a> </td> </tr> </table> <table width="351" cellspacing="0" cellpadding="0" border="0" style="margin-top:10px"> <tr> <td style="text-align:left;color:#aaaaaa;font-size:10px;font-family:helvetica, arial;"><p>AMP&nbsp;Digital is a Google Partner Company</p></td> </tr> </table> `;
        
        
                                                var options = {
                                                    from: 'ampdigital.co <amitabh@ads4growth.com>',
                                                    to: "amitabh@ads4growth.com",
                                                    subject: `New Forum Question on module ${item.modulename}`,
                                                    content: '<html><head></head><body>' + html + '</body></html>'
                                                };
                                            }
                                            else{
                                                var html = `Hi,
                                                            <br><br>
                                                            New reply on the forum question from ${item.fullname} on the module ${item.modulename}.
                                                            <br><br>
                                                            Click to <a target="_blank" href="${url}">view/reply</a> to the same
                                                            <br><br>
                                                            regards,
                                                            <br>
                                                            <table width="351" cellspacing="0" cellpadding="0" border="0"> <tr> <td style="text-align:left;padding-bottom:10px"><a style="display:inline-block" href="https://www.ampdigital.co"><img style="border:none;" width="150" src="https://s1g.s3.amazonaws.com/36321c48a6698bd331dca74d7497797b.jpeg"></a></td> </tr> <tr> <td style="border-top:solid #000000 2px;" height="12"></td> </tr> <tr> <td style="vertical-align: top; text-align:left;color:#000000;font-size:12px;font-family:helvetica, arial;; text-align:left"> <span> </span> <br> <span style="font:12px helvetica, arial;">Email:&nbsp;<a href="mailto:amitabh@ampdigital.co" style="color:#3388cc;text-decoration:none;">amitabh@ampdigital.co</a></span> <br><br> <span style="margin-right:5px;color:#000000;font-size:12px;font-family:helvetica, arial">Registered Address: AMP Digital</span> 403, Sovereign 1, Vatika City, Sohna Road,, Gurugram, Haryana, 122018, India<br><br> <table cellpadding="0" cellpadding="0" border="0"><tr><td style="padding-right:5px"><a href="https://facebook.com/https://www.facebook.com/AMPDigitalNet/" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/23f7b48395f8c4e25e64a2c22e9ae190.png" alt="Facebook" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://twitter.com/https://twitter.com/amitabh26" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3949237f892004c237021ac9e3182b1d.png" alt="Twitter" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://linkedin.com/in/https://in.linkedin.com/company/ads4growth?trk=public_profile_topcard_current_company" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/dcb46c3e562be637d99ea87f73f929cb.png" alt="LinkedIn" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://youtube.com/https://www.youtube.com/channel/UCMOBtxDam_55DCnmKJc8eWQ" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3b2cb9ec595ab5d3784b2343d5448cd9.png" alt="YouTube" style="border:none;"></a></td></tr></table><a href="https://www.ampdigital.co" style="text-decoration:none;color:#3388cc;">www.ampdigital.co</a> </td> </tr> </table> <table width="351" cellspacing="0" cellpadding="0" border="0" style="margin-top:10px"> <tr> <td style="text-align:left;color:#aaaaaa;font-size:10px;font-family:helvetica, arial;"><p>AMP&nbsp;Digital is a Google Partner Company</p></td> </tr> </table> `;
            
            
                                                var options = {
                                                    from: 'ampdigital.co <amitabh@ads4growth.com>',
                                                    to: [item.email, "amitabh@ads4growth.com"],
                                                    subject: `New Reply to Forum Question on module ${item.modulename}`,
                                                    content: '<html><head></head><body>' + html + '</body></html>'
                                                };
                                            }
        
                                            sesMail.sendEmail(options, function (err, data) {
                                                // TODO sth....
                                                if (err) {
                                                    console.log(err);
                                                }
                                                console.log(data);
                                                res.redirect(req.baseUrl+req.body.url)
                                            });
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
                else{
                    res.json(-1);
                }
            })
        })
    }
    else{
        req.session.returnTo = req.body.url;
        res.redirect("/auth");
    }
});

router.get('/:moduleid', myLogger, function (req, res, next) {
    const { ObjectId } = require('mongodb'); // or ObjectID
    console.log(req.baseUrl+req.path);
    req.session.returnTo = req.baseUrl+req.path;
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

router.get('/post/:postid', myLogger, function (req, res, next) {
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;
    var postid = req.params.postid;
    var idArray = postid.split("-");
    var id = null;
    req.session.returnTo = req.baseUrl + req.path;
    if(typeof idArray!=="undefined" && idArray && idArray.length>0){
        id=idArray[idArray.length-1];
        var id = parseInt(id);
        var queryString = {"id": id};
        forumcomment.findOne(queryString, function (err, post) {
            if(post){
                forumcomment.find({ $or: [ { "parent": id }, { "rootid": id } ] }, null, { sort: { created: 1 } }, function (err, replies) {
                    var parent = ""
                    if(replies.length>0){
                        parent = replies[replies.length-1]["id"];
                    }
                    lmsModules.findOne({ _id: safeObjectId(post.moduleid)}, function (err, module) {
                        if (req.isAuthenticated()) {
                            res.render('community/post', { url: req.url, parent: parent, module: module, replies:replies, fullname: getusername(req.user) + " " + (req.user.local.lastname?req.user.local.lastname: ""), post: post, moment: moment, moment: moment, email: req.user.email, userid: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, user: req.user, name: getusername(req.user), notifications: req.user.notifications });
                        }
                        else {
                            res.render('community/post', { url: req.url, parent: parent, module: module, replies:replies, userid: null, fullname: null, name: null, post: post, moment: moment, title: 'Express' });
                        }
                    });
                });
            }
            else{
                res.json(req.url)
                // res.redirect("/")
            }
        });
    }
    else{
        res.json(req.url)
        // res.redirect("/")
    }
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
