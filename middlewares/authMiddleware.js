const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import User model
const Admin = require('../models/Admin'); // Import Admin model

// Middleware to check if the user is authenticated
const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization');

    if (!token || !token.startsWith('Bearer ')) {
        console.log("No token provided or incorrect format");
        return res.status(401).json({ message: 'Access denied, no token provided' });
    }

    const jwtToken = token.split(' ')[1]; // Extract the JWT token

    try {
        const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET); // Verify the token
        
        // Fetch user from DB and attach to req.user
        const user = await User.findById(decoded.id);
        if (!user) {
            console.log("User not found in database");
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;  // Attach user to request
        console.log("Authenticated user:", user);
        
        next(); // Continue to the next middleware
    } catch (error) {
        console.error("JWT Verification Error:", error);
        res.status(400).json({ message: 'Invalid token' });
    }
};

// Middleware to check if the user is an admin
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

        req.admin = admin;  // Attach admin to request
        console.log("Authenticated admin:", admin);
        
        next(); // Continue to the next middleware
    } catch (error) {
        console.error("JWT Verification Error:", error);
        res.status(400).json({ message: 'Invalid token' });
    }
};

// Verify Admin Middleware
const verifyAdmin = (req, res, next) => {
    console.log("Checking admin:", req.admin); // Log the admin data
    if (req.admin && req.admin.role === "admin") {
        return next();
    } else {
        return res.status(403).json({ message: "Permission denied. Admins only." });
    }
};

module.exports = { authMiddleware, adminAuthMiddleware, verifyAdmin };
