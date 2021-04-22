var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../models/user');
var configAuth = require('./auth');

module.exports = function (passport) {

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
    function (req, email, password, done) {
      process.nextTick(function () {
        console.log("__haeghapiehgapiehg");
        console.log(req.body);
        if(req.body["g-recaptcha-response"] == ""){
          console.log("recaptcha haegiapheg__");
          return done(null, false, req.flash('signupMessage', 'Kindly fill recaptcha'));
        }
        else{
          User.findOne({ 'local.email': email }, function (err, user) {
            if(err){
              console.log("here");
              console.log(err);
            }
            if (err)
              return done(err);
            if (user) {
              console.log("hereeee");
              // console.log(user);
              console.log(req.body);
              if(typeof req.body.isreferralsignup!=="undefined" && req.body.isreferralsignup && req.body.isreferralsignup=="yes"){
                User.update(
                  {
                    'local.email': req.body.emails
                  },
                  {
                    $set: { "loggedin": new Date() }
                  }
                  ,
                  function (err, count) {
                    if (err) {
                      console.log(err);
                    }
                    else {
                      return done(null, user);
                    }
                  });
              }
              else{
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
              }
            } else {
              User.count({ 'local.name': req.body.name, 'local.referralcode': { $exists: true } }, function (err, count) {
                var newUser = new User();
                newUser.local.email = req.body.email;
                newUser.email = req.body.email;
                newUser.local.name = req.body.name;
                newUser.local.lastname = req.body.lastname;
                if(req.body.company){
                  newUser.company = req.body.company;
                  newUser.role = "3";
                }
                newUser.local.phone = req.body.phone;
                newUser.local.password = newUser.generateHash(req.body.password);
                newUser.local.couponcode = req.body.couponcode;
                newUser.local.referralcode = req.body.name + (count + 1).toString();
                newUser.date = new Date();
                newUser.save(function (err) {
                  if (err)
                    throw err;
                  var awsSesMail = require('aws-ses-mail');
  
                  var sesMail = new awsSesMail();
                  var sesConfig = {
                    accessKeyId: "AKIAQFXTPLX2CNUSHP5C",
                    secretAccessKey: "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",
                    region: 'us-west-2'
                  };
                  sesMail.setConfig(sesConfig);
  
                  var html = `Dear ${req.body.name},
                  <br><br>
                  Welcome to AMP Digital and thanks for Registering on AMP Digital, your place to learn Digital
  Marketing.
                  <br>
                  <br>
                  You can learn about our world class training programs here:
                  <br>
                  <br>
                  <a style="text-decoration: none!important;" href="http://www.ampdigital.co/#courses"><div style="width:220px;height:100%;color:#ffffff;background-color:#7fbf4d;border:1px solid #63a62f;border-bottom:1px solid #5b992b;background-image:-webkit-linear-gradient(top,#7fbf4d,#63a62f);background-image:-moz-linear-gradient(top,#7fbf4d,#63a62f);background-image:-ms-linear-gradient(top,#7fbf4d,#63a62f);background-image:-o-linear-gradient(top,#7fbf4d,#63a62f);background-image:linear-gradient(top,#7fbf4d,#63a62f);border-radius:3px;line-height:1;padding:7px 0 8px 0;text-align:center"><span>AMP Digital</span></div></a>
                  <br>
                  We have built the training programs keeping the industry in mind so that you can start with your
                  career in digital with right earnest. We have also built an awesome referral program so that you can
                  earn by referring your friends to our programs.
                  <br>
                  <br>
                  Look forward to having you as a part of our program.  If you have any questions, please feel free to reply to this email and we will be happy to assist you.
  <br><br>
  <i>In case of any query, you can reply back to this mail.</i>
  <br><br>
  
                  Best Wishes,
                  <br>
                  <table width="351" cellspacing="0" cellpadding="0" border="0"> <tr> <td style="text-align:left;padding-bottom:10px"><a style="display:inline-block" href="https://www.ampdigital.co"><img style="border:none;" width="150" src="https://s1g.s3.amazonaws.com/36321c48a6698bd331dca74d7497797b.jpeg"></a></td> </tr> <tr> <td style="border-top:solid #000000 2px;" height="12"></td> </tr> <tr> <td style="vertical-align: top; text-align:left;color:#000000;font-size:12px;font-family:helvetica, arial;; text-align:left"> <span> </span> <br> <span style="font:12px helvetica, arial;">Email:&nbsp;<a href="mailto:amitabh@ampdigital.co" style="color:#3388cc;text-decoration:none;">amitabh@ampdigital.co</a></span> <br><br> <span style="margin-right:5px;color:#000000;font-size:12px;font-family:helvetica, arial">Registered Address: AMP Digital</span> 403, Sovereign 1, Vatika City, Sohna Road,, Gurugram, Haryana, 122018, India<br><br> <table cellpadding="0" cellpadding="0" border="0"><tr><td style="padding-right:5px"><a href="https://facebook.com/https://www.facebook.com/AMPDigitalNet/" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/23f7b48395f8c4e25e64a2c22e9ae190.png" alt="Facebook" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://twitter.com/https://twitter.com/amitabh26" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3949237f892004c237021ac9e3182b1d.png" alt="Twitter" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://linkedin.com/in/https://in.linkedin.com/company/ads4growth?trk=public_profile_topcard_current_company" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/dcb46c3e562be637d99ea87f73f929cb.png" alt="LinkedIn" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://youtube.com/https://www.youtube.com/channel/UCMOBtxDam_55DCnmKJc8eWQ" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3b2cb9ec595ab5d3784b2343d5448cd9.png" alt="YouTube" style="border:none;"></a></td></tr></table><a href="https://www.ampdigital.co" style="text-decoration:none;color:#3388cc;">www.ampdigital.co</a> </td> </tr> </table> <table width="351" cellspacing="0" cellpadding="0" border="0" style="margin-top:10px"> <tr> <td style="text-align:left;color:#aaaaaa;font-size:10px;font-family:helvetica, arial;"><p>AMP&nbsp;Digital is a Google Partner Company</p></td> </tr> </table>  `;
  
                  var options = {
                    from: 'ampdigital.co <amitabh@ads4growth.com>',
                    to: req.body.email,
                    subject: 'Welcome to AMP Digital!',
                    content: '<html><head></head><body>' + html + '</body></html>'
                  };
  
                  if(typeof req.body.isreferralsignup!=="undefined" && req.body.isreferralsignup && req.body.isreferralsignup=="yes"){
                    return done(null, newUser);
                  }
                  else{
                    sesMail.sendEmail(options, function (err, data) {
                      // TODO sth....
                      if (err) {
                        console.log(err);
                      }
                      return done(null, newUser);
                    });
                  }
                });
              })
            }
          });
        }
      });
    }));

    passport.use('local-signup-email-verification', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
      function (req, email, password, done) {
        process.nextTick(function () {
          console.log("__haeghapiehgapiehg");
          console.log(req.body);
          if(req.body["g-recaptcha-response"] == ""){
            console.log("recaptcha haegiapheg__");
            return done(null, false, req.flash('signupMessage', 'Kindly fill recaptcha'));
          }
          else{
            User.findOne({ 'local.email': email }, function (err, user) {
              if(err){
                console.log("here");
                console.log(err);
              }
              if (err)
                return done(err);
              if (user) {
                console.log("hereeee");
                // console.log(user);
                console.log(req.body);
                if(typeof req.body.isreferralsignup!=="undefined" && req.body.isreferralsignup && req.body.isreferralsignup=="yes"){
                  User.update(
                    {
                      'local.email': req.body.emails
                    },
                    {
                      $set: { "loggedin": new Date() }
                    }
                    ,
                    function (err, count) {
                      if (err) {
                        console.log(err);
                      }
                      else {
                        return done(null, user);
                      }
                    });
                }
                else{
                  return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                }
              } else {
                User.count({ 'local.name': req.body.name, 'local.referralcode': { $exists: true } }, function (err, count) {
                  var newUser = new User();
                  newUser.local.email = req.body.email;
                  newUser.email = req.body.email;
                  newUser.local.name = req.body.name;
                  newUser.local.lastname = req.body.lastname;
                  if(req.body.company){
                    newUser.company = req.body.company;
                    newUser.role = "3";
                  }
                  newUser.local.phone = req.body.phone;
                  newUser.validated = false;
                  newUser.ip = req.ip;
                  newUser.local.password = newUser.generateHash(req.body.password);
                  newUser.local.couponcode = req.body.couponcode;
                  newUser.local.referralcode = req.body.name + (count + 1).toString();
                  newUser.date = new Date();
                  if(newUser.local.name!=='Jamesahegapheg'){
                    newUser.save(function (err) {
                      if (err)
                        throw err;
                      var awsSesMail = require('aws-ses-mail');
      
                      var sesMail = new awsSesMail();
                      var sesConfig = {
                        accessKeyId: "AKIAQFXTPLX2CNUSHP5C",
                        secretAccessKey: "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",
                        region: 'us-west-2'
                      };
                      sesMail.setConfig(sesConfig);
    
                      var emailbase64encoded = Buffer.from(req.body.email).toString('base64');
                      var passwordbase64encoded = Buffer.from(req.body.password).toString('base64');
                      var returnTobase64encoded = Buffer.from(req.session.returnTo).toString('base64');
      
                      var html2 = `Dear ${req.body.name},
                      <br><br>
                      Welcome to AMP Digital and thanks for Registering on AMP Digital, your place to learn Digital
      Marketing. You need to verify your email before you start your journey with AMP Digital.
      <br><br>
      <div style="text-align:center;margin:16px auto 16px;display:block;height:30px">
      <a href="http://localhost:3002/registration/activate/profile/user/${emailbase64encoded}/${passwordbase64encoded}/${returnTobase64encoded}" style="text-decoration:none;border-radius:2px!important;font-style:normal;border:0;background-color:#1295c9;color:#ffffff!important;padding:6px 12px;margin-bottom:0;font-size:13px;text-align:center;width:120px;display:block;margin:auto" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://internshala.com/registration/activate/21CD4029-2FCE-E21D-7A79-951BC5EA1230/profile/user/16174521?utm_source%3Dstudent_verification_mail&amp;source=gmail&amp;ust=1618391420913000&amp;usg=AFQjCNGfvwOv-zn4VuvF8gi3TMZPjh6aLQ">Verify Email</a>
    </div>
      <br><br>
      
                      Best Wishes,
                      <br>
                      <table width="351" cellspacing="0" cellpadding="0" border="0"> <tr> <td style="text-align:left;padding-bottom:10px"><a style="display:inline-block" href="https://www.ampdigital.co"><img style="border:none;" width="150" src="https://s1g.s3.amazonaws.com/36321c48a6698bd331dca74d7497797b.jpeg"></a></td> </tr> <tr> <td style="border-top:solid #000000 2px;" height="12"></td> </tr> <tr> <td style="vertical-align: top; text-align:left;color:#000000;font-size:12px;font-family:helvetica, arial;; text-align:left"> <span> </span> <br> <span style="font:12px helvetica, arial;">Email:&nbsp;<a href="mailto:amitabh@ampdigital.co" style="color:#3388cc;text-decoration:none;">amitabh@ampdigital.co</a></span> <br><br> <span style="margin-right:5px;color:#000000;font-size:12px;font-family:helvetica, arial">Registered Address: AMP Digital</span> 403, Sovereign 1, Vatika City, Sohna Road,, Gurugram, Haryana, 122018, India<br><br> <table cellpadding="0" cellpadding="0" border="0"><tr><td style="padding-right:5px"><a href="https://facebook.com/https://www.facebook.com/AMPDigitalNet/" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/23f7b48395f8c4e25e64a2c22e9ae190.png" alt="Facebook" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://twitter.com/https://twitter.com/amitabh26" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3949237f892004c237021ac9e3182b1d.png" alt="Twitter" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://linkedin.com/in/https://in.linkedin.com/company/ads4growth?trk=public_profile_topcard_current_company" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/dcb46c3e562be637d99ea87f73f929cb.png" alt="LinkedIn" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://youtube.com/https://www.youtube.com/channel/UCMOBtxDam_55DCnmKJc8eWQ" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3b2cb9ec595ab5d3784b2343d5448cd9.png" alt="YouTube" style="border:none;"></a></td></tr></table><a href="https://www.ampdigital.co" style="text-decoration:none;color:#3388cc;">www.ampdigital.co</a> </td> </tr> </table> <table width="351" cellspacing="0" cellpadding="0" border="0" style="margin-top:10px"> <tr> <td style="text-align:left;color:#aaaaaa;font-size:10px;font-family:helvetica, arial;"><p>AMP&nbsp;Digital is a Google Partner Company</p></td> </tr> </table>  `;
      
                      var html = `Dear ${req.body.name},
                      <br><br>
                      Welcome to AMP Digital and thanks for Registering on AMP Digital, your place to learn Digital
      Marketing.
                      <br>
                      <br>
                      You can learn about our world class training programs here:
                      <br>
                      <br>
                      <a style="text-decoration: none!important;" href="http://www.ampdigital.co/#courses"><div style="width:220px;height:100%;color:#ffffff;background-color:#7fbf4d;border:1px solid #63a62f;border-bottom:1px solid #5b992b;background-image:-webkit-linear-gradient(top,#7fbf4d,#63a62f);background-image:-moz-linear-gradient(top,#7fbf4d,#63a62f);background-image:-ms-linear-gradient(top,#7fbf4d,#63a62f);background-image:-o-linear-gradient(top,#7fbf4d,#63a62f);background-image:linear-gradient(top,#7fbf4d,#63a62f);border-radius:3px;line-height:1;padding:7px 0 8px 0;text-align:center"><span>AMP Digital</span></div></a>
                      <br>
                      We have built the training programs keeping the industry in mind so that you can start with your
                      career in digital with right earnest. We have also built an awesome referral program so that you can
                      earn by referring your friends to our programs.
                      <br>
                      <br>
                      Look forward to having you as a part of our program.  If you have any questions, please feel free to reply to this email and we will be happy to assist you.
      <br><br>
      <i>In case of any query, you can reply back to this mail.</i>
      <br><br>
      
                      Best Wishes,
                      <br>
                      <table width="351" cellspacing="0" cellpadding="0" border="0"> <tr> <td style="text-align:left;padding-bottom:10px"><a style="display:inline-block" href="https://www.ampdigital.co"><img style="border:none;" width="150" src="https://s1g.s3.amazonaws.com/36321c48a6698bd331dca74d7497797b.jpeg"></a></td> </tr> <tr> <td style="border-top:solid #000000 2px;" height="12"></td> </tr> <tr> <td style="vertical-align: top; text-align:left;color:#000000;font-size:12px;font-family:helvetica, arial;; text-align:left"> <span> </span> <br> <span style="font:12px helvetica, arial;">Email:&nbsp;<a href="mailto:amitabh@ampdigital.co" style="color:#3388cc;text-decoration:none;">amitabh@ampdigital.co</a></span> <br><br> <span style="margin-right:5px;color:#000000;font-size:12px;font-family:helvetica, arial">Registered Address: AMP Digital</span> 403, Sovereign 1, Vatika City, Sohna Road,, Gurugram, Haryana, 122018, India<br><br> <table cellpadding="0" cellpadding="0" border="0"><tr><td style="padding-right:5px"><a href="https://facebook.com/https://www.facebook.com/AMPDigitalNet/" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/23f7b48395f8c4e25e64a2c22e9ae190.png" alt="Facebook" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://twitter.com/https://twitter.com/amitabh26" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3949237f892004c237021ac9e3182b1d.png" alt="Twitter" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://linkedin.com/in/https://in.linkedin.com/company/ads4growth?trk=public_profile_topcard_current_company" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/dcb46c3e562be637d99ea87f73f929cb.png" alt="LinkedIn" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://youtube.com/https://www.youtube.com/channel/UCMOBtxDam_55DCnmKJc8eWQ" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3b2cb9ec595ab5d3784b2343d5448cd9.png" alt="YouTube" style="border:none;"></a></td></tr></table><a href="https://www.ampdigital.co" style="text-decoration:none;color:#3388cc;">www.ampdigital.co</a> </td> </tr> </table> <table width="351" cellspacing="0" cellpadding="0" border="0" style="margin-top:10px"> <tr> <td style="text-align:left;color:#aaaaaa;font-size:10px;font-family:helvetica, arial;"><p>AMP&nbsp;Digital is a Google Partner Company</p></td> </tr> </table>  `;
      
                      var options = {
                        from: 'ampdigital.co <amitabh@ads4growth.com>',
                        to: req.body.email,
                        subject: 'Verify Your Email!',
                        content: '<html><head></head><body>' + html2 + '</body></html>'
                      };
      
                      if(typeof req.body.isreferralsignup!=="undefined" && req.body.isreferralsignup && req.body.isreferralsignup=="yes"){
                        return done(null, newUser);
                      }
                      else{
                        sesMail.sendEmail(options, function (err, data) {
                          // TODO sth....
                          if (err) {
                            console.log(err);
                          }
                          return done(null, false, req.flash('signupMessage', 'An email wth verification link has been sent to your email ID. Please click on that link to confirm registration. Check your spam folder or promotions tab too.'));
                        });
                      }
                    });
                  }
                  else{
                    return done(null, false, req.flash('signupMessage', 'Thank you for registration!'));
                  }
                })
              }
            });
          }
        });
      }));

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
    function (req, email, password, done) {
      User.findOne({ 'local.email': email }, function (err, user) {
        if (err)
          return done(err);
        if (!user)
          return done(null, false, req.flash('loginMessage', 'No user found.'));
        if (!user.validPassword(password))
          return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

        else {
          User.update(
            {
              'local.email': email
            },
            {
              $set: { "loggedin": new Date() }
            }
            ,
            function (err, count) {
              console.log('HELLOOO');
              console.log(count);
              if (err) {
                console.log(err);
              }
              else {
                return done(null, user);
              }
            });
        }
      });
    }));

  passport.use(new FacebookStrategy({
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL,
    profileFields: ['id', 'email', 'first_name', 'last_name'],
  },
    function (token, refreshToken, profile, done) {
      process.nextTick(function () {
        User.findOne({ 'facebook.id': profile.id }, function (err, user) {
          if (err)
            return done(err);
          if (user) {
            return done(null, user);
          } else {
            var newUser = new User();
            newUser.facebook.id = profile.id;
            newUser.facebook.token = token;
            newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
            newUser.facebook.email = (profile.emails[0].value || '').toLowerCase();
            newUser.email = (profile.emails[0].value || '').toLowerCase();

            newUser.save(function (err) {
              if (err)
                throw err;
              return done(null, newUser);
            });
          }
        });
      });
    }));

  passport.use(new TwitterStrategy({
    consumerKey: configAuth.twitterAuth.consumerKey,
    consumerSecret: configAuth.twitterAuth.consumerSecret,
    callbackURL: configAuth.twitterAuth.callbackURL,
    includeEmail: true
  },
    function (token, tokenSecret, profile, done) {
      process.nextTick(function () {
        User.findOne({ 'email': profile.emails[0].value }, function (err, user) {
          if (err)
            return done(err);
          if (user) {
            if(user.twitter.id){
              User.update(
                {
                  'email': (profile.emails[0].value || '').toLowerCase()
                },
                {
                  $set: { "loggedin": new Date() }
                }
                ,
                function (err, count) {
                  if (err) {
                    console.log(err);
                  }
                  else {
                    return done(null, user);
                  }
                });
            }
            else{
              User.update(
                {
                  'email': profile.emails[0].value
                },
                {
                  $set: { "twitter.id": profile.id, "twitter.token": token, "twitter.username": profile.username, "twitter.displayName": profile.displayName, "loggedin": new Date() }
                }
                ,
                function (err, count) {
                  if (err) {
                    console.log(err);
                  }
                  else {
                    console.log(count);
                    return done(null, user);
                  }
                });
            }
          } else {
            var name = profile.displayName.replace(/ .*/,'');
            User.count({ $or: [ {'local.name': name}, {'linkedin.name': name}, {'google.name': name}, {'twitter.displayName': name} ], 'local.referralcode': { $exists: true } }, function (err, count) {
              var newUser = new User();
              newUser.twitter.id = profile.id;
              newUser.twitter.token = token;
              newUser.local.referralcode = name + (count + 1).toString();
              newUser.twitter.username = profile.username;
              newUser.twitter.displayName = profile.displayName;
              newUser.email = (profile.emails[0].value || '').toLowerCase();
              newUser.save(function(err) {
                if (err)
                    throw err;
                var awsSesMail = require('aws-ses-mail');

                var sesMail = new awsSesMail();
                var sesConfig = {
                  accessKeyId: "AKIAQFXTPLX2CNUSHP5C",
                  secretAccessKey: "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",
                  region: 'us-west-2'
                };
                sesMail.setConfig(sesConfig);

                var html = `Dear ${profile.displayName},
                <br><br>
                Welcome to AMP Digital and thanks for Registering on AMP Digital, your place to learn Digital
Marketing.
                <br>
                <br>
                You can learn about our world class training programs here:
                <br>
                <br>
                <a style="text-decoration: none!important;" href="http://www.ampdigital.co/#courses"><div style="width:220px;height:100%;color:#ffffff;background-color:#7fbf4d;border:1px solid #63a62f;border-bottom:1px solid #5b992b;background-image:-webkit-linear-gradient(top,#7fbf4d,#63a62f);background-image:-moz-linear-gradient(top,#7fbf4d,#63a62f);background-image:-ms-linear-gradient(top,#7fbf4d,#63a62f);background-image:-o-linear-gradient(top,#7fbf4d,#63a62f);background-image:linear-gradient(top,#7fbf4d,#63a62f);border-radius:3px;line-height:1;padding:7px 0 8px 0;text-align:center"><span>AMP Digital</span></div></a>
                <br>
                We have built the training programs keeping the industry in mind so that you can start with your
                career in digital with right earnest. We have also built an awesome referral program so that you can
                earn by referring your friends to our programs.
                <br>
                <br>
                Look forward to having you as a part of our program.  If you have any questions, please feel free to reply to this email and we will be happy to assist you.
<br><br>
<i>In case of any query, you can reply back to this mail.</i>
<br><br>

                Best Wishes,
                <br>
                <table width="351" cellspacing="0" cellpadding="0" border="0"> <tr> <td style="text-align:left;padding-bottom:10px"><a style="display:inline-block" href="https://www.ampdigital.co"><img style="border:none;" width="150" src="https://s1g.s3.amazonaws.com/36321c48a6698bd331dca74d7497797b.jpeg"></a></td> </tr> <tr> <td style="border-top:solid #000000 2px;" height="12"></td> </tr> <tr> <td style="vertical-align: top; text-align:left;color:#000000;font-size:12px;font-family:helvetica, arial;; text-align:left"> <span> </span> <br> <span style="font:12px helvetica, arial;">Email:&nbsp;<a href="mailto:amitabh@ampdigital.co" style="color:#3388cc;text-decoration:none;">amitabh@ampdigital.co</a></span> <br><br> <span style="margin-right:5px;color:#000000;font-size:12px;font-family:helvetica, arial">Registered Address: AMP Digital</span> 403, Sovereign 1, Vatika City, Sohna Road,, Gurugram, Haryana, 122018, India<br><br> <table cellpadding="0" cellpadding="0" border="0"><tr><td style="padding-right:5px"><a href="https://facebook.com/https://www.facebook.com/AMPDigitalNet/" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/23f7b48395f8c4e25e64a2c22e9ae190.png" alt="Facebook" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://twitter.com/https://twitter.com/amitabh26" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3949237f892004c237021ac9e3182b1d.png" alt="Twitter" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://linkedin.com/in/https://in.linkedin.com/company/ads4growth?trk=public_profile_topcard_current_company" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/dcb46c3e562be637d99ea87f73f929cb.png" alt="LinkedIn" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://youtube.com/https://www.youtube.com/channel/UCMOBtxDam_55DCnmKJc8eWQ" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3b2cb9ec595ab5d3784b2343d5448cd9.png" alt="YouTube" style="border:none;"></a></td></tr></table><a href="https://www.ampdigital.co" style="text-decoration:none;color:#3388cc;">www.ampdigital.co</a> </td> </tr> </table> <table width="351" cellspacing="0" cellpadding="0" border="0" style="margin-top:10px"> <tr> <td style="text-align:left;color:#aaaaaa;font-size:10px;font-family:helvetica, arial;"><p>AMP&nbsp;Digital is a Google Partner Company</p></td> </tr> </table>  `;

                var options = {
                  from: 'ampdigital.co <amitabh@ads4growth.com>',
                  to: profile.emails[0].value,
                  subject: 'Welcome to AMP Digital!',
                  content: '<html><head></head><body>' + html + '</body></html>'
                };

                sesMail.sendEmail(options, function (err, data) {
                  // TODO sth....
                  if (err) {
                    console.log(err);
                  }
                  return done(null, newUser);
                });
            });
              
            });
          }
        });
      });
    }));

    var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
    passport.use(new LinkedInStrategy({
      clientID: configAuth.linkedinAuth.key,
    clientSecret: configAuth.linkedinAuth.secret,
    callbackURL: "/auth/linkedin/callback",
      scope: ['r_emailaddress', 'r_liteprofile'],
    }, function(accessToken, refreshToken, profile, done) {
      console.log("___jeere");
      console.log(profile);
      process.nextTick(function () {
        User.findOne({ 'email': profile.emails[0].value }, function (err, user) {
          if (err)
            return done(err);
          if (user) {
            if(user.linkedin.id){
              User.update(
                {
                  'email': profile.emails[0].value
                },
                {
                  $set: { "loggedin": new Date() }
                }
                ,
                function (err, count) {
                  if (err) {
                    console.log(err);
                  }
                  else {
                    return done(null, user);
                  }
                });
            }
            else{
              User.update(
                {
                  'email': profile.emails[0].value
                },
                {
                  $set: { "linkedin.id": profile.id, "linkedin.token": accessToken, "linkedin.name": profile.displayName, "linkedin.email": profile.emails[0].value, "linkedin.any": {jsonstringified: JSON.stringify(profile._json)}, "loggedin": new Date() }
                }
                ,
                function (err, count) {
                  console.log("__ahiegaeg");
                  if (err) {
                    console.log(err);
                  }
                  else {
                    console.log(count);
                    return done(null, user);
                  }
                });
            }
          } else {
            var name = profile.displayName.replace(/ .*/,'');
            User.count({ $or: [ {'local.name': name}, {'linkedin.name': name}, {'google.name': name}, {'twitter.displayName': name} ], 'local.referralcode': { $exists: true } }, function (err, count) {
              var newUser = new User();
              newUser.userid = profile.displayName.toLowerCase().split(' ').join('-')+'-'+'1';
              newUser.linkedin.id          = profile.id;
              newUser.linkedin.token       = accessToken;
              newUser.linkedin.name = profile.displayName;
              newUser.fullname = profile.displayName;
              newUser.local.referralcode = name + (count + 1).toString();
              newUser.linkedin.email = profile.emails[0].value;
              newUser.email = profile.emails[0].value;
              newUser.linkedin.any = {jsonstringified: JSON.stringify(profile._json)};
              newUser.save(function(err) {
                  if (err)
                      throw err;
                  var awsSesMail = require('aws-ses-mail');

                  var sesMail = new awsSesMail();
                  var sesConfig = {
                    accessKeyId: "AKIAQFXTPLX2CNUSHP5C",
                    secretAccessKey: "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",
                    region: 'us-west-2'
                  };
                  sesMail.setConfig(sesConfig);
  
                  var html = `Dear ${profile.displayName},
                  <br><br>
                  Welcome to AMP Digital and thanks for Registering on AMP Digital, your place to learn Digital
  Marketing.
                  <br>
                  <br>
                  You can learn about our world class training programs here:
                  <br>
                  <br>
                  <a style="text-decoration: none!important;" href="http://www.ampdigital.co/#courses"><div style="width:220px;height:100%;color:#ffffff;background-color:#7fbf4d;border:1px solid #63a62f;border-bottom:1px solid #5b992b;background-image:-webkit-linear-gradient(top,#7fbf4d,#63a62f);background-image:-moz-linear-gradient(top,#7fbf4d,#63a62f);background-image:-ms-linear-gradient(top,#7fbf4d,#63a62f);background-image:-o-linear-gradient(top,#7fbf4d,#63a62f);background-image:linear-gradient(top,#7fbf4d,#63a62f);border-radius:3px;line-height:1;padding:7px 0 8px 0;text-align:center"><span>AMP Digital</span></div></a>
                  <br>
                  We have built the training programs keeping the industry in mind so that you can start with your
                  career in digital with right earnest. We have also built an awesome referral program so that you can
                  earn by referring your friends to our programs.
                  <br>
                  <br>
                  Look forward to having you as a part of our program.  If you have any questions, please feel free to reply to this email and we will be happy to assist you.
  <br><br>
  <i>In case of any query, you can reply back to this mail.</i>
  <br><br>
  
                  Best Wishes,
                  <br>
                  <table width="351" cellspacing="0" cellpadding="0" border="0"> <tr> <td style="text-align:left;padding-bottom:10px"><a style="display:inline-block" href="https://www.ampdigital.co"><img style="border:none;" width="150" src="https://s1g.s3.amazonaws.com/36321c48a6698bd331dca74d7497797b.jpeg"></a></td> </tr> <tr> <td style="border-top:solid #000000 2px;" height="12"></td> </tr> <tr> <td style="vertical-align: top; text-align:left;color:#000000;font-size:12px;font-family:helvetica, arial;; text-align:left"> <span> </span> <br> <span style="font:12px helvetica, arial;">Email:&nbsp;<a href="mailto:amitabh@ampdigital.co" style="color:#3388cc;text-decoration:none;">amitabh@ampdigital.co</a></span> <br><br> <span style="margin-right:5px;color:#000000;font-size:12px;font-family:helvetica, arial">Registered Address: AMP Digital</span> 403, Sovereign 1, Vatika City, Sohna Road,, Gurugram, Haryana, 122018, India<br><br> <table cellpadding="0" cellpadding="0" border="0"><tr><td style="padding-right:5px"><a href="https://facebook.com/https://www.facebook.com/AMPDigitalNet/" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/23f7b48395f8c4e25e64a2c22e9ae190.png" alt="Facebook" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://twitter.com/https://twitter.com/amitabh26" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3949237f892004c237021ac9e3182b1d.png" alt="Twitter" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://linkedin.com/in/https://in.linkedin.com/company/ads4growth?trk=public_profile_topcard_current_company" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/dcb46c3e562be637d99ea87f73f929cb.png" alt="LinkedIn" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://youtube.com/https://www.youtube.com/channel/UCMOBtxDam_55DCnmKJc8eWQ" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3b2cb9ec595ab5d3784b2343d5448cd9.png" alt="YouTube" style="border:none;"></a></td></tr></table><a href="https://www.ampdigital.co" style="text-decoration:none;color:#3388cc;">www.ampdigital.co</a> </td> </tr> </table> <table width="351" cellspacing="0" cellpadding="0" border="0" style="margin-top:10px"> <tr> <td style="text-align:left;color:#aaaaaa;font-size:10px;font-family:helvetica, arial;"><p>AMP&nbsp;Digital is a Google Partner Company</p></td> </tr> </table>  `;
  
                  var options = {
                    from: 'ampdigital.co <amitabh@ads4growth.com>',
                    to: profile.emails[0].value,
                    subject: 'Welcome to AMP Digital!',
                    content: '<html><head></head><body>' + html + '</body></html>'
                  };
  
                  sesMail.sendEmail(options, function (err, data) {
                    // TODO sth....
                    if (err) {
                      console.log(err);
                    }
                    return done(null, newUser);
                  });
              });
            });
          }
        });
      });
    }));
  passport.use(new GoogleStrategy({
    clientID: configAuth.googleAuth.clientID,
    clientSecret: configAuth.googleAuth.clientSecret,
    callbackURL: configAuth.googleAuth.callbackURL,
  },
    function (token, refreshToken, profile, done) {
      process.nextTick(function () {
        User.findOne({ 'email': profile.emails[0].value }, function (err, user) {
          if (err)
            return done(err);
          if (user) {
            if(user.google.id){
              User.update(
                {
                  'email': profile.emails[0].value
                },
                {
                  $set: { "loggedin": new Date() }
                }
                ,
                function (err, count) {
                  if (err) {
                    console.log(err);
                  }
                  else {
                    return done(null, user);
                  }
                });
            }
            else{
              // var newUser = {};
              // newUser.google = {};
              // newUser.google.id = profile.id;
              // newUser.google.token = token;
              // newUser.google.name = profile.displayName;
              // newUser.google.email = profile.emails[0].value;
              User.update(
                {
                  'email': profile.emails[0].value
                },
                {
                  $set: { "google.id": profile.id, "google.token": token, "google.name": profile.displayName, "google.email": profile.emails[0].value, "loggedin": new Date() }
                }
                ,
                function (err, count) {
                  console.log("__ahiegaeg");
                  if (err) {
                    console.log(err);
                  }
                  else {
                    console.log(count);
                    return done(null, user);
                  }
                });
            }
          } else {
            var name = profile.displayName.replace(/ .*/,'');
            User.count({ $or: [ {'local.name': name}, {'linkedin.name': name}, {'google.name': name}, {'twitter.displayName': name} ], 'local.referralcode': { $exists: true } }, function (err, count) {
              var newUser = new User();
              newUser.google.id = profile.id;
              newUser.google.token = token;
              newUser.google.name = profile.displayName;
              newUser.google.email = profile.emails[0].value;
              newUser.email = profile.emails[0].value;
              newUser.local.referralcode = name + (count + 1).toString();
              newUser.save(function(err) {
                if (err)
                    throw err;
                var awsSesMail = require('aws-ses-mail');

                var sesMail = new awsSesMail();
                var sesConfig = {
                  accessKeyId: "AKIAQFXTPLX2CNUSHP5C",
                  secretAccessKey: "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",
                  region: 'us-west-2'
                };
                sesMail.setConfig(sesConfig);

                var html = `Dear ${profile.displayName},
                <br><br>
                Welcome to AMP Digital and thanks for Registering on AMP Digital, your place to learn Digital
Marketing.
                <br>
                <br>
                You can learn about our world class training programs here:
                <br>
                <br>
                <a style="text-decoration: none!important;" href="http://www.ampdigital.co/#courses"><div style="width:220px;height:100%;color:#ffffff;background-color:#7fbf4d;border:1px solid #63a62f;border-bottom:1px solid #5b992b;background-image:-webkit-linear-gradient(top,#7fbf4d,#63a62f);background-image:-moz-linear-gradient(top,#7fbf4d,#63a62f);background-image:-ms-linear-gradient(top,#7fbf4d,#63a62f);background-image:-o-linear-gradient(top,#7fbf4d,#63a62f);background-image:linear-gradient(top,#7fbf4d,#63a62f);border-radius:3px;line-height:1;padding:7px 0 8px 0;text-align:center"><span>AMP Digital</span></div></a>
                <br>
                We have built the training programs keeping the industry in mind so that you can start with your
                career in digital with right earnest. We have also built an awesome referral program so that you can
                earn by referring your friends to our programs.
                <br>
                <br>
                Look forward to having you as a part of our program.  If you have any questions, please feel free to reply to this email and we will be happy to assist you.
<br><br>
<i>In case of any query, you can reply back to this mail.</i>
<br><br>

                Best Wishes,
                <br>
                <table width="351" cellspacing="0" cellpadding="0" border="0"> <tr> <td style="text-align:left;padding-bottom:10px"><a style="display:inline-block" href="https://www.ampdigital.co"><img style="border:none;" width="150" src="https://s1g.s3.amazonaws.com/36321c48a6698bd331dca74d7497797b.jpeg"></a></td> </tr> <tr> <td style="border-top:solid #000000 2px;" height="12"></td> </tr> <tr> <td style="vertical-align: top; text-align:left;color:#000000;font-size:12px;font-family:helvetica, arial;; text-align:left"> <span> </span> <br> <span style="font:12px helvetica, arial;">Email:&nbsp;<a href="mailto:amitabh@ampdigital.co" style="color:#3388cc;text-decoration:none;">amitabh@ampdigital.co</a></span> <br><br> <span style="margin-right:5px;color:#000000;font-size:12px;font-family:helvetica, arial">Registered Address: AMP Digital</span> 403, Sovereign 1, Vatika City, Sohna Road,, Gurugram, Haryana, 122018, India<br><br> <table cellpadding="0" cellpadding="0" border="0"><tr><td style="padding-right:5px"><a href="https://facebook.com/https://www.facebook.com/AMPDigitalNet/" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/23f7b48395f8c4e25e64a2c22e9ae190.png" alt="Facebook" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://twitter.com/https://twitter.com/amitabh26" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3949237f892004c237021ac9e3182b1d.png" alt="Twitter" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://linkedin.com/in/https://in.linkedin.com/company/ads4growth?trk=public_profile_topcard_current_company" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/dcb46c3e562be637d99ea87f73f929cb.png" alt="LinkedIn" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://youtube.com/https://www.youtube.com/channel/UCMOBtxDam_55DCnmKJc8eWQ" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3b2cb9ec595ab5d3784b2343d5448cd9.png" alt="YouTube" style="border:none;"></a></td></tr></table><a href="https://www.ampdigital.co" style="text-decoration:none;color:#3388cc;">www.ampdigital.co</a> </td> </tr> </table> <table width="351" cellspacing="0" cellpadding="0" border="0" style="margin-top:10px"> <tr> <td style="text-align:left;color:#aaaaaa;font-size:10px;font-family:helvetica, arial;"><p>AMP&nbsp;Digital is a Google Partner Company</p></td> </tr> </table>  `;

                var options = {
                  from: 'ampdigital.co <amitabh@ads4growth.com>',
                  to: profile.emails[0].value,
                  subject: 'Welcome to AMP Digital!',
                  content: '<html><head></head><body>' + html + '</body></html>'
                };

                sesMail.sendEmail(options, function (err, data) {
                  // TODO sth....
                  if (err) {
                    console.log(err);
                  }
                  return done(null, newUser);
                });
            });
              
            });
            
          }
        });
      });
    }));

};
