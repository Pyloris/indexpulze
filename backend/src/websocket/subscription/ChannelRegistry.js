import { SupportedChannelPrefixes } from '../protocol/constants.js';

export class ChannelRegistry {
  constructor() {
    // Standard Indian financial instruments whitelist
    this.knownInstruments = new Set([
      'NIFTY',
      'NIFTY50',
      'NIFTY_50',
      'BANKNIFTY',
      'BANK_NIFTY',
      'FINNIFTY',
      'SENSEX',
      'RELIANCE',
      'HDFCBANK',
      'ICICIBANK',
      'INFY',
      'TCS',
      'KOTAKBANK',
      'SBIN',
      'AXISBANK',
      'LT'
    ]);

    this.validTimeframes = new Set(['1s', '1m', '5m', '15m', '1h', '1d']);
  }

  addInstrument(symbol) {
    this.knownInstruments.add(symbol.toUpperCase());
  }

  isSupportedPrefix(prefix) {
    return SupportedChannelPrefixes.includes(prefix);
  }

  isKnownInstrument(symbol) {
    if (!symbol) return false;
    return this.knownInstruments.has(symbol.toUpperCase());
  }

  isValidTimeframe(tf) {
    if (!tf) return true; // optional
    return this.validTimeframes.has(tf.toLowerCase());
  }

  /**
   * Validates instrument & modifier requirements
   * @param {{ prefix: string, symbol: string, modifier?: string }} parsed
   * @returns {{ valid: boolean, code?: string, message?: string }}
   */
  validateChannel(parsed) {
    if (!this.isSupportedPrefix(parsed.prefix)) {
      return {
        valid: false,
        code: 'INVALID_CHANNEL_PREFIX',
        message: `Prefix ${parsed.prefix} is not supported.`
      };
    }

    if (!this.isKnownInstrument(parsed.symbol)) {
      return {
        valid: false,
        code: 'UNKNOWN_INSTRUMENT',
        message: `Instrument ${parsed.symbol} is not recognized or active.`
      };
    }

    if (parsed.prefix === 'market.candle' && parsed.modifier && !this.isValidTimeframe(parsed.modifier)) {
      return {
        valid: false,
        code: 'INVALID_TIMEFRAME',
        message: `Candle timeframe ${parsed.modifier} is invalid. Supported: ${Array.from(this.validTimeframes).join(', ')}`
      };
    }

    return { valid: true };
  }
}
