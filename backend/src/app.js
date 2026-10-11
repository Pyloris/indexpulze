import express from "express";
import http from "http";
import setupApp from "./setup/setup-app.js";
import { appConfig } from "./config/app-config.js";
import { connectDatabase } from "./database/connection.js";

const app = express();
const server = http.createServer(app);

setupApp(app, server);

connectDatabase();

server.listen(appConfig.PORT, () => {
    console.log(`Server up at ${appConfig.BASE_URL} on port ${appConfig.PORT}`)
});