const mongoose =require('mongoose');
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
    title:{
        type:String,
        required:[true,'`{PATH} field was required.`'],
        maxlength:[45,'`{PATH} field ({VALUE}) is not greater than ({MAXLENGTH})`'],
        minlength:1,
        unique:true
    },
    category_id:mongoose.Types.ObjectId,
    country:String,
    year:{
        type:Number,
        min:1800,
        max:2050
    },
    imdb_score:{
        type:Number,
        min:parseFloat(0),
        max:parseFloat(10)
    },
    director_id:mongoose.Types.ObjectId,
    createdAt:{
        type:Date,
        default:Date.now
    },
    imgURL:{
        type:String
    },
    embedURL:{
        type:String
    },
    comments:[
        {
        user_id:{type:mongoose.Types.ObjectId},
        message:{type:String}
        }
    ]
});

module.exports=mongoose.model('movie',MovieSchema);