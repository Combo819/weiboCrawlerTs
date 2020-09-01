/**
 * https://m.weibo.cn/comments/hotFlowChild?cid=4542209611793878&max_id=0&max_id_type=0 to get the subComment, the cid is the id of parent comment
 */
import { Document, Model, model, Types, Schema, Query } from "mongoose";
import { userSchema } from "./user";
export const subCommentSchema = new Schema({
  id: { type: String, unique: true, required: true },  //id for subComment
  mid: { type: String, unique: true, required: true }, //id for subComment
  rootid: { type: String, unique: true, required: true },  //id for parent comment
  rootidstr: String, //id for parent comment
  floorNumber: Number,
  text: String, // unicode and html
  maxId: String,
  totalNumber: Number, // the number of sub comments shown on client
  user: { type: userSchema, required: true },
  likeCount: Number,
});

export default model("SubComment", subCommentSchema);
