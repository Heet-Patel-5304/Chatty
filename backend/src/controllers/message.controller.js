import User from './../models/user.model.js';
import Message from './../models/message.model.js';
import cloudinary from '../lib/cloudinary.js';
import { getReceiverSocketId, io } from '../lib/socket.js';

// Get a list of all users except the current logged-in user
export const getUsersForSidebar = async (req, res) => {
    try{
        //Current user's ID as he/she logged in 
        const loggedInUserId = req.user._id;

        //fetch every user ID except the current user
        const filteredUsers = await User.find({
            _id: {$ne: loggedInUserId}
        }).select("-password"); //exclude password field for security

        //Return filtered user list
        res.status(200).json(filteredUsers);
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: "Error in getUsersForSidebar Controller!"});
    }
}

// Fetch messages between the logged-in user and a specific user
export const getMessage = async (req, res) => {
    try{
        // ID of the user to chat with 
        const {id: userToChatId} = req.params;

        //Logged-in user's ID
        const myId = req.user._id;

        //Find all the messages where 
        const message = await Message.find({
            $or:[
                //Sender is ME and Receiver is USER
                {senderId: myId, receiverId: userToChatId},
                //OR Sender is USER and Receiver is ME
                {senderId: userToChatId, receiverId: myId},
            ],
        });

        //Return message history
        res.status(200).json(message);
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: "Error in getMessage Controller!"});
    }
}

// Send a message to another user
export const sendMessage = async (req, res) => {
    try{
        // Text and optional image in the message
        const {text, image} = req.body;
        // Recipient's ID
        const {id: receiverId} = req.params; 
        //Logged-in user's ID
        const senderId = req.user._id; 

        let imageUrl; // URL for uploaded image(If Provided)

        //if user sends image
        if(image){
            //upload that image to cloudinary (to stored for future)
            const uploadResponse = cloudinary.uploader.upload(image);

            //now fetch that image URL from cloudinary and stores it into "imageUrl"
            imageUrl = (await uploadResponse).secure_url;
        }

        // create a new message
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        //save it to DB
        await newMessage.save();

        //Emit the new message event in real-time using Socket.io
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: "Error in sendMessage Controller!"});
    }
}