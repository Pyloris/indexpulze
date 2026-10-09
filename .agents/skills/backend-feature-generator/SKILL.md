---
name: backend-feature-generator
description: Generate end-to-end backend features (Model, Router, Controller, Service, Swagger) following project architecture, filter engine, error handling, aggregation patterns, and OpenAPI documentation.
---

# Backend Feature Generator Skill

This guide outlines how to build an end-to-end backend feature for Express + Mongoose services. Follow these architectural patterns and code templates when implementing new entities or API endpoints.

---

## Architecture Overview

Every feature consists of 5 core layers:
1. **Model** (`database/models/<feature>.model.js`): Mongoose schema, field definitions, enums, sub-schemas, and indexes.
2. **Router** (`routes/v1/<feature>.routes.js`): Express router mounting endpoints.
3. **Controller** (`controllers/<feature>.controller.js`): Class with static handlers wrapped in `catchError`, handling dynamic query filter construction, sorting maps, pagination parsing, and `ApiResponse` formatting.
4. **Service** (`services/<feature>.service.js`): Business logic, MongoDB aggregations with `Model.find(filters).cast()`, parallel `Promise.all` count/lookup executions, and `ApiError` handling.
5. **Swagger** (`swagger/routes/<feature>.swagger.js` & `swagger/index.js`): OpenAPI/Swagger documentation annotations for endpoints, request bodies, schemas, and `setupSwagger(app)` hook in `setup/setup-routes.js`.

---

## 1. Model Layer (`database/models/<feature>.model.js`)

### Standards
- Export domain constants (enums, statuses, types).
- Use sub-schemas for nested structures with `{ _id: false }`.
- Include `orgId` (string, required) and `scanId` (ObjectId ref, required if applicable).
- Set `{ timestamps: true }`.
- Add compound indexes for frequent query, filter, and sorting paths.

### Code Template
```javascript
import mongoose from "mongoose";

const { Schema, model } = mongoose;

// Enums & Constants
export const FEATURE_TYPES = ["type1", "type2", "type3"];
export const FEATURE_STATUS = ["active", "inactive", "archived"];

// Nested Sub-schema
const featureProperties = new Schema({
    property_key: { type: String },
    is_active: { type: Boolean, default: true },
    status_code: { type: String }
}, { _id: false });

const schema = new Schema({
    orgId: { type: String, required: true },
    scanId: { type: Schema.Types.ObjectId, ref: 'scans', required: false },

    name: { type: String, required: true },
    type: { type: String, enum: FEATURE_TYPES, required: true },
    status: { type: String, enum: FEATURE_STATUS, default: "active" },
    value: { type: String, required: true },

    properties: { type: featureProperties, required: false },
    tags: { type: [String], default: [] }
}, { timestamps: true });

// Compound Indexes for Performance
schema.index({ orgId: 1, type: 1, createdAt: -1 });
schema.index({ orgId: 1, scanId: 1, createdAt: -1 });
schema.index({ orgId: 1, status: 1 });

export const Feature = model("features", schema);
```

---

## 2. Router Layer (`routes/v1/<feature>.routes.js`)

### Standards
- Use `express.Router()`.
- Return cleaner modular routes.

### Code Template
```javascript
import express from "express";
import { FeatureController } from "../../controllers/feature.controller.js";

const router = express.Router();

router
    .get("/",
        FeatureController.getFeatures
    )
    .get("/export",
        FeatureController.exportFeaturesToCSV
    )
    .get("/:featureId",
        FeatureController.getFeatureById
    )
    .post("/",
        FeatureController.createFeature
    );

export default router;
```

---

## 3. Controller Layer (`controllers/<feature>.controller.js`)

### Standards
1. **Error Capture**: Wrap all async controller functions with `catchError(async (req, res, next) => { ... })`.
2. **Auth Context**: Extract `orgId` from `req.authenticatedService`.
3. **Sort Field Mapping**: Use a static `mapSortByField` method to normalize frontend sort keys to database fields.
4. **Dynamic Filter Engine**:
   - Standard pagination: `page = parseInt(req.query.page) || 1`, `limit = parseInt(req.query.limit) || 10`.
   - Exclude reserved keys: `["page", "limit", "search", "type", "sortBy", "sortOrder", "unified_view"]`.
   - Comma-separated strings split to array `$in: value.split(',')`.
   - Boolean strings (`'true'`, `'false'`) converted to booleans `$in: [true, false]`.
   - Negated booleans (`certificate_is_expired`) inverted as needed.
   - ObjectId fields (`ruleId`, etc.) casted safely with `mongoose.Types.ObjectId.isValid`.
   - Multi-field regex search with `_.escapeRegExp(search.trim())` combined into `$or` array, merged into existing `$or` via `$and` if necessary.
5. **API Response**: Return `ApiResponse.success(res, { data, meta }, "Message")`.
6. **CSV Export**: Set headers `Content-Type: text/csv` and `Content-Disposition`, returning raw CSV text.

### Code Template
```javascript
import mongoose from "mongoose";
import _ from "lodash";
import { FeatureService } from "../services/feature.service.js";
import { catchError } from "../errors/catch-error.js";
import { ApiResponse } from "../utils/api-response.js";

export class FeatureController {

    static mapSortByField = (sortBy) => {
        const sortMap = {
            created_at: 'createdAt',
            updated_at: 'updatedAt'
        };
        return sortMap[sortBy] || sortBy;
    };

    static getFeatures = catchError(async (req, res, next) => {
        const { orgId } = req.authenticatedService;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { search, type, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

        const actualSortBy = FeatureController.mapSortByField(sortBy);
        const filters = {};

        // Type array filtering
        if (type && type !== 'all') {
            const types = type.split(',').map(t => t.trim());
            filters.type = { $in: types };
        }

        // Dynamic filters extraction
        for (const [key, value] of Object.entries(req.query)) {
            if (!["page", "limit", "search", "type", "sortBy", "sortOrder"].includes(key)) {
                
                // Boolean flags
                if (['is_active', 'externally_reachable'].includes(key)) {
                    if (typeof value === 'string') {
                        const booleanValues = value.split(',').map(v => v.trim().toLowerCase() === 'true');
                        if (booleanValues.length < 2) {
                            filters[key] = { $in: booleanValues };
                        }
                    }
                }
                // Mongo ObjectIds
                else if (key === 'relatedId') {
                    if (typeof value === 'string') {
                        const ids = value.split(',').map(id => id.trim());
                        const mongoIds = ids.map(id => mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null).filter(Boolean);
                        filters['related._id'] = { $in: [...ids, ...mongoIds] };
                    }
                }
                // Standard Comma-Separated Values
                else {
                    if (typeof value === 'string') {
                        filters[key] = { $in: value.split(',') };
                    }
                }
            }
        }

        // Multi-field Search Logic
        if (search) {
            let search_value = _.escapeRegExp(search.trim());
            const searchOr = [
                { name: { $regex: search_value, $options: "i" } },
                { value: { $regex: search_value, $options: "i" } }
            ];

            if (filters.$or) {
                filters.$and = [
                    { $or: filters.$or },
                    { $or: searchOr }
                ];
                delete filters.$or;
            } else {
                filters.$or = searchOr;
            }
        }

        const result = await FeatureService.getFeatures({
            orgId,
            filters,
            page,
            limit,
            sortBy: actualSortBy,
            sortOrder
        });

        return ApiResponse.success(res, { data: result.data, meta: result.meta }, "Features fetched successfully");
    });

    static getFeatureById = catchError(async (req, res, next) => {
        const { orgId } = req.authenticatedService;
        const { featureId } = req.params;

        const result = await FeatureService.getFeatureById({ featureId, orgId });

        return ApiResponse.success(res, { data: result.data }, "Feature details fetched successfully");
    });

    static createFeature = catchError(async (req, res, next) => {
        const { orgId } = req.authenticatedService;

        const feature = await FeatureService.createFeature({ orgId, data: req.body });

        return ApiResponse.created(res, { data: feature.data }, "Feature created successfully");
    });

    static exportFeaturesToCSV = catchError(async (req, res, next) => {
        const { orgId } = req.authenticatedService;
        const { type, search, ...otherFilters } = req.query;

        // Apply identical filter logic
        const filters = {};
        if (type && type !== 'all') {
            filters.type = { $in: type.split(',').map(t => t.trim()) };
        }

        for (const [key, value] of Object.entries(otherFilters)) {
            if (!["page", "limit", "sortBy", "sortOrder"].includes(key)) {
                if (typeof value === 'string') {
                    filters[key] = { $in: value.split(',') };
                }
            }
        }

        const result = await FeatureService.exportFeaturesToCSV({ orgId, filters });

        const filename = `features-export-${new Date().toISOString().split('T')[0]}.csv`;
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        return res.send(result.csv);
    });
}
```

---

## 4. Service Layer (`services/<feature>.service.js`)

### Standards
1. **Filter Casting for Aggregations**: Always run `const castedFilters = Feature.find(filters || {}).cast();` before passing `filters` into aggregate `$match` stages.
2. **Aggregation Pipelines**: Construct flexible `$match`, `$sort`, `$skip`, `$limit`, `$lookup`, and `$facet` stages.
3. **Parallel Querying**: Use `Promise.all([Model.aggregate(pipeline), Model.countDocuments(...)])` for paginated queries.
4. **Domain Exception Throwing**: Use `throw ApiError.notFound("Resource not found")` or `throw ApiError.badRequest(...)`.
5. **CSV Generation**: Build headers and row arrays formatted into string CSV.

### Code Template
```javascript
import { Feature } from "../database/models/feature.model.js";
import { ApiError } from "../errors/api-error.js";

export class FeatureService {

    static getFeatures = async ({ orgId, filters = {}, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' }) => {
        // Essential: cast filters to match Mongoose schema types in Aggregation
        const castedFilters = Feature.find(filters || {}).cast();

        const pipeline = [
            { $match: { orgId, ...castedFilters } },
            { $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 } },
            { $skip: (page - 1) * limit },
            { $limit: limit }
        ];

        // Execute aggregation and count in parallel
        const [features, total] = await Promise.all([
            Feature.aggregate(pipeline),
            Feature.countDocuments({ orgId, ...filters })
        ]);

        return {
            data: features,
            meta: {
                total,
                page,
                limit
            }
        };
    };

    static getFeatureById = async ({ featureId, orgId }) => {
        const feature = await Feature.findOne({ _id: featureId, orgId }).lean();

        if (!feature) {
            throw ApiError.notFound("Feature not found");
        }

        return { data: feature };
    };

    static createFeature = async ({ orgId, data }) => {
        const feature = await Feature.create({
            orgId,
            ...data
        });

        return { data: feature };
    };

    static exportFeaturesToCSV = async ({ orgId, filters = {} }) => {
        const castedFilters = Feature.find(filters || {}).cast();

        const features = await Feature.aggregate([
            { $match: { orgId, ...castedFilters } }
        ]);

        if (!features.length) {
            return { data: [], csv: '' };
        }

        const headers = ['ID', 'Name', 'Type', 'Status', 'Value', 'Created At'];
        const rows = features.map(item => [
            item._id.toString(),
            item.name || '',
            item.type || '',
            item.status || '',
            item.value || '',
            item.createdAt ? new Date(item.createdAt).toISOString() : ''
        ]);

        const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))].join('\n');

        return { data: features, csv };
    };
}
```

---

## 5. Swagger Layer (`swagger/routes/<feature>.swagger.js` & `swagger/index.js`)

### Standards
1. **Directory Structure**: Put route-level annotations in `swagger/routes/<feature>.swagger.js` matching route file structure.
2. **Swagger Setup**: Configure `swagger-jsdoc` and `swagger-ui-express` in `swagger/index.js`, declaring component schemas (`<Feature>`, `<FeatureRequest>`, `ErrorResponse`).
3. **Route Hook**: Call `setupSwagger(app)` inside `setup/setup-routes.js`.

### Swagger Route Template (`swagger/routes/<feature>.swagger.js`)
```javascript
/**
 * @swagger
 * tags:
 *   name: Features
 *   description: Feature management APIs
 */

/**
 * @swagger
 * /api/v1/features:
 *   get:
 *     summary: List features
 *     tags: [Features]
 *     parameters:
 *       - in: query
 *         name: search
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
 *         description: Features fetched successfully
 *   post:
 *     summary: Create feature
 *     tags: [Features]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FeatureRequest'
 *     responses:
 *       201:
 *         description: Feature created successfully
 */
export default {};
```

### Swagger Index Template (`swagger/index.js`)
```javascript
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { appConfig } from "../config/app-config.js";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Documentation",
            version: "1.0.0"
        },
        servers: [{ url: appConfig.BASE_URL }],
        components: {
            schemas: {
                Feature: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        name: { type: "string" },
                        status: { type: "string" },
                        createdAt: { type: "string", format: "date-time" }
                    }
                }
            }
        }
    },
    apis: ["./src/routes/v1/*.js", "./src/swagger/routes/*.js"]
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};
```

---

## Checklist for Implementing New Features

- [ ] **Model**: Export schema constants; define compound indexes; include `orgId` & `timestamps`.
- [ ] **Router**: Import and attach route handlers.
- [ ] **Controller**: Wrap all methods with `catchError`; handle `orgId`; extract dynamic query filters; convert search string via `_.escapeRegExp`; format output with `ApiResponse`.
- [ ] **Service**: Run `Model.find(filters).cast()` before aggregation; run `Promise.all` for aggregate + `countDocuments`; throw `ApiError`.
- [ ] **Swagger**: Create `swagger/routes/<feature>.swagger.js` OpenAPI docs; register schemas in `swagger/index.js`; call `setupSwagger(app)` in `setup-routes.js`.
