var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    fullname: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    about: String,
    avatar: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isAdmin: {type: Boolean, default:false}
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema);