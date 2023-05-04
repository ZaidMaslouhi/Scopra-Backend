const { MonitorModel } = require("../models");

class MonitorRepository {
  async CreateNewMonitor({ taskId, name, uri }) {
    try {
      MonitorModel.create({ task: taskId, URI: uri });

      return { taskId, name, uri };
    } catch (error) {
      console.error(error);
      //   throw new APIError(
      //     "API Error",
      //     STATUS_CODES.INTERNAL_ERROR,
      //     "Unable to Find Product"
      //   );
    }
  }

  async updateMonitor({ taskId, name, sslExpiry }) {
    try {
      const ids = id;
      return ids;
    } catch (error) {
      console.error(error);
      //   throw new APIError(
      //     "API Error",
      //     STATUS_CODES.INTERNAL_ERROR,
      //     "Unable to Find Product"
      //   );
    }
  }

  async addToMonitor({ taskId, status, duration }) {
    try {
      const ids = id;
      return ids;
    } catch (error) {
      console.error(error);
      //   throw new APIError(
      //     "API Error",
      //     STATUS_CODES.INTERNAL_ERROR,
      //     "Unable to Find Product"
      //   );
    }
  }

  async DeleteMonitor({ taskId }) {
    try {
      const ids = id;
      return ids;
    } catch (error) {
      console.error(error);
      //   throw new APIError(
      //     "API Error",
      //     STATUS_CODES.INTERNAL_ERROR,
      //     "Unable to Find Product"
      //   );
    }
  }

  async FindByUserId({ id }) {
    try {
      const ids = id;
      return ids;
    } catch (error) {
      console.error(error);
      //   throw new APIError(
      //     "API Error",
      //     STATUS_CODES.INTERNAL_ERROR,
      //     "Unable to Find Product"
      //   );
    }
  }
}

module.exports = MonitorRepository;
