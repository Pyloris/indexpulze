import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../database/models/user.model.js";
import { connectDatabase } from "../database/connection.js";

async function seed() {
    try {
        console.log("Connecting to database:");
        await connectDatabase();
        console.log("Connected to MongoDB.");

        console.log("Seeding admin user...");
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("admin123", salt);

        const adminData = {
            username: "admin",
            email: "admin@indexpulze.com",
            password: hashedPassword,
            full_name: "Admin User",
            profile_picture: ""
        };

        const existing = await User.findOne({ username: "admin" });
        if (existing) {
            console.log("Admin user already exists. Updating...");
            await User.updateOne({ username: "admin" }, { $set: adminData });
        } else {
            console.log("Creating new admin user...");
            await User.create(adminData);
        }

        console.log("Seeding completed successfully.");
    } catch (error) {
        console.error("Error seeding database:", error);
    } finally {
        await mongoose.connection.close();
    }
}

seed();
