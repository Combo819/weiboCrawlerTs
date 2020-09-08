import crawlerWeibo from "./crawlers/crawlerWeibo";
import crawlerComment from "./crawlers/crawlerComment";
import downloadImage from "./downloader/image";
import { staticPath } from "../config";
import downloadVideo from "./downloader/video";

async function startCrawler(weiboId: string): Promise<any> {
  try {
    const weiboDoc = await crawlerWeibo(weiboId);
    const { pics, pageInfo } = weiboDoc;
  

    crawlerComment(weiboDoc, weiboId);
  } catch (err) {
    throw err;
  }
}

export { startCrawler };
