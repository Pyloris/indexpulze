import mongoose from "mongoose";

const { Schema, model } = mongoose;

/**
 * Supported timeframe categories for Volume Profile computation
 */
export const VOLUME_PROFILE_TIMEFRAMES = [
  "session",   // Standard intraday regular trading session (e.g. 09:15 - 15:30 IST)
  "1m",        // 1-minute bucket
  "3m",        // 3-minute bucket
  "5m",        // 5-minute bucket
  "10m",       // 10-minute bucket
  "15m",       // 15-minute bucket
  "30m",       // 30-minute bucket
  "1h",        // 1-hour rolling or bucket
  "4h",        // 4-hour bucket
  "1d",        // Daily aggregated
  "weekly",    // Weekly composite
  "custom",    // Custom ad-hoc time range
];

/**
 * Individual price bucket sub-schema within a volume profile
 */
const volumeProfileBucketSchema = new Schema(
  {
    price: {
      type: Number,
      required: true,
      index: false,
    },
    total_volume: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    buyer_volume: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    seller_volume: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    delta: {
      type: Number,
      default: 0, // buyer_volume - seller_volume
    },
  },
  { _id: false }
);

/**
 * Volume Profile Root Schema
 *
 * Persists aggregated volume distribution per price level for a stock/index
 * over a specified session or timeframe window.
 */
const volumeProfileSchema = new Schema(
  {
    symbol: {
      type: String,
      required: true,
      trim: true,
      index: true, // e.g. "NSE:SBIN-EQ", "NSE:NIFTY50-INDEX"
    },
    timeframe: {
      type: String,
      enum: VOLUME_PROFILE_TIMEFRAMES,
      default: "session",
      index: true,
    },
    session_date: {
      type: String, // Format: "YYYY-MM-DD" in exchange local timezone
      required: true,
      index: true,
    },
    start_time: {
      type: Date,
      required: true,
    },
    end_time: {
      type: Date,
      required: true,
    },
    tick_size: {
      type: Number,
      default: 0.05, // Price step/binning granularity (e.g. 0.05 for NSE equities)
    },

    // --- Key Profile Summary & Value Area Metrics ---
    poc: {
      type: Number,
      default: null, // Point of Control (price level with the highest total volume)
    },
    poc_volume: {
      type: Number,
      default: 0,
    },
    vah: {
      type: Number,
      default: null, // Value Area High (upper boundary of ~70% volume)
    },
    val: {
      type: Number,
      default: null, // Value Area Low (lower boundary of ~70% volume)
    },
    value_area_volume: {
      type: Number,
      default: 0,
    },
    value_area_pct: {
      type: Number,
      default: 70, // Standard 70% Value Area
    },

    // --- Price Extremes & Totals ---
    high_price: {
      type: Number,
      default: null,
    },
    low_price: {
      type: Number,
      default: null,
    },
    vwap: {
      type: Number,
      default: null, // Volume-Weighted Average Price for the session
    },
    total_volume: {
      type: Number,
      default: 0,
      min: 0,
    },
    total_buyer_volume: {
      type: Number,
      default: 0,
      min: 0,
    },
    total_seller_volume: {
      type: Number,
      default: 0,
      min: 0,
    },
    total_delta: {
      type: Number,
      default: 0, // total_buyer_volume - total_seller_volume
    },

    // --- Detailed Profile Buckets ---
    profile: {
      type: [volumeProfileBucketSchema],
      default: [],
    },

    // --- Ingestion & Lifecycle Metadata ---
    is_final: {
      type: Boolean,
      default: false, // True once market session is closed and profile is immutable
    },
    tick_count: {
      type: Number,
      default: 0, // Number of ticks aggregated into this profile
    },
    last_tick_time: {
      type: Date,
      default: null,
    },

    // --- Index Composition & Free-Float Market Cap Metadata ---
    is_index: {
      type: Boolean,
      default: false,
      index: true,
    },
    base_index_value: {
      type: Number,
      default: null, // e.g. 1000 for Nifty 50, Bank Nifty; 100 for Sensex
    },
    free_float_market_cap: {
      type: Number,
      default: null,
    },
    base_market_cap: {
      type: Number,
      default: null,
    },
    constituents_count: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// --- Compound Indexes ---
// Primary unique index: identified by symbol, timeframe, start_time window, and tick_size
volumeProfileSchema.index(
  { symbol: 1, timeframe: 1, start_time: 1, tick_size: 1 },
  { unique: true }
);

// Query indexes for fast API lookups by session_date, symbol, and timeframe
volumeProfileSchema.index({ symbol: 1, session_date: -1, timeframe: 1 });
volumeProfileSchema.index({ symbol: 1, start_time: -1, end_time: -1 });

export const VolumeProfile = model("volume_profiles", volumeProfileSchema);
export default VolumeProfile;
