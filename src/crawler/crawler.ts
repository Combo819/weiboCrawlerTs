import axiso from "axios";
import { connectDB } from "../database";
import cheerio from "cheerio";
import {getWeiboApi} from '../request';
import {WEIBO_ID} from '../config'




function startCrawler(): void {
  //connectDB();
  getWeiboApi(WEIBO_ID).then(res=>{
    console.log(res);
  }).catch(err=>{
    console.log(err);
  })
}


export {startCrawler}