const mongoose = require("mongoose");

const emergencySchema = mongoose.Schema(
  {
    service: { type: String, required: true }, // Fire, Police, Water, etc.
    contact: { type: String, required: true }, // Contact number
    description: { type: String }, // Description of service
  },
  { timestamps: true }
);

module.exports = mongoose.model("Emergency", emergencySchema);
