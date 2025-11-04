const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contactPerson: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    bankAccount: { type: String, required: true },
    agentType: {
      type: String,
      enum: ["تجارة", "خدمات", "صناعة", "تسويق", "أخرى"],
      required: true,
    },
    minimumMoney: { type: Number, required: true },
    limitedMoney: { type: Number, required: true },
    licenseCode: { type: String, required: true },
    agentStatus: {
      type: String,
      enum: ["active", "suspended", "pending"],
      default: "pending",
    },
    attachments: [{ type: String }],
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

const Agent = mongoose.model("Agent", agentSchema);
module.exports = Agent;
