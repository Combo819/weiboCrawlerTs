import { Document, Model, model, Types, Schema, Query } from "mongoose";
import { userSchema } from "./user";
export const subCommentSchema = Schema({
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
});

export default model("subComment", subCommentSchema);
