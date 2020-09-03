import { getSubCommentApi } from "../request";
import { q } from "./queue";
import {
  CommentModel,
  IComment,
  ISubComment,
  SubCommentModel,
} from "../database";

import camelcaseKeys from "camelcase-keys";
import { resolve } from "path";
import { reject } from "async";
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
  q.push([{ func, params: firstSubCommentParams }]);
}

function func(params: SubCommentParams): Promise<any> {
  return new Promise((resolve, reject) => {
    const { cid, maxId, maxIdType, commentDoc } = params;
    getSubCommentApi(cid, maxId, maxIdType)
      .then((res) => {
        //console.log(res, "res in crawler subComment");
        const { data, maxId, maxIdType } = camelcaseKeys(res.data, {
          deep: true,
        });
        if (typeof data !== "object") {
          resolve();
          return;
        }
        data.forEach((element: any) => {
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
          } = element;
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
            user: userId,
            likeCount,
          });
          subCommentDoc.save((err, product) => {
            if (err&&err.code!==11000) {
              console.log(err, "err");
            }
          });
        });
        const newSubComments: string[] = data.map((item: any) => item.id);
        commentDoc.subComments.addToSet(...newSubComments);
        commentDoc.isNew = false;
        commentDoc.save((err, product) => {
            if (err&&err.code!==11000) {
              console.log(err,'error in saving commentDoc');
            }
          });
        if (Number(maxId) !== 0) {
          q.push([{ func, params: { commentDoc, cid, maxId, maxIdType } }]);
        }
        resolve();
      })
      .catch((err) => {
        //console.log(err);
        reject(err);
      });
  });
}
