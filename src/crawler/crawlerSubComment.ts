import { getSubCommentApi } from "../request";
import { q } from "./queue";
import {
  IComment,
  ISubComment,
  SubCommentModel,
} from "../database";
import camelcaseKeys from "camelcase-keys";
import { map } from "async";
import { saveUser } from "./saveUser";
/**
 * the params that the func needs in async queue worker
 */
interface SubCommentParams {
  commentDoc: IComment;
  cid: string;
  maxId?: string | undefined;
  maxIdType?: number | undefined;
}

/**
 * starter function that pushes the first sub comment  request of the current comment to the worker of the queue
 * @param commentDoc the parent comment doc of this sub comment
 */
export default function crawlerSubComments(commentDoc: IComment): void {
  const firstSubCommentParams: SubCommentParams = {
    commentDoc,
    cid: commentDoc.id,
  };
  console.log(q.length(),'q.length',q.running(),'q.running','in first crawler sub comment')
  q.push([{ func, params: firstSubCommentParams }]);
}

/**
 * the iteratee for async map function to iterate all sub comments in this batch and save them
 * @param item sub comment item 
 * @param callback 
 */
const iteratee = (item:any,callback:any)=>{
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
  } = item;
  const subCommentDoc: ISubComment = new SubCommentModel({
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
  });
  subCommentDoc.save((err, product) => {
    if(err){
      console.log(err,'err in saving subComments')
    }
    if (err&&err.code!==11000) {
      console.log(err, "err");
    }
    saveUser(user);
    callback();
  });
}

/**
 * the function that will be executed in queue worker that fetches the sub comments
 * @param params the information that we need to request the batch of sub comments
 */
function func(params: SubCommentParams): Promise<any> {
  return new Promise((resolve, reject) => {
    const { cid, maxId, maxIdType, commentDoc } = params;
    getSubCommentApi(cid, maxId, maxIdType)
      .then(async (res) => {
        //console.log(res, "res in crawler subComment");
        const { data, maxId, maxIdType } = camelcaseKeys(res.data, {
          deep: true,
        });
        if (typeof data !== "object") {
          resolve();
          return;
        }
        await map(data,iteratee);
        const newSubComments: string[] = data.map((item: any) => item.id);
        commentDoc.subComments.addToSet(...newSubComments);
        commentDoc.isNew = false;
        commentDoc.save((err, product) => {
            if (err&&err.code!==11000) {
              console.log(err,'error in saving commentDoc');
            }
          });
        if (Number(maxId) !== 0) {
          console.log(q.length(),'q.length',q.running(),'q.running','in 2 or more crawler sub comment')
          q.push([{ func, params: { commentDoc, cid, maxId, maxIdType } }]);
        }
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
}
