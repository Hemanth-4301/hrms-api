const express = require("express");
const Admin = require("../models/Admin");
const router = express.Router();

// Add a new admin
router.post("/add", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Create a new admin
    const newAdmin = new Admin({ name, email, password });
    await newAdmin.save();

    res
      .status(201)
      .json({ message: "Admin added successfully", admin: newAdmin });
  } catch (error) {
    res.status(500).json({ message: "Error adding admin", error });
  }
});

// Get all admins
router.get("/list", async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: "Error fetching admins", error });
  }
});

// Delete an admin
router.delete("/delete/:email", async (req, res) => {
  try {
    const { email } = req.params;

    if (email === process.env.EMAIL) {
      return res.status(400).json({ message: "Can't delete SuperAdmin" });
    }
    // Delete admin by email
    const deletedAdmin = await Admin.findOneAndDelete({ email });
    if (!deletedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting admin", error });
  }
});

module.exports = router;
