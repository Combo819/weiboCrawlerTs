import { downloadImageApi } from "../../request";
import { showProgress } from "../../utility/showProgress";
import fs from "fs";
import path from "path";
import { q } from "../queue";

export default function downloadImage(url: string, staticPath: string): void {
  const params: ParamsQueue = {
    url,
    staticPath,
  };
  q.push([{ params, func }]);
}

function func(params: ParamsQueue): Promise<any> {
  const { url, staticPath } = params;
  return new Promise((resolve, reject) => {
    downloadImageApi(url)
      .then((res) => {
        const { data, headers } = res;
        const urlPath = url.split("?")[0];
        if (!fs.existsSync(path.resolve(staticPath, "images"))) {
          fs.mkdirSync(path.resolve(staticPath, "images"));
        }
        const writer = fs.createWriteStream(
          path.resolve(staticPath, "images", path.basename(urlPath))
        );
        showProgress(data, headers["content-length"], path.basename(urlPath));
        data.pipe(writer);
        writer.on("finish", resolve);
        writer.on("error", (err) => {
          console.log(err);
          reject(err);
        });
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
}

interface ParamsQueue {
  url: string;
  staticPath: string;
}
