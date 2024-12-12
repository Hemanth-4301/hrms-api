const express = require("express");
const router = express.Router();
const Leave = require("../models/Leave");

// Apply for leave
router.post("/apply", async (req, res) => {
  try {
    const { employeeName, email, reason, date } = req.body;
    const newLeave = new Leave({ employeeName, email, reason, date });
    await newLeave.save();
    res
      .status(201)
      .json({ message: "Leave applied successfully", leave: newLeave });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all leaves of an employee
router.get("/employee/:email", async (req, res) => {
  try {
    const leaves = await Leave.find({ email: req.params.email });
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin gets all leave requests
router.get("/admin", async (req, res) => {
  try {
    const leaves = await Leave.find();
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin updates leave status
router.put("/update/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const updatedLeave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Leave status updated", leave: updatedLeave });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/deleteAll", async (req, res) => {
  try {
    await Leave.deleteMany();
    res.status(200).json({ message: "History got clear" });
  } catch (Err) {
    res.status(400).json({ error: Err.message });
  }
});

module.exports = router;
