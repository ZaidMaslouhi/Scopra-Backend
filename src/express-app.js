const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const { users, projects, monitors } = require("./api");

module.exports = async (app) => {
  //Middlewares
  app.use(cors());
  app.use(cookieParser());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.static(`${__dirname}/public`));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));

  //Api
  users(app);
  projects(app);
  monitors(app);

  //Error
  // app.use(HandleErrors);
};
