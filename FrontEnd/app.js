var express = require("express"),
    app     = express(),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    expressSanitizer = require("express-sanitizer"),
    methodOverride = require('method-override'),
    dTenv = require('dotenv').config(),
    ejs = require('ejs'),
    MongoClient = require('mongodb').MongoClient;
const port = process.env.PORT || 3000;
const username = process.env.ServerUser;
const pass = process.env.ServerPassword;
const uri = process.env.URI;
MongoClient.connect(uri, function(err, db) {
const client = new MongoClient(uri, { useNewUrlParser: true });
 client.connect(
        // err => {
        // const collection = client.db("test").collection("devices");
        // if(err){
        //     console.log(err);
        //     client.close();
        // }
    ).then( client =>{
        var StockBuddyDB = client.db("test").collection("devices");
        console.log("DB connected");
        // console.log(StockBuddyDB);
    })
    .catch(err => {
        console.log(err+"URL "+uri);
        client.close();
    })
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(express());
//app.use(expressSanitizer());

//sets up webpages and static route for pages and page resources
app.set('view engine', 'ejs');
app.use("/manifest", express.static(__dirname + "/manifest.json"));
app.use("/images",express.static(__dirname + "/resources/images"));
app.use("/css",express.static(__dirname + "/resources/css"));
app.use("/PWA",express.static(__dirname + "/PWA"));
app.use(methodOverride('_method'));

//processing for json
app.use(bodyParser.json());

//database field
var MarketSummarySchema = new mongoose.Schema({
    Market: String,
    Thought: String,
    BuyZone: Number,
    SellZone: Number,
    Trend: Number,
    watchlist: Number,
    Zonewatchlist: Number,
    created:  {type: Date, default: Date.now}
});

var Analysis = mongoose.model("MarketSummary", MarketSummarySchema);

app.get("/", (req, res) => {
    console.log("Pushing Index");
    res.render("index", {user:"TestUser"});
});

app.get("/analysis",  (req, res) => {
    Analysis.find({}, function(err, MarketSummary){
        if(err){
            console.log(err);
        } else {
            res.json(MarketSummary); 
        }
    })
});

app.get("/analysis/new",  (req, res) => {
   res.render("new"); 
});

app.post("/analysis",  (req, res) => {
    req.body.analysis.body = req.sanitize(req.body.analysis.body);
   var formData = req.body.analysis;
   analysis.create(formData, function(err, newanalysis){
       console.log(newanalysis);
      if(err){
          res.render("new");
      } else {
          res.redirect("/analysis");
      }
   });
});

app.get("/analysis/:id",  (req, res) => {
    analysis.findById(req.params.id, function(err, analysis){
      if(err){
          res.redirect("/");
      } else {
          res.render("show", {analysis: analysis});
      }
   });
});

app.get("/analysis/:id/edit",  (req, res) => {
    Analysis.findById(req.params.id, function(err, analysis){
       if(err){
           console.log(err);
           res.redirect("/")
       } else {
           res.render("edit", {analysis: analysis});
       }
   });
});

app.put("/analysis/:id",  (req, res) => {
    Analysis.findByIdAndUpdate(req.params.id, req.body.blog, function(err, analysis){
       if(err){
           console.log(err);
       } else {
         var showUrl = "/analysis/" + analysis._id;
         res.redirect(showUrl);
       }
   });
});

app.delete("/analysis/:id",  (req, res) => {
    Analysis.findById(req.params.id, function(err, analysis){
       if(err){
           console.log(err);
       } else {
        analysis.remove();
           res.redirect("/analysis");
       }
   }); 
});

// app.get("/*", function(req, res){
//     res.redirect("/index");   
// });

app.listen(port, function(){
    var now = Date().toLocaleString();
   console.log('Server Started! Port: '+port+"  Date: "+now);
});
