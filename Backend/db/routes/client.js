const express = require("express");
const router = express.Router();
const {
  addClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
} = require("../controller/client");
const authMiddleware = require("../middleware/VerifyToken");
const checkRole = require("../middleware/role");

router.post(
  "/add-client",
  authMiddleware,
  checkRole(["agentAdmin"]),
  addClient
);

router.get(
  "/clients",
  authMiddleware,
  checkRole(["agentAdmin"]),
  getAllClients
);

router.get(
  "/client/:id",
  authMiddleware,
  checkRole(["agentAdmin"]),
  getClientById
);

router.put(
  "/client/:id",
  authMiddleware,
  checkRole(["agentAdmin"]),
  updateClient
);

router.delete(
  "/client/:id",
  authMiddleware,
  checkRole(["agentAdmin"]),
  deleteClient
);

module.exports = router;
