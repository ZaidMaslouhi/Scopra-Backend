const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const { users, projects, monitors } = require("./api");
const session = require("express-session");
const passport = require("passport");
const PassportConfig = require("./config/Oauth");

module.exports = async (app) => {
  //Middlewares
  app.use(cors());
  app.use(cookieParser());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.static(`${__dirname}/public`));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(
    session({
      secret: "my_secret_key_here",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false }, // if using HTTPS, set secure to true
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  // Oauth
  PassportConfig();

  //Api
  users(app);
  projects(app);
  monitors(app);

  //Error
  // app.use(HandleErrors);
};
