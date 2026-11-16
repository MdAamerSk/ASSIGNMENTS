import mongoose from "mongoose"
import config from "./config.js";

export async function connectDB() {
    try {
        await mongoose.connect(config.MONGO_URI);
        console.log("connected to DB")
    }
    catch(err) {
        console.log("connection to db failed", err)
    }
}