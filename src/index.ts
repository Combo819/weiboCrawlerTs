import {startCrawler} from './crawler';
import { connectDB } from "./database";
connectDB();
startCrawler();