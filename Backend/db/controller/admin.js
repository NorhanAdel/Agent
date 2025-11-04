const bcrypt = require("bcryptjs");
const User = require("../model/user");
const Agent = require("../model/addorgnization");
const Client = require("../model/client");
const Activity = require("../model/activity");

exports.getAdminStats = async (req, res) => {
  try {
    if (req.user.role !== "mainAdmin")
      return res.status(403).json({ message: "Access denied" });

    const orgs = await Agent.countDocuments();
    const clients = await Client.countDocuments();
    const activities = await Activity.countDocuments();
    const totalAmount = await Activity.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.json({
      orgs,
      clients,
      activities,
      totalAmount: totalAmount[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats", error });
  }
};

exports.getAllAgents = async (req, res) => {
  try {
    if (req.user.role !== "mainAdmin")
      return res.status(403).json({ message: "Access denied" });

    const agents = await Agent.find();
    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: "Error fetching agents", error });
  }
};

exports.addAgent = async (req, res) => {
  try {
    if (req.user.role !== "mainAdmin")
      return res.status(403).json({ message: "Access denied" });

    const { name, email, contactPerson, password, phone, address } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAgent = new Agent({
      name,
      contactPerson,
      phone,
      address,
      email,
    });
    await newAgent.save();

    const newAgentAdmin = new User({
      name,
      email,
      password: hashedPassword,
      role: "agentAdmin",
      agent: newAgent._id,
    });
    await newAgentAdmin.save();

    res.status(201).json({
      message: "Organization and Admin created successfully",
      newAgent,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding organization", error });
  }
};
