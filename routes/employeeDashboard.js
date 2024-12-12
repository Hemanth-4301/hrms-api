const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const router = express.Router();

// Route to fetch employee details by email
router.get("/:email", async (req, res) => {
  const email = req.params.email; // Get email from URL params

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return user details excluding the password
    const { password, ...userDetails } = user.toObject();
    res.json(userDetails);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Route to delete an employee account
router.delete("/delete", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the user from the database
    await user.deleteOne();
    res.json({ message: "User account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
