const cron = require("node-cron");
const { Redis, WSS, MONITORS_CHANNEL } = require("../config");

module.exports.createCronJob = ({
  taskId,
  scheduledTask,
  cronExpression = "*/5 * * * * *",
}) => {
  try {
    cron.schedule(cronExpression, () => scheduledTask(), { name: taskId });

    return taskId;
  } catch (error) {
    console.error(error);
  }
};

module.exports.stopCronJob = ({ taskId }) => {
  try {
    const task = cron.getTasks().get(taskId);

    task.stop();

    return taskId;
  } catch (error) {
    console.error(error);
  }
};

const sendMessageInQueue = ({ connection, message }) => {
  connection.send(message);
};

const subscribeToQueue = async ({ channel }) => {
  try {
    console.log("Channel: " + channel);
    Redis.subscriber.subscribe(channel, (message) => {
      const obj = JSON.parse(message);
      console.log("Send Message in the queue");
      console.log(obj);
      // sendMessageToQueue({ connection, message });
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports.upgradeToWs = () => {
  try {
    WSS.on("connection", (ws) => {
      subscribeToQueue({ channel: MONITORS_CHANNEL });
    });
  } catch (error) {
    console.error(error);
  }
};
