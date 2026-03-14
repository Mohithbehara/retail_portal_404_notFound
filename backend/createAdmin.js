const mongoose = require("mongoose");
const env = require("./config/env");
const User = require("./models/User");

async function createAdmin() {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log("Connected to MongoDB");

    const existingAdmin = await User.findOne({ email: "admin@gmail.com" });
    if (existingAdmin) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    await User.create({
      name: "Admin",
      email: "admin@gmail.com",
      password: "admin123",
      role: "admin",
    });

    console.log("Admin user created successfully");
    console.log("Email: admin@gmail.com");
    console.log("Password: admin123");
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error.message);
    process.exit(1);
  }
}

createAdmin();
