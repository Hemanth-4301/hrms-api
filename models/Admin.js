const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();

// Create the Admin Schema
const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
});

// Hash password before saving
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Admin = mongoose.model("Admin", adminSchema);

const addSuperAdmin = async () => {
  const superAdminEmail = process.env.EMAIL;
  const superAdminPassword = process.env.PASSWORD;
  const superAdminName = process.env.NAME;

  // Ensure all environment variables are provided
  if (!superAdminEmail || !superAdminPassword || !superAdminName) {
    console.error(
      "Super Admin credentials are missing in the environment variables"
    );
    return;
  }

  // Check if super admin already exists
  const superAdmin = await Admin.findOne({ email: superAdminEmail });
  if (!superAdmin) {
    const newSuperAdmin = new Admin({
      name: superAdminName,
      email: superAdminEmail,
      password: superAdminPassword,
    });
    await newSuperAdmin.save();
    console.log("Super Admin created successfully");
  } else {
    console.log("Super Admin already exists");
  }
};

// Call the function to add a super admin
addSuperAdmin().catch((error) =>
  console.error("Error creating Super Admin:", error)
);

module.exports = Admin;
