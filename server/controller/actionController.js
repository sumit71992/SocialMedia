const User = require("../models/user");
const Post = require("../models/post");
const mongoose = require("mongoose")


const likes = (req, res)=>{
   mongoose.set('useFindAndModify',false);
   Post.findByIdAndUpdate(req.body.postId,{
      $push:{likes:req.user._id}
   },{
      new:true
   })
   .populate("comments.commentedBy","_id name")
   .populate("postedBy","_id name")
   .exec((err,result)=>{
      if(err){
         return res.status(422).json({error:err})
      }else{
          res.json(result)
      }
   })
}
const unlike = (req, res)=>{
   mongoose.set('useFindAndModify',false)
   Post.findByIdAndUpdate(req.body.postId,{
      $pull:{likes:req.user._id}
   },{
      new:true
   })
   .populate("comments.commentedBy","_id name")
   .populate("postedBy","_id name")
   .exec((err,result)=>{
      if(err){
         return res.status(422).json({error:err})
      }else{
          res.json(result)
      }
   })
}
const comments = (req, res)=>{
   const cmt = {
      text: req.body.text,
      commentedBy:req.user._id
   }
   mongoose.set('useFindAndModify',false)
   Post.findByIdAndUpdate(req.body.postId,{
      $push:{comments:cmt}
   },{
      new:true
   })
   .populate("comments.commentedBy","_id name")
   .populate("postedBy","_id name")
   .exec((err,result)=>{
      if(err){
         return res.status(422).json({error:err})
      }else{
          res.json(result)
      }
   })
}
const deletePost = (req,res)=>{
   Post.findOne({_id:req.params.postId})
   .populate("postedBy", "_id")
   .exec((err,post)=>{
      if(err || !post){
         return res.status(422).json({error:err})
      }
      if(post.postedBy._id.toString()=== req.user._id.toString()){
         post.remove()
         .then(result=>{
            res.json(result)
         }).catch(err=>{
            console.log(err);
         })
      }
   })
}
const follow = (req,res)=>{
   mongoose.set('useFindAndModify',false)
   User.findByIdAndUpdate(req.body.followId,{
      $push:{followers:req.user._id}
   },{
      new:true
   },(err,result)=>{
      if(err){
         return res.status(422).json({error:err})
      }
      User.findByIdAndUpdate(req.user._id,{
         $push:{following:req.body.followId}
      },{
         new:true
      }).select("-password").then(result=>{
         res.json(result)
      }).catch(err=>{
         return res.status(422).json({error:err})
      })
   })
}
const unfollow = (req,res)=>{
   mongoose.set('useFindAndModify',false)
   User.findByIdAndUpdate(req.body.unFollowId,{
      $pull:{followers:req.user._id}
   },{
      new:true
   },(err,result)=>{
      if(err){
         return res.status(422).json({error:err})
      }
      User.findByIdAndUpdate(req.user._id,{
         $pull:{following:req.body.unFollowId}
      },{
         new:true
      }).select("-password").then(result=>{
         res.json(result)
      }).catch(err=>{
         return res.status(422).json({error:err})
      })
   })
}
module.exports={
   likes:likes,
   unlike:unlike,
   comments:comments,
   deletePost:deletePost,
   follow:follow,
   unfollow:unfollow,
}