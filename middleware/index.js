var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {};

//only allow to edit or delete if the campground post belongs to owner (or give all acces is the logged in user is moderator)
middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err,foundCampground){
            if(err || !foundCampground){
                req.flash("error","Campground not found");
                console.log(err);
                res.redirect("back");
            }else{
                if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                }else{
                    req.flash("error","You do not have permission to perform that action");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error","You need to be logged in to do that");
        res.redirect("back");
    }
}

//allows to edit or change comment if it belongs to logged in user
middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,foundComment){
            if(err || !foundComment){
                console.log(err);
                req.flash("error","Comment not found");
                res.redirect("back");
            }else{
                if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                    next()
                }else{
                    req.flash("error","You do not have permission to perform that action");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error","You need to be logged in to do that");
        res.redirect("back")
    }
}

//to check if there is user logged in
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash("error","You need to be logged in to do that");
        res.redirect("/login");
    }
}



module.exports = middlewareObj