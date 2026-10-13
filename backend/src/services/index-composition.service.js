import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { adapter } from '../adapters/adapter.js';
import { getIndexConfig, getConstituentsForIndex } from '../config/index-resolver.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONFIG_DIR = path.resolve(__dirname, '../config/index_composition');

/**
 * Normalized index alias to base config filename mapping
 */
const INDEX_ALIAS_MAP = {
  nifty: 'nifty_50',
  nifty50: 'nifty_50',
  'nifty 50': 'nifty_50',
  'nifty-50': 'nifty_50',
  'nse:nifty50-index': 'nifty_50',

  banknifty: 'bank_nifty',
  niftybank: 'bank_nifty',
  'bank nifty': 'bank_nifty',
  'bank-nifty': 'bank_nifty',
  'nifty bank': 'bank_nifty',
  'nse:niftybank-index': 'bank_nifty',

  finnifty: 'finnifty',
  'nifty financial services': 'finnifty',
  'nse:finnifty-index': 'finnifty',

  sensex: 'sensex',
  'bse:sensex-index': 'sensex',
};

/**
 * Fallback baseline index values for point contribution calculation
 */
const DEFAULT_INDEX_BASE_VALUES = {
  nifty_50: 24800.0,
  bank_nifty: 51300.0,
  finnifty: 23400.0,
  sensex: 81700.0,
};

export class IndexCompositionService {
  /**
   * Resolves normalized index key and composition file paths
   * @param {string} rawIndex
   * @returns {{ key: string, listPath: string, weightedPath: string }}
   */
  static resolveIndexConfig(rawIndex) {
    if (!rawIndex || typeof rawIndex !== 'string') {
      throw new Error("Invalid index parameter provided");
    }

    const resolved = getIndexConfig(rawIndex);
    const cleaned = rawIndex.trim().toLowerCase();
    const configBaseName = resolved ? resolved.file.replace(/\.json$/, '') : (INDEX_ALIAS_MAP[cleaned] || cleaned.replace(/[- ]+/g, '_'));

    const weightedPath = path.join(CONFIG_DIR, `${configBaseName}_weighted.json`);
    const listPath = path.join(CONFIG_DIR, `${configBaseName}.json`);

    return {
      key: configBaseName,
      listPath,
      weightedPath,
    };
  }

  /**
   * Reads composition and weight maps for the given index
   * @param {string} rawIndex
   * @returns {Promise<{ indexKey: string, symbols: string[], weights: Record<string, number> }>}
   */
  static async getIndexComposition(rawIndex) {
    const { key, listPath, weightedPath } = this.resolveIndexConfig(rawIndex);

    let weightsMap = {};
    let symbolList = [];

    // Attempt to load weighted json first
    try {
      const weightedContent = await fs.readFile(weightedPath, 'utf-8');
      if (weightedContent.trim()) {
        const parsed = JSON.parse(weightedContent);
        if (typeof parsed === 'object' && parsed !== null) {
          weightsMap = parsed;
          symbolList = Object.keys(parsed);
        }
      }
    } catch (err) {
      // Non-fatal if missing, fallback to constituent list
    }

    // Attempt to load unweighted list json
    try {
      const listContent = await fs.readFile(listPath, 'utf-8');
      if (listContent.trim()) {
        const parsed = JSON.parse(listContent);
        const list = Array.isArray(parsed) ? parsed : (Array.isArray(parsed?.list) ? parsed.list : []);
        if (list.length > 0) {
          symbolList = Array.from(new Set([...symbolList, ...list]));
        }
      }
    } catch (err) {
      // Non-fatal if list file doesn't exist or is empty
    }

    if (symbolList.length === 0) {
      throw new Error(`Index constituents configuration not found for '${rawIndex}'`);
    }

    return {
      indexKey: key,
      symbols: symbolList,
      weights: weightsMap,
    };
  }

  /**
   * Calculates constituent quotes, weight contributions, and point contribution
   * Formula:
   *   Index Value = (Current Free-Float Market Cap / Base Market Cap) * Base Index Value
   *   Point Contribution = (Stock % Change / 100) * Weight * Index Value
   *
   * @param {string} rawIndex
   * @param {object} [options]
   * @param {string} [options.adapterType='internal']
   * @param {number} [options.baseIndexValue]
   */
  static async getConstituentsWithContribution(rawIndex, options = {}) {
    const adapterType = options.adapterType || 'internal';
    const activeAdapter = adapter.getAdapter(adapterType);

    const { indexKey, symbols, weights } = await this.getIndexComposition(rawIndex);

    // Fetch quotes for all constituent stocks in batch
    const constituentQuotes = await activeAdapter.getQuotes(symbols);
    const quoteMap = new Map();
    for (const q of (constituentQuotes || [])) {
      quoteMap.set(q.symbol, q);
      if (q.fyersSymbol) {
        quoteMap.set(q.fyersSymbol, q);
      }
    }

    // Fetch index quote to determine current index value for points calculation
    let currentIndexValue = options.baseIndexValue || DEFAULT_INDEX_BASE_VALUES[indexKey] || 25000.0;
    try {
      const indexQuotes = await activeAdapter.getQuotes([rawIndex]);
      if (indexQuotes && indexQuotes[0] && indexQuotes[0].lastPrice > 0) {
        currentIndexValue = indexQuotes[0].lastPrice;
      }
    } catch {
      // Use fallback/default index value
    }

    // Determine weight normalization
    // In nifty_50_weighted.json and bank_nifty_weighted.json, top weights are formatted as decimals (e.g. 0.1326 = 13.26% or raw ratio)
    // or percentages. We normalize raw weights into fractional weight (0.0 to 1.0) and display percentage (0% to 100%).
    const rawWeightsList = symbols.map(s => Number(weights[s] || 0));
    const totalRawWeight = rawWeightsList.reduce((acc, w) => acc + w, 0);

    const constituents = symbols.map((symbol) => {
      const quote = quoteMap.get(symbol) || {
        symbol,
        lastPrice: 0,
        open: 0,
        high: 0,
        low: 0,
        prevClose: 0,
        change: 0,
        changePercent: 0,
        volume: 0,
        timestamp: Math.floor(Date.now() / 1000),
      };

      const rawWeight = Number(weights[symbol] || 0);

      // Fractional weight (0 to 1) normalized against total weights if total > 0, else equal weighting
      const normalizedFractionalWeight = totalRawWeight > 0
        ? rawWeight / totalRawWeight
        : (1 / symbols.length);

      // Percentage weight (0 to 100)
      const weightPercent = Number((normalizedFractionalWeight * 100).toFixed(4));

      // Stock price percentage change
      const stockChangePercent = Number(quote.changePercent || 0);

      // Points contributed to index:
      // Point Contribution = (stockChangePercent / 100) * normalizedFractionalWeight * currentIndexValue
      const pointsContribution = Number(
        ((stockChangePercent / 100) * normalizedFractionalWeight * currentIndexValue).toFixed(4)
      );

      return {
        symbol,
        quote: {
          lastPrice: quote.lastPrice,
          open: quote.open,
          high: quote.high,
          low: quote.low,
          prevClose: quote.prevClose,
          change: quote.change,
          changePercent: quote.changePercent,
          volume: quote.volume,
          timestamp: quote.timestamp,
        },
        weight: rawWeight,
        weightPercent,
        normalizedFractionalWeight: Number(normalizedFractionalWeight.toFixed(6)),
        pointsContribution,
      };
    });

    // Sort constituents by points contribution descending (highest positive contributors first)
    constituents.sort((a, b) => b.pointsContribution - a.pointsContribution);

    const totalPointsContributed = Number(
      constituents.reduce((acc, c) => acc + c.pointsContribution, 0).toFixed(4)
    );

    return {
      index: rawIndex,
      indexKey,
      currentIndexValue,
      constituentCount: constituents.length,
      totalPointsContributed,
      constituents,
    };
  }
}
