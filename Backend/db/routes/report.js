const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/VerifyToken");
const checkRole = require("../middleware/role");
const { addReport, getReportsByActivity } = require("../controller/report");

router.post(
  "/add-report",
  authMiddleware,
  checkRole(["agentAdmin", "employee"]),
  addReport
);

router.get(
  "/reports/:activityId",
  authMiddleware,
  checkRole(["agentAdmin", "employee"]),
  getReportsByActivity
);

module.exports = router;
