var express = require("express"),
router = express.Router(),
Campground = require("../models/campground"),
Comment = require("../models/comment")


router.get("/campgrounds/:id/comments/new" , isLoggedIn,  function(req , res){
	Campground.findById(req.params.id, function(err,found){
	if(err){console.log(err)}
		else{res.render("comments/new" , {campground: found})}
    });
});

router.post("/campgrounds/:id/comments" , isLoggedIn , function(req , res){
	Campground.findById(req.params.id, function(err,found){
	if(err){console.log(err)}
		else{
			Comment.create(req.body.comment , function(err,c){
	            if(err){console.log(err)}
		        else{
		           c.author.id=req.user._id;
		           c.author.username=req.user.username
                   c.save()
                   found.comments.push(c);
                   found.save()
                   res.redirect("/campgrounds/"+found._id)
		        }
            })
	
		};
    });
});


router.get("/campgrounds/:id/comments/:comment_id/edit" , isLoggedIn,  function(req , res){
	Campground.findById(req.params.id, function(err,found){
	if(err){console.log(err)}
		else{
			Comment.findById(req.params.comment_id, function(err,cf){
			    if(err){console.log(err)}
			    	else{res.render("comments/edit" , {campground: found , comment:cf})}
			})
		}
		
    });
});

router.put("/campgrounds/:id/comments/:comment_id", checkCommentOwner, function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, update){
		if(err){res.redirect("back")}
		else{res.redirect("/campgrounds/"+req.params.id)}
	})
})


router.delete("/campgrounds/:id/comments/:comment_id" , checkCommentOwner , function(req , res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err, found){
		if(err){console.log(err);res.redirect("/campgrounds")}
		else{
            
			res.redirect("back")}
	})
})


function checkCommentOwner(req, res ,next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, found){
            if(err){
            	res.redirect("back")
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

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router