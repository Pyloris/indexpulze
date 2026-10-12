import fs from "fs/promises";
import path from "path";
import { appConfig } from "../config/app-config.js";

/**
 * Standard Upstream Token Storage Schema
 * ---------------------------------------
 * {
 *   "access_token": string,    // Active Fyers access token for API calls
 *   "refresh_token": string,   // 15-day refresh token used to renew access_token
 *   "token_type": string,      // "Bearer"
 *   "app_id": string,          // Associated Fyers App ID / Client ID
 *   "expires_at": number,      // Unix timestamp (ms) when access_token expires
 *   "updated_at": string,      // ISO 8601 timestamp of last token save/refresh
 *   "profile": object | null   // Optional cached user profile info
 * }
 */

/**
 * Resolve path to upstream tokens storage from appConfig
 * @returns {{ storageDir: string, filePath: string }}
 */
export function getStorageInfo() {
    const filePath = appConfig.APP_UPSTREAM_TOKEN_FILE || (
        appConfig.STORAGE_PATH
            ? path.join(appConfig.STORAGE_PATH, "fyers.json")
            : path.join(process.cwd(), "storage", "fyers.json")
    );
    const storageDir = appConfig.STORAGE_PATH || path.dirname(filePath);
    return { storageDir, filePath };
}

/**
 * Read tokens from configured file (with fallback to fyers.json if present)
 * @returns {Promise<Object|null>}
 */
export async function loadStoredTokens() {
    const { storageDir, filePath } = getStorageInfo();
    try {
        const content = await fs.readFile(filePath, "utf-8");
        return JSON.parse(content);
    } catch {
        // Fallback: check if fyers.json exists in the storage directory
        try {
            const fallbackPath = path.join(storageDir, "fyers.json");
            const content = await fs.readFile(fallbackPath, "utf-8");
            return JSON.parse(content);
        } catch {
            return null;
        }
    }
}

/**
 * Save tokens in standardized format to the storage file
 * @param {Object} tokenData - Object containing access_token, refresh_token, and optional metadata
 * @returns {Promise<Object>} The saved payload
 */
export async function saveTokens(tokenData = {}) {
    const { storageDir, filePath } = getStorageInfo();
    await fs.mkdir(storageDir, { recursive: true });

    // Standardized token format
    const payload = {
        access_token: tokenData.access_token || tokenData.accessToken || null,
        refresh_token: tokenData.refresh_token || tokenData.refreshToken || null,
        token_type: tokenData.token_type || tokenData.tokenType || "Bearer",
        app_id: tokenData.app_id || appConfig.FYERS_APP_ID || null,
        expires_at: tokenData.expires_at || (Date.now() + 24 * 60 * 60 * 1000), // ~24h default
        updated_at: new Date().toISOString(),
        ...(tokenData.profile && { profile: tokenData.profile }),
    };

    await fs.writeFile(filePath, JSON.stringify(payload, null, 2), "utf-8");
    console.log(`[Storage] Tokens saved successfully in standardized format to: ${filePath}`);

    return payload;
}

/**
 * Get the active access token directly if available
 * @returns {Promise<string|null>}
 */
export async function getStoredAccessToken() {
    const tokens = await loadStoredTokens();
    return tokens?.access_token || null;
}

/**
 * Get the refresh token directly if available
 * @returns {Promise<string|null>}
 */
export async function getStoredRefreshToken() {
    const tokens = await loadStoredTokens();
    return tokens?.refresh_token || null;
}

/**
 * Remove/clear stored token file
 */
export async function clearStoredTokens() {
    const { filePath } = getStorageInfo();
    try {
        await fs.unlink(filePath);
        console.log(`[Storage] Cleared token file: ${filePath}`);
    } catch {
        // File may not exist
    }
}
