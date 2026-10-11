# Scalable WebSocket Backend for Financial Trading Terminal

## Overview

The WebSocket subsystem provides high-throughput, low-latency, and multiplexed real-time financial market data delivery over a single persistent WebSocket connection (`/ws`).

It is designed to serve active index scalpers, quantitative prop desks, and institutional terminals with deterministic sub-millisecond local fan-out, robust backpressure management, structured error correlation, and clean separation between live streaming and QuestDB persistence.

---

## 1. Architectural Highlights

- **Single Endpoint Multiplexing**: Connect once to `wss://<host>/ws` and subscribe/unsubscribe from dozens of different symbols and stream categories (`market.tick`, `market.quote`, `market.candle`, `market.depth`, `index.analytics`) simultaneously.
- **Pluggable Event Distribution Adapter**:
  - `InMemoryDistributionAdapter`: Default zero-overhead in-process event bus for single-instance deployments.
  - `RedisDistributionAdapter`: Redis Pub/Sub cross-process distribution adapter ready for multi-instance gateway clusters behind a load balancer.
- **Pluggable Market Data Source**: `MarketDataProvider` abstract interface decouples broker/exchange ingestion feeds from client WebSocket delivery.
- **QuestDB Separation**: Live streaming events are routed directly through the distribution layer. QuestDB is reserved for historical queries, snapshot restoration, and analytical workloads rather than querying on every live tick.
- **Backpressure & Slow Client Detection**: Bounded outbound queues per connection. If a slow client's buffer exceeds 1MB or its queue saturates, the gateway invokes an explicit overload policy rather than memory-leaking the process.
- **Native Heartbeats**: Uses native WebSocket ping/pong frames alongside application-level `op: "ping"` diagnostics.

---

## 2. Directory Structure

```
backend/src/websocket/
├── WebSocketGateway.js           # Central gateway orchestrating connections, routers & lifecycle
├── core/
│   ├── ConnectionSession.js      # Per-connection state, quotas, rate limiting, bounded queues
│   ├── ConnectionManager.js      # Global connection tracking by session ID, WS, and user ID
│   ├── ConnectionAuthenticator.js# Upgrade and runtime JWT token authentication
│   └── MetricsCollector.js       # Real-time operational metrics & throughput collector
├── protocol/
│   ├── constants.js              # Event types, client ops, error codes & protocol version
│   ├── schemas.js                # Joi runtime validation schemas & channel syntax parser
│   ├── messages.js               # Structured envelope builders (ack, error, pong, events)
│   └── types.ts                  # Shared TypeScript protocol definitions for frontend & backend
├── subscription/
│   ├── ChannelRegistry.js        # Supported channel types, instrument whitelisting & validation
│   ├── AuthorizationService.js   # Instrument & user subscription permission checks
│   └── SubscriptionManager.js    # Channel-to-session routing tables & cleanup
├── routing/
│   ├── MessageRouter.js          # Inbound message validation & op multiplexer
│   └── MarketEventRouter.js      # Monotonic sequence generator & fan-out to subscribers
├── provider/
│   ├── MarketDataProvider.js     # Upstream provider abstract base class
│   └── SimulatedMarketDataProvider.js # Mock feed providing ticks, quotes, candles, depth, analytics
└── distribution/
    ├── InMemoryDistributionAdapter.js # Single-process event distribution
    └── RedisDistributionAdapter.js    # Horizontal scaling Redis Pub/Sub distribution
```

---

## 3. Channel Naming Convention

Channels follow the explicit structured pattern:

```
<prefix>:<symbol>[:<modifier>]
```

Supported prefixes:
- `market.tick:<symbol>` — Individual trade execution ticks (price, qty, side, tradeId).
- `market.quote:<symbol>` — Best bid/ask and spread quotes (bidPrice, bidQty, askPrice, askQty, lastPrice, volume).
- `market.candle:<symbol>:<timeframe>` — OHLCV candle updates (e.g. `market.candle:NIFTY:15m`). Supported timeframes: `1s`, `1m`, `5m`, `15m`, `1h`, `1d`.
- `market.depth:<symbol>` — Order book depth updates (bids & asks array with prices and quantities).
- `index.analytics:<symbol>` — Real-time computed index metrics (advances/declines, PCR, VAH, POC, VAL, heavyweight contribution delta).

---

## 4. Client Connection & Message Examples

### 4.1 Connecting

#### Option A: Handshake Query Parameter
```javascript
const ws = new WebSocket('ws://localhost:8088/ws?token=<YOUR_JWT_TOKEN>');
```

#### Option B: In-Band Authentication Message
```javascript
const ws = new WebSocket('ws://localhost:8088/ws');

// Immediately authenticate after connection open:
ws.send(JSON.stringify({
  op: "auth",
  requestId: "req-auth-01",
  token: "<YOUR_JWT_TOKEN>"
}));
```

### 4.2 Subscribing to Multiple Channels

```json
{
  "op": "subscribe",
  "requestId": "req-sub-001",
  "channels": [
    "market.tick:NIFTY",
    "market.quote:NIFTY",
    "market.candle:NIFTY:15m",
    "market.depth:NIFTY",
    "index.analytics:NIFTY"
  ]
}
```

**Server Acknowledgement (`subscription.ack`):**
```json
{
  "type": "subscription.ack",
  "version": 1,
  "requestId": "req-sub-001",
  "ts": 1789065006123,
  "results": [
    { "channel": "market.tick:NIFTY", "status": "subscribed" },
    { "channel": "market.quote:NIFTY", "status": "subscribed" },
    { "channel": "market.candle:NIFTY:15m", "status": "subscribed" },
    { "channel": "market.depth:NIFTY", "status": "subscribed" },
    { "channel": "index.analytics:NIFTY", "status": "subscribed" }
  ]
}
```

### 4.3 Streaming Market Data Event Envelope

```json
{
  "type": "market.tick",
  "version": 1,
  "symbol": "NIFTY",
  "ts": 1789065006123,
  "seq": 48291,
  "data": {
    "price": 24832.50,
    "quantity": 50,
    "tradeId": "TRD-48291",
    "side": "buy"
  }
}
```

### 4.4 Unsubscribing

```json
{
  "op": "unsubscribe",
  "requestId": "req-unsub-002",
  "channels": [
    "market.depth:NIFTY"
  ]
}
```

### 4.5 Ping / Pong

```json
{
  "op": "ping",
  "requestId": "ping-001"
}
```
**Response:**
```json
{
  "type": "connection.pong",
  "requestId": "ping-001",
  "ts": 1789065006125
}
```

---

## 5. Horizontal Scaling & Multi-Instance Architecture

When running multiple backend instances behind Nginx / AWS ALB:

1. **Configure Redis in `.env`**:
   ```env
   REDIS_HOST=127.0.0.1
   REDIS_PORT=6379
   REDIS_PASSWORD=
   ```
2. **Behavior**:
   - The gateway automatically detects `REDIS_HOST` and initializes `RedisDistributionAdapter`.
   - Each gateway node tracks only its **local WebSocket connections**.
   - When a local client subscribes to `market.tick:NIFTY`, the gateway node issues a single `SUBSCRIBE market.tick:NIFTY` to Redis.
   - When all local clients unsubscribe, the gateway issues `UNSUBSCRIBE market.tick:NIFTY` to Redis, avoiding redundant inter-process traffic.
   - Any market-data ingestion worker can publish events to Redis, and all listening gateway nodes forward them to their local clients.

---

## 6. Operational Observability

Inspect real-time metrics via HTTP endpoint:

```
GET /v1/metrics
```

**Response:**
```json
{
  "ok": true,
  "metrics": {
    "connections": {
      "active": 100,
      "total": 100,
      "closed": 0,
      "rejected": 0
    },
    "throughput": {
      "messagesIn": 100,
      "messagesOut": 2600,
      "bytesOut": 624000,
      "eventsProcessed": 2600,
      "eventsDroppedSlowClient": 0
    },
    "subscriptions": {
      "totalActive": 500,
      "uniqueChannels": 5
    },
    "security": {
      "authFailures": 0,
      "errorsTotal": 0
    }
  }
}
```

---

## 7. Running Tests & Benchmarks

Run the automated integration test suite:
```bash
npm test
# or
npm run test:ws
```

Run the high-concurrency throughput benchmark:
```bash
npm run benchmark:ws
```
