import User from './../models/user.model.js';
import jwt from 'jsonwebtoken';

// Middleware to protect routes by verifying the user's JWT
export const protectRoute = async (req, res, next) => {
    try{
        // Extract the JWT from cookies
        const token = req.cookies.jwt;

        // If there is not token exist, deny access
        if(!token){
            return res.status(400).json({message: "Unauthorized - No Token Provided!"});
        }

        // Verify the token and decode the user data (e.g., userId)
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // If the token is invalid, deny access
        if(!decoded){
            return res.status(400).json({message: "Invalid Token!"});
        }

         // Retrieve the user from the database, excluding the password field
        const user = await User.findById(decoded.userId).select("-password");

        // Attach the user data to the `req` object for later use
        req.user = user;

        // Pass control to the next middleware or route handler
        next(); 
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: "Something Went Wrong in protectRoute!"})
    }
}