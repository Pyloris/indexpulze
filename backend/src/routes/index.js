import express from "express";
import authRoutes from "./v1/auth.routes.js";
import dataRoutes from "./v1/data.routes.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
    res.json({ ok: true, message: "Trade Bot is running" });
});

router.use("/v1/auth", authRoutes);
router.use("/v1/data", authMiddleware, dataRoutes);

export { router };