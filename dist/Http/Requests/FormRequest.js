"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Collection_1 = tslib_1.__importDefault(require("../../Collections/Collection"));
class FormRequest {
    constructor(request) {
        this.request = request;
    }
    /**
     * Get params from route for the given key.
     */
    route(key, callback) {
        return this.request.params[key] ?? callback;
    }
    /**
     * Get collection of request attributes.
     */
    collect() {
        return new Collection_1.default(this.request.query ?? {}).merge(this.request.body ?? {});
    }
    /**
     * Get value from request.
     */
    get(key, callback) {
        return this.collect().get(key, callback);
    }
    /**
     * Get all attributes from request body and query.
     */
    all(keys = []) {
        return keys.length > 0 ? this.only(keys) : this.collect().all();
    }
    /**
     * Get only given keys from request body and query.
     */
    only(keys = []) {
        return this.collect().only(keys).all();
    }
    /**
     * Get value from request body.
     */
    input(key, callback) {
        return new Collection_1.default(this.request?.body).get(key, callback);
    }
    /**
     * Get value from query strings.
     */
    query(key, callback) {
        return new Collection_1.default(this.request?.query).get(key, callback);
    }
    /**
     * Get value from request body and query as string.
     */
    string(key, callback) {
        return String(this.get(key, callback));
    }
    /**
     * Get value from request body and query as string.
     */
    number(key, callback) {
        return Number(this.get(key, callback));
    }
    /**
     * Get value from request body and query as array.
     */
    array(key, callback) {
        const value = this.get(key, callback);
        return Array.isArray(value) ? value : [value];
    }
    /**
     * Check if given key exists in request body or query parameters and has valid value.
     */
    filled(keys) {
        if (!this.exists(keys)) {
            return false;
        }
        const filled = this.only(Array.isArray(keys) ? keys : [keys]).filter((value) => ![null, undefined, '', [], {}].includes(value));
        return filled.length > 0;
    }
    /**
     * Check if given key exists in request body or query parameters.
     */
    exists(keys) {
        return this.collect().has(keys);
    }
    /**
     * Get the real request instance.
     */
    getRequest() {
        return this.request;
    }
}
exports.default = FormRequest;
