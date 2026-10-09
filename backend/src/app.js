import express from "express";
import setupApp from "./setup/setup-app.js";
import { appConfig } from "./config/app-config.js";
import { connectDatabase } from "./database/connection.js";

const app = express();

setupApp(app);

connectDatabase();

app.listen(appConfig.PORT, () => {
    console.log("Server running on port " + appConfig.PORT);
});