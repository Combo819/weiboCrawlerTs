import { getCommentApi } from "../request";
import { q } from "./queue";
import { CommentModel, IComment, IWeibo, WeiboModel } from "../database";
import camelcaseKeys from "camelcase-keys";
import crawlerSubComments from "./crawlerSubComment";
import {saveUser} from './saveUser';
import {map} from 'async'

interface commentParams {
  weiboDoc: IWeibo;
  id: string;
  mid?: string | undefined;
  maxId?: string | undefined;
  maxIdType?: number | undefined;
}

export default function crawlerComment(
  weiboDoc: IWeibo,
  weiboId: string
): void {
  const firstCommentParams: commentParams = {
    weiboDoc,
    id: weiboId,
  };
  console.log(q.length(),'q.length',q.running(),'q.running','in first crawler   comment')
  q.push([{ func, params: firstCommentParams }]);
}

const iteratee = (item:any,callback:any):void=>{
  const {
    id,
    mid,
    rootid,
    rootidstr,
    floorNumber,
    text,
    maxId,
    totalNumber,
    user,
    likeCount,
    createdAt,
  } = item;
  const commentDoc: IComment = new CommentModel({
    _id: id,
    id,
    mid,
    rootid,
    rootidstr,
    floorNumber,
    text,
    maxId,
    totalNumber,
    user: user.id,
    likeCount,
    createdAt,
    subComments: [],
  });
  commentDoc.save((err, product) => {
    callback();
    if (err&&err.code!==11000) {
      console.log(err, "err");
    }
    saveUser(user)
    crawlerSubComments(commentDoc);
  });
}

const func = (params: commentParams): Promise<any> => {
  return new Promise((resolve, reject) => {
    const { weiboDoc, id, mid, maxId, maxIdType } = params;
    getCommentApi(id, maxId, mid, maxIdType)
      .then( async (res) => {
        // console.log(res, "res in getting comment");
        if (!res.data.data) {
          resolve();
          return;
        }
        const { data, maxId, maxIdType } = camelcaseKeys(res.data.data, {
          deep: true,
        });
       
        /* data.forEach((element: any) => {
          const {
            id,
            mid,
            rootid,
            rootidstr,
            floorNumber,
            text,
            maxId,
            totalNumber,
            user: { id: userId },
            likeCount,
            createdAt,
          } = element;
          const commentDoc: IComment = new CommentModel({
            _id: id,
            id,
            mid,
            rootid,
            rootidstr,
            floorNumber,
            text,
            maxId,
            totalNumber,
            user: userId,
            likeCount,
            createdAt,
            subComments: [],
          });
          commentDoc.save((err, product) => {
            if (err&&err.code!==11000) {
              console.log(err, "err");
            }
            crawlerSubComments(commentDoc);
          });
        }); */
        await map(data,iteratee);
        const newComments: string[] = data.map((item: any) => item.id);
        weiboDoc.comments.addToSet(...newComments);
        weiboDoc.isNew = false;
        weiboDoc.save((err) => {
          if (err&&err.code!==11000) {
            console.log("error in updating weiboDoc" + weiboDoc.id);
          }
        });
        if (Number(maxId) !== 0) {
          console.log(q.length(),'q.length',q.running(),'q.running','in 2 or more crawler comment')
          q.push([
            { func: func, params: { weiboDoc, id, mid, maxId, maxIdType } },
          ]);
        }
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
};
