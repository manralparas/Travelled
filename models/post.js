const mongoose= require('mongoose');
const postSchema = new mongoose.Schema({
    name:String,
    image:String,
    description:String,
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    }],
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    }

});
const Post = mongoose.model("post",postSchema);
module.exports = Post;