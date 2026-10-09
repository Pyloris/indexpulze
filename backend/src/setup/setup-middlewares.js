import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { appConfig } from "../config/app-config.js";

const setupMiddlewares = (app) => {

    // CORS configuration
    const corsOptions = {
        origin: [
            appConfig.BASE_URL,
            appConfig.UI_SERVICE_URL,
            "http://localhost:5173",
            "http://127.0.0.1:5173",
        ],
        credentials: true,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    };

    app.use(cors(corsOptions));

    app.use(
        express.json({
            limit: "50mb",
        }),
    );

    app.use(
        express.urlencoded({
            limit: "50mb",
            extended: true,
            parameterLimit: 100000,
        }),
    );

    app.use(cookieParser());

    app.use(morgan('tiny', { skip: function (req, res) { return req.method == "OPTIONS" } }));
};


export default setupMiddlewares;
