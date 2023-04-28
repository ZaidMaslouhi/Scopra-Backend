const cron = require("node-cron");
const { default: axios } = require("axios");

axios.interceptors.request.use((config) => {
  config.headers["request-startTime"] = process.hrtime();
  return config;
});

axios.interceptors.response.use((response) => {
  const start = response.config.headers["request-startTime"];
  const end = process.hrtime(start);
  const milliseconds = Math.round(end[0] * 1000 + end[1] / 1000000);
  response.headers["request-duration"] = milliseconds;
  return response;
});

let cronJobs = {};

function createCronJob(job) {
  try {
    const task = cron.schedule("*/5 * * * * *", async () => {
      const response = await axios.head(`https://${job}`);
      const duration = response.headers["request-duration"];
      const cert = response.request.socket.getPeerCertificate();
      const expirationDate = new Date(cert.valid_to).toLocaleDateString(
        "en-GB"
      );
      console.log(
        `${job} | Staus: ${response.status} | Response time: ${duration}ms | SSL expiration: ${expirationDate}`
      );
    });

    // setTimeout(() => {
    //   cron.getTasks().get(task.options.name).stop;
    // }, 20000);

    // cronJobs[jobId] = task;
  } catch (err) {
    console.error(err);
  }
}

exports.createJob = createCronJob;
