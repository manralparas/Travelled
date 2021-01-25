const Campground=require("../models/post");
const Comment= require("../models/comment");
const middlewareObject={};
middlewareObject.isValidUser=(req,res,next)=>{
    if(req.isAuthenticated())
    {
        Campground.findById(req.params.id,(err,found)=>{
            if(err)
            res.redirect("back");
             else
            { 
                 if(found.author.id.equals(req.user._id))
                {
                    next();
                }
                else
                {req.flash("error","You don't have permission to do that!")

                  res.redirect("back")
                }
            }
    }
        );
    }
    else
    {

    req.flash("error","You need to be logged in to do that");
    res.redirect("back");
    }
}
middlewareObject.isValidUserComment=(req,res,next)=>{
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
                { req.flash("error","You don't have permission to do that!")
                  res.redirect("back")
                }
            }
    }
        );
    }
    else
    {
    req.flash("error","You need to be logged in to do that");
    res.redirect("back");
    }
}
middlewareObject.isLoggedIn=(req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please Login First!")
    res.redirect("/login")
}
module.exports=middlewareObject;