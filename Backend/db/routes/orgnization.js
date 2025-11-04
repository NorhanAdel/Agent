const express = require("express");
const multer = require("multer");
const { addAgent } = require("../controller/AddOrganization");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/add-agent", upload.single("attachments"), addAgent);

module.exports = router;
