const mongoose = require("mongoose");
const schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const users = new schema({
name:{
    type:String,
    required:[true,' Name alanı zorunludur'],
    unique:[true,'Girdiğiniz isim kullanılmaktadır'],
    maxlength:[15,'Name 15 karakterden uzun olamaz']
},
password:{
    type:String,
    required:[true,'`{PATH}` alanı zorunludur']
}
});
users.pre('save',async function(next){
    user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8);
    }
    next();
});
module.exports = mongoose.model('users',users);