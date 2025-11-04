const Client = require("../model/client");
const User = require("../model/user");
const Agent = require("../model/addorgnization");

exports.addClient = async (req, res) => {
  try {
    const { id, role, agentId } = req.user;

    if (role !== "agentAdmin") {
      return res.status(403).json({ message: "Access denied" });
    }

    if (!agentId) {
      return res.status(400).json({ message: "Agent ID missing in token" });
    }

    const { name, contactPerson, phone, address, email } = req.body;

    const newClient = new Client({
      name,
      contactPerson,
      phone,
      address,
      email,
      agent: agentId,
    });

    await newClient.save();

    res.status(201).json({
      message: "Client added successfully",
      client: newClient,
    });
  } catch (error) {
    console.error("Error adding client:", error);
    res.status(500).json({
      message: "Error adding client",
      error: error.message,
    });
  }
};


exports.getAllClients = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user || user.role !== "agentAdmin") {
      return res.status(403).json({ message: "Access denied" });
    }
    const clients = await Client.find({ agent: user.agent });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: "Client not found" });
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const updatedClient = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedClient) return res.status(404).json({ message: "Client not found" });
    res.json({ message: "Client updated successfully", client: updatedClient });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const deletedClient = await Client.findByIdAndDelete(req.params.id);
    if (!deletedClient) return res.status(404).json({ message: "Client not found" });
    res.json({ message: "Client deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
