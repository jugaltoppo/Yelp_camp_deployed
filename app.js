var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser")
    mongoose       = require("mongoose"),
    Campground     = require("./models/campground"),
    Comment        = require("./models/comment"),
    seedDB         = require("./seeds"),
    expressSession = require("express-session"),
    passport       = require("passport"),
    passportLocal  = require("passport-local"),
    User           = require("./models/user"),
    flash          = require("connect-flash"),
    methodOverride = require("method-override");

//requiring routes
var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes    = require("./routes/comments"),
    indexRoutes      = require("./routes/index");

//to remove warnings
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

//running the seed.js
// seedDB();

//connect mongoose locally
// mongoose.connect("mongodb://localhost/yelp_camp");

//conect to cloud  mongoose
mongoose.connect("mongodb+srv://jugaltoppo:<password>@cluster0-gsqhl.mongodb.net/test?retryWrites=true&w=majority");

//set ejs engine
app.set("view engine","ejs");
//make use of body parser
app.use(bodyParser.urlencoded({extended : true}));

//passport setup 
app.use(expressSession({
    secret: "Dota is the best game",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"))
app.use(flash());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//show user in navbar is logged in
app.use(function(req, res, next){
    //sends username to every page header.ejs
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comment",commentRoutes);

//listen to port 
var port=process.env.PORT;
if(port==null || port==""){
    port=3000;
}
app.listen(port,function(){
    console.log("listening to port" + port);
});

