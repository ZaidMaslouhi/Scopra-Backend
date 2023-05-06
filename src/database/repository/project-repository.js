const { default: mongoose } = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;
const { MonitorModel, ProjectModel, UserModel } = require("../models");

class ProjectRepository {
  async FindProjectsByUserId({ userId }) {
    try {
      const user = await UserModel.findById(userId).populate("projects").exec();

      return user.projects;
    } catch (error) {
      console.error(error);
    }
  }

  async CreateNewProject({ project }) {
    try {
      const newProject = ProjectModel.create({ name: project.name });

      return newProject;
    } catch (error) {
      console.error(error);
      //   throw new APIError(
      //     "API Error",
      //     STATUS_CODES.INTERNAL_ERROR,
      //     "Unable to Find Product"
      //   );
    }
  }

  async AssignProjectToUser({ user, project }) {
    try {
      const assignedProject = await UserModel.updateOne(
        { _id: user.id },
        {
          $push: {
            projects: project.id,
          },
        }
      );

      return assignedProject;
    } catch (error) {
      console.error(error);
    }
  }

  async UpdateProject({ project }) {
    try {
      const updatedProject = await ProjectModel.updateOne(
        { _id: project.id },
        { name: project.name }
      );

      return updatedProject;
    } catch (error) {
      console.error(error);
    }
  }

  async DeleteProject({ project }) {
    try {
      const deletedProject = await ProjectModel.deleteOne({ _id: project.id });

      return deletedProject;
    } catch (error) {
      console.error(error);
      //   throw new APIError(
      //     "API Error",
      //     STATUS_CODES.INTERNAL_ERROR,
      //     "Unable to Find Product"
      //   );
    }
  }

  async DeleteProjectFromUser({ user, project }) {
    try {
      const deletedUserProject = await UserModel.updateOne(
        { _id: user.id },
        {
          $pull: { projects: project.id },
        }
      );

      return deletedUserProject;
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

module.exports = ProjectRepository;
