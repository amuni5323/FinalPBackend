
const mongoose = require("mongoose");

const jobSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: { type: String },
    location: { type: String },
    company: { type: String, required: true },
    salary: { type: Number },
    contact: { type: String }, // Contact email or phone
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // User who posted the job
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
