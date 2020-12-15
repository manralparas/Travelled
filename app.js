var express = require("express");
var app= express();
var bodyParser = require("body-parser");
const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://paras:CFMFV0UOQPA1Y8Ic@cluster0.y8o7g.mongodb.net/camp?retryWrites=true&w=majority",{ useNewUrlParser: true ,useUnifiedTopology: true,});

app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine","ejs");

const campgroundSchema = new mongoose.Schema({
    name:String ,
    image:String,
    description:String 
})

const Campground = mongoose.model('Campground',campgroundSchema);

app.get('/',function(req,res){

    res.render("landing");

})
app.get('/campground',function(req,res){
   Campground.find({},(err,campground)=>{
       if(err)
       {
           console.log("error found in database")
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
    const create={
        name:place_name,
        image:place_image
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
        res.render("show",{found:found});
    }
    )
    res.render('show');
})
app.listen(8000,function(){

console.log("server running on port 8000");

})