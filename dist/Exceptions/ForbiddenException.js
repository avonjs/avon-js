"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ResponsableException_1 = tslib_1.__importDefault(require("./ResponsableException"));
class ForbiddenException extends ResponsableException_1.default {
    constructor() {
        super(...arguments);
        this.message = 'This action is unauthorized.';
    }
    /**
     * Get the response code
     */
    getCode() {
        return 403;
    }
    /**
     * Get the exception name
     */
    getName() {
        return 'Forbidden';
    }
}
exports.default = ForbiddenException;
