import mongoose from "mongoose";

// Define the schema for storing messages
const messageSchema = mongoose.Schema({
    // ID of the sender, references the "User" collection
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    // ID of the receiver, references the "User" collection
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    // Text content of the message (optional)
    text: {
        type: String,
    },
    // URL of an image if attached (optional)
    image: {
        type: String,
    },
}, {timestamps: true} ); // Automatically adds createdAt and updatedAt fields

// Create a model named "Message" using the schema
const Message = mongoose.model("Message", messageSchema);

export default Message;