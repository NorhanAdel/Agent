const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();
const connectDB = () => {
  mongoose.connect(process.env.MONGO_CONN, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;

  db.on("error", console.error.bind(console, "MongoDB connection error:"));
  db.once("open", () => {
    console.log("Connected to MongoDB");
  });
};

module.exports = connectDB;
