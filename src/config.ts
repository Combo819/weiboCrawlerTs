import path from "path";
const fs = require("fs");
if (!fs.existsSync(path.resolve(__dirname, "credential.json"))) {
  throw new Error("You should write a src/credential.json to store the token");
}

interface BaseUrl {
  weibo: string;
  image: string;
  video: string;
}

interface ParsedConfigs{
  URI:string,
  token:string,
  email?:string,
  password?:string
}

const rawData: string = fs
  .readFileSync(path.resolve(__dirname, "credential.json"))
  .toString("utf-8");

const parsedConfigs:ParsedConfigs = JSON.parse(rawData);

const URI: string = parsedConfigs.URI; //mongoDB uri

if(!URI){
  throw new Error('You should specify the MongoDB URI as "URI" in src/credential.json')
}

const baseUrl: string = "https://m.weibo.cn";

const Q_CONCURRENCY: number = 1;

const WEIBO_ID = "4544018355331305";

const token: string = parsedConfigs.token;

const staticPath = path.dirname(__dirname+'/static');

if(!fs.existsSync(path)){
  console.log('create folder '+staticPath);
  fs.mkdirSync(staticPath,{ recursive: true });
}

if (!token) {
  throw new Error(`The token doesn't exist. Add a token to the src/credential`);
}

export { token, URI, baseUrl, Q_CONCURRENCY, WEIBO_ID,staticPath };
