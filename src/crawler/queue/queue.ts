import async,{AsyncQueue} from "async";
import { Q_CONCURRENCY } from "../../config";
import {TimeWindow} from '../../utility/timeWindow'
const { queue } = async;

export interface Task<T> {
  params: T;
  func(params: T): Promise<T>;
}




const worker = (task: Task<Object>, callback: any): void => {
  timeWindow.execute();
  const { params, func } = task;
  func(params)
    .then((res: any) => {
      //console.log(res,'res');
      callback();
    })
    .catch((err: Error) => {
      //console.log(err);
      callback();
    });
};
const q:AsyncQueue<Task<Object>> = queue(worker, Q_CONCURRENCY);

const timeWindow = new TimeWindow(q,30,6);


q.drain(()=>{
  console.log('all items in queue have been processed')
})

export default q;