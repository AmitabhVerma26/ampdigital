var express = require('express');
var router = express.Router();
var lmsCourses = require('../models/courses');
var category = require('../models/category');
var blog = require('../models/blog');
var comment = require('../models/comment');
var moment = require('moment');
var aws = require('aws-sdk');
const dotenv = require('dotenv');
dotenv.config();
aws.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION
});
var s3 = new aws.S3();

var awsSesMail = require('aws-ses-mail');
const { isAdmin, getusername } = require('../utils/common');

var sesMail = new awsSesMail();
var sesConfig = {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION
};
sesMail.setConfig(sesConfig);

/**
 * @swagger
 * /blogs:
 *   get:
 *     summary: Get blogs (also based on filters)
 *     tags:
 *       - Blog
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: text
 *         schema:
 *           type: string
 *         description: Filter by text search
 *     responses:
 *       200:
 *         description: Blogs retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get('/', function (req, res) {
    // Store the current URL in the session for later use
    req.session.returnTo = req.baseUrl + req.url;

    // Query the categories that are not marked as deleted
    category.find({ 'deleted': { $ne: true } }, function (err, categories) {
        // Define the initial blog query
        let blogQuery = { deleted: { $ne: "true" }, "approved": { $ne: false } };

        // Check if a category filter is applied
        if (req.query.category) {
            if (req.query.category === 'Other') {
                blogQuery.categories = { $exists: false };
            } else {
                blogQuery.categories = req.query.category;
            }
        }

        // Check if a text search filter is applied
        if (req.query.text) {
            blogQuery.$or = [
                { title: { $regex: req.query.text, $options: "i" } },
                { overview: { $regex: req.query.text, $options: "i" } },
                { content: { $regex: req.query.text, $options: "i" } }
            ];
        }

        // Query the blogs based on the constructed blogQuery
        blog.find(blogQuery, null, { sort: { date: -1 }, skip: 0, limit: 9 }, function (err, blogs) {
            // Check if the user is authenticated
            const isAuthenticated = req.isAuthenticated();

            // Prepare the context for rendering the 'blogs' template
            const context = {
                text: req.query.text ? req.query.text : "",
                category: req.query.category ? req.query.category : null,
                moment: moment,
                title: 'Express',
                categories: categories,
                blogs: blogs,
                moment: moment
            };

            if (isAuthenticated) {
                context.email = req.user.email;
                context.registered = req.user.courses.length > 0;
                context.recruiter = req.user.role && req.user.role === '3';
                context.name = getusername(req.user);
                context.notifications = req.user.notifications;
            }

            // Render the 'blogs' template with the prepared context
            res.render('blogs', context);
        });
    });
});

/* GET blog post page. */
router.get('/:blogurl', function (req, res) {
    req.session.returnTo = req.path;
    category.find({ 'deleted': { $ne: true } }, function (err, categories) {
        let blogQuery = { deleted: { $ne: "true" }, "approved": { $ne: false }, blogurl: {$ne: req.params.blogurl} };
        blog.find(blogQuery, null, { sort: { date: -1 }, skip: 0, limit: 3 }, function (err, blogs) {
            blog.findOne({ deleted: { $ne: true }, blogurl: req.params.blogurl }, function (err, blog) {
                if (blog) {
                    comment.find({ blogid: blog._id.toString() }, function (err, comments) {
                        if (req.isAuthenticated()) {
                            res.render('blog', { blogs: blogs, categories: categories, comments: comments, title: 'Express', blog: blog, moment: moment, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications });
                        }
                        else {
                            res.render('blog', { blogs: blogs, categories: categories, comments: comments, title: 'Express', blog: blog, moment: moment });
                        }
                    });
                }
                else {
                    res.redirect('/blogs')
                }
            });
        });
    });
});


/**
 * @swagger
 * /blogs:
 *   post:
 *     summary: Create a new blog post
 *     description: Create a new blog post with the provided information.
 *     tags:
 *       - Blog
 *     parameters:
 *       - name: title
 *         in: query
 *         description: Title of the blog post
 *         required: true
 *         type: string
 *       - name: overview
 *         in: query
 *         description: Overview of the blog post
 *         required: true
 *         type: string
 *       - name: author
 *         in: query
 *         description: Author of the blog post
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Blog post created successfully
 *       500:
 *         description: Internal server error
 */
router.post('/', function (req, res) {
    // res.json(Buffer.from(req.body.content).toString('base64'));
    var Blog = new blog({
        title: req.body.title,
        overview: req.body.overview,
        author: req.body.author,
        date: new Date()
        // content: Buffer.from(req.body.content).toString('base64')
    });
    Blog.save(function (err) {
        if (err) {
            res.json(err);
        }
        else {
            res.redirect('/blogs/manage');
        }
    });
});

/**
 * @swagger
 * /blogs/recommendedblogs:
 *   get:
 *     summary: Get recommended blog posts
 *     description: Retrieve recommended blog posts based on specified categories.
 *     tags:
 *       - Blog
 *     parameters:
 *       - name: categories
 *         in: query
 *         description: An array of categories to filter recommended blog posts (optional).
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *       - name: blogurl
 *         in: query
 *         description: URL of the current blog post to exclude (optional).
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *       500:
 *         description: Internal server error
 */
router.get('/recommendedblogs', function(req, res) {
    if (Array.isArray(req.query.categories)) {
        blog.find({ deleted: { $ne: true }, categories: { $in: req.query.categories }, blogurl: { $ne: req.query.blogurl } }, null, { sort: { date: -1 }, limit: 4 }, function (err, recommendedfeeds) {
            res.json({ recommendedfeeds });
        });
    } else {
        blog.find({ deleted: { $ne: true }, blogurl: { $ne: req.query.blogurl } }, null, { sort: { date: -1 }, limit: 4 }, function (err, recommendedfeeds) {
            res.json({ recommendedfeeds });
        });
    }
});


/**
 * @swagger
 * /blogs/{postId}/prevNext:
 *   get:
 *     summary: Get the previous and next blog posts by ID
 *     description: Retrieve the previous and next blog posts based on the given post ID.
 *     tags:
 *       - Blog
 *     parameters:
 *       - name: postId
 *         in: path
 *         description: Unique identifier of the current blog post.
 *         required: true
 *         type: string
  *     responses:
 *       200:
 *         description: Successful operation
 *       500:
 *         description: Internal server error
 */
router.get('/:postId/prevNext', async (req, res) => {
    let curId = req.params.postId
    blog.findOne({"deleted": { $ne: true }, "approved": { $ne: false }, _id: {$lt: curId}}, null, {sort: {_id: -1}, limit:1}, function (err, prevdoc) {
        blog.findOne({"deleted": { $ne: true }, "approved": { $ne: false }, _id: {$gt: curId}}, null, {
            sort: {_id: 1},
            limit: 1
        }, function (err, nextdoc) {
            if(err){
                return res.status(500).send(err);
            }
            res.json({nextdoc, prevdoc});
        });
    });
});

/**
 * @openapi
 * /readmore:
 *   get:
 *     summary: Get blogs on click of read more button
 *     description: Retrieve a list of blogs based on the provided category and pagination parameters.
 *     tags:
 *       - Blog
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Optional. Filter blogs by category.
 *       - in: query
 *         name: count
 *         schema:
 *           type: integer
 *         description: Optional. Specify the number of blogs to skip.
 *     responses:
 *       200:
 *         description: A list of blogs.
 *       500:
 *         description: An error occurred.
 */
router.get('/readmore', async (req, res) => {
    try {
        // Store the current request URL in the session for returning later
        req.session.returnTo = req.baseUrl + req.url;

        // Aggregate to count the number of blogs per category
        const categoryCounts = await blog.aggregate([
            {
                $match: { "deleted": { $ne: true } }
            },
            {
                $group: {
                    _id: { category: "$category" },
                    count: { $sum: 1 }
                }
            }
        ]);

        // Create a query to retrieve blogs based on query parameters
        const query = { deleted: { $ne: true } };

        if (req.query.category) {
            query.category = req.query.category;
        }

        // Find and return the requested blogs
        const blogs = await blog.find(query)
            .sort({ date: -1 })
            .skip(9 * (parseInt(req.query.count)))
            .limit(9);

        res.json(blogs);
    } catch (err) {
        // Handle any errors that occur during the execution of this route
        console.error(err);
        res.status(500).json({ error: 'An error occurred while retrieving blogs' });
    }
});

/**
 * @openapi
 * /blogs/uploadimage:
 *   post:
 *     summary: Upload a blog image
 *     description: Upload an image for a blog post.
 *     tags:
 *       - Blog
 *     parameters:
 *       - name: moduleid
 *         in: formData
 *         description: The ID of the blog post.
 *         required: true
 *         schema:
 *           type: string
 *       - name: avatar
 *         in: formData
 *         description: The image to upload.
 *         required: true
 *         schema:
 *           type: string
 *           format: binary
 *     responses:
 *       200:
 *         description: Image successfully uploaded.
 *       400:
 *         description: Bad request. Check the request parameters.
 *       500:
 *         description: Internal server error.
 */
router.post('/uploadimage', function (req, res) {
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
        s3Bucket.putObject(data, function (err) {
            if (err) {
                res.json(err);
            } else {
                var urlParams = { Bucket: 'ampdigital', Key: imageFile.name };
                s3Bucket.getSignedUrl('getObject', urlParams, function (err, url) {
                    if (err) {
                        res.json(err);
                    }
                    else {
                        blog.update(
                            {
                                _id: moduleid
                            },
                            {
                                $set: { "image": url }
                            }
                            ,
                            function (err) {
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
        // res.json(imageFile);
    }

});

/**
 * @swagger
 * /blogs/updateinfo:
 *   post:
 *     summary: Update information in the 'blog' collection.
 *     description: Update a specific field in a 'blog' document based on provided data.
 *     tags:
 *       - Blog
 *     parameters:
 *       - in: body
 *         name: requestBody
 *         required: true
 *         description: The data to update and the target document ID.
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             value:
 *               type: string
 *             pk:
 *               type: string
 *     responses:
 *       200:
 *         description: The number of updated documents.
 */
router.post('/updateinfo', function (req, res) {
    // Create an update query object based on request data
    let updateQuery = {};
    updateQuery[req.body.name] = req.body.value;

    // Update the 'blog' collection with the provided data
    blog.update(
        { _id: req.body.pk },
        { $set: updateQuery },
        function (err, count) {
            if (err) {
                console.log(err);
                res.status(500).json({ error: 'An error occurred while updating.' });
            } else {
                // Respond with the count of updated documents
                res.json({ updatedCount: count });
            }
        }
    );
});


/**
 * @swagger
 * /blogs/updateBlogReadCount:
 *   post:
 *     summary: Update the read count for a blog post.
 *     tags:
 *       - Blog
 *     parameters:
 *       - in: body
 *         name: blogData
 *         description: Blog data to update read count.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             blogurl:
 *               type: string
 *               description: The URL of the blog post.
 *             cookie:
 *               type: string
 *               description: The unique identifier for the reader.
 *     responses:
 *       200:
 *         description: Successful operation. Returns the updated count.
 *       400:
 *         description: Invalid input data.
 *       500:
 *         description: Internal server error.
 */
router.post('/updateBlogReadCount', function (req, res) {
    blog.findOneAndUpdate(
        {
            blogurl: req.body.blogurl
        },
        {
            $addToSet: {"readers": req.body.cookie}
        },
        function (err, count) {
            if (err) {
                console.log(err);
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.json(count);
            }
        }
    );
});

/**
 * @swagger
 * /blogs/categories/updatecategoryinfo:
 *   post:
 *     summary: Update blog category information.
 *     description: Update blog category information in the admin panel at /blogs/categories/manage
 *     tags:
 *       - Blog
 *     parameters:
 *       - in: body
 *         name: categoryData
 *         description: Category data to update.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             pk:
 *               type: string
 *               description: The unique identifier of the category.
 *             value:
 *               type: string
 *               description: The updated category name.
 *     responses:
 *       200:
 *         description: Successful operation. Returns the updated category.
 *       400:
 *         description: Invalid input data.
 *       500:
 *         description: Internal server error.
 */
router.post('/categories/updatecategoryinfo', function (req, res) {
    category.findOneAndUpdate(
        {
            _id: req.body.pk
        },
        {
            $set: { "name": req.body.value }
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
 * @swagger
 * /blogs/updateblogcategories:
 *   put:
 *     summary: Update blog categories.
 *     tags: [Blog]
 *     parameters:
 *       - in: body
 *         name: requestBody
 *         description: Blog categories to update.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               description: The unique identifier of the blog.
 *             category:
 *               type: array
 *               items:
 *                 type: string
 *               description: An array of updated categories.
 *     responses:
 *       200:
 *         description: Successful operation. Returns a success message.
 *       500:
 *         description: Internal server error.
 */
router.put('/updateblogcategories', function (req, res) {
    const { ObjectId } = require('mongodb'); // or ObjectID

    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;

    const filter = { _id: safeObjectId(req.body.id) };
    const update = { $set: { categories: req.body['category[]'] } };

    blog.findOneAndUpdate(filter, update, function (err) {
        if (err) {
            console.log(err);
            res.status(500).send('Error updating category.');
        } else {
            res.json({ success: true });
        }
    });
});


/**
 * @swagger
 * /blogs/removeblog:
 *   delete:
 *     summary: Remove a blog post.
 *     tags: [Blog]
 *     parameters:
 *       - in: body
 *         name: requestBody
 *         description: Blog post data to mark as deleted.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             blogid:
 *               type: string
 *               description: The unique identifier of the blog post to remove.
 *     responses:
 *       200:
 *         description: Successful operation. Returns the updated blog post.
 *       400:
 *         description: Invalid input data.
 *       500:
 *         description: Internal server error.
 */
router.delete('/removeblog', function (req, res) {
    blog.findOneAndUpdate(
        {
            _id: req.body.blogid
        },
        {
            $set: { deleted: true }
        }
        ,
        function (err, count) {
            if (err) {
                return res.status(500).send(err);
            }
            else {
                res.json(count);
            }
        });
});

/**
 * @swagger
 * /blogs/approve:
 *   put:
 *     summary: Approve or disapprove a blog.
 *     tags: [Blog]
 *     parameters:
 *       - in: body
 *         name: blogData
 *         description: Blog data for approval action.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             blogid:
 *               type: string
 *               description: The unique identifier of the blog to approve or disapprove.
 *             action:
 *               type: boolean
 *               description: Whether to approve (true) or disapprove (false) the blog.
 *     responses:
 *       200:
 *         description: Successful operation. Returns the updated blog.
 *       400:
 *         description: Invalid input data.
 *       500:
 *         description: Internal server error.
 */
router.put('/approve', function (req, res) {
    var blogid = req.body.testimonialid;
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;

    blog.findOne({_id: safeObjectId(testimonialid)}, function (err, blogItem) {
        blog.findOneAndUpdate(
            {
                _id: safeObjectId(blogid)
            },
            {
                $set: { 'approved': req.body.action }
            }
            ,
            function (err, count) {
                if (err) {
                    return res.status(500).send(err);
                }
                else {
                    res.json(count);
                }
            });
    });
});


/**
 * @swagger
 * /blogs/addcategory:
 *   post:
 *     summary: Add a blog category in the admin panel.
 *     tags: [Blog]
 *     parameters:
 *       - in: body
 *         name: requestBody
 *         description: Category data to add.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               description: The name of the category.
 *             categoryurl:
 *               type: string
 *               description: The URL of the category.
 *     responses:
 *       200:
 *         description: Category added successfully. Returns the added category.
 *       400:
 *         description: Invalid input data.
 *       500:
 *         description: Internal server error.
 */
router.post('/addcategory', function (req, res) {
    var Category = new category({
        name: req.body.name,
        categoryurl: req.body.categoryurl,
        date: new Date()
    });
    Category.save(function (err, addedCategory) {
        if (err) {
            res.status(400).json({ error: 'Invalid input data' });
        } else {
            res.json(addedCategory);
        }
    });
});


/**
 * @swagger
 * /blogs/removecategory:
 *   delete:
 *     summary: Remove a blog category in the admin panel.
 *     tags: [Blog]
 *     parameters:
 *       - in: body
 *         name: requestBody
 *         description: Category data to mark as deleted.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             categoryid:
 *               type: string
 *               description: The unique identifier of the category to remove.
 *     responses:
 *       200:
 *         description: Category marked as deleted successfully. Returns the updated category.
 *       500:
 *         description: Internal server error.
 */
router.delete('/removecategory', function (req, res) {
    var categoryid = req.body.categoryid;
    const { ObjectId } = require('mongodb'); // or ObjectID
    const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;

    category.update(
        {
            _id: safeObjectId(categoryid)
        },
        {
            $set: { 'deleted': true }
        },
        function (err, updatedCategory) {
            if (err) {
                console.log(err);
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.json(updatedCategory);
            }
        }
    );
});

/**
 * @swagger
 * /blogs/comment:
 *   post:
 *     summary: Add a comment to a blog post.
 *     tags: [Blog]
 *     parameters:
 *       - in: body
 *         name: requestBody
 *         description: Comment data for adding a comment to a blog post.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             blogid:
 *               type: string
 *               description: The unique identifier of the blog post to comment on.
 *             name:
 *               type: string
 *               description: The name of the commenter.
 *             email:
 *               type: string
 *               description: The email address of the commenter.
 *             comment:
 *               type: string
 *               description: The comment content.
 *     responses:
 *       200:
 *         description: Comment added successfully. Redirects to the blog post with comments section.
 *       500:
 *         description: Internal server error.
 */
router.post('/comment', function (req, res) {
    // res.json(Buffer.from(req.body.content).toString('base64'));
    var Comment = new comment({
        blogid: req.body.blogid,
        name: req.body.name,
        email: req.body.email,
        comment: req.body.comment,
        date: new Date()
        // content: Buffer.from(req.body.content).toString('base64')
    });
    Comment.save(function (err) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.redirect('/blog/' + req.body.blogurl + "/#comments");
        }
    });
});

/**
 * @swagger
 * /blogs/manage:
 *   get:
 *     summary: Admin panel page for managing blogs. Redirects to home page if unauthorized.
 *     tags: [Blog]
 */
router.get('/manage', isAdmin, function (req, res) {
    lmsCourses.find({ 'deleted': { $ne: 'true' } }, function (err, courses) {
        category.find({ 'deleted': { $ne: true } }, function (err, categories) {
            blog.find({ deleted: { $ne: true } }, function (err, docs) {
                if (req.isAuthenticated()) {
                    res.render('adminpanel/blogs', { courses: courses, categories: categories, docs: docs, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications, docs: docs, moment: moment });
                }
                else {
                    res.render('adminpanel/blogs', { courses: courses, categories: categories, docs: docs, email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications, docs: docs, moment: moment });
                }
            });
        });
    });
});

/**
 * @swagger
 * /blogs/datatable:
 *   get:
 *     summary: Retrieve data for AJAX DataTable in the manage blogs page in admin panel.
 *     tags: [Blog]
 */
router.get('/datatable', function (req, res) {
    /*
   * Script:    DataTables server-side script for NODE and MONGODB
   * Copyright: 2018 - Siddharth Sogani
   */

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * Easy set variables
     */

    /* Array of columns to be displayed in DataTable
     */
    var $aColumns = ['title', 'date', 'overview', 'category', 'image', 'uploadimage', 'content', 'blogurl',  'author', 'tags', 'action'];

    /*
     * Paging
     */
    var $sDisplayStart = 0;
    var $sLength = "";
    if ((req.query.iDisplayStart) && req.query.iDisplayLength != '-1') {
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
        var arr = [{ "title": { $regex: '' + req.query.sSearch + '', '$options': 'i' } }, { "content": { $regex: '' + req.query.sSearch + '', '$options': 'i' } }, { "overview": { $regex: '' + req.query.sSearch + '', '$options': 'i' } }, { "author": { $regex: '' + req.query.sSearch + '', '$options': 'i' } }, { "category": { $regex: '' + req.query.sSearch + '', '$options': 'i' } }, { "tags": { $regex: '' + req.query.sSearch + '', '$options': 'i' } }];
        query.$or = arr;
    }

    /*
   * Ordering
   */
    var sortObject = { 'date': -1 };
    if (req.query.iSortCol_0 && req.query.iSortCol_0 == 0) {
        if (req.query.sSortDir_0 == 'desc') {
            var sortObject = {};
            var stype = 'title';
            var sdir = -1;
            sortObject[stype] = sdir;
        }
        else {
            var sortObject = {};
            var stype = 'title';
            var sdir = 1;
            sortObject[stype] = sdir;
        }

    }
    else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 1) {
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
    else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 2) {
        if (req.query.sSortDir_0 == 'desc') {
            var sortObject = {};
            var stype = 'overview';
            var sdir = -1;
            sortObject[stype] = sdir;
        }
        else {
            var sortObject = {};
            var stype = 'overview';
            var sdir = 1;
            sortObject[stype] = sdir;
        }
    }
    else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 3) {
        if (req.query.sSortDir_0 == 'desc') {
            var sortObject = {};
            var stype = 'blogcategory';
            var sdir = -1;
            sortObject[stype] = sdir;
        }
        else {
            var sortObject = {};
            var stype = 'blogcategory';
            var sdir = 1;
            sortObject[stype] = sdir;
        }
    }
    else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 6) {
        if (req.query.sSortDir_0 == 'desc') {
            var sortObject = {};
            var stype = 'content';
            var sdir = -1;
            sortObject[stype] = sdir;
        }
        else {
            var sortObject = {};
            var stype = 'content';
            var sdir = 1;
            sortObject[stype] = sdir;
        }
    }
    else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 7) {
        if (req.query.sSortDir_0 == 'desc') {
            var sortObject = {};
            var stype = 'blogurl';
            var sdir = -1;
            sortObject[stype] = sdir;
        }
        else {
            var sortObject = {};
            var stype = 'blogurl';
            var sdir = 1;
            sortObject[stype] = sdir;
        }
    }
    else if (req.query.iSortCol_0 && req.query.iSortCol_0 == 8) {
        if (req.query.sSortDir_0 == 'desc') {
            var sortObject = {};
            var stype = 'author';
            var sdir = -1;
            sortObject[stype] = sdir;
        }
        else {
            var sortObject = {};
            var stype = 'author';
            var sdir = 1;
            sortObject[stype] = sdir;
        }
    }
    category.find({ 'deleted': { $ne: true } }, function (err, categorydocs) {
        const categories = categorydocs.map(item=>item.name)
    blog.find(query).skip(parseInt($sDisplayStart)).limit(parseInt($sLength)).sort(sortObject).exec(function (err, docs) {
        blog.count(query, function (err, count) {
            var aaData = [];
            for (let i = 0; i < (docs).length; i++) {
                var $row = [];
                for (var j = 0; j < ($aColumns).length; j++) {
                    if ($aColumns[j] == 'title') {
                        $row.push(`<a class="updatetestimonialname" id="title" data-type="textarea" data-pk="${ docs[i]['_id'] }" data-url="/blogs/updateinfo" data-title="Enter title">${ docs[i]['title'] }</a>`)
                    }
                    else if ($aColumns[j] == 'date') {
                        $row.push(moment(docs[i]['date']).format("DD/MMM/YYYY HH:mm A"));
                    }
                    else if ($aColumns[j] == 'overview') {
                        $row.push(`<a class="updatetestimonialname" id="overview" data-type="textarea" data-pk="${ docs[i]['_id'] }" data-url="/blogs/updateinfo" data-title="Enter overview">${ docs[i]['overview'] }</a>`)
                    }
                    else if ($aColumns[j] == 'category') {
                        var accesscourses = '';
                            for (var h = 0; h < categories.length; h++) {
                                accesscourses = accesscourses + `<option ${docs[i].categories && docs[i].categories.indexOf(categories[h]) > -1 ? "selected" : ""} value="${categories[h]}">${categories[h]}</option>`;
                            }
                            $row.push(`
                            <form data-blogid=${docs[i]['_id']}  class="addblogcategory" action="">
                        <select class="js-example-basic-multiple" name="states[]" multiple="multiple">
                        ${accesscourses}
                        </select>
                        <input type="submit">
                        </form>`);                    
                    }                    
                    else if ($aColumns[j] == 'image') {
                        if(docs[i]['image'] && docs[i]['image'].split('?')){
                            $row.push(`<a href="${docs[i]['image'].split('?')[0]}">Download</a>`)
                        }
                        else{
                            $row.push(`<span class="label label-info"><i>No Image Uploaded</i></span>`)
                        }
                    }
                    else if ($aColumns[j] == 'uploadimage') {
                        $row.push(`<form enctype="multipart/form-data" class="imagesubmitform" action="/blogs/uploadimage" method="POST" target="_blank">
                        <label>
                          <input name="moduleid"  type="hidden" value="${docs[i]['_id']}">
                          Browse <input name="avatar" class="imagetosubmit" type="file" hidden>
                        </label>
                        <button class="btn btn-xs btn-primary imagesubmitformbtn" type="submit">Submit</button>
                      </form>`)
                    }
                    else if ($aColumns[j] == 'content') {
                        $row.push(`<textarea name="jobdescription" placeholder="Enter Blog Content" class="form-control summernote" cols="30" rows="10">${docs[i]['content']}</textarea>
                        <button data-pk="${ docs[i]['_id'] }" class="btn btn-primary summernotesubmit">Submit</button>`)
                    }
                    else if ($aColumns[j] == 'blogurl') {
                        $row.push(`<a class="updatetestimonialname" id="blogurl" data-type="textarea" data-pk="${ docs[i]['_id'] }" data-url="/blogs/updateinfo" data-title="Enter blog url">${ docs[i]['blogurl'] }</a>`)
                    }
                    else if ($aColumns[j] == 'author') {
                        $row.push(`<a class="updatetestimonialname" id="author" data-type="textarea" data-pk="${ docs[i]['_id'] }" data-url="/blogs/updateinfo" data-title="Enter author">${ docs[i]['author'] }</a>`)
                    }
                    else if ($aColumns[j] == 'tags') {
                        $row.push(`<a class="updatetestimonialname" id="tags" data-type="textarea" data-pk="${ docs[i]['_id'] }" data-url="/blogs/updateinfo" data-title="Enter tags">${ docs[i]['tags'] }</a>`)
                    }
                    else {
                        if(docs[i].approved){
                            $row.push(`<td>
                            Approved
                            <a class="removeblog" data-blogid="${docs[i]['_id']}" href=""><i style="color: red;" class="fa fa-trash-o"></i></a></td>
                            
                            `)
                        }
                        else{
                            $row.push(`<td>
                            <a class="approveblog" data-blogid="${docs[i]['_id']}" href=""><i style="color: red;" class="fa fa-check"></i></a></td>
                            <a class="removeblog" data-blogid="${docs[i]['_id']}" href=""><i style="color: red;" class="fa fa-trash-o"></i></a></td>
                            
                            `)
                        }
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
 * /blogs/categories/manage:
 *   get:
 *     summary: Retrieve and display the admin panel page for managing blog categories.
 *     tags: [Blog]
 */
router.get('/categories/manage', isAdmin, function (req, res) {
    category.find({ 'deleted': { $ne: true } }, function (err, docs) {
        res.render('adminpanel/category', { email: req.user.email, registered: req.user.courses.length > 0 ? true : false, recruiter: (req.user.role && req.user.role == '3') ? true : false, name: getusername(req.user), notifications: req.user.notifications, docs: docs, moment: moment });

    });
});

module.exports = router;
