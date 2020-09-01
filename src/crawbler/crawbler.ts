import axiso from "axios";
import {connectDB} from '../database';

connectDB();
const cheerio = require("cheerio");

interface Headers {
  Cookies: String;
  "User-Agent": String;
}
const token: String = "";
const header: Headers = {
  Cookies: token,
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36",
};

