const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true,
    unique: true
  },
  password:{
    type: String,
    required: true
  },
  pic:{
    type:String,
    default:"https://res.cloudinary.com/sumit71992/image/upload/v1613209323/avt2_dvylty.jpg"
  },
  followers:[{
    type: mongoose.ObjectId,
    
  }],
  following:[{
    type: mongoose.ObjectId,
    
  }]
  
},{timestamps: true},)
const User = mongoose.model("User",userSchema);
module.exports= User;