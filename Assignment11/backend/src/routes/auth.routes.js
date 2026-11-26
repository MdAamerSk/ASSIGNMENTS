import { Router } from "express";
import { registerValidator,loginValidator } from "../validators/auth.validator.js";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router =Router()

router.post("/register",registerValidator,registerUser)

router.post("/login",loginValidator,loginUser)

router.post("/refresh-token",refreshAccessToken)

router.post("/logout",logoutUser)

router.get("/profile", authenticate, (req, res) => {
    res.status(200).json({
        message: "You accessed a protected route!",
        user: req.user
    });
});

export default router
