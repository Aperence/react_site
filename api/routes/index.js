var express = require('express');
var router = express.Router();
const {MongoClient} = require('mongodb');
var bcrypt = require("bcrypt")

const uri = "mongodb+srv://Aperence:22nwsUmTdZNXFlNZ@cluster0.jt2qm.mongodb.net/test"

MongoClient.connect(uri, (err, db)=>{
  dbo = db.db("site")

  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('index');
  });

  router.get("/test", (req,res)=>{
    dbo.collection("name").find({}).toArray((err, data)=>{
      for (let index = 0; index < data.length; index++) {
        data[index].password = bcrypt.compareSync("Test", data[index].password) ? "Correspond" : "Pas de correspondance"
      }
      res.send(data)
    })

  })

  router.get("/new", (req,res)=>{
    var pass = bcrypt.hashSync(req.query.password, 10)
    dbo.collection("name").insert({"name" : req.query.name, "password" : pass})
    res.cookie('name', {"name":"test", "password" : 'new'})
    console.log(req.cookies)
    res.redirect("/test")
  })

  router.get("/sessionInfo", (req, res)=>{
    res.send({name : req.session.name})
  })

})

module.exports = router;
