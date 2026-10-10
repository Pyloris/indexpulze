import { WebSocketServer } from 'ws';
import fs from 'fs';
import path from 'path';

const setupWebsockets = (server) => {
  const wss = new WebSocketServer({ noServer: true });
  const clients = new Set();

  server.on('upgrade', (request, socket, head) => {
    const host = request.headers.host || 'localhost';
    const urlString = `http://${host}${request.url}`;
    const pathname = new URL(urlString).pathname;

    if (pathname === '/ws') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    } else {
      socket.destroy();
    }
  });

  wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('Terminal connected via WebSocket.');

    ws.on('message', (message) => {
      console.log('Received via WS:', message.toString());
    });

    ws.on('close', () => {
      clients.delete(ws);
    });
  });

  // Broadcast simulated live ticks
  let currentBar = null;
  try {
    const mockFilePath = path.join(process.cwd(), 'src/mock/ticker-data-any-symbol.json');
    const fileContent = fs.readFileSync(mockFilePath, 'utf-8');
    const mockData = JSON.parse(fileContent).data;
    if (mockData && mockData.length > 0) {
      currentBar = { ...mockData[mockData.length - 1] };
    }
  } catch (err) {
    console.error('Failed to load initial mock data for WS:', err);
  }

  if (currentBar) {
    setInterval(() => {
      // Simulate real-time tick update on the last bar
      const tick = (Math.random() - 0.5) * 10;
      currentBar.close = Number((currentBar.close + tick).toFixed(2));
      currentBar.high = Math.max(currentBar.high, currentBar.close);
      currentBar.low = Math.min(currentBar.low, currentBar.close);
      currentBar.volume += Math.floor(Math.random() * 50);

      // occasionally roll over to a new bar
      if (Math.random() > 0.95) {
         currentBar = {
           timestamp: currentBar.timestamp + 900,
           open: currentBar.close,
           high: currentBar.close,
           low: currentBar.close,
           close: currentBar.close,
           volume: Math.floor(Math.random() * 1000)
         };
      }

      const payload = JSON.stringify({
        type: 'TICKER',
        symbol: 'NIFTY_50',
        data: currentBar
      });

      clients.forEach(client => {
        if (client.readyState === 1) { // OPEN
          client.send(payload);
        }
      });
    }, 1000); // 1 tick per second
  }
};

export default setupWebsockets;
