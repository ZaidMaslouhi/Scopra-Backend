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

  // Subscribe to the user's monitors
  app.get("/monitors", async (req, res, next) => {
    try {
      const { monitors } = req.body;

      const verifiedMonitors = await service.getMonitorsByID(monitors);

      return res.status(200).json(verifiedMonitors);
    } catch (error) {
      next(error);
    }
  });

  // Add/Subscribe monitor
  app.post("/monitor", async (req, res, next) => {
    try {
      const { monitor } = req.body;

      // Some logic
      const schuduledMonitors = await service.createMonitor({
        name: monitor.name,
        URI: monitor.uri,
      });

      return res.status(200).json(schuduledMonitors);
    } catch (error) {
      next(error);
    }
  });

  // Delete/Unsubscribe Monitor
  app.delete("/monitor", async (req, res, next) => {
    try {
      const { monitor } = req.body;

      const schuduledMonitors = await service.stopMonitor({ id: monitor.id });

      return res.status(200).json(schuduledMonitors);
    } catch (error) {
      next(error);
    }
  });

  // Update Monitor
  app.put("/monitor", async (req, res, next) => {
    try {
      const { monitor } = req.body;

      // Some logic
      // const schuduledMonitors = await service.createMonitor({
      //   name: monitor.name,
      //   URI: monitor.uri,
      // });

      return res.status(200).json(schuduledMonitors);
    } catch (error) {
      next(error);
    }
  });
};
