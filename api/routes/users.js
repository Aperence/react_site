var express = require('express');
var router = express.Router();
const {MongoClient} = require("mongodb")
const bcrypt = require("bcrypt")
const nodemailer = require('nodemailer');
const fs = require('fs');
const hogan = require('hogan.js');
const inlineCss = require('inline-css');
const conf = require("../config.json")

/* GET users listing. */

MongoClient.connect(conf.uri, (err, db)=>{

  dbo = db.db("site")

  router.get('/', function(req, res, next) {
    res.send('respond with a resource');
  });
  
  router.post("/register", (req, res)=>{
    dbo.collection("users").find({name : req.body.name}).toArray((err, data)=>{
      let response = {"status" : "ok", "name" : req.body.name}
      if (data.length == 0){
        req.session.user = {name : req.body.name}
        var data = {
          "name" : req.body.name,
          "email" : req.body.email,
          "password" : bcrypt.hashSync(req.body.password, 10)
        }
        dbo.collection("users").insertOne(data)
      }else{
        response.status = "Pseudo already taken"
        delete response.name
      }
      res.send(response)
    })
  })

  router.post("/login", (req,res)=>{
    dbo.collection("users").find({"email" : req.body.email}).toArray((err, data)=>{
      data = data.filter((item)=>bcrypt.compareSync(req.body.password, item.password))
      if (data.length == 0) return res.status(403).send()
      else{
        req.session.user = {name: data[0].name, picture: data[0].picture}
        res.send({status : "Connected", name : data[0].name})
      }
    })
  })

  router.get("/logout", (req,res)=>{
    delete req.session.user;
    console.log(req.session.user)
    res.redirect("/")
  })

  router.post("/img", (req,res)=>{
    if (!req.session.user || ! req.session.user.name) return res.send({})
      dbo.collection("users").updateOne({name: req.session.user.name}, { $set: { picture: req.body.img } }, (err)=>{
        if (err) {console.log(err); res.send("")}
        console.log("Updated Image")
        req.session.user.picture = req.body.img
        res.send(req.session.user.picture)
      })

  })

  router.get("/test", (req,res)=>{

    var transporter = nodemailer.createTransport({
      service: 'hotmail',
      auth: {
        user: conf.email,
        pass: conf.password
      }
    });
    

    // https://code-garage.fr/blog/tutoriel-comment-bien-envoyer-vos-emails-en-html-css-avec-nodejs/
    (async function(){
        try {
            
            //Load the template file
            const templateFile = fs.readFileSync("./templates/mail.html");
            //Load and inline the style
            const templateStyled = await inlineCss(templateFile.toString(), {url: "file://"+__dirname+"/../templates_css/"});
            //Inject the data in the template and compile the html
            const templateCompiled = hogan.compile(templateStyled);
            const templateRendered = templateCompiled.render({text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis, temporibus. Obcaecati, a deserunt ea officiis architecto aliquid ex placeat assumenda porro. Rerum aliquid magni consequatur nobis libero, provident maxime, aperiam quod minus corrupti voluptatum impedit pariatur nesciunt dolor voluptate sint animi fuga magnam ex exercitationem eius. Ut molestias aliquid pariatur molestiae facilis nobis quia est, error quam aspernatur quod perferendis. Dignissimos unde enim maiores quos harum sunt quaerat mollitia ea aperiam molestias, blanditiis autem amet, quam architecto iste, eligendi voluptatem et. Error, consectetur ipsum reiciendis odio quas quasi voluptatibus nulla nostrum, eius blanditiis suscipit et incidunt commodi dicta beatae quos."});
    
            const mailOptions = {
              from: conf.email,
              to: conf.email,
              subject: 'Sending Email using Node.js',
              html: templateRendered
            };
      
          //Send the email
            await transporter.sendMail(mailOptions).then((info)=>console.log(info))
            
        } catch(e){
            console.error(e);
        }      
    })()
    res.send("Ok")
  })

})

module.exports = router;
