import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.models.js";
import NewUser from "../models/newuser.models.js";
import bcrypt from "bcryptjs"


export const signup = async (req,res) => {
    console.log("Request Body:", req.body); // Debugging step
    const {fullName,email,password} = req.body; // fetching the data from user's entry

    try{
    // sign up user
    // hash passwords
    // create tokens for authentication

    // hashing password
        if(!fullName || !email || !password){
            return res.status(400).json({message: "One or more fields missing"});
        }
        if(password.length < 6){
            return res.status(400).json({message: "password must be at least 6 charachters"});
         }
   
        const user = await NewUser.findOne({email}); // await is only allowed in async functions and at top level of a module
    
        if (user) {
            return res.status(400).json({message:"Email already exists"});
        }
    
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new NewUser({
            fullName,
            email,
            password: hashedPassword,
        })
        await newUser.save(); //  NEW LINE ADDED
        generateToken(newUser._id,res);
        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic,
        });

        // if(newUser){
        //     // generate JWT token here
        //     generateToken(newUser._id,res);
        //     await newUser.save();
        //     res.status(201).json({
        //         _id: newUser._id,
        //         fullName: newUser.fullName,
        //         email: newUser.email,
        //         profilePic: newUser.profilePic,
        //     });
        //  }
        // else{
        //     return res.status(400).json({message: "Invalid user data"});
        // }
    }
    catch (error)
    {
        console.log("error in signup",error.message);
        if (error.code === 11000) {
            const duplicateKey = Object.keys(error.keyValue)[0];
            return res.status(400).json({
                message: `${duplicateKey} already exists`,
            });
        }
        res.status(500).json({message:"Server error"})
    }
};

export const login = async (req,res) => {
    const {email,password} = req.body
    try{
        const user = await NewUser.findOne({email})
            if(!user){
                return req.status(400).json({message:"Invalid User"})
            }
        const isPasswordCorrect =  await bcrypt.compare(password,user.password)
        if(!isPasswordCorrect){
            return req.status(400).json({message:"Invalid User"})
        }

        generateToken(user._id,res)
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        })
        
    }
    catch(error){
        console.log("Error in login controller in controllers/auth.controller",error.message);
        res.status(500).json({message:"Internal Error"});
    }
 };

export const logout = (req,res) => {
    try{
        res.cookie("jwt","",{maxAge:0}) // cookie name is jwt, it will not contain any value in it as user is logging out, maxAge=0 means it(cookie) will expire immediately
        res.status(200).json({message:"Logged out Succesfully"});
    }
    catch{
        console.log("Error in login out in controllers/auth.controller",error.message);
        res.status(500).json({message:"Internal Error"});
    }
};

export const updateProfile = async (req,res) =>{
  try {
     const {profilePic} = req.body;
     const userId = req.user._id;

     if(!profilePic){
        return res.status(400).json({message:"Profile pic needed"});
     }

     const uploadResponse = await cloudinary.uploader.upload(profilePic);

     const updatedUser = await NewUser.findByIdAndUpdate(
        userId,
        {profilePic:uploadResponse.secure_url},
        {new:true}
     );

     res.status(200).json(updatedUser)

  } catch (error) {

        console.log("error in profilr update controller: ",error);
        res.status(500).json({message:"internal error"})
  }
}

export const checkAuth = (req,res)=>{
    try {
         res.status(200).json(req.user);
    } catch (error) {
        console.log("error in check auth controller: ",error);
        res.status(500).json({message:"internal error"})
    }
}
 // These functions (signup, login, and logout) are referred to as controllers in web development because they control the logic for handling specific actions or requests in your application.        