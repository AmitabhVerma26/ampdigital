router.post('/applyjob', function (req, res, next) {
    var jobapplicationObj = new jobapplication({
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        recruiteremail: req.body.recruiteremail,
        jobtitle: req.body.jobtitle,
        jobid: req.body.jobid,
        date: new Date()
    });
    jobapplicationObj.save(function (err, results) {
        if (err) {
            res.json(err);
        }
        else {
            var awsSesMail = require('aws-ses-mail');
            var sesMail = new awsSesMail();
            var sesConfig = {
                accessKeyId: "AKIAQFXTPLX2CNUSHP5C",
                secretAccessKey: "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",
                region: 'us-west-2'
            };
            sesMail.setConfig(sesConfig);

            var html = 'Hello from AMP Digital,<br>\n' +
                '<br>\n' +
                'An applicant has applied to your the job posted. Please find details below:' +
                '<br>\n' +
                'Job title: ' + req.body.jobtitle +
                '<br>\n' +
                'Name of applicant: ' + req.body.name +
                '<br>\n' +
                'Email of applicant: ' + req.body.email +
                '<br>\n' +
                'Phone of applicant: ' + req.body.phone +
                '<br>\n' +
                '<br>\n' +
                '<br><table width="351" cellspacing="0" cellpadding="0" border="0"> <tr> <td style="text-align:left;padding-bottom:10px"><a style="display:inline-block" href="https://www.ampdigital.co"><img style="border:none;" width="150" src="https://s1g.s3.amazonaws.com/36321c48a6698bd331dca74d7497797b.jpeg"></a></td> </tr> <tr> <td style="border-top:solid #000000 2px;" height="12"></td> </tr> <tr> <td style="vertical-align: top; text-align:left;color:#000000;font-size:12px;font-family:helvetica, arial;; text-align:left"> <span> </span> <br> <span style="font:12px helvetica, arial;">Email:&nbsp;<a href="mailto:amitabh@ampdigital.co" style="color:#3388cc;text-decoration:none;">amitabh@ampdigital.co</a></span> <br><br> <span style="margin-right:5px;color:#000000;font-size:12px;font-family:helvetica, arial">Registered Address: AMP Digital</span> 403, Sovereign 1, Vatika City, Sohna Road,, Gurugram, Haryana, 122018, India<br><br> <table cellpadding="0" cellpadding="0" border="0"><tr><td style="padding-right:5px"><a href="https://facebook.com/https://www.facebook.com/AMPDigitalNet/" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/23f7b48395f8c4e25e64a2c22e9ae190.png" alt="Facebook" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://twitter.com/https://twitter.com/amitabh26" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3949237f892004c237021ac9e3182b1d.png" alt="Twitter" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://linkedin.com/in/https://in.linkedin.com/company/ads4growth?trk=public_profile_topcard_current_company" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/dcb46c3e562be637d99ea87f73f929cb.png" alt="LinkedIn" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://youtube.com/https://www.youtube.com/channel/UCMOBtxDam_55DCnmKJc8eWQ" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3b2cb9ec595ab5d3784b2343d5448cd9.png" alt="YouTube" style="border:none;"></a></td></tr></table><a href="https://www.ampdigital.co" style="text-decoration:none;color:#3388cc;">www.ampdigital.co</a> </td> </tr> </table> <table width="351" cellspacing="0" cellpadding="0" border="0" style="margin-top:10px"> <tr> <td style="text-align:left;color:#aaaaaa;font-size:10px;font-family:helvetica, arial;"><p>AMP&nbsp;Digital is a Google Partner Company</p></td> </tr> </table>'
            var options = {
                from: 'ampdigital.co <amitabh@ads4growth.com>',
                to: req.body.recruiteremail,
                subject: 'ampdigital.co: Job Application received',
                content: '<html><head></head><body>' + html + '</body></html>'
            };

            sesMail.sendEmail(options, function (err, data) {
                // TODO sth....
                console.log(err);
                res.json(1);
            });
        }
    });
});