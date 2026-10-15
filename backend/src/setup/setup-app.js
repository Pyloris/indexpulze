import setupMiddlewares from "./setup-middlewares.js";
import setupRoutes from "./setup-routes.js";
import setupWebsockets from "./setup-websockets.js";

const setupApp = async (app, server) => {
    setupMiddlewares(app);
    setupRoutes(app);
    if (server) {
        await setupWebsockets(server);
    }
};

export default setupApp;
