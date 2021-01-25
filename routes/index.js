const express=require('express');
const router = express.Router();
const passport=require('passport');
const User= require("../models/user");
router.get('/',(req,res)=>{
    res.render("landing");

})


//New show form to create new Post
//Autentication ROUTES
router.get("/register",(req,res)=>{
        res.render("register");
})
router.post("/register",(req,res)=>{
    User.register(new User({username:req.body.username}),req.body.password,(err,user)=>{
        if(err)
        {
            req.flash("error",err.message);
            res.redirect("/register");
        }
        passport.authenticate("local")(req,res,()=>{
            req.flash("success","Welcome To Travely  "+ user.username);
            res.redirect("/post")

        }
        );
    })
})
router.get("/login",(req,res)=>{
    res.render("login");
})
router.post("/login",passport.authenticate("local",{successRedirect:"/post",failureRedirect:"/login"}),(req,res)=>{
    console.log("password submited");
})
router.get("/logout",(req,res)=>{
    req.logout();
    req.flash("success","logged you out !")
    res.redirect("/post");
})


module.exports=router;