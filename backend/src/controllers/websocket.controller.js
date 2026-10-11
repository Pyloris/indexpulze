import { getWebSocketGateway } from '../setup/setup-websockets.js';

export class WebsocketController {
  /**
   * HTTP upgrade handler
   */
  static async handleUpgrade(wss, request, socket, head) {
    const gateway = getWebSocketGateway();
    if (gateway) {
      gateway.handleUpgrade(request, socket, head);
    } else {
      socket.destroy();
    }
  }

  /**
   * WS connection handler
   */
  static async handleConnection(ws, request) {
    const gateway = getWebSocketGateway();
    if (gateway) {
      gateway.handleConnection(ws, request);
    }
  }
}
