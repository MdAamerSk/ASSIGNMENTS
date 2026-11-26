import userModel from "../models/auth.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken, createRefreshToken, readRefreshToken } from "../utils/auth.utils.js";

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000 
};

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

        res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

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
              //  accessToken
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

export async function loginUser(req, res) {

    try{
        const { email, password } = req.body

    const user = await userModel.findOne({
        email
    })

    if (!user) {
        return res.status(401).json({
            message: "Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)

    if (!isPasswordValid) {
        return res.status(401).json({
            message: "Invalid email or password"
        })
    }

    const accessToken = createAccessToken({userId:user._id})

    const refreshToken = createRefreshToken({userId:user._id})

    res.cookie("refreshToken", refreshToken,COOKIE_OPTIONS)

    await userModel.findOneAndUpdate({
        email
    }, {
        refreshToken
    })

    res.status(200).json({
        message: "user loggedIn successfully",
        data: {
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            },
            accessToken
        }
    })
    }catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }

}

export async function refreshAccessToken(req, res) {

    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({
            message: "Refresh token is required."
        });
    }

    try {

        const decoded = readRefreshToken(refreshToken)

        const { userId } = decoded

        const user = await userModel.findById(userId)

        if (!user) {
            return res.status(401).json({
                message: "User not found."
            });
        }

        if (user.refreshToken !== refreshToken) {

            await userModel.findByIdAndUpdate(user._id, {
                refreshToken: null,
            })

            res.clearCookie("refreshToken",COOKIE_OPTIONS);

            return res.status(403).json({
                message: "Refresh token mismatch or reuse detected. Please log in again."
            });
        }

        const newRefreshToken = createRefreshToken({ userId })

        const newAccessToken = createAccessToken({ userId })

        res.cookie("refreshToken", newRefreshToken,COOKIE_OPTIONS)

        await userModel.findByIdAndUpdate(userId, { refreshToken: newRefreshToken })

        res.status(200).json({
            message: "Tokens rotated successfully.",
            data: {
                user: {
                    email: user.email,
                    name: user.name,
                    id: user._id
                },
                accessToken: newAccessToken
            }
        })

    }
    catch (err) {
        console.error("Refresh token error:", err.message);
        return res.status(401).json({
            message: "Invalid or expired refresh token.",
            error: err.message
        });
    }

}

export async function logoutUser(req, res) {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      
        await userModel.findOneAndUpdate(
            { refreshToken },
            { $set: { refreshToken: null } }
        );
    }
   
    res.clearCookie("refreshToken", COOKIE_OPTIONS);
    return res.status(200).json({
        message: "Logged out successfully"
    });
}