import axiso from "axios";
import cheerio from "cheerio";
import { getWeiboApi } from "../request";
import { WEIBO_ID } from "../config";
import {
  CommentModel,
  SubCommentModel,
  UserModel,
  WeiboModel,
} from "../database";
import camelcaseKeys from "camelcase-keys";
import { IWeibo } from "../database/model/weibo";

async function crawlerWeibo(weiboId: string): Promise<IWeibo> {
  let weiboDoc: IWeibo | null;
  try {
    const res = await getWeiboApi(weiboId);
    //console.log(res);
    const $ = cheerio.load(res.data);
    const renderText: string = $("script").get()[1].children[0].data;
    const renderData = Function(renderText + " return $render_data")();
    const status = camelcaseKeys(renderData.status, { deep: true });
    const resDoc: IWeibo | null = await saveWeibo(status);
    saveUser(status);
    weiboDoc = resDoc;
  } catch (err) {
    if (err && err.code !== 11000) {
      console.log(err, "err in crawler weibo");
    }
  }
  if (!weiboDoc!) {
    weiboDoc = await WeiboModel.findById(weiboId).exec();
  }
  return weiboDoc!;
}

function saveWeibo(status: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const {
      id,
      mid,
      createdAt,
      picIds,
      text,
      textLength,
      repostsCount,
      isLongText,
      commentsCount,
      attitudesCount,
      user: { id: userId },
    } = status;
    const weiboDoc: IWeibo = new WeiboModel({
      _id: id,
      id,
      mid,
      createdAt,
      picIds,
      text,
      textLength,
      repostsCount,
      isLongText,
      commentsCount,
      attitudesCount,
      user: userId,
      comments: [],
    });
    weiboDoc.save((err) => {
      if (err) {
        reject(err);
      }
      resolve(weiboDoc);
    });
  });
}

function saveUser(status: any) {
  return new Promise((resolve, reject) => {
    const {
      id,
      screenName,
      profileUrl,
      gender,
      followersCount,
      followCount,
      profileImageUrl,
      avatarHd,
    } = status.user;
    const userDoc = new UserModel({
      _id: id,
      id,
      screenName,
      profileUrl,
      gender,
      followersCount,
      followCount,
      profileImageUrl,
      avatarHd,
    });

    userDoc.save(function (err) {
      if (err) {
        reject(err);
      }
      resolve(userDoc);
      // saved!
    });
  });
}

export default crawlerWeibo;
