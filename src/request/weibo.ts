import {crawlerAxios} from "./config";
import { AxiosPromise } from "axios";

function getWeiboApi(weiboId:string):AxiosPromise{
    return crawlerAxios({
        url:`/detail/${weiboId}`
    })
}

export {getWeiboApi};