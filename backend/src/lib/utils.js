import jwt from "jsonwebtoken"
export const generateToken =(userId,res)=>{
 const token = jwt.sign({userId},process.env.JWT_SECRET,{
    expiresIn:"7d"
 })   

  res.cookie("jwt",token,{
    maxAge : 7*24*60*60*100, //milli seconds
    httponly:true, // can no be accessed by JS. prevent Xss attack cross site scripting attacks
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development", // its true if we are in production, so the site will be https. For development it will be http
 })

 return token;
}