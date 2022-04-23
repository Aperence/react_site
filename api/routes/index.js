var express = require('express');
var router = express.Router();
const {MongoClient} = require('mongodb');
var bcrypt = require("bcrypt")
var conf = require("../config.json")

MongoClient.connect(conf.uri, (err, db)=>{
  dbo = db.db("site")

  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('index');
  });

  router.get("/new", (req,res)=>{
    var pass = bcrypt.hashSync(req.query.password, 10)
    dbo.collection("name").insert({"name" : req.query.name, "password" : pass})
    res.cookie('name', {"name":"test", "password" : 'new'})
    console.log(req.cookies)
    res.redirect("/test")
  })

  router.get("/sessionInfo", (req, res)=>{
    res.send({name : req.session.user ? req.session.user.name : ""})
  })

})

module.exports = router;
