import type { Request } from 'express';
import Collection from '../../Collections/Collection';
export default abstract class FormRequest {
    protected request: Request;
    constructor(request: Request);
    /**
     * Get params from route for the given key.
     */
    route(key: string, callback?: any): string | undefined;
    /**
     * Get collection of request attributes.
     */
    collect(): Collection<Record<string, any>>;
    /**
     * Get value from request.
     */
    get(key: string, callback?: any): any;
    /**
     * Get all attributes from request body and query.
     */
    all(keys?: string[]): Record<string, any>;
    /**
     * Get only given keys from request body and query.
     */
    only(keys?: string[]): Record<string, any>;
    /**
     * Get value from request body.
     */
    input(key: string, callback?: any): any;
    /**
     * Get value from query strings.
     */
    query(key: string, callback?: any): any;
    /**
     * Get value from request body and query as string.
     */
    string(key: string, callback?: string): string;
    /**
     * Get value from request body and query as string.
     */
    number(key: string, callback?: number): number;
    /**
     * Get value from request body and query as array.
     */
    array(key: string, callback?: number): any[];
    /**
     * Check if given key exists in request body or query parameters and has valid value.
     */
    filled(keys: string | string[]): boolean;
    /**
     * Check if given key exists in request body or query parameters.
     */
    exists(keys: string | string[]): boolean;
    /**
     * Get the real request instance.
     */
    getRequest(): Request;
}
//# sourceMappingURL=FormRequest.d.ts.map