import { router } from "../routes/index.js";
import { errorHandler } from "../middlewares/error-handler.js";

const setupRoutes = (app) => {
    // API Routes
    app.use("/api", router);

    // Global error handler
    app.use(errorHandler);
};

export default setupRoutes;

