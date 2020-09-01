import { Document, Model, model, Types, Schema, Query } from "mongoose";
import { IUser } from "./user";
export interface IWeibo extends Document {
  id: string;
  mid: string;
  createdId: string;
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
  id: String,
  mid: String,
  createdId: String,
  text: String,
  textLength: Number,
  picIds: [String],
  repostsCount: String,
  isLongText: Boolean,
  commentsCount: Number,
  attitudesCount: Number,
  user: { type: Schema.Types.ObjectId, ref: "User" },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
});

const Weibo: Model<IWeibo> = model("Weibo", weiboSchema);

export default Weibo
