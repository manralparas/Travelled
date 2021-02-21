const express= require('express');
const router= express.Router();
const Post=require("../models/post");
const Comment= require("../models/comment");
const middleware= require("../middleware");
router.get("/post/:id/comments/new",middleware.isLoggedIn,(req,res)=>{
    Post.findById(req.params.id,(err,post)=>{
                if(err)
                console.log(err);
                else
                res.render("comment/new",{post:post});

    })
}
);

router.post("/post/:id/comments",middleware.isLoggedIn,(req,res)=>{
     Post.findById(req.params.id,(err,post)=>{
            if(err)
            console.log(err);
            else{
                const content=req.body.content;
                const comment={
                    content:content
                };
            Comment.create(comment,(err,comment)=>{
                if(err)
                console.log(err)
                else{
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    comment.save();
                    post.comments.push(comment);
                    post.commentCount++;
                    post.save();
                    req.flash("success","comment created successfully")
                    res.redirect(`/post/${post._id}`);
                }
            })
            }
     })
})
router.get("/post/:id/comments/:comment_id/edit",middleware.isValidUserComment,(req,res)=>{
    Comment.findById(req.params.comment_id,(err,findComment)=>{
        if(err)
        console.log(err);
        else{
               res.render("comment/edit",{post_id:req.params.id,comment:findComment});
        }
    })
})
router.put("/post/:id/comments/:comment_id",middleware.isValidUserComment,(req,res)=>{
    const comment={

        content:req.body.content
    }
    Comment.findByIdAndUpdate(req.params.comment_id,comment,(err,updatedComment)=>{
        if(err)
        console.log(err)
        else
        {   req.flash("success","comment updated successfully")
            res.redirect("/post/"+req.params.id);
        }
    })
})
router.delete("/post/:id/comments/:comment_id",middleware.isValidUserComment,(req,res)=>{
    
    Post.findById(req.params.id,(err,post)=>{
        if(err)
        console.log(err);
        post.commentCount--;
        post.save();
    })
    Comment.findByIdAndRemove(req.params.comment_id,(err)=>{
        if(err)
        console.log(err)
        else
        {
            req.flash("success","comment deleted !")
        res.redirect("/post/"+req.params.id);
        }
    });
}
);



module.exports=router;