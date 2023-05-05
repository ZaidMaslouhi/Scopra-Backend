const mongoose = require("mongoose");

const monitorSchema = new mongoose.Schema({
  taskId: {
    type: String,
    required: true,
  },
  uri: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Monitor", monitorSchema);
