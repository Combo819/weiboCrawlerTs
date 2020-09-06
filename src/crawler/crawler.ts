import crawlerWeibo from "./crawlers/crawlerWeibo";
import crawlerComment from "./crawlers/crawlerComment";
import downloadImage from "./downloader/image";
import { staticPath } from "../config";
import downloadVideo from "./downloader/video";
import { q } from "./queue";
async function startCrawler(weiboId: string): Promise<any> {
  try {
    const weiboDoc = await crawlerWeibo(weiboId);
    const { pics, pageInfo } = weiboDoc;
    q.pause();
    if (pics) {
      pics.forEach((element: any) => {
        downloadImage(element.large.url, staticPath);
      });
    } else if (pageInfo) {
      const { mp4720PMp4, mp4HdMp4, mp4LdMp4 } = pageInfo.urls;
      const videoUrl = [mp4720PMp4, mp4HdMp4, mp4LdMp4].find(ele=>typeof ele ==='string');
      downloadVideo(videoUrl,staticPath);
    }
    crawlerComment(weiboDoc, weiboId);
  } catch (err) {
    throw err;
  }
}

export { startCrawler };
