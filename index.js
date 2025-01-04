const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Import routes
const schemeRoutes = require("./routes/schemeRoutes");
const hospitalRoutes = require("./routes/hospitalRoutes");
const healthSchemeRoutes = require("./routes/healthSchemeRoutes");
const contactRoutes = require("./routes/contactRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to the Database
mongoose.connect(process.env.SCHEMES_MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

// Check database connection
db.on("error", console.error.bind(console, "Database connection error:"));
db.once("open", () => console.log("Connected to the database!"));

// Pass the database to routes
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Routes
app.use("/api/schemes", schemeRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/health-schemes", healthSchemeRoutes);
app.use("/api/contact", contactRoutes); // Add contact route

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
