var mongoose= require("mongoose");

//define database schema
var campgroundSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    date : {type: Date, default: Date.now},
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

//model the database
module.exports = mongoose.model("Campground",campgroundSchema);