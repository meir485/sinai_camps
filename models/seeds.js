var mongoose = require("mongoose");
var Campground = require("./campground");
var Comment   = require("./comment");
var User           = require("./user");
var passport       = require("passport");

User.remove({}, function(err){
    if(err){
            console.log(err);
        }else{
            console.log("all users removed")
        }
})

var jony = new User({username: "jony"})
                            User.register(jony , "jony" , function(err, user){
                                        if(err){  console.log(err); } 
                                        passport.authenticate("local")(function(){
                                        console.log("user created")
                                        })
                                        })
var meir = new User({username: "meir"})
                            User.register(meir , "meir" , function(err, user){
                                        if(err){  console.log(err); } 
                                        passport.authenticate("local")(function(){
                                        console.log("user created")
                                        })
                                        })

var data = [
    {
        name: "Marsa Shagra Village", 
        image: "https://media-cdn.tripadvisor.com/media/photo-o/19/87/fe/0a/20190924-142012-largejpg.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        author: {id:meir._id, username: meir.username}
    },
    {
        name:"Bedouin Star",
        image:  "https://media-cdn.tripadvisor.com/media/photo-w/15/6f/da/a5/bedouin-star.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        author: {id:meir._id, username: meir.username}
    },
    {
        name: "Sahara Beach Camp", 
        image: "https://media-cdn.tripadvisor.com/media/photo-o/06/2f/29/2c/sahara-beach-camp.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        author: {id:jony._id, username: jony.username}
    }
]
 
function seedDB(){
   //Remove all campgrounds
   Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed campgrounds!");
        Comment.remove({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("removed comments!");
             //add a few campgrounds
            data.forEach(function(seed){
                Campground.create(seed, function(err, campground){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added a campground");
                        //create a comment
                        Comment.create({
                                text: "This place is great, but I wish there was internet" ,                                
                                author: {id:jony._id, username: jony.username} },
                             function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log("Created new comment");
                                }
                            });

                    }
                });
            });
        });
    }); 
    //add a few comments
}
 
module.exports = seedDB;