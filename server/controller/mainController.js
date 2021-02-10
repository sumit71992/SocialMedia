const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Post = require("../models/post");
const {JWT_SECRET} = require("../keys");


const signup = (req,res)=>{
  const {name,email,password,pic}= req.body;
  if(!email || !password || !name){
   return res.status(422).json({error: "please add all details"})
  }else{
    User.findOne({email: email})
    .then((savedUser)=>{
      if(savedUser){
        return res.status(422).json({error:"email already registerd"});
      }else{
        bcrypt.hash(password,10)
        .then(hashedPassword=>{
          const user = new User({
            email,
            password: hashedPassword,
            name,
            pic
          })
          .save()
          .then(usr=>{
            res.json({message:"Registered Scuccessfully"})
          }).catch(err=>{
            console.log("error",err);
          })
        }) 
      }
    })
    .catch(err=>{
      console.log(err);
    })
  }
}
const signin = (req, res)=>{
  const{email,password}= req.body;
  if(!email || !password){
    return res.status(422).json({error:"all field should require"});
  }else{
    User.findOne({email: email})
    .then(usr=>{
      if(!usr){
        return res.status(422).json({error:"user not registered"});
      }else{
        bcrypt.compare(password, usr.password)
        .then(result=>{
          if(!result){
            return res.status(422).json({error:"invalid password"});
          }else{
            //res.json({message:"Successfully logined in"})
            const token = jwt.sign({_id: usr._id},JWT_SECRET);
            const {_id,name,email,followers,following,pic} = usr;
            res.json({token, user:{_id,name,email,followers,following,pic}});
          }
        }).catch(err=>{
          console.log(err);
        })
      }
    }).catch(err=>{
      console.log(err);
    })
  }
}
const post = (req, res)=>{
  const{title,body,photo}= req.body;
  if(!title || !body || !photo){
    return res.status(422).json({error:"Please add all fields"})
  }else{
    const post = new Post({
      title,
      body,
      photo,
      postedBy: req.user,
    })
    .save()
    .then(result=>{
      res.send({post: result});
    }).catch(err=>{
      console.log(err);
    })
  }
}
const allPost = (req,res)=>{
  Post.find()
  .populate("postedBy","_id name")
  .populate("comments.commentedBy","_id name")
  .sort('-createdAt')
  .then((post)=>{
      res.json({post})
  }).catch(err=>{
      console.log(err)
  }) 
}
const allFollowedPost = (req,res)=>{
  Post.find({postedBy:{$in:req.user.following}})
  .populate("postedBy","_id name")
  .populate("comments.commentedBy","_id name")
  .sort('-createdAt')
  .then((posts)=>{
      res.json({posts})
  }).catch(err=>{
      console.log(err)
  }) 
}
const myPost = (req,res)=>{
  Post.find({postedBy:req.user._id})
  .populate("postedBy","_id name")
  .sort('-createdAt')
  .then((myPost)=>{
      res.json({myPost})
  }).catch(err=>{
      console.log(err)
  }) 
}
const user = (req,res)=>{
  User.findOne({_id:req.params.id})
  .select("-password")
  .then(usr=>{
    Post.find({postedBy:req.params.id})
    .populate("postedBy", "_id name")
    .exec((err,posts)=>{
      if(err){
        return res.status(422).json({error:err});
      }else{
        res.json({usr, posts})
      }
    })
  }).catch(err=>{
    return res.status(404).json({error:"User not found"})
  })
}


module.exports={
  signup: signup,
  signin: signin,
  post: post,
  allPost:allPost,
  myPost:myPost,
  user:user,
  allFollowedPost:allFollowedPost,
}