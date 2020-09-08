import cheerio from "cheerio";
import { getWeiboApi } from "../../request";
import { WeiboModel } from "../../database";
import camelcaseKeys from "camelcase-keys";
import { IWeibo } from "../../database/model/weibo";
import { saveUser } from "./saveUser";
import downloadImage from '../downloader/image';
import downloadVideo from '../downloader/video';
import {staticPath} from '../../config';
import { q } from "../queue";

async function crawlerWeibo(weiboId: string): Promise<IWeibo> {
  let weiboDoc: IWeibo | null;
  try {
    const res = await getWeiboApi(weiboId);
    //console.log(res);
    const $ = cheerio.load(res.data);
    let renderText:string
    try{
      renderText = $("script").get()[1].children[0].data;
    }catch(err){
      console.log(`the weibo doesn't exist or token expired`);
      throw err;
    }
    const renderData = Function(renderText + " return $render_data")();
    const status = camelcaseKeys(renderData.status, { deep: true });
    const resDoc: IWeibo | null = await saveWeibo(status);
    saveUser(status.user);
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
      pics,
      pageInfo,
    } = status;
    let weiboDoc: IWeibo = new WeiboModel({
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
      pics,
      comments: [],
      pageInfo,
    });
    q.pause();
    if (pics && pics.length > 0) {
      pics.forEach((element: any) => {
        downloadImage(element.large.url, staticPath);
      });
    }
    if (pageInfo) {
      
      const { mp4720PMp4, mp4HdMp4, mp4LdMp4 } = pageInfo.urls;
      const videoUrl = [mp4720PMp4, mp4HdMp4, mp4LdMp4].find(
        (ele) => typeof ele === "string"
      );
      pageInfo.url = videoUrl;
      downloadVideo(videoUrl, staticPath);
    }

    weiboDoc.save((err) => {
      if (err) {
        reject(err);
      }
      resolve(weiboDoc);
    });
  });
}

export default crawlerWeibo;
