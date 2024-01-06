var express = require("express");
var router = express.Router();
var lmsCourses = require("../models/courses");
var lmsUsers = require("../models/user");
var payment = require("../models/payment");
var coupon = require("../models/coupon");
var moment = require("moment");
var aws = require("aws-sdk");
const dotenv = require("dotenv");
dotenv.config();
aws.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
});
const Insta = require("instamojo-nodejs");

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

router.get("/", isAdmin, function (req, res) {
  res.redirect("/admin");
});

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

/* GET courses page. */
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

router.post("/statistics", function (req, res) {
  var query = {};
  var query2 = {};
  var filterArray = [];
  var filterArray2 = [];
  if (req.body.fromdatefilter !== "") {
    console.log("11111");
    filterArray.push({ date: { $gte: req.body.fromdatefilter } });
    filterArray2.push({ date: { $gte: req.body.fromdatefilter } });
    query.$and = filterArray;
    query2.$and = filterArray2;
  }
  if (req.body.todatefilter !== "") {
    console.log("1111");
    filterArray.push({ date: { $lte: req.body.todatefilter + " 23:59" } });
    filterArray2.push({ date: { $lte: req.body.todatefilter + " 23:59" } });

    query.$and = filterArray;
    query2.$and = filterArray2;
  }
  if (req.body.purposefilter !== "_") {
    console.log("222");
    filterArray.push({ purpose: req.body.purposefilter.split("_")[0] });
    filterArray2.push({ courses: req.body.purposefilter.split("_")[1] });
    query.$and = filterArray;
    query2.$and = filterArray2;
  }
  if (req.body.statusfilter !== "") {
    console.log("222");
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

router.get("/statistics", function (req, res) {
  payment.aggregate(
    [
      {
        $group: {
          _id: { purpose: "$purpose", status: "$status" },
          count: { $sum: 1 },
          amount: { $sum: "$amount" },
        },
      },
    ],
    function (err, paymentstats) {
      var paymentstatistics = [];
      for (var i = 0; i < paymentstats.length; i++) {
        if (
          paymentstatistics.indexOf(paymentstats[i]["_id"]["purpose"]) == -1
        ) {
          paymentstatistics.push(paymentstats[i]["_id"]["purpose"]);
        }
      }
      var obj = {};
      for (var h = 0; h < paymentstatistics.length; h++) {
        obj[paymentstatistics[h]] = [];
      }
      for (var i = 0; i < paymentstats.length; i++) {
        obj[paymentstats[i]["_id"]["purpose"]].push({
          status: paymentstats[i]["_id"]["status"],
          count: paymentstats[i]["count"],
          amount:
            paymentstats[i]["_id"]["status"] == "Credit"
              ? paymentstats[i]["amount"]
              : 0,
        });
      }
      res.json(obj);
      // res.render('adminpanel/dashboard', {paymentstats: paymentstats, todayuniquepageviews: todayuniquepageviews.length, todaypageviews: todaypageviews, todaypageviews: todaypageviews, coursecount: count, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
    },
  );
});

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

/*GET contact requests page*/
router.get("/couponstats", isAdmin, function (req, res) {
  lmsCourses.find({ deleted: { $ne: "true" } }, function (err, courses) {
    res.render("adminpanel/couponstats", {
      courses: courses,
      email: req.user.email,
      registered: req.user.courses.length > 0 ? true : false,
      recruiter: req.user.role && req.user.role == "3" ? true : false,
      moment: moment,
    });
  });
});

router.get("/promotionprogram/datatable", function (req, res) {
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
    "couponcode",
    "paid",
    "totalsales",
    "totaldiscount",
    "action",
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

  var matchQuery = { coupontype: "couponcode", couponcode: { $ne: "" } };
  /*
   * Filtering
   * NOTE this does not match the built-in DataTables filtering which does it
   * word by word on any field. It's possible to do here, but concerned about efficiency
   * on very large tables, and MySQL's regex functionality is very limited
   */
  if (req.query.sSearch != "") {
    var arr = [
      { couponcode: { $regex: "" + req.query.sSearch + "", $options: "i" } },
    ];
    matchQuery.$or = arr;
  }

  /*
   * Ordering
   */
  var sortObject = { date: -1 };
  if (req.query.iSortCol_0 && req.query.iSortCol_0 == 0) {
    if (req.query.sSortDir_0 == "desc") {
      var sortObject = {};
      var stype = "date";
      var sdir = -1;
      sortObject[stype] = sdir;
    } else {
      var sortObject = {};
      var stype = "date";
      var sdir = 1;
      sortObject[stype] = sdir;
    }
  }
  payment.aggregate(
    [
      {
        $match: matchQuery,
      },
      {
        $sort: sortObject,
      },
      {
        $skip: parseInt($sDisplayStart),
      },
      {
        $limit: parseInt($sLength),
      },
      {
        $group: {
          _id: "$couponcode",
          count: { $sum: 1 },
          totalsales: {
            $sum: "$amount",
          },
          totaldiscount: {
            $sum: "$discount",
          },
          totalearned: {
            $sum: "$offertoparticipant",
          },
          customers: { $push: { $concat: ["$buyer_name", "-", "$purpose"] } },
        },
      },
    ],
    function (err, docs) {
      // payment.find(query).skip(parseInt($sDisplayStart)).limit(parseInt($sLength)).sort(sortObject).exec(
      payment.aggregate(
        [
          {
            $match: matchQuery,
          },
          {
            $group: {
              _id: "$couponcode",
              count: { $sum: 1 },
            },
          },
        ],
        function (err, response) {
          console.log("aehgahecoupgpaheigpaeg");
          console.log(docs);
          var count = response.length;
          var aaData = [];
          for (let i = 0; i < docs.length; i++) {
            var $row = [];
            for (var j = 0; j < $aColumns.length; j++) {
              if ($aColumns[j] == "couponcode") {
                $row.push(docs[i]["_id"]);
              }
              if ($aColumns[j] == "paid") {
                $row.push(docs[i]["count"]);
              }
              if ($aColumns[j] == "totalsales") {
                $row.push(docs[i]["totalsales"]);
              }
              if ($aColumns[j] == "totaldiscount") {
                $row.push(docs[i]["totaldiscount"]);
              }
              if ($aColumns[j] == "action") {
                $row.push(
                  `<button data-customers="${docs[i].customers}" data-couponcode="${docs[i]._id}" class="btn btn-sm btn-success coupondetails">Details</button>`,
                );
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
        },
      );
    },
  );
});

router.post('/razorpayorder', (req, res, next) => {
  console.log('__apeghaipeg');
  console.log(req.body.dialcode);
  const Razorpay = require('razorpay');
  var userid = req.body.userid;

  var instance = new Razorpay({
    key_id: 'rzp_test_vb1ncNAItNiJTX',
    key_secret: 'lV8nFmy8Kn5o1HgWQyqkjICJ'
  });
  let amount = req.body.amount;
  const currency_support = [
    'AED',
    'ALL',
    'AMD',
    'ARS',
    'AUD',
    'AWG',
    'BBD',
    'BDT',
    'BMD',
    'BND',
    'BOB',
    'BSD',
    'BWP',
    'BZD',
    'CAD',
    'CHF',
    'CNY',
    'COP',
    'CRC',
    'CUP',
    'CZK',
    'DKK',
    'DOP',
    'DZD',
    'EGP',
    'ETB',
    'EUR',
    'FJD',
    'GBP',
    'GIP',
    'GHS',
    'GMD',
    'GTQ',
    'GYD',
    'HKD',
    'HNL',
    'HRK',
    'HTG',
    'HUF',
    'IDR',
    'ILS',
    'INR',
    'JMD',
    'KES',
    'KGS',
    'KHR',
    'KYD',
    'KZT',
    'LAK',
    'LBP',
    'LKR',
    'LRD',
    'LSL',
    'MAD',
    'MDL',
    'MKD',
    'MMK',
    'MNT',
    'MOP',
    'MUR',
    'MVR',
    'MWK',
    'MXN',
    'MYR',
    'NAD',
    'NGN',
    'NIO',
    'NOK',
    'NPR',
    'NZD',
    'PEN',
    'PGK',
    'PHP',
    'PKR',
    'QAR',
    'RUB',
    'SAR',
    'SCR',
    'SEK',
    'SGD',
    'SLL',
    'SOS',
    'SSP',
    'SVC',
    'SZL',
    'THB',
    'TTD',
    'TZS',
    'USD',
    'UYU',
    'UZS',
    'YER',
    'ZAR',
  ];
  if (req.body.dialcode == 'India' || req.body.dialcode == '91') {
    let options = {
      amount: req.body.amount * 100,
      currency: 'INR',
    };
    instance.orders.create(options, function (err, order) {
      if (err) {
        res.json(err);
      } else {
        const { ObjectId } = require('mongodb'); // or ObjectID
        const safeObjectId = (s) =>
          ObjectId.isValid(s) ? new ObjectId(s) : null;

        lmsUsers.findOne({ _id: safeObjectId(userid) }, function (err, user) {
          var paymentdata = new payment({
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
          paymentdata.save(function (err, results) {
            if (err) {
              res.json(err);
            } else {
              res.status(200).json(order.id);
            }
          });
        });
      }
    });
  } else {
    let options = {
      amount: 10000,
      currency: 'USD',
    };
    instance.orders.create(options, function (err, order) {
      if (err) {
        res.json(err);
      } else {
        const { ObjectId } = require('mongodb'); // or ObjectID
        const safeObjectId = (s) =>
          ObjectId.isValid(s) ? new ObjectId(s) : null;

        lmsUsers.findOne({ _id: safeObjectId(userid) }, function (err, user) {
          var paymentdata = new payment({
            user_id: req.body.userid,
            payment_request_id: order.id,
            phone: req.body.phone,
            email: req.body.email,
            dialcode: req.body.dialcode,
            buyer_name: req.body.name,
            purpose: req.body.description,
            amount: req.body.amount,
            status: order.status,
            date: new Date(),
            updated: new Date(),
            registered: user.createddate,
          });
          paymentdata.save(function (err, results) {
            if (err) {
              res.json(err);
            } else {
              res.status(200).json(order.id);
            }
          });
        });
      }
    });
  }
});

router.get('/razorpaycallback/', (req, res) => {
    // res.redirect('/thankyoupage');
    if (req.query.payment_id && req.query.payment_status == "credit") {
        let idArray = req.query.user_id.split('_')
        var userid = idArray[0];
        var courseid = idArray[1];
        var addToSet = { "courses": courseid, "paymentids": req.query.payment_id };

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
                        payment_request_id: req.query.order_id
                    }, function (err, paymentdoc) {
                        if (res) {
                            payment.update(
                                {
                                    payment_request_id: req.query.order_id
                                },
                                {
                                    $set: { "payment_id": req.query.payment_id, "razorpay_signature": req.query.razorpay_signature, "status": req.query.payment_status, "user_id": req.query.user_id, updated: new Date() }
                                }
                                ,
                                function (err, response) {
                                    if (err) {
                                        res.json(err);
                                    }
                                    else {
                                      const { ObjectId } = require("mongodb"); // or ObjectID
                                      const safeObjectId = (s) =>
                                        ObjectId.isValid(s) ? new ObjectId(s) : null;
                                      lmsCourses.findOne(
                                        {
                                          _id: safeObjectId(req.query.user_id.split("_")[1]),
                                          deleted: { $ne: "true" },
                                        },
                                        function (err, course) {
                                          if (course) {
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
                                        },
                                      );
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
    else if (req.query.payment_id && req.query.payment_status == "failed") {
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
                        $set: { "code": req.query.code, "description": req.query.description, "source": req.query.source, "step": req.query.step, "reason": req.query.reason, "payment_id": req.query.payment_id, "status": req.query.payment_status, "user_id": req.query.user_id, updated: new Date() }
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

module.exports = router;
