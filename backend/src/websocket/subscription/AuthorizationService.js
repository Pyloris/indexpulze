export class AuthorizationService {
  /**
   * Set of known index symbols eligible for public streaming
   */
  static INDEX_SYMBOLS = new Set([
    'NIFTY',
    'NIFTY50',
    'NIFTY_50',
    'BANKNIFTY',
    'BANK_NIFTY',
    'FINNIFTY',
    'SENSEX',
    'MID_SELECT',
    'MIDSELECT',
    'MIDCPNIFTY'
  ]);

  /**
   * Checks if an instrument is an index
   * @param {string} symbol
   * @returns {boolean}
   */
  static isIndexSymbol(symbol) {
    if (!symbol) return false;
    return this.INDEX_SYMBOLS.has(symbol.toUpperCase());
  }

  /**
   * Checks if a channel qualifies as a public index update (quotes/candles for landing page)
   * @param {{ prefix: string, symbol: string, modifier?: string }} parsedChannel
   * @returns {boolean}
   */
  static isPublicIndexUpdate(parsedChannel) {
    const isIndex = this.isIndexSymbol(parsedChannel.symbol);
    return isIndex && (parsedChannel.prefix === 'market.quote' || parsedChannel.prefix === 'market.candle');
  }

  /**
   * Validates if a user has permission to subscribe to a specific channel
   * @param {any} user
   * @param {{ prefix: string, symbol: string, modifier?: string }} parsedChannel
   * @returns {{ authorized: boolean, reason?: string }}
   */
  static authorizeSubscription(user, parsedChannel) {
    // 1. Index quotes and candles are public for unauthenticated landing page streams
    if (this.isPublicIndexUpdate(parsedChannel)) {
      return { authorized: true };
    }

    // 2. All other channels (tick execution data, index analytics, orderbook depth, equity quotes) require authentication
    if (!user) {
      if (parsedChannel.prefix === 'market.tick') {
        return { authorized: false, reason: 'Authentication required for real-time tick execution data' };
      }
      if (parsedChannel.prefix === 'index.analytics') {
        return { authorized: false, reason: 'Authentication required for institutional index analytics' };
      }
      if (parsedChannel.prefix === 'market.depth') {
        return { authorized: false, reason: 'Authentication required for order book depth' };
      }
      return { authorized: false, reason: 'Authentication required for real-time market data access' };
    }

    // Authenticated users have standard tier access
    return { authorized: true };
  }
}
