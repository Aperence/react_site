var express = require('express');
var router = express.Router();
const {MongoClient} = require("mongodb")
const bcrypt = require("bcrypt")

const uri = "mongodb+srv://Aperence:22nwsUmTdZNXFlNZ@cluster0.jt2qm.mongodb.net/test"

/* GET users listing. */

MongoClient.connect(uri, (err, db)=>{

  dbo = db.db("site")

  router.get('/', function(req, res, next) {
    res.send('respond with a resource');
  });
  
  router.post("/register", (req, res)=>{
    dbo.collection("name").find({name : req.body.name}).toArray((err, data)=>{
      let response = {"status" : "ok", "name" : req.body.name}
      if (data.length == 0){
        req.session.user = req.body.name
        var data = {
          "name" : req.body.name,
          "email" : req.body.email,
          "password" : bcrypt.hashSync(req.body.password, 10)
        }
        dbo.collection("name").insertOne(data)
      }else{
        response.status = "Pseudo already taken"
        response.name = ""
        delete response.name
      }
      res.send(response)
    })
  })

  router.post("/login", (req,res)=>{
    dbo.collection("name").find({"email" : req.body.email}).toArray((err, data)=>{
      data = data.filter((item)=>bcrypt.compareSync(req.body.password, item.password))
      if (data.length == 0) return res.send({status : "Unknown account"})
      else{
        req.session.name = data[0].name
        res.send({status : "Connected", name : data[0].name})
      }
    })
  })

})

module.exports = router;
