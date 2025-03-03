const express = require("express");
const { createHeadOffice, getAllHeadOffices, searchHeadOffices } = require("../controllers/headOfficeController");

const router = express.Router();

// Admin route to create a new Head Office
router.post("/", createHeadOffice);

// Route to get all head offices
router.get("/", getAllHeadOffices);

// Route to search head offices
router.get("/search", searchHeadOffices);

module.exports = router;
