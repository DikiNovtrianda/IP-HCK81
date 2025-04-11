const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const signToken = (data) => {
    return jwt.sign(data, JWT_SECRET);
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET); // Ensure this function throws an error for invalid tokens
    } catch (error) {
        throw { name: "Unauthorized", message: "Invalid token" }; // Add proper error handling
    }
};

module.exports = { signToken, verifyToken };