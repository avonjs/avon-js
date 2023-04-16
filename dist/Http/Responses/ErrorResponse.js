"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Response_1 = tslib_1.__importDefault(require("./Response"));
class ErrorResponse extends Response_1.default {
    constructor(code = 500, name, message, error) {
        super(code);
        this.code = code;
        this.name = name;
        this.message = message;
        this.error = error;
    }
    /**
     * Get content for response.
     */
    content() {
        return {
            code: this.code,
            message: this.message,
            name: this.name,
            meta: {
                ...this.meta,
                stack: this.error,
            },
        };
    }
}
exports.default = ErrorResponse;
