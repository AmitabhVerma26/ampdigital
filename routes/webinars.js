var express = require('express');
var router = express.Router();
var webinar = require('../models/webinar');
var webinaree = require('../models/webinaree');
var moment = require('moment');
var aws = require('aws-sdk');
const dotenv = require('dotenv');
dotenv.config();
aws.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION
});
var Sendy = require('sendy-api');


var awsSesMail = require('aws-ses-mail');
const { isAdmin, getusername } = require('../utils/common');
const { addWebinareeHTML, generateWebinarCertificateHTML } = require('../utils/html_templates');

var sesMail = new awsSesMail();
var sesConfig = {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION
};
sesMail.setConfig(sesConfig);

/**
 * @swagger
 * /:
 *   get:
 *     summary: Render the page to show all webinars
 *     tags: [Webinar]
 *     responses:
 *       200:
 *         description: Successfully rendered the page
 *       302:
 *         description: Redirect to login page if not authenticated
 *       500:
 *         description: Internal server error
 */
router.get('/', function (req, res) {
    try {
        req.session.returnTo = req.baseUrl + req.path;

        webinar.find({ deleted: { $ne: "true" } }, null, { sort: { date: -1 } }, function (err, webinars) {
            if (req.isAuthenticated()) {
                res.render('webinars/webinars', {
                    title: 'Express',
                    active: "all",
                    webinars: webinars,
                    moment: moment,
                    email: req.user.email,
                    registered: req.user.courses.length > 0,
                    recruiter: req.user.role && req.user.role === '3',
                    name: getusername(req.user),
                    notifications: req.user.notifications
                });
            } else {
                res.render('webinars/webinars', { title: 'Express', active: "all", webinars: webinars, moment: moment });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});


/**
 * @swagger
 * /accomplishments/{webinarid}/{userid}:
 *   get:
 *     summary: Render the page for user's webinar accomplishments
 *     tags: [Webinar]
 *     parameters:
 *       - in: path
 *         name: webinarid
 *         required: true
 *         description: ID of the webinar
 *         schema:
 *           type: string
 *       - in: path
 *         name: userid
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully rendered the page
 *         content:
 *           text/html:
 *             example: '<html>...</html>'
 *       302:
 *         description: Redirect to login page if not authenticated
 *       500:
 *         description: Internal server error
 */
router.get('/accomplishments/:webinarid/:userid', function (req, res) {
    try {
        req.session.returnTo = req.baseUrl + req.url;

        webinaree.findOne({ _id: req.params.userid }, function (err, user) {
            if (user) {
                webinar.findOne({ 'deleted': { $ne: 'true' }, "_id": req.params.webinarid }, function (err, webinarDoc) {
                    if (webinarDoc) {
                        if (req.isAuthenticated()) {
                            res.render('webinars/webinaraccomplishments', {
                                moment: moment,
                                verification_url: "www.ampdigital.co" + req.originalUrl,
                                certificateuser: user,
                                webinar: webinarDoc,
                                success: '_',
                                title: 'Express',
                                email: req.user.email,
                                registered: req.user.courses.length > 0,
                                recruiter: req.user.role && req.user.role === '3',
                                name: getusername(req.user),
                                notifications: req.user.notifications
                            });
                        } else {
                            res.render('webinars/webinaraccomplishments', {
                                moment: moment,
                                verification_url: "www.ampdigital.co" + req.originalUrl,
                                certificateuser: user,
                                title: 'Express',
                                webinar: webinarDoc
                            });
                        }
                    }
                });
            } else {
                res.status(500).json({ error: -1 });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});


/**
 * @swagger
 * /webinars/certificate:
 *   put:
 *     summary: Update user's webinar certificates and send a certificate email
 *     tags: [Webinar]
 *     parameters:
 *       - in: body
 *         name: certificateDetails
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               description: The ID of the user
 *             courses:
 *               type: string
 *               description: Comma-separated string of course names
 *             email:
 *               type: string
 *               description: Email address of the user
 *     responses:
 *       200:
 *         description: Successfully updated certificates and sent certificate email
 *         content:
 *           application/json:
 *             example: 1
 *       500:
 *         description: Internal server error
 */
router.put('/certificate', function (req, res) {
    try {
        var arr = [];

        if (req.body.length > 1) {
            var temp = req.body.courses.split(',');
            for (var i = 0; i < temp.length; i++) {
                arr.push(temp[i]);
            }
        } else if (req.body.length === 1) {
            arr.push(req.body.courses);
        } else if (req.body.length === 0) {
            arr = [];
        }

        webinaree.update(
            { _id: req.body.id },
            { $set: { certificates: arr } },
            function (err) {
                if (err) {
                    res.status(500).json({ error: -1 });
                } else {
                    var awsSesMail = require('aws-ses-mail');
                    var sesMail = new awsSesMail();
                    var sesConfig = {
                        accessKeyId: process.env.ACCESS_KEY_ID,
                        secretAccessKey: process.env.SECRET_ACCESS_KEY,
                        region: process.env.REGION
                    };
                    sesMail.setConfig(sesConfig);

                    var html = generateWebinarCertificateHTML(req.body);
                    var options = {
                        from: 'ampdigital.co <amitabh@ads4growth.com>',
                        to: req.body.email,
                        subject: 'Congratulations, Your Workshop Certificate is Ready!',
                        content: '<html><head></head><body>' + html + '</body></html>'
                    };

                    sesMail.sendEmail(options, function (err) {
                        if (err) {
                            console.log(err);
                            res.status(500).json({ error: -1 });
                        } else {
                            res.json(1);
                        }
                    });
                }
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: -1 });
    }
});

/**
 * @swagger
 * /webinars/upcoming:
 *   get:
 *     summary: Render the page to show upcoming webinars
 *     tags: [Webinar]
 *     responses:
 *       200:
 *         description: Successfully rendered the page
 *       302:
 *         description: Redirect to login page if not authenticated
 *       500:
 *         description: Internal server error
 */
router.get('/upcoming', function (req, res) {
    try {
        req.session.returnTo = req.baseUrl + req.path;

        webinar.find({ deleted: { $ne: "true" }, date: { $gte: new Date() } }, null, { sort: { date: -1 } }, function (err, webinars) {
            if (req.isAuthenticated()) {
                res.render('webinars/webinars', {
                    title: 'Express',
                    active: "upcoming",
                    webinars: webinars,
                    moment: moment,
                    email: req.user.email,
                    registered: req.user.courses.length > 0,
                    recruiter: req.user.role && req.user.role === '3',
                    name: getusername(req.user),
                    notifications: req.user.notifications
                });
            } else {
                res.render('webinars/webinars', { title: 'Express', active: "upcoming", webinars: webinars, moment: moment });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /webinars/concluded:
 *   get:
 *     summary: Render the page to show concluded webinars
 *     tags: [Webinar]
 *     responses:
 *       200:
 *         description: Successfully rendered the page
 *       500:
 *         description: Internal server error
 */
router.get('/concluded', function (req, res) {
    try {
        req.session.returnTo = req.baseUrl + req.path;

        webinar.find({ deleted: { $ne: "true" }, date: { $lte: new Date() } }, null, { sort: { date: -1 } }, function (err, webinars) {
            if (req.isAuthenticated()) {
                res.render('webinars/webinars', {
                    title: 'Express',
                    active: "concluded",
                    webinars: webinars,
                    moment: moment,
                    email: req.user.email,
                    registered: req.user.courses.length > 0,
                    recruiter: req.user.role && req.user.role === '3',
                    name: getusername(req.user),
                    notifications: req.user.notifications
                });
            } else {
                res.render('webinars/webinars', { title: 'Express', active: "concluded", webinars: webinars, moment: moment });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /webinars/thankyoupage/{webinarurl}:
 *   get:
 *     summary: Render the thank-you page after webinar registration
 *     tags: [Webinar]
 *     parameters:
 *       - in: path
 *         name: webinarurl
 *         required: true
 *         description: URL of the webinar for which the user registered
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully rendered the thank-you page
 *       500:
 *         description: Internal server error
 */
router.get('/thankyoupage/:webinarurl', function (req, res) {
    try {
        req.session.returnTo = req.baseUrl + req.path;

        webinar.findOne({ deleted: { $ne: true }, webinarurl: req.params.webinarurl }, function (err, webinarDoc) {
            if (req.isAuthenticated()) {
                res.render('thankyoupage', {
                    title: 'Express',
                    moment: moment,
                    webinar: webinarDoc,
                    email: req.user.email,
                    registered: req.user.courses.length > 0,
                    recruiter: req.user.role && req.user.role === '3',
                    name: getusername(req.user),
                    notifications: req.user.notifications
                });
            } else {
                res.render('thankyoupage', { title: 'Express', moment: moment, webinar: webinarDoc, payment_id: '' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /webinars/manage:
 *   get:
 *     summary: Retrieve and display the admin panel page for managing webinars. uses webinars/iframe route inside.
 *     description: Uses webinars/iframe to display the webinars data
 *     tags: [Webinar]
 */
router.get('/manage', isAdmin, function (req, res) {
    req.session.returnTo = req.baseUrl + req.path;
    webinar.find({ deleted: { $ne: true } }, function (err, webinars) {
        if (req.isAuthenticated()) {
            res.render('adminpanel/webinar', { moment: moment, webinars: webinars, title: 'Express', email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
        }
        else {
            res.render('adminpanel/webinar', { moment: moment, webinars: webinars, title: 'Express' });
        }
    });
   
});

/**
 * @swagger
 * /webinars/iframe:
 *   get:
 *     summary: Iframe used in webinars/manage page to retrieve and manage webinars data in admin panel
 *     tags: [Webinar]
 */
router.get('/iframe', isAdmin, function (req, res) {
    webinar.find({ deleted: { $ne: true } }, function (err, webinars) {
        if (req.isAuthenticated()) {
            res.render('adminpanel/webinariframe', { moment: moment, webinars: webinars, title: 'Express', email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
        }
        else {
            res.render('adminpanel/webinariframe', { moment: moment, webinars: webinars, title: 'Express' });
        }
    });
});

/**
 * @swagger
 * /webinars/updateinfo:
 *   post:
 *     summary: Update webinar information in the admin panel
 *     tags: [Webinar]
 *     parameters:
 *       - in: formData
 *         name: name
 *         type: string
 *         required: true
 *         description: The name of the field to update
 *       - in: formData
 *         name: value
 *         type: string
 *         required: true
 *         description: The new value for the field
 *       - in: formData
 *         name: pk
 *         type: string
 *         required: true
 *         description: The ID of the webinar to update
 *     responses:
 *       200:
 *         description: Successfully updated webinar information
 *       500:
 *         description: Internal server error
 */
router.post('/updateinfo', isAdmin, function (req, res) {
    try {
        const updateQuery = {};
        updateQuery[req.body.name] = req.body.value;

        webinar.updateOne(
            { _id: req.body.pk },
            { $set: updateQuery },
            function (err, result) {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: err.message });
                } else {
                    res.json(result);
                }
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /webinars/uploadwebinarpicture:
 *   put:
 *     summary: Update webinar picture in the admin panel
 *     tags: [Webinar]
 *     parameters:
 *       - in: formData
 *         name: image
 *         type: string
 *         required: true
 *         description: The new picture URL for the webinar
 *       - in: formData
 *         name: id
 *         type: string
 *         required: true
 *         description: The ID of the webinar to update
 *       - in: formData
 *         name: fieldname
 *         type: string
 *         required: true
 *         description: The field name for the picture in the webinar document
 *     responses:
 *       200:
 *         description: Successfully updated webinar picture
 *       500:
 *         description: Internal server error
 */
router.put('/uploadwebinarpicture', isAdmin, function (req, res) {
    try {
        const { ObjectId } = require('mongodb');
        const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;

        const doc = req.body.image;
        const elementId = req.body.id;
        const fieldName = req.body.fieldname;

        const updateObj = {};
        updateObj[fieldName] = doc;

        webinar.updateOne(
            { _id: safeObjectId(elementId) },
            { $set: updateObj },
            function (err, result) {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: err.message });
                } else {
                    res.json(result);
                }
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /webinars/attendees/manage:
 *   get:
 *     summary: Render the page to manage webinar attendees
 *     tags: [Webinar]
 */
router.get('/attendees/manage', isAdmin, function (req, res) {
    try {
        res.render('adminpanel/webinarees', {
            email: req.user.email,
            registered: req.user.courses.length > 0,
            recruiter: req.user.role && req.user.role === '3',
            moment: moment
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});


router.get('/attendees/datatable', function (req, res) {
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

/**
 * @swagger
 * /webinars/{webinarurl}:
 *   get:
 *     summary: Get details of a single webinar and render its page
 *     description: Renders a webinar based on its url. Redirects to webinars home page if url is not valid
 *     tags: [Webinar]
 *     parameters:
 *       - in: path
 *         name: webinarurl
 *         required: true
 *         description: URL of the webinar to retrieve details
 *         schema:
 *           type: string
 */
router.get('/:webinarurl', function (req, res) {
    req.session.returnTo = req.baseUrl + req.path;
    webinar.findOne({ deleted: { $ne: true }, webinarurl: req.params.webinarurl }, function (err, webinar) {
        if (webinar) {
            if (req.isAuthenticated()) {
                res.render('webinars/webinar', { title: 'Express', webinar: webinar, moment: moment, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
            }
            else {
                res.render('webinars/webinar', { webinar: webinar, moment: moment });
            }
        }
        else {
            res.redirect('/webinars')
        }
    });
});

/**
 * @swagger
 * /webinars/add:
 *   post:
 *     summary: Add a new webinar.
 *     description: |
 *       This endpoint adds a new webinar with the provided details.
 *     tags:
 *       - Webinar
 *     parameters:
 *       - in: formData
 *         name: webinarname
 *         required: true
 *         type: string
 *         description: The name of the webinar.
 *       - in: formData
 *         name: speakername
 *         required: true
 *         type: string
 *         description: The name of the speaker.
 *       - in: formData
 *         name: speakerdescription
 *         required: true
 *         type: string
 *         description: Description of the speaker.
 *       - in: formData
 *         name: duration
 *         required: true
 *         type: string
 *         description: Duration of the webinar.
 *       - in: formData
 *         name: level
 *         required: true
 *         type: string
 *         description: The level of the webinar.
 *       - in: formData
 *         name: date
 *         required: true
 *         type: string
 *         format: date
 *         description: The date of the webinar.
 *     responses:
 *       200:
 *         description: Webinar successfully added.
 *         content:
 *           text/html:
 *             example: 'Webinar successfully added. Redirecting to manage page...'
 *       400:
 *         description: Bad request. Invalid webinar details provided.
 *         content:
 *           text/html:
 *             example: 'Invalid webinar details. Please check and try again.'
 */
router.post('/add', async function (req, res) {
    try {
        const Webinar = new webinar({
            webinarname: req.body.webinarname,
            speakername: req.body.speakername,
            speakerdescription: req.body.speakerdescription,
            duration: req.body.duration,
            level: req.body.level,
            date: new Date(req.body.date)
        });

        await Webinar.save();

        // Redirect to the manage page after successful addition
        res.status(200).send('Webinar successfully added. Redirecting to manage page...');
    } catch (error) {
        // Handle validation or database error
        res.status(400).json({ error: 'Invalid webinar details. Please check and try again.' });
    }
});

/**
 * @swagger
 * /webinars/addwebinaree:
 *   post:
 *     summary: Add a new webinar registration
 *     tags: [Webinar]
 *     parameters:
 *       - in: formData
 *         name: firstname
 *         type: string
 *         required: true
 *         description: First name of the attendee
 *       - in: formData
 *         name: lastname
 *         type: string
 *         required: true
 *         description: Last name of the attendee
 *       - in: formData
 *         name: email
 *         type: string
 *         required: true
 *         description: Email address of the attendee
 *       - in: formData
 *         name: countrycode
 *         type: string
 *         description: Country code of the attendee
 *       - in: formData
 *         name: phone
 *         type: string
 *         description: Phone number of the attendee
 *       - in: formData
 *         name: termsandconditions
 *         type: string
 *         description: Acceptance of terms and conditions (on/off)
 *       - in: formData
 *         name: webinarname
 *         type: string
 *         required: true
 *         description: Name of the webinar
 *       - in: formData
 *         name: webinarid
 *         type: string
 *         required: true
 *         description: ID of the webinar
 *       - in: formData
 *         name: webinarpicture
 *         type: string
 *         description: URL of the webinar picture
 *       - in: formData
 *         name: webinardate
 *         type: string
 *         description: Date of the webinar
 *       - in: formData
 *         name: webinarurl
 *         type: string
 *         required: true
 *         description: URL of the webinar
 *     responses:
 *       200:
 *         description: Webinar registration successful
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/addwebinaree', async function (req, res) {
    try {
        const termsandconditions = req.body.termsandconditions && req.body.termsandconditions === "on";

        const Webinaree = new webinaree({
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

        // Save Webinaree using async/await
        await Webinaree.save();

        // Sending Email
        const sesMail = new awsSesMail();
        const sesConfig = {
            accessKeyId: process.env.ACCESS_KEY_ID,
            secretAccessKey: process.env.SECRET_ACCESS_KEY,
            region: process.env.REGION
        };
        sesMail.setConfig(sesConfig);

        // HTML email content
        var html = addWebinareeHTML(req.body);

        const options = {
            from: 'ampdigital.co <amitabh@ads4growth.com>',
            to: req.body.email,
            subject: 'AMP Digital: Your Webinar Registration',
            content: `<html><head></head><body>${html}</body></html>`
        };

        await sesMail.sendEmail(options);

        // Subscription using Sendy
        const sendy = new Sendy('http://sendy.ampdigital.co/', process.env.SENDY_API_KEY);

        await sendy.subscribe({
            api_key: process.env.SENDY_API_KEY,
            name: req.body.firstname + " " + req.body.lastname,
            email: req.body.email,
            list_id: 'Euqm1IPXhLOYYBVPfi1d8Q'
        });

        res.redirect("/webinars/thankyoupage/" + req.body.webinarurl);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /webinars/remove:
 *   delete:
 *     summary: Remove a webinar.
 *     description: |
 *       This endpoint marks a webinar as deleted.
 *     tags:
 *       - Webinar
 *     parameters:
 *       - in: formData
 *         name: webinarid
 *         required: true
 *         type: string
 *         description: The ID of the webinar to be removed.
 *     responses:
 *       200:
 *         description: Webinar successfully marked as deleted.
 *         content:
 *           application/json:
 *             example: {"n": 1, "nModified": 1, "ok": 1}
 *       400:
 *         description: Bad request. Invalid webinar ID provided.
 *         content:
 *           application/json:
 *             example: {"error": "Invalid webinar ID. Please check and try again."}
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             example: {"error": "Internal server error. Please try again later."}
 */
router.delete('/remove', async function (req, res) {
    try {
        const result = await webinar.updateOne(
            { _id: req.body.webinarid },
            { $set: { deleted: true } }
        );

        if (result.nModified === 1) {
            res.status(200).json(result);
        } else {
            res.status(400).json({ error: 'Invalid webinar ID. Please check and try again.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
});

module.exports = router;
