/**
 * @swagger
 * tags:
 *   name: Workflows
 *   description: Automation Workflow management and node definitions APIs
 */

/**
 * @swagger
 * /automations/api/v1/workflows/node-definitions:
 *   get:
 *     summary: Fetch node definitions configuration
 *     description: Returns available node types (context, model, action, event_source, tool) and their configuration schemas for React Flow builder.
 *     tags: [Workflows]
 *     responses:
 *       200:
 *         description: Node definitions fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: Node definitions fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     nodeTypes:
 *                       type: array
 *                       items:
 *                         type: object
 *
 * /automations/api/v1/workflows/schema/{resource}:
 *   get:
 *     summary: Fetch schema for a specific resource entity
 *     description: Returns the schema fields and operators for the specified resource (Vulnerability, Assessment, Asset, SLA, Business Unit).
 *     tags: [Workflows]
 *     parameters:
 *       - in: path
 *         name: resource
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the resource entity
 *     responses:
 *       200:
 *         description: Schema fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: Schema fetched successfully
 *                 data:
 *                   type: object
 *       400:
 *         description: Invalid resource entity
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /automations/api/v1/workflows:
 *   get:
 *     summary: List automation workflows
 *     description: Retrieves a paginated list of workflows with optional search and status filtering.
 *     tags: [Workflows]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search string matching workflow name or description
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Comma-separated status values (draft, active, inactive, archived)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: Field to sort by (createdAt, name, status)
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order direction
 *     responses:
 *       200:
 *         description: Workflows fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: Workflows fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Workflow'
 *                 meta:
 *                   $ref: '#/components/schemas/PaginationMeta'
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   post:
 *     summary: Create a new workflow
 *     description: Creates a new workflow record with nodes, edges, and optional raw React Flow payload.
 *     tags: [Workflows]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WorkflowRequest'
 *     responses:
 *       201:
 *         description: Workflow created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: Workflow created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Workflow'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /automations/api/v1/workflows/{workflowId}:
 *   get:
 *     summary: Get workflow details by ID
 *     tags: [Workflows]
 *     parameters:
 *       - in: path
 *         name: workflowId
 *         required: true
 *         schema:
 *           type: string
 *         description: 24-character hex MongoDB ObjectId of the workflow
 *     responses:
 *       200:
 *         description: Workflow details fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 1
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Workflow'
 *       404:
 *         description: Workflow not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   put:
 *     summary: Update an existing workflow
 *     tags: [Workflows]
 *     parameters:
 *       - in: path
 *         name: workflowId
 *         required: true
 *         schema:
 *           type: string
 *         description: 24-character hex MongoDB ObjectId of the workflow
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WorkflowRequest'
 *     responses:
 *       200:
 *         description: Workflow updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 1
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Workflow'
 *       404:
 *         description: Workflow not found
 *
 *   delete:
 *     summary: Delete a workflow by ID
 *     tags: [Workflows]
 *     parameters:
 *       - in: path
 *         name: workflowId
 *         required: true
 *         schema:
 *           type: string
 *         description: 24-character hex MongoDB ObjectId of the workflow
 *     responses:
 *       200:
 *         description: Workflow deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: Workflow deleted successfully
 *       404:
 *         description: Workflow not found
 *
 * /automations/api/v1/workflows/{workflowId}/execute:
 *   post:
 *     summary: Execute a workflow
 *     description: Creates a new pending workflow run for the specified workflow.
 *     tags: [Workflows]
 *     parameters:
 *       - in: path
 *         name: workflowId
 *         required: true
 *         schema:
 *           type: string
 *         description: 24-character hex MongoDB ObjectId of the workflow
 *     responses:
 *       200:
 *         description: Workflow execution scheduled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: Workflow execution scheduled successfully
 *                 data:
 *                   $ref: '#/components/schemas/WorkflowRun'
 *       404:
 *         description: Workflow not found
 */

export default {};
