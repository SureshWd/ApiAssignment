import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    id: {
        type: Number, // Define the ID as a number
        unique: true, // Ensure it is unique
        required: true, // Make it mandatory
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    hobby: { type: String, required: true },
});

// Ensure auto-increment behavior for the `id` field
userSchema.pre("save", async function (next) {
    if (!this.isNew) return next();

    const lastUser = await mongoose
        .model("User", userSchema)
        .findOne()
        .sort({ id: -1 }); // Get the last inserted user by ID

    this.id = lastUser ? lastUser.id + 1 : 1; // Increment ID or start from 1
    next();
});

const User = mongoose.model("User", userSchema);

export default User;
