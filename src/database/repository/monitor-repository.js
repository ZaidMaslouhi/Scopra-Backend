const { default: mongoose } = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;
const {
  MonitorModel,
  ProjectModel,
  UserModel,
  ResponseModel,
} = require("../models");

class MonitorRepository {
  async CreateNewMonitor({ taskId, uri }) {
    try {
      const newMonitor = MonitorModel.create({ taskId, uri });

      return newMonitor;
    } catch (error) {
      console.error(error);
      //   throw new APIError(
      //     "API Error",
      //     STATUS_CODES.INTERNAL_ERROR,
      //     "Unable to Find Product"
      //   );
    }
  }

  async addMonitorToProject({ projectId, monitor, name }) {
    try {
      const project = await ProjectModel.findById(projectId).exec();

      const updatedProject = await ProjectModel.updateOne(
        { _id: project._id },
        {
          $push: {
            monitors: { name, monitor: monitor },
          },
        }
      );

      return updatedProject;
    } catch (error) {
      console.error(error);
    }
  }

  async FindMonitorsByUserId({ userId }) {
    try {
      const user = await UserModel.findById(userId)
        .populate({
          path: "projects",
          populate: { path: "monitors.monitor", model: "Monitor" },
        })
        .exec();

      const monitors = user.projects.map((project) => project.monitors);

      return monitors;
    } catch (error) {
      console.error(error);
    }
  }

  async updateProjectMonitor({ project, monitor }) {
    try {
      const projectMonitors = await ProjectModel.updateOne(
        {
          _id: project.id,
          "monitors.monitor": monitor.id,
        },
        {
          $set: {
            "monitors.$.name": monitor.name,
          },
        }
      );

      console.log(projectMonitors);

      return projectMonitors;
    } catch (error) {
      console.error(error);
    }
  }

  async DeleteMonitorFromProject({ projectId, monitorId }) {
    try {
      const deletedMonitor = await ProjectModel.updateOne(
        {
          _id: projectId,
          "monitors.monitor": monitorId,
        },
        {
          $pull: {
            monitors: { monitor: monitorId },
          },
        }
      );
      return deletedMonitor;
    } catch (error) {
      console.error(error);
      //   throw new APIError(
      //     "API Error",
      //     STATUS_CODES.INTERNAL_ERROR,
      //     "Unable to Find Product"
      //   );
    }
  }

  // async addResponse({ monitor, status, duration, ssl }) {
  //   try {
  //     const response = await ResponseModel.create({
  //       monitorId: monitor._id,
  //       responseStatus: status,
  //       responseDuration: duration,
  //       sslExpirationDate: ssl,
  //     });

  //     return response;
  //   } catch (error) {
  //     console.error(error);
  //     //   throw new APIError(
  //     //     "API Error",
  //     //     STATUS_CODES.INTERNAL_ERROR,
  //     //     "Unable to Find Product"
  //     //   );
  //   }
  // }
}

module.exports = MonitorRepository;
