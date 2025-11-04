const Agent = require("../model/addorgnization");

const getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.find().populate("admin", "name email role");
    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: "Error fetching agents" });
  }
};

const getAgentById = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id).populate(
      "admin",
      "name email role"
    );
    if (!agent) return res.status(404).json({ message: "Agent not found" });
    res.json(agent);
  } catch (error) {
    res.status(500).json({ message: "Error fetching agent" });
  }
};

const updateAgent = async (req, res) => {
  try {
    const updatedData = { ...req.body };

    if (req.file) {
      updatedData.attachments = [req.file.path];
    }

    const agent = await Agent.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });

    if (!agent) return res.status(404).json({ message: "Agent not found" });

    res.json({ message: "Agent updated successfully", agent });
  } catch (error) {
    res.status(500).json({ message: "Error updating agent" });
  }
};

const deleteAgent = async (req, res) => {
  try {
    const agent = await Agent.findByIdAndDelete(req.params.id);
    if (!agent) return res.status(404).json({ message: "Agent not found" });
    res.json({ message: "Agent deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting agent" });
  }
};

module.exports = {
  getAllAgents,
  getAgentById,
  updateAgent,
  deleteAgent,
};
