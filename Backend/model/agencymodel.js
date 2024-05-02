// Assuming you are using a SQL database with a library like Sequelize

const { Sequelize } = require("sequelize");

// Create a Sequelize instance with your database connection details
const sequelize = new Sequelize("database_name", "username", "password", {
  host: "localhost",
  dialect: "mysql", // Replace with your database dialect
});

// Define a model for storing the file data in the database
const File = sequelize.define("File", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  // Define other columns as needed
});

// Sync the model with the database (run this once before using the model)
sequelize.sync();

// Function for inserting the file data into the database
const insertFile = async (file) => {
  try {
    // Insert the file data into the 'File' table
    const result = await File.create({ name: file.originalname });

    // Return the result of the insertion
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  insertFile,
};
