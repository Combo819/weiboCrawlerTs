
import path from 'path';
const fs = require('fs');
if(!fs.existsSync(path.resolve(__dirname, 'credential.json'))){
  throw new Error('You should write a src/credential.json to store the token');
}
const rawData:string = fs.readFileSync(path.resolve(__dirname, 'credential.json')).toString('utf-8');

const URI: string = "mongodb://localhost:27017/weiboCrawler"; //mongoDB uri
const BASE_URL: string = "https://m.weibo.cn";
const Q_CONCURRENCY: number = 1;
const WEIBO_ID = "4544018355331305";
const token: string = JSON.parse(rawData).token ;
if(!token){
  throw new Error(`The token doesn't exist. Add a token to the src/credential`)
}
console.log(token);
export { token, URI, BASE_URL, Q_CONCURRENCY, WEIBO_ID };
