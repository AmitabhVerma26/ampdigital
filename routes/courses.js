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

router.get('/manage', isAdmin, function (req, res, next) {
    lmsCourses.find({ 'deleted': { $ne: 'true' } }, function (err, docs) {
        res.render('adminpanel/courses', { email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications, docs: docs, moment: moment });

    });
});

router.get('/:courseurl', function (req, res, next) {
    req.session.returnTo = req.path;
    lmsCourses.findOne({course_url: req.params.courseurl}, function (err, course) {
        if(!course){
            res.render('error');
        }
        else if(course.course_live && course.course_live == 'Live'){
            lmsBatches.find({ course_id: course._id, deleted: { $ne: true } }, function (err, batches) {
                testimonial.find({ deleted: false }, function (err, testimonials) {
                    lmsCourses.find({ 'deleted': { $ne: 'true' }, course_live: "Live"}, function (err, courses) {
                        if (req.isAuthenticated()) {
                            lmsUsers.count({ courses: course._id, email: req.user.email }, function (err, count) {
                                if (count > 0) {
                                    res.render('courses/'+req.params.courseurl, { path: req.path, course: course,  courses: courses, moment: moment, cls: req.query.payment && req.query.payment == "true" ? " d-none" : "", batches: batches, testimonials: testimonials, title: 'Express', 'enrolled': true, paymentemail: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, paymentname: getusername(req.user), notifications: req.user.notifications, paymentcouponcode: req.user.local.couponcode, paymentphone: req.user.local.phone, paymentuser_id: req.user._id.toString(), email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications, phone: req.user.phone, user_id: req.user._id, user: req.user });
                                }
                                else {
                                    res.render('courses/'+req.params.courseurl, { path: req.path, course: course,  courses: courses, moment: moment, cls: req.query.payment && req.query.payment == "true" ? "d-none" : "", batches: batches, testimonials: testimonials, title: 'Express', 'enrolled': false, paymentemail: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, paymentname: getusername(req.user), notifications: req.user.notifications, paymentcouponcode: req.user.local.couponcode, paymentphone: req.user.local.phone, paymentuser_id: req.user._id.toString(), email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications, phone: req.user.phone, user_id: req.user._id, user: req.user });
                                }
                            });
                        }
                        else {
                            res.render('courses/'+req.params.courseurl, { path: req.path, course: course, moment: moment, courses: courses, cls: req.query.payment && req.query.payment == "true" ? "d-none" : "", batches: batches, testimonials: testimonials, title: 'Express', 'enrolled': false, paymentcouponcode: '', paymentemail: '', paymentname: '', paymentphone: '', paymentuser_id: '', user: null });
                        }
                    });
                });
            })
        }
        else{
            res.render('error');
        }
    });
});

router.get('/topics/:courseurl', function (req, res, next) {
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;
    var courseObj;
    var modulesObj;
    var topicsObj;
    var elementsObj;
    lmsCourses.findOne({ 'course_url': "" + req.params.courseurl }, function (err, courseobj) {
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
                let html = `<div class="topicsaccordion" id="accordion">
                ${coursedata.map((module, moduleindex)=>{
                    return `<div class="card ">
                    <div class="card-header" id="heading-${moduleindex}">
                      <h5 class="mb-0">
                        <a role="button" data-toggle="collapse" href="#collapse-${moduleindex}" aria-expanded="false" aria-controls="collapse-${moduleindex}">
                        ${module[0].module_name}
                        </a>
                      </h5>
                    </div>
                    <div id="collapse-${moduleindex}" class="collapse" data-parent="#accordion" aria-labelledby="heading-${moduleindex}">
                      <div class="card-body">
                
                        <div id="accordion-${moduleindex}">
                        ${module[0].topics.map((topic, topicindex)=>{
                            return `<div class="">
                            <div class="card-header" id="heading-${moduleindex}-${topicindex}">
                              <h5 class="mb-0">
                                <a class="collapsed" role="button" data-toggle="collapse" href="#collapse-${moduleindex}-${topicindex}" aria-expanded="false" aria-controls="collapse-${moduleindex}-${topicindex}">
                                ${topic.topic_name}
                                </a>
                              </h5>
                            </div>
                            <div id="collapse-${moduleindex}-${topicindex}" class="collapse" data-parent="#accordion-${moduleindex}" aria-labelledby="heading-${moduleindex}-${topicindex}">
                            <div class="card-body">
                            <ul>
                                ${topic.elements.map((element, elementindex)=>{
                                    if(element.element_type=='video'){
                                        if(elementindex ==0 && topicindex==0){
                                            return `
                                            <li>
                                        <div class="left-content">
                                        <i class="fa fa-play-circle"></i>&nbsp;&nbsp;
                                        <h5><a href="#">${element.element_name}</a>
                                        </h5>
                                        </div>
                                        <div class="right-content">
                                        <a href="https://vimeo.com/${element.element_val.match(/([^\/]*)\/*$/)[1]}" class="popup-youtube light">
                                        <i class="fa fa-play-circle play-preview"></i>
                                        </a>
                                        </div>
                                    </li>`;
                                        }
                                        else{
                                            return `<li>
                                        <div class="left-content">
                                        <i class="fa fa-play-circle"></i>&nbsp;&nbsp;
                                        <h5><a href="#">${element.element_name}</a>
                                        </h5>
                                        </div>
                                        <div class="right-content">
                                       <i class="fa fa-lock" style="color: #DB4437!important"></i>
                                    </div>
                                    </li>`;
                                        }
                                    }
                                    else if(element.element_type=='quiz'){
                                        return `<li>
                                        <div class="left-content">
                                        <i class="fa fa-question-circle"></i>&nbsp;&nbsp;
                                        <h5><a href="#">${element.element_name}</a>
                                        </h5>
                                        </div>
                                        <div class="right-content">
                                       <i class="fa fa-lock" style="color: #DB4437!important"></i>
                                    </div>
                                    </li>`;
                                    }
                                    else if(element.element_type=='exercise'){
                                        return `<li>
                                        <div class="left-content">
                                        <i class="fa fa-file-text"></i>&nbsp;&nbsp;
                                        <h5><a href="#">${element.element_name}</a>
                                        </h5>
                                        </div>
                                        <div class="right-content">
                                       <i class="fa fa-lock" style="color: #DB4437!important"></i>
                                    </div>
                                    </li>`;
                                    }
                                }).join("")}
                            </ul>
                            </div>
                            </div>
                          </div>`
                        }).join("")}
                        </div>      
                      
                      </div>
                    </div>`
                }).join("")}
                </div>
              </div>`;
                let html2 = `
                <div class="accordion" id="accordionExample">
                        ${coursedata.map((module, moduleindex)=>{
                            return `<div class="card">
                            <div class="card-header" id="heading${moduleindex}">
                               <h5 class="mb-0 collapsed moduleheader" data-toggle="collapse" data-target="#collapse${moduleindex}" aria-expanded="false" aria-controls="collapse${moduleindex}">
                                  ${module[0].module_name}
                               </h5>
                               <hr>
                            </div>
                            <div id="collapse${moduleindex}" class="collapse ${moduleindex == 0 ? 'show' : ''}" aria-labelledby="heading${moduleindex}" data-parent="#accordionExample" style="">
                               <div class="card-body">
                               <div class="accordion" id="accordionExample${moduleindex}">
                               ${module[0].topics.map((topic, topicindex)=>{
                                   return  `
                                   <div class="card-header card-header-topic" id="heading${moduleindex}${topicindex}">
                                        <h5 class="mb-0 collapsed topicheader ${topicindex == 0 ? 'moduletopic1': ''}" data-toggle="collapse" data-target="#collapse${moduleindex}${topicindex}" aria-expanded="false" aria-controls="collapse${moduleindex}${topicindex}">
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
                                                    <i class="fa fa-play-circle"></i>
                                                    <h5><a href="#">${element.element_name}</a>
                                                    </h5>
                                                    </div>
                                                    <div class="right-content">
                                                    <a href="https://vimeo.com/${element.element_val.match(/([^\/]*)\/*$/)[1]}" class="popup-youtube light">
                                                    <i class="fa fa-play-circle play-preview"></i>
                                                    </a>
                                                    </div>
                                                </li>`;
                                                    }
                                                    else{
                                                        return `<li>
                                                    <div class="left-content">
                                                    <i class="fa fa-play-circle"></i>
                                                    <h5><a href="#">${element.element_name}</a>
                                                    </h5>
                                                    </div>
                                                    <div class="right-content">
                                                   <i class="fa fa-lock" style="color: #DB4437!important"></i>
                                                </div>
                                                </li>`;
                                                    }
                                                }
                                                else if(element.element_type=='quiz'){
                                                    return `<li>
                                                    <div class="left-content">
                                                    <i class="fa fa-question-circle"></i>
                                                    <h5><a href="#">${element.element_name}</a>
                                                    </h5>
                                                    </div>
                                                    <div class="right-content">
                                                   <i class="fa fa-lock" style="color: #DB4437!important"></i>
                                                </div>
                                                </li>`;
                                                }
                                                else if(element.element_type=='exercise'){
                                                    return `<li>
                                                    <div class="left-content">
                                                    <i class="fa fa-file-text"></i>
                                                    <h5><a href="#">${element.element_name}</a>
                                                    </h5>
                                                    </div>
                                                    <div class="right-content">
                                                   <i class="fa fa-lock" style="color: #DB4437!important"></i>
                                                </div>
                                                </li>`;
                                                }
                                            }).join("")}
                                        </ul>
                                        </div>
                                    </div>
                                    ${(module[0].topics.length+1) == topicindex ? '' : '<hr>'}
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

router.post('/updateinfo', function (req, res) {
    let updateQuery = {};
    updateQuery[req.body.name] = req.body.value
    lmsCourses.update(
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

router.post('/uploadimage', function (req, res, next) {
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

/*POST new module*/
router.post('/modules', function (req, res, next) {
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

router.post('/modules/uploadimage', function (req, res, next) {
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

// Update FAQ Question
router.post('/modules/updateinfo', function (req, res) {
    let updateQuery = {};
    updateQuery[req.body.name] = req.body.value
    lmsModules.update(
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

router.get('/modules/forum/:course', function (req, res, next) {
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

/*REMOVE a module*/
router.delete('/modules/removemodule', function (req, res) {
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

/*GET modules page for a course*/
router.get('/:id/modules/manage', isAdmin, function (req, res, next) {
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;
    lmsCourses.find({ _id: safeObjectId(req.params.id) }, function (err, course) {
        lmsModules.find({ course_id: req.params.id, deleted: { $ne: "true" } }, function (err, modules) {
            res.render('adminpanel/modules', { course: course, modules: modules, moment: moment, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
        });
    });
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

/*GET topics page for a module*/
router.get('/topics/:courseid/:moduleid/manage', isAdmin, function (req, res, next) {
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;
    lmsCourses.find({ _id: safeObjectId(req.params.courseid) }, function (err, course) {
        lmsModules.find({ _id: safeObjectId(req.params.moduleid) }, function (err, module) {
            lmsTopics.find({ module_id: req.params.moduleid, deleted: { $ne: "true" } }, null, { sort: { order: 1 } }, function (err, topics) {
                res.render('adminpanel/topics', { course: course, module: module, topics: topics, moment: moment, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
            });
        });
    });
});

/*POST new topic*/
router.post('/topics', function (req, res, next) {
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

/*REMOVE a topic*/
router.delete('/topics/removetopic', function (req, res) {
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

// Update FAQ Question
router.post('/topics/updateinfo', function (req, res) {
    let updateQuery = {};
    updateQuery[req.body.name] = req.body.value
    lmsTopics.update(
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

/*GET elements page for a topic*/
router.get('/elements/:courseid/:moduleid/:topicid/manage', isAdmin, function (req, res, next) {
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;
    lmsCourses.find({ _id: safeObjectId(req.params.courseid) }, function (err, course) {
        lmsModules.find({ _id: safeObjectId(req.params.moduleid) }, function (err, module) {
            lmsTopics.find({ _id: safeObjectId(req.params.topicid) }, function (err, topic) {
                lmsElements.find({ element_taskid: safeObjectId(req.params.topicid), deleted: { $ne: "true" } }, function (err, elements) {
                    res.render('adminpanel/elements', { course: course, module: module, topic: topic, elements: elements, moment: moment, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
                });
            });
        });
    });
});

/*POST new element*/
router.post('/elements', function (req, res, next) {
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

// Update FAQ Question
router.post('/elements/updateinfo', function (req, res) {
    let updateQuery = {};
    updateQuery[req.body.name] = req.body.value
    lmsElements.update(
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

/*REMOVE a video or quiz*/
router.delete('/elements/removeelement', function (req, res) {
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

/*GET courses page*/
router.get('/faqs/manage/:courseid', isAdmin, function (req, res, next) {
    faqModel.find({ 'deleted': { $ne: 'true' }, 'course_id': req.params.courseid }, function (err, faqdocs) {
        res.render('adminpanel/faq', { email: req.user.email, courseid: req.params.courseid, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications, faqdocs: faqdocs, moment: moment });
    });
});

/* GET courses page. */
router.get('/faqs/:course_id', function (req, res, next) {
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
            <div class="card-header" id="headingfaq${i}">
                <h4 class="mb-0 ${i!==0 ? 'collapsed' : 'collapsed'} categoryheading" data-toggle="collapse"
                    data-target="#collapsefaq${i}" aria-expanded="${i==0?'false':'false'}"
                    aria-controls="collapse${i}">
                    ${faqdocs[i]['_id'].category}
                </h4>
                <hr class="mx-5">
            </div>
            <div id="collapsefaq${i}" class="collapse ${i==0?'':''}"
                aria-labelledby="headingfaq${i}" data-parent="#accordionExample">
                <div class="accordion" id="accordionExamplefaq${i}">
                    
                  ${Object.keys(faqdocs[i].question).map(function (j) {
                return `
                <div class="faqcard">
                    <div class="card-header" id="headingfaq${i}-${j}">
                        <h4 class="mb-0" data-toggle="collapse"
                            data-target="#collapsefaq${i}-${j}" aria-expanded="${j==0?'true':'true'}"
                            aria-controls="collapse${i}-${j}">
                            Q. ${faqdocs[i].question[j]}
                        </h4>
                    </div>

                    <div id="collapsefaq${i}-${j}" class="collapse ${j==0?'show':'show'}"
                        aria-labelledby="heading${i}-${j}"
                        data-parent="#accordionExamplefaq">
                        <div class="card-body ml-4">
                            <p class="mb-0">
                            ${faqdocs[i].answer[j]}
                            </p>
                        </div>
                    </div>
                    ${(j+1) == faqdocs[i].question.length ? '' : `<hr class="faqcard-hr ml-5">`}
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

// Create a new faq
router.post('/faqs/addfaq', function (req, res, next) {
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
            res.redirect('/courses/faqs/manage/'+req.body.courseid);
        }
    });
});

// Update FAQ Question
router.post('/faqs/updateinfo', function (req, res) {
    let updateQuery = {};
    updateQuery[req.body.name] = req.body.value
    faqModel.update(
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

// Delete a FAQ
router.delete('/faqs/removefaq', function (req, res, next) {
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


// router.get('/courses/google-ads-certification-course', function (req, res, next) {
//     req.session.returnTo = '/courses/google-ads-certification-course';
//     lmsCourses.findOne({course_name: "Google Ads Certification Program"}, function (err, course) {
//         lmsBatches.find({ course_id: "5efdc00ef1f2a30014a1fbef", deleted: { $ne: true } }, function (err, batches) {
//             testimonial.find({ deleted: false }, function (err, testimonials) {
//                 if (req.isAuthenticated()) {
//                     lmsUsers.count({ courses: "5efdc00ef1f2a30014a1fbef", email: req.user.email }, function (err, count) {
//                         req.session.returnTo = '/courses/google-ads-certification-course';
//                         if (count > 0) {
//                             res.render('googleadscertificationprogram', { course: course, moment: moment, cls: req.query.payment && req.query.payment == "true" ? " d-none" : "", batches: batches, testimonials: testimonials, title: 'Express', 'enrolled': true, digitalmarketingcoursemodules: digitalmarketingcoursemodules, paymentemail: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, paymentname: getusername(req.user), notifications: req.user.notifications, paymentcouponcode: req.user.local.couponcode, paymentphone: req.user.local.phone, paymentuser_id: req.user._id.toString(), email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications, phone: req.user.phone, user_id: req.user._id, user: req.user });
//                         }
//                         else {
//                             res.render('googleadscertificationprogram', { course: course, moment: moment, cls: req.query.payment && req.query.payment == "true" ? "d-none" : "", batches: batches, testimonials: testimonials, title: 'Express', 'enrolled': false, digitalmarketingcoursemodules: digitalmarketingcoursemodules, paymentemail: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, paymentname: getusername(req.user), notifications: req.user.notifications, paymentcouponcode: req.user.local.couponcode, paymentphone: req.user.local.phone, paymentuser_id: req.user._id.toString(), email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications, phone: req.user.phone, user_id: req.user._id, user: req.user });
//                         }
//                     });
//                 }
//                 else {
//                     req.session.returnTo = '/google-ads-certification-course';
//                     res.render('googleadscertificationprogram', {course: course, moment: moment, cls: req.query.payment && req.query.payment == "true" ? "d-none" : "", batches: batches, testimonials: testimonials, title: 'Express', 'enrolled': false, digitalmarketingcoursemodules: digitalmarketingcoursemodules, paymentcouponcode: '', paymentemail: '', paymentname: '', paymentphone: '', paymentuser_id: '', user: null });
//                 }
//             });
//         })
//     });
// });

// router.get('/seo-workshop', function (req, res, next) {
//     req.session.returnTo = '/courses/seo-workshop';
//     // res.redirect("/")
//     lmsCourses.findOne({course_name: "SEO Workshop"}, function (err, course) {
//         lmsBatches.find({ course_id: "5f62ecff258cf800145b71e4", deleted: { $ne: true } }, function (err, batches) {
//             testimonial.find({ deleted: false }, function (err, testimonials) {
//                 if (req.isAuthenticated()) {
//                     lmsUsers.count({ courses: "5f62ecff258cf800145b71e4", email: req.user.email }, function (err, count) {
//                         if (count > 0) {
//                             res.render('seoworkshop', { course: course, moment: moment, cls: req.query.payment && req.query.payment == "true" ? " d-none" : "", batches: batches, testimonials: testimonials, title: 'Express', 'enrolled': true, digitalmarketingcoursemodules: digitalmarketingcoursemodules, paymentemail: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, paymentname: getusername(req.user), notifications: req.user.notifications, paymentcouponcode: req.user.local.couponcode, paymentphone: req.user.local.phone, paymentuser_id: req.user._id.toString(), email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications, phone: req.user.phone, user_id: req.user._id, user: req.user });
//                         }
//                         else {
//                             res.render('seoworkshop', { course: course, moment: moment, cls: req.query.payment && req.query.payment == "true" ? "d-none" : "", batches: batches, testimonials: testimonials, title: 'Express', 'enrolled': false, digitalmarketingcoursemodules: digitalmarketingcoursemodules, paymentemail: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, paymentname: getusername(req.user), notifications: req.user.notifications, paymentcouponcode: req.user.local.couponcode, paymentphone: req.user.local.phone, paymentuser_id: req.user._id.toString(), email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications, phone: req.user.phone, user_id: req.user._id, user: req.user });
//                         }
//                     });
//                 }
//                 else {
//                     res.render('seoworkshop', {course: course, moment: moment, cls: req.query.payment && req.query.payment == "true" ? "d-none" : "", batches: batches, testimonials: testimonials, title: 'Express', 'enrolled': false, digitalmarketingcoursemodules: digitalmarketingcoursemodules, paymentcouponcode: '', paymentemail: '', paymentname: '', paymentphone: '', paymentuser_id: '', user: null });
//                 }
//             });
//         })
//     });
// });




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
