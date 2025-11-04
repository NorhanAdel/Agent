const ActivityType = require("../model/activityType");

exports.addActivityType = async (req, res) => {
  try {
    const { name, description } = req.body;
    const activityType = new ActivityType({ name, description });
    await activityType.save();
    res.status(201).json({ message: "Activity type added", activityType });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllActivityTypes = async (req, res) => {
  try {
    const types = await ActivityType.find();
    res.json(types);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateActivityType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const updated = await ActivityType.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );
    res.json({ message: "Activity type updated", updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteActivityType = async (req, res) => {
  try {
    const { id } = req.params;
    await ActivityType.findByIdAndDelete(id);
    res.json({ message: "Activity type deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
