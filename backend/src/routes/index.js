import express from "express";
import adapterRoutes from "./v1/adapter.routes.js";
import authRoutes from "./v1/auth.routes.js";

const router = express.Router();

router.get("/", async (req, res) => {
    res.json({ ok: true, message: "Trade Bot is running" });
});

router.use("/v1/adapters", adapterRoutes);
router.use("/v1/auth", authRoutes);

export { router };