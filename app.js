var express             = require("express"),
    app                 = express(),
    mongoose            = require("mongoose"),
    bodyParser          = require("body-parser"),
    expressSanitizer    = require("express-sanitizer"),
    methodOverride      = require('method-override'),
    dTenv               = require('dotenv').config(),
    ejs                 = require('ejs'),
    cors                = require("cors"),
    MongoClient         = require('mongodb').MongoClient;
    var passport        = require("passport");


//constant variables
const port = process.env.PORT || 3000;
const username = process.env.ServerUser;
const pass = process.env.ServerPassword;
const uri = process.env.URI;

//Database Connection
MongoClient.connect(uri, function(err, db) {
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
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


//Routing handling and middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(express());
var corsOption = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ['x-auth-token']
  };
app.use(cors(corsOption));
app.use(bodyParser.json());
//app.use(expressSanitizer());


//sets up webpages and static route for pages and page resources
app.set('view engine', 'ejs');
app.use("/manifest", express.static(__dirname + "/manifest.json"));
app.use("/images",express.static(__dirname + "/resources/images"));
app.use("/css",express.static(__dirname + "/resources/css"));
app.use("/PWA",express.static(__dirname + "/PWA"));
app.use(methodOverride('_method'));

//Authentication:
app.use(passport.initialize());


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


//Routes
indexRoutes  = require("./Server/Backend/Routes/index");
app.use("/",  indexRoutes);
APIRoutes = require("./Server/Backend/Routes/api");
app.use("/api", APIRoutes);

app.listen(port, function(){
    var now = Date().toLocaleString();
   console.log('Server Started! Port: '+port+"  Date: "+now);
});
