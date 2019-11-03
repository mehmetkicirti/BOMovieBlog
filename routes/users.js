const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt =require('jsonwebtoken');
const mongoose =require('mongoose');
//Model User 
const User = require('../models/User');

router.use((req,res,next)=>{
  res.header("Access-Control-Allow-Origin","*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
/* Post users. */
router.post('/', function (req, res, next) {
  const {
    name,
    surname,
    username,
    email,
    password,
    comments
  } = req.body;

  bcrypt.hash(password, 10).then((hash) => {
    const user = new User({
      name: name,
      surname: surname,
      username: username,
      email: email,
      password: hash,
      comments:comments
    });

    const promise = user.save();

    promise.then((data) => {
      res.json(data);
    }).catch((err) => {
      res.json(err);
    });
  });
});

router.post('/authenticate',(req,res)=>{
  const {username,password} = req.body;

  User.findOne({
    username
  },(err,user)=>{
    if(err)
      throw err;
    if(!user){
      res.json({
        status:false,
        message:"Authentication Failed, user not found."
      });
    }else{
      bcrypt.compare(password,user.password).then((result)=>{
        if(!result){
          res.json({
            status:false,
            message:"Authentication Failed,wrong password."
          });
        }else{
          const payload = {
            username
          };
          const token = jwt.sign(payload,req.app.get('api_secret_key'),{
            expiresIn:600 // when expired date denominated minute.
          });
          res.json({
            status:true,
            token:token,
          });
        }
      });
    }
  });
});

router.get('/',(req,res)=>{
    User.aggregate([
      {
        $match:{
          IsAdmin:false,

        }
      },
      // {
      //   $project:{
      //       username:1,
      //       name:1,
      //       surname:1,
      //       email:1,
      //       createdAt:1
      //   }
      // },
      {
        $lookup:{
          from:"movies",
          localField:"_id",
          foreignField:"comments.user_id",
          as:"movies"
        }
      },
      {
        $unwind:{
          path: '$movies',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: {
            _id:"$_id",
            username:"$username",
            name:"$name",
            surname:"$surname",
            email:"$email",
            createdAt:"$createdAt"
          },
          movies: {
            $push: '$movies'
          } // this command was provide that getting into movies all movie belonging the director.
        }
      },
      {
        $project: {
          // _id: '$_id._id',
          title: '$_id.title',
          imdb_score: '$_id.imdb_score',
          country:"$_id.country",
          year:"$_id.year",
          movies: '$movies'
        } //this command was provided that merging what we }wanted properties defining in here. 
      }
    ],(err,data)=>{
      if(err)
        res.json(err);
      res.json(data);
    });
});

router.get('/:user_id',(req,res)=>{
  User.aggregate([
    {
      $match:{
        _id:mongoose.Types.ObjectId(req.params.user_id)
      }
    },
    {
      $project:{
          username:1,
          name:1,
          surname:1,
          email:1,
          createdAt:1
      }
    },
    {
      $lookup:{
        from:"movies",
        localField:"_id",
        foreignField:"comments.user_id",
        as:"movies"
      }
    },
    {
      $unwind:{
        path: '$movies',
        preserveNullAndEmptyArrays: true
      }
    }
  ],(err,data)=>{
    if(err)
      res.json(err);
    res.json(data);
  });
});
//bcyrpt.compare(myplainpwd,hash,function(err,res){})
//decrypt password.

module.exports = router;