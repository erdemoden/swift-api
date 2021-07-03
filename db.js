const mongoose =require("mongoose");

module.exports = ()=>{
    mongoose.connect("mongodb+srv://erdemoden:elmayiyen5@movie-api.icdyd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
    mongoose.connection.on("open",()=>{
        console.log("mongodb connected");
    });
    mongoose.connection.on("error",()=>{
        console.log("Bir hata Oluştu");
    });
    mongoose.Promise = global.Promise;
}