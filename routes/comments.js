var express = require("express");
//we do merge params to pass the ':id' 
var router = express.Router({mergeParams: true});
//not needed but done by instructor
var Campground = require("../models/campground");
var Comment = require("../models/comment");
//middleware
var middlewareObj = require("../middleware");


//render the add comment form
router.get("/new", middlewareObj.isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,foundCamp){
        if(err){
            console.log(err);
        }else{
            res.render("comment/new.ejs",{campground: foundCamp});
        }
    });
});

//comments 'create' route
router.post("/", middlewareObj.isLoggedIn, function(req,res){
    //lookup campground using ID
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err){
            console.log(err);
        }else{
            // create new comment 
            Comment.create(req.body.comment,function(err,newComment){
                if(err){
                    console.log(err);
                }else{
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    newComment.save();
                    // connect new comment to campground
                    foundCampground.comments.push(newComment);
                    foundCampground.save(function(err,campground){
                        if(err){
                            console.log(err);
                        }else{
                            req.flash("success","Comment successfully created");
                            //redirect campground showpage 
                            res.redirect("/campgrounds/" + req.params.id);
                        }
                    });
                }
            });
            
        }
    });
})

//edit comment route
router.get("/:comment_id/edit", middlewareObj.checkCommentOwnership, function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err || !foundCampground){
            console.log(err)
            req.flash("error","Campground not found");
            res.redirect("back");
        }else{
            Comment.findById(req.params.comment_id,function(err,foundComment){
                if(err ){
                    console.log(err);
                    // req.flash("error","Comment cannot be found");
                    // res.redirect("back");
                }else{
                    res.render("comment/edit",{campground_id: req.params.id, comment: foundComment});
                }
            });
        }
    });   
});

// edit comment route update
router.put("/:comment_id", middlewareObj.checkCommentOwnership, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,foundComment){
        if(err){
            console.log(err);
        }else{
            req.flash("success","Comment successfully edited");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//comment route delete
router.delete("/:comment_id", middlewareObj.checkCommentOwnership,  function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            console.log(err);
        }else{
            req.flash("success","Comment successfully deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


//middleware
// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
// }

//allows to edit or change comment if it belongs to logged in user
// function checkCommentOwnership(req, res, next){
//     if(req.isAuthenticated()){
//         Comment.findById(req.params.comment_id,function(err,foundComment){
//             if(err){
//                 console.log(err);
//             }else{
//                 if(foundComment.author.id.equals(req.user._id)){
//                     next();
//                 }else{
//                     res.redirect("back");
//                 }
//             }
//         });
//     }else{
//         res.redirect("back");
//     }
// }

module.exports = router;