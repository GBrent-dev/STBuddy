var express             = require("express");
var router              = express.Router();
var passport            = require("passport");
var User                = require("../models/user");
var jwt = require('jsonwebtoken');
require('../Authentication/passport');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
//Get the default connections
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
(db.on('error', console.error.bind(console, 'MongoDB connection error:')));

//Route to login user
router.post('/login', function(req, res, next) {
    passport.authenticate('login', function(err,user, info) {
      if( user == false) {res.json(info.message)}
      else
         {
          const token = jwt.sign({ id: user.email}, process.env.JWT_SECRET,  {expiresIn: 86400 * 60});        
          res.json({success: true, msg: 'successfully logged in', token: token});
      
         }
  })
    (req, res, next);
  });
//google auth route:
//Routes for Google OAuth
/* GET Google Authentication API. */
router.post('/auth/google',
 passport.authenticate('google', { scope: ['profile', 'email'], session: false})
);
 

router.get('/auth/google/callback',
  passport.authenticate('google', { session: false }),
  function(req, res) {
    console.log('we are in callabck');
    if(!req.user){res.json({success: false, msg: 'Can not authenticate user'})}
    else
    {
      console.log(req.user.email);
      const token = jwt.sign({ id: req.user.email}, process.env.JWT_SECRET,  {expiresIn: 86400 * 60});        
      res.json({success: true, msg: 'successfully logged in', token: token});
    } 
  }
);


 //basic routes:
 router.get("/", (req, res) => {
    console.log("Pushing Index");
    res.render("index", {user:"TestUser"});
});

router.get("/*", function(req, res){
        res.redirect("/index");   
});

 module.exports = router;