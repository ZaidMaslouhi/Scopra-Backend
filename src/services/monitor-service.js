const { v4: uuidv4 } = require("uuid");
const { Redis, Axios, MONITORS_CHANNEL } = require("../config");
const { createCronJob, stopCronJob } = require("../utils");
const {MonitorRepository} = require("../database/repository");

class MonitorService {
  constructor() {
    this.repository = new MonitorRepository();
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

    Redis.client.hSet(taskId, Date.now().toString(), JSON.stringify(task));
    Redis.publisher.publish(MONITORS_CHANNEL, JSON.stringify(task));
  };

  async createMonitor({ name, uri }) {
    try {
      // const taskId = uuidv4();
      const taskId = "683713ae-7526-4113-a2c2-8827461ee427";

      createCronJob({
        taskId,
        scheduledTask: () => this.monitorScheduledTask(taskId, uri),
      });

      const newMonitor = await this.repository.CreateNewMonitor({
        taskId,
        uri,
      });

      const addToProject = await this.repository.addMonitorToProject({
        projectId: "64561d3a535f6d501534ade5",
        monitor: newMonitor._id,
        name,
      });

      return { project: addToProject, monitor: newMonitor };
    } catch (error) {
      console.error(error);
    }
  }

  async getMonitorsByUserId({ userId }) {
    try {
      const monitors = await this.repository.FindMonitorsByUserId({ userId });

      return monitors;
    } catch (error) {
      console.error(error);
      // throw new APIError('Data Not found')
    }
  }

  async updateMonitor({ project, monitor }) {
    try {
      const updatedMonitor = this.repository.updateProjectMonitor({
        project: project,
        monitor: monitor,
      });

      return updatedMonitor;
    } catch (error) {
      console.error(error);
    }
  }

  async UnsubscribeMonitor({ projectId, monitorId }) {
    try {
      // const stoppedTask = stopCronJob({ taskId: id });
      const deletedMonitor = this.repository.DeleteMonitorFromProject({
        projectId,
        monitorId,
      });

      return deletedMonitor;
    } catch (error) {
      console.error(error);
      // throw new APIError('Data Not found')
    }
  }

  // async createReponse() {
  //   try {
  //     const response = this.repository.addResponse({
  //       monitor: newMonitor,
  //       status: 200,
  //       duration: 80,
  //       ssl: "05/05/2022",
  //     });

  //     return response;
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }
}

module.exports = MonitorService;
