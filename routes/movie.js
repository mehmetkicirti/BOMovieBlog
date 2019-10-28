const express = require('express');
const router = express.Router();

// Error Messages
let ErrorEnums={
    Not_Found:1,
    Not_Found_To_Deleted:2,
    Not_Found_To_Updated:3,
    properties:{
        1:{name:"Not Found",value:"The movie was not found.",code:404},
        2:{name:"Not Found Deleted",value:"The movie was not found to deleted.",code:405},
        3:{name:"Not Found Updated",value:"The movie was not found to updated",code:406}
    }
};

//Model import 
const Movie = require('../models/Movie');

router.get('/', (req, res) => {
    Movie.find({}, (err, data) => {
        if (err)
            res.json(err);
        res.json(data);
    });
});
//Top 10
router.get('/top10',(req,res)=>{
    const promise = Movie.find({}).limit(10).sort({imdb_score:-1});
    promise.then((data)=>{
        res.json(data);
    }).catch((err)=>{
        res.json(err);
    });
});
//between year api process
router.get('/between/:start_year/:end_year',(req,res)=>{
    const {start,end}=req.params;
    const promise = Movie.find(
        {
            year:{
                "$gte":parseInt(start),
                "$lte":parseInt(end)
            }
        }
    );

    promise.then((movies)=>{
        res.json(movies);
    }).catch((err)=>{
        res.json(err);
    });
});
//search by name
router.get('/searchByTitle/:title',(req,res,next)=>{
    const promise = Movie.findOne({title:req.params.title});

    promise.then((movie)=>{
        if(!movie)
            next({message:ErrorEnums.properties[0].value,code:ErrorEnums.properties[0].code});
        res.json(movie);
    }).catch((err)=>{
        res.json(err);
    });
});


router.get('/:movie_id', (req, res,next) => {
    //what will be movie_id that to be appointed.
    Movie.findById(req.params.movie_id,(err,data)=>{
        if(!data)
            next({message:ErrorEnums.properties[0].value,code:ErrorEnums.properties[0].code});
        if(err)
            res.json(err);
        res.json(data);
    });
});

router.put('/:movie_id',(req,res,next)=>{
    const promise =Movie.findByIdAndUpdate(req.params.movie_id,req.body,{
        new:true
    });
    promise.then((movie)=>{
        if(!movie){
            next({message:ErrorEnums.properties[1].value,code:ErrorEnums.properties[1].code});
        }
        res.json(movie);
    }).catch((err)=>{
        res.json(err);
    });
});

router.delete('/:movie_id',(req,res,next)=>{
    const promise = Movie.findByIdAndRemove(req.params.movie_id);
    promise.then((movie)=>{
        if(!movie)
           next({message:ErrorEnums.properties[2].value,code:ErrorEnums.properties[2].code}); 

        res.json(movie);
    }).catch((err)=>{
        res.json(err);
    });
});

router.post('/', (req, res, next) => {
    const {
        title,
        imdb_score,
        country,
        year
    } = req.body; //all objects contain to post
    const movie = new Movie({
        title: title,
        imdb_score: imdb_score,
        country: country,
        year: year
    });
    // movie.save((err,data)=>{
    //     if(err)
    //         res.json(err);
    //     res.json(data);
    // });
    movie.save().then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    });
});



module.exports = router;