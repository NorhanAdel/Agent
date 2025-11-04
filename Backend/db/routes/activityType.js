const express = require("express");
const router = express.Router();
const {
  addActivityType,
  getAllActivityTypes,
  updateActivityType,
  deleteActivityType,
} = require("../controller/activityType");
const authMiddleware = require("../middleware/VerifyToken");
const checkRole = require("../middleware/role");

 
router.post(
  "/add-activity-type",
  authMiddleware,
  checkRole(["agentAdmin"]),
  addActivityType
);

 
router.get(
  "/activity-types",
  authMiddleware,
  checkRole(["agentAdmin"]),
  getAllActivityTypes
);
 
router.put(
  "/activity-type/:id",
  authMiddleware,
  checkRole(["agentAdmin"]),
  updateActivityType
);

 
router.delete(
  "/activity-type/:id",
  authMiddleware,
  checkRole(["agentAdmin"]),
  deleteActivityType
);

module.exports = router;
