import { getSubCommentApi } from "../request";
import { q } from "./queue";
import {CommentModel,  IComment}  from "../database";

import camelcaseKeys from "camelcase-keys";
import { resolve } from "path";
import { reject } from "async";
interface SubCommentParams {
    cid: string;
    maxId?: string | undefined;
    maxIdType?: number | undefined;
  }
function crawlerSubComments(commentDoc:IComment):void{
    const firstSubCommentParams: SubCommentParams = {
        cid:commentDoc.id,
      };
      q.push([{ func, params: firstSubCommentParams }]);
}

function func(params:SubCommentParams):Promise<any>{
    return new Promise((resolve,reject)=>{
        const {cid,maxId,maxIdType} = params;
        getSubCommentApi(cid,maxId,maxIdType).then(res=>{
            const {data,maxId,maxIdType} = camelcaseKeys(res.data,{deep:true}) ;
            data.forEach((element:any) => {
                const {} = element;
            });
        }).catch(err=>{
            console.log(err)
        })
    })
}