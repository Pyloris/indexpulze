import mongoose from "mongoose";

const { Schema, model } = mongoose;

const schema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    full_name: { type: String },
    profile_picture: { type: String }
}, { timestamps: true });

export const User = model("users", schema);
