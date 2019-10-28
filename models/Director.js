const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const DirectorSchema= new Schema({
    name:{
        type:String,
        required:1,
        maxlength:75,
        minlength:2
    },
    surname:{
        type:String,
        required:1,
        maxlength:30,
        minlength:2
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