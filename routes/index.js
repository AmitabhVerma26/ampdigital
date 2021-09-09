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
var simulationtool = require('../models/simulationtool');
var simulatorpoint = require('../models/simulatorpoint');
var simulationppcad = require('../models/simulationppcad');
var lmsBatches = require('../models/batches');
var lmsTopics = require('../models/topics');
var lmsElements = require('../models/elements');
var lmsQuiz = require('../models/quiz');
var lmsUsers = require('../models/user');
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
var teamperson = require('../models/teamperson');
var moment = require('moment');
var aws = require('aws-sdk');
aws.config.update({
    accessKeyId: "AKIAQFXTPLX2CNUSHP5C",
    secretAccessKey: "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",
    "region": "us-west-2"
});
var s3 = new aws.S3();

var awsSesMail = require('aws-ses-mail');

var sesMail = new awsSesMail();
var sesConfig = {
    accessKeyId: "AKIAQFXTPLX2CNUSHP5C",
    secretAccessKey: "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",
    region: 'us-west-2'
};
sesMail.setConfig(sesConfig);

/*GET manage events page*/
router.get('/updatepaymentpurpose', function (req, res, next) {
    payment.update(
        {purpose: "Digital Marketing Course"},
        {
            $set: { 'purpose': "Digital Marketing Training Program" }
        }
        ,
        {multi: true},
        function (err, count) {
            if (err) {
                console.log(err);
            }
            else {
                console.log(count);
            }
        });
});

router.get('/emailtemplate', function (req, res, next) {
    res.render('email');
});

/**
 * Home Page
 */
router.get('/', function (req, res, next) {
    req.session.returnTo = req.path;
    var testimonials = [{ "_id": "5e85bc5441ed9f001409fc6c", "name": " Vivek Arora     ", "testimonial": "I joined this course in October and it’s been an interesting journey. I have seen a lot of growth in my intellect and Understanding the digital Business after going through the course and now, I relate more to the ads which I see on my social media accounts and I truly relate to how this is getting monetized or this is getting targeted. It's been an immense learning experience for me.\n\n", "designation": " VP Discovery Channel", "date": "2020-04-02T10:20:04.143Z", "deleted": false, "__v": 0, "image": "/testimonials/vivek.jpg" }, { "_id": "5e85bf2182b720001486b122", "name": "Rohit Virmani", "testimonial": "Upcoming E-commerce is related to Digital World so I need to draw to grow at a much faster Pace Which can only be achieved through Digital Transformation and This course helps me In achieving my goal. There is no feeling like we're sitting in a classroom and studying instead it's like we are just hanging out around, talking with our friends, discussing latest technology, latest trends over a cup of coffee. \n", "designation": " Entrepreneur, owner, VP Spaces     ", "date": "2020-04-02T10:32:01.977Z", "deleted": false, "__v": 0, "image": "/testimonials/rohit.jpg" }, { "_id": "5e85bfab82b720001486b123", "name": "Abhijay Srivastava ", "testimonial": "Ms. Amitabh ( Lead Instructor) is with the Google background and actually has got his hand in this Business so he is able to take us through the entire Nuances, what is the Micro and Macro thing, how does this digital thing fit in this new age of Marketing. There are case studies, detailed Discussions. If you are really looking to learn Digital marketing, Then this the course for growing Forward.\n", "designation": " AGM Marketing, SquareYards", "date": "2020-04-02T10:34:19.934Z", "deleted": false, "__v": 0, "image": "/testimonials/abhijay.jpg" }, { "_id": "5e85c05c82b720001486b124", "name": "Anshuman Sinha", "testimonial": "Mr. Amitabh has vast experience in this field and he has worked himself with google for a decade and I think so even as a teacher, he comes across as a great companion and guide. I am still connected with him even though the course is over where I take tips from him or try to understand what more can be done besides what we are currently doing.\n\n", "designation": "Associate Director, Flipkart", "date": "2020-04-02T10:37:16.681Z", "deleted": false, "__v": 0, "image": "/testimonials/anshuman.jpg" }, { "_id": "5e85c14e82b720001486b125", "name": "Vishal Dilawari", "testimonial": "During this course itself, I have learned all aspects of Digital marketing like SEO, Google Analytics, social media marketing, and I see myself as a marketing professional in both Traditional and non-traditional marketing.\n", "designation": "Marketing Manager, Better Life, Dubal", "date": "2020-04-02T10:41:18.139Z", "deleted": false, "__v": 0, "image": "/testimonials/Vishal.jpg" }];
    lmsCourses.find({ 'deleted': { $ne: 'true' }, course_live: "Live"}, function (err, courses) {
        if (req.isAuthenticated()) {
            if (req.query.code) {
                res.render('index', { moment: moment, referralcode: req.query.code, courses: courses, testimonials: testimonials, success: '_', title: 'Express', email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
            }
            else {
                res.render('index', { moment: moment,referralcode: "", courses: courses, testimonials: testimonials, success: '_', title: 'Express', email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
            }
        }
        else {
            if (req.query.code) {
                res.render('index', { moment: moment,referralcode: req.query.code, courses: courses, testimonials: testimonials, success: '_', title: 'Express' });
            }
            else {
                res.render('index', { moment: moment,referralcode: "", courses: courses, testimonials: testimonials, success: '_', title: 'Express' });
            }
        }
    });
});


/**
 * Terms of Services
 */
router.get('/termsofservice', function (req, res, next) {
    req.session.returnTo = req.path;
    if (req.isAuthenticated()) {
        res.render('termsandconditions', { title: 'Express', email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
    }
    else {
        res.render('termsandconditions', { title: 'Express' });
    }
});

/**
 * Privacy Policy
 */
router.get('/privacypolicy', function (req, res, next) {
    req.session.returnTo = req.path;
    if (req.isAuthenticated()) {
        res.render('privacypolicy', { title: 'Express', email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
    }
    else {
        res.render('privacypolicy', { title: 'Express' });
    }
});


/**
 * About Us
 */
router.get('/about', function (req, res, next) {
    req.session.returnTo = req.path;
    teamperson.find({}, (err, team)=>{
        if (req.isAuthenticated()) {
            res.render('about', { team: team, title: 'Express', email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
        }
        else {
            res.render('about', { team: team, title: 'Express' });
        }
    })
});

/**
 * Career Counselling
 */
 router.get('/career-counselling', function (req, res, next) {
    req.session.returnTo = req.path;
    if (req.isAuthenticated()) {
        res.render('careercounselling', { title: 'Express', email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
    }
    else {
        res.render('careercounselling', { title: 'Express' });
    }
});

router.get('/sitemap.xml', function (req, res) {
    var d = new Date();
    webinar.find({ deleted: { $ne: "true" } }, null, { sort: { date: -1 } }, function (err, webinars) {
        blog.find({ deleted: { $ne: "true" } }, null, { sort: { date: -1 } }, function (err, blogs) {
            job.find({ deleted: { $ne: "true" }, approved: true }, null, { sort: { date: -1 } }, function (err, jobs) {
                if (blogs) {
                    var root_path = 'https://www.ampdigital.co/';
                    var priority = 0.9;
                    var freq = 'daily';
                    var xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
                    var urls = ['contact', 'courses/digital-marketing-course', 'courses/google-ads-certification-course', 'aboutus', 'webinars', 'blogs', 'courses', 'jobs', 'faqs', 'termsandconditions', 'privacypolicy', 'referrals'];
                    xml += '<url>';
                    xml += '<loc> https://www.ampdigital.co </loc>';
                    xml += '<changefreq>' + freq + '</changefreq>';
                    xml += '<priority>' + 1 + '</priority>';
                    xml += '</url>';
                    for (var i in urls) {
                        xml += '<url>';
                        xml += '<loc>' + root_path + urls[i] + '</loc>';
                        xml += '<changefreq>' + freq + '</changefreq>';
                        xml += '<priority>' + 0.9 + '</priority>';
                        xml += '</url>';
                        i++;
                    }
                    for (var i = 0; i < blogs.length; i++) {
                        var url = 'blog' + '/' + blogs[i]["blogurl"];
                        url = url.replace(/[?=]/g, "");
                        xml += '<url>';
                        xml += '<loc>' + root_path + url + '</loc>';
                        xml += '<changefreq>never</changefreq>';
                        xml += '<priority>' + priority + '</priority>';
                        xml += '</url>';
                    }
                    for (var i = 0; i < webinars.length; i++) {
                        var url = 'webinar' + '/' + webinars[i]["webinarurl"];
                        url = url.replace(/[?=]/g, "");
                        xml += '<url>';
                        xml += '<loc>' + root_path + url + '</loc>';
                        xml += '<changefreq>never</changefreq>';
                        xml += '<priority>' + priority + '</priority>';
                        xml += '</url>';
                    }
                    for (var i = 0; i < jobs.length; i++) {
                        var url = 'jobs' + '/' + jobs[i]['jobtitle'].replace(/\s+/g, '-').toLowerCase() + '-' + jobs[i]['_id'];
                        xml += '<url>';
                        xml += '<loc>' + root_path + url + '</loc>';
                        xml += '<changefreq>never</changefreq>';
                        xml += '<priority>' + priority + '</priority>';
                        xml += '</url>';
                    }
                    xml += '</urlset>';
                    res.header('Content-Type', 'text/xml');
                    res.send(xml);
                }
                else {
                    res.json('error');
                }
            });
        });
    });
});

/**
 * Google Ads Simulator Tool
 */
router.get('/tools/google-ads-simulator', function (req, res, next) {
    req.session.returnTo = req.path;
    simulatorpoint.aggregate([{$group: {
        _id:"$name",                                                                     
        value: { $max: "$totalpoints" } 
    }}, {$sort: {value: -1}}], function (err, leaderboard) {
        if (req.isAuthenticated()) {
            var toolids = [];
            simulatorpoint.find({email: req.user.email}, function(err, docs){
                for(var i = 0; i < docs.length; i++){
                    toolids.push(docs[i]["id"]);
                }
                res.render('simulatorgoogleads', { leaderboard: leaderboard, loggedin: "true", toolids: toolids.join(","), title: 'Express', active: "all", moment: moment, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
            })
        }
        else {
            res.render('simulatorgoogleads', { leaderboard: leaderboard, loggedin: "false", toolids: "", title: 'Express', active: "all", moment: moment });
        }
    })
});

/**
 * Get Image URL
 */
 router.get('/getlinktoimage', function (req, res, next) {
    res.render('getlinktoimage', { title: 'Express' });
});

/**
 * Sign in Page
 */
router.get('/signin', function (req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect(req.session.returnTo);
    }
    else {
        res.render('signin', { signupMessage: req.flash('signupMessage'), title: 'Express' });
    }
});


/**
 * Sign up Page
 */
router.get('/auth', function (req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect(req.session.returnTo);
    }
    else {
        console.log("ahipeaeg");
        console.log(req.session.signupmsg);
        res.render('signup', { signupMessage: req.flash('signupMessage'), title: 'Express' });
    }
});

/* GET blog post page. */
router.get('/blog/:blogurl', function (req, res, next) {
    req.session.returnTo = req.path;
    category.find({ 'deleted': { $ne: true } }, function (err, categories) {
        let blogQuery = { deleted: { $ne: "true" }, "approved": { $ne: false }, blogurl: {$ne: req.params.blogurl} };
        blog.find(blogQuery, null, { sort: { date: -1 }, skip: 0, limit: 3 }, function (err, blogs) {
            blog.findOne({ deleted: { $ne: true }, blogurl: req.params.blogurl }, function (err, blog) {
                if (blog) {
                    comment.find({ blogid: blog._id.toString() }, function (err, comments) {
                        if (req.isAuthenticated()) {
                            res.render('blog', { blogs: blogs, categories: categories, comments: comments, title: 'Express', blog: blog, moment: moment, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
                        }
                        else {
                            res.render('blog', { blogs: blogs, categories: categories, comments: comments, title: 'Express', blog: blog, moment: moment });
                        }
                    });
                }
                else {
                    res.redirect('/blogs')
                }
            });
        });
    });
});

router.post('/getimageurl', function (req, res, next) {
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
                        res.json(url.split('?')[0]);
                    }
                });
            }
        });
    }

});

router.post('/ebook', function (req, res, next) {
    var bookdownloadModel = new bookdownload({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phonenumber: req.body.phonenumber,
        countrycode: req.body.countrycode,
        email: req.body.email,
        date: new Date()
    });
    if(req.body.firstname == 'James'){
        res.json(1);
        return;
    }
    bookdownloadModel.save(function (err, results) {
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

            var html = 
                `<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;max-width:600px!important">
                <tbody><tr>
                    <td valign="top" style="background:transparent none no-repeat center/cover;background-color:transparent;background-image:none;background-repeat:no-repeat;background-position:center;background-size:cover;border-top:0;border-bottom:0;padding-top:0;padding-bottom:0"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse">
<tbody>
<tr>
<td valign="top" style="padding-top:9px">



<table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%;min-width:100%;border-collapse:collapse" width="100%">
<tbody><tr>

<td valign="top" style="padding-top:0;padding-right:18px;padding-bottom:9px;padding-left:18px;word-break:break-word;color:#757575;font-family:Helvetica;font-size:16px;line-height:150%;text-align:left">

    <span style="color:#000000">Hi ${req.body.firstname},<br>
<br>
Your ebook by McKinsey on "<b>Reimagining Marketing</b>” is ready for download.<br>
<br>
Please click on the download button below to get the ebook .&nbsp;</span><br>
&nbsp;
</td>
</tr>
</tbody></table>



</td>
</tr>
</tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse">
<tbody>
<tr>
<td valign="top" style="padding:9px">
<table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" style="min-width:100%;border-collapse:collapse">
<tbody><tr>
    <td valign="top" style="padding-right:9px;padding-left:9px;padding-top:0;padding-bottom:0;text-align:center">


                <img align="center" alt="" src="https://ci5.googleusercontent.com/proxy/zs7g29zie0kOEwntKVFjAO9mLxK2UmWdN1aOPWycVDEZi2CHjhy0HZFYYSD0swoukhw1U-uB37UZDHNFc6vQ34KbdFc4-eZQL5i8C2OO1GOqPHfgWnZzlS3ACmQbAGlwV2k3BAJr5jsEkZKGXiwRRs1pVhqtxA=s0-d-e1-ft#https://mcusercontent.com/21860ab549ae02eeb610e2aa6/images/90a62ae3-ed42-4daf-becd-64e6a37b55aa.jpg" width="564" style="max-width:1323px;padding-bottom:0;display:inline!important;vertical-align:bottom;border:0;height:auto;outline:none;text-decoration:none" class="CToWUd a6T" tabindex="0"><div class="a6S" dir="ltr" style="opacity: 0.01; left: 736.781px; top: 917px;"><div id=":w3" class="T-I J-J5-Ji aQv T-I-ax7 L3 a5q" role="button" tabindex="0" aria-label="Download attachment " data-tooltip-class="a1V" data-tooltip="Download"><div class="aSK J-J5-Ji aYr"></div></div></div>


    </td>
</tr>
</tbody></table>
</td>
</tr>
</tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse">
<tbody>
<tr>
<td style="padding-top:0;padding-right:18px;padding-bottom:18px;padding-left:18px" valign="top" align="center">
<table border="0" cellpadding="0" cellspacing="0" style="border-collapse:separate!important;border:1px solid;border-radius:4px;background-color:#2baadf">
<tbody>
<tr>
    <td align="center" valign="middle" style="font-family:&quot;Helvetica Neue&quot;,Helvetica,Arial,Verdana,sans-serif;font-size:16px;padding:18px">
        <a title="Download Now" href="https://online.us18.list-manage.com/track/click?u=21860ab549ae02eeb610e2aa6&amp;id=3153053b54&amp;e=f0c8241cf6" style="font-weight:bold;letter-spacing:normal;line-height:100%;text-align:center;text-decoration:none;color:#ffffff;display:block" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://online.us18.list-manage.com/track/click?u%3D21860ab549ae02eeb610e2aa6%26id%3D3153053b54%26e%3Df0c8241cf6&amp;source=gmail&amp;ust=1597816946975000&amp;usg=AFQjCNH4Nu_NH7QFbkRcvoMnfIcJ5Kd8mw">Download Now</a>
    </td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse">
<tbody>
<tr>
<td valign="top" style="padding-top:9px">



<table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%;min-width:100%;border-collapse:collapse" width="100%">
<tbody><tr>

<td valign="top" style="padding-top:0;padding-right:18px;padding-bottom:9px;padding-left:18px;word-break:break-word;color:#757575;font-family:Helvetica;font-size:16px;line-height:150%;text-align:left">

    <h1 style="display:block;margin:0;padding:0;color:#222222;font-family:Helvetica;font-size:40px;font-style:normal;font-weight:bold;line-height:150%;letter-spacing:normal;text-align:center"><span style="font-size:19px">Do check our&nbsp;<a href="https://online.us18.list-manage.com/track/click?u=21860ab549ae02eeb610e2aa6&amp;id=6bc0831ecb&amp;e=f0c8241cf6" style="color:#007c89;font-weight:normal;text-decoration:underline" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://online.us18.list-manage.com/track/click?u%3D21860ab549ae02eeb610e2aa6%26id%3D6bc0831ecb%26e%3Df0c8241cf6&amp;source=gmail&amp;ust=1597816946975000&amp;usg=AFQjCNHC6A_RqKgLJuBfS-fZHSB2QZD-zw">training programs</a>,&nbsp;<a href="https://online.us18.list-manage.com/track/click?u=21860ab549ae02eeb610e2aa6&amp;id=6a681c5a74&amp;e=f0c8241cf6" style="color:#007c89;font-weight:normal;text-decoration:underline" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://online.us18.list-manage.com/track/click?u%3D21860ab549ae02eeb610e2aa6%26id%3D6a681c5a74%26e%3Df0c8241cf6&amp;source=gmail&amp;ust=1597816946975000&amp;usg=AFQjCNFqJuxYXvojuipNCUQlK6yPxUXtqw">blogs</a>, and&nbsp;<a href="https://online.us18.list-manage.com/track/click?u=21860ab549ae02eeb610e2aa6&amp;id=fd147aeacd&amp;e=f0c8241cf6" style="color:#007c89;font-weight:normal;text-decoration:underline" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://online.us18.list-manage.com/track/click?u%3D21860ab549ae02eeb610e2aa6%26id%3Dfd147aeacd%26e%3Df0c8241cf6&amp;source=gmail&amp;ust=1597816946975000&amp;usg=AFQjCNHraIeFOW5-dj1QtcAAPxL-gMvCCQ">webinars</a></span></h1>

</td>
</tr>
</tbody></table>



</td>
</tr>
</tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse">
<tbody>
<tr>
<td valign="top" style="padding-top:9px">



<table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%;min-width:100%;border-collapse:collapse" width="100%">
<tbody><tr>

<td valign="top" style="padding-top:0;padding-right:18px;padding-bottom:9px;padding-left:18px;word-break:break-word;color:#757575;font-family:Helvetica;font-size:16px;line-height:150%;text-align:left">

    <span style="color:#000000">We at <b>AMP Digital</b> offer <b>Digital Marketing</b> courses and training programs for students and working professionals. You can get world class certifications and jobs and internships.</span>
</td>
</tr>
</tbody></table>



</td>
</tr>
</tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse">
<tbody>
<tr>
<td style="padding-top:0;padding-right:18px;padding-bottom:18px;padding-left:18px" valign="top" align="center">
<table border="0" cellpadding="0" cellspacing="0" style="border-collapse:separate!important;border:1px solid;border-radius:3px;background-color:#009fc7">
<tbody>
<tr>
    <td align="center" valign="middle" style="font-family:Helvetica;font-size:18px;padding:18px">
        <a title="Visit Now" href="https://online.us18.list-manage.com/track/click?u=21860ab549ae02eeb610e2aa6&amp;id=87125b9d36&amp;e=f0c8241cf6" style="font-weight:bold;letter-spacing:-0.5px;line-height:100%;text-align:center;text-decoration:none;color:#ffffff;display:block" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://online.us18.list-manage.com/track/click?u%3D21860ab549ae02eeb610e2aa6%26id%3D87125b9d36%26e%3Df0c8241cf6&amp;source=gmail&amp;ust=1597816946975000&amp;usg=AFQjCNEAxqIkGUNMdqBvWo_7KJ1XW08VzA">Visit Now</a>
    </td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
<br><table width="351" cellspacing="0" cellpadding="0" border="0"> <tr> <td style="text-align:left;padding-bottom:10px"><a style="display:inline-block" href="https://www.ampdigital.co"><img style="border:none;" width="150" src="https://s1g.s3.amazonaws.com/36321c48a6698bd331dca74d7497797b.jpeg"></a></td> </tr> <tr> <td style="border-top:solid #000000 2px;" height="12"></td> </tr> <tr> <td style="vertical-align: top; text-align:left;color:#000000;font-size:12px;font-family:helvetica, arial;; text-align:left"> <span> </span> <br> <span style="font:12px helvetica, arial;">Email:&nbsp;<a href="mailto:amitabh@ampdigital.co" style="color:#3388cc;text-decoration:none;">amitabh@ampdigital.co</a></span> <br><br> <span style="margin-right:5px;color:#000000;font-size:12px;font-family:helvetica, arial">Registered Address: AMP Digital</span> 403, Sovereign 1, Vatika City, Sohna Road,, Gurugram, Haryana, 122018, India<br><br> <table cellpadding="0" cellpadding="0" border="0"><tr><td style="padding-right:5px"><a href="https://facebook.com/https://www.facebook.com/AMPDigitalNet/" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/23f7b48395f8c4e25e64a2c22e9ae190.png" alt="Facebook" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://twitter.com/https://twitter.com/amitabh26" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3949237f892004c237021ac9e3182b1d.png" alt="Twitter" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://linkedin.com/in/https://in.linkedin.com/company/ads4growth?trk=public_profile_topcard_current_company" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/dcb46c3e562be637d99ea87f73f929cb.png" alt="LinkedIn" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://youtube.com/https://www.youtube.com/channel/UCMOBtxDam_55DCnmKJc8eWQ" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3b2cb9ec595ab5d3784b2343d5448cd9.png" alt="YouTube" style="border:none;"></a></td></tr></table><a href="https://www.ampdigital.co" style="text-decoration:none;color:#3388cc;">www.ampdigital.co</a> </td> </tr> </table> <table width="351" cellspacing="0" cellpadding="0" border="0" style="margin-top:10px"> <tr> <td style="text-align:left;color:#aaaaaa;font-size:10px;font-family:helvetica, arial;"><p>AMP&nbsp;Digital is a Google Partner Company</p></td> </tr> </table>
</table></td>
                </tr>
            </tbody></table>`
            var options = {
                from: 'ampdigital.co <amitabh@ads4growth.com>',
                to: req.body.email,
                subject: 'ampdigital.co: Your book is ready to download',
                content: '<html><head></head><body>' + html + '</body></html>'
            };

            var Sendy = require('sendy-api'),
            sendy = new Sendy('http://sendy.ampdigital.co/', 'tyYabXqRCZ8TiZho0xtJ');


            sesMail.sendEmail(options, function (err, data) {
                // TODO sth....
                console.log(err);
                sendy.subscribe({ api_key: 'tyYabXqRCZ8TiZho0xtJ', name: req.body.firstname+" "+req.body.lastname, email: req.body.email, list_id: 'ooYQ0ziAX892wi1brSgIj1uA' }, function (err, result) {
                    sendy.subscribe({ api_key: 'tyYabXqRCZ8TiZho0xtJ', name: req.body.firstname+" "+req.body.lastname, email: req.body.email, list_id: '763VYAUcr3YYkNmJQKawPiXg' }, function (err, result) {
                        res.json(1);
                    });
                });
                
            });
        }
    });
});



router.get('/registration/activate/profile/user/:email/:password/:sessionreturnTo',  async (req, res, next)=>{
    let devicetype = "DESKTOP";
    if(req.device.type.toUpperCase() == "PHONE"){
        devicetype = "PHONE";
    }
   var email = Buffer.from(req.params.email, 'base64').toString('utf-8')
   var password = Buffer.from(req.params.password, 'base64').toString('utf-8')
   var sessionreturnTo = Buffer.from(req.params.sessionreturnTo, 'base64').toString('utf-8')

    lmsUsers.findOne({email: email}, function (err, user) {
        if(user){
            lmsUsers.update(
                {
                    email: email
                },
                {
                    $set: {validated: true}
                }
                ,
                function (err, count) {
                    if (err) {
                        res.json(-1);
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
                        var html = `
                        <body>
      <div style=" background: url(https://www.ampdigital.co/background.png) no-repeat center center; 
      -webkit-background-size: cover;
      -moz-background-size: cover;
      -o-background-size: cover;
      background-size: cover;">
        <div class="container" style="    width: 90%;
        margin-left: 5%;">
        <style>
        p{
            font-style: normal;
                font-weight: 500;
                font-size: 24.5px;
                line-height: 25px;
                /* identical to box height */
                
                letter-spacing: 0.015em;
                
                color: #000E24;
        }
        </style>
            <div style="text-align: center;" class="row justify-content-center mt-5">
              <a class="mr-2" href="/">
                  <img style="width:75px;" class="ampdigitallogo" src="https://www.ampdigital.co/ampdigitallogo.png" alt="Logo">
               </a>
               <a href="/">
                  <img style="width:75px;" src="https://www.ampdigital.co/ampdigitalgooglepartnerlogo.png" class="logo" alt="Logo">
                  </a>
            </div>
            <div  class="row justify-content-center text-center mt-3">
                <p style="font-size: 16px;
                " class="col-12 text-center textp">
                    Dear ${getusername(user)}
                </p>
                <p style="font-size: 16px;" class="col-12 textp">
                 Welcome to <a style="color: #4285F4"href="https://www.ampdigital.co">AMP Digital!</a> Your place to learn and grow as a digital marketer.
                </p>
                <p style="font-size: 16px;margin-bottom:30px;
                " class="col-12 textp">
                At AMP Digital, you get the following:
                </p>
            </div>
            <div style="display: flex;
            flex-wrap: wrap;" class="row justify-content-center features">
                <div style="text-align: center; width: 25%; margin-right:5%;" class="col-md-3 col-6 text-center">
                    <img style="width: 45px;" src="https://www.ampdigital.co/emailer/icon1.png" alt="">
                    <p style="margin-top:0;font-size:11px">
<a style="color: #4285F4" target="_blank" href="https://www.ampdigital.co">Training Programs</a>
                    </p>
                </div>
                <div style="text-align: center; width: 25%; margin-right:5%;" class="col-md-3 col-6 text-center">
                  <img style="width: 45px;" src="https://www.ampdigital.co/emailer/icon2.png" alt="">
                  <p style="margin-top:0;font-size:11px">
                      <a style="color: #DB4437;" href="https://seotools.ampdigital.co">SEO Tools</a>
                      </p>
              </div>
              <div style="text-align: center; width: 25%; margin-right:5%;" class="col-md-3 col-6 text-center">
                  <img style="width: 45px;" src="https://www.ampdigital.co/emailer/icon3.png" alt="">
                  <p style="margin-top:0;font-size:11px"><a style="color: #F4B400;" href="https://www.ampdigital.co/digital-marketing-community-forums">Forum</a>               </p>
              </div>
             
            </div>
            <div style="display: flex;
            flex-wrap: wrap;" class="row justify-content-center features">
            <div style="text-align: center; width: 25%; margin-right:5%;" class="col-md-3 col-6 text-center">
                            <img style="width: 45px;" src="https://www.ampdigital.co/emailer/icon5.png" alt="">
                            <p style="margin-top:0;font-size:11px">
                                <a style="color: #4285F4" href="https://www.ampdigital.co/blogs">Blogs</a></p>
                        </div>
                        <div style="text-align: center;  width: 25%; margin-right:5%;" class="col-md-3 col-6 text-center">
                            <img src="https://www.ampdigital.co/emailer/icon6.png" style="width: 45px;" alt="">
                            <p style="margin-top:0;font-size:11px">
                                <a style="color: #0F9D58;" href="https://www.ampdigital.co/google-ads-simulator">Google Ads Simulator</a> </p>
                        </div>
                        <div style="text-align: center;  width: 25%; margin-right:5%;" class="col-md-3 col-6 text-center">
                            <img src="https://www.ampdigital.co/emailer/icon7.png" style="width: 45px;" alt="">
                            <p style="margin-top:0;font-size:11px">
                                <a style="color: #DB4437;" href="https://www.ampdigital.co/web">Webinar Recordings</a>           </p>
                        </div>
            </div>
            <div style="display: flex;
            flex-wrap: wrap;" class="row justify-content-center features">
              <div style="text-align: center; width: 25%; margin-right:5%;" class="col-md-3 col-6 text-center">
                  <img style="width: 45px;" src="https://www.ampdigital.co/emailer/icon4.png" style="width: 45px;" alt="">
                  <p style="margin-top:0;font-size:11px">
                      <a style="color: #0F9D58;" href="https://www.ampdigital.co/jobs">Jobs</a></p>
              </div>
             
            </div>
            <div class="row justify-content-center">
                <p style="font-size: 16px;">
                  All these are carefully designed and developed by <strong>Amitabh Verma</strong>, ex-Google and the ex-IIT/IIM teams at AMP Digital.
                </p>
            </div>
            <div class="row justify-content-center text-center">
                <img class="mb-5 mt-3" src="https://www.ampdigital.co/heading-element.png" alt="" style="
    width: 7rem;
">
<div class="row">
                <p  style="font-size: 16px;"><strong>We hope to be the partner in your development as a world class digital marketer.</strong></p>
</div>

                <p style="font-size: 16px;" class="col-12">
                  With Best Wishes,
                </p>
                <p style="font-style: normal;
                font-weight: bold;
                font-size: 20px;
                line-height: 36px;
                /* identical to box height */
                
                letter-spacing: 0.015em;
                margin-bottom: 0;
                
                color: #4285F4!important;
                " class="col-12">
                  Team AMP Digital <br>
                </p>
                <p style="font-size: 16px;                color: #4285F4!important;
                " class="col-12">
                <a href="https://www.ampdigital.co">www.ampdigital.cp</a>
              </p>
            </div>
        </div>
    </div>
   
   </body>`

var options = {
    from: 'ampdigital.co <amitabh@ads4growth.com>',
    to: ['amitabh@ads4growth.com', 'binisha@ads4growth.com', 'siddharth@ads4growth.com'],
    replyToAddresses: ['amitabh@ads4growth.com'],
    subject: 'Welcome to AMP Digital!',
    template: 'views/email.ejs',
    templateArgs: {
        name: getusername(user)
    }
};

    sesMail.sendEmailByHtml(options, function(data) {
        lmsUsers.findOne(
            {
                email: email
            }, function(err, user){
                if(user){
                    req.login(user, function(err){
                        if(err) return next(err);
                        res.redirect(sessionreturnTo);
                    });
                }
            }
        );
    });
                    }
                }
            );
        }
    });
});

router.post('/updateteampersonpicture', function (req, res, next) {
    var id = req.body.id;
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
                        teamperson.update(
                            {
                                _id: id
                            },
                            {
                                $set: { "imageurl": url }
                            }
                            ,
                            function (err, count) {
                                if (err) {
                                    res.json(err);
                                }
                                else {
                                    res.redirect("/manage/team")
                                }
                            });
                    }
                });
            }
        });
    }
});

router.post('/addteamperson', function (req, res, next) {
    var name = req.body.name;
    var designation = req.body.designation;
    var qualification = req.body.qualification;
    var bucketParams = { Bucket: 'ampdigital' };
    s3.createBucket(bucketParams);
    var s3Bucket = new aws.S3({ params: { Bucket: 'ampdigital' } });
    // res.json('succesfully uploaded the image!');
    if (!req.files.avatar) {
        // res.json('NO');
        var teampersonPerson = new teamperson({
            name: name,
            qualification: qualification,
            designation: designation
        });
        teampersonPerson.save(function (err, results) {
            res.redirect("/manage/team")
        });
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
                        var teampersonPerson = new teamperson({
                            name: name,
                            qualification: qualification,
                            designation: designation,
                            imageurl: url
                        });
                        teampersonPerson.save(function (err, results) {
                            res.redirect("/manage/team")
                        });
                    }
                });
            }
        });
        // res.json(imageFile);
    }

});

router.put('/removeteamperson', function (req, res) {
    var id = req.body.id;
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;

    teamperson.remove(
        {
            _id: safeObjectId(id)
        },
        function (err, count) {
            if (err) {
                console.log(err);
            }
            else {
                res.json(count);
            }
        });
});

router.post('/testimonialimageuploadons3', function (req, res, next) {
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
                        testimonial.update(
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

/*Passport Signup*/
router.post('/signup', passport.authenticate('local-signup-email-verification', {
    successRedirect: '/',
    failureRedirect: '/auth',
    failureFlash: true,
}));

router.post('/signupbuddingmarketerprogram', passport.authenticate('local-signup', {
    successRedirect: '/budding-marketer-program/application',
    failureRedirect: '/',
    failureFlash: true,
}));


router.post('/paymentsignup',
    passport.authenticate('local-signup', { failureRedirect: '/' }),
    function (req, res) {
        console.log('_____req')
        console.log(req.body);
        if(req.body.studentcheckbox){
            res.redirect(req.body.path + '?payment=true&studentcheckbox=true' || '/');
        }
        else{
            res.redirect(req.body.path + '?payment=true' || '/');
        }
        // Successful authentication, redirect home.
        // delete req.session.returnTo;
    });

router.get('/thankyoubuddingmarketer', function (req, res, next) {
    if (req.isAuthenticated()) {
        res.render("thankyoubuddingmarketerapplication")
    }
    else {
        res.redirect("/");
    }
});
            

router.post('/referralprogramapplication',  function (req, res, next) {
    if (req.isAuthenticated()) {
        lmsUsers.update(
            {
                email: req.user.email
            },
            {
                $set: req.body
            }
            ,
            function (err, count) {
                if (err) {
                    res.json(-1);
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

                    var html = `Hi ${req.user.local.name},
                <br><br>
                We have received your application for AMP Digital's Budding Marketer Program. Your application is under process. You will hear from us soon.
                <br><br>
                In the meantime, please go through our <a target="_blank" href="https://www.ampdigital.co/courses">training programs</a>, <a target="_blank" href="https://www.ampdigital.co/blogs">blogs</a>, and <a target="_blank" href="https://www.ampdigital.co/webinars">webinars</a> .
                regards,
                <br>
                <table width="351" cellspacing="0" cellpadding="0" border="0"> <tr> <td style="text-align:left;padding-bottom:10px"><a style="display:inline-block" href="https://www.ampdigital.co"><img style="border:none;" width="150" src="https://s1g.s3.amazonaws.com/36321c48a6698bd331dca74d7497797b.jpeg"></a></td> </tr> <tr> <td style="border-top:solid #000000 2px;" height="12"></td> </tr> <tr> <td style="vertical-align: top; text-align:left;color:#000000;font-size:12px;font-family:helvetica, arial;; text-align:left"> <span> </span> <br> <span style="font:12px helvetica, arial;">Email:&nbsp;<a href="mailto:amitabh@ampdigital.co" style="color:#3388cc;text-decoration:none;">amitabh@ampdigital.co</a></span> <br><br> <span style="margin-right:5px;color:#000000;font-size:12px;font-family:helvetica, arial">Registered Address: AMP Digital</span> 403, Sovereign 1, Vatika City, Sohna Road,, Gurugram, Haryana, 122018, India<br><br> <table cellpadding="0" cellpadding="0" border="0"><tr><td style="padding-right:5px"><a href="https://facebook.com/https://www.facebook.com/AMPDigitalNet/" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/23f7b48395f8c4e25e64a2c22e9ae190.png" alt="Facebook" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://twitter.com/https://twitter.com/amitabh26" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3949237f892004c237021ac9e3182b1d.png" alt="Twitter" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://linkedin.com/in/https://in.linkedin.com/company/ads4growth?trk=public_profile_topcard_current_company" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/dcb46c3e562be637d99ea87f73f929cb.png" alt="LinkedIn" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://youtube.com/https://www.youtube.com/channel/UCMOBtxDam_55DCnmKJc8eWQ" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3b2cb9ec595ab5d3784b2343d5448cd9.png" alt="YouTube" style="border:none;"></a></td></tr></table><a href="https://www.ampdigital.co" style="text-decoration:none;color:#3388cc;">www.ampdigital.co</a> </td> </tr> </table> <table width="351" cellspacing="0" cellpadding="0" border="0" style="margin-top:10px"> <tr> <td style="text-align:left;color:#aaaaaa;font-size:10px;font-family:helvetica, arial;"><p>AMP&nbsp;Digital is a Google Partner Company</p></td> </tr> </table> `;

                    var html2 = `Hi Amitabh,
    <br><br>
    A new application is received for AMP Digital's Budding Marketer Program. Please go to <a target="_blank" href="https://www.ampdigital.co/manage/buddingarketerapplications">Admin panel</a> to approve/reject it.
    <br><br>
    regards,
    <br>
    <table width="351" cellspacing="0" cellpadding="0" border="0"> <tr> <td style="text-align:left;padding-bottom:10px"><a style="display:inline-block" href="https://www.ampdigital.co"><img style="border:none;" width="150" src="https://s1g.s3.amazonaws.com/36321c48a6698bd331dca74d7497797b.jpeg"></a></td> </tr> <tr> <td style="border-top:solid #000000 2px;" height="12"></td> </tr> <tr> <td style="vertical-align: top; text-align:left;color:#000000;font-size:12px;font-family:helvetica, arial;; text-align:left"> <span> </span> <br> <span style="font:12px helvetica, arial;">Email:&nbsp;<a href="mailto:amitabh@ampdigital.co" style="color:#3388cc;text-decoration:none;">amitabh@ampdigital.co</a></span> <br><br> <span style="margin-right:5px;color:#000000;font-size:12px;font-family:helvetica, arial">Registered Address: AMP Digital</span> 403, Sovereign 1, Vatika City, Sohna Road,, Gurugram, Haryana, 122018, India<br><br> <table cellpadding="0" cellpadding="0" border="0"><tr><td style="padding-right:5px"><a href="https://facebook.com/https://www.facebook.com/AMPDigitalNet/" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/23f7b48395f8c4e25e64a2c22e9ae190.png" alt="Facebook" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://twitter.com/https://twitter.com/amitabh26" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3949237f892004c237021ac9e3182b1d.png" alt="Twitter" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://linkedin.com/in/https://in.linkedin.com/company/ads4growth?trk=public_profile_topcard_current_company" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/dcb46c3e562be637d99ea87f73f929cb.png" alt="LinkedIn" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://youtube.com/https://www.youtube.com/channel/UCMOBtxDam_55DCnmKJc8eWQ" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3b2cb9ec595ab5d3784b2343d5448cd9.png" alt="YouTube" style="border:none;"></a></td></tr></table><a href="https://www.ampdigital.co" style="text-decoration:none;color:#3388cc;">www.ampdigital.co</a> </td> </tr> </table> <table width="351" cellspacing="0" cellpadding="0" border="0" style="margin-top:10px"> <tr> <td style="text-align:left;color:#aaaaaa;font-size:10px;font-family:helvetica, arial;"><p>AMP&nbsp;Digital is a Google Partner Company</p></td> </tr> </table> `;

                    var options = {
                        from: 'ampdigital.co <amitabh@ads4growth.com>',
                        to: req.user.email,
                        subject: `AMP Digital: Your Application for Budding Marketers Program`,
                        content: '<html><head></head><body>' + html + '</body></html>'
                    };

                    var options2 = {
                        from: 'ampdigital.co <amitabh@ads4growth.com>',
                        to: ["siddharthsogani22@gmail.com", "vansh@ads4growth.com", "amitabh@ads4growth.com"],
                        subject: `AMP Digital: New Application received for Budding Marketers Program`,
                        content: '<html><head></head><body>' + html2 + '</body></html>'
                    };

                    sesMail.sendEmail(options, function (err, data) {
                        // TODO sth....
                        if (err) {
                            console.log(err);
                        }
                        sesMail.sendEmail(options2, function (err, data2) {
                            // TODO sth....
                            if (err) {
                                console.log(err);
                            }
                            res.json(1);
                        });
                    });
                }
            });
    }
    else {
        res.redirect("/referral");
    }
});

function timeSince(date) {
    var seconds = Math.floor((new Date() - date) / 1000);
    var interval = Math.floor(seconds / 31536000);
    if (interval > 1) {
        return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
}

/*Passport Login*/
router.post('/login',
    passport.authenticate('local-login', { failureRedirect: '/' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect(req.session.returnTo || '/');
        delete req.session.returnTo;
    });

    /*Passport Signup*/
    router.post('/signupsimulationtool', passport.authenticate('local-signup', {failureRedirect: '/'}), function (req, res) {
        // res.json(req.body);
        var id = JSON.parse(req.body.answers2).id;
        var result = JSON.parse(req.body.answers2);
        var totalpoints = parseInt(result.totalpoints);
        // res.json(totalpoints);
        var name = req.user.local.name + " " + (req.user.local.lastname?req.user.local.lastname: "");
        var email = req.user.email;
        simulatorpoint.count({email: email}, function(err, count2){
            simulatorpoint.count({email: email, id: id}, function(err, count){
                console.log("haoieghaeg");
                console.log(count);
                if(count>0){
                    simulatorpoint.update(
                        {
                            id: id, email: email
                        },
                        {
                            $set: {name:name,  "totalpoints": totalpoints, input1: req.session.input1, input2: req.session.input2, input3: req.session.input3, input4: req.session.input4, input5: req.session.input5, input6: req.session.input6, date: new Date() }
                        }
                        ,
                        function (err, count) {
                            if (err) {
                                res.redirect("/")
                            }
                            else {
                                simulatorpoint.aggregate([{$group: {
                                    _id:"$name",                                                                     
                                    value: { $max: "$totalpoints" } 
                                }}, {$sort: {value: -1}}], function (err, leaderboard) {
                                    var retry = true;
                                    res.render('simulatortoolresult', {leaderboard: leaderboard, id: id, retry: retry, moment: moment, title: result.title, content: result.content, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
                                });
                            }
                        });
                }
                else if(count==0){
                    var simulatorpoint2 = new simulatorpoint({
                        totalpoints: totalpoints,
                        input1: req.session.input1, input2: req.session.input2, input3: req.session.input3, input4: req.session.input4, input5: req.session.input5, input6: req.session.input6,
                        name: name,
                        email: email,
                        id: id,
                        date: new Date()
                    });
                    simulatorpoint2.save(function (err, results) {
                        if (err) {
                            res.redirect("/")
                        }
                        else {
                            simulatorpoint.aggregate([{$group: {
                                _id:"$name",                                                                     
                                value: { $max: "$totalpoints" } 
                            }}, {$sort: {value: -1}}], function (err, leaderboard) {
                                var retry = false;
                                if(count2<2){
                                    retry = true;
                                }
                                res.render('simulatortoolresult', {leaderboard: leaderboard, id: id, retry: retry, moment: moment, title: result.title, content: result.content, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
                            });
                        }
                    });
                }
                else{
                    res.redirect("/")
                }
            })
        });
    });


    /*Passport Login*/
    router.post('/tools/google-ads-simulator', 
function (req, res, next) {
    if(!req.isAuthenticated()){
        next()
    }
    else{
        console.log("__haiephaegi");
        var id = JSON.parse(req.body.answers).id;
        var result = JSON.parse(req.body.answers);
        var totalpoints = parseInt(result.totalpoints);
        // res.json(totalpoints);
        var name = req.user.local.name + " " + (req.user.local.lastname?req.user.local.lastname: "");
        var email = req.user.email;
        simulatorpoint.count({email: email}, function(err, count2){
            simulatorpoint.count({email: email, id: id}, function(err, count){
                if(count>0){
                    simulatorpoint.update(
                        {
                            id: id, email: email
                        },
                        {
                            $set: {name: name, "totalpoints": totalpoints, input1: req.session.input1, input2: req.session.input2, input3: req.session.input3, input4: req.session.input4, input5: req.session.input5, input6: req.session.input6,  date: new Date() }
                        }
                        ,
                        function (err, count) {
                            simulatorpoint.aggregate([{$group: {
                                _id:"$name",                                                                     
                                value: { $max: "$totalpoints" } 
                            }}, {$sort: {value: -1}}], function (err, leaderboard) {
                                if (err) {
                                    return res.redirect("/")
                                }
                                else {
                                    var retry = true;
                                    res.render('simulatortoolresult', { leaderboard: leaderboard, id: id, retry: retry, moment: moment, title: result.title, content: result.content, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
                                    return;
                                }
                            }); 
                        });
                }
                else if(count==0){
                    var simulatorpoint2 = new simulatorpoint({
                        totalpoints: totalpoints,
                        input1: req.session.input1, input2: req.session.input2, input3: req.session.input3,
                        input4: req.session.input4, input5: req.session.input5, input6: req.session.input6,
                        name: name,
                        email: email,
                        id: id,
                        date: new Date()
                    });
                    simulatorpoint2.save(function (err, results) {
                        if (err) {
                            res.redirect("/");
                            return;
                        }
                        else {
                            simulatorpoint.aggregate([{$group: {
                                _id:"$name",                                                                     
                                value: { $max: "$totalpoints" } 
                            }}, {$sort: {value: -1}}], function (err, leaderboard) {
                                var retry = false;
                                if(count2<2){
                                    retry = true;
                                }
                                res.render('simulatortoolresult', {leaderboard: leaderboard, id: id, retry: retry, moment: moment, title: result.title, content: result.content, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
                                return;
                            });
                        }
                    });
                }
                else{
                    res.redirect("/");
                    return;
                }
            })
        });
    }
},
passport.authenticate('local-login', { failureRedirect: '/' }),
function (req, res) {
    var id = JSON.parse(req.body.answers).id;
    var result = JSON.parse(req.body.answers);
    var totalpoints = result.totalpoints;
    // res.json(totalpoints);
    var name = req.user.local.name + " " + (req.user.local.lastname?req.user.local.lastname: "");
    var email = req.user.email;
    simulatorpoint.count({email: email}, function(err, count2){
        simulatorpoint.count({email: email, id: id}, function(err, count){
            console.log("haoieghaeg");
            console.log(count);
            if(count>0){
                simulatorpoint.update(
                    {
                        id: id, email: email
                    },
                    {
                        $set: { name: name, "totalpoints": totalpoints, date: new Date(), input1: req.session.input1, input2: req.session.input2, input3: req.session.input3, input4: req.session.input4, input5: req.session.input5, input6: req.session.input6 }
                    }
                    ,
                    function (err, count) {
                        if (err) {
                            res.redirect("/")
                        }
                        else {
                            simulatorpoint.aggregate([{$group: {
                                _id:"$name",                                                                     
                                value: { $max: "$totalpoints" } 
                            }}, {$sort: {value: -1}}], function (err, leaderboard) {
                                var retry = true;
                                res.render('simulatortoolresult', {leaderboard: leaderboard, id: id, retry: retry, moment: moment, title: result.title, content: result.content, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
                            });
                        }
                    });
            }
            else if(count==0){
                var simulatorpoint2 = new simulatorpoint({
                    totalpoints: totalpoints,
                    name: name,
                    email: email,
                    id: id,
                    input1: req.session.input1, input2: req.session.input2, input3: req.session.input3, input4: req.session.input4, input5: req.session.input5, input6: req.session.input6,
                    date: new Date()
                });
                simulatorpoint2.save(function (err, results) {
                    if (err) {
                        res.redirect("/")
                    }
                    else {
                        simulatorpoint.aggregate([{$group: {
                            _id:"$name",                                                                     
                            value: { $max: "$totalpoints" } 
                        }}, {$sort: {value: -1}}], function (err, leaderboard) {
                            var retry = false;
                            if(count2<2){
                                retry = true;
                            }
                            res.render('simulatortoolresult', {leaderboard: leaderboard, id: id, retry: retry, moment: moment, title: result.title, content: result.content, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
                        });
                    }
                });
            }
            else{
                res.redirect("/")
            }
        })
    });
});

/*Passport Login*/
router.post('/paymentlogin',
    passport.authenticate('local-login', { failureRedirect: '/courses/digital-marketing-course' }),
    function (req, res) {
        console.log("____ahipegaegreqihepqghiqpehgqpiehgqpeig");
        console.log(req.body);
        // Successful authentication, redirect home.
        var couponcode = '';
        if (req.body.couponcodelogin !== '') {
            couponcode = '&couponcode=' + req.body.couponcodelogin
        }
        if (req.body.alreadyenrolled == "enrolled") {
            res.redirect(req.body.path + '?enrolled=true&payment=true' + couponcode || '/');
        }
        else {
            if(req.body.studentcheckbox){
                console.log('shouldcome here');
                res.redirect(req.body.path + '?payment=true&studentcheckbox=true' || '/');
            }
            else{
                console.log('shouldnotcome here');

                res.redirect(req.body.path + '?payment=true' + couponcode || '/');
            }
        }
        delete req.session.returnTo;
    });

/*Passport Logout*/
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/getnamefromemail', function (req, res, next) {
    lmsUsers.findOne({ email: req.query.email }, function (err, user) {
        if (user) {
            res.json(user.local.name);
        }
        else {
            res.json(-1);
        }
    });
});

router.get('/userexistsindatabase', function (req, res, next) {
    lmsUsers.findOne({ email: req.query.email }, function (err, user) {
        if (user) {
            if (user.validPassword(req.query.password)) {
                if(typeof user.courses!=='undefined' && user.courses.indexOf(req.query.courseid)!==-1){
                    res.json(4);
                }
                else{
                    res.json(2);
                }
            }
            else {
                res.json(3);
            }
        }
        else {
            res.json(false);
        }
    });
});

router.get('/submissionexists', function (req, res) {
    submission.findOne(
        { assignment_id: req.query.id, submitted_by_email: req.query.userid },
        function (err, submission) {
            if (err) {
                res.json(err);
            }
            else if (submission) {
                res.json({ exists: true, submission: submission })
            }
            else {
                res.json({ exists: false, submission: null })
            }
        }
    );
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

router.get('/budding-marketer-program', function (req, res, next) {
    if (req.isAuthenticated()) {
        payment.find({ couponcode: req.user.local.referralcode, status: "Credit", coupontype: "referralcode" }, function (err, docs) {
            if (err) {
                res.json(err)
            }
            else {
                var signups = 0;
                var earned = 0;
                for (var i = 0; i < docs.length; i++) {
                    if (docs[i].status == 'Credit' && docs[i].coupontype == 'referralcode') {
                        signups = signups + 1;
                        earned = earned + docs[i].offertoparticipant;
                    }
                }
                res.render('referral', { title: 'Express', docs: docs, moment: moment, signups: signups, earned: earned, referralcode: req.user.local.referralcode, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
            }
        });
    }
    else {
        req.session.returnTo = "/budding-marketer-program/application";
        res.render('bpmpage', { title: 'Express' });
    }
});

router.get('/budding-marketer-program/application', function (req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('/budding-marketer-program');
    }
    else {
        req.session.returnTo = "/referral";
        res.render('signupform4', { title: 'Express', moment: moment, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });

    }
});

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

router.get('/ppcsimulationtool', function (req, res, next) {
    req.session.returnTo = req.path;
    var query = {};
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;

    if(req.query.query_id){
        query = {_id: safeObjectId(req.query.query_id)}
    }
    else if(req.query.ids){
        var ids = req.query.ids.split(",");
        if(typeof ids!=="undefined" && ids && ids.length<3){
            var idarray = [];
            for(var i = 0; i<ids.length; i++){
                idarray.push(safeObjectId(ids[i]));
            }
            query = {_id: {$nin: idarray}}
        }
        else if(typeof ids!=="undefined" && ids && ids.length==3){
            query = query;
        }
        else{
            query = {_id: {$ne: safeObjectId(req.query.ids)}}
        }
    }
    simulationppcad.find(query, function (err, tools) {
        if(tools && tools.length>0){
            res.json(tools[randomInteger(0, tools.length-1)])
        }
        else{
            res.json(-1)
        }
    });
});

router.get('/ppcanswers', function (req, res, next) {
    req.session.returnTo = req.path;
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;

    simulationppcad.find({_id: safeObjectId(req.query.id)}, {question1answer: 1, question2answer: 1, question3answer:1}, function (err, tool) {
        if(tool){
            res.json(tool[0])
        }
        else{
            res.json(-1);
        }
    });
});

router.get("/ppcanswersofuser", function(req, res, next){
    var email = req.query.email;
    var id = req.query.id;
    simulatorpoint.findOne({email: email, id: id}, function(err, doc){
        if(doc){
            res.json(doc);
        }
        else{
            res.json(-1);
        }
    })
})

router.post("/checkanswers", function(req, res, next){
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;
    simulationppcad.findOne({_id: safeObjectId(req.body.id)}, {question1answer: 1, question2answer: 1, question3answer: 1, question4answer: 1, question5answer: 1, question6answer: 1}, function (err, tool) {
        if(tool){
            var points1a = 0;
            var points1b = 0;
            var points1c = 0;
            var points2 = 0;
            var points3 = 0;
            var points4 = 0;
            var points5 = 0;
            var points6 = 0;
            var tips = ``;
            var tips2 = ``;
            var input1 = req.body["input1[]"];
            var input2 = req.body.input2;
            var input3 = req.body["input3[]"];
            var input4 = req.body.input4;
            var input5 = req.body.input5;
            var input6 = req.body.input6;
            var question1answer = tool.question1answer;
            var question2answer = tool.question2answer;
            var question3answer = tool.question3answer;
            var question4answer = tool.question4answer;
            var question5answer = tool.question5answer;
            var question6answer = tool.question6answer;
            // return res.json(req.body);
            if(input4 == question4answer){
                points4 = points4 + 5;
                tips2 = tips2 + `<td>
                  Answer 1, ${input4}
                                  </td>
                                  <td>
                                    <span style="color: #28a745;"> Perfect answer</span>
                                    </td>
                              </tr>`
            }
            else{
                console.log("input4");
                console.log(input4);
                console.log(question4answer);
            tips2 = tips2 + `<td>
                Answer 1, ${input4}
                                </td>
                                <td>
                                <span style="color: #dc3545;"> Incorrect answer, Try again</span>
                                </td>
                            </tr>`
            }
            if(input5 == question5answer){
                points5 = points5 + 5;
                tips2 = tips2 + `<td>
                  Answer 2, ${input5}
                                  </td>
                                  <td>
                                    <span style="color: #28a745;"> Perfect answer</span>
                                    </td>
                              </tr>`
            }
            else{
            tips2 = tips2 + `<td>
                Answer 2, ${input5}
                                </td>
                                <td>
                                <span style="color: #dc3545;"> Incorrect answer, Try again</span>
                                </td>
                            </tr>`
            }
            if(input6 == question6answer){
                points6 = points6 + 5;
                tips2 = tips2 + `<td>
                  Answer 3, ${input6}
                                  </td>
                                  <td>
                                    <span style="color: #28a745;"> Perfect answer</span>
                                    </td>
                              </tr>`
            }
            else{
            tips2 = tips2 + `<td>
                Answer 3, ${input6}
                                </td>
                                <td>
                                <span style="color: #dc3545;"> Incorrect answer, Try again</span>
                                </td>
                            </tr>`
            }
            if(input1[0] == question1answer[0]){
              points1a = points1a + 15;
              tips = tips + `<strong>Answer 1, ${input1[0]}</strong>: <span style="color: #28a745;">20 Points, Perfect answer</span><br>`;
              tips2 = tips2 + `<td>
                Answer 4, ${input1[0]}
                                </td>
                                <td>
                                  <span style="color: #28a745;"> Perfect answer</span>
                                  </td>
                            </tr>`
            }
            else if(input1[0] == question1answer[1]){
              points1a = points1a + 5;
              tips = tips + `<strong>Answer 1, ${input1[0]}</strong>: <span style="color: #17a2b8;">10 Points, Great answer but it should not be the first choice. Try again by reordering.</span><br>`;
              tips2 = tips2 + `<td>
                Answer 4, ${input1[0]}
                                </td>
                                <td>
                                  <span style="color: #17a2b8;"> Great answer but it should not be the first choice. Try again by reordering.</span>
                                  </td>
                            </tr>`
            }
            else if(input1[0] == question1answer[2]){
              points1a = points1a + 5;
              tips = tips + `<strong>Answer 1, ${input1[0]}</strong>: <span style="color: #17a2b8;">10 Points, Great answer but it should not be the first choice. Try again by reordering.</span><br>`;
              tips2 = tips2 + `<td>
                Answer 4, ${input1[0]}
                                </td>
                                <td>
                                  <span style="color: #17a2b8;"> Great answer but it should not be the first choice. Try again by reordering.</span>
                                  </td>
                            </tr>`
            }
            else{
              tips = tips + `<strong>Answer 1, ${input1[0]}</strong>: <span style="color: #dc3545;">0 Points, Incorrect answer, Try again</span><br>`;
              tips2 = tips2 + `<td>
                Answer 4, ${input1[0]}
                                </td>
                                <td>
                                  <span style="color: #dc3545;"> Incorrect answer, Try again</span>
                                  </td>
                            </tr>`
            }
            if(input1[1] == question1answer[0]){
              points1a = points1a + 5;
              tips = tips + `<strong>${input1[1]}</strong>: <span style="color: #17a2b8;">10 Points, Great answer but it should not be the second choice. Try again by reordering.</span><br>`;
              tips2 = tips2 + `<td>
                Answer 4, ${input1[1]}
                                </td>
                                <td>
                                  <span style="color: #17a2b8;"> Great answer but it should not be the second choice. Try again by reordering.</span>
                                  </td>
                            </tr>`
            }
            else if(input1[1] == question1answer[1]){
              points1a = points1a + 15;
              tips = tips + `<strong>${input1[1]}</strong>: <span style="color: #28a745;">20 Points, Perfect answer</span><br>`;
              tips2 = tips2 + `<td>
                Answer 4, ${input1[1]}
                                </td>
                                <td>
                                  <span style="color: #28a745;"> Perfect answer</span>
                                  </td>
                            </tr>`
            }
            else if(input1[1] == question1answer[2]){
              points1a = points1a + 5;
              tips = tips + `<strong>${input1[1]}</strong>: <span style="color: #17a2b8;">10 Points, Great answer but it should not be the second choice. Try again by reordering.</span><br>`;
              tips2 = tips2 + `<td>
                Answer 4, ${input1[1]}
                                </td>
                                <td>
                                  <span style="color: #17a2b8;"> Great answer but it should not be the second choice. Try again by reordering.</span>
                                  </td>
                            </tr>`
            }
            else{
              tips = tips + `<strong>${input1[1]}</strong>: <span style="color: #dc3545;">0 Points, Incorrect answer, Try again</span><br>`;
              tips2 = tips2 + `<td>
                Answer 4, ${input1[1]}
                                </td>
                                <td>
                                  <span style="color: #dc3545;"> Incorrect answer, Try again</span>
                                  </td>
                            </tr>`
            }
            if(input1[2] == question1answer[0]){
              points1a = points1a + 5;
              tips = tips + `<strong>Answer 1, ${input1[2]}</strong>: <span style="color: #17a2b8;">10 Points, Great answer but it should not be the third choice. Try again by reordering.</span><br>`;
              tips2 = tips2 + `<td>
                Answer 4, ${input1[2]}
                                </td>
                                <td>
                                  <span style="color: #17a2b8;"> Great answer but it should not be the third choice. Try again by reordering.</span>
                                  </td>
                            </tr>`
            }
            else if(input1[2] == question1answer[1]){
              points1a = points1a + 5;
              tips = tips + `<strong>${input1[2]}</strong>: <span style="color: #17a2b8;">10 Points, Great answer but it should not be the third choice. Try again by reordering.</span><br>`;
              tips2 = tips2 + `<td>
                Answer 4, ${input1[2]}
                                </td>
                                <td>
                                  <span style="color: #17a2b8;"> Great answer but it should not be the third choice. Try again by reordering.</span>
                                  </td>
                            </tr>`
            }
            else if(input1[2] == question1answer[2]){
              points1a = points1a + 15;
              tips = tips + `<strong>${input1[2]}</strong>: <span style="color: #28a745;">20 Points, Perfect answer</span><br>`;
              tips2 = tips2 + `<td>
                Answer 4, ${input1[2]}
                                </td>
                                <td>
                                  <span style="color: #28a745;"> Perfect answer</span>
                                  </td>
                            </tr>`
            }
            else{
              tips = tips + `<strong>${input1[2]}</strong>: <span style="color: #dc3545;">0 Points, Incorrect answer, Try again</span><br>`;
              tips2 = tips2 + `<td>
                Answer 4, ${input1[2]}
                                </td>
                                <td>
                                  <span style="color: #dc3545;"> Incorrect answer, Try again</span>
                                  </td>
                            </tr>`
            }
            if(input2 == question2answer){
              points2 = points2 + 15;
              tips = tips + `<strong>Answer 2, ${input2}</strong>: <span style="color: #28a745;">20 Points, Perfect answer</span><br>`;
              tips2 = tips2 + `<td>
                Answer 5, ${input2}
                                </td>
                                <td>
                                  <span style="color: #28a745;"> Perfect answer</span>
                                  </td>
                            </tr>`
            }
            else{
              tips = tips + `<strong>Answer 2, ${input2}</strong>: <span style="color: #dc3545;">0 Points, Incorrect answer, Try again</span><br>`;
              tips2 = tips2 + `<td>
                Answer 5, ${input2}
                                </td>
                                <td>
                                  <span style="color: #dc3545;"> Incorrect answer, Try again</span>
                                  </td>
                            </tr>`
            }
            if(input3[0] == question3answer[0] || input3[0] == question3answer[1]){
              points3 = points3 + 5;
              tips = tips + `<strong>Answer 3, ${input3[0]}</strong>: <span style="color: #28a745;">20 Points, Perfect answer</span><br>`;
              tips2 = tips2 + `<td>
                Answer 6, ${input3[0]}
                                </td>
                                <td>
                                  <span style="color: #28a745;"> Perfect answer</span>
                                  </td>
                            </tr>`
            }
            else{
              tips = tips + `<strong>Answer 3, ${input3[0]}</strong>: <span style="color: #dc3545;">0 Points, Incorrect answer, Try again</span><br>`;
              tips2 = tips2 + `<td>
                Answer 6, ${input3[0]}
                                </td>
                                <td>
                                  <span style="color: #dc3545;"> Incorrect answer, Try again</span>
                                  </td>
                            </tr>`
            }
            if(input3[1] == question3answer[0] || input3[1] == question3answer[1]){
              points3 = points3 + 5;
              tips = tips + `<strong>Answer 1, ${input3[1]}</strong>: <span style="color: #17a2b8;">10 Points, Great answer but it should not be the first choice. Try again by reordering.</span><br>`;
              tips2 = tips2 + `<td>
                Answer 6, ${input3[1]}
                                </td>
                                <td>
                                  <span style="color: #28a745;"> Perfect answer</span>
                                  </td>
                            </tr>`
            }
            else{
              tips = tips + `<strong>Answer 3, ${input3[1]}</strong>: <span style="color: #dc3545;">0 Points, Incorrect answer, Try again</span><br>`;
              tips2 = tips2 + `<td>
                Answer 6, ${input3[1]}
                                </td>
                                <td>
                                  <span style="color: #dc3545;"> Incorrect answer, Try again</span>
                                  </td>
                            </tr>`
            }
            var totalpoints = points1a+ points1b+ points1c+ points2+ points3 + points4+points5+points6;
            var title;
            if(totalpoints<15){
              title = "You are a Newbie"
            }
            else if(totalpoints>14 && totalpoints<40){
              title = "You are a Novice"
            }
            else if(totalpoints>39 && totalpoints<60){
              title = "You are a Learner"
            }
            else if(totalpoints>59 && totalpoints<60){
              title = "You are a Competent"
            }
            else if(totalpoints>59 && totalpoints<70){
              title = "You are an Achiever!"
            }
            else if(totalpoints>69 && totalpoints<80){
              title = "You are Proficient!"
            }
            else if(totalpoints>79 && totalpoints<90){
              title = "You are an Expert!"
            }
            else if(totalpoints>89 && totalpoints<101){
              title = "You are a Champion!"
            }

            var content = `<strong>You got ${totalpoints} Points of 100 </strong> <br> Here is your score summary: <br> ${tips}`;

            var content = `<div data-href="/courses/digital-marketing-course" style="cursor: pointer;">
  <div class="course-body text-center">
    <strong><span style="font-size: X-LARGE;">You scored ${totalpoints}%</span> </strong> <br> Here is summary of your score: <br>
    <div class="table-responsive text-left">
                    <table class="table table-hover earning-box">
                            <tr>
                                <th>You Selected</th>
                                <th>Comments</th>
                            </tr>
                            ${tips2}
                    </table>
                </div>
  </div>
</div>`;
            if(!req.isAuthenticated()){
                req.session.input1 = req.body["input1[]"];
                req.session.input2 = req.body.input2;
                req.session.input3 = req.body["input3[]"];
                req.session.input4 = req.body.input4;
                req.session.input5 = req.body.input5;
                req.session.input6 = req.body.input6;
                res.json({
                    totalpoints: totalpoints,
                    title: title,
                    content: content,
                    columnClass: 'xlarge'
                })
            }
            else{
                req.session.input1 = req.body["input1[]"];
                req.session.input2 = req.body.input2;
                req.session.input3 = req.body["input3[]"];
                req.session.input4 = req.body.input4;
                req.session.input5 = req.body.input5;
                req.session.input6 = req.body.input6;
                console.log("__aehigaehgp");
                simulatorpoint.count({email: req.user.email, id: req.body.id}, function(err, count){
                    if(1){
                        simulatorpoint.update(
                            {
                                id: req.body.id, email: req.user.email
                            },
                            {
                                $set: { "totalpoints": totalpoints, input1: req.body["input1[]"],
                                input2: req.body.input2,
                                name: req.user.local.name + " " + (req.user.local.lastname?req.user.local.lastname: ""),
                                id: req.body.id, email: req.user.email,
                                input3: req.body["input3[]"], input4: req.body.input4,
                                input5: req.body.input5,
                                input6: req.body.input6, date: new Date() }
                            },
                            {upsert: true},
                            function (err, count) {
                                if (err) {
                                    res.json(err);
                                }
                                else {
                                    res.json({
                                        totalpoints: totalpoints,
                                        title: title,
                                        content: content,
                                        columnClass: 'xlarge'
                                    })
                                }
                            });
                    }
                });
            }
        }
        else{
            res.json(-1)
        }
    });
})

/* GET faq page */
router.get('/faq', function (req, res, next) {
    // faqModel.aggregate([
    //     {
    //         $match: { "deleted": { $ne: true } }
    //     },
    //     {
    //         $group: {
    //             _id: { category: "$category" },
    //             question: { $push: "$question" },
    //             answer: { $push: "$answer" }
    //         }
    //     }
    // ], function (err, faqdocs) {
        let faqdocs = [{"_id":{"category":"Payment"},"question":["What payment options are available?","How can I pay for my training?","Can i get refund ?","I am not able to make payment. What should I do now?","Can i get refund ?","How can I pay for my training?","I am not able to make payment. What should I do now?","What payment options are available?"],"answer":["Payments can be made using any of the following options. You will be emailed a receipt after the payment is made:-\n<ul>\n<li>Credit or Debit card\n</li>\n<li>UPI \n</li>\n<li>Google Pay\n</li>\n<li>Net Banking</li>\n<li>Wallets like PayTM, PhonePay, OlaMoney</li>\n</ul>","You can pay online through the payment gateway.","Once Course is started, You can not get a refund.","You could try making the payment from a different card or account (of a friend or family).\t\t","Once Course is started, You can not get a refund.","You can pay online through the payment gateway.","You could try making the payment from a different card or account (of a friend or family).","Payments can be made using any of the following options. You will be emailed a receipt after the payment is made:-\r\n\r\nCredit or Debit card\r\n\r\nUPI \r\n\r\nGoogle Pay\r\n\r\nNet Banking\r\nWallets like PayTM, PhonePay, OlaMoney\r\n"]},{"_id":{"category":"About Course"},"question":["Can my course be extended?","Do you provide any certificate?","Do you provide any training material?","Do you provide any certificate?","Can my course be extended?","Do you provide any training material?"],"answer":["No, generally it is not extended.","Yes, we do provide our own certification. Also, we will prepare you to get certified by Google.\nWe will provide a soft copy of your training certificate. You may download it and get it printed if required.\t\t\t\t\t","Yes - there will be online material that will be provided through videos or pdf documents.\t\t","Yes, we do provide our own certification. Also, we will prepare you to get certified by Google.\nWe will provide a soft copy of your training certificate. You may download it and get it printed if required.","No, generally it is not extended.","Yes, we do provide our own certification. Also, we will prepare you to get certified by Google.\r\nWe will provide a soft copy of your training certificate. You may download it and get it printed if required."]},{"_id":{"category":"Learning"},"question":["If I miss a class, do I get back up classes?","How qualified is the faculty/trainers of your institute?","What are the differences between your courses and that of other institutes?","Who all can take-up digital marketing course?","Will I become an expert when I go through these courses?","How qualified is the faculty/trainers of your institute?","If I miss a class, do I get back up classes?","What are the differences between your courses and that of other institutes?","Who all can take-up digital marketing course?","Will I become an expert when I go through these courses?"],"answer":["We record all the sessions, so that you can access the class recording if you miss the class.\t\t","Our main faculty is Amitabh Verma, who spent more than 7 years at Google leading large teams of Googlers who supposed millions of advertisers across the globe. \t\t\t\t\t\t","We have attempted to provide a very practice approach to Digital marketing by learning from the best in the business.\t\t\t","Anyone interested can take up the course. Its not limited by your background.\t","You can become an expert through your own hard work. But the course will surely get you started on your path to master Digital Marketing\t\t\t\t\t","Our main faculty is Amitabh Verma, who spent more than 7 years at Google leading large teams of Googlers who supposed millions of advertisers across the globe.","We record all the sessions, so that you can access the class recording if you miss the class.","We have attempted to provide a very practice approach to Digital marketing by learning from the best in the business.","Anyone interested can take up the course. Its not limited by your background.","You can become an expert through your own hard work. But the course will surely get you started on your path to master Digital Marketing"]}];
        if (req.isAuthenticated()) {
            res.render('faq', { faqdocs: faqdocs, title: 'Express', email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
        }
        else {
            res.render('faq', { faqdocs: faqdocs, title: 'Express' });
        }
    // });
});

/*GET courses page*/
router.get('/manage/team', isLoggedIn, function (req, res, next) {
    teamperson.find({}, (err, docs)=>{
        res.render('adminpanel/team', { email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications, docs: docs, moment: moment });
    })
});

router.post('/lexmail', function (req, res, next) {
    var awsSesMail = require('aws-ses-mail');

    var sesMail = new awsSesMail();
    var sesConfig = {
        accessKeyId: "AKIAQFXTPLX2CNUSHP5C",
        secretAccessKey: "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",
        region: 'us-west-2'
    };
    sesMail.setConfig(sesConfig);

    var html = `Hi Amitabh,
                <br><br>
                You have a new query from ${req.body.Name} on Alexa.
                <br><br>
                Details:
                <br><br>
                Email: ${req.body.Email}
                <br>
                <br>
                Phone: ${req.body.Phone}
                <br><br>
                Query: ${req.body.Question}
                <br><br>
                regards,
                <br>
                <table width="351" cellspacing="0" cellpadding="0" border="0"> <tr> <td style="text-align:left;padding-bottom:10px"><a style="display:inline-block" href="https://www.ampdigital.co"><img style="border:none;" width="150" src="https://s1g.s3.amazonaws.com/36321c48a6698bd331dca74d7497797b.jpeg"></a></td> </tr> <tr> <td style="border-top:solid #000000 2px;" height="12"></td> </tr> <tr> <td style="vertical-align: top; text-align:left;color:#000000;font-size:12px;font-family:helvetica, arial;; text-align:left"> <span> </span> <br> <span style="font:12px helvetica, arial;">Email:&nbsp;<a href="mailto:amitabh@ampdigital.co" style="color:#3388cc;text-decoration:none;">amitabh@ampdigital.co</a></span> <br><br> <span style="margin-right:5px;color:#000000;font-size:12px;font-family:helvetica, arial">Registered Address: AMP Digital</span> 403, Sovereign 1, Vatika City, Sohna Road,, Gurugram, Haryana, 122018, India<br><br> <table cellpadding="0" cellpadding="0" border="0"><tr><td style="padding-right:5px"><a href="https://facebook.com/https://www.facebook.com/AMPDigitalNet/" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/23f7b48395f8c4e25e64a2c22e9ae190.png" alt="Facebook" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://twitter.com/https://twitter.com/amitabh26" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3949237f892004c237021ac9e3182b1d.png" alt="Twitter" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://linkedin.com/in/https://in.linkedin.com/company/ads4growth?trk=public_profile_topcard_current_company" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/dcb46c3e562be637d99ea87f73f929cb.png" alt="LinkedIn" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://youtube.com/https://www.youtube.com/channel/UCMOBtxDam_55DCnmKJc8eWQ" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3b2cb9ec595ab5d3784b2343d5448cd9.png" alt="YouTube" style="border:none;"></a></td></tr></table><a href="https://www.ampdigital.co" style="text-decoration:none;color:#3388cc;">www.ampdigital.co</a> </td> </tr> </table> <table width="351" cellspacing="0" cellpadding="0" border="0" style="margin-top:10px"> <tr> <td style="text-align:left;color:#aaaaaa;font-size:10px;font-family:helvetica, arial;"><p>AMP&nbsp;Digital is a Google Partner Company</p></td> </tr> </table> `;


    var options = {
        from: 'ampdigital.co <amitabh@ads4growth.com>',
        to: "amitabh@ads4growth.com",
        replyToAddresses: [req.body.Email],
        subject: `Chat Query`,
        content: '<html><head></head><body>' + html + '</body></html>'
    };

    sesMail.sendEmail(options, function (err, data) {
        // TODO sth....
        if (err) {
            console.log(err);
        }
        res.json(data);
    });
});

// Create a new forum
router.post('/addforum', function (req, res, next) {
    // res.json(Buffer.from(req.body.content).toString('base64'));
    var forum2 = new forum({
        title: req.body.title,
        description: req.body.description,
        date: new Date(),
        postedby_email: req.user.email,
        postedby_name: getusername(req.user), notifications: req.user.notifications + " " + req.user.local.lastname,
        elementid: req.body.elementid,
        topicid: req.body.topicid,
        moduleid: req.body.moduleid,
        modulename: req.body.modulename,
        coursename: req.body.coursename
        // content: Buffer.from(req.body.content).toString('base64')
    });
    forum2.save(function (err, results) {
        if (err) {
            res.json(err);
        }
        else {
            res.json(results);
        }
    });
});

router.get('/manage/buddingarketerapplications', isAdmin, function (req, res, next) {
    lmsUsers.find({ 'collegename': { $exists: true }, approved: { $ne: false } }, null, { sort: { date: -1 } }, function (err, docs) {
        res.render('adminpanel/bmpapplications', { email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications, docs: docs, moment: moment });
    });
});

/*GET courses page*/
router.get('/coursefeatures/:courseid', isAdmin, function (req, res, next) {
    coursefeatureModal.find({ 'deleted': { $ne: 'true' }, 'course_id': req.params.courseid }, function (err, faqdocs) {
        res.render('adminpanel/coursefeatures', { email: req.user.email, courseid: req.params.courseid, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications, faqdocs: faqdocs, moment: moment });

    });
});

/*GET courses page*/
router.get('/manage/bookdownloads', isAdmin, function (req, res, next) {
    bookdownload.find({}, function (err, docs) {
        res.render('adminpanel/bookdownload', { email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications, docs: docs, moment: moment });

    });
});

router.get('/manage/simulationtools', isAdmin, function (req, res, next) {
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;
    simulationtool.find({ deleted: { $ne: "true" } }, function (err, simulationtools) {
        res.render('adminpanel/simulationtools', { simulationtools: simulationtools, moment: moment, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
    });
});

/*GET contact requests page*/
router.get('/contact-requests', isAdmin, function (req, res, next) {
    Contactuser.find({}, function (err, docs) {
        res.render('adminpanel/contact_requests', { docs: docs, email: req.user.email });
    });
});

/*GET admin page*/
router.get('/admin', isAdmin, function (req, res, next) {
    lmsCourses.find({ 'deleted': { $ne: 'true' } }, function (err, courses) {
        res.render('adminpanel/payments', { courses: courses, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, moment: moment });
    });
});

/*GET contact requests page*/
router.get('/submissions', isAdmin, function (req, res, next) {
    lmsCourses.find({ 'deleted': { $ne: 'true' } }, function (err, courses) {
        res.render('adminpanel/submissions', { courses: courses, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, moment: moment });
    });
});

router.get('/quote', function (req, res, next) {
    quote.findOne({quote: req.query.quote}, function(err, quote){
        if(err){
            res.redirect("/manage/quotes");
        }
        else{
            res.render('quote', { quote: quote });
        }
    })
});

router.get('/datatable/submissions', function (req, res, next) {
    /*
   * Script:    DataTables server-side script for NODE and MONGODB
   * Copyright: 2018 - Siddharth Sogani
   */

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * Easy set variables
     */

    /* Array of columns to be displayed in DataTable
     */
    var $aColumns = ['submitted_by_name', 'submitted_by_email', 'assignment_name', 'topic_name', 'module_name', 'course_name', 'doc_url', 'submitted_on', 'grade'];

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
        var arr = [{ "submitted_by_name": { $regex: '' + req.query.sSearch + '', '$options': 'i' } }, { "submitted_by_email": { $regex: '' + req.query.sSearch + '', '$options': 'i' } }, { "assignment_name": { $regex: '' + req.query.sSearch + '', '$options': 'i' } }, { "topic_name": { $regex: '' + req.query.sSearch + '', '$options': 'i' } }, { "module_name": { $regex: '' + req.query.sSearch + '', '$options': 'i' } }, { "course_name": { $regex: '' + req.query.sSearch + '', '$options': 'i' } }];
        query.$or = arr;
    }

    var filterArray = [];
    if (req.query.fromdatefilter !== "") {
        console.log('11111');
        filterArray.push({ submitted_on: { $gte: req.query.fromdatefilter + ' 00:00' } })
        query.$and = filterArray;
    }
    if (req.query.todatefilter !== "") {
        console.log('1111');
        filterArray.push({ submitted_on: { $lte: req.query.todatefilter + ' 23:59' } })
        query.$and = filterArray;
    }
    if (req.query.purposefilter !== "") {
        console.log('222');
        filterArray.push({ "course_name": req.query.purposefilter })
        query.$and = filterArray;
    }

    /*
   * Ordering
   */
    var sortObject = { 'date': -1 };
    if (req.query.iSortCol_0 && req.query.iSortCol_0 == 0) {
        if (req.query.sSortDir_0 == 'desc') {
            var sortObject = {};
            var stype = 'submitted_by_name';
            var sdir = -1;
            sortObject[stype] = sdir;
        }
        else {
            var sortObject = {};
            var stype = 'submitted_by_name';
            var sdir = 1;
            sortObject[stype] = sdir;
        }

    }
    else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 1) {
        if (req.query.sSortDir_0 == 'desc') {
            var sortObject = {};
            var stype = 'submitted_by_email';
            var sdir = -1;
            sortObject[stype] = sdir;
        }
        else {
            var sortObject = {};
            var stype = 'submitted_by_email';
            var sdir = 1;
            sortObject[stype] = sdir;
        }
    }
    else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 2) {
        if (req.query.sSortDir_0 == 'desc') {
            var sortObject = {};
            var stype = 'assignment_name';
            var sdir = -1;
            sortObject[stype] = sdir;
        }
        else {
            var sortObject = {};
            var stype = 'assignment_name';
            var sdir = 1;
            sortObject[stype] = sdir;
        }
    }
    else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 3) {
        if (req.query.sSortDir_0 == 'desc') {
            var sortObject = {};
            var stype = 'topic_name';
            var sdir = -1;
            sortObject[stype] = sdir;
        }
        else {
            var sortObject = {};
            var stype = 'topic_name';
            var sdir = 1;
            sortObject[stype] = sdir;
        }
    }
    else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 4) {
        if (req.query.sSortDir_0 == 'desc') {
            var sortObject = {};
            var stype = 'module_name';
            var sdir = -1;
            sortObject[stype] = sdir;
        }
        else {
            var sortObject = {};
            var stype = 'module_name';
            var sdir = 1;
            sortObject[stype] = sdir;
        }
    }
    else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 5) {
        if (req.query.sSortDir_0 == 'desc') {
            var sortObject = {};
            var stype = 'course_name';
            var sdir = -1;
            sortObject[stype] = sdir;
        }
        else {
            var sortObject = {};
            var stype = 'course_name';
            var sdir = 1;
            sortObject[stype] = sdir;
        }
    }

    submission.find(query).skip(parseInt($sDisplayStart)).limit(parseInt($sLength)).sort(sortObject).exec(function (err, docs) {
        submission.count(query, function (err, count) {
            var aaData = [];
            for (let i = 0; i < (docs).length; i++) {
                var $row = [];
                for (var j = 0; j < ($aColumns).length; j++) {
                    if ($aColumns[j] == 'submitted_by_name') {
                        $row.push(docs[i][$aColumns[j]])
                    }
                    else if ($aColumns[j] == 'submitted_by_email') {
                        $row.push(docs[i][$aColumns[j]])
                    }
                    else if ($aColumns[j] == 'assignment_name') {
                        $row.push(docs[i][$aColumns[j]])
                    }
                    else if ($aColumns[j] == 'topic_name') {
                        $row.push(docs[i][$aColumns[j]])
                    }
                    else if ($aColumns[j] == 'module_name') {
                        $row.push(docs[i][$aColumns[j]])
                    }
                    else if ($aColumns[j] == 'course_name') {
                        $row.push(docs[i][$aColumns[j]])
                    }
                    else if ($aColumns[j] == 'doc_url') {
                        $row.push(`<a target="_blank" href="${docs[i][$aColumns[j]]}">Download</a>`)
                    }
                    else if ($aColumns[j] == 'submitted_on') {
                        $row.push(moment(docs[i]['submitted_on']).format("DD/MMM/YYYY HH:mm A"));
                    }
                    else {
                        $row.push(`<button class="btn btn-primary btn-sm">Grade</button>`);
                    }
                }
                aaData.push($row);
            }
            var sample = { "sEcho": req.query.sEcho, "iTotalRecords": count, "iTotalDisplayRecords": count, "aaData": aaData };
            res.json(sample);
        });
    });
});

router.get('/datatable/quotes', function (req, res, next) {
    /*
   * Script:    DataTables server-side script for NODE and MONGODB
   * Copyright: 2018 - Siddharth Sogani
   */

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * Easy set variables
     */

    /* Array of columns to be displayed in DataTable
     */
    var $aColumns = ['quote'];

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
        var arr = [{ "quote": { $regex: '' + req.query.sSearch + '', '$options': 'i' } }, { "author": { $regex: '' + req.query.sSearch + '', '$options': 'i' } }, { "genre": { $regex: '' + req.query.sSearch + '', '$options': 'i' } }];
        query.$or = arr;
    }

    var filterArray = [];
    if (req.query.fromdatefilter !== "") {
        
        filterArray.push({ submitted_on: { $gte: req.query.fromdatefilter + ' 00:00' } })
        query.$and = filterArray;
    }
    if (req.query.todatefilter !== "") {
        console.log('1111');
        filterArray.push({ submitted_on: { $lte: req.query.todatefilter + ' 23:59' } })
        query.$and = filterArray;
    }
    if (req.query.purposefilter !== "") {
        console.log('222');
        filterArray.push({ "course_name": req.query.purposefilter })
        query.$and = filterArray;
    }

    /*
   * Ordering
   */
    var sortObject = { 'quote': -1 };
    if (req.query.iSortCol_0 && req.query.iSortCol_0 == 0) {
        if (req.query.sSortDir_0 == 'desc') {
            var sortObject = {};
            var stype = 'quote';
            var sdir = -1;
            sortObject[stype] = sdir;
        }
        else {
            var sortObject = {};
            var stype = 'quote';
            var sdir = 1;
            sortObject[stype] = sdir;
        }

    }
    else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 1) {
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
    else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 2) {
        if (req.query.sSortDir_0 == 'desc') {
            var sortObject = {};
            var stype = 'genre';
            var sdir = -1;
            sortObject[stype] = sdir;
        }
        else {
            var sortObject = {};
            var stype = 'genre';
            var sdir = 1;
            sortObject[stype] = sdir;
        }
    }

    quote.find(query).skip(parseInt($sDisplayStart)).limit(parseInt($sLength)).sort({author:1}).exec(function (err, docs) {
        quote.count(query, function (err, count) {
            var aaData = [];
            for (let i = 0; i < (docs).length; i++) {
                var $row = [];
                for (var j = 0; j < ($aColumns).length; j++) {
                    $row.push(`<div>${(docs[i]["quote"])}
<br>
                        <i>Author: ${(docs[i]["author"])}</i>
                        <br>
                        <i>Genre: ${(docs[i]["genre"])}</i>
<br>
                        `+
                        `<a target="_blank" href="/quote/?quote=${docs[i]["quote"]}" class="btn btn-primary btn-sm">Generate Image</a></div>`); 
                }
                aaData.push($row);
            }
            var sample = { "sEcho": req.query.sEcho, "iTotalRecords": count, "iTotalDisplayRecords": count, "aaData": aaData };
            res.json(sample);
        });
    });
});


router.get('/datatable/forum', function (req, res, next) {
    /*
   * Script:    DataTables server-side script for NODE and MONGODB
   * Copyright: 2018 - Siddharth Sogani
   */

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * Easy set variables
     */

    /* Array of columns to be displayed in DataTable
     */
    var $aColumns = ['data'];

    /*
     * Paging
     */
    var $sDisplayStart = 0;
    var $sLength = "";
    if ((req.query.iDisplayStart) && req.query.iDisplayLength != '-1') {
        $sDisplayStart = req.query.iDisplayStart;
        $sLength = req.query.iDisplayLength;
    }

    if (req.query.moduleid !== "all") {
        var query = { isreply: { $ne: true }, moduleid: req.query.moduleid };
    }
    else {
        var query = { isreply: { $ne: true } };
    }
    /*
   * Filtering
   * NOTE this does not match the built-in DataTables filtering which does it
   * word by word on any field. It's possible to do here, but concerned about efficiency
   * on very large tables, and MySQL's regex functionality is very limited
   */
    if (req.query.sSearch != "") {
        var arr = [{ "title": { $regex: '' + req.query.sSearch + '', '$options': 'i' } }, { "description": { $regex: '' + req.query.sSearch + '', '$options': 'i' } }, { "buyer_firstname": { $regex: '' + req.query.sSearch + '', '$options': 'i' } }, { "buyer_email": { $regex: '' + req.query.sSearch + '', '$options': 'i' } }];
        query.$or = arr;
    }

    /*
   * Ordering
   */
    var sortObject = { 'date': -1 };

    forum.find(query).skip(parseInt($sDisplayStart)).limit(parseInt($sLength)).sort(sortObject).exec(function (err, docs) {
        forum.count(query, function (err, count) {
            var aaData = [];
            for (let i = 0; i < (docs).length; i++) {
                var $row = [];
                for (var j = 0; j < ($aColumns).length; j++) {
                    if ($aColumns[j] == 'data') {
                        var editable = "false";
                        var cls = "writereply hidden";
                        if (req.user.email == "amitabh@ads4growth.com" || req.user.email == "rakhee@ads4growth.com" || req.user.email == "vansh@ads4growth.com" || req.user.email == "amitabh26@gmail.com" || req.user.email == docs[i]["postedby_email"]) {
                            editable = "true";
                            cls = "writereply"
                        }
                        $row.push(`
                        <div class="media">
                        <div class="media-body">
                            <div class="row">
                            <div class="col-md-6">
                            <a data-editable="${editable}" class="viewreply" data-title="${docs[i]["title"]}" data-description="${docs[i]["description"]}" data-date="${docs[i]["date"]}" data-author="${docs[i]["postedby_name"]}" data-pk="${docs[i]["_id"]}" href="#" style="
                              font-size: large; text-align:left;
                          ">
                            <h4 class="mt-0">Q. ${docs[i]["title"]}</h4>
                            </a>
                            </div>
                            <div class="col-md-6 hidden-sm hidden-xs visible-md visible-lg">
                          </div>
                            </div>
                          <p style="margin:0%; margin-left: 4%;">${docs[i]["description"]}</p>
                          <span style="font-size: smaller; margin-left: 4%; color: #525252" class="pull-right">Posted by: ${docs[i]["postedby_name"]} &nbsp;&nbsp;
                          ${timeSince(docs[i]["date"])} ago</span>
                          <div>
                          </div>
                        </div>
                      </div>
                        `);
                    }
                }
                aaData.push($row);
            }
            var sample = { "sEcho": req.query.sEcho, "iTotalRecords": count, "iTotalDisplayRecords": count, "aaData": aaData };
            res.json(sample);
        });
    });
});

/*GET manage events page*/
router.get('/updatereferralids', function (req, res, next) {
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;
    lmsUsers.find({}, function (err, users) {
        for (let i = 0; i < users.length; i++) {
            lmsUsers.update(
                {
                    _id: safeObjectId(users[i]._id)
                },
                {
                    $set: { 'referralid': users[i].local.name.trim() + (1).toString() }
                }
                ,
                function (err, count) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log(count);
                    }
                });
        }
    });
});

/*POST new couponcode*/
router.post('/createcouponcode', function (req, res) {
    var name = req.body.name;
    var discount = req.body.discount;
    var type = req.body.type;
    var validfrom = req.body.validfrom;
    var validto = req.body.validto;
    var created = new Date();
    var deleted = false;
    var couponcode = new coupon({
        name: name,
        discount: discount,
        type: type,
        validfrom: validfrom,
        validto: validto,
        created: created,
        deleted: deleted
    });

    couponcode.save(function (err, results) {
        if (err) {
            res.json(err);
        }
        else {
            //res.json(results._id);
            res.redirect('/coupons');
        }
    });
});

router.post('/updateteam', function (req, res) {
    let setQuery = {};
    setQuery[req.body.name] = req.body.value
    teamperson.update(
        {
            _id: req.body.pk
        },
        {
            $set: setQuery
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

router.put('/removebmp', function (req, res) {
    var testimonialid = req.body.testimonialid;
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;

    lmsUsers.update(
        {
            _id: safeObjectId(testimonialid)
        },
        {
            $set: { 'approved': false }
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

router.put('/bmpapproval', function (req, res) {
    var testimonialid = req.body.testimonialid;
    var firstname = req.body.firstname;
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;

    lmsUsers.update(
        {
            _id: safeObjectId(testimonialid)
        },
        {
            $set: { 'approved': true }
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

            var html = `
            <div class="gmail_quote"><div style="height:100%;margin:0;padding:0;width:100%"><center><table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="m_-4447717970218659537m_7530102750483444611m_210077121554342475m_8553946962570584013m_4108118680230763930bodyTable" style="border-collapse:collapse;height:100%;margin:0;padding:0;width:100%"><tbody><tr><td align="center" valign="top" id="m_-4447717970218659537m_7530102750483444611m_210077121554342475m_8553946962570584013m_4108118680230763930bodyCell" style="height:100%;margin:0;padding:0;width:100%"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse"><tbody><tr><td align="center" valign="top" id="m_-4447717970218659537m_7530102750483444611m_210077121554342475m_8553946962570584013m_4108118680230763930templateHeader" style="background:#f7f7f7 none no-repeat center/cover;background-color:#f7f7f7;background-image:none;background-repeat:no-repeat;background-position:center;background-size:cover;border-top:0;border-bottom:0;padding-top:45px;padding-bottom:45px"><table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;max-width:600px!important">
                                        <tbody><tr>
                                            <td valign="top" style="background:transparent none no-repeat center/cover;background-color:transparent;background-image:none;background-repeat:no-repeat;background-position:center;background-size:cover;border-top:0;border-bottom:0;padding-top:0;padding-bottom:0"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse">
    <tbody>
            <tr>
                <td valign="top" style="padding:9px">
                    <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" style="min-width:100%;border-collapse:collapse">
                        <tbody><tr>
                            <td valign="top" style="padding-right:9px;padding-left:9px;padding-top:0;padding-bottom:0;text-align:center">


                                        <img align="center" alt="" src="https://ci5.googleusercontent.com/proxy/dEd3y1qvKnB9EDuDNhYsE2IZgUV2xO7lSBDOEPXi9nqb-eIBSZRcytM8yIAzxv8zgkjwtyUxNJKdS5sXAyoaoMSbiLJmXMKVVlKxo-jDWsIJz1elT4RRTNlM__eOdVTvpssX3vUXmcYZuyX8V_p7TBRGhB1VZJw=s0-d-e1-ft#https://mcusercontent.com/21860ab549ae02eeb610e2aa6/images/1a33af4e-3191-486d-847f-5a0045f8803f.jpeg" width="564" style="max-width:1000px;padding-bottom:0;display:inline!important;vertical-align:bottom;border:0;height:auto;outline:none;text-decoration:none" class="CToWUd a6T" tabindex="0"><div class="a6S" dir="ltr" style="opacity: 0.01; left: 736.781px; top: 600.222px;"><div id=":mj" class="T-I J-J5-Ji aQv T-I-ax7 L3 a5q" role="button" tabindex="0" aria-label="Download attachment " data-tooltip-class="a1V" data-tooltip="Download"><div class="aSK J-J5-Ji aYr"></div></div></div>


                            </td>
                        </tr>
                    </tbody></table>
                </td>
            </tr>
    </tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse">
    <tbody>
        <tr>
            <td valign="top" style="padding-top:9px">
              	
			
				
                <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%;min-width:100%;border-collapse:collapse" width="100%">
                    <tbody><tr>

                        <td valign="top" style="padding:0px 18px 9px;word-break:break-word;color:rgb(117,117,117);font-size:16px;line-height:150%;text-align:left">

                            <h1 style="display:block;margin:0px;padding:0px;color:rgb(34,34,34);font-size:40px;font-style:normal;font-weight:bold;line-height:150%;letter-spacing:normal;text-align:center"><font face="arial narrow, sans-serif">Congratulations ${firstname}!</font></h1>

                        </td>
                    </tr>
                </tbody></table>
				

				
            </td>
        </tr>
    </tbody>
</table></td>
                                        </tr>
                                    </tbody></table>
                                    
                                </td>
                            </tr>
                            <tr>
                                <td align="center" valign="top" id="m_-4447717970218659537m_7530102750483444611m_210077121554342475m_8553946962570584013m_4108118680230763930templateBody" style="background:#ffffff none no-repeat center/cover;background-color:#ffffff;background-image:none;background-repeat:no-repeat;background-position:center;background-size:cover;border-top:0;border-bottom:0;padding-top:36px;padding-bottom:45px">
                                    
                                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;max-width:600px!important">
                                        <tbody><tr>
                                            <td valign="top" style="background:transparent none no-repeat center/cover;background-color:transparent;background-image:none;background-repeat:no-repeat;background-position:center;background-size:cover;border-top:0;border-bottom:0;padding-top:0;padding-bottom:0"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse">
    <tbody>
        <tr>
            <td valign="top" style="padding-top:9px">
              	
			
				
                <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%;min-width:100%;border-collapse:collapse" width="100%">
                    <tbody><tr>

                        <td valign="top" style="padding:0px 18px 9px;word-break:break-word;color:rgb(117,117,117);font-family:Helvetica;line-height:150%;text-align:left">

                            <h3 style="display:block;margin:0px;padding:0px;color:rgb(68,68,68);font-family:Helvetica;font-style:normal;font-weight:bold;line-height:150%;letter-spacing:normal;text-align:left"><font size="4">You are selected for the AMP Digital's Budding Marketer Program.</font></h3>

<p style="font-size:16px;margin:10px 0px;padding:0px;color:rgb(117,117,117);font-family:Helvetica;line-height:150%;text-align:left"><span style="color:#000000">We hope that you are excited to embark on a 90-day exciting journey with us&nbsp;.<br>
<br>
You now have to complete the joining formalities.</span></p><ul style="font-size:16px">
	<li><span style="color:#000000">You have to join this&nbsp;</span><a href="https://online.us18.list-manage.com/track/click?u=21860ab549ae02eeb610e2aa6&amp;id=92fe14d5fa&amp;e=f0c8241cf6" style="color:#007c89;font-weight:normal;text-decoration:underline" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://online.us18.list-manage.com/track/click?u%3D21860ab549ae02eeb610e2aa6%26id%3D92fe14d5fa%26e%3Df0c8241cf6&amp;source=gmail&amp;ust=1597472990893000&amp;usg=AFQjCNFa_6_yDQoouE8-EmLSUX5O_FVLCw"><span style="color:#0000ff">Whatsapp</span></a><span style="color:#0000ff">&nbsp;</span><span style="color:#000000">group and you need to follow AMP Digital on:&nbsp;</span><a href="https://online.us18.list-manage.com/track/click?u=21860ab549ae02eeb610e2aa6&amp;id=520c33f2ab&amp;e=f0c8241cf6" style="color:#007c89;font-weight:normal;text-decoration:underline" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://online.us18.list-manage.com/track/click?u%3D21860ab549ae02eeb610e2aa6%26id%3D520c33f2ab%26e%3Df0c8241cf6&amp;source=gmail&amp;ust=1597472990893000&amp;usg=AFQjCNHnzhRJo16jcPyOSUz0u79WeV0Y1w"><span style="color:#0000ff">Instagram</span></a><span style="color:#000000">&nbsp;and&nbsp;</span><a href="https://online.us18.list-manage.com/track/click?u=21860ab549ae02eeb610e2aa6&amp;id=5c569a4698&amp;e=f0c8241cf6" style="color:#007c89;font-weight:normal;text-decoration:underline" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://online.us18.list-manage.com/track/click?u%3D21860ab549ae02eeb610e2aa6%26id%3D5c569a4698%26e%3Df0c8241cf6&amp;source=gmail&amp;ust=1597472990893000&amp;usg=AFQjCNFwlY1r9dvFRbh5mgC8pMKfER43gA"><span style="color:#0000ff">LinkedIn</span></a></li>
</ul>

                        </td>
                    </tr>
                </tbody></table>
				

				
            </td>
        </tr>
    </tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse">
    <tbody>
        <tr>
            <td valign="top" style="padding-top:9px">
              	
			
				
                <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%;min-width:100%;border-collapse:collapse" width="100%">
                    <tbody><tr>

                        <td valign="top" style="padding-top:0;padding-right:18px;padding-bottom:9px;padding-left:18px;word-break:break-word;color:#757575;font-family:Helvetica;font-size:16px;line-height:150%;text-align:left">

                            <h2 style="text-align:center;display:block;margin:0;padding:0;color:#222222;font-family:Helvetica;font-size:34px;font-style:normal;font-weight:bold;line-height:150%;letter-spacing:normal"><span style="font-size:26px">Join Now</span></h2>

                        </td>
                    </tr>
                </tbody></table>
				

				
            </td>
        </tr>
    </tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse">
    <tbody>
        <tr>
            <td style="padding-top:0;padding-right:18px;padding-bottom:18px;padding-left:18px" valign="top" align="center">
                <table border="0" cellpadding="0" cellspacing="0" style="border-collapse:separate!important;border-radius:14px;background-color:#5fd17f">
                    <tbody>
                        <tr>
                            <td align="center" valign="middle" style="font-family:Arial;font-size:16px;padding:18px">
                                <a title="Whatsapp " href="https://online.us18.list-manage.com/track/click?u=21860ab549ae02eeb610e2aa6&amp;id=8c1791072c&amp;e=f0c8241cf6" style="font-weight:bold;letter-spacing:normal;line-height:100%;text-align:center;text-decoration:none;color:#ffffff;display:block" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://online.us18.list-manage.com/track/click?u%3D21860ab549ae02eeb610e2aa6%26id%3D8c1791072c%26e%3Df0c8241cf6&amp;source=gmail&amp;ust=1597472990893000&amp;usg=AFQjCNFyS_9q3wGqwKCcaDWdhd3QtdbC5Q">Whatsapp </a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse">
    <tbody>
        <tr>
            <td style="padding-top:0;padding-right:18px;padding-bottom:18px;padding-left:18px" valign="top" align="center">
                <table border="0" cellpadding="0" cellspacing="0" style="border-collapse:separate!important;border-radius:15px;background-color:#ff0066">
                    <tbody>
                        <tr>
                            <td align="center" valign="middle" style="font-family:Arial;font-size:16px;padding:18px">
                                <a title="Instagram" href="https://online.us18.list-manage.com/track/click?u=21860ab549ae02eeb610e2aa6&amp;id=a56879cec5&amp;e=f0c8241cf6" style="font-weight:bold;letter-spacing:normal;line-height:100%;text-align:center;text-decoration:none;color:#ffffff;display:block" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://online.us18.list-manage.com/track/click?u%3D21860ab549ae02eeb610e2aa6%26id%3Da56879cec5%26e%3Df0c8241cf6&amp;source=gmail&amp;ust=1597472990893000&amp;usg=AFQjCNFSCi47xizXGwPborJFCHUsrsr-9A">Instagram</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse">
    <tbody>
        <tr>
            <td style="padding-top:0;padding-right:18px;padding-bottom:18px;padding-left:18px" valign="top" align="center">
                <table border="0" cellpadding="0" cellspacing="0" style="border-collapse:separate!important;border-radius:13px;background-color:#0c0d2d">
                    <tbody>
                        <tr>
                            <td align="center" valign="middle" style="font-family:Arial;font-size:18px;padding:15px">
                                <a title="LinkedIn" href="https://online.us18.list-manage.com/track/click?u=21860ab549ae02eeb610e2aa6&amp;id=ee41d5a094&amp;e=f0c8241cf6" style="font-weight:bold;letter-spacing:normal;line-height:100%;text-align:center;text-decoration:none;color:#ffffff;display:block" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://online.us18.list-manage.com/track/click?u%3D21860ab549ae02eeb610e2aa6%26id%3Dee41d5a094%26e%3Df0c8241cf6&amp;source=gmail&amp;ust=1597472990893000&amp;usg=AFQjCNFv38ZEIR3fSoQ_bz6_YT7_gl5Epg">LinkedIn</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse">
    <tbody>
        <tr>
            <td valign="top" style="padding-top:9px">
              	
			
				
                <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%;min-width:100%;border-collapse:collapse" width="100%">
                    <tbody><tr>

                        <td valign="top" style="padding-top:0;padding-right:18px;padding-bottom:9px;padding-left:18px;word-break:break-word;color:#757575;font-family:Helvetica;font-size:16px;line-height:150%;text-align:left">

                            <span style="color:#000000"><strong>Regards</strong>,<br>
AMP Digital</span>
                        </td>
                    </tr>
                </tbody></table>
				

				
            </td>
        </tr>
    </tbody>
</table></td>
                                        </tr>
                                    </tbody></table>
                                    
                                </td>
                            </tr>
                            <tr>
                                <td align="center" valign="top" id="m_-4447717970218659537m_7530102750483444611m_210077121554342475m_8553946962570584013m_4108118680230763930templateFooter" style="background:#333333 none no-repeat center/cover;background-color:#333333;background-image:none;background-repeat:no-repeat;background-position:center;background-size:cover;border-top:0;border-bottom:0;padding-top:45px;padding-bottom:63px">
                                    
                                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;max-width:600px!important">
                                        <tbody><tr>
                                            <td valign="top" style="background:transparent none no-repeat center/cover;background-color:transparent;background-image:none;background-repeat:no-repeat;background-position:center;background-size:cover;border-top:0;border-bottom:0;padding-top:0;padding-bottom:0"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse">
    <tbody>
        <tr>
            <td align="center" valign="top" style="padding:9px">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse">
    <tbody><tr>
        <td align="center" style="padding-left:9px;padding-right:9px">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse">
                <tbody><tr>
                    <td align="center" valign="top" style="padding-top:9px;padding-right:9px;padding-left:9px">
                        <table align="center" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
                            <tbody><tr>
                                <td align="center" valign="top">
                                    

                                        


                                            <table align="left" border="0" cellpadding="0" cellspacing="0" style="display:inline;border-collapse:collapse">
                                                <tbody><tr>
                                                    <td valign="top" style="padding-right:10px;padding-bottom:9px">
                                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse">
                                                            <tbody><tr>
                                                                <td align="left" valign="middle" style="padding-top:5px;padding-right:10px;padding-bottom:5px;padding-left:9px">
                                                                    <table align="left" border="0" cellpadding="0" cellspacing="0" width="" style="border-collapse:collapse">
                                                                        <tbody><tr>

                                                                                <td align="center" valign="middle" width="24">
                                                                                    <a href="https://online.us18.list-manage.com/track/click?u=21860ab549ae02eeb610e2aa6&amp;id=9641daa168&amp;e=f0c8241cf6" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://online.us18.list-manage.com/track/click?u%3D21860ab549ae02eeb610e2aa6%26id%3D9641daa168%26e%3Df0c8241cf6&amp;source=gmail&amp;ust=1597472990893000&amp;usg=AFQjCNFuFA8BpWjT5D_R-cOhAjM2ietgKQ"><img src="https://ci3.googleusercontent.com/proxy/FpKC1aFcvfDPI1MS2LGUKplthRlZAG8WmLpjZYlZ2DOVuaiIilo4gVSFwe9gvUOVkuK6WMw2dqEuxy4pfw2A5qShDQXqB56JtSw0EIbTBKiBrCFwkmwFDV8Q4ZB70NkcRlkMJuf5cw=s0-d-e1-ft#https://cdn-images.mailchimp.com/icons/social-block-v2/outline-light-linkedin-48.png" alt="LinkedIn" style="display:block;border:0;height:auto;outline:none;text-decoration:none" height="24" width="24" class="CToWUd"></a>
                                                                                </td>


                                                                        </tr>
                                                                    </tbody></table>
                                                                </td>
                                                            </tr>
                                                        </tbody></table>
                                                    </td>
                                                </tr>
                                            </tbody></table>

                                        

                                        


                                            <table align="left" border="0" cellpadding="0" cellspacing="0" style="display:inline;border-collapse:collapse">
                                                <tbody><tr>
                                                    <td valign="top" style="padding-right:10px;padding-bottom:9px">
                                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse">
                                                            <tbody><tr>
                                                                <td align="left" valign="middle" style="padding-top:5px;padding-right:10px;padding-bottom:5px;padding-left:9px">
                                                                    <table align="left" border="0" cellpadding="0" cellspacing="0" width="" style="border-collapse:collapse">
                                                                        <tbody><tr>

                                                                                <td align="center" valign="middle" width="24">
                                                                                    <a><img src="https://ci5.googleusercontent.com/proxy/Ihh9hEwk_36d3lzL_tLmGaqmGhc-dLqZP-II9LpKgUDCh37Kvw1N4-DJsrxuyAA9V1NNx3975BQO5w7DNVWvFHpPM4gkDm8eMVCLYy_PtGWEZAxMuaULgOR-6W0K_1sgXOcwNMtgGVE=s0-d-e1-ft#https://cdn-images.mailchimp.com/icons/social-block-v2/outline-light-instagram-48.png" alt="Instagram" style="display:block;border:0;height:auto;outline:none;text-decoration:none" height="24" width="24" class="CToWUd"></a>
                                                                                </td>


                                                                        </tr>
                                                                    </tbody></table>
                                                                </td>
                                                            </tr>
                                                        </tbody></table>
                                                    </td>
                                                </tr>
                                            </tbody></table>

                                        

                                        


                                            <table align="left" border="0" cellpadding="0" cellspacing="0" style="display:inline;border-collapse:collapse">
                                                <tbody><tr>
                                                    <td valign="top" style="padding-right:10px;padding-bottom:9px">
                                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse">
                                                            <tbody><tr>
                                                                <td align="left" valign="middle" style="padding-top:5px;padding-right:10px;padding-bottom:5px;padding-left:9px">
                                                                    <table align="left" border="0" cellpadding="0" cellspacing="0" width="" style="border-collapse:collapse">
                                                                        <tbody><tr>

                                                                                <td align="center" valign="middle" width="24">
                                                                                    <a href="https://online.us18.list-manage.com/track/click?u=21860ab549ae02eeb610e2aa6&amp;id=9420a6bb15&amp;e=f0c8241cf6" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://online.us18.list-manage.com/track/click?u%3D21860ab549ae02eeb610e2aa6%26id%3D9420a6bb15%26e%3Df0c8241cf6&amp;source=gmail&amp;ust=1597472990893000&amp;usg=AFQjCNFyANsKOt9Jn30ulSuAv46JKXOgoA"><img src="https://ci6.googleusercontent.com/proxy/uZ0yuxmORppOSAVlAI9An9dTGgd5WLSQ0CBL7MLu_J4uk8Z1QO7RWFmdlkUYkmd_GLhwph5RoVCp9eKrXzEQnDQ91cNlGygasb_4p2fT-TnBvWoJAX8mqJXeyuG36Kto6QrY=s0-d-e1-ft#https://cdn-images.mailchimp.com/icons/social-block-v2/outline-light-link-48.png" alt="Website" style="display:block;border:0;height:auto;outline:none;text-decoration:none" height="24" width="24" class="CToWUd"></a>
                                                                                </td>


                                                                        </tr>
                                                                    </tbody></table>
                                                                </td>
                                                            </tr>
                                                        </tbody></table>
                                                    </td>
                                                </tr>
                                            </tbody></table>

                                        

                                        


                                            <table align="left" border="0" cellpadding="0" cellspacing="0" style="display:inline;border-collapse:collapse">
                                                <tbody><tr>
                                                    <td valign="top" style="padding-right:0;padding-bottom:9px">
                                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse">
                                                            <tbody><tr>
                                                                <td align="left" valign="middle" style="padding-top:5px;padding-right:10px;padding-bottom:5px;padding-left:9px">
                                                                    <table align="left" border="0" cellpadding="0" cellspacing="0" width="" style="border-collapse:collapse">
                                                                        <tbody><tr>

                                                                                <td align="center" valign="middle" width="24">
                                                                                    <a href="mailto:keshavbang56@gmail.com" target="_blank"><img src="https://ci6.googleusercontent.com/proxy/r8K5oM5kDIke3daEK9KkESJqBEXQoW6dyzSWbm8Yivp-G4gl-9ZgU6_ZW8SUQnIZ07k76zAM1ceKgvicUSmz5C1LO1hq6c6UyIWfUwEO1_R78m2qvBKJszhjTFbt6DMGELcu2g-k8yLRiFcaRak=s0-d-e1-ft#https://cdn-images.mailchimp.com/icons/social-block-v2/outline-light-forwardtofriend-48.png" alt="Email" style="display:block;border:0;height:auto;outline:none;text-decoration:none" height="24" width="24" class="CToWUd"></a>
                                                                                </td>


                                                                        </tr>
                                                                    </tbody></table>
                                                                </td>
                                                            </tr>
                                                        </tbody></table>
                                                    </td>
                                                </tr>
                                            </tbody></table>

                                        

                                    
                                </td>
                            </tr>
                        </tbody></table>
                    </td>
                </tr>
            </tbody></table>
        </td>
    </tr>
</tbody></table>

            </td>
        </tr>
    </tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse;table-layout:fixed!important">
    <tbody>
        <tr>
            <td style="min-width:100%;padding:18px"><br></td></tr></tbody></table><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse"><tbody></tbody></table></td></tr></tbody></table>
                                    
                                </td>
                            </tr>
                        </tbody></table>
                        
                    </td>
                </tr>
            </tbody></table>
        </center>
    <div style="height:100%;margin:0;padding:0;width:100%"><br></div><img src="https://ci3.googleusercontent.com/proxy/_J6KWrf3GmV2wyeeYd9biZxu__AdIquUEDyJ81PzXFc-pQyknenXpbSacDR1GF9GXOWO9XEPjMuktdsslHNFCiyUKoMclGjqs_Va7NK-0X-aHgXC41FvZjlaEPUf3fbGGnX63usVXvvGfvAaDJiPQ7PH7C1TvOCPMyh6Wg=s0-d-e1-ft#https://online.us18.list-manage.com/track/open.php?u=21860ab549ae02eeb610e2aa6&amp;id=925287dab4&amp;e=f0c8241cf6" height="1" width="1" class="CToWUd">==============================<wbr>===================</div><div>Visit&nbsp;<span style="font-size:12.8px"><b><a href="http://www.newsapp.io/" target="_blank" data-saferedirecturl="https://www.google.com/url?q=http://www.newsapp.io/&amp;source=gmail&amp;ust=1597472990894000&amp;usg=AFQjCNFizbbglFogqBYelFwMeVKczQEAvw">www.NewsApp.io</a></b>&nbsp;for l</span><span style="font-size:12.8px">atest Digital Marketing News &amp; Jobs&nbsp;</span></div><div><span style="font-size:12.8px">==============================<wbr>===================</span></div><div class="yj6qo"></div><div class="adL">
</div></div>
            `
            var options = {
                from: 'ampdigital.co <amitabh@ads4growth.com>',
                to: req.body.email,
                subject: `Congratulations ${firstname} ! You are selected for the AMP Digital's Budding Marketer Program💥`,
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
function timeSince(date) {
    var seconds = Math.floor((new Date() - date) / 1000);
    var interval = Math.floor(seconds / 31536000);
    if (interval > 1) {
        return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
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
