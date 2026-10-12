import { Config } from "./env.js";
import { buildMongodbUrl } from "../utils/utils.js";


const appConfig = {

    APP_NAME: Config.get("APP_NAME"),

    APP_URL: Config.get("APP_URL"),
    API_URL: Config.get("API_URL"),

    PORT: Config.get("PORT", 8088),

    MONGODB_USER: Config.get("MONGODB_USER"),
    MONGODB_PASS: Config.get("MONGODB_PASS"),
    MONGODB_HOST: Config.get("MONGODB_HOST"),
    MONGODB_PORT: Config.get("MONGODB_PORT"),
    MONGODB_DB: Config.get("MONGODB_DB"),

    MONGODB_URL: buildMongodbUrl(),

    QUESTDB_HOST: Config.get("QUESTDB_HOST", "localhost"),
    QUESTDB_PORT_PG: Config.get("QUESTDB_PORT_PG", 8812),
    QUESTDB_PORT_REST: Config.get("QUESTDB_PORT_REST", 9000),
    QUESTDB_PORT_ILP: Config.get("QUESTDB_PORT_ILP", 9009),
    QUESTDB_PORT_HEALTH: Config.get("QUESTDB_PORT_HEALTH", 9003),
    QUESTDB_USER: Config.get("QUESTDB_USER", "admin"),
    QUESTDB_PASS: Config.get("QUESTDB_PASS", "quest"),

    STORAGE_PATH: Config.get("STORAGE_PATH"),
    APP_UPSTREAM_TOKEN_FILE: Config.get("STORAGE_PATH") + "/upstream_creds.json",

    JWT_SECRET: Config.get("JWT_SECRET", "supersecretjwtkey"),


    FYERS_APP_ID: Config.get("FYERS_APP_ID", ""),
    FYERS_SECRET_ID: Config.get("FYERS_SECRET_ID") || Config.get("FYERS_SECRET_KEY", ""),
    FYERS_PIN: Config.get("FYERS_PIN", ""),
    FYERS_REDIRECT_URI: Config.get("FYERS_REDIRECT_URI"),

    // WebSocket & Redis Distribution Settings
    WS_PATH: Config.get("WS_PATH", "/ws"),
    WS_HEARTBEAT_MS: Number(Config.get("WS_HEARTBEAT_MS", 30000)),
    WS_MAX_SUBSCRIPTIONS: Number(Config.get("WS_MAX_SUBSCRIPTIONS", 100)),
    REDIS_HOST: Config.get("REDIS_HOST", null),
    REDIS_PORT: Number(Config.get("REDIS_PORT", 6379)),
    REDIS_PASSWORD: Config.get("REDIS_PASSWORD", null),
}


export { appConfig };
export default appConfig;