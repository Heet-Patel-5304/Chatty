import jwt from "jsonwebtoken";

export const generateToken = async (userId, res) => {

    //creates a token with the user ID and secret key, valid for 7 days
    const token = jwt.sign({userId}, process.env.JWT_SECRET_KEY, {
        expiresIn: "7d",
    });

    //send token in cookies
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
        httpOnly: true, // prevent XSS attacks cross-site scripting attacks
        sameSite: true, //prevent CSRF attacks cross-site request forgery attacks

        // Ensures cookies are sent only over HTTPS in production
        secure: process.env.NODE_ENV !== "development"
    });

    return token;
};