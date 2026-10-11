import assert from 'assert';
import http from 'http';
import express from 'express';
import jwt from 'jsonwebtoken';
import { WebSocket } from 'ws';
import { WebSocketGateway } from '../websocket/WebSocketGateway.js';
import { appConfig } from '../config/app-config.js';
import { ClientOps, ServerEventTypes, ErrorCodes } from '../websocket/protocol/constants.js';

const TEST_PORT = 8999;
const JWT_SECRET = appConfig.JWT_SECRET;

function createTestToken(user = { id: 'usr-101', username: 'trader_pro' }) {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });
}

function waitForMessage(ws, predicate, timeoutMs = 4000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      ws.off('message', handler);
      reject(new Error(`Timeout waiting for message matching predicate (${timeoutMs}ms)`));
    }, timeoutMs);

    function handler(raw) {
      try {
        const parsed = JSON.parse(raw.toString());
        if (predicate(parsed)) {
          clearTimeout(timer);
          ws.off('message', handler);
          resolve(parsed);
        }
      } catch (err) {
        // ignore parse error during filtering
      }
    }

    ws.on('message', handler);
  });
}

async function runTestSuite() {
  console.log('--- Starting WebSocket Test Suite ---');
  let testsPassed = 0;
  let testsFailed = 0;

  // Setup test server
  const app = express();
  const server = http.createServer(app);
  const gateway = new WebSocketGateway({
    path: '/ws',
    heartbeatIntervalMs: 5000,
    clientIdleTimeoutMs: 10000,
    maxSubscriptionsPerConn: 10,
    maxOpsPerSecond: 100
  });

  await gateway.initialize(server);

  await new Promise((resolve) => server.listen(TEST_PORT, resolve));
  const validToken = createTestToken();

  async function test(name, fn) {
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      testsPassed++;
    } catch (err) {
      console.error(`[FAIL] ${name}:`, err.message);
      testsFailed++;
    }
  }

  try {
    // 1. Connection and Handshake Authentication
    await test('1. Successful connection and authentication during upgrade', async () => {
      const ws = new WebSocket(`ws://127.0.0.1:${TEST_PORT}/ws?token=${validToken}`);
      const ack = await waitForMessage(ws, m => m.type === ServerEventTypes.CONNECTION_ACK);
      assert.strictEqual(ack.type, 'connection.ack');
      assert.strictEqual(ack.user.username, 'trader_pro');
      assert(ack.connectionId);
      ws.close();
    });

    // 2. Reject unauthorized subscriptions when connected without token
    await test('2. Rejection of subscriptions on unauthenticated connection', async () => {
      const ws = new WebSocket(`ws://127.0.0.1:${TEST_PORT}/ws`);
      await waitForMessage(ws, m => m.type === ServerEventTypes.CONNECTION_ACK);

      ws.send(JSON.stringify({
        op: ClientOps.SUBSCRIBE,
        requestId: 'req-unauth',
        channels: ['market.tick:NIFTY']
      }));

      const err = await waitForMessage(ws, m => m.type === ServerEventTypes.SYSTEM_ERROR);
      assert.strictEqual(err.error.code, ErrorCodes.UNAUTHORIZED);
      ws.close();
    });

    // 3. Application-level Auth Op
    await test('3. In-band authentication via op: "auth"', async () => {
      const ws = new WebSocket(`ws://127.0.0.1:${TEST_PORT}/ws`);
      await waitForMessage(ws, m => m.type === ServerEventTypes.CONNECTION_ACK);

      ws.send(JSON.stringify({
        op: ClientOps.AUTH,
        requestId: 'req-auth-1',
        token: validToken
      }));

      const authAck = await waitForMessage(ws, m => m.type === 'auth.ack');
      assert.strictEqual(authAck.user.username, 'trader_pro');
      ws.close();
    });

    // 4. Ping and Pong Correlation
    await test('4. Correct application ping/pong with requestId correlation', async () => {
      const ws = new WebSocket(`ws://127.0.0.1:${TEST_PORT}/ws?token=${validToken}`);
      await waitForMessage(ws, m => m.type === ServerEventTypes.CONNECTION_ACK);

      ws.send(JSON.stringify({
        op: ClientOps.PING,
        requestId: 'ping-999'
      }));

      const pong = await waitForMessage(ws, m => m.type === ServerEventTypes.CONNECTION_PONG);
      assert.strictEqual(pong.requestId, 'ping-999');
      assert(pong.ts > 0);
      ws.close();
    });

    // 5. Multiple subscriptions on one connection & Partial success
    await test('5. Multi-channel subscription with partial success/failure', async () => {
      const ws = new WebSocket(`ws://127.0.0.1:${TEST_PORT}/ws?token=${validToken}`);
      await waitForMessage(ws, m => m.type === ServerEventTypes.CONNECTION_ACK);

      ws.send(JSON.stringify({
        op: ClientOps.SUBSCRIBE,
        requestId: 'sub-multi-1',
        channels: [
          'market.tick:NIFTY',
          'market.quote:RELIANCE',
          'market.tick:UNKNOWN_CO'
        ]
      }));

      const ack = await waitForMessage(ws, m => m.type === ServerEventTypes.SUBSCRIPTION_ACK);
      assert.strictEqual(ack.requestId, 'sub-multi-1');
      assert.strictEqual(ack.results.length, 3);

      const niftyRes = ack.results.find(r => r.channel === 'market.tick:NIFTY');
      const reliRes = ack.results.find(r => r.channel === 'market.quote:RELIANCE');
      const unkRes = ack.results.find(r => r.channel === 'market.tick:UNKNOWN_CO');

      assert.strictEqual(niftyRes.status, 'subscribed');
      assert.strictEqual(reliRes.status, 'subscribed');
      assert.strictEqual(unkRes.status, 'rejected');
      assert.strictEqual(unkRes.code, ErrorCodes.UNKNOWN_INSTRUMENT);

      ws.close();
    });

    // 6. Delivery of typed market events to subscribed client
    await test('6. Delivery of typed market.tick event with sequence semantics', async () => {
      const ws = new WebSocket(`ws://127.0.0.1:${TEST_PORT}/ws?token=${validToken}`);
      await waitForMessage(ws, m => m.type === ServerEventTypes.CONNECTION_ACK);

      ws.send(JSON.stringify({
        op: ClientOps.SUBSCRIBE,
        requestId: 'sub-tick',
        channels: ['market.tick:NIFTY']
      }));

      await waitForMessage(ws, m => m.type === ServerEventTypes.SUBSCRIPTION_ACK);

      // Await live incoming tick
      const tick = await waitForMessage(ws, m => m.type === ServerEventTypes.MARKET_TICK && m.symbol === 'NIFTY');
      assert.strictEqual(tick.type, 'market.tick');
      assert.strictEqual(tick.symbol, 'NIFTY');
      assert(tick.seq > 0);
      assert(tick.data.price > 0);
      assert(tick.data.quantity > 0);

      ws.close();
    });

    // 7. Unsubscribe without affecting other subscriptions
    await test('7. Independent unsubscription without affecting remaining channels', async () => {
      const ws = new WebSocket(`ws://127.0.0.1:${TEST_PORT}/ws?token=${validToken}`);
      await waitForMessage(ws, m => m.type === ServerEventTypes.CONNECTION_ACK);

      // Subscribe both NIFTY and RELIANCE
      ws.send(JSON.stringify({
        op: ClientOps.SUBSCRIBE,
        requestId: 'sub-two',
        channels: ['market.tick:NIFTY', 'market.tick:RELIANCE']
      }));
      await waitForMessage(ws, m => m.type === ServerEventTypes.SUBSCRIPTION_ACK);

      // Unsubscribe only RELIANCE
      ws.send(JSON.stringify({
        op: ClientOps.UNSUBSCRIBE,
        requestId: 'unsub-reli',
        channels: ['market.tick:RELIANCE']
      }));

      const unsubAck = await waitForMessage(ws, m => m.type === ServerEventTypes.SUBSCRIPTION_ACK && m.requestId === 'unsub-reli');
      assert.strictEqual(unsubAck.results[0].status, 'unsubscribed');

      // Verify list of subscriptions has NIFTY remaining
      ws.send(JSON.stringify({
        op: ClientOps.LIST_SUBSCRIPTIONS,
        requestId: 'list-1'
      }));

      const listRes = await waitForMessage(ws, m => m.type === 'subscriptions.list');
      assert(listRes.channels.includes('market.tick:NIFTY'));
      assert(!listRes.channels.includes('market.tick:RELIANCE'));

      ws.close();
    });

    // 8. Handling Malformed JSON
    await test('8. Resilient handling of malformed JSON with BAD_REQUEST error', async () => {
      const ws = new WebSocket(`ws://127.0.0.1:${TEST_PORT}/ws?token=${validToken}`);
      await waitForMessage(ws, m => m.type === ServerEventTypes.CONNECTION_ACK);

      ws.send('{ invalid json payload');

      const err = await waitForMessage(ws, m => m.type === ServerEventTypes.SYSTEM_ERROR);
      assert.strictEqual(err.error.code, ErrorCodes.BAD_REQUEST);
      ws.close();
    });

    // 9. Enforcing subscription limits
    await test('9. Subscription quota limit enforcement', async () => {
      const ws = new WebSocket(`ws://127.0.0.1:${TEST_PORT}/ws?token=${validToken}`);
      await waitForMessage(ws, m => m.type === ServerEventTypes.CONNECTION_ACK);

      // Attempt to subscribe 12 channels (limit is 10)
      const excessiveChannels = [
        'market.tick:NIFTY', 'market.quote:NIFTY', 'market.depth:NIFTY',
        'market.tick:BANKNIFTY', 'market.quote:BANKNIFTY', 'market.depth:BANKNIFTY',
        'market.tick:RELIANCE', 'market.quote:RELIANCE', 'market.depth:RELIANCE',
        'market.tick:HDFCBANK', 'market.quote:HDFCBANK', 'market.depth:HDFCBANK'
      ];

      ws.send(JSON.stringify({
        op: ClientOps.SUBSCRIBE,
        requestId: 'sub-limit',
        channels: excessiveChannels
      }));

      const ack = await waitForMessage(ws, m => m.type === ServerEventTypes.SUBSCRIPTION_ACK && m.requestId === 'sub-limit');
      const rejected = ack.results.filter(r => r.status === 'rejected' && r.code === ErrorCodes.SUBSCRIPTION_LIMIT_EXCEEDED);
      assert(rejected.length >= 2, 'Expected at least 2 channels to be rejected by limit quota');
      ws.close();
    });

  } finally {
    await gateway.shutdown();
    server.close();
  }

  console.log(`\nTest Summary: ${testsPassed} passed, ${testsFailed} failed.`);
  if (testsFailed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
