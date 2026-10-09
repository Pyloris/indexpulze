import setupMiddlewares from "./setup-middlewares.js";
import setupRoutes from "./setup-routes.js";
import setupCrons from "./setup-crons.js";

const setupApp = (app) => {
    setupMiddlewares(app);
    setupRoutes(app);
    setupCrons();
};

export default setupApp;
