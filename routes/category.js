const express = require('express');
const router = express.Router();

//Model
const Category = require('../models/Category');

/* Post Category */
router.post('/', (req, res)=> {
    const{name}=req.body;

    const category = new Category({
      name
    });

    category.save().then((category)=>{
      res.json(category);
    }).catch((err)=>{
      res.json(err);
    });
});
//All Get Category List. 
router.get("/",(req,res)=>{
    Category.find({},(err,category)=>{
      if(err)
        res.json(err);
      res.json(category);
    });
});

module.exports = router;