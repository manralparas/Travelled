const express= require('express');
const router = express.Router(); 
const Post=require("../models/post");
const middleware = require("../middleware")
const User = require("../models/user")
const fs = require('fs');
const path = require('path');


const multer = require('multer'); 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, "./uploads");
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname + '-' + Date.now())
    }
});
 
const upload = multer({ storage: storage }).single("image");




router.get('/post/new',middleware.isLoggedIn,(req,res)=>
{
    res.render("post/new")

})
router.get('/share',middleware.isLoggedIn,(req,res)=>
{

    res.render("login");
})
router.get('/post/:id',(req,res)=>
{   //find the id then render the show page with id
    Post.findById(req.params.id).populate("comments").exec((err,post)=>{
        if(err)
        console.log(err);
        else
        {
        res.render("post/show",{post:post});
        }
    }
    )
})

router.get('/post',(req,res)=>{
  Post.find({},(err,foundpost)=>{
       if(err)
       {
           console.log(err);
       }
       else{
            res.render("post/explore",{post:foundpost});
       }
   }) 

})

router.post('/post',(req,res)=>{

    upload(req, res, function (err) {
    if (err) {
        console.log(err)
      return
    }
    console.log(req.body)
    
    const placeName=req.body.name;
    const placeDescription= req.body.description;
    const author={
        id:req.user._id,
        username:req.user.username,
    }
    const newPost={
        name:placeName,
        image:req.file.filename,
        description:placeDescription,
        author:author
    };
    Post.create(newPost,(err,newone)=>
    {
        if(err)
        console.log(err);
        else
        {   req.flash("success","post created successfully");
            res.redirect('/post');
        }
    })

})
});
router.post("/like/:id",middleware.isLoggedIn,(req,res)=>{
    Post.findById(req.params.id,(err,found)=>{
        if(found.like.some(e=>e.equals(req.user.id)))
        res.redirect('/post');
        else{
        found.likeCount++;
        found.like.push(req.user.id);
        found.save();
        User.findById(req.user.id,(err,foundUser)=>{
                foundUser.likePost.push(found.id);
                foundUser.save();
        }) 
        }
    })

    res.redirect('/post');
    
});
router.post("/unlike/:id",middleware.isLoggedIn,(req,res)=>{
    Post.findById(req.params.id,(err,found)=>{
        found.likeCount--;
        newLike = found.like.filter((id)=>!id.equals(req.user.id));
        found.like=[...newLike];
        found.save();
        User.findById(req.user.id,(err,foundUser)=>{
            newLikePost=foundUser.likePost.filter((id)=>!id.equals(found.id));
            foundUser.likePost=[...newLikePost];
            foundUser.save();
        })
    })
    res.redirect('/post');
})
//Edit Route
router.get("/post/:id/edit",middleware.isValidUser,(req,res)=>{
            Post.findById(req.params.id,(err,found)=>{
                if(err)
                console.log(err);
            res.render("post/edit",{post:found});
            })

});
//Delete Route
router.delete("/post/:id",middleware.isValidUser,(req,res)=>{
    Post.findByIdAndRemove(req.params.id,(err)=>{
        if(err)
        console.log(err);
        else{
            req.flash("success","post deleted successfully")
            res.redirect("/post");
        }
    })
})

//Update route
router.put("/post/:id",middleware.isValidUser,(req,res)=>{
                const updatedPost = {
                    name:req.body.name,
                    description:req.body.description
                };
                console.log(updatedPost);
                
            Post.findByIdAndUpdate(req.params.id,updatedPost,(err,updatedPost)=>{
            if(err)
            console.log(err);
            else
            {                  
                req.flash("success","Post updated Successfully")
                                
                res.redirect("/post/"+req.params.id);

            }
                
            
        })
});



//to check if user have permission
module.exports=router;