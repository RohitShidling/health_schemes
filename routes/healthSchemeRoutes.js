const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const HealthScheme = require("../models/healthScheme"); // Import the Mongoose model

// Fetch all schemes
router.get("/", async (req, res) => {
  try {
    const schemes = await HealthScheme.find(); // Use Mongoose to fetch all documents
    res.status(200).json(schemes);
  } catch (error) {
    console.error("Error fetching schemes:", error);
    res.status(500).json({ error: "Unable to fetch schemes." });
  }
});

// Fetch specific scheme by ID
router.get("/:id", async (req, res) => {
  try {
    const schemeId = req.params.id;

    // Check if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(schemeId)) {
      return res.status(400).json({ error: "Invalid ObjectId format" });
    }

    const scheme = await HealthScheme.findById(schemeId); // Use Mongoose `findById` for simplicity

    if (!scheme) {
      return res.status(404).json({ error: "Scheme not found" });
    }

    res.status(200).json(scheme);
  } catch (error) {
    console.error("Error fetching scheme details:", error);
    res.status(500).json({ error: "Unable to fetch scheme details." });
  }
});

// Add a new scheme
router.post("/", async (req, res) => {
  try {
    const newScheme = new HealthScheme(req.body); // Create a new instance of the model
    const savedScheme = await newScheme.save(); // Save the document to the database
    res.status(201).json(savedScheme);
  } catch (error) {
    console.error("Error adding new scheme:", error);
    res.status(500).json({ error: "Unable to add new scheme." });
  }
});

// Update an existing scheme by ID
router.put("/:id", async (req, res) => {
  try {
    const schemeId = req.params.id;

    // Check if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(schemeId)) {
      return res.status(400).json({ error: "Invalid ObjectId format" });
    }

    const updatedScheme = await HealthScheme.findByIdAndUpdate(
      schemeId,
      req.body,
      { new: true, runValidators: true } // Return the updated document and validate changes
    );

    if (!updatedScheme) {
      return res.status(404).json({ error: "Scheme not found" });
    }

    res.status(200).json(updatedScheme);
  } catch (error) {
    console.error("Error updating scheme:", error);
    res.status(500).json({ error: "Unable to update scheme." });
  }
});

// Delete a scheme by ID
router.delete("/:id", async (req, res) => {
  try {
    const schemeId = req.params.id;

    // Check if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(schemeId)) {
      return res.status(400).json({ error: "Invalid ObjectId format" });
    }

    const deletedScheme = await HealthScheme.findByIdAndDelete(schemeId);

    if (!deletedScheme) {
      return res.status(404).json({ error: "Scheme not found" });
    }

    res.status(200).json({ message: "Scheme deleted successfully" });
  } catch (error) {
    console.error("Error deleting scheme:", error);
    res.status(500).json({ error: "Unable to delete scheme." });
  }
});

// // NEW: Search schemes by keyword
// router.get("/search", async (req, res) => {
//   try {
//     const searchQuery = req.query.search || ""; // Extract the search query from the request
//     const schemes = await HealthScheme.find({
//       title: { $regex: searchQuery, $options: "i" }, // Perform a case-insensitive search on `title`
//     }).select("title _id"); // Only return the `title` and `_id` fields for the search results

//     if (schemes.length === 0) {
//       return res.status(404).json({ error: "No schemes found." });
//     }

//     res.status(200).json(schemes);
//   } catch (error) {
//     console.error("Error fetching schemes:", error);
//     res.status(500).json({ error: "Unable to fetch schemes." });
//   }
// });


// router.get("/search", async (req, res) => {
//   try {
//     const searchQuery = req.query.search ? req.query.search.trim() : ""; // Extract and trim the search query from the request
//     const schemes = await HealthScheme.find({
//       title: { $regex: searchQuery, $options: "i" }, // Perform a case-insensitive search on `title`
//     }).select("title _id"); // Only return the `title` and `_id` fields for the search results

//     if (schemes.length === 0) {
//       return res.status(404).json({ error: "No schemes found." });
//     }

//     res.status(200).json(schemes);
//   } catch (error) {
//     console.error("Error fetching schemes:", error);
//     res.status(500).json({ error: "Unable to fetch schemes." });
//   }
// });

router.get('/search', async (req, res) => {
  try {
    const searchQuery = req.query.search ? req.query.search.trim() : '';
    
    // Validate search query
    if (!searchQuery) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    // Create search criteria
    const searchCriteria = {
      $or: [
        { title: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } },
        { provider: { $regex: searchQuery, $options: 'i' } }
      ]
    };

    // Execute search with pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const schemes = await HealthScheme.find(searchCriteria)
      .skip(skip)
      .limit(limit)
      .select('-__v') // Exclude version key
      .sort({ title: 1 }); // Sort by title alphabetically

    // Get total count for pagination
    const total = await HealthScheme.countDocuments(searchCriteria);

    // Check if no schemes found
    if (schemes.length === 0) {
      return res.status(404).json({ 
        error: 'No schemes found matching your search criteria'
      });
    }

    // Return results with pagination info
    res.status(200).json({
      schemes,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      }
    });

  } catch (error) {
    console.error('Error searching schemes:', error);
    res.status(500).json({ error: 'Unable to search schemes' });
  }
});


module.exports = router;
