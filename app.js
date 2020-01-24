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

app = express()


mongoose.connect("mongodb://localhost/sinai_camp" , {useNewUrlParser: true});

app.use(bodyP.urlencoded({extended: true}));
app.set("view engine" ,"ejs");
app.use(express.static(__dirname + "/public"))//styls shoit
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
// Campground.create({
// 	name: "Marsa Shagra Village", 
// 	image: "https://media-cdn.tripadvisor.com/media/photo-o/19/87/fe/0a/20190924-142012-largejpg.jpg",
//     description:"sinaia is so ainaia and i love sianai because thats where i sinai"
// }, function(err,c){
// 	if(err){console.log(err)}
// 		else{console.log("neww        "+c)}
// })
// Campground.create({
// 	name: "Bedouin Star", image: "https://media-cdn.tripadvisor.com/media/photo-w/15/6f/da/a5/bedouin-star.jpg",description:"sinaia is so ainaia and i love sianai because thats where i sinai"
// }, function(err,c){
// 	if(err){console.log(err)}
// 		else{console.log("neww        "+c)}
// })
// Campground.create({
// 	name: "Sahara Beach Camp", image: "https://media-cdn.tripadvisor.com/media/photo-o/06/2f/29/2c/sahara-beach-camp.jpg",description:"sinaia is so ainaia and i love sianai because thats where i sinai"
// }, function(err,c){
// 	if(err){console.log(err)}
// 		else{console.log("neww        "+c)}
// })

app.get("/" , function(req , res){
	res.render("landing")
})

app.get("/campgrounds" , function(req , res){
	Campground.find({}, function(err,allcamps){
		if(err){console.log(err)}
		else{
			res.render("campgrounds/index", {campgrounds:allcamps})
		}
	})
})
app.post("/campgrounds" , function(req , res){
	var t = req.body.name
	var y = req.body.image
	var p = req.body.description
	var camp = {name: t,image: y,description: p}
	Campground.create(camp, function(err,c){
	if(err){console.log(err)}
		else{console.log("neww        "+c)}
})
	res.redirect("/campgrounds")
})
    
app.get("/campgrounds/new" , function(req , res){
	res.render("campgrounds/new")
})
app.get("/campgrounds/:id" , function(req , res){
	Campground.findById(req.params.id).populate("comments").exec(function(err,found){
	if(err){console.log(err)}
		else{res.render("campgrounds/show" , {campground: found})}
    })
	
})
////////////////////////////////////////////////////////////////////////
app.get("/campgrounds/:id/comments/new" , isLoggedIn,  function(req , res){
	Campground.findById(req.params.id, function(err,found){
	if(err){console.log(err)}
		else{res.render("comments/new" , {campground: found})}
    });
});

app.post("/campgrounds/:id/comments" , function(req , res){
	Campground.findById(req.params.id, function(err,found){
	if(err){console.log(err)}
		else{
			Comment.create(req.body.comment , function(err,c){
	            if(err){console.log(err)}
		        else{
                   found.comments.push(c);
                   found.save()
                   res.redirect("/campgrounds/"+found._id)
		        }
            })
	
		};
    });
});

	
/////////////////////////////////////
app.get("/register" , function(req , res){
	res.render("register")
})

app.post("/register" , function(req , res){
	var newUser = new User({username: req.body.username})
	User.register(newUser , req.body.password , function(err, user){
		if(err){
			console.log(err);
			return res.render("register")
		} 
		passport.authenticate("local")(req, res, function(){
			res.redirect("/campgrounds")
		})
	})
})


app.get("/login" , function(req , res){
	res.render("login")
})
app.post("/login" , passport.authenticate("local",
    {
      successRedirect: "/campgrounds",
      failureRedirect: "/login"
    }), function(req,res){

})

app.get("/logout" , function(req , res){
	req.logout()
	res.redirect("/campgrounds")
})


function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}




var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});