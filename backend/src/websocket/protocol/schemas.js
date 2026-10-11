import Joi from 'joi';
import { ClientOps, SupportedChannelPrefixes } from './constants.js';

/**
 * Validates channel format: `<prefix>:<symbol>[:<optional_sub_spec>]`
 * Example:
 * - market.tick:NIFTY
 * - market.candle:NIFTY:15m
 * - market.quote:RELIANCE
 * - index.analytics:NIFTY
 */
const channelRegex = new RegExp(`^(${SupportedChannelPrefixes.map(p => p.replace('.', '\\.')).join('|')}):([A-Z0-9_]+)(?::([a-z0-9_]+))?$`);

export const channelSchema = Joi.string()
  .trim()
  .max(100)
  .pattern(channelRegex)
  .messages({
    'string.pattern.base': 'Channel must match format <prefix>:<symbol>[:modifier], e.g., market.tick:NIFTY or market.candle:NIFTY:15m'
  });

export const subscribeMessageSchema = Joi.object({
  op: Joi.string().valid(ClientOps.SUBSCRIBE).required(),
  requestId: Joi.string().trim().max(128).required(),
  channels: Joi.array().items(Joi.string().trim().max(100)).min(1).max(100).required()
}).unknown(false);

export const unsubscribeMessageSchema = Joi.object({
  op: Joi.string().valid(ClientOps.UNSUBSCRIBE).required(),
  requestId: Joi.string().trim().max(128).required(),
  channels: Joi.array().items(Joi.string().trim().max(100)).min(1).max(100).required()
}).unknown(false);

export const pingMessageSchema = Joi.object({
  op: Joi.string().valid(ClientOps.PING).required(),
  requestId: Joi.string().trim().max(128).optional()
}).unknown(false);

export const authMessageSchema = Joi.object({
  op: Joi.string().valid(ClientOps.AUTH).required(),
  requestId: Joi.string().trim().max(128).optional(),
  token: Joi.string().trim().required()
}).unknown(false);

export const listSubscriptionsSchema = Joi.object({
  op: Joi.string().valid(ClientOps.LIST_SUBSCRIPTIONS).required(),
  requestId: Joi.string().trim().max(128).required()
}).unknown(false);

export const resyncMessageSchema = Joi.object({
  op: Joi.string().valid(ClientOps.RESYNC).required(),
  requestId: Joi.string().trim().max(128).required(),
  channel: Joi.string().trim().required(),
  fromSeq: Joi.number().integer().min(0).optional()
}).unknown(false);

export const clientMessageEnvelopeSchema = Joi.object({
  op: Joi.string().valid(...Object.values(ClientOps)).required(),
  requestId: Joi.string().trim().max(128).optional()
}).unknown(true);

/**
 * Validates a channel string against syntax requirements
 * @param {string} channel
 * @returns {{ valid: boolean, prefix?: string, symbol?: string, modifier?: string, error?: string }}
 */
export function parseAndValidateChannel(channel) {
  if (typeof channel !== 'string') {
    return { valid: false, error: 'Channel must be a string' };
  }

  const match = channel.match(channelRegex);
  if (!match) {
    return {
      valid: false,
      error: `Invalid channel syntax. Supported prefixes: ${SupportedChannelPrefixes.join(', ')}`
    };
  }

  const [, prefix, symbol, modifier] = match;
  return {
    valid: true,
    prefix,
    symbol,
    modifier
  };
}
