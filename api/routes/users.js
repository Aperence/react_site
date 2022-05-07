var express = require('express');
var router = express.Router();
const {MongoClient} = require("mongodb")
const bcrypt = require("bcrypt")
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
      if (data.length == 0) return res.send({status : "Unknown account"})
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

})

module.exports = router;
