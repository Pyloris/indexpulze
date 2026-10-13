import { Sender } from '@questdb/nodejs-client';
import axios from 'axios';
import { appConfig } from '../../config/app-config.js';

/**
 * QuestDB client for market tick ingestion and analytics querying.
 *
 * Designed for high-frequency Fyers WebSocket tick data ingestion using
 * QuestDB ILP (InfluxDB Line Protocol over HTTP) and analytical queries via REST /exec.
 */
class QuestDBClient {
  constructor(options = {}) {
    this.host = options.host || appConfig.QUESTDB_HOST || 'localhost';
    this.restPort = Number(options.restPort || appConfig.QUESTDB_PORT_REST || 9000);
    this.ilpPort = Number(options.ilpPort || appConfig.QUESTDB_PORT_ILP || 9000);
    this.user = options.user || appConfig.QUESTDB_USER || 'admin';
    this.pass = options.pass || appConfig.QUESTDB_PASS || 'quest';

    this.tableName = options.tableName || 'market_ticks';
    this.sender = null;
    this.isConnecting = false;
    this.restBaseUrl = `http://${this.host}:${this.restPort}`;
  }

  /**
   * Builds the QuestDB ILP over HTTP configuration string.
   */
  getConnectConfigString() {
    // Defaults to HTTP ILP on restPort (9000)
    let conf = `http::addr=${this.host}:${this.restPort};`;
    if (this.user && this.pass) {
      conf += `username=${encodeURIComponent(this.user)};password=${encodeURIComponent(this.pass)};`;
    }
    // High performance tuning: auto-flush after 5,000 rows or every 500ms
    conf += `auto_flush_rows=5000;auto_flush_interval=500;`;
    return conf;
  }

  /**
   * Initialize table schema and ILP sender connection.
   */
  async init() {
    await this.ensureSchema();
    await this.getSender();
    return this;
  }

  /**
   * Lazily initializes and returns the active QuestDB ILP Sender instance.
   * @returns {Promise<Sender>}
   */
  async getSender() {
    if (this.sender) return this.sender;

    if (this.isConnecting) {
      while (this.isConnecting) {
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      if (this.sender) return this.sender;
    }

    try {
      this.isConnecting = true;
      const conf = this.getConnectConfigString();
      this.sender = await Sender.fromConfig(conf);
      return this.sender;
    } catch (err) {
      console.error('[QuestDB] Failed to initialize ILP Sender:', err.message);
      this.sender = null;
      throw err;
    } finally {
      this.isConnecting = false;
    }
  }

  /**
   * Ensures the market_ticks table schema is provisioned in QuestDB with
   * optimal designated timestamp, DAY partitioning, and WAL enabled.
   */
  async ensureSchema() {
    const ddl = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        symbol SYMBOL CAPACITY 2048 CACHE,
        ltp DOUBLE,
        open_price DOUBLE,
        high_price DOUBLE,
        low_price DOUBLE,
        prev_close_price DOUBLE,
        vol_traded_today LONG,
        last_traded_qty LONG,
        avg_trade_price DOUBLE,
        tot_buy_qty LONG,
        tot_sell_qty LONG,
        bid_price DOUBLE,
        ask_price DOUBLE,
        bid_size LONG,
        ask_size LONG,
        lower_ckt DOUBLE,
        upper_ckt DOUBLE,
        type SYMBOL,
        exch_feed_time TIMESTAMP,
        timestamp TIMESTAMP
      ) TIMESTAMP(timestamp) PARTITION BY DAY WAL;
    `;

    try {
      await this.query(ddl);
      console.log(`[QuestDB] Table '${this.tableName}' verified/created.`);
    } catch (err) {
      console.error(`[QuestDB] Failed to ensure schema for table '${this.tableName}':`, err.message);
      throw err;
    }
  }

  /**
   * Ingests a single Fyers market tick into QuestDB.
   *
   * @param {Object} tick - Raw or parsed tick from Fyers WebSocket
   * @param {string} [tableName] - Optional custom table name (defaults to this.tableName)
   */
  async insertTick(tick, tableName = this.tableName) {
    if (!tick || !tick.symbol) return;

    const sender = await this.getSender();

    // Timestamp resolution: use exch_feed_time if available, otherwise current local time
    // exch_feed_time from Fyers is in epoch seconds
    const designatedTimestampMicros = tick.exch_feed_time
      ? Math.floor(Number(tick.exch_feed_time) * 1000 * 1000)
      : Date.now() * 1000;

    const row = sender.table(tableName);

    // Symbols (indexed categorical strings)
    row.symbol('symbol', String(tick.symbol));
    if (tick.type) {
      row.symbol('type', String(tick.type));
    }

    // Double fields
    if (tick.ltp !== undefined && tick.ltp !== null) {
      row.floatColumn('ltp', Number(tick.ltp));
    }
    if (tick.open_price !== undefined && tick.open_price !== null) {
      row.floatColumn('open_price', Number(tick.open_price));
    }
    if (tick.high_price !== undefined && tick.high_price !== null) {
      row.floatColumn('high_price', Number(tick.high_price));
    }
    if (tick.low_price !== undefined && tick.low_price !== null) {
      row.floatColumn('low_price', Number(tick.low_price));
    }
    if (tick.prev_close_price !== undefined && tick.prev_close_price !== null) {
      row.floatColumn('prev_close_price', Number(tick.prev_close_price));
    }
    if (tick.avg_trade_price !== undefined && tick.avg_trade_price !== null) {
      row.floatColumn('avg_trade_price', Number(tick.avg_trade_price));
    }
    if (tick.bid_price !== undefined && tick.bid_price !== null) {
      row.floatColumn('bid_price', Number(tick.bid_price));
    }
    if (tick.ask_price !== undefined && tick.ask_price !== null) {
      row.floatColumn('ask_price', Number(tick.ask_price));
    }
    if (tick.lower_ckt !== undefined && tick.lower_ckt !== null) {
      row.floatColumn('lower_ckt', Number(tick.lower_ckt));
    }
    if (tick.upper_ckt !== undefined && tick.upper_ckt !== null) {
      row.floatColumn('upper_ckt', Number(tick.upper_ckt));
    }

    // Long (integer) fields
    if (tick.vol_traded_today !== undefined && tick.vol_traded_today !== null) {
      row.intColumn('vol_traded_today', Math.floor(Number(tick.vol_traded_today)));
    }
    if (tick.last_traded_qty !== undefined && tick.last_traded_qty !== null) {
      row.intColumn('last_traded_qty', Math.floor(Number(tick.last_traded_qty)));
    }
    if (tick.tot_buy_qty !== undefined && tick.tot_buy_qty !== null) {
      row.intColumn('tot_buy_qty', Math.floor(Number(tick.tot_buy_qty)));
    }
    if (tick.tot_sell_qty !== undefined && tick.tot_sell_qty !== null) {
      row.intColumn('tot_sell_qty', Math.floor(Number(tick.tot_sell_qty)));
    }
    if (tick.bid_size !== undefined && tick.bid_size !== null) {
      row.intColumn('bid_size', Math.floor(Number(tick.bid_size)));
    }
    if (tick.ask_size !== undefined && tick.ask_size !== null) {
      row.intColumn('ask_size', Math.floor(Number(tick.ask_size)));
    }

    // Timestamp column (exchange feed time as a dedicated column)
    if (tick.exch_feed_time) {
      row.timestampColumn('exch_feed_time', Math.floor(Number(tick.exch_feed_time) * 1000 * 1000), 'us');
    }

    // Set designated timestamp (in microseconds)
    await row.at(designatedTimestampMicros, 'us');
  }

  /**
   * Ingests a batch of ticks into QuestDB and flushes the buffer.
   *
   * @param {Array<Object>} ticks - Array of tick objects
   * @param {string} [tableName] - Optional custom table name
   */
  async insertBatch(ticks, tableName = this.tableName) {
    if (!Array.isArray(ticks) || ticks.length === 0) return;

    for (const tick of ticks) {
      await this.insertTick(tick, tableName);
    }
    await this.flush();
  }

  /**
   * Explicitly flushes the ILP buffer to QuestDB.
   */
  async flush() {
    if (this.sender) {
      await this.sender.flush();
    }
  }

  /**
   * Closes the active ILP sender connection.
   */
  async close() {
    if (this.sender) {
      try {
        await this.sender.flush();
        await this.sender.close();
      } finally {
        this.sender = null;
      }
    }
  }

  /**
   * Executes an arbitrary SQL query on QuestDB via the REST API (/exec).
   *
   * @param {string} sql - SQL query string
   * @param {Object} [params] - Query options (e.g. limit, explain)
   * @returns {Promise<Object>} Formatted response with rows, columns, and rowCount
   */
  async query(sql, params = {}) {
    const url = `${this.restBaseUrl}/exec`;
    const response = await axios.get(url, {
      params: {
        query: sql,
        ...params,
      },
      auth: this.user && this.pass ? { username: this.user, password: this.pass } : undefined,
      timeout: 10000,
    });

    const data = response.data;
    if (data.error) {
      throw new Error(`QuestDB Query Error: ${data.error} (position: ${data.position})`);
    }

    // Transform raw column + dataset array format into an array of objects
    if (Array.isArray(data.dataset) && Array.isArray(data.columns)) {
      const colNames = data.columns.map((col) => col.name);
      const rows = data.dataset.map((row) => {
        const obj = {};
        colNames.forEach((name, idx) => {
          obj[name] = row[idx];
        });
        return obj;
      });

      return {
        columns: data.columns,
        dataset: data.dataset,
        rows,
        count: data.count !== undefined ? data.count : rows.length,
        ddl: data.ddl,
      };
    }

    return data;
  }

  /**
   * Retrieves OHLC aggregate candles for a symbol using QuestDB's SAMPLE BY.
   *
   * @param {string} symbol - e.g. "NSE:NIFTY50-INDEX" or "NSE:SBIN-EQ"
   * @param {string} [timeframe='1m'] - e.g. "1s", "1m", "5m", "15m", "1h", "1d"
   * @param {string} [from] - ISO timestamp string or QuestDB timestamp expression
   * @param {string} [to] - ISO timestamp string or QuestDB timestamp expression
   * @returns {Promise<Array<Object>>}
   */
  async getOHLC(symbol, timeframe = '1m', from = null, to = null) {
    let whereClause = `WHERE symbol = '${symbol}'`;
    if (from && to) {
      whereClause += ` AND timestamp BETWEEN '${from}' AND '${to}'`;
    } else if (from) {
      whereClause += ` AND timestamp >= '${from}'`;
    }

    const sql = `
      SELECT
        timestamp,
        first(ltp) as open,
        max(ltp) as high,
        min(ltp) as low,
        last(ltp) as close,
        sum(last_traded_qty) as volume,
        last(vol_traded_today) as cumulative_volume
      FROM ${this.tableName}
      ${whereClause}
      SAMPLE BY ${timeframe} ALIGN TO CALENDAR
      ORDER BY timestamp ASC;
    `;

    const res = await this.query(sql);
    return res.rows || [];
  }

  /**
   * Retrieves the latest tick for one or more symbols.
   * Note: In QuestDB SQL, WHERE clause must precede LATEST ON ... PARTITION BY.
   *
   * @param {string|Array<string>} [symbols]
   * @returns {Promise<Array<Object>>}
   */
  async getLatestTicks(symbols) {
    let sql = `SELECT * FROM ${this.tableName}`;
    if (symbols) {
      const symbolList = Array.isArray(symbols) ? symbols : [symbols];
      if (symbolList.length > 0) {
        const quoted = symbolList.map((s) => `'${s}'`).join(',');
        sql += ` WHERE symbol IN (${quoted})`;
      }
    }
    sql += ` LATEST ON timestamp PARTITION BY symbol;`;
    const res = await this.query(sql);
    return res.rows || [];
  }
}

// Export singleton instance initialized with appConfig settings
const questdb = new QuestDBClient();

export { QuestDBClient, questdb };
export default questdb;
