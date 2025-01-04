// models/Hospital.js
const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  city: { type: String, required: true },
  area: { type: String, required: true },
  ownership: { type: String, required: true },
  health_schemes: { type: [String], required: true },
  charges: {
    OPD: { type: mongoose.Schema.Types.Mixed, required: true },
    blood_test: { type: mongoose.Schema.Types.Mixed, required: true },
    operation: { type: String, required: true },
  },
});

module.exports = mongoose.model("Hospital", hospitalSchema);
