import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        fullName: {
            type: String,
            required: true,
            unique: true,
            
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        profilePic: {
            type: String,
            default: "",
        },
    },
     {timestamps: true}
);
const User = mongoose.model("User",userSchema); // We created a model 'User' which uses userSchema
// 'User' - > Model name should have first letter capital and the name should be singular
export default User; 