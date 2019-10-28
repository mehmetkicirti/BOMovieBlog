const express = require('express');
const router = express.Router();

//Model import 
const Movie = require('../models/Movie');

router.post('/', function(req, res, next) {
    const {title,imdb_score,country,year} = req.body; //all objects contain to post
    const movie= new Movie({
        title:title,
        imdb_score:imdb_score,
        country:country,
        year:year
    });
    // movie.save((err,data)=>{
    //     if(err)
    //         res.json(err);
    //     res.json(data);
    // });
    movie.save().then((data)=>{
        res.json(data);
    }).catch((err)=>{
        res.json(err);
    });
});

module.exports = router;
