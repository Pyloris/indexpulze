/**
 * @swagger
 * tags:
 *   name: Agents
 *   description: Prebuilt agents management APIs
 */

/**
 * @swagger
 * /api/v1/agents/library:
 *   get:
 *     summary: List all prebuilt agents
 *     description: Returns a list of all prebuilt agents available in the library
 *     tags: [Agents]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Prebuilt agents fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "generate-asset-descriptions"
 *                       name:
 *                         type: string
 *                         example: "Generation asset descriptions using AI in AIM"
 *                       description:
 *                         type: string
 *                         example: "Automatically generate and update asset descriptions using an AI model."
 *                       nodes:
 *                         type: array
 *                         items:
 *                           type: object
 *                       edges:
 *                         type: array
 *                         items:
 *                           type: object
 */

/**
 * @swagger
 * /api/v1/agents/library/{agentId}:
 *   get:
 *     summary: Get a prebuilt agent by ID
 *     description: Fetches the full configuration of a specific prebuilt agent from the library
 *     tags: [Agents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: agentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the prebuilt agent
 *     responses:
 *       200:
 *         description: Prebuilt agent fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *       404:
 *         description: Agent not found
 */

/**
 * @swagger
 * /api/v1/agents/import/{agentId}:
 *   post:
 *     summary: Import a prebuilt agent
 *     description: Imports a prebuilt agent from the library into the organization as a new workflow (status draft)
 *     tags: [Agents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: agentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the prebuilt agent to import
 *     responses:
 *       201:
 *         description: Agent imported successfully as a workflow
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Workflow'
 *       404:
 *         description: Agent not found in the library
 */
export default {};
