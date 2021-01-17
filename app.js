//Imports
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
const express = require("express"),
    app= express(),
    bodyParser = require("body-parser"),
    mongoose = require('mongoose'),
   
    passport = require("passport"),
    User = require("./models/user"),
    localStrategy=require("passport-local");
const campgroundRoutes=require("./routes/campgrounds");
const commentRoutes=require("./routes/comments");
const authRoutes=require("./routes/index");
const methodOverride= require('method-override');
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------Mongo Secret DNS Seed List--------------------------------------------------------------------------------------------
const keyUrl = require("./key")
mongoose.connect(keyUrl,{ useNewUrlParser: true ,useUnifiedTopology: true,});
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------

//Middleware
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
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

app.use(function(req,res,next){
  res.locals.currentUser = req.user;;
  next();
});


//-------------------------------------------------------------------------------------------------------------------------
//                                HANDLING ROUTES
app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(authRoutes);

//--------------------------------------------------------------------------------------------------------------------------------- 
//Serving App
const PORT = 8000
app.listen(PORT,()=>{

console.log(`server running on port ${PORT}
Welcome to Yelpcamp`);

})
