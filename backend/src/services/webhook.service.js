import { WebsocketService } from "./websocket.service.js";

/**
 * Fyers Order Status Mapping
 */
export const FYERS_ORDER_STATUS = {
    1: "CANCELLED",
    2: "TRADED",
    4: "TRANSIT",
    5: "REJECTED",
    6: "PENDING",
};

export class WebhookService {
    /**
     * Process incoming Fyers Webhook / Postback update
     * @param {Object} payload - The webhook body received from Fyers
     * @param {Object} [headers] - Request headers
     * @returns {Promise<Object>}
     */
    static async processFyersWebhook(payload = {}, headers = {}) {
        const receivedAt = new Date().toISOString();

        console.log(`[WebhookService] Received Fyers Webhook at ${receivedAt}:`, JSON.stringify(payload, null, 2));

        // Determine event type based on payload attributes
        let eventType = "UNKNOWN";
        let statusDescription = "UNKNOWN";

        if (payload.status !== undefined) {
            eventType = "ORDER_UPDATE";
            statusDescription = FYERS_ORDER_STATUS[payload.status] || `STATUS_${payload.status}`;
        } else if (payload.action || payload.ticker) {
            eventType = "TRADE_SIGNAL";
        } else if (payload.trade_price !== undefined || payload.tradedPrice !== undefined) {
            eventType = "TRADE_EXECUTION";
        }

        const processedData = {
            eventType,
            statusDescription,
            orderId: payload.id || payload.orderId || payload.order_id || null,
            symbol: payload.symbol || payload.ticker || null,
            qty: payload.qty || payload.quantity || 0,
            filledQty: payload.filledQty || payload.filled_qty || 0,
            price: payload.tradedPrice || payload.trade_price || payload.price || 0,
            rawPayload: payload,
            receivedAt,
        };

        // Broadcast webhook event to connected WebSocket clients if any
        try {
            // WebsocketService.broadcast({
            //     type: "FYERS_WEBHOOK_EVENT",
            //     data: processedData,
            // });
            //TODO: Broadcast webhook to connected WebSocket clients if any
        } catch (wsError) {
            console.error("[WebhookService] Error broadcasting webhook to WebSocket clients:", wsError);
        }

        return {
            processed: true,
            eventType,
            orderId: processedData.orderId,
            symbol: processedData.symbol,
            status: statusDescription,
            receivedAt,
        };
    }
}
