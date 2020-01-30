var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var crypto = require("crypto");
var async = require("async");
var nodemailer = require("nodemailer");

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
    User.register(new User({username: req.body.username, fullname: req.body.fullName, email: req.body.email, about: req.body.about, avatar: req.body.avatar}), req.body.password, function(err,user){
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

//=============================================
//USER INFO ROUTES
//=============================================

router.get("/user/:id",function(req,res){
    User.findOne({_id: req.params.id},function(err, foundUser){
        Campground.find().where("author.id").equals(req.params.id).exec(function(err,campContributes){
            res.render("user/user", {user: foundUser, camps: campContributes});
        })
    });
});

//=============================================
//FORGOT PASSWORD ROUTES
//=============================================

router.get("/resetpassword",function(req, res){
    res.render("passwordreset/passwordreset");
});

router.post("/resetpassword",function(req,res){
    async.waterfall([
        function(done){
            crypto.randomBytes(20,function(err,buf){
                var token = buf.toString("hex");
                done(err,token);
            });
        },
        function(token,done){
            User.findOne({email: req.body.email},function(err,foundUser){
                if(err || !foundUser){
                    console.log(err);
                    req.flash("error", "email doesnt exist");
                    res.redirect("/resetpassword");
                }else{
                    foundUser.resetPasswordToken = token;
                    foundUser.resetPasswordExpires = Date.now() + 3600000 //1hr
                    foundUser.save(function(err){
                        if(err){
                            console.log(err);
                        }
                    });
                    done(err, token, foundUser);
                }
 
            });
        },
        function(token,foundUser,done){
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail', 
                auth: {
                    user: 'gameboyjst@gmail.com',
                    pass: process.env.EMAILPASS
        }
            });
            var mailOptions = {
                to: foundUser.email,
                from: "gameboyjst@gmail.com",
                subject: "YelpCamp password reset for " + foundUser.username,
                text: "you are receiving this because you(or someone else) have requested to reset the password \n" + 
                      "Please click on the following link or copy and paste the link you your browser to complete the password reset process \n" + 
                      "http://" + req.headers.host + "/newpassword/" + token + "\n\n" + 
                      "if you did not request this, please ignore this and your password will remain unchanged"
            };
            smtpTransport.sendMail(mailOptions,function(err){
                if(err){
                    console.log(err);
                }else{
                    req.flash("success","The email with password reset instructions has been sent to " + foundUser.email);
                }
                done(err,"done");
            });
        }
    ],function(err){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            res.redirect("/resetpassword");
        }else{
            res.redirect("/resetpassword");
        }
    });
});

router.get("/newpassword/:token",function(req,res){
    User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt : Date.now()}},function(err,user){
        if(err || !user){
            console.log(err);
            req.flash("error","Password reset token is invalid or has expired");
            res.redirect("/resetpassword");
        }else{
            res.render("passwordreset/newpassword",{token : req.params.token});
        }
    }) 
});

router.post("/newpassword/:token",function(req, res){
    async.waterfall([
        function(done){
            User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt : Date.now()}},function(err,foundUser){
                if(err){
                    console.log(err);
                    req.flash("error","Password reset token is invalid or has expired");
                    res.redirect("back");
                }else{
                    if(req.body.setpassword === req.body.confirmpassword){
                        foundUser.setPassword(req.body.setpassword,function(err){
                            if(err){
                                console.log(err);
                                req.flash("error", "An error occured setting the password");
                            }else{
                                foundUser.resetPasswordToken= undefined;
                                foundUser.resetPasswordExpires= undefined;
                                foundUser.save(function(err){
                                    if(err){
                                        console.log(err);
                                        req.flash("error", "An error occured with setting the token to null");
                                        res.redirect("back");
                                    }else{
                                        req.logIn(foundUser,function(err){
                                            if(err){
                                                console.log(err);
                                                req.flash("error", "There was an error logging in the user");
                                                res.redirect("back");
                                            }else{
                                                done(err, foundUser);
                                            }
                                        })
                                    }
                                });
                            }
                        });
                    }else{
                        req.flash("error", "Set password and confirm password should match");
                        res.redirect("back");
                    }
                }
            });
        },

        function(foundUser, done){
            var smtpTransport = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: "gameboyjst@gmail.com",
                    pass: process.env.EMAILPASS
                }
            });
            var mailOptions = {
                to: foundUser.email,
                from: "gameboyjst@gmail.com",
                subject: "Password has been reset",
                text: "Hello, \n\n This is the confirmation that the password of you account " + foundUser.username + " has just been changed"
            };
            smtpTransport.sendMail(mailOptions, function(err){
                if(err){
                    console.log(err);
                    req.flash("error", "There was an error sending the email");
                    res.redirect("back");
                }else{
                    done(err);
                }
            });

        }

    ],function(err){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            req.flash("success","The password ahas been changed successfully");
            res.redirect("/campgrounds");
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

module.exports = router;