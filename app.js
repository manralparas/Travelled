//Imports
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
const express = require("express"),
    app= express(),
    bodyParser = require("body-parser"),
    mongoose = require('mongoose'),
    Campground=require("./models/campground"),
    Comment= require("./models/comment"),
    passport = require("passport"),
    User = require("./models/user"),
    localStrategy=require("passport-local");
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------Mongo Secret DNS Seed List--------------------------------------------------------------------------------------------
const keyUrl = require("./key")
mongoose.connect(keyUrl,{ useNewUrlParser: true ,useUnifiedTopology: true,});
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------

//Middleware
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"))
//------------------------------------------------------------------------------------------------------------------

//Passport JS Configuration
app.use(require("express-session")({
    secret:"ANY_SECRET_KEY",
    resave:false,
    saveUninitialized:false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//-------------------------------------------------------------------------------------------------------------------------
//                                HANDLING ROUTES
//--------------------------------------------------------------------------------------------------------------------------------- 
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
            res.render("campground/camping",{campground:campground});
       }
   }) 

})

app.post('/campground',(req,res)=>{
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

//New show form to create new campground
app.get('/campground/new',(req,res)=>
{
    res.render("campground/new")

})

app.get('/campground/:id',(req,res)=>
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
app.get("/campground/:id/comments/new",(req,res)=>{
    Campground.findById(req.params.id,(err,campground)=>{
                if(err)
                console.log(err);
                else
                res.render("comment/new",{campground:campground});

    })
}
);

app.post("/campground/:id/comments",(req,res)=>{
     Campground.findById(req.params.id,(err,campground)=>{
            if(err)
            console.log(err);
            else{
                const content=req.body.content;
                const author=req.body.author;
                const comment={
                    author:author,
                    content:content
                };
            Comment.create(comment,(err,comment)=>{
                if(err)
                console.log(err)
                else{
                    console.log(comment);
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect(`/campground/${campground._id}`);
                }
            })
            }
     })
})
//Autentication ROUTES
app.get("/register",(req,res)=>{
        res.render("register");
})
app.post("/register",(req,res)=>{
    User.register(new User({username:req.body.username}),req.body.password,(err,user)=>{
        if(err)
        {
            console.log(err);
            res.redirect("/register");
        }
        passport.authenticate("local")(req,res,()=>
        res.redirect("/campground"));
    })
})

//Serving App

const PORT = 8000
app.listen(PORT,()=>{

console.log(`server running on port ${PORT}
Welcome to Yelpcamp`);

})