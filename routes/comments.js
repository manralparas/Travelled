const express= require('express');
const router= express.Router();
const Campground=require("../models/campground");
const Comment= require("../models/comment");
const middleware= require("../middleware");
router.get("/campground/:id/comments/new",middleware.isLoggedIn,(req,res)=>{
    Campground.findById(req.params.id,(err,campground)=>{
                if(err)
                console.log(err);
                else
                res.render("comment/new",{campground:campground});

    })
}
);

router.post("/campground/:id/comments",middleware.isLoggedIn,(req,res)=>{
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
router.get("/campground/:id/comments/:comment_id/edit",middleware.isValidUserComment,(req,res)=>{
    Comment.findById(req.params.comment_id,(err,findComment)=>{
        if(err)
        console.log(err);
        else{
               res.render("comment/edit",{campground_id:req.params.id,comment:findComment});
        }
    })
})
router.put("/campground/:id/comments/:comment_id",middleware.isValidUserComment,(req,res)=>{
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
router.delete("/campground/:id/comments/:comment_id",middleware.isValidUserComment,(req,res)=>{
    Comment.findByIdAndRemove(req.params.comment_id,(err)=>{
        if(err)
        console.log(err)
        else
        res.redirect("/campground/"+req.params.id);
    });
}
);



module.exports=router;