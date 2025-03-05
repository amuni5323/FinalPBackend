const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");

// Import all route files (you can adjust the filenames as needed)
const adminRoutes = require('./routes/adminRoutes');

const userRoutes = require("./routes/userRoutes");
const jobRoutes = require("./routes/jobRoutes");
const eventRoutes = require("./routes/eventRoutes");
const hotelRoutes = require("./routes/hotelRoutes");
const hospitalRoutes = require("./routes/hospitalRoutes");
const courtRoutes = require("./routes/courtRoutes");
const governmentOfficeRoutes = require("./routes/governmentOfficeRoutes");
const headOfficeRoutes = require("./routes/headOfficeRoutes");
const policeStationRoutes = require("./routes/policeStationRoutes");
const shelterRoutes = require("./routes/shelterRoutes");
const emergencyRoutes = require("./routes/emergencyRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const bookRoutes = require("./routes/bookRoutes");
const eventReminderSchedule = require('./utils/eventReminderScheduler');  // Ensure this line is added to run the cron jobs
const imageRouter =  require("./routes/imageRoutes")
const booksRoutes = require('./routes/booksRoutes');
const authRoutes = require('./routes/auth'); 
console.log("governmentOfficeController.js is loaded");

dotenv.config();
const app = express();

// app.use(express.json()); // Ensure JSON parsing
app.use(express.urlencoded({ extended: true })); // Allow form data parsing
const subscribeRoute = require('./routes/subscribe');
app.use('/api/subscribe', subscribeRoute);

// 🔹 **Middleware**
app.use(bodyParser.json({ limit: '50mb' }));  // Set a larger limit if needed
 // Ensures proper JSON parsing
app.use(cors("https://final-p-frontend-vkim.vercel.app"));

// 🔹 **Routes**
app.use('/api/admin', adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/events", eventRoutes);
app.use( "/api/hotel",hotelRoutes);  // Hotel Routes
app.use("/api/hospitals", hospitalRoutes);  // Hospital Routes
app.use("/api/courts", courtRoutes);  // Court Routes
app.use("/api/governmentOffices", governmentOfficeRoutes);  // Government Office Routes
app.use("/api/headOffices", headOfficeRoutes);  // Head Office Routes
app.use("/api/policeStations", policeStationRoutes);  // Police Station Routes
app.use("/api/shelters", shelterRoutes);  // Shelter Routes
app.use("/api/emergencies", emergencyRoutes);  // Emergency Routes
app.use("/api/feedback", feedbackRoutes);  // Feedback Routes
app.use("/api", bookRoutes);  // Book Routes
app.use('/uploads', express.static('uploads'));
app.use("/api", imageRouter)
app.use('/api', booksRoutes);
app.use('/api/auth', authRoutes);
// Add more routes as needed

// app.use("/uploads", express.static("uploads"));

// app.get("/", (req, res) => {
//   res.send("Hi! The server is working correctly.");
// });
// // { useNewUrlParser: true, useUnifiedTopology: true }





// 🔹 **MongoDB Connection**
mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true, useUnifiedTopology: true } )
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// 🔹 **Error Handling Middleware**
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({ message: "Server Error" });
});

// 🔹 **Start the Server**
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// 🔹 **Graceful Shutdown**
process.on("SIGINT", async () => {
  console.log("🛑 Shutting down server...");
  server.close(async () => {
    console.log("✅ Server closed.");
    await mongoose.connection.close(false);
    console.log("✅ MongoDB connection closed.");
    process.exit(0);
  });
});
