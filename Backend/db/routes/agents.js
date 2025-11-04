const express = require("express");
const router = express.Router();
const multer = require("multer");
const authMiddleware = require("../middleware/VerifyToken");
const checkRole = require("../middleware/role");
const {
  getAllAgents,
  getAgentById,
  updateAgent,
  deleteAgent,
} = require("../controller/agents");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.get(
  "/agents",
  authMiddleware,
  checkRole(["agentAdmin", "mainAdmin"]),
  getAllAgents
);

router.get(
  "/agents/:id",
  authMiddleware,
  checkRole(["mainAdmin"]),
  getAgentById
);
router.put(
  "/agents/:id",
  authMiddleware,
  checkRole(["mainAdmin"]),
  upload.single("file"),
  updateAgent
);
router.delete(
  "/agents/:id",
  authMiddleware,
  checkRole(["mainAdmin"]),
  deleteAgent
);

module.exports = router;
