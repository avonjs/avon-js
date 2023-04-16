"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ErrorResponse_1 = tslib_1.__importDefault(require("../Http/Responses/ErrorResponse"));
const Exception_1 = tslib_1.__importDefault(require("./Exception"));
class ResponsableException extends Exception_1.default {
    /**
     * Create an HTTP response that represents the object.
     */
    toResponse(request) {
        return new ErrorResponse_1.default(this.getCode(), this.getName(), this.message, this);
    }
}
exports.default = ResponsableException;
