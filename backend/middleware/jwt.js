const jwt = require("jsonwebtoken");

// Middleware to authenticate the user
const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("Authorization Header:", authHeader); // Log the header to see what's being received

    // Check if the header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("Unauthorized - Incorrect Header Format or Missing"); // Log the error cause
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    console.log("Extracted Token:", token); // Log the extracted token to verify
    
    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
        // Log the decoded token to verify its structure
        console.log("Decoded token:", decoded);
    
        // Attach user ID to req.user only if decoded.userId exists
        if (decoded.userId) {
            req.user = { id: decoded.userId };
        } else {
            console.error("userId not found in decoded token");
            return res.status(401).json({ message: "Unauthorized" });
        }
    
        // Continue to the next middleware
        next();
    } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(401).json({ message: "Unauthorized" });
    }
};

// Function to generate a JWT token with user ID in payload


module.exports = { auth, generateToken };
