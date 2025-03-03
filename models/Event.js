const mongoose = require("mongoose");

const eventSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    startTime: { type: String, required: true }, // e.g., "16:00" for 4 PM
    endTime: { type: String, required: true },
    location: { type: String },
    contact: { type: String },
    organizerEmail: { type: String },
    createdBy: { type: String, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    approved: { type: Boolean, default: false },
    // image: { type: Buffer }

  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
