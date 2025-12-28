const app = require("./app");
const connectDB = require("./database/db");

// Connect to MongoDB
connectDB()
  .then(() => {
    console.log("MongoDB connected");

    // Run server ONLY in local development
    if (process.env.NODE_ENV !== "production") {
      const PORT = process.env.PORT || 8000;
      app.listen(PORT, () => {
        console.log(`Server running locally on port ${PORT}`);
      });
    }
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });

//Exporting app for Vercel
module.exports = app;
