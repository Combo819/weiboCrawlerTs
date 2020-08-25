import { Document, Model, model, Types, Schema, Query } from "mongoose";
import { subCommentSchema } from "./subComment";
import { userSchema } from "./user";
const commentSchema = Schema({
  id: { type: String, unique: true, required: true },
  mid: { type: String, unique: true, required: true },
  rootid: { type: String, unique: true, required: true },
  rootidstr: String,
  floorNumber: Number,
  text: String, // unicode and html
  maxId: String,
  totalNumber: Number, // the number of sub comments shown on client
  user: { type: userSchema, required: true },
  likeCount: Number,
  children: [subCommentSchema],
});

export default model("comment", commentSchema);
