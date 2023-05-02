const express = require("express");
const { createJob } = require("./monitors/createMonitor");
const { createClient } = require("redis");
const app = express();
const port = 3000;

app.get("/", async (req, res) => {
  const { q } = req.query;
  await createJob(q);
  res.send("Hello Redis");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});


