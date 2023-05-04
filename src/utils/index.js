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

const subscribeToQueue = async ({ channel, connection, monitors }) => {
  try {
    Redis.subscriber.subscribe(channel, (message) => {
      const obj = JSON.parse(message);
      monitors.forEach((monitor) => {
        if (obj.task === monitor) connection.send(message);
      });
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports.openWebSocket = () => {
  try {
    WSS.on("connection", (ws) => {
      ws.on("message", (message) => {
        const monitors = [...JSON.parse(message.toString())];
        subscribeToQueue({
          channel: MONITORS_CHANNEL,
          connection: ws,
          monitors,
        });
      });
    });
  } catch (error) {
    console.error(error);
  }
};
