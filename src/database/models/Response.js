const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema({
  monitorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Monitor",
    required: true,
  },
  responseStatus: {
    type: Number,
    required: true,
  },
  responseDuration: {
    type: Number,
    required: true,
  },
  sslExpirationDate: {
    type: Date,
    default: "-",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Response = mongoose.model("Response", responseSchema);

module.exports = Response;
