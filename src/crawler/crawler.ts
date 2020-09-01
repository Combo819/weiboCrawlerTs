import crawlerWeibo from "./crawlerWeibo";
import crawlerComment from './crawlerComment';
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
