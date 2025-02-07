import {v2 as cloudinary} from "cloudinary"
import {config} from 'dotenv'

config(); // calling config so that we can access .env variables

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
   api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

export default cloudinary;