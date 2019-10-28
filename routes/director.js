const express = require('express');
const router = express.Router();


//Models Director
const Director=require('../models/Director');

/* Post. */
router.post('/', (req, res, next)=> {
  const director = new Director(req.body);
  const promise = director.save();

  promise.then((data)=>{
    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });
});

module.exports = router;
