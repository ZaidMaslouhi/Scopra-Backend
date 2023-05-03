const cron = require("node-cron");
const { v4: uuidv4 } = require("uuid");
const { Axios } = require("../config");
const { default: redisClient } = require("../redisClient");

// axios.interceptors.request.use((config) => {
//   config.headers["request-startTime"] = process.hrtime();
//   return config;
// });

// axios.interceptors.response.use((response) => {
//   const start = response.config.headers["request-startTime"];
//   const end = process.hrtime(start);
//   const milliseconds = Math.round(end[0] * 1000 + end[1] / 1000000);
//   response.headers["request-duration"] = milliseconds;
//   return response;
// });

async function createCronJob(URI) {
  try {
    const taskId = uuidv4();
    cron.schedule(
      "*/5 * * * * *",
      async (manual) => {
        const response = await axios.head(`https://${URI}`, {
          validateStatus: false,
        });
        const duration = response.headers["request-duration"];
        const cert = response.request.socket.getPeerCertificate();

        const expirationDate =
          Object.keys(cert).indexOf("valid_to") > -1
            ? new Date(cert.valid_to).toLocaleDateString("en-GB")
            : "-";
        const data = {
          task: taskId,
          uri: URI,
          status: `${response.status} ${response.statusText}`,
          response: duration,
          SSLExpiration: expirationDate,
        };

        redisClient.hSet(taskId, Date.now().toString(), JSON.stringify(data));
        redisClient.publish("monitors", JSON.stringify(data));

        // const mine = await redis.hGetAll(job);
        // Object.values(mine).forEach((value) => {
        //   console.log(JSON.parse(value));
        // });
      },
      { name: taskId }
    );

    // cron.getTasks().get(task.options.name).stop;
  } catch (err) {
    console.log("Error..");
    console.error(err);
  }
}

exports.createJob = createCronJob;
