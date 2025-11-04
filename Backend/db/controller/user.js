const bcrypt = require("bcryptjs");
const User = require("../model/user");
const Activity = require("../model/activity");
const Client = require("../model/client");

exports.addEmployee = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id).populate("agent");
    if (!admin || admin.role !== "agentAdmin") {
      return res.status(403).json({ message: "Access denied" });
    }
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newEmployee = new User({
      name,
      email,
      password: hashedPassword,
      role: "employee",
      agent: admin.agent ? admin.agent._id : null,
    });
    await newEmployee.save();
    res
      .status(201)
      .json({ message: "Employee added successfully", newEmployee });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding employee", error: error.message });
  }
};

exports.editEmployee = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id).populate("agent");
    if (!admin || admin.role !== "agentAdmin") {
      return res.status(403).json({ message: "Access denied" });
    }
    const { id } = req.params;
    const { name, email, password } = req.body;
    const updateData = { name, email };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    const updatedEmployee = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    }).select("-password");
    if (!updatedEmployee)
      return res.status(404).json({ message: "Employee not found" });
    res
      .status(200)
      .json({ message: "Employee updated successfully", updatedEmployee });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating employee", error: error.message });
  }
};

exports.getEmployeeActivities = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("agent");

    if (!user) {
      return res.status(403).json({ message: "Access denied" });
    }

    let activities = [];

 
    if (user.role === "employee") {
      activities = await Activity.find({ employee: user._id })
        .populate("client", "name")
        .populate("activityType", "name")
        .lean();
    }

    
    else if (user.role === "agentAdmin") {
      activities = await Activity.find({ agent: user.agent })
        .populate("client", "name")
        .populate("activityType", "name")
        .populate("employee", "name")  
        .lean();
    }

 
    else {
      return res.status(403).json({ message: "Access denied" });
    }

    const formatted = activities.map((a) => ({
      _id: a._id.toString(),
      title: a.title,
      description: a.description,
      date: a.date,
      amount: a.amount,
      client: a.client,
      activityType: a.activityType,
      status: a.status,
      employee: a.employee ? a.employee.name : null, 
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching activities",
      err: err.message,
    });
  }
};


exports.getEmployees = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id).populate("agent");
    if (!admin || admin.role !== "agentAdmin") {
      return res.status(403).json({ message: "Access denied" });
    }
    const employees = await User.find({
      role: "employee",
      agent: admin.agent ? admin.agent._id : null,
    }).select("-password");
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employees", error });
  }
};

exports.getEmployeeStats = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const upcoming = await Activity.countDocuments({
      employee: employeeId,
      status: "upcoming",
    });
    const finished = await Activity.countDocuments({
      employee: employeeId,
      status: "finished",
    });
    const clients = await Client.countDocuments({ employee: employeeId });
    const totalAmountAgg = await Activity.aggregate([
      { $match: { employee: req.user._id } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalAmount = totalAmountAgg[0]?.total || 0;
    res.status(200).json({ upcoming, finished, clients, totalAmount });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getEmployeeChart = async (req, res) => {
  try {
    const { period } = req.query;
    const employeeId = req.user.id;
    let startDate = new Date();
    if (period === "month") startDate.setMonth(startDate.getMonth() - 1);
    if (period === "quarter") startDate.setMonth(startDate.getMonth() - 3);
    if (period === "year") startDate.setFullYear(startDate.getFullYear() - 1);
    const data = await Activity.aggregate([
      { $match: { employee: req.user._id, date: { $gte: startDate } } },
      { $group: { _id: { $month: "$date" }, count: { $sum: 1 } } },
      {
        $project: {
          label: { $concat: ["شهر ", { $toString: "$_id" }] },
          count: 1,
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getEmployeesPerformance = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id).populate("agent");
    if (!admin || admin.role !== "agentAdmin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const employees = await User.find({
      role: "employee",
      agent: admin.agent ? admin.agent._id : null,
    });

    const performanceData = await Promise.all(
      employees.map(async (emp) => {
        const upcomingActivities = await Activity.find({
          employee: emp._id,
          status: "upcoming",
        }).select("title _id");

        const finishedActivities = await Activity.find({
          employee: emp._id,
          status: "finished",
        }).select("title _id");

        const totalAmountAgg = await Activity.aggregate([
          { $match: { employee: emp._id } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);

        const totalAmount = totalAmountAgg[0]?.total || 0;

        return {
          _id: emp._id,
          name: emp.name,
          email: emp.email,
          upcomingActivities,
          finishedActivities,
          totalAmount,
        };
      })
    );

    res.status(200).json(performanceData);
  } catch (error) {
    console.error("Error fetching performance data:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllActivitiesByEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const activities = await Activity.find({ employee: id })
      .populate("client", "name")
      .populate("activityType", "name")
      .sort({ date: -1 });
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: "خطأ في جلب الأنشطة", error });
  }
};

exports.globalSearch = async (req, res) => {
  try {
    const { query } = req.query;
    const regex = new RegExp(query, "i");

    const clients = await Client.find({ name: regex }).select("name email");
    const employees = await User.find({ name: regex, role: "employee" }).select(
      "name email"
    );
    const activities = await Activity.find({ title: regex }).select(
      "title description"
    );

    const results = [
      ...clients.map((c) => ({ type: "عميل", ...c._doc })),
      ...employees.map((e) => ({ type: "موظف", ...e._doc })),
      ...activities.map((a) => ({ type: "نشاط", ...a._doc })),
    ];

    res.json(results);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "حدث خطأ أثناء البحث" });
  }
};


exports.deleteEmployee = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id).populate("agent");
    if (!admin || admin.role !== "agentAdmin") {
      return res.status(403).json({ message: "Access denied" });
    }
    const { id } = req.params;
    const employee = await User.findOne({
      _id: id,
      role: "employee",
      agent: admin.agent ? admin.agent._id : null,
    });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    await Activity.deleteMany({ employee: employee._id });
    await User.findByIdAndDelete(employee._id);
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting employee", error: error.message });
  }
};
