const express = require("express");
const {
  getAdminStats,
  getAllAgents,
  addAgent,
} = require("../controller/admin");
const authMiddleware = require("../middleware/VerifyToken");
const router = express.Router();

router.get("/admin/stats", authMiddleware, getAdminStats);
router.get("/agents", authMiddleware, getAllAgents);
router.post("/add-agent", authMiddleware, addAgent);

module.exports = router;
