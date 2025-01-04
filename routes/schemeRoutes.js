const express = require("express");
const Scheme = require("../models/Scheme");

const router = express.Router();

// Fetch all schemes
router.get("/", async (req, res) => {
  try {
    const schemes = await Scheme.find();
    res.status(200).json(schemes);
  } catch (error) {
    console.error("Error fetching schemes:", error);
    res.status(500).json({ error: "Failed to fetch schemes" });
  }
});

module.exports = router;
