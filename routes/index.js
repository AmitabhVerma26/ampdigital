var express = require("express");
var passport = require("passport");
var router = express.Router();
var Contactuser = require("../models/contactuser");
var submission = require("../models/submission");
var lmsCourses = require("../models/courses");
var testimonial = require("../models/testimonial");
var simulatorpoint = require("../models/simulatorpoint");
var simulationppcad = require("../models/simulationppcad");
var lmsUsers = require("../models/user");
var blog = require("../models/blog");
var job = require("../models/job");
var bookdownload = require("../models/bookdownload");
var webinar = require("../models/webinar");
var moment = require("moment");
var aws = require("aws-sdk");
const {
  isLoggedIn,
  isAdmin,
  getusername,
  randomInteger,
} = require("../utils/common");
const dotenv = require("dotenv");
dotenv.config();

aws.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
});
var s3 = new aws.S3();
const fetch = require("node-fetch");
const Bluebird = require("bluebird");

fetch.Promise = Bluebird;
var awsSesMail = require("aws-ses-mail");
const {
  generateLexTemplate,
  getContactInformationHtml,
  getEbookTemplate,
} = require("../utils/html_templates");
const { getTestimonials } = require("../utils/testimonials");
const user = require("../models/user");

var sesMail = new awsSesMail();
var sesConfig = {
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
};
sesMail.setConfig(sesConfig);
const Recaptcha = require("express-recaptcha").RecaptchaV2;
const recaptcha = new Recaptcha(
  "6LdxRKMkAAAAAN549RxHHF7eqGCwmfAfEEreqiL8",
  process.env.GOOGLE_RECAPTCHA_SECRET_KEY,
);

/**
 * @swagger
 * /signin:
 *   get:
 *     summary: Sign In Page
 *     description: Render the sign-in page with optional referral code.
 *     tags: [Authentication]
 */
router.get("/signin", function (req, res) {
  if (req.isAuthenticated()) {
    res.redirect(req.session.returnTo);
  } else {
    res.render("signin", {
      signupMessage: req.flash("signupMessage"),
      forgotpassword: false,
      title: "Express",
    });
  }
});

/**
 * @swagger
 * /forgot-password:
 *   get:
 *     summary: Forgot Password
 *     description: Render the forgot password page with optional referral code.
 *     tags: [Authentication]
 */
router.get("/forgot-password", function (req, res) {
  if (req.isAuthenticated()) {
    res.redirect(req.session.returnTo);
  } else {
    res.render("signin", {
      signupMessage: req.flash("signupMessage"),
      forgotpassword: true,
      title: "Express",
    });
  }
});

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Passport Logout
 *     tags: [Authentication]
 */
router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

/**
 * @swagger
 * /auth:
 *   get:
 *     summary: Sign Up Page
 *     description: Render the sign-up page with optional reCAPTCHA verification.
 *     tags: [Authentication]
 */
router.get("/auth", function (req, res) {
  if (req.isAuthenticated()) {
    res.redirect(req.session.returnTo);
  } else {
    console.log(req.session.signupmsg);
    res.render("signup", {
      recaptcha: recaptcha,
      signupMessage: req.flash("signupMessage"),
      title: "Express",
    });
  }
});

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: User signup with reCAPTCHA verification
 *     tags: [Authentication]
 *     parameters:
 *       - in: formData
 *         name: g-recaptcha-response
 *         description: reCAPTCHA response key
 *         required: true
 *         type: string
 */
router.post(
  "/signup",
  function (req, res, next) {
    const response_key = req.body["g-recaptcha-response"];
    // Put secret key here, which we get from google console
    const secret_key = process.env.GOOGLE_RECAPTCHA_SECRET_KEY;

    // Hitting POST request to the URL, Google will
    // respond with success or error scenario.
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${response_key}`;

    // Making POST request to verify captcha
    fetch(url, {
      method: "post",
    })
      .then((response) => response.json())
      .then((google_response) => {
        // google_response is the object return by
        // google as a response
        if (google_response.success == true) {
          next();
        } else {
          res.redirect("/auth");
        }
      })
      .catch(() => {
        res.redirect("/auth");
      });
  },
  passport.authenticate("local-signup", {
    successRedirect: "/",
    failureRedirect: "/auth",
    failureFlash: true,
  }),
);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login with local authentication
 *     tags: [Authentication]
 *     parameters:
 *       - in: formData
 *         name: email
 *         description: User's email address
 *         required: true
 *         type: string
 *       - in: formData
 *         name: password
 *         description: User's password
 *         required: true
 *         type: string
 */
router.post(
  "/login",
  passport.authenticate("local-login", { failureRedirect: "/" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect(req.session.returnTo || "/");
    delete req.session.returnTo;
  },
);

/**
 * @swagger
 * /signup/course:
 *   post:
 *     summary: User signup for a course with local authentication
 *     tags: [Authentication]
 *     parameters:
 *       - in: formData
 *         name: studentcheckbox
 *         description: Flag indicating if the user is a student
 *         required: false
 *         type: boolean
 *       - in: formData
 *         name: path
 *         description: Path of the course
 *         required: true
 *         type: string
 *     responses:
 *       302:
 *         description: Redirect to the course page after successful signup
 */
router.post(
  "/signup/course",
  passport.authenticate("local-signup", { failureRedirect: "/" }),
  function (req, res) {
    console.log("_____req");
    console.log(req.body);
    if (req.body.studentcheckbox) {
      res.redirect(
        "/courses" + req.body.path + "?payment=true&studentcheckbox=true" ||
          "/",
      );
    } else {
      res.redirect("/courses" + req.body.path + "?payment=true" || "/");
    }
    // Successful authentication, redirect home.
    // delete req.session.returnTo;
  },
);


/**
 * @swagger
 * /signup/login:
 *   post:
 *     summary: User login with local authentication for course enrollment
 *     tags: [Authentication]
 *     parameters:
 *       - in: formData
 *         name: couponcodelogin
 *         description: Coupon code for login
 *         required: false
 *         type: string
 *       - in: formData
 *         name: alreadyenrolled
 *         description: Flag indicating if the user is already enrolled
 *         required: false
 *         type: string
 *       - in: formData
 *         name: studentcheckbox
 *         description: Flag indicating if the user is a student
 *         required: false
 *         type: boolean
 *       - in: formData
 *         name: path
 *         description: Path of the course
 *         required: true
 *         type: string
 *     responses:
 *       302:
 *         description: Redirect to the course page after successful login
 */

router.post(
  "/signup/login",
  passport.authenticate("local-login", {
    failureRedirect: "/courses/digital-marketing-course",
  }),
  function (req, res) {
    console.log("____ahipegaegreqihepqghiqpehgqpiehgqpeig");
    console.log(req.body);
    // Successful authentication, redirect home.
    var couponcode = "";
    if (req.body.couponcodelogin !== "") {
      couponcode = "&couponcode=" + req.body.couponcodelogin;
    }
    if (req.body.alreadyenrolled == "enrolled") {
      res.redirect(
        req.body.path + "?enrolled=true&payment=true" + couponcode || "/",
      );
    } else {
      if (req.body.studentcheckbox) {
        console.log("shouldcome here");
        res.redirect(
          req.body.path + "?payment=true&studentcheckbox=true" || "/",
        );
      } else {
        console.log("shouldnotcome here");

        res.redirect(req.body.path + "?payment=true" + couponcode || "/");
      }
    }
    delete req.session.returnTo;
  },
);

/**
 * @swagger
 * /:
 *   get:
 *     summary: Home Page
 *     description: Render the home page with course information, testimonials, and user details.
 *     tags: [Others]
 *     parameters:
 *       - in: query
 *         name: code
 *         description: Referral code (optional)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rendered home page
 *       500:
 *         description: Internal server error
 */
router.get("/", function (req, res) {
  req.session.returnTo = req.path;
  var testimonials = getTestimonials();
  lmsCourses.find(
    { deleted: { $ne: "true" }, course_live: "Live" },
    function (err, courses) {
      if(err){
        return res.status(500).json(err);
      }
      if (req.isAuthenticated()) {
        if (req.query.code) {
          res.render("index", {
            moment: moment,
            referralcode: req.query.code,
            courses: courses,
            testimonials: testimonials,
            success: "_",
            title: "Express",
            email: req.user.email,
            registered: req.user.courses.length > 0 ? true : false,
            recruiter: req.user.role && req.user.role == "3" ? true : false,
            name: getusername(req.user),
            notifications: req.user.notifications,
          });
        } else {
          res.render("index", {
            moment: moment,
            referralcode: "",
            courses: courses,
            testimonials: testimonials,
            success: "_",
            title: "Express",
            email: req.user.email,
            registered: req.user.courses.length > 0 ? true : false,
            recruiter: req.user.role && req.user.role == "3" ? true : false,
            name: getusername(req.user),
            notifications: req.user.notifications,
          });
        }
      } else {
        if (req.query.code) {
          res.render("index", {
            moment: moment,
            referralcode: req.query.code,
            courses: courses,
            testimonials: testimonials,
            success: "_",
            title: "Express",
          });
        } else {
          res.render("index", {
            moment: moment,
            referralcode: "",
            courses: courses,
            testimonials: testimonials,
            success: "_",
            title: "Express",
          });
        }
      }
    },
  );
});

/**
 * @swagger
 * /termsofservice:
 *   get:
 *     summary: Terms of Services
 *     description: Render the terms of services page with user details if authenticated.
 *     tags: [Others]
 */
router.get("/termsofservice", function (req, res) {
  req.session.returnTo = req.path;
  if (req.isAuthenticated()) {
    res.render("termsandconditions", {
      title: "Express",
      email: req.user.email,
      registered: req.user.courses.length > 0 ? true : false,
      recruiter: req.user.role && req.user.role == "3" ? true : false,
      name: getusername(req.user),
      notifications: req.user.notifications,
    });
  } else {
    res.render("termsandconditions", { title: "Express" });
  }
});

/**
 * @swagger
 * /privacypolicy:
 *   get:
 *     summary: Privacy Policy
 *     description: Render the privacy policy page with user details if authenticated.
 *     tags: [Others]
 */
router.get("/privacypolicy", function (req, res) {
  req.session.returnTo = req.path;
  if (req.isAuthenticated()) {
    res.render("privacypolicy", {
      title: "Express",
      email: req.user.email,
      registered: req.user.courses.length > 0 ? true : false,
      recruiter: req.user.role && req.user.role == "3" ? true : false,
      name: getusername(req.user),
      notifications: req.user.notifications,
    });
  } else {
    res.render("privacypolicy", { title: "Express" });
  }
});

/**
 * @swagger
 * /refund-policy:
 *   get:
 *     summary: Refund Policy
 *     description: Render the refund policy page with user details if authenticated.
 *     tags: [Others]
 */
router.get("/refund-policy", function (req, res) {
  req.session.returnTo = req.path;
  if (req.isAuthenticated()) {
    res.render("refundpolicy", {
      title: "Express",
      email: req.user.email,
      registered: req.user.courses.length > 0 ? true : false,
      recruiter: req.user.role && req.user.role == "3" ? true : false,
      name: getusername(req.user),
      notifications: req.user.notifications,
    });
  } else {
    res.render("refundpolicy", { title: "Express" });
  }
});

/**
 * @swagger
 * /career-counselling:
 *   get:
 *     summary: Career Counselling
 *     description: Render the career counselling page with user details if authenticated.
 *     tags: [Others]
 */
router.get("/career-counselling", function (req, res) {
  req.session.returnTo = req.path;
  if (req.isAuthenticated()) {
    res.render("careercounselling", {
      title: "Express",
      email: req.user.email,
      registered: req.user.courses.length > 0 ? true : false,
      recruiter: req.user.role && req.user.role == "3" ? true : false,
      name: getusername(req.user),
      notifications: req.user.notifications,
    });
  } else {
    res.render("careercounselling", { title: "Express" });
  }
});

/**
 * @swagger
 * /career-counselling/post-form:
 *   post:
 *     summary: Submit a form for career counselling
 *     description: |
 *       This endpoint processes form submissions related to career counselling.
 *       It checks the ReCAPTCHA response and sends an email notification.
 *     tags: [Others]
 *     parameters:
 *       - in: formData
 *         name: g-recaptcha-response
 *         description: ReCAPTCHA response
 *         type: string
 *         required: true
 *       - in: formData
 *         name: firstname
 *         description: First name
 *         type: string
 *         required: true
 *       - in: formData
 *         name: lastname
 *         description: Last name
 *         type: string
 *         required: true
 *       - in: formData
 *         name: email
 *         description: Email address
 *         type: string
 *         required: true
 *       - in: formData
 *         name: phone
 *         description: Phone number
 *         type: string
 *         required: true
 *       - in: formData
 *         name: message
 *         description: Query message
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Form submitted successfully
 *       302:
 *         description: Redirect to handle Captcha
 *       500:
 *         description: Internal server error
 */
router.post("/career-counselling/post-form", function (req, res) {
  if (req.body["g-recaptcha-response"] == "") {
    res.redirect("/career-counselling?captcha=false");
  } else {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var phone = req.body.phone;
    var message = req.body.message;

    var user = new Contactuser({
      name: firstname + " " + lastname,
      email: email,
      phone: phone,
      message: message,
    });

    user.save(function (err) {
      if (err) {
        return res.status(500).json(err);
      } else {
        var awsSesMail = require("aws-ses-mail");

        var sesMail = new awsSesMail();
        var sesConfig = {
          accessKeyId: process.env.ACCESS_KEY_ID,
          secretAccessKey: process.env.SECRET_ACCESS_KEY,
          region: process.env.REGION,
        };
        sesMail.setConfig(sesConfig);

        var html = `Hi Amitabh,
                <br><br>
                You have a new query from ${
                  firstname + " " + lastname
                } on Career counselling forum.
                <br><br>
                Details:
                <br><br>
                Email: ${email}
                <br>
                <br>
                Phone: ${phone}
                <br><br>
                Query: ${message}
                <br><br>
                regards,
                <br>
                ${getContactInformationHtml()} `;

        var options = {
          from: "ampdigital.co <amitabh@ads4growth.com>",
          to: "amitabh@ads4growth.com",
          replyToAddresses: [req.body.email],
          subject: `Career Counselling Query`,
          content: "<html><head></head><body>" + html + "</body></html>",
        };

        sesMail.sendEmail(options, function (err) {
          if(err){
            return res.status(500).json(err);
          }
          // TODO sth....
          if (err) {
            console.log(err);
          }
          res.redirect("/career-counselling?success=true");
        });
      }
    });
  }
});

/**
 * @swagger
 * /sitemap.xml:
 *   get:
 *     summary: Sitemap
 *     description: Generate and return the sitemap XML.
 *     tags: [Others]
 *     responses:
 *       200:
 *         description: Sitemap XML
 *       500:
 *         description: Internal server error
 */
router.get("/sitemap.xml", function (req, res) {
  webinar.find(
    { deleted: { $ne: "true" } },
    null,
    { sort: { date: -1 } },
    function (err, webinars) {
      if(err){
        return res.status(500).json(err);
      }
      blog.find(
        { deleted: { $ne: "true" } },
        null,
        { sort: { date: -1 } },
        function (err, blogs) {
          if(err){
            return res.status(500).json(err);
          }
          job.find(
            { deleted: { $ne: "true" }, approved: true },
            null,
            { sort: { date: -1 } },
            function (err, jobs) {
              if (blogs) {
                var root_path = "https://www.ampdigital.co/";
                var priority = 0.9;
                var freq = "daily";
                var xml =
                  '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
                var urls = [
                  "contact",
                  "courses/digital-marketing-course",
                  "courses/google-ads-certification-course",
                  "aboutus",
                  "webinars",
                  "blogs",
                  "courses",
                  "jobs",
                  "faqs",
                  "termsandconditions",
                  "privacypolicy",
                  "referrals",
                ];
                xml += "<url>";
                xml += "<loc> https://www.ampdigital.co </loc>";
                xml += "<changefreq>" + freq + "</changefreq>";
                xml += "<priority>" + 1 + "</priority>";
                xml += "</url>";
                for (var i in urls) {
                  xml += "<url>";
                  xml += "<loc>" + root_path + urls[i] + "</loc>";
                  xml += "<changefreq>" + freq + "</changefreq>";
                  xml += "<priority>" + 0.9 + "</priority>";
                  xml += "</url>";
                  i++;
                }
                for (var i = 0; i < blogs.length; i++) {
                  var url = "blogs" + "/" + blogs[i]["blogurl"];
                  url = url.replace(/[?=]/g, "");
                  xml += "<url>";
                  xml += "<loc>" + root_path + url + "</loc>";
                  xml += "<changefreq>never</changefreq>";
                  xml += "<priority>" + priority + "</priority>";
                  xml += "</url>";
                }
                for (var i = 0; i < webinars.length; i++) {
                  var url = "webinar" + "/" + webinars[i]["webinarurl"];
                  url = url.replace(/[?=]/g, "");
                  xml += "<url>";
                  xml += "<loc>" + root_path + url + "</loc>";
                  xml += "<changefreq>never</changefreq>";
                  xml += "<priority>" + priority + "</priority>";
                  xml += "</url>";
                }
                for (var i = 0; i < jobs.length; i++) {
                  var url =
                    "jobs" +
                    "/" +
                    jobs[i]["jobtitle"].replace(/\s+/g, "-").toLowerCase() +
                    "-" +
                    jobs[i]["_id"];
                  xml += "<url>";
                  xml += "<loc>" + root_path + url + "</loc>";
                  xml += "<changefreq>never</changefreq>";
                  xml += "<priority>" + priority + "</priority>";
                  xml += "</url>";
                }
                xml += "</urlset>";
                res.header("Content-Type", "text/xml");
                res.send(xml);
              } else {
                res.json("error");
              }
            },
          );
        },
      );
    },
  );
});

/**
 * @swagger
 * /blog/{blogurl}:
 *   get:
 *     summary: Redirect to Blog Post Page
 *     description: Redirect to the correct blog post page based on the provided blog URL.
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: blogurl
 *         description: Blog URL
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirect to the correct blog post page
 *       500:
 *         description: Internal server error
 */
router.get("/blog/:blogurl", function (req, res) {
  res.redirect(302, "/blogs/" + req.params.blogurl);
});


/**
 * @swagger
 * /faq:
 *   get:
 *     summary: FAQ Page
 *     tags: [Others]
 */
router.get("/faq", function (req, res) {
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
  let faqdocs = [
    {
      _id: { category: "Payment" },
      question: [
        "What payment options are available?",
        "How can I pay for my training?",
        "Can i get refund ?",
        "I am not able to make payment. What should I do now?",
        "Can i get refund ?",
        "How can I pay for my training?",
        "I am not able to make payment. What should I do now?",
        "What payment options are available?",
      ],
      answer: [
        "Payments can be made using any of the following options. You will be emailed a receipt after the payment is made:-\n<ul>\n<li>Credit or Debit card\n</li>\n<li>UPI \n</li>\n<li>Google Pay\n</li>\n<li>Net Banking</li>\n<li>Wallets like PayTM, PhonePay, OlaMoney</li>\n</ul>",
        "You can pay online through the payment gateway.",
        "Once Course is started, You can not get a refund.",
        "You could try making the payment from a different card or account (of a friend or family).\t\t",
        "Once Course is started, You can not get a refund.",
        "You can pay online through the payment gateway.",
        "You could try making the payment from a different card or account (of a friend or family).",
        "Payments can be made using any of the following options. You will be emailed a receipt after the payment is made:-\r\n\r\nCredit or Debit card\r\n\r\nUPI \r\n\r\nGoogle Pay\r\n\r\nNet Banking\r\nWallets like PayTM, PhonePay, OlaMoney\r\n",
      ],
    },
    {
      _id: { category: "About Course" },
      question: [
        "Can my course be extended?",
        "Do you provide any certificate?",
        "Do you provide any training material?",
        "Do you provide any certificate?",
        "Can my course be extended?",
        "Do you provide any training material?",
      ],
      answer: [
        "No, generally it is not extended.",
        "Yes, we do provide our own certification. Also, we will prepare you to get certified by Google.\nWe will provide a soft copy of your training certificate. You may download it and get it printed if required.\t\t\t\t\t",
        "Yes - there will be online material that will be provided through videos or pdf documents.\t\t",
        "Yes, we do provide our own certification. Also, we will prepare you to get certified by Google.\nWe will provide a soft copy of your training certificate. You may download it and get it printed if required.",
        "No, generally it is not extended.",
        "Yes, we do provide our own certification. Also, we will prepare you to get certified by Google.\r\nWe will provide a soft copy of your training certificate. You may download it and get it printed if required.",
      ],
    },
    {
      _id: { category: "Learning" },
      question: [
        "If I miss a class, do I get back up classes?",
        "How qualified is the faculty/trainers of your institute?",
        "What are the differences between your courses and that of other institutes?",
        "Who all can take-up digital marketing course?",
        "Will I become an expert when I go through these courses?",
        "How qualified is the faculty/trainers of your institute?",
        "If I miss a class, do I get back up classes?",
        "What are the differences between your courses and that of other institutes?",
        "Who all can take-up digital marketing course?",
        "Will I become an expert when I go through these courses?",
      ],
      answer: [
        "We record all the sessions, so that you can access the class recording if you miss the class.\t\t",
        "Our main faculty is Amitabh Verma, who spent more than 7 years at Google leading large teams of Googlers who supposed millions of advertisers across the globe. \t\t\t\t\t\t",
        "We have attempted to provide a very practice approach to Digital marketing by learning from the best in the business.\t\t\t",
        "Anyone interested can take up the course. Its not limited by your background.\t",
        "You can become an expert through your own hard work. But the course will surely get you started on your path to master Digital Marketing\t\t\t\t\t",
        "Our main faculty is Amitabh Verma, who spent more than 7 years at Google leading large teams of Googlers who supposed millions of advertisers across the globe.",
        "We record all the sessions, so that you can access the class recording if you miss the class.",
        "We have attempted to provide a very practice approach to Digital marketing by learning from the best in the business.",
        "Anyone interested can take up the course. Its not limited by your background.",
        "You can become an expert through your own hard work. But the course will surely get you started on your path to master Digital Marketing",
      ],
    },
  ];
  if (req.isAuthenticated()) {
    res.render("faq", {
      faqdocs: faqdocs,
      title: "Express",
      email: req.user.email,
      registered: req.user.courses.length > 0 ? true : false,
      recruiter: req.user.role && req.user.role == "3" ? true : false,
      name: getusername(req.user),
      notifications: req.user.notifications,
    });
  } else {
    res.render("faq", { faqdocs: faqdocs, title: "Express" });
  }
  // });
});

/**
 * @swagger
 * /admin:
 *   get:
 *     summary: Admin Page
 *     tags: [Others]
 */
router.get("/admin", isAdmin, function (req, res) {
  lmsCourses.find({ deleted: { $ne: "true" } }, function (err, courses) {
    res.render("adminpanel/payments", {
      courses: courses,
      email: req.user.email,
      registered: req.user.courses.length > 0 ? true : false,
      recruiter: req.user.role && req.user.role == "3" ? true : false,
      moment: moment,
    });
  });
});

/**
 * @swagger
 * /ebook:
 *   post:
 *     summary: Save ebook download information
 *     tags: [Others]
 *     parameters:
 *       - in: body
 *         name: ebookInfo
 *         description: Information for ebook download
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             firstname:
 *               type: string
 *             lastname:
 *               type: string
 *             phonenumber:
 *               type: string
 *             countrycode:
 *               type: string
 *             email:
 *               type: string
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal server error
 */
router.post("/ebook", function (req, res) {
  var bookdownloadModel = new bookdownload({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    phonenumber: req.body.phonenumber,
    countrycode: req.body.countrycode,
    email: req.body.email,
    date: new Date(),
  });
  if (req.body.firstname == "James") {
    res.json('Book sent');
    return;
  }
  bookdownloadModel.save(function (err) {
    if (err) {
      return res.status(500).json(err);
    } else {
      var awsSesMail = require("aws-ses-mail");
      var sesMail = new awsSesMail();
      var sesConfig = {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
        region: process.env.REGION,
      };
      sesMail.setConfig(sesConfig);

      var html = getEbookTemplate(req.body.firstname);
      var options = {
        from: "ampdigital.co <amitabh@ads4growth.com>",
        to: req.body.email,
        subject: "ampdigital.co: Your book is ready to download",
        content: "<html><head></head><body>" + html + "</body></html>",
      };

      var Sendy = require("sendy-api"),
        sendy = new Sendy(
          "http://sendy.ampdigital.co/",
          "tyYabXqRCZ8TiZho0xtJ",
        );

      sesMail.sendEmail(options, function (err) {
        // TODO sth....
        console.log(err);
        sendy.subscribe(
          {
            api_key: "tyYabXqRCZ8TiZho0xtJ",
            name: req.body.firstname + " " + req.body.lastname,
            email: req.body.email,
            list_id: "ooYQ0ziAX892wi1brSgIj1uA",
          },
          function () {
            sendy.subscribe(
              {
                api_key: "tyYabXqRCZ8TiZho0xtJ",
                name: req.body.firstname + " " + req.body.lastname,
                email: req.body.email,
                list_id: "763VYAUcr3YYkNmJQKawPiXg",
              },
              function () {
                res.json('Book sent');
              },
            );
          },
        );
      });
    }
  });
});

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: |
 *       Retrieves user data based on the provided user ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: User ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - user not logged in
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get("/user/:id", isLoggedIn, function (req, res) {
  user.findById(req.params.id, function (err, user) {
    if (err) {
      res.status(500).json({ error: "Internal Server Error" });
    } else if (!user) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.json(user);
    }
  });
});

/**
 * @swagger
 * /manage/bookdownloads:
 *   get:
 *     summary: Get all book downloads (Admin only)
 *     tags: [Others]
 */
router.get("/manage/bookdownloads", isAdmin, function (req, res) {
  bookdownload.find({}, function (err, docs) {
    res.render("adminpanel/bookdownload", {
      email: req.user.email,
      registered: req.user.courses.length > 0 ? true : false,
      recruiter: req.user.role && req.user.role == "3" ? true : false,
      name: getusername(req.user),
      notifications: req.user.notifications,
      docs: docs,
      moment: moment,
    });
  });
});

/**
 * @swagger
 * /contact-requests:
 *   get:
 *     summary: Get all contact requests (Admin only)
 *     tags: [Others]
 */
router.get("/contact-requests", isAdmin, function (req, res) {
  Contactuser.find({}, function (err, docs) {
    res.render("adminpanel/contact_requests", {
      docs: docs,
      email: req.user.email,
    });
  });
});

/**
 * @swagger
 * /lexmail:
 *   post:
 *     summary: Send an email using AWS SES for Lex communication
 *     tags: [Others]
 *     parameters:
 *       - in: formData
 *         name: Name
 *         description: Sender's name
 *         required: true
 *         type: string
 *       - in: formData
 *         name: Email
 *         description: Sender's email address
 *         required: true
 *         type: string
 *       - in: formData
 *         name: Phone
 *         description: Sender's phone number
 *         required: true
 *         type: string
 *       - in: formData
 *         name: Question
 *         description: Sender's question
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Email sent successfully
 *       500:
 *         description: Internal Server Error - Failed to send email
 *         content:
 *           application/json:
 *             example:
 *               error: Failed to send email
 */
router.post("/lexmail", function (req, res) {
  var awsSesMail = require("aws-ses-mail");

  var sesMail = new awsSesMail();
  var sesConfig = {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION,
  };
  sesMail.setConfig(sesConfig);

  // Example usage:
  const templateData = {
    Name: req.body.Name,
    Email: req.body.Email,
    Phone: req.body.Phone,
    Question: req.body.Question,
  };

  const html = generateLexTemplate(templateData);

  var options = {
    from: "ampdigital.co <amitabh@ads4growth.com>",
    to: "amitabh@ads4growth.com",
    replyToAddresses: [req.body.Email],
    subject: `Chat Query`,
    content: "<html><head></head><body>" + html + "</body></html>",
  };

  sesMail.sendEmail(options, function (err, data) {
    // TODO sth....
    if (err) {
      res.status(500).json({ error: "Failed to send email" });
      console.log(err);
    }
    res.json(data);
  });
});

/**
 * @swagger
 * /userexistsindatabase:
 *   get:
 *     summary: Check if a user exists in the database and verify credentials
 *     tags: [Others]
 *     parameters:
 *       - in: query
 *         name: email
 *         description: User's email address
 *         required: true
 *         type: string
 *       - in: query
 *         name: password
 *         description: User's password
 *         required: true
 *         type: string
 *       - in: query
 *         name: courseid
 *         description: ID of the course
 *         required: true
 *         type: string
 */
router.get("/userexistsindatabase", function (req, res) {
  lmsUsers.findOne({ email: req.query.email }, function (err, user) {
    if (user) {
      if (user.validPassword(req.query.password)) {
        if (
          typeof user.courses !== "undefined" &&
          user.courses.indexOf(req.query.courseid) !== -1
        ) {
          res.json(4);
        } else {
          res.json(2);
        }
      } else {
        res.json(3);
      }
    } else {
      res.json(false);
    }
  });
});

/**
 * @swagger
 * /signupsimulationtool:
 *   post:
 *     summary: User signup for a simulation tool with local authentication
 *     tags: [Simulation Tool]
 *     parameters:
 *       - in: formData
 *         name: answers2
 *         description: JSON string containing simulation tool answers
 *         required: true
 *         type: string
 *     responses:
 *       302:
 *         description: Redirect to the simulation tool result page after successful signup
 */
router.post(
  "/signupsimulationtool",
  passport.authenticate("local-signup", { failureRedirect: "/" }),
  function (req, res) {
    // res.json(req.body);
    var id = JSON.parse(req.body.answers2).id;
    var result = JSON.parse(req.body.answers2);
    var totalpoints = parseInt(result.totalpoints);
    // res.json(totalpoints);
    var name =
      req.user.local.name +
      " " +
      (req.user.local.lastname ? req.user.local.lastname : "");
    var email = req.user.email;
    simulatorpoint.count({ email: email }, function (err, count2) {
      simulatorpoint.count({ email: email, id: id }, function (err, count) {
        console.log("haoieghaeg");
        console.log(count);
        if (count > 0) {
          simulatorpoint.update(
            {
              id: id,
              email: email,
            },
            {
              $set: {
                name: name,
                totalpoints: totalpoints,
                input1: req.session.input1,
                input2: req.session.input2,
                input3: req.session.input3,
                input4: req.session.input4,
                input5: req.session.input5,
                input6: req.session.input6,
                date: new Date(),
              },
            },
            function (err) {
              if (err) {
                res.redirect("/");
              } else {
                simulatorpoint.aggregate(
                  [
                    {
                      $group: {
                        _id: "$name",
                        value: { $max: "$totalpoints" },
                      },
                    },
                    { $sort: { value: -1 } },
                  ],
                  function (err, leaderboard) {
                    var retry = true;
                    res.render("simulatortoolresult", {
                      leaderboard: leaderboard,
                      id: id,
                      retry: retry,
                      moment: moment,
                      title: result.title,
                      content: result.content,
                      email: req.user.email,
                      registered: req.user.courses.length > 0 ? true : false,
                      recruiter:
                        req.user.role && req.user.role == "3" ? true : false,
                      name: getusername(req.user),
                      notifications: req.user.notifications,
                    });
                  },
                );
              }
            },
          );
        } else if (count == 0) {
          var simulatorpoint2 = new simulatorpoint({
            totalpoints: totalpoints,
            input1: req.session.input1,
            input2: req.session.input2,
            input3: req.session.input3,
            input4: req.session.input4,
            input5: req.session.input5,
            input6: req.session.input6,
            name: name,
            email: email,
            id: id,
            date: new Date(),
          });
          simulatorpoint2.save(function (err) {
            if (err) {
              res.redirect("/");
            } else {
              simulatorpoint.aggregate(
                [
                  {
                    $group: {
                      _id: "$name",
                      value: { $max: "$totalpoints" },
                    },
                  },
                  { $sort: { value: -1 } },
                ],
                function (err, leaderboard) {
                  var retry = false;
                  if (count2 < 2) {
                    retry = true;
                  }
                  res.render("simulatortoolresult", {
                    leaderboard: leaderboard,
                    id: id,
                    retry: retry,
                    moment: moment,
                    title: result.title,
                    content: result.content,
                    email: req.user.email,
                    registered: req.user.courses.length > 0 ? true : false,
                    recruiter:
                      req.user.role && req.user.role == "3" ? true : false,
                    name: getusername(req.user),
                    notifications: req.user.notifications,
                  });
                },
              );
            }
          });
        } else {
          res.redirect("/");
        }
      });
    });
  },
);

/**
 * Google Ads Simulator Tool
 */
router.get("/tools/google-ads-simulator", function (req, res) {
  req.session.returnTo = req.path;
  simulatorpoint.aggregate(
    [
      {
        $group: {
          _id: "$name",
          value: { $max: "$totalpoints" },
        },
      },
      { $sort: { value: -1 } },
    ],
    function (err, leaderboard) {
      if (req.isAuthenticated()) {
        var toolids = [];
        simulatorpoint.find({ email: req.user.email }, function (err, docs) {
          for (var i = 0; i < docs.length; i++) {
            toolids.push(docs[i]["id"]);
          }
          res.render("simulatorgoogleads", {
            leaderboard: leaderboard,
            loggedin: "true",
            toolids: toolids.join(","),
            title: "Express",
            active: "all",
            moment: moment,
            email: req.user.email,
            registered: req.user.courses.length > 0 ? true : false,
            recruiter: req.user.role && req.user.role == "3" ? true : false,
            name: getusername(req.user),
            notifications: req.user.notifications,
          });
        });
      } else {
        res.render("simulatorgoogleads", {
          leaderboard: leaderboard,
          loggedin: "false",
          toolids: "",
          title: "Express",
          active: "all",
          moment: moment,
        });
      }
    },
  );
});

router.post("/testimonialimageuploadons3", function (req, res) {
  var moduleid = req.body.moduleid;
  var bucketParams = { Bucket: "ampdigital" };
  s3.createBucket(bucketParams);
  var s3Bucket = new aws.S3({ params: { Bucket: "ampdigital" } });
  // res.json('succesfully uploaded the image!');
  if (!req.files) {
    // res.json('NO');
  } else {
    var imageFile = req.files.avatar;
    var data = { Key: imageFile.name, Body: imageFile.data };
    s3Bucket.putObject(data, function (err) {
      if (err) {
        res.json(err);
      } else {
        var urlParams = { Bucket: "ampdigital", Key: imageFile.name };
        s3Bucket.getSignedUrl("getObject", urlParams, function (err, url) {
          if (err) {
            res.json(err);
          } else {
            testimonial.update(
              {
                _id: moduleid,
              },
              {
                $set: { image: url },
              },
              function (err) {
                if (err) {
                  res.json(err);
                } else {
                  res.json("Success: Image Uploaded!");
                }
              },
            );
          }
        });
      }
    });
    // res.json(imageFile);
  }
});

router.post(
  "/tools/google-ads-simulator",
  function (req, res, next) {
    if (!req.isAuthenticated()) {
      next();
    } else {
      console.log("__haiephaegi");
      var id = JSON.parse(req.body.answers).id;
      var result = JSON.parse(req.body.answers);
      var totalpoints = parseInt(result.totalpoints);
      // res.json(totalpoints);
      var name =
        req.user.local.name +
        " " +
        (req.user.local.lastname ? req.user.local.lastname : "");
      var email = req.user.email;
      simulatorpoint.count({ email: email }, function (err, count2) {
        simulatorpoint.count({ email: email, id: id }, function (err, count) {
          if (count > 0) {
            simulatorpoint.update(
              {
                id: id,
                email: email,
              },
              {
                $set: {
                  name: name,
                  totalpoints: totalpoints,
                  input1: req.session.input1,
                  input2: req.session.input2,
                  input3: req.session.input3,
                  input4: req.session.input4,
                  input5: req.session.input5,
                  input6: req.session.input6,
                  date: new Date(),
                },
              },
              function () {
                simulatorpoint.aggregate(
                  [
                    {
                      $group: {
                        _id: "$name",
                        value: { $max: "$totalpoints" },
                      },
                    },
                    { $sort: { value: -1 } },
                  ],
                  function (err, leaderboard) {
                    if (err) {
                      return res.redirect("/");
                    } else {
                      var retry = true;
                      res.render("simulatortoolresult", {
                        leaderboard: leaderboard,
                        id: id,
                        retry: retry,
                        moment: moment,
                        title: result.title,
                        content: result.content,
                        email: req.user.email,
                        registered: req.user.courses.length > 0 ? true : false,
                        recruiter:
                          req.user.role && req.user.role == "3" ? true : false,
                        name: getusername(req.user),
                        notifications: req.user.notifications,
                      });
                      return;
                    }
                  },
                );
              },
            );
          } else if (count == 0) {
            var simulatorpoint2 = new simulatorpoint({
              totalpoints: totalpoints,
              input1: req.session.input1,
              input2: req.session.input2,
              input3: req.session.input3,
              input4: req.session.input4,
              input5: req.session.input5,
              input6: req.session.input6,
              name: name,
              email: email,
              id: id,
              date: new Date(),
            });
            simulatorpoint2.save(function (err) {
              if (err) {
                res.redirect("/");
                return;
              } else {
                simulatorpoint.aggregate(
                  [
                    {
                      $group: {
                        _id: "$name",
                        value: { $max: "$totalpoints" },
                      },
                    },
                    { $sort: { value: -1 } },
                  ],
                  function (err, leaderboard) {
                    var retry = false;
                    if (count2 < 2) {
                      retry = true;
                    }
                    res.render("simulatortoolresult", {
                      leaderboard: leaderboard,
                      id: id,
                      retry: retry,
                      moment: moment,
                      title: result.title,
                      content: result.content,
                      email: req.user.email,
                      registered: req.user.courses.length > 0 ? true : false,
                      recruiter:
                        req.user.role && req.user.role == "3" ? true : false,
                      name: getusername(req.user),
                      notifications: req.user.notifications,
                    });
                    return;
                  },
                );
              }
            });
          } else {
            res.redirect("/");
            return;
          }
        });
      });
    }
  },
  passport.authenticate("local-login", { failureRedirect: "/" }),
  function (req, res) {
    var id = JSON.parse(req.body.answers).id;
    var result = JSON.parse(req.body.answers);
    var totalpoints = result.totalpoints;
    // res.json(totalpoints);
    var name =
      req.user.local.name +
      " " +
      (req.user.local.lastname ? req.user.local.lastname : "");
    var email = req.user.email;
    simulatorpoint.count({ email: email }, function (err, count2) {
      simulatorpoint.count({ email: email, id: id }, function (err, count) {
        console.log("haoieghaeg");
        console.log(count);
        if (count > 0) {
          simulatorpoint.update(
            {
              id: id,
              email: email,
            },
            {
              $set: {
                name: name,
                totalpoints: totalpoints,
                date: new Date(),
                input1: req.session.input1,
                input2: req.session.input2,
                input3: req.session.input3,
                input4: req.session.input4,
                input5: req.session.input5,
                input6: req.session.input6,
              },
            },
            function (err) {
              if (err) {
                res.redirect("/");
              } else {
                simulatorpoint.aggregate(
                  [
                    {
                      $group: {
                        _id: "$name",
                        value: { $max: "$totalpoints" },
                      },
                    },
                    { $sort: { value: -1 } },
                  ],
                  function (err, leaderboard) {
                    var retry = true;
                    res.render("simulatortoolresult", {
                      leaderboard: leaderboard,
                      id: id,
                      retry: retry,
                      moment: moment,
                      title: result.title,
                      content: result.content,
                      email: req.user.email,
                      registered: req.user.courses.length > 0 ? true : false,
                      recruiter:
                        req.user.role && req.user.role == "3" ? true : false,
                      name: getusername(req.user),
                      notifications: req.user.notifications,
                    });
                  },
                );
              }
            },
          );
        } else if (count == 0) {
          var simulatorpoint2 = new simulatorpoint({
            totalpoints: totalpoints,
            name: name,
            email: email,
            id: id,
            input1: req.session.input1,
            input2: req.session.input2,
            input3: req.session.input3,
            input4: req.session.input4,
            input5: req.session.input5,
            input6: req.session.input6,
            date: new Date(),
          });
          simulatorpoint2.save(function (err) {
            if (err) {
              res.redirect("/");
            } else {
              simulatorpoint.aggregate(
                [
                  {
                    $group: {
                      _id: "$name",
                      value: { $max: "$totalpoints" },
                    },
                  },
                  { $sort: { value: -1 } },
                ],
                function (err, leaderboard) {
                  var retry = false;
                  if (count2 < 2) {
                    retry = true;
                  }
                  res.render("simulatortoolresult", {
                    leaderboard: leaderboard,
                    id: id,
                    retry: retry,
                    moment: moment,
                    title: result.title,
                    content: result.content,
                    email: req.user.email,
                    registered: req.user.courses.length > 0 ? true : false,
                    recruiter:
                      req.user.role && req.user.role == "3" ? true : false,
                    name: getusername(req.user),
                    notifications: req.user.notifications,
                  });
                },
              );
            }
          });
        } else {
          res.redirect("/");
        }
      });
    });
  },
);

router.get("/ppcsimulationtool", function (req, res) {
  req.session.returnTo = req.path;
  var query = {};
  const { ObjectId } = require("mongodb"); // or ObjectID
  const safeObjectId = (s) => (ObjectId.isValid(s) ? new ObjectId(s) : null);

  if (req.query.query_id) {
    query = { _id: safeObjectId(req.query.query_id) };
  } else if (req.query.ids) {
    var ids = req.query.ids.split(",");
    if (typeof ids !== "undefined" && ids && ids.length < 3) {
      var idarray = [];
      for (var i = 0; i < ids.length; i++) {
        idarray.push(safeObjectId(ids[i]));
      }
      query = { _id: { $nin: idarray } };
    } else if (typeof ids !== "undefined" && ids && ids.length == 3) {
      query = query;
    } else {
      query = { _id: { $ne: safeObjectId(req.query.ids) } };
    }
  }
  simulationppcad.find(query, function (err, tools) {
    if (tools && tools.length > 0) {
      res.json(tools[randomInteger(0, tools.length - 1)]);
    } else {
      res.json(-1);
    }
  });
});

router.get("/ppcanswers", function (req, res) {
  req.session.returnTo = req.path;
  const { ObjectId } = require("mongodb"); // or ObjectID
  const safeObjectId = (s) => (ObjectId.isValid(s) ? new ObjectId(s) : null);

  simulationppcad.find(
    { _id: safeObjectId(req.query.id) },
    { question1answer: 1, question2answer: 1, question3answer: 1 },
    function (err, tool) {
      if (tool) {
        res.json(tool[0]);
      } else {
        res.json(-1);
      }
    },
  );
});

router.get("/ppcanswersofuser", function (req, res) {
  var email = req.query.email;
  var id = req.query.id;
  simulatorpoint.findOne({ email: email, id: id }, function (err, doc) {
    if (doc) {
      res.json(doc);
    } else {
      res.json(-1);
    }
  });
});

router.post("/checkanswers", function (req, res) {
  const { ObjectId } = require("mongodb"); // or ObjectID
  const safeObjectId = (s) => (ObjectId.isValid(s) ? new ObjectId(s) : null);
  simulationppcad.findOne(
    { _id: safeObjectId(req.body.id) },
    {
      question1answer: 1,
      question2answer: 1,
      question3answer: 1,
      question4answer: 1,
      question5answer: 1,
      question6answer: 1,
    },
    function (err, tool) {
      if (tool) {
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
        if (input4 == question4answer) {
          points4 = points4 + 5;
          tips2 =
            tips2 +
            `<td>
                  Answer 1, ${input4}
                                  </td>
                                  <td>
                                    <span style="color: #28a745;"> Perfect answer</span>
                                    </td>
                              </tr>`;
        } else {
          console.log("input4");
          console.log(input4);
          console.log(question4answer);
          tips2 =
            tips2 +
            `<td>
                Answer 1, ${input4}
                                </td>
                                <td>
                                <span style="color: #dc3545;"> Incorrect answer, Try again</span>
                                </td>
                            </tr>`;
        }
        if (input5 == question5answer) {
          points5 = points5 + 5;
          tips2 =
            tips2 +
            `<td>
                  Answer 2, ${input5}
                                  </td>
                                  <td>
                                    <span style="color: #28a745;"> Perfect answer</span>
                                    </td>
                              </tr>`;
        } else {
          tips2 =
            tips2 +
            `<td>
                Answer 2, ${input5}
                                </td>
                                <td>
                                <span style="color: #dc3545;"> Incorrect answer, Try again</span>
                                </td>
                            </tr>`;
        }
        if (input6 == question6answer) {
          points6 = points6 + 5;
          tips2 =
            tips2 +
            `<td>
                  Answer 3, ${input6}
                                  </td>
                                  <td>
                                    <span style="color: #28a745;"> Perfect answer</span>
                                    </td>
                              </tr>`;
        } else {
          tips2 =
            tips2 +
            `<td>
                Answer 3, ${input6}
                                </td>
                                <td>
                                <span style="color: #dc3545;"> Incorrect answer, Try again</span>
                                </td>
                            </tr>`;
        }
        if (input1[0] == question1answer[0]) {
          points1a = points1a + 15;
          tips =
            tips +
            `<strong>Answer 1, ${input1[0]}</strong>: <span style="color: #28a745;">20 Points, Perfect answer</span><br>`;
          tips2 =
            tips2 +
            `<td>
                Answer 4, ${input1[0]}
                                </td>
                                <td>
                                  <span style="color: #28a745;"> Perfect answer</span>
                                  </td>
                            </tr>`;
        } else if (input1[0] == question1answer[1]) {
          points1a = points1a + 5;
          tips =
            tips +
            `<strong>Answer 1, ${input1[0]}</strong>: <span style="color: #17a2b8;">10 Points, Great answer but it should not be the first choice. Try again by reordering.</span><br>`;
          tips2 =
            tips2 +
            `<td>
                Answer 4, ${input1[0]}
                                </td>
                                <td>
                                  <span style="color: #17a2b8;"> Great answer but it should not be the first choice. Try again by reordering.</span>
                                  </td>
                            </tr>`;
        } else if (input1[0] == question1answer[2]) {
          points1a = points1a + 5;
          tips =
            tips +
            `<strong>Answer 1, ${input1[0]}</strong>: <span style="color: #17a2b8;">10 Points, Great answer but it should not be the first choice. Try again by reordering.</span><br>`;
          tips2 =
            tips2 +
            `<td>
                Answer 4, ${input1[0]}
                                </td>
                                <td>
                                  <span style="color: #17a2b8;"> Great answer but it should not be the first choice. Try again by reordering.</span>
                                  </td>
                            </tr>`;
        } else {
          tips =
            tips +
            `<strong>Answer 1, ${input1[0]}</strong>: <span style="color: #dc3545;">0 Points, Incorrect answer, Try again</span><br>`;
          tips2 =
            tips2 +
            `<td>
                Answer 4, ${input1[0]}
                                </td>
                                <td>
                                  <span style="color: #dc3545;"> Incorrect answer, Try again</span>
                                  </td>
                            </tr>`;
        }
        if (input1[1] == question1answer[0]) {
          points1a = points1a + 5;
          tips =
            tips +
            `<strong>${input1[1]}</strong>: <span style="color: #17a2b8;">10 Points, Great answer but it should not be the second choice. Try again by reordering.</span><br>`;
          tips2 =
            tips2 +
            `<td>
                Answer 4, ${input1[1]}
                                </td>
                                <td>
                                  <span style="color: #17a2b8;"> Great answer but it should not be the second choice. Try again by reordering.</span>
                                  </td>
                            </tr>`;
        } else if (input1[1] == question1answer[1]) {
          points1a = points1a + 15;
          tips =
            tips +
            `<strong>${input1[1]}</strong>: <span style="color: #28a745;">20 Points, Perfect answer</span><br>`;
          tips2 =
            tips2 +
            `<td>
                Answer 4, ${input1[1]}
                                </td>
                                <td>
                                  <span style="color: #28a745;"> Perfect answer</span>
                                  </td>
                            </tr>`;
        } else if (input1[1] == question1answer[2]) {
          points1a = points1a + 5;
          tips =
            tips +
            `<strong>${input1[1]}</strong>: <span style="color: #17a2b8;">10 Points, Great answer but it should not be the second choice. Try again by reordering.</span><br>`;
          tips2 =
            tips2 +
            `<td>
                Answer 4, ${input1[1]}
                                </td>
                                <td>
                                  <span style="color: #17a2b8;"> Great answer but it should not be the second choice. Try again by reordering.</span>
                                  </td>
                            </tr>`;
        } else {
          tips =
            tips +
            `<strong>${input1[1]}</strong>: <span style="color: #dc3545;">0 Points, Incorrect answer, Try again</span><br>`;
          tips2 =
            tips2 +
            `<td>
                Answer 4, ${input1[1]}
                                </td>
                                <td>
                                  <span style="color: #dc3545;"> Incorrect answer, Try again</span>
                                  </td>
                            </tr>`;
        }
        if (input1[2] == question1answer[0]) {
          points1a = points1a + 5;
          tips =
            tips +
            `<strong>Answer 1, ${input1[2]}</strong>: <span style="color: #17a2b8;">10 Points, Great answer but it should not be the third choice. Try again by reordering.</span><br>`;
          tips2 =
            tips2 +
            `<td>
                Answer 4, ${input1[2]}
                                </td>
                                <td>
                                  <span style="color: #17a2b8;"> Great answer but it should not be the third choice. Try again by reordering.</span>
                                  </td>
                            </tr>`;
        } else if (input1[2] == question1answer[1]) {
          points1a = points1a + 5;
          tips =
            tips +
            `<strong>${input1[2]}</strong>: <span style="color: #17a2b8;">10 Points, Great answer but it should not be the third choice. Try again by reordering.</span><br>`;
          tips2 =
            tips2 +
            `<td>
                Answer 4, ${input1[2]}
                                </td>
                                <td>
                                  <span style="color: #17a2b8;"> Great answer but it should not be the third choice. Try again by reordering.</span>
                                  </td>
                            </tr>`;
        } else if (input1[2] == question1answer[2]) {
          points1a = points1a + 15;
          tips =
            tips +
            `<strong>${input1[2]}</strong>: <span style="color: #28a745;">20 Points, Perfect answer</span><br>`;
          tips2 =
            tips2 +
            `<td>
                Answer 4, ${input1[2]}
                                </td>
                                <td>
                                  <span style="color: #28a745;"> Perfect answer</span>
                                  </td>
                            </tr>`;
        } else {
          tips =
            tips +
            `<strong>${input1[2]}</strong>: <span style="color: #dc3545;">0 Points, Incorrect answer, Try again</span><br>`;
          tips2 =
            tips2 +
            `<td>
                Answer 4, ${input1[2]}
                                </td>
                                <td>
                                  <span style="color: #dc3545;"> Incorrect answer, Try again</span>
                                  </td>
                            </tr>`;
        }
        if (input2 == question2answer) {
          points2 = points2 + 15;
          tips =
            tips +
            `<strong>Answer 2, ${input2}</strong>: <span style="color: #28a745;">20 Points, Perfect answer</span><br>`;
          tips2 =
            tips2 +
            `<td>
                Answer 5, ${input2}
                                </td>
                                <td>
                                  <span style="color: #28a745;"> Perfect answer</span>
                                  </td>
                            </tr>`;
        } else {
          tips =
            tips +
            `<strong>Answer 2, ${input2}</strong>: <span style="color: #dc3545;">0 Points, Incorrect answer, Try again</span><br>`;
          tips2 =
            tips2 +
            `<td>
                Answer 5, ${input2}
                                </td>
                                <td>
                                  <span style="color: #dc3545;"> Incorrect answer, Try again</span>
                                  </td>
                            </tr>`;
        }
        if (
          input3[0] == question3answer[0] ||
          input3[0] == question3answer[1]
        ) {
          points3 = points3 + 5;
          tips =
            tips +
            `<strong>Answer 3, ${input3[0]}</strong>: <span style="color: #28a745;">20 Points, Perfect answer</span><br>`;
          tips2 =
            tips2 +
            `<td>
                Answer 6, ${input3[0]}
                                </td>
                                <td>
                                  <span style="color: #28a745;"> Perfect answer</span>
                                  </td>
                            </tr>`;
        } else {
          tips =
            tips +
            `<strong>Answer 3, ${input3[0]}</strong>: <span style="color: #dc3545;">0 Points, Incorrect answer, Try again</span><br>`;
          tips2 =
            tips2 +
            `<td>
                Answer 6, ${input3[0]}
                                </td>
                                <td>
                                  <span style="color: #dc3545;"> Incorrect answer, Try again</span>
                                  </td>
                            </tr>`;
        }
        if (
          input3[1] == question3answer[0] ||
          input3[1] == question3answer[1]
        ) {
          points3 = points3 + 5;
          tips =
            tips +
            `<strong>Answer 1, ${input3[1]}</strong>: <span style="color: #17a2b8;">10 Points, Great answer but it should not be the first choice. Try again by reordering.</span><br>`;
          tips2 =
            tips2 +
            `<td>
                Answer 6, ${input3[1]}
                                </td>
                                <td>
                                  <span style="color: #28a745;"> Perfect answer</span>
                                  </td>
                            </tr>`;
        } else {
          tips =
            tips +
            `<strong>Answer 3, ${input3[1]}</strong>: <span style="color: #dc3545;">0 Points, Incorrect answer, Try again</span><br>`;
          tips2 =
            tips2 +
            `<td>
                Answer 6, ${input3[1]}
                                </td>
                                <td>
                                  <span style="color: #dc3545;"> Incorrect answer, Try again</span>
                                  </td>
                            </tr>`;
        }
        var totalpoints =
          points1a +
          points1b +
          points1c +
          points2 +
          points3 +
          points4 +
          points5 +
          points6;
        var title;
        if (totalpoints < 15) {
          title = "You are a Newbie";
        } else if (totalpoints > 14 && totalpoints < 40) {
          title = "You are a Novice";
        } else if (totalpoints > 39 && totalpoints < 60) {
          title = "You are a Learner";
        } else if (totalpoints > 59 && totalpoints < 60) {
          title = "You are a Competent";
        } else if (totalpoints > 59 && totalpoints < 70) {
          title = "You are an Achiever!";
        } else if (totalpoints > 69 && totalpoints < 80) {
          title = "You are Proficient!";
        } else if (totalpoints > 79 && totalpoints < 90) {
          title = "You are an Expert!";
        } else if (totalpoints > 89 && totalpoints < 101) {
          title = "You are a Champion!";
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
        if (!req.isAuthenticated()) {
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
            columnClass: "xlarge",
          });
        } else {
          req.session.input1 = req.body["input1[]"];
          req.session.input2 = req.body.input2;
          req.session.input3 = req.body["input3[]"];
          req.session.input4 = req.body.input4;
          req.session.input5 = req.body.input5;
          req.session.input6 = req.body.input6;
          console.log("__aehigaehgp");
          simulatorpoint.count(
            { email: req.user.email, id: req.body.id },
            function () {
              if (1) {
                simulatorpoint.update(
                  {
                    id: req.body.id,
                    email: req.user.email,
                  },
                  {
                    $set: {
                      totalpoints: totalpoints,
                      input1: req.body["input1[]"],
                      input2: req.body.input2,
                      name:
                        req.user.local.name +
                        " " +
                        (req.user.local.lastname
                          ? req.user.local.lastname
                          : ""),
                      id: req.body.id,
                      email: req.user.email,
                      input3: req.body["input3[]"],
                      input4: req.body.input4,
                      input5: req.body.input5,
                      input6: req.body.input6,
                      date: new Date(),
                    },
                  },
                  { upsert: true },
                  function (err) {
                    if (err) {
                      res.json(err);
                    } else {
                      res.json({
                        totalpoints: totalpoints,
                        title: title,
                        content: content,
                        columnClass: "xlarge",
                      });
                    }
                  },
                );
              }
            },
          );
        }
      } else {
        res.json(-1);
      }
    },
  );
});


module.exports = router;
