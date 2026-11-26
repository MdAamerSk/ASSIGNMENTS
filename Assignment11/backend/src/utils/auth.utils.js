import jwt from "jsonwebtoken";
import config from "../config/config.js";

export function createAccessToken(payload) {
    const accessToken = jwt.sign(
        payload,
        config.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
    );
    return accessToken;
}

export function createRefreshToken(payload) {
    const refreshToken = jwt.sign(
        payload,
        config.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    );
    return refreshToken;
}

export function readAccessToken(accessToken){
    return jwt.verify(accessToken,config.ACCESS_TOKEN_SECRET)
}

export function readRefreshToken(refreshToken) {
    return jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET)
}