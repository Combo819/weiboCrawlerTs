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
interface SubCommentParams {
  commentDoc: IComment;
  cid: string;
  maxId?: string | undefined;
  maxIdType?: number | undefined;
}
export default function crawlerSubComments(commentDoc: IComment): void {
  const firstSubCommentParams: SubCommentParams = {
    commentDoc,
    cid: commentDoc.id,
  };
  console.log(q.length(),'q.length',q.running(),'q.running','in first crawler sub comment')
  q.push([{ func, params: firstSubCommentParams }]);
}

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
