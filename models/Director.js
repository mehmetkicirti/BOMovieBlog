const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const DirectorSchema= new Schema({
    name:{
        type:String,
        required:1,
    },
    surname:{
        type:String,
        required:1
    },
    bio:{
        type:String
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model('director',DirectorSchema);