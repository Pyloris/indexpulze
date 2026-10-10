import setupMiddlewares from "./setup-middlewares.js";
import setupRoutes from "./setup-routes.js";

const setupApp = (app) => {
    setupMiddlewares(app);
    setupRoutes(app);
};

export default setupApp;
