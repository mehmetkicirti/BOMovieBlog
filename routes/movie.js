const express = require('express');
const router = express.Router();

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

router.get('/:movie_id', (req, res,next) => {
    //what will be movie_id that to be appointed.
    Movie.findById(req.params.movie_id,(err,data)=>{
        if(!data)
            next({message:"The movie was not found.",code:404});
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
            next({message:"The movie was not found to update",code:405});
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
           next({message:'The movie was not found to delete',code:406}); 

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