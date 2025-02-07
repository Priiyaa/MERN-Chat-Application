import jwt from "jsonwebtoken"
import User from "../models/user.models.js"
import NewUser from "../models/newuser.models.js";

export const protectRoute = async(req,res,next)=>{
    try {
        console.log("Middleware Executed!"); 
        const token = req.cookies.jwt;

        if(!token){
            return res.status(401).json({message:"Unauthorised user - no token provided"});
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET) // decoding token to get user id as user id is payload
        if(!decoded){
            return res.status(401).json({message:"Unauthorised user - Invalid token "});
        }

        const user = await NewUser.findById(decoded.userId).select("-password"); // select everything from user except password
        console.log("USER IN MIDDLEWARE:", user)
        if(!user){
            return res.status(404).json({message:"user not found "});
        }

        // if user is authenticated then ->
        req.user = user; // 1. add user to the request
        if (!req.user) {
            return res.status(404).json({ message: "User not found in req.user in protected route" });
        }
    
        next(); // 2. call next function


    } catch (error) {
        console.log("Error in protected route middleware ", error.message);
        res.status(500).json({message:"Internal Error"});
    }
}