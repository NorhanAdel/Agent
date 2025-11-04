const express = require("express");
const router = express.Router();
const { getAnalyticsData } = require("../controller/analyticsData");
const authMiddleware = require("../middleware/VerifyToken");
 
 
 
router.get("/admin/analytics", authMiddleware, getAnalyticsData);

 

 

module.exports = router;
