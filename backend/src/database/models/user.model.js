import mongoose from "mongoose";

const { Schema, model } = mongoose;

const schema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { timestamps: true });

export const User = model("users", schema);
