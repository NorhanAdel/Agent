const express = require("express");
const app = express();
const uploadRoute = require("./routes/uploadRoute");

// Middleware to handle JSON request bodies
app.use(express.json());

// Mount the upload route
app.use(uploadRoute);

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
