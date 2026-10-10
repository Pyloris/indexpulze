import { router } from "../routes/index.js";
import { errorHandler } from "../middlewares/error-handler.js";
import { setupSwagger } from "../swagger/index.js";

const setupRoutes = (app) => {
    // Attach Swagger Documentation UI
    setupSwagger(app);

    // API Routes
    app.use("/api", router);

    // Global error handler
    app.use(errorHandler);
};

export default setupRoutes;

