import http from 'http';
import express from 'express';
import jwt from 'jsonwebtoken';
import { WebSocket } from 'ws';
import { WebSocketGateway } from '../websocket/WebSocketGateway.js';
import { appConfig } from '../config/app-config.js';
import { ClientOps, ServerEventTypes } from '../websocket/protocol/constants.js';

const BENCHMARK_PORT = 9111;
const NUM_CLIENTS = 100;
const DURATION_SECONDS = 5;

function createTestToken(id) {
  return jwt.sign({ id: `bench-user-${id}`, username: `bench_${id}` }, appConfig.JWT_SECRET, { expiresIn: '1h' });
}

async function runBenchmark() {
  console.log(`\n======================================================`);
  console.log(`  WebSocket Gateway High-Throughput Benchmark`);
  console.log(`  Clients: ${NUM_CLIENTS} | Duration: ${DURATION_SECONDS}s`);
  console.log(`======================================================\n`);

  const app = express();
  const server = http.createServer(app);
  const gateway = new WebSocketGateway({
    path: '/ws',
    heartbeatIntervalMs: 60000,
    clientIdleTimeoutMs: 120000,
    maxSubscriptionsPerConn: 50,
    maxOpsPerSecond: 200
  });

  await gateway.initialize(server);
  await new Promise(r => server.listen(BENCHMARK_PORT, r));

  const startMem = process.memoryUsage();
  let totalEventsReceived = 0;
  const clients = [];

  const connectStartTime = Date.now();

  for (let i = 0; i < NUM_CLIENTS; i++) {
    const token = createTestToken(i);
    const ws = new WebSocket(`ws://127.0.0.1:${BENCHMARK_PORT}/ws?token=${token}`);

    await new Promise((resolve) => {
      ws.on('open', resolve);
    });

    ws.on('message', (data) => {
      totalEventsReceived++;
    });

    // Subscribe to multiple market streams
    ws.send(JSON.stringify({
      op: ClientOps.SUBSCRIBE,
      requestId: `bench-sub-${i}`,
      channels: [
        'market.tick:NIFTY',
        'market.quote:NIFTY',
        'market.candle:NIFTY:15m',
        'market.depth:NIFTY',
        'index.analytics:NIFTY'
      ]
    }));

    clients.push(ws);
  }

  const connectDuration = (Date.now() - connectStartTime) / 1000;
  console.log(`[Benchmark] ${NUM_CLIENTS} concurrent clients connected & subscribed in ${connectDuration.toFixed(2)}s.`);

  // Stream events for DURATION_SECONDS
  console.log(`[Benchmark] Streaming market events across all active multiplexed sessions...`);
  await new Promise(r => setTimeout(r, DURATION_SECONDS * 1000));

  const endMem = process.memoryUsage();
  const eventsPerSec = Math.round(totalEventsReceived / DURATION_SECONDS);
  const heapDiffMb = Math.round((endMem.heapUsed - startMem.heapUsed) / (1024 * 1024));

  console.log(`\n---------------- Results ----------------`);
  console.log(`Total Events Delivered:     ${totalEventsReceived.toLocaleString()}`);
  console.log(`Delivery Throughput:        ${eventsPerSec.toLocaleString()} events/sec`);
  console.log(`Active Connected Clients:   ${NUM_CLIENTS}`);
  console.log(`Heap Delta:                 ${heapDiffMb >= 0 ? '+' : ''}${heapDiffMb} MB`);
  console.log(`Heap Used Total:            ${Math.round(endMem.heapUsed / (1024 * 1024))} MB`);
  console.log(`RSS Memory:                 ${Math.round(endMem.rss / (1024 * 1024))} MB`);
  console.log(`-----------------------------------------\n`);

  // Teardown
  for (const c of clients) {
    c.close();
  }
  await gateway.shutdown();
  server.close();
  console.log(`[Benchmark] Teardown clean. Benchmark finished successfully.\n`);
}

runBenchmark().catch(err => {
  console.error('Benchmark error:', err);
  process.exit(1);
});
