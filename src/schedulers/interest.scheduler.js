const cron = require('node-cron');
const express = require('express');

const cronExpression = '* * * * * *';

function action() {
  console.log('This cron job will run every second');
}

const job = cron.schedule(cronExpression, action, { scheduled: false });

// hash map to map keys to jobs
// const jobMap: Map<string, cron.ScheduledTask> = new Map();
// const jobGroupsMap: Map<string, cron.ScheduledTask[]> = new Map();
const jobMap = new Map();
const jobGroupsMap = new Map();

// jobs
const metricsJob = cron.schedule(
  '0 0 0 1 * *',
  () => {
    console.log('There are 5 users in the application');
  },
  { scheduled: false }
);

const birthdayJob = cron.schedule(
  '0 0 0 * * *',
  () => {
    console.log('20 users have their birthday today');
  },
  { scheduled: false }
);

// jobs related to auth
const countLoggedInUsersJob = cron.schedule(
  '0 * * * * *',
  () => {
    console.log('There are 100 users currently logged in');
  },
  { scheduled: false }
);

const autoUnbanUsersJob = cron.schedule(
  '0 0 * * * *',
  () => {
    console.log('unbanning users whose ban has expired');
  },
  { scheduled: false }
);

// set the key to map to the job
jobMap.set('metrics', metricsJob);
jobMap.set('birthday', birthdayJob);
jobMap.set('countUsers', countLoggedInUsersJob);
jobMap.set('unbanUsers', autoUnbanUsersJob);

jobGroupsMap.set('default', [metricsJob, birthdayJob]);
jobGroupsMap.set('auth', [countLoggedInUsersJob, autoUnbanUsersJob]);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/start-job', (req, res) => {
  const { jobName } = req.body;
  const job = jobMap.get(jobName);

  if (!job) return res.status(400).json({ message: 'invalid job name' });
  job.start();
  res.status(200).json({ message: `job ${jobName} started successfully` });
});

app.post('/stop-job', (req, res) => {
  const { jobName } = req.body;
  const job = jobMap.get(jobName);

  if (!job) return res.status(400).json({ message: 'invalid job name' });
  job.start();
  res.status(200).json({ message: `job ${jobName} stoppeed successfully` });
});

app.post('/start-job-group', (req, res) => {
  const { groupName } = req.body;
  const jobs = jobGroupsMap.get(groupName);

  if (!jobs) return res.status(400).json({ message: 'invalid group name' });

  jobs.forEach((job) => {
    job.start();
  });

  res.status(200).json({ message: `jobs in group ${groupName} started successfully` });
});

app.post('/stop-job-group', (req, res) => {
  const { groupName } = req.body;
  const jobs = jobGroupsMap.get(groupName);

  if (!jobs) return res.status(400).json({ message: 'invalid group name' });

  jobs.forEach((job) => {
    job.stop();
  });

  res.status(200).json({ message: `jobs in group ${groupName} stopped successfully` });
});

module.exports = {
  job,
};
