const mongoose = require("mongoose");
const User = require("./user");
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      default: "no photo",
    },
    likes: [
      {
        type: mongoose.ObjectId,
        ref: User,
      },
    ],
    comments: [
      {
        text: String,
        commentedBy: {
          type: mongoose.ObjectId,
          ref: User,
        },
      },
    ],
    postedBy: {
      type: mongoose.ObjectId,
      ref: User,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
