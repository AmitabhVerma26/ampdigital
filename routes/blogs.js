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

/* GET blogs page. */
router.get('/', myLogger, function (req, res, next) {
    req.session.returnTo = req.path;
    category.find({ 'deleted': { $ne: true } }, function (err, categories) {
        let blogQuery = { deleted: { $ne: "true" }, "approved": { $ne: false } };
        if(req.query.category){
            if(req.query.category == 'Other'){
                blogQuery.categories = {$exists: false}
            }
            else{
                blogQuery.categories = req.query.category
            }
        }
        if(req.query.text){
            blogQuery.title = {$regex: req.query.text,  $options: "i"}, 
            blogQuery.overview = {$regex: req.query.text, $options: "i"},
            blogQuery.content = {$regex: req.query.text,  $options: "i"}
        }
        blog.find(blogQuery, null, { sort: { date: -1 }, skip: 0, limit: 10 }, function (err, blogs) {
            if (req.isAuthenticated()) {
                res.render('blogs', { text: req.query.text ? req.query.text : "",  category: req.query.category ? req.query.category: null, moment: moment, title: 'Express', categories: categories, blogs: blogs, moment: moment, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
            }
            else {
                res.render('blogs', { text: req.query.text ? req.query.text : "", category: req.query.category ? req.query.category: null, moment: moment, title: 'Express', categories: categories, blogs: blogs, moment: moment });
            }
        });
    });
});

// Create a new blog
router.post('/', function (req, res, next) {
    // res.json(Buffer.from(req.body.content).toString('base64'));
    var blog2 = new blog({
        title: req.body.title,
        overview: req.body.overview,
        author: req.body.author,
        date: new Date()
        // content: Buffer.from(req.body.content).toString('base64')
    });
    blog2.save(function (err, results) {
        if (err) {
            res.json(err);
        }
        else {
            res.redirect('/blogs/manage');
        }
    });
});

router.get('/recommendedblogs', function(req, res, next) {
    if(Array.isArray(req.query.categories)){
        blog.find({ deleted: { $ne: true }, categories: {$in: req.query.categories}, blogurl: {$ne: req.query.blogurl}}, null, {sort: {date: -1}, limit:4}, function (err, recommendedfeeds) {
            res.json({recommendedfeeds});
        });
    }
    else{
        blog.find({ deleted: { $ne: true }, blogurl: {$ne: req.query.blogurl}}, null, {sort: {date: -1}, limit:4}, function (err, recommendedfeeds) {
            res.json({recommendedfeeds});
        });
    }
    
});

router.get('/recommended', function(req, res, next) {
    let curId = req.query.id
    blog.findOne({"deleted": { $ne: true }, "approved": { $ne: false }, _id: {$lt: curId}}, null, {sort: {_id: -1}, limit:1}, function (err, prevdoc) {
        blog.findOne({"deleted": { $ne: true }, "approved": { $ne: false }, _id: {$gt: curId}}, null, {
            sort: {_id: 1},
            limit: 1
        }, function (err, nextdoc) {
            res.json({nextdoc, prevdoc});
        });
    });
});

router.get('/getblogs', myLogger, function (req, res, next) {
    req.session.returnTo = req.path;
    blog.aggregate([
        {
            $match: { "deleted": { $ne: true } }
        },
        {
            $group: {
                _id: { category: "$category" },
                count: { $sum: 1 },
            }
        }
    ], function (err, categories) {
        let q = { deleted: { $ne: "true" } };
        if(req.query.category){
            q.categories = req.query.category
        }
        blog.find(q, null, { sort: { date: -1 }, skip: 9*(parseInt(req.query.count)), limit: 10 }, function (err, blogs) {
           res.json(blogs);
        });
    });
});

router.post('/blogathon/saveblog', function (req, res) {
    // res.json(req.body)
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
                        var blog2 = new blog({
                            title: req.body.title,
                            content: req.body.content,
                            overview: "",
                            image: url,
                            readers: [],
                            blogathon: true,
                            approved: false,
                            authoremail: req.user.email,
                            author: req.user.local.name + " " + (req.user.local.lastname?req.user.local.lastname: ""),
                            date: new Date()
                        });
                        blog2.save(function (err, results) {
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
                    
                                var html = 'Greetings from AMP Digital,<br>\n' +
                                    '<br>\n' +
                                    'We are pleased to inform you that your entry for Blogathon-1 has been submitted successfully and is under review by the editorial team. You’ll receive an update when your entry is approved. <br>\n' +
                                    '<br>\n' +
                                    'Thank you for participating! Best of luck!<br>\n' +
                                    '<br>' +
                                    '<table width="351" cellspacing="0" cellpadding="0" border="0"> <tr> <td style="text-align:left;padding-bottom:10px"><a style="display:inline-block" href="https://www.ampdigital.co"><img style="border:none;" width="150" src="https://s1g.s3.amazonaws.com/36321c48a6698bd331dca74d7497797b.jpeg"></a></td> </tr> <tr> <td style="border-top:solid #000000 2px;" height="12"></td> </tr> <tr> <td style="vertical-align: top; text-align:left;color:#000000;font-size:12px;font-family:helvetica, arial;; text-align:left"> <span> </span> <br> <span style="font:12px helvetica, arial;">Email:&nbsp;<a href="mailto:amitabh@ampdigital.co" style="color:#3388cc;text-decoration:none;">amitabh@ampdigital.co</a></span> <br><br> <span style="margin-right:5px;color:#000000;font-size:12px;font-family:helvetica, arial">Registered Address: AMP Digital</span> 403, Sovereign 1, Vatika City, Sohna Road,, Gurugram, Haryana, 122018, India<br><br> <table cellpadding="0" cellpadding="0" border="0"><tr><td style="padding-right:5px"><a href="https://facebook.com/https://www.facebook.com/AMPDigitalNet/" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/23f7b48395f8c4e25e64a2c22e9ae190.png" alt="Facebook" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://twitter.com/https://twitter.com/amitabh26" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3949237f892004c237021ac9e3182b1d.png" alt="Twitter" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://linkedin.com/in/https://in.linkedin.com/company/ads4growth?trk=public_profile_topcard_current_company" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/dcb46c3e562be637d99ea87f73f929cb.png" alt="LinkedIn" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://youtube.com/https://www.youtube.com/channel/UCMOBtxDam_55DCnmKJc8eWQ" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3b2cb9ec595ab5d3784b2343d5448cd9.png" alt="YouTube" style="border:none;"></a></td></tr></table><a href="https://www.ampdigital.co" style="text-decoration:none;color:#3388cc;">www.ampdigital.co</a> </td> </tr> </table> <table width="351" cellspacing="0" cellpadding="0" border="0" style="margin-top:10px"> <tr> <td style="text-align:left;color:#aaaaaa;font-size:10px;font-family:helvetica, arial;"><p>AMP&nbsp;Digital is a Google Partner Company</p></td> </tr> </table>';
                                var options = {
                                    from: 'ampdigital.co <amitabh@ads4growth.com>',
                                    to: [req.user.email, "parul@ads4growth.com", "amitabh@ads4growth.com", "Haardikasethi@gmail.com", "siddharth@ads4growth.com"],
                                    subject: 'ampdigital.co: Your article is under review ',
                                    content: '<html><head></head><body>' + html + '</body></html>'
                                };
                    
                                sesMail.sendEmail(options, function (err, data) {
                                    // TODO sth....
                                    console.log(err);
                                    res.json(1);
                                });
                            }
                        });
                    }
                });
            }
        });
    }
});

router.post('/uploadimage', function (req, res, next) {
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
                        blog.update(
                            {
                                _id: moduleid
                            },
                            {
                                $set: { "image": url }
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
        // res.json(imageFile);
    }

});

router.post('/updateinfo', function (req, res) {
    let updateQuery = {};
    updateQuery[req.body.name] = req.body.value
    blog.update(
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

router.put('/updatecategory', function (req, res) {
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;

    blog.update(
        {
            _id: safeObjectId(req.body.id)
        },
        {
            $set: { "categories": req.body['category[]'] }
        },
        function (err, count) {
            if (err) {
                console.log(err);
            }
            else {
                res.json(1);
            }
        });
});

// Delete a Blog
router.delete('/removeblog', function (req, res, next) {
    blog.update(
        {
            _id: req.body.blogid
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

router.put('/approve', function (req, res) {
    var testimonialid = req.body.testimonialid;
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;

    blog.findOne({_id: safeObjectId(testimonialid)}, function (err, blogItem) {
        blog.update(
            {
                _id: safeObjectId(testimonialid)
            },
            {
                $set: { 'approved': req.body.action }
            }
            ,
            function (err, count) {
                if (err) {
                    console.log(err);
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
        
                    var html = 'Greetings from AMP Digital,<br>\n' +
                        '<br>\n' +
                        'We are pleased to inform you that your entry for Blogathon-1 has been approved and is published here (Hyperlink to our blogs section). <br>\n' +
                        '<br>\n' +
                        'You can boost the viewership of your article by sharing it via your socials! <br>\n' +
                        '<br>' +
                        'Good luck!<br>\n' +
                        '<br>' +
                        'Regards,<br>\n' +
                        '<br>' +
                        '<table width="351" cellspacing="0" cellpadding="0" border="0"> <tr> <td style="text-align:left;padding-bottom:10px"><a style="display:inline-block" href="https://www.ampdigital.co"><img style="border:none;" width="150" src="https://s1g.s3.amazonaws.com/36321c48a6698bd331dca74d7497797b.jpeg"></a></td> </tr> <tr> <td style="border-top:solid #000000 2px;" height="12"></td> </tr> <tr> <td style="vertical-align: top; text-align:left;color:#000000;font-size:12px;font-family:helvetica, arial;; text-align:left"> <span> </span> <br> <span style="font:12px helvetica, arial;">Email:&nbsp;<a href="mailto:amitabh@ampdigital.co" style="color:#3388cc;text-decoration:none;">amitabh@ampdigital.co</a></span> <br><br> <span style="margin-right:5px;color:#000000;font-size:12px;font-family:helvetica, arial">Registered Address: AMP Digital</span> 403, Sovereign 1, Vatika City, Sohna Road,, Gurugram, Haryana, 122018, India<br><br> <table cellpadding="0" cellpadding="0" border="0"><tr><td style="padding-right:5px"><a href="https://facebook.com/https://www.facebook.com/AMPDigitalNet/" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/23f7b48395f8c4e25e64a2c22e9ae190.png" alt="Facebook" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://twitter.com/https://twitter.com/amitabh26" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3949237f892004c237021ac9e3182b1d.png" alt="Twitter" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://linkedin.com/in/https://in.linkedin.com/company/ads4growth?trk=public_profile_topcard_current_company" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/dcb46c3e562be637d99ea87f73f929cb.png" alt="LinkedIn" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://youtube.com/https://www.youtube.com/channel/UCMOBtxDam_55DCnmKJc8eWQ" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3b2cb9ec595ab5d3784b2343d5448cd9.png" alt="YouTube" style="border:none;"></a></td></tr></table><a href="https://www.ampdigital.co" style="text-decoration:none;color:#3388cc;">www.ampdigital.co</a> </td> </tr> </table> <table width="351" cellspacing="0" cellpadding="0" border="0" style="margin-top:10px"> <tr> <td style="text-align:left;color:#aaaaaa;font-size:10px;font-family:helvetica, arial;"><p>AMP&nbsp;Digital is a Google Partner Company</p></td> </tr> </table>';
                    var options = {
                        from: 'ampdigital.co <amitabh@ads4growth.com>',
                        to: [blogItem.authoremail, "parul@ads4growth.com", "amitabh@ads4growth.com", "Haardikasethi@gmail.com", "siddharth@ads4growth.com"],
                        subject: 'ampdigital.co: Your article has been published ',
                        content: '<html><head></head><body>' + html + '</body></html>'
                    };
        
                    sesMail.sendEmail(options, function (err, data) {
                        // TODO sth....
                        console.log(err);
                        res.json(count);
                    });
                }
            });
    });
});

/*GET courses page*/
router.get('/categories/manage', isAdmin, myLogger, function (req, res, next) {
    category.find({ 'deleted': { $ne: true } }, function (err, docs) {
        res.render('adminpanel/category', { email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications, docs: docs, moment: moment });

    });
});

router.get('/manage', myLogger, isAdmin, function (req, res, next) {
    lmsCourses.find({ 'deleted': { $ne: 'true' } }, function (err, courses) {
        category.find({ 'deleted': { $ne: true } }, function (err, categories) {
            blog.find({ deleted: { $ne: true } }, function (err, docs) {
                if (req.isAuthenticated()) {
                    res.render('adminpanel/blogs', { courses: courses, categories: categories, docs: docs, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications, docs: docs, moment: moment });
                }
                else {
                    res.render('adminpanel/blogs', { courses: courses, categories: categories, docs: docs, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications, docs: docs, moment: moment });
                }
            });
        });
    });
});

router.get('/datatable', function (req, res, next) {
    /*
   * Script:    DataTables server-side script for NODE and MONGODB
   * Copyright: 2018 - Siddharth Sogani
   */

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * Easy set variables
     */

    /* Array of columns to be displayed in DataTable
     */
    var $aColumns = ['title', 'date', 'overview', 'category', 'image', 'uploadimage', 'content', 'blogurl',  'author', 'tags', 'action'];

    /*
     * Paging
     */
    var $sDisplayStart = 0;
    var $sLength = "";
    if ((req.query.iDisplayStart) && req.query.iDisplayLength != '-1') {
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
        var arr = [{ "title": { $regex: '' + req.query.sSearch + '', '$options': 'i' } }, { "content": { $regex: '' + req.query.sSearch + '', '$options': 'i' } }, { "overview": { $regex: '' + req.query.sSearch + '', '$options': 'i' } }, { "author": { $regex: '' + req.query.sSearch + '', '$options': 'i' } }, { "category": { $regex: '' + req.query.sSearch + '', '$options': 'i' } }, { "tags": { $regex: '' + req.query.sSearch + '', '$options': 'i' } }];
        query.$or = arr;
    }

    /*
   * Ordering
   */
    var sortObject = { 'date': -1 };
    if (req.query.iSortCol_0 && req.query.iSortCol_0 == 0) {
        if (req.query.sSortDir_0 == 'desc') {
            var sortObject = {};
            var stype = 'title';
            var sdir = -1;
            sortObject[stype] = sdir;
        }
        else {
            var sortObject = {};
            var stype = 'title';
            var sdir = 1;
            sortObject[stype] = sdir;
        }

    }
    else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 1) {
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
    else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 2) {
        if (req.query.sSortDir_0 == 'desc') {
            var sortObject = {};
            var stype = 'overview';
            var sdir = -1;
            sortObject[stype] = sdir;
        }
        else {
            var sortObject = {};
            var stype = 'overview';
            var sdir = 1;
            sortObject[stype] = sdir;
        }
    }
    else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 3) {
        if (req.query.sSortDir_0 == 'desc') {
            var sortObject = {};
            var stype = 'blogcategory';
            var sdir = -1;
            sortObject[stype] = sdir;
        }
        else {
            var sortObject = {};
            var stype = 'blogcategory';
            var sdir = 1;
            sortObject[stype] = sdir;
        }
    }
    else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 6) {
        if (req.query.sSortDir_0 == 'desc') {
            var sortObject = {};
            var stype = 'content';
            var sdir = -1;
            sortObject[stype] = sdir;
        }
        else {
            var sortObject = {};
            var stype = 'content';
            var sdir = 1;
            sortObject[stype] = sdir;
        }
    }
    else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 7) {
        if (req.query.sSortDir_0 == 'desc') {
            var sortObject = {};
            var stype = 'blogurl';
            var sdir = -1;
            sortObject[stype] = sdir;
        }
        else {
            var sortObject = {};
            var stype = 'blogurl';
            var sdir = 1;
            sortObject[stype] = sdir;
        }
    }
    else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 8) {
        if (req.query.sSortDir_0 == 'desc') {
            var sortObject = {};
            var stype = 'author';
            var sdir = -1;
            sortObject[stype] = sdir;
        }
        else {
            var sortObject = {};
            var stype = 'author';
            var sdir = 1;
            sortObject[stype] = sdir;
        }
    }
    category.find({ 'deleted': { $ne: true } }, function (err, categorydocs) {
        const categories = categorydocs.map(item=>item.name)
    blog.find(query).skip(parseInt($sDisplayStart)).limit(parseInt($sLength)).sort(sortObject).exec(function (err, docs) {
        blog.count(query, function (err, count) {
            var aaData = [];
            for (let i = 0; i < (docs).length; i++) {
                var $row = [];
                for (var j = 0; j < ($aColumns).length; j++) {
                    if ($aColumns[j] == 'title') {
                        $row.push(`<a class="updatetestimonialname" id="title" data-type="textarea" data-pk="${ docs[i]['_id'] }" data-url="/blogs/updateinfo" data-title="Enter title">${ docs[i]['title'] }</a>`)
                    }
                    else if ($aColumns[j] == 'date') {
                        $row.push(moment(docs[i]['date']).format("DD/MMM/YYYY HH:mm A"));
                    }
                    else if ($aColumns[j] == 'overview') {
                        $row.push(`<a class="updatetestimonialname" id="overview" data-type="textarea" data-pk="${ docs[i]['_id'] }" data-url="/blogs/updateinfo" data-title="Enter overview">${ docs[i]['overview'] }</a>`)
                    }
                    else if ($aColumns[j] == 'category') {
                        var accesscourses = '';
                            for (var h = 0; h < categories.length; h++) {
                                accesscourses = accesscourses + `<option ${docs[i].categories && docs[i].categories.indexOf(categories[h]) > -1 ? "selected" : ""} value="${categories[h]}">${categories[h]}</option>`;
                            }
                            $row.push(`
                            <form data-blogid=${docs[i]['_id']}  class="addblogcategory" action="">
                        <select class="js-example-basic-multiple" name="states[]" multiple="multiple">
                        ${accesscourses}
                        </select>
                        <input type="submit">
                        </form>`);                    
                    }                    
                    else if ($aColumns[j] == 'image') {
                        if(docs[i]['image'] && docs[i]['image'].split('?')){
                            $row.push(`<a href="${docs[i]['image'].split('?')[0]}">Download</a>`)
                        }
                        else{
                            $row.push(`<span class="label label-info"><i>No Image Uploaded</i></span>`)
                        }
                    }
                    else if ($aColumns[j] == 'uploadimage') {
                        $row.push(`<form enctype="multipart/form-data" class="imagesubmitform" action="/blogs/uploadimage" method="POST" target="_blank">
                        <label>
                          <input name="moduleid"  type="hidden" value="${docs[i]['_id']}">
                          Browse <input name="avatar" class="imagetosubmit" type="file" hidden>
                        </label>
                        <button class="btn btn-xs btn-primary imagesubmitformbtn" type="submit">Submit</button>
                      </form>`)
                    }
                    else if ($aColumns[j] == 'content') {
                        $row.push(`<textarea name="jobdescription" placeholder="Enter Blog Content" class="form-control summernote" cols="30" rows="10">${docs[i]['content']}</textarea>
                        <button data-pk="${ docs[i]['_id'] }" class="btn btn-primary summernotesubmit">Submit</button>`)
                    }
                    else if ($aColumns[j] == 'blogurl') {
                        $row.push(`<a class="updatetestimonialname" id="blogurl" data-type="textarea" data-pk="${ docs[i]['_id'] }" data-url="/blogs/updateinfo" data-title="Enter blog url">${ docs[i]['blogurl'] }</a>`)
                    }
                    else if ($aColumns[j] == 'author') {
                        $row.push(`<a class="updatetestimonialname" id="author" data-type="textarea" data-pk="${ docs[i]['_id'] }" data-url="/blogs/updateinfo" data-title="Enter author">${ docs[i]['author'] }</a>`)
                    }
                    else if ($aColumns[j] == 'tags') {
                        $row.push(`<a class="updatetestimonialname" id="tags" data-type="textarea" data-pk="${ docs[i]['_id'] }" data-url="/blogs/updateinfo" data-title="Enter tags">${ docs[i]['tags'] }</a>`)
                    }
                    else {
                        if(docs[i].approved){
                            $row.push(`<td>
                            Approved
                            <a class="removeblog" data-blogid="${docs[i]['_id']}" href=""><i style="color: red;" class="fa fa-trash-o"></i></a></td>
                            
                            `)
                        }
                        else{
                            $row.push(`<td>
                            <a class="approveblog" data-blogid="${docs[i]['_id']}" href=""><i style="color: red;" class="fa fa-check"></i></a></td>
                            <a class="removeblog" data-blogid="${docs[i]['_id']}" href=""><i style="color: red;" class="fa fa-trash-o"></i></a></td>
                            
                            `)
                        }
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
