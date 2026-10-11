import fs from 'fs/promises';
import path from 'path';

export class WebsocketService {
  /** @type {Set<import('ws').WebSocket>} */
  static clients = new Set();
  /** @type {NodeJS.Timeout|null} */
  static tickInterval = null;
  /** @type {any|null} */
  static currentBar = null;

  /**
   * Register a new connected WebSocket client
   * @param {import('ws').WebSocket} ws
   * @param {import('http').IncomingMessage} request
   */
  static async handleConnection(ws, request) {
    this.clients.add(ws);
    console.log(`[WebSocket] Terminal client connected. Total clients: ${this.clients.size}`);

    // Send immediate initial handshake/state
    if (this.currentBar) {
      ws.send(JSON.stringify({
        type: 'INITIAL_STATE',
        symbol: 'NIFTY_50',
        data: this.currentBar
      }));
    }

    // Message handler
    ws.on('message', async (message) => {
      await this.handleMessage(ws, message);
    });

    // Error handler
    ws.on('error', (err) => {
      console.error('[WebSocket] Client error:', err);
    });

    // Disconnect handler
    ws.on('close', () => {
      this.clients.delete(ws);
      console.log(`[WebSocket] Client disconnected. Total clients: ${this.clients.size}`);
    });
  }

  /**
   * Handle incoming messages from connected clients asynchronously
   * @param {import('ws').WebSocket} ws
   * @param {import('ws').RawData} message
   */
  static async handleMessage(ws, message) {
    try {
      const parsed = JSON.parse(message.toString());
      console.log('[WebSocket] Received message:', parsed);

      // Handle subscription / ping / custom command events
      if (parsed.type === 'PING') {
        ws.send(JSON.stringify({ type: 'PONG', timestamp: Date.now() }));
      } else if (parsed.type === 'SUBSCRIBE') {
        ws.send(JSON.stringify({
          type: 'SUBSCRIBED',
          symbol: parsed.symbol || 'NIFTY_50',
          data: this.currentBar
        }));
      }
    } catch (err) {
      console.log('[WebSocket] Raw message received:', message.toString());
    }
  }

  /**
   * Broadcast payload to all open clients
   * @param {any} payload
   */
  static broadcast(payload) {
    const serialized = typeof payload === 'string' ? payload : JSON.stringify(payload);
    for (const client of this.clients) {
      if (client.readyState === 1) { // WebSocket.OPEN
        client.send(serialized);
      }
    }
  }

  /**
   * Initialize and start the market ticker simulation loop asynchronously
   */
  static async startMarketSimulation() {
    if (this.tickInterval) return;

    try {
      const mockFilePath = path.join(process.cwd(), 'src/mock/ticker-data-any-symbol.json');
      const fileContent = await fs.readFile(mockFilePath, 'utf-8');
      const mockData = JSON.parse(fileContent).data;
      if (mockData && mockData.length > 0) {
        this.currentBar = { ...mockData[mockData.length - 1] };
      }
    } catch (err) {
      console.error('[WebSocket] Failed to load initial mock data for ticker:', err);
      // Fallback initial bar if file read fails
      this.currentBar = {
        timestamp: Math.floor(Date.now() / 1000),
        open: 24800,
        high: 24850,
        low: 24780,
        close: 24832,
        volume: 1200
      };
    }

    this.tickInterval = setInterval(() => {
      if (!this.currentBar) return;

      const tick = (Math.random() - 0.49) * 10;
      this.currentBar.close = Number((this.currentBar.close + tick).toFixed(2));
      this.currentBar.high = Math.max(this.currentBar.high, this.currentBar.close);
      this.currentBar.low = Math.min(this.currentBar.low, this.currentBar.close);
      this.currentBar.volume += Math.floor(Math.random() * 50);

      // Occasionally advance to a new bar (15-min interval = 900s)
      if (Math.random() > 0.95) {
        this.currentBar = {
          timestamp: this.currentBar.timestamp + 900,
          open: this.currentBar.close,
          high: this.currentBar.close,
          low: this.currentBar.close,
          close: this.currentBar.close,
          volume: Math.floor(Math.random() * 1000)
        };
      }

      this.broadcast({
        type: 'TICKER',
        symbol: 'NIFTY_50',
        data: this.currentBar
      });
    }, 1000);
  }

  /**
   * Stop market simulation
   */
  static stopMarketSimulation() {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }

  /**
   * Total active connections count
   */
  static getActiveClientsCount() {
    return this.clients.size;
  }
}
