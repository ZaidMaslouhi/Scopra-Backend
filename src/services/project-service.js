const { ProjectRepository } = require("../database/repository");

class ProjectService {
  constructor() {
    this.repository = new ProjectRepository();
  }

  async getProjectByUserId({ userId }) {
    try {
      const projects = await this.repository.FindProjectsByUserId({ userId });

      return projects;
    } catch (error) {
      console.error(error);
      // throw new APIError('Data Not found')
    }
  }

  async createProject({ project }) {
    try {
      const newProject = await this.repository.CreateNewProject({ project });

      return newProject;
    } catch (error) {
      console.error(error);
      // throw new APIError('Data Not found')
    }
  }

  async assignProjectToUser({ user, project }) {
    try {
      const assignedProject = await this.repository.AssignProjectToUser({
        user,
        project,
      });

      return assignedProject;
    } catch (error) {
      console.error(error);
      // throw new APIError('Data Not found')
    }
  }

  async updateProject({ project }) {
    try {
      const updatedProject = this.repository.UpdateProject({ project });

      return updatedProject;
    } catch (error) {
      console.error(error);
      // throw new APIError('Data Not found')
    }
  }

  async deleteProject({ user, project }) {
    try {
      const deletedUserProject = this.repository.DeleteProjectFromUser({
        user,
        project,
      });

      const deletedProject = this.repository.DeleteProject({ project });

      return {deletedUserProject, deletedProject};
    } catch (error) {
      console.error(error);
      // throw new APIError('Data Not found')
    }
  }
}

module.exports = ProjectService;
