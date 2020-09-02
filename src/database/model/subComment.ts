/**
 * https://m.weibo.cn/comments/hotFlowChild?cid=4542209611793878&max_id=0&max_id_type=0 to get the subComment, the cid is the id of parent comment
 */
import { Document, Model, model, Types, Schema, Query } from "mongoose";
import { userSchema, IUser } from "./user";

export interface ISubComment extends Document {
  _id:string,
  id: string; //id for subComment
  mid: string; //id for subComment
  rootid: string; //id for parent comment
  rootidstr: string; //id for parent comment
  floorNumber: number;
  text: string; // unicode and html
  maxId: string;
  totalNumber: number; // the number of sub comments shown on client
  user: IUser["_id"];
  likeCount: number;
}

export const subCommentSchema = new Schema({
  _id:{ type: String, unique: true, required: true },
  id: { type: String, unique: true, required: true }, //id for subComment
  mid: { type: String, unique: true, required: true }, //id for subComment
  rootid: { type: String, unique: true, required: true }, //id for parent comment
  rootidstr: String, //id for parent comment
  floorNumber: Number,
  text: String, // unicode and html
  maxId: String,
  totalNumber: Number, // the number of sub comments shown on client
  user: { type: Number, required: true },
  likeCount: Number,
});

const SubComment:Model<ISubComment> = model("SubComment", subCommentSchema)

export default SubComment;
