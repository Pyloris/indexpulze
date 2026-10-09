/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard metrics APIs
 */

/**
 * @swagger
 * /api/v1/dashboard:
 *   get:
 *     summary: Get dashboard metrics
 *     description: Returns aggregated metrics for workflows, runs, models connected, and token usage
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Dashboard metrics fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     noOfWorkflows:
 *                       type: integer
 *                     totalRuns:
 *                       type: integer
 *                     modelsConnected:
 *                       type: integer
 *                     totalTokensUsed:
 *                       type: integer
 *                     tokenUsagePerModel:
 *                       type: array
 *                       items:
 *                         type: object
 *                     tokenUsageTrend:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           date:
 *                             type: string
 *                           tokens:
 *                             type: integer
 */
export default {};
