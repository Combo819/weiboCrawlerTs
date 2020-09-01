import {startCrawler} from './crawler';
import { connectDB } from "./database";
import { WEIBO_ID } from "./config";
connectDB();
startCrawler(WEIBO_ID);