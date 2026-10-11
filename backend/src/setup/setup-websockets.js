import { WebSocketGateway } from '../websocket/WebSocketGateway.js';
import { appConfig } from '../config/app-config.js';

let activeGateway = null;

export const setupWebsockets = async (server) => {
  if (activeGateway) {
    return activeGateway;
  }

  activeGateway = new WebSocketGateway({
    path: appConfig.WS_PATH || '/ws',
    heartbeatIntervalMs: appConfig.WS_HEARTBEAT_MS || 30000,
    maxSubscriptionsPerConn: appConfig.WS_MAX_SUBSCRIPTIONS || 100
  });

  await activeGateway.initialize(server);
  return activeGateway;
};

export const getWebSocketGateway = () => activeGateway;

export default setupWebsockets;
