const { UserService } = require("../services");
const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } = require("../config");
const passport = require("passport");
const { UserModel } = require("../database/models");

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

  // Google auth
  app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );
  app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    async (req, res) => {
      // Redirect or return JWT token

      const userId = req.user.toString();

      const accessToken = jwt.sign({ user: userId }, ACCESS_TOKEN_KEY, {
        expiresIn: "30min",
      });
      const refreshToken = jwt.sign({ user: userId }, REFRESH_TOKEN_KEY, {
        expiresIn: "1d",
      });
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        secure: true,
        sameSite: "None",
      });

      await UserModel.findByIdAndUpdate(
        { _id: userId },
        { token: refreshToken }
      ).exec();

      res.status(201).json({ accessToken });
    }
  );

  // GitHub auth
  app.get(
    "/auth/github",
    passport.authenticate("github", { scope: ["user:email"] })
  );
  app.get(
    "/auth/github/callback",
    passport.authenticate("github", { failureRedirect: "/login" }),
    async (req, res) => {
      // Redirect or return JWT token

       console.log(req.user);

      const userId = req.user._id;

      
       console.log(userId);
       
       const accessToken = jwt.sign({ user: userId }, ACCESS_TOKEN_KEY, {
        expiresIn: "30min",
      });
      const refreshToken = jwt.sign({ user: userId }, REFRESH_TOKEN_KEY, {
        expiresIn: "1d",
      });
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        secure: true,
        sameSite: "None",
      });

      await UserModel.findByIdAndUpdate(
        { _id: userId },
        { token: refreshToken }
      ).exec();

      res.status(201).json({ accessToken });
    }
  );
};
