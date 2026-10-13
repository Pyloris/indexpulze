import express from "express";
import authRoutes from "./v1/auth.routes.js";
import dataRoutes from "./v1/data.routes.js";
import webhookRoutes from "./v1/webhook.routes.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

import { metricsCollector } from "../websocket/core/MetricsCollector.js";

const router = express.Router();

router.get("/", async (req, res) => {
    res.json({ ok: true, message: "Trade Bot is running" });
});

router.get("/v1/metrics", async (req, res) => {
    res.json({
        ok: true,
        metrics: metricsCollector.getSnapshot()
    });
});

router.use("/v1/auth", authRoutes);
router.use("/v1/data", authMiddleware, dataRoutes);
router.use("/v1/webhooks", webhookRoutes);

export { router };