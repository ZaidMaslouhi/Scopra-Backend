const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, "email required"],
    unique: [true, "email already registered"],
  },
  password: {
    type: String,
  },
  photoUrl: {
    type: String,
    default: "",
  },
  phoneNumber: {
    type: String,
    default: "",
  },
  source: {
    type: String,
    required: [true, "source not specified"],
  },
  token: {
    type: String,
    default: "",
  },
  projects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
