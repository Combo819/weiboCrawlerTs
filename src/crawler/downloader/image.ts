import {downloadImageApi} from '../../request';

function downloadImage(url:string,path:string):void{
    downloadImageApi(url).then(res=>{

    }).catch(err=>{
        
    })
}