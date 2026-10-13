/**
 * BaseAdapter Interface / Abstract Class
 * 
 * Defines the standard contract that all broker & data adapters must implement.
 * Future adapters (e.g., Shoonya, Zerodha, Upstox, Paper) will extend this base class.
 */
export class BaseAdapter {
  constructor(name) {
    if (!name) {
      throw new Error('Adapter name must be specified');
    }
    this.name = name;
  }

  getName() {
    return this.name;
  }

  /**
   * Fetch historical candles in standardized format
   * @param {object} params
   * @param {string} params.symbol
   * @param {string|number} params.timeframe
   * @param {string|number|Date} params.from_date
   * @param {string|number|Date} params.to_date
   */
  async getHistoricalData(params) {
    throw new Error(`[${this.name}] getHistoricalData must be implemented by adapter subclass`);
  }

  /**
   * Fetch quotes for a list of symbols
   * @param {string[]|string} symbols
   */
  async getQuotes(symbols) {
    throw new Error(`[${this.name}] getQuotes must be implemented by adapter subclass`);
  }

  /**
   * Place a new order
   * @param {object} orderParams
   */
  async placeOrder(orderParams) {
    throw new Error(`[${this.name}] placeOrder is not supported by this adapter`);
  }

  /**
   * Modify an open order
   * @param {string} orderId
   * @param {object} params
   */
  async modifyOrder(orderId, params) {
    throw new Error(`[${this.name}] modifyOrder is not supported by this adapter`);
  }

  /**
   * Cancel an open order
   * @param {string} orderId
   */
  async cancelOrder(orderId) {
    throw new Error(`[${this.name}] cancelOrder is not supported by this adapter`);
  }

  /**
   * Get all orders for the current session/account
   */
  async getOrders() {
    throw new Error(`[${this.name}] getOrders is not supported by this adapter`);
  }

  /**
   * Get open positions
   */
  async getPositions() {
    throw new Error(`[${this.name}] getPositions is not supported by this adapter`);
  }

  /**
   * Get long-term holdings
   */
  async getHoldings() {
    throw new Error(`[${this.name}] getHoldings is not supported by this adapter`);
  }

  /**
   * Get account balance and funds
   */
  async getFunds() {
    throw new Error(`[${this.name}] getFunds is not supported by this adapter`);
  }

  /**
   * Get user profile details
   */
  async getProfile() {
    throw new Error(`[${this.name}] getProfile is not supported by this adapter`);
  }
}

export default BaseAdapter;
