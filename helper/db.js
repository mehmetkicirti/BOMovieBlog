const mongoose = require('mongoose');
const dotenv = require("dotenv");

dotenv.config();

module.exports=()=>{
    mongoose.connect(process.env.DB_CONNECT,{useNewUrlParser:true,useUnifiedTopology:true});
    mongoose.connection.on('open',()=>{
        console.log("Mongo DB : Connected.");
    });
    mongoose.connection.on('error',(err)=>{
        console.log("Mongo DB : Error.",err);
    });
};