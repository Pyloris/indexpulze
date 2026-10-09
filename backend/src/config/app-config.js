import { Config } from "./env.js";

export const buildMongodbUrl = () => {
  const username = Config.get("MONGODB_USER");
  const password = Config.get("MONGODB_PASS");
  const host = Config.get("MONGODB_HOST");
  const port = Config.get("MONGODB_PORT");
  const dbName = Config.get("DB_NAME", "tradebot");

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

    MONGODB_URL: buildMongodbUrl(),


    JWT_SECRET: Config.get("JWT_SECRET", "supersecretjwtkey"),
}


export { appConfig };
export default appConfig;