const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const CategorySchema = new Schema({
    name:{
        type:String,
        required:1,
        minlength:3,
        maxlength:40
    }
});


module.exports=mongoose.model('category',CategorySchema);