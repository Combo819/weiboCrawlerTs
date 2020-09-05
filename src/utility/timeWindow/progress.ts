import ProgressBar from 'progress';

function showProgress(data:any,totalLength:string,fileName:string){
    console.log(`start downloading ${fileName}`)
    const progressBar = new ProgressBar('-> downloading [:bar] :percent :etas', {
        width: 40,
        complete: '=',
        incomplete: ' ',
        renderThrottle: 1,
        total: parseInt(totalLength)
      })
    data.on('data',(chunk:any) => progressBar.tick(chunk.length))
}

export default showProgress;