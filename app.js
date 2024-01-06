var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var flash = require('connect-flash');
var passport = require('passport');
var sslRedirect = require('heroku-ssl-redirect');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var compression = require('compression')
var CronJob = require('cron').CronJob;
var lmsUsers = require('./models/user');
var payment = require('./models/payment');
var webinaree = require('./models/webinaree');
var index = require('./routes/index');
var payments = require('./routes/payments');
var dashboard = require('./routes/dashboard');
var blogs = require('./routes/blogs');
var jobs = require('./routes/jobs');
var webinars = require('./routes/webinars');
var users = require('./routes/users');
var courses = require('./routes/courses');
var Sendy = require('sendy-api'),
    sendy = new Sendy('http://sendy.ampdigital.co/', 'tyYabXqRCZ8TiZho0xtJ');
var configDB = require('./config/database.js');
var device = require('express-device');

connect();

function connect() {
    return mongoose.connect(configDB.url, {
      keepAlive: 1,
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }

var app = express();


const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "ampdigital.co API doc",
      version: "1.0.0",
    },
  },
  apis: ["./routes/blogs.js", "./routes/webinars.js", "./routes/dashboard.js", "./routes/users.js", "./routes/payments.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
var job = new CronJob({
    cronTime: '0 20 * * *',

    onTick: function() {
        var d = new Date();
        d.setDate(d.getDate() - 10);
        lmsUsers.find({ validated: true, "createddate": { $gte: d}}, function (err, docs) {
            for(var i = 0; i<docs.length; i++){
                if(docs[i]["email"] && docs[i].local["name"]){
                    sendy.subscribe({api_key: 'tyYabXqRCZ8TiZho0xtJ', name: docs[i].local["name"],  email: docs[i]["email"], list_id: '763VYAUcr3YYkNmJQKawPiXg'}, function(err, result) {
                        sendy.subscribe({api_key: 'tyYabXqRCZ8TiZho0xtJ', name: docs[i].local["name"],  email: docs[i]["email"], list_id: 'ooYQ0ziAX892wi1brSgIj1uA'}, function(err, result) {
                            if (err) console.log(err.toString());
                            else console.log('Success: ' + result);
                        });
                    });
                    
                }
            }
        });

    },
    start: true
});

var job2 = new CronJob({
    cronTime: '0 21 * * *',

    onTick: function() {
        var d = new Date();
        d.setDate(d.getDate() - 10);
        webinaree.find({ "date": { $gte: d}}, function (err, docs) {
            for(var i = 0; i<docs.length; i++){
            if(docs[i]["email"] && docs[i]["firstname"]){
                sendy.subscribe({api_key: 'tyYabXqRCZ8TiZho0xtJ', name: docs[i]["firstname"],  email: docs[i]["email"], list_id: 'qfrjwMkLuBzWETooe74W7Q'}, function(err, result) {
                    if (err) console.log(err.toString());
                    else console.log('Success: ' + result);
                });
            }
        }
        res.json(docs.length);
    });

    },
    start: true
});

var job4 = new CronJob({
    cronTime: '0 22 * * *',

    onTick: function() {
        var d = new Date();
        d.setDate(d.getDate() - 10);
        lmsUsers.find({ "createddate": { $gte: d}}, function (err, docs) {
            for(var i = 0; i<docs.length; i++){
                if(docs[i]["email"] && docs[i].local["name"]){
                    sendy.subscribe({api_key: 'tyYabXqRCZ8TiZho0xtJ', name: docs[i].local["name"],  email: docs[i]["email"], list_id: 'qfrjwMkLuBzWETooe74W7Q'}, function(err, result) {
                        if (err) console.log(err.toString());
                        else console.log('Success: ' + result);
                    });
                }
            }
        });

    },
    start: true
});

var job5 = new CronJob({
    cronTime: '0 8 * * *',

    onTick: function() {
        payment.find({status: "Pending" }, function (err, docs) {
            for(var i = 0; i<docs.length; i++){
                sendy.subscribe({api_key: 'tyYabXqRCZ8TiZho0xtJ', course_name: docs[i]["purpose"], name: docs[i]["buyer_name"],  email: docs[i]["email"], list_id: 'kv04Kg1cBGe7CvpsEZ3cUw'}, function(err, result) {
                    if (err) console.log(err.toString());
                    else console.log('Success: ' + result);
                });
            }
        });

    },
    start: true
});


mongoose.connection.on('open', function (err, db) {
    job.start();
    job2.start();
    job4.start();
    job5.start();
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    // iplocate(req.ip, null, function(err, results) {
    //     if(err){
    //        next()
    //     }
    //     else if(results){
    //         if(results.org == "OVH SAS" || results.org=="Petersburg Internet Network ltd." || results.org=="Virtual Systems LLC" || results.org=="GleSYS AB"){
    //             res.json("");
    //         }
    //         else{
    //             next();
    //         }
    //     }
    // });
    next();
  });

app.use(compression())


// var Ddos = require('ddos')
// var ddos = new Ddos({burst:10, limit:15})
// app.use(ddos.express);

const MongoStore = require('connect-mongo')(session);
app.use(session({
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    secret: 'cookiesecret',        //cookie secret
    key: 'express.sid',
    cookie: { maxAge: 100000000000000 }
}));

// view engine setup
app.set('views', [path.join(__dirname, 'views'),
                      path.join(__dirname, 'views/courses/'), 
                      path.join(__dirname, 'views/webinars/')]);

app.set('view engine', 'ejs');
app.set('trust proxy', true)
// app.set('view cache', true);

app.use(device.capture());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: 'shhsecret', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// enable ssl redirect
app.use(sslRedirect());

const fileUpload = require('express-fileupload');

// default options
app.use(fileUpload());

require('./config/passport')(passport);

var httpRouter = express.Router();
app.use('*', httpRouter);
httpRouter.get('*', function(req, res, next){
    var host = req.get('Host');
    // replace the port in the host
    host = host.replace(/:\d+$/, ":"+app.get('port'));

    if(host=="www.ampdigitalnet.com"){
        return res.redirect("https://www.ampdigital.co/")
    }
    else{
        next();
    }
});  

app.use('/payments', payments);

app.use('/dashboard', dashboard);

app.use('/jobs', jobs);

app.use('/courses', courses);

app.use('/blogs', blogs);

app.use('/webinars', webinars);

app.use('/users', users);

app.use('/', index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// "aws-ses-mail": "^2.1.1",
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
