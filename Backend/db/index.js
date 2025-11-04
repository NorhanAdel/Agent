const express = require("express");

const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const agentRoutes = require("./routes/orgnization");
const userRouter = require("./routes/auth");
const agent = require("./routes/agents");
const clientRoutes = require("./routes/client");
const activityType = require("./routes/activityType.js");
const activity = require("./routes/activity");
const report = require("./routes/report");
const user = require("./routes/user");
const admin = require("./routes/admin");
const analyticsData = require("./routes/analyticsData");

const app = express();

const ConnectDB = require("./db/config");
dotenv.config();
ConnectDB();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use("/api", agentRoutes);
app.use("/api", userRouter);
app.use("/api", agent);
app.use("/api", clientRoutes);
app.use("/api", activityType);
app.use("/api", activity);
app.use("/api", report);
app.use("/api", user);
app.use("/api", admin);
app.use("/api", analyticsData);


const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
