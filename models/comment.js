const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema({
    author:String,
    content:String,
});
const Comment = mongoose.model("Comment",commentSchema);
module.exports=Comment;