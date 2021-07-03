const jwt = require('jsonwebtoken');

const check = function (req,res,next){
        const token = req.cookies.jwt;
        if(req.body.type=="ios"){
            next();
        }
        
        else if(token){
        jwt.verify(token, process.env.TOKEN_SECRET, (err,dtoken)=>{
            if(err){
                console.log("Hata");
                res.redirect('/login');
            }
            else{
                console.log("Oldu");
                next();
            }
        });
    }
    else{
        res.redirect('/login');
    }
}
module.exports = { check };