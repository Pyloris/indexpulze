import { Config } from "../config/env.js";

export const buildMongodbUrl = () => {
  const username = Config.get("MONGODB_USER");
  const password = Config.get("MONGODB_PASS");
  const host = Config.get("MONGODB_HOST");
  const port = Config.get("MONGODB_PORT");
  const dbName = Config.get("MONGODB_DB");

  let url = `mongodb://${username}:${password}@${host}:${port}/${dbName}?authSource=admin`;

  return url;
};
