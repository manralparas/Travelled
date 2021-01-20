const express= require('express');
const router= express.Router();
const Campground=require("../models/campground");
const Comment= require("../models/comment");
router.get("/campground/:id/comments/new",isLogin,(req,res)=>{
    Campground.findById(req.params.id,(err,campground)=>{
                if(err)
                console.log(err);
                else
                res.render("comment/new",{campground:campground});

    })
}
);

router.post("/campground/:id/comments",isLogin,(req,res)=>{
     Campground.findById(req.params.id,(err,campground)=>{
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
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect(`/campground/${campground._id}`);
                }
            })
            }
     })
})
router.get("/campground/:id/comments/:comment_id/edit",isValidUser,(req,res)=>{
    Comment.findById(req.params.comment_id,(err,findComment)=>{
        if(err)
        console.log(err);
        else{
               res.render("comment/edit",{campground_id:req.params.id,comment:findComment});
        }
    })
})
router.put("/campground/:id/comments/:comment_id",isValidUser,(req,res)=>{
    const comment={
        content:req.body.content
    }
    Comment.findByIdAndUpdate(req.params.comment_id,comment,(err,updatedComment)=>{
        if(err)
        console.log(err)
        else
        {
            res.redirect("/campground/"+req.params.id);
        }
    })
})
router.delete("/campground/:id/comments/:comment_id",isValidUser,(req,res)=>{
    Comment.findByIdAndRemove(req.params.comment_id,(err)=>{
        if(err)
        console.log(err)
        else
        res.redirect("/campground/"+req.params.id);
    });
}
);
function isLogin(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}
function isValidUser(req,res,next){
    if(req.isAuthenticated())
    {
        Comment.findById(req.params.comment_id,(err,found)=>{
            if(err)
            res.redirect("back");
             else
            { 
                 if(found.author.id.equals(req.user._id))
                {
                    next();
                }
                else
                {
                  res.redirect("back")
                }
            }
    }
        );
    }
    else
    res.redirect("back");
}

module.exports=router;