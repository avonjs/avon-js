"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const collect_js_1 = tslib_1.__importDefault(require("collect.js"));
const ActionEvent_1 = tslib_1.__importDefault(require("./Resources/ActionEvent"));
const RouteRegisterar_1 = tslib_1.__importDefault(require("./Route/RouteRegisterar"));
const process_1 = require("process");
const path_1 = tslib_1.__importDefault(require("path"));
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class Avon {
    /**
     * Register array of new resources.
     */
    static resources(resources = []) {
        this.resourceInstances = this.resourceInstances.concat(resources);
        return new Avon();
    }
    /**
     * Find resource for given uriKey.
     */
    static resourceForKey(key) {
        return this.resourceCollection().first((resource) => resource.uriKey() === key);
    }
    /**
     * Get collection of available resources.
     */
    static resourceCollection() {
        return (0, collect_js_1.default)(this.resourceInstances).push(this.actionEventInstance);
    }
    /**
     * Register API routes.
     */
    static routes(router) {
        const routes = new RouteRegisterar_1.default(router);
        routes.register();
        return router;
    }
    /**
     * Get the log path for the action event storage.
     */
    static actionEventLogPath() {
        return path_1.default.join((0, process_1.cwd)(), 'logs');
    }
    /**
     * Hanlde the given error.
     */
    static handleError(error) {
        this.errorHandler(error);
        return new Avon();
    }
    /**
     * Hanlde the given error.
     */
    static handleErrorUsing(errorHandler) {
        this.errorHandler = errorHandler;
        return new Avon();
    }
    /**
     * Get the schema for open API.
     */
    static schema(request) {
        return {
            openapi: '3.0.0',
            paths: this.resourceCollection().reduce((paths, resource) => {
                return {
                    ...paths,
                    ...resource.schema(request),
                };
            }, {}),
            info: {
                title: 'My Application API',
                // description: 'This is a sample server for a pet store.',
                // termsOfService: 'https://example.com/terms/',
                // contact: {
                //   name: 'API Support',
                //   url: 'https://www.example.com/support',
                //   email: 'support@example.com',
                // },
                // license: {},
                version: '1.0.1',
            },
            components: {
                responses: {
                    Forbidden: {
                        description: 'This action is unauthorized.',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        code: { type: 'number', default: 403 },
                                        message: {
                                            type: 'string',
                                            default: 'This action is unauthorized.',
                                        },
                                        name: { type: 'string', default: 'Forbidden' },
                                        meta: {
                                            type: 'object',
                                            properties: {
                                                stack: { type: 'object' },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    NotFound: {
                        description: 'Requested reource not found.',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        code: { type: 'number', default: 404 },
                                        message: {
                                            type: 'string',
                                            default: 'Requested reource not found.',
                                        },
                                        name: { type: 'string', default: 'NotFound' },
                                        meta: {
                                            type: 'object',
                                            properties: {
                                                stack: { type: 'object' },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    InternalServerError: {
                        description: 'Internal server error.',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        code: { type: 'number', default: 500 },
                                        message: {
                                            type: 'string',
                                            default: 'Something went wrong.',
                                        },
                                        name: { type: 'string', default: 'InternalServerError' },
                                        meta: {
                                            type: 'object',
                                            properties: {
                                                stack: { type: 'object' },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    UnprocessableContent: {
                        description: 'Validation failed.',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        code: { type: 'number', default: 422 },
                                        message: {
                                            type: 'string',
                                            default: 'The given data was invalid.',
                                        },
                                        name: { type: 'string', default: 'UnprocessableContent' },
                                        meta: {
                                            type: 'object',
                                            properties: {
                                                errors: { type: 'object' },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    EmptyResponse: {
                        description: 'Nothing to show',
                        content: {
                            'application/json': {},
                        },
                    },
                },
            },
        };
    }
}
exports.default = Avon;
/**
 * Indicates application current version.
 */
Avon.VERSION = '1.0.0';
/**
 * Array of available resources.
 */
Avon.resourceInstances = [];
/**
 * Array of available resources.
 */
Avon.actionEventInstance = new ActionEvent_1.default();
/**
 * The error handler callback.
 */
Avon.errorHandler = (error) => {
    console.log(error);
};
