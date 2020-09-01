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
import { resolve } from "path";
import { reject } from "async";

function startCrawler(): void {
  //connectDB();
  getWeiboApi(WEIBO_ID)
    .then((res) => {
      console.log(res);
      const $ = cheerio.load(res.data);
      const renderText: string = $("script").get()[1].children[0].data;
      const renderData = Function(renderText + " return $render_data")();
      const status = camelcaseKeys(renderData.status, { deep: true });
      saveWeibo(status)
        .then((res) => {
          saveUser(status);
        })
        .catch((err) => {});
    })
    .catch((err) => {
      console.log(err);
    });
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
    const weiboDoc = new WeiboModel({
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
      resolve(`weibo ${id} saved!`);
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
      resolve(`User ${screenName}-${id} saved!`);
      // saved!
    });
  });
}

export { startCrawler };
