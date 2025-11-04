const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/VerifyToken");

const {
  addEmployee,
  getEmployees,
  getEmployeeActivities,
  getEmployeeStats,
  getEmployeeChart,
  editEmployee,
  getEmployeesPerformance,
  getAllActivitiesByEmployee,
  globalSearch,
  deleteEmployee,
} = require("../controller/user");

router.post("/add-employee", authMiddleware, addEmployee);
router.get("/employees", authMiddleware, getEmployees);
router.get("/employee/activities", authMiddleware, getEmployeeActivities);
router.get("/employee/stats", authMiddleware, getEmployeeStats);
router.get("/employee/chart", authMiddleware, getEmployeeChart);
router.put("/employee/:id", authMiddleware, editEmployee);
router.get("/employee/performance", authMiddleware, getEmployeesPerformance);
router.get(
  "/employee/:id/all-activities",
  authMiddleware,
  getAllActivitiesByEmployee
);
router.get("/search", authMiddleware, globalSearch);
router.delete("/employee/:id", authMiddleware, deleteEmployee);
module.exports = router;
