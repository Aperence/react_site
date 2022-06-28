var express = require('express');
var router = express.Router();
const {MongoClient} = require("mongodb")
const bcrypt = require("bcrypt")
const crypto = require("crypto")
const {sendMail} = require("../scripts/mails")
const conf = require("../config.json")

/* GET users listing. */

MongoClient.connect(conf.uri, (err, db)=>{

  dbo = db.db("site")

  router.get('/', function(req, res, next) {
    res.send('respond with a resource');
  });

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

  router.post("/register", (req, res)=>{
    dbo.collection("users").find({name : req.body.name}).toArray((err, data)=>{
      let response = {"status" : "ok" }//, "name" : req.body.name}
      if (data.length == 0){
        
        req.session.confirmedUser = {
          "name" : req.body.name,
          "email" : req.body.email,
          "password" : bcrypt.hashSync(req.body.password, 10)
        }

        
        var token = crypto.randomBytes(4).toString('hex');
        sendMail("./templates/mail.html", {to:req.body.email, subject:"Confirming register", content:token})
        req.session.key = token;
        setTimeout(()=>{
          req.session.key = null
        }, 300 * 1000)
      }else{
        response.status = "Pseudo already taken"
        delete response.name
      }
      res.send(response)
    })
  })

  router.post("/confirm_mail", (req,res)=>{

    if (req.session.key == req.body.enteredKey){
      var data = {
        "name" : req.session.confirmedUser.name,
        "email" : req.session.confirmedUser.email,
        "password" : bcrypt.hashSync(req.session.confirmedUser.password, 10)
      }
      dbo.collection("users").insertOne(data)
      req.session.user = {"name" : req.session.confirmedUser.name}
      delete req.session.confirmedUser
      return res.send({"name" : req.session.user.name})
    }
    res.status(403).send("")
  })

})

module.exports = router;
