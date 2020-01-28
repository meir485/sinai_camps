const ejsLint = require('ejs-lint');

var express = require("express"),
bodyP = require("body-parser"),
mongoose = require("mongoose"),
Campground = require("./models/campground")
Comment = require("./models/comment")
seed = require("./models/seeds")
passport       = require("passport"),
LocalStrategy  = require("passport-local"),
User           = require("./models/user"),
session        = require("express-session"),
methodOverride = require("method-Override"),

commentRoutes = require("./routes/comments"),
campgroundRoutes = require("./routes/campgrounds"),
indexRoutes = require("./routes/index"),

app = express()


mongoose.connect("mongodb://localhost/sinai_camp" , {useNewUrlParser: true});

app.use(bodyP.urlencoded({extended: true}));
app.set("view engine" ,"ejs");
app.use(express.static(__dirname + "/public"))//styls shoit
app.use(methodOverride("_method"))
seed();


app.use(session({
  secret: "process.env.SESSIONSECRET",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user
	next()
})


app.use(commentRoutes)
app.use("/campgrounds", campgroundRoutes)
app.use(indexRoutes)

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});