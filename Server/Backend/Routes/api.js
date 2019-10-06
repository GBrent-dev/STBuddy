var express             = require("express");
var router              = express.Router();
//var User                = require("../models/user");
//var jwt = require('jsonwebtoken');
require('../Authenticiation/passport');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
//Get the default connections
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
(db.on('error', console.error.bind(console, 'MongoDB connection error:')));


//CRUDE Routes
router.post("/", function(req, res){
    console.log(req.body);
    res.json({success: true, msg: 'Welcome to StockBuddy'})
});

router.post("/analysis/new",/*middleware.isLoggedIn ,*/(req, res) => {
    //CREATE - add new events to DB
    var name = req.body.name;
    var category = req.body.category;
    var insight = {Market: req.body.Market+"-"+DateTime.Now, Thought: req.body.Thought, BuyZone: req.body.BuyZone, SellZone: req.body.SellZone, Trend: req.body.Trend, Date: req.body.Date};
    MarketSummary.create(insight, function(err,NewInsight){
         if(err){
             console.log(err);
         } else {
             //redirect back to events page
             console.log(NewInsight);
             return res.status(200).send("Insight Created");
         }
    }) 
 });
 
 router.get("/analysis/:id",  (req, res) => {
     analysis.findById(req.params.id, function(err, analysis){
       if(err){
           res.redirect("/");
       } else {
           res.render("show", {analysis: analysis});
       }
    });
 });
 
 router.get("/analysis/:id/edit",  (req, res) => {
     Analysis.findById(req.params.id, function(err, analysis){
        if(err){
            console.log(err);
            res.redirect("/")
        } else {
            res.render("edit", {analysis: analysis});
        }
    });
 });
 
 router.put("/analysis/:id",  (req, res) => {
     Analysis.findByIdAndUpdate(req.params.id, req.body.blog, function(err, analysis){
        if(err){
            console.log(err);
        } else {
          var showUrl = "/analysis/" + analysis._id;
          res.redirect(showUrl);
        }
    });
 });
 
 router.delete("/analysis/:id",  (req, res) => {
     Analysis.findById(req.params.id, function(err, analysis){
        if(err){
            console.log(err);
        } else {
         analysis.remove();
            res.redirect("/analysis");
        }
    }); 
 });
 
 module.exports = router;