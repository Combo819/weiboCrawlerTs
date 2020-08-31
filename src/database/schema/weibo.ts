import { Document, Model, model, Types, Schema, Query } from "mongoose";

const weiboSchema = new Schema({
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
    user:{type:Schema.Types.ObjectId,ref:'User'},
    comments:[{type:Schema.Types.ObjectId,ref:'Comment'}]
});

export default model("Weibo",weiboSchema);

