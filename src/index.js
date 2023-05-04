const express = require("express");
const expressApp = require("./express-app");
const { PORT } = require("./config");
const { openWebSocket } = require("./utils");
const { databaseConnection } = require("./database");

const startServer = async () => {
  const app = express();

  // Websocket Connection
  await openWebSocket();

  // Database Connection
  await databaseConnection();

  // Init App
  await expressApp(app);

  app
    .listen(PORT, () => {
      console.log(`Example app listening at http://localhost:${PORT}`);
    })
    .on("error", (err) => {
      console.log(err);
    });
};

startServer();
