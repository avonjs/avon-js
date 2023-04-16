"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QueryParser {
    constructor(query, handlers) {
        this.query = query;
        this.handlers = handlers;
    }
    /**
     * Get pair of handlers and matched values.
     */
    matches() {
        return this.handlers
            .filter((handler) => {
            // validate filters
            const value = this.query[handler.key()];
            return value !== undefined && !handler.isValidNullValue(value);
        })
            .map((handler) => {
            const value = this.query[handler.key()];
            return {
                handler,
                value: handler.isValidNullValue(value) ? null : value,
            };
        });
    }
}
exports.default = QueryParser;
