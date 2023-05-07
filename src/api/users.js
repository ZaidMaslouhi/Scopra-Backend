const { UserService } = require("../services");
const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } = require("../config");

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

      res.cookie("jwt", loggedUser.refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        secure: true,
        sameSite: "None",
      });

      res.status(201).json({ accessToken: loggedUser.accessToken });
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
  app.get("/logout", async (req, res, next) => {
    try {
      const cookies = req.cookies;
      if (!cookies?.jwt) return res.sendStatus(201);

      const refreshToken = cookies.jwt;
      const user = await service.findUserByToken(refreshToken);
      if (!user) {
        res.clearCookie("jwt", {
          httpOnly: true,
          secure: true,
          sameSite: "None",
        });
        return res.sendStatus(204);
      }

      const updateUserToken = await service.updateUserToken({
        user: { id: user._id, token: "" },
      });

      res.clearCookie("jwt", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      });
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  });

  // Update user
  // app.put("/user", async (req, res, next) => {
  //   try {
  //     const { user } = req.body;

  //     const updatedUser = await service.updateUser({ user });

  //     return res.status(200).json(updatedUser);
  //   } catch (error) {
  //     next(error);
  //   }
  // });

  // Refresh Token
  app.get("/refresh", async (req, res, next) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);

    const refreshToken = cookies.jwt;
    const user = await service.findUserByToken(refreshToken);
    if (!user) res.sendStatus(401);

    jwt.verify(refreshToken, REFRESH_TOKEN_KEY, (err, decode) => {
      if (err || user._id.toString() !== decode.user)
        return res.sendStatus(403);
      const accessToken = jwt.sign({ user: user._id }, ACCESS_TOKEN_KEY, {
        expiresIn: "30min",
      });
      res.json({ accessToken });
    });
  });

  // Oauth
  // app.get("/Oauth", async (req, res, next) => {
  //   try {
  //     // const deletedProject = await service.deleteProject({ user, project });

  //     return res.status(200).json({});
  //   } catch (error) {
  //     next(error);
  //   }
  // });
};
