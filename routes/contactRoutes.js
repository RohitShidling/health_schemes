const express = require("express");
const Contact = require("../models/Contact");

const router = express.Router();

// POST: Submit Contact Form
router.post("/", async (req, res) => {
  const { name, email, phone, message } = req.body;

  // Validate required fields
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }

  try {
    const contact = new Contact({ name, email, phone, message });
    await contact.save();
    res.status(201).json({ message: "Your message was submitted successfully!", contact });
  } catch (error) {
    console.error("Error submitting contact message:", error);
    res.status(500).json({ error: "Failed to submit your message" });
  }
});

module.exports = router;
