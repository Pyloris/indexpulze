/**
 * @file TypeScript Protocol Definitions for Financial Trading Terminal WebSocket
 * Can be shared or copied directly into the frontend.
 */

export const WS_PROTOCOL_VERSION = 1;

export type ClientOp = 
  | 'subscribe'
  | 'unsubscribe'
  | 'ping'
  | 'auth'
  | 'list_subscriptions'
  | 'resync';

export interface ClientEnvelopeBase {
  op: ClientOp;
  requestId?: string;
}

export interface SubscribeMessage extends ClientEnvelopeBase {
  op: 'subscribe';
  requestId: string;
  channels: string[];
}

export interface UnsubscribeMessage extends ClientEnvelopeBase {
  op: 'unsubscribe';
  requestId: string;
  channels: string[];
}

export interface PingMessage extends ClientEnvelopeBase {
  op: 'ping';
  requestId?: string;
}

export interface AuthMessage extends ClientEnvelopeBase {
  op: 'auth';
  requestId?: string;
  token: string;
}

export interface ListSubscriptionsMessage extends ClientEnvelopeBase {
  op: 'list_subscriptions';
  requestId: string;
}

export interface ResyncMessage extends ClientEnvelopeBase {
  op: 'resync';
  requestId: string;
  channel: string;
  fromSeq?: number;
}

export type ClientMessage =
  | SubscribeMessage
  | UnsubscribeMessage
  | PingMessage
  | AuthMessage
  | ListSubscriptionsMessage
  | ResyncMessage;

// ======================== SERVER EVENTS ========================

export type ServerEventType =
  | 'connection.ack'
  | 'connection.pong'
  | 'subscription.ack'
  | 'subscription.error'
  | 'system.error'
  | 'market.resync.required'
  | 'market.tick'
  | 'market.quote'
  | 'market.candle'
  | 'market.depth'
  | 'market.snapshot'
  | 'index.analytics';

export interface ServerEnvelopeBase {
  type: ServerEventType;
  version: number;
  ts: number;
}

export interface ConnectionAckEvent extends ServerEnvelopeBase {
  type: 'connection.ack';
  connectionId: string;
  user: { id: string; username: string } | null;
  limits: {
    maxSubscriptions: number;
    rateLimitPerSecond: number;
  };
}

export interface ConnectionPongEvent extends ServerEnvelopeBase {
  type: 'connection.pong';
  requestId: string | null;
}

export interface SubscriptionResult {
  channel: string;
  status: 'subscribed' | 'unsubscribed' | 'rejected';
  code?: string;
  message?: string;
}

export interface SubscriptionAckEvent extends ServerEnvelopeBase {
  type: 'subscription.ack';
  requestId: string;
  results: SubscriptionResult[];
}

export interface SystemErrorEvent extends ServerEnvelopeBase {
  type: 'system.error';
  requestId: string | null;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface MarketTickData {
  price: number;
  quantity: number;
  tradeId?: string;
  side?: 'buy' | 'sell';
}

export interface MarketTickEvent extends ServerEnvelopeBase {
  type: 'market.tick';
  symbol: string;
  seq: number;
  data: MarketTickData;
}

export interface MarketQuoteData {
  bidPrice: number;
  bidQuantity: number;
  askPrice: number;
  askQuantity: number;
  lastPrice: number;
  totalVolume: number;
}

export interface MarketQuoteEvent extends ServerEnvelopeBase {
  type: 'market.quote';
  symbol: string;
  seq: number;
  data: MarketQuoteData;
}

export interface MarketCandleData {
  timeframe: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  isFinal: boolean;
}

export interface MarketCandleEvent extends ServerEnvelopeBase {
  type: 'market.candle';
  symbol: string;
  seq: number;
  data: MarketCandleData;
}

export interface OrderBookLevel {
  price: number;
  quantity: number;
  ordersCount?: number;
}

export interface MarketDepthData {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  isSnapshot: boolean;
}

export interface MarketDepthEvent extends ServerEnvelopeBase {
  type: 'market.depth';
  symbol: string;
  seq: number;
  data: MarketDepthData;
}

export interface IndexAnalyticsData {
  advances: number;
  declines: number;
  pcr: number;
  vah: number;
  poc: number;
  val: number;
  heavyweightContributions?: Array<{
    symbol: string;
    weight: number;
    points: number;
  }>;
}

export interface IndexAnalyticsEvent extends ServerEnvelopeBase {
  type: 'index.analytics';
  symbol: string;
  seq: number;
  data: IndexAnalyticsData;
}

export type ServerMessage =
  | ConnectionAckEvent
  | ConnectionPongEvent
  | SubscriptionAckEvent
  | SystemErrorEvent
  | MarketTickEvent
  | MarketQuoteEvent
  | MarketCandleEvent
  | MarketDepthEvent
  | IndexAnalyticsEvent;
