var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    fullname: String,
    email: {type: String, unique: true, required: true},
    about: String,
    avatar: String,
    isAdmin: {type: Boolean, default:false}
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema);