import {AsyncQueue} from 'async'
import {Task} from '../../crawler'


export default class TimeWindow{
    private q: AsyncQueue<Task<Object>>;
    private processingItems:number;
    private timeLength:number;
    private maxItems:number;

    constructor(q: AsyncQueue<Task<Object>>,timeLength:number,maxItems:number){
        this.q =q;
        this.processingItems = 0;
        this.timeLength = timeLength*1000;
        this.maxItems = maxItems;
    }
    
    execute():void{
        this.increase();
        setTimeout(() => {
            this.decrease();
        }, this.timeLength);
    }
    private increase():void{
        this.processingItems=this.processingItems+1;
        console.log('q increase',this.processingItems,this.maxItems)
        if(this.processingItems>this.maxItems){
            console.log('q pause')
            this.q.pause();
        }
    }
    private decrease():void{
        this.processingItems = this.processingItems-1;
        console.log('q decrease',this.processingItems,this.maxItems)
        if(this.processingItems<=this.maxItems){
            console.log('q resume')
            this.q.resume();
        }
    }

}