var mongoose = require("mongoose")
var comment   = require("./comment");
 
campgroundsSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
      ]
})

module.exports = mongoose.model("Campground", campgroundsSchema);