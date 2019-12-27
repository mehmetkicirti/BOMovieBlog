const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};

const UserSchema = new Schema({

    name:{
        type:String,
        maxlength:50,
        minlength:2,
        required:1
    },
    surname:{
        type:String,
        maxlength:50,
        minlength:2,
        required:1
    },
    username:{
        type:String,
        required:1,
        unique:1
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password:{
        type:String,
        required:1,
        minlength:8,
        maxlength:100
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    IsAdmin:{
        type:Boolean,
        default:false
    }
});
// UserSchema.path('email').validate(function (email) {
//     var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
//     return emailRegex.test(email.text); // Assuming email has a text attribute
//  }, 'The e-mail field cannot be empty.');

 module.exports = mongoose.model('user',UserSchema);