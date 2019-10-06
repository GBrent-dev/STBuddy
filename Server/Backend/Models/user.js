var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new mongoose.Schema({
    email: String,
    username: String,
    password: String,
    picture: String,
    activities: String,
    active: Boolean,
    join_time: Date,
    comments: {   
           type: mongoose.Schema.Types.ObjectId,
           ref: "Comment"
           //datetime: String.datetime
        
      },
    Notfications: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Notfications"
    },
    Notification_reference : {type:Object},
    Categories: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Category"
        }
     ],
     AttendedEvents: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "event"
        }
     ],
     CurrentEvents: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "event"
        }
     ],
     Following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    });

UserSchema.plugin(passportLocalMongoose);

// Execute before each user.save() call
UserSchema.pre('save', function(callback) {
   var user = this;
 
   // Break out if the password hasn't changed
   if (!user.isModified('password')) return callback();
 
   // Password changed so we need to hash it
   bcrypt.genSalt(5, function(err, salt) {
     if (err) return callback(err);
 
     bcrypt.hash(user.password, salt, null, function(err, hash) {
       if (err) return callback(err);
       user.password = hash;
       callback();
     });
   });
 });
 


module.exports = mongoose.model("User", UserSchema);