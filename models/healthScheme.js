const mongoose = require("mongoose");

const healthSchemeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  benefits: { type: String },
  requiredDocuments: { type: [String] },
  eligibility: { type: String },
  applicationSteps: { type: String },
  applicationWebsite: { type: String },
  provider: { type: String },
});

module.exports = mongoose.model("health_schemes", healthSchemeSchema);
