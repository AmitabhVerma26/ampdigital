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
const { ObjectId } = require("mongodb");

/**
 * @swagger
 * /home:
 *   get:
 *     summary: Render the jobs landing page.
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: Jobs landing page rendered successfully.
 *       500:
 *         description: Internal server error.
 */
router.get("/home", function (req, res) {
  try {
    // Save the current URL to the session for redirection after authentication
    req.session.returnTo = req.baseUrl + req.url;

    // Check if the user is authenticated
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
      // Render the jobs landing page for non-authenticated users
      res.render("jobs/jobslandingpage", {
        moment: moment,
        success: "_",
        title: "Express",
      });
    }
  } catch (error) {
    // Handle unexpected errors
    res.status(500).json(error.message);
  }
});

/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: Get a list of jobs
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: Successfully retrieved jobs
 *       500:
 *         description: Internal Server Error
 */
router.get("/", async function (req, res) {
  try {
    // Set the returnTo session variable
    req.session.returnTo = req.baseUrl + req.url;

    // Fetch regular jobs excluding specific conditions
    const jobs = await job.find({
      deleted: { $ne: "true" },
      approved: true,
      company: { $ne: "AMP Digital Solutions Pvt Ltd" },
    })
    .skip(0)
    .limit(10)
    .sort({ date: -1 });

    // Fetch AMP Digital jobs excluding specific conditions
    const ampdigitaljobs = await job.find({
      deleted: { $ne: "true" },
      approved: true,
      company: { $in: ["AMP Digital Solutions Pvt Ltd"] },
    })
    .skip(0)
    .limit(10)
    .sort({ date: -1 });

    // Merge regular jobs and AMP Digital jobs
    const allJobs = [...ampdigitaljobs, ...jobs];

    // Render the jobs page based on authentication status
    const renderData = {
      title: "Express",
      active: "all",
      jobs: allJobs,
      moment: moment,
    };

    if (req.isAuthenticated()) {
      renderData.email = req.user.email;
      renderData.registered = req.user.courses.length > 0;
      renderData.recruiter = req.user.role && req.user.role == "3";
      renderData.name = getusername(req.user);
      renderData.notifications = req.user.notifications;
    }

    res.render("jobs/jobs", renderData);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

/**
 * @swagger
 * /jobs/post-job:
 *   get:
 *     summary: Render the job posting page
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: Successfully rendered the job posting page
 */
router.get("/post-job", function (req, res) {
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

/**
 * @swagger
 * /post:
 *   post:
 *     summary: Uploads a job post with an optional image.
 *     tags: [Jobs]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: avatar
 *         type: file
 *     responses:
 *       200:
 *         description: Job post uploaded successfully.
 *       400:
 *         description: Bad request. Check request parameters.
 *       500:
 *         description: Internal server error.
 */
router.post("/post-job", function (req, res) {
  try {
    // Create an S3 bucket
    const bucketParams = { Bucket: "ampdigital" };
    const s3 = new aws.S3();
    s3.createBucket(bucketParams);

    // Initialize S3 bucket
    const s3Bucket = new aws.S3({ params: { Bucket: "ampdigital" } });

    if (!req.files) {
      // Handle case when no files are provided
      res.status(400).json("No files provided");
    } else if (req.files.avatar) {
      // Handle case when an image is provided
      const imageFile = req.files.avatar;
      const data = { Key: imageFile.name, Body: imageFile.data };

      // Upload image to S3 bucket
      s3Bucket.putObject(data, function (err) {
        if (err) {
          res.status(500).json(err);
        } else {
          // Get signed URL for the uploaded image
          const urlParams = { Bucket: "ampdigital", Key: imageFile.name };
          s3Bucket.getSignedUrl("getObject", urlParams, function (err, url) {
            if (err) {
              res.status(500).json(err);
            } else {
              // Create a new job object with image URL
              const jobObj = new job({
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

              // Save the job object
              jobObj.save(function (err) {
                if (err) {
                  res.status(500).json(err);
                } else {
                  // Render the thank you page
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
        }
      });
    } else {
      // Handle case when no image is provided
      const jobObj = new job({
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

      // Save the job object
      jobObj.save(function (err) {
        if (err) {
          res.status(500).json(err);
        } else {
          // Render the thank you page
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
  } catch (error) {
    // Handle unexpected errors
    res.status(500).json(error.message);
  }
});

/**
 * @swagger
 * /filter:
 *   post:
 *     summary: Filter and retrieve jobs based on specified criteria.
 *     tags: [Jobs]
 *     parameters:
 *       - in: formData
 *         name: searchfilter
 *         type: string
 *       - in: formData
 *         name: employmenttype
 *         type: string
 *       - in: formData
 *         name: senioritylevel
 *         type: string
 *       - in: formData
 *         name: remote
 *         type: string
 *       - in: formData
 *         name: state
 *         type: string
 *       - in: formData
 *         name: city
 *         type: string
 *       - in: formData
 *         name: limit
 *         type: integer
 *     responses:
 *       200:
 *         description: Jobs filtered successfully.
 *       400:
 *         description: Bad request. Check request parameters.
 *       500:
 *         description: Internal server error.
 */
router.post("/filter", function (req, res) {
  try {
    // Extracting parameters from the request body
    var searchfilter = req.body.searchfilter;
    var employmenttype = req.body.employmenttype;
    var senioritylevel = req.body.senioritylevel;
    var remote = req.body.remote;
    var state = req.body.state;
    var city = req.body.city;

    // Initial query object with common conditions
    var query = { deleted: { $nin: ["true", true] }, approved: true };
    var filterArray = [];

    // Constructing filterArray based on searchfilter and other criteria
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
    
    // Resulting HTML to be sent in the response
    var jobsHtml = "";

    // Setting query parameters for MongoDB find operation
    var queryparams = { sort: { date: -1 }, skip: 0, limit: 10 };
    queryparams.limit = parseInt(req.body.limit);
    console.log(query);

    // Performing the database query
    job.find(query, null, queryparams, function (err, jobs) {
      if (err) {
        // Handle database query error
        return res.status(500).json(err);
      }
      // Iterate through the retrieved jobs and build HTML
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
      // Send the resulting HTML in the response
      res.json(jobsHtml);
    });
  } catch (error) {
    // Handle unexpected errors
    res.status(500).json(error.message);
  }
});

/**
 * @swagger
 * /uploadcompanylogo:
 *   post:
 *     summary: Uploads a company logo for a job.
 *     tags: [Jobs]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               moduleid:
 *                 type: string
 *     responses:
 *       200:
 *         description: Company logo uploaded successfully.
 *       400:
 *         description: Bad request. Check request parameters.
 *       500:
 *         description: Internal server error.
 */
router.post("/uploadcompanylogo", function (req, res) {
  try {
    // Extracting parameters from the request body
    var moduleid = req.body.moduleid;
    var bucketParams = { Bucket: "ampdigital" };
    
    // Creating S3 bucket
    const s3 = new aws.S3();
    s3.createBucket(bucketParams);
    
    // Initializing S3 bucket
    var s3Bucket = new aws.S3({ params: { Bucket: "ampdigital" } });

    // Check if files are present in the request
    if (!req.files) {
      // Handle case when no files are provided
      res.status(400).json('No files provided');
    } else {
      // Extracting the uploaded image file
      var imageFile = req.files.avatar;
      var data = { Key: imageFile.name, Body: imageFile.data };

      // Upload image to S3 bucket
      s3Bucket.putObject(data, function (err) {
        if (err) {
          // Handle S3 upload error
          res.status(500).json(err);
        } else {
          // Get signed URL for the uploaded image
          var urlParams = { Bucket: "ampdigital", Key: imageFile.name };
          s3Bucket.getSignedUrl("getObject", urlParams, function (err, url) {
            if (err) {
              // Handle error while getting signed URL
              res.status(500).json(err);
            } else {
              // Update the job document with the company logo URL
              job.updateOne(
                { _id: moduleid },
                {
                  $set: {
                    'companylogo': url
                  },
                },
                function (err, count) {
                  if (err) {
                    console.log(err);
                    res.status(500).json(err);
                  } else {
                    // Send the count of updated documents in the response
                    res.json(count);
                  }
                },
              );
            }
          });
        }
      });
    }
  } catch (error) {
    // Handle unexpected errors
    res.status(500).json(error.message);
  }
});

/**
 * @swagger
 * /manage:
 *   get:
 *     summary: Retrieve job details for management (Admin only).
 *     tags: [Jobs]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successful retrieval of job details for management.
 *       401:
 *         description: Unauthorized. User must be logged in as an admin.
 *       500:
 *         description: Internal server error.
 */
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

/**
 * @swagger
 * /updateinfo:
 *   post:
 *     summary: Update job information.
 *     tags: [Jobs]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: name
 *         type: string
 *         required: true
 *         description: The name of the field to be updated.
 *       - in: formData
 *         name: value
 *         type: string
 *         required: true
 *         description: The new value for the specified field.
 *       - in: formData
 *         name: pk
 *         type: string
 *         required: true
 *         description: The ID of the job to be updated.
 *     responses:
 *       200:
 *         description: Job information updated successfully.
 *       400:
 *         description: Bad request. Check form data parameters.
 *       500:
 *         description: Internal server error.
 */

router.post("/updateinfo", function (req, res) {
  try {
    // Creating an update query based on request parameters
    var updateQuery = {};
    updateQuery[req.body.name] = req.body.value;
    console.log(updateQuery);

    // Update the job document with the provided information
    job.findOneAndUpdate(
      {
        _id: req.body.pk,
      },
      {
        $set: updateQuery,
      },
      function (err, count) {
        if (err) {
          // Handle database update error
          console.log(err);
          res.status(500).json(err);
        } else {
          // Send the count of updated documents in the response
          res.json(count);
        }
      }
    );
  } catch (error) {
    // Handle unexpected errors
    res.status(500).json(error.message);
  }
});

/**
 * @swagger
 * /approval:
 *   put:
 *     summary: Update job approval status.
 *     tags: [Jobs]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: testimonialid
 *         type: string
 *         required: true
 *         description: The ID of the testimonial to be updated.
 *       - in: formData
 *         name: action
 *         type: boolean
 *         required: true
 *         description: The new approval status (true or false).
 *     responses:
 *       200:
 *         description: Job approval status updated successfully.
 *       400:
 *         description: Bad request. Check form data parameters.
 *       500:
 *         description: Internal server error.
 */
router.put("/approval", function (req, res) {
  try {
    // Extracting parameters from the request body
    var testimonialid = req.body.testimonialid;
    
    // Validating and creating a safe ObjectId
    const safeObjectId = (s) => (ObjectId.isValid(s) ? new ObjectId(s) : null);

    // Update the job document with the provided approval status
    job.findOneAndUpdate(
      {
        _id: safeObjectId(testimonialid),
      },
      {
        $set: { approved: req.body.action },
      },
      function (err, count) {
        if (err) {
          // Handle database update error
          console.log(err);
          res.status(500).json(err);
        } else {
          // Send the count of updated documents in the response
          res.json(count);
        }
      }
    );
  } catch (error) {
    // Handle unexpected errors
    res.status(500).json(error.message);
  }
});

/**
 * @swagger
 * /remove:
 *   delete:
 *     summary: Remove a job by marking it as deleted.
 *     tags: [Jobs]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: testimonialid
 *         type: string
 *         required: true
 *         description: The ID of the testimonial to be removed.
 *     responses:
 *       200:
 *         description: Job removed successfully.
 *       400:
 *         description: Bad request. Check form data parameters.
 *       500:
 *         description: Internal server error.
 */
router.delete("/remove", function (req, res) {
  try {
    // Extracting parameters from the request body
    var testimonialid = req.body.testimonialid;
    
    // Validating and creating a safe ObjectId
    const safeObjectId = (s) => (ObjectId.isValid(s) ? new ObjectId(s) : null);
    
    // Update the job document to mark it as deleted
    job.updateOne(
      {
        _id: safeObjectId(testimonialid),
      },
      {
        $set: { deleted: true },
      },
      function (err, count) {
        if (err) {
          // Handle database update error
          console.log(err);
          res.status(500).json(err);
        } else {
          // Send the count of updated documents in the response
          res.json(count);
        }
      }
    );
  } catch (error) {
    // Handle unexpected errors
    res.status(500).json(error.message);
  }
});

/**
 * @swagger
 * /jobs/{joburl}:
 *   get:
 *     summary: Retrieve job details by URL.
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: joburl
 *         required: true
 *         description: The URL of the job.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful retrieval of job details.
 *       302:
 *         description: Redirect to the home page if job not found.
 *       400:
 *         description: Bad request. Check path parameter.
 *       500:
 *         description: Internal server error.
 */
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

function getPathFromUrl(url) {
  return url.split("?")[0];
}

module.exports = router;
