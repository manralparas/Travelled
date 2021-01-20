const express= require('express');
const router = express.Router(); 
const Campground=require("../models/campground");
const Comment= require("../models/comment");
router.get('/campground/new',isLogin,(req,res)=>
{
    res.render("campground/new")

})

router.get('/campground/:id',(req,res)=>
{   //find the id then render the show page with id
    Campground.findById(req.params.id).populate("comments").exec((err,campground)=>{
        if(err)
        console.log(err);
        else
        {
               // console.log(campground);
        res.render("campground/show",{campground:campground});
        }
    }
    )
})

router.get('/campground',(req,res)=>{
   Campground.find({},(err,campground)=>{
       if(err)
       {
           console.log(err);
       }
       else{
            res.render("campground/camping",{campground:campground});
       }
   }) 

})

router.post('/campground',isLogin,(req,res)=>{
    const placeName=req.body.name;
    const placeImage=req.body.image;
    const placeDescription= req.body.description;
    const author={
        id:req.user._id,
        username:req.user.username,
    }
    const create={
        name:placeName,
        image:placeImage,
        description:placeDescription,
        author,author
    };
    Campground.create(create,(err,newone)=>
    {
        if(err)
        console.log(err);
        else
        {
            res.redirect('/campground');
        }
    })

})
//Edit Route
router.get("/campground/:id/edit",isValidUser,(req,res)=>{
            Campground.findById(req.params.id,(err,found)=>{
                if(err)
                console.log(err);
            res.render("campground/edit",{campground:found});
            })

});
//Delete Route
router.delete("/campground/:id",(req,res)=>{
    Campground.findByIdAndRemove(req.params.id,(err)=>{
        if(err)
        console.log(err);
        else{
            res.redirect("/campground");
        }
    })
})

//Update route
router.put("/campground/:id",(req,res)=>{
        const updatedCampground={
            name:req.body.name,
            image:req.body.image,
            description:req.body.description
        };
        Campground.findByIdAndUpdate(req.params.id,updatedCampground,(err,updatedCampground)=>{
            if(err)
            console.log(err);
            else
            res.redirect("/campground/"+req.params.id);
        })
});


function isLogin(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}
//to check if user have permission
function isValidUser(req,res,next){
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