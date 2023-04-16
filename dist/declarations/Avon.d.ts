import { type Collection } from 'collect.js';
import ActionEvent from './Resources/ActionEvent';
import { type OpenAPIV3 } from 'openapi-types';
import type { Router } from 'express';
import { type AvonRequest } from './Http/Requests';
import { type Resource } from '.';
export default class Avon {
    /**
     * Indicates application current version.
     */
    static VERSION: string;
    /**
     * Array of available resources.
     */
    static resourceInstances: Resource[];
    /**
     * Array of available resources.
     */
    static actionEventInstance: ActionEvent;
    /**
     * The error handler callback.
     */
    static errorHandler: (error: Error) => void;
    /**
     * Register array of new resources.
     */
    static resources(resources?: Resource[]): Avon;
    /**
     * Find resource for given uriKey.
     */
    static resourceForKey(key?: string): Resource | undefined;
    /**
     * Get collection of available resources.
     */
    static resourceCollection(): Collection<Resource>;
    /**
     * Register API routes.
     */
    static routes(router: Router): Router;
    /**
     * Get the log path for the action event storage.
     */
    static actionEventLogPath(): string;
    /**
     * Hanlde the given error.
     */
    static handleError(error: Error): Avon;
    /**
     * Hanlde the given error.
     */
    static handleErrorUsing(errorHandler: (error: Error) => void): Avon;
    /**
     * Get the schema for open API.
     */
    static schema(request: AvonRequest): OpenAPIV3.Document;
}
//# sourceMappingURL=Avon.d.ts.map