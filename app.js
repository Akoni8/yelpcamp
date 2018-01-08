var express         = require("express"), 
    app             = express(), 
    mongoose        = require("mongoose"), 
    bodyParser      = require("body-parser"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    seedDB          = require("./seeds"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    User            = require("./models/user"),
    methodOverride  = require("method-override");
    
var commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes          = require("./routes/index");


//mongoose.connect("mongodb://localhost/yelp_camp_v12", {useMongoClient: true});
mongoose.connect("mongodb://akoni:maxsan@ds245277.mlab.com:45277/yelpcamp", {useMongoClient: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); seed the database

//Passport Configuration
app.use(require("express-session")({
    secret: "Immortal Gods",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Yelp camp started...");
});