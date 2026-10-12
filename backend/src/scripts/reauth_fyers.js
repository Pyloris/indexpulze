import crypto from "crypto";
import readline from "readline";
import http from "http";
import axios from "axios";
import { appConfig } from "../config/app-config.js";
import { getStorageInfo, loadStoredTokens, saveTokens } from "../utils/token-storage.js";

const FYERS_API_BASE = "https://api-t1.fyers.in";

/**
 * Generate SHA-256 appIdHash required by Fyers API v3
 * SHA256(client_id:secret_key)
 */
function getAppIdHash(appId, secretKey) {
    return crypto.createHash("sha256").update(`${appId}:${secretKey}`).digest("hex");
}

/**
 * Validate current access token with Fyers User Profile endpoint
 * GET https://api-t1.fyers.in/api/v3/profile
 */
async function validateAccessToken(appId, accessToken) {
    if (!accessToken) return { valid: false, reason: "No access token provided" };

    try {
        console.log("[Auth] Validating access token with Fyers Profile API...");
        const response = await axios.get(`${FYERS_API_BASE}/api/v3/profile`, {
            headers: {
                Authorization: `${appId}:${accessToken}`,
                "Content-Type": "application/json",
            },
            timeout: 10000,
        });

        if (response.data && response.data.s === "ok") {
            return {
                valid: true,
                profile: response.data.data,
            };
        }

        return {
            valid: false,
            reason: response.data.message || "Invalid response status from Fyers",
        };
    } catch (err) {
        const errorMsg = err.response?.data?.message || err.message;
        return {
            valid: false,
            reason: errorMsg,
        };
    }
}

/**
 * Exchange refresh token for a new access token
 * POST https://api-t1.fyers.in/api/v3/validate-refresh-token
 */
async function refreshAccessToken(appId, secretKey, pin, refreshToken) {
    if (!refreshToken) throw new Error("No refresh token available");
    if (!pin) throw new Error("FYERS_PIN is missing from environment configuration");

    const appIdHash = getAppIdHash(appId, secretKey);

    console.log("[Auth] Attempting to refresh access token using refresh_token...");
    const response = await axios.post(
        `${FYERS_API_BASE}/api/v3/validate-refresh-token`,
        {
            grant_type: "refresh_token",
            appIdHash,
            refresh_token: refreshToken,
            pin,
        },
        {
            headers: { "Content-Type": "application/json" },
            timeout: 10000,
        }
    );

    if (response.data && response.data.s === "ok") {
        return {
            access_token: response.data.access_token,
            refresh_token: response.data.refresh_token || refreshToken,
        };
    }

    throw new Error(response.data.message || "Failed to validate refresh token");
}

/**
 * Exchange one-time auth code for access token & refresh token
 * POST https://api-t1.fyers.in/api/v3/validate-authcode
 */
async function exchangeAuthCodeForTokens(appId, secretKey, authCode) {
    const appIdHash = getAppIdHash(appId, secretKey);

    console.log("[Auth] Exchanging authorization code for tokens...");
    const response = await axios.post(
        `${FYERS_API_BASE}/api/v3/validate-authcode`,
        {
            grant_type: "authorization_code",
            appIdHash,
            code: authCode,
        },
        {
            headers: { "Content-Type": "application/json" },
            timeout: 10000,
        }
    );

    if (response.data && response.data.s === "ok") {
        return {
            access_token: response.data.access_token,
            refresh_token: response.data.refresh_token,
        };
    }

    throw new Error(response.data.message || "Failed to exchange auth_code");
}

/**
 * Extract auth_code from raw input (supports either pure code or complete redirect URL)
 */
function extractAuthCode(input) {
    const trimmed = input.trim();
    if (!trimmed) return null;

    try {
        if (trimmed.includes("http://") || trimmed.includes("https://") || trimmed.includes("?")) {
            const urlObj = new URL(trimmed.startsWith("http") ? trimmed : `http://dummy.com${trimmed}`);
            return urlObj.searchParams.get("auth_code");
        }
    } catch {
        // Fallback to pure string
    }

    return trimmed;
}

/**
 * Interactive Re-authentication Flow
 * 1. Generates Fyers authorization URL
 * 2. Starts a local HTTP callback server to catch redirect if applicable
 * 3. Also allows terminal input of the auth_code or redirect URL
 */
async function launchReauthFlow(appId, secretKey, redirectUri) {
    const authUrl = `${FYERS_API_BASE}/api/v3/generate-authcode?client_id=${encodeURIComponent(
        appId
    )}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&state=reauth_${Date.now()}`;

    console.log("\n" + "=".repeat(75));
    console.log("             FYERS RE-AUTHENTICATION REQUIRED");
    console.log("=".repeat(75));
    console.log("\n1. Open the following URL in your browser to log in and authorize:\n");
    console.log(`   \x1b[36m${authUrl}\x1b[0m\n`);
    console.log("2. After completing Fyers login (TOTP + PIN), you will be redirected.");
    console.log(`   Configured redirect URI: ${redirectUri}`);
    console.log("=".repeat(75) + "\n");

    return new Promise((resolve, reject) => {
        let isResolved = false;
        let server = null;

        const cleanup = () => {
            if (server) {
                try {
                    server.close();
                } catch {
                    // Ignore
                }
            }
        };

        const handleSuccessCode = async (code) => {
            if (isResolved) return;
            isResolved = true;
            cleanup();

            try {
                const tokens = await exchangeAuthCodeForTokens(appId, secretKey, code);
                await saveTokens(tokens);
                resolve(tokens);
            } catch (err) {
                reject(err);
            }
        };

        // Try setting up a local temporary HTTP receiver if redirectUri is localhost/127.0.0.1
        try {
            const parsedUri = new URL(redirectUri);
            if (parsedUri.hostname === "localhost" || parsedUri.hostname === "127.0.0.1") {
                const port = parsedUri.port || (parsedUri.protocol === "https:" ? 443 : 80);
                server = http.createServer((req, res) => {
                    const reqUrl = new URL(req.url, `http://${req.headers.host}`);
                    const code = reqUrl.searchParams.get("auth_code");

                    if (code) {
                        res.writeHead(200, { "Content-Type": "text/html" });
                        res.end(`
                            <div style="font-family:sans-serif;text-align:center;padding:50px;">
                                <h1 style="color:#10b981;">Authentication Successful!</h1>
                                <p>Authorization code received. You can close this tab and return to the terminal.</p>
                            </div>
                        `);
                        console.log("\n[Auth] Captured auth_code automatically from browser redirect!");
                        handleSuccessCode(code);
                    } else {
                        res.writeHead(200, { "Content-Type": "text/plain" });
                        res.end("Waiting for auth_code parameter...");
                    }
                });

                server.on("error", (e) => {
                    console.log(`[Note] Local redirect server could not bind port ${port} (${e.message}).`);
                    console.log("[Note] You can manually paste the redirected URL or auth_code below.");
                });

                server.listen(port, () => {
                    console.log(`[Listener] Listening on ${redirectUri} for automatic browser callback...`);
                });
            }
        } catch {
            // URL parse error or non-localhost
        }

        // Terminal fallback prompt
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.question("Paste the redirected URL or auth_code here:\n> ", async (answer) => {
            rl.close();
            const code = extractAuthCode(answer);
            if (!code) {
                cleanup();
                return reject(new Error("No valid auth_code found in provided input"));
            }
            await handleSuccessCode(code);
        });
    });
}

/**
 * Main execution flow
 */
async function main() {
    console.log("=== FYERS AUTHENTICATION MANAGER ===");

    const appId = appConfig.FYERS_APP_ID;
    const secretKey = appConfig.FYERS_SECRET_ID;
    const pin = appConfig.FYERS_PIN;
    const redirectUri = appConfig.FYERS_REDIRECT_URI || "http://localhost:8088/api/v1/auth/fyers/callback";

    if (!appId || !secretKey) {
        console.error("\n[Error] Missing FYERS_APP_ID or FYERS_SECRET_ID / FYERS_SECRET_KEY in environment!");
        process.exit(1);
    }

    const { filePath } = getStorageInfo();
    console.log(`[Storage] Target token file: ${filePath}`);

    // Step 1: Check existing token file
    const storedTokens = await loadStoredTokens();

    if (storedTokens?.access_token) {
        console.log("[Step 1] Found existing access token. Validating...");
        const validation = await validateAccessToken(appId, storedTokens.access_token);

        if (validation.valid) {
            console.log("\n\x1b[32m✔ Access token is VALID and ACTIVE!\x1b[0m");
            if (validation.profile) {
                console.log(`  User: ${validation.profile.name || validation.profile.fy_id}`);
                console.log(`  Client ID: ${validation.profile.fy_id}`);
                console.log(`  Email: ${validation.profile.email_id}`);
            }
            return;
        }

        console.log(`\x1b[33m⚠ Access token validation failed: ${validation.reason}\x1b[0m`);

        // Step 2: Try Refresh Token
        if (storedTokens.refresh_token && pin) {
            console.log("[Step 2] Attempting to generate new access token using refresh token...");
            try {
                const refreshed = await refreshAccessToken(appId, secretKey, pin, storedTokens.refresh_token);
                await saveTokens(refreshed);

                console.log("\x1b[32m✔ Access token refreshed successfully!\x1b[0m");
                const verify = await validateAccessToken(appId, refreshed.access_token);
                if (verify.valid) {
                    console.log(`  Verified active session for: ${verify.profile?.name || verify.profile?.fy_id}`);
                }
                return;
            } catch (refreshErr) {
                console.log(`\x1b[31m✖ Refresh token failed: ${refreshErr.message}\x1b[0m`);
            }
        } else {
            console.log("[Step 2] No valid refresh_token or FYERS_PIN found.");
        }
    } else {
        console.log("[Step 1] No stored tokens found in storage.");
    }

    // Step 3: Launch interactive reauth process
    console.log("[Step 3] Launching manual browser authentication flow...");
    try {
        const tokens = await launchReauthFlow(appId, secretKey, redirectUri);
        console.log("\n\x1b[32m✔ Successfully authenticated with Fyers!\x1b[0m");

        const verify = await validateAccessToken(appId, tokens.access_token);
        if (verify.valid) {
            console.log(`  Active Account: ${verify.profile?.name || verify.profile?.fy_id}`);
        }
        process.exit(0);
    } catch (err) {
        console.error("\n\x1b[31m✖ Authentication failed:\x1b[0m", err.message);
        process.exit(1);
    }
}

main().catch((err) => {
    console.error("[Fatal Error]", err);
    process.exit(1);
});
