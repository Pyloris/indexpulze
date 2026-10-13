import express from "express";
import http from "http";
import setupApp from "./setup/setup-app.js";
import { appConfig } from "./config/app-config.js";
import { connectDatabase } from "./database/connection.js";
import { questdb } from "./database/questdb-client/questdb.js";

const app = express();
const server = http.createServer(app);

setupApp(app, server);

connectDatabase();

questdb.init().catch((err) => {
    console.warn("[QuestDB] Failed to initialize table schema on startup:", err.message);
});

server.listen(appConfig.PORT, () => {
    console.log(`Server up at ${appConfig.BASE_URL} on port ${appConfig.PORT}`)
});