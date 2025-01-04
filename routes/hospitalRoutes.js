const express = require("express");
const Hospital = require("../models/hospitals");

const router = express.Router();

// Fetch all hospitals
router.get("/", async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.status(200).json(hospitals);
  } catch (error) {
    console.error("Error fetching hospitals:", error);
    res.status(500).json({ error: "Failed to fetch hospitals" });
  }
});

// Add a new hospital
router.post("/", async (req, res) => {
  const { name, location, city, area, ownership, health_schemes, charges } = req.body;

  // Validate required fields
  if (!name || !location || !city || !area || !ownership || !health_schemes || !charges) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const hospital = new Hospital({ name, location, city, area, ownership, health_schemes, charges });
    await hospital.save();
    res.status(201).json({ message: "Hospital added successfully", hospital });
  } catch (error) {
    console.error("Error adding hospital:", error);
    res.status(500).json({ error: "Failed to add hospital" });
  }
});

module.exports = router;
