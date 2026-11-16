import userModel from "../models/auth.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken, createRefreshToken } from "../utils/auth.utils.js";

export async function registerUser(req, res) {
    try {
        const { name, email, password } = req.body;

        const userAlreadyExist = await userModel.findOne({ email });

        if (userAlreadyExist) {
            return res.status(409).json({
                message: "user already exist",
            });
        }

        const user = await userModel.create({
            name,
            email,
            passwordHash: await bcrypt.hash(password, 10)
        });

        const accessToken = createAccessToken({
            userId: user._id
        });

        const refreshToken = createRefreshToken({
            userId: user._id
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
        });

        await userModel.findByIdAndUpdate(user._id, {
            refreshToken
        });

        res.status(201).json({
            message: "User register successfully",
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                },
            }
        });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}
