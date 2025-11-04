const express = require("express");
const router = express.Router();
const {
  addActivity,
  getAllActivities,
  getActivityById,
  updateActivity,
  deleteActivity,
  getFilteredActivities,
} = require("../controller/activity");
const authMiddleware = require("../middleware/VerifyToken");
const checkRole = require("../middleware/role");

router.post(
  "/add-activity",
  authMiddleware,
  checkRole(["agentAdmin"]),
  addActivity
);

router.get(
  "/activities",
  authMiddleware,
  checkRole(["agentAdmin"]),
  getAllActivities
);

router.get("/activities", authMiddleware, getFilteredActivities);
router.get(
  "/activity/:id",
  authMiddleware,
  checkRole(["agentAdmin"]),
  getActivityById
);

router.put(
  "/activity/:id",
  authMiddleware,
  checkRole(["agentAdmin"]),
  updateActivity
);

router.delete(
  "/activity/:id",
  authMiddleware,
  checkRole(["agentAdmin"]),
  deleteActivity
);

module.exports = router;
