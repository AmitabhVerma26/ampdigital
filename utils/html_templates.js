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

function generateWelcomeEmailHtml(userName, courseName) {
    return `
        Dear ${userName},
        <br><br>
        Welcome to the ${courseName}.
        <br><br>
        Mr. Amitabh Verma will be the lead instructor of this course
        <br><br>
        <br><br>
        Mr. Amitabh Verma will be the lead instructor of this course on Digital Marketing.
        <br><br>
        After having worked at Google for over 7 years as the Global SMB Advertiser Services Leader,
        Amitabh was rated amongst the top 100 digital marketers by Adobe, Paul Writer, and Pluralsight surveys
        for multiple years. Amitabh has consulted with many large Fortune 100 as well as millions of
        advertisers- while a part of Google and post that running AMP Digital.
        <br>
        <br>
        Now you’ll also be part of the referral program – where you can earn while you refer your friends to
        our programs. Check your referral code <a target="_blank" href="www.ampdigital.co/referral">here</a>
        <br><br>
        Thank you so much for choosing our course. It is a pleasure and honor to be able to contribute to
        your development.
        <br><br>
        You can access complete details about the course from Our Website:
        <br>
        <a style="text-decoration: none!important;" href="https://www.ampdigital.co/#courses">
            <div style="width:220px;height:100%;color:#ffffff;background-color:#7fbf4d;border:1px solid #63a62f;border-bottom:1px solid #5b992b;background-image:-webkit-linear-gradient(top,#7fbf4d,#63a62f);background-image:-moz-linear-gradient(top,#7fbf4d,#63a62f);background-image:-ms-linear-gradient(top,#7fbf4d,#63a62f);background-image:-o-linear-gradient(top,#7fbf4d,#63a62f);background-image:linear-gradient(top,#7fbf4d,#63a62f);border-radius:3px;line-height:1;padding:7px 0 8px 0;text-align:center">
                <span>AMP Digital</span>
            </div>
        </a>
        <br>
        <i>In case of any query, you can reply back to this mail.</i>
        <br>
        Best Wishes,
        <br>
        ${getContactInformationHtml()}
    `;
}

function getContactInformationHtml() {
    return `
        <table width="351" cellspacing="0" cellpadding="0" border="0">
            <tr>
                <td style="text-align:left;padding-bottom:10px">
                    <a style="display:inline-block" href="https://www.ampdigital.co">
                        <img style="border:none;" width="150" src="https://s1g.s3.amazonaws.com/36321c48a6698bd331dca74d7497797b.jpeg">
                    </a>
                </td>
            </tr>
            <tr>
                <td style="border-top:solid #000000 2px;" height="12"></td>
            </tr>
            <tr>
                <td style="vertical-align: top; text-align:left;color:#000000;font-size:12px;font-family:helvetica, arial;text-align:left">
                    <span> </span><br>
                    <span style="font:12px helvetica, arial;">Email:&nbsp;
                        <a href="mailto:amitabh@ampdigital.co" style="color:#3388cc;text-decoration:none;">amitabh@ampdigital.co</a>
                    </span><br><br>
                    <span style="margin-right:5px;color:#000000;font-size:12px;font-family:helvetica, arial">Registered Address: AMP Digital</span>
                    403, Sovereign 1, Vatika City, Sohna Road,, Gurugram, Haryana, 122018, India<br><br>
                    <table cellpadding="0" cellpadding="0" border="0">
                        <tr>
                            <td style="padding-right:5px">
                                <a href="https://facebook.com/https://www.facebook.com/AMPDigitalNet/" style="display: inline-block;">
                                    <img width="40" height="40" src="https://s1g.s3.amazonaws.com/23f7b48395f8c4e25e64a2c22e9ae190.png" alt="Facebook" style="border:none;">
                                </a>
                            </td>
                            <td style="padding-right:5px">
                                <a href="https://twitter.com/https://twitter.com/amitabh26" style="display: inline-block;">
                                    <img width="40" height="40" src="https://s1g.s3.amazonaws.com/3949237f892004c237021ac9e3182b1d.png" alt="Twitter" style="border:none;">
                                </a>
                            </td>
                            <td style="padding-right:5px">
                                <a href="https://linkedin.com/in/https://in.linkedin.com/company/ads4growth?trk=public_profile_topcard_current_company" style="display: inline-block;">
                                    <img width="40" height="40" src="https://s1g.s3.amazonaws.com/dcb46c3e562be637d99ea87f73f929cb.png" alt="LinkedIn" style="border:none;">
                                </a>
                            </td>
                            <td style="padding-right:5px">
                                <a href="https://youtube.com/https://www.youtube.com/channel/UCMOBtxDam_55DCnmKJc8eWQ" style="display: inline-block;">
                                    <img width="40" height="40" src="https://s1g.s3.amazonaws.com/3b2cb9ec595ab5d3784b2343d5448cd9.png" alt="YouTube" style="border:none;">
                                </a>
                            </td>
                        </tr>
                    </table>
                    <a href="https://www.ampdigital.co" style="text-decoration:none;color:#3388cc;">www.ampdigital.co</a>
                </td>
            </tr>
            <tr>
                <td style="text-align:left;color:#aaaaaa;font-size:10px;font-family:helvetica, arial;">
                    <p>AMP&nbsp;Digital is a Google Partner Company</p>
                </td>
            </tr>
        </table>
    `;
}


function generateLexTemplate(data) {
    return `
Hi Amitabh,
<br><br>
You have a new query from ${data.Name} on Alexa.
<br><br>
Details:
<br><br>
Email: ${data.Email}
<br>
<br>
Phone: ${data.Phone}
<br><br>
Query: ${data.Question}
<br><br>
regards,
<br>
<table width="351" cellspacing="0" cellpadding="0" border="0">
  <!-- ... rest of the HTML ... -->
</table>
<table width="351" cellspacing="0" cellpadding="0" border="0" style="margin-top:10px">
  <tr>
    <td style="text-align:left;color:#aaaaaa;font-size:10px;font-family:helvetica, arial;">
      <p>AMP&nbsp;Digital is a Google Partner Company</p>
    </td>
  </tr>
</table>`;
}

function getEbookTemplate(name){
    var template = `<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;max-width:600px!important">
    <tbody><tr>
        <td valign="top" style="background:transparent none no-repeat center/cover;background-color:transparent;background-image:none;background-repeat:no-repeat;background-position:center;background-size:cover;border-top:0;border-bottom:0;padding-top:0;padding-bottom:0"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse">
  <tbody>
  <tr>
  <td valign="top" style="padding-top:9px">
  
  
  
  <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%;min-width:100%;border-collapse:collapse" width="100%">
  <tbody><tr>
  
  <td valign="top" style="padding-top:0;padding-right:18px;padding-bottom:9px;padding-left:18px;word-break:break-word;color:#757575;font-family:Helvetica;font-size:16px;line-height:150%;text-align:left">
  
  <span style="color:#000000">Hi ${name},<br>
  <br>
  Your ebook by McKinsey on "<b>Reimagining Marketing</b>” is ready for download.<br>
  <br>
  Please click on the download button below to get the ebook .&nbsp;</span><br>
  &nbsp;
  </td>
  </tr>
  </tbody></table>
  
  
  
  </td>
  </tr>
  </tbody>
  </table><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse">
  <tbody>
  <tr>
  <td valign="top" style="padding:9px">
  <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" style="min-width:100%;border-collapse:collapse">
  <tbody><tr>
  <td valign="top" style="padding-right:9px;padding-left:9px;padding-top:0;padding-bottom:0;text-align:center">
  
  
    <img align="center" alt="" src="https://ci5.googleusercontent.com/proxy/zs7g29zie0kOEwntKVFjAO9mLxK2UmWdN1aOPWycVDEZi2CHjhy0HZFYYSD0swoukhw1U-uB37UZDHNFc6vQ34KbdFc4-eZQL5i8C2OO1GOqPHfgWnZzlS3ACmQbAGlwV2k3BAJr5jsEkZKGXiwRRs1pVhqtxA=s0-d-e1-ft#https://mcusercontent.com/21860ab549ae02eeb610e2aa6/images/90a62ae3-ed42-4daf-becd-64e6a37b55aa.jpg" width="564" style="max-width:1323px;padding-bottom:0;display:inline!important;vertical-align:bottom;border:0;height:auto;outline:none;text-decoration:none" class="CToWUd a6T" tabindex="0"><div class="a6S" dir="ltr" style="opacity: 0.01; left: 736.781px; top: 917px;"><div id=":w3" class="T-I J-J5-Ji aQv T-I-ax7 L3 a5q" role="button" tabindex="0" aria-label="Download attachment " data-tooltip-class="a1V" data-tooltip="Download"><div class="aSK J-J5-Ji aYr"></div></div></div>
  
  
  </td>
  </tr>
  </tbody></table>
  </td>
  </tr>
  </tbody>
  </table><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse">
  <tbody>
  <tr>
  <td style="padding-top:0;padding-right:18px;padding-bottom:18px;padding-left:18px" valign="top" align="center">
  <table border="0" cellpadding="0" cellspacing="0" style="border-collapse:separate!important;border:1px solid;border-radius:4px;background-color:#2baadf">
  <tbody>
  <tr>
  <td align="center" valign="middle" style="font-family:&quot;Helvetica Neue&quot;,Helvetica,Arial,Verdana,sans-serif;font-size:16px;padding:18px">
  <a title="Download Now" href="https://online.us18.list-manage.com/track/click?u=21860ab549ae02eeb610e2aa6&amp;id=3153053b54&amp;e=f0c8241cf6" style="font-weight:bold;letter-spacing:normal;line-height:100%;text-align:center;text-decoration:none;color:#ffffff;display:block" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://online.us18.list-manage.com/track/click?u%3D21860ab549ae02eeb610e2aa6%26id%3D3153053b54%26e%3Df0c8241cf6&amp;source=gmail&amp;ust=1597816946975000&amp;usg=AFQjCNH4Nu_NH7QFbkRcvoMnfIcJ5Kd8mw">Download Now</a>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse">
  <tbody>
  <tr>
  <td valign="top" style="padding-top:9px">
  
  
  
  <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%;min-width:100%;border-collapse:collapse" width="100%">
  <tbody><tr>
  
  <td valign="top" style="padding-top:0;padding-right:18px;padding-bottom:9px;padding-left:18px;word-break:break-word;color:#757575;font-family:Helvetica;font-size:16px;line-height:150%;text-align:left">
  
  <h1 style="display:block;margin:0;padding:0;color:#222222;font-family:Helvetica;font-size:40px;font-style:normal;font-weight:bold;line-height:150%;letter-spacing:normal;text-align:center"><span style="font-size:19px">Do check our&nbsp;<a href="https://online.us18.list-manage.com/track/click?u=21860ab549ae02eeb610e2aa6&amp;id=6bc0831ecb&amp;e=f0c8241cf6" style="color:#007c89;font-weight:normal;text-decoration:underline" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://online.us18.list-manage.com/track/click?u%3D21860ab549ae02eeb610e2aa6%26id%3D6bc0831ecb%26e%3Df0c8241cf6&amp;source=gmail&amp;ust=1597816946975000&amp;usg=AFQjCNHC6A_RqKgLJuBfS-fZHSB2QZD-zw">training programs</a>,&nbsp;<a href="https://online.us18.list-manage.com/track/click?u=21860ab549ae02eeb610e2aa6&amp;id=6a681c5a74&amp;e=f0c8241cf6" style="color:#007c89;font-weight:normal;text-decoration:underline" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://online.us18.list-manage.com/track/click?u%3D21860ab549ae02eeb610e2aa6%26id%3D6a681c5a74%26e%3Df0c8241cf6&amp;source=gmail&amp;ust=1597816946975000&amp;usg=AFQjCNFqJuxYXvojuipNCUQlK6yPxUXtqw">blogs</a>, and&nbsp;<a href="https://online.us18.list-manage.com/track/click?u=21860ab549ae02eeb610e2aa6&amp;id=fd147aeacd&amp;e=f0c8241cf6" style="color:#007c89;font-weight:normal;text-decoration:underline" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://online.us18.list-manage.com/track/click?u%3D21860ab549ae02eeb610e2aa6%26id%3Dfd147aeacd%26e%3Df0c8241cf6&amp;source=gmail&amp;ust=1597816946975000&amp;usg=AFQjCNHraIeFOW5-dj1QtcAAPxL-gMvCCQ">webinars</a></span></h1>
  
  </td>
  </tr>
  </tbody></table>
  
  
  
  </td>
  </tr>
  </tbody>
  </table>
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse">
  <tbody>
  <tr>
  <td valign="top" style="padding-top:9px">
  
  
  
  <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%;min-width:100%;border-collapse:collapse" width="100%">
  <tbody><tr>
  
  <td valign="top" style="padding-top:0;padding-right:18px;padding-bottom:9px;padding-left:18px;word-break:break-word;color:#757575;font-family:Helvetica;font-size:16px;line-height:150%;text-align:left">
  
  <span style="color:#000000">We at <b>AMP Digital</b> offer <b>Digital Marketing</b> courses and training programs for students and working professionals. You can get world class certifications and jobs and internships.</span>
  </td>
  </tr>
  </tbody></table>
  
  
  
  </td>
  </tr>
  </tbody>
  </table><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;border-collapse:collapse">
  <tbody>
  <tr>
  <td style="padding-top:0;padding-right:18px;padding-bottom:18px;padding-left:18px" valign="top" align="center">
  <table border="0" cellpadding="0" cellspacing="0" style="border-collapse:separate!important;border:1px solid;border-radius:3px;background-color:#009fc7">
  <tbody>
  <tr>
  <td align="center" valign="middle" style="font-family:Helvetica;font-size:18px;padding:18px">
  <a title="Visit Now" href="https://online.us18.list-manage.com/track/click?u=21860ab549ae02eeb610e2aa6&amp;id=87125b9d36&amp;e=f0c8241cf6" style="font-weight:bold;letter-spacing:-0.5px;line-height:100%;text-align:center;text-decoration:none;color:#ffffff;display:block" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://online.us18.list-manage.com/track/click?u%3D21860ab549ae02eeb610e2aa6%26id%3D87125b9d36%26e%3Df0c8241cf6&amp;source=gmail&amp;ust=1597816946975000&amp;usg=AFQjCNEAxqIkGUNMdqBvWo_7KJ1XW08VzA">Visit Now</a>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  <br>
  <table width="351" cellspacing="0" cellpadding="0" border="0"> <tr> <td style="text-align:left;padding-bottom:10px"><a style="display:inline-block" href="https://www.ampdigital.co"><img style="border:none;" width="150" src="https://s1g.s3.amazonaws.com/36321c48a6698bd331dca74d7497797b.jpeg"></a></td> </tr> <tr> <td style="border-top:solid #000000 2px;" height="12"></td> </tr> <tr> <td style="vertical-align: top; text-align:left;color:#000000;font-size:12px;font-family:helvetica, arial;; text-align:left"> <span> </span> <br> <span style="font:12px helvetica, arial;">Email:&nbsp;<a href="mailto:amitabh@ampdigital.co" style="color:#3388cc;text-decoration:none;">amitabh@ampdigital.co</a></span> <br><br> <span style="margin-right:5px;color:#000000;font-size:12px;font-family:helvetica, arial">Registered Address: AMP Digital</span> 403, Sovereign 1, Vatika City, Sohna Road,, Gurugram, Haryana, 122018, India<br><br> <table cellpadding="0" cellpadding="0" border="0"><tr><td style="padding-right:5px"><a href="https://facebook.com/https://www.facebook.com/AMPDigitalNet/" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/23f7b48395f8c4e25e64a2c22e9ae190.png" alt="Facebook" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://twitter.com/https://twitter.com/amitabh26" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3949237f892004c237021ac9e3182b1d.png" alt="Twitter" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://linkedin.com/in/https://in.linkedin.com/company/ads4growth?trk=public_profile_topcard_current_company" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/dcb46c3e562be637d99ea87f73f929cb.png" alt="LinkedIn" style="border:none;"></a></td><td style="padding-right:5px"><a href="https://youtube.com/https://www.youtube.com/channel/UCMOBtxDam_55DCnmKJc8eWQ" style="display: inline-block;"><img width="40" height="40" src="https://s1g.s3.amazonaws.com/3b2cb9ec595ab5d3784b2343d5448cd9.png" alt="YouTube" style="border:none;"></a></td></tr></table><a href="https://www.ampdigital.co" style="text-decoration:none;color:#3388cc;">www.ampdigital.co</a> </td> </tr> </table> <table width="351" cellspacing="0" cellpadding="0" border="0" style="margin-top:10px"> <tr> <td style="text-align:left;color:#aaaaaa;font-size:10px;font-family:helvetica, arial;"><p>AMP&nbsp;Digital is a Google Partner Company</p></td> </tr> </table>
  </table></td>
    </tr>
  </tbody></table>`;
  return template;
  }

  function getTemplate() {
    
  }

module.exports = {
    addWebinareeHTML,
    generateWebinarCertificateHTML,
    generateWelcomeEmailHtml,
    generateLexTemplate,
    getContactInformationHtml,
    getEbookTemplate,
    getTemplate
};
