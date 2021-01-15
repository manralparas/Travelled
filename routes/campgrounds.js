const express= require('express');
const router = express.Router(); 
const Campground=require("../models/campground");
const Comment= require("../models/comment");
router.get('/campground/new',(req,res)=>
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

router.post('/campground',(req,res)=>{
    const placeName=req.body.name;
    const placeImage=req.body.image;
    const placeDescription= req.body.description;
    const create={
        name:placeName,
        image:placeImage,
        description:placeDescription
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
module.exports=router;