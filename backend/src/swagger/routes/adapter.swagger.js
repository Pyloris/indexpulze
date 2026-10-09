/**
 * @swagger
 * tags:
 *   name: Adapters
 *   description: AI Provider Adapter management APIs
 */

/**
 * @swagger
 * /v1/adapters/supported:
 *   get:
 *     summary: List all supported adapters
 *     description: Returns a list of all adapters available to be installed, including configuration fields.
 *     tags: [Adapters]
 *     responses:
 *       200:
 *         description: Supported adapters fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     adapters:
 *                       type: array
 *                       items:
 *                         type: object
 */

/**
 * @swagger
 * /v1/adapters/installed:
 *   get:
 *     summary: List all installed adapters
 *     description: Returns a list of adapters currently installed by the organization.
 *     tags: [Adapters]
 *     responses:
 *       200:
 *         description: Installed adapters fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     adapters:
 *                       type: array
 *                       items:
 *                         type: object
 */

/**
 * @swagger
 * /v1/adapters/install/{adapterType}:
 *   post:
 *     summary: Install an adapter
 *     description: Verifies the provided configuration credentials against the AI provider and saves the config if valid.
 *     tags: [Adapters]
 *     parameters:
 *       - in: path
 *         name: adapterType
 *         required: true
 *         schema:
 *           type: string
 *         description: The type identifier of the adapter (e.g., openai, claude, gemini, deepseek)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               apiKey:
 *                 type: string
 *                 description: API key required for the adapter
 *     responses:
 *       201:
 *         description: Adapter installed successfully
 *       400:
 *         description: Invalid configuration provided
 */

/**
 * @swagger
 * /v1/adapters/{adapterType}:
 *   delete:
 *     summary: Uninstall an adapter
 *     description: Removes the adapter configuration from the organization.
 *     tags: [Adapters]
 *     parameters:
 *       - in: path
 *         name: adapterType
 *         required: true
 *         schema:
 *           type: string
 *         description: The type identifier of the adapter to uninstall (e.g., openai, claude, gemini, deepseek)
 *     responses:
 *       200:
 *         description: Adapter uninstalled successfully
 *       400:
 *         description: Adapter not found or failed to uninstall
 */

/**
 * @swagger
 * /v1/adapters/logs:
 *   get:
 *     summary: Get adapter logs
 *     description: Fetches paginated logs for all adapters or a specific adapter type within the organization.
 *     tags: [Adapters]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Optional type identifier of the adapter to filter logs for (e.g., openai, claude)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: The number of logs to fetch per page
 *     responses:
 *       200:
 *         description: Adapter logs fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 */
export default {};
