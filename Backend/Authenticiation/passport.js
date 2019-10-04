const passport = require('passport'),
  localStrategy = require('passport-local').Strategy,
  JWTstrategy = require('passport-jwt').Strategy,
  GoogleStrategy = require('passport-google-oauth2').Strategy,
  ExtractJWT = require('passport-jwt').ExtractJwt;
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
(db.on('error', console.error.bind(console, 'MongoDB connection error:')));

var User = require('../models/user');

passport.use(
  'register',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      session: false,
    },
    (email, password, done) => {
      try{
      User.findOne(
           {email: email},
           (err, user) => {
          if (user != null) {
            return done(null, false, { message: 'Email already taken' });
          }
          else {
            let newUser = new User();
            // set the user's local credentials
            newUser.email = email;
            newUser.password = password;
            newUser.join_time = Date.now();
            // save the user
            newUser.save((err)=>{
                if (err)
                    return done(err);
                return done(null, newUser.email);
            // note the return needed with passport local - remove this return for passport JWT to work
        });
      }
    });
      } catch (err) {
        done(err);
      }
    },
  ),
);
passport.use( 'login',
   new localStrategy(
  // Our user will sign in using an email, rather than a "username"
  {
    usernameField: "email"
  },
  function(email, password, done) {
    // When a user tries to sign in this code runs
    User.findOne({
        email: email
    }).then(function(dbUser) {
      // If there's no user with the given email
      if (dbUser == null) {
         return done(null,false, {message: "Incorrect email."});
      }
      // If there is a user with the given email, but the password the user gives us is incorrect
      else if (dbUser != null){
      bcrypt.compare(password, dbUser.password, function(err, isMatch) {
        // Password did not match
        if (!isMatch) {return done(null,false, {message:'invalid Password'}); }  
        else {return done(null, dbUser)
        
        }
    });
  }
      // If none of the above, return the user
    });
  }
));


passport.use(
 new JWTstrategy({jwtFromRequest : ExtractJWT.fromAuthHeaderAsBearerToken(),
secretOrKey : process.env.JWT_SECRET,
},
(jwt_payload, done) => {
      User.findOne(
          {email: jwt_payload.id},
          (err, user) => {
        if (user) {
          // note the return removed with passport JWT - add this return for passport local
          done(null, user);
        } 
        else 
        {
          console.log('user not found in db');
          return done(err, null);
        }
      });
  }),
);
//Passport Google Strategy
passport.use(
  new GoogleStrategy ({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:8000/api/auth/google/callback'
   },
   function(accessToken, refreshToken, profile, done) {
    console.log('fine uptill here');
    var userData = {
     email: profile.emails[0].value,
     name: profile.displayName,
     token: accessToken
    };
    done(null, userData);
   }
  )
 );

// In order to help keep authentication state across HTTP requests,
// // Sequelize needs to serialize and deserialize the user
// // Just consider this part boilerplate needed to make it all work
passport.serializeUser(function(user, cb) {
    cb(null, user);
  });
  
  passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
  });
  
  // Exporting our configured passport
  module.exports = passport;