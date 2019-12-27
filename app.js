const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const multer = require('multer');
const directorRouter = require('./routes/director');
const usersRouter = require('./routes/users');
const movieRouter=require('./routes/movie');
const categoryRouter=require('./routes/category');
const app = express();

//db connection
const db= require(path.join(__dirname,"/helper","/db.js"))();

//middleware
const verifyToken = require('./middleware/verify-token');

//multer configurate where should be uploads
const storage = multer.diskStorage({
    destination:(req,file,callback)=>{
      callback(null,'./public/images/');
    },
    filename:(req,file,callback)=>{
      callback(null,file.fieldname+"-"+Date.now()+path.extname(file.originalname));
      //imgURL-342342.jpg
    }
});
//config key.
const config = require(path.join(__dirname,"config.js"));
app.set('api_secret_key',config.api_secret_key);
// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(multer({storage:storage}).single('imgURL'));
 
app.use('/api/movie/:movie_id',verifyToken);//below the api parameter all method if authenticated,it can be able to access from user.
app.use('/api/movie/save',verifyToken);
app.use('/api/director/save',verifyToken);
app.use('/api/director/:movie_id',verifyToken);
//using routes as
app.use('/api/director', directorRouter);
app.use('/user', usersRouter);
app.use('/api/movie',movieRouter);
app.use('/api/category',categoryRouter);


// catch 404 and forward to error handler
app.use((req, res, next) =>{
  next(createError(404));
});

// error handler
app.use((err, req, res, next) =>{
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({error:{message:err.message,code:err.code}});
});

module.exports = app;
