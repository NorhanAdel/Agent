 
const User = require("../model/user");
const Agent = require("../model/addorgnization");
const Client = require("../model/client");
const Activity = require("../model/activity");
exports.getAnalyticsData = async (req, res) => {
  try {
    const activeAgents = await Agent.countDocuments({ agentStatus: "active" });
    const inactiveAgents = await Agent.countDocuments({
      agentStatus: { $ne: "active" },
    });

 
    const activities = await Activity.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

 
    const totalAmounts = await Activity.aggregate([
      {
        $group: {
          _id: "$agent",
          total: { $sum: "$amount" },
        },
      },
    ]);

    res.status(200).json({
      activeAgents,
      inactiveAgents,
      activities,
      totalAmounts,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching analytics", error: err });
  }
};
