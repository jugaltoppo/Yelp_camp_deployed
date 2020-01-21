var express = require("express");
var router = express.Router();
//not needed but done by instructor
var Campground = require("../models/campground");
var middlewareObj = require("../middleware");

//index page(show all campgrounds)
router.get("/",function(req,res){
    Campground.find({},function(err,allCampground){
        if(err){
            console.log(err);
        }else{
            res.render("campground/index",{campgrounds : allCampground});
        }
    });
    
});

//add campground to database and redirect to index page
router.post("/", middlewareObj.isLoggedIn,function(req,res){
    var name=req.body.name;
    var price= req.body.price;
    var url=req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var data={name: name, price: price,  image: url, description: desc, author: author};
    //add to database
    Campground.create(data,function(err,newlyCreated){
        if(err){
            console.log(err);
        }else{
            req.flash("success","You successfully added a campground to YelpCamp");
            //redirect to index page
            res.redirect("/campgrounds");
        }
    });
    
})

//take the user to add new campground
router.get("/new", middlewareObj.isLoggedIn, function(req,res){
    res.render("campground/new");
});

//show description of the campground on clicking the button on index page
router.get("/:id",function(req,res){
   Campground.findById(req.params.id).populate("comments").exec(function(err, campground){
       if(err || !campground){
           console.log(err);
           req.flash("error","There was an error");
           res.redirect("back");
       }else{
           res.render("campground/show",{campground: campground});
       }
   }); 
});

//edit campground route
router.get("/:id/edit", middlewareObj.checkCampgroundOwnership, function(req,res){
        Campground.findById(req.params.id,function(err,foundCampground){
            if(err){
                console.log(err);
            }else{
                    res.render("campground/edit",{campground: foundCampground});
            }
        })   
});

//update campground route
router.put("/:id", middlewareObj.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err,updatedCampground){
        if(err){
            console.log(err);
        }else{
            req.flash("success","Campground successfully updated");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// destroy campground route
router.delete("/:id", middlewareObj.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log(err);
        }else{
            req.flash("success","Successfully deleted campground");
            res.redirect("/campgrounds");
        }
    });
});

//middleware 

//to check if there is user logged in
// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }else{
//         res.redirect("/login");
//     }
// }
    //only allow to edit or delete if the campground post belongs to owner
// function checkCampgroundOwnership(req, res, next){
//     if(req.isAuthenticated()){
//         Campground.findById(req.params.id,function(err,foundCampground){
//             if(err){
//                 res.redirect("back");
//             }else{
//                 if(foundCampground.author.id.equals(req.user._id)){
//                     next();
//                 }else{
//                     res.redirect("back");
//                 }
//             }
//         })
//     }else{
//         res.redirect("back");
//     }
// }

module.exports = router;