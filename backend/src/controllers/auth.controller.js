import { generateToken } from '../lib/utils.js';
import User from './../models/user.model.js';
import bcrypt from 'bcryptjs';
import cloudinary from './../lib/cloudinary.js';

export const signup = async (req, res) => {    
    const {fullName, email, password} = req.body;
    try{

        //check for required fields
        if( !fullName || !email || !password ){
            return res.status(400).json({message: "All Fields are Required!"}); 
        }

        //check for password length
        if( password.length < 6 ){
            return res.status(400).json({message: "Password must be atleast 6 characters!"}); 
        }

        //check if email is already exists in DB
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message: "Email already exists!"});
        }

        //generate salt and hash password with it
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create a new user
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });

        // Save the user to the database and generate a token
        if(newUser){
            // Generate and send a token
            generateToken(newUser._id, res);

            await newUser.save(); //save user to DB

            res.status(200).json({
                _id: newUser._id, //user ID stored in DB
                fullName: newUser.fullName, //user fullName stored in DB
                email: newUser.email, //user email stored in DB
                profilePic: newUser.profilePic, //user profile picture stored in DB
            }); 
        }
        else{
            res.status(400).json({message: "Invalid User Data!"});
        }
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: "Something went Wrong in Signup Controller!"});
    }
}
export const login = async (req, res) => {
    const { email, password} = req.body;
    try{
        //Find User in DB
        const user = await User.findOne({email});

        //Check if user is exist in DB or not
        if(!user){
            return res.status(400).json({message: "User Not Found!"});
        }

        //Compare input passowrd with hashed password
        const isCorrectPassowrd = await bcrypt.compare(password, user.password); 
        
        //Invalid User
        if(!isCorrectPassowrd){
            return res.status(400).json({message: "Invalid Credentials!"}); 
        }

        //Generate token for authorized user
        generateToken( user._id, res);

        //return stored user credentials
        res.status(200).json({
            _id: user._id, //user ID stored in DB
            fullName: user.fullName, //user fullName stored in DB
            email: user.email, //user email stored in DB
            profilePic: user.profilePic, //user profile picture stored in DB
        }); 
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: "Something went Wrong in login Controller!"});
    }
}
export const logout = async (req, res) => {
    
    try{
        //Cleared Auth token by setting an expired cookie
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({message: "logout Sucessfully!"});
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: "Something went Wrong in logout Controller!"});
    }
}
export const updateProfile = async (req, res) => {
    
    try{
        const {profilePic, fullName} = req.body;
        const userId = req.user._id;

        //if profile pic is not given
        if(!profilePic){
            res.status(400).json({message: "Profile Picture is Required!"});
        }

        //if fullName is not given
        if(fullName.length == 0){
            res.status(400).json({message: "fullName is Required!"});
        }

        //upload that profile in cloudinary(it's a bucket that stores all profilePics)
        const uploadedResponse = await cloudinary.uploader.upload(profilePic);

        //update profile picture in DB
        const updatedUser = await User.findByIdAndUpdate(userId, {
            profilePic: uploadedResponse.secure_url,
            fullName,
        }, {new: true});

        res.status(200).json(updatedUser);
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: "Something went Wrong in updateProfile Controller!"});
    }
}
export const checkAuth = async (req, res) => {
    try{
        //This function checks if user is authenticated or not
        //Called when we refresh the page to check authentication
        // if (!req.user) {
        //     return res.status(401).json({ message: "User not authenticated!!" });
        // }
        res.status(200).json(req.user);
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: "Something went Wrong in checkAuth Controller!"});
    }
}