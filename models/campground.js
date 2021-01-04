const mongoose= require('mongoose');
const campgroundSchema = new mongoose.Schema({
    name:String,
    image:String,
    description:String,
    comment:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    }]

});
const Campground = mongoose.model("campground",campgroundSchema);
module.exports = Campground;