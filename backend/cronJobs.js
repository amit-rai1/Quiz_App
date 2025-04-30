const cron = require('node-cron');
const moment = require('moment-timezone');
const Question = require('./models/Question'); // Adjust the path based on your directory structure

// Cron job to activate and deactivate tests
cron.schedule('* * * * *', async () => {  // This runs every minute
  const startTime = new Date();
  console.log('Cron job triggered at:', startTime);

  try {
    // Get the current time in Asia/Kolkata timezone
    const currentTimeInAsiaKolkata = moment().tz('Asia/Kolkata');  // Local time in Asia/Kolkata
    console.log('Current Time in Asia/Kolkata:', currentTimeInAsiaKolkata.format('YYYY-MM-DD HH:mm:ss'));

    // Convert the current time to UTC (if your test times are stored in UTC)
    const currentTimeInUTC = currentTimeInAsiaKolkata.clone().utc();
    console.log('Current Time in UTC:', currentTimeInUTC.format('YYYY-MM-DD HH:mm:ss'));

    // 1. Activate tests whose start time has arrived and are not yet active
    const activateTests = await Question.find({
      testStartTime: { $lte: currentTimeInUTC.toDate() },  // Start time has passed
      isActive: false
    });

    for (const test of activateTests) {
      test.isActive = true;  // Activate the test
      await test.save();
      console.log(`Test with ID ${test._id} activated`);
    }

    console.log('Tests activated');

    // 2. Deactivate tests whose end time has passed and are currently active
    const deactivateTests = await Question.find({
      testEndTime: { $lte: currentTimeInAsiaKolkata.toDate() },  // End time has passed
      isActive: true  // Only deactivate tests that are currently active
    });

    for (const test of deactivateTests) {
      test.isActive = false;  // Deactivate the test
      await test.save();
      console.log(`Test with ID ${test._id} deactivated`);
    }

    console.log('Expired tests deactivated');
  } catch (err) {
    console.error('Error checking for test activation/deactivation:', err);
  }

  const endTime = new Date();
  console.log('Cron job finished at:', endTime);
});
