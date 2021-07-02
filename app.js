const express = require('express');
const { request } = require('http');
const cookieparser = require('cookie-parser');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());
app.set('view-engine','ejs');
const db  = require('./db')();
const log = require('./routes/log');
app.get("/",(req,res)=>{
    res.render("index.ejs");
});
app.use('/',log);
app.listen(process.env.PORT||1998);



