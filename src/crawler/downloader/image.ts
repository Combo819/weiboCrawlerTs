import { downloadImageApi } from "../../request";
import { showProgress } from "../../utility/showProgress";
import fs from "fs";
import path from "path";

export default async function downloadImage(url: string, staticPath: string): Promise<any> {
  try {
    const { data, headers } = await downloadImageApi(url);
    const urlPath = url.split("?")[0];
    const writer = fs.createWriteStream(
      path.resolve(staticPath, "images", path.basename(urlPath))
    );
    showProgress(data, headers["content-length"], path.basename(urlPath));
    data.pipe(writer);
    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  } catch (err) {
    console.log(err);
  }
}
