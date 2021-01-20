const express= require('express');
const router = express.Router(); 
const Campground=require("../models/campground");
const middleware = require("../middleware")

router.get('/campground/new',middleware.isLoggedIn,(req,res)=>
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

router.post('/campground',middleware.isLoggedIn,(req,res)=>{
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
router.get("/campground/:id/edit",middleware.isValidUser,(req,res)=>{
            Campground.findById(req.params.id,(err,found)=>{
                if(err)
                console.log(err);
            res.render("campground/edit",{campground:found});
            })

});
//Delete Route
router.delete("/campground/:id",middleware.isValidUser,(req,res)=>{
    Campground.findByIdAndRemove(req.params.id,(err)=>{
        if(err)
        console.log(err);
        else{
            res.redirect("/campground");
        }
    })
})

//Update route
router.put("/campground/:id",middleware.isValidUser,(req,res)=>{
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



//to check if user have permission
module.exports=router;