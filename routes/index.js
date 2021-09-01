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

/**
 * Home Page
 */
router.get('/', myLogger, function (req, res, next) {
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
router.get('/termsofservice', myLogger, function (req, res, next) {
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
router.get('/privacypolicy', myLogger, function (req, res, next) {
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
 * Google Ads Simulator Tool
 */
router.get('/tools/google-ads-simulator', myLogger, function (req, res, next) {
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
router.get('/signin', myLogger, function (req, res, next) {
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
router.get('/signup', myLogger, function (req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect(req.session.returnTo);
    }
    else {
        res.render('signup', { signupMessage: req.flash('signupMessage'), title: 'Express' });
    }
});

/* GET blog post page. */
router.get('/blog/:blogurl', myLogger, function (req, res, next) {
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

router.get('/registration/activate/profile/user/:email/:password/:sessionreturnTo', async (req, res, next)=>{
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
                        var html = `Hello,
                        <br><br>
                        Welcome to AMP Digital and thanks for Registering on AMP Digital, your place to learn Digital
        Marketing.
                        <br>
                        <br>
                        You can learn about our world class training programs here:
                        <br>
                        <br>
                        <a style="text-decoration: none!important;" href="http://www.ampdigital.co/#courses"><div style="width:220px;height:100%;color:#ffffff;background-color:#7fbf4d;border:1px solid #63a62f;border-bottom:1px solid #5b992b;background-image:-webkit-linear-gradient(top,#7fbf4d,#63a62f);background-image:-moz-linear-gradient(top,#7fbf4d,#63a62f);background-image:-ms-linear-gradient(top,#7fbf4d,#63a62f);background-image:-o-linear-gradient(top,#7fbf4d,#63a62f);background-image:linear-gradient(top,#7fbf4d,#63a62f);border-radius:3px;line-height:1;padding:7px 0 8px 0;text-align:center"><span>AMP Digital</span></div></a>
                        <br>
                        We have built the training programs keeping the industry in mind so that you can start with your
                        career in digital with right earnest. We have also built an awesome referral program so that you can
                        earn by referring your friends to our programs.
                        <br>
                        <br>
                        Look forward to having you as a part of our program.  If you have any questions, please feel free to reply to this email and we will be happy to assist you.
        <br><br>
        <i>In case of any query, you can reply back to this mail.</i>
        <br><br>
        
                        Best Wishes,
                        <br>
                        <table width="351" cellspacing="0" cellpadding="0" border="0"> <tr> <td style="text-align:left;padding-bottom:10px"><a style="display:inline-block" href="https://www.ampdigital.co"><img style="border:none;" width="150" src="https://s1g.s3.amazonaws.com/36321c48a6698bd331dca74d7497797b.jpeg"></a></td> </tr> <tr> <td style="border-top:solid #000000 2px;" height="12"></td> </tr> <tr> <td style="vertical-align: top; text-align:left;color:#000000;font-size:12px;font-family:helvetica, arial;; text-align:left"> <span> </span> <br> <span style="font:12px helvetica, arial;">Email:&nbsp;<a href="mailto:amitabh@ampdigital.co" style="color:#3388cc;text-decoration:none;">amitabh@ampdigital.co</a></span> <br><br> <span style="margin-right:5px;color:#000000;font-size:12px;font-family:helvetica, arial">Registered Address: AMP Digital</span> 403, Sovereign 1, Vatika City, Sohna Road,, Gurugram, Haryana, 122018, India<br><br> <table cellpadding="0" cellpadding="0" border="0"><tr><td style="padding-right:5px"><a href="https://facebook.com/https://www.facebook.com/AMPDigitalNet/" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/23f7b48395f8c4e25e64a2c22e9ae190.png" alt="Facebook" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://twitter.com/https://twitter.com/amitabh26" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3949237f892004c237021ac9e3182b1d.png" alt="Twitter" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://linkedin.com/in/https://in.linkedin.com/company/ads4growth?trk=public_profile_topcard_current_company" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/dcb46c3e562be637d99ea87f73f929cb.png" alt="LinkedIn" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://youtube.com/https://www.youtube.com/channel/UCMOBtxDam_55DCnmKJc8eWQ" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3b2cb9ec595ab5d3784b2343d5448cd9.png" alt="YouTube" style="border:none;"></a></td></tr></table><a href="https://www.ampdigital.co" style="text-decoration:none;color:#3388cc;">www.ampdigital.co</a> </td> </tr> </table> <table width="351" cellspacing="0" cellpadding="0" border="0" style="margin-top:10px"> <tr> <td style="text-align:left;color:#aaaaaa;font-size:10px;font-family:helvetica, arial;"><p>AMP&nbsp;Digital is a Google Partner Company</p></td> </tr> </table>  `;
        
                        var options = {
                            from: 'ampdigital.co <amitabh@ads4growth.com>',
                            to: email,
                            subject: 'Welcome to AMP Digital!',
                            content: '<html><head></head><body>' + html + '</body></html>'
                        };

                        sesMail.sendEmail(options, function (err, data) {
                            // TODO sth....
                            console.log(err);
                            // res.redirect("/");
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

// router.get('/sendyapi', function (req, res, next) {
//     var Sendy = require('sendy-api'),
//         sendy = new Sendy('http://sendy.ampdigital.co/', 'tyYabXqRCZ8TiZho0xtJ');

//     var arr = [];
//     lmsUsers.find({}).sort({ date: -1 }).exec(function (err, docs) {
//         for (var i = 0; i < docs.length; i++) {
//             if (docs[i]["email"] && docs[i].local["name"]) {
//                 sendy.subscribe({ api_key: 'tyYabXqRCZ8TiZho0xtJ', name: docs[i].local["name"], email: docs[i]["email"], list_id: '763VYAUcr3YYkNmJQKawPiXg' }, function (err, result) {
//                     if (err) console.log(err.toString());
//                     else console.log('Success: ' + result);
//                 });
//                 // arr.push({email: docs[i]["email"], name: docs[i].local["name"].replace(/ .*/,'')});
//             }
//         }
//         // res.json(docs.length);
//     });
// });

// router.get('/sendyapi2', function (req, res, next) {
//     var Sendy = require('sendy-api'),
//         sendy = new Sendy('http://sendy.ampdigital.co/', 'tyYabXqRCZ8TiZho0xtJ');

//     var arr = [];
//     webinaree.find({}).exec(function (err, docs) {
//         for (var i = 0; i < docs.length; i++) {
//             if (docs[i]["email"] && docs[i]["firstname"]) {
//                 sendy.subscribe({ api_key: 'tyYabXqRCZ8TiZho0xtJ', name: docs[i]["firstname"], email: docs[i]["email"], list_id: 'qfrjwMkLuBzWETooe74W7Q' }, function (err, result) {
//                     if (err) console.log(err.toString());
//                     else console.log('Success: ' + result);
//                 });
//             }
//         }
//         res.json(docs.length);
//     });
// });

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

router.post('/forumuploadons3', function (req, res, next) {
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
                        lmsForums.update(
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
        // res.json(imageFile);
    }

});

router.post('/uploadons4', function (req, res, next) {
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
                        res.json(url);
                    }
                });
            }
        });
        // res.json(imageFile);
    }

});

router.put('/uploadimage', function (req, res) {
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

router.put('/uploadcompanylogo', function (req, res) {
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;

    var doc = req.body.image;
    var element_id = req.body.id;
    var fieldname = req.body.fieldname;
    var updateObj = {};
    updateObj[fieldname] = doc;

    job.update(
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

router.get('/edit-jobs', myLogger, function (req, res, next) {
    res.redirect("/admin");
});

router.get('/view-applications', myLogger, function (req, res, next) {
    if (req.isAuthenticated()) {
        job.find({ 'deleted': { $ne: 'true' }, email: req.user.email }, function (err, docs) {
            res.render('adminpanel/jobs', { email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications, docs: docs, moment: moment });
        });
    }
    else {
        res.redirect("/");
    }
});

/*Passport Signup*/
router.post('/signup', passport.authenticate('local-signup-email-verification', {
    successRedirect: '/',
    failureRedirect: '/teacher',
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

    router.post('/paymentsignup3',
    passport.authenticate('local-signup', { failureRedirect: '/courses/google-ads-certification-course' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/courses/seo-workshop' + '?batchdate=' + req.body.batchdate + '&payment=true' || '/');
        // delete req.session.returnTo;
    });


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

router.get('/thankyoubuddingmarketer', myLogger, function (req, res, next) {
    if (req.isAuthenticated()) {
        res.render("thankyoubuddingmarketerapplication")
    }
    else {
        res.redirect("/");
    }
});

router.get('/updateanswered',  function (req, res, next) {
        forumcomment.update(
            {moduleid: "5ba67873bda6d500142e2d22", rootid: { $type: 10 }},
            {
                $set: {answered: true, replies: 1}
            }
            ,
            {multi: true},
            function (err, count) {
                console.log(count);
            })
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

router.post('/jobspost', function (req, res, next) {
    var bucketParams = { Bucket: 'ampdigital' };
    s3.createBucket(bucketParams);
    var s3Bucket = new aws.S3({ params: { Bucket: 'ampdigital' } });
    // res.json('succesfully uploaded the image!');
    if (!req.files) {
        res.json('NO');
    }
    else if (req.files.avatar) {
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
                        var jobObj = new job({
                            email: req.user.email,
                            company: req.body.company,
                            companylogo: url,
                            jobtitle: req.body.jobtitle,
                            state: req.body.state,
                            city: req.body.city,
                            remote: req.body.remote,
                            employmenttype: req.body.employmenttype,
                            senioritylevel: req.body.senioritylevel,
                            jobdescription: req.body.jobdescription,
                            skillkeywords: Array.isArray(req.body.skillkeywords) ? req.body.skillkeywords.join(","): req.body.skillkeywords,
                            optradio: req.body.optradio,
                            recruiterwebsite: req.body.recruiterwebsite,
                            date: new Date()
                        });
                        jobObj.save(function (err, results) {
                            if (err) {
                                res.json(err);
                            }
                            else {
                                res.render('jobthankyoupage', { title: 'Express', email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
                            }
                        });
                    }
                });
            }
        });
        // res.json(imageFile);
    }
    else {
        var jobObj = new job({
            email: req.user.email,
            company: req.body.company,
            jobtitle: req.body.jobtitle,
            state: req.body.state,
            city: req.body.city,
            remote: req.body.remote,
            employmenttype: req.body.employmenttype,
            senioritylevel: req.body.senioritylevel,
            jobdescription: req.body.jobdescription,
            skillkeywords: Array.isArray(req.body.skillkeywords) ? req.body.skillkeywords.join(","): req.body.skillkeywords,
            optradio: req.body.optradio,
            recruiterwebsite: req.body.recruiterwebsite,
            date: new Date()
        });
        jobObj.save(function (err, results) {
            if (err) {
                res.json(err);
            }
            else {
                res.render('jobthankyoupage', { title: 'Express', email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
            }
        });
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
function getPathFromUrl(url) {
    return url.split("?")[0];
}

router.post('/jobfilter', function (req, res, next) {
    var searchfilter = req.body.searchfilter;
    var employmenttype = req.body.employmenttype;
    var senioritylevel = req.body.senioritylevel;
    var remote = req.body.remote;
    var state = req.body.state;
    var city = req.body.city;
    var query = { deleted: { $nin: ["true", true] }, approved: true };
    var filterArray = [];

    if (searchfilter !== "") {
        console.log('11111');
        filterArray.push({ "jobtitle": { $regex: '' + searchfilter + '', '$options': 'i' } })
        filterArray.push({ "company": { $regex: '' + searchfilter + '', '$options': 'i' } })
        filterArray.push({ "state": { $regex: '' + searchfilter + '', '$options': 'i' } })
        filterArray.push({ "city": { $regex: '' + searchfilter + '', '$options': 'i' } })
        filterArray.push({ "employmenttype": { $regex: '' + searchfilter + '', '$options': 'i' } })
        filterArray.push({ "senioritylevel": { $regex: '' + searchfilter + '', '$options': 'i' } })
        filterArray.push({ "jobdescription": { $regex: '' + searchfilter + '', '$options': 'i' } })
        filterArray.push({ "skillkeywords": { $regex: '' + searchfilter + '', '$options': 'i' } })
        filterArray.push({ "recruiterwebsite": { $regex: '' + searchfilter + '', '$options': 'i' } })

        if (employmenttype !== "") {
            console.log('11111');
            filterArray.push({ employmenttype: employmenttype })
        }
        if (senioritylevel !== "") {
            console.log('11111paeghaieg');
            filterArray.push({ senioritylevel: senioritylevel })
        }
        if (remote && remote !== "") {
            console.log('11111');
            filterArray.push({ remote: remote })
        }
        if (remote == "no" && state !== "") {
            console.log('11111');
            filterArray.push({ state: state })
        }
        if (remote == "no" && state !== "" && city !== "") {
            console.log('11111');
            filterArray.push({ city: city })
        }
        query.$or = filterArray;
    }
    else{
        if (employmenttype !== "") {
            console.log('11111');
            filterArray.push({ employmenttype: employmenttype })
            query.$and = filterArray;
        }
        if (senioritylevel !== "") {
            console.log('11111paeghaieg');
            filterArray.push({ senioritylevel: senioritylevel })
            query.$and = filterArray;
        }
        if (remote && remote !== "") {
            console.log('11111');
            filterArray.push({ remote: remote })
            query.$and = filterArray;
        }
        if (remote == "no" && state !== "") {
            console.log('11111');
            filterArray.push({ state: state })
            query.$and = filterArray;
        }
        if (remote == "no" && state !== "" && city !== "") {
            console.log('11111');
            filterArray.push({ city: city })
            query.$and = filterArray;
        }
    }

    var jobsHtml = "";
    var queryparams = { sort: { date: -1 }, skip: 0, limit: 10 };
    queryparams.limit = parseInt(req.body.limit)
    console.log(query);
    job.find(query, null, queryparams, function (err, jobs) {
        for (var i = 0; i < jobs.length; i++) {
            var jobinfo = ""
            var jobremote = ""
            if (jobs[i]["companylogo"]) {
                jobinfo = `<div class="row">
                <div class="col-md-10">
                  <h3 class="card-title">${jobs[i]["jobtitle"]}</h3>
                  <div class="row">
                    <div class="col-md-6">
                      <h5 class="card-subtitle mb-2 text-muted">${jobs[i]["company"]}</h5>
                      <p class="badge badge-danger" for="">${jobs[i]["employmenttype"]}</p>
                    </div>
                  </div>
                </div>
                <div class="col-md-2">
                  <img style="width: 5rem;
                  margin-left: -1rem;" src="${getPathFromUrl(jobs[i]['companylogo'])}" alt="">
                </div>
              </div>`
            } else {
                jobinfo = `<div class="row">
                <div class="col-md-12">
                  <h3 class="card-title">${jobs[i]["jobtitle"]}</h3>
                  <div class="row">
                    <div class="col-md-6">
                      <h5 class="card-subtitle mb-2 text-muted">${jobs[i]["company"]}</h5>
                      <p class="badge badge-danger" for="">${jobs[i]["employmenttype"]}</p>
                    </div>
                  </div>
                </div>
              </div>`
            }
            if (jobs[i]["remote"] == "yes") {
                jobremote = `<p class="mb-0" style="font-size: small;"><i class='fa fa-home'></i>&nbsp; Work from Home</p>`
            } else {
                jobremote = `<p class="mb-0" style="font-size: small;">${jobs[i]["city"] + ", " + jobs[i]["state"]}</p>`
            }
            jobsHtml = jobsHtml +
                `<div class="p-0 pb-2 mb-2 d-flex align-items-stretch bg-gray">
                    <div class="card w-100" style="box-shadow: 0 5px 20px 0 rgba(0,0,0,.2);
                    border-radius: 18px;">
                        <div class="card-body">
                            ${jobinfo}
                            ${jobremote}
                            <div class="row">
                                <div class="col-4">
                                    <p class="card-text" style="font-size: small;">Posted: ${timeSince(new Date(jobs[i]["date"]))} ago
                                    </p>
                                </div>
                                <div class="col-8 row justify-content-end pr-0">
                                <a style="border-radius: 10px;
                                background-color: orange!important;
                                border-color: orange!important;" href="/jobs/${jobs[i]['jobtitle'].replace(/\s+/g, '-').toLowerCase() + '-' + jobs[i]['_id']}" class="card-link btn btn-primary">Apply Now</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`
        }
        res.json(jobsHtml);
    });
});

/*Job Form POST method*/
router.post('/applyjob', function (req, res, next) {
    var jobapplicationObj = new jobapplication({
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        recruiteremail: req.body.recruiteremail,
        jobtitle: req.body.jobtitle,
        jobid: req.body.jobid,
        date: new Date()
    });
    jobapplicationObj.save(function (err, results) {
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
                'An applicant has applied to your the job posted. Please find details below:' +
                '<br>\n' +
                'Job title: ' + req.body.jobtitle +
                '<br>\n' +
                'Name of applicant: ' + req.body.name +
                '<br>\n' +
                'Email of applicant: ' + req.body.email +
                '<br>\n' +
                'Phone of applicant: ' + req.body.phone +
                '<br>\n' +
                '<br>\n' +
                '<br><table width="351" cellspacing="0" cellpadding="0" border="0"> <tr> <td style="text-align:left;padding-bottom:10px"><a style="display:inline-block" href="https://www.ampdigital.co"><img style="border:none;" width="150" src="https://s1g.s3.amazonaws.com/36321c48a6698bd331dca74d7497797b.jpeg"></a></td> </tr> <tr> <td style="border-top:solid #000000 2px;" height="12"></td> </tr> <tr> <td style="vertical-align: top; text-align:left;color:#000000;font-size:12px;font-family:helvetica, arial;; text-align:left"> <span> </span> <br> <span style="font:12px helvetica, arial;">Email:&nbsp;<a href="mailto:amitabh@ampdigital.co" style="color:#3388cc;text-decoration:none;">amitabh@ampdigital.co</a></span> <br><br> <span style="margin-right:5px;color:#000000;font-size:12px;font-family:helvetica, arial">Registered Address: AMP Digital</span> 403, Sovereign 1, Vatika City, Sohna Road,, Gurugram, Haryana, 122018, India<br><br> <table cellpadding="0" cellpadding="0" border="0"><tr><td style="padding-right:5px"><a href="https://facebook.com/https://www.facebook.com/AMPDigitalNet/" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/23f7b48395f8c4e25e64a2c22e9ae190.png" alt="Facebook" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://twitter.com/https://twitter.com/amitabh26" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3949237f892004c237021ac9e3182b1d.png" alt="Twitter" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://linkedin.com/in/https://in.linkedin.com/company/ads4growth?trk=public_profile_topcard_current_company" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/dcb46c3e562be637d99ea87f73f929cb.png" alt="LinkedIn" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://youtube.com/https://www.youtube.com/channel/UCMOBtxDam_55DCnmKJc8eWQ" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3b2cb9ec595ab5d3784b2343d5448cd9.png" alt="YouTube" style="border:none;"></a></td></tr></table><a href="https://www.ampdigital.co" style="text-decoration:none;color:#3388cc;">www.ampdigital.co</a> </td> </tr> </table> <table width="351" cellspacing="0" cellpadding="0" border="0" style="margin-top:10px"> <tr> <td style="text-align:left;color:#aaaaaa;font-size:10px;font-family:helvetica, arial;"><p>AMP&nbsp;Digital is a Google Partner Company</p></td> </tr> </table>'
            var options = {
                from: 'ampdigital.co <amitabh@ads4growth.com>',
                to: req.body.recruiteremail,
                subject: 'ampdigital.co: Job Application received',
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

router.post('/sendpdf2', function (req, res, next) {
    var bookdownload2 = new bookdownload({
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
    bookdownload2.save(function (err, results) {
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

router.get('/quizduration', function (req, res, next) {
    lmsQuiz.find({}, function (err, docs) {
        for (var i = 0; i < docs.length; i++) {
            lmsElements.update(
                {
                    element_val: docs[i]._id, element_type: 'quiz'
                },
                {
                    $set: { "duration": docs[i].maxTimeToFinish }
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

router.get('/videoduration/:videoid', function (req, res, next) {
    var Vimeo = require('vimeo').Vimeo;
    var client = new Vimeo('0d65f95382baf60e06a06d98575511079b7923dd', 'VZomxYI88IiUJAMYIGF7feajb3aLyMO2f/6XZEb4XxNQW7B/RmyfbE5iubIpqEXPyjAGpoevZaApps5NZeJb9tweB0Y/TMFfzRPdghP/Ks7MnKYr1gK9ov9dDPQxwpVk', '8198f955ead569af26e73484688d6eb1');

    client.request(/*options*/{
        // This is the path for the videos contained within the staff picks
        // channels
        path: '/videos/' + req.params.videoid
    }, /*callback*/function (error, body, status_code, headers) {
        if (error) {
            console.log('error');
            res.json(error);
        } else {
            console.log('body');
            res.json(body);
        }
    });
    /*lmsQuiz.find({}, function (err, docs) {
        for(var i =0; i< docs.length; i++){
            lmsElements.update(
                {
                    element_val: docs[i]._id, element_type: 'quiz'
                },
                {
                    $set: { "duration": docs[i].maxTimeToFinish}
                }
                ,
                function(err, count) {
                    if(err){
                        console.log(err);
                    }
                    else{
                        console.log(count);
                    }
                });
        }
    });*/
});

router.get('/getpercentagecoursecompletion/:courseid', function (req, res, next) {
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

/*GET quiz*/
router.post('/getquiz', function (req, res, next) {
    var quiz_id = req.body.quiz_id;
    console.log(quiz_id);
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;
    lmsQuiz.find({ _id: safeObjectId(quiz_id) }, function (err, docs) {
        res.json(docs[0]);
    });
});

/*Insert Quiz Log*/
router.post('/quizlog', function (req, res, next) {
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
router.get('/getquizlog', function (req, res, next) {
    lmsQuizlog.find({
        quizid: req.query.id,
        email: req.query.userid
    }, function (err, quizes) {
        res.json(quizes);
    });
});

/*Update Quiz Log*/
router.put('/updatequizlog', function (req, res, next) {
    console.log('HERE___________________');
    console.log(req.body.element_id);
    console.log(req.body.loggedinEmail);
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

/*Update Quiz Log*/
router.put('/resetquiz', function (req, res, next) {
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
router.post('/updatequelog', function (req, res, next) {
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
                console.log('HER');
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

/*Mark Quiz as Completed*/
router.put('/markquizcompleted', function (req, res, next) {
    console.log('HERE___________________');
    console.log(req.body.element_id);
    console.log(req.body.loggedinEmail);
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

/*Mark that the quiz has been completed or video has been watched by the user*/
router.put('/updateelementwatchedby', function (req, res) {
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

/* GET accomplishments page. */
router.get('/accomplishments/:userid/:courseurl', myLogger, function (req, res, next) {
    req.session.returnTo = req.path;
    console.log("_ainegaeg")
    console.log(req.originalUrl);
    lmsUsers.findOne({ _id: req.params.userid }, function (err, user) {
        if (user) {
            lmsCourses.findOne({ 'deleted': { $ne: 'true' }, "course_url":  req.params.courseurl }, function (err, course) {
                if(course){
                    if(req.isAuthenticated()){
                        res.render('accomplishments', { moment: moment, verification_url: "www.ampdigital.co"+req.originalUrl, certificateuser: user, course: course, success: '_', title: 'Express', email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
                    }
                    else{
                        res.render('accomplishments', { moment: moment,  verification_url: "www.ampdigital.co"+req.originalUrl, certificateuser: user, title: 'Express', course: course});
                    }
                }
            });
        }
        else {
            res.json(-1);
        }
    });
});

router.get('/webinaraccomplishments/:webinarid/:userid', function (req, res, next) {
    req.session.returnTo = req.path;
    console.log("_ainegaeg")
    console.log(req.originalUrl);
    webinaree.findOne({ _id: req.params.userid }, function (err, user) {
        if (user) {
            webinar.findOne({ 'deleted': { $ne: 'true' }, "_id":  req.params.webinarid }, function (err, webinar) {
                if(webinar){
                    if(req.isAuthenticated()){
                        res.render('webinaraccomplishments', { moment: moment, verification_url: "www.ampdigital.co"+req.originalUrl, certificateuser: user, webinar: webinar, success: '_', title: 'Express', email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
                    }
                    else{
                        res.render('webinaraccomplishments', { moment: moment,  verification_url: "www.ampdigital.co"+req.originalUrl, certificateuser: user, title: 'Express', webinar: webinar});
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
router.get('/accomplishments/:userid', myLogger, function (req, res, next) {
    req.session.returnTo = req.path;
    lmsUsers.findOne({ _id: req.params.userid }, function (err, user) {
        if (user) {
            if (req.isAuthenticated()) {
                if (user.certificates) {
                    lmsCourses.find({ 'deleted': { $ne: 'true' }, "_id": { $in: user.certificates } }, function (err, certificates) {
                        res.render('certificates', { moment: moment, certificateuser: user, title: 'Express', courses: certificates, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
                    });
                }
            }
            else {
                if (user.certificates) {
                    lmsCourses.find({ 'deleted': { $ne: 'true' }, "_id": { $in: user.certificates } }, function (err, certificates) {
                        res.render('certificates', { moment: moment, certificateuser: user, title: 'Express', courses: certificates });
                    });
                }
            }
        }
        else {
            res.json(-1);
        }
    });
});

/* GET accomplishments page. */
router.get('/certificate/:userid/:courseid', function (req, res, next) {
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
                        "Verify at www.ampdigital.co/certificate/" + req.params.userid + "/" + req.params.courseid + " <br>" +
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

router.get('/retrievepassword/:forgotpasswordid', myLogger, function (req, res, next) {
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

router.post('/updateBlogReadCount', function (req, res) {
    blog.update(
        {
            blogurl: req.body.blogurl
        },
        {
            $addToSet: {"readers": req.body.cookie}
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

router.post('/resetpassword', function (req, res) {
    var bcrypt = require('bcrypt-nodejs');
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
                    var link = 'http://www.ampdigital.co/retrievepassword/' + results['_id'];
                    var email = req.body.email;
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
        
                    sesMail.sendEmail(options, function (err, data) {
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

router.get('/sitemap.xml', myLogger, function (req, res) {
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

router.get('/budding-marketer-program/application', myLogger, function (req, res, next) {
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
router.get('/faq', myLogger, function (req, res, next) {
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

// Create a new faq
router.post('/addcomment', function (req, res, next) {
    // res.json(Buffer.from(req.body.content).toString('base64'));
    var comment2 = new comment({
        blogid: req.body.blogid,
        name: req.body.name,
        email: req.body.email,
        comment: req.body.comment,
        date: new Date()
        // content: Buffer.from(req.body.content).toString('base64')
    });
    comment2.save(function (err, results) {
        if (err) {
            res.json(err);
        }
        else {
            res.redirect('/blog/' + req.body.blogurl + "/#comments");
        }
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

// Create a new forum
router.post('/addforumreply', function (req, res, next) {
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;
    forum.findOne({ '_id': req.body.replyto }, function (err, forumdoc) {
        var forum2 = new forum({
            description: req.body.description,
            date: new Date(),
            postedby_email: req.user.email,
            postedby_name: getusername(req.user), notifications: req.user.notifications + " " + req.user.local.lastname,
            isreply: true,
            replyto: req.body.replyto,
            elementid: forumdoc.elementid,
            topicid: forumdoc.topicid,
            moduleid: forumdoc.moduleid,
            modulename: forumdoc.modulename,
            coursename: forumdoc.coursename
        });
        forum2.save(function (err, results) {
            if (err) {
                res.json(err);
            }
            else {
                forum.update(
                    {
                        _id: safeObjectId(req.body.replyto)
                    },
                    {
                        $addToSet: { 'replies': results._id.toString() }
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

                            var html = `Dear ${forumdoc.postedby_name},
                                <br><br>
                                You have a new reply to your question:
                                <br>
                                <br>
                                Q:${forumdoc.title}, ${forumdoc.description}
                                <br>
                                <br>
                                Please <a href="www.ampdigital.co/dashboard">login</a> to check your answer.
                                <br>
                                <br>
                                Thanks,
                                <br>
                                <table width="351" cellspacing="0" cellpadding="0" border="0"> <tr> <td style="text-align:left;padding-bottom:10px"><a style="display:inline-block" href="https://www.ampdigital.co"><img style="border:none;" width="150" src="https://s1g.s3.amazonaws.com/36321c48a6698bd331dca74d7497797b.jpeg"></a></td> </tr> <tr> <td style="border-top:solid #000000 2px;" height="12"></td> </tr> <tr> <td style="vertical-align: top; text-align:left;color:#000000;font-size:12px;font-family:helvetica, arial;; text-align:left"> <span> </span> <br> <span style="font:12px helvetica, arial;">Email:&nbsp;<a href="mailto:amitabh@ampdigital.co" style="color:#3388cc;text-decoration:none;">amitabh@ampdigital.co</a></span> <br><br> <span style="margin-right:5px;color:#000000;font-size:12px;font-family:helvetica, arial">Registered Address: AMP Digital</span> 403, Sovereign 1, Vatika City, Sohna Road,, Gurugram, Haryana, 122018, India<br><br> <table cellpadding="0" cellpadding="0" border="0"><tr><td style="padding-right:5px"><a href="https://facebook.com/https://www.facebook.com/AMPDigitalNet/" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/23f7b48395f8c4e25e64a2c22e9ae190.png" alt="Facebook" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://twitter.com/https://twitter.com/amitabh26" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3949237f892004c237021ac9e3182b1d.png" alt="Twitter" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://linkedin.com/in/https://in.linkedin.com/company/ads4growth?trk=public_profile_topcard_current_company" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/dcb46c3e562be637d99ea87f73f929cb.png" alt="LinkedIn" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://youtube.com/https://www.youtube.com/channel/UCMOBtxDam_55DCnmKJc8eWQ" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3b2cb9ec595ab5d3784b2343d5448cd9.png" alt="YouTube" style="border:none;"></a></td></tr></table><a href="https://www.ampdigital.co" style="text-decoration:none;color:#3388cc;">www.ampdigital.co</a> </td> </tr> </table> <table width="351" cellspacing="0" cellpadding="0" border="0" style="margin-top:10px"> <tr> <td style="text-align:left;color:#aaaaaa;font-size:10px;font-family:helvetica, arial;"><p>AMP&nbsp;Digital is a Google Partner Company</p></td> </tr> </table>  `;

                            var options = {
                                from: 'ampdigital.co <amitabh@ads4growth.com>',
                                to: forumdoc.postedby_email,
                                subject: 'AMP Digital Q&A',
                                content: '<html><head></head><body>' + html + '</body></html>'
                            };

                            sesMail.sendEmail(options, function (err, data) {
                                // TODO sth....
                                if (err) {
                                    console.log(err);
                                }
                                lmsUsers.update(
                                    {
                                        email: forumdoc.postedby_email
                                    },
                                    {
                                        $addToSet: {
                                            'notifications': {
                                                title: "New reply to your question",
                                                description: req.body.description,
                                                date: new Date(),
                                                image: "https://ui-avatars.com/api/?name=" + forumdoc.postedby_name
                                            }
                                        }
                                    }
                                    ,
                                    function (err, count) {
                                        if (err) {
                                            console.log(err);
                                        }
                                        else {
                                            res.json(count)
                                        }
                                    });
                            });
                        }
                    });
            }
        });
    });
});

/*GET quiz*/
router.get('/getforumreplies/:forum_id', function (req, res, next) {
    forum.find({ replyto: req.params.forum_id, isreply: true }, function (err, docs) {
        res.json(docs);
    });
});

/*GET courses page*/
router.get('/manage/jobs', myLogger, isAdmin, function (req, res, next) {
    job.find({ 'deleted': { $ne: 'true' } }, null, { sort: { date: -1 } }, function (err, docs) {
        res.render('adminpanel/jobs2', { email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications, docs: docs, moment: moment });
    });
});

router.get('/manage/buddingarketerapplications', myLogger, isAdmin, function (req, res, next) {
    lmsUsers.find({ 'collegename': { $exists: true }, approved: { $ne: false } }, null, { sort: { date: -1 } }, function (err, docs) {
        res.render('adminpanel/bmpapplications', { email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications, docs: docs, moment: moment });
    });
});

/*GET courses page*/
router.get('/coursefeatures/:courseid', myLogger, isAdmin, function (req, res, next) {
    coursefeatureModal.find({ 'deleted': { $ne: 'true' }, 'course_id': req.params.courseid }, function (err, faqdocs) {
        res.render('adminpanel/coursefeatures', { email: req.user.email, courseid: req.params.courseid, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications, faqdocs: faqdocs, moment: moment });

    });
});

/*GET courses page*/
router.get('/manage/bookdownloads', myLogger, isAdmin, function (req, res, next) {
    bookdownload.find({}, function (err, docs) {
        res.render('adminpanel/bookdownload', { email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications, docs: docs, moment: moment });

    });
});


/*GET modules page for a course*/
router.get('/manage/forums', myLogger, isAdmin, function (req, res, next) {
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;
    lmsForums.find({ deleted: { $ne: "true" } }, function (err, forums) {
        res.render('adminpanel/addforum', { forums: forums, moment: moment, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
    });
});

router.get('/manage/simulationtools', myLogger, isAdmin, function (req, res, next) {
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;
    simulationtool.find({ deleted: { $ne: "true" } }, function (err, simulationtools) {
        res.render('adminpanel/simulationtools', { simulationtools: simulationtools, moment: moment, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
    });
});

/*GET contact requests page*/
router.get('/contact-requests', myLogger, isAdmin, function (req, res, next) {
    Contactuser.find({}, function (err, docs) {
        res.render('adminpanel/contact_requests', { docs: docs, email: req.user.email });
    });
});

/*GET admin page*/
router.get('/admin', myLogger, isAdmin, function (req, res, next) {
    lmsCourses.find({ 'deleted': { $ne: 'true' } }, function (err, courses) {
        res.render('adminpanel/payments', { courses: courses, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, moment: moment });
    });
});

/*GET contact requests page*/
router.get('/submissions', myLogger, isAdmin, function (req, res, next) {
    lmsCourses.find({ 'deleted': { $ne: 'true' } }, function (err, courses) {
        res.render('adminpanel/submissions', { courses: courses, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, moment: moment });
    });
});

router.get('/quotes', function (req, res, next) {
    res.render('quotes', { moment: moment });
});

router.get('/quote', function (req, res, next) {
    quote.findOne({quote: req.query.quote}, function(err, quote){
        if(err){
            res.redirect("/quotes");
        }
        else{
            res.render('quote', { quote: quote });
        }
    })
});

/*GET contact requests page*/
router.get('/manage/forum', myLogger, isAdmin, function (req, res, next) {
    lmsCourses.find({ 'deleted': { $ne: 'true' } }, function (err, courses) {
        forum.find({}).sort({ date: -1 }).exec(function (err, docs) {
            res.render('adminpanel/forum', { courses: courses, docs: docs, email: req.user.email, moment: moment });
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

router.get('/datatable/forum2', function (req, res, next) {
    /*
   * Script:    DataTables server-side script for NODE and MONGODB
   * Copyright: 2018 - Siddharth Sogani
   */

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * Easy set variables
     */

    /* Array of columns to be displayed in DataTable
     */
    var $aColumns = ['postedby_name', 'postedby_email', 'modulename', 'coursename', 'title', 'description', 'date', 'action'];

    /*
     * Paging
     */
    var $sDisplayStart = 0;
    var $sLength = "";
    if ((req.query.iDisplayStart) && req.query.iDisplayLength != '-1') {
        $sDisplayStart = req.query.iDisplayStart;
        $sLength = req.query.iDisplayLength;
    }

    var query = { isreply: { $ne: true } }
    /*
   * Filtering
   * NOTE this does not match the built-in DataTables filtering which does it
   * word by word on any field. It's possible to do here, but concerned about efficiency
   * on very large tables, and MySQL's regex functionality is very limited
   */
    if (req.query.sSearch != "") {
        var arr = [{ "postedby_name": { $regex: '' + req.query.sSearch + '', '$options': 'i' } }, { "postedby_email": { $regex: '' + req.query.sSearch + '', '$options': 'i' } }, { "module_name": { $regex: '' + req.query.sSearch + '', '$options': 'i' } }, { "title": { $regex: '' + req.query.sSearch + '', '$options': 'i' } }, { "description": { $regex: '' + req.query.sSearch + '', '$options': 'i' } }, { "date": { $regex: '' + req.query.sSearch + '', '$options': 'i' } }, { "coursename": { $regex: '' + req.query.sSearch + '', '$options': 'i' } }];
        query.$or = arr;
    }

    var filterArray = [];
    if (req.query.fromdatefilter !== "") {
        console.log('11111');
        filterArray.push({ date: { $gte: req.query.fromdatefilter + ' 00:00' } })
        query.$and = filterArray;
    }
    if (req.query.todatefilter !== "") {
        console.log('1111');
        filterArray.push({ date: { $lte: req.query.todatefilter + ' 23:59' } })
        query.$and = filterArray;
    }
    if (req.query.purposefilter !== "") {
        console.log('222');
        filterArray.push({ "coursename": req.query.purposefilter })
        query.$and = filterArray;
    }

    /*
    * Ordering
    */
    var sortObject = { 'date': -1 };
    if (req.query.iSortCol_0 && req.query.iSortCol_0 == 0) {
        if (req.query.sSortDir_0 == 'desc') {
            var sortObject = {};
            var stype = 'postedby_name';
            var sdir = -1;
            sortObject[stype] = sdir;
        }
        else {
            var sortObject = {};
            var stype = 'postedby_name';
            var sdir = 1;
            sortObject[stype] = sdir;
        }

    }
    else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 1) {
        if (req.query.sSortDir_0 == 'desc') {
            var sortObject = {};
            var stype = 'postedby_email';
            var sdir = -1;
            sortObject[stype] = sdir;
        }
        else {
            var sortObject = {};
            var stype = 'postedby_email';
            var sdir = 1;
            sortObject[stype] = sdir;
        }
    }
    else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 2) {
        if (req.query.sSortDir_0 == 'desc') {
            var sortObject = {};
            var stype = 'modulename';
            var sdir = -1;
            sortObject[stype] = sdir;
        }
        else {
            var sortObject = {};
            var stype = 'modulename';
            var sdir = 1;
            sortObject[stype] = sdir;
        }
    }
    else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 2) {
        if (req.query.sSortDir_0 == 'desc') {
            var sortObject = {};
            var stype = 'coursename';
            var sdir = -1;
            sortObject[stype] = sdir;
        }
        else {
            var sortObject = {};
            var stype = 'coursename';
            var sdir = 1;
            sortObject[stype] = sdir;
        }
    }
    else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 3) {
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
    else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 4) {
        if (req.query.sSortDir_0 == 'desc') {
            var sortObject = {};
            var stype = 'description';
            var sdir = -1;
            sortObject[stype] = sdir;
        }
        else {
            var sortObject = {};
            var stype = 'description';
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

    forum.find(query).skip(parseInt($sDisplayStart)).limit(parseInt($sLength)).sort(sortObject).exec(function (err, docs) {
        forum.count(query, function (err, count) {
            var aaData = [];
            for (let i = 0; i < (docs).length; i++) {
                var $row = [];
                for (var j = 0; j < ($aColumns).length; j++) {
                    if ($aColumns[j] == "action") {
                        $row.push(`
                            <button data-title="${docs[i]["title"]}" data-description="${docs[i]["description"]}" data-date="${docs[i]["date"]}" data-author="${docs[i]["postedby_name"]}" data-pk="${docs[i]["_id"]}" class="btn btn-primary viewreply">View thread/Reply</button>
                        `);
                    }
                    else {
                        $row.push(docs[i][$aColumns[j]]);
                    }
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

router.get('/datatable/users', function (req, res, next) {
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

    var query = { deleted: { $ne: true }, validated: true};
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
        console.log('11111');
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

router.get('/datatable/usersunvalidated', function (req, res, next) {
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
        console.log('11111');
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
    // else if ( req.query.iSortCol_0 && req.query.iSortCol_0 == 2 )
    // {
    //     if(req.query.sSortDir_0 == 'desc'){
    //         var sortObject = {};
    //         var stype = 'email';
    //         var sdir = -1;
    //         sortObject[stype] = sdir;
    //     }
    //     else{
    //         var sortObject = {};
    //         var stype = 'email';
    //         var sdir = 1;
    //         sortObject[stype] = sdir;
    //     }
    // }
    // else if ( req.query.iSortCol_0 && req.query.iSortCol_0 == 3 )
    // {
    //     if(req.query.sSortDir_0 == 'desc'){
    //         var sortObject = {};
    //         var stype = 'phone';
    //         var sdir = -1;
    //         sortObject[stype] = sdir;
    //     }
    //     else{
    //         var sortObject = {};
    //         var stype = 'phone';
    //         var sdir = 1;
    //         sortObject[stype] = sdir;
    //     }
    // }
    // else if ( req.query.iSortCol_0 && req.query.iSortCol_0 == 4 )
    // {
    //     if(req.query.sSortDir_0 == 'desc'){
    //         var sortObject = {};
    //         var stype = 'status';
    //         var sdir = -1;
    //         sortObject[stype] = sdir;
    //     }
    //     else{
    //         var sortObject = {};
    //         var stype = 'status';
    //         var sdir = 1;
    //         sortObject[stype] = sdir;
    //     }
    // }
    // else if ( req.query.iSortCol_0 && req.query.iSortCol_0 == 5 )
    // {
    //     if(req.query.sSortDir_0 == 'desc'){
    //         var sortObject = {};
    //         var stype = 'purpose';
    //         var sdir = -1;
    //         sortObject[stype] = sdir;
    //     }
    //     else{
    //         var sortObject = {};
    //         var stype = 'purpose';
    //         var sdir = 1;
    //         sortObject[stype] = sdir;
    //     }
    // }
    // else if ( req.query.iSortCol_0 && req.query.iSortCol_0 == 6 )
    // {
    //     if(req.query.sSortDir_0 == 'desc'){
    //         var sortObject = {};
    //         var stype = 'amount';
    //         var sdir = -1;
    //         sortObject[stype] = sdir;
    //     }
    //     else{
    //         var sortObject = {};
    //         var stype = 'amount';
    //         var sdir = 1;
    //         sortObject[stype] = sdir;
    //     }
    // }
    // else if ( req.query.iSortCol_0 && req.query.iSortCol_0 == 7 )
    // {
    //     if(req.query.sSortDir_0 == 'desc'){
    //         var sortObject = {};
    //         var stype = 'payment_id';
    //         var sdir = -1;
    //         sortObject[stype] = sdir;
    //     }
    //     else{
    //         var sortObject = {};
    //         var stype = 'payment_id';
    //         var sdir = 1;
    //         sortObject[stype] = sdir;
    //     }
    // }
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

/*GET manage events page*/
router.get('/manage-events', myLogger, isAdmin, function (req, res, next) {
    Eventjoinee.find({}, function (err, eventjoinees) {
        Event.find({}, function (err, docs) {
            res.render('adminpanel/manage_events', { docs: docs, eventjoinees: eventjoinees, email: req.user.email });
        });
    });
});

/*GET manage events page*/
router.get('/manage-coupons', myLogger, isAdmin, function (req, res, next) {
    coupon.find({}, function (err, docs) {
        res.render('adminpanel/manage_coupons', { docs: docs, email: req.user.email, moment: moment });
    });
});

/*GET manage events page*/
router.get('/users', isAdmin, myLogger, function (req, res, next) {
    lmsCourses.find({ 'deleted': { $ne: 'true' } }, function (err, courses) {
        lmsUsers.find({}, function (err, users) {
            res.render('adminpanel/manageusers', { courses: courses, users: users, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
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


/*Remove user*/
router.post('/removeuser', function (req, res) {
    lmsUsers.remove({ email: req.body.emailid }, function (err, count) {
        if (err) {
            console.log(err);
        }
        else {
            res.json(count);
        }
    });
});

/*Remove user*/
router.post('/removenotification', function (req, res) {
    var notifications = JSON.parse(req.body.notifications);
    console.log(notifications);
    var notificationsUpdated = [];
    for (var i = 0; i < notifications.length; i++) {
        if (notifications[i]["title"] == req.body.title && notifications[i]["description"] == req.body.description) {

        }
        else {
            notificationsUpdated.push(notifications[i]);
        }
    }
    // res.json(notificationsUpdated);
    lmsUsers.update(
        {
            email: req.body.email
        },
        {
            $set: { 'notifications': notificationsUpdated }
        }
        ,
        function (err, count) {
            if (err) {
                console.log(err);
            }
            else {
                res.json(count)
            }
        });
});

/*Make a user admin*/
router.get('/makeadmin', function (req, res) {
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

/*router.get('/makepdf', function(req, res){
    var page = require('webpage').create();
    page.open('http://github.com/', function() {
        page.render('github.png');
        phantom.exit();
    });

});*/

router.get('/makepdf', function (req, res) {
    var htmlTo = require('htmlto');

    var options = {
        pathTohtml: './public/html/index.html',
        pathTopdf: './public/pdf/index.pdf',
    }

    htmlTo.pdf(options)

});

/**
 * Updating db after providing certificate for course
 */
router.put('/updatecertificate', function (req, res) {
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
                    '<br> <a style="text-decoration: none!important;" href="http://www.ampdigital.co/accomplishments/' + req.body.id + '"><div style="width:220px;color:#ffffff;background-color:#7fbf4d;border:1px solid #63a62f;border-bottom:1px solid #5b992b;background-image:-webkit-linear-gradient(top,#7fbf4d,#63a62f);background-image:-moz-linear-gradient(top,#7fbf4d,#63a62f);background-image:-ms-linear-gradient(top,#7fbf4d,#63a62f);background-image:-o-linear-gradient(top,#7fbf4d,#63a62f);background-image:linear-gradient(top,#7fbf4d,#63a62f);border-radius:3px;line-height:1;padding:1%;text-align:center"><span>View Your Accomplishments</span></div></a>' +
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

/**
 * Updating db after providing certificate for webinar
 */
router.put('/updatecertificatewebinar', function (req, res) {
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
                    '<br> <a style="text-decoration: none!important;" href="http://www.ampdigital.co/webinaraccomplishments/' + req.body.webinarid + '/'+ req.body.id + '"><div style="width:220px;color:#ffffff;background-color:#7fbf4d;border:1px solid #63a62f;border-bottom:1px solid #5b992b;background-image:-webkit-linear-gradient(top,#7fbf4d,#63a62f);background-image:-moz-linear-gradient(top,#7fbf4d,#63a62f);background-image:-ms-linear-gradient(top,#7fbf4d,#63a62f);background-image:-o-linear-gradient(top,#7fbf4d,#63a62f);background-image:linear-gradient(top,#7fbf4d,#63a62f);border-radius:3px;line-height:1;padding:1%;text-align:center"><span>View Your Accomplishments</span></div></a>' +
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

/*Remove a user from admin*/
router.get('/removeadmin', function (req, res) {
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
            res.redirect('/manage-coupons');
        }
    });
});

/*POST new course*/
router.post('/addcourse', function (req, res, next) {
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

/*POST new course*/
router.post('/addtestimonial', function (req, res, next) {
    var testimonial2 = new testimonial({
        name: req.body.name,
        testimonial: req.body.testimonial,
        designation: req.body.designation,
        date: new Date(),
        deleted: false
    });
    testimonial2.save(function (err, results) {
        console.log(err);
        if (err) {
            res.json(err);
        }
        else {
            res.json(results);
        }
    });
});

router.post('/updatecategoryname', function (req, res) {
    category.update(
        {
            _id: req.body.pk
        },
        {
            $set: { "name": req.body.value }
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

router.post('/updatecategoryurl', function (req, res) {
    category.update(
        {
            _id: req.body.pk
        },
        {
            $set: { "categoryurl": req.body.value }
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

router.post('/updatetestimonialname', function (req, res) {
    var title = req.body.name.toString();
    testimonial.update(
        {
            _id: req.body.pk
        },
        {
            $set: { "name": req.body.value }
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

router.post('/updatejob', function (req, res) {
    var updateQuery = {};
    updateQuery[req.body.name] = req.body.value
    console.log(updateQuery);
    job.update(
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

router.post('/updatetooldescription', function (req, res) {
    var updateQuery = {};
    updateQuery[req.body.name] = req.body.value
    console.log(updateQuery);
    simulationtool.update(
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

router.post('/updatetoolname', function (req, res) {
    simulationtool.update(
        {
            _id: req.body.pk
        },
        {
            $set: { "tool_name": req.body.value }
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

router.post('/updatetoolurl', function (req, res) {
    simulationtool.update(
        {
            _id: req.body.pk
        },
        {
            $set: { "tool_url": req.body.value }
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

router.post('/updatetoolimage', function (req, res, next) {
    var toolid = req.body.toolid;
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
                        simulationtool.update(
                            {
                                _id: toolid
                            },
                            {
                                $set: { "tool_image": url }
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

router.post('/updatetestimonialcontent', function (req, res) {
    var title = req.body.name.toString();
    testimonial.update(
        {
            _id: req.body.pk
        },
        {
            $set: { "testimonial": req.body.value }
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

router.post('/updatetestimonialdesignation', function (req, res) {
    var title = req.body.name.toString();
    testimonial.update(
        {
            _id: req.body.pk
        },
        {
            $set: { "designation": req.body.value }
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
router.post('/updateforumname', function (req, res) {
    var title = req.body.name.toString();
    lmsForums.update(
        {
            _id: req.body.pk
        },
        {
            $set: { "module_name": req.body.value }
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


router.post('/updateforumid', function (req, res) {
    var title = req.body.name.toString();
    lmsForums.update(
        {
            _id: req.body.pk
        },
        {
            $set: { "module_id": req.body.value }
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


router.post('/updateforumdescription', function (req, res) {
    var title = req.body.name.toString();
    lmsForums.update(
        {
            _id: req.body.pk
        },
        {
            $set: { "module_description": req.body.value }
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


/*POST new batch*/
router.post('/addbatch', function (req, res, next) {
    var batch = new lmsBatches({
        batch_name: req.body.batch_name,
        course_id: req.body.course_id,
        batch_createdon: new Date()
    });
    batch.save(function (err, results) {
        if (err) {
            res.json(err);
        }
        else {
            res.json(results);
        }
    });
});

router.put('/removetestimonial', function (req, res) {
    var testimonialid = req.body.testimonialid;
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;

    testimonial.update(
        {
            _id: safeObjectId(testimonialid)
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

router.put('/removejob', function (req, res) {
    var testimonialid = req.body.testimonialid;
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;

    job.update(
        {
            _id: safeObjectId(testimonialid)
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

router.put('/removeblogadmin', function (req, res) {
    var testimonialid = req.body.testimonialid;
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;

    blog.update(
        {
            _id: safeObjectId(testimonialid)
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

router.put('/jobapproval', function (req, res) {
    var testimonialid = req.body.testimonialid;
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;

    job.update(
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

/*REMOVE a batch*/
router.put('/removebatch', function (req, res) {
    var batch_id = req.body.batch_id;
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;

    lmsBatches.update(
        {
            _id: safeObjectId(batch_id)
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

/*REMOVE a module*/
router.get('/removequiz', function (req, res) {
    var quiz_id = req.query.quiz_id;
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

router.get('/quizes', isAdmin, function (req, res, next) {
    lmsQuiz.find({ deleted: { $ne: 'true' } }, function (err, quizes) {
        res.render('adminpanel/quizes', { moment: moment, quizes: quizes, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
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

router.post('/percentile', function (req, res, next) {
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

router.post('/addquiz', function (req, res, next) {
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

router.get('/quizreport', myLogger, isAdmin, function (req, res, next) {
    req.session.returnTo = req.path;
    if (1) {
        lmsCourses.find({ 'deleted': { $ne: 'true' } }, function (err, courses) {
            lmsUsers.find({}, function (err, users) {
                res.render('adminpanel/quizreport', { docs: users, courses: courses, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
            });
        });
    }
    else {
        res.redirect('/signin');
    }
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

router.post('/updatequiz', function (req, res, next) {
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

router.post('/csvupload', function (req, res, next) {
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

function myLogger(req, res, next) {
    next();
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
