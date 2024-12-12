const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin"); // Adjust according to your models
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if the admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Check if the password matches
    const isMatch = password === admin.password ? true : false;
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Generate JWT token
    const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // You can adjust the expiration time as needed
    });
    // Send the token to the client
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
