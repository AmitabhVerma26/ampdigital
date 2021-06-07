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
var digitalmarketingcoursemodules = require('../data/digitalmarketingcoursemodules.json')
var quotesall = require('../data/quotes.json')
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
router.get('/budding-marketer-challenge/ampdigital-case-study-challenge', function (req, res, next) {
    req.session.returnTo = req.path;
    res.render('buddingmarketerchallengedetail', { title: 'Express', active: "all", moment: moment });
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

router.get('/emailexistence', async (req, res, next)=>{
    var query = {"local.name": "James"};
    lmsUsers.remove(query, function (err, response) {
        res.json(response);
    });
});

router.get('/sendyapi', function (req, res, next) {
    var Sendy = require('sendy-api'),
        sendy = new Sendy('http://sendy.ampdigital.co/', 'tyYabXqRCZ8TiZho0xtJ');

    var arr = [];
    lmsUsers.find({}).sort({ date: -1 }).exec(function (err, docs) {
        for (var i = 0; i < docs.length; i++) {
            if (docs[i]["email"] && docs[i].local["name"]) {
                sendy.subscribe({ api_key: 'tyYabXqRCZ8TiZho0xtJ', name: docs[i].local["name"], email: docs[i]["email"], list_id: '763VYAUcr3YYkNmJQKawPiXg' }, function (err, result) {
                    if (err) console.log(err.toString());
                    else console.log('Success: ' + result);
                });
                // arr.push({email: docs[i]["email"], name: docs[i].local["name"].replace(/ .*/,'')});
            }
        }
        // res.json(docs.length);
    });
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

router.get('/bot', function (req, res, next) {
    var Sentiment = require('sentiment');
    var sentiment = new Sentiment();
    var result = sentiment.analyze();
    res.json(result);    
});

router.get('/seo-tools/seo-html-defect-checker', function (req, res, next) {
    res.render('seohtmlchecker', { title: 'Express' });
});

// router.get('/google-ads-simulator-tool-result', function (req, res, next) {
//     res.render('simulatortoolresult', { title: 'Express' });
// });

router.get('/seochecker', function (req, res, next) {
    const {Checker, Rules} = require('seo-html-defect-checker')
    // const htmlText = loadHtmlFunction() // function return string
    const {CustomRule} = Rules
    const MissMetaTitle = new CustomRule('meta', {}, null, (dom, selector) => {
        var num = dom.count("title")
        if (num == 0) {
            return `This HTML is without title tag `
        }
        // else{
        //     var title =dom.titletag('title');
        //     return `title tag: ${title}`
        // }
        return null
    })
    const MissMetaDescription = new CustomRule('meta', {}, null, (dom, selector) => {
        var num = dom.count('meta[name="description"]')
        if (num == 0) {
            return `This HTML without <meta> tag with name=og:description`
        }
        // else{
        //     var metadescription =dom.metadescription('title');
        //     return `meta description: ${metadescription}`
        // }
        return null
    })
    const MissOgDescription = new CustomRule('meta', {}, null, (dom, selector) => {
        var num = dom.count('meta[property="og:description"]')
        if (num == 0) {
            return `This HTML without <meta> tag with name=og:description`
        }
        // else{
        //     var ogdescription =dom.ogtagdata('meta[property="og:description"]');
        //     return `og:description: :${ogdescription}`
        // }
        return null
    })
    const MissOgImage = new CustomRule('meta', {}, null, (dom, selector) => {
        var num = dom.count('meta[property="og:image"]')
        if (num == 0) {
            return `This HTML is without <meta> tag with name=og:image`
        }
        // else{
        //     var ogimage =dom.ogtagdata('meta[property="og:image"]');
        //     return `og:image: :${ogimage}`
        // }
        return null
    })
    const MissOgUrl = new CustomRule('meta', {}, null, (dom, selector) => {
        var num = dom.count('meta[property="og:url"]')
        if (num == 0) {
            return `This HTML is without <meta> tag with name=og:url`
        }
        // else{
        //     var ogurl =dom.ogtagdata('meta[property="og:url"]');
        //     return `og:url: :${ogurl}`
        // }
        return null
    })
    const MissOgType = new CustomRule('meta', {}, null, (dom, selector) => {
        var num = dom.count('meta[property="og:type"]')
        if (num == 0) {
            return `This HTML is without <meta> tag with name=og:type`
        }
        // else{
        //     var ogtype =dom.ogtagdata('meta[property="og:type"]');
        //     return `og:type: :${ogtype}`
        // }
        return null
    })
    const myRules = [
        Rules.definedRules.aTagWithoutRel,
        Rules.definedRules.imgTagWithoutAlt,
        MissMetaTitle,
        MissMetaDescription,
        MissOgDescription,
        MissOgImage,
        MissOgUrl,
        MissOgType,
        Rules.definedRules.dontHaveMetaKeywords,
        Rules.definedRules.moreThan15StrongTag,
        Rules.definedRules.moreThan1H1Tag
    ];
    var afterLoad=require('after-load');
    afterLoad(req.query.url,function(html){
        const c = new Checker(html)
        c.check(myRules, results => {
        res.json(results)
        })
    })
});

router.post('/getmetadata', function (req, res, next) {
    const request = require('request')

// const base64Credentials = Buffer.from('team@example.com:nfh8y34ouhf389f4t3').toString('base64')
const options = {
  url: 'https://api.urlmeta.org/?url='+req.body.url,
  headers: {
    'Authorization': 'Basic ' + req.body.authorization
  }
}

function callback(error, response, body) {
  if (!error && response.statusCode === 200) {
    let data = JSON.parse(body)

    if (data.result.status == 'OK') {
      res.json({status: 'OK', data: data.meta})
    } else {
        res.json({status: 'Not OK', data: data.meta})
    }
  } else {
    res.json({status: 'Not OK', error: error, body: body})
  }
}

request(options, callback)
});

router.get('/sendyapi2', function (req, res, next) {
    var Sendy = require('sendy-api'),
        sendy = new Sendy('http://sendy.ampdigital.co/', 'tyYabXqRCZ8TiZho0xtJ');

    var arr = [];
    webinaree.find({}).exec(function (err, docs) {
        for (var i = 0; i < docs.length; i++) {
            if (docs[i]["email"] && docs[i]["firstname"]) {
                sendy.subscribe({ api_key: 'tyYabXqRCZ8TiZho0xtJ', name: docs[i]["firstname"], email: docs[i]["email"], list_id: 'qfrjwMkLuBzWETooe74W7Q' }, function (err, result) {
                    if (err) console.log(err.toString());
                    else console.log('Success: ' + result);
                });
            }
        }
        res.json(docs.length);
    });
});

router.post('/uploadons3', function (req, res, next) {
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

router.post('/uploadons3course', function (req, res, next) {
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

router.post('/uploadons3blogimage', function (req, res, next) {
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
                        res.json(url.split("?")[0]);
                    }
                });
            }
        });
        // res.json(imageFile);
    }

});

router.post('/uploadons3blogs', function (req, res, next) {
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

router.post('/uploadons4forum', function (req, res, next) {
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

router.get('/getmodules2/:course', function (req, res, next) {
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

router.put('/uploadblogimage', function (req, res) {
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;

    var doc = req.body.image;
    var element_id = req.body.id;

    blog.update(
        { _id: safeObjectId(element_id) },
        {
            $set: { image: doc }
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

router.post('/getcourseselectid', function (req, res, next) {
    console.log(req.body.course_name);
    lmsCourses.findOne({ course_name: req.body.course_name.trim(),  course_live: "Live" }, function (err, course) {
        if(course){
            res.json(course);
        }
        else{
            res.json(-1);
        }
    })
})

router.get('/admin/dashboard', myLogger, function (req, res, next) {
    req.session.returnTo = req.path;
    var start = new Date();
    start.setHours(0,0,0,0);

    var end = new Date();
    end.setHours(23,59,59,999);
    if (req.isAuthenticated() && req.user.role == '2') {
        pageview.find({date: {$gte: start, $lt: end}}).distinct("visitor_ip", function(err, todayuniquepageviews){
            pageview.count({date: {$gte: start, $lt: end}}, function(err, todaypageviews){
                lmsCourses.find({ 'deleted': { $ne: 'true' },  course_live: "Live" }, function (err, courses) {
                lmsCourses.count({ 'deleted': { $ne: 'true' }, course_live: "Live" }, function (err, count) {
                    payment.aggregate([
                        {
                            $group: {
                                _id: { purpose: "$purpose", status: "$status" },
                                count: { $sum: 1 }
                            }
                        }
                    ], function (err, paymentstats) {
                        var paymentstatistics = [];
                        for(var i = 0; i < paymentstats.length; i++){
                            if(paymentstatistics.indexOf(paymentstats[i]["_id"]["purpose"])==-1){
                                paymentstatistics.push(paymentstats[i]["_id"]["purpose"]);
                            }
                        }
                        var obj = {};
                        for(var h = 0; h < paymentstatistics.length; h++){
                            obj[paymentstatistics[h]] = [];
                        }
                        for(var i = 0; i < paymentstats.length; i++){
                            obj[paymentstats[i]["_id"]["purpose"]].push({"status": paymentstats[i]["_id"]["status"], "count": paymentstats[i]["count"]});
                        }
                        // res.json(obj);
                        res.render('adminpanel/dashboard', {paymentstats: paymentstats, courses: courses, todayuniquepageviews: todayuniquepageviews.length, todaypageviews: todaypageviews, todaypageviews: todaypageviews, coursecount: count, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
                    })
                })
                })
            })
        });
    }
});

router.get('/paymentstats', function (req, res, next) {
    payment.aggregate([
        {
            $group: {
                _id: { purpose: "$purpose", status: "$status" },
                count: { $sum: 1 },
                amount: { $sum: "$amount" }
            }
        }
    ], function (err, paymentstats) {
        var paymentstatistics = [];
        for(var i = 0; i < paymentstats.length; i++){
            if(paymentstatistics.indexOf(paymentstats[i]["_id"]["purpose"])==-1){
                paymentstatistics.push(paymentstats[i]["_id"]["purpose"]);
            }
        }
        var obj = {};
        for(var h = 0; h < paymentstatistics.length; h++){
            obj[paymentstatistics[h]] = [];
        }
        for(var i = 0; i < paymentstats.length; i++){
            obj[paymentstats[i]["_id"]["purpose"]].push({"status": paymentstats[i]["_id"]["status"], "count": paymentstats[i]["count"], "amount": paymentstats[i]["_id"]["status"] == "Credit" ?  paymentstats[i]["amount"] : 0});
        }
        res.json(obj);
        // res.render('adminpanel/dashboard', {paymentstats: paymentstats, todayuniquepageviews: todayuniquepageviews.length, todaypageviews: todaypageviews, todaypageviews: todaypageviews, coursecount: count, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
    })
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

router.get('/termsofservice', myLogger, function (req, res, next) {
    req.session.returnTo = req.path;
    if (req.isAuthenticated()) {
        res.render('termsandconditions', { title: 'Express', email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
    }
    else {
        res.render('termsandconditions', { title: 'Express' });
    }
});

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

router.get('/team', function (req, res, next) {
    req.session.returnTo = req.path;
    teamperson.find({}, (err, team)=>{
        res.json(team);
    })
});

router.get('/privacypolicy', myLogger, function (req, res, next) {
    req.session.returnTo = req.path;
    if (req.isAuthenticated()) {
        res.render('privacypolicy', { title: 'Express', email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
    }
    else {
        res.render('privacypolicy', { title: 'Express' });
    }
});

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// router.post('/talktocounsellorform', function (req, res) {
//     var fullname = req.body.name;
//     var email = req.body.email;
//     var phone = req.body.phone;
//     var message = req.body.message;

//     var user = new Contactuser({
//         name: fullname,
//         email: email,
//         phone: phone,
//         message: message
//     });

//     if ( req.ip=="51.91.67.153" || req.ip=="151.80.230.21" || phone.match(/[a-z]/i) || !validateEmail(email) || (message.indexOf('SELECT') > -1) || (message.indexOf('Д') > -1) || (message.toLowerCase().indexOf('http') > -1) || (message.indexOf('ORDER BY') > -1) || (message.indexOf('LIMIT') > -1) || (message.indexOf('CASE') > -1) || (message.indexOf('||') > -1) || (message.indexOf('*') > -1) || (message.indexOf('CONCAT') > -1) || (message.indexOf('CHR') > -1) || (message.toLowerCase().indexOf('sex') > -1) || (message.toLowerCase().indexOf('fuck') > -1) || (message.toLowerCase().indexOf('casino') > -1) || (message.toLowerCase().indexOf('woman') > -1) || (message.toLowerCase().indexOf('women') > -1) || (message.toLowerCase().indexOf('hot') > -1) || (message.toLowerCase().indexOf('weight') > -1) || (message.toLowerCase().indexOf('beste') > -1)) {
//         if (req.isAuthenticated()) {
//             res.render('index', { success: 'true', title: 'Express', email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
//         }
//         else {
//             res.render('index', { success: 'true', title: 'Express' });
//         }
//     }
//     else {
//         user.save(function (err, results) {
//             if (err) {
//                 res.json(err);
//             }
//             else {
//                 //res.json(results._id);
//                 var awsSesMail = require('aws-ses-mail');

//                 var sesMail = new awsSesMail();
//                 var sesConfig = {
//                     accessKeyId: "AKIAQFXTPLX2CNUSHP5C",
//                     secretAccessKey: "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",
//                     region: 'us-west-2'
//                 };
//                 sesMail.setConfig(sesConfig);

//                 console.log('sending mail');

//                 var options = {
//                     from: 'AMP Digital <amitabh@ads4growth.com>',
//                     to: "amitabh@ads4growth.com",
//                     subject: 'ampdigital.co: New Contact Request',
//                     replyToAddresses: email,
//                     template: 'views/email.ejs',
//                     templateArgs: {
//                         username: fullname,
//                         useremail: email,
//                         phone: phone,
//                         message: message,
//                         subscribedto: "siddharthsogani22@gmail.com",
//                         unsubscribelink: '<a target="_blank" href="http://newsapp.io/unsubscribe?emailid="' + 'siddharthsogani22@gmail.com' + '>' +
//                             '<unsubscribe>Unsubscribe</unsubscribe>' +
//                             '</a>'
//                     }
//                 };

//                 var options2 = {
//                     from: 'AMP Digital <amitabh@ads4growth.com>',
//                     to: email,
//                     subject: 'ampdigital.co: Your Contact Request',
//                     template: 'views/email2.ejs',
//                     templateArgs: {
//                         username: fullname,
//                         useremail: email,
//                         phone: phone,
//                         message: message,
//                         subscribedto: "siddharthsogani22@gmail.com",
//                         unsubscribelink: '<a target="_blank" href="http://newsapp.io/unsubscribe?emailid="' + 'siddharthsogani22@gmail.com' + '>' +
//                             '<unsubscribe>Unsubscribe</unsubscribe>' +
//                             '</a>'
//                     }
//                 };

//                 sesMail.sendEmailByHtml(options, function (data) {
//                     sesMail.sendEmailByHtml(options2, function (data) {
//                         testimonial.find({ deleted: false }, function (err, testimonials) {
//                             if (testimonials) {
//                                 res.redirect('/contactusflash')
//                             }
//                         })
//                     });
//                 });
//             }
//         });
//     }
// });

router.get('/contactusflash', function (req, res) {
    res.render('contactusflash');
})

router.get('/getintouch', function (req, res) {
    var email = req.query.email;

    var awsSesMail = require('aws-ses-mail');

    var sesMail = new awsSesMail();
    var sesConfig = {
        accessKeyId: "AKIAQFXTPLX2CNUSHP5C",
        secretAccessKey: "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",
        region: 'us-west-2'
    };
    sesMail.setConfig(sesConfig);

    console.log('sending mail');

    var options = {
        from: 'NewsApp.io <amitabh@ads4growth.com>',
        to: "amitabh@ads4growth.com",
        subject: 'ads4growth.com: New Contact Request',
        replyToAddresses: email,
        template: 'views/email3.ejs',
        templateArgs: {
            useremail: email,
            subscribedto: "siddharthsogani22@gmail.com",
            unsubscribelink: '<a target="_blank" href="http://newsapp.io/unsubscribe?emailid="' + 'siddharthsogani22@gmail.com' + '>' +
                '<unsubscribe>Unsubscribe</unsubscribe>' +
                '</a>'
        }
    };

    sesMail.sendEmailByHtml(options, function (data) {
        res.json(1);
    });
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
    passport.authenticate('local-signup', { failureRedirect: '/courses/digital-marketing-course' }),
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

/*Login Form Page*/
router.get('/auth', myLogger, function (req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect(req.session.returnTo);
    }
    else {
        res.render('loginform', { signupMessage: req.flash('signupMessage'), title: 'Express' });
    }
});

/*Login Form Page*/
router.get('/budding-marketer-challenge/register', myLogger, function (req, res, next) {
    req.session.returnTo = '/budding-marketer-challenge/application';
    if (req.isAuthenticated()) {
        res.redirect(req.session.returnTo);
    }
    else {
        res.render('bmcloginform', { signupMessage: req.flash('signupMessage'), title: 'Express' });
    }
});

router.post('/referralchallengeapplication', function (req, res, next) {
    var teamArray = [];
    for(var i = 0; i<parseInt(req.body.teamcount); i++){
        teamArray.push({
            fullname: req.body["fullname"+(i+1)],
            email: req.body["email"+(i+1)],
            phone: req.body["phone"+(i+1)],
            profession: req.body["profession"+(i+1)],
            organization: req.body["organization"+(i+1)]
        })
    }
    // res.json(teamArray);
    lmsUsers
  .findOne({teamid: {$exists: true}})
  .sort('-teamid')  // give me the max
  .exec(function (err, member) {
    //   return res.json(member);
    lmsUsers.update(
        {email: req.user.email},
        {
            $set: {
                teamname: req.body.teamname,
                teamid: member.teamid+1,
                teamuserid: req.body.teamname.replace(/ +/g, '-').toLowerCase()+'-'+(member.teamid+1),
                teammembers: teamArray
            }
        }
        ,
        async function (err, count) {
            if (err) {
                console.log(err);
            }
            else {
                for(var i = 0; i<parseInt(req.body.teamcount); i++){
                    try {
                        var memberObj = new teammember({
                            fullname: req.body["fullname"+(i+1)],
                            email: req.body["email"+(i+1)],
                            phone: req.body["phone"+(i+1)],
                            profession: req.body["profession"+(i+1)],
                            organization: req.body["organization"+(i+1)],
                            teamid: req.body.teamname.replace(/ +/g, '-').toLowerCase()+'-'+(member.teamid+1)
                        });
                        let newUser = await memberObj.save();
                        console.log(newUser);
                      } catch (err) {
                        console.log('err' + err);
                        // res.status(500).send(err);
                      }
                }
                // res.json(req.user.email);
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
            We have received your application for AMP Digital's Budding Marketer Challenge. Your application is under process. You will hear from us soon.
            <br><br>
            Your credentials:
            <br>
            Email: ${req.user.email}
            <br>
            Password: ${member.teampassword}
            `
            '<br>\n' +
                '<br>\n' +
                '<br><table width="351" cellspacing="0" cellpadding="0" border="0"> <tr> <td style="text-align:left;padding-bottom:10px"><a style="display:inline-block" href="https://www.ampdigital.co"><img style="border:none;" width="150" src="https://s1g.s3.amazonaws.com/36321c48a6698bd331dca74d7497797b.jpeg"></a></td> </tr> <tr> <td style="border-top:solid #000000 2px;" height="12"></td> </tr> <tr> <td style="vertical-align: top; text-align:left;color:#000000;font-size:12px;font-family:helvetica, arial;; text-align:left"> <span> </span> <br> <span style="font:12px helvetica, arial;">Email:&nbsp;<a href="mailto:amitabh@ampdigital.co" style="color:#3388cc;text-decoration:none;">amitabh@ampdigital.co</a></span> <br><br> <span style="margin-right:5px;color:#000000;font-size:12px;font-family:helvetica, arial">Registered Address: AMP Digital</span> 403, Sovereign 1, Vatika City, Sohna Road,, Gurugram, Haryana, 122018, India<br><br> <table cellpadding="0" cellpadding="0" border="0"><tr><td style="padding-right:5px"><a href="https://facebook.com/https://www.facebook.com/AMPDigitalNet/" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/23f7b48395f8c4e25e64a2c22e9ae190.png" alt="Facebook" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://twitter.com/https://twitter.com/amitabh26" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3949237f892004c237021ac9e3182b1d.png" alt="Twitter" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://linkedin.com/in/https://in.linkedin.com/company/ads4growth?trk=public_profile_topcard_current_company" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/dcb46c3e562be637d99ea87f73f929cb.png" alt="LinkedIn" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://youtube.com/https://www.youtube.com/channel/UCMOBtxDam_55DCnmKJc8eWQ" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3b2cb9ec595ab5d3784b2343d5448cd9.png" alt="YouTube" style="border:none;"></a></td></tr></table><a href="https://www.ampdigital.co" style="text-decoration:none;color:#3388cc;">www.ampdigital.co</a> </td> </tr> </table> <table width="351" cellspacing="0" cellpadding="0" border="0" style="margin-top:10px"> <tr> <td style="text-align:left;color:#aaaaaa;font-size:10px;font-family:helvetica, arial;"><p>AMP&nbsp;Digital is a Google Partner Company</p></td> </tr> </table>'
            var options = {
                from: 'ampdigital.co <amitabh@ads4growth.com>',
                to: "siddharthsogani22@gmail.com",
                subject: 'ampdigital.co: Budding Marketer Challenge Application received',
                content: '<html><head></head><body>' + html + '</body></html>'
            };

            sesMail.sendEmail(options, function (err, data) {
                // TODO sth....
                console.log(err);
                res.redirect("/budding-marketer-challenge/portal/"+req.body.teamname.replace(/ +/g, '-').toLowerCase()+'-'+(member.teamid+1))
            });
            }
        });
  });
})

router.get('/budding-marketer-challenge/application', myLogger, function (req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('/budding-marketer-challenge/register');
    }
    else {
        req.session.returnTo = "/referral";
        res.render('bmcform', { title: 'Express', moment: moment, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
    }
});

router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect(req.session.returnTo || '/');
        delete req.session.returnTo;
    });

router.get('/auth/linkedin',
  passport.authenticate('linkedin', { state: true  }),
  function(req, res){
    // The request will be redirected to LinkedIn for authentication, so this
    // function will not be called.
  });


router.get('/auth/linkedin/callback',
    passport.authenticate('linkedin', { failureRedirect: '/' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect(req.session.returnTo);
        delete req.session.returnTo;
    });


router.get('/auth/twitter', passport.authenticate('twitter'));


router.get('/auth/twitter/callback',
    passport.authenticate('twitter', { failureRedirect: '/' }),
    function(req, res) {
        console.log("aegaeg");
        console.log(req.session.returnTo);
        // Successful authentication, redirect home.
        res.redirect(req.session.returnTo || '/');
        delete req.session.returnTo;
    });

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect(req.session.returnTo || '/');
        delete req.session.returnTo;
    });

// router.get('/digital-marketing-community/postold/:postid', myLogger, function (req, res, next) {
//     const { ObjectId } = require('mongodb'); // or ObjectID
//     const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;
//     var postid = req.params.postid;
//     var idArray = postid.split("-");
//     var id = null;
//     if(typeof idArray!=="undefined" && idArray && idArray.length>0){
//         id=idArray[idArray.length-1];
//         console.log("ahieghaieg");
//         var id = parseInt(id);
//         var queryString = {"id": id};
//         forumcomment.findOne(queryString, function (err, post) {
//             if(post){
//                 // res.json(post);
//                 lmsModules.findOne({ _id: safeObjectId(post.moduleid)}, function (err, module) {
//                     if (req.isAuthenticated()) {
//                         res.render('qanda4', { module: module, fullname: getusername(req.user) + " " + (req.user.local.lastname?req.user.local.lastname: ""), post: post, moment: moment, moment: moment, email: req.user.email, userid: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, user: req.user, name: getusername(req.user), notifications: req.user.notifications });
//                     }
//                     else {
//                         req.session.returnTo = req.url;
//                         res.render('qanda4', { module: module, userid: null, fullname: null, name: null, post: post, moment: moment, title: 'Express' });
//                     }
//                 });
//             }
//             else{
//                 res.json(req.url)
//                 // res.redirect("/")
//             }
//         });
//     }
//     else{
//         res.json(req.url)
//         // res.redirect("/")
//     }
// });

router.get('/digital-marketing-community/post/:postid', myLogger, function (req, res, next) {
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;
    var postid = req.params.postid;
    var idArray = postid.split("-");
    var id = null;
    if(typeof idArray!=="undefined" && idArray && idArray.length>0){
        id=idArray[idArray.length-1];
        console.log("ahieghaieg");
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
                            res.render('qanda4new', { url: req.url, parent: parent, module: module, replies:replies, fullname: getusername(req.user) + " " + (req.user.local.lastname?req.user.local.lastname: ""), post: post, moment: moment, moment: moment, email: req.user.email, userid: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, user: req.user, name: getusername(req.user), notifications: req.user.notifications });
                        }
                        else {
                            req.session.returnTo = req.url;
                            res.render('qanda4new', { url: req.url, parent: parent, module: module, replies:replies, userid: null, fullname: null, name: null, post: post, moment: moment, title: 'Express' });
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

router.get('/digital-marketing-community-forums/all', myLogger, function (req, res, next) {
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
                        res.render('qanda2newnew', {url: req.url, comments: value, fullname: getusername(req.user) + " " + (req.user.local.lastname?req.user.local.lastname: ""), moduleslist: moduleslist, moment: moment, moment: moment, email: req.user.email, userid: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, user: req.user, name: getusername(req.user), notifications: req.user.notifications });
                    }
                    else {
                        res.render('qanda2newnew', {url: req.url, comments: value, userid: null, fullname: null, name: null, moduleslist: moduleslist, moment: moment, moduleid: req.params.moduleid, title: 'Express' });
                    }
                });
                 },
                function(error) { res.json(error) }
              );
})


router.get('/digital-marketing-community-forums/:moduleid', myLogger, function (req, res, next) {
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
                                    res.render('qanda2new', {url: req.url, comments: value, fullname: getusername(req.user) + " " + (req.user.local.lastname?req.user.local.lastname: ""), module: module, moduleslist: moduleslist, moment: moment, moduleid: req.params.moduleid, course: modulesObj, moment: moment, email: req.user.email, userid: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, user: req.user, name: getusername(req.user), notifications: req.user.notifications });
                                }
                                else {
                                    res.render('qanda2new', {url: req.url, comments: value, userid: null, fullname: null, name: null, module: module, moduleslist: moduleslist, moment: moment, moduleid: req.params.moduleid, course: modulesObj, title: 'Express' });
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

/*Login Form Page*/
router.get('/register', myLogger, function (req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect(req.session.returnTo);
    }
    else {
        res.render('signupform', { title: 'Express' });
    }
});

/*Job Form Page*/
router.get('/jobs/post', myLogger, function (req, res, next) {
    req.session.returnTo = req.path;
    if (!req.isAuthenticated()) {
        res.render('postjob', { title: 'Express', authenticated: false });
    }
    else {
        res.render('postjob', { title: 'Express', authenticated: true, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
    }
});

/* GET blog post page. */
router.get('/jobs', myLogger, function (req, res, next) {
    req.session.returnTo = req.path;
    job.find({ deleted: { $ne: "true" }, approved: true, company: { $ne: "AMP Digital Solutions Pvt Ltd" } }).skip(0).limit(10).sort({ date: -1 }).exec(function (err, jobs) {
        job.find({ deleted: { $ne: "true" }, approved: true, company: { $in: ["AMP Digital Solutions Pvt Ltd"] } }).skip(0).limit(10).sort({ date: -1 }).exec(function (err, ampdigitaljobs) {
            for (var i = 0; i < jobs.length; i++) {
                ampdigitaljobs.push(jobs[i]);
            }
            if (req.isAuthenticated()) {
                res.render('jobs', { title: 'Express', active: "all", jobs: ampdigitaljobs, moment: moment, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
            }
            else {
                res.render('jobs', { title: 'Express', active: "all", jobs: ampdigitaljobs, moment: moment });
            }
        });
    });
});

router.get('/jobs/home', myLogger, function (req, res, next) {
    req.session.returnTo = req.path;
    if (req.isAuthenticated()) {
        res.render('jobslandingpage', { moment: moment, success: '_', title: 'Express', email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
    }
    else {
        res.render('jobslandingpage', { moment: moment, success: '_', title: 'Express' });
    }
});
/* GET blog post page. */
router.get('/jobs/:joburl', myLogger, function (req, res, next) {
    req.session.returnTo = req.path;
    var joburl = req.params.joburl;
    var jobidArray = joburl.split("-");
    var jobid = jobidArray[jobidArray.length - 1];
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;
    job.findOne({ deleted: { $ne: true }, _id: safeObjectId(jobid) }, function (err, job) {
        if (job) {
            if (req.isAuthenticated()) {
                res.render('job', { title: 'Express', job: job, moment: moment, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), phone: req.user.local.phone, notifications: req.user.notifications });
            }
            else {
                res.render('job', { job: job, moment: moment });
            }
        }
        else {
            res.redirect('/blogs')
        }
    });
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
                            skillkeywords: req.body.skillkeywords,
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
            skillkeywords: req.body.skillkeywords,
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

router.post('/sendpdf', function (req, res, next) {
    var bookdownload2 = new bookdownload({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phonenumber: req.body.phonenumber,
        countrycode: req.body.countrycode,
        email: req.body.email,
        date: new Date()
    });
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
                console.log("haoieghaeg");
                console.log(count);
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

router.get('/isvalidcoupon', function (req, res, next) {
    coupon.find({ name: req.query.couponcode, "validfrom": { $lte: Date.now() }, "validto": { $gte: Date.now() } }, function (err, coupon) {
        if (coupon.length > 0) {
            res.json(coupon[0]);
        }
        else {
            if(req.query.couponcode && req.query.couponcode.trim()!==""){
                lmsUsers.findOne({ "local.referralcode": req.query.couponcode }, function (err, user) {
                    if (user) {
                        res.json({ participantname: user.local.name + " " + user.local.lastname, type: "referralcode", offertoparticipant: 750, offertoenrollment: 10 });
                    }
                    else {
                        res.json(false)
                    }
                });
            }
            else{
                res.json(false);
            }
        }
    });
});

router.get('/isvalidcoupon2', function (req, res, next) {
    coupon.find({ name: req.query.couponcode, "validfrom": { $lte: Date.now() }, "validto": { $gte: Date.now() } }, function (err, coupon) {
        if (coupon.length > 0) {
            res.json(coupon[0]);
        }
        else {
            if(req.query.couponcode && req.query.couponcode.trim()!==""){
                lmsUsers.findOne({ "local.referralcode": req.query.couponcode }, function (err, user) {
                    if (user) {
                        res.json({ participantname: user.local.name + " " + user.local.lastname, type: "referralcode", offertoparticipant: 400, offertoenrollment: 10 });
                    }
                    else {
                        res.json(false)
                    }
                });
            }
            else{
                res.json(false);
            }
        }
    });
});

router.get('/isvalidcoupon3', function (req, res, next) {
    coupon.find({ name: req.query.couponcode, "validfrom": { $lte: Date.now() }, "validto": { $gte: Date.now() } }, function (err, coupon) {
        if (coupon.length > 0) {
            res.json(coupon[0]);
        }
        else {
            if(req.query.couponcode && req.query.couponcode.trim()!==""){
                lmsUsers.findOne({ "local.referralcode": req.query.couponcode }, function (err, user) {
                    if (user) {
                        res.json({ participantname: user.local.name + " " + user.local.lastname, type: "referralcode", offertoparticipant: 50, offertoenrollment: 50 });
                    }
                    else {
                        res.json(false)
                    }
                });
            }
            else{
                res.json(false);
            }
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

/*Login Form Page*/
router.get('/budding-marketer-program', function (req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/referral');
    }
    else {
        req.session.returnTo = "/budding-marketer-program/application";
        res.render('bpmpage', { title: 'Express' });
    }
});

/*Login Form Page*/
router.get('/bmpfast', function (req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/referral');
    }
    else {
        req.session.returnTo = "/budding-marketer-program/application";
        res.render('bpmpagefast', { title: 'Express' });
    }
});


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

router.get('/courses', myLogger, function (req, res, next) {
    req.session.returnTo = req.path;
    var testimonials = [{ "_id": "5e85bc5441ed9f001409fc6c", "name": " Vivek Arora     ", "testimonial": "I joined this course in October and it’s been an interesting journey. I have seen a lot of growth in my intellect and Understanding the digital Business after going through the course and now, I relate more to the ads which I see on my social media accounts and I truly relate to how this is getting monetized or this is getting targeted. It's been an immense learning experience for me.\n\n", "designation": " VP Discovery Channel", "date": "2020-04-02T10:20:04.143Z", "deleted": false, "__v": 0, "image": "/testimonials/vivek.jpg" }, { "_id": "5e85bf2182b720001486b122", "name": "Rohit Virmani", "testimonial": "Upcoming E-commerce is related to Digital World so I need to draw to grow at a much faster Pace Which can only be achieved through Digital Transformation and This course helps me In achieving my goal. There is no feeling like we're sitting in a classroom and studying instead it's like we are just hanging out around, talking with our friends, discussing latest technology, latest trends over a cup of coffee. \n", "designation": " Entrepreneur, owner, VP Spaces     ", "date": "2020-04-02T10:32:01.977Z", "deleted": false, "__v": 0, "image": "/testimonials/rohit.jpg" }, { "_id": "5e85bfab82b720001486b123", "name": "Abhijay Srivastava ", "testimonial": "Ms. Amitabh ( Lead Instructor) is with the Google background and actually has got his hand in this Business so he is able to take us through the entire Nuances, what is the Micro and Macro thing, how does this digital thing fit in this new age of Marketing. There are case studies, detailed Discussions. If you are really looking to learn Digital marketing, Then this the course for growing Forward.\n", "designation": " AGM Marketing, SquareYards", "date": "2020-04-02T10:34:19.934Z", "deleted": false, "__v": 0, "image": "/testimonials/abhijay.jpg" }, { "_id": "5e85c05c82b720001486b124", "name": "Anshuman Sinha", "testimonial": "Mr. Amitabh has vast experience in this field and he has worked himself with google for a decade and I think so even as a teacher, he comes across as a great companion and guide. I am still connected with him even though the course is over where I take tips from him or try to understand what more can be done besides what we are currently doing.\n\n", "designation": "Associate Director, Flipkart", "date": "2020-04-02T10:37:16.681Z", "deleted": false, "__v": 0, "image": "/testimonials/anshuman.jpg" }, { "_id": "5e85c14e82b720001486b125", "name": "Vishal Dilawari", "testimonial": "During this course itself, I have learned all aspects of Digital marketing like SEO, Google Analytics, social media marketing, and I see myself as a marketing professional in both Traditional and non-traditional marketing.\n", "designation": "Marketing Manager, Better Life, Dubal", "date": "2020-04-02T10:41:18.139Z", "deleted": false, "__v": 0, "image": "/testimonials/Vishal.jpg" }];
    lmsCourses.find({ 'deleted': { $ne: 'true' }, course_live: "Live"}, function (err, courses) {
        res.json(courses);
        return;
        if (req.isAuthenticated()) {
            if (req.query.code) {
                res.render('courses', { moment: moment, referralcode: req.query.code, courses: courses, testimonials: testimonials, success: '_', title: 'Express', email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
            }
            else {
                res.render('courses', { moment: moment,referralcode: "", courses: courses, testimonials: testimonials, success: '_', title: 'Express', email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
            }
        }
        else {
            if (req.query.code) {
                res.render('courses', { moment: moment,referralcode: req.query.code, courses: courses, testimonials: testimonials, success: '_', title: 'Express' });
            }
            else {
                res.render('courses', { moment: moment,referralcode: "", courses: courses, testimonials: testimonials, success: '_', title: 'Express' });
            }
        }
    });
});

router.get('/contact', myLogger, function (req, res, next) {
    // req.session.returnTo = req.path;
    // var testimonials = [{ "_id": "5e85bc5441ed9f001409fc6c", "name": " Vivek Arora     ", "testimonial": "I joined this course in October and it’s been an interesting journey. I have seen a lot of growth in my intellect and Understanding the digital Business after going through the course and now, I relate more to the ads which I see on my social media accounts and I truly relate to how this is getting monetized or this is getting targeted. It's been an immense learning experience for me.\n\n", "designation": " VP Discovery Channel", "date": "2020-04-02T10:20:04.143Z", "deleted": false, "__v": 0, "image": "/testimonials/vivek.jpg" }, { "_id": "5e85bf2182b720001486b122", "name": "Rohit Virmani", "testimonial": "Upcoming E-commerce is related to Digital World so I need to draw to grow at a much faster Pace Which can only be achieved through Digital Transformation and This course helps me In achieving my goal. There is no feeling like we're sitting in a classroom and studying instead it's like we are just hanging out around, talking with our friends, discussing latest technology, latest trends over a cup of coffee. \n", "designation": " Entrepreneur, owner, VP Spaces     ", "date": "2020-04-02T10:32:01.977Z", "deleted": false, "__v": 0, "image": "/testimonials/rohit.jpg" }, { "_id": "5e85bfab82b720001486b123", "name": "Abhijay Srivastava ", "testimonial": "Ms. Amitabh ( Lead Instructor) is with the Google background and actually has got his hand in this Business so he is able to take us through the entire Nuances, what is the Micro and Macro thing, how does this digital thing fit in this new age of Marketing. There are case studies, detailed Discussions. If you are really looking to learn Digital marketing, Then this the course for growing Forward.\n", "designation": " AGM Marketing, SquareYards", "date": "2020-04-02T10:34:19.934Z", "deleted": false, "__v": 0, "image": "/testimonials/abhijay.jpg" }, { "_id": "5e85c05c82b720001486b124", "name": "Anshuman Sinha", "testimonial": "Mr. Amitabh has vast experience in this field and he has worked himself with google for a decade and I think so even as a teacher, he comes across as a great companion and guide. I am still connected with him even though the course is over where I take tips from him or try to understand what more can be done besides what we are currently doing.\n\n", "designation": "Associate Director, Flipkart", "date": "2020-04-02T10:37:16.681Z", "deleted": false, "__v": 0, "image": "/testimonials/anshuman.jpg" }, { "_id": "5e85c14e82b720001486b125", "name": "Vishal Dilawari", "testimonial": "During this course itself, I have learned all aspects of Digital marketing like SEO, Google Analytics, social media marketing, and I see myself as a marketing professional in both Traditional and non-traditional marketing.\n", "designation": "Marketing Manager, Better Life, Dubal", "date": "2020-04-02T10:41:18.139Z", "deleted": false, "__v": 0, "image": "/testimonials/Vishal.jpg" }];
    // if (req.isAuthenticated()) {
    //     if (req.query.code) {
    //         res.render('contact', { moment: moment, referralcode: req.query.code, courses: {}, testimonials: testimonials, success: '_', title: 'Express', email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
    //     }
    //     else {
    //         res.render('contact', { moment: moment,referralcode: "", courses: {}, testimonials: testimonials, success: '_', title: 'Express', email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
    //     }
    // }
    // else {
    //     if (req.query.code) {
    //         res.render('contact', { moment: moment,referralcode: req.query.code, courses: {}, testimonials: testimonials, success: '_', title: 'Express' });
    //     }
    //     else {
    //         res.render('contact', { moment: moment,referralcode: "", courses: {}, testimonials: testimonials, success: '_', title: 'Express' });
    //     }
    // }
    res.render("contact");
    // res.redirect("/");
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
                    // var html = fs.readFileSync('./public/html/index.html', 'utf8');
                    /*var html = "<html><head>" +
                        "<style>" +
                        "body{" +
                        "height:100vh;}" +
                        "</style>" +
                        "</head>\n" +
                        "<body>" +
                        "<div style=\"width:720px; height:520px; margin-left: 2.5%; padding:20px; text-align:center; border: 10px solid #787878\">\n" +
                        "<div style=\"width:675px; height:475px; padding:20px; text-align:center; border: 5px solid #787878\">\n" +
                        "       <span style=\"font-size:45px; font-weight:bold\">Certificate of Completion</span>\n" +
                        "       <br><br>\n" +
                        "       <span class='thisisto' style=\"font-size:22.5px\"><i>This is to certify that</i></span>\n" +
                        "       <br><br>\n" +
                        "       <span style=\"font-size:27px\"><b>"+user.local.name+"</b></span><br/><br/>\n" +
                        "       <span style=\"font-size:22.5px\"><i>has completed the course</i></span> <br/><br/>\n" +
                        "       <span style=\"font-size:27px\">"+course.course_name+"</span> <br/><br/>\n" +
                        "       <span style=\"font-size:18px\">an online course offered through AMP Digital</span> <br/><br/><br/><br/>\n" +
                        "       <br><br><br><br>" +
                        "<div><div style='text-align: left'><span style=\"font-size:22.5px\"><i>Amitabh Verma</i></span><br>\n" +
                        "      AMP Digital\n" +
                        "      <span style=\"font-size:30px\"></span>" +
                        "</div>" +
                        "<div style='text-align: right'>" +
                        "<span style='font-size:10px'><i>" +
                        "Verify at www.ampdigital.co/certificate/5ae8538b7045b900141a7407/5ad4889235aea65a2fa7759b</i></span><br>" +
                    "<span style='font-size:10px'>AMP digital has verified the identify of the individual and participation the course</span>" +
                        "</div>" +
                        "</div>" +
                        "\n" +
                        "</div>\n" +
                        "</div>" +
                        "</body>" +
                        "</html>";*/

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
        if ((new Date().getTime() - new Date(docs[0].date).getTime()) / 60000 < 300) {
            res.render('resetpassword', { title: 'Express', email: docs[0].email, name: "User" });
        }
        else {
            res.json("Request link again");
        }
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
    if(req.body.captcharesponse && (req.body.captcharesponse==true || req.body.captcharesponse =="true")){
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
    // res.json('sent');
});

/* GET courses page. */
router.get('/dashboard', myLogger, isLoggedIn, function (req, res, next) {
    req.session.returnTo = req.path;
    var courses = [];
    if (req.user.courses) {
        lmsCourses.find({ 'deleted': { $ne: 'true' }, "_id": { $in: req.user.courses } }, function (err, courses) {
            res.render('dashboard', { title: 'Express', courses: courses, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
        });
    }
    else {
        res.render('dashboard', { title: 'Express', courses: [], email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
    }
});

/* GET courses page. */
router.get('/allcourses', function (req, res, next) {
    lmsCourses.find({ 'deleted': { $ne: 'true' } }, function (err, courses) {
        res.json(courses);
    });
});

/* GET courses page. */
// router.get('/courses/digital-marketing-course', myLogger, function (req, res, next) {
//     req.session.returnTo = '/courses/digital-marketing-course';
//     lmsCourses.findOne({course_name: "Digital Marketing Course"}, function (err, course) {
//         testimonial.find({ deleted: false }, function (err, testimonials) {
//         if (req.isAuthenticated()) {
//             lmsUsers.count({ courses: "5ba67703bda6d500142e2d15", email: req.user.email }, function (err, count) {
//                 req.session.returnTo = '/courses/digital-marketing-course';
//                 if (count > 0) {
//                     res.render('digitalmarketingcourse', {moment: moment, course: course, cls: req.query.payment && req.query.payment == "true" ? " d-none" : "", testimonials: testimonials, title: 'Express', 'enrolled': true, digitalmarketingcoursemodules: digitalmarketingcoursemodules, paymentemail: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, paymentname: getusername(req.user), notifications: req.user.notifications, paymentcouponcode: req.user.local.couponcode, paymentphone: req.user.local.phone, paymentuser_id: req.user._id.toString(), email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications, phone: req.user.phone, user_id: req.user._id, user: req.user });
//                 }
//                 else {
//                     res.render('digitalmarketingcourse', {moment: moment, course: course, cls: req.query.payment && req.query.payment == "true" ? "d-none" : "", testimonials: testimonials, title: 'Express', 'enrolled': false, digitalmarketingcoursemodules: digitalmarketingcoursemodules, paymentemail: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, paymentname: getusername(req.user), notifications: req.user.notifications, paymentcouponcode: req.user.local.couponcode, paymentphone: req.user.local.phone, paymentuser_id: req.user._id.toString(), email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications, phone: req.user.phone, user_id: req.user._id, user: req.user });
//                 }
//             });
//         }
//         else {
//             req.session.returnTo = '/courses/digital-marketing-course';
//             res.render('digitalmarketingcourse', {moment: moment, course: course, cls: req.query.payment && req.query.payment == "true" ? "d-none" : "", testimonials: testimonials, title: 'Express', 'enrolled': false, digitalmarketingcoursemodules: digitalmarketingcoursemodules, paymentcouponcode: '', paymentemail: '', paymentname: '', paymentphone: '', paymentuser_id: '', user: null });
//         }
//         });
//     });
// });

router.get('/courses/digital-marketing-course', myLogger, function (req, res, next) {
    req.session.returnTo = req.path;
    lmsCourses.findOne({course_name: "Digital Marketing Course"}, function (err, course) {
        lmsBatches.find({ course_id: "5ba67703bda6d500142e2d15", deleted: { $ne: true } }, function (err, batches) {
            testimonial.find({ deleted: false }, function (err, testimonials) {
                lmsCourses.find({ 'deleted': { $ne: 'true' }, course_live: "Live"}, function (err, courses) {
                    if (req.isAuthenticated()) {
                        lmsUsers.count({ courses: "5ba67703bda6d500142e2d15", email: req.user.email }, function (err, count) {
                            if (count > 0) {
                                res.render('webpresence', { path: req.path, course: course,  courses: courses, moment: moment, cls: req.query.payment && req.query.payment == "true" ? " d-none" : "", batches: batches, testimonials: testimonials, title: 'Express', 'enrolled': true, digitalmarketingcoursemodules: digitalmarketingcoursemodules, paymentemail: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, paymentname: getusername(req.user), notifications: req.user.notifications, paymentcouponcode: req.user.local.couponcode, paymentphone: req.user.local.phone, paymentuser_id: req.user._id.toString(), email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications, phone: req.user.phone, user_id: req.user._id, user: req.user });
                            }
                            else {
                                res.render('webpresence', { path: req.path, course: course,  courses: courses, moment: moment, cls: req.query.payment && req.query.payment == "true" ? "d-none" : "", batches: batches, testimonials: testimonials, title: 'Express', 'enrolled': false, digitalmarketingcoursemodules: digitalmarketingcoursemodules, paymentemail: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, paymentname: getusername(req.user), notifications: req.user.notifications, paymentcouponcode: req.user.local.couponcode, paymentphone: req.user.local.phone, paymentuser_id: req.user._id.toString(), email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications, phone: req.user.phone, user_id: req.user._id, user: req.user });
                            }
                        });
                    }
                    else {
                        res.render('webpresence', { path: req.path, course: course, moment: moment, courses: courses, cls: req.query.payment && req.query.payment == "true" ? "d-none" : "", batches: batches, testimonials: testimonials, title: 'Express', 'enrolled': false, digitalmarketingcoursemodules: digitalmarketingcoursemodules, paymentcouponcode: '', paymentemail: '', paymentname: '', paymentphone: '', paymentuser_id: '', user: null });
                    }
                });
            });
        })
    });
});

router.get('/courses/advanced-google-analytics-and-blogging', myLogger, function (req, res, next) {
    req.session.returnTo = req.path;
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;
    lmsCourses.findOne({_id: safeObjectId("603f727b2a5223001495b405")}, function (err, course) {
        console.log('___course');
        console.log(course);
        lmsBatches.find({ course_id: "603f727b2a5223001495b405", deleted: { $ne: true } }, function (err, batches) {
            testimonial.find({ deleted: false }, function (err, testimonials) {
                lmsCourses.find({ 'deleted': { $ne: 'true' }, course_live: "Live"}, function (err, courses) {
                    if (req.isAuthenticated()) {
                        lmsUsers.count({ courses: "603f727b2a5223001495b405", email: req.user.email }, function (err, count) {
                            if (count > 0) {
                                res.render('googleanalytics', { path: req.path, course: course,  courses: courses, moment: moment, cls: req.query.payment && req.query.payment == "true" ? " d-none" : "", batches: batches, testimonials: testimonials, title: 'Express', 'enrolled': true, digitalmarketingcoursemodules: digitalmarketingcoursemodules, paymentemail: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, paymentname: getusername(req.user), notifications: req.user.notifications, paymentcouponcode: req.user.local.couponcode, paymentphone: req.user.local.phone, paymentuser_id: req.user._id.toString(), email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications, phone: req.user.phone, user_id: req.user._id, user: req.user });
                            }
                            else {
                                res.render('googleanalytics', { path: req.path, course: course,  courses: courses, moment: moment, cls: req.query.payment && req.query.payment == "true" ? "d-none" : "", batches: batches, testimonials: testimonials, title: 'Express', 'enrolled': false, digitalmarketingcoursemodules: digitalmarketingcoursemodules, paymentemail: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, paymentname: getusername(req.user), notifications: req.user.notifications, paymentcouponcode: req.user.local.couponcode, paymentphone: req.user.local.phone, paymentuser_id: req.user._id.toString(), email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications, phone: req.user.phone, user_id: req.user._id, user: req.user });
                            }
                        });
                    }
                    else {
                        res.render('googleanalytics', { path: req.path, course: course, moment: moment, courses: courses, cls: req.query.payment && req.query.payment == "true" ? "d-none" : "", batches: batches, testimonials: testimonials, title: 'Express', 'enrolled': false, digitalmarketingcoursemodules: digitalmarketingcoursemodules, paymentcouponcode: '', paymentemail: '', paymentname: '', paymentphone: '', paymentuser_id: '', user: null });
                    }
                });
            });
        })
    });
});

router.get('/courses/content-marketing', myLogger, function (req, res, next) {
    req.session.returnTo = req.path;
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;
    lmsCourses.findOne({_id: safeObjectId("6057fde1af237d00148162de")}, function (err, course) {
        lmsBatches.find({ course_id: "6057fde1af237d00148162de", deleted: { $ne: true } }, function (err, batches) {
            testimonial.find({ deleted: false }, function (err, testimonials) {
                lmsCourses.find({ 'deleted': { $ne: 'true' }, course_live: "Live"}, function (err, courses) {
                    if (req.isAuthenticated()) {
                        lmsUsers.count({ courses: "6057fde1af237d00148162de", email: req.user.email }, function (err, count) {
                            if (count > 0) {
                                res.render('contentmarketing', { path: req.path, course: course,  courses: courses, moment: moment, cls: req.query.payment && req.query.payment == "true" ? " d-none" : "", batches: batches, testimonials: testimonials, title: 'Express', 'enrolled': true, digitalmarketingcoursemodules: digitalmarketingcoursemodules, paymentemail: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, paymentname: getusername(req.user), notifications: req.user.notifications, paymentcouponcode: req.user.local.couponcode, paymentphone: req.user.local.phone, paymentuser_id: req.user._id.toString(), email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications, phone: req.user.phone, user_id: req.user._id, user: req.user });
                            }
                            else {
                                res.render('contentmarketing', { path: req.path, course: course,  courses: courses, moment: moment, cls: req.query.payment && req.query.payment == "true" ? "d-none" : "", batches: batches, testimonials: testimonials, title: 'Express', 'enrolled': false, digitalmarketingcoursemodules: digitalmarketingcoursemodules, paymentemail: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, paymentname: getusername(req.user), notifications: req.user.notifications, paymentcouponcode: req.user.local.couponcode, paymentphone: req.user.local.phone, paymentuser_id: req.user._id.toString(), email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications, phone: req.user.phone, user_id: req.user._id, user: req.user });
                            }
                        });
                    }
                    else {
                        res.render('contentmarketing', { path: req.path, course: course, moment: moment, courses: courses, cls: req.query.payment && req.query.payment == "true" ? "d-none" : "", batches: batches, testimonials: testimonials, title: 'Express', 'enrolled': false, digitalmarketingcoursemodules: digitalmarketingcoursemodules, paymentcouponcode: '', paymentemail: '', paymentname: '', paymentphone: '', paymentuser_id: '', user: null });
                    }
                });
            });
        })
    });
});

router.get('/courses/advanced-seo', myLogger, function (req, res, next) {
    req.session.returnTo = req.path;
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;
    lmsCourses.findOne({_id: safeObjectId("60b870e698c8130014a0d876")}, function (err, course) {
        lmsBatches.find({ course_id: "60b870e698c8130014a0d876", deleted: { $ne: true } }, function (err, batches) {
            testimonial.find({ deleted: false }, function (err, testimonials) {
                lmsCourses.find({ 'deleted': { $ne: 'true' }, course_live: "Live"}, function (err, courses) {
                    if (req.isAuthenticated()) {
                        lmsUsers.count({ courses: "60b870e698c8130014a0d876", email: req.user.email }, function (err, count) {
                            if (count > 0) {
                                res.render('advancedseo', { path: req.path, course: course,  courses: courses, moment: moment, cls: req.query.payment && req.query.payment == "true" ? " d-none" : "", batches: batches, testimonials: testimonials, title: 'Express', 'enrolled': true, digitalmarketingcoursemodules: digitalmarketingcoursemodules, paymentemail: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, paymentname: getusername(req.user), notifications: req.user.notifications, paymentcouponcode: req.user.local.couponcode, paymentphone: req.user.local.phone, paymentuser_id: req.user._id.toString(), email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications, phone: req.user.phone, user_id: req.user._id, user: req.user });
                            }
                            else {
                                res.render('advancedseo', { path: req.path, course: course,  courses: courses, moment: moment, cls: req.query.payment && req.query.payment == "true" ? "d-none" : "", batches: batches, testimonials: testimonials, title: 'Express', 'enrolled': false, digitalmarketingcoursemodules: digitalmarketingcoursemodules, paymentemail: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, paymentname: getusername(req.user), notifications: req.user.notifications, paymentcouponcode: req.user.local.couponcode, paymentphone: req.user.local.phone, paymentuser_id: req.user._id.toString(), email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications, phone: req.user.phone, user_id: req.user._id, user: req.user });
                            }
                        });
                    }
                    else {
                        res.render('advancedseo', { path: req.path, course: course, moment: moment, courses: courses, cls: req.query.payment && req.query.payment == "true" ? "d-none" : "", batches: batches, testimonials: testimonials, title: 'Express', 'enrolled': false, digitalmarketingcoursemodules: digitalmarketingcoursemodules, paymentcouponcode: '', paymentemail: '', paymentname: '', paymentphone: '', paymentuser_id: '', user: null });
                    }
                });
            });
        })
    });
});

router.get('/courses/google-ads-certification-course', myLogger, function (req, res, next) {
    req.session.returnTo = '/courses/google-ads-certification-course';
    lmsCourses.findOne({course_name: "Google Ads Certification Program"}, function (err, course) {
        lmsBatches.find({ course_id: "5efdc00ef1f2a30014a1fbef", deleted: { $ne: true } }, function (err, batches) {
            testimonial.find({ deleted: false }, function (err, testimonials) {
                if (req.isAuthenticated()) {
                    lmsUsers.count({ courses: "5efdc00ef1f2a30014a1fbef", email: req.user.email }, function (err, count) {
                        req.session.returnTo = '/courses/google-ads-certification-course';
                        if (count > 0) {
                            res.render('googleadscertificationprogram', { course: course, moment: moment, cls: req.query.payment && req.query.payment == "true" ? " d-none" : "", batches: batches, testimonials: testimonials, title: 'Express', 'enrolled': true, digitalmarketingcoursemodules: digitalmarketingcoursemodules, paymentemail: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, paymentname: getusername(req.user), notifications: req.user.notifications, paymentcouponcode: req.user.local.couponcode, paymentphone: req.user.local.phone, paymentuser_id: req.user._id.toString(), email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications, phone: req.user.phone, user_id: req.user._id, user: req.user });
                        }
                        else {
                            res.render('googleadscertificationprogram', { course: course, moment: moment, cls: req.query.payment && req.query.payment == "true" ? "d-none" : "", batches: batches, testimonials: testimonials, title: 'Express', 'enrolled': false, digitalmarketingcoursemodules: digitalmarketingcoursemodules, paymentemail: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, paymentname: getusername(req.user), notifications: req.user.notifications, paymentcouponcode: req.user.local.couponcode, paymentphone: req.user.local.phone, paymentuser_id: req.user._id.toString(), email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications, phone: req.user.phone, user_id: req.user._id, user: req.user });
                        }
                    });
                }
                else {
                    req.session.returnTo = '/google-ads-certification-course';
                    res.render('googleadscertificationprogram', {course: course, moment: moment, cls: req.query.payment && req.query.payment == "true" ? "d-none" : "", batches: batches, testimonials: testimonials, title: 'Express', 'enrolled': false, digitalmarketingcoursemodules: digitalmarketingcoursemodules, paymentcouponcode: '', paymentemail: '', paymentname: '', paymentphone: '', paymentuser_id: '', user: null });
                }
            });
        })
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

router.get('/courses/seo-workshop', myLogger, function (req, res, next) {
    req.session.returnTo = '/courses/seo-workshop';
    // res.redirect("/")
    lmsCourses.findOne({course_name: "SEO Workshop"}, function (err, course) {
        lmsBatches.find({ course_id: "5f62ecff258cf800145b71e4", deleted: { $ne: true } }, function (err, batches) {
            testimonial.find({ deleted: false }, function (err, testimonials) {
                if (req.isAuthenticated()) {
                    lmsUsers.count({ courses: "5f62ecff258cf800145b71e4", email: req.user.email }, function (err, count) {
                        if (count > 0) {
                            res.render('seoworkshop', { course: course, moment: moment, cls: req.query.payment && req.query.payment == "true" ? " d-none" : "", batches: batches, testimonials: testimonials, title: 'Express', 'enrolled': true, digitalmarketingcoursemodules: digitalmarketingcoursemodules, paymentemail: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, paymentname: getusername(req.user), notifications: req.user.notifications, paymentcouponcode: req.user.local.couponcode, paymentphone: req.user.local.phone, paymentuser_id: req.user._id.toString(), email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications, phone: req.user.phone, user_id: req.user._id, user: req.user });
                        }
                        else {
                            res.render('seoworkshop', { course: course, moment: moment, cls: req.query.payment && req.query.payment == "true" ? "d-none" : "", batches: batches, testimonials: testimonials, title: 'Express', 'enrolled': false, digitalmarketingcoursemodules: digitalmarketingcoursemodules, paymentemail: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, paymentname: getusername(req.user), notifications: req.user.notifications, paymentcouponcode: req.user.local.couponcode, paymentphone: req.user.local.phone, paymentuser_id: req.user._id.toString(), email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications, phone: req.user.phone, user_id: req.user._id, user: req.user });
                        }
                    });
                }
                else {
                    res.render('seoworkshop', {course: course, moment: moment, cls: req.query.payment && req.query.payment == "true" ? "d-none" : "", batches: batches, testimonials: testimonials, title: 'Express', 'enrolled': false, digitalmarketingcoursemodules: digitalmarketingcoursemodules, paymentcouponcode: '', paymentemail: '', paymentname: '', paymentphone: '', paymentuser_id: '', user: null });
                }
            });
        })
    });
});

/* GET courses page. */
router.get('/getfaqdocs/:course_id', function (req, res, next) {
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
            <div class="card-header" id="heading${i}">
                <h4 class="mb-0 collapsed" data-toggle="collapse"
                    data-target="#collapse${i}" aria-expanded="${i==0?'true':'false'}"
                    aria-controls="collapse${i}">
                    ${faqdocs[i]['_id'].category}
                </h4>
            </div>
            <div id="collapse${i}" class="collapse ${i==0?'show':''}"
                aria-labelledby="heading${i}" data-parent="#accordionExample">
                <div class="accordion m-3" id="accordionExample${i}">
                    
                  ${Object.keys(faqdocs[i].question).map(function (j) {
                return `
                <div class="card">
                    <div class="card-header" id="heading${i}-${j}">
                        <h4 class="mb-0" data-toggle="collapse"
                            data-target="#collapse${i}-${j}" aria-expanded="${j==0?'true':'false'}"
                            aria-controls="collapse${i}-${j}">
                            Q. ${faqdocs[i].question[j]}
                        </h4>
                    </div>

                    <div id="collapse${i}-${j}" class="collapse ${j==0?'show':''}"
                        aria-labelledby="heading${i}-${j}"
                        data-parent="#accordionExample">
                        <div class="card-body">
                            <p>
                            ${faqdocs[i].answer[j]}
                            </p>
                        </div>
                    </div>
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

router.get('/getcourseinfo', function (req, res, next) {
    req.session.returnTo = '/courses/digital-marketing-course';
    var html = "";
    var i = 0;
    for (key in digitalmarketingcoursemodules) {
        html = html + `<div class="card">
        <div class="card-header" style="    background: #f9f9f9!important;
      border: solid 1px #e8e9eb!important;" id="heading-${i}">
          <h5 class="mb-0">
            <a class="d-none d-md-block" style="color: #505763;
          font-size: 16px;
          font-weight: 600;" role="button" data-toggle="collapse" href="#collapse-${i}"
              aria-expanded="${ i == 0 ? 'true' : 'false'}" aria-controls="collapse-1">
              <span>${key}</span> <span style="font-weight: normal; font-size: smaller" class="pull-right mr-4">
                ${digitalmarketingcoursemodules[key].filter(function (el) {
            return el.element_type == 'video'
        }).length} Lectures &nbsp;&nbsp; ${digitalmarketingcoursemodules[key].filter(function (el) {
            return el.element_type == 'quiz'
        }).length} ${digitalmarketingcoursemodules[key].filter(function (el) {
            return el.element_type == 'quiz'
        }).length > 1 ? 'Quizes' : 'Quiz'}
                &nbsp;&nbsp;${digitalmarketingcoursemodules[key][0]['duration']}</span>
            </a>
            <a class="d-md-none" style="color: #505763;
          font-size: 12px;
          font-weight: 600;" role="button" data-toggle="collapse" href="#collapse-${i}"
              aria-expanded="${ i == 0 ? 'true' : 'false'}" aria-controls="collapse-1">
              <span>${key}</span> <span style="font-weight: normal; font-size: smaller" class="pull-right mr-4">
                ${digitalmarketingcoursemodules[key].filter(function (el) {
            return el.element_type == 'video'
        }).length} Lectures &nbsp;&nbsp; ${digitalmarketingcoursemodules[key].filter(function (el) {
            return el.element_type == 'quiz'
        }).length} ${digitalmarketingcoursemodules[key].filter(function (el) {
            return el.element_type == 'quiz'
        }).length > 1 ? 'Quizes' : 'Quiz'}
                &nbsp;&nbsp;${digitalmarketingcoursemodules[key][0]['duration']}</span>
            </a>
          </h5>
        </div>
        <div id="collapse-${i}" class="collapse ${i == 0 ? 'show' : ''}" data-parent="#accordion"
          aria-labelledby="heading-${i}">
          <div class="card-body">

            <div id="accordion-${i}">
              <div class="list-group">
              ${Object.keys(digitalmarketingcoursemodules[key]).map(function (j) {
            console.log(j);
            if (j > 0) {
                if (digitalmarketingcoursemodules[key][j]['element_name']=="Web Presence") {
                    return `
                    <div style="  color: #007791;  background: #f9f9f9;
                    border: solid 1px #e8e9eb; font-size: 14px;" href="#"
                      class="pl-5 list-group-item list-group-item-action d-none d-md-flex row justify-content-between">
                      <span> <i class="fa ${digitalmarketingcoursemodules[key][j]['element_type'] == 'video' ? 'fa-play-circle' : 'fa-clipboard-check'}"></i>&nbsp; ${digitalmarketingcoursemodules[key][j]['element_name']} 
                      </span><span>
                      <a style="color:white;" class="btn btn-primary coursepreview" href="//vimeo.com/291279551" data-lity>Preview</a>
                      </span>
                    </div>
                    <div style="  color: #007791;  background: #f9f9f9;
                  border: solid 1px #e8e9eb; font-size: 11px;" href="#"
                      class="pl-5 list-group-item list-group-item-action d-md-none row justify-content-between ml-0">
                      <span class="pull-left"><i
                          class="fa ${digitalmarketingcoursemodules[key][j]['element_type'] == 'video' ? 'fa-play-circle' : 'fa-clipboard-check'}"></i>&nbsp;${digitalmarketingcoursemodules[key][j]['element_name']}
                          </span>
                          <span class="pull-right">
                          <a style="color:white;" class="btn btn-primary coursepreview" href="//vimeo.com/291279551" data-lity>Preview</a>
                          </span>
                    </div>`
                }
                else{
                    return `
                        <a style="  color: #007791;  background: #f9f9f9;
                        border: solid 1px #e8e9eb; font-size: 14px;" href="#"
                          class="pl-5 list-group-item list-group-item-action d-none d-md-block row justify-content-between">
                          <span><i
                          class="fa ${digitalmarketingcoursemodules[key][j]['element_type'] == 'video' ? 'fa-play-circle' : 'fa-clipboard-check'}"></i>&nbsp; ${digitalmarketingcoursemodules[key][j]['element_name']}</span>
                        </a>
                        <a style="  color: #007791;  background: #f9f9f9;
                      border: solid 1px #e8e9eb; font-size: 11px;" href="#"
                          class="pl-5 list-group-item list-group-item-action d-md-none">
                          <span><i
                              class="fa ${digitalmarketingcoursemodules[key][j]['element_type'] == 'video' ? 'fa-play-circle' : 'fa-clipboard-check'}"></i>&nbsp;${digitalmarketingcoursemodules[key][j]['element_name']}</span>
                        </a>`
                }
            }
        }).join("")}
            </div>
          </div>      
        
        </div>
      </div>
    </div>`;
        i++;
    }
    res.json(html);
});

router.get('/getalltestimonials', function (req, res, next) {
    req.session.returnTo = '/courses/digital-marketing-course';
    testimonial.find({ deleted: false }, function (err, testimonials) {
        res.json(testimonials);
    });
});

router.post('/requestpayment', function (req, res, next) {
    // Insta.setKeys('test_536f67479790c3dc2f0377b53e6', 'test_b64fb4387871960d950b697f172');
    Insta.setKeys('2bc92a4b5acca5ed8665987bb6679f97', 'a895b4279506092fb9afe1fa5c938e37');

    const data = new Insta.PaymentData();
    // Insta.isSandboxMode(true);

    data.purpose = req.body.purpose;
    data.amount = parseInt(req.body.amount);
    // data.amount = "10.00";
    data.buyer_name = req.body.buyer_name;
    data.redirect_url = req.body.redirect_url;
    data.email = req.body.email;
    data.phone = req.body.phone;
    data.send_email = false;
    data.webhook = 'http://www.example.com/webhook/';
    data.send_sms = false;
    data.allow_repeated_payments = false;

    if (req.body.couponcode == req.user.local.referralcode) {
        res.json(-1);
    }
    else {
        Insta.createPayment(data, function (error, response) {
            if (error) {
                // some error
                res.json(error);
                console.log("payment error");
                return;
            } else {
                // Payment redirection link at response.payment_request.longurl
                const responseData = JSON.parse(response);
                if (responseData.success == false) {
                    res.status(200).json(responseData)
                }
                else {
                    const redirectUrl = responseData.payment_request.longurl;
                    console.log("__here");
                    console.log(responseData.payment_request)
                    lmsUsers.findOne({ email: responseData.payment_request.email }, function (err, user) {
                        console.log(user);
                        if(err){
                            console.log("payment error");
                            console.log(err);
                        }
                        var paymentdata = new payment({
                            payment_request_id: responseData.payment_request.id,
                            phone: responseData.payment_request.phone,
                            email: responseData.payment_request.email,
                            buyer_name: responseData.payment_request.buyer_name,
                            purpose: responseData.payment_request.purpose,
                            amount: parseInt(responseData.payment_request.amount),
                            status: responseData.payment_request.status,
                            couponcode: req.body.couponcode,
                            coupontype: req.body.coupontype,
                            couponcodeapplied: req.body.couponcodeapplied,
                            discount: req.body.discount,
                            offertoparticipant: req.body.offertoparticipant,
                            participant: req.body.participant,
                            date: new Date(),
                            updated: new Date(),
                            registered: user.createddate ? user.createddate : new Date()
                        });
                        paymentdata.save(function (err, results) {
                            if (err) {
                                console.log("payment error");
                                console.log(err);
                                res.json(err);
                            }
                            else {
                                res.status(200).json(redirectUrl);
                            }
                        });
                    });
                }
            }
        });
    }

});


router.post('/requestpayment2', function (req, res, next) {
        Insta.setKeys('test_536f67479790c3dc2f0377b53e6', 'test_b64fb4387871960d950b697f172');
    // Insta.setKeys('fa02e236c3f162c125152303b2ecdaad', '1db57769761510d74b7adea4e2f3505b');
    // Insta.setKeys('2bc92a4b5acca5ed8665987bb6679f97', 'a895b4279506092fb9afe1fa5c938e37');

    const data = new Insta.PaymentData();
    Insta.isSandboxMode(true);

    data.amount = req.body.amount;
    data.purpose = req.body.purpose;
    data.email = req.body.email;
    data.buyer_name = req.body.buyer_name;
    data.phone = req.body.phone;
    data.setRedirectUrl(req.body.redirect_url);

    if (1) {
        Insta.createPayment(data, function (error, response) {
            if (error) {
                // some error
                res.json(error);
            } else {
                // Payment redirection link at response.payment_request.longurl
                const responseData = JSON.parse(response);
                if (responseData.success == false) {
                    res.status(200).json(responseData)
                }
                else {
                    const redirectUrl = responseData.payment_request.longurl;
                    console.log("__here");
                    res.status(200).json({ success: true, message: 'Initiating payment gateway.', statusCode: 200, url : redirectUrl});
                }
            }
        });
    }

});

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

router.get('/callback2/', (req, res) => {
     res.json('Payment Complete. Redirecting to app...');
});

router.get('/callback/', (req, res) => {
    // res.redirect('/thankyoupage');
    if (req.query.payment_id && req.query.payment_status == "Credit") {
        let idArray = req.query.user_id.split('_')
        var userid = idArray[0];
        var courseid = idArray[1];
        var addToSet = { "courses": courseid, "paymentids": req.query.payment_id };
        if (courseid == "5efdc00ef1f2a30014a1fbef") {
            addToSet.batches = { "5efdc00ef1f2a30014a1fbef": req.query.batchdate }
            var obj = {}
            obj["Google Ads Certification Program"] = moment(new Date(req.query.batchdate)).format("DD MMM YYYY");
            addToSet.batchesformatted = obj;
        }

        lmsUsers.update(
            {
                _id: userid
            },
            {
                $addToSet: addToSet
            }
            ,
            function (err, response) {
                if (err) {
                    res.json(err);
                }
                else {
                    payment.findOne({
                        payment_request_id: req.query.payment_request_id
                    }, function (err, paymentdoc) {
                        if (res) {
                            payment.update(
                                {
                                    payment_request_id: req.query.payment_request_id
                                },
                                {
                                    $set: { "payment_id": req.query.payment_id, "status": req.query.payment_status, "user_id": req.query.user_id, updated: new Date() }
                                }
                                ,
                                function (err, response) {
                                    if (err) {
                                        res.json(err);
                                    }
                                    else {
                                        const { ObjectId } = require('mongodb'); // or ObjectID
                                        const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;
                                        lmsCourses.findOne({ _id: safeObjectId(req.query.user_id.split('_')[1]), 'deleted': { $ne: 'true' } }, function (err, course) {
                                            if (course) {
                                                var awsSesMail = require('aws-ses-mail');

                                                var sesMail = new awsSesMail();
                                                var sesConfig = {
                                                    accessKeyId: "AKIAQFXTPLX2CNUSHP5C",
                                                    secretAccessKey: "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",
                                                    region: 'us-west-2'
                                                };
                                                sesMail.setConfig(sesConfig);

                                                var html = `Dear ${req.user.local.name},
                                                <br><br>
                                                Welcome to the ${course.course_name}.
                                                ${courseid == "5f62ecff258cf800145b71e4" ? `Date and Time of the workshop are  <strong> 26th & 27th September
                                                4 PM to 6 PM </strong>.
                                                <br>
                                                We will send you the link to live classes before the sessio to login
                                                <br>Till then go through <a href="https://www.ampdigital.co/seoworkshop"> Warmup Videos </a> `: ""}
                                                <br><br>
                                                Mr. Amitabh Verma will be the lead instructor of this course on Digital Marketing.
                                                <br><br>
                                                After having worked at Google for over 7 years as the Global SMB Advertiser Services Leader,
                                                Amitabh was rated amongst top 100 digital marketers by Adobe, Paul Writer and Plural sight surveys
                                                for multiple years. Amitabh has consulted with many large Fortune 100 as well as millions of
                                                advertisers- while a part of Google and post that running AMP Digital.
                                                <br>
                                                <br>
                                                Now you’ll also be part of the referral program – where you can earn while you refer your friends to
                                                our programs. Check your refferal code <a target="_blank" href="www.ampdigital.co/referral">here</a>
                                                <br><br>
                                                Thank you so much for choosing our course. It is a pleasure and honour to be able to contribute to
                                                your development.
                                                <br><br>
                                                You can access complete details about the course from Our Website:
                                                <br>
                                                <a style="text-decoration: none!important;" href="https://www.ampdigital.co/#courses"><div style="width:220px;height:100%;color:#ffffff;background-color:#7fbf4d;border:1px solid #63a62f;border-bottom:1px solid #5b992b;background-image:-webkit-linear-gradient(top,#7fbf4d,#63a62f);background-image:-moz-linear-gradient(top,#7fbf4d,#63a62f);background-image:-ms-linear-gradient(top,#7fbf4d,#63a62f);background-image:-o-linear-gradient(top,#7fbf4d,#63a62f);background-image:linear-gradient(top,#7fbf4d,#63a62f);border-radius:3px;line-height:1;padding:7px 0 8px 0;text-align:center"><span>AMP Digital</span></div></a>
                                                <br>
                                                <i>In case of any query, you can reply back to this mail.</i>
                                                <br>
                                                Best Wishes,
                                                <br>
                                                <table width="351" cellspacing="0" cellpadding="0" border="0"> <tr> <td style="text-align:left;padding-bottom:10px"><a style="display:inline-block" href="https://www.ampdigital.co"><img style="border:none;" width="150" src="https://s1g.s3.amazonaws.com/36321c48a6698bd331dca74d7497797b.jpeg"></a></td> </tr> <tr> <td style="border-top:solid #000000 2px;" height="12"></td> </tr> <tr> <td style="vertical-align: top; text-align:left;color:#000000;font-size:12px;font-family:helvetica, arial;; text-align:left"> <span> </span> <br> <span style="font:12px helvetica, arial;">Email:&nbsp;<a href="mailto:amitabh@ampdigital.co" style="color:#3388cc;text-decoration:none;">amitabh@ampdigital.co</a></span> <br><br> <span style="margin-right:5px;color:#000000;font-size:12px;font-family:helvetica, arial">Registered Address: AMP Digital</span> 403, Sovereign 1, Vatika City, Sohna Road,, Gurugram, Haryana, 122018, India<br><br> <table cellpadding="0" cellpadding="0" border="0"><tr><td style="padding-right:5px"><a href="https://facebook.com/https://www.facebook.com/AMPDigitalNet/" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/23f7b48395f8c4e25e64a2c22e9ae190.png" alt="Facebook" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://twitter.com/https://twitter.com/amitabh26" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3949237f892004c237021ac9e3182b1d.png" alt="Twitter" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://linkedin.com/in/https://in.linkedin.com/company/ads4growth?trk=public_profile_topcard_current_company" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/dcb46c3e562be637d99ea87f73f929cb.png" alt="LinkedIn" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://youtube.com/https://www.youtube.com/channel/UCMOBtxDam_55DCnmKJc8eWQ" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3b2cb9ec595ab5d3784b2343d5448cd9.png" alt="YouTube" style="border:none;"></a></td></tr></table><a href="https://www.ampdigital.co" style="text-decoration:none;color:#3388cc;">www.ampdigital.co</a> </td> </tr> </table> <table width="351" cellspacing="0" cellpadding="0" border="0" style="margin-top:10px"> <tr> <td style="text-align:left;color:#aaaaaa;font-size:10px;font-family:helvetica, arial;"><p>AMP&nbsp;Digital is a Google Partner Company</p></td> </tr> </table> `;


                                                var options = {
                                                    from: 'ampdigital.co <amitabh@ads4growth.com>',
                                                    to: req.user.email,
                                                    subject: `Welcome to ${course.course_name}`,
                                                    content: '<html><head></head><body>' + html + '</body></html>'
                                                };
                                                const { ToWords } = require('to-words');
                                                const toWords = new ToWords({
                                                    localeCode: 'en-IN',
                                                    converterOptions: {
                                                        currency: true,
                                                        ignoreDecimal: false,
                                                        ignoreZeroCurrency: false,
                                                    }
                                                });

                                                var options2 = {
                                                    from: 'ampdigital.co <amitabh@ads4growth.com>',
                                                    to: req.user.email,
                                                    subject: `Invoice for your subscription to AMP Digital ${course.course_name}`,
                                                    template: 'views/email4.ejs',
                                                    templateArgs: {
                                                        course: course.course_name,
                                                        name: getusername(req.user), notifications: req.user.notifications + " " + req.user.local.lastname,
                                                        email: req.user.local.email,
                                                        phone: req.user.local.phone,
                                                        date: moment(new Date()).format("DD/MMM/YYYY HH:mm A"),
                                                        paymentid: req.query.payment_id,
                                                        referenceid: paymentdoc._id.toString(),
                                                        principal: Math.round(parseInt(paymentdoc.amount) * 82) / 100,
                                                        tax: Math.round(parseInt(paymentdoc.amount) * 9) / 100,
                                                        total: parseInt(paymentdoc.amount),
                                                        totalinwords: toWords.convert(parseInt(paymentdoc.amount))
                                                    }
                                                };

                                                if (courseid == "5efdc00ef1f2a30014a1fbef") {
                                                    var html2 = `Dear ${req.user.local.name},
                                                    <br><br>
                                                    Welcome to the  live online ${course.course_name}.
                                                    <br><br>
                                                    The program begins on 14th July and the classes will be held on Tuesdays and Thursdays from 7pm to 9pm. 
                                                    <br><br>
                                                    You will get a link to join the class before the session starts. Once the session is over, the recorded video will be uploaded on the LMS Dashbaord so you can go through it and revise the content.
                                                    <br>
                                                    <br>
                                                    Please let me know if you have any questions.
                                                    <br><br>
                                                    Welcome again,
                                                    <br><br>
                                                    <br>
                                                    Best Wishes,
                                                    <br>
                                                    Amitabh Verma`;
                                                    var optionshtml2 = {
                                                        from: 'Amitabh Verma <amitabh@ads4growth.com>',
                                                        to: req.user.email,
                                                        subject: `Welcome to ${course.course_name}`,
                                                        content: '<html><head></head><body>' + html2 + '</body></html>'
                                                    };
                                                    sesMail.sendEmail(optionshtml2, function (err, data) {
                                                        sesMail.sendEmail(options, function (err, data) {
                                                            // TODO sth....
                                                            if (err) {
                                                                console.log(err);
                                                            }
                                                            sesMail.sendEmailByHtml(options2, function (data, err) {
                                                                // TODO sth....
                                                                if (err) {
                                                                    console.log(err);
                                                                }
                                                                var params = {
                                                                    email: req.user.email,
                                                                    list_id: 'kv04Kg1cBGe7CvpsEZ3cUw',
                                                                    api_key: 'tyYabXqRCZ8TiZho0xtJ'
                                                                }
                                                                 
                                                                sendy.unsubscribe(params, function(err, result) {
                                                                    return res.redirect('/thankyoupage?course_id=' + course._id + '&course_name=' + course.course_name + '&payment_id=' + req.query.payment_id + '&userid=' + req.query.user_id);
                                                                });
                                                            });
                                                        });
                                                    });
                                                }
                                                else {
                                                    sesMail.sendEmail(options, function (err, data) {
                                                        // TODO sth....
                                                        if (err) {
                                                            console.log(err);
                                                        }
                                                        sesMail.sendEmailByHtml(options2, function (data, err) {
                                                            // TODO sth....
                                                            if (err) {
                                                                console.log(err);
                                                            }
                                                            return res.redirect('/thankyoupage?course_id=' + course._id + '&course_name=' + course.course_name + '&payment_id=' + req.query.payment_id + '&userid=' + req.query.user_id);
                                                        });
                                                    });
                                                }
                                            }
                                        });
                                    }
                                });
                        }
                    });
                }
            });


        // User.findOneAndUpdate( { _id: userId }, { $set: bidData }, { new: true } )
        // 	.then( ( user ) => res.json( user ) )
        // 	.catch( ( errors ) => res.json( errors ) );

        // Redirect the user to payment complete page.
    }
    else if (req.query.payment_id && req.query.payment_status == "Failed") {
        let idArray = req.query.user_id.split('_')
        var userid = idArray[0];
        var courseid = idArray[1];

        payment.findOne({
            payment_request_id: req.query.payment_request_id
        }, function (err, paymentdoc) {
            if (res) {
                payment.update(
                    {
                        payment_request_id: req.query.payment_request_id
                    },
                    {
                        $set: { "payment_id": req.query.payment_id, "status": req.query.payment_status, "user_id": req.query.user_id, updated: new Date() }
                    }
                    ,
                    function (err, response) {
                        if (err) {
                            res.json(err);
                        }
                        else {
                            res.json(response);
                        }
                    });
            }
        });


        // User.findOneAndUpdate( { _id: userId }, { $set: bidData }, { new: true } )
        // 	.then( ( user ) => res.json( user ) )
        // 	.catch( ( errors ) => res.json( errors ) );

        // Redirect the user to payment complete page.
    }

});

/* GET courses page. */
router.get('/thankyoupage', myLogger, function (req, res, next) {
    req.session.returnTo = req.path;
    if (req.isAuthenticated()) {
        var courseid = req.query.course_id;
        var batchdate = '';
        if (courseid == "5efdc00ef1f2a30014a1fbef") {
            var batches = req.user.batches;
            for (var i = 0; i < batches.length; i++) {
                var key = Object.keys(batches[i])[0];
                if (courseid == key) {
                    batchdate = batches[i][courseid];
                }
            }
        }

        res.render('paymentcomplete', { title: 'Express', moment: moment, batchdate: batchdate, course_name: req.query.course_name, payment_id: req.query.payment_id, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
    }
    else {
        res.render('paymentcomplete', { title: 'Express', moment: moment, course_name: '', payment_id: '' });
    }
});

/* GET courses page. */
router.get('/webinar/thankyoupage/:webinarurl', myLogger, function (req, res, next) {
    req.session.returnTo = req.path;
    webinar.findOne({ deleted: { $ne: true }, webinarurl: req.params.webinarurl }, function (err, webinar) {
        if (req.isAuthenticated()) {
            res.render('thankyoupage', { title: 'Express', moment: moment, webinar: webinar, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
        }
        else {
            res.render('thankyoupage', { title: 'Express', moment: moment, webinar: webinar, payment_id: '' });
        }
    });
});

/* GET blog post page. */
router.get('/blog/:blogurl', myLogger, function (req, res, next) {
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
        blog.findOne({ deleted: { $ne: true }, blogurl: req.params.blogurl }, function (err, blog) {
            if (blog) {
                comment.find({ blogid: blog._id.toString() }, function (err, comments) {
                    if (req.isAuthenticated()) {
                        res.render('blogpostfast', { categories: categories, comments: comments, title: 'Express', blog: blog, moment: moment, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
                    }
                    else {
                        res.render('blogpostfast', { categories: categories, comments: comments, title: 'Express', blog: blog, moment: moment });
                    }
                });
            }
            else {
                res.redirect('/blogs')
            }
        });
    });
});

/* GET blogs page. */
router.get('/blogs', myLogger, function (req, res, next) {
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
        blog.find({ deleted: { $ne: "true" } }, null, { sort: { date: -1 }, skip: 0, limit: 9 }, function (err, blogs) {
            if (req.isAuthenticated()) {
                res.render('blogfast', { title: 'Express', categories: categories, blogs: blogs, moment: moment, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
            }
            else {
                res.render('blogfast', { title: 'Express', categories: categories, blogs: blogs, moment: moment });
            }
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
        blog.find({ deleted: { $ne: "true" } }, null, { sort: { date: -1 }, skip: 9*(parseInt(req.query.count)), limit: 9 }, function (err, blogs) {
           res.json(blogs);
        });
    });
});

/* GET blog post page. */
router.get('/webinars', myLogger, function (req, res, next) {
    req.session.returnTo = req.path;
    webinar.find({ deleted: { $ne: "true" } }, null, { sort: { date: -1 } }, function (err, webinars) {
        if (req.isAuthenticated()) {
            res.render('webinarsfast', { title: 'Express', active: "all", webinars: webinars, moment: moment, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
        }
        else {
            res.render('webinarsfast', { title: 'Express', active: "all", webinars: webinars, moment: moment });
        }
    });
});

/* GET blog post page. */
router.get('/budding-marketer-challenge', myLogger, function (req, res, next) {
    req.session.returnTo = req.path;
    // res.json(req.ip);
    res.render('buddingmarketerchallenge', { title: 'Express', active: "all", moment: moment });
});

router.get('/budding-marketer-challenge/portal/:teamid', myLogger, function (req, res, next) {
    req.session.returnTo = req.path;
    // res.json(req.ip);
    if(req.isAuthenticated()){
        res.render('bmcportal', { team: req.user, title: 'Express', active: "all", moment: moment });
    }
    else{
        red.redirect("/");
    }
});

/* GET blog post page. */
router.get('/digital-marketing-community-forums', myLogger, function (req, res, next) {
    req.session.returnTo = req.path;
    lmsForums.find({ "course_id" : "5ba67703bda6d500142e2d15" }, null, { sort: { module_order:1 } }, function (err, modules) {
        if (req.isAuthenticated()) {
            res.render('forums', { title: 'Express', user: req.user, active: "all", modules: modules, moment: moment, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
        }
        else {
            res.render('forums', { title: 'Express', user: req.user, active: "all", modules: modules, moment: moment });
        }
    });
});

/* GET blog post page. */
router.get('/digital-marketing-simulation-tools', myLogger, function (req, res, next) {
    req.session.returnTo = req.path;
    simulationtool.find({}, function (err, tools) {
        if (req.isAuthenticated()) {
            res.render('simulationtools', { title: 'Express', active: "all", tools: tools, moment: moment, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
        }
        else {
            res.render('simulationtools', { title: 'Express', active: "all", tools: tools, moment: moment });
        }
    });
});

/* GET blog post page. */
router.get('/tools/:tool_url', myLogger, function (req, res, next) {
    req.session.returnTo = req.path;
    simulatorpoint.aggregate([{$group: {
        _id:"$name",                                                                     
        value: { $max: "$totalpoints" } 
    }}, {$sort: {value: -1}}], function (err, leaderboard) {
        simulationtool.findOne({"tool_url": req.params.tool_url}, function (err, tool) {
            if(tool){
                if (req.isAuthenticated()) {
                    var toolids = [];
                    simulatorpoint.find({email: req.user.email}, function(err, docs){
                        for(var i = 0; i < docs.length; i++){
                            toolids.push(docs[i]["id"]);
                        }
                        res.render('simulationtoolppc', { leaderboard: leaderboard, loggedin: "true", toolids: toolids.join(","), title: 'Express', active: "all", tool: tool, moment: moment, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
                    })
                }
                else {
                    res.render('simulationtoolppc', { leaderboard: leaderboard, loggedin: "false", toolids: "", title: 'Express', active: "all", tool: tool, moment: moment });
                }
            }
            else{
                res.redirect("/digital-marketing-simulation-tools");
            }
        });
        })
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


/* GET blog post page. */
router.get('/webinars/upcoming', myLogger, function (req, res, next) {
    req.session.returnTo = req.path;
    webinar.find({ deleted: { $ne: "true" }, date: { $gte: new Date() } }, null, { sort: { date: -1 } }, function (err, webinars) {
        if (req.isAuthenticated()) {
            res.render('webinarsfast', { title: 'Express', active: "upcoming", webinars: webinars, moment: moment, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
        }
        else {
            res.render('webinarsfast', { title: 'Express', active: "upcoming", webinars: webinars, moment: moment });
        }
    });
});

/* GET blog post page. */
router.get('/webinars/concluded', myLogger, function (req, res, next) {
    req.session.returnTo = req.path;
    webinar.find({ deleted: { $ne: "true" }, date: { $lte: new Date() } }, null, { sort: { date: -1 } }, function (err, webinars) {
        if (req.isAuthenticated()) {
            res.render('webinarsfast', { title: 'Express', active: "concluded", webinars: webinars, moment: moment, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
        }
        else {
            res.render('webinarsfast', { title: 'Express', active: "concluded", webinars: webinars, moment: moment });
        }
    });
});

router.get('/workshop/google-analytics-for-digital-marketing', myLogger, function (req, res, next) {
    req.session.returnTo = req.path;
    webinar.findOne({ deleted: { $ne: true }, webinarurl: 'google-analytics-for-digital-marketing' }, function (err, webinar) {
        if (webinar) {
            if (req.isAuthenticated()) {
                res.render('webinar', { title: 'Express', webinar: webinar, moment: moment, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
            }
            else {
                res.render('webinar', { webinar: webinar, moment: moment });
            }
        }
        else {
            res.redirect('/blogs')
        }
    });
});

/* GET blog post page. */
router.get('/webinar/:webinarurl', myLogger, function (req, res, next) {
    req.session.returnTo = req.path;
    webinar.findOne({ deleted: { $ne: true }, webinarurl: req.params.webinarurl }, function (err, webinar) {
        if (webinar) {
            if (req.isAuthenticated()) {
                res.render('webinar', { title: 'Express', webinar: webinar, moment: moment, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
            }
            else {
                res.render('webinar', { webinar: webinar, moment: moment });
            }
        }
        else {
            res.redirect('/blogs')
        }
    });
});

/* GET blog post page. */
router.get('/article', myLogger, function (req, res, next) {
    req.session.returnTo = req.path;
    res.render("article");
});

// router.get('/forum', function (req, res, next) {
//     req.session.returnTo = req.path;
//     res.render("forum");
// });

router.get('/forum', myLogger, function (req, res, next) {
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;
    req.session.returnTo = req.path;
    if (1) {
        forum.aggregate([
            {
                          "$match": {
                              coursename: "Digital Marketing Course"
                          }
                      },
              { $group : { "_id": "$modulename", books: { "$push": { 
                          "description": "description",
                          "isreply": "$isreply"
                      } } } }
             ], function (err, result) {
            if (err) {
                res.json(err);
            }
            else {
                res.json(result);
            }
        });
    }
    else {
        res.json(-1);
    }
});

// router.get('/qanda/:courseurl/:moduleid', function (req, res, next) {
//     const { ObjectId } = require('mongodb'); // or ObjectID
//     const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;
//     var module_id = req.params.moduleid;
//     var courseObj;
//     var modulesObj;
//     var topicsObj;
//     var elementsObj;
//     lmsCourses.findOne({ 'course_access_url': "/" + req.params.courseurl }, function (err, courseobj) {
//         if (courseobj) {
//             var courseid = courseobj._id;
//             lmsModules.find({ course_id: (courseid), deleted: { $ne: "true" } }, function (err, moduleslist) {
//                 moduleslist.sort(function (a, b) {
//                     var keyA = a.module_order,
//                         keyB = b.module_order;
//                     // Compare the 2 dates
//                     if (keyA < keyB) return -1;
//                     if (keyA > keyB) return 1;
//                     return 0;
//                 });
//                 lmsModules.findOne({ _id: safeObjectId(module_id), deleted: { $ne: "true" } }, function (err, module) {


//                     if (req.isAuthenticated()) {
//                         res.render('qanda', { module: module, moduleslist: moduleslist, moment: moment, moduleid: req.params.moduleid, courseobj: courseobj, course: modulesObj, moment: moment, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, user: req.user, name: getusername(req.user), notifications: req.user.notifications });
//                     }
//                     else {
//                         req.session.returnTo = req.path;
//                         res.redirect('/auth');
//                     }
//                 });
//             });

//         }
//         else {
//             res.redirect('/');
//         }
//     });
// });

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

router.get('/getforumcomment', function(req, res) {
    forumcomment.find({$or: [{id: parseInt(req.query.postid)}, {parent: parseInt(req.query.postid)}, {rootid: parseInt(req.query.postid)}]}, function (err, response) {
        if(err){
            res.json(err);
        }
        if(response){
            var filteredArray = response.filter(function(item, pos){
                return response.indexOf(item)== pos; 
              });
            res.json(filteredArray);
        }
    });
});

router.post('/upvotecomment', function(req, res) {
    if(req.isAuthenticated()){
        forumcomment.find(
            {
                id: req.body.id
            },
            function(err, doc) {
                if(err){
                    console.log(err);
                }
                else{
                    var upvote_count = doc[0]['upvote_count'];
                    if(req.body.upvote_count>upvote_count){
                        forumcomment.update(
                            {
                                id: req.body.id
                            },
                            {
                                $addToSet: {"upvoters": req.user.email},
                                $set: { 'upvote_count': req.body.upvote_count}
                            }
                            ,
                            function(err, count) {
                                if(err){
                                    console.log(err);
                                }
                                else{
                                    res.json(count);
                                }
                            });
                    }
                    else{
                        forumcomment.update(
                            {
                                id: req.body.id
                            },
                            {
                                $pull: {"upvoters": req.user.email},
                                $set: { 'upvote_count': req.body.upvote_count}
                            }
                            ,
                            function(err, count) {
                                if(err){
                                    console.log(err);
                                }
                                else{
                                    res.json(count);
                                }
                            });
                    }
                }
            });
    }
});

router.post('/updatecomment', function(req, res) {
    forumcomment.update(
        {
            id: req.body.id
        },
        {
            $set: { 'content': req.body.content}
        }
        ,
        function(err, count) {
            if(err){
                console.log(err);
            }
            else{
                res.json(count);
            }
        });
});

router.post('/updatecomment', function(req, res) {
    forumcomment.update(
        {
            id: req.body.id
        },
        {
            $set: { 'content': req.body.content}
        }
        ,
        function(err, count) {
            if(err){
                console.log(err);
            }
            else{
                res.json(count);
            }
        });
});

router.post('/deletecomment', function(req, res) {
    forumcomment.remove(
        {
            id: req.body.id
        },
        function(err, count) {
            if(err){
                console.log(err);
            }
            else{
                res.json(count);
            }
        });
});

router.post('/addnewcomment', function(req, res) {
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
                    if(req.body.fileurl){
                        fileid = doc.count+1;
                        console.log("fileid");
                        console.log(fileid);
                        lmsForumfilecount.update({id:1} ,{ $inc: { 'count': 1 }  }, { multi: true }, function (err, response) {
                            if(err){
                                res.json(err);
                            }
                            if(response){
                                console.log("now here");
                                forumcomment.find({}, null, {sort: {id: -1}}, function (err, response) {
                                    if(err){
                                        res.json(err);
                                    }
                                    if(response){
                                        var count = response[0]["id"];
                                        var item = req.body;
                                        item.id = (count+1);
                                        item.attachments = [{
                                            "id": fileid,
                                            "file": req.body.fileurl,
                                            "mime_type":  req.body.filetype,
                                          }];
                                        item.attachment_url = req.body.fileurl,
                                        item.attachment_type=req.body.filetype,
                                        item.attachment_id=fileid,
                                        item.rootid= req.body.rootid;
                                        item.idcount = (count+1);
                                        item.storyid = req.body.storyid;
                                        item.upvoters = [];
                                        item.modulename = req.body.modulename;
                                        item.moduleid = req.body.moduleid;
                                        item.content = req.body.content;
                                        item.created = req.body.created;
                                        item.created_by_current_user = false;
                                        item.modified = req.body.modified;
                                        item.parent = req.body.parent;
                                        item.profile_picture_url = req.user.local.profile_picture_url ? req.user.local.profile_picture_url : req.body.profile_picture_url;
                                        console.log("ahiegaeg");
                                        console.log(req.user.profile_picture_url);
                                        item.upvote_count = req.body.upvote_count;
                                        item.user_has_upvoted = req.body.user_has_upvoted;
                                        item.email = req.user.email;
                                        item.fullname = req.user.local.name + " " + (req.user.local.lastname?req.user.local.lastname: "")
                                        forumcomment.update({ "created": item.created} ,{ "$set": item }, { upsert: true }, function (err, response) {
                                            if(err){
                                                res.json(err);
                                            }
                                            if(response){
                                                if(req.body.parent==""){
                                                    var url = item.content.replace(/(([^\s]+\s\s*){14})(.*)/,"$1…")
                                                    url = url.replace(/[^a-zA-Z0-9! ]+/g, "").replace(/\s+/g, '-').toLowerCase();
                                                    var url = "https://www.ampdigital.co/digital-marketing-community/post/"+url + "-" + item.id;

                                                    var html = `Hi Team,
                                                                <br><br>
                                                                You have a new forum question from ${item.fullname} on the module ${item.modulename}.
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
                
                                                    sesMail.sendEmail(options, function (err, data) {
                                                        // TODO sth....
                                                        if (err) {
                                                            console.log(err);
                                                        }
                                                        console.log(data);
                                                        res.json(item);
                                                    });
                                                }
                                                else{
                                                    forumcomment.findOne({id: item.rootid}, function(err, comment){
                                                        if(comment){
                                                            var url = item.content.replace(/(([^\s]+\s\s*){14})(.*)/,"$1…")
                                                            url = url.replace(/[^a-zA-Z0-9! ]+/g, "").replace(/\s+/g, '-').toLowerCase();
                                                            var url = "https://www.ampdigital.co/digital-marketing-community/post/"+url + "-" + item.rootid;

                                                            var html = `Hi Team,
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
                                                                to: [comment.email, "amitabh@ads4growth.com"],
                                                                subject: `New Reply to Forum Question on module ${item.modulename}`,
                                                                content: '<html><head></head><body>' + html + '</body></html>'
                                                            };
                        
                                                            sesMail.sendEmail(options, function (err, data) {
                                                                // TODO sth....
                                                                if (err) {
                                                                    console.log(err);
                                                                }
                                                                console.log(data);
                                                                res.json(item);
                                                            });
                                                        }
                                                        else{
                                                            res.json(err);
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
                                var item = req.body;
                                item.id = (count+1);
                                item.rootid= req.body.rootid;
                                item.idcount = (count+1);
                                item.storyid = req.body.storyid;
                                item.upvoters = [];
                                item.modulename = req.body.modulename;
                                item.moduleid = req.body.moduleid;
                                item.content = req.body.content;
                                item.created = req.body.created;
                                item.created_by_current_user = false;
                                item.modified = req.body.modified;
                                item.parent = req.body.parent;
                                item.profile_picture_url = req.user.local.profile_picture_url ? req.user.local.profile_picture_url : req.body.profile_picture_url;
                                console.log("ahiegaeg");
                                console.log(req.user.profile_picture_url);
                                item.upvote_count = req.body.upvote_count;
                                item.user_has_upvoted = req.body.user_has_upvoted;
                                item.email = req.user.email;
                                item.fullname = req.user.local.name + " " + (req.user.local.lastname?req.user.local.lastname: "")
                                forumcomment.update({ "created": item.created} ,{ "$set": item }, { upsert: true }, function (err, response) {
                                    if(err){
                                        res.json(err);
                                    }
                                    if(response){
                                        response.id = item.id;
                                        
                                        if(req.body.parent==""){
                                            var url = item.content.replace(/(([^\s]+\s\s*){14})(.*)/,"$1…")
                                            url = url.replace(/[^a-zA-Z0-9! ]+/g, "").replace(/\s+/g, '-').toLowerCase();
                                            var url = "https://www.ampdigital.co/digital-marketing-community/post/"+url + "-" + item.id;

                                            var html = `Hi Team,
                                                        <br><br>
                                                        You have a new forum question from ${item.fullname} on the module ${item.modulename}.
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
        
                                            sesMail.sendEmail(options, function (err, data) {
                                                // TODO sth....
                                                if (err) {
                                                    console.log(err);
                                                }
                                                console.log(data);
                                                res.json(response);
                                            });
                                        }
                                        else{
                                            forumcomment.findOne({id: item.rootid}, function(err, comment){
                                                if(comment){
                                                    var url = item.content.replace(/(([^\s]+\s\s*){14})(.*)/,"$1…")
                                                    url = url.replace(/[^a-zA-Z0-9! ]+/g, "").replace(/\s+/g, '-').toLowerCase();
                                                    var url = "https://www.ampdigital.co/digital-marketing-community/post/"+url + "-" + item.rootid;

                                                    var html = `Hi Team,
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
                                                        to: [comment.email, "amitabh@ads4growth.com"],
                                                        subject: `New Reply to Forum Question on module ${item.modulename}`,
                                                        content: '<html><head></head><body>' + html + '</body></html>'
                                                    };
                
                                                    sesMail.sendEmail(options, function (err, data) {
                                                        // TODO sth....
                                                        if (err) {
                                                            console.log(err);
                                                        }
                                                        console.log(data);
                                                        res.json(response);
                                                    });
                                                }
                                                else{
                                                    res.json(err);
                                                }
                                            });
                                        }
                                    }
                                });
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
});


router.post('/addnewcomment2', function(req, res) {
    if(req.isAuthenticated()){
        var bucketParams = { Bucket: 'ampdigital' };
        s3.createBucket(bucketParams);
        var s3Bucket = new aws.S3({ params: { Bucket: 'ampdigital' } });
        // res.json('succesfully uploaded the image!');
        console.log("hahoiegaieoghaoieg____");
        res.json(req.body);
    }
});

router.post('/addnewcomment3', function(req, res) {
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
                                                                            res.redirect(req.body.url)
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
                                                                res.redirect(req.body.url)
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
                                                            res.redirect(req.body.url)
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
                                                res.redirect(req.body.url)
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

/* GET blog post page. */
router.get('/referral', myLogger, function (req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect("/budding-marketer-program");
    }
    else {
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
});

/* GET faq page */
router.get('/faq', myLogger, function (req, res, next) {
    faqModel.aggregate([
        {
            $match: { "deleted": { $ne: true } }
        },
        {
            $group: {
                _id: { category: "$category" },
                question: { $push: "$question" },
                answer: { $push: "$answer" }
            }
        }
    ], function (err, faqdocs) {
        if (req.isAuthenticated()) {
            res.render('faq', { faqdocs: faqdocs, title: 'Express', email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
        }
        else {
            res.render('faq', { faqdocs: faqdocs, title: 'Express' });
        }
    });
});

/* GET faq page */
// router.get('/manage/blogs', myLogger, isAdmin, function (req, res, next) {
//     blog.find({ deleted: { $ne: true } }, function (err, blogs) {
//         if (req.isAuthenticated()) {
//             res.render('adminpanel/blogs2', { moment: moment, blogs: blogs, title: 'Express', email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
//         }
//         else {
//             res.render('adminpanel/blogs2', { moment: moment, blogs: blogs, title: 'Express' });
//         }
//     });
// });

/* GET faq page */
router.get('/manage/webinar', myLogger, isAdmin, function (req, res, next) {
    blog.find({ deleted: { $ne: true } }, function (err, blogs) {
        if (req.isAuthenticated()) {
            res.render('adminpanel/webinar', { moment: moment, blogs: blogs, title: 'Express', email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
        }
        else {
            res.render('adminpanel/webinar', { moment: moment, blogs: blogs, title: 'Express' });
        }
    });
});

/*GET courses page*/
router.get('/manage/team', isLoggedIn, function (req, res, next) {
    teamperson.find({}, (err, docs)=>{
        res.render('adminpanel/team', { email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications, docs: docs, moment: moment });
    })
});

/*GET courses page*/
router.get('/manage/budding-marketer-challenge-team', isLoggedIn, function (req, res, next) {
    teammember.find({}, (err, docs)=>{
        res.render('adminpanel/bmcteam', { email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications, docs: docs, moment: moment });
    })
});


/* GET faq page */
router.get('/iframe/blogs', function (req, res, next) {
    category.find({ 'deleted': { $ne: true } }, function (err, categories) {
        blog.find({ deleted: { $ne: true } }, function (err, blogs) {
            if (req.isAuthenticated()) {
                res.render('adminpanel/blogsiframe', { moment: moment, categories: categories, blogs: blogs, title: 'Express', email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
            }
            else {
                res.render('adminpanel/blogsiframe', { moment: moment, categories: categories, blogs: blogs, title: 'Express' });
            }
        });
    });
});

/* GET faq page */
router.get('/iframe/webinar', function (req, res, next) {
    webinar.find({ deleted: { $ne: true } }, function (err, webinars) {
        if (req.isAuthenticated()) {
            res.render('adminpanel/webinariframe', { moment: moment, webinars: webinars, title: 'Express', email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
        }
        else {
            res.render('adminpanel/webinariframe', { moment: moment, webinars: webinars, title: 'Express' });
        }
    });
});

// Create a new faq
router.post('/addfaq', function (req, res, next) {
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
            res.redirect('/addfaq/'+req.body.courseid);
        }
    });
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

// Create a new blog
router.post('/addblog', function (req, res, next) {
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
            res.redirect('/manage/blogs');
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
            res.redirect('/manage/webinar');
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

            // var html = `Dear ${req.body.firstname},
            //                     <br><br>
            //                     Your slot to webinar <a target="_blank" href="${'https://www.ampdigital.co/webinar/' + req.body.webinarurl}">${req.body.webinarname}</a>  has been reserved
            //                     <br>
            //                     <br>
            //                     Webinar Date: ${moment(new Date(req.body.webinardate)).format("DD/MMM/YYYY")}
            //                     <br>
            //                     Webinar Time: ${moment(new Date(req.body.webinardate)).format("HH:mm A")}
            //                     <br>
            //                     <br>
            //                     Please click on this link to join the webinar : <a target="_blank" href="https://www.youtube.com/watch?v=${req.body.webinarvideo}">https://www.youtube.com/watch?v=${req.body.webinarvideo}</a>
            //                     <br>
            //                     <br>
            //                     Thanks,
            //                     <br>
            //                     <table width="351" cellspacing="0" cellpadding="0" border="0"> <tr> <td style="text-align:left;padding-bottom:10px"><a style="display:inline-block" href="https://www.ampdigital.co"><img style="border:none;" width="150" src="https://s1g.s3.amazonaws.com/36321c48a6698bd331dca74d7497797b.jpeg"></a></td> </tr> <tr> <td style="border-top:solid #000000 2px;" height="12"></td> </tr> <tr> <td style="vertical-align: top; text-align:left;color:#000000;font-size:12px;font-family:helvetica, arial;; text-align:left"> <span> </span> <br> <span style="font:12px helvetica, arial;">Email:&nbsp;<a href="mailto:amitabh@ampdigital.co" style="color:#3388cc;text-decoration:none;">amitabh@ampdigital.co</a></span> <br><br> <span style="margin-right:5px;color:#000000;font-size:12px;font-family:helvetica, arial">Registered Address: AMP Digital</span> 403, Sovereign 1, Vatika City, Sohna Road,, Gurugram, Haryana, 122018, India<br><br> <table cellpadding="0" cellpadding="0" border="0"><tr><td style="padding-right:5px"><a href="https://facebook.com/https://www.facebook.com/AMPDigitalNet/" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/23f7b48395f8c4e25e64a2c22e9ae190.png" alt="Facebook" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://twitter.com/https://twitter.com/amitabh26" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3949237f892004c237021ac9e3182b1d.png" alt="Twitter" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://linkedin.com/in/https://in.linkedin.com/company/ads4growth?trk=public_profile_topcard_current_company" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/dcb46c3e562be637d99ea87f73f929cb.png" alt="LinkedIn" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://youtube.com/https://www.youtube.com/channel/UCMOBtxDam_55DCnmKJc8eWQ" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3b2cb9ec595ab5d3784b2343d5448cd9.png" alt="YouTube" style="border:none;"></a></td></tr></table><a href="https://www.ampdigital.co" style="text-decoration:none;color:#3388cc;">www.ampdigital.co</a> </td> </tr> </table> <table width="351" cellspacing="0" cellpadding="0" border="0" style="margin-top:10px"> <tr> <td style="text-align:left;color:#aaaaaa;font-size:10px;font-family:helvetica, arial;"><p>AMP&nbsp;Digital is a Google Partner Company</p></td> </tr> </table>  `;

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
                                                                                            We're looking forward to hosting you on ${moment(new Date(req.body.webinardate)).format("DD/MMM/YYYY")} at ${moment(new Date(req.body.webinardate)).format("HH:mm A")} at our ${req.body.webinarname == "Google Analytics for Digital Marketing" ?  "workshop" : "webinar"} - <a target="_blank" href="${'https://www.ampdigital.co/webinar/' + req.body.webinarurl}">${req.body.webinarname}</a> .
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
                        res.redirect("/webinar/thankyoupage/" + req.body.webinarurl);
                    }
                });
            });
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
router.get('/manage/courses', myLogger, isAdmin, function (req, res, next) {
    lmsCourses.find({ 'deleted': { $ne: 'true' } }, function (err, docs) {
        res.render('adminpanel/addcourse', { email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications, docs: docs, moment: moment });

    });
});

/*GET courses page*/
router.get('/manage/jobs', myLogger, isAdmin, function (req, res, next) {
    job.find({ 'deleted': { $ne: 'true' } }, null, { sort: { date: -1 } }, function (err, docs) {
        res.render('adminpanel/jobs2', { email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications, docs: docs, moment: moment });
    });
});

router.get('/manage/blogs', myLogger, isAdmin, function (req, res, next) {
    category.find({ 'deleted': { $ne: true } }, function (err, categories) {
        blog.find({ deleted: { $ne: true } }, function (err, docs) {
            if (req.isAuthenticated()) {
                res.render('adminpanel/blogsnew', { categories: categories, docs: docs, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications, docs: docs, moment: moment });
            }
            else {
                res.render('adminpanel/blogsnew', { categories: categories, docs: docs, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications, docs: docs, moment: moment });
            }
        });
    });
});

router.get('/manage/buddingarketerapplications', myLogger, isAdmin, function (req, res, next) {
    lmsUsers.find({ 'collegename': { $exists: true }, approved: { $ne: false } }, null, { sort: { date: -1 } }, function (err, docs) {
        res.render('adminpanel/bmpapplications', { email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications, docs: docs, moment: moment });
    });
});

/*GET courses page*/
router.get('/manage/blogcategories', isAdmin, myLogger, function (req, res, next) {
    category.find({ 'deleted': { $ne: true } }, function (err, docs) {
        res.render('adminpanel/category', { email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications, docs: docs, moment: moment });

    });
});

router.get('/getcategories', function (req, res, next) {
    category.find({ 'deleted': { $ne: true } }, function (err, docs) {
        res.json(docs)
    });
});


/*GET courses page*/
router.get('/addfaq/:courseid', myLogger, isAdmin, function (req, res, next) {
    faqModel.find({ 'deleted': { $ne: 'true' }, 'course_id': req.params.courseid }, function (err, faqdocs) {
        res.render('adminpanel/faq', { email: req.user.email, courseid: req.params.courseid, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications, faqdocs: faqdocs, moment: moment });

    });
});

/*GET courses page*/
router.get('/manage/bookdownloads', myLogger, isAdmin, function (req, res, next) {
    bookdownload.find({}, function (err, docs) {
        res.render('adminpanel/bookdownload', { email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications, docs: docs, moment: moment });

    });
});


/*GET modules page for a course*/
router.get('/manage/modules/:id', myLogger, isAdmin, function (req, res, next) {
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;
    lmsCourses.find({ _id: safeObjectId(req.params.id) }, function (err, course) {
        lmsModules.find({ course_id: req.params.id, deleted: { $ne: "true" } }, function (err, modules) {
            res.render('adminpanel/addmodule', { course: course, modules: modules, moment: moment, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
        });
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

/*GET batches page for a course*/
router.get('/manage/batches/:id', myLogger, isAdmin, function (req, res, next) {
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;
    lmsCourses.find({ _id: safeObjectId(req.params.id) }, function (err, course) {
        lmsBatches.find({ course_id: req.params.id, deleted: { $ne: "true" } }, function (err, batches) {
            res.render('adminpanel/addbatch', { course: course, batches: batches, moment: moment, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
        });
    });
});

/*GET topics page for a module*/
router.get('/manage/topics/:courseid/:moduleid', myLogger, isAdmin, function (req, res, next) {
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;
    lmsCourses.find({ _id: safeObjectId(req.params.courseid) }, function (err, course) {
        lmsModules.find({ _id: safeObjectId(req.params.moduleid) }, function (err, module) {
            lmsTopics.find({ module_id: req.params.moduleid, deleted: { $ne: "true" } }, null, { sort: { order: 1 } }, function (err, topics) {
                res.render('adminpanel/addtopic', { course: course, module: module, topics: topics, moment: moment, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
            });
        });
    });
});

/*GET elements page for a topic*/
router.get('/manage/elements/:courseid/:moduleid/:topicid', myLogger, isAdmin, function (req, res, next) {
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;
    lmsCourses.find({ _id: safeObjectId(req.params.courseid) }, function (err, course) {
        lmsModules.find({ _id: safeObjectId(req.params.moduleid) }, function (err, module) {
            lmsTopics.find({ _id: safeObjectId(req.params.topicid) }, function (err, topic) {
                lmsElements.find({ element_taskid: safeObjectId(req.params.topicid), deleted: { $ne: "true" } }, function (err, elements) {
                    res.render('adminpanel/addelement', { course: course, module: module, topic: topic, elements: elements, moment: moment, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
                });
            });
        });
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

router.get('/payments', myLogger, isAdmin, function (req, res, next) {
    res.redirect("/admin");
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
router.get('/manage/webinarattendees', myLogger, isAdmin, function (req, res, next) {
    res.render('adminpanel/webinarees', { email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, moment: moment });
});

/*GET contact requests page*/
router.get('/manage/forum', myLogger, isAdmin, function (req, res, next) {
    lmsCourses.find({ 'deleted': { $ne: 'true' } }, function (err, courses) {
        forum.find({}).sort({ date: -1 }).exec(function (err, docs) {
            res.render('adminpanel/forum', { courses: courses, docs: docs, email: req.user.email, moment: moment });
        });
    });
});

/*GET contact requests page*/
router.get('/couponstats', myLogger, isAdmin, function (req, res, next) {
    lmsCourses.find({ 'deleted': { $ne: 'true' } }, function (err, courses) {
        res.render('adminpanel/couponstatsfast', { courses: courses, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, moment: moment });
    });

});

router.post('/statistics/payment', function (req, res, next) {
    var query = {};
    var query2 = {};
    var filterArray = [];
    var filterArray2 = [];
    if (req.body.fromdatefilter !== "") {
        console.log('11111');
        filterArray.push({ date: { $gte: req.body.fromdatefilter } })
        filterArray2.push({ date: { $gte: req.body.fromdatefilter } })
        query.$and = filterArray;
        query2.$and = filterArray2;
    }
    if (req.body.todatefilter !== "") {
        console.log('1111');
        filterArray.push({ date: { $lte: req.body.todatefilter + ' 23:59' } })
        filterArray2.push({ date: { $lte: req.body.todatefilter + ' 23:59' } })

        query.$and = filterArray;
        query2.$and = filterArray2;
    }
    if (req.body.purposefilter !== "_") {

        console.log('222');
        filterArray.push({ "purpose": req.body.purposefilter.split('_')[0] })
        filterArray2.push({ "courses": req.body.purposefilter.split('_')[1] })
        query.$and = filterArray;
        query2.$and = filterArray2;
    }
    if (req.body.statusfilter !== "") {
        console.log('222');
        filterArray.push({ "status": { $regex: '' + req.body.statusfilter + '', '$options': 'i' } })
        query.$and = filterArray;
    }

    payment.aggregate([
        { "$match": query },
        {
            $group: {
                "_id": "$purpose",
                count: { $sum: 1 },
                amount: {
                    $sum: "$amount"
                }
            }
        }
    ], function (err, chartdata1) {
        if (err) {
        }
        else {
            payment.aggregate([
                { "$match": query },
                {
                    $group: {
                        "_id": "$status",
                        count: { $sum: 1 },
                        amount: {
                            $sum: "$amount"
                        }
                    }
                }
            ], function (err, chartdata2) {
                if (err) {
                }
                else {
                    var arr = [];
                    for (var i = 0; i < chartdata1.length; i++) {
                        var obj = {};
                        obj.name = chartdata1[i]['_id'];
                        obj.y = chartdata1[i]['count'];
                        obj.z = chartdata1[i]['amount'];
                        arr.push(obj);
                    }

                    var arr2 = [];
                    for (var i = 0; i < chartdata2.length; i++) {
                        var obj = {};
                        obj.name = chartdata2[i]['_id'];
                        obj.y = chartdata2[i]['count'];
                        obj.z = chartdata2[i]['amount'];
                        arr2.push(obj);
                    }

                    payment.find(query, function (err, docs) {
                        var count = 0;
                        var unpaidcount = 0;
                        var paidcount = 0;
                        var amount = 0;
                        for (var i = 0; i < docs.length; i++) {
                            count = count + 1;
                            if (docs[i].status == "Credit") {
                                amount = amount + parseFloat(docs[i].amount);
                                paidcount = paidcount + 1;
                            }
                            else {
                                unpaidcount = unpaidcount + 1;
                            }
                        }
                        query2.validated = {$ne: false};
                        lmsUsers.count(query2, function (err, registrations) {
                            res.json({ registrations: registrations, paidcount: paidcount, unpaidcount: unpaidcount, count: count, amount: amount, chartdata1: arr, chartdata2: arr2 });
                        })
                    });
                }
            });
        }
    });
});

router.get('/datatable/payments', function (req, res, next) {
    /*
   * Script:    DataTables server-side script for NODE and MONGODB
   * Copyright: 2018 - Siddharth Sogani
   */

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * Easy set variables
     */

    /* Array of columns to be displayed in DataTable
     */
    var $aColumns = ['buyer_name', 'email', 'phone', 'status', 'purpose', 'amount', 'couponcode', 'payment_id', 'date', 'registered'];

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
        console.log(req.query.sSearch)
        var arr = [{ "payment_request_id": { $regex: '' + req.query.sSearch + '', '$options': 'i' } }, { "buyer_name": { $regex: '' + req.query.sSearch + '', '$options': 'i' } }, { "email": { $regex: '' + req.query.sSearch + '', '$options': 'i' } }, { "phone": { $regex: '' + req.query.sSearch + '', '$options': 'i' } }, { "status": { $regex: '' + req.query.sSearch + '', '$options': 'i' } }, { "purpose": { $regex: '' + req.query.sSearch + '', '$options': 'i' } }, { "payment_id": { $regex: '' + req.query.sSearch + '', '$options': 'i' } }];
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
        filterArray.push({ "purpose": req.query.purposefilter })
        query.$and = filterArray;
    }
    if (req.query.statusfilter !== "") {
        console.log('222');
        filterArray.push({ "status": { $regex: '' + req.query.statusfilter + '', '$options': 'i' } })
        query.$and = filterArray;
    }

    /*
   * Ordering
   */
    var sortObject = { 'date': -1 };
    if (req.query.iSortCol_0 && req.query.iSortCol_0 == 0) {
        if (req.query.sSortDir_0 == 'desc') {
            var sortObject = {};
            var stype = 'buyer_name';
            var sdir = -1;
            sortObject[stype] = sdir;
        }
        else {
            var sortObject = {};
            var stype = 'buyer_name';
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
    else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 3) {
        if (req.query.sSortDir_0 == 'desc') {
            var sortObject = {};
            var stype = 'status';
            var sdir = -1;
            sortObject[stype] = sdir;
        }
        else {
            var sortObject = {};
            var stype = 'status';
            var sdir = 1;
            sortObject[stype] = sdir;
        }
    }
    else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 4) {
        if (req.query.sSortDir_0 == 'desc') {
            var sortObject = {};
            var stype = 'purpose';
            var sdir = -1;
            sortObject[stype] = sdir;
        }
        else {
            var sortObject = {};
            var stype = 'purpose';
            var sdir = 1;
            sortObject[stype] = sdir;
        }
    }
    else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 5) {
        if (req.query.sSortDir_0 == 'desc') {
            var sortObject = {};
            var stype = 'amount';
            var sdir = -1;
            sortObject[stype] = sdir;
        }
        else {
            var sortObject = {};
            var stype = 'amount';
            var sdir = 1;
            sortObject[stype] = sdir;
        }
    }
    else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 6) {
        if (req.query.sSortDir_0 == 'desc') {
            var sortObject = {};
            var stype = 'payment_id';
            var sdir = -1;
            sortObject[stype] = sdir;
        }
        else {
            var sortObject = {};
            var stype = 'payment_id';
            var sdir = 1;
            sortObject[stype] = sdir;
        }
    }

    payment.find(query).skip(parseInt($sDisplayStart)).limit(parseInt($sLength)).sort(sortObject).exec(function (err, docs) {
        payment.count(query, function (err, count) {
            console.log("HEREE");
            console.log(query);
            console.log(docs);
            var aaData = [];
            for (let i = 0; i < (docs).length; i++) {
                var $row = [];
                for (var j = 0; j < ($aColumns).length; j++) {
                    if ($aColumns[j] == 'date') {
                        $row.push(moment(docs[i][$aColumns[j]]).format("DD/MMM/YYYY HH:mm A"));
                    }
                    else if ($aColumns[j] == 'registered') {
                        $row.push(moment(docs[i]['registered']).format("DD/MMM/YYYY HH:mm A"));
                    }
                    else {
                        $row.push(docs[i][$aColumns[j]])
                    }
                }
                aaData.push($row);
            }
            var sample = { "sEcho": req.query.sEcho, "iTotalRecords": count, "iTotalDisplayRecords": count, "aaData": aaData };
            res.json(sample);
        });
    });
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

router.get('/datatable/webinarattendees', function (req, res, next) {
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

    var filterArray = [];
    // if (req.query.fromdatefilter !== "") {
    //     console.log('11111');
    //     filterArray.push({ date: { $gte: req.query.fromdatefilter + ' 00:00' } })
    //     query.$and = filterArray;
    // }
    // if (req.query.todatefilter !== "") {
    //     console.log('1111');
    //     filterArray.push({ date: { $lte: req.query.todatefilter + ' 23:59' } })
    //     query.$and = filterArray;
    // }
    // if (req.query.purposefilter !== "") {
    //     console.log('222');
    //     filterArray.push({ "purpose": req.query.purposefilter })
    //     query.$and = filterArray;
    // }
    // if (req.query.statusfilter !== "") {
    //     console.log('222');
    //     filterArray.push({ "status": { $regex: '' + req.query.statusfilter + '', '$options': 'i' } })
    //     query.$and = filterArray;
    // }

    /*
   * Ordering
   */
    var sortObject = { 'date': -1 };
    // if (req.query.iSortCol_0 && req.query.iSortCol_0 == 0) {
    //     if (req.query.sSortDir_0 == 'desc') {
    //         var sortObject = {};
    //         var stype = 'title';
    //         var sdir = -1;
    //         sortObject[stype] = sdir;
    //     }
    //     else {
    //         var sortObject = {};
    //         var stype = 'title';
    //         var sdir = 1;
    //         sortObject[stype] = sdir;
    //     }

    // }

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

router.get('/datatable/referralprogram', function (req, res, next) {
    /*
   * Script:    DataTables server-side script for NODE and MONGODB
   * Copyright: 2018 - Siddharth Sogani
   */

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * Easy set variables
     */

    /* Array of columns to be displayed in DataTable
     */
    var $aColumns = ['referralcode', 'paid', 'totalsales', 'totaldiscount', 'earned', 'action'];

    /*
     * Paging
     */
    var $sDisplayStart = 0;
    var $sLength = "";
    if ((req.query.iDisplayStart) && req.query.iDisplayLength != '-1') {
        $sDisplayStart = req.query.iDisplayStart;
        $sLength = req.query.iDisplayLength;
    }

    matchQuery = { coupontype: "referralcode" };
    /*
   * Filtering
   * NOTE this does not match the built-in DataTables filtering which does it
   * word by word on any field. It's possible to do here, but concerned about efficiency
   * on very large tables, and MySQL's regex functionality is very limited
   */
    if (req.query.sSearch != "") {
        var arr = [{ "couponcode": { $regex: '' + req.query.sSearch + '', '$options': 'i' } }];
        matchQuery.$or = arr;
    }

    var filterArray = [];
    if (req.query.fromdatefilter !== "") {
        console.log('11111');
        filterArray.push({ date: { $gte: new Date(req.query.fromdatefilter + ' 00:00') } })
        matchQuery.$and = filterArray;
    }
    if (req.query.todatefilter !== "") {
        console.log('1111');
        filterArray.push({ date: { $lte: new Date(req.query.todatefilter + ' 23:59') } })
        matchQuery.$and = filterArray;
    }
    if (req.query.purposefilter !== "") {
        console.log('222');
        filterArray.push({ "purpose": req.query.purposefilter })
        matchQuery.$and = filterArray;
    }
    if (req.query.statusfilter !== "") {
        console.log('222');
        filterArray.push({ "status": { $regex: '' + req.query.statusfilter + '', '$options': 'i' } })
        matchQuery.$and = filterArray;
    }

    /*
   * Ordering
   */
    var sortObject = { 'date': -1 };
    if (req.query.iSortCol_0 && req.query.iSortCol_0 == 0) {
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
    console.log('matchquery');
    console.log(matchQuery);
    payment.aggregate([
        {
            $match: matchQuery
        },
        {
            "$sort": sortObject
        },
        {
            "$skip": parseInt($sDisplayStart)
        },
        {
            "$limit": parseInt($sLength)
        },
        {
            $group: {
                "_id": "$couponcode",
                count: { $sum: 1 },
                totalsales: {
                    $sum: "$amount"
                },
                totaldiscount: {
                    $sum: "$discount"
                },
                totalearned: {
                    $sum: "$offertoparticipant"
                },
                customers: { $push: { $concat: ["$buyer_name", "-", "$purpose"] } }
            }
        }
    ], function (err, docs) {
        // payment.find(query).skip(parseInt($sDisplayStart)).limit(parseInt($sLength)).sort(sortObject).exec(
        payment.aggregate([
            {
                $match: matchQuery
            },
            {
                $group: {
                    "_id": "$couponcode",
                    count: { $sum: 1 }
                }
            }
        ], function (err, response) {
            console.log('aehgahegpaheigpaeg');
            console.log(count);
            var count = response.length;
            var aaData = [];
            for (let i = 0; i < (docs).length; i++) {
                var $row = [];
                for (var j = 0; j < ($aColumns).length; j++) {
                    if ($aColumns[j] == 'referralcode') {
                        $row.push(docs[i]['_id']);
                    }
                    if ($aColumns[j] == 'paid') {
                        $row.push(docs[i]['count']);
                    }
                    if ($aColumns[j] == 'totalsales') {
                        $row.push(docs[i]['totalsales']);
                    }
                    if ($aColumns[j] == 'totaldiscount') {
                        $row.push(docs[i]['totaldiscount']);
                    }
                    if ($aColumns[j] == 'earned') {
                        $row.push(docs[i]['totalearned']);
                    }
                    if ($aColumns[j] == 'action') {
                        $row.push(`<button data-customers="${docs[i].customers}" data-referralcode="${docs[i]._id}" class="btn btn-sm btn-success referraldetails">Details</button>`);
                    }
                }
                aaData.push($row);
            }
            var sample = { "sEcho": req.query.sEcho, "iTotalRecords": count, "iTotalDisplayRecords": count, "aaData": aaData };
            res.json(sample);
        });
    });
});

router.get('/datatable/promotionprogram', function (req, res, next) {
    /*
   * Script:    DataTables server-side script for NODE and MONGODB
   * Copyright: 2018 - Siddharth Sogani
   */

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * Easy set variables
     */

    /* Array of columns to be displayed in DataTable
     */
    var $aColumns = ['couponcode', 'paid', 'totalsales', 'totaldiscount', 'action'];

    /*
     * Paging
     */
    var $sDisplayStart = 0;
    var $sLength = "";
    if ((req.query.iDisplayStart) && req.query.iDisplayLength != '-1') {
        $sDisplayStart = req.query.iDisplayStart;
        $sLength = req.query.iDisplayLength;
    }

    var matchQuery = { coupontype: "couponcode", couponcode: { $ne: "" } };
    /*
   * Filtering
   * NOTE this does not match the built-in DataTables filtering which does it
   * word by word on any field. It's possible to do here, but concerned about efficiency
   * on very large tables, and MySQL's regex functionality is very limited
   */
    if (req.query.sSearch != "") {
        var arr = [{ "couponcode": { $regex: '' + req.query.sSearch + '', '$options': 'i' } }];
        matchQuery.$or = arr;
    }

    var filterArray = [];
    if (req.query.fromdatefilter !== "") {
        console.log('11111');
        filterArray.push({ date: { $gte: new Date(req.query.fromdatefilter + ' 00:00') } })
        matchQuery.$and = filterArray;
    }
    if (req.query.todatefilter !== "") {
        console.log('1111');
        filterArray.push({ date: { $lte: new Date(req.query.todatefilter + ' 23:59') } })
        matchQuery.$and = filterArray;
    }
    if (req.query.purposefilter !== "") {
        console.log('222');
        filterArray.push({ "purpose": req.query.purposefilter })
        matchQuery.$and = filterArray;
    }
    if (req.query.statusfilter !== "") {
        console.log('222');
        filterArray.push({ "status": { $regex: '' + req.query.statusfilter + '', '$options': 'i' } })
        matchQuery.$and = filterArray;
    }

    /*
   * Ordering
   */
    var sortObject = { 'date': -1 };
    if (req.query.iSortCol_0 && req.query.iSortCol_0 == 0) {
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
    payment.aggregate([
        {
            $match: matchQuery
        },
        {
            "$sort": sortObject
        },
        {
            "$skip": parseInt($sDisplayStart)
        },
        {
            "$limit": parseInt($sLength)
        },
        {
            $group: {
                "_id": "$couponcode",
                count: { $sum: 1 },
                totalsales: {
                    $sum: "$amount"
                },
                totaldiscount: {
                    $sum: "$discount"
                },
                totalearned: {
                    $sum: "$offertoparticipant"
                },
                customers: { $push: { $concat: ["$buyer_name", "-", "$purpose"] } }
            }
        }
    ], function (err, docs) {
        // payment.find(query).skip(parseInt($sDisplayStart)).limit(parseInt($sLength)).sort(sortObject).exec(
        payment.aggregate([
            {
                $match: matchQuery
            },
            {
                $group: {
                    "_id": "$couponcode",
                    count: { $sum: 1 }
                }
            }
        ], function (err, response) {
            console.log('aehgahecoupgpaheigpaeg');
            console.log(docs);
            var count = response.length;
            var aaData = [];
            for (let i = 0; i < (docs).length; i++) {
                var $row = [];
                for (var j = 0; j < ($aColumns).length; j++) {
                    if ($aColumns[j] == 'couponcode') {
                        $row.push(docs[i]['_id']);
                    }
                    if ($aColumns[j] == 'paid') {
                        $row.push(docs[i]['count']);
                    }
                    if ($aColumns[j] == 'totalsales') {
                        $row.push(docs[i]['totalsales']);
                    }
                    if ($aColumns[j] == 'totaldiscount') {
                        $row.push(docs[i]['totaldiscount']);
                    }
                    if ($aColumns[j] == 'action') {
                        $row.push(`<button data-customers="${docs[i].customers}" data-couponcode="${docs[i]._id}" class="btn btn-sm btn-success coupondetails">Details</button>`);
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
    var $aColumns = ['user', 'email', 'access', 'batches', 'certificate', 'ip', 'created', 'lastloggedin', 'action'];

    /*
     * Paging
     */
    var $sDisplayStart = 0;
    var $sLength = "";
    if ((req.query.iDisplayStart) && req.query.iDisplayLength != '-1') {
        $sDisplayStart = req.query.iDisplayStart;
        $sLength = req.query.iDisplayLength;
    }

    var query = { deleted: { $ne: true }, validated: {$ne: false} };
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
    else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 5) {
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
    else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 6) {
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

    } else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 7) {
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
    var $aColumns = ['user', 'email', 'access', 'batches', 'certificate', 'ip', 'created', 'lastloggedin', 'action'];

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

    //     var filterArray = [];
    //   if(req.query.fromdatefilter!==""){
    //     console.log('11111');
    //     filterArray.push({date: {$gte: req.query.fromdatefilter}})
    //     query.$and = filterArray;
    //   }
    //   if(req.query.todatefilter!==""){
    //     console.log('1111');
    //     filterArray.push({date: {$lte: req.query.todatefilter+' 23:59'}})
    //     query.$and = filterArray;
    //   }
    //   if(req.query.paymentrequestidfilter!==""){
    //     console.log('111');
    //     filterArray.push({"payment_request_id":  { $regex: '' + req.query.paymentrequestidfilter + '', '$options' : 'i' }})
    //     query.$and = filterArray;
    //   }
    //   if(req.query.namefilter!==""){
    //     console.log('111');
    //     filterArray.push({"buyer_name":  { $regex: '' + req.query.namefilter + '', '$options' : 'i' }})
    //     query.$and = filterArray;
    //   }
    //   if(req.query.purposefilter!==""){
    //     console.log('222');
    //     filterArray.push({"purpose":  { $regex: '' + req.query.purposefilter + '', '$options' : 'i' }})
    //     query.$and = filterArray;
    //   }
    //   if(req.query.statusfilter!==""){
    //     console.log('222');
    //     filterArray.push({"status":  { $regex: '' + req.query.statusfilter + '', '$options' : 'i' }})
    //     query.$and = filterArray;
    //   }
    //   if(req.query.paymentidfilter!==""){
    //     console.log('333');
    //     filterArray.push({"payment_id":  { $regex: '' + req.query.paymentidfilter + '', '$options' : 'i' }})
    //     query.$and = filterArray;
    //   }

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
    else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 5) {
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
    else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 6) {
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

    } else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 7) {
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

/*POST new event*/
router.post('/createevent', function (req, res) {
    var event_name = req.body.event_name;
    var event_description = req.body.event_description;
    var event_date = req.body.event_date;
    var event_location = req.body.event_location;
    var event_hostedby = req.body.event_hostedby;
    var event_latitude = req.body.event_latitude;
    var event_longitude = req.body.event_longitude;
    var event = new Event({
        event_name: event_name,
        event_description: event_description,
        event_date: event_date,
        event_location: event_location,
        event_hostedby: event_hostedby,
        event_latitude: event_latitude,
        event_longitude: event_longitude
    });

    event.save(function (err, results) {
        if (err) {
            res.json(err);
        }
        else {
            //res.json(results._id);
            res.redirect('manage-events');
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
        name: getusername(req.user),
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

/*POST new course*/
router.post('/addcategory', function (req, res, next) {
    var category2 = new category({
        name: req.body.name,
        categoryurl: req.body.categoryurl,
        date: new Date()
    });
    category2.save(function (err, results) {
        console.log(err);
        if (err) {
            res.json(err);
        }
        else {
            res.json(results);
        }
    });
});

router.post('/updatecoursename', function (req, res) {
    var title = req.body.name.toString();
    lmsCourses.update(
        {
            _id: req.body.pk
        },
        {
            $set: { "course_name": req.body.value }
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

router.post('/updatecoursemodules', function (req, res) {
    var title = req.body.name.toString();
    lmsCourses.update(
        {
            _id: req.body.pk
        },
        {
            $set: { "course_modules": req.body.value }
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

router.post('/updateblogcontent', function (req, res) {
    blog.update(
        {
            _id: req.body.pk
        },
        {
            $set: { "content": req.body.value }
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

router.post('/updatekeytakeaway', function (req, res) {
    webinar.update(
        {
            _id: req.body.pk
        },
        {
            $set: { "keytakeaway": req.body.value }
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

router.post('/updatesessionagenda', function (req, res) {
    webinar.update(
        {
            _id: req.body.pk
        },
        {
            $set: { "sessionagenda": req.body.value }
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

router.post('/updatewebinar', function (req, res) {
    var obj = {};
    obj[req.body.name] = req.body.value
    webinar.update(
        {
            _id: req.body.pk
        },
        {
            $set: obj
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

router.post('/updatewebinardate', function (req, res) {
    var obj = {};
    webinar.update(
        {
            _id: req.body.pk
        },
        {
            $set: { date: new Date(req.body.value) }
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

router.post('/updateblogcategory', function (req, res) {
    blog.update(
        {
            _id: req.body.pk, category: { $exists: false }
        },
        {
            $set: { "category": req.body.value }
        }
        ,
        function (err, count) {
            if (err) {
                console.log(err);
            }
            else {
                if (count.n == 1 && count.nModified == 1) {
                    category.update(
                        {
                            name: req.body.value
                        },
                        {
                            $inc: { "readcount": 1 }
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
                    blog.findOne(
                        {
                            _id: req.body.pk
                        },
                        function (err, blog) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                category.update(
                                    {
                                        name: blog.category
                                    },
                                    {
                                        $inc: { "readcount": -1 }
                                    }
                                    ,
                                    function (err, count) {
                                        if (err) {
                                            console.log(err);
                                        }
                                        else {
                                            blog.update(
                                                {
                                                    _id: req.body.pk
                                                },
                                                {
                                                    $set: { "category": req.body.value }
                                                }
                                                ,
                                                function (err, count) {
                                                    if (err) {
                                                        console.log(err);
                                                    }
                                                    else {
                                                        category.update(
                                                            {
                                                                name: req.body.value
                                                            },
                                                            {
                                                                $inc: { "readcount": 1 }
                                                            }
                                                            ,
                                                            function (err, count) {
                                                                res.json(count);
                                                            })
                                                    }
                                                });
                                        }
                                    });
                            }
                        });
                }
            }
        });
});

router.post('/updateblogtitle', function (req, res) {
    blog.update(
        {
            _id: req.body.pk
        },
        {
            $set: { "title": req.body.value }
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

router.post('/updateblogtags', function (req, res) {
    blog.update(
        {
            _id: req.body.pk
        },
        {
            $set: { "tags": req.body.value }
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

router.post('/updateblogurl', function (req, res) {
    blog.update(
        {
            _id: req.body.pk
        },
        {
            $set: { "blogurl": req.body.value }
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

router.post('/updateblogauthor', function (req, res) {
    blog.update(
        {
            _id: req.body.pk
        },
        {
            $set: { "author": req.body.value }
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

router.post('/updateblogoverview', function (req, res) {
    blog.update(
        {
            _id: req.body.pk
        },
        {
            $set: { "overview": req.body.value }
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
router.post('/updatequestion', function (req, res, next) {
    faqModel.update(
        {
            _id: req.body.pk
        },
        {
            $set: { question: req.body.value }
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
router.post('/updatefaqcategory', function (req, res, next) {
    faqModel.update(
        {
            _id: req.body.pk
        },
        {
            $set: { category: req.body.value }
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

// Update FAQ Answer
router.post('/updateanswer', function (req, res, next) {
    faqModel.update(
        {
            _id: req.body.pk
        },
        {
            $set: { answer: req.body.value }
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
router.delete('/removefaq', function (req, res, next) {
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

router.post('/updatecoursemode', function (req, res) {
    var title = req.body.name.toString();
    lmsCourses.update(
        {
            _id: req.body.pk
        },
        {
            $set: { "course_mode": req.body.value }
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

router.post('/updatemodulemode', function (req, res) {
    var title = req.body.name.toString();
    lmsModules.update(
        {
            _id: req.body.pk
        },
        {
            $set: { "active": req.body.value }
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

router.post('/updatecoursestartdate', function (req, res) {
    var title = req.body.name.toString();
    lmsCourses.update(
        {
            _id: req.body.pk
        },
        {
            $set: { "course_startdate": req.body.value }
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

router.post('/updatecourseprice', function (req, res) {
    var title = req.body.name.toString();
    lmsCourses.update(
        {
            _id: req.body.pk
        },
        {
            $set: { "course_price": req.body.value }
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

router.post('/updatecoursetax', function (req, res) {
    var title = req.body.name.toString();
    lmsCourses.update(
        {
            _id: req.body.pk
        },
        {
            $set: { "course_tax": req.body.value }
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

router.post('/updatecoursecertification', function (req, res) {
    var title = req.body.name.toString();
    lmsCourses.update(
        {
            _id: req.body.pk
        },
        {
            $set: { "course_certification": req.body.value }
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

router.post('/updatecourselive', function (req, res) {
    var title = req.body.name.toString();
    lmsCourses.update(
        {
            _id: req.body.pk
        },
        {
            $set: { "course_live": req.body.value }
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

router.post('/updatecoursediscountactive', function (req, res) {
    var title = req.body.name.toString();
    lmsCourses.update(
        {
            _id: req.body.pk
        },
        {
            $set: { "course_discountactive": req.body.value }
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

router.post('/updatecoursediscountvalid', function (req, res) {
    var title = req.body.name.toString();
    lmsCourses.update(
        {
            _id: req.body.pk
        },
        {
            $set: { "course_discount_valid": req.body.value }
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

router.post('/updatemoduleopenson', function (req, res) {
    var title = req.body.name.toString();
    lmsModules.update(
        {
            _id: req.body.pk
        },
        {
            $set: { "opens_on": req.body.value }
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

router.post('/updatecoursediscount', function (req, res) {
    var title = req.body.name.toString();
    lmsCourses.update(
        {
            _id: req.body.pk
        },
        {
            $set: { "course_discount": req.body.value }
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

router.post('/updatecourseurl', function (req, res) {
    var title = req.body.name.toString();
    lmsCourses.update(
        {
            _id: req.body.pk
        },
        {
            $set: { "course_url": req.body.value }
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

router.post('/updatecourseobjective', function (req, res) {
    var title = req.body.name.toString();
    lmsCourses.update(
        {
            _id: req.body.pk
        },
        {
            $set: { "course_objective": req.body.value }
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

router.post('/updatecourseprojects', function (req, res) {
    var title = req.body.name.toString();
    lmsCourses.update(
        {
            _id: req.body.pk
        },
        {
            $set: { "course_projects": req.body.value }
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
}); router.post('/updatecourseduration', function (req, res) {
    var title = req.body.name.toString();
    lmsCourses.update(
        {
            _id: req.body.pk
        },
        {
            $set: { "course_duration": req.body.value }
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
router.post('/updatecourseaudience', function (req, res) {
    var title = req.body.name.toString();
    lmsCourses.update(
        {
            _id: req.body.pk
        },
        {
            $set: { "course_target_audience": req.body.value }
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
router.post('/updatecoursetools', function (req, res) {
    var title = req.body.name.toString();
    lmsCourses.update(
        {
            _id: req.body.pk
        },
        {
            $set: { "course_tools_requirements": req.body.value }
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

router.post('/updatemodulename', function (req, res) {
    var title = req.body.name.toString();
    lmsModules.update(
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

router.post('/updatemoduleid', function (req, res) {
    var title = req.body.name.toString();
    lmsModules.update(
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

router.post('/updatemoduledescription', function (req, res) {
    var title = req.body.name.toString();
    lmsModules.update(
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

router.post('/updatemoduleimage', function (req, res) {
    var title = req.body.name.toString();
    lmsModules.update(
        {
            _id: req.body.pk
        },
        {
            $set: { "module_image": req.body.value }
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
router.post('/updatemoduleorder', function (req, res) {
    var title = req.body.name.toString();
    lmsModules.update(
        {
            _id: req.body.pk
        },
        {
            $set: { "module_order": req.body.value }
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
router.post('/updatetopicname', function (req, res) {
    var title = req.body.name.toString();
    lmsTopics.update(
        {
            _id: req.body.pk
        },
        {
            $set: { "topic_name": req.body.value }
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

router.post('/updatetopicorder', function (req, res) {
    var title = req.body.name.toString();
    lmsTopics.update(
        {
            _id: req.body.pk
        },
        {
            $set: { "topic_order": req.body.value }
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

// router.put('/updatetopicorder', function (req, res) {
//     lmsTopics.update(
//         {
//             topic_order: req.body.prev_topic_order,
//             module_id: req.body.module_id,
//             processing: {$ne: "yes"}
//         },
//         {
//             $set: { "topic_order": req.body.next_topic_order, processing: "yes" }
//         }
//         ,
//         function (err, count) {
//             if (err) {
//                 console.log(err);
//             }
//             else {
//                 console.log('________________aehoighaeigaeg');
//                 console.log(req.body.processingall);
//                 if(req.body.processingall==false || req.body.processingall=="false"){
//                     console.log("HEREEEEEEEEEEE");
//                     lmsTopics.update(
//                     {
//                         module_id: req.body.module_id
//                     },
//                     {
//                         $set: { processing: "false" }
//                     }
//                     ,
//                     {multi: true},
//                     function (err, count) {
//                         if (err) {
//                             console.log(err);
//                         }
//                         else {
//                             console.log('YES COMES HERE');
//                             console.log(count);
//                             res.json(count);
//                         }
//                     });
//                 }
//                 else{
//                     console.log('AND COMES HERE');
//                             console.log(count);
//                     res.json(count)
//                 }
//             }
//         });
// });

router.post('/updateeltype', function (req, res) {
    var title = req.body.name.toString();
    lmsElements.update(
        {
            _id: req.body.pk
        },
        {
            $set: { "element_type": req.body.value }
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

router.post('/updateelobjective', function (req, res) {
    var title = req.body.name.toString();
    lmsElements.update(
        {
            _id: req.body.pk
        },
        {
            $set: { "element_objective": req.body.value }
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

router.post('/updateelname', function (req, res) {
    var title = req.body.name.toString();
    lmsElements.update(
        {
            _id: req.body.pk
        },
        {
            $set: { "element_name": req.body.value }
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

router.post('/updateelduration', function (req, res) {
    var title = req.body.name.toString();
    lmsElements.update(
        {
            _id: req.body.pk
        },
        {
            $set: { "duration": req.body.value }
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

router.post('/updateelorder', function (req, res) {
    var title = req.body.name.toString();
    lmsElements.update(
        {
            _id: req.body.pk
        },
        {
            $set: { "element_order": req.body.value }
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
}); router.post('/updateelval', function (req, res) {
    var title = req.body.name.toString();
    lmsElements.update(
        {
            _id: req.body.pk
        },
        {
            $set: { "element_val": req.body.value }
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

/*POST new module*/
router.post('/addmodule', function (req, res, next) {
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

/*POST new topic*/
router.post('/addtopic', function (req, res, next) {
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

/*POST new element*/
router.post('/addelement', function (req, res, next) {
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

/*REMOVE a video or quiz*/
router.put('/removeelement', function (req, res) {
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

/*REMOVE a course*/
router.put('/removecourse', function (req, res) {
    var course_id = req.body.course_id;
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;

    lmsCourses.update(
        {
            _id: safeObjectId(course_id)
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

router.put('/removecategory', function (req, res) {
    var categoryid = req.body.categoryid;
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;

    category.update(
        {
            _id: safeObjectId(categoryid)
        },
        {
            $set: { 'deleted': true }
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
router.put('/removemodule', function (req, res) {
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

/*REMOVE a topic*/
router.put('/removetopic', function (req, res) {
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
        /*lmsQuizlog.aggregate([
            {$group:{
                    _id:"$email",
                    total : {$sum:1},
                    quizes: {$push: {$concat:["$quizid", "-", "$questionCorrectIncorrect"]}}
                }
            }
            ], function (err, result) {
            if (err) {
                res.json(err);
            }
            else {
                /!*Tag.populate(transactions, {path: '_id'}, function(err, populatedTransactions) {
                    // Your populated translactions are inside populatedTransactions
                });*!/
                var arr = [];
                for(var i = 0; i <result.length; i++){
                    var quizes = result[i]['quizes'];
                    var quizids = [];
                    var quizlogs = [];
                    for(var j = 0; j < quizes.length; j++){
                        if(quizes[j]){
                            quizids.push(quizes[j].split('-')[0]);
                            quizlogs.push(getQuizScore(JSON.parse(quizes[j].split('-')[1])));
                        }
                    }
                    var obj = {};
                    obj.email = result[i]._id;
                    obj.quizids = quizids;
                    obj.quizlogs = quizlogs;
                    arr.push(obj);
                }
                res.render('adminpanel/quizreport', { docs: arr, email: req.user.email });
            }
        });*/
    }
    else {
        res.redirect('/auth');
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

router.get('/:course', function (req, res, next) {
    res.redirect('/dashboard/'+req.params.course);
});

/*Digital Marketing Course Page*/
router.get('/dashboard/:course', myLogger, function (req, res, next) {
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
                                modules[i]['modulesVideoLength'] = 'Duration: ' + (Math.round(temp / 60) + ' minutes ');
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
                            res.render('course_modules', { course: course, avg: avg, title: 'Express', modulesVideoLength: modulesVideoLength, modules: modules, moment: moment, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
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
        res.redirect('/auth');
    }
    /**/
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

router.get('/:course', myLogger, function (req, res, next) {
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;
    if (req.isAuthenticated()) {
        lmsCourses.findOne({ 'course_url': req.params.course }, function (err, course) {
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
                    var countModules = modules.length;
                    for (var i = 0; i < modules.length; i++) {
                        jobQueries.push(lmsElements.find({ element_module_id: safeObjectId(modules[i]['_id']), deleted: { $ne: "true" } }));
                    }
                    for (var i = 0; i < modules.length; i++) {
                        jobQueries2.push(lmsElements.find({ element_module_id: safeObjectId(modules[i]['_id']), deleted: { $ne: "true" }, watchedby: req.user.email }));
                    }

                    Promise.all(jobQueries).then(function (listOfJobs) {
                        Promise.all(jobQueries2).then(function (listOfJobs2) {
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
                            // res.json(modules);
                            res.render('course_modules', { course: course, avg: avg, title: 'Express', modulesVideoLength: modulesVideoLength, modules: modules, moment: moment, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
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
        res.redirect('/auth');
    }
    /**/
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

/*GET Module Page*/
router.get('/:courseurl/:moduleid', myLogger, function (req, res, next) {
    res.redirect('/dashboard/'+req.params.courseurl+"/"+req.params.moduleid);
});
/*GET Module Page*/
router.get('/dashboard/:courseurl/:moduleid', myLogger, function (req, res, next) {
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
                                                res.render('course_module', { moduleslist: moduleslist, forumdocs: forumdocs, moment: moment, courseurl: req.params.courseurl, moduleid: req.params.moduleid, nextmoduleid: moduleNext.module_id.toString(), title: 'Express', courseobj: courseobj, course: modulesObj, moment: moment, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, user: req.user });
                                            }
                                            else {
                                                res.render('course_module', { moduleslist: moduleslist, forumdocs: forumdocs, moment: moment, courseurl: req.params.courseurl, moduleid: req.params.moduleid, nextmoduleid: null, title: 'Express', courseobj: courseobj, course: modulesObj, moment: moment, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, user: req.user });
                                            }
                                        }
                                        else {
                                            req.session.returnTo = req.path;
                                            res.redirect('/auth');
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

router.get('/dashboard2/getmoduledata/:courseurl', function (req, res, next) {
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;
    var courseObj;
    var modulesObj;
    var topicsObj;
    var elementsObj;
    lmsCourses.findOne({ 'course_access_url': "/" + req.params.courseurl }, function (err, courseobj) {
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
                let html = `
                <div class="accordion" id="accordionExample">
                        ${coursedata.map((module, moduleindex)=>{
                            return `<div class="card">
                            <div class="card-header" id="heading${moduleindex}">
                               <h5 class="mb-0 collapsed" data-toggle="collapse" data-target="#collapse${moduleindex}" aria-expanded="false" aria-controls="collapse${moduleindex}">
                                  ${module[0].module_name}
                               </h5>
                            </div>
                            <div id="collapse${moduleindex}" class="collapse ${moduleindex == 0 ? 'show' : ''}" aria-labelledby="heading${moduleindex}" data-parent="#accordionExample" style="">
                               <div class="card-body">
                               <div class="accordion" id="accordionExample${moduleindex}">
                               ${module[0].topics.map((topic, topicindex)=>{
                                   return  `
                                   <div class="card-header card-header-topic" id="heading${moduleindex}${topicindex}">
                                        <h5 class="mb-0 collapsed" data-toggle="collapse" data-target="#collapse${moduleindex}${topicindex}" aria-expanded="false" aria-controls="collapse${moduleindex}${topicindex}">
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
                                                    <span>${elementindex+1}</span>
                                                    <i class="fa fa-play-circle"></i>
                                                    <h5><a href="#">${element.element_name}</a>
                                                    </h5>
                                                    </div>
                                                    <div class="right-content">
                                                    <a href="https://vimeo.com/${element.element_val.match(/([^\/]*)\/*$/)[1]}" class="popup-youtube light">
                                                    Preview
                                                    </a>
                                                    </div>
                                                </li>`;
                                                    }
                                                    else{
                                                        return `<li>
                                                    <div class="left-content">
                                                    <span>${elementindex+1}</span>
                                                    <i class="fa fa-play-circle"></i>
                                                    <h5><a href="#">${element.element_name}</a>
                                                    </h5>
                                                    </div>
                                                </li>`;
                                                    }
                                                }
                                                else if(element.element_type=='quiz'){
                                                    return `<li>
                                                    <div class="left-content">
                                                    <span>${elementindex+1}</span>
                                                    <i class="fa fa-question"></i>
                                                    <h5><a href="#">${element.element_name}</a>
                                                    </h5>
                                                    </div>
                                                </li>`;
                                                }
                                                else if(element.element_type=='exercise'){
                                                    return `<li>
                                                    <div class="left-content">
                                                    <span>${elementindex+1}</span>
                                                    <i class="fa fa-tasks"></i>
                                                    <h5><a href="#">${element.element_name}</a>
                                                    </h5>
                                                    </div>
                                                </li>`;
                                                }
                                            }).join("")}
                                        </ul>
                                        </div>
                                    </div>
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
    res.redirect('/auth');
}

function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.role == '2')
        return next();
    res.redirect('/');
}

module.exports = router;
