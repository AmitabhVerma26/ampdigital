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
 * Jobs Posts Page
 */
 router.get('/', function (req, res, next) {
    req.session.returnTo = req.baseUrl+req.url;
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
 * Jobs Post Page
 */
router.get('/post', function (req, res, next) {
    req.session.returnTo = req.baseUrl+req.url;
    if (!req.isAuthenticated()) {
        res.render('jobs/postjob', { title: 'Express', authenticated: false });
    }
    else {
        res.render('jobs/postjob', { title: 'Express', authenticated: true, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
    }
});

router.post('/post', function (req, res, next) {
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
                                res.render('jobs/thankyoupage', { title: 'Express', email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
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
                res.render('jobs/thankyoupage', { title: 'Express', email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
            }
        });
    }

});

function getPathFromUrl(url) {
    return url.split("?")[0];
}

router.post('/filter', function (req, res, next) {
    var searchfilter = req.body.searchfilter;
    var employmenttype = req.body.employmenttype;
    var senioritylevel = req.body.senioritylevel;
    var remote = req.body.remote;
    var state = req.body.state;
    var city = req.body.city;
    var query = { deleted: { $nin: ["true", true] }, approved: true };
    var filterArray = [];

    if (searchfilter !== "") {
        
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
            
            filterArray.push({ employmenttype: employmenttype })
        }
        if (senioritylevel !== "") {
            filterArray.push({ senioritylevel: senioritylevel })
        }
        if (remote && remote !== "") {
            
            filterArray.push({ remote: remote })
        }
        if (remote == "no" && state !== "") {
            
            filterArray.push({ state: state })
        }
        if (remote == "no" && state !== "" && city !== "") {
            
            filterArray.push({ city: city })
        }
        query.$or = filterArray;
    }
    else{
        if (employmenttype !== "") {
            
            filterArray.push({ employmenttype: employmenttype })
            query.$and = filterArray;
        }
        if (senioritylevel !== "") {
            
            filterArray.push({ senioritylevel: senioritylevel })
            query.$and = filterArray;
        }
        if (remote && remote !== "") {
            
            filterArray.push({ remote: remote })
            query.$and = filterArray;
        }
        if (remote == "no" && state !== "") {
            
            filterArray.push({ state: state })
            query.$and = filterArray;
        }
        if (remote == "no" && state !== "" && city !== "") {
            
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
                    <div class="card w-100 cardstyle cardstyle${i%4+1} w-100 mb-4">
                        <div class="card-body">
                            ${jobinfo}
                            ${jobremote}
                            <div class="row">
                                <div class="col-4">
                                    <p class="card-text" style="font-size: small;">Posted: ${timeSince(new Date(jobs[i]["date"]))} ago
                                    </p>
                                </div>
                                <div class="col-8 row justify-content-end pr-0">
                                <a href="/jobs/${jobs[i]['jobtitle'].replace(/\s+/g, '-').toLowerCase() + '-' + jobs[i]['_id']}" class="card-link btn btn-theme effect  mt-3 hero-start-learning ml-2 mt-2">Apply Now</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`
        }
        res.json(jobsHtml);
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

/**
 * Jobs Home Page
 */
router.get('/home', function (req, res, next) {
    req.session.returnTo = req.baseUrl+req.url;
    if (req.isAuthenticated()) {
        res.render('jobs/jobslandingpage', { moment: moment, success: '_', title: 'Express', email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
    }
    else {
        res.render('jobs/jobslandingpage', { moment: moment, success: '_', title: 'Express' });
    }
});

/*GET jobs admin panel page*/
router.get('/manage', isAdmin, function (req, res, next) {
    job.find({ 'deleted': { $ne: 'true' } }, null, { sort: { date: -1 } }, function (err, docs) {
        res.render('adminpanel/jobs', { email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications, docs: docs, moment: moment });
    });
});

//Update jobs admin panel info
router.post('/updateinfo', function (req, res) {
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


/**
 * Approve job post
 */
router.put('/approval', function (req, res) {
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

/**
 * Delete job post
 */
router.put('/remove', function (req, res) {
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


/* GET blog post page. */
router.get('/:joburl', function (req, res, next) {
    req.session.returnTo = req.baseUrl+req.url;
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
    req.session.returnTo = req.baseUrl+req.url;
    res.redirect('/signin');
}

function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.role == '2')
        return next();
    res.redirect('/');
}

module.exports = router;
