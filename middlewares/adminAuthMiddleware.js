// middlewares/adminAuthMiddleware.js
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');  // Admin model for admin checks

const adminAuthMiddleware = async (req, res, next) => {
    const token = req.header('Authorization');

    if (!token || !token.startsWith('Bearer ')) {
        console.log("No token provided or incorrect format");
        return res.status(401).json({ message: 'Access denied, no token provided' });
    }

    const jwtToken = token.split(' ')[1]; // Extract the JWT token

    try {
        const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET); // Verify the token
        
        // Fetch admin from DB and attach to req.admin
        const admin = await Admin.findById(decoded.id);
        if (!admin) {
            console.log("Admin not found in database");
            return res.status(404).json({ message: "Admin not found" });
        }

        if (admin.role !== 'admin') {
            console.log("Permission denied. Admins only.");
            return res.status(403).json({ message: "Permission denied. Admins only." });
        }

        req.admin = admin;  // Attach admin to request
        console.log("Authenticated admin:", admin);
        
        next(); // Continue to the next middleware
    } catch (error) {
        console.error("JWT Verification Error:", error);
        res.status(400).json({ message: 'Invalid token' });
    }
};
const verifyAdmin = (req, res, next) => {
    console.log("Checking admin:", req.admin); // Log the admin data
    if (req.admin && req.admin.role === "admin") {
        return next();
    } else {
        return res.status(403).json({ message: "Permission denied. Admins only." });
    }
};

module.exports = { adminAuthMiddleware, verifyAdmin
}