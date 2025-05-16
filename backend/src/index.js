import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import cookieParser from "cookie-parser"
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";
import path from "path";

// Load environment variables from a .env file into process.env
dotenv.config();
// Set the port to the value from the environment variable, or fallback to 3000 if not set
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Middleware to parse JSON request bodies
app.use(express.json());
// Middleware to parse cookies from the client's request
app.use(cookieParser());
// Enable CORS for the frontend (React app running on localhost:5173)
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));


// Routes for authentication and messaging
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}

// Start the server and connect to the database
server.listen(PORT, () => {
    console.log(`Server Is Running At Port ${PORT}!!`);
    connectDB(); // Connect to MongoDB
});