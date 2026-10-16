import { SupportedChannelPrefixes } from '../protocol/constants.js';
import { getAllIndexSymbols, getAllIndexConstituents } from '../../config/index-resolver.js';

export class ChannelRegistry {
  constructor() {
    // Standard Indian financial instruments whitelist
    const defaultSymbols = [
      'NIFTY',
      'NIFTY50',
      'NIFTY_50',
      'NSE:NIFTY50-INDEX',
      'BANKNIFTY',
      'BANK_NIFTY',
      'NSE:NIFTYBANK-INDEX',
      'FINNIFTY',
      'NSE:FINNIFTY-INDEX',
      'SENSEX',
      'BSE:SENSEX-INDEX',
      'MID_SELECT',
      'MIDSELECT',
      'MIDCPNIFTY',
      'NSE:MIDCPNIFTY-INDEX',
      'NIFTY_IT',
      'NSE:NIFTYIT-INDEX',
      'RELIANCE',
      'HDFCBANK',
      'ICICIBANK',
      'INFY',
      'TCS',
      'KOTAKBANK',
      'SBIN',
      'AXISBANK',
      'LT'
    ];

    this.knownInstruments = new Set(defaultSymbols.map(s => s.toUpperCase()));

    // Dynamically add all configured index symbols and constituents
    try {
      const indexSyms = getAllIndexSymbols();
      const constituentSyms = getAllIndexConstituents();
      for (const s of [...indexSyms, ...constituentSyms]) {
        if (!s) continue;
        const upper = s.toUpperCase();
        this.knownInstruments.add(upper);
        // Also add stripped bare ticker
        const stripped = upper.replace(/^(NSE|BSE):/, '').replace(/-(EQ|INDEX|BE|SM)$/, '');
        this.knownInstruments.add(stripped);
      }
    } catch (err) {
      // Graceful fallback to static set
    }

    this.validTimeframes = new Set([
      '1s', '1m', '2m', '3m', '5m', '10m', '15m', '20m', '30m',
      '1h', '60m', '2h', '120m', '4h', '240m', '1d', 'd', '1w', 'w', 'session'
    ]);
  }

  addInstrument(symbol) {
    if (!symbol) return;
    this.knownInstruments.add(symbol.toUpperCase());
  }

  isSupportedPrefix(prefix) {
    return SupportedChannelPrefixes.includes(prefix);
  }

  isKnownInstrument(symbol) {
    if (!symbol) return false;
    const upper = symbol.toUpperCase();
    if (this.knownInstruments.has(upper)) return true;

    // Check stripped base
    const stripped = upper.replace(/^(NSE|BSE):/, '').replace(/-(EQ|INDEX|BE|SM)$/, '');
    if (this.knownInstruments.has(stripped)) return true;

    // Allow standard Indian exchange symbol patterns (e.g. NSE:SYMBOL-EQ, BSE:SYMBOL)
    if (/^(NSE|BSE):[A-Z0-9_.-]+$/.test(upper)) return true;

    return false;
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
