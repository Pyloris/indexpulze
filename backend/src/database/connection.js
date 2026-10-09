import mongoose from "mongoose";
import { appConfig } from "../config/app-config.js";

const MONGODB_URL = appConfig.MONGODB_URL;

// Connection Configuration Options
const MONGO_OPTIONS = {
  maxPoolSize: 10,               // Maintain up to 10 socket connections
  minPoolSize: 2,                // Keep at least 2 connections open
  serverSelectionTimeoutMS: 5000,// Fail fast if server is unreachable
  socketTimeoutMS: 45000,        // Close sockets after 45 seconds of inactivity
  family: 4                      // Use IPv4 (avoids IPv6 dual-stack resolution delays)
};

// Retry Configuration
const MAX_RETRIES = 8;
const INITIAL_BACKOFF_MS = 1000; // Start with 1 second

/**
 * Register connection lifecycle event listeners
 */
function setupConnectionListeners() {
  const connection = mongoose.connection;

  connection.removeAllListeners("connected");
  connection.removeAllListeners("error");
  connection.removeAllListeners("disconnected");
  connection.removeAllListeners("reconnected");

  connection.on("connected", () => {
    console.log("[MongoDB] Connection established successfully.");
  });

  connection.on("error", (err) => {
    console.error("[MongoDB] Connection error:", err.message);
  });

  connection.on("disconnected", () => {
    console.warn("[MongoDB] Connection lost. Driver will attempt automatic reconnection...");
  });

  connection.on("reconnected", () => {
    console.log("[MongoDB] Reconnected successfully.");
  });
}

/**
 * Connects to MongoDB with Exponential Backoff
 */
export async function connectDatabase(retries = MAX_RETRIES, delay = INITIAL_BACKOFF_MS) {
  setupConnectionListeners();

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`[MongoDB] Connecting to database (Attempt ${attempt}/${retries})...`);
      await mongoose.connect(MONGODB_URL, MONGO_OPTIONS);
      return;
    } catch (error) {
      console.error(`[MongoDB] Connection attempt ${attempt} failed: ${error.message}`);

      if (attempt === retries) {
        throw new Error(`[MongoDB] Could not establish connection after ${retries} attempts.`);
      }

      // Calculate exponential backoff with jitter
      const jitter = Math.random() * 200;
      const nextDelay = delay * 2 + jitter;

      console.log(`[MongoDB] Retrying in ${Math.round(nextDelay / 1000)}s...`);
      await new Promise((resolve) => setTimeout(resolve, nextDelay));
      delay = nextDelay;
    }
  }
}

/**
 * Graceful Shutdown Handler
 */
export async function disconnectDatabase() {
  try {
    await mongoose.connection.close();
    console.log("[MongoDB] Connection closed gracefully.");
  } catch (error) {
    console.error("[MongoDB] Error during disconnection:", error);
  }
}