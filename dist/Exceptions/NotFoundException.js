"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ResponsableException_1 = tslib_1.__importDefault(require("./ResponsableException"));
class NotFoundException extends ResponsableException_1.default {
    /**
     * Get the response code
     */
    getCode() {
        return 404;
    }
    /**
     * Get the exception name
     */
    getName() {
        return 'NotFound';
    }
}
exports.default = NotFoundException;
