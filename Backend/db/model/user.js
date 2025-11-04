const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["mainAdmin", "agentAdmin", "employee"],
    default: "employee",
  },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: "Agent", default: null },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
