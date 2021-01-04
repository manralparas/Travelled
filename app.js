const express = require("express");
const app= express();
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const Campground=require("./models/campground");
// const Comment= require("./models/comment");
// const User = require("./models/user");
const seedDb = require("./seed");
seedDb();
mongoose.connect("mongodb+srv://paras:CFMFV0UOQPA1Y8Ic@cluster0.y8o7g.mongodb.net/camp?retryWrites=true&w=majority",{ useNewUrlParser: true ,useUnifiedTopology: true,});

app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine","ejs");



app.get('/',(req,res)=>{
    res.render("landing");

})
app.get('/campground',(req,res)=>{
   Campground.find({},(err,campground)=>{
       if(err)
       {
           console.log(err);
       }
       else{
           console.log("data reteirved successfully ")

            res.render("camping",{campground:campground});
       }
   }) 

})

app.post('/campground',(req,res)=>{
    const place_name=req.body.name;
    const place_image=req.body.image;
    const place_description= req.body.description;
    const create={
        name:place_name,
        image:place_image,
        description:place_description
    }
    Campground.create(create,(err,newone)=>
    {
        if(err)
        console.log("Something went wrong ");
        else
        {
            console.log("Data is created successfully ");
            res.redirect('/campground');
        }
    })

})

//New show form to create new campground
app.get('/campground/new',(req,res)=>
{
    res.render("new")

})

app.get('/campground/:id',(req,res)=>
{   //find the id then render the show page with id
    Campground.findById(req.params.id,(err,found)=>{
        if(err)
        console.log(err);
        else
        {
                console.log(found);
        res.render("show",{found:found});
        }
    }
    )
})
app.get("/campgrounds/:id/comments/new",(req,res)=>{
  res.send("welcome to comment page");
}
)
const PORT = 8000
app.listen(PORT,()=>{

console.log(`server running on port ${PORT}
Welcome to Yelpcamp`);

})