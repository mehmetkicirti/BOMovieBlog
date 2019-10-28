const mongoose = require('mongoose');

module.exports=()=>{
    mongoose.connect('mongodb+srv://mehmet:1234@cluster0-l7tmj.mongodb.net/movieApi?retryWrites=true&w=majority',{useNewUrlParser:true,useUnifiedTopology:true});
    mongoose.connection.on('open',()=>{
        console.log("Mongo DB : Connected.");
    });
    mongoose.connection.on('error',(err)=>{
        console.log("Mongo DB : Error.",err);
    });
};