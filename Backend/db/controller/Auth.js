const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/user");

(async () => {
  try {
    const existingAdmin = await User.findOne({ role: "mainAdmin" });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await User.create({
        name: "Main Admin",
        email: "admin@system.com",
        password: hashedPassword,
        role: "mainAdmin",
      });
      console.log(
        "Main Admin added successfully (email: admin@system.com, password: admin123)"
      );
    }
  } catch (err) {
    console.error("Error creating main admin:", err);
  }
})();

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign(
      { id: user._id, role: user.role, agentId: user.agent || null },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({ token, role: user.role, agentId: user.agent || null });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
