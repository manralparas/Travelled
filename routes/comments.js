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
function isLogin(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}

module.exports=router;