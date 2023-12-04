var moment = require('moment');

function addWebinareeHTML(params) {
    const { webinarpicture, webinardate, webinarname, webinarurl } = params;

    const html = `<html>
    <head>                                 <title></title>
    </head>
    <body>
    <table cellpadding="0" cellspacing="0" style="background:#f6f6f6" width="100%">
        <tbody>
            <tr>
                <td>
                <table cellpadding="0" cellspacing="0" style="max-width:600px;min-width:300px;margin:0 auto" width="100%">
                    <tbody>
                        <tr>
                            <td style="background-color:transparent;line-height:18px;padding:0px 0px 0px 0px">
                            <table align="center" height="30" style="width:100%;background-color:#ffffff;color:#ffffff;border-collapse:collapse" width="100%">
                                <tbody>
                                    <tr height="30" style="height:30px">
                                        <td align="center" style="vertical-align:middle;background-color:#f6f6f6" valign="middle"><span><img alt="" src="${webinarpicture}" style="width: 100%;" /></span></td>
                                    </tr>
                                </tbody>
                            </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
    
                <table cellpadding="0" cellspacing="0" style="max-width:600px;min-width:300px;margin:0 auto" width="100%">
                    <tbody>
                        <tr>
                            <td style="background:#ffffff">
                            <table cellpadding="0" cellspacing="0" width="100%">
                                <tbody>
                                    <tr>
                                        <td>
                                        <table cellpadding="0" cellspacing="0" width="100%">
                                            <tbody>
                                                <tr>
                                                    <td style="text-align:left;vertical-align:top;font-size:0px">
                                                    <table cellpadding="0" cellspacing="0" style="vertical-align:top;display:inline-table;background:transparent;table-layout:fixed;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#31302f;max-width:100%;width:100%;width:-webkit-calc(230400px - 48000%);width:calc(230400px - 48000%);min-width:480px;min-width:-webkit-calc(100%);min-width:calc(100%)">
                                                        <tbody>
                                                            <tr>
                                                                <td style="background-color:transparent;line-height:18px;padding:10px 30px 0px 30px">
                                                                <div style="display:inline-block;width:100%">
                                                                <div style="line-height:21px"><span style="font-size:14px">Dear attendee, </span></div>
    
                                                                <div style="line-height:18px">&nbsp;</div>
    
                                                                <div style="line-height:21px"><span style="font-size:14px">
                                                                We're looking forward to hosting you on ${moment(new Date(webinardate)).format("DD/MMM/YYYY")} at ${moment(new Date(webinardate)).format("HH:mm A")} at our ${webinarname == "Google Analytics for Digital Marketing" ?  "workshop" : "webinar"} - <a target="_blank" href="${'https://www.ampdigital.co/webinars/' + webinarurl}">${webinarname}</a> .
                                                                <br>
                                                                <br>
                                                                You will receive the workshop link on your email, a day in advance.
                                                                <br>
                                                                </div>
                                                                                                </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="background-color:transparent;line-height:18px;padding:10px 30px 10px 30px">
                                                                <div style="display:inline-block;width:100%">
    
                                                                <div>&nbsp;</div>
    
                                                                <div>Thanks, <br> Amitabh Verma</div>
    
                                                                <div>&nbsp;</div>
    
                                                                <table border="0" cellpadding="0" cellspacing="0" width="351">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td style="text-align:left;padding-bottom:10px"><a href="https://www.ampdigital.co" style="display:inline-block"><img src="https://s1g.s3.amazonaws.com/36321c48a6698bd331dca74d7497797b.jpeg" style="border:none;" width="150" /></a></td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td height="12" style="border-top:solid #000000 2px;">&nbsp;</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td style="vertical-align: top; text-align:left;color:#000000;font-size:12px;font-family:helvetica, arial;; text-align:left"><br />
                                                                            <span style="font:12px helvetica, arial;">Email:&nbsp;<a href="mailto:amitabh@ampdigital.co" style="color:#3388cc;text-decoration:none;">amitabh@ampdigital.co</a></span><br />
                                                                            <br />
                                                                            <span style="margin-right:5px;color:#000000;font-size:12px;font-family:helvetica, arial">Registered Address: AMP Digital</span> 403, Sovereign 1, Vatika City, Sohna Road,, Gurugram, Haryana, 122018, India<br />
                                                                            &nbsp;
                                                                            <table border="0" cellpadding="0">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td style="padding-right:5px"><a href="https://facebook.com/https://www.facebook.com/AMPDigitalNet/" style="display: inline-block;"><img alt="Facebook" height="40" src="https://s1g.s3.amazonaws.com/23f7b48395f8c4e25e64a2c22e9ae190.png" style="border:none;" width="40" /></a></td>
                                                                                        <td style="padding-right:5px"><a href="https://twitter.com/https://twitter.com/amitabh26" style="display: inline-block;"><img alt="Twitter" height="40" src="https://s1g.s3.amazonaws.com/3949237f892004c237021ac9e3182b1d.png" style="border:none;" width="40" /></a></td>
                                                                                        <td style="padding-right:5px"><a href="https://linkedin.com/in/https://in.linkedin.com/company/ads4growth?trk=public_profile_topcard_current_company" style="display: inline-block;"><img alt="LinkedIn" height="40" src="https://s1g.s3.amazonaws.com/dcb46c3e562be637d99ea87f73f929cb.png" style="border:none;" width="40" /></a></td>
                                                                                        <td style="padding-right:5px"><a href="https://youtube.com/https://www.youtube.com/channel/UCMOBtxDam_55DCnmKJc8eWQ" style="display: inline-block;"><img alt="YouTube" height="40" src="https://s1g.s3.amazonaws.com/3b2cb9ec595ab5d3784b2343d5448cd9.png" style="border:none;" width="40" /></a></td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                            <a href="https://www.ampdigital.co" style="text-decoration:none;color:#3388cc;">www.ampdigital.co</a></td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
    
                                                                <table border="0" cellpadding="0" cellspacing="0" style="margin-top:10px" width="351">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td style="text-align:left;color:#aaaaaa;font-size:10px;font-family:helvetica, arial;">
                                                                            <p>AMP&nbsp;Digital is a Google Partner Company</p>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                                </div>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
    
                <table cellpadding="0" cellspacing="0" style="max-width:600px;min-width:300px;margin:0 auto" width="100%">
                    <tbody>
                        <tr>
                            <td style="background-color:transparent;line-height:18px;padding:0px 0px 0px 0px">&nbsp;</td>
                        </tr>
                    </tbody>
                </table>
                </td>
            </tr>
        </tbody>
    </table>
    </body>
    </html>`;

    return html;
}

function generateWebinarCertificateHTML(req) {
    const html = `Hello ${req.body.name},<br>\n` +
    '<br>\n' +
    'Congratulations! You did it. You\'ve successfully completed the workshop. <br>\n' +
    'AMP Digital has issued an official Workshop Certificate to you. <br>' +
    '<br> <a style="text-decoration: none!important;" href="http://www.ampdigital.co/webinars/accomplishments/' + req.body.webinarid + '/'+ req.body.id + '"><div style="width:220px;color:#ffffff;background-color:#7fbf4d;border:1px solid #63a62f;border-bottom:1px solid #5b992b;background-image:-webkit-linear-gradient(top,#7fbf4d,#63a62f);background-image:-moz-linear-gradient(top,#7fbf4d,#63a62f);background-image:-ms-linear-gradient(top,#7fbf4d,#63a62f);background-image:-o-linear-gradient(top,#7fbf4d,#63a62f);background-image:linear-gradient(top,#7fbf4d,#63a62f);border-radius:3px;line-height:1;padding:1%;text-align:center"><span>View Your Accomplishments</span></div></a>' +
    '\n <br>' +
    '<p>'+
    'Please download the certificate on the desktop or laptop for better resolution. <br><br>'+
    '</p> Thanks, <br>'+
    '<table width="351" cellspacing="0" cellpadding="0" border="0"> <tr> <td style="text-align:left;padding-bottom:10px"><a style="display:inline-block" href="https://www.ampdigital.co"><img style="border:none;" width="100" src="https://www.ampdigital.co/maillogo.png"></a></td> </tr> <tr> <td style="border-top:solid #000000 2px;" height="12"></td> </tr> <tr> <td style="vertical-align: top; text-align:left;color:#000000;font-size:12px;font-family:helvetica, arial;; text-align:left"> <span> </span> <br> <span style="font:12px helvetica, arial;">Email:&nbsp;<a href="mailto:amitabh@ampdigital.co" style="color:#3388cc;text-decoration:none;">amitabh@ampdigital.co</a></span> <br><br> <span style="margin-right:5px;color:#000000;font-size:12px;font-family:helvetica, arial">Registered Address: AMP Digital</span> 403, Sovereign 1, Vatika City, Sohna Road,, Gurugram, Haryana, 122018, India<br><br> <table cellpadding="0" cellpadding="0" border="0"><tr><td style="padding-right:5px"><a href="https://facebook.com/https://www.facebook.com/AMPDigitalNet/" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/23f7b48395f8c4e25e64a2c22e9ae190.png" alt="Facebook" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://twitter.com/https://twitter.com/amitabh26" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3949237f892004c237021ac9e3182b1d.png" alt="Twitter" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://linkedin.com/in/https://in.linkedin.com/company/ads4growth?trk=public_profile_topcard_current_company" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/dcb46c3e562be637d99ea87f73f929cb.png" alt="LinkedIn" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://youtube.com/https://www.youtube.com/channel/UCMOBtxDam_55DCnmKJc8eWQ" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3b2cb9ec595ab5d3784b2343d5448cd9.png" alt="YouTube" style="border:none;"></a></td></tr></table><a href="https://www.ampdigital.co" style="text-decoration:none;color:#3388cc;">www.ampdigital.co</a> </td> </tr> </table> <table width="351" cellspacing="0" cellpadding="0" border="0" style="margin-top:10px"> <tr> <td style="text-align:left;color:#aaaaaa;font-size:10px;font-family:helvetica, arial;"><p>AMP&nbsp;Digital is a Google Partner Company</p></td> </tr> </table>';


    return html;
}

module.exports = {
    addWebinareeHTML,
    generateWebinarCertificateHTML
};
