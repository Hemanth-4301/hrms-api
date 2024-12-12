const express = require("express");
const User = require("../models/User");
const router = express.Router();

// Get all employees
router.get("/", async (req, res) => {
  try {
    const employees = await User.find().select("-password");
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add a new employee
router.post("/", async (req, res) => {
  const { name, email, dob, gender, position, department, hireDate } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newUser = new User({
      name,
      email,
      dob,
      gender,
      position,
      department,
      hireDate,
      password: "defaultpassword",
    });

    await newUser.save();
    res.status(201).json({ message: "Employee added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedEmployee = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Returns the updated document
    );
    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: "Error updating employee", error });
  }
});

// Delete an employee
router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
