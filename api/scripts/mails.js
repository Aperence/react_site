const nodemailer = require('nodemailer');
const fs = require('fs');
const hogan = require('hogan.js');
const inlineCss = require('inline-css');
const conf = require("../config.json")

var transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
      user: conf.email,
      pass: conf.password
    }
});


// https://code-garage.fr/blog/tutoriel-comment-bien-envoyer-vos-emails-en-html-css-avec-nodejs/
async function sendMail(template_path, mail_options){

    try {
        
        //Load the template file
        const templateFile = fs.readFileSync(template_path);
        //Load and inline the style
        const templateStyled = await inlineCss(templateFile.toString(), {url: "file://"+__dirname+"/../templates_css/"});
        //Inject the data in the template and compile the html
        const templateCompiled = hogan.compile(templateStyled);
        const templateRendered = templateCompiled.render({text: mail_options.content});

        const mailOptions = {
          from: conf.email,
          to: mail_options.to,
          subject: mail_options.subject,
          html: templateRendered
        };
  
      //Send the email
        await transporter.sendMail(mailOptions)//.then((info)=>console.log(info))
        
    } catch(e){
        console.error(e);
    }      
}



module.exports = {
    sendMail : sendMail
}