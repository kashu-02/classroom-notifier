const CronJob = require('cron').CronJob;
const chkclassroom = require('./chkclassroom')

const workerJob = new CronJob({
  cronTime: '* * * * *',
  onTick: function () {
    try {
      chkclassroom()
    } catch(e){
      console.log(e)
    }
  },
  onComplete: function () {
  },
  start: true, //newした後即時実行するかどうか
  timeZone: 'Asia/Tokyo'
});

workerJob.start();
