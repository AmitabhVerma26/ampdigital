var express = require("express");
var router = express.Router();
var job = require("../models/job");
var moment = require("moment");
var aws = require("aws-sdk");
const dotenv = require("dotenv");
dotenv.config();
aws.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
});
var s3 = new aws.S3();

var awsSesMail = require("aws-ses-mail");
const { isAdmin, getusername, timeSince } = require("../utils/common");

var sesMail = new awsSesMail();
var sesConfig = {
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
};
sesMail.setConfig(sesConfig);

/**
 * Jobs Posts Page
 */
router.get("/", async function (req, res) {
  try {
    req.session.returnTo = req.baseUrl + req.url;

    // Fetch jobs excluding specific conditions
    const jobs = await job
      .find({
        deleted: { $ne: "true" },
        approved: true,
        company: { $ne: "AMP Digital Solutions Pvt Ltd" },
      })
      .skip(0)
      .limit(10)
      .sort({ date: -1 });

    // Fetch AMP Digital jobs excluding specific conditions
    const ampdigitaljobs = await job
      .find({
        deleted: { $ne: "true" },
        approved: true,
        company: { $in: ["AMP Digital Solutions Pvt Ltd"] },
      })
      .skip(0)
      .limit(10)
      .sort({ date: -1 });

    // Merge jobs and ampdigitaljobs
    const allJobs = [...ampdigitaljobs, ...jobs];

    if (req.isAuthenticated()) {
      res.render("jobs/jobs", {
        title: "Express",
        active: "all",
        jobs: allJobs,
        moment: moment,
        email: req.user.email,
        registered: req.user.courses.length > 0 ? true : false,
        recruiter: req.user.role && req.user.role == "3" ? true : false,
        name: getusername(req.user),
        notifications: req.user.notifications,
      });
    } else {
      res.render("jobs/jobs", {
        title: "Express",
        active: "all",
        jobs: allJobs,
        moment: moment,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});


/**
 * Jobs Post Page
 */
router.get("/post", function (req, res) {
  req.session.returnTo = req.baseUrl + req.url;
  if (!req.isAuthenticated()) {
    res.render("jobs/postjob", { title: "Express", authenticated: false });
  } else {
    res.render("jobs/postjob", {
      title: "Express",
      authenticated: true,
      email: req.user.email,
      registered: req.user.courses.length > 0 ? true : false,
      recruiter: req.user.role && req.user.role == "3" ? true : false,
      name: getusername(req.user),
      notifications: req.user.notifications,
    });
  }
});

router.post("/post", function (req, res) {
  var bucketParams = { Bucket: "ampdigital" };
  s3.createBucket(bucketParams);
  var s3Bucket = new aws.S3({ params: { Bucket: "ampdigital" } });
  // res.json('succesfully uploaded the image!');
  if (!req.files) {
    res.json("NO");
  } else if (req.files.avatar) {
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
              skillkeywords: Array.isArray(req.body.skillkeywords)
                ? req.body.skillkeywords.join(",")
                : req.body.skillkeywords,
              optradio: req.body.optradio,
              recruiterwebsite: req.body.recruiterwebsite,
              date: new Date(),
            });
            jobObj.save(function (err) {
              if (err) {
                res.json(err);
              } else {
                res.render("jobs/thankyoupage", {
                  title: "Express",
                  email: req.user.email,
                  registered: req.user.courses.length > 0 ? true : false,
                  recruiter:
                    req.user.role && req.user.role == "3" ? true : false,
                  name: getusername(req.user),
                  notifications: req.user.notifications,
                });
              }
            });
          }
        });
      }
    });
    // res.json(imageFile);
  } else {
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
      skillkeywords: Array.isArray(req.body.skillkeywords)
        ? req.body.skillkeywords.join(",")
        : req.body.skillkeywords,
      optradio: req.body.optradio,
      recruiterwebsite: req.body.recruiterwebsite,
      date: new Date(),
    });
    jobObj.save(function (err) {
      if (err) {
        res.json(err);
      } else {
        res.render("jobs/thankyoupage", {
          title: "Express",
          email: req.user.email,
          registered: req.user.courses.length > 0 ? true : false,
          recruiter: req.user.role && req.user.role == "3" ? true : false,
          name: getusername(req.user),
          notifications: req.user.notifications,
        });
      }
    });
  }
});

function getPathFromUrl(url) {
  return url.split("?")[0];
}

router.post("/filter", function (req, res) {
  var searchfilter = req.body.searchfilter;
  var employmenttype = req.body.employmenttype;
  var senioritylevel = req.body.senioritylevel;
  var remote = req.body.remote;
  var state = req.body.state;
  var city = req.body.city;
  var query = { deleted: { $nin: ["true", true] }, approved: true };
  var filterArray = [];

  if (searchfilter !== "") {
    filterArray.push({
      jobtitle: { $regex: "" + searchfilter + "", $options: "i" },
    });
    filterArray.push({
      company: { $regex: "" + searchfilter + "", $options: "i" },
    });
    filterArray.push({
      state: { $regex: "" + searchfilter + "", $options: "i" },
    });
    filterArray.push({
      city: { $regex: "" + searchfilter + "", $options: "i" },
    });
    filterArray.push({
      employmenttype: { $regex: "" + searchfilter + "", $options: "i" },
    });
    filterArray.push({
      senioritylevel: { $regex: "" + searchfilter + "", $options: "i" },
    });
    filterArray.push({
      jobdescription: { $regex: "" + searchfilter + "", $options: "i" },
    });
    filterArray.push({
      skillkeywords: { $regex: "" + searchfilter + "", $options: "i" },
    });
    filterArray.push({
      recruiterwebsite: { $regex: "" + searchfilter + "", $options: "i" },
    });

    if (employmenttype !== "") {
      filterArray.push({ employmenttype: employmenttype });
    }
    if (senioritylevel !== "") {
      filterArray.push({ senioritylevel: senioritylevel });
    }
    if (remote && remote !== "") {
      filterArray.push({ remote: remote });
    }
    if (remote == "no" && state !== "") {
      filterArray.push({ state: state });
    }
    if (remote == "no" && state !== "" && city !== "") {
      filterArray.push({ city: city });
    }
    query.$or = filterArray;
  } else {
    if (employmenttype !== "") {
      filterArray.push({ employmenttype: employmenttype });
      query.$and = filterArray;
    }
    if (senioritylevel !== "") {
      filterArray.push({ senioritylevel: senioritylevel });
      query.$and = filterArray;
    }
    if (remote && remote !== "") {
      filterArray.push({ remote: remote });
      query.$and = filterArray;
    }
    if (remote == "no" && state !== "") {
      filterArray.push({ state: state });
      query.$and = filterArray;
    }
    if (remote == "no" && state !== "" && city !== "") {
      filterArray.push({ city: city });
      query.$and = filterArray;
    }
  }

  var jobsHtml = "";
  var queryparams = { sort: { date: -1 }, skip: 0, limit: 10 };
  queryparams.limit = parseInt(req.body.limit);
  console.log(query);
  job.find(query, null, queryparams, function (err, jobs) {
    for (var i = 0; i < jobs.length; i++) {
      var jobinfo = "";
      var jobremote = "";
      if (jobs[i]["companylogo"]) {
        jobinfo = `<div class="row">
                <div class="col-md-10">
                  <h3 class="card-title">${jobs[i]["jobtitle"]}</h3>
                  <div class="row">
                    <div class="col-md-6">
                      <h5 class="card-subtitle mb-2 text-muted">${
                        jobs[i]["company"]
                      }</h5>
                      <p class="badge badge-danger" for="">${
                        jobs[i]["employmenttype"]
                      }</p>
                    </div>
                  </div>
                </div>
                <div class="col-md-2">
                  <img style="width: 5rem;
                  margin-left: -1rem;" src="${getPathFromUrl(
                    jobs[i]["companylogo"],
                  )}" alt="">
                </div>
              </div>`;
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
              </div>`;
      }
      if (jobs[i]["remote"] == "yes") {
        jobremote = `<p class="mb-0" style="font-size: small;"><i class='fa fa-home'></i>&nbsp; Work from Home</p>`;
      } else {
        jobremote = `<p class="mb-0" style="font-size: small;">${
          jobs[i]["city"] + ", " + jobs[i]["state"]
        }</p>`;
      }
      jobsHtml =
        jobsHtml +
        `<div class="p-0 pb-2 mb-2 d-flex align-items-stretch bg-gray">
                    <div class="card w-100 cardstyle cardstyle${
                      (i % 4) + 1
                    } w-100 mb-4">
                        <div class="card-body">
                            ${jobinfo}
                            ${jobremote}
                            <div class="row">
                                <div class="col-4">
                                    <p class="card-text" style="font-size: small;">Posted: ${timeSince(
                                      new Date(jobs[i]["date"]),
                                    )} ago
                                    </p>
                                </div>
                                <div class="col-8 row justify-content-end pr-0">
                                <a href="/jobs/${
                                  jobs[i]["jobtitle"]
                                    .replace(/\s+/g, "-")
                                    .toLowerCase() +
                                  "-" +
                                  jobs[i]["_id"]
                                }" class="card-link btn btn-theme effect  mt-3 hero-start-learning ml-2 mt-2">Apply Now</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
    }
    res.json(jobsHtml);
  });
});

router.put("/uploadcompanylogo", function (req, res) {
  const { ObjectId } = require("mongodb"); // or ObjectID
  const safeObjectId = (s) => (ObjectId.isValid(s) ? new ObjectId(s) : null);

  var doc = req.body.image;
  var element_id = req.body.id;
  var fieldname = req.body.fieldname;
  var updateObj = {};
  updateObj[fieldname] = doc;

  job.updateOne(
    { _id: safeObjectId(element_id) },
    {
      $set: updateObj,
    },
    function (err, count) {
      if (err) {
        console.log(err);
      } else {
        res.json(count);
      }
    },
  );
});

/**
 * Jobs Home Page
 */
router.get("/home", function (req, res) {
  req.session.returnTo = req.baseUrl + req.url;
  if (req.isAuthenticated()) {
    res.render("jobs/jobslandingpage", {
      moment: moment,
      success: "_",
      title: "Express",
      email: req.user.email,
      registered: req.user.courses.length > 0 ? true : false,
      recruiter: req.user.role && req.user.role == "3" ? true : false,
      name: getusername(req.user),
      notifications: req.user.notifications,
    });
  } else {
    res.render("jobs/jobslandingpage", {
      moment: moment,
      success: "_",
      title: "Express",
    });
  }
});

/*GET jobs admin panel page*/
router.get("/manage", isAdmin, function (req, res) {
  job.find(
    { deleted: { $ne: "true" } },
    null,
    { sort: { date: -1 } },
    function (err, docs) {
      res.render("adminpanel/jobs", {
        email: req.user.email,
        registered: req.user.courses.length > 0 ? true : false,
        recruiter: req.user.role && req.user.role == "3" ? true : false,
        name: getusername(req.user),
        notifications: req.user.notifications,
        docs: docs,
        moment: moment,
      });
    },
  );
});

//Update jobs admin panel info
router.post("/updateinfo", function (req, res) {
  var updateQuery = {};
  updateQuery[req.body.name] = req.body.value;
  console.log(updateQuery);
  job.update(
    {
      _id: req.body.pk,
    },
    {
      $set: updateQuery,
    },
    function (err, count) {
      if (err) {
        console.log(err);
      } else {
        res.json(count);
      }
    },
  );
});

/**
 * Approve job post
 */
router.put("/approval", function (req, res) {
  var testimonialid = req.body.testimonialid;
  const { ObjectId } = require("mongodb"); // or ObjectID
  const safeObjectId = (s) => (ObjectId.isValid(s) ? new ObjectId(s) : null);

  job.update(
    {
      _id: safeObjectId(testimonialid),
    },
    {
      $set: { approved: req.body.action },
    },
    function (err, count) {
      if (err) {
        console.log(err);
      } else {
        res.json(count);
      }
    },
  );
});

/**
 * Delete job post
 */
router.put("/remove", function (req, res) {
  var testimonialid = req.body.testimonialid;
  const { ObjectId } = require("mongodb"); // or ObjectID
  const safeObjectId = (s) => (ObjectId.isValid(s) ? new ObjectId(s) : null);

  job.update(
    {
      _id: safeObjectId(testimonialid),
    },
    {
      $set: { deleted: "true" },
    },
    function (err, count) {
      if (err) {
        console.log(err);
      } else {
        res.json(count);
      }
    },
  );
});

/* GET blog post page. */
router.get("/:joburl", function (req, res) {
  req.session.returnTo = req.baseUrl + req.url;
  var joburl = req.params.joburl;
  var jobidArray = joburl.split("-");
  var jobid = jobidArray[jobidArray.length - 1];
  const { ObjectId } = require("mongodb"); // or ObjectID
  const safeObjectId = (s) => (ObjectId.isValid(s) ? new ObjectId(s) : null);
  job.findOne(
    { deleted: { $ne: true }, _id: safeObjectId(jobid) },
    function (err, job) {
      if (job) {
        if (req.isAuthenticated()) {
          res.render("jobs/job", {
            title: "Express",
            job: job,
            moment: moment,
            email: req.user.email,
            registered: req.user.courses.length > 0 ? true : false,
            recruiter: req.user.role && req.user.role == "3" ? true : false,
            name: getusername(req.user),
            phone: req.user.local.phone,
            notifications: req.user.notifications,
          });
        } else {
          res.render("jobs/job", { job: job, moment: moment });
        }
      } else {
        res.redirect("/");
      }
    },
  );
});

module.exports = router;
