const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./model/user");

mongoose
  .connect(
    "mongodb+srv://na8111353_db_user:N1234n8@erp-agent.chtf1ky.mongodb.net/ERP-AGENT"
  )
  .then(async () => {
    const hashedPassword = await bcrypt.hash("123456", 10);

    const mainAdmin = new User({
      name: "Main Admin",
      email: "main@admin.com",
      password: hashedPassword,
      role: "mainAdmin",
    });

    await mainAdmin.save();
    console.log("✅ Main Admin added!");
    process.exit();
  })
  .catch((err) => console.error(err));
