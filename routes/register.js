// routes/register.js
const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const router = express.Router();

// Register Route
router.post("/register", async (req, res) => {
  const { name, email, password, dob, gender, position, department, hireDate } =
    req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    const user = new User({
      name,
      email,
      password,
      dob,
      gender,
      position,
      department,
      hireDate,
    });

    // Save the user to the database
    await user.save();

    // Send response
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
