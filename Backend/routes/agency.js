const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/uploadController");
const upload = require("../middlewares/uploadMiddleware"); // Middleware for handling file upload

// Define the upload route
router.post("/upload", upload.single("file"), uploadController.uploadFile);

module.exports = router;
