const jwt = require('jsonwebtoken');

module.exports = (req,res,next)=>{
    const token = req.headers['x-access-token'] || req.body.token ||req.query.token;

    if(token){
        jwt.verify(token,req.app.get('api_secret_key'),(err,decodedData)=>{
            if(err){
                res.json({
                    status:false,
                    message:"Failed to authenticate token."
                });
            }else{
                req.decode = decodedData;
                next();
            }
        });
    }else{
        res.json({
            status:false,
            message:"No token provided."
        });
    }
};

//To access localhost:3000/api/movies?token=....