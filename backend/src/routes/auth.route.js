import express from "express";
import {login,logout,signup,updateProfile,checkAuth } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router(); // Router: The router defines the route and maps it to the appropriate controller.

router.post("/signup", signup)
router.post("/login",login )
router.post("/logout", logout)

// put method because we are updating profile
// protectRoute -> middleware as we will first check if the user is authenticated or not.
// if authenticated then we weill call updateProfile function
router.put("/update-profile", protectRoute, updateProfile) 
router.get("/check", protectRoute, checkAuth)


export default router;

// POST requests are used to send data to the server, such as user credentials (e.g., username, password) during signup or login. This data is included in the body of the request.
// GET requests are designed for retrieving data and should not be used to modify or submit sensitive information.