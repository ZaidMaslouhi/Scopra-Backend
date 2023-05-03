const express = require("express");
const expressApp = require("./express-app");
const { PORT } = require("./config");

const startServer = async () => {
  const app = express();

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
