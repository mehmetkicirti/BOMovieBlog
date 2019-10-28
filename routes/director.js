const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


//Models Director
const Director = require('../models/Director');

/* Post. */
router.post('/', (req, res, next) => {
  const director = new Director(req.body);
  const promise = director.save();

  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });
});
//Get all directors 
router.get('/', (req, res) => {
  const promise = Director.aggregate([{
      $lookup: {
        from: 'movies', //which with table
        localField: '_id',
        foreignField: 'director_id',
        as: 'movies' //what as assigned name
      }
    },
    {
      $unwind: {
        path: '$movies',
        preserveNullAndEmptyArrays: true //Whatever matched any data is getting this command.
      }
    },
    {
      $group: {
        _id: {
          _id: '$_id',
          name: '$name',
          surname: '$surname',
          bio: '$bio'
        },
        movies: {
          $push: '$movies'
        } // this command was provide that getting into movies all movie belonging the director.
      }
    },
    {
      $project: {
        _id: '$_id._id',
        name: '$_id.name',
        surname: '$_id.surname',
        movies: '$_id.movies'
      } //this command was provided that merging what we wanted properties defining in here. 
    }
  ]);
  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });
});
//Get By Id
router.get('/:director_id', (req, res) => {
  const promise = Director.aggregate([{
      $match: {
        _id: mongoose.Types.ObjectId(req.params.director_id)
      }
    },
    {
      $lookup: {
        from: 'movies', //which with table
        localField: 'director_id',
        foreignField: '_id',
        as: 'movies' //what as assigned name
      }
    },
    {
      $unwind: {
        path: '$movies',
        preserveNullAndEmptyArrays: true //Whatever matched any data is getting this command.
      }
    },
    {
      $group: {
        _id: {
          _id: '$_id',
          name: '$name',
          surname: '$surname',
          bio: '$bio'
        },
        movies: {
          $push: '$movies'
        } // this command was provide that getting into movies all movie belonging the director.
      }
    },
    {
      $project: {
        _id: '$_id._id',
        name: '$_id.name',
        surname: '$_id.surname',
        movies: '$_id.movies'
      } //this command was provided that merging what we wanted properties defining in here. 
    }
  ]);
  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });
});
//update Data
router.put('/:director_id', (req, res, next) => {
  const promise = Director.findByIdAndUpdate(
    req.params.director_id,
    req.body, {
      new: true
    }
  );
  promise.then((director) => {
    if (!director)
      next({
        message: 'The director was not found',
        code: 404
      });
    res.json(director);
  }).catch((err) => {
    res.json(err);
  });
});
//delete Data
router.delete('/:director_id', (req, res, next) => {
  const promise = Director.findByIdAndRemove(req.params.director_id);

  promise.then((director) => {
    if (!director)
      next({
        message: 'The director was not found',
        code: 404
      });
    res.json(director);
  }).catch((err) => {
    res.json(err);
  });
});
//searchbyName
router.get('/searchByName/:name', (req, res, next) => {
  const promise = Movie.aggregate([{
      $match: {
        name: req.params.name
      }
    },
    {
      $lookup: {
        from: "movies",
        localField: 'director_id',
        foreignField: '_id',
        as: "movie"
      }
    },
    {
      $unwind: {
        path: '$movie',
        preserveNullAndEmptyArrays: true //Whatever matched any data is getting this command.
      }
    },
    {
      $group: {
        _id: {
          _id: '$_id',
          name: '$name',
          surname: '$surname',
          bio: '$bio'
        },
        movies: {
          $push: '$movies'
        } // this command was provide that getting into movies all movie belonging the director.
      }
    },
    {
      $project: {
        _id: '$_id._id',
        name: '$_id.name',
        surname: '$_id.surname',
        movies: '$_id.movies'
      } //this command was provided that merging what we wanted properties defining in here. 
    }
  ]);

  promise.then((director) => {
    if (!director)
      next({
        message: 'The director was not found',
        code: 404
      });
    res.json(director);
  }).catch((err) => {
    res.json(err);
  });
});
module.exports = router;