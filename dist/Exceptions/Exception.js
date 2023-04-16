"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Exception extends Error {
    constructor(message, ...args) {
        super(message ?? 'Something went wrong.');
    }
    /**
     * Throw the Exception.
     */
    static throw(message, ...args) {
        throw new this(message, ...args);
    }
    /**
     * Generate an Exception if the given condition is satisfied.
     */
    static when(condition, message, ...args) {
        if (condition) {
            this.throw(message, ...args);
        }
    }
    /**
     * Generate an Exception if the given condition is not satisfied.
     */
    static unless(condition, message, ...args) {
        if (!condition) {
            this.throw(message, ...args);
        }
    }
}
exports.default = Exception;
