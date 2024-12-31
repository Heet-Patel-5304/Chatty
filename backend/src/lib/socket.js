import {Server} from "socket.io";
import express from "express";
import http from "http";

// Set up Express and HTTP server
const app = express();
const server = http.createServer(app);
 
// Set up Socket.IO with CORS configuration
const io = new Server (server, {
    cors: {
        origin: ["http://localhost:5173"],
    },
});

// Function to get the socket ID of a user by their user ID
export function getReceiverSocketId(userId){
    return userSocketMap[userId];
}

// Object to map user IDs to their respective socket IDs
const userSocketMap = {};

io.on("connection", (socket) => {
    // Log the connection event
    console.log("A User Connected!", socket.id);

    // Extract the user ID from the connection query
    const userId = socket.handshake.query.userId;

    // Map the user ID to the socket ID if the user ID exists
    if(userId){
        userSocketMap[userId] = socket.id;
    }

    // Notify all connected clients about the list of online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Handle user disconnection
    socket.on("disconnect", () => {
        // Log the disconnection event
        console.log("A User Disonnected!", socket.id);

        // Remove the user from the map
        delete userSocketMap[userId];

        // Update clients with the new online user list
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { io, app, server };