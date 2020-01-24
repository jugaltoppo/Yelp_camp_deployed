var express = require("express");
var router = express.Router();
//not needed but done by instructor
var passport = require("passport");
var User = require("../models/user");

//homepage
router.get("/",function(req,res){
    res.render("landing");
});


//=============================================
//AUT ROUTES
//=============================================

//show signup form

router.get("/register",function(req,res){
    res.render("register");
})

//handle signup form
router.post("/register",function(req,res){
    User.register(new User({username: req.body.username}), req.body.password, function(err,user){
        if(err){
            console.log(err);
            req.flash("error",err.message);
            res.redirect("/register");
        }else{
        passport.authenticate("local")(req, res, function(){
            if(req.body.admin=== process.env.MODCODE){
                user.isAdmin=true;
                user.save();
            }
            req.flash("success",user.username + "Signed up successfully");
            res.redirect("/campgrounds");
            
        })
    }
    })
})

//show login form
router.get("/login",function(req, res){
    res.render("login");
})

//handling login logic
router.post("/login",passport.authenticate("local",{
    successFlash: "Welcome back  ",
    successRedirect: "/campgrounds",
    failureFlash: "Wrong credentials",
    failureRedirect: "/login"
}),function(req,res){

})

//logout route
router.get("/logout",function(req,res){
    req.logout();
    req.flash("success", "Successfully logged out");
    res.redirect("/campgrounds");
})

//middleware
// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
// }

module.exports = router;