const db = require("../models/db"); // Import your database model

// Handle the file upload and database insertion
const uploadFile = async (req, res) => {
  try {
    // Access the uploaded file from the request object (assuming it's in field 'file')
    const file = req.file;

    // Perform any necessary validation or processing on the file

    // Insert the file data into the database using your model
    const result = await db.insertFile(file);

    // Return a success response
    res.status(200).json({ message: "File uploaded successfully", result });
  } catch (error) {
    // Handle any errors that occur during the upload or database insertion
    console.error(error);
    res.status(500).json({ error: "An error occurred during file upload" });
  }
};

module.exports = {
  uploadFile,
};
