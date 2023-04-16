"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ResponsableException_1 = tslib_1.__importDefault(require("./ResponsableException"));
const collect_js_1 = require("collect.js");
const ErrorResponse_1 = tslib_1.__importDefault(require("../Http/Responses/ErrorResponse"));
class ValidationException extends ResponsableException_1.default {
    constructor(errors) {
        super('The given data was invalid.');
        this.errors = errors;
    }
    /**
     * Get the response code
     */
    getCode() {
        return 422;
    }
    /**
     * Get the exception name
     */
    getName() {
        return 'UnprocessableContent';
    }
    /**
     * Create an HTTP response that represents the object.
     */
    toResponse(request) {
        return new ErrorResponse_1.default(this.getCode(), this.getName(), this.message).withMeta('errors', (0, collect_js_1.collect)(this.errors.details)
            .mapWithKeys((error) => [
            error.path,
            error.message,
        ])
            .all());
    }
}
exports.default = ValidationException;
