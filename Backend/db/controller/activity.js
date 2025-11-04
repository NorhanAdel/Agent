const Activity = require("../model/activity");
const User = require("../model/user");

exports.addActivity = async (req, res) => {
  try {
    const { id, role, agentId } = req.user;
    if (role !== "agentAdmin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const {
      title,
      description,
      date,
      amount,
      activityType,
      client,
      status,
      employee,
    } = req.body;

    const activityStatus = status
      ? status
      : new Date(date) < new Date()
      ? "finished"
      : "upcoming";

    const newActivity = new Activity({
      title,
      description,
      date,
      amount,
      activityType,
      client,
      agent: agentId,
      employee,
      status: activityStatus,
    });

    await newActivity.save();

    res.status(201).json({
      message: "Activity created successfully",
      activity: newActivity,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating activity", error: error.message });
  }
};

exports.getAllActivities = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== "agentAdmin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { status } = req.query;
    let filter = { agent: user.agent };
    if (status === "finished") filter.status = "finished";
    if (status === "upcoming") filter.status = "upcoming";

    const activities = await Activity.find(filter)
      .populate("activityType", "name")
      .populate("client", "name")
      .populate("agent", "name")
      .populate("employee", "name")
      .sort({ date: -1 });

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: "Error fetching activities", error });
  }
};

exports.getActivityById = async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await Activity.findById(id)
      .populate("activityType", "name")
      .populate("client", "name")
      .populate("agent", "name")
      .populate("employee", "name");
    if (!activity)
      return res.status(404).json({ message: "Activity not found" });
    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: "Error fetching activity", error });
  }
};

exports.updateActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Activity.findByIdAndUpdate(id, req.body, {
      new: true,
    })
      .populate("activityType", "name")
      .populate("client", "name")
      .populate("agent", "name")
      .populate("employee", "name");
    res.json({ message: "Activity updated successfully", activity: updated });
  } catch (error) {
    res.status(500).json({ message: "Error updating activity", error });
  }
};

exports.deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;
    await Activity.findByIdAndDelete(id);
    res.json({ message: "Activity deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting activity", error });
  }
};


exports.getFilteredActivities = async (req, res) => {
  try {
    const { status, client, employee, range } = req.query;
    const user = await User.findById(req.user.id);
    let filter = {};

    if (user.role === "agentAdmin") filter.agent = user.agent;
    if (user.role === "employee") filter.employee = user._id;

    if (status) filter.status = status;
    if (client) filter.client = client;
    if (employee) filter.employee = employee;

    if (range) {
      const now = new Date();
      let startDate = new Date();

      if (range === "day") startDate.setDate(now.getDate() - 1);
      if (range === "week") startDate.setDate(now.getDate() - 7);
      if (range === "month") startDate.setMonth(now.getMonth() - 1);

      filter.date = { $gte: startDate, $lte: now };
    }

    const activities = await Activity.find(filter)
      .populate("client", "name")
      .populate("employee", "name")
      .populate("activityType", "name")
      .sort({ date: -1 });

    res.status(200).json(activities);
  } catch (error) {
    console.error("Error fetching filtered activities:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
