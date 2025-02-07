
import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import cookieParser from "cookie-parser"
import { connect } from "mongoose";
import {connectDB} from "./lib/db.js"


dotenv.config(); // Loads .env file contents into process.env.

const app = express();


const PORT=process.env.PORT

app.use(express.json()); // middleware : this will extract the JSON data out of the body.
app.use(cookieParser()); // allow u to parse cookie

app.use("/api/auth",authRoutes) // Sets up a route for authentication APIs under /api/auth
app.use("/api/message",messageRoutes)


app.listen(PORT,()=>{
    console.log("server is running on port "+PORT)
    connectDB() // Calls connectDB() to establish a database connection.
})
