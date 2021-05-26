const CronJob = require('cron').CronJob;
const chkclassroom = require('./chkclassroom')

let starttime
let endtime

const workerJob = new CronJob({
  cronTime: '* * * * *',
  onTick: function () {
    console.log("スタート")
    try {
      starttime = process.hrtime()
      chkclassroom()
    } catch(e){
      console.log(e)
    }
  },
  onComplete: function () {
    endtime = process.hrtime(starttime)
    console.info('Execution time (hr): %ds %dms', endtime[0], endtime[1] / 1000000)
    console.log('onComplete!')
  },
  start: true, //newした後即時実行するかどうか
  timeZone: 'Asia/Tokyo'
});

workerJob.start();