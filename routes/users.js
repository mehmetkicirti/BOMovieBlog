const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt =require('jsonwebtoken');
const mongoose =require('mongoose');
const mailer = require('nodemailer');
//Model User 
const User = require('../models/User');

// //Validation
// const Joi = require('@hapi/joi');

// const schema = {
//     name:Joi.string().min(3).required(),
//     surname:Joi.string().min(3).required(),
//     username:Joi.string().min(3).required(),
//     email:Joi.string().min(6).required().email(),
//     password:Joi.string().min(8).required()
// }

router.use((req,res,next)=>{
  res.header("Access-Control-Allow-Origin","*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
/* Post users. */
router.post('/',async (req, res, next) => {
  //Validate data
  // const validation = Joi.valid(req.body,schema);
  // res.send(validation);
  const {
    name,
    surname,
    username,
    email,
    password
  } = req.body;

  let transporter =mailer.createTransport({
    service:'gmail',
    auth:{
      user:'infose480project@gmail.com',
      pass:'45594559'
    }
  });
  
  
    
    //Check database if it is a already user control

    const emailExist =await User.findOne({email:email});
    if(emailExist) return res.status(400).send("Email is already exists.");
    await bcrypt.hash(password, 10).then((hash) => {
      const user = new User({
        name: name,
        surname: surname,
        username: username,
        email: email,
        password: hash
    });

    let mailOptions = {
      from : 'infose480project@gmail.com',
      to:email,
      subject:'New register',
      text:'Welcome to our app',
      html: `<h1>Welcome ${name} ${surname}</h1></br></hr> Successfully registered.. <hr>Your password is : ${password}`
    };

    const promise =user.save();
    
    promise.then((data) => {
      transporter.sendMail(mailOptions,(error,info)=>{
        if(error){
          console.log(error);
        }else{
          console.log('Email sent :',info.response);
        }
      });
      res.json(data);
    }).catch((err) => {
      res.json(err);
    });
  });
});

router.post('/authenticate',async (req,res)=>{
  const {username,password} = req.body;

  await User.findOne({
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

router.get('/', async (req,res)=>{
    await User.aggregate([
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

router.get('/:user_id',async (req,res)=>{
  await User.aggregate([
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