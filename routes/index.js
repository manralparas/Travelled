const express=require('express');
const router = express.Router();
const passport=require('passport');
const User= require("../models/user");
router.get('/',(req,res)=>{
    res.render("landing");

})


//New show form to create new campground
//Autentication ROUTES
router.get("/register",(req,res)=>{
        res.render("register");
})
router.post("/register",(req,res)=>{
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
router.get("/login",(req,res)=>{
    res.render("login");
})
router.post("/login",passport.authenticate("local",{successRedirect:"/campground",failureRedirect:"/login"}),(req,res)=>{
    console.log("password submited");
})
router.get("/logout",(req,res)=>{
    req.logout();
    res.redirect("/campground");
})


function isLogin(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}
module.exports=router;