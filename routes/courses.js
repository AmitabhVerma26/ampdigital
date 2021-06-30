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
var getUserName = require('../utils/getUserName');
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

/**
 * Digital Marketing Course Marketing Page
 */
router.get('/digital-marketing-course', myLogger, function (req, res, next) {
    req.session.returnTo = req.originalUrl;
    lmsCourses.findOne({course_name: "Digital Marketing Course"}, function (err, course) {
        lmsBatches.find({ course_id: "5ba67703bda6d500142e2d15", deleted: { $ne: true } }, function (err, batches) {
            testimonial.find({ deleted: false }, function (err, testimonials) {
                lmsCourses.find({ 'deleted': { $ne: 'true' }, course_live: "Live"}, function (err, courses) {
                    if (req.isAuthenticated()) {
                        lmsUsers.count({ courses: "5ba67703bda6d500142e2d15", email: req.user.email }, function (err, count) {
                            if (count > 0) {
                                res.render('webpresence', { path: req.originalUrl, course: course,  courses: courses, moment: moment, cls: req.query.payment && req.query.payment == "true" ? " d-none" : "", batches: batches, testimonials: testimonials, title: 'Express', 'enrolled': true, digitalmarketingcoursemodules: digitalmarketingcoursemodules, paymentemail: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, paymentname: getUserName(req.user), notifications: req.user.notifications, paymentcouponcode: req.user.local.couponcode, paymentphone: req.user.local.phone, paymentuser_id: req.user._id.toString(), email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getUserName(req.user), notifications: req.user.notifications, phone: req.user.phone, user_id: req.user._id, user: req.user });
                            }
                            else {
                                res.render('webpresence', { path: req.originalUrl, course: course,  courses: courses, moment: moment, cls: req.query.payment && req.query.payment == "true" ? "d-none" : "", batches: batches, testimonials: testimonials, title: 'Express', 'enrolled': false, digitalmarketingcoursemodules: digitalmarketingcoursemodules, paymentemail: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, paymentname: getUserName(req.user), notifications: req.user.notifications, paymentcouponcode: req.user.local.couponcode, paymentphone: req.user.local.phone, paymentuser_id: req.user._id.toString(), email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getUserName(req.user), notifications: req.user.notifications, phone: req.user.phone, user_id: req.user._id, user: req.user });
                            }
                        });
                    }
                    else {
                        res.render('webpresence', { path: req.originalUrl, course: course, moment: moment, courses: courses, cls: req.query.payment && req.query.payment == "true" ? "d-none" : "", batches: batches, testimonials: testimonials, title: 'Express', 'enrolled': false, digitalmarketingcoursemodules: digitalmarketingcoursemodules, paymentcouponcode: '', paymentemail: '', paymentname: '', paymentphone: '', paymentuser_id: '', user: null });
                    }
                });
            });
        })
    });
});

/**
 * Advanced Google Analytics & Blogging Marketing Page
 */
router.get('/advanced-google-analytics-and-blogging', myLogger, function (req, res, next) {
    req.session.returnTo = req.originalUrl;
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
                                res.render('googleanalytics', { path: req.originalUrl, course: course,  courses: courses, moment: moment, cls: req.query.payment && req.query.payment == "true" ? " d-none" : "", batches: batches, testimonials: testimonials, title: 'Express', 'enrolled': true, digitalmarketingcoursemodules: digitalmarketingcoursemodules, paymentemail: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, paymentname: getUserName(req.user), notifications: req.user.notifications, paymentcouponcode: req.user.local.couponcode, paymentphone: req.user.local.phone, paymentuser_id: req.user._id.toString(), email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getUserName(req.user), notifications: req.user.notifications, phone: req.user.phone, user_id: req.user._id, user: req.user });
                            }
                            else {
                                res.render('googleanalytics', { path: req.originalUrl, course: course,  courses: courses, moment: moment, cls: req.query.payment && req.query.payment == "true" ? "d-none" : "", batches: batches, testimonials: testimonials, title: 'Express', 'enrolled': false, digitalmarketingcoursemodules: digitalmarketingcoursemodules, paymentemail: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, paymentname: getUserName(req.user), notifications: req.user.notifications, paymentcouponcode: req.user.local.couponcode, paymentphone: req.user.local.phone, paymentuser_id: req.user._id.toString(), email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getUserName(req.user), notifications: req.user.notifications, phone: req.user.phone, user_id: req.user._id, user: req.user });
                            }
                        });
                    }
                    else {
                        res.render('googleanalytics', { path: req.originalUrl, course: course, moment: moment, courses: courses, cls: req.query.payment && req.query.payment == "true" ? "d-none" : "", batches: batches, testimonials: testimonials, title: 'Express', 'enrolled': false, digitalmarketingcoursemodules: digitalmarketingcoursemodules, paymentcouponcode: '', paymentemail: '', paymentname: '', paymentphone: '', paymentuser_id: '', user: null });
                    }
                });
            });
        })
    });
});

/**
 * Content Marketing Marketing Page
 */
router.get('/content-marketing', myLogger, function (req, res, next) {
    req.session.returnTo = req.originalUrl;
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;
    lmsCourses.findOne({_id: safeObjectId("6057fde1af237d00148162de")}, function (err, course) {
        lmsBatches.find({ course_id: "6057fde1af237d00148162de", deleted: { $ne: true } }, function (err, batches) {
            testimonial.find({ deleted: false }, function (err, testimonials) {
                lmsCourses.find({ 'deleted': { $ne: 'true' }, course_live: "Live"}, function (err, courses) {
                    if (req.isAuthenticated()) {
                        lmsUsers.count({ courses: "6057fde1af237d00148162de", email: req.user.email }, function (err, count) {
                            if (count > 0) {
                                res.render('contentmarketing', { path: req.originalUrl, course: course,  courses: courses, moment: moment, cls: req.query.payment && req.query.payment == "true" ? " d-none" : "", batches: batches, testimonials: testimonials, title: 'Express', 'enrolled': true, digitalmarketingcoursemodules: digitalmarketingcoursemodules, paymentemail: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, paymentname: getUserName(req.user), notifications: req.user.notifications, paymentcouponcode: req.user.local.couponcode, paymentphone: req.user.local.phone, paymentuser_id: req.user._id.toString(), email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getUserName(req.user), notifications: req.user.notifications, phone: req.user.phone, user_id: req.user._id, user: req.user });
                            }
                            else {
                                res.render('contentmarketing', { path: req.originalUrl, course: course,  courses: courses, moment: moment, cls: req.query.payment && req.query.payment == "true" ? "d-none" : "", batches: batches, testimonials: testimonials, title: 'Express', 'enrolled': false, digitalmarketingcoursemodules: digitalmarketingcoursemodules, paymentemail: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, paymentname: getUserName(req.user), notifications: req.user.notifications, paymentcouponcode: req.user.local.couponcode, paymentphone: req.user.local.phone, paymentuser_id: req.user._id.toString(), email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getUserName(req.user), notifications: req.user.notifications, phone: req.user.phone, user_id: req.user._id, user: req.user });
                            }
                        });
                    }
                    else {
                        res.render('contentmarketing', { path: req.originalUrl, course: course, moment: moment, courses: courses, cls: req.query.payment && req.query.payment == "true" ? "d-none" : "", batches: batches, testimonials: testimonials, title: 'Express', 'enrolled': false, digitalmarketingcoursemodules: digitalmarketingcoursemodules, paymentcouponcode: '', paymentemail: '', paymentname: '', paymentphone: '', paymentuser_id: '', user: null });
                    }
                });
            });
        })
    });
});


/**
 * Advanced SEO Marketing Page
 */
router.get('/advanced-seo', myLogger, function (req, res, next) {
    req.session.returnTo = req.originalUrl;
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;
    lmsCourses.findOne({_id: safeObjectId("60b870e698c8130014a0d876")}, function (err, course) {
        lmsBatches.find({ course_id: "60b870e698c8130014a0d876", deleted: { $ne: true } }, function (err, batches) {
            testimonial.find({ deleted: false }, function (err, testimonials) {
                lmsCourses.find({ 'deleted': { $ne: 'true' }, course_live: "Live"}, function (err, courses) {
                    if (req.isAuthenticated()) {
                        lmsUsers.count({ courses: "60b870e698c8130014a0d876", email: req.user.email }, function (err, count) {
                            if (count > 0) {
                                res.render('advancedseo', { path: req.originalUrl, course: course,  courses: courses, moment: moment, cls: req.query.payment && req.query.payment == "true" ? " d-none" : "", batches: batches, testimonials: testimonials, title: 'Express', 'enrolled': true, digitalmarketingcoursemodules: digitalmarketingcoursemodules, paymentemail: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, paymentname: getUserName(req.user), notifications: req.user.notifications, paymentcouponcode: req.user.local.couponcode, paymentphone: req.user.local.phone, paymentuser_id: req.user._id.toString(), email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getUserName(req.user), notifications: req.user.notifications, phone: req.user.phone, user_id: req.user._id, user: req.user });
                            }
                            else {
                                res.render('advancedseo', { path: req.originalUrl, course: course,  courses: courses, moment: moment, cls: req.query.payment && req.query.payment == "true" ? "d-none" : "", batches: batches, testimonials: testimonials, title: 'Express', 'enrolled': false, digitalmarketingcoursemodules: digitalmarketingcoursemodules, paymentemail: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, paymentname: getUserName(req.user), notifications: req.user.notifications, paymentcouponcode: req.user.local.couponcode, paymentphone: req.user.local.phone, paymentuser_id: req.user._id.toString(), email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getUserName(req.user), notifications: req.user.notifications, phone: req.user.phone, user_id: req.user._id, user: req.user });
                            }
                        });
                    }
                    else {
                        res.render('advancedseo', { path: req.originalUrl, course: course, moment: moment, courses: courses, cls: req.query.payment && req.query.payment == "true" ? "d-none" : "", batches: batches, testimonials: testimonials, title: 'Express', 'enrolled': false, digitalmarketingcoursemodules: digitalmarketingcoursemodules, paymentcouponcode: '', paymentemail: '', paymentname: '', paymentphone: '', paymentuser_id: '', user: null });
                    }
                });
            });
        })
    });
});


/**
 * SEO Workshop Marketing Page
 */
router.get('/seo-workshop', myLogger, function (req, res, next) {
    req.session.returnTo = '/courses/seo-workshop';
    // res.redirect("/")
    lmsCourses.findOne({course_name: "SEO Workshop"}, function (err, course) {
        lmsBatches.find({ course_id: "5f62ecff258cf800145b71e4", deleted: { $ne: true } }, function (err, batches) {
            testimonial.find({ deleted: false }, function (err, testimonials) {
                if (req.isAuthenticated()) {
                    lmsUsers.count({ courses: "5f62ecff258cf800145b71e4", email: req.user.email }, function (err, count) {
                        if (count > 0) {
                            res.render('seoworkshop', { course: course, moment: moment, cls: req.query.payment && req.query.payment == "true" ? " d-none" : "", batches: batches, testimonials: testimonials, title: 'Express', 'enrolled': true, digitalmarketingcoursemodules: digitalmarketingcoursemodules, paymentemail: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, paymentname: getUserName(req.user), notifications: req.user.notifications, paymentcouponcode: req.user.local.couponcode, paymentphone: req.user.local.phone, paymentuser_id: req.user._id.toString(), email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getUserName(req.user), notifications: req.user.notifications, phone: req.user.phone, user_id: req.user._id, user: req.user });
                        }
                        else {
                            res.render('seoworkshop', { course: course, moment: moment, cls: req.query.payment && req.query.payment == "true" ? "d-none" : "", batches: batches, testimonials: testimonials, title: 'Express', 'enrolled': false, digitalmarketingcoursemodules: digitalmarketingcoursemodules, paymentemail: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, paymentname: getUserName(req.user), notifications: req.user.notifications, paymentcouponcode: req.user.local.couponcode, paymentphone: req.user.local.phone, paymentuser_id: req.user._id.toString(), email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getUserName(req.user), notifications: req.user.notifications, phone: req.user.phone, user_id: req.user._id, user: req.user });
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

/**
 * Google Ads Certification Course Marketing Page
 */
router.get('/google-ads-certification-course', myLogger, function (req, res, next) {
    res.redirect("/");
    return;
    req.session.returnTo = '/courses/google-ads-certification-course';
    lmsCourses.findOne({course_name: "Google Ads Certification Program"}, function (err, course) {
        lmsBatches.find({ course_id: "5efdc00ef1f2a30014a1fbef", deleted: { $ne: true } }, function (err, batches) {
            testimonial.find({ deleted: false }, function (err, testimonials) {
                if (req.isAuthenticated()) {
                    lmsUsers.count({ courses: "5efdc00ef1f2a30014a1fbef", email: req.user.email }, function (err, count) {
                        req.session.returnTo = '/courses/google-ads-certification-course';
                        if (count > 0) {
                            res.render('googleadscertificationprogram', { course: course, moment: moment, cls: req.query.payment && req.query.payment == "true" ? " d-none" : "", batches: batches, testimonials: testimonials, title: 'Express', 'enrolled': true, digitalmarketingcoursemodules: digitalmarketingcoursemodules, paymentemail: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, paymentname: getUserName(req.user), notifications: req.user.notifications, paymentcouponcode: req.user.local.couponcode, paymentphone: req.user.local.phone, paymentuser_id: req.user._id.toString(), email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getUserName(req.user), notifications: req.user.notifications, phone: req.user.phone, user_id: req.user._id, user: req.user });
                        }
                        else {
                            res.render('googleadscertificationprogram', { course: course, moment: moment, cls: req.query.payment && req.query.payment == "true" ? "d-none" : "", batches: batches, testimonials: testimonials, title: 'Express', 'enrolled': false, digitalmarketingcoursemodules: digitalmarketingcoursemodules, paymentemail: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, paymentname: getUserName(req.user), notifications: req.user.notifications, paymentcouponcode: req.user.local.couponcode, paymentphone: req.user.local.phone, paymentuser_id: req.user._id.toString(), email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getUserName(req.user), notifications: req.user.notifications, phone: req.user.phone, user_id: req.user._id, user: req.user });
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

router.post('/requestpayment', function (req, res, next) {
    Insta.setKeys('test_536f67479790c3dc2f0377b53e6', 'test_b64fb4387871960d950b697f172');
    // Insta.setKeys('2bc92a4b5acca5ed8665987bb6679f97', 'a895b4279506092fb9afe1fa5c938e37');

    const data = new Insta.PaymentData();
    Insta.isSandboxMode(true);

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
                                                        name: getUserName(req.user), notifications: req.user.notifications + " " + req.user.local.lastname,
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
                                                                    return res.redirect('/courses/thankyoupage?course_id=' + course._id + '&course_name=' + course.course_name + '&payment_id=' + req.query.payment_id + '&userid=' + req.query.user_id);
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
                                                            return res.redirect('/courses/thankyoupage?course_id=' + course._id + '&course_name=' + course.course_name + '&payment_id=' + req.query.payment_id + '&userid=' + req.query.user_id);
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

        res.render('paymentcomplete', { title: 'Express', moment: moment, batchdate: batchdate, course_name: req.query.course_name, payment_id: req.query.payment_id, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getUserName(req.user), notifications: req.user.notifications });
    }
    else {
        res.render('paymentcomplete', { title: 'Express', moment: moment, course_name: '', payment_id: '' });
    }
});


function myLogger(req, res, next) {
    next();
  }

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    req.session.returnTo = req.originalUrl;
    res.redirect('/auth');
}

function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.role == '2')
        return next();
    res.redirect('/');
}

module.exports = router;
