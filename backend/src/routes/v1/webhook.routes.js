import express from "express";
import { WebhookController } from "../../controllers/webhook.controller.js";

const router = express.Router();

router
    .route("/fyers")
    .post(WebhookController.handleFyersWebhook)
    .get(WebhookController.verifyFyersWebhook);

export default router;
