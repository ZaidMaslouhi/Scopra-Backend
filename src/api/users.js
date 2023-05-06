const { UserService } = require("../services");

module.exports = (app) => {
  const service = new UserService();

  // Login the user
  app.post("/login", async (req, res, next) => {
    try {
      const { user } = req.body;
      if (!user || !user.email || !user.password) {
        res.status(400).json({
          message: "Email and Password are required.",
        });
      }

      const loggedUser = await service.loginUser({ user });
      if (!loggedUser) return res.sendStatus(401);

      res.status(201).json({
        success: `${loggedUser.username} is logged in!`,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
      next(error);
    }
  });

  // Register new user
  app.post("/register", async (req, res, next) => {
    try {
      const { user } = req.body;
      if (!user || !user.email || !user.password) {
        res.status(400).json({
          message: "Email and Password are required.",
        });
      }

      const newUser = await service.createUser({ user });

      res.status(201).json({
        success: `New user ${newUser.username} created.`,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
      next(error);
    }
  });

  // Logout user
  app.post("/logout", async (req, res, next) => {
    try {
      const { user } = req.body;

      const loggedOffUser = await service.logoutUser({ user });

      return res.status(200).json(loggedOffUser);
    } catch (error) {
      next(error);
    }
  });

  // Update user
  app.put("/user", async (req, res, next) => {
    try {
      const { user } = req.body;

      const updatedUser = await service.updateUser({ user });

      return res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  });

  // Oauth
  app.get("/Oauth", async (req, res, next) => {
    try {
      // const deletedProject = await service.deleteProject({ user, project });

      return res.status(200).json({});
    } catch (error) {
      next(error);
    }
  });
};
