import { Document, Model, model, Types, Schema, Query } from "mongoose";
import { IUser } from "./user";
export interface IWeibo extends Document {
  _id:string,
  id: string;
  mid: string;
  createdAt: string;
  text: string;
  textLength: number;
  picIds: Array<string>;
  repostsCount: string;
  isLongText: boolean;
  commentsCount: number;
  attitudesCount: number;
  user: IUser["_id"];
  comments: [{ type: Schema.Types.ObjectId; ref: "Comment" }];
}

const weiboSchema = new Schema({
  _id:{ type: String, unique: true, required: true },
  id: { type: String, unique: true, required: true },
  mid: String,
  createdAt: String,
  text: String,
  textLength: Number,
  picIds: [String],
  repostsCount: String,
  isLongText: Boolean,
  commentsCount: Number,
  attitudesCount: Number,
  user: { type: Number, ref: "User" },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
});

const Weibo: Model<IWeibo> = model("Weibo", weiboSchema);

export default Weibo
