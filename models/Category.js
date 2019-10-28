const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name:{
        type:String,
        required:[true, ` Category ({PATH}) was not be null.This is required field.`],
        minlength:3,
        maxlength:40
    }
});

module.exports= mongoose.model('category',CategorySchema);