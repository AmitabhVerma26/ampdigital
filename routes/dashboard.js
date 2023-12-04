var express = require('express');
var router = express.Router();
var submission = require('../models/submission');
var lmsCourses = require('../models/courses');
var lmsModules = require('../models/modules');
var lmsTopics = require('../models/topics');
var lmsElements = require('../models/elements');
var moment = require('moment');
var aws = require('aws-sdk');
aws.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION
});

var awsSesMail = require('aws-ses-mail');
const { getusername, isLoggedIn } = require('../utils/common');

var sesMail = new awsSesMail();
var sesConfig = {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION
};
sesMail.setConfig(sesConfig);

/**
 * @swagger
 * /dashboard/courses:
 *   get:
 *     summary: Get the courses for the logged-in user
 *     tags:
 *       - User Course Dashboard
 *     responses:
 *       200:
 *         description: Successful response with the user's courses
 */
router.get('/', isLoggedIn, function (req, res) {
    req.session.returnTo = req.baseUrl+req.url;
    if (req.user.courses) {
        lmsCourses.find({ 'deleted': { $ne: 'true' }, "_id": { $in: req.user.courses } }, function (err, courses) {
            res.render('courses/dashboard', { title: 'Express', courses: courses, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
        });
    }
    else {
        res.render('courses/dashboard', { title: 'Express', courses: [], email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
    }
});

/**
 * @swagger
 * /dashboard/courses/{course}:
 *   get:
 *     summary: Get details(modules) about a specific course
 *     tags:
 *       - User Course Dashboard
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: course
 *         description: Course URL
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response with course details
 */
router.get('/:course', function (req, res) {
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
                                modules[i]['modulesVideoLength'] = (Math.round(temp / 60) + ' minutes ');
                            }
                            var sum = 0;
                            var moduleCnt;
                            for (var i = 0; i < jobQueries.length; i++) {
                                moduleCnt = jobQueries.length;
                                modules[i]['percentagecompleted'] = Math.round(( (listOfJobs2[i].length + listOfJobs3[i].length ) * 100 / listOfJobs[i].length));
                                sum = sum + parseInt(modules[i]['percentagecompleted']);
                            }
                            var avg = sum / countModules;
                            // res.json(modules);
                            res.render('courses/course_modules', { course: course, avg: avg, title: 'Express', modulesVideoLength: modulesVideoLength, modules: modules, moment: moment, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
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
        res.redirect('/signin');
    }
    /**/
});

/**
 * @swagger
 * /courses/{courseurl}/{moduleid}:
 *   get:
 *     summary: Get details about a specific module within a course
 *     tags:
 *       - User Course Dashboard
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: courseurl
 *         description: Course URL
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: moduleid
 *         description: Module ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response with module details
 */
router.get('/:courseurl/:moduleid', function (req, res) {
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;
    var module_id = req.params.moduleid;
    var modulesObj;
    var topicsObj;
    var elementsObj;
    lmsCourses.findOne({ 'course_url': req.params.courseurl }, function (err, courseobj) {
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

                                lmsModules.findOne({ course_id: courseid.toString(), module_order: order + 1, deleted: { $ne: "true" } }, function (err, moduleNext) {
                                    if (req.isAuthenticated()) {
                                        if (moduleNext) {
                                            res.render('courses/course_module', { moduleslist: moduleslist, forumdocs: [], moment: moment, courseurl: req.params.courseurl, moduleid: req.params.moduleid, nextmoduleid: moduleNext.module_id.toString(), title: 'Express', courseobj: courseobj, course: modulesObj, moment: moment, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, user: req.user });
                                        }
                                        else {
                                            res.render('courses/course_module', { moduleslist: moduleslist, forumdocs: [], moment: moment, courseurl: req.params.courseurl, moduleid: req.params.moduleid, nextmoduleid: null, title: 'Express', courseobj: courseobj, course: modulesObj, moment: moment, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, user: req.user });
                                        }
                                    }
                                    else {
                                        req.session.returnTo = req.baseUrl+req.url;
                                        res.redirect('/signin');
                                    }
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

module.exports = router;
