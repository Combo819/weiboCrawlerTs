import { Document, Model, model, Types, Schema, Query } from "mongoose";

export const userSchema = Schema({
  id: { type: Number, unique: true, required: true },
  screenName: {type:String,unique:true,required:true}, // the name shown on weibo
  profileUrl: String, // the url to the user's profile page
  description: String,
  gender: String,
  followersCount: Number,
  followCount: Number,
  profileImageUrl: Number, // the smaller profile image
  avatarHd: String, // a larger profile image,
});

export default model("User", userSchema);
