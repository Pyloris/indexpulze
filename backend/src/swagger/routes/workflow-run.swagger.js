/**
 * @swagger
 * tags:
 *   name: WorkflowRuns
 *   description: Workflow Runs management APIs
 */

/**
 * @swagger
 * /automations/api/v1/workflow-runs:
 *   get:
 *     summary: List workflow runs
 *     tags: [WorkflowRuns]
 *     parameters:
 *       - in: query
 *         name: workflowId
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Workflow runs fetched successfully
 *
 * /automations/api/v1/workflow-runs/{runId}:
 *   get:
 *     summary: Get workflow run by ID
 *     tags: [WorkflowRuns]
 *     parameters:
 *       - in: path
 *         name: runId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Workflow run fetched successfully
 *       404:
 *         description: Workflow run not found
 *
 * /automations/api/v1/workflow-runs/{runId}/item-executions/{itemExecutionId}:
 *   get:
 *     summary: Get item execution by ID with its node executions
 *     tags: [WorkflowRuns]
 *     parameters:
 *       - in: path
 *         name: runId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: itemExecutionId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item execution fetched successfully
 *       404:
 *         description: Item execution not found
 *
 * /automations/api/v1/workflow-runs/{runId}/retry-failed:
 *   post:
 *     summary: Retry failed items in a workflow run
 *     tags: [WorkflowRuns]
 *     parameters:
 *       - in: path
 *         name: runId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Retry initiated successfully
 *       404:
 *         description: Workflow run not found
 *
 * /automations/api/v1/workflow-runs/{runId}/cancel:
 *   post:
 *     summary: Cancel a pending or running workflow run
 *     tags: [WorkflowRuns]
 *     parameters:
 *       - in: path
 *         name: runId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Workflow run cancelled successfully
 *       400:
 *         description: Cannot cancel workflow in its current status
 *       404:
 *         description: Workflow run not found
 */
export default {};
