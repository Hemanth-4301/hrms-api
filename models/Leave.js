const mongoose = require("mongoose");

const LeaveSchema = new mongoose.Schema(
  {
    employeeName: { type: String, required: true },
    email: { type: String, required: true },
    reason: { type: String, required: true },
    date: { type: String, required: true },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Accepted", "Rejected"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Leave", LeaveSchema);
