import { Config } from "./env.js";

export const buildMongodbUrl = () => {
  const username = Config.get("MONGODB_USER");
  const password = Config.get("MONGODB_PASS");
  const host = Config.get("MONGODB_HOST");
  const port = Config.get("MONGODB_PORT");
  const dbName = Config.get("MONGODB_DB", "tradebot");

  let url = `mongodb://${username}:${password}@${host}:${port}/${dbName}?authSource=admin&replicaSet=rs0`;

  return url;
}


const appConfig = {

    APP_NAME: Config.get("APP_NAME", "trade-bot"),

    PORT: Config.get("PORT", 8088),

    MONGODB_USER: Config.get("MONGODB_USER"),
    MONGODB_PASS: Config.get("MONGODB_PASS"),
    MONGODB_HOST: Config.get("MONGODB_HOST"),
    MONGODB_PORT: Config.get("MONGODB_PORT"),
    MONGODB_DB: Config.get("MONGODB_DB", "tradebot"),

    MONGODB_URL: buildMongodbUrl(),

    QUESTDB_HOST: Config.get("QUESTDB_HOST", "localhost"),
    QUESTDB_PORT_PG: Config.get("QUESTDB_PORT_PG", 8812),
    QUESTDB_PORT_REST: Config.get("QUESTDB_PORT_REST", 9000),
    QUESTDB_PORT_ILP: Config.get("QUESTDB_PORT_ILP", 9009),
    QUESTDB_PORT_HEALTH: Config.get("QUESTDB_PORT_HEALTH", 9003),
    QUESTDB_USER: Config.get("QUESTDB_USER", "admin"),
    QUESTDB_PASS: Config.get("QUESTDB_PASS", "quest"),


    JWT_SECRET: Config.get("JWT_SECRET", "supersecretjwtkey"),
}


export { appConfig };
export default appConfig;