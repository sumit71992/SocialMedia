const jwt = require("jsonwebtoken")
const {JWT_SECRET} = require("../keys")
const User = require("../models/user")
module.exports = (req, res, next)=>{
  const {authorization} = req.headers
  if(!authorization){
    return res.status(401).json({error:"login first"});
  }else{
   const token = authorization.replace("Bearer ","")
   jwt.verify(token,JWT_SECRET,(err, payload)=>{
     if(err){
       return res.status(401).json({error:"must loged in"})
     }else{
       const {_id} = payload
       User.findById(_id).then(usr=>{
         req.user = usr;
         next();
       })  
     }
   })
  }
}