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
    comments:[
        {messages:String}
    ],
    category_id:Schema.Types.ObjectId,
    country:String,
    year:{
        type:Number,
        min:1800,
        max:2050
    },
    imdb_score:{
        type:Number,
        min:ParseFloat(0),
        max:ParseFloat(10)
    },
    director_id:Schema.Types.ObjectId,
    createdAt:{
        type:Date,
        default:Date.now
    }
});

module.exports=mongoose.model('movie',MovieSchema);