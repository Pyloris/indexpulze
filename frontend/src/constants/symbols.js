/**
 * Centralized Indian Market Symbol ENUMs and Metadata
 * Derived from backend index composition configurations (NIFTY 50, BANK NIFTY, FINNIFTY, SENSEX).
 */

/**
 * Major Indian benchmark and sectoral index symbols (Display / UI representation)
 */
export const INDEX_SYMBOLS = Object.freeze({
  NIFTY_50: 'NIFTY 50',
  BANK_NIFTY: 'BANK NIFTY',
  FINNIFTY: 'FINNIFTY',
  MID_SELECT: 'MID SELECT',
  SENSEX_30: 'SENSEX 30',
  NIFTY_IT: 'NIFTY IT',
  NIFTY_AUTO: 'NIFTY AUTO',
});

/**
 * Standard ticker symbols for all index constituents in the Indian market
 */
export const EQUITY_SYMBOLS = Object.freeze({
  // NIFTY 50 Constituents
  ADANIENT: 'ADANIENT',
  ADANIPORTS: 'ADANIPORTS',
  APOLLOHOSP: 'APOLLOHOSP',
  ASIANPAINT: 'ASIANPAINT',
  AXISBANK: 'AXISBANK',
  BAJAJ_AUTO: 'BAJAJ-AUTO',
  BAJAJFINSV: 'BAJAJFINSV',
  BAJFINANCE: 'BAJFINANCE',
  BHARTIARTL: 'BHARTIARTL',
  BPCL: 'BPCL',
  BRITANNIA: 'BRITANNIA',
  CIPLA: 'CIPLA',
  COALINDIA: 'COALINDIA',
  DIVISLAB: 'DIVISLAB',
  DRREDDY: 'DRREDDY',
  EICHERMOT: 'EICHERMOT',
  GRASIM: 'GRASIM',
  HCLTECH: 'HCLTECH',
  HDFCBANK: 'HDFCBANK',
  HDFCLIFE: 'HDFCLIFE',
  HEROMOTOCO: 'HEROMOTOCO',
  HINDALCO: 'HINDALCO',
  HINDUNILVR: 'HINDUNILVR',
  ICICIBANK: 'ICICIBANK',
  INDUSINDBK: 'INDUSINDBK',
  INFY: 'INFY',
  ITC: 'ITC',
  JSWSTEEL: 'JSWSTEEL',
  KOTAKBANK: 'KOTAKBANK',
  LT: 'LT',
  LTIM: 'LTIM',
  M_AND_M: 'M&M',
  MARUTI: 'MARUTI',
  NESTLEIND: 'NESTLEIND',
  NTPC: 'NTPC',
  ONGC: 'ONGC',
  POWERGRID: 'POWERGRID',
  RELIANCE: 'RELIANCE',
  SBILIFE: 'SBILIFE',
  SBIN: 'SBIN',
  SUNPHARMA: 'SUNPHARMA',
  TATACONSUM: 'TATACONSUM',
  TATAMOTORS: 'TATAMOTORS',
  TATASTEEL: 'TATASTEEL',
  TCS: 'TCS',
  TECHM: 'TECHM',
  TITAN: 'TITAN',
  ULTRACEMCO: 'ULTRACEMCO',
  UPL: 'UPL',
  WIPRO: 'WIPRO',

  // BANK NIFTY additional constituents
  AUBANK: 'AUBANK',
  BANDHANBNK: 'BANDHANBNK',
  BANKBARODA: 'BANKBARODA',
  FEDERALBNK: 'FEDERALBNK',
  IDFCFIRSTB: 'IDFCFIRSTB',
  PNB: 'PNB',
});

/**
 * Unified master SYMBOLS ENUM covering all indices and stocks
 */
export const SYMBOLS = Object.freeze({
  ...INDEX_SYMBOLS,
  ...EQUITY_SYMBOLS,
});

/**
 * Exchange qualified symbols (Fyers / broker WebSocket format: NSE:<SYMBOL>-EQ / INDEX)
 */
export const EXCHANGE_SYMBOLS = Object.freeze({
  // Indices
  NIFTY_50: 'NSE:NIFTY50-INDEX',
  BANK_NIFTY: 'NSE:NIFTYBANK-INDEX',
  FINNIFTY: 'NSE:FINNIFTY-INDEX',
  MID_SELECT: 'NSE:MIDCPNIFTY-INDEX',
  SENSEX_30: 'BSE:SENSEX-INDEX',
  NIFTY_IT: 'NSE:NIFTYIT-INDEX',
  NIFTY_AUTO: 'NSE:NIFTYAUTO-INDEX',

  // NIFTY 50 Equities
  ADANIENT: 'NSE:ADANIENT-EQ',
  ADANIPORTS: 'NSE:ADANIPORTS-EQ',
  APOLLOHOSP: 'NSE:APOLLOHOSP-EQ',
  ASIANPAINT: 'NSE:ASIANPAINT-EQ',
  AXISBANK: 'NSE:AXISBANK-EQ',
  BAJAJ_AUTO: 'NSE:BAJAJ-AUTO-EQ',
  BAJAJFINSV: 'NSE:BAJAJFINSV-EQ',
  BAJFINANCE: 'NSE:BAJFINANCE-EQ',
  BHARTIARTL: 'NSE:BHARTIARTL-EQ',
  BPCL: 'NSE:BPCL-EQ',
  BRITANNIA: 'NSE:BRITANNIA-EQ',
  CIPLA: 'NSE:CIPLA-EQ',
  COALINDIA: 'NSE:COALINDIA-EQ',
  DIVISLAB: 'NSE:DIVISLAB-EQ',
  DRREDDY: 'NSE:DRREDDY-EQ',
  EICHERMOT: 'NSE:EICHERMOT-EQ',
  GRASIM: 'NSE:GRASIM-EQ',
  HCLTECH: 'NSE:HCLTECH-EQ',
  HDFCBANK: 'NSE:HDFCBANK-EQ',
  HDFCLIFE: 'NSE:HDFCLIFE-EQ',
  HEROMOTOCO: 'NSE:HEROMOTOCO-EQ',
  HINDALCO: 'NSE:HINDALCO-EQ',
  HINDUNILVR: 'NSE:HINDUNILVR-EQ',
  ICICIBANK: 'NSE:ICICIBANK-EQ',
  INDUSINDBK: 'NSE:INDUSINDBK-EQ',
  INFY: 'NSE:INFY-EQ',
  ITC: 'NSE:ITC-EQ',
  JSWSTEEL: 'NSE:JSWSTEEL-EQ',
  KOTAKBANK: 'NSE:KOTAKBANK-EQ',
  LT: 'NSE:LT-EQ',
  LTIM: 'NSE:LTIM-EQ',
  M_AND_M: 'NSE:M&M-EQ',
  MARUTI: 'NSE:MARUTI-EQ',
  NESTLEIND: 'NSE:NESTLEIND-EQ',
  NTPC: 'NSE:NTPC-EQ',
  ONGC: 'NSE:ONGC-EQ',
  POWERGRID: 'NSE:POWERGRID-EQ',
  RELIANCE: 'NSE:RELIANCE-EQ',
  SBILIFE: 'NSE:SBILIFE-EQ',
  SBIN: 'NSE:SBIN-EQ',
  SUNPHARMA: 'NSE:SUNPHARMA-EQ',
  TATACONSUM: 'NSE:TATACONSUM-EQ',
  TATAMOTORS: 'NSE:TATAMOTORS-EQ',
  TATASTEEL: 'NSE:TATASTEEL-EQ',
  TCS: 'NSE:TCS-EQ',
  TECHM: 'NSE:TECHM-EQ',
  TITAN: 'NSE:TITAN-EQ',
  ULTRACEMCO: 'NSE:ULTRACEMCO-EQ',
  UPL: 'NSE:UPL-EQ',
  WIPRO: 'NSE:WIPRO-EQ',

  // BANK NIFTY Equities
  AUBANK: 'NSE:AUBANK-EQ',
  BANDHANBNK: 'NSE:BANDHANBNK-EQ',
  BANKBARODA: 'NSE:BANKBARODA-EQ',
  FEDERALBNK: 'NSE:FEDERALBNK-EQ',
  IDFCFIRSTB: 'NSE:IDFCFIRSTB-EQ',
  PNB: 'NSE:PNB-EQ',
});

/**
 * Company metadata and display titles
 */
export const SYMBOL_METADATA = Object.freeze({
  [EQUITY_SYMBOLS.HDFCBANK]: { name: 'HDFC Bank Ltd.', sector: 'Financial Services' },
  [EQUITY_SYMBOLS.RELIANCE]: { name: 'Reliance Industries Ltd.', sector: 'Oil & Gas' },
  [EQUITY_SYMBOLS.ICICIBANK]: { name: 'ICICI Bank Ltd.', sector: 'Financial Services' },
  [EQUITY_SYMBOLS.INFY]: { name: 'Infosys Ltd.', sector: 'Information Technology' },
  [EQUITY_SYMBOLS.ITC]: { name: 'ITC Ltd.', sector: 'Consumer Goods' },
  [EQUITY_SYMBOLS.LT]: { name: 'Larsen & Toubro Ltd.', sector: 'Construction & Capital Goods' },
  [EQUITY_SYMBOLS.TCS]: { name: 'Tata Consultancy Services Ltd.', sector: 'Information Technology' },
  [EQUITY_SYMBOLS.AXISBANK]: { name: 'Axis Bank Ltd.', sector: 'Financial Services' },
  [EQUITY_SYMBOLS.KOTAKBANK]: { name: 'Kotak Mahindra Bank Ltd.', sector: 'Financial Services' },
  [EQUITY_SYMBOLS.BHARTIARTL]: { name: 'Bharti Airtel Ltd.', sector: 'Telecommunication' },
  [EQUITY_SYMBOLS.HINDUNILVR]: { name: 'Hindustan Unilever Ltd.', sector: 'Consumer Goods' },
  [EQUITY_SYMBOLS.SBIN]: { name: 'State Bank of India', sector: 'Financial Services' },
  [EQUITY_SYMBOLS.BAJFINANCE]: { name: 'Bajaj Finance Ltd.', sector: 'Financial Services' },
  [EQUITY_SYMBOLS.ASIANPAINT]: { name: 'Asian Paints Ltd.', sector: 'Consumer Goods' },
  [EQUITY_SYMBOLS.M_AND_M]: { name: 'Mahindra & Mahindra Ltd.', sector: 'Automobile' },
  [EQUITY_SYMBOLS.TITAN]: { name: 'Titan Company Ltd.', sector: 'Consumer Goods' },
  [EQUITY_SYMBOLS.HCLTECH]: { name: 'HCL Technologies Ltd.', sector: 'Information Technology' },
  [EQUITY_SYMBOLS.MARUTI]: { name: 'Maruti Suzuki India Ltd.', sector: 'Automobile' },
  [EQUITY_SYMBOLS.SUNPHARMA]: { name: 'Sun Pharmaceutical Industries Ltd.', sector: 'Healthcare' },
  [EQUITY_SYMBOLS.NTPC]: { name: 'NTPC Ltd.', sector: 'Power' },
  [EQUITY_SYMBOLS.TATAMOTORS]: { name: 'Tata Motors Ltd.', sector: 'Automobile' },
  [EQUITY_SYMBOLS.TATASTEEL]: { name: 'Tata Steel Ltd.', sector: 'Metals & Mining' },
  [EQUITY_SYMBOLS.ULTRACEMCO]: { name: 'UltraTech Cement Ltd.', sector: 'Construction Materials' },
  [EQUITY_SYMBOLS.INDUSINDBK]: { name: 'IndusInd Bank Ltd.', sector: 'Financial Services' },
  [EQUITY_SYMBOLS.POWERGRID]: { name: 'Power Grid Corporation of India Ltd.', sector: 'Power' },
  [EQUITY_SYMBOLS.BAJAJFINSV]: { name: 'Bajaj Finserv Ltd.', sector: 'Financial Services' },
  [EQUITY_SYMBOLS.NESTLEIND]: { name: 'Nestle India Ltd.', sector: 'Consumer Goods' },
  [EQUITY_SYMBOLS.ADANIENT]: { name: 'Adani Enterprises Ltd.', sector: 'Metals & Mining' },
  [EQUITY_SYMBOLS.COALINDIA]: { name: 'Coal India Ltd.', sector: 'Oil & Gas' },
  [EQUITY_SYMBOLS.TECHM]: { name: 'Tech Mahindra Ltd.', sector: 'Information Technology' },
  [EQUITY_SYMBOLS.ONGC]: { name: 'Oil & Natural Gas Corporation Ltd.', sector: 'Oil & Gas' },
  [EQUITY_SYMBOLS.HINDALCO]: { name: 'Hindalco Industries Ltd.', sector: 'Metals & Mining' },
  [EQUITY_SYMBOLS.JSWSTEEL]: { name: 'JSW Steel Ltd.', sector: 'Metals & Mining' },
  [EQUITY_SYMBOLS.GRASIM]: { name: 'Grasim Industries Ltd.', sector: 'Construction Materials' },
  [EQUITY_SYMBOLS.HDFCLIFE]: { name: 'HDFC Life Insurance Company Ltd.', sector: 'Financial Services' },
  [EQUITY_SYMBOLS.DRREDDY]: { name: "Dr. Reddy's Laboratories Ltd.", sector: 'Healthcare' },
  [EQUITY_SYMBOLS.BAJAJ_AUTO]: { name: 'Bajaj Auto Ltd.', sector: 'Automobile' },
  [EQUITY_SYMBOLS.ADANIPORTS]: { name: 'Adani Ports and Special Economic Zone Ltd.', sector: 'Services' },
  [EQUITY_SYMBOLS.SBILIFE]: { name: 'SBI Life Insurance Company Ltd.', sector: 'Financial Services' },
  [EQUITY_SYMBOLS.CIPLA]: { name: 'Cipla Ltd.', sector: 'Healthcare' },
  [EQUITY_SYMBOLS.WIPRO]: { name: 'Wipro Ltd.', sector: 'Information Technology' },
  [EQUITY_SYMBOLS.BRITANNIA]: { name: 'Britannia Industries Ltd.', sector: 'Consumer Goods' },
  [EQUITY_SYMBOLS.TATACONSUM]: { name: 'Tata Consumer Products Ltd.', sector: 'Consumer Goods' },
  [EQUITY_SYMBOLS.APOLLOHOSP]: { name: 'Apollo Hospitals Enterprise Ltd.', sector: 'Healthcare' },
  [EQUITY_SYMBOLS.EICHERMOT]: { name: 'Eicher Motors Ltd.', sector: 'Automobile' },
  [EQUITY_SYMBOLS.LTIM]: { name: 'LTIMindtree Ltd.', sector: 'Information Technology' },
  [EQUITY_SYMBOLS.HEROMOTOCO]: { name: 'Hero MotoCorp Ltd.', sector: 'Automobile' },
  [EQUITY_SYMBOLS.DIVISLAB]: { name: "Divi's Laboratories Ltd.", sector: 'Healthcare' },
  [EQUITY_SYMBOLS.BPCL]: { name: 'Bharat Petroleum Corporation Ltd.', sector: 'Oil & Gas' },
  [EQUITY_SYMBOLS.UPL]: { name: 'UPL Ltd.', sector: 'Chemicals' },

  // Bank Nifty
  [EQUITY_SYMBOLS.BANKBARODA]: { name: 'Bank of Baroda', sector: 'Financial Services' },
  [EQUITY_SYMBOLS.FEDERALBNK]: { name: 'The Federal Bank Ltd.', sector: 'Financial Services' },
  [EQUITY_SYMBOLS.PNB]: { name: 'Punjab National Bank', sector: 'Financial Services' },
  [EQUITY_SYMBOLS.IDFCFIRSTB]: { name: 'IDFC First Bank Ltd.', sector: 'Financial Services' },
  [EQUITY_SYMBOLS.AUBANK]: { name: 'AU Small Finance Bank Ltd.', sector: 'Financial Services' },
  [EQUITY_SYMBOLS.BANDHANBNK]: { name: 'Bandhan Bank Ltd.', sector: 'Financial Services' },
});

/**
 * Weights from index_composition configuration
 */
export const NIFTY_50_WEIGHTS = Object.freeze({
  [EQUITY_SYMBOLS.HDFCBANK]: 0.1326,
  [EQUITY_SYMBOLS.RELIANCE]: 0.0911,
  [EQUITY_SYMBOLS.ICICIBANK]: 0.0742,
  [EQUITY_SYMBOLS.INFY]: 0.0589,
  [EQUITY_SYMBOLS.ITC]: 0.0437,
  [EQUITY_SYMBOLS.LT]: 0.0426,
  [EQUITY_SYMBOLS.TCS]: 0.0405,
  [EQUITY_SYMBOLS.AXISBANK]: 0.0338,
  [EQUITY_SYMBOLS.KOTAKBANK]: 0.0293,
  [EQUITY_SYMBOLS.BHARTIARTL]: 0.0290,
  [EQUITY_SYMBOLS.HINDUNILVR]: 0.0258,
  [EQUITY_SYMBOLS.SBIN]: 0.0246,
  [EQUITY_SYMBOLS.BAJFINANCE]: 0.0215,
  [EQUITY_SYMBOLS.ASIANPAINT]: 0.0177,
  [EQUITY_SYMBOLS.M_AND_M]: 0.0167,
  [EQUITY_SYMBOLS.TITAN]: 0.0165,
  [EQUITY_SYMBOLS.HCLTECH]: 0.0161,
  [EQUITY_SYMBOLS.MARUTI]: 0.0160,
  [EQUITY_SYMBOLS.SUNPHARMA]: 0.0150,
  [EQUITY_SYMBOLS.NTPC]: 0.0141,
  [EQUITY_SYMBOLS.TATAMOTORS]: 0.0141,
  [EQUITY_SYMBOLS.TATASTEEL]: 0.0118,
  [EQUITY_SYMBOLS.ULTRACEMCO]: 0.0118,
  [EQUITY_SYMBOLS.INDUSINDBK]: 0.0108,
  [EQUITY_SYMBOLS.POWERGRID]: 0.0108,
  [EQUITY_SYMBOLS.BAJAJFINSV]: 0.0103,
  [EQUITY_SYMBOLS.NESTLEIND]: 0.0098,
  [EQUITY_SYMBOLS.ADANIENT]: 0.0088,
  [EQUITY_SYMBOLS.COALINDIA]: 0.0088,
  [EQUITY_SYMBOLS.TECHM]: 0.0086,
  [EQUITY_SYMBOLS.ONGC]: 0.0086,
  [EQUITY_SYMBOLS.HINDALCO]: 0.0085,
  [EQUITY_SYMBOLS.JSWSTEEL]: 0.0084,
  [EQUITY_SYMBOLS.GRASIM]: 0.0084,
  [EQUITY_SYMBOLS.HDFCLIFE]: 0.0084,
  [EQUITY_SYMBOLS.DRREDDY]: 0.0080,
  [EQUITY_SYMBOLS.BAJAJ_AUTO]: 0.0078,
  [EQUITY_SYMBOLS.ADANIPORTS]: 0.0075,
  [EQUITY_SYMBOLS.SBILIFE]: 0.0073,
  [EQUITY_SYMBOLS.CIPLA]: 0.0072,
  [EQUITY_SYMBOLS.WIPRO]: 0.0066,
  [EQUITY_SYMBOLS.BRITANNIA]: 0.0065,
  [EQUITY_SYMBOLS.TATACONSUM]: 0.0064,
  [EQUITY_SYMBOLS.APOLLOHOSP]: 0.0063,
  [EQUITY_SYMBOLS.EICHERMOT]: 0.0060,
  [EQUITY_SYMBOLS.LTIM]: 0.0058,
  [EQUITY_SYMBOLS.HEROMOTOCO]: 0.0056,
  [EQUITY_SYMBOLS.DIVISLAB]: 0.0055,
  [EQUITY_SYMBOLS.BPCL]: 0.0047,
  [EQUITY_SYMBOLS.UPL]: 0.0033,
});

export const BANK_NIFTY_WEIGHTS = Object.freeze({
  [EQUITY_SYMBOLS.HDFCBANK]: 0.3789,
  [EQUITY_SYMBOLS.ICICIBANK]: 0.2452,
  [EQUITY_SYMBOLS.AXISBANK]: 0.1113,
  [EQUITY_SYMBOLS.KOTAKBANK]: 0.0879,
  [EQUITY_SYMBOLS.SBIN]: 0.0807,
  [EQUITY_SYMBOLS.INDUSINDBK]: 0.0316,
  [EQUITY_SYMBOLS.BANKBARODA]: 0.0150,
  [EQUITY_SYMBOLS.FEDERALBNK]: 0.0110,
  [EQUITY_SYMBOLS.PNB]: 0.0109,
  [EQUITY_SYMBOLS.IDFCFIRSTB]: 0.0105,
  [EQUITY_SYMBOLS.AUBANK]: 0.0105,
  [EQUITY_SYMBOLS.BANDHANBNK]: 0.0066,
});

/**
 * List of constituents per index
 */
export const INDEX_COMPOSITION = Object.freeze({
  [INDEX_SYMBOLS.NIFTY_50]: Object.keys(NIFTY_50_WEIGHTS),
  [INDEX_SYMBOLS.BANK_NIFTY]: Object.keys(BANK_NIFTY_WEIGHTS),
});

/**
 * Helper: Strip exchange prefix/suffix to get standard ticker symbol
 * e.g., 'NSE:HDFCBANK-EQ' -> 'HDFCBANK'
 */
export const toTicker = (exchangeSymbol) => {
  if (!exchangeSymbol) return '';
  return exchangeSymbol
    .replace(/^NSE:|^BSE:/, '')
    .replace(/-EQ$|-INDEX$/, '');
};

/**
 * Helper: Resolve standard ticker or UI index name to broker exchange symbol
 * e.g., 'HDFCBANK' -> 'NSE:HDFCBANK-EQ', 'NIFTY 50' -> 'NSE:NIFTY50-INDEX'
 */
export const toExchangeSymbol = (symbol) => {
  if (!symbol) return '';
  if (symbol.startsWith('NSE:') || symbol.startsWith('BSE:')) return symbol;

  for (const [key, value] of Object.entries(INDEX_SYMBOLS)) {
    if (value === symbol || key === symbol) {
      return EXCHANGE_SYMBOLS[key] || symbol;
    }
  }

  for (const [key, value] of Object.entries(EQUITY_SYMBOLS)) {
    if (value === symbol || key === symbol) {
      return EXCHANGE_SYMBOLS[key] || `NSE:${value}-EQ`;
    }
  }

  return `NSE:${symbol}-EQ`;
};

/**
 * Helper: Check if a given symbol is an index
 */
export const isIndexSymbol = (symbol) => {
  if (!symbol) return false;
  const upper = String(symbol).toUpperCase();
  return (
    upper.includes('NIFTY') ||
    upper.includes('SENSEX') ||
    upper.includes('MID') ||
    upper.includes('INDEX')
  );
};
