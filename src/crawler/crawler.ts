import crawlerWeibo from "./crawlers/crawlerWeibo";
import crawlerComment from './crawlers/crawlerComment';
async function startCrawler(weiboId: string): Promise<any> {
  //connectDB();
  try {
    const weiboDoc = await crawlerWeibo(weiboId);
    crawlerComment(weiboDoc,weiboId);
  } catch (err) {
    throw err;
  }
}

export { startCrawler };
