var express = require("express");
var router = express.Router();
var lmsCourses = require("../models/courses");
var lmsUsers = require("../models/user");
var payment = require("../models/payment");
var coupon = require("../models/coupon");
var moment = require("moment");
const Razorpay = require('razorpay');
var aws = require("aws-sdk");
const dotenv = require("dotenv");
dotenv.config();
aws.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
});
const { ObjectId } = require("mongodb"); // or ObjectID


var awsSesMail = require("aws-ses-mail");
const { isAdmin, getusername } = require("../utils/common");
const { generateWelcomeEmailHtml } = require("../utils/html_templates");

var sesMail = new awsSesMail();
var sesConfig = {
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
};
sesMail.setConfig(sesConfig);

/**
 * @swagger
 * /:
 *   get:
 *     summary: Redirect to the admin page for authenticated users with admin privileges
 *     tags: [Payments]
 *     responses:
 *       302:
 *         description: Redirect to the admin page
 *       401:
 *         description: Unauthorized - User not authenticated
 */
router.get("/", isAdmin, function (req, res) {
  res.redirect("/admin");
});

/**
 * @swagger
 * /datatable:
 *   get:
 *     summary: Get data for Payments DataTable (server-side script with NODE and MONGODB)
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: DataTables server-side script data
 *       500:
 *         description: Internal Server Error
 */
router.get("/datatable", function (req, res) {
  /*
   * Script:    DataTables server-side script for NODE and MONGODB
   * Copyright: 2018 - Siddharth Sogani
   */

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Easy set variables
   */

  /* Array of columns to be displayed in DataTable
   */
  var $aColumns = [
    "buyer_name",
    "email",
    "phone",
    "status",
    "purpose",
    "amount",
    "couponcode",
    "payment_id",
    "date",
    "registered",
  ];

  /*
   * Paging
   */
  var $sDisplayStart = 0;
  var $sLength = "";
  if (req.query.iDisplayStart && req.query.iDisplayLength != "-1") {
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
    console.log(req.query.sSearch);
    var arr = [
      {
        payment_request_id: {
          $regex: "" + req.query.sSearch + "",
          $options: "i",
        },
      },
      { buyer_name: { $regex: "" + req.query.sSearch + "", $options: "i" } },
      { email: { $regex: "" + req.query.sSearch + "", $options: "i" } },
      { phone: { $regex: "" + req.query.sSearch + "", $options: "i" } },
      { status: { $regex: "" + req.query.sSearch + "", $options: "i" } },
      { purpose: { $regex: "" + req.query.sSearch + "", $options: "i" } },
      { payment_id: { $regex: "" + req.query.sSearch + "", $options: "i" } },
    ];
    query.$or = arr;
  }

  var filterArray = [];
  if (req.query.fromdatefilter !== "") {
    console.log("11111");
    filterArray.push({ date: { $gte: req.query.fromdatefilter + " 00:00" } });
    query.$and = filterArray;
  }
  if (req.query.todatefilter !== "") {
    console.log("1111");
    filterArray.push({ date: { $lte: req.query.todatefilter + " 23:59" } });
    query.$and = filterArray;
  }
  if (req.query.purposefilter !== "") {
    console.log("222");
    filterArray.push({ purpose: req.query.purposefilter });
    query.$and = filterArray;
  }
  if (req.query.statusfilter !== "") {
    console.log("222");
    filterArray.push({
      status: { $regex: "" + req.query.statusfilter + "", $options: "i" },
    });
    query.$and = filterArray;
  }

  /*
   * Ordering
   */
  var sortObject = { date: -1 };
  if (req.query.iSortCol_0 && req.query.iSortCol_0 == 0) {
    if (req.query.sSortDir_0 == "desc") {
      var sortObject = {};
      var stype = "buyer_name";
      var sdir = -1;
      sortObject[stype] = sdir;
    } else {
      var sortObject = {};
      var stype = "buyer_name";
      var sdir = 1;
      sortObject[stype] = sdir;
    }
  } else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 1) {
    if (req.query.sSortDir_0 == "desc") {
      var sortObject = {};
      var stype = "email";
      var sdir = -1;
      sortObject[stype] = sdir;
    } else {
      var sortObject = {};
      var stype = "email";
      var sdir = 1;
      sortObject[stype] = sdir;
    }
  } else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 2) {
    if (req.query.sSortDir_0 == "desc") {
      var sortObject = {};
      var stype = "phone";
      var sdir = -1;
      sortObject[stype] = sdir;
    } else {
      var sortObject = {};
      var stype = "phone";
      var sdir = 1;
      sortObject[stype] = sdir;
    }
  } else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 3) {
    if (req.query.sSortDir_0 == "desc") {
      var sortObject = {};
      var stype = "status";
      var sdir = -1;
      sortObject[stype] = sdir;
    } else {
      var sortObject = {};
      var stype = "status";
      var sdir = 1;
      sortObject[stype] = sdir;
    }
  } else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 4) {
    if (req.query.sSortDir_0 == "desc") {
      var sortObject = {};
      var stype = "purpose";
      var sdir = -1;
      sortObject[stype] = sdir;
    } else {
      var sortObject = {};
      var stype = "purpose";
      var sdir = 1;
      sortObject[stype] = sdir;
    }
  } else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 5) {
    if (req.query.sSortDir_0 == "desc") {
      var sortObject = {};
      var stype = "amount";
      var sdir = -1;
      sortObject[stype] = sdir;
    } else {
      var sortObject = {};
      var stype = "amount";
      var sdir = 1;
      sortObject[stype] = sdir;
    }
  } else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 6) {
    if (req.query.sSortDir_0 == "desc") {
      var sortObject = {};
      var stype = "payment_id";
      var sdir = -1;
      sortObject[stype] = sdir;
    } else {
      var sortObject = {};
      var stype = "payment_id";
      var sdir = 1;
      sortObject[stype] = sdir;
    }
  }

  payment
    .find(query)
    .skip(parseInt($sDisplayStart))
    .limit(parseInt($sLength))
    .sort(sortObject)
    .exec(function (err, docs) {
      payment.count(query, function (err, count) {
        console.log("HEREE");
        console.log(query);
        console.log(docs);
        var aaData = [];
        for (let i = 0; i < docs.length; i++) {
          var $row = [];
          for (var j = 0; j < $aColumns.length; j++) {
            if ($aColumns[j] == "date") {
              $row.push(
                moment(docs[i][$aColumns[j]]).format("DD/MMM/YYYY HH:mm A"),
              );
            } else if ($aColumns[j] == "registered") {
              $row.push(
                moment(docs[i]["registered"]).format("DD/MMM/YYYY HH:mm A"),
              );
            } else {
              $row.push(docs[i][$aColumns[j]]);
            }
          }
          aaData.push($row);
        }
        var sample = {
          sEcho: req.query.sEcho,
          iTotalRecords: count,
          iTotalDisplayRecords: count,
          aaData: aaData,
        };
        res.json(sample);
      });
    });
});


/**
 * @swagger
 * /payments/check-coupon:
 *   get:
 *     summary: Check the validity of a coupon code
 *     tags: [Payments]
 *     parameters:
 *       - in: query
 *         name: couponcode
 *         schema:
 *           type: string
 *         required: true
 *         description: The coupon code to be checked
 *     responses:
 *       200:
 *         description: Coupon details if valid, false otherwise
 *       500:
 *         description: Internal Server Error
 */
router.get("/check-coupon", function (req, res) {
  coupon.find(
    {
      name: req.query.couponcode,
      validfrom: { $lte: Date.now() },
      validto: { $gte: Date.now() },
    },
    function (err, coupon) {
      if (coupon.length > 0) {
        res.json(coupon[0]);
      } else {
        if (req.query.couponcode && req.query.couponcode.trim() !== "") {
          lmsUsers.findOne(
            { "local.referralcode": req.query.couponcode },
            function (err, user) {
              if (user) {
                res.json({
                  participantname: user.local.name + " " + user.local.lastname,
                  type: "referralcode",
                  offertoparticipant: 400,
                  offertoenrollment: 10,
                });
              } else {
                res.json(false);
              }
            },
          );
        } else {
          res.json(false);
        }
      }
    },
  );
});

/**
 * @swagger
 * /thankyoupage:
 *   get:
 *     summary: Render the thank you page after successful payment
 *     tags: [Payments]
 *     parameters:
 *       - in: query
 *         name: course_name
 *         schema:
 *           type: string
 *         required: false
 *         description: The name of the completed course
 *       - in: query
 *         name: payment_id
 *         schema:
 *           type: string
 *         required: false
 *         description: The payment ID associated with the completed payment
 *     responses:
 *       200:
 *         description: Rendered thank you page
 *       500:
 *         description: Internal Server Error
 */
router.get("/thankyoupage", function (req, res) {
  req.session.returnTo = req.baseUrl + req.url;
  if (req.isAuthenticated()) {
    var batchdate = "";

    res.render("courses/paymentcomplete", {
      title: "Express",
      moment: moment,
      batchdate: batchdate,
      course_name: req.query.course_name,
      payment_id: req.query.payment_id,
      email: req.user.email,
      registered: req.user.courses.length > 0 ? true : false,
      recruiter: req.user.role && req.user.role == "3" ? true : false,
      name: getusername(req.user),
      notifications: req.user.notifications,
    });
  } else {
    res.render("courses/paymentcomplete", {
      title: "Express",
      moment: moment,
      course_name: "",
      payment_id: "",
    });
  }
});

/**
 * @swagger
 * /statistics:
 *   post:
 *     description: Get statistics based on filters
 *     parameters:
 *       - name: fromdatefilter
 *         description: Filter data from this date
 *         in: formData
 *         type: string
 *       - name: todatefilter
 *         description: Filter data up to this date
 *         in: formData
 *         type: string
 *       - name: purposefilter
 *         description: Filter data based on purpose
 *         in: formData
 *         type: string
 *       - name: statusfilter
 *         description: Filter data based on status
 *         in: formData
 *         type: string
 *     responses:
 *       200:
 *         description: Successful response with statistics
 */

router.post("/statistics", function (req, res) {
  var query = {};
  var query2 = {};
  var filterArray = [];
  var filterArray2 = [];

  if (req.body.fromdatefilter !== "") {
    filterArray.push({ date: { $gte: req.body.fromdatefilter } });
    filterArray2.push({ date: { $gte: req.body.fromdatefilter } });
    query.$and = filterArray;
    query2.$and = filterArray2;
  }

  if (req.body.todatefilter !== "") {
    filterArray.push({ date: { $lte: req.body.todatefilter + " 23:59" } });
    filterArray2.push({ date: { $lte: req.body.todatefilter + " 23:59" } });
    query.$and = filterArray;
    query2.$and = filterArray2;
  }

  if (req.body.purposefilter !== "_") {
    filterArray.push({ purpose: req.body.purposefilter.split("_")[0] });
    filterArray2.push({ courses: req.body.purposefilter.split("_")[1] });
    query.$and = filterArray;
    query2.$and = filterArray2;
  }

  if (req.body.statusfilter !== "") {
    filterArray.push({
      status: { $regex: "" + req.body.statusfilter + "", $options: "i" },
    });
    query.$and = filterArray;
  }

  payment.aggregate(
    [
      { $match: query },
      {
        $group: {
          _id: "$purpose",
          count: { $sum: 1 },
          amount: {
            $sum: "$amount",
          },
        },
      },
    ],
    function (err, chartdata1) {
      if (err) {
        // Handle error
      } else {
        payment.aggregate(
          [
            { $match: query },
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 },
                amount: {
                  $sum: "$amount",
                },
              },
            },
          ],
          function (err, chartdata2) {
            if (err) {
              // Handle error
            } else {
              var arr = [];
              for (var i = 0; i < chartdata1.length; i++) {
                var obj = {};
                obj.name = chartdata1[i]["_id"];
                obj.y = chartdata1[i]["count"];
                obj.z = chartdata1[i]["amount"];
                arr.push(obj);
              }

              var arr2 = [];
              for (var i = 0; i < chartdata2.length; i++) {
                var obj = {};
                obj.name = chartdata2[i]["_id"];
                obj.y = chartdata2[i]["count"];
                obj.z = chartdata2[i]["amount"];
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
                  } else {
                    unpaidcount = unpaidcount + 1;
                  }
                }
                query2.validated = { $ne: false };
                lmsUsers.count(query2, function (err, registrations) {
                  res.json({
                    registrations: registrations,
                    paidcount: paidcount,
                    unpaidcount: unpaidcount,
                    count: count,
                    amount: amount,
                    chartdata1: arr,
                    chartdata2: arr2,
                  });
                });
              });
            }
          },
        );
      }
    },
  );
});

/**
 * @swagger
 * /statistics:
 *   get:
 *     summary: Get payment statistics grouped by purpose and status
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: Payment statistics grouped by purpose and status
 *       500:
 *         description: Internal Server Error
 */
router.get("/statistics", async function (req, res) {
  try {
    // Use async/await to simplify asynchronous code
    const paymentstats = await payment.aggregate([
      {
        $group: {
          _id: { purpose: "$purpose", status: "$status" },
          count: { $sum: 1 },
          amount: { $sum: "$amount" },
        },
      },
    ]);

    // Extract unique purposes from payment statistics
    const paymentstatistics = [...new Set(paymentstats.map(item => item._id.purpose))];

    // Prepare an object to store statistics grouped by purpose
    const obj = {};
    for (const purpose of paymentstatistics) {
      obj[purpose] = [];
    }

    // Populate the object with statistics
    for (const item of paymentstats) {
      obj[item._id.purpose].push({
        status: item._id.status,
        count: item.count,
        amount: item._id.status === "Credit" ? item.amount : 0,
      });
    }

    // Send the response with the prepared object
    res.json(obj);
  } catch (error) {
    // Handle errors if any
    console.error("Error fetching payment statistics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /create-razorpay-order:
 *   post:
 *     summary: Create Razorpay order
 *     description: Endpoint to create a Razorpay order for payment.
 *     tags:
 *       - Payments
 *     parameters:
 *       - in: formData
 *         name: dialcode
 *         schema:
 *           type: string
 *         required: true
 *         description: The dialcode for the country.
 *       - in: formData
 *         name: userid
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID.
 *       - in: formData
 *         name: amount
 *         schema:
 *           type: number
 *         required: true
 *         description: The payment amount.
 *       - in: formData
 *         name: phone
 *         schema:
 *           type: string
 *         required: true
 *         description: The user's phone number.
 *       - in: formData
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: The user's email address.
 *       - in: formData
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: The user's name.
 *       - in: formData
 *         name: description
 *         schema:
 *           type: string
 *         required: true
 *         description: The purpose/description of the payment.
 *       - in: formData
 *         name: couponcode
 *         schema:
 *           type: string
 *         description: The coupon code (optional).
 *       - in: formData
 *         name: coupontype
 *         schema:
 *           type: string
 *         description: The type of coupon (optional).
 *       - in: formData
 *         name: couponcodeapplied
 *         schema:
 *           type: boolean
 *         description: Whether a coupon code is applied (optional).
 *       - in: formData
 *         name: discount
 *         schema:
 *           type: number
 *         description: The discount amount (optional).
 *     responses:
 *       200:
 *         description: Successful order creation. Returns the order ID.
 *       400:
 *         description: Bad request or validation error.
 *       500:
 *         description: Internal server error.
 */
router.post('/create-razorpay-order', async (req, res) => {
  try {
    // Log for debugging purposes
    console.log('__apeghaipeg');
    console.log(req.body.dialcode); // Access query parameters using req.body

    // Extract relevant data from the query parameters
    const userid = req.body.userid;
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    let options = {};

    // Set options based on dialcode (country code)
    if (req.body.dialcode === 'India' || req.body.dialcode === '91') {
      options = {
        amount: req.body.amount * 100,
        currency: 'INR',
      };
    } else {
      options = {
        amount: 10000,
        currency: 'USD',
      };
    }

    // Create a Razorpay order
    const order = await new Promise((resolve, reject) => {
      instance.orders.create(options, (err, order) => {
        if (err) {
          reject(err);
        } else {
          resolve(order);
        }
      });
    });

    // Fetch user data from the database
    const safeObjectId = (s) => ObjectId.isValid(s) ? new ObjectId(s) : null;
    const user = await lmsUsers.findOne({ _id: safeObjectId(userid) });

    // Create a payment record
    const paymentdata = new payment({
      user_id: req.body.userid,
      payment_request_id: order.id,
      phone: req.body.phone,
      email: req.body.email,
      buyer_name: req.body.name,
      dialcode: req.body.dialcode,
      purpose: req.body.description,
      amount: req.body.amount,
      couponcode: req.body.couponcode,
      coupontype: req.body.coupontype,
      couponcodeapplied: req.body.couponcodeapplied,
      discount: req.body.discount,
      status: order.status,
      date: new Date(),
      updated: new Date(),
      registered: user.createddate,
    });

    await paymentdata.save();

    res.status(200).json(order.id);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /razorpay-callback/:
 *   get:
 *     summary: Handle Razorpay callback for payments
 *     tags: [Payments]
 *     parameters:
 *       - in: query
 *         name: payment_id
 *         required: true
 *         description: Razorpay payment ID
 *       - in: query
 *         name: payment_status
 *         required: true
 *         description: Payment status (credit or failed)
 *       - in: query
 *         name: user_id
 *         required: true
 *         description: User ID and Course ID separated by underscore (e.g., "userId_courseId")
 *     responses:
 *       302:
 *         description: Redirect to the thank you page
 *       200:
 *         description: Successful payment callback
 *       500:
 *         description: Internal Server Error
 */
router.get('/razorpay-callback/', async (req, res) => {
  try {
      const { payment_id, payment_status, user_id } = req.query;

      // Handle successful payment callback
      if (payment_id && payment_status === 'credit') {
          const [userId, courseId] = user_id.split('_');
          const addToSet = { "courses": courseId, "paymentids": payment_id };

          // Update user document with the new course and payment ID
          await lmsUsers.update({ _id: userId }, { $addToSet: addToSet });

          // Find the payment document based on the order ID
          const paymentdoc = await payment.findOne({ payment_request_id: req.query.order_id });

          // Update the payment document with additional details
          if (paymentdoc) {
              await payment.updateOne(
                  { payment_request_id: req.query.order_id },
                  {
                      $set: {
                          "payment_id": payment_id,
                          "razorpay_signature": req.query.razorpay_signature,
                          "status": payment_status,
                          "user_id": user_id,
                          updated: new Date()
                      }
                  }
              );

              // Fetch course details for sending emails
              const course = await lmsCourses.findOne({ _id: ObjectId(courseId), deleted: { $ne: "true" } });

              var awsSesMail = require("aws-ses-mail");
              
              var sesMail = new awsSesMail();
              var sesConfig = {
                accessKeyId: process.env.ACCESS_KEY_ID,
                secretAccessKey: process.env.SECRET_ACCESS_KEY,
                region: process.env.REGION,
              };
              sesMail.setConfig(sesConfig);

              var html = generateWelcomeEmailHtml(
                req.user.local.name,
                course.course_name,
              );

              var options = {
                from: "ampdigital.co <amitabh@ads4growth.com>",
                to: req.user.email,
                subject: `Welcome to ${course.course_name}`,
                content:
                  "<html><head></head><body>" +
                  html +
                  "</body></html>",
              };
              const { ToWords } = require("to-words");
              const toWords = new ToWords({
                localeCode: "en-IN",
                converterOptions: {
                  currency: true,
                  ignoreDecimal: false,
                  ignoreZeroCurrency: false,
                },
              });

              var options2 = {
                from: "ampdigital.co <amitabh@ads4growth.com>",
                to: req.user.email,
                subject: `Invoice for your subscription to AMP Digital ${course.course_name}`,
                template: "views/email_invoice.ejs",
                templateArgs: {
                  course: course.course_name,
                  name: getusername(req.user),
                  notifications:
                    req.user.notifications +
                    " " +
                    req.user.local.lastname,
                  email: req.user.local.email,
                  phone: req.user.local.phone,
                  date: moment(new Date()).format(
                    "DD/MMM/YYYY HH:mm A",
                  ),
                  paymentid: req.query.payment_id,
                  referenceid: paymentdoc._id.toString(),
                  principal:
                    Math.round(parseInt(paymentdoc.amount) * 82) /
                    100,
                  tax:
                    Math.round(parseInt(paymentdoc.amount) * 9) /
                    100,
                  total: parseInt(paymentdoc.amount),
                  totalinwords: toWords.convert(
                    parseInt(paymentdoc.amount),
                  ),
                },
              };

              sesMail.sendEmail(options, function (err) {
                // TODO sth....
                if (err) {
                  console.log(err);
                }
                sesMail.sendEmailByHtml(
                  options2,
                  function (data, err) {
                    // TODO sth....
                    if (err) {
                      console.log(err);
                    }
                    console.log("_________________________redirectingtothankyoupage")
                    return res.redirect(
                      "/payments/thankyoupage?course_id=" +
                        course._id +
                        "&course_name=" +
                        course.course_name +
                        "&payment_id=" +
                        req.query.payment_id +
                        "&userid=" +
                        req.query.user_id,
                    );
                  },
                );
              });
          }
      } else if (payment_id && payment_status === 'failed') {
          // Handle failed payment callback
          const [userId, courseId] = user_id.split('_');

          // Find the payment document based on the payment request ID
          const paymentdoc = await payment.findOne({ payment_request_id: req.query.payment_request_id });

          if (paymentdoc) {
              // Update the payment document with failure details
              const response = await payment.updateOne(
                  { payment_request_id: req.query.payment_request_id },
                  {
                      $set: {
                          "code": req.query.code,
                          "description": req.query.description,
                          "source": req.query.source,
                          "step": req.query.step,
                          "reason": req.query.reason,
                          "payment_id": req.query.payment_id,
                          "status": payment_status,
                          "user_id": user_id,
                          updated: new Date()
                      }
                  }
              );

              // Respond with the updated payment document
              return res.json(response);
          }
      }
  } catch (error) {
      // Handle any errors that occurred during processing
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
