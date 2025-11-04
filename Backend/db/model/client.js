const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contactPerson: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String },
  email: { type: String },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: "Agent", required: true },
});

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
