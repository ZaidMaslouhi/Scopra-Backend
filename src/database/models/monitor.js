const mongoose = require("mongoose");

const monitorSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true,
  },
  URI: String,
  status: String,
  responseTime: String,
  ssl: String,
});

module.exports = mongoose.model("monitor", monitorSchema);
