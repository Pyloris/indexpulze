import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const COMPOSITION_DIR = path.resolve(__dirname, 'index_composition');

/**
 * Mapping of Index identifiers (Standard Name, Fyers Symbol, Aliases)
 * to their corresponding constituent configuration files.
 */
export const INDEX_CONSTITUENTS_MAP = Object.freeze({
  // NIFTY 50
  'NIFTY': {
    indexSymbol: 'NSE:NIFTY50-INDEX',
    name: 'NIFTY 50',
    file: 'nifty_50.json',
    weightedFile: 'nifty_50_weighted.json',
  },
  'NIFTY 50': {
    indexSymbol: 'NSE:NIFTY50-INDEX',
    name: 'NIFTY 50',
    file: 'nifty_50.json',
    weightedFile: 'nifty_50_weighted.json',
  },
  'NIFTY50': {
    indexSymbol: 'NSE:NIFTY50-INDEX',
    name: 'NIFTY 50',
    file: 'nifty_50.json',
    weightedFile: 'nifty_50_weighted.json',
  },
  'NSE:NIFTY50-INDEX': {
    indexSymbol: 'NSE:NIFTY50-INDEX',
    name: 'NIFTY 50',
    file: 'nifty_50.json',
    weightedFile: 'nifty_50_weighted.json',
  },

  // BANK NIFTY
  'BANKNIFTY': {
    indexSymbol: 'NSE:NIFTYBANK-INDEX',
    name: 'BANK NIFTY',
    file: 'bank_nifty.json',
    weightedFile: 'bank_nifty_weighted.json',
  },
  'BANK NIFTY': {
    indexSymbol: 'NSE:NIFTYBANK-INDEX',
    name: 'BANK NIFTY',
    file: 'bank_nifty.json',
    weightedFile: 'bank_nifty_weighted.json',
  },
  'NIFTYBANK': {
    indexSymbol: 'NSE:NIFTYBANK-INDEX',
    name: 'BANK NIFTY',
    file: 'bank_nifty.json',
    weightedFile: 'bank_nifty_weighted.json',
  },
  'NSE:NIFTYBANK-INDEX': {
    indexSymbol: 'NSE:NIFTYBANK-INDEX',
    name: 'BANK NIFTY',
    file: 'bank_nifty.json',
    weightedFile: 'bank_nifty_weighted.json',
  },

  // FINNIFTY
  'FINNIFTY': {
    indexSymbol: 'NSE:FINNIFTY-INDEX',
    name: 'FINNIFTY',
    file: 'finnifty.json',
    weightedFile: 'finnifty_weighted.json',
  },
  'NSE:FINNIFTY-INDEX': {
    indexSymbol: 'NSE:FINNIFTY-INDEX',
    name: 'FINNIFTY',
    file: 'finnifty.json',
    weightedFile: 'finnifty_weighted.json',
  },

  // SENSEX
  'SENSEX': {
    indexSymbol: 'BSE:SENSEX-INDEX',
    name: 'SENSEX',
    file: 'sensex.json',
    weightedFile: 'sensex_weighted.json',
  },
  'BSE:SENSEX-INDEX': {
    indexSymbol: 'BSE:SENSEX-INDEX',
    name: 'SENSEX',
    file: 'sensex.json',
    weightedFile: 'sensex_weighted.json',
  },
});

/**
 * Resolves the configuration entry for an index symbol or alias.
 * @param {string} symbolOrAlias
 * @returns {object|null}
 */
export function getIndexConfig(symbolOrAlias) {
  if (!symbolOrAlias || typeof symbolOrAlias !== 'string') return null;
  const key = symbolOrAlias.trim().toUpperCase();
  return INDEX_CONSTITUENTS_MAP[key] || null;
}

/**
 * Loads the constituent symbols for a given index symbol or alias.
 * @param {string} symbolOrAlias
 * @returns {string[]} Array of constituent symbols (e.g. ['NSE:HDFCBANK-EQ', ...])
 */
export function getConstituentsForIndex(symbolOrAlias) {
  const config = getIndexConfig(symbolOrAlias);
  if (!config) return [];

  const filePath = path.join(COMPOSITION_DIR, config.file);
  const weightedFilePath = config.weightedFile ? path.join(COMPOSITION_DIR, config.weightedFile) : null;

  let symbols = [];

  // Try reading list from composition file
  if (fs.existsSync(filePath)) {
    try {
      const raw = fs.readFileSync(filePath, 'utf-8').trim();
      if (raw) {
        const parsed = JSON.parse(raw);
        symbols = Array.isArray(parsed) ? parsed : (Array.isArray(parsed?.list) ? parsed.list : []);
      }
    } catch (err) {
      console.warn(`[index-resolver] Failed to parse ${filePath}:`, err.message);
    }
  }

  // Fallback to weighted file if unweighted list is empty
  if (symbols.length === 0 && weightedFilePath && fs.existsSync(weightedFilePath)) {
    try {
      const raw = fs.readFileSync(weightedFilePath, 'utf-8').trim();
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof parsed === 'object' && parsed !== null) {
          symbols = Object.keys(parsed);
        }
      }
    } catch (err) {
      console.warn(`[index-resolver] Failed to parse ${weightedFilePath}:`, err.message);
    }
  }

  return symbols;
}

/**
 * Retrieves all unique constituent symbols across ALL configured indices.
 * @returns {string[]}
 */
export function getAllIndexConstituents() {
  const uniqueSymbols = new Set();
  const seenFiles = new Set();

  for (const entry of Object.values(INDEX_CONSTITUENTS_MAP)) {
    if (seenFiles.has(entry.file)) continue;
    seenFiles.add(entry.file);

    const list = getConstituentsForIndex(entry.indexSymbol);
    list.forEach((sym) => uniqueSymbols.add(sym));
  }

  return Array.from(uniqueSymbols);
}

/**
 * Retrieves all registered primary index symbols (e.g. ['NSE:NIFTY50-INDEX', ...])
 * @returns {string[]}
 */
export function getAllIndexSymbols() {
  const indices = new Set();
  for (const entry of Object.values(INDEX_CONSTITUENTS_MAP)) {
    indices.add(entry.indexSymbol);
  }
  return Array.from(indices);
}

export default {
  INDEX_CONSTITUENTS_MAP,
  getIndexConfig,
  getConstituentsForIndex,
  getAllIndexConstituents,
  getAllIndexSymbols,
};
