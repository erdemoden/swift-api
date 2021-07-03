const express = require("express");
require('dotenv').config();
const { Mongoose } = require("mongoose");
const { deleteOne, find } = require("../users");
const router = express.Router();
const User = require('../users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const { check } = require('../routes/auth.js');
router.post("/sign-up",async(req,res)=>{
const user = new User(req.body);
try{ 
    if(req.body.type == "ios"){
    const post = await user.save();
    res.json(post);
}
else if(typeof req.body.type == 'undefined'){
    const post = await user.save();
    const maxage = 120;
   let token = jwt.sign({name: req.body.name}, process.env.TOKEN_SECRET, {expiresIn: 120 });
    res.cookie('jwt', token, { httpOnly: true, maxAge: 120000});
    res.redirect("/homepage");
}
    
}
catch(e){
    if(e.code==11000 && typeof req.body.type == 'undefined'){
        res.render('sign-up.ejs',{error:"Bu İsim Kullanılmaktadır"});
    }
    if(e.code==11000 && req.body.type == "ios"){
        res.json({error:"Bu İsim Kullanılmaktadır"});
    }
    if(e.code!=11000 && typeof req.body.type == 'undefined'){
    let error = e.message.substring(e.message.indexOf(':')+1);
    res.render("sign-up.ejs",{error:error});
}
if(e.code!=11000 && req.body.type == "ios"){
    res.json({error:"Bu İsim Kullanılmaktadır"});
}
}
});
const createtoken = (name1)=>{
const maxage = 2*60;
return jwt.sign({name:'deneme'}, process.env.TOKEN_SECRET);
}
router.get('/homepage',check,(req,res)=>{
    let gonder = req.cookies.jwt;
    let gonder1 = jwt.verify(gonder, process.env.TOKEN_SECRET);
res.render('homepage.ejs',{gonder1});
});
router.post("/homepage",(req,res)=>{
    if(req.body.type == "ios"){
    res.json({status:1});
}
else{
    res.redirect("/login");
}
    });
router.post("/login",async(req,res)=>{
    let deneme = req.body.name;
    let ad = req.cookies.jwt;
    try{
        if(req.body.type == "ios"){
            let user1 = await User.findOne({name:deneme});
            if(!user1){
                res.json({hata:"Kullanıcı Bulunamadı"});
            }
            else{
            const ischeck = await bcrypt.compare(req.body.password,user1.password);
            if(!ischeck){
                res.json({hata:"Kullanıcı Bulunamadı"});
            }
            else{
            res.json({status:1});
            }
        }
        }
        else if(!req.body.type){
            if(!ad){
            let user1 = await User.findOne({name:deneme});
            if(!user1){
                res.render("login.ejs",{error:"Kullanıcı Bulunamadı!"});
            }
            else{
            const ischeck = await bcrypt.compare(req.body.password,user1.password);
            if(!ischeck){
                res.render("login.ejs",{error:"Kullanıcı Bulunamadı!"});
            }
            else{
                const maxage = 2*60;
                const token = await jwt.sign({
                    name:req.body.name
                },process.env.TOKEN_SECRET,{
                    expiresIn:maxage
                });
                res.cookie("jwt",token,{httpOnly:true,maxAge:maxage*1000});
            res.redirect("/homepage");
            }
        }
    }
        }
       
}
catch(e){
    if(req.body.type=="ios"){
res.json({hata:"Hata"});
}
else{
    res.render("login.ejs",{error:e});
}
}

});
router.get("/login",(req,res)=>{
const token = req.cookies.jwt;
if(!token){
res.render("login.ejs",{error:false});
}
else{
    jwt.verify(token, process.env.TOKEN_SECRET, (err,dtoken)=>{
        if(err){
            console.log("Hata");
            res.render('login.ejs');
        }
        else{
            console.log("Oldu");
            res.redirect("/homepage");
        }
    });
}
});
router.get("/index",(req,res)=>{
    res.render("index.ejs");
    });
router.get("/sign-up",(req,res)=>{
    const token = req.cookies.jwt;
if(!token){
res.render("sign-up.ejs",{error:false});
}
else{
    jwt.verify(token, process.env.TOKEN_SECRET, (err,dtoken)=>{
        if(err){
            console.log("Hata");
            res.render("sign-up.ejs");
        }
        else{
            console.log("Oldu");
            res.redirect("/homepage");
        }
    });
}
});
router.get("/deleteall",async (req,res)=>{
    try{
    await User.deleteMany()
    res.send("silindi");
}
catch(e){
    res.json(e);
}
});
router.get("/deneme/:id",(req,res)=>{
res.send("Merhaba Girdiğiniz Değer : "+req.params.id);
});


module.exports = router;