import mongoose from "mongoose";

// Define the schema for storing user information
const userSchema = mongoose.Schema({
    // User's email, must be unique and provided
    email: {
        type: String,
        required: true,
        unique: true,
    },
    // User's full name, required
    fullName: {
        type: String,
        required: true,
    },
    // User's password, minimum length of 6 characters
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    // URL for the user's profile picture, defaults to an empty string
    profilePic: {
        type: String,
        default: "",
    },
}, {timestamps: true} );  // Automatically adds createdAt and updatedAt fields

// Create a model named "User" using the schema
const User = mongoose.model("User", userSchema);

export default User;