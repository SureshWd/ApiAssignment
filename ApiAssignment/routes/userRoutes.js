import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Middleware to validate user data
const validateUser = (req, res, next) => {
    const { firstName, lastName, hobby } = req.body;
    if (!firstName || !lastName || !hobby) {
        return res.status(400).json({ message: "First name, last name, or hobby are missing" });
    }
    next();
};

// Fetch all users
router.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Fetch user by ID
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findOne({ id: req.params.id });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a new user
router.post("/", validateUser, async (req, res) => {
    try {
        const newUser = new User(req.body);
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update an existing user
router.put("/:id", validateUser, async (req, res) => {
    try {
        const updatedUser = await User.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true } // Return the updated document
        );
        if (!updatedUser) return res.status(404).json({ message: "User not found" });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a user
router.delete("/:id", async (req, res) => {
    try {
        const deletedUser = await User.findOneAndDelete({ id: req.params.id });
        if (!deletedUser) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
