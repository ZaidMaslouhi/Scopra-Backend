const express = require("express");
const { createJob } = require("./monitors/createMonitor");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  const { q } = req.query;
  createJob(q);
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
