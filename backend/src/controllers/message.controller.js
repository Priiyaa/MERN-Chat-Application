import NewUser from "../models/newuser.models.js"
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";


export const getUsersForSideBar = async (req, res) => {
    try {
        console.log("USER IN CONTROLLER:", req.user); // Debugging log
        if (!req.user || !req.user._id) {
            return res.status(400).json({ error: "User data missing in request" });
        }

        const loggedInUserId = req.user._id; // Fix: Correct parameter order
        const filteredUsers = await NewUser.find({ _id: { $ne: loggedInUserId } }).select("-password"); // Fix: Use `_id` instead of `id`

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error in getUsersForSideBar:", error.message);
        return res.status(500).json({ error: "Internal server error" }); // Fix: Ensure `res.status()` is correctly used
    }
};

export const getMessages = async(req,res) =>{
try {
    const {id:userToChatId} = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
        $or:[
            {senderId:myId, receiverId:userToChatId},
            {senderId:userToChatId, receiverId:myId}
        ] 
    })

    res.status(200).json(messages);
} catch (error) {
    console.error("Error in getMessages: ", error.message);
    res.status(500).json({error:"Internal server error"});
        
}
}

export const sendMessage = async(req,res) =>{
    try {
        const{text,image}=req.body;
        const{id:receiverId}=req.params;
        const senderId=req.user._id;

        let imageUrl; 
        if(image){
            // upload base64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl=uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();
        // realtime functimality goes here => socket.io
        res.status(201).json(newMessage)

    } catch (error) {
        console.error("Error in sendMessage: ", error.message);
        res.status(500).json({error:"Internal server error"});
    }
}