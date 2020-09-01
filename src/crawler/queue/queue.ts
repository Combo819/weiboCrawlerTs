import async from "async";
import { Q_CONCURRENCY } from "../../config";
const { queue } = async;

interface Task<T> {
  params: T;
  func(params: T): Promise<T>;
}

const worker = (task: Task<Object>, callback: any): void => {
  const { params, func } = task;
  func(params)
    .then((res: any) => {
      console.log(res);
      callback();
    })
    .catch((err: Error) => {
      console.log(err);
      callback();
    });
};
const q = queue(worker, Q_CONCURRENCY);

export default q;