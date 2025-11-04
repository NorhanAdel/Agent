const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  activityType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ActivityType",
    required: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Agent",
    required: true,
  },
  status: {
    type: String,
    enum: ["upcoming", "finished"],
    default: "upcoming",
  },
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  report: {
    type:String
  }
});

module.exports = mongoose.model("Activity", activitySchema);
