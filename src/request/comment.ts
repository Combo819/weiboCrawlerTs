import { crawlerAxios } from "./config";
import { AxiosPromise } from "axios";

/**
 *
 * @param id the id of the weibo
 * @param maxId the max id of the comment request. not specified if it's the first request to fetch the comment
 * @param mid same as max_id as I observe
 * @param maxIdType always 0 as I observe
 */
function getCommentApi(
  id: string,
  maxId?: string | undefined,
  mid?: string | undefined,
  maxIdType?: number | undefined
): AxiosPromise {
  return crawlerAxios({
    url: "/comments/hotflow",
    params: {
      id,
      mid: mid || id,
      max_id: maxId,
      max_id_type: maxIdType || 0,
    },
  });
}

export { getCommentApi };
