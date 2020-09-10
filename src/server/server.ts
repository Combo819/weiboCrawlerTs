import { startCrawler } from "../crawler";
import { WeiboModel, IWeibo, CommentModel, IComment, UserModel } from "../database";
import { port } from "../config";
import express from "express";
import cors from 'cors';

function startServer(): void {
  interface ResponseBody {
    status: "success" | "error";
  }
  const app = express();
  app.use(express.urlencoded());
  app.use(express.json());
  app.use(cors());
  app.post("/api/save", (request, response) => {
    const { weiboId }: { weiboId: string } = request.body;
    console.log(weiboId,'weiboId')
    startCrawler(weiboId)
      .then((res) => {
        const resBody: ResponseBody = { status: "success" };
        response.send(resBody);
      })
      .catch((err) => {
        const resBody: ResponseBody = { status: "error" };
        response.send(resBody);
      });
  });

  app.get("/api/weibos", (request, response) => {
    const page: string = (request.query.page || 0) as string;
    const pageSize: string = (request.query.pageSize || 10) as string;
    WeiboModel.find({})
      .limit(parseInt(pageSize))
      .skip(parseInt(pageSize) * parseInt(page))
      .populate("user")
      .populate({ path: "comments", limit: 3 })
      .exec(async (err, res) => {
        if (err) {
          throw err;
        }
        const totalNumber = await WeiboModel.estimatedDocumentCount().exec();
        response.send({ weibo: res, totalNumber });
      });
  });

  app.get("/api/weibo/:weiboId", (request, response) => {
    const { weiboId } = request.params;
    const page: string = (request.query.page || 0) as string;
    const pageSize: string = (request.query.pageSize || 10) as string;
    WeiboModel.findById(weiboId)
      .populate({ path: "user" })
      .populate({
        path: "comments",
        limit: parseInt(pageSize),
        skip: parseInt(page) * parseInt(pageSize),
        populate: { path: "user",model:UserModel },
      })
      .exec(async (err, res) => {
        if (err) {
          throw err;
        }
        const weibo: IWeibo | null = await WeiboModel.findById(weiboId).exec();
        response.send({ weibo: res, totalNumber: weibo && weibo.comments.length });
      });
  });



  app.get("/api/comments/:weiboId", (request, response) => {
    const { weiboId } = request.params;
    const page: string = (request.query.page || 0) as string;
    const pageSize: string = (request.query.pageSize || 10) as string;
    WeiboModel.findById(weiboId)
      .populate({ path: "user" })
      .populate({
        path: "comments",
        sort:{likeCount:-1},
        limit: parseInt(pageSize),
        skip: parseInt(page) * parseInt(pageSize),
        populate: { path: "user",model:UserModel },
      })
      .exec(async (err, res) => {
        if (err) {
          throw err;
        }
        const weibo: IWeibo | null = await WeiboModel.findById(weiboId).exec();
        response.send({ comments: res&&res.comments, totalNumber: weibo && weibo.comments.length });
      });
  });

  app.get("/api/comment/:commentId", (request, response) => {
    const { commentId } = request.params;
    const page: string = (request.query.page || 0) as string;
    const pageSize: string = (request.query.pageSize || 10) as string;
    CommentModel.findById(commentId)
      .populate({ path: "user",model:UserModel })
      .populate({
        path: "subComments",
        limit: parseInt(pageSize),
        skip: parseInt(page) * parseInt(pageSize),
        populate: [{ path: "user",model:UserModel },{path:'rootid',model:CommentModel}],
      })
      .exec(async (err, res) => {
        if (err) {
          throw err;
        }
        const comment: IComment | null = await CommentModel.findById(
          commentId
        ).exec();
        response.send({
          comment: res,
          totalNumber: comment && comment.subComments.length,
        });
      });
  });

  app.listen(port || 5000, () => {
    console.log(`listening on port ${port || 5000}`);
  });
}

export default startServer;
