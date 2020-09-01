import { getCommentApi } from "../request";
import { q } from "./queue";
import { CommentModel, IComment, IWeibo } from "../database";
import camelcaseKeys from "camelcase-keys";

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
  q.push([{ func, params: firstCommentParams }]);
}

const func = (params: commentParams): Promise<any> => {
  return new Promise((resolve, reject) => {
    const { weiboDoc, id, mid, maxId, maxIdType } = params;
    getCommentApi(id, maxId, mid, maxIdType)
      .then((res) => {
        console.log(res, "res in getting comment");
        if (!res.data.data) {
          resolve();
          return;
        }
        const { data, maxId, maxIdType } = camelcaseKeys(res.data.data, {
          deep: true,
        });
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
            if (err) {
              console.log(err, "err");
            }
          });
        });
        const { comments: commentsArr } = weiboDoc;
        const newComments: string[] = data.map((item: any) => item.id);
        weiboDoc.comments = [...new Set([...commentsArr, ...newComments])];
        weiboDoc.save();
        if (Number(maxId) !== 0) {
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
