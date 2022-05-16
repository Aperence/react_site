var express = require('express');
var router = express.Router();
const {MongoClient} = require('mongodb');
var conf = require("../config.json")
var showdown  = require('showdown')
showdown.setOption('tables', 'true');

MongoClient.connect(conf.uri, (err, db)=>{

    dbo = db.db("site")

    router.post("/postComment", (req, res)=>{
        console.log(req.body)
        dbo.collection("comment").insertOne(req.body)
        res.send({status : "ok"})
    })

    router.get("/comment", (req,res)=>{
        dbo.collection("comment").find({}).toArray((err, data)=>{
            converter = new showdown.Converter()
            for (let item of data){
                item.content = converter.makeHtml(item.content);
            }
            res.send(data);
        })
    })
})

module.exports = router;