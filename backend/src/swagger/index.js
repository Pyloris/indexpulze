import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { appConfig } from "../config/app-config.js";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Automation Service API",
            version: "1.0.0",
            description: "Automation Workflows Service API Documentation",
            contact: {
                name: "Snapsec",
                email: "support@snapsec.co"
            }
        },
        servers: [
            {
                url: appConfig.BASE_URL || "http://localhost:8080",
                description: "Automation Service Server"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                },
                apiKeyAuth: {
                    type: "apiKey",
                    in: "header",
                    name: "x-api-key"
                }
            },
            schemas: {
                ErrorResponse: {
                    type: "object",
                    properties: {
                        status: { type: "number", example: 0 },
                        message: { type: "string", example: "Error message details" },
                        data: { type: "object" }
                    }
                },
                PaginationMeta: {
                    type: "object",
                    properties: {
                        total: { type: "number", example: 42 },
                        page: { type: "number", example: 1 },
                        limit: { type: "number", example: 10 },
                        totalPages: { type: "number", example: 5 }
                    }
                },
                Workflow: {
                    type: "object",
                    properties: {
                        _id: { type: "string", example: "60d5ec49f83f2a1b88e1c6a2" },
                        orgId: { type: "string", example: "org_12345" },
                        createdBy: { type: "string", example: "user_67890" },
                        name: { type: "string", example: "New CVE Triage Agent" },
                        description: { type: "string", example: "Pulls CVEs and notifies Slack" },
                        status: { type: "string", enum: ["draft", "active", "inactive", "archived"], example: "draft" },
                        nodes: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: { type: "string", example: "n1" },
                                    type: { type: "string", example: "context" },
                                    position: {
                                        type: "object",
                                        properties: {
                                            x: { type: "number", example: 60 },
                                            y: { type: "number", example: 120 }
                                        }
                                    },
                                    data: { type: "object" }
                                }
                            }
                        },
                        edges: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: { type: "string", example: "e1" },
                                    source: { type: "string", example: "n1" },
                                    target: { type: "string", example: "n2" }
                                }
                            }
                        },
                        raw: { type: "object" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" }
                    }
                },
                WorkflowRequest: {
                    type: "object",
                    required: ["name"],
                    properties: {
                        name: { type: "string", example: "New CVE Triage Agent" },
                        description: { type: "string", example: "Automates CVE response" },
                        status: { type: "string", enum: ["draft", "active", "inactive", "archived"], default: "draft" },
                        nodes: {
                            type: "array",
                            items: { type: "object" }
                        },
                        edges: {
                            type: "array",
                            items: { type: "object" }
                        },
                        raw: { type: "object" }
                    }
                },
                WorkflowRun: {
                    type: "object",
                    properties: {
                        _id: { type: "string", example: "60d5ec49f83f2a1b88e1c6a2" },
                        orgId: { type: "string", example: "org_12345" },
                        workflowId: { type: "string", example: "60d5ec49f83f2a1b88e1c6a3" },
                        status: { type: "string", enum: ["pending", "running", "completed", "failed"], example: "pending" },
                        startedAt: { type: "string", format: "date-time" },
                        completedAt: { type: "string", format: "date-time" },
                        resultData: { type: "object" },
                        errorDetails: { type: "object" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" }
                    }
                }
            }
        },
        security: [
            { bearerAuth: [] },
            { apiKeyAuth: [] }
        ]
    },
    apis: [
        "./src/routes/v1/*.js",
        "./src/swagger/routes/*.js"
    ]
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app) => {
    app.use("/automations/api-docs", swaggerUi.serve, swaggerUi.setup(specs, {
        explorer: true,
        customCss: ".swagger-ui .topbar { display: none }",
        customSiteTitle: "Automation Service API Docs"
    }));

    // Serve raw swagger JSON endpoint
    app.get("/automations/api-docs.json", (req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.send(specs);
    });
};

export { specs };
