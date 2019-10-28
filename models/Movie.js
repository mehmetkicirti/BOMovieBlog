const mongoose =require('mongoose');
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    category_id:Schema.Types.ObjectId,
    country:String,
    year:Number,
    imdb_score:Number,
    director_id:Schema.Types.ObjectId,
    date:{
        type:Date,
        default:Date.now
    }
});

module.exports=mongoose.model('movie',MovieSchema);