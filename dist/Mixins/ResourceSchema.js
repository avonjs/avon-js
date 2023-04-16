"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const helpers_1 = require("../helpers");
const pluralize_1 = require("pluralize");
const SoftDeletes_1 = require("./SoftDeletes");
const collect_js_1 = tslib_1.__importDefault(require("collect.js"));
const Filter_1 = tslib_1.__importDefault(require("../Filters/Filter"));
const Ordering_1 = tslib_1.__importDefault(require("../Orderings/Ordering"));
const FieldCollection_1 = tslib_1.__importDefault(require("../Collections/FieldCollection"));
exports.default = (Parent) => {
    /**
     * @see {@link Resource}
     */
    return class ResourceSchema extends Parent {
        constructor() {
            super(...arguments);
            /**
             * Indicates resource is available for `index` API.
             */
            this.availableForIndex = true;
            /**
             * Indicates resource is available for `detail` API.
             */
            this.availableForDetail = true;
            /**
             * Indicates resource is available for `create` API.
             */
            this.availableForCreation = true;
            /**
             * Indicates resource is available for `update` API.
             */
            this.availableForUpdate = true;
            /**
             * Indicates resource is available for `delete` API.
             */
            this.availableForDelete = true;
            /**
             * Indicates resource is available for `force delete` API.
             */
            this.availableForForceDelete = true;
            /**
             * Indicates resource is available for `restore` API.
             */
            this.availableForRestore = true;
        }
        /**
         * Get the Open API json schema.
         */
        schema(request) {
            const paths = this.apis(request);
            return {
                [paths.index]: {
                    ...this.resourceIndexSchema(request),
                    ...this.resourceStoreSchema(request),
                },
                [paths.detail]: {
                    ...this.resourceDetailSchema(request),
                    ...this.resourceUpdateSchema(request),
                    ...this.resourceDeleteSchema(request),
                },
                [paths.restore]: {
                    ...this.resourceRestoreSchema(request),
                },
                [paths.forceDelete]: {
                    ...this.resourceForceDeleteSchema(request),
                },
                ...this.actionsSchema(request),
                ...this.associationSchema(request),
            };
        }
        resourceIndexSchema(request) {
            if (this.availableForIndex) {
                return {
                    get: {
                        tags: [this.uriKey()],
                        description: `Get list of available ${this.label()}`,
                        operationId: `index`,
                        parameters: [
                            ...this.searchParameters(request),
                            ...this.paginationParameters(request),
                            ...this.softDeleteParameters(request),
                            ...this.filteringParameters(request),
                            ...this.orderingParameters(request),
                        ],
                        responses: {
                            ...this.authorizationResponses(),
                            ...this.errorsResponses(),
                            200: {
                                description: `Get list of available ${this.label()}`,
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                data: {
                                                    type: 'array',
                                                    items: {
                                                        type: 'object',
                                                        properties: {
                                                            athorization: {
                                                                type: 'object',
                                                                properties: {
                                                                    authorizedToView: {
                                                                        type: 'boolean',
                                                                        default: true,
                                                                        description: 'Determines user authorized to view the resource detail',
                                                                    },
                                                                    authorizedToUpdate: {
                                                                        type: 'boolean',
                                                                        default: true,
                                                                        description: 'Determines user authorized to update the resource',
                                                                    },
                                                                    authorizedToDelete: {
                                                                        type: 'boolean',
                                                                        default: true,
                                                                        description: 'Determines user authorized to delete the resource',
                                                                    },
                                                                    authorizedToForceDelete: {
                                                                        type: 'boolean',
                                                                        default: true,
                                                                        description: 'Determines user authorized to force-delete the resource',
                                                                    },
                                                                    authorizedToRestore: {
                                                                        type: 'boolean',
                                                                        default: true,
                                                                        description: 'Determines user authorized to restore the resource',
                                                                    },
                                                                },
                                                            },
                                                            fields: {
                                                                type: 'object',
                                                                properties: this.formatSchemas(request, this.availableFields(request)
                                                                    .filterForIndex(request, this.resource)
                                                                    .all()),
                                                            },
                                                        },
                                                    },
                                                },
                                                meta: {
                                                    type: 'object',
                                                    properties: {
                                                        count: {
                                                            type: 'integer',
                                                        },
                                                        page: {
                                                            type: 'integer',
                                                        },
                                                        perPage: {
                                                            type: 'integer',
                                                        },
                                                        perPageOptions: {
                                                            type: 'array',
                                                            uniqueItems: true,
                                                            items: {
                                                                type: 'integer',
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                };
            }
        }
        /**
         * Get the searching parameters for index schema.
         */
        searchParameters(request) {
            return [
                {
                    name: 'search',
                    in: 'query',
                    description: 'Enter value to search through records',
                    schema: {
                        type: 'string',
                        nullable: true,
                    },
                },
            ];
        }
        /**
         * Get pagination parameters for index schema.
         */
        paginationParameters(request) {
            return [
                {
                    name: 'page',
                    in: 'query',
                    description: 'The pagination page',
                    example: 1,
                    schema: {
                        type: 'integer',
                        minimum: 1,
                        nullable: true,
                    },
                },
                {
                    name: 'perPage',
                    in: 'query',
                    description: 'Number of items per page',
                    example: this.perPageOptions()[0],
                    schema: {
                        type: 'number',
                        nullable: true,
                        enum: this.perPageOptions(),
                    },
                },
            ];
        }
        /**
         * Get soft delete resource parameters for schema.
         */
        softDeleteParameters(request) {
            return this.softDeletes() === false
                ? []
                : [
                    {
                        name: 'trashed',
                        in: 'query',
                        description: 'Determine trashed items behavior',
                        example: SoftDeletes_1.TrashedStatus.DEFAULT,
                        schema: {
                            type: 'string',
                            nullable: false,
                            enum: [
                                SoftDeletes_1.TrashedStatus.WITH,
                                SoftDeletes_1.TrashedStatus.ONLY,
                                SoftDeletes_1.TrashedStatus.DEFAULT,
                            ],
                        },
                    },
                ];
        }
        /**
         * Get ordering parameters.
         */
        orderingParameters(request) {
            const orderings = (0, collect_js_1.default)(this.resolveOrderings(request));
            this.availableFieldsOnIndexOrDetail(request)
                .withOnlyOrderableFields()
                .each((field) => {
                const ordering = field.resolveOrdering(request);
                if (ordering instanceof Ordering_1.default) {
                    orderings.push(ordering);
                }
            });
            return orderings
                .unique((ordering) => ordering.key())
                .all()
                .flatMap((ordering) => ordering.serializeParameters(request));
        }
        /**
         * Get filtering parameters.
         */
        filteringParameters(request) {
            const filters = (0, collect_js_1.default)(this.resolveFilters(request));
            this.availableFieldsOnIndexOrDetail(request)
                .withOnlyFilterableFields()
                .each((field) => {
                const filter = field.resolveFilter(request);
                if (filter instanceof Filter_1.default) {
                    filters.push(filter);
                }
            });
            return filters
                .unique((filter) => filter.key())
                .all()
                .flatMap((filter) => filter.serializeParameters(request));
        }
        /**
         * Get resource store schema.
         */
        resourceStoreSchema(request) {
            if (this.availableForCreation) {
                const fields = (0, collect_js_1.default)(this.fieldsForCreate(request)).filter((field) => {
                    return field.isShownOnCreation(request) && field.fillable();
                });
                return {
                    post: {
                        tags: [this.uriKey()],
                        description: `Create new record for the given payload`,
                        operationId: `store`,
                        requestBody: {
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        required: fields
                                            .filter((field) => field.isRequiredForCreation(request))
                                            .map((field) => field.attribute)
                                            .all(),
                                        properties: fields
                                            .mapWithKeys((field) => {
                                            field.resolve(this.resource);
                                            return [field.attribute, field.schema(request)];
                                        })
                                            .all(),
                                    },
                                },
                            },
                        },
                        responses: {
                            ...this.authorizationResponses(),
                            ...this.errorsResponses(),
                            ...this.validationResponses(),
                            201: {
                                description: `Get detail of stored ${this.label()}`,
                                content: {
                                    ...this.singleResourceContent(request),
                                },
                            },
                        },
                    },
                };
            }
        }
        /**
         *
         */
        resourceDetailSchema(request) {
            if (this.availableForDelete) {
                return {
                    get: {
                        tags: [this.uriKey()],
                        description: `Get detail of resource by the given ${this.label()} key`,
                        operationId: `detail`,
                        parameters: [...this.singleResourcePathParamaeters(request)],
                        responses: {
                            ...this.authorizationResponses(),
                            ...this.errorsResponses(),
                            200: {
                                description: `Get detail of ${this.label()} for given id`,
                                content: {
                                    ...this.singleResourceContent(request),
                                },
                            },
                        },
                    },
                };
            }
        }
        /**
         *
         */
        resourceUpdateSchema(request) {
            if (this.availableForUpdate) {
                const fields = (0, collect_js_1.default)(this.fieldsForCreate(request)).filter((field) => field.isShownOnCreation(request));
                return {
                    put: {
                        tags: [this.uriKey()],
                        description: `Update resource by the given payload`,
                        operationId: `update`,
                        parameters: [...this.singleResourcePathParamaeters(request)],
                        requestBody: {
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        required: fields
                                            .filter((field) => field.isRequiredForCreation(request))
                                            .map((field) => field.attribute)
                                            .all(),
                                        properties: fields
                                            .mapWithKeys((field) => {
                                            field.resolve(this.resource);
                                            return [field.attribute, field.schema(request)];
                                        })
                                            .all(),
                                    },
                                },
                            },
                        },
                        responses: {
                            ...this.authorizationResponses(),
                            ...this.errorsResponses(),
                            ...this.validationResponses(),
                            200: {
                                description: `Get detail of updated ${this.label()}`,
                                content: {
                                    ...this.singleResourceContent(request),
                                },
                            },
                        },
                    },
                };
            }
        }
        /**
         *
         */
        resourceDeleteSchema(request) {
            if (this.availableForDelete) {
                return {
                    delete: {
                        tags: [this.uriKey()],
                        description: `Delete ${this.label()} by the given id`,
                        operationId: `delete`,
                        parameters: [...this.singleResourcePathParamaeters(request)],
                        responses: {
                            ...this.authorizationResponses(),
                            ...this.errorsResponses(),
                            204: { $ref: '#/components/responses/EmptyResponse' },
                        },
                    },
                };
            }
        }
        /**
         *
         */
        resourceForceDeleteSchema(request) {
            if (this.availableForForceDelete && Boolean(this.softDeletes())) {
                return {
                    delete: {
                        tags: [this.uriKey()],
                        description: `Delete ${this.label()} by the given id`,
                        operationId: `forceDelete`,
                        parameters: [...this.singleResourcePathParamaeters(request)],
                        responses: {
                            ...this.authorizationResponses(),
                            ...this.errorsResponses(),
                            204: { $ref: '#/components/responses/EmptyResponse' },
                        },
                    },
                };
            }
        }
        /**
         *
         */
        resourceRestoreSchema(request) {
            if (this.availableForRestore && Boolean(this.softDeletes())) {
                return {
                    put: {
                        tags: [this.uriKey()],
                        description: `Restore deleted ${this.label()} by id`,
                        operationId: `restore`,
                        parameters: [...this.singleResourcePathParamaeters(request)],
                        responses: {
                            ...this.authorizationResponses(),
                            ...this.errorsResponses(),
                            204: { $ref: '#/components/responses/EmptyResponse' },
                        },
                    },
                };
            }
        }
        /**
         * Get the Open API json schema for realtionship fields.
         */
        actionsSchema(request) {
            const actions = (0, collect_js_1.default)(this.resolveActions(request));
            const paths = this.apis(request);
            return actions
                .mapWithKeys((action) => {
                const fields = action.fields(request);
                return [
                    `${paths.index}/actions/${action.uriKey()}`,
                    {
                        post: {
                            tags: [this.uriKey()],
                            description: `Run the ${action.name()} on the given resources`,
                            operationId: `${this.uriKey()}-${action.uriKey()}`,
                            parameters: [
                                {
                                    name: 'resources',
                                    in: 'query',
                                    description: 'Enter record id you want to run action on it',
                                    required: !action.isStandalone(),
                                    style: 'deepObject',
                                    explode: true,
                                    schema: {
                                        type: 'array',
                                        items: {
                                            oneOf: [
                                                { type: 'number', nullable: false, minLength: 1 },
                                                { type: 'string', nullable: false },
                                            ],
                                        },
                                        nullable: false,
                                        minItems: action.isStandalone() ? 0 : 1,
                                    },
                                },
                            ],
                            requestBody: fields.length === 0
                                ? undefined
                                : {
                                    content: {
                                        'application/json': {
                                            schema: {
                                                type: 'object',
                                                required: fields.map((field) => field.attribute),
                                                properties: (0, collect_js_1.default)(fields)
                                                    .mapWithKeys((field) => {
                                                    field.resolve(this.resource);
                                                    return [
                                                        field.attribute,
                                                        field.schema(request),
                                                    ];
                                                })
                                                    .all(),
                                            },
                                        },
                                    },
                                },
                            responses: {
                                ...this.authorizationResponses(),
                                ...this.errorsResponses(),
                                200: {
                                    description: `Action ${action.name()} ran successfully`,
                                    content: {
                                        'application/json': {
                                            schema: action.schema(request),
                                        },
                                    },
                                },
                            },
                        },
                    },
                ];
            })
                .all();
        }
        /**
         * Get the Open API json schema for realtionship fields.
         */
        associationSchema(request) {
            const paths = this.apis(request);
            return this.availableFieldsOnForms(request)
                .withOnlyRelatableFields()
                .withoutUnfillableFields()
                .mapWithKeys((field) => {
                const relatable = field.relatedResource;
                return [
                    `${paths.index}/associatable/${field.attribute}`,
                    {
                        get: {
                            tags: [this.uriKey()],
                            description: `Get list of realted ${relatable.label()}`,
                            operationId: field.attribute,
                            parameters: [
                                ...relatable.searchParameters(request),
                                ...relatable.paginationParameters(request),
                                ...relatable.softDeleteParameters(request),
                            ],
                            responses: {
                                ...this.authorizationResponses(),
                                ...this.errorsResponses(),
                                200: {
                                    description: `Get list of realted ${relatable.label()}`,
                                    content: {
                                        'application/json': {
                                            schema: {
                                                type: 'object',
                                                properties: {
                                                    data: {
                                                        type: 'array',
                                                        items: {
                                                            type: 'object',
                                                            properties: relatable.formatSchemas(request, relatable
                                                                .availableFields(request)
                                                                .filterForIndex(request, relatable.resource)
                                                                .all()),
                                                        },
                                                    },
                                                    meta: {
                                                        type: 'object',
                                                        properties: {
                                                            count: {
                                                                type: 'integer',
                                                            },
                                                            page: {
                                                                type: 'integer',
                                                            },
                                                            perPage: {
                                                                type: 'integer',
                                                            },
                                                            perPageOptions: {
                                                                type: 'array',
                                                                uniqueItems: true,
                                                                items: {
                                                                    type: 'integer',
                                                                },
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                ];
            })
                .all();
        }
        /**
         * Get the single resource content schema.
         */
        singleResourceContent(request) {
            return {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            data: {
                                type: 'object',
                                properties: {
                                    athorization: {
                                        type: 'object',
                                        properties: {
                                            authorizedToUpdate: {
                                                type: 'boolean',
                                                default: true,
                                                description: 'Determines user authorized to update the resource',
                                            },
                                            authorizedToDelete: {
                                                type: 'boolean',
                                                default: true,
                                                description: 'Determines user authorized to delete the resource',
                                            },
                                            authorizedToForceDelete: {
                                                type: 'boolean',
                                                default: true,
                                                description: 'Determines user authorized to force-delete the resource',
                                            },
                                            authorizedToRestore: {
                                                type: 'boolean',
                                                default: true,
                                                description: 'Determines user authorized to restore the resource',
                                            },
                                        },
                                    },
                                    fields: {
                                        type: 'object',
                                        properties: this.formatSchemas(request, this.availableFields(request)
                                            .filterForDetail(request, this.resource)
                                            .all()),
                                    },
                                },
                            },
                            meta: {
                                type: 'object',
                            },
                        },
                    },
                },
            };
        }
        /**
         * Get the single resource path parameters.
         */
        singleResourcePathParamaeters(request) {
            return [
                {
                    name: 'resourceId',
                    in: 'path',
                    required: true,
                    description: 'The resource primary key',
                    example: 1,
                    schema: {
                        oneOf: [{ type: 'number' }, { type: 'string' }],
                    },
                },
            ];
        }
        /**
         * Get the API paths.
         */
        apis(request) {
            const basePath = request.getRequest().baseUrl;
            const resourcePath = `/${basePath}/resources/${String(this.uriKey())}`.replace(/\/{2,}/g, '/');
            return {
                index: resourcePath,
                detail: `${resourcePath}/{resourceId}`,
                restore: `${resourcePath}/{resourceId}/restore`,
                forceDelete: `${resourcePath}/{resourceId}/force`,
                action: `${resourcePath}/actions/{actionName}`,
                association: `${resourcePath}/associatable/{field}`,
            };
        }
        /**
         * Get the schema label.
         */
        label() {
            return (0, pluralize_1.plural)((0, helpers_1.slugify)(this.constructor.name, ' '));
        }
        /**
         * Format the given schema for responses.
         */
        formatSchemas(request, fields) {
            return new FieldCollection_1.default(fields)
                .mapWithKeys((field) => [field.attribute, field.schema(request)])
                .all();
        }
        /**
         * name
         */
        authorizationResponses() {
            return {
                // 401: {
                //   $ref: '#/components/responses/Unauthorized',
                // },
                403: {
                    $ref: '#/components/responses/Forbidden',
                },
            };
        }
        /**
         * name
         */
        errorsResponses() {
            return {
                404: {
                    $ref: '#/components/responses/NotFound',
                },
                500: {
                    $ref: '#/components/responses/InternalServerError',
                },
            };
        }
        /**
         * name
         */
        validationResponses() {
            return {
                // 400: {
                //   $ref: '#/components/responses/BadRequest',
                // },
                422: {
                    $ref: '#/components/responses/UnprocessableContent',
                },
            };
        }
    };
};
