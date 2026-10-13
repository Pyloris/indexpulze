/**
 * Standardized Parser for Internal (Fyers v3 Data API) Adapter
 * 
 * Normalizes requests to Fyers Data API format and standardizes
 * responses (candles, OHLCV, quotes) for consumption by UI and backend services.
 */

/**
 * Standard Symbol to Fyers exchange format mapping (single agreed format)
 */
const SYMBOL_TO_FYERS_MAP = {
  NIFTY: 'NSE:NIFTY50-INDEX',
  BANKNIFTY: 'NSE:NIFTYBANK-INDEX',
  FINNIFTY: 'NSE:FINNIFTY-INDEX',
  SENSEX: 'BSE:SENSEX-INDEX',
  NIFTY_IT: 'NSE:NIFTYIT-INDEX',
  MID_SELECT: 'NSE:MIDCPNIFTY-INDEX',
  NIFTY_AUTO: 'NSE:NIFTYAUTO-INDEX',
};

/**
 * Timeframe / resolution mapping: UI/Standard Timeframe -> Fyers API v3 resolution
 * Supported resolutions by Fyers:
 *  - 1, 2, 3, 5, 10, 15, 20, 30, 60, 120, 240 (minute intervals)
 *  - D or 1D (daily)
 *  - W or 1W (weekly)
 *  - M or 1M (monthly)
 */
const TIMEFRAME_MAP = {
  '1': '1',
  '1m': '1',
  '1min': '1',
  '2': '2',
  '2m': '2',
  '3': '3',
  '3m': '3',
  '5': '5',
  '5m': '5',
  '10': '10',
  '10m': '10',
  '15': '15',
  '15m': '15',
  '20': '20',
  '20m': '20',
  '30': '30',
  '30m': '30',
  '60': '60',
  '60m': '60',
  '1h': '60',
  '1H': '60',
  '120': '120',
  '120m': '120',
  '2h': '120',
  '2H': '120',
  '240': '240',
  '240m': '240',
  '4h': '240',
  '4H': '240',
  D: 'D',
  '1d': 'D',
  '1D': 'D',
  day: 'D',
  daily: 'D',
  W: 'W',
  '1w': 'W',
  '1W': 'W',
  week: 'W',
  M: 'M',
  '1M': 'M',
  month: 'M',
};

export class InternalDataParser {
  /**
   * Convert any symbol string to Fyers compatible format (e.g., 'NSE:SBIN-EQ')
   * @param {string} symbol
   * @returns {string}
   */
  static normalizeSymbol(symbol) {
    if (!symbol) throw new Error('Symbol is required');
    const trimmed = String(symbol).trim();

    // Check alias mapping (Indices etc.)
    if (SYMBOL_TO_FYERS_MAP[trimmed]) {
      return SYMBOL_TO_FYERS_MAP[trimmed];
    }

    const upper = trimmed.toUpperCase();
    if (SYMBOL_TO_FYERS_MAP[upper]) {
      return SYMBOL_TO_FYERS_MAP[upper];
    }

    // Already in exchange prefix format (NSE: or BSE:)
    if (upper.startsWith('NSE:') || upper.startsWith('BSE:')) {
      return upper;
    }

    // Default to NSE equity format
    return `NSE:${upper}-EQ`;
  }

  /**
   * Convert standard timeframe (e.g. '5m', '1D') to Fyers resolution parameter
   * @param {string|number} timeframe
   * @returns {string}
   */
  static normalizeResolution(timeframe) {
    if (!timeframe) return '5'; // default 5m
    const key = String(timeframe).trim();
    if (TIMEFRAME_MAP[key]) return TIMEFRAME_MAP[key];
    if (TIMEFRAME_MAP[key.toLowerCase()]) return TIMEFRAME_MAP[key.toLowerCase()];
    if (TIMEFRAME_MAP[key.toUpperCase()]) return TIMEFRAME_MAP[key.toUpperCase()];

    // Direct numeric string fallback
    if (!isNaN(Number(key))) {
      return String(Number(key));
    }

    return 'D';
  }

  /**
   * Normalize date input into 'YYYY-MM-DD' string format
   * Supports Date objects, Epoch timestamps (sec/ms), and date strings
   * @param {string|number|Date} dateInput
   * @returns {string}
   */
  static normalizeDate(dateInput) {
    if (!dateInput) return null;

    if (dateInput instanceof Date) {
      return dateInput.toISOString().split('T')[0];
    }

    if (typeof dateInput === 'number') {
      // If seconds timestamp, convert to ms
      const ms = dateInput < 1e11 ? dateInput * 1000 : dateInput;
      return new Date(ms).toISOString().split('T')[0];
    }

    const str = String(dateInput).trim();
    // Already in YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
      return str;
    }

    // Try parsing date string
    const parsed = new Date(str);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString().split('T')[0];
    }

    return str;
  }

  /**
   * Normalize query parameters for Fyers history API request
   * @param {object} params
   * @returns {{
   *   symbol: string,
   *   resolution: string,
   *   date_format: number,
   *   range_from: string,
   *   range_to: string,
   *   cont_flag: string,
   *   oi_flag: string
   * }}
   */
  static normalizeRequestParams(params = {}) {
    const rawSymbol = params.symbol;
    const fyersSymbol = this.normalizeSymbol(rawSymbol);
    const resolution = this.normalizeResolution(params.timeframe || params.resolution);

    const fromDate = this.normalizeDate(params.from_date || params.fromDate || params.range_from);
    const toDate = this.normalizeDate(params.to_date || params.toDate || params.range_to);

    if (!fromDate) {
      throw new Error('Start date (from_date / fromDate) is required');
    }
    if (!toDate) {
      throw new Error('End date (to_date / toDate) is required');
    }

    return {
      symbol: fyersSymbol,
      resolution,
      date_format: 1, // '1' denotes YYYY-MM-DD format
      range_from: fromDate,
      range_to: toDate,
      cont_flag: params.cont_flag ? String(params.cont_flag) : '0',
      oi_flag: params.oi_flag ? String(params.oi_flag) : '0',
    };
  }

  /**
   * Parse a single raw Fyers candle array: [timestamp, open, high, low, close, volume, oi?]
   * @param {Array<number>} candleArray
   * @returns {{
   *   time: number,
   *   timestamp: number,
   *   isoTime: string,
   *   open: number,
   *   high: number,
   *   low: number,
   *   close: number,
   *   volume: number,
   *   oi: number|null
   * }}
   */
  static parseCandle(candleArray) {
    if (!Array.isArray(candleArray) || candleArray.length < 5) {
      throw new Error(`Invalid candle data format: ${JSON.stringify(candleArray)}`);
    }

    const [rawTs, open, high, low, close, volume = 0, oi = null] = candleArray;

    // Fyers returns Unix timestamp in seconds for history API
    const timeInSec = Number(rawTs);
    const timeInMs = timeInSec * 1000;
    const isoTime = new Date(timeInMs).toISOString();

    return {
      time: timeInSec, // Compatible with Lightweight Charts & TradingView
      timestamp: timeInSec, // Compatible with existing consumers expecting seconds
      timestampMs: timeInMs,
      isoTime,
      open: Number(open),
      high: Number(high),
      low: Number(low),
      close: Number(close),
      volume: Number(volume),
      oi: oi !== null && oi !== undefined ? Number(oi) : null,
    };
  }

  /**
   * Parse an array of raw Fyers candle arrays
   * @param {Array<Array<number>>} candles
   * @returns {Array<object>}
   */
  static parseCandles(candles = []) {
    if (!Array.isArray(candles)) return [];
    return candles.map((c) => this.parseCandle(c));
  }

  /**
   * Standardize the raw Fyers history API response into universal application format
   * @param {object} rawResponse - Raw JSON returned by Fyers endpoint
   * @param {object} context - Request metadata for enrichment
   * @returns {{
   *   status: string,
   *   symbol: string,
   *   fyersSymbol: string,
   *   timeframe: string,
   *   resolution: string,
   *   count: number,
   *   range: { from: string, to: string },
   *   candles: Array<object>
   * }}
   */
  static parseHistoricalData(rawResponse, context = {}) {
    if (!rawResponse || typeof rawResponse !== 'object') {
      throw new Error('Fyers API returned an empty or invalid response');
    }

    // Check for Fyers error response (s: "error")
    if (rawResponse.s === 'error' || (rawResponse.code && rawResponse.code !== 200 && rawResponse.code !== 1000)) {
      const errorMsg = rawResponse.message || `Fyers API Error code: ${rawResponse.code}`;
      const err = new Error(errorMsg);
      err.code = rawResponse.code;
      err.provider = 'fyers';
      err.response = rawResponse;
      throw err;
    }

    const rawCandles = rawResponse.candles || [];
    const parsedCandles = this.parseCandles(rawCandles);

    // Sort strictly in ascending chronological order (required by Lightweight Charts & time series engines)
    const sortedCandles = parsedCandles.sort((a, b) => {
      const timeA = Number(a.time ?? a.timestamp);
      const timeB = Number(b.time ?? b.timestamp);
      return timeA - timeB;
    });

    // Deduplicate consecutive identical timestamps (keeps latest candle)
    const uniqueAscCandles = [];
    for (const candle of sortedCandles) {
      const t = Number(candle.time ?? candle.timestamp);
      const prev = uniqueAscCandles[uniqueAscCandles.length - 1];
      const prevTime = prev ? Number(prev.time ?? prev.timestamp) : null;
      if (prev && prevTime === t) {
        uniqueAscCandles[uniqueAscCandles.length - 1] = candle;
      } else {
        uniqueAscCandles.push(candle);
      }
    }

    return {
      status: 'success',
      symbol: context.requestedSymbol || context.symbol || '',
      fyersSymbol: context.fyersSymbol || context.symbol || '',
      timeframe: context.timeframe || context.resolution || '',
      resolution: context.resolution || '',
      count: uniqueAscCandles.length,
      range: {
        from: context.from_date || context.range_from || (uniqueAscCandles[0]?.isoTime || null),
        to: context.to_date || context.range_to || (uniqueAscCandles[uniqueAscCandles.length - 1]?.isoTime || null),
      },
      candles: uniqueAscCandles,
    };
  }
}

export default InternalDataParser;
