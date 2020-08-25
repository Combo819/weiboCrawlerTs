import { Document, Model, model, Types, Schema, Query } from "mongoose";

const weiboSchema = Schema({
    id:String,
    mid:String,
    createdId:String,
    text:String,
    textLength:Number,
    picIds:[String],
    repostsCount:String,
    isLongText:Boolean,
    commentsCount:Number,
    attitudesCount:Number,
    userId:Number,
});

export default model("weibo",weiboSchema);

