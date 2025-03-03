const express = require("express");
const { createHotel, getAllHotels } = require("../controllers/hotelController");
const upload = require("../middleware/multer");

const router = express.Router();

router.post("/api/hotels", upload.single("image"), createHotel); // Accept image upload
router.get("/api/hotels", getAllHotels);
// router.post("/add-hotel", upload.array("images", 5), addHotel);
router.get("/search", async (req, res) => {
    const query = req.query.q || "hotel Addis Ababa";
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&addressdetails=1`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      // Extract relevant hotel details
      const hotels = data.map((hotel) => ({
        name: hotel.display_name,
        latitude: hotel.lat,
        longitude: hotel.lon,
        address: hotel.address || {},
      }));
      router.post("/add-hotel", upload.array("images", 5), HotelController.addHotel);
      res.json(hotels);
    } catch (error) {
      console.error("Error fetching hotels:", error);
      res.status(500).json({ message: "Server error", error });
    }
  });

module.exports = router;
