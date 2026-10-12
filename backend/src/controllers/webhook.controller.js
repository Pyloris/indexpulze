import { WebhookService } from "../services/webhook.service.js";
import { catchError } from "../errors/catch-error.js";
import { ApiResponse } from "../utils/api-response.js";

export class WebhookController {
    /**
     * Handle incoming Fyers webhook POST request
     */
    static handleFyersWebhook = catchError(async (req, res, next) => {
        const payload = req.body || {};
        const headers = req.headers || {};

        const result = await WebhookService.processFyersWebhook(payload, headers);

        return ApiResponse.success(res, result, "Fyers webhook received and processed successfully");
    });

    /**
     * Handle GET request for endpoint verification / ping
     */
    static verifyFyersWebhook = catchError(async (req, res, next) => {
        return ApiResponse.success(
            res,
            {
                active: true,
                provider: "fyers",
                timestamp: new Date().toISOString()
            },
            "Fyers webhook endpoint is active and listening"
        );
    });
}
