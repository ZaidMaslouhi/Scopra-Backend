const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: String,
  userId: String,
  monitors: [
    {
      name: String,
      monitor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "monitor",
      }
    }
  ],
});

module.exports = mongoose.model("project", projectSchema);
