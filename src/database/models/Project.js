const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  monitors: [
    {
      name: { type: String, required: true },
      monitor: {
        ref: "Monitor",
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Project", projectSchema);
