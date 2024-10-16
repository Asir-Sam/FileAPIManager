const schedule = require('node-schedule');

const job = schedule.scheduleJob('*/1 * * * *', () => {
  console.log('Running a scheduled task every minute');
  // Add your scheduled task logic here
});
