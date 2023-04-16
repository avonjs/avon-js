"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Response {
    constructor(code, data = {}, meta = {}) {
        this.code = code;
        this.data = data;
        this.meta = meta;
        /**
         * Indicates custom headers.
         */
        this.headers = {};
    }
    /**
     * Merge the given meta into the response meta.
     */
    withMeta(meta, value) {
        const mergeValues = typeof meta === 'string' ? { [meta]: value } : meta;
        this.meta = {
            ...mergeValues,
            ...this.meta,
        };
        return this;
    }
    /**
     * Get content for response.
     */
    content() {
        return {
            code: this.code,
            data: this.data,
            meta: this.meta,
        };
    }
    /**
     * Get response status code.
     */
    getStatusCode() {
        return this.code;
    }
    /**
     * Get the response headers.
     */
    getHeaders() {
        return this.headers;
    }
    /**
     * Append header value to response.
     */
    withHeader(key, value) {
        this.headers[key] = value;
        return this;
    }
}
exports.default = Response;
