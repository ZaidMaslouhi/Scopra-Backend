const express = require("express");
const cors = require("cors");
const monitors = require("./api/monitors");

module.exports = async (app) => {
  //Middlewares
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.static(`${__dirname}/public`));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));

  //Api
  monitors(app);

  //Error
  // app.use(HandleErrors);
};