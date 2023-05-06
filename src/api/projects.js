const { ProjectService } = require("../services");

module.exports = (app) => {
  const service = new ProjectService();

  // Get user's projects
  app.get("/project", async (req, res, next) => {
    try {
      const { user } = req.body;

      const projects = await service.getProjectByUserId({ userId: user.id });

      return res.status(200).json(projects);
    } catch (error) {
      next(error);
    }
  });

  // Add new project
  app.post("/project", async (req, res, next) => {
    try {
      const { user, project } = req.body;

      const newProject = await service.createProject({ project });

      const assignedProject = await service.assignProjectToUser({
        user,
        project: { id: newProject._id },
      });

      return res.status(200).json({ newProject, assignedProject });
    } catch (error) {
      next(error);
    }
  });

  // Update project
  app.put("/project", async (req, res, next) => {
    try {
      const { project } = req.body;

      const updatedProject = await service.updateProject({ project });

      return res.status(200).json(updatedProject);
    } catch (error) {
      next(error);
    }
  });

  // Delete project
  app.delete("/project", async (req, res, next) => {
    try {
      const { user, project } = req.body;

      const deletedProject = await service.deleteProject({ user, project });

      return res.status(200).json(deletedProject);
    } catch (error) {
      next(error);
    }
  });
};
