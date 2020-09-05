import {downloadAxios} from './config';
import { AxiosPromise } from 'axios';

function downloadImageApi(url:string):AxiosPromise {
    return downloadAxios({
        url,
        responseType:'stream'
    })
}


export {downloadImageApi};