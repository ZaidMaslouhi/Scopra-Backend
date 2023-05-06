const cron = require("node-cron");
const { default: axios } = require("axios");
const { default: redisClient } = require("../redisClient");

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

async function createCronJob(job) {
  const redis = await redisClient();
  try {
    const task = cron.schedule("*/5 * * * * *", async () => {
      const response = await axios.head(`https://${job}`, {
        validateStatus: false,
      });
      const duration = response.headers["request-duration"];
      const cert = response.request.socket.getPeerCertificate();

      const expirationDate =
        Object.keys(cert).indexOf("valid_to") > -1
          ? new Date(cert.valid_to).toLocaleDateString("en-GB")
          : "-";
      const data = {
        job: job,
        status: `${response.status} ${response.statusText}`,
        response: duration,
        SSLExpiration: expirationDate,
        // timestamp: new Date.now(),
      };
      // console.log(
      //   `${job} | Staus: ${response.status} ${response.statusText} | Response time: ${duration}ms  | SSL expiration: ${expirationDate}`
      // );

      // redis.rPush(job, JSON.stringify(data));
      redis.hSet(job, Date.now().toString(), JSON.stringify(data));

      // redis.json.arrAppend(job, JSON.stringify(data));
      // const mine = await redis.get(job);
      // console.log(mine);
      // console.log(JSON.parse(mine));
    });

    // setTimeout(() => {
    //   cron.getTasks().get(task.options.name).stop;
    // }, 20000);
  } catch (err) {
    console.log("Error..");
    console.error(err);
  }
}

exports.createJob = createCronJob;
