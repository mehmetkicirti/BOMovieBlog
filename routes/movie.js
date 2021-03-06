const express = require('express');
const router = express.Router();
const fs = require('fs'); 
//middleware

// Error Messages
let ErrorEnums = {
    Not_Found: 1,
    Not_Found_To_Deleted: 2,
    Not_Found_To_Updated: 3,
    properties: {
        1: {
            name: "Not Found",
            value: "The movie was not found.",
            code: 404
        },
        2: {
            name: "Not Found Deleted",
            value: "The movie was not found to deleted.",
            code: 405
        },
        3: {
            name: "Not Found Updated",
            value: "The movie was not found to updated",
            code: 406
        }
    }
};

//Model import 
const Movie = require('../models/Movie');

router.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

router.get('/', (req, res) => {
    // Movie.find({}, (err, data) => {
    //     if (err)
    //         res.json(err);
    //     res.json(data);
    // });
    const promise = Movie.aggregate([{
            $lookup: {
                from: 'directors',
                localField: 'director_id',
                foreignField: '_id',
                as: 'director'
            }
        },
        {
            $lookup: {
                from: 'categories',
                localField: 'category_id',
                foreignField: '_id',
                as: 'category'
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "comments.user_id",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $unwind: {
                path:"$director",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $unwind:{ path:'$category',
            preserveNullAndEmptyArrays: true}
        },
        {
            $unwind: {path:"$user",
            preserveNullAndEmptyArrays: true}
        },
        {
            $project:{
                user:"$user",
                category:"$category",
                director:"$director",
                title:1,
                imdb_score:1,
                country:1,
                imgURL:1,
                year:1,
                createdAt:1,
                imgURL:1,
                embedURL:1
            }
        }
    ]);
    promise.then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    });
});
//Top 10
router.get('/top10', (req, res) => {
    const promise = Movie.find({}).limit(10).sort({
        imdb_score: -1
    });
    promise.then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    });
});
//between year api process
router.get('/between/:start_year/:end_year', (req, res) => {
    const {
        start,
        end
    } = req.params;
    const promise = Movie.find({
        year: {
            "$gte": parseInt(start),
            "$lte": parseInt(end)
        }
    });

    promise.then((movies) => {
        res.json(movies);
    }).catch((err) => {
        res.json(err);
    });
});
//search by name
router.get('/searchByTitle/:title', (req, res, next) => {
    const promise = Movie.findOne({
        title: req.params.title
    });

    promise.then((movie) => {
        if (!movie)
            next({
                message: ErrorEnums.properties[0].value,
                code: ErrorEnums.properties[0].code
            });
        res.json(movie);
    }).catch((err) => {
        res.json(err);
    });
});

router.get('/:movie_id', (req, res, next) => {
    //what will be movie_id that to be appointed.
    Movie.findById(req.params.movie_id, (err, data) => {
        if (!data)
            next({
                message: ErrorEnums.properties[0].value,
                code: ErrorEnums.properties[0].code
            });
        if (err)
            res.json(err);
        res.json(data);
    });
});

router.put('/:movie_id', (req, res, next) => {
    const {title,
        imdb_score,
        country,
        year,
        embedURL} =req.body;
    const {imgURL}=req.file;

    const movie = new Movie({
        title:title,
        imdb_score:imdb_score,
        country:country,
        year:year,
        embedURL:embedURL
    });
    if(imgURL){
        fs.unlink('public/images/'+movie.imgURL, err=>{
            if(err){
                console.log(err);
            }
        });
        movie.imgURL = imgURL.filename;
    }
    const promise = Movie.findByIdAndUpdate(req.params.movie_id, {
        movie
    }, {
        new: true
    });
    promise.then((movie) => {
        if (!movie) {
            next({
                message: ErrorEnums.properties[1].value,
                code: ErrorEnums.properties[1].code
            });
        }
        res.json(movie);
    }).catch((err) => {
        res.json(err);
    });
});

router.delete('/:movie_id', (req, res, next) => {
    
    Movie.findOne({_id:req.params.movie_id}).
        then((movie)=>{
            if(!movie){
             next({message:"Movie was not found.",status:404});
            }
            fs.unlink('public/images/'+movie.imgURL, err=>{
                    if(err){
                        console.log(err);
                    }
            });
            movie.remove((err,movie)=>{
                if(err)
                    res.json(err);
                res.json({
                    message:"Successfully Deleted.",
                    movie:movie
                });
            });
        });
});

router.post('/save', (req, res, next) => {
    const {
        title,
        imdb_score,
        country,
        year,
        comments,
        category_id,
        director_id,
        embedURL
    } = req.body; //all objects contain to post
    const {imgURL}=req.file;

    const movie = new Movie({
        title: title,
        imdb_score: imdb_score,
        country: country,
        year: year,
        comments: comments,
        category_id,
        director_id,
        imgURL:imgURL.filename,
        embedURL:embedURL
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

router.put('/addComment/:movie_id', (req, res, next) => {
    const {
        user_id,
        message
    } = req.body;
    Movie.findByIdAndUpdate({
        _id: req.params.movie_id
    }, {
        $push: {
            comments: [{
                user_id,
                message
            }]
        }
    }, {
        new: true,
        safe: true,
        upsert: true
    }, (err, movie) => {
        if (err)
            res.json(err);
        res.json(movie);
    });
});


module.exports = router;