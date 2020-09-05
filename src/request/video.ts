import {downloadAxios} from './config';
import { AxiosPromise } from 'axios';

function downloadVideoApi(url:string):AxiosPromise {
    return downloadAxios({
        url,
        responseType:'stream'
    })
}


export {downloadVideoApi};