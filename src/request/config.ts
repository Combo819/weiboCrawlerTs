import axios, { AxiosInstance } from "axios";
import {token,BASE_URL} from '../config';

interface Headers {
  Cookie: String;
  "User-Agent": String;
}

const header: Headers = {
  Cookie: token,
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36",
};

const crawlerAxios:AxiosInstance = axios.create({
    baseURL:BASE_URL,
    headers:header
});

export {crawlerAxios};


