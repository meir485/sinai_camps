var express = require("express"),
router = express.Router(),
Campground = require("../models/campground"),
Comment = require("../models/comment")


router.get("/" , function(req , res){
	console.log(req.user)
	Campground.find({}, function(err,allcamps){
		if(err){console.log(err)}
		else{
			res.render("campgrounds/index", {campgrounds:allcamps , currentUser: req.user})
		}
	})
})
router.post("/" ,isLoggedIn, function(req , res){
	var t = req.body.name
	var y = req.body.image
	var p = req.body.description
	var u = {id:req.user._id, username: req.user.username}
	var camp = {name: t,image: y,description: p,author: u}
	Campground.create(camp, function(err,c){
	if(err){console.log(err)}
		else{console.log("neww        "+c)}
})
	res.redirect("/campgrounds")
})
    
router.get("/new" , isLoggedIn, function(req , res){
	res.render("campgrounds/new")
})
router.get("/:id" , function(req , res){
	Campground.findById(req.params.id).populate("comments").exec(function(err,found){
	if(err){console.log(err)}
		else{res.render("campgrounds/show" , {campground: found})}
    })
	
})

router.get("/:id/edit" , checkOwner, function(req , res){
	Campground.findById(req.params.id).populate("comments").exec(function(err,found){
	if(err){console.log(err);res.redirect("/campgrounds")}
		else{res.render("campgrounds/edit" , {campground: found})}
    })
	
})

router.put("/:id" ,checkOwner, function(req , res){


	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, update){
		if(err){console.log(err);res.redirect("/campgrounds")}
		else{res.redirect("/campgrounds/"+req.params.id)}
	})
})

router.delete("/:id" , checkOwner , function(req , res){
	Campground.findByIdAndRemove(req.params.id, function(err, found){
		if(err){console.log(err);res.redirect("/campgrounds")}
		else{
            // found.deleteMany({comments}, function(err){
            // 	if(err){console.log(err)}
            // })
			res.redirect("/campgrounds")}
	})
})

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

function checkOwner(req, res ,next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, found){
            if(err){
            	res.redirect("/campgrounds")
            } else {
            	if(found.author.id.equals(req.user._id)){
            		next()
            	} else {
            		res.send("no autherizetion")
            	  }
              }         
		})
	} else {res.redirect("back")}
}
module.exports = router