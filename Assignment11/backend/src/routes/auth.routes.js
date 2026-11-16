import { Router } from "express";
import { registerValidator } from "../validators/auth.validator.js";
import { registerUser } from "../controllers/auth.controller.js";

const router =Router()

router.post("/register",registerValidator,registerUser)

export default router
