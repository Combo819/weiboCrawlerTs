import { Document, Model, model, Types, Schema, Query } from "mongoose";

/**
 * Interface to model the User Schema for TypeScript.
 */
export interface IUser extends Document {
  id:number,
  screenName:string,
  profileUrl:string,
  gender:string,
  followersCount: number,
  followCount: number,
  profileImageUrl: number, // the smaller profile image
  avatarHd: string, // a larger profile image,
}

export const userSchema = new Schema({
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

const User: Model<IUser> = model("User", userSchema);

export default User;
