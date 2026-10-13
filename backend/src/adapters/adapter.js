/**
 * Adapter Factory & Registry
 * 
 * Central manager that maintains the registry of adapters (e.g., 'internal' [Fyers], 'shoonya', etc.).
 * Provides getAdapter(type) to return the responsible adapter instance.
 * 
 * Usage:
 *   import { adapter } from './adapters/adapter.js';
 *   const internalAdapter = adapter.getAdapter('internal');
 *   const data = await internalAdapter.getHistoricalData({ symbol: 'NIFTY 50', timeframe: '5m', from_date: '2026-01-01', to_date: '2026-01-10' });
 */

import { BaseAdapter } from './base-adapter.js';
import { InternalAdapter } from './connectors/internal/adapter.js';

export class AdapterFactory {
  constructor() {
    // Registry of adapter classes / factories: type -> AdapterClass
    this.registry = new Map();
    // Cache of active adapter instances: type -> instance
    this.instances = new Map();

    // Auto-register default internal adapter
    this.register('internal', InternalAdapter);
  }

  /**
   * Register a new adapter class or factory function
   * @param {string} type - Unique identifier for the adapter (e.g. 'internal', 'shoonya')
   * @param {typeof BaseAdapter|Function} AdapterClass - Class extending BaseAdapter
   */
  register(type, AdapterClass) {
    if (!type || typeof type !== 'string') {
      throw new Error('Adapter type must be a valid non-empty string');
    }
    const key = type.toLowerCase().trim();
    this.registry.set(key, AdapterClass);
  }

  /**
   * Check if an adapter type is registered
   * @param {string} type
   * @returns {boolean}
   */
  hasAdapter(type) {
    if (!type) return false;
    return this.registry.has(type.toLowerCase().trim());
  }

  /**
   * Get an adapter instance by type.
   * If an instance has already been created and no custom options are passed,
   * the cached instance is reused (singleton pattern).
   * 
   * @param {string} [type='internal'] - Adapter type to retrieve
   * @param {object} [options={}] - Optional constructor configuration (appId, accessToken, etc.)
   * @returns {BaseAdapter} The adapter instance
   */
  getAdapter(type = 'internal', options = {}) {
    const key = String(type).toLowerCase().trim();

    if (!this.registry.has(key)) {
      const available = Array.from(this.registry.keys()).join(', ');
      throw new Error(
        `[AdapterFactory] Adapter '${type}' is not registered. Available adapters: [${available}]`
      );
    }

    const hasCustomOptions = Object.keys(options).length > 0;

    // Return cached instance if no custom options provided
    if (!hasCustomOptions && this.instances.has(key)) {
      return this.instances.get(key);
    }

    // Instantiate adapter
    const AdapterClass = this.registry.get(key);
    const instance = new AdapterClass(options);

    if (!hasCustomOptions) {
      this.instances.set(key, instance);
    }

    return instance;
  }

  /**
   * List all registered adapter types
   * @returns {string[]}
   */
  getRegisteredTypes() {
    return Array.from(this.registry.keys());
  }
}

// Global factory singleton instance
export const adapterFactory = new AdapterFactory();

/**
 * Universal adapter object matching the requested API:
 * adapter.getAdapter('internal') -> returns adapter with .getHistoricalData(...)
 */
export const adapter = {
  /**
   * Get the adapter instance for a given type (default: 'internal')
   * @param {string} [type='internal']
   * @param {object} [options={}]
   * @returns {BaseAdapter}
   */
  getAdapter(type = 'internal', options = {}) {
    return adapterFactory.getAdapter(type, options);
  },

  /**
   * Register an adapter
   * @param {string} type
   * @param {typeof BaseAdapter} AdapterClass
   */
  registerAdapter(type, AdapterClass) {
    adapterFactory.register(type, AdapterClass);
  },

  /**
   * Check if adapter is registered
   * @param {string} type
   */
  hasAdapter(type) {
    return adapterFactory.hasAdapter(type);
  },
};

export { BaseAdapter, InternalAdapter };
export default adapter;
