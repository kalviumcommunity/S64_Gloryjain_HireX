// backend/routes/company.routes.js
import express from "express";
import { Company } from "../models/company.model.js";
import { User } from "../models/user.model.js";

const router = express.Router();

// Create a company and link it to a user
router.post("/", async (req, res) => {
    try {
        const { name, description, website, location, logo, userId } = req.body;

        const newCompany = new Company({ name, description, website, location, logo, userId });
        const savedCompany = await newCompany.save();

        // Update the user to link the company
        await User.findByIdAndUpdate(userId, {
            $set: { "profile.company": savedCompany._id }
        });

        res.status(201).json(savedCompany);
    } catch (error) {
        console.error("Error creating company:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// Get all companies
router.get("/", async (req, res) => {
    try {
        const companies = await Company.find().populate("userId", "fullname email");
        res.status(200).json(companies);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

export default router;
