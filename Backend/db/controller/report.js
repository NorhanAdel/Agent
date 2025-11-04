const Report = require("../model/report");
const Activity = require("../model/activity");

exports.addReport = async (req, res) => {
  try {
    const { activityId, content } = req.body;
    const report = new Report({
      activity: activityId,
      content,
      createdBy: req.user.id,
    });
    await report.save();
    res.status(201).json({ message: "Report added successfully", report });
  } catch (error) {
    res.status(500).json({ message: "Error adding report", error });
  }
};

exports.getReportsByActivity = async (req, res) => {
  try {
    const { activityId } = req.params;
    const reports = await Report.find({ activity: activityId })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reports", error });
  }
};
