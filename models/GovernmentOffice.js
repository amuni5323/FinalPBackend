const mongoose = require("mongoose");

const governmentOfficeSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    contact: { type: String },
    email: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GovernmentOffice", governmentOfficeSchema);
