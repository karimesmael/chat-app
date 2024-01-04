const mongoose = require("mongoose");

exports.connectToMongoDB = () => {
  mongoose
    .connect(process.env.MONGO_URI, {})
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err.message);
      // Restart server on MongoDB connection error
      process.exit(1); // Exit the Node.js process with an error code
    });
};
