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

  router.get("/sessionInfo", (req, res)=>{
    if (!req.session.user) return res.send({name : "", picture : ""})
    res.send({name :  req.session.user.name , picture : req.session.user.picture })
  })

})

module.exports = router;
