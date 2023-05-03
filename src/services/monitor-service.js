const { v4: uuidv4 } = require("uuid");
const { Redis, Axios, MONITORS_CHANNEL } = require("../config");
const { createCronJob, stopCronJob, upgradeToWs } = require("../utils");
const MonitorRepository = require("../database/repository/monitor-repository");

class MonitorService {
  constructor() {
    this.repository = new MonitorRepository();
  }

  async getMonitorsByID(monitorIds) {
    try {
      const verifiedMonitors = [];
      monitorIds.forEach(async (id) => {
        const monitor = await this.repository.FindById(id);
        verifiedMonitors.push(monitor);
      });

      return verifiedMonitors;
    } catch (error) {
      console.error(error);
      // throw new APIError('Data Not found')
    }
  }

  async stopMonitor({ id }) {
    try {
      // const monitor = await this.repository.FindById(id);

      const stoppedTask = stopCronJob({ taskId: id });

      return stoppedTask;
    } catch (error) {
      console.error(error);
      // throw new APIError('Data Not found')
    }
  }

  monitorScheduledTask = async (taskId, URI) => {
    const response = await Axios.head(URI, {
      validateStatus: false,
    });

    const duration = response.headers["request-duration"];
    const cert = response.request.socket.getPeerCertificate();
    const expirationDate =
      Object.keys(cert).indexOf("valid_to") > -1
        ? new Date(cert.valid_to).toLocaleDateString("en-GB")
        : "-";

    const task = Object.freeze({
      task: taskId,
      uri: URI,
      status: `${response.status} ${response.statusText}`,
      response: duration,
      SSLExpiration: expirationDate,
    });

    // client.hSet(taskId, Date.now().toString(), JSON.stringify(data));
    Redis.publisher.publish(MONITORS_CHANNEL, JSON.stringify(task));
  };

  async createMonitor({ name, URI }) {
    try {
      const taskId = uuidv4();

      createCronJob({
        taskId,
        scheduledTask: () => this.monitorScheduledTask(taskId, URI),
      });

      const newMonitor = this.repository.CreateNewMonitor({
        taskId,
        name,
        URI,
      });

      upgradeToWs();

      return newMonitor;
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = MonitorService;
