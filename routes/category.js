const express = require('express');
const router = express.Router();

//Model
const Category = require('../models/Category');

router.use((req,res,next)=>{
  res.header("Access-Control-Allow-Origin","*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

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