const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Adjust according to your models
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
  
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Generate JWT token
    const token = jwt.sign({ employeeId: user._id }, process.env.JWT_SECRET, {
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
