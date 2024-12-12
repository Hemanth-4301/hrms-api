// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.URL,
    credentials: true,
  })
);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const employeeDashboard = require("./routes/employeeDashboard");
app.use("/api/employeeDashboard", employeeDashboard);
// Routes
const registerRoute = require("./routes/register");
app.use("/api", registerRoute);

const loginRoute = require("./routes/login");
app.use("/api", loginRoute);

const adminLoginRoute = require("./routes/adminLogin");
app.use("/api/admin", adminLoginRoute);

const adminDashboard = require("./routes/adminDashboard");
app.use("/api/admin", adminDashboard);

const employeeRoutes = require("./routes/employees");
app.use("/api/employees", employeeRoutes);

const leaveRoutes = require("./routes/leave");
app.use("/api/leave", leaveRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
