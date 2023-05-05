const MonitorService = require("../services/monitor-service");

module.exports = (app) => {
  const service = new MonitorService();

  app.get("/", (req, res, next) => {
    try {
      res.status(200).send("Working good...");
    } catch (error) {
      next(error);
    }
  });

  // Get user's monitors
  app.get("/monitors", async (req, res, next) => {
    try {
      const { user } = req.body;

      const monitors = await service.getMonitorsByUserId({ userId: user.id });

      return res.status(200).json(monitors);
    } catch (error) {
      next(error);
    }
  });

  // Add/Subscribe monitor
  app.post("/monitor", async (req, res, next) => {
    try {
      const { monitor } = req.body;

      const schuduledMonitors = await service.createMonitor({
        name: monitor.name,
        uri: monitor.uri,
      });

      return res.status(200).json(schuduledMonitors);
    } catch (error) {
      next(error);
    }
  });

  // Update Monitor
  app.put("/monitor", async (req, res, next) => {
    try {
      const { project, monitor } = req.body;

      const updatedMonitor = await service.updateMonitor({ project, monitor });

      return res.status(200).json(updatedMonitor);
    } catch (error) {
      next(error);
    }
  });

  // Delete/Unsubscribe Monitor
  app.delete("/monitor", async (req, res, next) => {
    try {
      const { project, monitor } = req.body;

      const deletedMonitor = await service.UnsubscribeMonitor({
        projectId: project.id,
        monitorId: monitor.id,
      });

      return res.status(200).json(deletedMonitor);
    } catch (error) {
      next(error);
    }
  });
};
