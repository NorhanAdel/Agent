const Agent = require("../model/addorgnization");
const User = require("../model/user");
const bcrypt = require("bcryptjs");

exports.addAgent = async (req, res) => {
  try {
    const {
      name,
      bankAccount,
      agentType,
      minimumMoney,
      agentStatus,
      limitedMoney,
      licenseCode,
      email,
      password,
      contactPerson,
      phone,
      address,
    } = req.body;

    if (
      !name ||
      !bankAccount ||
      !agentType ||
      !minimumMoney ||
      !agentStatus ||
      !limitedMoney ||
      !licenseCode ||
      !email ||
      !password ||
      !contactPerson
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(String(password), 10);

    const adminUser = new User({
      name: contactPerson,
      email,
      password: hashedPassword,
      role: "agentAdmin",
    });
    await adminUser.save();

    const agent = new Agent({
      name,
      bankAccount,
      agentType,
      minimumMoney,
      agentStatus,
      limitedMoney,
      licenseCode,
      contactPerson,
      email,
      phone,
      address,
      attachments: req.files ? req.files.map((f) => f.path) : [],
      admin: adminUser._id,
    });
    await agent.save();

    adminUser.agent = agent._id;
    await adminUser.save();

    res.status(201).json({
      message: "Agent created successfully with admin user",
      agent,
      adminUser,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding agent", error: error.message });
  }
};
